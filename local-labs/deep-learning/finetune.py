"""Actual supervised PEFT fine-tuning over incident-group splits.

Requires an explicitly selected compatible pretrained encoder and download.
Never reports initialization as training; saves a held-out report after fitting.
"""
import os,sys,json,argparse,hashlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import torch
from transformers import AutoTokenizer,AutoModelForSequenceClassification
from peft import LoraConfig,TaskType,get_peft_model
from sklearn.model_selection import GroupShuffleSplit
from quality.data import incidents,CATEGORIES

def train(model_id,epochs,output):
 torch.manual_seed(42);torch.set_num_threads(2)
 tokenizer=AutoTokenizer.from_pretrained(model_id)
 base=AutoModelForSequenceClassification.from_pretrained(model_id,num_labels=5)
 model=get_peft_model(base,LoraConfig(task_type=TaskType.SEQ_CLS,r=4,lora_alpha=8,lora_dropout=.1,target_modules=os.environ.get('LORA_TARGETS','query,value').split(',')))
 rows=incidents();groups=[r['group'] for r in rows];tr,te=next(GroupShuffleSplit(test_size=.25,random_state=42).split(rows,groups=groups))
 assert {groups[i] for i in tr}.isdisjoint({groups[i] for i in te})
 batch=tokenizer([rows[i]['log'] for i in tr],padding=True,truncation=True,max_length=96,return_tensors='pt');labels=torch.tensor([CATEGORIES.index(rows[i]['category']) for i in tr])
 test=tokenizer([rows[i]['log'] for i in te],padding=True,truncation=True,max_length=96,return_tensors='pt');truth=torch.tensor([CATEGORIES.index(rows[i]['category']) for i in te])
 optimizer=torch.optim.AdamW((p for p in model.parameters() if p.requires_grad),lr=.003)
 losses=[]
 for epoch in range(epochs):
  model.train();order=torch.randperm(len(tr));epoch_loss=0
  for start in range(0,len(tr),16):
   ids=order[start:start+16];optimizer.zero_grad();inputs={k:v[ids] for k,v in batch.items()}
   loss=model(**inputs,labels=labels[ids]).loss;assert torch.isfinite(loss);loss.backward();optimizer.step();epoch_loss+=loss.item()
  losses.append(epoch_loss)
 model.eval()
 with torch.no_grad():pred=model(**test).logits.argmax(1);accuracy=(pred==truth).float().mean().item()
 path=Path(output);path.mkdir(parents=True,exist_ok=True);model.save_pretrained(path/'adapter');tokenizer.save_pretrained(path/'tokenizer')
 report={'stage':'fine-tuned-and-heldout-evaluated','base_model':model_id,'base_revision':getattr(base.config,'_commit_hash',None),'dataset_hash':hashlib.sha256(json.dumps(rows,sort_keys=True).encode()).hexdigest(),'classes':CATEGORIES,'dataset':'synthetic-ci-v1','epochs':epochs,'loss':losses,'heldout_accuracy':accuracy,'trainable_parameters':sum(p.numel() for p in model.parameters() if p.requires_grad),'total_parameters':sum(p.numel() for p in model.parameters()),'train_groups':sorted({groups[i] for i in tr}),'test_groups':sorted({groups[i] for i in te}),'limitations':'Synthetic fixture training only; no production quality or safety guarantee. Base model/license and revision must be recorded for a reproducible release.'}
 (path/'report.json').write_text(json.dumps(report,indent=2));return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--model',default=os.environ.get('FINETUNE_MODEL'));p.add_argument('--epochs',type=int,default=3);p.add_argument('--output',default='artifacts/finetune');a=p.parse_args()
 if not a.model or a.epochs<1:p.error('Explicit compatible --model and positive epochs required')
 print(json.dumps(train(a.model,a.epochs,a.output),indent=2))

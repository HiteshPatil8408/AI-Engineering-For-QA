"""Optional actual PEFT adapter setup. Downloads the explicitly chosen model."""
import os
from transformers import AutoTokenizer,AutoModelForSequenceClassification
from peft import LoraConfig,TaskType,get_peft_model
if __name__=='__main__':
 model_id=os.environ.get('FINETUNE_MODEL')
 if not model_id:raise SystemExit('Set FINETUNE_MODEL to a compatible public encoder checkpoint; review its license and download size.')
 tokenizer=AutoTokenizer.from_pretrained(model_id)
 base=AutoModelForSequenceClassification.from_pretrained(model_id,num_labels=5)
 # Target modules vary by architecture. Configure them rather than assuming an
 # encoder and decoder use the same projection names.
 targets=os.environ.get('LORA_TARGETS','query,value').split(',')
 model=get_peft_model(base,LoraConfig(task_type=TaskType.SEQ_CLS,r=4,lora_alpha=8,lora_dropout=.1,target_modules=targets))
 model.print_trainable_parameters()
 batch=tokenizer(['Synthetic database connection refused'],return_tensors='pt',truncation=True)
 assert model(**batch).logits.shape==(1,5)
 model.save_pretrained('artifacts/lora-initialized')
 print('Initialized adapter and checked its forward contract; this script has not fine-tuned it. Use the training/evaluation pipeline before claiming a trained adapter.')

"""Actual CPU-friendly PyTorch training; explicit optional dependency."""
import sys,json,argparse
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import torch
from torch import nn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import GroupShuffleSplit
from quality.data import incidents,CATEGORIES

def train(output,epochs=30):
 torch.manual_seed(42);rows=incidents();groups=[r['group'] for r in rows]
 tr,te=next(GroupShuffleSplit(test_size=.25,random_state=42).split(rows,groups=groups))
 assert {groups[i] for i in tr}.isdisjoint({groups[i] for i in te})
 vectorizer=TfidfVectorizer(max_features=128);xtr=vectorizer.fit_transform([rows[i]['log'] for i in tr]).toarray();xte=vectorizer.transform([rows[i]['log'] for i in te]).toarray()
 x=torch.tensor(xtr,dtype=torch.float32);y=torch.tensor([CATEGORIES.index(rows[i]['category']) for i in tr]);test=torch.tensor(xte,dtype=torch.float32);truth=torch.tensor([CATEGORIES.index(rows[i]['category']) for i in te])
 model=nn.Sequential(nn.Linear(x.shape[1],32),nn.ReLU(),nn.Dropout(.1),nn.Linear(32,len(CATEGORIES)))
 optimizer=torch.optim.Adam(model.parameters(),lr=.02,weight_decay=.001);loss_fn=nn.CrossEntropyLoss();history=[]
 for epoch in range(epochs):
  model.train();optimizer.zero_grad();loss=loss_fn(model(x),y);assert torch.isfinite(loss);loss.backward();optimizer.step();history.append(loss.item())
 model.eval()
 with torch.no_grad():accuracy=(model(test).argmax(1)==truth).float().mean().item()
 out=Path(output);out.mkdir(parents=True,exist_ok=True);torch.save(model.state_dict(),out/'weights.pt');(out/'report.json').write_text(json.dumps({'mode':'trained-synthetic-pytorch','classes':CATEGORIES,'loss':history,'heldout_accuracy':accuracy,'epochs':epochs,'limitation':'Synthetic pattern learning is not real-world accuracy.'},indent=2))
 return accuracy
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--output',default='artifacts/deep-learning');p.add_argument('--epochs',type=int,default=30);a=p.parse_args();print(train(a.output,a.epochs))

"""Train/evaluate a real scikit-learn pipeline with incident-group holdout."""
import sys,json,argparse,pickle
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from quality.data import incidents
from sklearn.model_selection import GroupShuffleSplit,StratifiedGroupKFold,cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report,confusion_matrix
import numpy as np

def train(output):
 rows=incidents();x=np.array([r['log'] for r in rows]);y=np.array([r['category'] for r in rows]);groups=np.array([r['group'] for r in rows])
 tr,te=next(GroupShuffleSplit(n_splits=1,test_size=.25,random_state=42).split(x,y,groups))
 assert set(groups[tr]).isdisjoint(groups[te])
 model=Pipeline([('tfidf',TfidfVectorizer(ngram_range=(1,2))),('classifier',LogisticRegression(max_iter=300,class_weight='balanced',random_state=42))])
 cv=StratifiedGroupKFold(n_splits=3,shuffle=True,random_state=42)
 scores=cross_val_score(model,x[tr],y[tr],groups=groups[tr],cv=cv,scoring='f1_macro')
 model.fit(x[tr],y[tr]);pred=model.predict(x[te]);report={'mode':'trained-synthetic-tfidf','dataset':'synthetic-ci-v1','cv_macro_f1':scores.tolist(),'heldout':classification_report(y[te],pred,output_dict=True,zero_division=0),'confusion_matrix':confusion_matrix(y[te],pred,labels=model.classes_).tolist(),'classes':model.classes_.tolist(),'train_groups':sorted(set(groups[tr])),'test_groups':sorted(set(groups[te])),'limitations':'Synthetic repeated patterns demonstrate training mechanics; results do not estimate real production accuracy.'}
 path=Path(output);path.mkdir(parents=True,exist_ok=True);(path/'model.pkl').write_bytes(pickle.dumps(model));(path/'report.json').write_text(json.dumps(report,indent=2))
 # Only load your own trusted local artifact; pickle is not safe for untrusted models.
 restored=pickle.loads((path/'model.pkl').read_bytes());assert np.array_equal(restored.predict(x[te]),pred)
 return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--output',default='artifacts/ml');a=p.parse_args();print(json.dumps(train(a.output)['heldout']['macro avg']))

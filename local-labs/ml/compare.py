"""Real classifier/regressor/clustering comparisons over the same fixture split."""
import sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import numpy as np
from sklearn.model_selection import GroupShuffleSplit
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression,LinearRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier,GradientBoostingClassifier,IsolationForest
from sklearn.cluster import KMeans
from sklearn.metrics import f1_score,mean_absolute_error,mean_squared_error,r2_score,adjusted_rand_score
from quality.data import incidents
rows=incidents();groups=[r['group'] for r in rows];train,test=next(GroupShuffleSplit(test_size=.25,random_state=42).split(rows,groups=groups))
x=[r['log'] for r in rows];y=np.array([r['category'] for r in rows]);vectorizer=TfidfVectorizer();a=vectorizer.fit_transform([x[i] for i in train]).toarray();b=vectorizer.transform([x[i] for i in test]).toarray()
models={'logistic':LogisticRegression(max_iter=300,random_state=42),'knn':KNeighborsClassifier(3),'tree':DecisionTreeClassifier(max_depth=5,random_state=42),'forest':RandomForestClassifier(n_estimators=50,random_state=42),'boosting':GradientBoostingClassifier(n_estimators=30,random_state=42)}
report={}
for name,model in models.items():model.fit(a,y[train]);report[name]={'macro_f1':f1_score(y[test],model.predict(b),average='macro')}
# A declared synthetic regression target, separate from failure classification.
features=np.array([[len(r['log']),i%17] for i,r in enumerate(rows,1)],dtype=float);durations=np.array([r['duration_ms'] for r in rows]);reg=LinearRegression().fit(features[train],durations[train]);pred=reg.predict(features[test])
report['linear_duration']={'mae':mean_absolute_error(durations[test],pred),'mse':mean_squared_error(durations[test],pred),'rmse':mean_squared_error(durations[test],pred)**.5,'r2':r2_score(durations[test],pred),'limitation':'Target has a deliberately linear synthetic feature; not a production timing prediction.'}
clusters=KMeans(n_clusters=5,n_init=10,random_state=42).fit_predict(a);report['clustering']={'adjusted_rand_vs_fixture_labels':adjusted_rand_score(y[train],clusters),'limitation':'Gold labels used only for post-hoc comparison; clusters do not establish causes.'}
anomaly=IsolationForest(random_state=42,contamination=.05).fit(features[train]);report['anomaly']={'flagged_test_indices':test[anomaly.predict(features[test])==-1].tolist(),'limitation':'Flags unusual features for review, not confirmed defects.'}
Path('artifacts/ml').mkdir(parents=True,exist_ok=True);Path('artifacts/ml/comparison.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))

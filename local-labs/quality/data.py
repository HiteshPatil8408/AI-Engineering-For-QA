"""Deterministic, explicitly synthetic fixtures with independent incident groups."""
from pathlib import Path
import json,os
ROOT=Path(__file__).resolve().parents[2]
DATA=Path(os.environ.get('CI_DATASET_DIR',str(ROOT/'datasets')))
CATEGORIES=('PRODUCT_DEFECT','AUTOMATION_DEFECT','ENVIRONMENT','TEST_DATA','UNKNOWN')
PATTERNS={
 'PRODUCT_DEFECT':['AssertionError payment total differs from expected amount','HTTP 500 application checkout violates inventory invariant','Order API returns duplicate transaction for same key'],
 'AUTOMATION_DEFECT':['NoSuchElement stale locator after page markup change','Assertion helper compares wrong field in test script','Test fixture race accesses page before awaited navigation'],
 'ENVIRONMENT':['Connection refused database dependency unavailable','DNS resolution failed for synthetic staging host','Runner disk full while starting service container'],
 'TEST_DATA':['Invalid seeded account missing required profile','Expired synthetic token in test data fixture','Duplicate fixture key violates data uniqueness'],
 'UNKNOWN':['Unhandled failure with no supporting log','Conflicting observations require incident review','Trace truncated before cause is recorded']}
def incidents():
 return [dict(id=f'F{i:03}',group=f'incident-{i//5}',tenant='alpha' if i%5 else 'beta',module=['auth','payment','catalog'][i%3],category=category,log=f'{text}; synthetic run {i}; build {i//5}',duration_ms=100+i%17*23) for i,(category,text) in enumerate(( (c,t) for n in range(12) for c,ts in PATTERNS.items() for t in ts),1)]
def documents():
 docs=[]
 for path in sorted((DATA/'support-docs').glob('*.md')):
  docs.append({'id':path.stem,'tenant':'alpha','version':'1','text':path.read_text(),'deleted':False})
 docs.extend([
 {'id':'retry','tenant':'alpha','version':'1','text':'Retry HTTP 429 and transient 5xx with jitter and a total deadline. Do not retry 401 authentication errors.','deleted':False},
 {'id':'locators','tenant':'alpha','version':'1','text':'Use unique accessible roles or stable test IDs. Await navigation before resolving a locator. Never accept ambiguous selectors.','deleted':False},
 {'id':'beta-secret','tenant':'beta','version':'1','text':'SYNTHETIC_BETA_CANARY payment troubleshooting belongs only to beta.','deleted':False},
 {'id':'deleted-doc','tenant':'alpha','version':'0','text':'Obsolete payment retry unlimited attempts','deleted':True}])
 return docs
def export():
 (DATA/'ci-incidents.json').write_text(json.dumps({'version':'synthetic-ci-v1','records':incidents()},indent=2))
 (DATA/'support-corpus.json').write_text(json.dumps(documents(),indent=2))
if __name__=='__main__':export()

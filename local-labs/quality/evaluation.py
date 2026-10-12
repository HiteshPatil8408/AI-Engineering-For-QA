"""Deterministic hard-gate runner with complete case coverage and escaped HTML."""
from pathlib import Path
import json,html,time
from .retrieval import sparse,metrics,answer
from .policy import run
from .graphql_cases import CASES,execute
CASES_DEFAULT=[
 {'id':'retrieval-retry','kind':'retrieval','query':'retry HTTP 429 deadline','relevant':['retry'],'tenant':'alpha','min_recall':1},
 {'id':'tenant-canary','kind':'security','query':'SYNTHETIC_BETA_CANARY','tenant':'alpha','forbidden':'SYNTHETIC_BETA_CANARY'},
 {'id':'unknown-abstain','kind':'abstention','query':'zzzzunsupported123','tenant':'alpha'},
 {'id':'write-denied','kind':'agent','plan':[{'tool':'apply_patch','args':{'path':'test.py'}}],'status':'denied'},
 {'id':'loop-stopped','kind':'agent','plan':[{'tool':'search_history'},{'tool':'search_history'}],'status':'stopped'},
 {'id':'draft-complete','kind':'agent','plan':[{'tool':'read_failure','args':{'id':'F001'}},{'tool':'propose_patch'}],'status':'complete'}]
def evaluate(cases=None):
 cases=CASES_DEFAULT if cases is None else cases
 ids=[c['id'] for c in cases]
 if len(ids)!=len(set(ids)):raise ValueError('Duplicate case IDs')
 results=[]
 for c in cases:
  start=time.perf_counter()
  try:
   if c['kind']=='retrieval':
    retrieved=sparse(c['query'],c['tenant']);score=metrics([d['id'] for d in retrieved],c['relevant']);passed=score['recall']>=c['min_recall'];detail=score
   elif c['kind']=='security':
    detail=answer(c['query'],c['tenant']);passed=c['forbidden'] not in json.dumps(detail)
   elif c['kind']=='abstention':detail=answer(c['query'],c['tenant']);passed=detail['status']=='abstained'
   elif c['kind']=='agent':detail=run(c['plan']);passed=detail['status']==c['status']
   else:raise ValueError('Unknown scorer kind')
   results.append({'id':c['id'],'passed':bool(passed),'detail':detail,'latency_ms':1000*(time.perf_counter()-start)})
  except Exception as e:results.append({'id':c['id'],'passed':False,'error':type(e).__name__+': '+str(e),'latency_ms':1000*(time.perf_counter()-start)})
 results.extend(execute(c) for c in CASES)
 return {'dataset':'synthetic-ci-v1','mode':'deterministic-fixture','prompt':'triage-v1','index':'docs-v1','expected_cases':len(cases)+len(CASES),'passed':len(results)==len(cases)+len(CASES) and bool(results) and all(r['passed'] for r in results),'results':results}
def compare(candidate,baseline):
 a={r['id']:r for r in candidate['results']};b={r['id']:r for r in baseline['results']}
 if candidate['dataset']!=baseline['dataset'] or set(a)!=set(b):raise ValueError('Incompatible baseline dataset/cases')
 return {'regressions':[i for i in a if b[i]['passed'] and not a[i]['passed']],'improvements':[i for i in a if not b[i]['passed'] and a[i]['passed']]}
def write_report(report,output):
 path=Path(output);path.mkdir(parents=True,exist_ok=True)
 (path/'results.json').write_text(json.dumps(report,indent=2))
 rows=''.join('<tr><td>'+html.escape(r['id'])+'</td><td>'+str(r['passed'])+'</td><td><pre>'+html.escape(json.dumps(r,indent=2))+'</pre></td></tr>' for r in report['results'])
 (path/'report.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>AI quality evaluation</title><h1>Deterministic fixture release report</h1><p>Dataset '+html.escape(report['dataset'])+'; passed: '+str(report['passed'])+'</p><table><thead><tr><th>Case</th><th>Passed</th><th>Evidence</th></tr></thead><tbody>'+rows+'</tbody></table></html>')

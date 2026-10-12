import json
import pytest
from quality.data import incidents,documents
from quality.retrieval import sparse,answer,cosine,rrf
from quality.policy import run,allowed,action_hash
from quality.provider import validate_decision
from quality.graphql_cases import CASES,execute,candidates,export_pytest
from quality.evaluation import evaluate,write_report,compare

def test_dataset():
 rows=incidents();assert len(rows)==180;assert len({r['id'] for r in rows})==180
 assert len({r['category'] for r in rows})==5

def test_retrieval_isolation_and_deletion():
 assert all(d['tenant']=='alpha' and not d['deleted'] for d in sparse('payment',k=100))
 assert 'SYNTHETIC_BETA_CANARY' not in json.dumps(answer('SYNTHETIC_BETA_CANARY','alpha'))
 assert answer('zzzzunsupported123')['status']=='abstained'
 assert sparse('retry HTTP 429')[0]['id']=='retry'

def test_geometry():
 assert cosine([1,0],[0,1])==0;assert cosine([0,0],[1,2])==0
 with pytest.raises(ValueError):cosine([1],[1,2])
 a=[{'id':'A'},{'id':'B'}];b=[{'id':'B'},{'id':'C'}];assert rrf([a,b])[0]['id']=='B'

def test_policy_loop_and_approval():
 assert run([{'tool':'apply_patch'}])['status']=='denied'
 assert run([{'tool':'read_failure','args':{'id':'F005'}}])['trace'][0]['result'] is None
 assert run([{'tool':'search_history'},{'tool':'search_history'}])['status']=='stopped'
 action={'tool':'apply_patch','args':{'path':'synthetic.py'}}
 approval={'status':'approved','hash':action_hash(action),'expires':20}
 assert allowed('apply_patch',action,approval,10)
 assert not allowed('apply_patch',{**action,'args':{'path':'other.py'}},approval,10)
 assert not allowed('apply_patch',action,approval,20)

@pytest.mark.parametrize('case',CASES,ids=lambda c:c['id'])
def test_graphql_candidates(case):assert execute(case)['passed']

def test_generated_tests_execute(tmp_path):
 ns={};exec(export_pytest(),ns)
 for c in CASES:ns['test_candidate'](c)
 with pytest.raises(ValueError):candidates('{ missing }')

def test_evidence_validation():
 base={'category':'UNKNOWN','evidence_ids':[],'needs_review':True,'explanation':'insufficient'}
 assert validate_decision(base,set()).needs_review
 with pytest.raises(ValueError):validate_decision({**base,'needs_review':False},set())
 with pytest.raises(ValueError):validate_decision({**base,'category':'PRODUCT_DEFECT'},set())
 with pytest.raises(ValueError):validate_decision({**base,'evidence_ids':['other']},{'F1'})

def test_evaluation_artifacts(tmp_path):
 r=evaluate();assert r['passed'];assert len(r['results'])==r['expected_cases']
 r['results'][0]['detail']={'text':'<script>unsafe</script>'};write_report(r,tmp_path)
 html=(tmp_path/'report.html').read_text();assert '<script>' not in html;assert '&lt;script&gt;' in html
 bad=evaluate([{'id':'crash','kind':'unknown'}]);assert not bad['passed']
 with pytest.raises(ValueError):compare(bad,r)
 with pytest.raises(ValueError):evaluate([{'id':'x','kind':'unknown'},{'id':'x','kind':'unknown'}])

def test_live_adapter_contract_without_network(monkeypatch):
 import asyncio
 from types import SimpleNamespace
 import openai
 from quality.provider import live_classify
 seen={}
 class Responses:
  async def parse(self,**kwargs):
   seen.update(kwargs)
   return SimpleNamespace(status='completed',output_parsed=validate_decision({'category':'UNKNOWN','evidence_ids':[],'needs_review':True,'explanation':'Insufficient evidence'},set()),usage=None)
 class Client:
  def __init__(self,**kwargs):seen['client']=kwargs;self.responses=Responses()
  async def close(self):seen['closed']=True
 monkeypatch.setenv('OPENAI_API_KEY','synthetic-key');monkeypatch.setenv('OPENAI_MODEL','configured-test-model');monkeypatch.setattr(openai,'AsyncOpenAI',Client)
 result=asyncio.run(live_classify('untrusted synthetic log',[]))
 assert result['mode']=='live-openai' and result['decision']['needs_review']
 assert seen['model']=='configured-test-model' and seen['closed']
 assert 'synthetic-key' not in json.dumps(result)

@pytest.mark.parametrize('operation,variables',[
 ('{ item(id:"I2") { id quantity } }',{}),
 ('mutation { createItem(quantity: 2, role: VIEWER) { quantity role } }',{}),
 ('mutation Make($q:Int!, $role:Role!) { createItem(quantity:$q,role:$role) { id quantity } }',{'q':3,'role':'EDITOR'}),
])
def test_candidates_derive_from_input_ast(operation,variables):
 result=candidates(operation,variables)
 assert all(execute(c)['passed'] for c in result['cases'])
 assert result['operation']==operation
 if operation.startswith('{'):assert all('createItem' not in c['query'] for c in result['cases'])

def test_exported_operation_specific_suite():
 result=candidates('{ item(id:"I2") { id quantity } }')
 namespace={};exec(result['pytest_source'],namespace)
 assert namespace['CASES']==result['cases']
 for c in namespace['CASES']:namespace['test_candidate'](c)

def test_conversation_scope_ambiguity_expiry_and_capacity():
 from quality.chat import Conversations
 store=Conversations(ttl=10,max_sessions=2)
 assert store.turn('alpha','u','s','What about that?',now=0)['status']=='clarification'
 assert store.turn('alpha','u','s','retry HTTP 429',now=1)['citations']
 assert 'retry HTTP 429' in store.turn('alpha','u','s','Explain that',now=2)['resolved_query']
 assert store.turn('beta','u','s','Explain that',now=2)['status']=='clarification'
 with pytest.raises(RuntimeError):store.turn('alpha','other','s','retry',now=2)
 assert store.turn('alpha','u','s','Explain that',now=20)['status']=='clarification'
 store.delete('alpha','u','s');assert ('alpha','u','s') not in store.sessions

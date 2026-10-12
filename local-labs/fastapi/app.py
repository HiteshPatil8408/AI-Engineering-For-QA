"""Shared AI-quality API. Fixture mode is explicit; live mode needs server secrets."""
import os,sys,uuid,time,json,asyncio
from pathlib import Path
from enum import Enum
from fastapi.responses import StreamingResponse
from fastapi import FastAPI,Depends,Header,HTTPException
from pydantic import BaseModel,Field,ConfigDict
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from quality.data import incidents,CATEGORIES
from quality.retrieval import answer,sparse
from quality.graphql_cases import candidates
from quality.evaluation import evaluate
from quality.provider import live_classify
from quality.chat import Conversations
conversations=Conversations()
app=FastAPI(title='Synthetic AI Quality Platform',version='1.0')
class Strict(BaseModel):model_config=ConfigDict(extra='forbid')
class Principal(Strict):tenant:str;user:str='fixture-user';mode:str='fixture'
def principal(authorization:str|None=Header(default=None)):
 secret=os.environ.get('LAB_API_TOKEN')
 if secret:
  if authorization!='Bearer '+secret:raise HTTPException(401,'Authentication required')
  return Principal(tenant='alpha',mode='authenticated')
 if authorization in (None,'Bearer fixture-alpha'):return Principal(tenant='alpha')
 if authorization=='Bearer fixture-beta':return Principal(tenant='beta')
 raise HTTPException(401,'Unknown fixture identity')
class FailureInput(Strict):
 log:str=Field(min_length=1,max_length=10000)
 failure_id:str|None=None
 mode:str='fixture'
class FailureOutput(Strict):
 category:str
 baseline:bool
 evidence_ids:list[str]
 needs_review:bool
 explanation:str
 mode:str
class Query(Strict):query:str=Field(min_length=1,max_length=4000)
class ChatInput(Query):session_id:str|None=Field(default=None,max_length=80)
class Generate(Strict):
 operation:str=Field(min_length=1,max_length=10000)
 variables:dict=Field(default_factory=dict)
class Evaluate(Strict):suite:str='default'
@app.get('/health')
def health():return {'status':'ok'}
@app.get('/ready')
def ready():return {'status':'ready','mode':'fixture-default','dataset':'synthetic-ci-v1'}
@app.post('/classify-failure',response_model=FailureOutput)
async def classify(body:FailureInput,p:Principal=Depends(principal)):
 evidence=[]
 if body.failure_id:
  row=next((r for r in incidents() if r['id']==body.failure_id and r['tenant']==p.tenant),None)
  if not row:raise HTTPException(404,'Failure not found')
  evidence=[row['id']]
  body=body.model_copy(update={'log':row['log']})
 if body.mode=='live':
  if not os.environ.get('LAB_API_TOKEN'):raise HTTPException(503,'Live mode requires authenticated service configuration')
  try:
   result=await live_classify(body.log,evidence)
   return FailureOutput(**result['decision'],baseline=False,mode=result['mode'])
  except Exception:raise HTTPException(503,'Live classification unavailable or invalid')
 if body.mode!='fixture':raise HTTPException(422,'Unsupported mode')
 text=body.log.lower();category='UNKNOWN'
 for label,words in [('ENVIRONMENT',['connection refused','dns','disk full']),('AUTOMATION_DEFECT',['locator','test fixture race','test script']),('TEST_DATA',['seeded account','expired synthetic token','fixture key']),('PRODUCT_DEFECT',['assertion','http 500','duplicate transaction'])]:
  if any(w in text for w in words):category=label;break
 # Free-form logs have no external source record; label the result as a baseline
 # candidate, requiring review rather than claiming evidence-backed certainty.
 return FailureOutput(category=category,baseline=True,evidence_ids=evidence,needs_review=category=='UNKNOWN' or not evidence,explanation='Keyword baseline candidate; verify against authorized incident evidence.',mode='keyword-baseline')
@app.post('/search-failures')
def search(body:Query,p:Principal=Depends(principal)):
 words=body.query.lower().split();records=[r for r in incidents() if r['tenant']==p.tenant]
 ranked=sorted(records,key=lambda r:sum(w in r['log'].lower() for w in words),reverse=True)
 return {'mode':'lexical-failure-baseline','results':[r for r in ranked if any(w in r['log'].lower() for w in words)][:5]}
@app.post('/chat')
def chat(body:ChatInput,p:Principal=Depends(principal)):
 if body.session_id is None:return answer(body.query,p.tenant)
 try:return conversations.turn(p.tenant,p.user,body.session_id,body.query)
 except ValueError:raise HTTPException(422,'Invalid session identity')
 except RuntimeError:raise HTTPException(429,'Conversation capacity reached')
@app.post('/chat/stream')
def chat_stream(body:ChatInput,p:Principal=Depends(principal)):
 result=chat(body,p)
 async def events():
  text=result.get('answer') or ''
  for start in range(0,len(text),80):
   yield 'event: delta\ndata: '+json.dumps({'text':text[start:start+80],'provisional':True})+'\n\n'
   await asyncio.sleep(0)
  yield 'event: done\ndata: '+json.dumps(result)+'\n\n'
 return StreamingResponse(events(),media_type='text/event-stream')
@app.post('/generate-tests')
def generate(body:Generate,p:Principal=Depends(principal)):
 try:return candidates(body.operation,body.variables)
 except Exception:raise HTTPException(422,'Invalid GraphQL operation')
@app.post('/evaluate')
def evaluation(body:Evaluate,p:Principal=Depends(principal)):
 if body.suite!='default':raise HTTPException(422,'Unknown suite')
 return evaluate()
@app.middleware('http')
async def timing(request,call_next):
 start=time.perf_counter();response=await call_next(request)
 response.headers['X-Request-ID']=str(uuid.uuid4());response.headers['Server-Timing']=f'total;dur={1000*(time.perf_counter()-start):.2f}'
 return response

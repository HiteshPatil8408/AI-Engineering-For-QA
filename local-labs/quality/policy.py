"""No model text can broaden these deterministic tool permissions."""
import hashlib,json,time
READS={'read_failure','search_history','inspect_dom','propose_patch'}
def action_hash(action):return hashlib.sha256(json.dumps(action,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def allowed(tool,action,approval=None,now=None):
 if tool in READS:return True
 if tool!='apply_patch' or not approval:return False
 return approval.get('status')=='approved' and approval.get('hash')==action_hash(action) and approval.get('expires',0)>(time.time() if now is None else now)
def run(plan,tenant='alpha',limit=4,approval=None):
 from .data import incidents
 state={'status':'running','trace':[],'draft':None};seen=set()
 for action in plan:
  sig=action_hash(action)
  if len(state['trace'])>=limit or sig in seen:state['status']='stopped';break
  seen.add(sig);tool=action.get('tool');permit=allowed(tool,action,approval)
  event={'step':len(state['trace'])+1,'tool':tool,'args':action.get('args',{}),'authorized':permit}
  if not permit:event['error']='denied';state['status']='denied'
  elif tool=='read_failure':
   item=next((f for f in incidents() if f['id']==action.get('args',{}).get('id') and f['tenant']==tenant),None)
   event['result']=item;event['error']=None if item else 'not_found'
  elif tool=='search_history':event['result']=[f['id'] for f in incidents() if f['tenant']==tenant][:3]
  elif tool=='inspect_dom':event['result']={'candidate':'getByRole("button", {name:"Submit"})','matches':1,'fixture':True}
  elif tool=='propose_patch':state['draft']={'status':'draft','text':'Review the awaited navigation before resolving the fixture locator.'};event['result']=state['draft']
  elif tool=='apply_patch':event['result']={'status':'approved-simulation','effects':0} # no repository writes in fixture lab
  state['trace'].append(event)
  if not permit:break
 if state['status']=='running':state['status']='complete' if state['draft'] else 'incomplete'
 return state

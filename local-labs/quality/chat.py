"""Bounded, scoped fixture conversation state with explicit ambiguity handling."""
import time,threading,re
from .retrieval import answer
class Conversations:
 def __init__(self,ttl=1800,max_sessions=100):self.ttl=ttl;self.max_sessions=max_sessions;self.sessions={};self.lock=threading.RLock()
 def turn(self,tenant,user,session,query,now=None):
  if not re.fullmatch(r'[A-Za-z0-9_-]{1,80}',session):raise ValueError('Invalid session identity')
  now=time.time() if now is None else now;key=(tenant,user,session)
  with self.lock:
   self.sessions={k:v for k,v in self.sessions.items() if now-v['updated']<self.ttl}
   previous=self.sessions.get(key)
   if previous is None and len(self.sessions)>=self.max_sessions:raise RuntimeError('Conversation capacity reached')
   state=previous or {'messages':[],'subject_query':None,'updated':now}
   followup=bool(re.search(r'\b(that|it|those|same)\b',query.lower()))
   if followup and not state['subject_query']:
    result={'status':'clarification','answer':'Which failure or documentation topic do you mean?','citations':[],'mode':'stateful-extractive-fixture'}
    resolved=query
   else:
    # Explicit fixture policy: ambiguous pronoun turns reuse the last user topic,
    # not an earlier assistant claim. Retrieval rechecks current tenant scope.
    resolved=(state['subject_query']+' '+query) if followup else query
    result={**answer(resolved,tenant),'mode':'stateful-extractive-fixture'}
    if result['status']=='answered':state['subject_query']=resolved
   state['messages']=(state['messages']+[{'role':'user','text':query},{'role':'assistant','text':result['answer'],'evidence_ids':result['citations']}])[-12:]
   state['updated']=now;self.sessions[key]=state
   return {**result,'session_id':session,'resolved_query':resolved,'turn_count':len(state['messages'])//2}
 def delete(self,tenant,user,session):
  with self.lock:self.sessions.pop((tenant,user,session),None)

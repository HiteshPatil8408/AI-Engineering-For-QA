"""Inspectable sparse, exact dense and hybrid retrieval; real encoder optional."""
import re,math
from collections import Counter
from .data import documents
TOKEN=re.compile(r'[a-z0-9_]+')
def terms(text):return TOKEN.findall(text.lower())
def cosine(a,b):
 if len(a)!=len(b):raise ValueError('embedding dimensions differ')
 norm=math.sqrt(sum(x*x for x in a)*sum(y*y for y in b))
 return sum(x*y for x,y in zip(a,b))/norm if norm else 0.0
def eligible(corpus,tenant):return [d for d in corpus if d['tenant']==tenant and not d.get('deleted')]
def sparse(query,tenant='alpha',k=3,corpus=None):
 docs=eligible(documents() if corpus is None else corpus,tenant);qt=terms(query)
 counts=[Counter(terms(d['text'])) for d in docs];avg=sum(sum(c.values()) for c in counts)/max(1,len(counts))
 result=[]
 for doc,tf in zip(docs,counts):
  size=sum(tf.values());score=0
  for t in qt:
   df=sum(t in c for c in counts);idf=math.log(1+(len(docs)-df+.5)/(df+.5))
   f=tf[t];score+=idf*f*2.2/(f+1.2*(.25+.75*size/max(avg,1))) if f else 0
  if score:result.append({**doc,'score':score})
 return sorted(result,key=lambda d:(-d['score'],d['id']))[:max(0,k)]
def rrf(lists,c=60):
 scores={};lookup={}
 for ranked in lists:
  seen=set()
  for rank,d in enumerate(ranked,1):
   if d['id'] in seen:continue
   seen.add(d['id']);lookup[d['id']]=d;scores[d['id']]=scores.get(d['id'],0)+1/(c+rank)
 return [{**lookup[i],'score':v} for i,v in sorted(scores.items(),key=lambda x:(-x[1],x[0]))]
def dense(query,encoder,tenant='alpha',k=3,corpus=None):
 docs=eligible(documents() if corpus is None else corpus,tenant)
 if not docs:return []
 vectors=encoder.encode([query]+[d['text'] for d in docs],normalize_embeddings=True)
 ranked=[{**d,'score':cosine(vectors[0],v)} for d,v in zip(docs,vectors[1:])]
 return sorted(ranked,key=lambda d:(-d['score'],d['id']))[:k]
def answer(query,tenant='alpha'):
 context=sparse(query,tenant)
 if not context:return {'status':'abstained','answer':None,'citations':[],'mode':'extractive-baseline'}
 return {'status':'answered','answer':'\n'.join(d['text'] for d in context),'citations':[d['id'] for d in context],'mode':'extractive-baseline'}
def metrics(ranked,relevant,k=3):
 hits=len(set(ranked[:k])&set(relevant))
 return {'precision':hits/k,'recall':hits/len(set(relevant)) if relevant else 0,'mrr':next((1/i for i,d in enumerate(ranked[:k],1) if d in relevant),0)}

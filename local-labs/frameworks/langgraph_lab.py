"""A real graph with conditional review routing, not a renamed loop."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from typing import TypedDict
from langgraph.graph import StateGraph,START,END
from langgraph.checkpoint.memory import InMemorySaver
from quality.data import incidents
class State(TypedDict):
 failure_id:str
 evidence:list[str]
 status:str
 draft:str

def read(s):
 row=next((r for r in incidents() if r['id']==s['failure_id'] and r['tenant']=='alpha'),None)
 return {'evidence':[row['id']] if row else []}
def draft(s):return {'status':'draft','draft':'Review incident '+s['evidence'][0]+'; verify the cause before any write.'}
def review(s):return {'status':'review','draft':'Insufficient authorized evidence.'}
def build():
 g=StateGraph(State);g.add_node('read',read);g.add_node('draft',draft);g.add_node('review',review)
 g.add_edge(START,'read');g.add_conditional_edges('read',lambda s:'draft' if s['evidence'] else 'review');g.add_edge('draft',END);g.add_edge('review',END)
 return g.compile(checkpointer=InMemorySaver())
if __name__=='__main__':
 app=build();result=app.invoke({'failure_id':'F001','evidence':[],'status':'new','draft':''},{'configurable':{'thread_id':'alpha:user:fixture-1'}});assert result['status']=='draft';print(result)

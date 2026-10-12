"""Build linked interview practice from the authored mechanisms and worked cases.
Existing stable IDs are retained. Each new question identifies its rubric and
source lesson so answers can be checked in the complete teaching context.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
lessons=json.loads((ROOT/'src/course/complete-lessons.json').read_text())
for l in lessons:l['interviewIds']=[]
phases=json.loads((ROOT/'src/course/phases.json').read_text())
old=json.loads((ROOT/'src/interview/questions.json').read_text())
old=[q for q in old if not q['id'].startswith('bridge-')]
CATEGORIES=[('Python',30,[0,1]),('SQL',30,[4]),('Statistics',20,[5]),('ML fundamentals',30,[6]),('Deep Learning',20,[7]),('Transformers / LLM',40,[8,9,10]),('Prompt Engineering',25,[11,12]),('Embeddings / Vector DB',35,[2,13,14]),('RAG',50,[15,16,17,43]),('Agents',50,[18,19,21,22,44]),('MCP',20,[20]),('AI Evaluation',50,[23,24,25]),('AI Testing',50,[3,28,29,41,42]),('AI Security',30,[26,27]),('FastAPI',25,[30]),('Production',30,[31,32,33,34,35,36,37,38,39]),('AI System Design',30,[40,45])]
angles=[
('Beginner',0,'Explain {topic} to an SDET using the {title} example. What contract is different from a conventional exact-output test?'),
('Beginner',1,'Walk through the worked mechanism for {topic}. Name the input, output and one boundary condition.'),
('Beginner',2,'A colleague claims the happy path is enough for {topic}. Which counterexample in {title} disproves that claim?'),
('Intermediate',1,'Implement {topic} in the shared CI quality platform. Where should validation occur, and what evidence must be retained?'),
('Intermediate',2,'Debug a release that passes the normal case but fails {topic} under malformed, missing or conflicting evidence. Which layer owns the fix?'),
('Intermediate',3,'Design an evaluation for {topic}: separate deterministic invariants from quality metrics and state a release threshold.'),
('Advanced',3,'Defend the architecture for {topic} under latency, tenant isolation and rollback constraints. What simpler baseline would you compare?'),
('Staff',2,'Review a proposal to deploy {topic} because its average score improved. Which failure slices and hard invariants could still block release?')]
questions=list(old)
for category,minimum,ps in CATEGORIES:
 anchors=[l for l in lessons if l['phase'] in ps and not l.get('isPhaseCheckpoint')]
 need=minimum-sum(q['category']==category for q in questions)
 for i in range(max(0,need)):
  anchor=anchors[i%len(anchors)];level,section,template=angles[(i//len(anchors))%8]
  topics=phases[anchor['phase']]['topics'] or [anchor['title']]
  topic=topics[(i//(len(anchors)*8))%len(topics)] if i>=len(anchors)*8 else anchor['title'].split(':')[0]
  parts=anchor['sections'];part=parts[min(section,len(parts)-1)]
  angle=(i//len(anchors))%8
  sec=lambda n: parts[min(n,len(parts)-1)]['paragraphs']
  if angle==0: answer='\n\n'.join(sec(0))+'\n\nSDET application: '+anchor['relevance']
  elif angle==1: answer='\n\n'.join(sec(1))+'\n\nWorked mechanism:\n'+next((s['code'] for s in parts if s.get('code')),anchor['exercise'].get('answer',''))
  elif angle==2: answer=sec(2)[0]+'\n\nCounterexample: '+anchor['mistake']+'\n\nExpected decision: '+anchor['quiz']['explanation']
  elif angle==3: answer='\n\n'.join(sec(1))+'\n\nImplementation and boundary checks:\n'+(anchor['exercise'].get('solution') or anchor['exercise'].get('answer') or anchor['exercise']['explanation'])+'\n'+anchor['exercise'].get('tests','')
  elif angle==4: answer='\n\n'.join(sec(2))+'\n\nReproduction contract: '+anchor['exercise']['prompt']+'\n\nValidated approach: '+anchor['exercise']['explanation']
  elif angle==5: answer='\n\n'.join(sec(3))+'\n\nRelease rationale: '+anchor['quiz']['explanation']+'\n\nRequired evidence: '+anchor['takeaway']
  elif angle==6: answer=sec(0)[-1]+'\n\n'+sec(1)[0]+'\n\n'+sec(3)[-1]+'\n\nArchitecture boundary: '+anchor['relevance']
  else: answer=sec(2)[0]+'\n\n'+sec(3)[-1]+'\n\nReview decision: '+anchor['checkpoint']['explanation']+'\n\n'+anchor['takeaway']
  question=template.format(topic=topic,title=anchor['title'])
  # If a narrow phase needs more than eight views, bind the new question to an
  # explicit protocol/contract topic, retaining its encompassing source lesson.
  qid=f"bridge-{category.lower().replace(' ','-').replace('/','')}-{i+1:03}"
  questions.append(dict(id=qid,category=category,difficulty=level,question=question,testing=f"Understanding of {topic}, implementation boundaries, and release evidence",hint=part['paragraphs'][0].split('. ')[0]+'.',answer=answer,why=anchor['relevance'],weak=f"A weak answer gives only a definition of {topic} and omits the documented counterexample, evidence contract or responsible boundary.",followups=[f"Which behavior check in {anchor['title']} would fail first?",f"How would you retain evidence for a regression involving {topic}?",'What changes if the same task is ambiguous or crosses a tenant boundary?'],example=next((s['code'] for s in anchor['sections'] if s.get('code')),anchor['exercise'].get('solution') or anchor['exercise'].get('answer') or anchor['sections'][-1]['paragraphs'][0]),lesson=anchor['id'],phase=anchor['phase'],sourceReviewed=anchor['reviewed']))
# Eight bridge questions for every phase, including capstones; reuse matching
# bank entries when possible and create linked questions only where necessary.
for phase in phases:
 ls=[l for l in lessons if l['phase']==phase['id'] and not l.get('isPhaseCheckpoint')];a=ls[-1]
 matches=[q for q in questions if q.get('phase')==phase['id'] or q.get('lesson') in [l['id'] for l in ls]]
 for j,(level,section,template) in enumerate(angles):
  found=next((q for q in matches if q['difficulty']==level and q['id'] not in a.get('interviewIds',[])),None)
  if not found:
   part=a['sections'][min(section,len(a['sections'])-1)]
   found=dict(id=f"bridge-phase-{phase['id']:02}-{j}",category=next((c for c,n,ps in CATEGORIES if phase['id'] in ps),'AI System Design'),difficulty=level,question=template.format(topic=a['title'].split(':')[0],title=a['title']),testing=a['title'],hint=part['paragraphs'][0].split('. ')[0]+'.',answer='\n\n'.join(part['paragraphs'])+'\n\n'+a['takeaway']+'\n\n'+(['Contract: '+a['relevance'],'Mechanism: '+a['exercise']['explanation'],'Counterexample: '+a['mistake'],'Implementation task: '+a['exercise']['prompt'],'Diagnostic decision: '+a['quiz']['explanation'],'Evaluation: '+a['checkpoint']['explanation'],'Architecture: '+a['sections'][0]['paragraphs'][-1],'Release evidence: '+a['sections'][-1]['paragraphs'][-1]][j]),why=a['relevance'],weak='A weak answer repeats the mechanism without addressing the documented failure and evidence needed for a decision.',followups=['Show the counterexample.','Which boundary owns enforcement?','What evidence would block release?'],example=next((s['code'] for s in a['sections'] if s.get('code')),a['exercise'].get('solution') or a['exercise'].get('answer') or a['sections'][-1]['paragraphs'][0]),lesson=a['id'],phase=phase['id'])
   questions.append(found);matches.append(found)
  for l in [x for x in lessons if x['phase']==phase['id']]:l.setdefault('interviewIds',[]).append(found['id'])
(ROOT/'src/interview/questions.json').write_text(json.dumps(questions,indent=2))
(ROOT/'src/course/complete-lessons.json').write_text(json.dumps(lessons,indent=2))
for p in phases:(ROOT/f"src/course/phases/{p['id']:02}.json").write_text(json.dumps([l for l in lessons if l['phase']==p['id']],indent=2))
print(len(questions),'linked interview questions')

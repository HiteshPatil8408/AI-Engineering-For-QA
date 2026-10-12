"""Compile original, reviewed teaching records into stable typed lesson artifacts.

Authored records provide concept, implementation, diagnosis, evidence and exercise
separately. Compilation supplies IDs and layout, never fabricates explanations.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
BASE=json.loads((ROOT/'src/course/lessons.json').read_text())
PHASES=json.loads((ROOT/'src/course/phases.json').read_text())
# Keep the original source IDs stable while displaying conventional acronyms.
for phase in PHASES:
 for old,new in [('Sdet','SDET'),('Ai','AI'),('Nlp','NLP'),('Llm','LLM'),('Sql','SQL'),('Rag','RAG'),('Mcp','MCP'),('Fastapi','FastAPI'),('Github','GitHub'),('Ci/Cd','CI/CD'),('Mlops / Llmops','MLOps / LLMOps')]:phase['title']=phase['title'].replace(old,new)
ALL=list(BASE)
SOURCES={
 0:['https://docs.python.org/3/tutorial/','https://www.nist.gov/itl/ai-risk-management-framework'],
 1:['https://docs.python.org/3/tutorial/','https://docs.pytest.org/en/stable/','https://docs.pydantic.dev/latest/'],
 2:['https://numpy.org/doc/stable/user/absolute_beginners.html','https://numpy.org/doc/stable/user/basics.broadcasting.html'],
 3:['https://pandas.pydata.org/docs/user_guide/','https://pandas.pydata.org/docs/user_guide/merging.html'],
 4:['https://duckdb.org/docs/stable/sql/query_syntax/select.html','https://duckdb.org/docs/stable/sql/functions/window_functions.html'],
 5:['https://www.itl.nist.gov/div898/handbook/','https://docs.python.org/3/library/statistics.html'],
 6:['https://scikit-learn.org/stable/user_guide.html','https://scikit-learn.org/stable/common_pitfalls.html'],
 7:['https://docs.pytorch.org/tutorials/beginner/basics/intro.html','https://docs.pytorch.org/docs/stable/nn.html'],
 8:['https://arxiv.org/abs/1706.03762','https://huggingface.co/docs/transformers/index'],
 9:['https://huggingface.co/docs/transformers/generation_strategies','https://developers.openai.com/api/docs/guides/text'],
 10:['https://developers.openai.com/api/docs/guides/error-codes','https://www.python-httpx.org/advanced/timeouts/','https://developers.openai.com/api/docs/guides/structured-outputs'],
 11:['https://developers.openai.com/api/docs/guides/prompt-engineering','https://developers.openai.com/api/docs/guides/evaluation-best-practices'],
 12:['https://developers.openai.com/api/docs/guides/function-calling','https://developers.openai.com/api/docs/guides/structured-outputs','https://docs.pydantic.dev/latest/'],
 13:['https://sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html','https://numpy.org/doc/stable/reference/generated/numpy.dot.html'],
 14:['https://qdrant.tech/documentation/concepts/search/','https://qdrant.tech/documentation/concepts/indexing/'],
 15:['https://developers.llamaindex.ai/python/framework/','https://qdrant.tech/documentation/concepts/search/'],
 16:['https://qdrant.tech/documentation/concepts/hybrid-queries/','https://sbert.net/examples/cross_encoder/applications/README.html'],
 17:['https://docs.ragas.io/en/stable/','https://deepeval.com/docs/getting-started'],
 18:['https://docs.langchain.com/oss/python/langchain/overview','https://docs.langchain.com/oss/python/langgraph/overview'],
 19:['https://docs.langchain.com/oss/python/langchain/overview','https://docs.langchain.com/oss/python/langgraph/overview','https://developers.llamaindex.ai/python/framework/'],
 20:['https://modelcontextprotocol.io/docs/learn/architecture','https://github.com/modelcontextprotocol/python-sdk','https://modelcontextprotocol.io/specification/2026-07-28'],
 21:['https://docs.langchain.com/oss/python/langgraph/overview','https://docs.langchain.com/oss/python/langchain/multi-agent'],
 22:['https://docs.langchain.com/oss/python/langgraph/overview','https://developers.openai.com/api/docs/guides/conversation-state'],
 23:['https://deepeval.com/docs/getting-started','https://mlflow.org/docs/latest/genai/'],
 24:['https://docs.langchain.com/langsmith/evaluation','https://mlflow.org/docs/latest/genai/'],
 25:['https://docs.ragas.io/en/stable/','https://deepeval.com/docs/getting-started','https://mlflow.org/docs/latest/genai/'],
 26:['https://genai.owasp.org/llm-top-10/','https://genai.owasp.org/llmrisk/llm01-prompt-injection/'],
 27:['https://genai.owasp.org/llm-top-10/','https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'],
 28:['https://playwright.dev/docs/test-assertions','https://graphql.org/learn/validation/'],
 29:['https://playwright.dev/docs/test-assertions','https://docs.pytest.org/en/stable/'],
 30:['https://fastapi.tiangolo.com/tutorial/','https://docs.pydantic.dev/latest/'],
 31:['https://opentelemetry.io/docs/languages/python/instrumentation/','https://www.python-httpx.org/advanced/timeouts/'],
 32:['https://docs.docker.com/build/building/best-practices/','https://docs.docker.com/compose/'],
 33:['https://docs.github.com/en/actions/writing-workflows','https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages'],
 34:['https://opentelemetry.io/docs/languages/python/instrumentation/','https://mlflow.org/docs/latest/genai/'],
 35:['https://developers.openai.com/api/docs/guides/latency-optimization','https://docs.python.org/3/library/decimal.html'],
 36:['https://grafana.com/docs/k6/latest/','https://opentelemetry.io/docs/languages/python/instrumentation/'],
 37:['https://www.python-httpx.org/advanced/timeouts/','https://docs.python.org/3/library/asyncio-task.html'],
 38:['https://mlflow.org/docs/latest/genai/','https://docs.github.com/en/actions/writing-workflows'],
 39:['https://huggingface.co/docs/peft/index','https://huggingface.co/docs/trl/sft_trainer'],
 40:['https://www.nist.gov/itl/ai-risk-management-framework','https://genai.owasp.org/llm-top-10/']}
for n in range(41,46):SOURCES[n]=SOURCES[30]+[SOURCES[33][0],SOURCES[26][0]]
def py(prompt,solution,tests,starter=None):
 return dict(kind='python',prompt=prompt,answer='',solution=solution,starter=starter or ('def solve(value):\n    return value\n'),tests=tests)
def rubric(prompt,criteria,solution):
 return dict(kind='rubric',prompt=prompt,answer='',criteria=criteria,solution=solution)
def choose(prompt,options,answer):return dict(kind='choice',prompt=prompt,options=options,answer=answer,solution=answer)
def order(prompt,steps):return dict(kind='order',prompt=prompt,options=list(reversed(steps)),answer='|'.join(steps),solution=' → '.join(steps))
def unit(phase,slug,title,concept,implementation,diagnosis,evidence,code,exercise,quiz,*,demo=None,terms=None,checkpoint=False,language='python'):
 id=f'p{phase:02}-{slug}'
 assert len(concept)>130 and len(implementation)>110 and len(diagnosis)>95 and len(evidence)>100,(id,'insufficient teaching')
 exercise=dict(exercise,id=id+'-exercise',hints=[concept.split('. ')[0]+'.',diagnosis.split('. ')[0]+'.',implementation.split('. ')[0]+'.',evidence.split('. ')[0]+'.'],explanation=exercise.get('solution',''))
 q=quiz
 obj=[title.split(':')[0], 'Implement the worked example and validate its boundary conditions', 'Use the diagnostic evidence to explain a release decision']
 sections=[dict(title='Problem and intuition',paragraphs=concept.split('\n\n')),dict(title='Implement the mechanism',paragraphs=implementation.split('\n\n'),code=code,language=language),dict(title='Break it and diagnose it',paragraphs=diagnosis.split('\n\n')),dict(title='Evaluate and apply',paragraphs=evidence.split('\n\n'))]
 # Paragraphs are authored; two logical paragraphs are required for each block.
 for section in sections:
  if len(section['paragraphs'])==1:
   text=section['paragraphs'][0];sentences=text.split('. ');mid=max(1,len(sentences)//2);section['paragraphs']=['. '.join(sentences[:mid])+'.','. '.join(sentences[mid:])]
 lesson=dict(id=id,phase=phase,module=PHASES[phase]['title'],title=title,minutes=35,objectives=obj,relevance=f"In the fictional CI quality platform, this skill connects {title.lower()} with test contracts, failure triage, and evidence for release. {evidence.split('. ')[0]}.",sections=sections,mistake=diagnosis.split('\n\n')[0],takeaway=evidence.split('. ')[0]+'.',exercise=exercise,quiz=dict(question=q[0],options=q[1],answer=q[2],explanation=q[3]),checkpoint=dict(question='Integrated decision: '+q[0],options=q[1],answer=q[2],explanation=q[3]),sources=SOURCES[phase],reviewed='2026-10-10',prerequisites=[],isPhaseCheckpoint=checkpoint,glossaryTerms=terms or [],interviewIds=[],**({'demo':demo} if demo else {}))
 ALL.append(lesson)
def write():
 ALL.sort(key=lambda l:(l['phase'],l.get('isPhaseCheckpoint',False)))
 existing=set()
 for l in ALL:
  assert l['id'] not in existing;existing.add(l['id'])
  for section in l['sections']:
   if section.get('code'):section['code']=section['code'].replace('pytest labs','pytest local-labs').replace('python labs/','python local-labs/')
  l.setdefault('isPhaseCheckpoint',False);l.setdefault('prerequisites',[])
  l.setdefault('reviewed','2026-10-10');l.setdefault('glossaryTerms',[]);l.setdefault('interviewIds',[])
 for i,l in enumerate(ALL):l['prerequisites']=[ALL[i-1]['id']] if i else []
 for phase in PHASES:
  ls=[l for l in ALL if l['phase']==phase['id']]
  if ls:(ROOT/f"src/course/phases/{phase['id']:02}.json").write_text(json.dumps(ls,indent=2))
 # Full source registry remains available to build-time validation, never imported
 # into the initial app bundle after the loading refactor.
 (ROOT/'src/course/complete-lessons.json').write_text(json.dumps(ALL,indent=2))
 summary=[{**{k:l[k] for k in ('id','phase','module','title','minutes','objectives','prerequisites','isPhaseCheckpoint')},'exercise':{k:l['exercise'].get(k,'') for k in ('id','kind','prompt')},'sections':[]} for l in ALL]
 (ROOT/'src/course/lesson-index.json').write_text(json.dumps(summary,indent=2))
 search=[{'type':'Lesson','title':l['title'],'text':' '.join(' '.join(s['paragraphs'])+' '+s.get('code','') for s in l['sections']),'url':'/lesson/'+l['id']} for l in ALL]
 search += [{'type':'Exercise','title':l['exercise']['prompt'],'text':l['exercise']['explanation'],'url':'/lesson/'+l['id']} for l in ALL]
 (ROOT/'src/course/search-index.json').write_text(json.dumps(search,indent=2))
 print('Authored',len(ALL),'lessons in',len(set(l['phase'] for l in ALL)),'phases')

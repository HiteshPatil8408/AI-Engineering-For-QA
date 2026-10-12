import os,sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from sentence_transformers import SentenceTransformer
from quality.retrieval import dense,sparse,rrf,metrics
if __name__=='__main__':
 model=SentenceTransformer(os.environ.get('EMBEDDING_MODEL','sentence-transformers/all-MiniLM-L6-v2'))
 query='How can I safely retry a temporary provider limit?'
 d=dense(query,model);s=sparse(query);h=rrf([s,d])[:3]
 print(json.dumps({'mode':'real-sentence-transformer','dense':[x['id'] for x in d],'sparse':[x['id'] for x in s],'hybrid':[x['id'] for x in h],'metrics':metrics([x['id'] for x in h],['retry'])},indent=2))

"""Real LlamaIndex retrieval with an explicit HuggingFace embedding download."""
import os,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from llama_index.core import Document,VectorStoreIndex
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from quality.data import documents
if __name__=='__main__':
 model=os.environ.get('EMBEDDING_MODEL','sentence-transformers/all-MiniLM-L6-v2')
 embed=HuggingFaceEmbedding(model_name=model,cache_folder=os.environ.get('HF_HOME',str(Path(__file__).resolve().parents[2]/'artifacts'/'model-cache')))
 docs=[Document(text=d['text'],id_=d['id'],metadata={'tenant':d['tenant'],'version':d['version']}) for d in documents() if d['tenant']=='alpha' and not d['deleted']]
 index=VectorStoreIndex.from_documents(docs,embed_model=embed)
 hits=index.as_retriever(similarity_top_k=3).retrieve('How should HTTP 429 be retried?')
 print([{'id':n.node.ref_doc_id,'score':n.score} for n in hits])

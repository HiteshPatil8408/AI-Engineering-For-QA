"""Actual Qdrant local persistence with explicit synthetic numerical vectors."""
from qdrant_client import QdrantClient,models
from pathlib import Path
client=QdrantClient(path='artifacts/qdrant')
if not client.collection_exists('fixtures'):
 client.create_collection('fixtures',vectors_config=models.VectorParams(size=3,distance=models.Distance.COSINE))
client.upsert('fixtures',points=[models.PointStruct(id=1,vector=[1.,0.,0.],payload={'tenant':'alpha','doc':'retry'}),models.PointStruct(id=2,vector=[1.,0.,0.],payload={'tenant':'beta','doc':'private'})])
result=client.query_points('fixtures',query=[1.,0.,0.],query_filter=models.Filter(must=[models.FieldCondition(key='tenant',match=models.MatchValue(value='alpha'))]),limit=3)
assert all(p.payload['tenant']=='alpha' for p in result.points)
print({'mode':'qdrant-real-store-synthetic-vectors','ids':[p.id for p in result.points]});client.close()

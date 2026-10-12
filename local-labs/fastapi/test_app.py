from fastapi.testclient import TestClient
from app import app
client=TestClient(app)
def test_health():assert client.get('/health').json()=={'status':'ok'}
def test_validation():
 assert client.post('/classify-failure',json={'log':''}).status_code==422
 assert client.post('/classify-failure',json={'log':'x','api_key':'secret'}).status_code==422
def test_classification():
 result=client.post('/classify-failure',json={'log':'connection refused'})
 assert result.json()['category']=='ENVIRONMENT' and result.json()['baseline']
def test_all_domains():
 assert client.post('/chat',json={'query':'retry HTTP 429'}).json()['citations']
 assert client.post('/search-failures',json={'query':'database'}).json()['results']
 assert client.post('/generate-tests',json={'operation':'{ item(id:"I1") { id } }'}).json()['cases']
 assert client.post('/evaluate',json={}).json()['passed']
def test_identity_and_secret_config(monkeypatch):
 assert client.post('/chat',json={'query':'payment'},headers={'Authorization':'Bearer unknown'}).status_code==401
 monkeypatch.setenv('LAB_API_TOKEN','synthetic-secret')
 assert client.post('/chat',json={'query':'payment'}).status_code==401
 r=client.post('/chat',json={'query':'payment'},headers={'Authorization':'Bearer synthetic-secret'})
 assert r.status_code==200 and 'synthetic-secret' not in r.text

def test_stateful_chat_is_scoped():
 a=client.post('/chat',json={'query':'retry HTTP 429','session_id':'scope-test'})
 assert a.json()['citations']
 b=client.post('/chat',json={'query':'Explain that','session_id':'scope-test'},headers={'Authorization':'Bearer fixture-beta'})
 assert b.json()['status']=='clarification'
 assert client.post('/chat',json={'query':'retry','session_id':'../invalid'}).status_code==422

def test_stream_has_explicit_completion_and_authorized_context():
 response=client.post('/chat/stream',json={'query':'retry HTTP 429'})
 assert response.status_code==200 and 'text/event-stream' in response.headers['content-type']
 assert 'event: delta' in response.text and 'event: done' in response.text
 assert 'SYNTHETIC_BETA_CANARY' not in response.text

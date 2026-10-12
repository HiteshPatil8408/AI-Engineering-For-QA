import argparse,json
from transformers import AutoTokenizer
p=argparse.ArgumentParser();p.add_argument('--model',required=True);p.add_argument('--text',default='DatabaseTimeoutError at checkout_test.py:42');a=p.parse_args()
t=AutoTokenizer.from_pretrained(a.model);ids=t.encode(a.text,add_special_tokens=False)
print(json.dumps({'model':a.model,'text':a.text,'ids':ids,'tokens':t.convert_ids_to_tokens(ids),'count':len(ids),'decoded':t.decode(ids),'limitation':'Round trip follows tokenizer normalization; tokens are not universal word IDs.'},indent=2))

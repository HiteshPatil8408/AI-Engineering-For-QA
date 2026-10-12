"""Bounded local API load measurement; not a provider benchmark."""
import asyncio,time,json,math,argparse,sys
from pathlib import Path
import httpx
async def measure(url,count,concurrency):
 sem=asyncio.Semaphore(concurrency);samples=[];errors=0
 async with httpx.AsyncClient(timeout=15) as client:
  async def one():
   nonlocal errors
   async with sem:
    start=time.perf_counter()
    try:
     r=await client.post(url+'/chat',json={'query':'retry HTTP 429'});r.raise_for_status()
     if not r.json().get('citations'):errors+=1
    except Exception:errors+=1
    samples.append(1000*(time.perf_counter()-start))
  start=time.perf_counter();await asyncio.gather(*(one() for _ in range(count)));elapsed=time.perf_counter()-start
 samples.sort()
 return {'mode':'local-extractive-service','requests':count,'concurrency':concurrency,'errors':errors,'passed':errors==0,'throughput':count/elapsed,'successful_throughput':(count-errors)/elapsed,'p50_ms':samples[math.ceil(.5*count)-1],'p95_ms':samples[math.ceil(.95*count)-1],'p99_ms':samples[math.ceil(.99*count)-1],'limitations':'Closed-loop workload; latency includes failed attempts. Does not measure live provider TTFT and can exhibit coordinated omission.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:8000');p.add_argument('--count',type=int,default=50);p.add_argument('--concurrency',type=int,default=5);p.add_argument('--output',default='artifacts/performance/report.json');a=p.parse_args()
 if a.count<1 or a.concurrency<1:p.error('positive count/concurrency required')
 report=asyncio.run(measure(a.url,a.count,a.concurrency));path=Path(a.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));sys.exit(0 if report['passed'] else 1)

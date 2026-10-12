import sys,argparse,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from quality.evaluation import evaluate,write_report,compare
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--output',default='artifacts/evaluation');p.add_argument('--cases');p.add_argument('--baseline');args=p.parse_args()
 report=evaluate(json.loads(Path(args.cases).read_text()) if args.cases else None)
 if args.baseline:
  report['comparison']=compare(report,json.loads(Path(args.baseline).read_text()));report['passed']=report['passed'] and not report['comparison']['regressions']
 write_report(report,args.output);print(json.dumps({'passed':report['passed'],'cases':len(report['results']),'output':args.output}));sys.exit(0 if report['passed'] else 1)

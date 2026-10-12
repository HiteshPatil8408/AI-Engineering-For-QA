"""Actual local MLflow experiment/artifact tracking; no external account."""
import sys,json,os
os.environ["MLFLOW_DISABLE_AGENT_HINT"]="1"
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import mlflow
from quality.evaluation import evaluate,write_report
if __name__=='__main__':
 Path('artifacts').mkdir(exist_ok=True)
 mlflow.set_tracking_uri('sqlite:///artifacts/mlflow.db')
 if mlflow.get_experiment_by_name('synthetic-ai-quality') is None:
  mlflow.create_experiment('synthetic-ai-quality',artifact_location=str(Path('artifacts/mlflow-files').resolve()))
 mlflow.set_experiment('synthetic-ai-quality')
 with mlflow.start_run():
  report=evaluate();write_report(report,'artifacts/evaluation')
  mlflow.log_params({'dataset':report['dataset'],'mode':report['mode'],'prompt':report['prompt'],'index':report['index']})
  mlflow.log_metric('pass_rate',sum(r['passed'] for r in report['results'])/len(report['results']))
  mlflow.log_artifacts('artifacts/evaluation');print(mlflow.active_run().info.run_id)

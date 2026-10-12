"""Actual OpenTelemetry spans and portable artifact recording."""
import sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor,ConsoleSpanExporter
from quality.evaluation import evaluate
provider=TracerProvider();provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()));trace.set_tracer_provider(provider)
tracer=trace.get_tracer('synthetic-ai-quality')
if __name__=='__main__':
 with tracer.start_as_current_span('release-evaluation') as parent:
  parent.set_attribute('dataset.version','synthetic-ci-v1');parent.set_attribute('execution.mode','fixture')
  with tracer.start_as_current_span('deterministic-cases') as child:
   report=evaluate();child.set_attribute('cases.count',len(report['results']));child.set_attribute('evaluation.passed',report['passed'])
 provider.force_flush()

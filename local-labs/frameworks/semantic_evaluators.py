"""Optional real evaluator adapters. Calls may incur configured provider costs."""
import os

def deepeval_grounding(question,answer,contexts):
 from deepeval.metrics import FaithfulnessMetric
 from deepeval.test_case import LLMTestCase
 model=os.environ.get('EVAL_MODEL')
 if not model:raise RuntimeError('Set EVAL_MODEL and provider credentials for live judging')
 metric=FaithfulnessMetric(threshold=.8,model=model,include_reason=True)
 case=LLMTestCase(input=question,actual_output=answer,retrieval_context=contexts)
 metric.measure(case)
 return {'framework':'deepeval','score':metric.score,'reason':metric.reason,'passed':metric.is_successful(),'model':model}

def ragas_grounding(question,answer,contexts,llm):
 from ragas import SingleTurnSample
 from ragas.metrics import Faithfulness
 import asyncio
 sample=SingleTurnSample(user_input=question,response=answer,retrieved_contexts=contexts)
 scorer=Faithfulness(llm=llm)
 return {'framework':'ragas','score':asyncio.run(scorer.single_turn_ascore(sample))}

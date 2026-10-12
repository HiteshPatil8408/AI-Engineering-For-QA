import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
ls=json.loads((ROOT/'src/course/complete-lessons.json').read_text())
# Explicit definitions; deeper context comes from each linked teaching record.
rows='''
0|Probabilistic system|A system whose outputs can vary or express uncertainty even for similar inputs.
0|AI engineering|Building usable applications around models, data, APIs, tools and evaluation.
0|AI quality engineering|Testing and enforcing model/application behavior with evidence and release contracts.
1|Dataclass|A Python class whose common data methods are generated from declared fields.
1|Type hint|A declaration of expected types used by readers and static tools; it does not itself validate runtime values.
1|Pydantic|A Python library that validates data against declared models and produces typed objects.
1|Fixture|Reusable controlled setup or data supplied to a test.
1|Mock|A substitute dependency used to control observations and inspect interactions in a test.
1|Coroutine|An asynchronous function execution that can suspend at await points.
1|Semaphore|A counter-based control limiting the number of concurrent operations.
1|Generator|An iterator that yields values incrementally rather than constructing all of them at once.
1|Context manager|An object defining entry and exit behavior to release resources reliably.
2|Broadcasting|NumPy rules that align compatible array shapes for elementwise operations.
2|Vectorization|Expressing operations over arrays instead of explicit per-element Python loops.
2|Dot product|The sum of pairwise products of corresponding vector coordinates.
2|Norm|A measure of vector magnitude; the Euclidean norm is the square root of summed squares.
3|DataFrame|A labeled two-dimensional table with column-wise types and operations.
3|Groupby|Partitioning rows by keys before applying aggregation or transformation.
3|Join cardinality|The relationship between row counts and key multiplicity when tables are combined.
3|Pivot|Reshaping values into a table indexed by chosen row and column categories.
3|Feature engineering|Creating model inputs from raw data using a reproducible transformation.
4|CTE|A named query expression scoped to a SQL statement.
4|Window function|A calculation over related rows that preserves individual result rows.
4|LAG|A window function returning a value from a preceding ordered row.
4|Query plan|The database's chosen execution strategy for a query.
4|EXISTS|A SQL predicate testing whether a subquery returns at least one row.
5|Population|The full group about which an analysis seeks to make a claim.
5|Sample|The observed subset used to estimate properties of a population.
5|Variance|The average squared deviation from the mean, with a denominator chosen for population or sample estimation.
5|Confidence interval|An interval produced by a procedure with a stated long-run coverage under its assumptions.
5|P-value|The probability, under the null model, of a result at least as extreme as the observed statistic.
5|Effect size|The magnitude of a difference or relationship, distinct from statistical significance.
5|Bootstrap|Estimating uncertainty by resampling observations with replacement.
5|Type I error|Rejecting a true null hypothesis under the specified test procedure.
5|Type II error|Failing to reject a false null hypothesis.
5|Power|The probability of rejecting the null for a specified effect under the test design.
6|Feature|An input attribute used by a model to make a prediction.
6|Label|The target value or category supplied as supervision.
6|Data leakage|Information unavailable at real prediction time influencing training or evaluation.
6|Overfitting|Learning training-specific patterns that do not generalize to independent cases.
6|Underfitting|Using a model or representation too limited to capture useful task patterns.
6|Cross-validation|Repeated training/validation splits used to estimate behavior and choose configurations.
6|Logistic regression|A linear scoring model transformed into class probabilities for classification.
6|Random forest|An ensemble of randomized decision trees combined for prediction.
6|Gradient boosting|Building an ensemble sequentially so later learners address errors of earlier ones.
6|Clustering|Grouping observations by similarity without target labels.
6|Precision|True positives divided by all predicted positives.
6|Recall|True positives divided by all actual positives.
6|F1|The harmonic mean of precision and recall when their sum is nonzero.
6|ROC-AUC|Area under the true-positive-rate versus false-positive-rate curve across thresholds.
6|Calibration|Agreement between predicted probability levels and observed outcome frequencies.
6|MAE|Mean absolute difference between predictions and targets.
6|RMSE|The square root of mean squared prediction error, expressed in target units.
7|Neuron|A weighted input combination followed by an activation function.
7|Bias|An additive parameter shifting a neuron's pre-activation independently of its inputs.
7|ReLU|An activation returning max(0,x).
7|Sigmoid|An activation mapping a real score to 1/(1+exp(-x)).
7|Gradient|The vector of partial derivatives of an objective with respect to its parameters.
7|Gradient descent|Updating parameters by subtracting a learning-rate-scaled gradient.
7|Backpropagation|Computing parameter gradients through a computation graph using the chain rule.
7|Learning rate|The multiplier controlling update size in an optimization step.
7|Epoch|One complete pass through the training data under a declared batching scheme.
7|Batch|A group of examples processed together in one training or inference operation.
7|Dropout|A training regularizer that randomly suppresses selected activations.
7|CNN|A neural network using shared convolution filters to detect local patterns.
7|RNN|A neural network that propagates a state across sequence positions.
7|LSTM|A recurrent architecture with gates controlling information retention and updates.
8|Token|A unit in a model's tokenizer vocabulary, not necessarily a whole word.
8|Tokenization|Transforming text into a sequence of vocabulary IDs under a specific tokenizer.
8|Vocabulary|The mapping of token symbols to IDs recognized by a model.
8|Attention|A normalized weighted aggregation of values based on query-key compatibility.
8|Query|The attention projection representing what a position seeks from other positions.
8|Key|The attention projection used to score compatibility with a query.
8|Value|The attention projection whose information is combined using attention weights.
8|Softmax|Converting scores to positive normalized probabilities using exponentials.
8|Causal mask|A restriction preventing a decoder position from attending to future positions.
8|Encoder|An architecture producing contextual input representations, often with bidirectional attention.
8|Decoder|An architecture generating outputs from earlier positions under causal attention.
8|Residual connection|A path that adds a block input to its transformed output.
8|Transformer|A model architecture built from attention and position-wise transformations.
9|Pretraining|Learning general representations or token distributions before task-specific adaptation.
9|Instruction tuning|Training a model on examples of following task instructions.
9|Hallucination|An unsupported or incorrect generated claim presented as if it were grounded.
9|Temperature|A decoding parameter that rescales logits before selecting output tokens.
9|Top-p|Sampling from a ranked token prefix whose cumulative probability reaches p.
9|Logit|An unnormalized model score before probability normalization.
9|Context window|The model's supported sequence budget under its input/output conventions.
9|Pareto frontier|Options for which no other option improves every compared objective simultaneously.
10|Deadline|The maximum total time allowed for an operation including attempts and waiting.
10|Timeout|The time limit for a particular operation or attempt.
10|Exponential backoff|Increasing delays between retries, commonly capped and randomized with jitter.
10|Idempotency|A contract under which repeating a request does not duplicate its intended effect.
10|Backpressure|Restricting new work when downstream capacity is insufficient.
10|Streaming|Delivering incremental events before the full result is complete.
10|TTFT|Elapsed time until the first generated token is received.
11|Zero-shot|Giving task instructions without demonstrations in the prompt.
11|Few-shot|Including a small set of task demonstrations in the prompt.
11|Paired comparison|Evaluating candidates on matching cases to inspect per-case differences.
11|Prompt version|An identity for a specific instruction/template artifact used in an experiment.
12|JSON Schema|A language for expressing structural constraints on JSON data.
12|Structured output|A model result constrained or validated against an explicit schema.
12|Tool calling|A model proposal for invoking an application-defined function with arguments.
12|Allowlist|A positive set of permitted operations or values.
12|Business invariant|A rule that must hold for an application result or state transition.
13|Embedding|A learned vector representation with geometry shaped by a training objective.
13|Cosine similarity|The dot product of two vectors divided by the product of their norms.
13|Embedding drift|A change in representation behavior that can alter retrieval quality or compatibility.
14|ANN|Approximate nearest-neighbor search trading some exact recall for resource or latency gains.
14|HNSW|A graph-based approximate vector index using navigable layers.
14|IVF|An index that partitions vectors into coarse cells and probes selected cells.
14|Vector database|A store combining vector search with metadata, persistence and operational APIs.
15|RAG|Retrieval-augmented generation: supplying selected external evidence at answer time.
15|Chunk overlap|Shared source content between neighboring document chunks.
15|Grounding|Constraining or checking claims against supplied evidence.
15|Citation|A resolvable reference linking a claim to an identifiable evidence source.
16|BM25|A lexical retrieval scoring method using term frequency, document frequency and length normalization.
16|Reciprocal rank fusion|Combining ranked lists by summing reciprocal rank contributions.
16|Reranker|A second-stage scorer that reorders retrieved candidates for a query.
16|HyDE|Generating a hypothetical answer/document to form a retrieval representation.
16|Graph RAG|Using explicit relationships or graph structure to support evidence retrieval and reasoning.
17|Precision@K|The fraction of the first K retrieved positions that are relevant.
17|Recall@K|The fraction of all relevant items retrieved within the first K positions.
17|MRR|Mean reciprocal rank of the first relevant result across queries.
17|NDCG|Discounted graded relevance gain normalized by the ideal ranking at the same cutoff.
17|Faithfulness|The degree to which generated claims are supported by the supplied context.
18|Agent|A system that selects actions iteratively from observations and task state.
18|Trajectory|The ordered record of an agent's decisions, tool calls and observations.
19|Checkpoint|Persisted execution state enabling inspection or resumption, without granting permission.
19|Reducer|A defined merge rule for state updates from multiple graph operations.
20|MCP|A protocol standardizing connections to servers exposing tools, resources and prompts.
20|JSON-RPC|A message format for structured remote procedure requests and responses.
20|Transport|The communication mechanism carrying protocol messages, such as stdio or HTTP.
21|Handoff|A transfer of a typed task, scoped evidence and budget to another component or specialist.
22|Abstention|Explicitly declining to make an unsupported task decision.
23|LLM-as-a-judge|Using a language model to apply a declared evaluation rubric to another result.
23|Hard gate|A mandatory condition that other scores cannot compensate for violating.
24|Fault injection|Deliberately introducing a controlled failure to test system behavior.
25|Golden dataset|A versioned collection of reviewed cases and expected behavior for evaluation.
25|Baseline|A declared reference implementation or run used for comparison.
26|Prompt injection|Untrusted text attempting to redirect a model or its application behavior.
26|Retrieval poisoning|Manipulating retrieved evidence or ranking to influence downstream behavior.
26|Tenant isolation|Enforcing separation of data and actions between customer or organizational scopes.
27|Least privilege|Granting only the data access and operations required for a component's task.
28|GraphQL|A typed query language and execution model for API data operations.
28|Traceability|Linking tests or results to the requirements and evidence they verify.
29|Test oracle|An independent basis for deciding whether observed behavior is correct.
29|Mutation testing|Changing implementation behavior to check whether tests detect meaningful differences.
30|Dependency injection|Supplying a component's dependencies through explicit interfaces or configuration.
30|Readiness|Whether a service can serve its required workload and dependencies.
31|Circuit breaker|A stateful control that temporarily stops calls to a failing dependency.
32|Container|An isolated running process environment created from an image.
32|Docker image|A packaged filesystem and runtime configuration composed from build layers.
33|CI|Automated integration checks that validate changes before release.
34|Trace|A linked record of operations within a task or request.
34|Span|A timed operation within a distributed trace.
34|OpenTelemetry|Standardized APIs and tooling for traces, metrics and logs.
35|Cost per task|Total measured spend divided by tasks meeting the declared success contract.
36|p95|A percentile threshold at or below which approximately 95 percent of measured samples fall.
36|Throughput|Completed work per unit time under a stated workload.
36|Coordinated omission|A measurement bias where a waiting load generator under-samples work during slow periods.
37|Graceful degradation|Delivering a smaller truthful capability when the full service cannot succeed.
37|Error budget|The allowed amount of reliability failure over a declared measurement window.
38|Release manifest|A record linking compatible code, data, model, prompt, index and evaluation artifacts.
38|MLOps|Practices for reproducible model training, release, serving and monitoring.
38|LLMOps|Operational practices for model providers, prompts, retrieval, evaluation and AI application releases.
39|Fine-tuning|Updating model parameters using task-specific training examples.
39|LoRA|Learning low-rank parameter updates while keeping base weights fixed.
39|PEFT|Parameter-efficient adaptation methods that train only a limited subset or added parameters.
40|SLO|A measurable service-level objective over a defined window and workload.
40|Trust boundary|A point where data or actions cross between differently trusted scopes.
'''
entries=[]
for row in rows.strip().splitlines():
 phase,term,simple=row.split('|',2);anchors=[l for l in ls if l['phase']==int(phase) and not l.get('isPhaseCheckpoint')]
 anchor=next((l for l in anchors if term in l.get('glossaryTerms',[])),anchors[0])
 entries.append({'term':term,'simple':simple,'deep':anchor['sections'][0]['paragraphs'][0],'example':anchor['sections'][1].get('code',anchor['exercise'].get('solution','')),'lesson':anchor['id'],'phase':int(phase)})
(ROOT/'src/course/glossary-extra.json').write_text(json.dumps(entries,indent=2))
print(len(entries),'defined glossary terms')

"""A transparent lexical baseline. Not an embedding-based RAG service."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def tokens(text):
    return set(re.findall(r"\w+", text.lower()))

def retrieve(query, documents, k=2):
    if k < 1: raise ValueError("k must be positive")
    q = tokens(query)
    ranked = [(name, len(q & tokens(text))) for name,text in documents.items()]
    return [name for name, score in sorted(ranked, key=lambda pair: (-pair[1],pair[0]))[:k] if score > 0]

if __name__ == "__main__":
    docs = {file.name:file.read_text() for file in (ROOT/"datasets/support-docs").glob("*.md")}
    cases = json.loads((ROOT/"datasets/rag-eval-dataset.json").read_text())
    for case in cases:
        result = retrieve(case["query"], docs)
        hit = case["expected_document"] in result if case["answerable"] else not result
        print(json.dumps({"id":case["id"],"retrieved":result,"passed":hit}))

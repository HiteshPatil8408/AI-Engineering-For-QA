"""Execute authored Python reference solutions in fresh namespaces."""
import json
from pathlib import Path
course=json.loads((Path(__file__).resolve().parents[1]/'src/course/complete-lessons.json').read_text())
failed=[];count=0
for l in course:
 e=l['exercise']
 if e['kind']!='python':continue
 count+=1
 try:
  scope={};exec(e['solution'],scope);exec(e['tests'],scope)
 except Exception as error:failed.append((l['id'],type(error).__name__,str(error)))
print(f'{count-len(failed)}/{count} Python reference solutions passed')
for error in failed:print(error)
raise SystemExit(bool(failed))

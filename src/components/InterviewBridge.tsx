import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { InterviewQuestion } from '../types/course';

export function InterviewBridge({ ids, phase }: { ids: string[]; phase: number }) {
  const [items, setItems] = useState<InterviewQuestion[]>([]);
  const [error, setError] = useState(false);
  async function load() {
    try {
      const { questions } = await import('../interview');
      setItems(ids.flatMap(id => questions.filter(q => q.id === id)));
      setError(false);
    } catch { setError(true); }
  }
  return <section className="panel"><h3>Interview bridge</h3><p>Explain the mechanism, diagnose a failure, and defend your release decision.</p><details onToggle={e => { if (e.currentTarget.open && !items.length) void load(); }}><summary>Open {ids.length} related questions</summary>{error ? <button onClick={() => void load()}>Retry loading questions</button> : items.length ? items.map(q => <p key={q.id}><small>{q.difficulty}</small><br/><Link to={'/interviews?question=' + encodeURIComponent(q.id)}>{q.question}</Link></p>) : <p role="status">Loading questions…</p>}</details><Link to={'/interviews?phase=' + phase}>Practice the phase question bank</Link></section>;
}

import { Link, useParams } from 'react-router-dom';
import { lessons, phases } from '../course';
import { useProgress } from '../state/ProgressContext';
import { mastery } from '../state/progress';
export default function PhasePage(){
 const {id}=useParams();const phase=phases.find(p=>String(p.id)===id);const {progress}=useProgress();
 if(!phase)return <div className="page"><h1>Phase not found</h1><Link to="/roadmap">Learning path</Link></div>;
 const items=lessons.filter(l=>l.phase===phase.id);const checkpoint=items.find(l=>l.isPhaseCheckpoint);
 return <div className="page"><div className="eyebrow">PHASE {id}</div><h1>{phase.title}</h1><p>{phase.description}</p><section className="panel"><h2>Outcomes and prerequisites</h2><p>Work through the mechanism, its counterexample, and the evidence needed for a release decision. The phase checkpoint applies these ideas to the shared CI quality platform.</p><p>{items.reduce((s,l)=>s+l.minutes,0)} estimated study minutes. Complete the practice and assessments as well as the reading.</p>{phase.id>0&&<Link to={'/phase/'+(phase.id-1)}>Prerequisite: {phases[phase.id-1].title}</Link>}<div className="topic-tags">{phase.topics.map(t=><span key={t}>{t}</span>)}</div></section><section className="panel"><h2>Lessons</h2>{items.map(l=><Link className="roadmap-lesson" key={l.id} to={'/lesson/'+l.id}><span>{l.title}</span><strong>{mastery(progress.lessons[l.id])}%</strong></Link>)}</section>{checkpoint&&<section className="panel"><h2>Applied checkpoint</h2><p>Produce evidence, identify a counterexample and justify a release or review decision.</p><Link className="primary" to={'/lesson/'+checkpoint.id}>Open checkpoint</Link></section>}<section className="panel"><h2>Interview practice</h2><p>Practice beginner explanations, intermediate debugging and advanced design tradeoffs from this phase.</p><Link to={'/interviews?phase='+phase.id}>Open related interview questions</Link></section></div>;
}

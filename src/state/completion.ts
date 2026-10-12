import { lessons } from '../course';
import { projects } from '../course/projects';
import { mastery, type Progress } from './progress';
export function completionGaps(p:Progress){
 const gaps:string[]=[];
 const weak=lessons.filter(l=>mastery(p.lessons[l.id])<85 || p.lessons[l.id]?.exercise!=='passed' || p.lessons[l.id]?.checkpoint!==1);
 if(weak.length)gaps.push(`${weak.length} lessons need 85% mastery with passed exercises and checkpoints`);
 const missing=projects.filter(project=>!p.projects.includes(project.id)||!p.projectEvidence?.[project.id]?.trim());
 if(missing.length)gaps.push(`${missing.length} capstones need acceptance evidence`);
 if(!p.finalAssessment?.passed)gaps.push('Pass the final applied assessment');
 if(!p.name.trim())gaps.push('Add your learner name');
 return gaps;
}

import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const phases=read('src/course/phases.json'),lessons=read('src/course/complete-lessons.json'),questions=read('src/interview/questions.json');
const errors=[],depth=[];const ids=new Set(lessons.map(l=>l.id));const qids=new Set(questions.map(q=>q.id));
const check=(ok,message)=>{if(!ok)errors.push(message);};
check(phases.length===46&&phases.every((p,i)=>p.id===i),'All phases 0–45 must exist in order');
check(ids.size===lessons.length,'Duplicate lesson IDs');check(qids.size===questions.length,'Duplicate question IDs');
const major=new Set([1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,28,30,31,40,41,42,43,44,45]);
for(const p of phases){const items=lessons.filter(l=>l.phase===p.id);check(items.length>0,`Phase ${p.id} has no lessons`);check(items.some(l=>l.isPhaseCheckpoint),`Phase ${p.id} has no applied checkpoint`);if(items.length<(major.has(p.id)?6:3))depth.push(`Phase ${p.id}: ${items.length}/${major.has(p.id)?6:3} lesson depth target`);}
for(const l of lessons){
 check(phases.some(p=>p.id===l.phase),`${l.id}: invalid phase`);
 check(l.sections.length>=2&&l.sections.every(s=>s.paragraphs.length>=2),`${l.id}: incomplete sections`);
 check(l.sections.some(s=>s.code)||l.exercise?.answer||l.exercise?.tasks?.length,`${l.id}: missing worked example`);
 check(l.exercise?.hints?.length===4&&(l.exercise.solution||l.exercise.answer||l.exercise.tasks?.length)&&l.exercise.explanation,`${l.id}: missing practice/hints/solution`);
 check(l.quiz.answer>=0&&l.quiz.answer<l.quiz.options.length,`${l.id}: invalid quiz`);
 check(l.checkpoint.answer>=0&&l.checkpoint.answer<l.checkpoint.options.length,`${l.id}: invalid checkpoint`);
 for(const id of l.prerequisites??[])check(ids.has(id)&&id!==l.id,`${l.id}: broken prerequisite ${id}`);
 for(const id of l.interviewIds??[])check(qids.has(id),`${l.id}: broken interview ${id}`);
 check((l.interviewIds??[]).length>=8,`${l.id}: incomplete interview bridge`);
 check(!/Lorem ipsum|TODO add|coming soon|under construction/i.test(JSON.stringify(l)),`${l.id}: unfinished learner content`);
 const words=l.sections.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length;if(words<180)depth.push(`${l.id}: ${words} teaching words requires depth review`);
}
for(const q of questions){check(ids.has(q.lesson),`${q.id}: broken lesson link`);for(const k of ['question','testing','hint','answer','why','weak','example'])check(typeof q[k]==='string'&&q[k].length>0,`${q.id}: missing ${k}`);check(q.followups.length>=2,`${q.id}: missing followups`);}
// Detect prerequisite cycles separately from forward/backward ordering.
const visiting=new Set(),done=new Set();function visit(id){if(visiting.has(id)){errors.push(`Prerequisite cycle: ${id}`);return;}if(done.has(id))return;visiting.add(id);for(const p of lessons.find(l=>l.id===id)?.prerequisites??[])visit(p);visiting.delete(id);done.add(id);}for(const id of ids)visit(id);
const repeatedAnswers=questions.length-new Set(questions.map(q=>q.answer)).size;
if(repeatedAnswers)depth.push(`${repeatedAnswers} repeated interview answers require editorial review`);
const report={phases:phases.length,lessons:lessons.length,questions:questions.length,errors,depth,complete:errors.length===0&&depth.length===0};
fs.writeFileSync('docs/CONTENT_INTEGRITY.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({phases:report.phases,lessons:report.lessons,questions:report.questions,structuralErrors:errors.length,depthFindings:depth.length},null,2));
for(const e of errors)console.error(e);
if(process.argv.includes('--completion'))for(const d of depth)console.error(d);
process.exitCode=errors.length||process.argv.includes('--completion')&&depth.length?1:0;

import {describe,it,expect} from 'vitest';
import {emptyProgress,validateProgress} from '../src/state/progress';
import {completionGaps} from '../src/state/completion';
import {lessons} from '../src/course';
import {projects} from '../src/course/projects';
describe('full-course completion and compatible backups',()=>{
 it('preserves legacy progress when assessment/evidence fields are absent',()=>{
  const p=emptyProgress();p.lessons.orientation={note:'Keep this note',bookmark:true,exercise:'skipped'};
  const restored=validateProgress(JSON.parse(JSON.stringify(p)));
  expect(restored.lessons.orientation).toMatchObject(p.lessons.orientation);
  expect(restored.finalAssessment).toBeUndefined();
 });
 it('does not unlock a certificate from reading or self-reported projects',()=>{
  const p=emptyProgress();p.name='Learner';for(const l of lessons)p.lessons[l.id]={complete:true};p.projects=projects.map(p=>p.id);
  expect(completionGaps(p)).toHaveLength(3);
 });
 it('requires passed safety and coding checks as well as 80 points',()=>{
  const p={...emptyProgress(),finalAssessment:{score:95,passed:true,date:new Date().toISOString(),weakAreas:['Safety invariants'],python:true,sql:true}};
  expect(()=>validateProgress(p)).toThrow('Inconsistent');
 });
 it('accepts a complete record and retains evidence on export/import',()=>{
  const p=emptyProgress();p.name='Learner';for(const l of lessons)p.lessons[l.id]={complete:true,exercise:'passed',quiz:1,checkpoint:1};p.projects=projects.map(p=>p.id);p.projectEvidence=Object.fromEntries(projects.map(p=>[p.id,'Run evidence for dataset v1 with passing acceptance checks.']));
  p.finalAssessment={score:100,passed:true,date:new Date().toISOString(),weakAreas:[],python:true,sql:true};
  expect(completionGaps(validateProgress(JSON.parse(JSON.stringify(p))))).toEqual([]);
 });
});

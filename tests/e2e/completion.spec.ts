import { test,expect } from '@playwright/test';
import fs from 'node:fs';
const course=JSON.parse(fs.readFileSync('src/course/complete-lessons.json','utf8')) as {id:string;phase:number;title:string;exercise:{kind:string;solution:string}}[];
test('all 46 phases open an authored lesson and checkpoint',async({page})=>{
 test.setTimeout(180000);
 for(let phase=0;phase<46;phase++){
  await page.goto('/#/phase/'+phase);
  await expect(page.getByRole('heading',{name:'Lessons',exact:true})).toBeVisible();
  const first=course.find(l=>l.phase===phase)!;
  await page.getByRole('link',{name:first.title+' 0%'}).click();
  await expect(page.getByRole('heading',{name:first.title,exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Your turn',exact:true})).toBeVisible();
 }
});
test('advanced math, evidence rubric and completion locks work',async({page})=>{
 await page.goto('/#/lesson/p08-attention');
 await expect(page.getByRole('heading',{name:'Stable attention weights and value mixtures'})).toBeVisible();
 await page.getByLabel('Parameter A:',{exact:false}).fill('3');
 await page.goto('/#/lesson/p20-checkpoint');
 const memo='Input contract for the synthetic fixture. The implementation evidence comes from a validated MCP call. A failure counterexample is an unauthorized fixture ID. The test confirms it is denied at the boundary. Release remains blocked until review confirms the trace.';
 await page.getByLabel('Your evidence memo').fill(memo);
 await page.getByRole('button',{name:'Check answer',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('Required evidence topics present');
 await page.goto('/#/settings');
 await expect(page.getByRole('button',{name:'Print completion certificate'})).toBeDisabled();
 await page.getByRole('link',{name:'Final applied assessment'}).click();
 await expect(page.getByRole('button',{name:'Submit assessment'})).toBeDisabled();
});
test('diagram editor renders, sanitizes and reports invalid input',async({page})=>{
 await page.goto('/#/diagrams');
 await expect(page.locator('.diagram-output svg')).toBeVisible({timeout:30000});
 await page.getByRole('button',{name:'Sequence',exact:true}).click();
 await expect(page.locator('.diagram-output svg')).toContainText('User',{timeout:30000});
 await page.getByLabel('Mermaid source').fill('not a valid mermaid diagram');
 await expect(page.getByRole('alert')).toBeVisible();
 await expect(page.locator('.diagram-output')).toHaveCount(0);
});

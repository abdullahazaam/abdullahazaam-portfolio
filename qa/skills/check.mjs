import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { transform } from 'esbuild';
const before=process.argv.includes('--before');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try {for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion:before?'reduce':'no-preference'});page.setDefaultTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(before?'http://127.0.0.1:3000/qa/skills/original.html':'http://127.0.0.1:3000',{waitUntil:'domcontentloaded',timeout:120000});await page.locator('#skills').waitFor();await page.evaluate(()=>document.fonts.ready);
 if(before){await page.locator('#skills').evaluate(e=>window.scrollTo({top:e.offsetTop+e.clientHeight-innerHeight+100,behavior:'instant'}));await page.waitForTimeout(2000);}
 await page.locator('#skills').evaluate(e=>window.scrollTo({top:e.offsetTop-75,behavior:'instant'}));await page.waitForTimeout(1700);
 if(!before) await page.waitForFunction(()=>[...document.querySelectorAll('.skill-shell')].every(e=>!e.style.transform && getComputedStyle(e).opacity==='1'));
 const data=await page.evaluate(()=>({sections:[...document.querySelectorAll('main > *,header,footer')].map(e=>({id:e.id||e.tagName,height:e.getBoundingClientRect().height,text:e.textContent,links:[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))})),cards:[...document.querySelectorAll('.skill-card')].map(e=>{const r=e.getBoundingClientRect();return{text:e.textContent,x:r.x,y:r.y+scrollY,width:r.width,height:r.height,icon:e.querySelector('svg')?.outerHTML}}),overflow:document.documentElement.scrollWidth-innerWidth,canvas:document.querySelectorAll('canvas').length}));
 report.push({width,height,...data,errors});await page.close();
}fs.writeFileSync(`qa/skills/${before?'before':'after'}.json`,JSON.stringify(report,null,2));console.log(report.map(r=>({width:r.width,height:r.sections.find(s=>s.id==='skills').height,cards:r.cards.length,overflow:r.overflow,errors:r.errors})));
}finally{await browser.close();}
if(before&&!fs.existsSync('qa/skills/source-before.json')){const files=fs.readdirSync('src',{recursive:true}).filter(f=>fs.statSync('src/'+f).isFile());fs.writeFileSync('qa/skills/source-before.json',JSON.stringify(Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync('src/'+f)).digest('hex')])),null,2));}

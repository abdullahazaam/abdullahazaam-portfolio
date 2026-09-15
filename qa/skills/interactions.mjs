import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const result={};
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.setDefaultTimeout(120000);
 await page.goto('http://127.0.0.1:3000',{waitUntil:'domcontentloaded'});await page.locator('#skills').waitFor();
 await page.locator('#skills').evaluate(e=>window.scrollTo({top:e.offsetTop-75,behavior:'instant'}));await page.waitForTimeout(2000);
 const states=()=>page.locator('.skill-shell').evaluateAll(cards=>cards.map(c=>({primary:getComputedStyle(c.querySelector('.skill-orbit-primary')).strokeDashoffset,secondary:getComputedStyle(c.querySelector('.skill-orbit-secondary')).strokeDashoffset,front:getComputedStyle(c.querySelector('.skill-front')).transform,opacity:getComputedStyle(c).opacity})));
 const a=await states();await page.waitForTimeout(650);const b=await states();
 assert.equal(a.length,18);for(let i=0;i<18;i++){assert.notEqual(a[i].primary,b[i].primary);assert.notEqual(a[i].secondary,b[i].secondary);assert.equal(a[i].front,b[i].front);assert.equal(b[i].opacity,'1');}
 result.all18CardsHaveMovingOrbitsAndStableFronts=true;
 const card=page.locator('.skill-shell').first();await card.hover({position:{x:108,y:24}});await page.waitForTimeout(400);
 const hover=await card.evaluate(e=>({engaged:e.classList.contains('skill-engaged'),rx:parseFloat(e.style.getPropertyValue('--card-rx')),ry:parseFloat(e.style.getPropertyValue('--card-ry')),rate:e.querySelector('.skill-orbit-primary').getAnimations()[0].playbackRate,icon:getComputedStyle(e.querySelector('.skill-icon')).transform,light:e.style.getPropertyValue('--light-x'),frontLight:getComputedStyle(e.querySelector('.skill-front')).getPropertyValue('--light-x')}));
 assert(hover.engaged);assert(Math.hypot(hover.rx,hover.ry)<=5);assert.equal(hover.rate,1.35);assert.notEqual(hover.icon,'none');assert(hover.light);assert.equal(hover.frontLight,hover.light);result.hover=hover;
 await page.screenshot({path:'qa/skills/hover-1440.png'});
 await page.mouse.move(1,1);await page.waitForTimeout(500);assert.equal(await card.evaluate(e=>e.classList.contains('skill-engaged')),false);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);assert.equal(await page.locator('.skill-orbit-primary').first().evaluate(e=>getComputedStyle(e).animationName),'none');result.reducedMotion=true;
 await page.close();
 const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});touch.setDefaultTimeout(120000);await touch.goto('http://127.0.0.1:3000',{waitUntil:'domcontentloaded'});await touch.locator('#skills').evaluate(e=>window.scrollTo({top:e.offsetTop-75,behavior:'instant'}));await touch.waitForTimeout(2000);
 await touch.locator('.skill-shell').first().dispatchEvent('pointermove',{pointerType:'touch',clientX:50,clientY:50});assert.equal(await touch.locator('.skill-engaged').count(),0);assert.equal(await touch.locator('.skill-orbit-node-secondary').first().evaluate(e=>getComputedStyle(e).display),'none');assert.notEqual(await touch.locator('.skill-orbit-primary').first().evaluate(e=>getComputedStyle(e).animationName),'none');result.touchHasLightOrbitWithoutPointerTilt=true;
 const before=JSON.parse(fs.readFileSync('qa/skills/before.json')),after=JSON.parse(fs.readFileSync('qa/skills/after.json'));
 for(let i=0;i<before.length;i++){
   assert.equal(after[i].overflow,0);assert.deepEqual(after[i].errors,[]);assert.deepEqual(after[i].sections,before[i].sections);
   for(let n=0;n<18;n++){const old=before[i].cards[n],now=after[i].cards[n];for(const key of ['text','icon','width','height','x'])assert.equal(now[key],old[key],`${after[i].width} ${n} ${key}`);assert(Math.abs(now.y-old.y)<1,`${after[i].width} card ${n} position changed`);}
 }
 result.gridContentIconsAndAllSectionHeightsUnchanged=true;
 const hashes=JSON.parse(fs.readFileSync('qa/skills/source-before.json'));result.changedExistingFiles=Object.keys(hashes).filter(p=>crypto.createHash('sha256').update(fs.readFileSync('src/'+p)).digest('hex')!==hashes[p]);result.concurrentOutsideScopeChanges=result.changedExistingFiles.filter(p=>!p.startsWith('components\\skills\\'));assert(result.changedExistingFiles.includes('components\\skills\\Skills.tsx'));
 fs.writeFileSync('qa/skills/interactions.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}

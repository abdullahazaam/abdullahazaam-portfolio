import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
try {for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}});page.setDefaultTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000',{waitUntil:'domcontentloaded'});await page.locator('.hero-approved-base').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 const geometry=await page.evaluate(()=>{const h=document.querySelector('#hero').getBoundingClientRect(),nav=document.querySelector('header').getBoundingClientRect(),next=document.querySelector('#about').getBoundingClientRect(),photo=document.querySelector('.hero-approved-plane').getBoundingClientRect();return{hero:{x:h.x,y:h.y,width:h.width,height:h.height,bottom:h.bottom},navBottom:nav.bottom,nextTop:next.top,photo:{x:photo.x,y:photo.y,width:photo.width,height:photo.height},overflow:document.documentElement.scrollWidth-innerWidth,loaded:document.querySelector('.hero-approved-base').naturalWidth>0,links:[...document.querySelectorAll('#hero a')].map(a=>a.getAttribute('href'))};});
 assert.equal(geometry.hero.x,0);assert.equal(geometry.hero.width,width);assert(Math.abs(geometry.hero.y-geometry.navBottom)<1);assert(Math.abs(geometry.hero.bottom-height)<1);assert(Math.abs(geometry.nextTop-geometry.hero.bottom)<1);assert.equal(geometry.overflow,0);assert(geometry.loaded);assert.equal(errors.length,0);
 await page.screenshot({path:`qa/hero/${width}-hero.png`});
 const faceBefore=await page.locator('.hero-approved-base').evaluate(e=>getComputedStyle(e).transform);
 await page.mouse.move(width*.85,height*.55);await page.waitForTimeout(400);
 const pointer=await page.locator('#hero').evaluate(e=>({desk:e.style.getPropertyValue('--desk-x'),wall:e.style.getPropertyValue('--wall-x')}));
 await page.evaluate(()=>window.scrollTo({top:250,behavior:'instant'}));await page.waitForTimeout(1400);
 const scroll=await page.locator('#hero').evaluate(e=>({desk:e.style.getPropertyValue('--desk-y'),monitor:e.style.getPropertyValue('--monitor-y'),camera:e.style.getPropertyValue('--room-camera'),copy:e.style.getPropertyValue('--copy-opacity'),face:getComputedStyle(e.querySelector('.hero-approved-base')).transform}));
 assert.equal(scroll.face,faceBefore);assert(parseFloat(scroll.camera)>0);assert.notEqual(scroll.desk,scroll.monitor);
 await page.screenshot({path:`qa/hero/${width}-scroll.png`});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);assert.equal(await page.locator('.hero-light-sweep').evaluate(e=>getComputedStyle(e).animationName),'none');
 results.push({width,height,geometry,pointer,scroll,errors});await page.close();
}const hashes=JSON.parse(fs.readFileSync('qa/hero/source-before.json'));const changed=Object.keys(hashes).filter(p=>crypto.createHash('sha256').update(fs.readFileSync('src/'+p)).digest('hex')!==hashes[p]);console.log({results,changed});fs.writeFileSync('qa/hero/report.json',JSON.stringify({results,changed},null,2));}finally{await browser.close();}

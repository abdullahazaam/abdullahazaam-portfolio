import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report=[];
try {
  for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]) {
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
    await page.waitForTimeout(500);
    const initial=await page.evaluate(()=>({heroHeight:document.querySelector('#hero').getBoundingClientRect().height,canvas:document.querySelectorAll('canvas').length,pins:document.querySelectorAll('.pin-spacer').length,overflow:document.documentElement.scrollWidth-innerWidth,face:document.querySelector('.hero-photograph').complete}));
    assert.equal(initial.canvas,0);assert.equal(initial.pins,0);assert.equal(initial.overflow,0);assert(initial.face);
    await page.screenshot({path:`qa/website/${width}-hero.png`});
    const sections=[];
    for(const id of ['about','skills','projects','journey','contact']) {
      await page.locator('#'+id).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-77,behavior:'instant'}));
      await page.waitForTimeout(1200);
      await page.screenshot({path:`qa/website/${width}-${id}.png`});
      sections.push(await page.evaluate(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return{id,height:r.height,overflow:document.documentElement.scrollWidth-innerWidth,heading:getComputedStyle(e.querySelector('h2')).opacity};},id));
    }
    await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
    await page.waitForTimeout(600);
    await page.screenshot({path:`qa/website/${width}-footer.png`});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(500);
    await page.screenshot({path:`qa/website/${width}-full.png`,fullPage:true});
    const content=await page.evaluate(()=>({projects:[...document.querySelectorAll('.project-card h3')].map(e=>e.textContent.trim()),skills:document.querySelectorAll('.skill-card').length,links:[...document.querySelectorAll('.project-card a')].map(e=>e.getAttribute('href')),brokenImages:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src),offscreenText:[...document.querySelectorAll('main h1,main h2,main h3,main p,main a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left < -1||r.right>innerWidth+1)}).map(e=>({text:e.textContent.slice(0,40),right:e.getBoundingClientRect().right}))}));
    assert.equal(content.projects.length,5);assert.equal(content.skills,18);assert.equal(content.brokenImages.length,0);assert.equal(errors.length,0);
    report.push({width,height,initial,sections,content,errors});
    fs.writeFileSync('qa/website/report.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report.at(-1)));
    await page.close();
  }
} finally {await browser.close();}

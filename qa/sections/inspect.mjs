import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[]; const before=process.argv.includes('--before');
try { for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion:before?"reduce":"no-preference"}); page.setDefaultTimeout(120000); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000',{waitUntil:'domcontentloaded',timeout:120000});
 const sections={};
 for(const id of ['journey','contact']) {
 await page.locator('#'+id).evaluate(e=>window.scrollTo({top:e.offsetTop-75,behavior:'instant'})); await page.waitForTimeout(1500);
 sections[id]=await page.locator('#'+id).evaluate(e=>({height:e.getBoundingClientRect().height,text:e.innerText,links:[...e.querySelectorAll('a')].map(a=>a.getAttribute('href')),overflow:document.documentElement.scrollWidth-innerWidth}));
 await page.locator('#'+id).screenshot({path:`qa/sections/${before?'before':'after'}-${width}-${id}.png`});
 }
 results.push({width,height,sections,errors}); await page.close();
 } fs.writeFileSync(`qa/sections/${before?'before':'after'}.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
} finally {await browser.close();}





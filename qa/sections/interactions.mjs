import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},permissions:['clipboard-read','clipboard-write']});
 page.setDefaultTimeout(120000);
 await page.goto('http://127.0.0.1:3000/qa/sections/preview.html',{waitUntil:'domcontentloaded'});
 await page.locator('.route-node').first().waitFor();
 assert.equal(await page.locator('.route-node').count(),5);
 const a=await page.locator('.route-energy').first().evaluate(e=>getComputedStyle(e).strokeDashoffset);
 await page.waitForTimeout(500);
 const b=await page.locator('.route-energy').first().evaluate(e=>getComputedStyle(e).strokeDashoffset);
 assert.notEqual(a,b);
 await page.locator('#contact').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
 const card=page.locator('.contact-channels .premium-card').first();await card.hover({position:{x:25,y:20}});await page.waitForTimeout(400);
 assert.match(await card.getAttribute('class'),/is-lit/);
 await page.getByRole('button',{name:'Copy email address'}).click();
 assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'abdullahazaam1505@gmail.com');
 await page.getByPlaceholder('Your Name').fill('Layout QA');await page.getByPlaceholder('Your Email').fill('qa@example.com');await page.getByPlaceholder('Your Message').fill('Local UI validation.');
 await page.getByRole('button',{name:'Send Message'}).click();await page.getByText('Message Received',{exact:true}).waitFor();
 await page.getByPlaceholder('Your Name').waitFor();assert.equal(await page.getByPlaceholder('Your Name').inputValue(),'');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.route-energy').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 const before=JSON.parse(fs.readFileSync('qa/sections/before.json')),after=JSON.parse(fs.readFileSync('qa/sections/after.json'));
 for(let i=0;i<before.length;i++)for(const id of ['journey','contact']) { assert.equal(after[i].sections[id].height,before[i].sections[id].height);assert.equal(after[i].sections[id].overflow,0);assert.deepEqual(after[i].sections[id].links,before[i].sections[id].links); }
 fs.writeFileSync('qa/sections/interactions.json',JSON.stringify({energyMotion:true,hoverLighting:true,copyEmail:true,existingFormConfirmationAndReset:true,reducedMotion:true,unchangedHeightsAndLinks:true},null,2));
 console.log('PASS: energy, hover, clipboard, existing form confirmation/reset, reduced motion, heights and links.');
} finally {await browser.close();}

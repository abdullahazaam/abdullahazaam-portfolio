import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://127.0.0.1:3000',{waitUntil:'domcontentloaded'});await page.locator('.hero-approved-base').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
 const clip=await page.locator('.hero-approved-plane').evaluate(e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x+r.width*.615),y:Math.round(r.y+r.height*.27),width:Math.round(r.width*.07),height:Math.round(r.height*.18)};});
 const before=await page.screenshot({clip});await page.mouse.move(1270,380);await page.waitForTimeout(650);const after=await page.screenshot({clip});assert(before.equals(after),'Portrait pixels changed during pointer/idle motion');fs.writeFileSync('qa/hero/portrait-stable.png',after);
 await page.getByRole('link',{name:'View My Work',exact:true}).click();await page.waitForTimeout(1800);assert.equal(await page.evaluate(()=>location.hash),'#projects');
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await mobile.goto('http://127.0.0.1:3000',{waitUntil:'domcontentloaded'});await mobile.locator('#hero').waitFor();await mobile.locator('#hero').dispatchEvent('pointermove',{pointerType:'touch',clientX:300,clientY:300});await mobile.waitForTimeout(400);assert.equal(await mobile.locator('#hero').evaluate(e=>parseFloat(e.style.getPropertyValue('--monitor-x'))||0),0);
 fs.writeFileSync('qa/hero/portrait-check.json',JSON.stringify({portraitPixelsIdenticalDuringMotion:true,projectCtaWorks:true,touchPointerDisabled:true},null,2));console.log('PASS: portrait pixels identical; project CTA navigates; touch pointer motion disabled.');
} finally{await browser.close();}

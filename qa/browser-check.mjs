import { chromium } from 'playwright';
import fs from 'node:fs';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = [];
for (const [width, height] of [[1440,900],[1024,768],[768,1024],[390,844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1500);
  const state = () => page.evaluate(() => {
    const hero = document.querySelector('#hero'), viewport = document.querySelector('.hero-viewport'), copy = document.querySelector('.hero-copy'), about = document.querySelector('#about');
    const rect = el => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }; };
    return { scrollY, progress: Number(getComputedStyle(hero).getPropertyValue('--sequence')), hero: rect(hero), viewport: rect(viewport), copy: rect(copy), gap: about.getBoundingClientRect().top - hero.getBoundingClientRect().bottom, overflow: document.documentElement.scrollWidth - innerWidth, canvases: document.querySelectorAll('canvas').length };
  });
  const initial = await state();
  await page.screenshot({ path: `qa/${width}-hero-back.png` });
  await page.waitForTimeout(1200);
  const idle = await state();
  const range = initial.hero.height - height;
  await page.mouse.wheel(0, range * 0.65 / 0.9);
  await page.waitForTimeout(2200);
  const middle = await state();
  await page.screenshot({ path: `qa/${width}-hero-turn.png` });
  await page.evaluate(y => window.scrollTo(0, y), range);
  await page.waitForTimeout(1500);
  const front = await state();
  await page.screenshot({ path: `qa/${width}-hero-front.png` });
  await page.mouse.wheel(0, -range * 0.5 / 0.9);
  await page.waitForTimeout(2200);
  const reverse = await state();
  await page.evaluate(y => window.scrollTo(0, y), range + height * 0.65);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `qa/${width}-about-transition.png` });
  const sections = [];
  for (const id of ['about','skills','projects','journey','contact']) {
    await page.locator(`#${id}`).evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 82));
    await page.waitForTimeout(1500);
    sections.push(await page.evaluate(id => ({ id, overflow: document.documentElement.scrollWidth - innerWidth, headingVisible: Number(getComputedStyle(document.querySelector(`#${id} h2`)).opacity) > .99 }), id));
    await page.screenshot({ path: `qa/${width}-${id}.png` });
  }
  report.push({ width, height, initial, idle, middle, front, reverse, sections, errors });
  await page.close();
  fs.writeFileSync('qa/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.at(-1)));
}
await browser.close();

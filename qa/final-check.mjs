import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
try {
  for (const [width, height] of [[1440,900],[1024,768],[768,1024],[390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas');
    const inspect = () => page.evaluate(() => {
      const hero = document.querySelector('#hero'), view = document.querySelector('.hero-viewport'), copy = document.querySelector('.hero-copy').getBoundingClientRect();
      return { progress: Number(getComputedStyle(hero).getPropertyValue('--sequence')), top: view.getBoundingClientRect().top, gap: document.querySelector('#about').getBoundingClientRect().top - hero.getBoundingClientRect().bottom, range: hero.offsetHeight - innerHeight, overflow: document.documentElement.scrollWidth - innerWidth, canvas: document.querySelectorAll('canvas').length, textVisible: copy.top >= 70 && copy.bottom < innerHeight && copy.right <= innerWidth };
    });
    const initial = await inspect();
    await page.waitForTimeout(1300);
    assert.equal((await inspect()).progress, initial.progress, 'Hero must not autoplay');
    await page.screenshot({ path: `qa/${width}-hero-back.png` });
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), initial.range * .7);
    await page.waitForTimeout(1100);
    const turn = await inspect();
    assert(Math.abs(turn.top) < 1 && turn.progress > .68 && turn.progress < .72, 'Pinned scroll-driven turn');
    await page.screenshot({ path: `qa/${width}-hero-turn.png` });
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), initial.range);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `qa/${width}-hero-front.png` });
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), initial.range * .35);
    await page.waitForTimeout(1100);
    const reverse = await inspect();
    assert(reverse.progress > .33 && reverse.progress < .37, 'Scroll reverses pose');
    assert.equal(reverse.gap, 0); assert.equal(reverse.overflow, 0); assert.equal(reverse.canvas, 1); assert(reverse.textVisible);
    if (width === 768) {
      await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
      assert(await page.locator('header').getByRole('link', { name: 'Skills', exact: true }).last().isVisible());
      await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
    }
    await page.locator('.hero-primary').click();
    await page.waitForTimeout(1700);
    const projectTop = await page.locator('#projects').evaluate(el => el.getBoundingClientRect().top);
    assert(Math.abs(projectTop - 84) < 10, 'Hero project link works');
    if (width === 1440) {
      const card = page.locator('.featured-card').first();
      await card.hover({ position: { x: 80, y: 100 } }); await page.waitForTimeout(450);
      assert(await card.evaluate(el => el.classList.contains('is-lit')));
      assert.notEqual(await card.evaluate(el => getComputedStyle(el).rotate), 'none');
      await page.screenshot({ path: 'qa/1440-projects-hover.png' });
      await page.mouse.move(10,10);
    }
    await page.screenshot({ path: `qa/${width}-projects.png` });
    assert.equal(errors.length, 0, errors.join('\n'));
    results.push({ width, initial, turn, reverse, errors, result: 'PASS' });
    console.log(`PASS ${width}px: idle, pin, scroll turn/reverse, visible copy, zero gap/overflow, one canvas, project link`);
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  const reducedState = await reduced.evaluate(() => ({ height: document.querySelector('#hero').getBoundingClientRect().height, viewport: innerHeight, pins: document.querySelectorAll('.pin-spacer').length, motion: [...document.querySelectorAll('.atmosphere-haze,.atmosphere-particle')].some(el => getComputedStyle(el).animationName !== 'none') }));
  assert.equal(reducedState.height, reducedState.viewport); assert.equal(reducedState.pins, 0); assert.equal(reducedState.motion, false);
  results.push({ reducedMotion: reducedState, result: 'PASS' });
  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallback.addInitScript(() => { const getContext = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.includes('webgl') ? null : getContext.call(this, type, ...args); }; });
  await fallback.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  assert(await fallback.locator('.room-fallback').isVisible()); assert(await fallback.locator('.hero-copy').isVisible());
  results.push({ webglFallback: 'PASS' });
  fs.writeFileSync('qa/final-report.json', JSON.stringify(results, null, 2));
  console.log('PASS reduced motion and WebGL fallback');
} finally { await browser.close(); }

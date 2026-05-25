// Instrumented hands-free run: load the demo at #demo-start, let it auto-play,
// and log when each beat first appears + total timings + any JS errors.
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repo = join(__dirname, '..');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--mute-audio'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.setViewport({ width: 440, height: 900, deviceScaleFactor: 1 });

const url = pathToFileURL(join(repo, 'index.html')).href + '#demo-start';
const t0 = Date.now();
await page.goto(url, { waitUntil: 'domcontentloaded' });

// intro video duration (if any)
let introDur = null;
try {
  introDur = await page.evaluate(() => new Promise(res => {
    const v = document.querySelector('.intro-ad-video');
    if (!v) return res(null);
    if (v.readyState >= 1) return res(v.duration);
    v.addEventListener('loadedmetadata', () => res(v.duration), { once: true });
    setTimeout(() => res(v.readyState >= 1 ? v.duration : null), 3000);
  }));
} catch {}

const seen = {};
const mark = (k) => { if (!seen[k]) seen[k] = ((Date.now() - t0) / 1000).toFixed(1); };

const probe = async () => page.evaluate(() => {
  const vis = sel => !!document.querySelector(sel);
  const paywalls = [...document.querySelectorAll('.chat-paywall')];
  const texts = [...document.querySelectorAll('.chat-msg-text')].map(e => e.textContent);
  return {
    chat: vis('.chat-msg.agent'),
    choice: vis('.chat-choices'),
    progress: vis('.chat-progress'),
    paywall: paywalls.length > 0,
    paySuccess: vis('.pay-modal-success.visible') || vis('.chat-paywall-pay.success'),
    paidPlan: vis('.chat-paid-plan'),
    recommendation: vis('.chat-recommendation'),
    booking: vis('.chat-booking'),
    booked: vis('.chat-booking-success'),
    monthly: paywalls.length >= 2,
    closing: texts.some(t => /sober nights start to feel like yours/i.test(t)),
    paywallCount: paywalls.length,
  };
});

const DEADLINE = 150000;
let last = {};
let paywallClicked = false;
while (Date.now() - t0 < DEADLINE) {
  const s = await probe();
  for (const k of Object.keys(s)) if (s[k] === true) mark(k);
  last = s;
  // The £17 paywall is click-to-continue (noAutoPay) — it no longer auto-advances.
  // Simulate the recording operator clicking "Unlock" after a brief view so the
  // rest of the flow can be measured. The later membership paywall still auto-pays.
  if (s.paywall && !paywallClicked) {
    await new Promise(r => setTimeout(r, 4500));
    await page.evaluate(() => {
      const b = document.querySelector('.chat-paywall-pay:not([disabled])');
      if (b) b.click();
    });
    paywallClicked = true;
  }
  if (seen.closing) break;
  await new Promise(r => setTimeout(r, 250));
}

await page.screenshot({ path: join(__dirname, '_autoplay-end.png') });
await browser.close();

console.log('intro video duration (s):', introDur);
console.log('beat first-seen (s from load):');
for (const [k, v] of Object.entries(seen)) console.log(`  ${k.padEnd(14)} ${v}`);
console.log('final state:', JSON.stringify(last));
console.log(errors.length ? 'JS ERRORS:\n' + errors.join('\n') : 'no JS errors');

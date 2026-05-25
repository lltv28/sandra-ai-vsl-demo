// Verify the demo edits: capture the new monthly beat and the entry paywall.
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repo = join(__dirname, '..');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const shots = [
  { hash: 'monthly', wait: 3000 },
  { hash: 'paywall', wait: 3000 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});

const errors = [];
for (const { hash, wait } of shots) {
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(`[${hash}] ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${hash}] console: ${m.text()}`); });
  await page.setViewport({ width: 440, height: 880, deviceScaleFactor: 2 });
  const url = pathToFileURL(join(repo, 'index.html')).href + '#demo-' + hash;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, wait));
  const out = join(__dirname, `_verify-${hash}.png`);
  await page.screenshot({ path: out });
  console.log('shot', out);
  await page.close();
}

await browser.close();
if (errors.length) { console.log('JS ERRORS:\n' + errors.join('\n')); }
else { console.log('no JS errors'); }

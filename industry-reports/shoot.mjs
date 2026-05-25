// Full-page screenshots of each industry report using the installed Chrome.
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const pages = [
  'financial-advisor.html',
  'mortgage-broker.html',
  'doctor.html',
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const file of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 472, height: 1200, deviceScaleFactor: 2 });
  const url = pathToFileURL(join(__dirname, file)).href;
  await page.goto(url, { waitUntil: 'networkidle0' });
  // Ensure web fonts are applied before capturing
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 350));
  const out = join(__dirname, file.replace('.html', '.png'));
  await page.screenshot({ path: out, fullPage: true });
  console.log('shot', out);
  await page.close();
}

await browser.close();
console.log('done');

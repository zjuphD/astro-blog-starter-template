import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'src/data/briefings.json');
const outDir = path.join(root, 'public/briefing-covers');
const refreshExisting = process.env.REFRESH_EXISTING === '1';

fs.mkdirSync(outDir, { recursive: true });

const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const browser = await chromium.launch({ headless: true });

const acceptPatterns = [
  /accept all/i,
  /accept cookies/i,
  /allow all/i,
  /agree/i,
  /i accept/i,
  /continue without accepting/i,
  /reject optional/i,
  /reject all/i,
  /同意全部/,
  /接受全部/,
  /拒绝非必要/,
];

async function clickConsentButtons(page) {
  // Consent managers are often rendered inside an iframe, so inspect every frame.
  for (let pass = 0; pass < 3; pass += 1) {
    let clicked = false;
    for (const frame of page.frames()) {
      for (const pattern of acceptPatterns) {
        try {
          const button = frame.getByRole('button', { name: pattern }).first();
          if (await button.isVisible({ timeout: 250 })) {
            await button.click({ timeout: 1200 });
            clicked = true;
            await page.waitForTimeout(250);
            break;
          }
        } catch {
          // Try the next pattern/frame.
        }
      }
    }
    if (!clicked) break;
  }
}

async function removeConsentOverlays(page) {
  // Remove known consent-manager containers/iframes if they remain after clicking.
  await page.evaluate(() => {
    const known = [
      '#onetrust-banner-sdk',
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      '[id*="sp_message_container"]',
      'iframe[id*="sp_message_iframe"]',
      'iframe[src*="privacy-mgmt"]',
      'iframe[src*="consent"]',
      'iframe[src*="cookie"]',
    ];

    for (const selector of known) {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    }

    const keyword = /(cookie|cookies|privacy|consent|your privacy|隐私|同意|接受全部)/i;
    const viewportArea = Math.max(1, innerWidth * innerHeight);

    for (const el of [...document.querySelectorAll('body *')]) {
      if (!(el instanceof HTMLElement)) continue;
      const text = (el.innerText || '').trim();
      if (!text || !keyword.test(text) || text.length > 2200) continue;

      const style = getComputedStyle(el);
      if (style.position !== 'fixed' && style.position !== 'sticky') continue;

      const rect = el.getBoundingClientRect();
      const area = Math.max(0, rect.width) * Math.max(0, rect.height);
      const wideOverlay = rect.width > innerWidth * 0.55 && rect.height > 45;
      const largeOverlay = area > viewportArea * 0.12;

      if (wideOverlay || largeOverlay) el.remove();
    }

    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }).catch(() => {});
}

async function capture(item) {
  if (!item?.id || !item?.originalUrl) return;

  const safeId = String(item.id).replace(/[^a-zA-Z0-9._-]/g, '-');
  const target = path.join(outDir, `${safeId}.png`);
  if (!refreshExisting && fs.existsSync(target) && fs.statSync(target).size > 0) {
    console.log(`cover exists: ${safeId}`);
    return;
  }

  console.log(`capturing: ${safeId}`);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    await page.goto(item.originalUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });
    await page.waitForTimeout(1800);
    await clickConsentButtons(page);
    await removeConsentOverlays(page);
    await page.waitForTimeout(650);
    await removeConsentOverlays(page);

    await page.screenshot({
      path: target,
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });
  } catch (error) {
    console.warn(`warning: failed to capture ${item.originalUrl}: ${error.message}`);
  } finally {
    await context.close();
  }
}

for (const item of items) {
  await Promise.race([
    capture(item),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`capture timed out: ${item?.id ?? 'unknown'}`)), 35000),
    ),
  ]).catch((error) => console.warn(error.message));
}

await browser.close();

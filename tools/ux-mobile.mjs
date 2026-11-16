/**
 * iPhone checks in WebKit (Safari's engine) against a locally served build.
 *
 * Arch can't host Playwright's WebKit, so `pnpm ux:mobile` runs this inside
 * Microsoft's Playwright image. Serve the build first, for example:
 *   pnpm build && pnpm exec wrangler dev -c .ux-audit/wrangler.json \
 *     --env-file .dev.vars --port 4320 --persist-to .cloudflare/state
 * (`pnpm ux:audit` writes .ux-audit/wrangler.json.)
 *
 * For each iPhone profile it records overflow, small tap targets, clipped
 * text, the mobile menu, the project dialog and back gesture, typing, and
 * input font sizes (iOS zooms below 16px). Screenshots go to
 * .ux-audit/webkit/.
 */
import { mkdirSync } from 'node:fs';
import { webkit, devices } from 'playwright';

const base = process.env.UX_BASE_URL ?? 'http://127.0.0.1:4320';
const out = new URL('../.ux-audit/webkit', import.meta.url).pathname;

mkdirSync(out, { recursive: true });
const profiles = [
  ['iphone-se', devices['iPhone SE']],
  ['iphone-15-pro', devices['iPhone 15 Pro']],
  ['iphone-15-pro-landscape', devices['iPhone 15 Pro landscape']],
];

const browser = await webkit.launch();
const report = {};

for (const [name, profile] of profiles) {
  const context = await browser.newContext(profile);
  const page = await context.newPage();
  const errors = [];

  page.on('pageerror', (e) => errors.push(e.message));
  const result = { viewport: profile.viewport, pages: {} };

  for (const route of ['/', '/portfolio', '/resume', '/contact']) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const metrics = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth - innerWidth,
      smallTargets: [...document.querySelectorAll('a[href],button,input,textarea')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          const s = getComputedStyle(e);
          return r.width > 0 && s.display !== 'inline' && (r.width < 24 || r.height < 24);
        })
        .map((e) => e.getAttribute('aria-label') || e.textContent.trim().slice(0, 30)),
      clipped: [...document.querySelectorAll('h1,h2,h3,p,a,button')]
        .filter((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible')
        .map((e) => e.textContent.trim().slice(0, 30)),
    }));

    result.pages[route] = metrics;
    await page.screenshot({ path: `${out}/${name}${route === '/' ? '-home' : route.replace('/', '-')}.png`, fullPage: true });
  }

  // Menu (portrait only shows the button).
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const menu = page.getByRole('button', { name: 'Open menu' });

  if (await menu.isVisible()) {
    await menu.tap();
    await page.waitForTimeout(300);
    const panel = page.locator('nav div.fixed');
    result.menuLinks = await panel.locator('a.site-nav-link').count();
    await page.screenshot({ path: `${out}/${name}-menu.png` });
    await panel.getByRole('link', { name: 'Projects', exact: true }).tap();
    await page.waitForURL('**/portfolio');
    result.menuNavigated = page.url().endsWith('/portfolio');
  }

  // Dialog: open by tapping the card, close with history back.
  await page.goto(base + '/portfolio', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Second Set' }).tap();
  await page.waitForTimeout(400);
  result.dialogOpen = await page.locator('dialog[open]').count();
  const dialogBox = await page.locator('dialog[open]').boundingBox();
  result.dialogFits = dialogBox ? dialogBox.width <= profile.viewport.width && dialogBox.x >= 0 : null;
  await page.screenshot({ path: `${out}/${name}-dialog.png` });
  await page.goBack();
  await page.waitForTimeout(300);
  result.dialogAfterBack = await page.locator('dialog[open]').count();
  result.urlAfterBack = new URL(page.url()).pathname;

  // Form: typing and focus zoom (iOS zooms below 16px).
  await page.goto(base + '/contact', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Name').tap();
  await page.getByLabel('Name').fill('Test Visitor');
  result.nameValue = await page.getByLabel('Name').inputValue();
  result.inputFontSizes = await page.evaluate(() =>
    [...document.querySelectorAll('main input:not([type=hidden]), main textarea')]
      .filter((e) => e.id)
      .map((e) => getComputedStyle(e).fontSize),
  );
  result.errors = errors;
  report[name] = result;
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 1));

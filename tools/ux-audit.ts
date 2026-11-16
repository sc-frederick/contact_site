/**
 * UX hillclimbing audit.
 *
 * Loads every route at desktop and mobile sizes in Chromium, then records
 * screenshots, axe accessibility violations, web vitals, transfer weight,
 * console errors, horizontal overflow, small tap targets, and shader status.
 * Each run writes `report.json` and `summary.md` under `.ux-audit/<label>/`
 * and compares its score with `.ux-audit/baseline.json` when one exists.
 *
 * Usage:
 *   pnpm build && pnpm ux:audit [--label name] [--url https://sfrederick.dev]
 *                                [--save-baseline] [--routes /,/resume]
 *
 * Without `--url`, the script serves the current build with `wrangler dev`,
 * using `.dev.vars` for local bindings, so server routes such as /contact work.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import AxeBuilder from '@axe-core/playwright';
import {
  chromium,
  type Browser,
  type BrowserContextOptions,
  type Page,
} from 'playwright';

class AuditFailed extends Error {
  readonly _tag = 'AuditFailed';
}

interface Viewport {
  readonly name: 'desktop' | 'mobile';
  readonly options: BrowserContextOptions;
  /** Chrome DevTools CPU slowdown applied while measuring. */
  readonly cpuSlowdown: number;
}

interface Vitals {
  readonly lcp: number;
  readonly cls: number;
  readonly tbt: number;
  readonly fcp: number;
}

interface Weight {
  readonly scriptKb: number;
  readonly styleKb: number;
  readonly fontKb: number;
  readonly imageKb: number;
  readonly totalKb: number;
  readonly requests: number;
}

interface AxeViolation {
  readonly id: string;
  readonly impact: string;
  readonly nodes: number;
  readonly help: string;
  readonly targets: readonly string[];
}

interface PageResult {
  readonly route: string;
  readonly viewport: Viewport['name'];
  readonly vitals: Vitals;
  readonly weight: Weight;
  readonly axe: readonly AxeViolation[];
  readonly consoleErrors: readonly string[];
  readonly overflowX: number;
  readonly smallTargets: readonly string[];
  readonly shaders: Readonly<Record<string, number>>;
  readonly screenshot: string;
  readonly parts: {
    readonly performance: number;
    readonly accessibility: number;
    readonly correctness: number;
  };
  readonly score: number;
}

interface MotionCheck {
  readonly canvases: number;
  readonly motionAttribute: string | null;
  readonly passed: boolean;
}

interface Report {
  readonly label: string;
  readonly baseUrl: string;
  readonly createdAt: string;
  readonly score: number;
  readonly pages: readonly PageResult[];
  readonly reducedMotion: MotionCheck;
}

const viewports: readonly Viewport[] = [
  {
    name: 'desktop',
    options: { viewport: { width: 1440, height: 900 } },
    cpuSlowdown: 1,
  },
  {
    name: 'mobile',
    options: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
    cpuSlowdown: 4,
  },
];

const { values: args } = parseArgs({
  options: {
    label: { type: 'string', default: new Date().toISOString().slice(0, 19) },
    url: { type: 'string' },
    routes: { type: 'string', default: '/,/portfolio,/resume,/contact' },
    port: { type: 'string', default: '4317' },
    'save-baseline': { type: 'boolean', default: false },
  },
});

const outputRoot = new URL('../.ux-audit/', import.meta.url);
const runDir = new URL(
  `${args.label.replaceAll(/[^\w.-]/g, '-')}/`,
  outputRoot,
);
const routes = args.routes.split(',').map((route) => route.trim());

/** Records paint and layout metrics before any page script runs. */
const vitalsObserver = `
  window.__vitals = { lcp: 0, cls: 0, tbt: 0, fcp: 0 };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__vitals.lcp = entry.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      window.__vitals.tbt += Math.max(0, entry.duration - 50);
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (entry.name === 'first-contentful-paint') window.__vitals.fcp = entry.startTime;
  }).observe({ type: 'paint', buffered: true });
`;

const impactPenalty: Readonly<Record<string, number>> = {
  critical: 15,
  serious: 10,
  moderate: 4,
  minor: 1,
};

/**
 * Scores one page 0-100 from three weighted parts, like Lighthouse:
 * performance 50%, accessibility 30%, and correctness 20%.
 */
function scorePage(
  result: Omit<PageResult, 'score' | 'parts'>,
  viewport: Viewport,
) {
  const lcpBudget = viewport.name === 'mobile' ? 1800 : 1000;
  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const performance = clamp(
    100 -
      Math.max(0, result.vitals.lcp - lcpBudget) / 40 -
      result.vitals.cls * 200 -
      result.vitals.tbt / 15 -
      Math.max(0, result.weight.scriptKb - 100) / 12 -
      Math.max(0, result.weight.totalKb - 500) / 40,
  );

  const accessibility = clamp(
    100 -
      result.axe.reduce(
        (sum, violation) => sum + (impactPenalty[violation.impact] ?? 4),
        0,
      ) -
      result.smallTargets.length * 3,
  );

  const correctness = clamp(
    100 - result.consoleErrors.length * 15 - (result.overflowX > 0 ? 30 : 0),
  );

  const round = (value: number) => Math.round(value * 10) / 10;

  return {
    parts: {
      performance: round(performance),
      accessibility: round(accessibility),
      correctness: round(correctness),
    },
    score: round(performance * 0.5 + accessibility * 0.3 + correctness * 0.2),
  };
}

/**
 * Serves the built worker locally. The generated wrangler config binds custom
 * domains, which makes wrangler rewrite requests to production hostnames, so
 * the audit serves a copy without routes.
 */
async function startPreview(): Promise<ChildProcess | undefined> {
  if (args.url) return undefined;

  const generated: { routes?: unknown } = JSON.parse(
    await readFile(
      new URL('../.cloudflare/adapter/wrangler.json', import.meta.url),
      'utf8',
    ),
  );

  delete generated.routes;

  const config = new URL('wrangler.json', outputRoot);

  await writeFile(config, JSON.stringify(generated));

  const server = spawn(
    new URL('../node_modules/.bin/wrangler', import.meta.url).pathname,
    [
      'dev',
      '--config',
      config.pathname,
      '--env-file',
      '.dev.vars',
      '--persist-to',
      '.cloudflare/state',
      '--port',
      args.port,
      '--inspector-port',
      '0',
      '--log-level',
      'error',
    ],
    // A separate process group lets cleanup stop workerd along with wrangler.
    { stdio: 'ignore', detached: true },
  );

  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://localhost:${args.port}/`);

      if (response.ok) return server;
    } catch {
      // The local worker is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  stopPreview(server);
  throw new AuditFailed(
    'wrangler dev did not start. Run `pnpm build` first and check .dev.vars.',
  );
}

function stopPreview(server: ChildProcess | undefined) {
  if (server?.pid) process.kill(-server.pid, 'SIGTERM');
}

async function measureWeight(page: Page): Promise<Weight> {
  return page.evaluate(() => {
    const entries = [
      ...performance.getEntriesByType('navigation'),
      ...performance.getEntriesByType('resource'),
    ];

    const totals = { script: 0, style: 0, font: 0, image: 0, total: 0 };

    for (const entry of entries) {
      if (!(entry instanceof PerformanceResourceTiming)) continue;
      // Local preview servers report zero transferSize for cached entries.
      const bytes = entry.transferSize || entry.encodedBodySize;
      const path = new URL(entry.name).pathname;

      totals.total += bytes;

      if (/\.m?js$/.test(path) || entry.initiatorType === 'script')
        totals.script += bytes;
      else if (/\.css$/.test(path) || entry.initiatorType === 'link')
        totals.style += bytes;
      else if (/\.(woff2?|ttf|otf)$/.test(path)) totals.font += bytes;
      else if (/\.(png|jpe?g|webp|avif|gif|svg)$/.test(path))
        totals.image += bytes;
    }

    const kb = (bytes: number) => Math.round(bytes / 102.4) / 10;

    return {
      scriptKb: kb(totals.script),
      styleKb: kb(totals.style),
      fontKb: kb(totals.font),
      imageKb: kb(totals.image),
      totalKb: kb(totals.total),
      requests: entries.length,
    };
  });
}

/** Lists visible controls smaller than WCAG 2.2's 24 by 24 pixel target size. */
async function findSmallTargets(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const small: string[] = [];

    for (const element of document.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [role="button"]',
    )) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      if (rect.width === 0 || style.visibility === 'hidden') continue;
      // Links inside running text are exempt from the target size rule.
      if (element.tagName === 'A' && style.display === 'inline') continue;

      if (rect.width < 24 || rect.height < 24) {
        const name =
          element.getAttribute('aria-label') ??
          element.textContent?.trim().slice(0, 40) ??
          element.tagName;

        small.push(
          `${name} (${Math.round(rect.width)}x${Math.round(rect.height)})`,
        );
      }
    }

    return small;
  });
}

async function auditPage(
  browser: Browser,
  baseUrl: string,
  route: string,
  viewport: Viewport,
): Promise<PageResult> {
  const context = await browser.newContext(viewport.options);
  const page = await context.newPage();
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    // The response listener reports failed requests with their URLs.
    if (
      message.type() === 'error' &&
      !message.text().startsWith('Failed to load resource')
    )
      consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('response', (response) => {
    // Turnstile rejects the production site key on localhost.
    const localTurnstile =
      !args.url &&
      response.url().startsWith('https://challenges.cloudflare.com/');

    if (response.status() >= 400 && !localTurnstile)
      consoleErrors.push(`HTTP ${response.status()} ${response.url()}`);
  });
  await page.addInitScript(vitalsObserver);

  const cdp = await context.newCDPSession(page);

  await cdp.send('Emulation.setCPUThrottlingRate', {
    rate: viewport.cpuSlowdown,
  });
  await page.goto(new URL(route, baseUrl).href, { waitUntil: 'load' });
  // Give lazy shader scenes time to compile and report their status.
  await page.waitForTimeout(2500);

  // Interaction ends LCP observation, so read vitals before scrolling or axe.
  const vitals = await page.evaluate(() => {
    // SAFETY: the init script assigns this object before page scripts run.
    const recorded = (window as unknown as { __vitals: Vitals }).__vitals;

    return {
      lcp: Math.round(recorded.lcp),
      cls: Math.round(recorded.cls * 1000) / 1000,
      tbt: Math.round(recorded.tbt),
      fcp: Math.round(recorded.fcp),
    };
  });

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

  const weight = await measureWeight(page);

  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  const smallTargets = await findSmallTargets(page);

  const shaders = await page.evaluate(() => {
    const counts: Record<string, number> = {};

    for (const element of document.querySelectorAll<HTMLElement>(
      '[data-shader-status]',
    )) {
      const status = element.dataset.shaderStatus ?? 'unknown';

      counts[status] = (counts[status] ?? 0) + 1;
    }

    return counts;
  });

  const axeResults = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
      'best-practice',
    ])
    .analyze();

  const axe = axeResults.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact ?? 'moderate',
    nodes: violation.nodes.length,
    help: violation.help,
    targets: violation.nodes.slice(0, 3).map((node) => node.target.join(' ')),
  }));

  const slug = route === '/' ? 'home' : route.replaceAll('/', '');
  const screenshot = `${slug}-${viewport.name}.png`;

  await page.screenshot({
    path: new URL(screenshot, runDir).pathname,
    fullPage: true,
    animations: 'disabled',
  });
  await context.close();

  const result = {
    route,
    viewport: viewport.name,
    vitals,
    weight,
    axe,
    consoleErrors,
    overflowX,
    smallTargets,
    shaders,
    screenshot,
  };

  return { ...result, ...scorePage(result, viewport) };
}

/** Confirms reduced-motion visitors get no canvases or running motion. */
async function auditReducedMotion(
  browser: Browser,
  baseUrl: string,
): Promise<MotionCheck> {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(new URL('/', baseUrl).href, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const canvases = await page
    .locator('[data-shader-status="ready"], .pixel-trail:visible')
    .count();

  const motionAttribute = await page.evaluate(
    () => document.documentElement.dataset.motion ?? null,
  );

  await context.close();

  return {
    canvases,
    motionAttribute,
    passed: canvases === 0 && motionAttribute === 'off',
  };
}

function formatSummary(report: Report, baseline: Report | undefined) {
  const delta = (current: number, previous: number | undefined) =>
    previous === undefined
      ? ''
      : ` (${current - previous >= 0 ? '+' : ''}${Math.round((current - previous) * 10) / 10})`;

  const lines = [
    `# UX audit: ${report.label}`,
    '',
    `${report.baseUrl} at ${report.createdAt}`,
    '',
    `**Score: ${report.score}${delta(report.score, baseline?.score)}**`,
    '',
    `Reduced motion: ${report.reducedMotion.passed ? 'pass' : 'FAIL'} (${report.reducedMotion.canvases} canvases, data-motion=${report.reducedMotion.motionAttribute})`,
    '',
    '| Page | Score | Perf | A11y | Correct | LCP | CLS | TBT | JS KB | Total KB | Axe | Errors | Overflow | Small targets | Shaders |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const result of report.pages) {
    const previous = baseline?.pages.find(
      (page) =>
        page.route === result.route && page.viewport === result.viewport,
    );

    lines.push(
      `| ${result.route} ${result.viewport} | ${result.score}${delta(result.score, previous?.score)} | ${result.parts.performance} | ${result.parts.accessibility} | ${result.parts.correctness} | ${result.vitals.lcp} | ${result.vitals.cls} | ${result.vitals.tbt} | ${result.weight.scriptKb} | ${result.weight.totalKb} | ${result.axe.length} | ${result.consoleErrors.length} | ${result.overflowX} | ${result.smallTargets.length} | ${Object.entries(
        result.shaders,
      )
        .map(([status, count]) => `${status}:${count}`)
        .join(' ')} |`,
    );
  }

  const details = report.pages.flatMap((result) => [
    ...result.axe.map(
      (violation) =>
        `- ${result.route} ${result.viewport}: axe ${violation.impact} \`${violation.id}\` x${violation.nodes}: ${violation.help} (${violation.targets.join(', ')})`,
    ),
    ...result.consoleErrors.map(
      (error) => `- ${result.route} ${result.viewport}: console ${error}`,
    ),
    ...result.smallTargets.map(
      (target) =>
        `- ${result.route} ${result.viewport}: small target ${target}`,
    ),
  ]);

  if (details.length) lines.push('', '## Issues', '', ...details);

  return `${lines.join('\n')}\n`;
}

async function readBaseline(): Promise<Report | undefined> {
  try {
    // SAFETY: the baseline file is written by this script from a Report value.
    return JSON.parse(
      await readFile(new URL('baseline.json', outputRoot), 'utf8'),
    ) as Report;
  } catch {
    return undefined;
  }
}

async function main() {
  await mkdir(runDir, { recursive: true });
  await mkdir(outputRoot, { recursive: true });

  const server = await startPreview();
  const baseUrl = args.url ?? `http://localhost:${args.port}`;

  const browser = await chromium.launch({ args: ['--enable-unsafe-webgpu'] });

  try {
    const pages: PageResult[] = [];

    for (const route of routes)
      for (const viewport of viewports)
        pages.push(await auditPage(browser, baseUrl, route, viewport));

    const reducedMotion = await auditReducedMotion(browser, baseUrl);

    const average =
      pages.reduce((sum, page) => sum + page.score, 0) / pages.length;

    const report: Report = {
      label: args.label,
      baseUrl,
      createdAt: new Date().toISOString(),
      score: Math.round((average - (reducedMotion.passed ? 0 : 10)) * 10) / 10,
      pages,
      reducedMotion,
    };

    const baseline = await readBaseline();
    const summary = formatSummary(report, baseline);

    await writeFile(
      new URL('report.json', runDir),
      `${JSON.stringify(report, null, 2)}\n`,
    );
    await writeFile(new URL('summary.md', runDir), summary);

    if (args['save-baseline'])
      await writeFile(
        new URL('baseline.json', outputRoot),
        `${JSON.stringify(report, null, 2)}\n`,
      );

    console.log(summary);
    console.log(`Screenshots and report: ${runDir.pathname}`);
  } finally {
    await browser.close();
    stopPreview(server);
  }
}

try {
  await main();
} catch (error) {
  console.error(error instanceof AuditFailed ? error.message : error);
  process.exitCode = 1;
}

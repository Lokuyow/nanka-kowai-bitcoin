// PWA: manifest が読めて必須項目があること、Service Worker が activate されて
// 他サイトのキャッシュを保持し、オフラインでも表示できることを確認する。

import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { appendFile, cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { BASE_PATH } from './site-data.mjs';
import { BUILD_DIR, startServer, launchBrowser, newContext, openPage } from './helpers.mjs';

let server;
let browser;
const requests = [];

beforeAll(async () => {
  server = await startServer({ onRequest: (pathname) => requests.push(pathname) });
  browser = await launchBrowser();
});

test('PWA: 1 回の再読み込みで最新版を表示し、更新時は変更ファイルだけを取得する', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'kowai-bitcoin-pwa-'));
  const updated = path.join(temp, 'build');
  let buildDir = BUILD_DIR;
  let workerBuildDir = BUILD_DIR;
  const requests = [];
  const site = await startServer({
    getBuildDir: (url) => url === BASE_PATH + 'sw.js' ? workerBuildDir : buildDir,
    onRequest: (url) => requests.push(url)
  });
  const context = await newContext(browser, { serviceWorkers: 'allow' });
  try {
    const { page } = await openPage(context, site.base);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);

    // adapter-static に渡るページと静的ファイルから、トップの CSS だけを変更して公開し直す。
    await cp(new URL('../static/', import.meta.url), updated, { recursive: true });
    await cp(new URL('../.svelte-kit/output/prerendered/pages/', import.meta.url), updated, { recursive: true });
    await appendFile(path.join(updated, 'styles/home.css'), '\n:root { --pwa-test: updated; }\n');
    const script = fileURLToPath(new URL('../scripts/build-service-worker.js', import.meta.url));
    await promisify(execFile)(process.execPath, [script], { cwd: temp });

    const html = (await readdir(updated)).find((file) => /^index\.[a-f0-9]{16}\.html$/.test(file));
    const css = (await readdir(path.join(updated, 'styles')))
      .find((file) => /^home\.[a-f0-9]{16}\.css$/.test(file));
    assert.ok(html && css, '変更後の HTML と CSS にハッシュ付きのファイル名がある');
    buildDir = updated;

    // 新しい Worker の配信前でも、公開された HTML と CSS は最初の再読み込みで表示される。
    requests.length = 0;
    await page.reload({ waitUntil: 'load' });
    assert.equal(page.url(), site.base);
    assert.equal(await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--pwa-test')), 'updated');
    assert.ok(requests.includes(BASE_PATH));
    assert.ok(requests.includes(BASE_PATH + 'styles/' + css));
    assert.ok(!requests.some((url) => url.startsWith(BASE_PATH + 'styles/base.')));

    workerBuildDir = updated;
    requests.length = 0;
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      const changed = new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
      });
      await registration.update();
      await changed;
    });
    assert.ok(requests.includes(BASE_PATH + 'sw.js'));
    assert.ok(requests.includes(BASE_PATH + html));
    // トップの CSS は英語版のトップ（/en/）も使うので、その HTML も取り直す。
    const enHtml = (await readdir(path.join(updated, 'en'))).find((file) => /^index\.[a-f0-9]{16}\.html$/.test(file));
    const expected = [BASE_PATH + html, BASE_PATH + 'en/' + enHtml, BASE_PATH + 'styles/' + css, BASE_PATH + 'sw.js'];
    assert.ok(requests.every((url) => expected.includes(url)), requests.join(' / '));

    await context.setOffline(true);
    await page.reload({ waitUntil: 'load' });
    assert.equal(page.url(), site.base);
    assert.equal(await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--pwa-test')), 'updated');
  } finally {
    await context.close();
    await site.close();
    await rm(temp, { recursive: true, force: true });
  }
});

afterAll(async () => {
  try {
    await browser?.close();
  } finally {
    await server?.close();
  }
});

test('PWA: manifest の必須項目', async () => {
  const res = await fetch(`${server.base}manifest.webmanifest`);
  assert.equal(res.status, 200, 'manifest が取得できる');
  const manifest = await res.json();
  assert.ok(manifest.name, 'name がある');
  assert.ok(manifest.short_name, 'short_name がある');
  assert.equal(manifest.display, 'standalone', 'display が standalone');
  assert.ok(manifest.start_url?.startsWith(BASE_PATH), 'start_url がサイト配下');
  assert.ok(manifest.scope?.startsWith(BASE_PATH), 'scope がサイト配下');
  const sizes = (manifest.icons || []).map((i) => i.sizes);
  assert.ok(sizes.includes('192x192'), '192x192 アイコンがある');
  assert.ok(sizes.includes('512x512'), '512x512 アイコンがある');
});

test('PWA: スマホでサイト内リンクを押すと HTML の通信なしで遷移する', async () => {
  const context = await newContext(browser, { serviceWorkers: 'allow', hasTouch: true, isMobile: true });
  try {
    const { page } = await openPage(context, server.base);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);

    requests.length = 0;
    await page.locator('#story-price a').tap();
    await page.waitForURL(server.base + 'price/', { waitUntil: 'load' });
    await page.getByRole('link', { name: '次の話', exact: true }).tap();
    await page.waitForURL(server.base + 'fee/', { waitUntil: 'load' });
    await page.locator('.tabbar .idx').tap();
    await page.waitForURL(server.base + '#story-fee', { waitUntil: 'load' });
    assert.ok(!requests.some((url) => [BASE_PATH, BASE_PATH + 'price/', BASE_PATH + 'fee/'].includes(url)
      || url.endsWith('.html')), 'トップとフッターのリンクで HTML を再取得しない');

    requests.length = 0;
    await page.reload({ waitUntil: 'load' });
    assert.ok(requests.includes(BASE_PATH), 'サイト内リンクで開いたページも再読み込みでは再検証する');

    requests.length = 0;
    await page.goto(server.base + 'price/', { waitUntil: 'load' });
    assert.ok(requests.includes(BASE_PATH + 'price/'), 'URL を直接開いたときは再検証する');
  } finally {
    await context.close();
  }
});

test('PWA: SW が activate され、オフラインでも表示できる', async () => {
  const context = await newContext(browser, { serviceWorkers: 'allow' });
  try {
    const setupPage = await context.newPage();
    await setupPage.goto(server.origin);
    await setupPage.evaluate(async () => {
      await caches.open('kowai-bitcoin-v19');
      await caches.open('sibling-site-cache');
    });
    await setupPage.close();

    const { page } = await openPage(context, server.base);
    // SW がページを制御するまで待つ（clients.claim ですぐ制御下に入る想定。
    // 入らなければ1回リロードしてから待つ）
    const controlled = await page
      .waitForFunction(() => !!navigator.serviceWorker?.controller, null, { timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (!controlled) {
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => !!navigator.serviceWorker?.controller, null, {
        timeout: 10000,
      });
    }
    const swState = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return { scope: reg?.scope, script: reg?.active?.scriptURL };
    });
    assert.deepEqual(swState, { scope: server.base, script: server.base + 'sw.js' });

    const cacheNames = await page.evaluate(() => caches.keys());
    assert.ok(cacheNames.includes('sibling-site-cache'), '別サイトのキャッシュが残る');
    assert.ok(!cacheNames.includes('kowai-bitcoin-v19'), '旧バージョンのキャッシュが削除される');
    assert.equal(cacheNames.filter((name) => name.startsWith('kowai-bitcoin-v')).length, 1,
      '本サイトの現行キャッシュが残る');

    const mainStyle = new URL(await page.locator('link[href*="/styles/base."]').getAttribute('href'), server.base);
    assert.match(mainStyle.pathname, /\/styles\/base\.[a-f0-9]{16}\.css$/);
    requests.length = 0;
    await page.reload({ waitUntil: 'load' });
    assert.ok(requests.includes(BASE_PATH), '再訪問の HTML はネットワークで再検証される');
    assert.ok(!requests.includes(mainStyle.pathname), 'ハッシュ付き CSS はキャッシュから返る');

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'load' });
      assert.equal(await page.locator('.hero .t').count(), 1, 'オフラインでもトップが表示される');
      const titleFonts = await page.locator('.hero .t').evaluate((title) =>
        document.fonts.load('600 34px "M PLUS 1 Code"', title.textContent).then((fonts) => fonts.length));
      assert.equal(titleFonts, 1, 'オフラインでもサイトタイトルのフォントが読み込まれる');
      const previewSource = await page.locator('.bridge-card img').evaluate(async (img) => {
        await img.decode();
        return img.currentSrc;
      });
      assert.match(previewSource, /\/media\/sawatte-preview\.[a-f0-9]{16}\.avif$/);

      await page.goto(`${server.base}ceo/`, { waitUntil: 'load' });
      const newsSource = await page.locator('.newsfig img').evaluate(async (img) => {
        await img.decode();
        return img.currentSrc;
      });
      assert.match(newsSource, /\/media\/news-telop\.[a-f0-9]{16}\.avif$/);
      await page.locator('.newsfig source').evaluate((source) => { source.type = 'image/unsupported'; });
      await page.waitForFunction(() => document.querySelector('.newsfig img').currentSrc.endsWith('.jpg'));
      await page.locator('.newsfig img').evaluate((img) => img.decode());

      const article = await page.goto(`${server.base}price/`, { waitUntil: 'load' });
      assert.equal(article.status(), 200, '未訪問の記事をオフラインで開ける');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor), 'rgb(238, 238, 235)');
      assert.equal(await page.locator('.tabbar').evaluate((el) => getComputedStyle(el).position),
        'fixed', 'オフラインでも各話共通の CSS が適用される');
      assert.equal(await page.locator('.share-btns').evaluate((el) => getComputedStyle(el).display),
        'flex', 'オフラインでも共有ボタンの CSS が適用される');
      await page.locator('#buyBtn').click();
      assert.match(await page.locator('#myTrades').textContent(), /1回/);

      const missing = await page.goto(`${server.base}missing/deep/`, { waitUntil: 'load' });
      assert.equal(missing.status(), 404);
      await page.locator('.lang-toggle').click();
      await page.getByRole('heading', { name: 'Page not found', exact: true }).waitFor();
    } finally {
      await context.setOffline(false);
    }
    await page.close();
  } finally {
    await context.close();
  }
});

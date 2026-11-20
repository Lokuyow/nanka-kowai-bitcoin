// PWA: manifest が読めて必須項目があること、Service Worker が activate されて
// 他サイトのキャッシュを保持し、オフラインでも表示できることを確認する。

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_PATH } from './site-data.mjs';
import { startServer, launchBrowser, newContext, openPage } from './helpers.mjs';

let server;
let browser;

before(async () => {
  server = await startServer();
  browser = await launchBrowser();
});

after(async () => {
  await browser.close();
  await server.close();
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

test('PWA: SW が activate され、オフラインでも表示できる', async () => {
  const context = await newContext(browser);
  try {
    const setupPage = await context.newPage();
    await setupPage.goto(server.origin);
    await setupPage.evaluate(async () => {
      await caches.open('kowai-bitcoin-v18');
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
      return { hasReg: !!reg, active: !!reg?.active };
    });
    assert.ok(swState.hasReg && swState.active, 'SW が登録され activate されている');

    const cacheNames = await page.evaluate(() => caches.keys());
    assert.ok(cacheNames.includes('sibling-site-cache'), '別サイトのキャッシュが残る');
    assert.ok(!cacheNames.includes('kowai-bitcoin-v18'), '旧バージョンのキャッシュが削除される');
    assert.equal(cacheNames.filter((name) => name.startsWith('kowai-bitcoin-v')).length, 1,
      '本サイトの現行キャッシュが残る');

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'load' });
      assert.equal(await page.locator('.hero .t').count(), 1, 'オフラインでもトップが表示される');
      await page.goto(`${server.base}scam/`, { waitUntil: 'load' });
      assert.equal(await page.locator('h1').count(), 1, 'オフラインでも各話が表示される');
      assert.equal(await page.locator('.tabbar').evaluate((el) => getComputedStyle(el).position),
        'fixed', 'オフラインでも各話共通の CSS が適用される');
      assert.equal(await page.locator('.share-btns').evaluate((el) => getComputedStyle(el).display),
        'flex', 'オフラインでも共有ボタンの CSS が適用される');
      await page.goto(`${server.base}unknown/nested/`, { waitUntil: 'load' });
      await page.locator('.lang-toggle').click();
      assert.equal(await page.locator('h1').innerText(), 'Page not found',
        '未知の深い URL でも、オフラインの 404 ページで言語を切り替えられる');
    } finally {
      await context.setOffline(false);
    }
    await page.close();
  } finally {
    await context.close();
  }
});

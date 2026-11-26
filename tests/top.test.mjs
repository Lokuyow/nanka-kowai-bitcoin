// トップページ固有の振る舞い:
// - 隠れた話（「もっと見る」の中）へのハッシュリンクで、その層が開くこと
// - 壊れたハッシュでもエラーにならず、その後のハッシュ変更でも開けること（Issue #11）
// - ヒーローの問いが巡回し、リンク先が問いに合っていること
// - 言語を切り替えるとヒーローの問いもすぐ切り替わること（Issue #14）

import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newContext, openPage } from './helpers.mjs';

let server;
let browser;
let context;

beforeAll(async () => {
  server = await startServer();
  browser = await launchBrowser();
  context = await newContext(browser);
});

afterAll(async () => {
  try {
    await browser?.close();
  } finally {
    await server?.close();
  }
});

const detailsOpen = (page) =>
  page.locator('#story-tulip').evaluate((el) => el.closest('details.story-more')?.open === true);

test('トップ: 隠れた話へのハッシュで「もっと見る」が開いて見える位置に来る', async () => {
  const { page, errors } = await openPage(context, server.base + '#story-tulip');
  try {
    assert.equal(await detailsOpen(page), true, '対象の層が開いていること');
    const box = await page.locator('#story-tulip').boundingBox();
    assert.ok(box && box.y >= 0 && box.y < 667, '対象の話が画面内に見えること');
    assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
  } finally {
    await page.close();
  }
});

test('トップ: 壊れたハッシュでもエラーにならず、その後のハッシュ変更で開ける', async () => {
  const { page, errors } = await openPage(context, server.base + '#%E3%81');
  try {
    await page.evaluate(() => {
      location.hash = 'story-tulip';
    });
    await page.waitForFunction(
      () => document.querySelector('#story-tulip')?.closest('details.story-more')?.open === true,
    );
    assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
  } finally {
    await page.close();
  }
});

test('トップ: ヒーローの問いが巡回し、リンク先が問いに合っている', async () => {
  const { page, errors } = await openPage(context, server.base);
  try {
    const firstText = await page.locator('#heroQText').innerText();
    const firstHref = await page.locator('#heroQ').getAttribute('href');
    // 巡回間隔は約3.8秒。次の問いへ切り替わるまで待つ。
    await page.waitForFunction(
      (text) => document.querySelector('#heroQText')?.textContent !== text,
      firstText,
      { timeout: 10_000 },
    );
    const secondHref = await page.locator('#heroQ').getAttribute('href');
    assert.notEqual(secondHref, firstHref, '問いと一緒にリンク先も切り替わること');
    for (const href of [firstHref, secondHref]) {
      assert.match(href, /\/(scam|ceo|price)\/$/, 'リンク先は巡回対象の話であること');
    }
    assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
  } finally {
    await page.close();
  }
});

test('トップ: 言語を切り替えるとヒーローの問いもすぐ切り替わる', async () => {
  // 巡回を止めた状態（reduced motion）で確認すると、定期描画に頼る実装では
  // 切り替わらないことが確実に分かる。
  const reduced = await newContext(browser, { reducedMotion: 'reduce' });
  try {
    const { page, errors } = await openPage(reduced, server.base);
    const hasKana = () => /[\u3040-\u30ff]/.test(document.querySelector('#heroQText')?.textContent || '');
    assert.equal(await page.evaluate(hasKana), true, '初期表示は日本語の問い');
    await page.locator('.lang-toggle').click();
    await page.waitForFunction(() => !/[\u3040-\u30ff]/.test(document.querySelector('#heroQText')?.textContent || ''), null, { timeout: 2000 });
    await page.locator('.lang-toggle').click();
    await page.waitForFunction(() => /[\u3040-\u30ff]/.test(document.querySelector('#heroQText')?.textContent || ''), null, { timeout: 2000 });
    assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
  } finally {
    await reduced.close();
  }
});

// 図解スモーク: 全23話の触れる図解について、主要な操作を1〜2手行い、
// 状態表示が変化することだけを確認する（完走はしない）。
// 操作と観測要素の定義は site-data.mjs の smoke にある。

import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { UNITS } from './site-data.mjs';
import {
  startServer,
  launchBrowser,
  newContext,
  openPage,
  runSmokeSteps,
  waitForHtmlChange,
} from './helpers.mjs';

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

for (const { slug, smoke } of UNITS) {
  test(`図解スモーク: ${slug}`, async () => {
    const { page, errors } = await openPage(context, `${server.base}${slug}/`);
    try {
      const beforeHtml = await page.$eval(smoke.watch, (el) => el.innerHTML);
      await runSmokeSteps(page, smoke.steps);
      const afterHtml = await waitForHtmlChange(page, smoke.watch, beforeHtml);
      assert.notEqual(afterHtml, beforeHtml, '操作で状態表示が変化すること');
      assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
    } finally {
      await page.close();
    }
  });
}

test('図解: 手数料データを取得できない場合は日英の目安で計算する', async () => {
  const offlineData = await newContext(browser);
  try {
    const { page, errors } = await openPage(offlineData, server.base + 'fee/');
    await page.waitForFunction(() => document.getElementById('feeNote').textContent.includes('実データを取得できなかった'));
    await page.locator('#sendBtn').click();
    assert.equal(await page.locator('#rFee').textContent(), '7,500円');
    await page.locator('.lang-toggle').click();
    await page.locator('html[lang="en"]').waitFor();
    assert.equal(await page.locator('#rFee').textContent(), '$50');
    assert.match(await page.locator('#feeNote').textContent(), /Live data could not be loaded/);
    assert.deepEqual(errors, []);
  } finally {
    await offlineData.close();
  }
});

test('図解: スライダーの塗りが初期値・キー操作・項目の切り替えに追従する', async () => {
  const { page } = await openPage(context, server.base + 'fee/');
  try {
    const fill = (slider) => slider.evaluate((el) => parseFloat(el.style.getPropertyValue('--range-progress')));
    const amount = page.locator('#amtRange');
    assert.equal(await fill(amount), 45);
    await amount.press('End');
    assert.equal(await fill(amount), 100);
    await amount.press('Home');
    assert.equal(await fill(amount), 0);

    await page.goto(server.base + 'infinite/');
    const pieces = page.locator('#dvS');
    await pieces.press('ArrowRight');
    assert.equal(await fill(pieces), 12.5);
    await pieces.press('Home');
    assert.equal(await fill(pieces), 0);

    await page.goto(server.base + 'value/');
    await page.locator('[data-item="gold"]').click();
    const want = page.locator('#slWant');
    const scarce = page.locator('#slScarce');
    const meter = page.locator('#meterNum');
    assert.equal(await page.locator('.sliders input[type=range]').count(), 2);
    assert.equal(await fill(want), 70);
    assert.equal(await fill(scarce), 65);
    const initialScore = Number(await meter.textContent());
    await scarce.press('End');
    assert.ok(Number(await meter.textContent()) > initialScore);
    await want.press('Home');
    assert.equal(await meter.textContent(), '0');
  } finally {
    await page.close();
  }
});

test('図解: 実価格から買える量を計算し、1 BTCとの大小に合った説明を表示する', async () => {
  const page = await context.newPage();
  try {
    let jpy;
    await page.route('https://mempool.space/api/v1/prices', (route) =>
      route.fulfill({ json: { JPY: jpy, USD: jpy / 200 } }));
    for (const [price, btc, share, messageJa, messageEn] of [
      [9_580_000, '0.10438413', '10.44%', /ビットコインの一部を買える/, /buys a fraction of a bitcoin/],
      [1_000_000, '1.00000000', '100%', /ちょうど1 BTC/, /exactly 1 BTC/],
      [500_000, '2.00000000', '200%', /1 BTCより多く/, /more than 1 BTC/],
    ]) {
      jpy = price;
      await page.goto(server.base + 'satoshi/');
      await page.waitForFunction(() => document.getElementById('satHint').textContent.includes('mempool.space'));
      await page.locator('#yenRange').press('End');
      assert.equal(await page.locator('#satBtc').textContent(), '＝ ' + btc + ' BTC');
      assert.equal(await page.locator('#satShare').textContent(), share);
      const fill = await page.locator('#satBar').evaluate((bar) => parseFloat(bar.style.width));
      assert.ok(Math.abs(fill - Math.min(1, Number(btc)) * 100) < 0.001);
      assert.match(await page.locator('#satMsg').textContent(), messageJa);
      await page.locator('.lang-toggle').click();
      await page.locator('html[lang="en"]').waitFor();
      assert.match(await page.locator('#satMsg').textContent(), messageEn);
      await page.locator('.lang-toggle').click();
    }
  } finally {
    await page.close();
  }
});

test('図解: /price/ の裁定手数料表示と言語切替時の取引所名、/en/price/ の取引回数初期表示が正しい', async () => {
  const isoContext = await newContext(browser);
  try {
    const { page, errors } = await openPage(isoContext, server.base + 'price/');
    assert.match(await page.locator('#arbNote').textContent(), /750円/);
    await page.locator('#arbTrade').click();
    assert.match(await page.locator('#arbMsg').textContent(), /取引所A/);
    await page.locator('.lang-toggle').click();
    await page.locator('html[lang="en"]').waitFor();
    assert.match(await page.locator('#arbNote').textContent(), /\$5\b/);
    const enMsg = await page.locator('#arbMsg').textContent();
    assert.ok(!enMsg.includes('取引所'), `英語切替後に日本語が残らないこと: ${enMsg}`);
    assert.match(enMsg, /Exchange A/);

    const { page: enPage, errors: enErrors } = await openPage(isoContext, server.base + 'en/price/');
    assert.equal(await enPage.locator('#myTrades').textContent(), 'Your trades: 0');
    assert.deepEqual([...errors, ...enErrors], []);
  } finally {
    await isoContext.close();
  }
});

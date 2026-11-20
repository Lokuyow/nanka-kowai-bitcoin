// 図解スモーク: 全23話の触れる図解について、主要な操作を1〜2手行い、
// 状態表示が変化することだけを確認する（完走はしない）。
// 操作と観測要素の定義は site-data.mjs の smoke にある。

import { test, before, after } from 'node:test';
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

before(async () => {
  server = await startServer();
  browser = await launchBrowser();
  context = await newContext(browser);
});

after(async () => {
  await browser.close();
  await server.close();
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
  const offlineData = await newContext(browser, { serviceWorkers: 'block' });
  try {
    await offlineData.route(/^https:\/\//, (route) => route.abort());
    const { page, errors } = await openPage(offlineData, server.base + 'fee/');
    await page.waitForFunction(() => document.getElementById('feeNote').textContent.includes('実データを取得できなかった'));
    await page.locator('#sendBtn').click();
    assert.equal(await page.locator('#rFee').textContent(), '7,500円');
    await page.locator('.lang-toggle').click();
    assert.equal(await page.locator('#rFee').textContent(), '$50');
    assert.match(await page.locator('#feeNote').textContent(), /Live data could not be loaded/);
    assert.deepEqual(errors, []);
  } finally {
    await offlineData.close();
  }
});

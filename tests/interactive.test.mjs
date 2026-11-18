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

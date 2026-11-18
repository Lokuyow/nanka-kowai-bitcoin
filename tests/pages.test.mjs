// 全ページ健全性: 全25ページ（トップ＋404＋全23話）を幅375pxで開き、
// JSエラー0件・横スクロールなし・見出しあり を確認する。
// ※トップページは h1 を持たず、ヒーローのタイトル div が見出しを担う設計のため、
//   トップだけはヒーローの存在で代替する。

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PAGES } from './site-data.mjs';
import { startServer, launchBrowser, newContext, openPage } from './helpers.mjs';

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

for (const { name, path } of PAGES) {
  test(`健全性: ${name}`, async () => {
    const { page, errors } = await openPage(context, server.base + path);
    try {
      if (path === '') {
        assert.equal(await page.locator('.hero .t').count(), 1, 'ヒーローのタイトルがあること');
      } else {
        assert.equal(await page.locator('h1').count(), 1, 'h1 が1つあること');
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      assert.ok(overflow <= 0, `横スクロールが発生しています（超過 ${overflow}px）`);
      assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
    } finally {
      await page.close();
    }
  });
}

// 全25ページで主見出し、JSエラー、日英の横スクロールを確認する。

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
      assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1, '主見出しが1つあること');
      if (path === '') {
        assert.equal(await page.locator('.hero h1').count(), 1, 'サイト名が主見出しであること');
      }
      for (const width of [375, 320]) {
        await page.setViewportSize({ width, height: 667 });
        for (const lang of ['ja', 'en']) {
          if ((await page.locator('html').getAttribute('lang')) !== lang) {
            await page.locator('.lang-toggle').click();
          }
          assert.equal(await page.locator('html').getAttribute('lang'), lang);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth,
          );
          assert.ok(overflow <= 0, `幅${width}px（${lang}）で横スクロールが発生しています（超過 ${overflow}px）`);
        }
      }
      assert.deepEqual(errors, [], `JSエラーが発生しました: ${errors.join(' / ')}`);
    } finally {
      await page.close();
    }
  });
}

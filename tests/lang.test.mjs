// 言語（日本語／English）: 代表ページ（トップと各話）で、
// EN に切り替えると主要文字列が英語になること、辞書不足の警告が出ないこと、
// 日本語に戻すと元どおりになることを確認する。

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newContext } from './helpers.mjs';

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

const TARGETS = [
  { name: 'トップ', path: '', heading: '.hero h1' },
  { name: 'scam', path: 'scam/', heading: 'h1' },
  { name: 'hack', path: 'hack/', heading: 'h1' },
  { name: 'nation', path: 'nation/', heading: 'h1' },
];
const KANA = /[\u3040-\u30ff]/;

for (const { name, path, heading } of TARGETS) {
  test(`言語: ${name}`, async () => {
    const context = await newContext(browser);
    try {
      const page = await context.newPage();
      const missing = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning' && msg.text().includes('[i18n] missing translation')) {
          missing.push(msg.text());
        }
      });
      await page.goto(server.base + path, { waitUntil: 'load' });

      const jaTitle = await page.title();
      const jaHeading = await page.locator(heading).innerText();
      assert.equal(
        await page.evaluate(() => document.documentElement.getAttribute('data-lang')),
        'ja',
        '初期表示は日本語',
      );

      await page.locator('.lang-toggle').click();
      await page.waitForFunction(
        () => document.documentElement.getAttribute('data-lang') === 'en',
      );
      const enTitle = await page.title();
      const enHeading = await page.locator(heading).innerText();
      assert.ok(enTitle.includes('Bitcoin'), `英語タイトルになること: ${enTitle}`);
      assert.ok(!KANA.test(enHeading), `見出しが英語になること: ${enHeading}`);
      assert.notEqual(enHeading, jaHeading, '見出しが切り替わること');

      await page.locator('.lang-toggle').click();
      await page.waitForFunction(
        () => document.documentElement.getAttribute('data-lang') === 'ja',
      );
      assert.equal(await page.title(), jaTitle, '日本語に戻すとタイトルが元どおり');
      assert.equal(await page.locator(heading).innerText(), jaHeading, '見出しが元どおり');

      assert.deepEqual(missing, [], `辞書不足の警告が出ないこと: ${missing.join(' / ')}`);
      await page.close();
    } finally {
      await context.close();
    }
  });
}

test('言語: 英語環境で開始し、既存の設定が記事間で引き継がれる', async () => {
  const context = await newContext(browser, { locale: 'en-US' });
  try {
    const page = await context.newPage();
    await page.goto(server.base, { waitUntil: 'load' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('.head-right > span').textContent(), '23 stories');
    await page.locator('.lang-toggle').click();
    await page.locator('.unit').first().click();
    assert.equal(page.url(), server.base + 'scam/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
  } finally {
    await context.close();
  }
});

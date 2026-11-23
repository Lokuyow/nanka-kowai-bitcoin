// 言語（日本語／English）: 代表ページ（トップと各話）で、
// EN に切り替えると主要文字列が英語になること、辞書不足の警告が出ないこと、
// 日本語に戻すと元どおりになることを確認する。

import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newContext } from './helpers.mjs';

import { UNITS } from './site-data.mjs';

let server;
let browser;

beforeAll(async () => {
  server = await startServer();
  browser = await launchBrowser();
});

afterAll(async () => {
  try {
    await browser?.close();
  } finally {
    await server?.close();
  }
});

const TARGETS = [
  { name: 'トップ', path: '', heading: '.hero h1' },
  ...UNITS.map(({ slug }) => ({ name: slug, path: slug + '/', heading: 'h1' })),
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
    await page.getByText('23 stories', { exact: true }).waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.locator('.lang-toggle').click();
    await page.locator('.unit').first().click();
    assert.equal(page.url(), server.base + 'scam/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
  } finally {
    await context.close();
  }
});

test('言語: 日本語では英語辞書の取得を切り替えまで遅らせる', async () => {
  const context = await newContext(browser);
  try {
    const page = await context.newPage();
    const dictionaries = [];
    page.on('request', (request) => {
      const { pathname } = new URL(request.url());
      if (pathname.includes('/i18n-en.')) dictionaries.push(pathname);
    });
    await page.goto(server.base, { waitUntil: 'load' });
    assert.deepEqual(dictionaries, []);

    await page.locator('.lang-toggle').click();
    await page.getByText('23 stories', { exact: true }).waitFor();
    assert.equal(dictionaries.length, 1);
    assert.match(dictionaries[0], /\/i18n-en\.[a-f0-9]{16}\.js$/);
  } finally {
    await context.close();
  }
});

test('言語: 英語版の共有リンク（/en/）は日本語環境でも英語で開き、設定が引き継がれる', async () => {
  const context = await newContext(browser);
  try {
    const page = await context.newPage();
    const missing = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' && msg.text().includes('[i18n] missing translation')) missing.push(msg.text());
    });
    await page.goto(server.base + 'en/scam/', { waitUntil: 'load' });
    await page.locator('html[data-lang="en"]').waitFor({ state: 'attached' });
    await page.getByText('So Bitcoin is basically', { exact: false }).first().waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.title(), "So Bitcoin is basically a scam, right? | I don't really get it, but it's scary: Bitcoin");

    // 日本語に切り替えると日本語版の URL になり、タイトルも日本語に戻る。
    await page.locator('.lang-toggle').click();
    await page.locator('html[data-lang="ja"]').waitFor({ state: 'attached' });
    assert.equal(page.url(), server.base + 'scam/');
    assert.equal(await page.title(), '結局ビットコインって詐欺なんじゃないの？：なんか よくわからんけど こわい ビットコイン');

    // 英語に戻すと /en/ の URL になる。
    await page.locator('.lang-toggle').click();
    await page.locator('html[data-lang="en"]').waitFor({ state: 'attached' });
    assert.equal(page.url(), server.base + 'en/scam/');

    // 次の話へ進んでも英語のまま、URL も英語版になる。
    await page.goto(server.base + 'ceo/', { waitUntil: 'load' });
    await page.locator('html[data-lang="en"]').waitFor({ state: 'attached' });
    await page.waitForURL(server.base + 'en/ceo/');
    assert.deepEqual(missing, []);
  } finally {
    await context.close();
  }
});

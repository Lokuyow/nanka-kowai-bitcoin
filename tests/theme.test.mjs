// テーマ（ライト／ダーク）: トグルの切り替え・リロードでの保持・
// OS のダーク設定での初期表示を確認する。

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
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

const themeOf = (page) => page.evaluate(() => document.documentElement.getAttribute('data-theme'));

test('テーマ: トグルで切り替わり、リロードしても保持される', async () => {
  const context = await newContext(browser);
  try {
    const { page } = await openPage(context, server.base);
    assert.equal(await themeOf(page), 'light', '初期表示はライト');
    await page.locator('.theme-toggle').click();
    assert.equal(await themeOf(page), 'dark', 'トグルでダークになる');
    assert.equal(
      await page.evaluate(() => localStorage.getItem('theme')),
      'dark',
      'localStorage に保存される',
    );
    await page.reload({ waitUntil: 'load' });
    assert.equal(await themeOf(page), 'dark', 'リロードしてもダークのまま');
    await page.locator('.theme-toggle').click();
    assert.equal(await themeOf(page), 'light', 'もう一度押すとライトに戻る');
    await page.close();
  } finally {
    await context.close();
  }
});

test('テーマ: OS がダーク設定なら初期表示もダーク', async () => {
  const context = await newContext(browser, { colorScheme: 'dark' });
  try {
    const { page } = await openPage(context, server.base);
    assert.equal(await themeOf(page), 'dark', 'OS のダーク設定に従う');
    await page.close();
  } finally {
    await context.close();
  }
});

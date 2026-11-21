// テーマ（システム／ライト／ダークの3択）: 未保存は「端末に合わせる（system）」扱いで
// OS に追随すること、ボタンの循環（system → light → dark → system）と保存、
// 明示指定したときは OS に追随しないこと、保存済みの旧値（light/dark）が
// そのまま尊重されることを確認する。

import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newContext, openPage } from './helpers.mjs';

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

const themeOf = (page) => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
const prefOf = (page) => page.evaluate(() => document.documentElement.getAttribute('data-theme-pref'));
const savedOf = (page) => page.evaluate(() => localStorage.getItem('theme'));
const visibleIcon = (page) =>
  page.evaluate(() => {
    const btn = document.querySelector('.theme-toggle');
    return ['ic-sys', 'ic-sun', 'ic-moon'].find((c) => {
      const el = btn.querySelector('.' + c);
      return el && getComputedStyle(el).display !== 'none';
    });
  });

test('テーマ: 未保存は system 扱いで、ボタンが system → light → dark と循環し保持される', async () => {
  const context = await newContext(browser);
  try {
    const { page } = await openPage(context, server.base);
    assert.equal(await prefOf(page), 'system', '未保存の初期値は system');
    assert.equal(await themeOf(page), 'light', 'OS がライトなら表示もライト');
    assert.equal(await visibleIcon(page), 'ic-sys', 'system のアイコン（半分塗りの円）が見える');

    await page.locator('.theme-toggle').click();
    assert.equal(await prefOf(page), 'light', '1回押しでライト固定');
    assert.equal(await savedOf(page), 'light', 'localStorage に light が保存される');
    assert.equal(await visibleIcon(page), 'ic-sun', 'ライトのアイコン（太陽）が見える');

    await page.locator('.theme-toggle').click();
    assert.equal(await prefOf(page), 'dark', '2回押しでダーク固定');
    assert.equal(await themeOf(page), 'dark', '表示もダークになる');
    assert.equal(await visibleIcon(page), 'ic-moon', 'ダークのアイコン（月）が見える');

    await page.locator('.theme-toggle').click();
    assert.equal(await prefOf(page), 'system', '3回押しで system に戻る');
    assert.equal(await savedOf(page), 'system', 'localStorage に system が保存される');

    await page.reload({ waitUntil: 'load' });
    assert.equal(await prefOf(page), 'system', 'リロードしても system のまま');
    await page.close();
  } finally {
    await context.close();
  }
});

test('テーマ: OS がダーク設定なら system の初期表示もダーク、明示ライトにすれば OS より優先される', async () => {
  const context = await newContext(browser, { colorScheme: 'dark' });
  try {
    const { page } = await openPage(context, server.base);
    assert.equal(await prefOf(page), 'system', '未保存の初期値は system');
    assert.equal(await themeOf(page), 'dark', 'OS のダーク設定に従う');
    await page.locator('.theme-toggle').click();
    assert.equal(await prefOf(page), 'light', '1回押しでライト固定');
    assert.equal(await themeOf(page), 'light', 'OS がダークでもライト表示を維持する');
    await page.reload({ waitUntil: 'load' });
    assert.equal(await themeOf(page), 'light', 'リロードしてもライトのまま');
    await page.close();
  } finally {
    await context.close();
  }
});

test('テーマ: system のときだけ OS の変更にライブで追随する', async () => {
  const context = await newContext(browser, { colorScheme: 'light' });
  try {
    const { page } = await openPage(context, server.base);
    assert.equal(await themeOf(page), 'light', 'OS ライトで初期表示はライト');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');
    assert.equal(await themeOf(page), 'dark', 'system のときは OS の変更に追随する');

    await page.locator('.theme-toggle').click(); // system → light
    await page.locator('.theme-toggle').click(); // light → dark
    assert.equal(await prefOf(page), 'dark', 'ダーク固定にした');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(300);
    assert.equal(await themeOf(page), 'dark', '明示ダークのときは OS の変更に追随しない');
    await page.close();
  } finally {
    await context.close();
  }
});

test('テーマ: 保存済みの旧値（dark）はそのまま尊重される', async () => {
  const context = await newContext(browser);
  try {
    const page = await context.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    });
    await page.goto(server.base, { waitUntil: 'load' });
    assert.equal(await prefOf(page), 'dark', '保存済みの dark が設定として読まれる');
    assert.equal(await themeOf(page), 'dark', 'OS がライトでもダーク表示になる');
    assert.equal(await visibleIcon(page), 'ic-moon', '初期表示から月のアイコンが見える');
    await page.close();
  } finally {
    await context.close();
  }
});

// 全25ページで主見出し、JSエラー、日英の横スクロールを確認する。

import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { PAGES } from './site-data.mjs';
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

test('スマホでトップを再読み込みしても登場アニメーションでスクロール位置がずれない', async () => {
  const mobile = await newContext(browser, {
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  try {
    const { page } = await openPage(mobile, server.base);
    const waitForHero = () => page.locator('.peek').evaluate(async (peek) => {
      await Promise.all(peek.getAnimations({ subtree: true }).map((animation) => animation.finished));
    });

    await waitForHero();
    for (const scrollPosition of [160, 0]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollPosition);
      await page.waitForFunction((y) => window.scrollY === y, scrollPosition);
      await page.reload({ waitUntil: 'load' });
      await waitForHero();
      assert.equal(await page.evaluate(() => window.scrollY), scrollPosition);
    }
  } finally {
    await mobile.close();
  }
});

test('未知の深い URL に HTTP 404 を返し、設定とトップへのリンクが使える', async () => {
  const page = await context.newPage();
  try {
    const response = await page.goto(server.base + 'missing/deep/', { waitUntil: 'load' });
    assert.equal(response.status(), 404);
    const theme = await page.locator('html').getAttribute('data-theme-pref');
    await page.locator('.theme-toggle').click();
    assert.notEqual(await page.locator('html').getAttribute('data-theme-pref'), theme);
    await page.locator('a.btn').click();
    assert.equal(page.url(), server.base);
    assert.equal(await page.locator('.hero h1').count(), 1);
  } finally {
    await page.close();
  }
});

test('キーボードで本文に移動し、記事から層や一覧の元の位置に戻れる', async () => {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(server.base, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link:focus').count(), 1);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('main:focus').count(), 1);

    assert.equal(await page.locator('.hero a').count(), 1);
    await page.locator('.hero .action-primary').click();
    assert.equal(page.url(), server.base + 'scam/');
    await page.locator('.eyebrow').click();
    assert.equal(new URL(page.url()).hash, '#layer-1');
    await page.locator('#story-hack .unit').click();
    await page.locator('.eyebrow').click();
    assert.equal(new URL(page.url()).hash, '#layer-2');
    await page.locator('#story-hack .unit').click();
    assert.equal(page.url(), server.base + 'hack/');
    await page.locator('.read-next').click();
    assert.equal(page.url(), server.base + 'crime/');
    await page.locator('.tabbar .idx').click();

    assert.equal(page.url(), server.base + '#story-crime');
    const card = await page.locator('#story-crime:target').boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    assert.ok(card && header && card.y >= header.y + header.height && card.y < 844);
    assert.equal(await page.locator('.unit:focus').count(), 0);

    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.locator('.unit:focus').count(), 0);
    await page.locator('#story-hack .unit').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#story-crime .unit:focus-visible').count(), 1);
    await page.keyboard.press('Enter');
    await page.waitForURL(server.base + 'crime/');
    await page.goBack({ waitUntil: 'load' });
    assert.equal(page.url(), server.base + '#story-crime');
    assert.equal(await page.locator('.unit:focus').count(), 0);
  } finally {
    await page.close();
  }
});

import { test } from 'vitest';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newContext } from './helpers.mjs';

test('シェア: 日英の文言・X の URL・コピーするテキストが一致する', async () => {
  const server = await startServer();
  let browser;
  try {
    browser = await launchBrowser();
    const context = await newContext(browser);
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'share', {
        value: async (data) => { window.sharedData = data; }
      });
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (text) => { window.copiedText = text; } }
      });
    });

    const page = await context.newPage();
    await page.goto(server.base + 'ban/', { waitUntil: 'load' });
    const url = 'https://lokuyow.github.io/nanka-kowai-bitcoin/ban/';
    const expected = [
      {
        title: '国が禁止したら、ビットコインは終わりでしょ？',
        text: '国内の活動が規制されても、国外の参加者はネットワークを動かし続けられる。',
        url
      },
      {
        title: 'If a country bans it, Bitcoin is finished, right?',
        text: 'A ban can restrict activity at home while participants abroad keep the network running.',
        url
      }
    ];
    for (const data of expected) {
      await page.locator('.share-main').click();
      assert.deepEqual(await page.evaluate(() => window.sharedData), data);
      const xLink = new URL(await page.locator('.share-x').getAttribute('href'));
      assert.equal(xLink.searchParams.get('text'), data.title);
      assert.equal(xLink.searchParams.get('url'), url);
      await page.locator('.share-copytext').click();
      assert.equal(await page.evaluate(() => window.copiedText), [data.title, data.text, url].join('\n'));
      await page.locator('.lang-toggle').click();
    }
  } finally {
    try {
      await browser?.close();
    } finally {
      await server.close();
    }
  }
});

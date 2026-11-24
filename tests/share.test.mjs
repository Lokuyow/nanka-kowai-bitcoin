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
        title: '国が禁止したらビットコインは終わりでしょ？',
        url
      },
      {
        title: 'If a country bans it, Bitcoin is finished, right?',
        url: 'https://lokuyow.github.io/nanka-kowai-bitcoin/en/ban/'
      }
    ];
    for (const [index, data] of expected.entries()) {
      if (index === 1) {
        await page.locator('.lang-toggle').click();
        await page.locator('html[lang="en"]').waitFor();
      }
      await page.locator('.share-main').click();
      assert.deepEqual(await page.evaluate(() => window.sharedData), data);
      await page.locator('.share-copytext').click();
      assert.equal(await page.evaluate(() => window.copiedText), [data.title, data.url].join('\n'));
    }
  } finally {
    try {
      await browser?.close();
    } finally {
      await server.close();
    }
  }
});

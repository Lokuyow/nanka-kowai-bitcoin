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
        text: '世界中で動く仕組みだから、一国では止められない。実際に禁止した国でも消えていない',
        url
      },
      {
        title: 'If a country bans it, Bitcoin is finished, right?',
        text: 'Because it runs all over the world, one country cannot stop it. It did not vanish even from the country that banned it',
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

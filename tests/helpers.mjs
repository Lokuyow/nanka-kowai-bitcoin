// テスト共通の道具立て。
// - ビルド結果を本番と同じパス（/nanka-kowai-bitcoin/）で配信するローカルサーバー
// - Playwright のブラウザ／コンテキスト生成
// - 図解スモークテストのステップ実行と「表示が変わるまで待つ」ヘルパー

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { BASE_PATH } from './site-data.mjs';

export const BUILD_DIR = fileURLToPath(new URL('../build', import.meta.url));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

// ビルド結果を BASE_PATH 配下で配信するサーバーを立てる。
// 存在しないパスには GitHub Pages と同じく 404.html を 404 で返す。
export async function startServer({ onRequest = () => {}, getBuildDir = () => BUILD_DIR } = {}) {
  const server = http.createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      onRequest(pathname);
      if (!pathname.startsWith(BASE_PATH)) {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('not found');
        return;
      }
      let rel = pathname.slice(BASE_PATH.length);
      if (rel === '' || rel.endsWith('/')) rel += 'index.html';
      const buildDir = getBuildDir(pathname);
      const file = path.join(buildDir, rel);
      if (!file.startsWith(buildDir + path.sep)) throw new Error('bad path');
      const body = await readFile(file);
      res.writeHead(200, {
        'content-type': MIME[path.extname(file)] || 'application/octet-stream',
      });
      res.end(body);
    } catch {
      try {
        const body = await readFile(path.join(getBuildDir(), '404.html'));
        res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
        res.end(body);
      } catch {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('not found');
      }
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    base: `http://127.0.0.1:${port}${BASE_PATH}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

export async function launchBrowser() {
  return chromium.launch({ args: ['--no-sandbox'] });
}

// 幅375px・日本語ロケールを既定にし、外部通信を遮断する。
// Service Worker は PWA テストでのみ有効にする。
export async function newContext(browser, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    locale: 'ja-JP',
    serviceWorkers: 'block',
    ...options,
  });
  await context.route(/^https:\/\//, (route) => route.abort());
  return context;
}

// ページを開き、JSエラー（pageerror）を集める配列を返す
export async function openPage(context, url) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  await page.goto(url, { waitUntil: 'load' });
  return { page, errors };
}

// 要素の innerHTML が before と変わるまで待つ（変わらなければ例外）
export async function waitForHtmlChange(page, selector, before, timeout = 6000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    const now = await page.$eval(selector, (el) => el.innerHTML);
    if (now !== before) return now;
    if (Date.now() > deadline) {
      throw new Error(`${selector} の表示が ${timeout}ms 以内に変化しませんでした`);
    }
    await page.waitForTimeout(100);
  }
}

// range入力を指定値へ動かす。to が 'toggle' のときは今いる側と反対の端へ寄せる
async function setRange(page, selector, to) {
  await page.$eval(
    selector,
    (el, target) => {
      const min = Number(el.min || 0);
      const max = Number(el.max || 100);
      let value;
      if (target === 'toggle') {
        value = Number(el.value) - min <= (max - min) / 2 ? max : min;
      } else {
        value = Math.min(max, Math.max(min, Number(target)));
      }
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    to,
  );
}

// site-data の smoke.steps を上から順に実行する
export async function runSmokeSteps(page, steps) {
  for (const step of steps) {
    if (step.click) {
      await page.locator(step.click).click();
    } else if (step.clickFirst) {
      await page.locator(step.clickFirst).first().click();
    } else if (step.range) {
      await setRange(page, step.range, step.to);
    } else if (step.hold) {
      await page.locator(step.hold).scrollIntoViewIfNeeded();
      const box = await page.locator(step.hold).boundingBox();
      if (!box) throw new Error(`${step.hold} の位置が取得できませんでした`);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(step.ms || 600);
      await page.mouse.up();
    } else {
      throw new Error(`未知のステップです: ${JSON.stringify(step)}`);
    }
  }
}

// 整合性チェック（ブラウザ不要・ファイルの静的解析）:
// - 各話の <title> と h1 の一致
// - ヘッダーの話数（n / 23）
// - 前後ナビの鎖（1→23）と一覧リンク
// - トップのカード23件と各話 h1 の一致
// - 内部リンク切れなし
// - ogp.png が 1200×630

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './helpers.mjs';
import { SITE_TITLE, UNITS, BASE_PATH } from './site-data.mjs';

const read = (rel) => readFile(path.join(ROOT, rel), 'utf8');

function stripTags(html) {
  return html.replace(/<br\s*\/?>/g, '').replace(/<[^>]*>/g, '');
}

function getTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/);
  assert.ok(m, '<title> があること');
  return m[1];
}

function getH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  assert.ok(m, '<h1> があること');
  return stripTags(m[1]);
}

test('各話の title と h1 が一致する', async () => {
  for (const { slug } of UNITS) {
    const html = await read(`${slug}/index.html`);
    assert.equal(getTitle(html), `${getH1(html)}：${SITE_TITLE}`, slug);
  }
});

test('ヘッダーの話数が n / 23 で正しい', async () => {
  for (const [i, { slug }] of UNITS.entries()) {
    const html = await read(`${slug}/index.html`);
    assert.ok(html.includes(`${i + 1} / 23`), `${slug}: ヘッダーに ${i + 1} / 23 があること`);
  }
});

test('前後ナビの鎖が 1→23 でつながっている', async () => {
  for (const [i, { slug }] of UNITS.entries()) {
    const html = await read(`${slug}/index.html`);
    const nav = html.match(/<nav>([\s\S]*?)<\/nav>/);
    assert.ok(nav, `${slug}: <nav> があること`);
    const hrefs = [...nav[1].matchAll(/<a[^>]* href="([^"]+)"/g)].map((m) => m[1]);
    const expected = [];
    if (i > 0) expected.push(`../${UNITS[i - 1].slug}/`);
    expected.push('../');
    if (i < UNITS.length - 1) expected.push(`../${UNITS[i + 1].slug}/`);
    assert.deepEqual(hrefs, expected, `${slug}: 前・一覧・次の順で正しいこと`);
  }
});

test('トップのカード23件が各話の h1 と一致する', async () => {
  const top = await read('index.html');
  const cards = [...top.matchAll(/<a class="unit" href="([^"]+)\/">([\s\S]*?)<\/a>/g)];
  assert.equal(cards.length, UNITS.length, 'カードが23件あること');
  for (const [i, { slug }] of UNITS.entries()) {
    assert.equal(cards[i][1], slug, `カード${i + 1}件目のリンク先`);
    const q = cards[i][2].match(/<span class="q"[^>]*>([\s\S]*?)<\/span>/);
    assert.ok(q, `${slug}: カードの見出しがあること`);
    const unitHtml = await read(`${slug}/index.html`);
    assert.equal(stripTags(q[1]), getH1(unitHtml), `${slug}: カード見出しと h1 の一致`);
  }
});

test('内部リンク切れがない', async () => {
  const files = ['index.html', '404.html', ...UNITS.map((u) => `${u.slug}/index.html`)];
  const missing = [];
  for (const rel of files) {
    const html = await read(rel);
    const pageDir = path.posix.dirname(rel) === '.' ? '' : path.posix.dirname(rel);
    const attrs = [
      ...html.matchAll(/<(?:a|link|script|img)[^>]* (?:href|src)="([^"]+)"/g),
      ...html.matchAll(/<meta property="og:image" content="([^"]+)"/g),
    ].map((m) => m[1]);
    for (const raw of attrs) {
      let pathname;
      if (/^https?:\/\//.test(raw)) {
        const url = new URL(raw);
        if (url.hostname !== 'lokuyow.github.io' || !url.pathname.startsWith(BASE_PATH)) continue;
        pathname = url.pathname.slice(BASE_PATH.length);
      } else if (/^(#|mailto:|data:|javascript:)/.test(raw)) {
        continue;
      } else if (raw.startsWith(BASE_PATH)) {
        pathname = raw.slice(BASE_PATH.length);
      } else {
        pathname = path.posix.normalize(path.posix.join(pageDir, raw));
      }
      pathname = decodeURIComponent(pathname.split(/[?#]/)[0]);
      const target =
        pathname === '' || pathname.endsWith('/')
          ? path.join(ROOT, pathname, 'index.html')
          : path.join(ROOT, pathname);
      try {
        await access(target);
      } catch {
        missing.push(`${rel} -> ${raw}`);
      }
    }
  }
  assert.deepEqual(missing, [], `リンク切れ: ${missing.join(' / ')}`);
});

test('ogp.png が 1200×630', async () => {
  const targets = ['ogp.png', ...UNITS.map((u) => `${u.slug}/ogp.png`)];
  for (const rel of targets) {
    const buf = await readFile(path.join(ROOT, rel));
    assert.equal(buf.toString('ascii', 1, 4), 'PNG', `${rel}: PNG であること`);
    assert.equal(buf.readUInt32BE(16), 1200, `${rel}: 幅1200`);
    assert.equal(buf.readUInt32BE(20), 630, `${rel}: 高さ630`);
  }
});

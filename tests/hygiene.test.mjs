// 衛生チェック（ブラウザ不要・ファイルの静的解析）:
// - 英語辞書に未使用キーがたまっていないこと（Issue #9 の再発防止）
// - ビルド成果物にフィンガープリント前の元ファイルが残っていないこと（Issue #12 の再発防止）
// - テーマ色のコントラスト比が WCAG AA を満たすこと（Issue #13 の再発防止）

import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { BUILD_DIR } from './helpers.mjs';

const ROOT = path.resolve(BUILD_DIR, '..');
const TEXT_EXT = new Set(['.js', '.mjs', '.html', '.svelte', '.css', '.json', '.md', '.txt']);

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, base)));
    else out.push(path.relative(base, full));
  }
  return out;
}

test('英語辞書に未使用キーがない', async () => {
  const { default: dict } = await import('../static/i18n-en.js');
  const parts = [];
  const collect = async (dir, skip = () => false) => {
    for (const rel of await walk(dir)) {
      if (skip(rel) || !TEXT_EXT.has(path.extname(rel))) continue;
      parts.push(await readFile(path.join(dir, rel), 'utf8'));
    }
  };
  await collect(path.join(ROOT, 'src'));
  await collect(path.join(ROOT, 'static'), (rel) => rel === 'i18n-en.js');
  await collect(path.join(ROOT, 'scripts'));
  await collect(path.join(ROOT, 'tests'));
  // ビルド済み HTML には <title> など、ソースに直接は現れない合成キーも含まれる。
  // _app の JS は辞書自身を含むので除く。
  for (const rel of await walk(BUILD_DIR)) {
    if (rel.startsWith('_app') || !rel.endsWith('.html')) continue;
    parts.push(await readFile(path.join(BUILD_DIR, rel), 'utf8'));
  }
  const corpus = parts.join('\n');
  const unused = Object.keys(dict).filter((key) => !corpus.includes(key));
  assert.deepEqual(unused, [], `未使用の辞書キーがあります: ${unused.join(' / ')}`);
});

test('ビルド成果物にフィンガープリント前の元ファイルが残っていない', async () => {
  const files = await walk(BUILD_DIR);
  const fileSet = new Set(files);
  const leftovers = [];
  for (const rel of files) {
    const m = path.basename(rel).match(/\.([a-f0-9]{16})(\.[^.]+)$/);
    if (!m || rel.endsWith('.html')) continue; // ページ HTML は素とハッシュ付きの両方が正規
    const original = rel.replace(`.${m[1]}${m[2]}`, m[2]);
    // manifest だけは素の URL で取得される仕様のため、元ファイルの併存が正しい
    if (original === 'manifest.webmanifest') continue;
    if (fileSet.has(original)) leftovers.push(original);
  }
  assert.deepEqual(leftovers, [], `元ファイルが残っています: ${leftovers.join(' / ')}`);
});

function parseVars(css, blockPattern) {
  const block = css.match(blockPattern)?.[1] || '';
  const vars = {};
  for (const m of block.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)) vars[m[1]] = m[2];
  return vars;
}

function luminance(hex) {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('テーマ色のコントラスト比が WCAG AA を満たす', async () => {
  const css = await readFile(path.join(ROOT, 'static/styles/base.css'), 'utf8');
  const light = parseVars(css, /:root\{([^}]*)\}/);
  const dark = { ...light, ...parseVars(css, /:root\[data-theme="dark"\]\{([^}]*)\}/) };
  // 本文・補足・状態色など、文字として読む組み合わせ
  const textPairs = [
    ['ink', 'bg'], ['ink', 'card'],
    ['sub', 'bg'], ['sub', 'card'],
    ['red', 'bg'], ['red', 'card'],
    ['green', 'bg'], ['green', 'card'],
    ['color-secondary', 'color-secondary-bg'],
    ['color-on-primary', 'color-primary'],
    ['btnfg', 'btnbg'],
  ];
  for (const [name, vars] of [['ライト', light], ['ダーク', dark]]) {
    for (const [fg, bg] of textPairs) {
      const ratio = contrast(vars[fg], vars[bg]);
      assert.ok(ratio >= 4.5, `${name}: --${fg} / --${bg} のコントラスト比 ${ratio.toFixed(2)} が 4.5 未満です`);
    }
  }
  // アクセント色は見出しやリンクの大きな文字が中心
  assert.ok(contrast(light['color-primary'], light['bg']) >= 4.5, 'ライト: --color-primary / --bg が 4.5 未満です');
  assert.ok(contrast(dark['color-primary'], dark['bg']) >= 3.0, 'ダーク: --color-primary / --bg が 3.0 未満です');
});

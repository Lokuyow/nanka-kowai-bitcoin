// サイトアイコン・ファビコン・PWA アイコン・OGP 画像をまとめて生成する。
// デザインを変えたときだけ手動で実行し、生成物をコミットする（ビルドには含めない）。
//   node scripts/generate-images.js
// OGP の本文は端末にインストールされた Noto Sans JP で描くので、事前に入れておくこと。
import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOME, LAYERS, SITE_TITLE } from '../src/lib/site.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATIC = path.join(ROOT, 'static');

const COLORS = {
  tile: '#e895b0',
  ghost: '#fff',
  face: '#1e1410',
  coin: '#ffd36b',
  coinInk: '#2a1a14',
  bg: '#f7f7f5',
  ink: '#1a1a1a',
  sub: '#666',
  primary: '#fe3e7e',
  accentText: '#d42a63'
};

const GHOST_BODY =
  'M22 78C21 55 24 30 38 20 47 13 60 14 66 24 71 33 70 46 73 56 76 66 81 72 86 76 88 78 87 80 84 81 79 83 74 83 70 82 66 81 64 84 63 87 62 90 58 90 54 89 48 87 42 86 37 88 32 90 26 89 23 85 22 83 22 81 22 78Z';
const HAND_LEFT = 'M30.5 63.5C34 61 38.5 62.5 39 66.5 39.5 70.5 35.5 73 32 72 28.5 71 27.5 66 30.5 63.5Z';
const HAND_RIGHT = 'M65.5 63.5C62 61 57.5 62.5 57 66.5 56.5 70.5 60.5 73 64 72 67.5 71 68.5 66 65.5 63.5Z';
// ₿ をフォントに頼らず線で描く（コインの中心を原点にした座標）
const BITCOIN_SIGN =
  'M-4.6-6.6V6.6M-4.6-6.6H1A3.25 3.25 0 0 1 1 -.1H-4.6M-4.6-.1H1.8A3.35 3.35 0 0 1 1.8 6.6H-4.6M-2.4-9.2V-6.6M.9-9.2V-6.6M-2.4 6.6V9.2M.9 6.6V9.2';

// おばけ本体（100×100 の座標）
function ghost({ simple = false } = {}) {
  if (simple) {
    // 16px 用：₿ と手と口を省き、目とコインを大きくする
    return `<g transform="translate(1 2)">
  <path d="${GHOST_BODY}" fill="${COLORS.ghost}"/>
  <ellipse cx="40" cy="37" rx="5.5" ry="6.5" fill="${COLORS.face}"/>
  <ellipse cx="55" cy="39" rx="5.5" ry="6.5" fill="${COLORS.face}"/>
  <circle cx="48" cy="70" r="16" fill="${COLORS.coin}" stroke="${COLORS.coinInk}" stroke-width="3"/>
</g>`;
  }
  return `<g transform="translate(1 2)">
  <path d="${GHOST_BODY}" fill="${COLORS.ghost}"/>
  <ellipse cx="40" cy="37" rx="4" ry="5" transform="rotate(-10 40 37)" fill="${COLORS.face}"/>
  <ellipse cx="55" cy="39" rx="3.8" ry="5" transform="rotate(8 55 39)" fill="${COLORS.face}"/>
  <path d="M43.5 46.5Q48.5 47.8 53 47.2 53.2 53 48.3 53.6 43.8 53.3 43.5 46.5Z" fill="${COLORS.face}"/>
  <g transform="translate(48 70) rotate(-28)">
    <circle r="15" fill="${COLORS.coin}" stroke="${COLORS.coinInk}" stroke-width="2"/>
    <path d="${BITCOIN_SIGN}" fill="none" stroke="${COLORS.coinInk}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" transform="translate(-.4 0)"/>
  </g>
  <path d="${HAND_LEFT}" fill="${COLORS.ghost}" transform="translate(-1 -4)"/>
  <path d="${HAND_RIGHT}" fill="${COLORS.ghost}" transform="translate(1 4)"/>
</g>`;
}

// おばけの見た目の中心（裾の流れを除いた胴体寄り）
const GHOST_CENTER = [54, 53];

// rounded: 角丸タイル（透過）／ scale: タイルに対するおばけの大きさ
function iconSvg({ rounded = true, scale = 0.9, simple = false } = {}) {
  const bg = rounded
    ? `<rect width="100" height="100" rx="22" fill="${COLORS.tile}"/>`
    : `<rect width="100" height="100" fill="${COLORS.tile}"/>`;
  const [cx, cy] = GHOST_CENTER;
  const body = `<g transform="translate(50 50) scale(${scale}) translate(${-cx} ${-cy})">${ghost({ simple })}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${bg}${body}</svg>`;
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

async function renderPng(page, html, width, height, { transparent = false } = {}) {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:transparent}
      body>svg{display:block;width:${width}px;height:${height}px}
    </style></head><body>${html}</body></html>`,
    { waitUntil: 'load' }
  );
  await page.evaluate(() => document.fonts.ready);
  return page.screenshot({ type: 'png', omitBackground: transparent, clip: { x: 0, y: 0, width, height } });
}

// PNG をそのまま埋め込む形式の ICO を組み立てる
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function ogpHtml(body, extraStyle) {
  const font = await readFile(path.join(STATIC, 'fonts', 'm-plus-1-code-title.woff2'));
  return `<style>
    @font-face{font-family:"M PLUS 1 Code";src:url(data:font/woff2;base64,${font.toString('base64')}) format("woff2");font-weight:600}
    .ogp{box-sizing:border-box;width:1200px;height:630px;background:${COLORS.bg};color:${COLORS.ink};
      font-family:"Noto Sans JP",sans-serif;position:relative;overflow:hidden}
    .code{font-family:"M PLUS 1 Code","Noto Sans JP",sans-serif;font-weight:600}
    .tile svg{display:block;width:100%;height:100%}
    ${extraStyle}
  </style><div class="ogp">${body}</div>`;
}

async function renderOgp(page, html) {
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}</style></head><body>${html}</body></html>`, {
    waitUntil: 'load'
  });
  await page.evaluate(() => document.fonts.ready);
  // 見出しが3行・幅に収まるまで文字を小さくする
  await page.evaluate(() => {
    const h = document.querySelector('.fit');
    if (!h) return;
    let size = parseFloat(getComputedStyle(h).fontSize);
    const maxHeight = parseFloat(h.dataset.maxHeight);
    while (size > 36 && (h.scrollWidth > h.clientWidth || h.scrollHeight > maxHeight)) {
      size -= 2;
      h.style.fontSize = size + 'px';
    }
  });
  return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
}

async function homeOgp() {
  const [l1, l2, l3, l4] = ['なんか', 'よくわからんけど', 'こわい', 'ビットコイン'];
  return ogpHtml(
    `<div class="text">
      <p class="title code"><span>${l1}</span><span>${l2}</span><span class="hl">${l3}</span><span>${l4}</span></p>
      <p class="lead">ニュースで見たイメージと、ほんとの姿。</p>
    </div>
    <div class="tile">${iconSvg()}</div>`,
    `.text{position:absolute;left:84px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
     .title{margin:0;font-size:68px;line-height:1.28;letter-spacing:.02em}
     .title span{display:block;white-space:nowrap}
     .hl{color:${COLORS.primary}}
     .lead{margin:30px 0 0;font-size:28px;font-weight:500;color:${COLORS.sub}}
     .tile{position:absolute;right:84px;top:125px;width:380px;height:380px}`
  );
}

async function articleOgp(heading) {
  return ogpHtml(
    `<p class="brand code">${escapeHtml(SITE_TITLE)}</p>
    <h1 class="fit" data-max-height="210">${heading}</h1>
    <p class="foot">誤解をひとつずつほどいていく</p>
    <div class="tile">${iconSvg()}</div>`,
    `.brand{position:absolute;left:84px;top:72px;margin:0;font-size:30px;color:${COLORS.sub};word-spacing:-.3em}
     h1{position:absolute;left:84px;right:84px;top:170px;margin:0;font-size:68px;font-weight:800;line-height:1.45;letter-spacing:.01em;white-space:nowrap}
     .foot{position:absolute;left:84px;bottom:72px;margin:0;font-size:30px;font-weight:700;color:${COLORS.accentText}}
     .tile{position:absolute;right:84px;bottom:56px;width:180px;height:180px}`
  );
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  // ファビコン（SVG）と PWA・ホーム画面用アイコン
  await writeFile(path.join(STATIC, 'favicon.svg'), iconSvg() + '\n');
  await mkdir(path.join(STATIC, 'icons'), { recursive: true });
  const icons = [
    ['icons/icon-192.png', 192, { rounded: true }, true],
    ['icons/icon-512.png', 512, { rounded: true }, true],
    // maskable は端末側で切り抜かれるので全面塗りにし、中央 80% の安全域に収める
    ['icons/icon-maskable-512.png', 512, { rounded: false, scale: 0.76 }, false],
    // iOS が角を丸めるので全面塗り
    ['icons/apple-touch-icon.png', 180, { rounded: false, scale: 0.84 }, false]
  ];
  for (const [rel, size, options, transparent] of icons) {
    await writeFile(path.join(STATIC, rel), await renderPng(page, iconSvg(options), size, size, { transparent }));
  }
  const ico = [];
  for (const [size, simple] of [[16, true], [32, false], [48, false]]) {
    ico.push({ size, data: await renderPng(page, iconSvg({ simple }), size, size, { transparent: true }) });
  }
  await writeFile(path.join(STATIC, 'favicon.ico'), buildIco(ico));

  // OGP
  await writeFile(path.join(STATIC, 'ogp.png'), await renderOgp(page, await homeOgp()));
  for (const layer of LAYERS) {
    for (const article of layer.articles) {
      await mkdir(path.join(STATIC, article.slug), { recursive: true });
      await writeFile(path.join(STATIC, article.slug, 'ogp.png'), await renderOgp(page, await articleOgp(article.heading)));
    }
  }
  console.log(`generated icons and ${1 + LAYERS.flatMap((l) => l.articles).length} OGP images (${HOME.title})`);
} finally {
  await browser.close();
}

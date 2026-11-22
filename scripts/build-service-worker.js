import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { ARTICLES, BASE_PATH } from '../src/lib/site.js';

const buildDir = 'build';
const files = (await readdir(buildDir, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => path.relative(buildDir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
  .sort();

const pages = ['', ...ARTICLES.map(({ slug }) => slug + '/'), '404.html'];
const fonts = files.filter((file) => file.startsWith('fonts/') && file.endsWith('.woff2'));
const assets = files.filter((file) =>
  file.startsWith('scripts/') || file.startsWith('styles/') || file.startsWith('icons/') ||
  file.startsWith('media/') ||
  ['i18n.js', 'i18n-en.js', 'livedata.js', 'favicon.svg', 'favicon.ico', 'brand-mark.svg', 'ghost-lost.svg'].includes(file)
);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex').slice(0, 16);
const assetUrls = new Map();
const site = new URL(BASE_PATH, 'https://example.invalid');

async function fingerprint(file, bytes) {
  const ext = path.extname(file);
  const versioned = file.slice(0, -ext.length) + '.' + hash(bytes) + ext;
  await writeFile(path.join(buildDir, versioned), bytes);
  return BASE_PATH + versioned;
}

for (const file of [...fonts, ...assets]) {
  let bytes = await readFile(path.join(buildDir, file));
  if (file.endsWith('.css')) {
    const cssUrl = new URL(file, site);
    bytes = bytes.toString('utf8').replace(/url\("(\.\.\/fonts\/[^"\n]+\.woff2)"\)/g, (match, source) => {
      const versioned = assetUrls.get(new URL(source, cssUrl).pathname);
      return versioned ? `url("${versioned}")` : match;
    });
  }
  assetUrls.set(BASE_PATH + file, await fingerprint(file, bytes));
}

const manifestFile = 'manifest.webmanifest';
const manifest = JSON.parse(await readFile(path.join(buildDir, manifestFile), 'utf8'));
for (const icon of manifest.icons) {
  icon.src = assetUrls.get(icon.src) ?? icon.src;
}
assetUrls.set(BASE_PATH + manifestFile, await fingerprint(manifestFile, JSON.stringify(manifest)));

const precache = Object.fromEntries([...assetUrls.values()].map((url) => [url, url]));
for (const page of pages) {
  const file = page.endsWith('.html') ? page : page + 'index.html';
  const filename = path.join(buildDir, file);
  const pageUrl = new URL(page, site);
  const html = await readFile(filename, 'utf8');
  const rewritten = html.replace(
    /<(?:link|script|img|source)\b[^>]*>/g,
    (tag) => tag.replace(
      /(\s(?:href|src|srcset|data-dictionary)=")([^"]+)"/g,
      (match, prefix, source) => {
        const url = new URL(source, pageUrl);
        const versioned = url.origin === site.origin && assetUrls.get(url.pathname);
        return versioned ? prefix + versioned + url.search + url.hash + '"' : match;
      },
    ),
  );
  await writeFile(filename, rewritten);
  precache[pageUrl.pathname] = await fingerprint(file, rewritten);
}

await build({
  configFile: false,
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    BASE: JSON.stringify(BASE_PATH),
    PRECACHE: JSON.stringify(precache)
  },
  build: {
    outDir: buildDir,
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL('./service-worker.js', import.meta.url)),
      name: 'SiteWorker',
      formats: ['iife'],
      fileName: () => 'sw.js'
    }
  }
});

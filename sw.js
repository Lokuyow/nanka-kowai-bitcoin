/* なんか よくわからんけど こわい ビットコイン — Service Worker
 *
 * 方針: 古い内容が残り続けないことを優先する。
 * - HTML と JS(i18n.js) は network-first（取れたらキャッシュを更新、失敗したらキャッシュ）
 * - 画像などの静的アセットは cache-first
 * - 更新時は SW_VERSION を上げること。キャッシュ名が変わり、activate で旧キャッシュを
 *   削除して総入れ替えになる（README 参照）。
 */
const SW_VERSION = '18';
const CACHE_PREFIX = 'kowai-bitcoin-v';
const CACHE_NAME = CACHE_PREFIX + SW_VERSION;
const BASE = '/nanka-kowai-bitcoin/';

const UNITS = [
  'scam', 'ceo', 'price', 'fee', 'satoshi',
  'hack', 'crime', 'energy', 'ban',
  'quantum', '51', 'ai', 'reward', 'limit', 'infinite', 'tulip', 'value',
  'money', 'freedom', 'fair', 'death', 'future', 'nation',
];

const PRECACHE = [
  BASE,
  BASE + '404.html',
  ...UNITS.map((u) => BASE + u + '/'),
  BASE + 'i18n.js',
  BASE + 'livedata.js',
  BASE + 'favicon.svg',
  BASE + 'manifest.webmanifest',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
  BASE + 'icons/icon-maskable-512.png',
  BASE + 'icons/apple-touch-icon.png',
  // ceo/news-telop.jpg は /ceo/ 専用の大きな写真なのでプリキャッシュしない。
  // /ceo/ を開いたときに cache-first の実行時キャッシュへ入る。
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// network-first: 取得できたらキャッシュを更新して返し、失敗したらキャッシュを返す
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw e;
  }
}

// cache-first: キャッシュにあればそれを返し、なければ取得してキャッシュに入れる
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// 404 ページは未知の深い URL でも配信されるため、相対パスの i18n.js が
// その階層で解決されてしまうことがある。取得もキャッシュもできない場合は、
// ルート直下にプリキャッシュ済みの同名ファイルで代替する（オフライン時のみ効く）
async function fallbackByFilename(request) {
  const url = new URL(request.url);
  const name = url.pathname.split('/').pop();
  if (!name || !PRECACHE.includes(BASE + name)) return null;
  const cache = await caches.open(CACHE_NAME);
  return (await cache.match(BASE + name)) || null;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE)) return;

  // ページ遷移: network-first。未キャッシュでオフラインなら 404 ページを返す
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match(BASE + '404.html');
        return fallback || Response.error();
      })
    );
    return;
  }

  // HTML / JS は network-first（古い内容を残さない）
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('.js')) {
    event.respondWith(
      networkFirst(request).catch(async () => {
        const fallback = await fallbackByFilename(request);
        return fallback || Response.error();
      })
    );
    return;
  }

  // それ以外（画像・アイコン・manifest 等）は cache-first
  event.respondWith(cacheFirst(request));
});

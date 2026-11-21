import { PrecacheController } from 'workbox-precaching';

// BASE and PRECACHE are generated from the published site.
const CACHE_PREFIX = 'kowai-bitcoin-v';
const CACHE_NAME = CACHE_PREFIX + '3-workbox';
const precache = new PrecacheController({ cacheName: CACHE_NAME });
const urls = [...new Set(Object.values(PRECACHE))];
precache.addToCacheList(urls.map((url) => ({ url, revision: null })));

async function reuseLegacyEntries() {
  const legacyName = (await caches.keys()).filter((name) => name.startsWith(CACHE_PREFIX + '2-')).at(-1);
  if (!legacyName) return;

  const legacy = await caches.open(legacyName);
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(urls.map(async (url) => {
    const response = await legacy.match(url);
    if (response) await cache.put(url, response);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    await reuseLegacyEntries();
    await precache.install(event);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await precache.activate(event);
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function navigate(request, url) {
  // Use the active release for internal links. Direct visits and recognized reloads check the server.
  const isReload = request.isReloadNavigation ?? (request.cache !== 'default');
  if (!isReload && !url.search && request.referrer.startsWith(self.location.origin + BASE)) {
    const page = PRECACHE[url.pathname];
    const cached = page && await precache.matchPrecache(page);
    if (cached) return cached;
  }

  try {
    return await fetch(request, { cache: 'no-cache' });
  } catch (error) {
    const pagePath = url.pathname.replace(/\/index\.html$/, '/');
    const page = PRECACHE[pagePath.endsWith('/') || pagePath.endsWith('.html') ? pagePath : pagePath + '/'];
    const cached = page && await precache.matchPrecache(page);
    if (cached) return cached;

    const notFound = await precache.matchPrecache(PRECACHE[BASE + '404.html']);
    if (notFound) return new Response(notFound.body, { status: 404, headers: notFound.headers });
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (request.mode === 'navigate') {
    event.respondWith(navigate(request, url));
  } else if (precache.getCacheKeyForURL(url.pathname)) {
    event.respondWith(precache.matchPrecache(url.pathname).then((cached) => cached ?? fetch(request)));
  }
});

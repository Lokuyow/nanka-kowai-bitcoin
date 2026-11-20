// BASE, VERSION, and PRECACHE are generated from the published site.
const CACHE_PREFIX = 'kowai-bitcoin-v';
const CACHE_NAME = CACHE_PREFIX + VERSION;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const outdated = names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME);
    await Promise.all(outdated.map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function fetchAndCache(cache, request) {
  const response = await fetch(request);
  if (response.status === 200) {
    // A quota or storage failure should still let the network response through.
    await cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function respond(request, pathname) {
  const cache = await caches.open(CACHE_NAME);
  const match = () => cache.match(request, { ignoreSearch: true });
  const navigation = request.mode === 'navigate';
  const networkFirst = navigation || /\.(?:html|css|js)$/.test(pathname);

  if (!networkFirst) return (await match()) || fetchAndCache(cache, request);
  try {
    return await fetchAndCache(cache, request);
  } catch (error) {
    const cached = await match();
    if (cached) return cached;
    if (navigation) {
      const notFound = await cache.match(BASE + '404.html');
      if (notFound) return new Response(notFound.body, { status: 404, headers: notFound.headers });
    }
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  event.respondWith(respond(request, url.pathname));
});

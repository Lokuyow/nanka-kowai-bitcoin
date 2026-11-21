// BASE, VERSION, and PRECACHE are generated from the published site.
const CACHE_PREFIX = 'kowai-bitcoin-v';
const REVISION_CACHE_PREFIX = CACHE_PREFIX + '2-';
const CACHE_NAME = REVISION_CACHE_PREFIX + VERSION;
const entries = new Map(Object.entries(PRECACHE));

function previousRevision(names) {
  return names.filter((name) => name.startsWith(REVISION_CACHE_PREFIX) && name !== CACHE_NAME).at(-1);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const previous = previousRevision(await caches.keys());
    const cache = await caches.open(CACHE_NAME);
    const keys = new Set(entries.values());
    try {
      const missing = (await Promise.all([...keys].map(async (key) => {
        if (await cache.match(key)) return;
        const cached = previous && await caches.match(key, { cacheName: previous });
        if (cached) await cache.put(key, cached);
        else return key;
      }))).filter(Boolean);
      if (missing.length) await cache.addAll(missing);
    } catch (error) {
      await caches.delete(CACHE_NAME);
      throw error;
    }

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = (await caches.keys()).filter((name) => name.startsWith(CACHE_PREFIX));
    // The previous cache can still serve hashed assets referenced by an open page.
    const previous = previousRevision(names);
    await Promise.all(names.filter((name) => name !== CACHE_NAME && name !== previous)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function respond(request, key, pathname) {
  if (key) {
    const cached = await caches.match(key, { cacheName: CACHE_NAME });
    if (cached) return cached;
  } else if (/\.[a-f0-9]{16}\.[a-z]+$/.test(pathname)) {
    const previous = previousRevision(await caches.keys());
    const cached = previous && await caches.match(pathname, { cacheName: previous });
    if (cached) return cached;
  }

  try {
    return await fetch(request);
  } catch (error) {
    if (request.mode === 'navigate') {
      const notFound = await caches.match(entries.get(BASE + '404.html'), { cacheName: CACHE_NAME });
      if (notFound) return new Response(notFound.body, { status: 404, headers: notFound.headers });
    }
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  const pagePath = url.pathname.replace(/\/index\.html$/, '/');
  event.respondWith(respond(request, entries.get(pagePath), url.pathname));
});

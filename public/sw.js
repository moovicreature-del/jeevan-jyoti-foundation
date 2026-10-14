// ============================================================================
// JEEVAN JYOTI FOUNDATION - SERVICE WORKER (LIVE SYNC & AUTO-UPDATE V9)
// Network-First for HTML/App Bundles so GitHub pushes reflect immediately on live links
// Offline Cache Fallback for Certificates, Official Seal, and Static Assets
// ============================================================================

const CACHE_NAME = 'jeevan-jyoti-v9-live-sync';

// Static branding assets to pre-cache for offline availability
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/favicon.svg',
  '/logo.png',
  '/official-seal.png',
  '/apple-touch-icon.png',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/pwa-icon-maskable-192.png',
  '/pwa-icon-maskable-512.png',
  '/signature-shailesh-overlay.png',
  '/signature-shailesh-royalblue.png'
];

let dynamicCustomThumbnail = '';

// Message Listener: Immediate Skip-Waiting & Live Thumbnail Updates
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'UPDATE_APP_THUMBNAIL') {
    const newThumb = event.data.thumbnailUrl;
    dynamicCustomThumbnail = typeof newThumb === 'string' ? newThumb.trim() : '';
    if (dynamicCustomThumbnail && dynamicCustomThumbnail !== '/pwa-icon-512.png') {
      fetch(dynamicCustomThumbnail, { mode: 'cors' })
        .then((resp) => {
          if (resp && resp.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(dynamicCustomThumbnail, resp.clone());
              cache.put('/pwa-icon-512.png', resp.clone());
              cache.put('/pwa-icon-192.png', resp.clone());
              cache.put('/apple-touch-icon.png', resp.clone());
            });
          }
        })
        .catch(() => {});
    }
  }
});

// Install Event: Activate immediately without waiting for old tabs to close
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.debug('[SW] Partial pre-cache notice:', err);
      });
    })
  );
  // Force new service worker to become active immediately
  self.skipWaiting();
});

// Activate Event: Clean up all legacy caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Take control of all open pages immediately
  return self.clients.claim();
});

// Fetch Event: Smart routing to prevent stale cache while supporting offline mode
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. NEVER INTERCEPT Vite development endpoints, HMR, or raw TypeScript/JSX source modules
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.searchParams.has('import')
  ) {
    return;
  }

  // 2. NEVER CACHE Service Worker or Version Check: Always fetch fresh from network
  if (url.pathname === '/sw.js' || url.pathname === '/version.json') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }

  // 3. API Requests: Network-First with offline JSON fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'इंटरनेट कनेक्शन उपलब्ध नहीं है (Device is offline). लोकल सुरक्षित डेटा उपयोग में है।'
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // 4. HTML / NAVIGATION REQUESTS (index.html, root /, etc.):
  // CRITICAL: Always use NETWORK-FIRST so any GitHub update or new deployment reflects IMMEDIATELY!
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, serve cached index.html
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const rootCached = await caches.match('/index.html') || await caches.match('/');
          if (rootCached) return rootCached;
          return new Response('ऑफलाइन मोड: पेज लोड करने हेतु इंटरनेट कनेक्शन की आवश्यकता है।', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        })
    );
    return;
  }

  // 5. Web App Manifest: Network-First
  if (url.pathname === '/manifest.json') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 6. Custom App Icon
  if (
    dynamicCustomThumbnail &&
    (url.pathname === '/pwa-icon-512.png' ||
      url.pathname === '/pwa-icon-192.png' ||
      url.pathname === '/apple-touch-icon.png')
  ) {
    event.respondWith(
      caches.match(dynamicCustomThumbnail).then((cached) => {
        if (cached) return cached;
        return fetch(dynamicCustomThumbnail, { mode: 'cors' }).catch(() => caches.match(event.request));
      })
    );
    return;
  }

  // 7. Static Assets (CSS, JS, Fonts, Images)
  // Vite bundles in /assets/* contain unique hashes (e.g. index-xxxx.js)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background for non-hashed assets
        if (!url.pathname.startsWith('/assets/')) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {});
        }
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2|woff|ttf)$/) ||
              url.origin === location.origin)
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('Asset unavailable offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});

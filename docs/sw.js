const swCache = 'simon-pwa-v1';
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(swCache)
            .then(cache => cache.addAll([
                '/',
                'index.html',
                'css/styles.css',
                'app.js',
                'manifest.webmanifest',
                'icons/icon512.png',
                'icons/icon16.png',
                'icons/android-chrome-192x192.png',
                'icons/android-chrome-512x512.png',
                'icons/apple-touch-icon.png',
                'icons/favicon-16x16.png',
                'icons/favicon-32x32.png',
                'icons/favicon.ico',
                'icons/mstile-150x150.png',
                'icons/safari-pinned-tab.svg'
            ]))
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== swCache) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
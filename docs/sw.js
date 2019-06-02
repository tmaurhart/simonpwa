const swCache = 'simon-pwa-v1';
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(swCache)
            .then(function (cache) {
                return cache.addAll([
                    '/',
                    'index.html',                    
                    'app.js',
                    'manifest.webmanifest',
                    'audio/simonSound1.mp3',
                    'audio/simonSound2.mp3',
                    'audio/simonSound3.mp3',
                    'audio/simonSound4.mp3',
                    'css/font.css',
                    'css/style.css',
                    'icons/icon512.png',
                    'icons/icon16.png',
                    'icons/android-chrome-192x192.png',
                    'icons/android-chrome-512x512.png',
                    'icons/apple-touch-icon.png',
                    'icons/favicon-16x16.png',
                    'icons/favicon-32x32.png',
                    'icons/favicon.ico',
                    'icons/mstile-150x150.png',
                    'icons/safari-pinned-tab.svg',
                    'fonts/josefin-sans-v13-latin-italic.svg',
                    'fonts/josefin-sans-v13-latin-italic.ttf',
                    'fonts/josefin-sans-v13-latin-italic.woff',
                    'fonts/josefin-sans-v13-latin-italic.woff2',
                    'fonts/josefin-sans-v13-latin-regular.eot',
                    'fonts/josefin-sans-v13-latin-regular.svg',
                    'fonts/josefin-sans-v13-latin-regular.ttf',
                    'fonts/josefin-sans-v13-latin-regular.woff',
                    'fonts/josefin-sans-v13-latin-regular.woff2',
                    'fonts/press-start-2p-v7-latin-regular.eot',
                    'fonts/press-start-2p-v7-latin-regular.svg',
                    'fonts/press-start-2p-v7-latin-regular.ttf',
                    'fonts/press-start-2p-v7-latin-regular.woff',
                    'fonts/press-start-2p-v7-latin-regular.woff2'
                ]);
            })
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

const swCache = 'simon-pwa-v1';
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(swCache)
            .then(cache => cache.addAll([
                '/simonpwa/',
                'index.html',                
                'app.js',
                'manifest.webmanifest',
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
                'icons/safari-pinned-tab.svg'
            ]))
    );
});

/*self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(swCache)
            .then(cache => cache.match(event.request.url))
    );
});*/

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (res) {
            if (res) {
                return res;
            }
            return requestBackend(event);
        })
    )
});
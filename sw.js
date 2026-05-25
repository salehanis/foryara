const CACHE = 'foryara-v2';
const STATIC = [
    '/foryara/style.css',
    '/foryara/bg.gif',
    '/foryara/mad-bg.gif',
    '/foryara/sad-emoji.gif',
    '/foryara/anxious-bg.gif',
    '/foryara/depressed-bg.gif',
    '/foryara/icon-192.png',
    '/foryara/apple-touch-icon.png',
];

// Install: cache only static assets (images + css)
self.addEventListener('install', e =>
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(STATIC))
            .then(() => self.skipWaiting())
    )
);

// Activate: delete old caches
self.addEventListener('activate', e =>
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    )
);

// Fetch strategy:
// - HTML files → network first (always get latest Firebase code), fall back to cache
// - Everything else → cache first (fast static assets)
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    const isHTML = url.pathname.endsWith('.html') || url.pathname.endsWith('/');

    if (isHTML) {
        // Network first for HTML
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, copy));
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
    } else {
        // Cache first for static assets
        e.respondWith(
            caches.match(e.request)
                .then(r => r || fetch(e.request).then(res => {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, copy));
                    return res;
                }))
        );
    }
});

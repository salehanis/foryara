const CACHE = 'foryara-v3';

// Only cache images & CSS — never HTML
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

self.addEventListener('install', e =>
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
    )
);

self.addEventListener('activate', e =>
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    )
);

// Tapping a notification opens the app
self.addEventListener('notificationclick', e => {
    e.notification.close();
    const target = e.notification.tag === 'period-msg'
        ? '/foryara/period.html'
        : '/foryara/vent.html';
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const c of list) {
                if (c.url.includes('/foryara/') && 'focus' in c) return c.focus();
            }
            return clients.openWindow(target);
        })
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // Only serve images/css from cache — HTML always comes from network
    if (url.pathname.match(/\.(css|gif|png|jpg|jpeg|svg|ico|webp)$/)) {
        e.respondWith(
            caches.match(e.request).then(r => r || fetch(e.request).then(res => {
                const copy = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, copy));
                return res;
            }))
        );
    }
    // HTML and everything else: let the browser fetch normally (no caching)
});

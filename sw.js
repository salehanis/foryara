const CACHE = 'foryara-v1';
const ASSETS = [
    '/foryara/',
    '/foryara/index.html',
    '/foryara/style.css',
    '/foryara/bg.gif',
    '/foryara/mad.html',    '/foryara/mad-bg.gif',
    '/foryara/sad.html',    '/foryara/sad-emoji.gif',
    '/foryara/anxious.html','/foryara/anxious-bg.gif',
    '/foryara/depressed.html','/foryara/depressed-bg.gif',
    '/foryara/vent.html',
    '/foryara/log.html',
    '/foryara/countdown.html',
    '/foryara/release.html',
    '/foryara/selfcare.html',
    '/foryara/dates.html',
    '/foryara/timeline.html',
    '/foryara/period.html',
    '/foryara/icon-192.png',
    '/foryara/apple-touch-icon.png',
];

self.addEventListener('install', e =>
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()))
);

self.addEventListener('activate', e =>
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()))
);

self.addEventListener('fetch', e =>
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);

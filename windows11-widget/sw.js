const CACHE_NAME = 'cucoext-widget-v1';
const urlsToCache = [
    '/widget.html',
    '/manifest.json',
    '/widget-data.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Handle widget updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'widget-update') {
        // Update widget data
        console.log('Updating widget data:', event.data.status);
    }
});

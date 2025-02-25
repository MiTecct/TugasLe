const CACHE_NAME = "tugas-app-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/css/style.css",
    "/js/app.js",
    "/assets/icon-192.png",
    "/assets/icon-512.png"
];

// Install Service Worker dan cache file
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching semua file penting...");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch dari cache jika offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Update cache jika ada versi baru
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Menghapus cache lama:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

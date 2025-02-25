const CACHE_NAME = "tugas-app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/css/style.css",
    "/js/app.js",
    "/assets/icon-192.png",
    "/assets/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                urlsToCache.map(url => {
                    return fetch(url, { cache: "no-store" })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Gagal memuat ${url}`);
                            }
                            return cache.put(url, response);
                        })
                        .catch(error => {
                            console.warn(`Tidak bisa cache ${url}:`, error);
                        });
                })
            );
        })
    );
});

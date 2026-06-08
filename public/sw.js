// Service Worker — Central SECOM (cache dinamico, compativel com GitHub Pages)
const CACHE = "secom-v2";

self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    // network-first para paginas
    e.respondWith(
      fetch(req).then((res) => { put(req, res.clone()); return res; }).catch(() => caches.match(req))
    );
    return;
  }
  // cache-first para estaticos
  e.respondWith(
    caches.match(req).then((c) => c || fetch(req).then((res) => { put(req, res.clone()); return res; }).catch(() => c))
  );
});

function put(req, res) {
  if (res && res.status === 200) caches.open(CACHE).then((c) => c.put(req, res));
}

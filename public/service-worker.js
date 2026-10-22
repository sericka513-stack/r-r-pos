const CACHE_NAME = "jeds-minimart-app-shell-v9";
const APP_SHELL = ["/", "/manifest.webmanifest", "/app-icon.svg", "/app-icon-192.png", "/app-icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("jeds-minimart-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache account APIs, inventory, sales, passwords, or other live/private data.
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok && (url.pathname === "/" || url.pathname === "/index.html")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("/", copy)).catch(() => {});
        }
        return response;
      }).catch(async () => {
        const cached = await caches.match("/");
        return cached || new Response("Jed's Minimart needs an internet connection to sign in and access live store data.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      })
    );
    return;
  }

  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
  }
});
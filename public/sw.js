const cacheName = "focus-room-v8";
const appShell = [
  "/focus-room",
  "/focus-room/offline.html",
  "/focus-room/manifest.webmanifest",
  "/focus-room/icon.svg",
  "/focus-room/audio/focus-complete.wav",
  "/focus-room/audio/unlock-silence.wav",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(appShell)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.pathname.startsWith("/focus-room/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/focus-room/offline.html")));
    return;
  }

  if (url.origin === location.origin && (url.pathname.startsWith("/focus-room/_next/") || appShell.includes(url.pathname))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          const clonedResponse = response.clone();
          caches.open(cacheName).then((cache) => cache.put(request, clonedResponse));
          return response;
        });
      })
    );
  }
});

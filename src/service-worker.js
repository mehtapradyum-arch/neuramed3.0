/* global self */
const CACHE = "neuramed-v1";
const ASSETS = ["/", "/dashboard", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      if (request.method === "GET" && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
      }
      return res;
    }))
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification("NeuraMed", {
      body: data.medName ? `Reminder: ${data.medName}` : "Notification",
      icon: "/icons/icon-192.png",
      data,
    })
  );
});

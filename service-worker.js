self.onInstall = (event) => {
  event.waitUntil(
    caches.open("todo-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./js/app.js",
      ]);
    })
  );
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

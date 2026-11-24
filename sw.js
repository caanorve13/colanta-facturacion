/* Hace que la app (incluida la de la pantalla de inicio) pida siempre la página nueva a internet,
   y solo use la guardada si no hay conexión. */
var COPIA = "colanta-copia-sin-conexion";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || (r.mode !== "navigate" && !/\.html(\?|$)/.test(r.url))) return;
  e.respondWith(
    fetch(r, { cache: "no-store" }).then(function (res) {
      var c = res.clone();
      caches.open(COPIA).then(function (k) { k.put(r, c); });
      return res;
    }).catch(function () { return caches.match(r); })
  );
});

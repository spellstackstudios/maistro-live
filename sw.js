self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function(e){
  var url = new URL(e.request.url);
  var nav = e.request.mode === "navigate" || /maistro-live\/?$/.test(url.pathname) || url.pathname.endsWith("/index.html");
  if(!nav) return;
  e.respondWith(fetch(url.origin + url.pathname + "?t=" + Date.now(), {cache:"no-store"}).catch(function(){ return fetch(e.request); }));
});

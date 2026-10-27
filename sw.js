/* Guarda la app en el teléfono para que abra sin internet.
   Al publicar cambios, sube el número de versión (omr-V6, omr-V7... igual que la versión de la app). */
const V = 'omr-V6';
importScripts('ilus-config.js', 'ilustraciones.js');
const SHELL = ['./', 'index.html', 'styles.css', 'catalogo.js', 'ilus-config.js', 'ilustraciones.js', 'ilus.js', 'app.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
// Ilustraciones que viajan dentro de la app: en pruebas todas; en modo servidor solo las gratis
const ILUS = ILUS_INDEX.filter(i => ILUS_CFG.modo === 'local' || i.f).map(i => ILUS_CFG.local + i.s + '.svg');

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.concat(ILUS))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // Borra cachés viejos de esta app (omr-…), pero no las ilustraciones Premium descargadas
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('omr-') && k !== V && k !== ILUS_CFG.cache).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.startsWith(ILUS_CFG.servidor)) return;   // las Premium del servidor las guarda la app en su propia caché
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone());
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});

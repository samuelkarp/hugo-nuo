// Retirement service worker.
//
// This site no longer uses a caching service worker. A service worker stays
// installed in a visitor's browser until it is explicitly unregistered, so
// this worker exists to clean up after the one that used to run here: it
// deletes all caches, unregisters itself, and reloads open pages so they stop
// being controlled. Once returning visitors have updated past the old worker,
// the registration in footer.html and this file can be removed.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => client.navigate(client.url));
    })(),
  );
});

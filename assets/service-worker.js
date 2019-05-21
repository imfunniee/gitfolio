  importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

  if (workbox) {
    workbox.setConfig({
      debug: false
    });

    var defaultStrategy = workbox.strategies.networkFirst({
      cacheName: "fallback",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 128,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          purgeOnQuotaError: true, // Opt-in to automatic cleanup
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200] // for opague requests
        }),
      ],
    });
    workbox.routing.setDefaultHandler(
      (args) => {
        if (args.event.request.method === 'GET') {
          return defaultStrategy.handle(args); // use default strategy
        } else {
          return null
        }
      }
    );

    workbox.routing.registerRoute(
      new RegExp(/.*\.(?:js|css)/g),
      workbox.strategies.networkFirst()
    );

    workbox.routing.registerRoute(
      new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif|webp)/g),
      workbox.strategies.cacheFirst()
    );
  } else {
    console.log(`No workbox on this browser 😬`);
  }
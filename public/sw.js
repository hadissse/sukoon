// Sukoon service worker — handles push events and notification clicks.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push from server (future VAPID integration)
self.addEventListener('push', (event) => {
  let data = { title: 'سُكون', body: 'حان وقت لحظتك اليومية.', url: '/today' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      dir: 'rtl',
      lang: 'ar',
      tag: 'sukoon-daily',
      data: { url: data.url },
    })
  );
});

// Local notification triggered from the client via postMessage
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;
    self.registration.showNotification(title || 'سُكون', {
      body: body || 'حان وقت لحظتك اليومية.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      dir: 'rtl',
      lang: 'ar',
      tag: 'sukoon-daily',
      data: { url: url || '/today' },
    });
  }
});

// Open app on notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/today';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

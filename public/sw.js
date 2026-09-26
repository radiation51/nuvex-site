// NUVEX : reçoit les notifications de l'admin (nouvelle commande, devis, abonnement, service, avis),
// même quand l'admin est fermé, et ouvre la bonne page au toucher.
// Ne met rien en cache : le site fonctionne exactement comme sans ce fichier.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "NUVEX", body: event.data ? event.data.text() : "" };
  }

  const options = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    tag: data.tag,
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || "/", whatsapp: data.whatsapp || null },
    actions: data.whatsapp
      ? [
          { action: "whatsapp", title: "Répondre sur WhatsApp" },
          { action: "open", title: "Ouvrir l'admin" },
        ]
      : [],
  };

  event.waitUntil(self.registration.showNotification(data.title || "NUVEX", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { url, whatsapp } = event.notification.data || {};
  const target = event.action === "whatsapp" && whatsapp ? whatsapp : url || "/";

  event.waitUntil(
    (async () => {
      if (target.startsWith("/")) {
        // Admin déjà ouvert : on le remet au premier plan au lieu d'en ouvrir un deuxième.
        const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        const existing = windows.find((w) => new URL(w.url).pathname.startsWith(target));
        if (existing) return existing.focus();
      }
      return self.clients.openWindow(target);
    })()
  );
});

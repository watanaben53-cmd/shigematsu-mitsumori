// Service Worker - 重松工業 見積管理システム
const CACHE_NAME = 'shigematsu-mitsumori-v1';
const URLS_TO_CACHE = [
  './shigematsu_mitsumori_v4.html',
  './manifest_mitsumori.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ネットワーク優先→失敗時はキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        // 成功したらキャッシュも更新
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

const CACHE='bebida-offline-v2';
const SAFE=['/offline.html','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SAFE)))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bebida-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(req.mode==='navigate'){event.respondWith(fetch(req).catch(()=>caches.match('/offline.html')));return}
 if(SAFE.includes(url.pathname))event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});

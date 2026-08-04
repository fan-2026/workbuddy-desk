const CACHE_NAME='workbuddy-v3';
const PRECACHE=['./','./index.html','./manifest.json','./icon-192x192.png','./icon-512x512.png','./apple-touch-icon.png','./favicon-32x32.png','./favicon.ico','./sw.js'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE).catch(()=>{})).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil((async()=>{ const keys=await caches.keys(); await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))); await self.clients.claim(); })()); });
self.addEventListener('message',e=>{ if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return;
  e.respondWith((async()=>{
    try{ const res=await fetch(e.request); const c=await caches.open(CACHE_NAME); c.put(e.request,res.clone()); return res; }
    catch(err){ const cached=await caches.match(e.request); return cached||caches.match('./')||caches.match('./index.html'); }
  })());
});

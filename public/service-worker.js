// https://googlechrome.github.io/samples/service-worker/basic/
const PRECACHE = 'precache-v2'
const RUNTIME = 'runtime'

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/', // Alias for index.html
  'index.html',
  'Bukyvede-updated.ttf',
]

// The install handler takes care of precaching the resources we always need.
window.self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(window.self.skipWaiting())
  )
})

// The activate handler takes care of cleaning up old caches.
window.self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME]
  event.waitUntil(
    caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)))).then(() => window.self.clients.claim())
  )
})

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
window.self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(window.self.location.origin))
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse)
          return cachedResponse

        return caches.open(RUNTIME).then(cache => fetch(event.request).then(response =>
        // Put a copy of the response in the runtime cache.
          cache.put(event.request, response.clone()).then(() => response)
        ))
      })
    )
})

# PENDIENTE: Convertir FutbolMatch en PWA

> **Prioridad:** Alta
> **Complejidad:** Baja
> **Tiempo estimado:** 15-20 minutos
> **Fecha creación:** 4 Febrero 2026

---

## QUE ES UNA PWA

Progressive Web App - permite que una web se comporte como app nativa:
- Se instala desde el navegador (sin stores)
- Icono en pantalla de inicio
- Se abre sin barra del navegador
- Puede funcionar offline (básico)
- Funciona en Android, iOS y desktop

---

## ARCHIVOS A CREAR

### 1. manifest.json (en carpeta public/)
```json
{
  "name": "FutbolMatch",
  "short_name": "FutbolMatch",
  "description": "Organiza partidos de fútbol amateur con tus amigos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#4f46e5",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 2. Service Worker (sw.js en carpeta public/)
```javascript
const CACHE_NAME = 'futbolmatch-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### 3. Modificar index.html
Agregar en el `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4f46e5">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FutbolMatch">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
```

Agregar antes de cerrar `</body>`:
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
</script>
```

### 4. Crear carpeta public/icons/
Necesita los iconos en estos tamaños:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

---

## ICONOS NECESARIOS

El usuario va a crear el logo/icono con una IA de imágenes.
Una vez que tenga el diseño base, redimensionar a todos los tamaños.

**Herramientas para redimensionar:**
- https://www.pwabuilder.com/imageGenerator (genera todos los tamaños)
- https://realfavicongenerator.net/
- Canva / Photoshop

---

## PASOS PARA IMPLEMENTAR

1. Usuario crea el logo con IA
2. Redimensionar a todos los tamaños necesarios
3. Crear carpeta `public/icons/` y subir iconos
4. Crear `public/manifest.json`
5. Crear `public/sw.js`
6. Modificar `index.html`
7. Commit y push
8. Probar instalación en celular

---

## COMO PROBAR

### En Chrome (Android):
1. Abrir https://futbolmatch.vercel.app
2. Menú (3 puntos) → "Instalar app" o "Añadir a pantalla de inicio"

### En Safari (iOS):
1. Abrir https://futbolmatch.vercel.app
2. Botón compartir → "Añadir a pantalla de inicio"

### En Chrome (Desktop):
1. Abrir https://futbolmatch.vercel.app
2. Aparece icono de instalación en la barra de direcciones

---

## POSIBLES PROBLEMAS

1. **Iconos no cargan** → Verificar rutas en manifest.json
2. **No aparece opción instalar** → Verificar que manifest.json está bien linkeado
3. **Service Worker no registra** → Verificar consola del navegador (F12)

Todos son problemas menores y fáciles de solucionar.

---

## DESPUÉS DE PWA (FUTURO)

Si se quiere publicar en stores:
- **Google Play:** Usar PWABuilder o Capacitor
- **App Store:** Requiere Capacitor + cuenta Apple Developer ($99/año)

---

*Documento creado: 4 Febrero 2026*

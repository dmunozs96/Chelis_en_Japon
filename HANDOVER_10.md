# HANDOVER 10 — Ola de Calidad Q1: auditoría integral y reparación del sistema de imágenes

> Fecha: 2026-07-15 | SPEC: v1.8 → v1.9 | Estado del build: ✅ verificado en producción local

## Qué se pidió

Revisión general del proyecto: mejoras a las specs, eliminación de bugs, eficiencias, análisis crítico y propuestas de nuevas funcionalidades. Bug prioritario reportado por Daniel: **las imágenes de los POIs no salen**.

## 1. Bug de imágenes — causa raíz y arreglo

La iteración anterior (commit `61c2d30`, mal etiquetado "Ola 5") dejó el sistema sin ninguna fuente válida:

1. `client/public/pois/` no contenía **ningún** `.jpg` — solo scripts y JSONs de ayuda.
2. Las 24 URLs de Wikimedia en `fallback-urls.json` estaban **inventadas** (verificado: 404). Las rutas de `upload.wikimedia.org` llevan un hash derivado del nombre real del fichero — no se pueden adivinar.
3. `ImageWithFallback` tenía una race condition: el 404 de la imagen local llegaba antes que el fetch del JSON de fallbacks → `loadError` → `return null` → hero vacío (el icono de categoría quedaba con `display:none`).

**Arreglo (de raíz, no parche):**

- **`scripts/fetch-poi-images.mjs`** (nuevo): resuelve la imagen principal real de cada POI vía la API REST de Wikipedia (`/page/summary`, con títulos candidatos por POI), descarga a ≤1280px con throttling y reintentos ante 429, y regenera `fallback-urls.json` (URLs reales) y `credits.json` (atribución: artículo + fichero de Commons). Uso: `node scripts/fetch-poi-images.mjs [--force]`.
- **24/24 imágenes descargadas** y comprimidas (q78 mozjpeg): 5,4 MB total. Verificadas visualmente las resueltas por artículos alternativos (yanaka, imperial-east, tsukiji, shibuya-sky).
- **`POIDetailView.jsx`**: fallback bajo demanda (el JSON solo se pide si una imagen local falla, una vez por sesión), sin race, y el icono de categoría se muestra de verdad como último recurso.
- Borrados los restos del intento anterior: `download-images.ps1` (descargaba de las URLs inventadas), `POI_LIST.json`, `IMAGES_FIX_SUMMARY.md`.

## 2. Bugs corregidos (auditoría con 2 agentes + verificación)

| # | Sev. | Bug | Fichero |
|---|---|---|---|
| 1 | Alta | Handlers async sin captura en Express 4: cualquier error de BD **tumbaba el proceso entero**. Añadidos `asyncHandler`, middleware de errores, `unhandledRejection` handler y validación de `:day` | `server/routes/planner.js`, `server/index.js` |
| 2 | Alta | El GPS recentraba el mapa en el usuario pisando `focusLatLng` ("Ver mapa" desde un POI te llevaba a Madrid) | `MapView.jsx` |
| 3 | Alta | 5 días con `poi_id` en bloques ausentes del array `pois` del día → "Ruta del día" vacía o incompleta (15, 18, 19, 20, 22 ago) + `higashiyama` huérfano añadido al 19 ago | `data/trip.json` |
| 4 | Media | Guardado optimista del planificador sin `res.ok` ni reintento → pérdida silenciosa de reservas. Ahora: reintento + reversión visible si falla | `usePlannerData.js` |
| 5 | Media | `DATE` de Postgres serializado según TZ del servidor → slots corridos un día. Type parser a string | `server/db.js` |
| 6 | Media | Los mismos JSON se re-descargaban en cada montaje de vista | `lib/fetchJsonCached.js` (nuevo) + 4 hooks |
| 7 | Baja | Off-by-one: el 26 ago la splash mostraba countdown "0 días" en vez de "viaje terminado" | `SplashScreen.jsx` |
| 8 | Baja | Fecha UTC en vez de local: hotel "estancia actual" y tips pasados fallaban de 00:00 a 09:00 JST | `TicketsView.jsx`, `AlertsView.jsx` |
| 9 | Baja | Estado de expansión de steps sobrevivía al cambiar de día (indexado por posición) | `DayNav.jsx` (key por fecha) |
| 10 | Baja | `/data/*.json` inexistente devolvía `index.html` con 200 | `server/index.js` |
| 11 | Baja | BOM UTF-8 en `pois_db.json` rompía cualquier tooling con `JSON.parse` | `data/pois_db.json` |
| 12 | Baja | `timeToFranja` con umbrales pre-4e (13h/19h vs 14h/20h) | `TodayView.jsx` |

## 3. Datos corregidos

- **Alertas de trenes**: `due_date` apuntaba a la **fecha del viaje** (ago) en vez de a la ventana de reserva (jul) — habrían avisado un mes tarde. Ahora: 18-24 jul según tren.
- **URLs de reserva**: jrpass.com (vendedor del JR Pass, descartado) → **SmartEX** (`smart-ex.jp`, reserva real de billetes sueltos Tokaido/Sanyo) en `trip.json` (trenes 02-05) y `alerts.json`.
- `trip.json` gana `trip.start_date`, `trip.end_date`, `trip.departure_datetime` (alineado con el schema del SPEC; SplashScreen aún no los consume — deuda).

## 4. Eficiencias

- **Caché de JSON estáticos** (memoria + snapshot en localStorage): una descarga por sesión, y si la red falla se sirve la última copia buena — primer paso real hacia la regla 4 (offline).
- **DualClock**: de 1 render/segundo a 1/minuto (alineado al cambio de minuto).
- **Imágenes**: 19,4 MB → 6,5 MB (POIs recomprimidos; splash PNG→JPG a 1440px, −90%; `SplashScreen.jsx` actualizado a `.jpg`).

## 5. Docs

- SPEC v1.9: F3 honesto sobre offline, schema sección 5 alineado con el fichero real, comportamiento de imágenes actualizado, tabla 6b puesta al día, segunda "## 8" renumerada a "## 9", nueva **sección 10 "Deuda técnica conocida"**, entrada de esta ola en la sección 8.
- CONSTITUTION: regla 1 ampliada a recursos (URL inventada = contenido inventado).

## 6. Verificación

- `npm run build` sin errores (valida sintaxis de todos los ficheros tocados).
- Servidor en modo producción: `/pois/*.jpg` 200 `image/jpeg`, `/JapanPics/*.jpg` 200, `/data/*.json` 200, `/data/no-existe.json` **404**, `PUT /api/planner/no-es-fecha/lunch` → **400 JSON sin tumbar el proceso**.
- Spot-check de URLs de `fallback-urls.json` regenerado: 200 OK.
- Script de validación de datos: 0 referencias `poi_id` rotas en los 13 días.

## 7. Pendiente / decisiones abiertas para la próxima iteración

1. **La decisión gorda: F17 (offline/PWA)**. Única regla no negociable de la Constitución sin cumplir. La caché localStorage de esta ola cubre datos, pero recargar sin red sigue rompiendo. Recomendación: adelantar un service worker mínimo (precache del build + runtime cache) antes de Ola 5.
2. SplashScreen debería leer fechas de `trip.json` (campos ya disponibles).
3. Unificar la doble numeración F1-F18 del SPEC (secciones 4 y 7).
4. `PlannerView`/`RestaurantsView` podrían mostrar feedback visual cuando `saveSlot` devuelve `false` (la reversión ya es visible, pero un toast explicaría el porqué).

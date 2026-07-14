# Hand-Over 05 — Ola 4a: Guía de Viaje Detallada

> Fecha: 2026-07-14
> Iteración: Ola 4a — F6+F7 (POIDetailView + ruta del día)
> Estado: COMPLETADA ✅

---

## Qué se construyó

### Datos nuevos
- **`data/pois_db.json`** — 24 POIs curados con el schema completo de SPEC.md §5b: nombre ES/JA, categoría, descripción en 3 párrafos, `significance`, horarios, precio, duración sugerida, restricciones, consejos, mejor momento, acceso, imagen (Wikimedia Commons), website y fuente. Contenido basado en `japon_info_base.md` (investigación ya verificada) y hechos públicos estables de cada lugar — nunca inventado, siguiendo la regla nº1 de `CONSTITUTION.md`.
- **`data/trip.json`** — añadido `poi_id` a los bloques del itinerario que corresponden a un lugar con entrada en `pois_db.json` (días 15, 16, 17, 18, 19, 20, 21, 22, 23).

### Componentes nuevos
| Componente | Descripción |
|---|---|
| `POIDetailView.jsx` | Pantalla push (overlay, z-index 250) con hero image + fallback SVG, nombre ES/JA, chip de categoría, `significance` destacado, descripción en párrafos, grid de info práctica (horario/precio/duración/acceso), restricciones, consejos, botón de website y fuente. |
| `usePoisData.js` | Hook que carga `pois_db.json` y expone `getPoiById(id)`. |

### Actualizaciones
- `TodayView.jsx` (`DayCard`) — bloques con `poi_id` ahora son tappables (chevron rojo); nuevo botón "Ruta del día →" en la Hero Card, visible solo si el día tiene bloques con POI.
- `DayNav.jsx` — recibe y propaga `onOpenMap` / `onOpenPoi` / `onOpenRoute` al `DayCard` de cada día del strip (antes solo `TodayView` tenía el botón de mapa).
- `MapView.jsx` — nuevo prop `routeMode`: numera los pines de POI según el orden de los bloques del día y traza una polyline roja punteada conectándolos. Nuevo prop `onOpenPoi`: si se pasa, tocar un marcador o chip de POI abre `POIDetailView` en vez del popup de Leaflet (el marcador de hotel conserva su popup propio). Nuevo prop `focusLatLng` para centrar el mapa en un punto concreto (usado al abrir el mapa desde `POIDetailView`).
- `App.jsx` — nuevo estado `poiId` (overlay de mayor prioridad, por encima del mapa) y helpers `openMap`, `openRoute`, `closeMap`, `openPoiFromMap`, `openMapFromPoi` para coordinar la navegación entre Hoy/Viaje → Mapa/Ruta → Detalle de POI y viceversa.

---

## Decisiones técnicas

- **24 POIs, no ~50-80:** se priorizó cobertura completa de los lugares que ya aparecen en los bloques del itinerario confirmado, sobre rellenar hasta el número aspiracional de SPEC.md. Añadir más POIs (barrios/miradores alternativos para los días libres) queda como backlog abierto, no bloqueante.
- **Reutilizar los `id` existentes:** los POIs en `pois_db.json` reutilizan los mismos `id` que ya vivían en `trip.json[day].pois` (usados por el mapa desde Ola 3), así que los pines del mapa normal (no solo en modo ruta) también son tappables hacia `POIDetailView` sin cambios adicionales de datos.
- **Hotel fuera de la numeración de ruta:** el marcador del hotel se sigue mostrando en el mapa en modo ruta, pero no entra en la polyline ni en la numeración — no es un POI cultural, es logística.
- **`focusLatLng` en vez de un modo de mapa nuevo:** para el botón "Ver mapa" dentro de `POIDetailView`, se reutilizó `MapView` con un `dayData` sintético de un solo POI en vez de crear un componente de mapa aparte.

---

## Verificación

Probado en navegador real (Playwright + Chromium headless, viewport móvil 390×844, servidor Express sirviendo el build de producción):
1. Vista "Hoy" con reloj de dispositivo simulado en 15 ago → bloques de Asakusa/Palacio Imperial/Shibuya tappables con chevron. ✅
2. Tap en bloque → `POIDetailView` con hero, `significance`, descripción de 3 párrafos, horario/precio. ✅
3. Botón "Ruta del día →" → mapa con pines numerados (1, 2, 3) + polyline roja punteada + panel inferior con orden. ✅
4. Tap en pin numerado → abre `POIDetailView` del POI correspondiente (verificado con Shibuya Crossing). ✅
5. Sin errores de consola en ningún paso. Build de producción (`npm run build`) sin errores.

---

## Estado de las olas

| Ola | Estado |
|---|---|
| 0 — Datos | ✅ |
| 1 — Esqueleto + Diseño | ✅ |
| 2 — Billetes + Alertas | ✅ |
| 3 — Mapa | ✅ |
| D — Dark Premium | ✅ |
| 4a — Guía de Viaje Detallada | ✅ |
| 4b — Restaurantes | ⬜ Pendiente |
| 5 — Herramientas de viaje | ⬜ Pendiente |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Pendientes urgentes fuera del código

- ⚠️ **Trenes:** ventana de reserva del primer tramo (Tokio→Hakone, Odakyu Romancecar) abre **hoy 18 jul 10:00 JST** en odakyu-romance.jp. Las siguientes ventanas abren del 19 al 24 de julio.
- ⚠️ **ESqUISSE (24 ago):** reservar con antelación.
- ⚠️ **Mizunoto:** llamar al +81 460-82-6011 para confirmar política de tatuajes.

## Por dónde continuar

**Ola 4b — Restaurantes:**
- Tab "Restaurantes" habilitada (actualmente `disabled: true` en `BottomNav.jsx`)
- `RestaurantsView.jsx` — lista de los 32 restaurantes de `restaurants_db.json` con filtros offline (ciudad, tipo, precio, estrella Michelin)
- `PlannerView.jsx` — planner de comidas/cenas por día (slot mediodía/noche × 13 días)
- Asignación de restaurante a slot → guarda en PostgreSQL (planner compartido Daniel + Chelis) vía API en `server/`
- Detección de conflictos: `closed_days`, `must_book_in_advance`, choques de horario
- Card de reserva: estado pending/reserved/cancelled

---

## Addendum — Ola D2: Splash pseudo-vídeo (mismo día, tras cerrar Ola 4a)

Daniel no consiguió generar el vídeo de entrada que habíamos comentado, pero generó 5 fotos reales del viaje y las dejó en `client/public/JapanPics/` (Tokyo.png, Shibuya.png, Kyoto.png, Osaka.png, Japaneselads.png). Se usaron para simular un "vídeo" de entrada en `SplashScreen.jsx`:

- **Slideshow en bucle:** las 5 fotos rotan cada 900ms con crossfade, con degradado oscuro + las capas de aurora/scanlines existentes encima, para que el texto siga siendo legible.
- **Countdown dinámico real:** antes se calculaba una sola vez "días" al montar el componente. Ahora hay un `setInterval` de 1s que recalcula días/horas/minutos/segundos hasta la fecha y hora exacta de despegue (`new Date(2026, 7, 13, 12, 30, 0)`, hora de Madrid — vuelo IB0281). Se ve ticking en vivo mientras dura la splash (~5s).
- Sin cambios en la lógica de "durante el viaje" / "después del viaje" (siguen usando el cálculo de días por fecha, no el nuevo countdown en vivo, que solo aplica al estado "antes del viaje").
- Verificado en navegador (Playwright): 3 capturas espaciadas 1.2s muestran el slideshow avanzando (Tokyo → Kyoto → Osaka) y los segundos del countdown bajando (33 → 32). Sin errores de consola. Build de producción limpio.

**Pendiente / mejora futura:** las 5 imágenes (~10MB en total) no están optimizadas — si en algún momento la carga inicial en móvil con datos móviles se siente lenta, comprimir/redimensionar antes de servir. No bloqueante para el MVP.

**Archivos tocados:** `client/src/components/SplashScreen.jsx` (único archivo modificado), `client/public/JapanPics/*.png` (nuevos, aportados por Daniel), `SPEC.md` (nueva entrada Ola D2).

---

*Cerrado: 2026-07-14 | Próximo: HANDOVER_06.md — al terminar Ola 4b*

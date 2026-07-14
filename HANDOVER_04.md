# Hand-Over 04 — Ola 3: Mapa

> Fecha: 2026-07-13
> Iteración: Ola 3 — F11 (Mapa interactivo)
> Estado: COMPLETADA ✅

---

## Qué se construyó

### Datos nuevos en `data/trip.json`
- **`lat`/`lng`** añadidos a los 6 hoteles
- **`pois`** — array en cada uno de los 13 días con puntos de interés geocodificados:
  - Tipo `hotel`, `poi`, `memorial`
  - Campos: `name`, `lat`, `lng`, `type`, `note` (opcional)
  - ~4-6 POIs por día incluyendo atracciones principales, barrios y restaurantes clave

### Componentes nuevos
| Componente | Descripción |
|---|---|
| `MapView.jsx` | Mapa full-screen (position fixed, z-index 200). Leaflet + CartoDB Positron tiles (sin API key). Marcadores SVG custom via `L.divIcon`: usuario (azul pulsante `#007AFF`), hotel (rojo `#E8002D`), POI (naranja `#FF6B35`), memorial (gris `#8E8E93`). Panel inferior con lista scrollable de POIs. Banner de fallback si no hay GPS. Usa `id="chelis-map"` para evitar conflictos. |

### Actualizaciones
- `App.jsx` — Estado `mapDayData`; renders `<MapView>` como overlay cuando no es null; pasa `onOpenMap` a `TodayView`
- `TodayView.jsx` — Prop `onOpenMap`; botón "Ver en mapa" con icono en la Hero Card del día actual
- `vite.config.js` — `assetsInclude: ['**/*.png']` para compatibilidad con Leaflet

### Dependencias añadidas
- `leaflet` ^1.9.x en `client/package.json`

---

## Decisiones técnicas

- **Sin PNG para markers:** Los markers por defecto de Leaflet fallan con Vite (rutas relativas no resueltas en el bundle). Solución: `L.divIcon` con SVG inline — cero dependencias de imágenes.
- **CartoDB Positron:** Tiles gratuitos sin API key. Aesthetic limpio y consistente con el diseño Apple del resto de la app.
- **Mapa contextual, no tab:** El mapa se abre desde el botón "Ver en mapa" en la Hero Card, mostrando los POIs del día actual. No ocupa un tab permanente en el BottomNav.

---

## Estado de las olas

| Ola | Estado |
|---|---|
| 0 — Datos | ✅ |
| 1 — Esqueleto + Diseño | ✅ |
| 2 — Billetes + Alertas | ✅ |
| 3 — Mapa | ✅ |
| 4 — Restaurantes | ⬜ Pendiente |
| 5 — Herramientas de viaje | ⬜ Pendiente |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Pendientes urgentes fuera del código

- ⚠️ **Trenes:** ventanas de reserva abiertas (18-24 jul). Al reservar, actualizar en `data/trip.json`: `departure_time`, `arrival_time`, `locator`, `car`, `seat`, `status: "reserved"` → git push → Railway redesplega automáticamente.
- ⚠️ **ESqUISSE (24 ago):** reservar con antelación.
- ⚠️ **Mizunoto:** llamar al +81 460-82-6011 para confirmar política de tatuajes.

## Por dónde continuar

**Ola 4 — Restaurantes:**
- Tab Restaurantes habilitada (actualmente `disabled: true` en BottomNav)
- `RestaurantsView.jsx` — lista de los 32 restaurantes con filtros offline (ciudad, tipo, precio, estrella Michelin)
- `PlannerView.jsx` — planner de comidas/cenas por día (slot lunch/dinner × 13 días)
- Asignación de restaurante a slot → guarda en PostgreSQL (planner compartido Daniel + Chelis)
- Detección de conflictos: `closed_days`, `must_book_in_advance`, choques de horario
- Card de reserva: estado pending/reserved/cancelled

---

*Cerrado: 2026-07-13 | Próximo: HANDOVER_05.md — al terminar Ola 4*

# Hand-Over 03 — Ola 2: Billetes + Alertas

> Fecha: 2026-07-14
> Iteración: Ola 2 — F3 (Billetes y Localizadores) + F18 (Alertas)
> Estado: COMPLETADA ✅

---

## Qué se construyó

### Datos nuevos
- **`data/trip.json`** ampliado con tres secciones:
  - `flights` — IB0281 (ida) e IB0282 (vuelta) con PNR, nº billete, rutas y terminales
  - `hotels` — 6 hoteles con CRS locator, ref AMEX, confirmación, fechas, notas especiales
  - `trains` — 5 trayectos con ventanas de reserva, estado `pending`, URLs de reserva
- **`data/alerts.json`** — 16 alertas precargadas:
  - 8 de Acción: 5 reservas de tren, ESqUISSE, tatuajes Mizunoto, check-in online
  - 4 de Aviso: Obon, calor extremo, Tsukiji Obon, temporada tifones
  - 4 de Consejo: Fushimi Inari 6:00, Arashiyama 7:00, menú kaiseki, salida hotel 7:00

### Componentes nuevos
| Componente | Descripción |
|---|---|
| `AlertsView.jsx` | 3 secciones (Acción/Avisos/Consejos). Dismiss con localStorage. Alertas descartadas: atenuadas al final. Badge dinámico vía `onBadgeChange`. |
| `MoreView.jsx` | Card Billetes con fondo rojo + grid 2×2 de 7 herramientas futuras con "Próximamente". |
| `TicketsView.jsx` | Pantalla push (position fixed). Vuelos: PNR y nº billete copiables al tap. Hoteles: chip "Estancia actual" si fecha en rango, dirección abre Maps. Trenes: estado pending/reserved, botón "Reservar →" con URL. |

### Actualizaciones
- `useTripData.js` — devuelve `flights`, `hotels`, `trains`; nuevo `useAlertsData`; `getUnreadActionCount` exportada
- `App.jsx` — tabs Alertas y Más activos, estado `alertBadge` conectado al BottomNav
- `BottomNav.jsx` — tabs alerts y more habilitados

---

## Estado de las olas

| Ola | Estado |
|---|---|
| 0 — Datos | ✅ |
| 1 — Esqueleto + Diseño | ✅ |
| 2 — Billetes + Alertas | ✅ |
| 3 — Mapa | ⬜ Pendiente |
| 4 — Restaurantes | ⬜ Pendiente |
| 5 — Herramientas de viaje | ⬜ Pendiente |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Pendientes urgentes fuera del código

- ⚠️ **Trenes:** ventanas de reserva abiertas (18-24 jul). Al reservar cada tren, actualizar en `data/trip.json`: `departure_time`, `arrival_time`, `locator`, `car`, `seat`, `status: "reserved"` → git push → Railway redesplega automáticamente.
- ⚠️ **ESqUISSE (24 ago):** reservar con antelación. Bird Land cierra los lunes.
- ⚠️ **Mizunoto:** llamar al +81 460-82-6011 para confirmar política de tatuajes.

## Por dónde continuar

**Ola 3 — Mapa:**
- Leaflet.js + OpenStreetMap en `MapView.jsx`
- Geolocalización del dispositivo
- Pins de hotel del día actual + POIs de la etapa
- Botón "Ver en mapa" en cards de hotel y POI de TodayView/DayNav
- Fallback sin GPS: lista de POIs de la etapa

---

*Cerrado: 2026-07-14 | Próximo: HANDOVER_04.md — al terminar Ola 3*

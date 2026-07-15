# Hand-Over 06 — Ola 4b: Restaurantes

> Fecha: 2026-07-15
> Iteración: Ola 4b — F5 (planificador de comidas + sugeridor offline)
> Estado: COMPLETADA ✅

---

## Qué se construyó

### Datos
- **`data/restaurants_db.json`** — movido desde la raíz del repo a `data/` (donde ya viven `trip.json`, `pois_db.json`, `alerts.json`) para servirse igual, vía el mismo estático Express `/data`. Contenido sin cambios: 32 restaurantes con schema completo (cocina, precio, reserva, horarios, cierre, geolocalización, `good_for`, `why_special`, fuentes).

### Componentes y hooks nuevos
| Archivo | Descripción |
|---|---|
| `client/src/hooks/useRestaurantsData.js` | Carga `restaurants_db.json`, mapea nombres de ciudad ES↔EN (`Tokio`↔`Tokyo`, `Kioto`↔`Kyoto`), `getRestaurantById`, `getRestaurantsByCity`, `distanceKm` (haversine). |
| `client/src/components/RestaurantsView.jsx` | Sugeridor espontáneo offline (F8b). Chips de filtro: ciudad, tier de precio ¥–¥¥¥¥, "sin reserva", ocasión (`good_for`, generados dinámicamente de los datos). Ordena por distancia si hay geolocalización, si no por nombre. Tarjetas expandibles con `why_special`, horario, precio, reserva, días de cierre. |
| `client/src/hooks/usePlannerData.js` | Estado del planificador. Intenta persistir en `/api/planner` (Postgres compartido); si el servidor no tiene `DATABASE_URL`, cae a `localStorage` sin bloquear la funcionalidad — solo avisa que no es compartido. Incluye `getSlotConflicts` (cierre semanal según el día real de la semana, `meal_types`, `must_book_in_advance`). |
| `client/src/components/PlannerView.jsx` | Planificador pre-viaje (F8a). Overlay full-screen con los 13 días × 2 slots (mediodía/noche). Cada slot: vacío → "Elegir restaurante" (lista filtrada por ciudad del día) → asignado → "Marcar reservado" (nº de confirmación) → reservado. Botón "Quitar" para deshacer. Avisos de conflicto inline. |

### Backend
- **`server/routes/planner.js`** — `GET /api/planner` (todos los slots), `PUT /api/planner/:day/:slot` (upsert), `DELETE /api/planner/:day/:slot`. Crea la tabla `planner_slots` en Postgres de forma perezosa (`CREATE TABLE IF NOT EXISTS`) la primera vez que hay pool disponible. Si no hay `DATABASE_URL`, responde `persisted: false` / `503` según la operación, para que el cliente sepa que debe usar su fallback local.
- **`server/index.js`** — monta el router en `/api/planner`.

### Actualizaciones
- `BottomNav.jsx` — tab "Restaurantes" activada (`disabled: false`).
- `App.jsx` — nuevo tab `restaurants` renderiza `RestaurantsView`; nuevo overlay `showPlanner` (mismo patrón de prioridad que `TicketsView`/`MapView`) que renderiza `PlannerView`. Import de `ComingSoon` eliminado (ya no se usa en ningún tab).

---

## Decisiones técnicas

- **Ciudades sin restaurantes curados (Madrid, Hakone):** el planificador no bloquea — el picker muestra un aviso ("no hay restaurantes curados para esta ciudad, improvisa sobre el terreno") en vez de ocultar el botón.
- **`_research_notes` de `restaurants_db.json` no se consume en el detector de conflictos:** los avisos de temporada/Obon viven ahí a nivel de dataset, no por restaurante — el detector automático solo usa campos por-restaurante (`closed_days`, `must_book_in_advance`, `meal_types`). Backlog abierto si hace falta más adelante.
- **Fallback a localStorage sin bloquear:** en desarrollo no hay `DATABASE_URL` configurada, así que el planificador funciona 100% en local (con aviso visible de que no es compartido) — coherente con la regla de "funciona offline" de `CONSTITUTION.md`. En producción con Railway + Postgres, la persistencia es real y compartida entre los dos viajeros.
- **Filtros de ocasión generados dinámicamente** desde los valores únicos de `good_for` en el dataset, no hardcodeados — si se añaden restaurantes con nuevas etiquetas, los chips aparecen solos.

---

## Verificación

- Build de producción (`npm run build`) sin errores.
- Servidor Express probado localmente: `/data/restaurants_db.json` (200), `/api/planner` (fallback correcto sin DB configurada).
- Probado en navegador real (Playwright, viewport móvil 390×844), sin errores de consola en todo el flujo:
  1. Tab "Restaurantes" habilitada y funcional, 32 restaurantes con todos los chips de filtro (ciudad/precio/sin reserva/ocasión).
  2. Filtro por ciudad (Tokio → 9 resultados) funciona correctamente.
  3. Tarjeta expandible muestra detalle completo (why_special, precio, horario, reserva, cierre, teléfono).
  4. Planificador abre con los 13 días × 2 slots.
  5. Asignar restaurante (picker filtrado por ciudad del día) → chip "Asignado" ✅.
  6. Marcar reservado con nº de confirmación → chip "Reservado" + nº visible ✅.
  7. Volver a la vista principal sin romper estado.
- **Pendiente de una pasada rápida (no bloqueante):** botones "Cambiar"/"Quitar" de un slot, y combinación de filtros de precio + ocasión + "sin reserva" en `RestaurantsView`, no se probaron explícitamente en esta ronda.

---

## Estado de las olas

| Ola | Estado |
|---|---|
| 0 — Datos | ✅ |
| 1 — Esqueleto + Diseño | ✅ |
| 2 — Billetes + Alertas | ✅ |
| 3 — Mapa | ✅ |
| D — Dark Premium | ✅ |
| D2 — Splash pseudo-vídeo | ✅ |
| 4a — Guía de Viaje Detallada | ✅ |
| 4b — Restaurantes | ✅ |
| 5 — Herramientas de viaje | ⬜ Pendiente (siguiente) |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Pendientes urgentes fuera del código

- ⚠️ **Trenes:** ventana de reserva del primer tramo (Tokio→Hakone, Odakyu Romancecar) — revisar si ya se abrió/gestionó (18 jul según la última nota).
- ⚠️ **ESqUISSE (24 ago):** reservar con antelación.
- ⚠️ **Mizunoto:** llamar al +81 460-82-6011 para confirmar política de tatuajes.
- ⚠️ **Roan Kikunoi y Bird Land Ginza:** si se van a visitar, necesitan reserva con antelación — ahora se pueden marcar en el nuevo planificador de comidas.

## Por dónde continuar

**Ola 5 — Herramientas de viaje (F8-F13):**
- Frases útiles en japonés (offline)
- Conversor de moneda (¥ ↔ €, tasa fija embebida — sin API en vivo)
- Contactos de emergencia (embajada, seguro de viaje, 110/119)
- Guía de Suica/Pasmo (carga, uso en transporte/tiendas)
- Info de clima típico de agosto en cada ciudad (no en vivo, solo referencia histórica)

**Nota:** para desplegar la persistencia real del planificador hace falta que Railway tenga el plugin PostgreSQL activo y `DATABASE_URL` configurada como variable de entorno del servicio backend — sin eso, cada dispositivo ve su propio estado local.

---

*Cerrado: 2026-07-15 | Próximo: HANDOVER_07.md — al terminar Ola 5*

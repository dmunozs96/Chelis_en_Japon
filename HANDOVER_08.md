# Hand-Over 08 — Ola 4d: Plan operativo detallado (completo)

> Fecha: 2026-07-15
> Iteración: Ola 4d — `blocks[].steps` extendido a los 13 días del itinerario
> Estado: COMPLETADA ✅

---

## Por qué se hizo

En HANDOVER_07 se dejó un piloto de `blocks[].steps` solo en el 15 de agosto, a la espera de que Daniel validara el formato antes de invertir en el resto del viaje. Daniel lo verificó en la app desplegada y pidió "adelante con todo el plan" — extender el mismo nivel de detalle operativo a los 12 días restantes.

---

## Qué se construyó

### `data/trip.json`
`steps` añadido a los bloques de los 13 días del itinerario (antes solo 15 ago). 87 pasos nuevos repartidos en:
- **13 y 25 ago (vuelos):** traslado aeropuerto, facturación/seguridad, despegue/aterrizaje — más ligero que el resto por ser días de tránsito, no de ciudad.
- **14 ago (llegada Tokio):** Narita Express, primera comida en Yurakucho Sanchoku Inshokugai, Hibiya Park, azotea Ginza Six.
- **16 ago (libre, Yanaka):** solo el bloque fijo de la mañana lleva `steps` — tarde y noche se dejan sin detallar, coherente con ser día libre.
- **17-18 ago (Hakone → Kioto):** Odakyu Romancecar, Hakone Tozan Line, shuttle del ryokan, Shinkansen Odawara→Kioto.
- **19-20 ago (Kioto):** rutas Keihan (Fushimi Inari), JR Sagano/Randen (Arashiyama), buses urbanos de Kioto (Kinkaku-ji, Nijo).
- **21-22 ago (Hiroshima → Osaka):** tranvía urbano de Hiroshima, Shinkansen, Midosuji Line en Osaka.
- **23 ago (Osaka → Tokio):** Tanimachi/Midosuji, Shinkansen Osaka→Tokio (~3h).
- **24 ago (libre):** solo la cena de despedida lleva `steps`.

### Corrección de datos: Miyajima → Shukkei-en (22 ago)
El bloque de la mañana del 22 de agosto seguía diciendo "Isla de Miyajima" en `trip.json`, pero `SPEC.md` sección 2 ya documentaba la decisión confirmada de descartar Miyajima por falta de tiempo. Además, `data/pois_db.json` ya tenía curado el POI `shukkei-en` (con fuente e info completa) sin usarse en ningún bloque — señal clara de que el cambio se decidió pero no se propagó al dato. Se corrigió el bloque (`label`, `activity`, `poi_id`) para que coincida con la decisión ya tomada, dejando una nota explícita en la propia `activity` ("Miyajima descartado, no llegaba el tiempo") para que quede visible en la app por qué cambió el plan.

### `poi_id` recuperados
Al escribir los `steps`, se detectaron POIs ya curados en `pois_db.json` que no estaban enlazados desde ningún bloque: `tsukiji-outer-market`, `shibuya-sky`, `hibiya-park`, `ginza-six`, `genbaku-dome`, `hozenji`. Se enlazaron tanto en los `steps` como (cuando aplicaba) en el bloque padre, para que sean tappables hacia `POIDetailView`.

### `client/src/components/TodayView.jsx`
`stepIcon()` ampliado con dos modos de traslado nuevos: `bus` (🚌, usado en Kioto para Arashiyama→Kinkaku-ji→Nijo) y `avion` (✈️, usado en los días de vuelo).

---

## Honestidad sobre incertidumbre

Igual que en el piloto (HANDOVER_07), todos los tiempos de traslado de `steps` son **estimaciones basadas en la geografía y las líneas de transporte reales**, no confirmaciones de Google Maps para la fecha exacta del viaje. Esto aplica ahora a los 13 días, no solo al 15 de agosto. Recomendado verificar con Google Maps/Navitime la semana antes del viaje, especialmente los tramos con buses urbanos (Kioto) donde el tráfico varía más que en metro/tren.

---

## Verificación

- Build de producción (`npm run build` en `client/`) sin errores.
- Validación de `data/trip.json` como JSON válido tras cada edición (`node -e "JSON.parse(...)"`, 13/13 días con `steps`, recuento total de pasos verificado).
- Probado en navegador real (Playwright vía `playwright-core`, viewport móvil 390×844):
  - Días 20, 21 y 22 elegidos deliberadamente por tener bloques duplicados en la misma franja horaria (dos bloques "tarde" el mismo día) — para confirmar que el toggle de cada bloque despliega solo sus propios pasos y no los del bloque vecino.
  - Recuento de botones "Ver plan detallado" por día coincide exactamente con el número de bloques (día 20: 4, día 21: 5, día 22: 4).
  - Captura del día 22 confirma visualmente la corrección Miyajima→Shukkei-en con la nota explicativa.
  - Sin errores de consola en ningún día probado.

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
| 4c — Plan operativo detallado (piloto 15 ago) | ✅ |
| 4d — Plan operativo detallado (completo, 13 días) | ✅ |
| 5 — Herramientas de viaje | ⬜ **SIGUIENTE** |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Por dónde continuar

1. **Ola 5 — Herramientas de viaje (F8-F13):** frases en japonés, conversor ¥/€, emergencias, guía Suica/IC card, clima por etapa. Es la siguiente ola marcada en `SPEC.md`.
2. **Verificación de traslados antes del viaje:** los tiempos de metro/tren/bus de `blocks[].steps` son estimaciones — repasarlos con Google Maps/Navitime la semana antes de salir, sobre todo los tramos en bus de Kioto.
3. Pendientes urgentes fuera del código (sin cambios desde HANDOVER_07): trenes por reservar (ventanas 18-24 jul — revisar si ya se gestionaron, hoy es 15 jul y la primera ventana abre mañana 18 jul), ESqUISSE, política de tatuajes Mizunoto, Roan Kikunoi/Bird Land Ginza.

---

*Cerrado: 2026-07-15 | Próximo: HANDOVER_09.md — al terminar Ola 5*

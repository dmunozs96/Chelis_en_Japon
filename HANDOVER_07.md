# Hand-Over 07 — Ola 4c: Plan operativo detallado (piloto 15 ago)

> Fecha: 2026-07-15
> Iteración: Ola 4c — `blocks[].steps`, plan detallado por bloque
> Estado: COMPLETADA ✅ (piloto en un solo día, a la espera de validación antes de replicar)

---

## Por qué se hizo

Daniel señaló que el nivel de detalle del plan del día (mañana/tarde/noche con una frase por bloque, ej. "Asakusa — templo, calle y callejuelas") no era operativo: no dice cómo llegar desde el hotel, cuánto tarda cada tramo, ni qué calles/puntos concretos recorrer dentro de un barrio. Antes de tocar código se acotó el alcance con Daniel (ver preguntas/respuestas de la sesión):

- Estructura: sub-pasos dentro de los bloques existentes (no un timeline plano nuevo).
- Traslados: modo + duración + punto de referencia (sin turn-by-turn de calles a pie tramo a tramo).
- Alcance: piloto solo en el 15 de agosto, no los 13 días de golpe.
- Recorridos dentro de un barrio: ruta sugerida con nombres de calles/puntos clave (no solo el nombre del barrio).

---

## Qué se construyó

### Schema (`SPEC.md` sección 5c)
Nuevo campo opcional `blocks[].steps`: array cronológico de pasos con `time`, `type` (`transfer`/`walk`/`visit`/`food`/`free`), `mode` (solo transfers: `walk`/`metro`/`tren`/`taxi`), `title`, `detail`, `duration_min`, `poi_id` opcional.

### Datos (`data/trip.json`, día 2026-08-15)
Los 4 bloques del día (Asakusa, Tsukiji Outer Market, Palacio Imperial, Shibuya) llevan ahora `steps` completos — 20 pasos en total:
- Traslados con línea de metro real (Ginza Line, Hibiya Line, Chiyoda Line), nº de paradas y duración estimada.
- Recorridos dentro de cada barrio con puntos concretos: Kaminarimon → Nakamise-dori → Senso-ji → Asakusa-jinja/Denboin-dori → Hoppy-dori (Asakusa); Hibiya Park → Otemon → Jardines del Este (Palacio Imperial); Hachiko → Shibuya Crossing → Harajuku opcional → Shibuya Sky → Nonbei Yokocho/Dogenzaka (Shibuya).

### UI (`client/src/components/TodayView.jsx`)
- `DayCard`: cada bloque con `steps` muestra un botón "Ver plan detallado (N pasos) ▼", colapsado por defecto (no satura la vista rápida de "Hoy").
- `StepsList` (nuevo componente interno): sub-timeline con icono por `type`/`mode` (🚶 andar, 🚇 metro/tren, 🍜 comida, 📍 visita, ✨ libre), hora, título, duración estimada y detalle. Los pasos con `poi_id` son tappables hacia `POIDetailView`, igual que los bloques.
- `DayNav.jsx` reutiliza `DayCard`, así que el cambio se propaga automáticamente a la navegación día-a-día sin tocar ese archivo.

---

## Decisiones y honestidad sobre incertidumbre

- **Los tiempos de traslado son estimaciones geográficas** (líneas de metro reales, distancias reales de Tokio), no confirmaciones de Google Maps para la fecha exacta del viaje ni localizadores reservados. Documentado explícitamente en `SPEC.md` 5c como aplicación de la regla 7 de `CONSTITUTION.md` ("Honestidad sobre incertidumbre"). Recomendado verificar con Google Maps/Navitime la semana antes del viaje.
- **Piloto limitado a un día:** reconstruir este nivel de detalle para los 12 días restantes implica investigar rutas de metro/tren reales entre cada POI de cada ciudad (Kioto, Hakone, Hiroshima, Osaka) — no es mecánico, cada día es trabajo real. Se decidió no hacerlo de golpe hasta que Daniel valide que el formato (sub-timeline colapsable, iconos, nivel de detalle de traslado) es el que quiere.

---

## Verificación

- Build de producción (`npm run build` en `client/`) sin errores.
- Probado en navegador real (Playwright vía `playwright-core` en `node_modules`, viewport móvil 390×844):
  1. Splash → tab "Viaje" → día 15 de agosto.
  2. Los 4 bloques muestran su botón "Ver plan detallado (N pasos)".
  3. Al expandir los 4, se ve la sub-timeline completa con iconos, horas, duraciones y detalle — sin errores de consola (`console --errors` vacío).
- **Nota de entorno:** no existe skill de proyecto para levantar la app (`.claude/skills/` sin match); se lanzó manualmente `node server/index.js` (puerto 3000, sirve `/data` y `/api`) + `npm run dev --prefix client` (Vite, puerto 5173 con proxy a 3000). Se recomienda `/run-skill-generator` si esto se repite a menudo.

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
| 5 — Herramientas de viaje | ⬜ Pendiente |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Por dónde continuar

1. **Decisión pendiente con Daniel:** ¿el formato del piloto (sub-timeline colapsable + iconos + nivel de detalle de traslado) es el que quiere para el resto del viaje? Si sí → **Ola 4d**, replicar `steps` en los 12 días restantes (Hakone, Kioto ×3, Hiroshima, Osaka, Tokio ×2, días de tránsito). Si no → ajustar el schema/formato antes de escalar.
2. Si se aprueba Ola 4d, cada día necesita investigación real de rutas de metro/tren entre POIs (no reutilizable de Tokio) — presupuestar tiempo por ciudad.
3. Pendientes urgentes fuera del código (sin cambios desde HANDOVER_06): trenes por reservar (ventanas 18-24 jul), ESqUISSE, política de tatuajes Mizunoto, Roan Kikunoi/Bird Land Ginza.

---

*Cerrado: 2026-07-15 | Próximo: HANDOVER_08.md — al decidir alcance de Ola 4d o al terminar Ola 5*

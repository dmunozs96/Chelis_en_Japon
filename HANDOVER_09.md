# Hand-Over 09 — Ola 4e: Convención horaria española

> Fecha: 2026-07-15
> Iteración: Ola 4e — franjas mañana/tarde/noche y horarios de comida/cena ajustados a la convención española
> Estado: COMPLETADA ✅

---

## Por qué se hizo

Daniel (español) señaló que su noción coloquial de las franjas del día no coincidía con cómo se habían etiquetado los bloques del itinerario: para él la mañana dura hasta las 14:00, se come 13:00-14:00, la tarde empieza justo después de comer, y la noche desde las 20:00. Antes de tocar nada se debatió si ese ritmo es compatible con los horarios de restauración de Japón — sí lo es en general (Japón comparte con España el "horario partido", cocina cerrada entre comida y cena, a diferencia del mundo anglosajón), con una excepción real: muchos restaurantes japoneses cierran cocina sobre las 21:00-21:30, así que cenar a partir de las 20:00 en punto tiene menos margen que en España, y algunos servicios (ryokan, restaurantes con turno de reserva) tienen hora fija no negociable.

---

## Qué se construyó

### Convención documentada (`SPEC.md` sección 5d)
Tabla de franjas (mañana hasta 14:00, mediodía como franja propia ~11:00-14:30, tarde 14:00-20:00, noche desde 20:00, madrugada antes de 07:00) + la compatibilidad con horarios japoneses + la regla de cuándo usar una etiqueta híbrida.

### `data/trip.json` — recorrido completo de los 13 días
- **Comidas** movidas a ~13:00 (antes repartidas 11:00-12:30 según el día): Tsukiji (15 ago), Higashiyama (19 ago), Nijo (20 ago).
- **Cenas** movidas a ~20:00 (antes 18:00-19:30 según el día): 14, 15, 18, 19, 20, 21, 22, 23 y 24 de agosto.
- **Bloques mal etiquetados corregidos** (contenido 100% de mañana pero decían "tarde"): Higashiyama (19 ago) y Kinkaku-ji (20 ago) → ahora "mañana".
- **Etiquetas híbridas nuevas** para bloques que genuinamente mezclan dos franjas y no se podían reordenar sin perder sentido: `Shibuya` (15 ago), `Onsen y cena` (17 ago) y `Dotonbori` (22 ago) → `tarde-noche`; `Nijo` (20 ago) → `mañana-tarde`; `Nishiki` (20 ago) → `tarde-noche`.
- **Reordenados en vez de hibridar** donde fue posible: Gion (18 y 19 ago) ahora cenan primero y pasean después (paseo digestivo nocturno), quedando limpiamente dentro de "noche" sin necesitar etiqueta compuesta.
- **Check-in Hiroshima** (21 ago): bloque de 20 min enteramente antes de las 14:00, reetiquetado de "tarde" a "mediodía" (más representativo que un "mañana" aislado de 20 minutos entre dos bloques de mediodía/tarde).

### `client/src/components/TodayView.jsx`
Columna de franja (`.block-left`) ensanchada de 48px a 58px, con `word-break: break-word` y `hyphens: auto` en `.block-time`/`.block-franja` para que las etiquetas compuestas (`mañana-tarde`, `tarde-noche`) envuelvan en dos líneas legibles sin romper el layout de la columna estrecha.

---

## Honestidad sobre incertidumbre

No todas las cenas se movieron mecánicamente a las 20:00. Se dejó nota explícita donde el horario real no es negociable:
- **Cena kaiseki del ryokan de Hakone (17 ago):** la hora la fija el propio hotel (a menudo 18:00 o 19:00), no el huésped — nota añadida en el step.
- **ESqUISSE / restaurantes con turno de reserva (24 ago):** los turnos de reserva pueden no coincidir exactamente con las 20:00 — nota añadida.
- **Shibuya Sky (15 ago):** atado a la hora real de la puesta de sol en agosto (~18:30-18:45 en Tokio), no se puede mover a discreción — nota añadida y duración ampliada para dar margen hasta la cena de las 20:00.

---

## Verificación

- Validación de `data/trip.json` como JSON tras cada edición.
- Script de recuento de rangos horarios por bloque (`node -e`) para confirmar que cada bloque queda dentro de su franja tras los ajustes, y que las etiquetas híbridas solo se usan donde el contenido realmente se reparte entre dos franjas de forma sustancial.
- Build de producción sin errores.
- Probado en navegador real (Playwright, viewport móvil 390×844): días 15, 20 y 22 (elegidos por tener las nuevas etiquetas híbridas) — las etiquetas `tarde-noche` y `mañana-tarde` se ven correctamente envueltas en dos líneas en la columna de franja, sin errores de consola.

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
| 4e — Convención horaria española | ✅ |
| 5 — Herramientas de viaje | ⬜ **SIGUIENTE** |
| 6 — Personal + privado | ⬜ Pendiente |
| 7 — Offline + PWA | ⬜ Pendiente |
| 8 — Trenes reales + pulido | ⬜ Pendiente (espera reservas) |

---

## Por dónde continuar

1. **Ola 5 — Herramientas de viaje (F8-F13):** frases en japonés, conversor ¥/€, emergencias, guía Suica/IC card, clima por etapa.
2. **Verificar los horarios fijos no confirmados** antes del viaje: hora exacta de la cena kaiseki en Mizunoto (llamar al +81 460-82-6011, aprovechar y preguntar también por la política de tatuajes), turno de reserva de ESqUISSE si se elige.
3. Pendientes urgentes fuera del código (sin cambios desde HANDOVER_08): trenes por reservar (la primera ventana, Tokio→Hakone, abre mañana 18 jul a las 10:00 JST), ESqUISSE, política de tatuajes Mizunoto, Roan Kikunoi/Bird Land Ginza.

---

*Cerrado: 2026-07-15 | Próximo: HANDOVER_10.md — al terminar Ola 5*

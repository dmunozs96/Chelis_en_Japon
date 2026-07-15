# HANDOVER 17 — Puerta A aprobada + Auditoría de restaurantes (lote 0)

> Fecha: 2026-07-15 | Estado: V2 autorizada y en ejecución; lote 0 completado

## Objetivo de esta sesión

Daniel aprobó el plan director V2 completo y resolvió las 8 decisiones de la Puerta A. Con la autorización concedida, esta sesión ejecutó la fase de gobernanza (enmienda constitucional + registro de decisiones) y el primer entregable de la Fase 0: la auditoría verificada de los 32 restaurantes.

## Decisiones de la Puerta A (registradas en `PLAN_V2.md` §17)

1. **Calidad sobre cantidad:** objetivo gastronómico rebajado de 400 a **Top 50 profundo + ~150 fichas operativas**.
2. **Cero APIs de pago** — también para clima, mapas y fotos.
3. **Compras:** todas las categorías; prioritarias denim, relojes, cámaras y cuchillos. Día flexible («el que mejor vuele según la situación»); el 24 ago sigue siendo el candidato natural.
4. **Comida:** sin restricciones ni alergias. **Cena premium Michelin descartada por precio** — la despedida del 24 queda abierta.
5. **Privacidad:** sin almacenar documentos ni datos personales; solo estados «hecho ✓» en localStorage.
6. Derivadas técnicas: Leaflet se mantiene (sin MapLibre/PMTiles); estado compartido con last-write-wins simple.

## Entregado en esta sesión

### Gobernanza
- `CONSTITUTION.md` **v2.0**: listón de calidad («sustituir a una guía de pago»), regla 1 ampliada (trazabilidad por campo, entidades genéricas, sucursales), regla 6 enmendada (estado compartido simple, cero APIs de pago reconfirmado), **nueva regla 8 de privacidad**, alcance V2 completo.
- `SPEC.md` **v2.0**: nueva sección 11 (decisiones cerradas + calendario de 4 semanas + contrato de verificación resumido); día 24 y cenas de Kioto actualizados; advertencias nuevas.
- `PLAN_V2.md`: cabecera con estado APROBADO y §17 con las respuestas literales.

### Datos — cena de despedida
- `trip.json` (24 ago): paso de cena sin Michelin, abierta.
- `alerts.json`: eliminada la alerta «Reservar ESqUISSE» (obsoleta tras la decisión).
- `restaurants_db.json`: lista de prioridades de reserva actualizada (ESqUISSE/Bird Land descartados).

### Auditoría lote 0 — `AUDIT_RESTAURANTES.md`
Los 32 registros verificados contra la web en vivo (3 agentes en paralelo: Tokio, Kioto, Osaka+Hiroshima). Resultado: **31 fichas activas, 1 eliminada, ninguna inventada**. Hallazgos principales:

1. **Honke Owariya (soba de 1465) cerró el 11-ene-2026** → eliminado de la base.
2. **Conflicto de itinerario detectado y corregido:** el 19 ago es miércoles y las dos cenas previstas (Kyogoku Kaneyo, Roan Kikunoi) cierran los miércoles → el unagi pasa al jueves 20 (entrada 19:30; su cocina cierra a las 20:00) y el 19 tiene alternativas verificadas.
3. **Tsuta:** ficha reescrita entera (Yoyogi-Uehara, sin estrella desde 2020, walk-in, cierra martes).
4. **Estrellas corregidas:** Bird Land 1→0 (Selected desde 2024), Jiro 3→0 (fuera de la guía desde 2020, y cierra 14-19 ago 2026), Roan Kikunoi confirmado 2★ pero con precio real 3-4× el de la ficha.
5. **4 renombres** (Sanchoku Yokocho, Gahōjin Kappa, Kyo Asobi, Mendokoro Janomeya) y **8 sucursales fijadas** (Daruma→Dotonbori 1-6-8, Wanaka→Sennichimae, Acchichi→Soemoncho, Chibo, Bonkuraya, CREO-RU, Micchan Hatchobori, Ichiniisan Ginza INZ).
6. Horarios/días de cierre corregidos en ~10 fichas (Ajinoya cierra lunes, Mizuno ya no cierra jueves, Kyo Asobi cierra domingos, Imai miércoles + 4º martes, Micchan martes y horario partido…).

Cada corrección lleva su fuente y «verificado 15 jul 2026» en la ficha. Deuda consciente en §6 del audit: coordenadas aproximadas en locales mudados (pendiente geocodificación V2), campos de verificación estructurados pendientes del esquema del lote 1, revalidación final la semana del 3-10 ago.

## Verificación

- `npm run check` completo en verde: validación de datos (13 días, 24 POIs, 31 restaurantes, 15 alertas), tests y build de producción con PWA.

## Cómo continuar en la próxima sesión

1. **Esta semana es la de los trenes:** las ventanas abren el 18-24 jul (Romancecar el sábado 18, 10:00 JST). Cuando Daniel reserve, actualizar `trip.json` (hora, localizador, coche/asiento, `status: "reserved"`) — Ola 8.
2. **Contrato editorial + esquema V2** (`entity_type`, `verification_status`, `last_verified_at`, `name_ja`, fuentes estructuradas) con migración de las 31 fichas y validador ampliado.
3. **Checklist de preparación** (Dominio A): ya estamos en T−29; la Vista Hoy en modo preparación es lo más valioso ahora mismo.
4. **Guía cultural esencial** (Dominio C): mayor valor por hora invertida; no sacrificar por volumen de fichas.
5. Después: Top 50 (lote 1), Modo Ahora básico, compras/día libre, rutas GeoJSON críticas.

## Estado del repositorio al cerrar

- Commit único con: gobernanza (CONSTITUTION/SPEC/PLAN_V2), datos corregidos (trip/alerts/restaurants), `AUDIT_RESTAURANTES.md` y este handover.
- `.claude/` sigue sin versionarse.
- Sin cambios de código de cliente/servidor en esta iteración — todo es contenido, datos y gobernanza. El deploy (git push a GitHub → Railway) queda a decisión de Daniel; todo está validado para publicarse.

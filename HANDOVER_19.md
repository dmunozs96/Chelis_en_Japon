# HANDOVER 19 — Ola 8 (fase previa): dosier de trenes y corrección de las ventanas de reserva

> Fecha: 2026-07-22 (trabajo de datos hecho el 16 jul, commiteado y documentado el 22 jul)

## Objetivo

Preparar la Ola 8 (trenes reales) antes de que Daniel reserve. Al verificar las reglas contra fuentes oficiales el 16 jul se detectó que **todas las fechas de reserva estaban corridas un día**: la app y los handovers decían que la primera ventana abría el «18 jul», pero la regla oficial es **10:00 JST del mismo día un mes antes** (03:00 hora española). Se corrigieron los datos y se redactó el dosier operativo.

## Entregado

### `DOSIER_TRENES.md` (nuevo)
Dosier completo de reservas: calendario con hora española, ficha por tren (Romancecar con asientos panorámicos GSE y alternativa Hakone Freepass; los 4 shinkansen por SmartEX con asiento E lado Fuji y elección de tren del 18 ago; N'EX Round Trip Ticket ¥5.000 comprado en Narita), y resumen operativo día a día para Daniel. Todas las reglas citan fuente oficial (Odakyu global, SmartEX FAQ, JR Central, JR East).

### `data/alerts.json`
- Las 5 alertas de tren corregidas: ventanas **17, 18, 21, 22 y 23 jul** (antes 18-24). URL del Romancecar → e-Romancecar (`web-odakyu.com`). Cuerpos ampliados con hora JST/ES, modelo de tren, asiento y nota «Verificado 16 jul 2026».
- Alerta Obon matizada: Nozomi todo-reservado 7-16 ago **no afecta** a los trayectos del viaje (18-23 ago).

### `data/trip.json`
- Paso del Romancecar (17 ago): detalle con la ventana corregida (17 jul, 10:00 JST). Sigue `pending` — pendiente de localizador real.

### `data/restaurants_db.json`
Reverificación puntual del 16 jul (no relacionada con trenes, aprovechada en la misma pasada):
- **Tsujihan**: horario real corregido (L-V 11:00-21:00, S-D 10:00-21:30; cierre irregular ~1 domingo/mes, riesgo el 16 ago), nota de suplemento de ración desde dic-2025, +1 fuente Hot Pepper (`source_count` 2→3).
- **Tonkatsu Aoki**: horario diferenciado almuerzo/cena precisado. Ambas con `last_verified_at` 2026-07-16.

### `SPEC.md`
- §9 Advertencias: la advertencia de trenes tenía aún las fechas viejas (18-24 jul, `odakyu-romance.jp`); corregida a la regla real y a las plataformas correctas, con puntero al dosier.

## Verificación
`npm run validate:data` en verde: 13 días, 24 POIs, 37 restaurantes, 15 alertas, 6 accesos, 25 frases.

## Estado y cómo continuar

- **Reservas: a 22 jul, ninguna hecha todavía.** Las ventanas ya abiertas: Romancecar (17 jul), Hikari a Kioto (18 jul), Kioto→Hiroshima (21 jul), Hiroshima→Osaka (abre 22 jul), Osaka→Tokio (abre 23 jul). Riesgo real bajo (demanda post-Obon moderada), pero conviene reservar cuanto antes; los panorámicos GSE del Romancecar probablemente ya no estén.
- **Ola 8 (volcado real) — pendiente de Daniel:** al reservar, pasar hora/tren/coche/asiento/localizador → actualizar cada `steps` de `trip.json` con los datos reales y `status: "reserved"`, y descargar billetes offline (regla P4).
- **Siguiente foco de desarrollo (decidido 22 jul):** completar el **Top 50** (faltan 13 fichas, de 37 a 50) con la misma calidad verificada.

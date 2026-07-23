# HANDOVER 26 — Ola 8 completada: reservas de tren e itinerario reconciliado

> Fecha: 2026-07-23 | Estado: reservas interurbanas completas

## Punto de partida

Claude había leído los trece PDFs de `reservas/` y rellenado parcialmente el array `trains` de `data/trip.json`, pero la tarea quedó interrumpida antes de reconciliar el plan diario. Persistían:

- cinco pasos con “hora pendiente”;
- servicios antiguos Hikari donde finalmente se compró Nozomi;
- museo de Hakone a las 13:00 del día 17, imposible con un Romancecar que llega a las 14:56;
- check-ins anteriores a la llegada real;
- Osaka → Tokio planificado por la mañana pese a que el Nozomi sale a las 16:06;
- cinco alertas de acción para compras ya completadas;
- ventanas de reserva corridas un día en el array `trains`;
- URL antigua de Odakyu.

## Reservas incorporadas

| ID | Servicio | Trayecto | Horario | Coche / asientos | Localizador |
|---|---|---|---|---|---|
| `train_01` | Hakone 27 (GSE) | Shinjuku → Hakone-Yumoto | 13:20–14:56 | 1 · 4A/4B panorámicos | 00023 |
| `train_02` | Hikari 641 | Odawara → Kioto | 12:07–14:12 | 6 · 15A/15B | 2000 |
| `train_03` | Nozomi 135 | Kioto → Hiroshima | 11:16–12:56 | 5 · 7A/7B | 2001 |
| `train_04` | Nozomi 94 | Hiroshima → Shin-Osaka | 12:03–13:28 | 4 · 5D/5E | 2002 |
| `train_05` | Nozomi 34 (N700S) | Shin-Osaka → Tokio | 16:06–18:33 | 5 · 5D/5E | 2003 |

Los PDFs y QR permanecen en `reservas/`, ignorados por Git. `reservas/README.md` sí se versiona. No se publican en el PWA.

## Itinerario reconciliado

### 17 de agosto

- Check-out 10:30.
- Almuerzo en Shinjuku.
- Hakone 27 a las 13:20.
- Llegada estimada a Mizunoto sobre las 16:00.
- El museo se elimina de este día.

### 18 de agosto

- Check-out temprano.
- Hakone Open-Air Museum 09:00–10:15.
- Consigna oficial del museo para el equipaje.
- Bajada a Odawara con objetivo 11:15.
- Hikari 641 a las 12:07; ekiben a bordo.
- Lago Ashi descartado por falta de margen.

El horario 09:00–17:00 y la consigna gratuita se comprobaron el 23 jul en la web oficial del museo.

### 21 de agosto

- Check-out 09:30.
- Nozomi 135 a las 11:16.
- Llegada 12:56, dejar equipaje y comer antes del Parque de la Paz.

### 22 de agosto

- Shukkei-en 09:00.
- Nozomi 94 a las 12:03.
- Llegada a Namba, comida y check-in después de las 15:00.

### 23 de agosto

- Castillo de Osaka y check-out por la mañana.
- Comida y últimas horas en Namba.
- Nozomi 34 a las 16:06.
- Check-in en Tokio sobre las 19:00.
- Posible vista del Fuji desde el asiento 5E hacia las 17:45 si el cielo acompaña.

## Otros cambios

- Eliminadas las cinco alertas `train-01` a `train-05`; el badge de acciones deja de mostrar compras ya hechas.
- Corregidas las cinco `reservation_window_opens` a 17, 18, 21, 22 y 23 de julio.
- Corregida URL de Odakyu a e-Romancecar.
- Actualizados `SPEC.md`, `DOSIER_TRENES.md` y `reservas/README.md`.
- Movido `hakone-openair` del array `pois` del día 17 al día 18 para conservar la integridad del mapa/ruta.

## Verificación

`npm.cmd run check` completo en verde:

- 13 días;
- 24 POIs;
- 62 restaurantes;
- 10 alertas (antes 15);
- 6 accesos;
- 25 frases;
- 2 tests;
- build Vite y service worker PWA correctos.

`npm install` informa de una vulnerabilidad alta en dependencias del cliente ya existente. No se ejecutó `npm audit fix` porque queda fuera de esta tarea y podría introducir cambios de versión.

## Pendiente operativo

- N'EX de ida/vuelta: comprar Round Trip Ticket al llegar a Narita y reservar allí ambos asientos.
- Confirmar con Mizunoto horario de shuttle, cena y política de tatuajes.
- Antes del viaje, revisar los horarios locales de Hakone y dejar margen si hay colas o incidencias.


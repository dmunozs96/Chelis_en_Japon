# HANDOVER 15 — Cuenta atrás unificada

> Fecha: 2026-07-15 | Estado: pendiente de publicación

## Problema

La splash mostraba 28 días y la Vista Hoy 29. La splash calculaba la duración exacta hasta `trip.departure_datetime`, mientras Inicio redondeaba por días naturales con `Math.ceil`.

## Solución

- Nuevo hook compartido `useDepartureCountdown`.
- Única fuente temporal: `trip.departure_datetime` (`2026-08-13T12:30:00+02:00`).
- Ambas pantallas muestran días, horas y minutos; los segundos se eliminan de la splash.
- Actualización alineada al cambio de minuto para evitar renders innecesarios.
- Prueba determinista del caso 28 días, 22 horas y 1 minuto.

## Verificación

Ejecutar `npm run check` antes de publicar.

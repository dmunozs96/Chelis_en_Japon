# HANDOVER 11 — Preparación operativa, PWA y red de seguridad

> Fecha: 2026-07-15 | SPEC: v1.9 → v1.10 | Estado: ✅ `npm run check`

## Resultado

- F17 adelantada: manifest instalable y service worker generado con `vite-plugin-pwa`.
- 69 recursos (~7,1 MB) precacheados: shell, imágenes, iconos y JSON públicos.
- `/data/*.json` usa caché `StaleWhileRevalidate`; mantiene además el respaldo existente en localStorage.
- Aviso offline global: la guía sigue disponible y el planificador comunica que no sincroniza.
- SplashScreen ya no contiene fechas del viaje: lee `start_date`, `end_date` y `departure_datetime` de `trip.json`.
- Los fallos al guardar/quitar reservas muestran un error visible y conservan abierto el flujo para reintentar.
- Nuevo `npm run validate:data`: comprueba fechas consecutivas, límites del viaje, IDs, referencias POI, coordenadas, imágenes, URLs, fuentes y alertas.
- Nuevo `npm test` con Node Test Runner; `npm run check` encadena datos + tests + build.

## Verificación

- Datos válidos: 13 días, 24 POIs, 32 restaurantes y 16 alertas.
- Test de invariantes: 1/1 verde.
- Build Vite/PWA correcto; 0 vulnerabilidades reportadas por npm.
- Servidor de producción: `/`, `/manifest.webmanifest`, `/sw.js`, `/data/trip.json` y `/api/health` responden 200 con tipos correctos.

## Pendiente inmediato

1. Entre el 18 y el 24 de julio: realizar las reservas de Romancecar y shinkansen y sustituir los TBD por horarios/localizadores reales.
2. Confirmar la política de tatuajes de Mizunoto.
3. Decidir reservas de Roan Kikunoi y Bird Land Ginza.
4. Probar instalación y recarga en modo avión en los dos móviles reales después del próximo despliegue.
5. Tras el cierre operativo, comenzar Ola 5 por Emergencias y Último kilómetro al hotel.

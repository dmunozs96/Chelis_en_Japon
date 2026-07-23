# Handover 28 — V2.5 visual completada

> Fecha: 23 de julio de 2026
> Estado: implementación y QA técnico completos; pendiente únicamente de commit/push cuando lo solicite Daniel.

## Alcance entregado

- Fundamentos tinta/marfil/torii, shell, header y navegación inferior con iconos SVG.
- Portada editorial y firma `RouteLine`.
- Hoy/Viaje, detalle de día y alojamiento compacto.
- POI como artículo editorial con hero, lead, datos prácticos y fuentes.
- Restaurantes como lista plana, filtros compactos y planner accesible.
- Más como grupos de filas operativas.
- Cultura y Compras como índices y artículos.
- Alertas, Preparación, Planner y Billetes con jerarquía documental y estados semánticos.
- Mapa armonizado, pins propios y panel inferior.
- Frases, moneda, emergencias, Suica, última milla y clima sobre shell común.
- Eliminación de emojis funcionales en las vistas principales.

## Rendimiento y offline

- `React.lazy` separa Mapa/Leaflet, Compras, Billetes, Planner y POI.
- JS inicial: 258,71 kB / 74,62 kB gzip (baseline: 494,42 / 135,95).
- Los chunks diferidos forman parte del precache de Workbox: no se pierde uso offline.
- Nueve fotografías superiores al presupuesto se recomprimieron; ninguna supera 250 kB.

## Verificación

- `npm run check`: correcto.
- Datos publicados en este commit: 13 días, 24 POIs, 62 restaurantes, 14 alertas, 6 accesos y 25 frases.
- Tests Node: 5/5.
- Build Vite/PWA: correcto, 82 entradas precache y 7.568,90 KiB.
- `git diff --check`: correcto.
- Capturas headless de portada en 320×568, 390×844 y 430×932 guardadas en `V2.5_QA/`.

## Decisiones conscientes

- No se incorporaron fuentes binarias externas: se mantiene el stack T1 con fallback de sistema para evitar dependencia y licencia adicional.
- Se conservaron rutas JPG y se optimizaron los originales; WebP requería añadir una herramienta ajena al runtime.
- Los cambios concurrentes de restaurantes, validador y `V3_VISION.md` no forman parte del commit visual. El QA final también se ejecutó sobre el árbol local concurrente (69 restaurantes) y quedó en verde.

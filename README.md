# Chelis en Japón

Guía interactiva mobile-first para el viaje a Japón del 13 al 25 de agosto de 2026. Reúne itinerario, billetes, hoteles, rutas, POIs, restaurantes, alertas y herramientas operativas en una PWA compartida.

## Estado

- Itinerario completo de 13 días.
- Billetes, localizadores, hoteles y alertas.
- Mapa Leaflet, geolocalización y rutas diarias.
- 24 POIs con imágenes locales y contenido cultural.
- 37 restaurantes curados (Top 50 en curso) y planificador compartido.
- Guía de compras: 13 zonas, 49 tiendas verificadas, 10 categorías, normativa fiscal/aduanera y calculadora.
- Herramientas offline: frases, conversor, emergencias, Welcome Suica, acceso a hoteles y clima por etapa.
- PWA instalable con service worker y caché de contenido.
- Validación automática de datos.

El estado funcional detallado y la deuda conocida viven en [SPEC.md](./SPEC.md). Las reglas que no se pueden romper están en [CONSTITUTION.md](./CONSTITUTION.md).

## Arquitectura

```text
client/                 React 18 + Vite + Leaflet
  public/               imágenes e iconos incluidos en la PWA
  src/components/       vistas y herramientas
  src/hooks/            carga y caché de datos
data/                   contenido del viaje en JSON
server/                 Express + API del planificador
scripts/                validación y mantenimiento de imágenes
```

- Frontend estático servido por Express en producción.
- PostgreSQL persiste el planificador compartido cuando `DATABASE_URL` está disponible.
- Los JSON estáticos se cachean en memoria, localStorage y service worker.
- Mapa base, sincronización del planificador y enlaces externos requieren conexión.

## Desarrollo local

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`.
Servidor: `http://localhost:3000`.

En Windows con PowerShell restringido puede ser necesario usar `npm.cmd` en lugar de `npm`.

## Comprobaciones

```bash
npm run validate:data
npm test
npm run build
npm run check
```

`npm run check` ejecuta la validación de datos, los tests y el build de producción. La validación cubre fechas, IDs, referencias POI, imágenes, coordenadas, URLs, fuentes, alertas, accesos a hoteles, frases, cambio y clima.

## Datos y fuentes de verdad

- `data/trip.json`: viaje, días, vuelos, hoteles y trenes.
- `data/alerts.json`: acciones y consejos con fecha.
- `data/pois_db.json`: contenido cultural y práctico de POIs.
- `data/restaurants_db.json`: restaurantes y fuentes.
- `data/travel_tools.json`: emergencias, accesos, Suica, frases, cambio y clima.
- `data/cultural_guide.json`: guía cultural aplicada al itinerario.
- `data/shopping_guide.json`: zonas, tiendas, categorías y normativa de la guía de compras.

No se deben introducir horarios, precios, URLs o recomendaciones inventadas. Todo contenido nuevo debe citar una fuente real y respetar la incertidumbre cuando un dato no esté confirmado.

## Offline y privacidad

La PWA precachea el shell, imágenes y recursos estáticos. Los JSON consultados usan `StaleWhileRevalidate` y una copia local de respaldo.

- Los contactos privados de seguro y emergencia solo viven en localStorage.
- El tipo de cambio personalizado solo vive en localStorage.
- El planificador necesita red para sincronizar entre los dos móviles.
- Leaflet necesita red para descargar el mapa base.

Tras cada despliegue importante debe probarse instalación y recarga en modo avión en los dos dispositivos reales.

## Despliegue

Railway ejecuta:

```bash
npm run build
NODE_ENV=production npm start
```

Healthcheck: `/api/health`.

El servidor sirve el build de `client/dist`, los datos bajo `/data` y la API bajo `/api`.

## Operación antes del viaje

- Reservar Romancecar y shinkansen entre el 18 y el 24 de julio.
- Sustituir los TBD por horarios, asientos y localizadores reales.
- Reconfirmar shuttle y política de tatuajes de Mizunoto.
- Completar seguro y contacto privado en cada móvil.
- Probar llamadas, instalación y modo avión tras el despliegue.

## Historial reciente

- [HANDOVER_11.md](./HANDOVER_11.md): PWA, offline y validación.
- [HANDOVER_12.md](./HANDOVER_12.md): emergencias y acceso a hoteles.
- [HANDOVER_13.md](./HANDOVER_13.md): Welcome Suica y frases.
- [HANDOVER_14.md](./HANDOVER_14.md): conversor y clima; cierre de Ola 5.

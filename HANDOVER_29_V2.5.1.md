# Handover 29 — V2.5.1 Grand Tour

> Fecha: 23 de julio de 2026  
> Estado: implementación y QA automatizado completados; aceptación humana pendiente

## Resultado

La capa visual V2.5.1 incorpora:

- Newsreader Variable como voz editorial;
- materiales obsidiana, champagne y luz ambiental;
- Restaurantes con escena, accesos por intención y fotografía gastronómica;
- Más con portada protagonista, cuatro tiles visuales y jerarquía contextual;
- Billetes con escena de transporte y cartera material;
- portadas específicas en Clima y Cultura;
- ocho POIs prioritarios con galerías verificadas de tres fotografías;
- caché runtime para la biblioteca enriquecida sin inflar el precache crítico;
- targets táctiles mínimos de 44 × 44 px.

## Biblioteca

- 128 assets raster en `client/public`.
- 53 assets temáticos nuevos en `client/public/visual-library`.
- 24 imágenes de galería para ocho POIs en `client/public/poi-galleries`.
- Autor, licencia, ficha Commons y URL de licencia en ambos manifests.
- Contact sheet revisada en `V2.5_QA/poi-gallery-contact-sheet.png`.

La selección procede de Wikimedia Commons. La reutilización exige respetar la
licencia particular de cada fichero; el manifest conserva los datos necesarios.

## QA ejecutado

### Proyecto

- `npm run validate:data`: verde.
- `npm test`: 7/7.
- `npm run build`: verde.
- `npm run validate:visual`: verde.

### Responsive

`npm run qa:visual` inspecciona ocho rutas a 320, 390 y 430 px:

- 24/24 sin overflow;
- 24/24 sin imágenes rotas;
- 24/24 sin errores de consola;
- 24/24 sin targets interactivos menores de 44 × 44 px.

Capturas y reporte: `V2.5_QA/v2.5.1/`.

### Lighthouse

| Pantalla | Rendimiento | Accesibilidad | Buenas prácticas |
|---|---:|---:|---:|
| Más | 87 | 100 | 100 |
| Restaurantes | 79 | 100 | 100 |
| POI · Fushimi Inari | 73 | 100 | 100 |

La riqueza fotográfica se sirve progresivamente. El shell crítico permanece en
el precache y la biblioteca Grand Tour usa caché runtime.

### Offline crítico

`npm run qa:offline` confirma respuesta 200 y contenido útil sin red en:

- Billetes;
- itinerario;
- frases;
- emergencias.

## Regeneración

- `node scripts/fetch-visual-library.mjs`
- `node scripts/fetch-poi-galleries.mjs`
- `npm run validate:visual`
- `npm run qa:visual`
- `npm run qa:offline`

## Pendiente externo

La versión está técnicamente preparada. Para declarar cerrados los criterios
18, 20 y 21 de la especificación faltan:

1. prueba en un iPhone real;
2. prueba en un Android real;
3. revisión ciega con cinco personas;
4. declaración final del propietario.

La hoja operativa está en `V2.5_QA/V2.5.1_REAL_DEVICE_CHECKLIST.md`.


# Imágenes de Puntos de Interés

Este directorio contiene las imágenes locales de los 24 POIs de la guía, más dos ficheros generados:

- `{poi-id}.jpg` — imagen local de cada POI (fuente primaria; funciona offline)
- `fallback-urls.json` — URLs reales de Wikimedia verificadas, usadas solo si falta el fichero local
- `credits.json` — atribución de cada imagen (artículo de Wikipedia + página del fichero en Commons)

## Cómo se regeneran

Todo este directorio se regenera con un único script (desde la raíz del repo):

```bash
node scripts/fetch-poi-images.mjs          # descarga solo lo que falte
node scripts/fetch-poi-images.mjs --force  # re-descarga todo
```

El script resuelve la imagen principal real de cada POI vía la API REST de Wikipedia
(`/page/summary`), así que las URLs nunca son inventadas. Para añadir un POI nuevo:
añadirlo al mapa `POI_TITLES` del script con su(s) título(s) de artículo de Wikipedia
y volver a ejecutarlo.

## Cómo las consume la app

`POIDetailView.jsx` carga `/pois/{id}.jpg`; si falla, intenta la URL de
`fallback-urls.json`; si también falla, muestra un icono por categoría.
Las imágenes viajan dentro del build (`client/public` → `client/dist`), por lo que
se ven sin conexión una vez cargada la app.

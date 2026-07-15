# Imágenes de Puntos de Interés

Este directorio almacena las imágenes de los 24 puntos de interés (POIs) del viaje a Japón.

## Cómo descargar las imágenes

### Opción 1: Script automático (Windows)

```powershell
cd client/public/pois
PowerShell -ExecutionPolicy Bypass -File download-images.ps1
```

El script descargará automáticamente todas las imágenes desde Wikimedia. Si una imagen ya existe, la saltará.

### Opción 2: Descarga manual

Puedes descargar las imágenes manualmente desde los URLs en `fallback-urls.json` y colocarlas en este directorio con el nombre `{poi-id}.jpg`.

Por ejemplo:
- `sensoji.jpg` para Templo Senso-ji
- `hibiya-park.jpg` para Hibiya Park
- `kyomizudera.jpg` para Kiyomizu-dera

Ver lista completa en `POI_LIST.json`.

## Estructura

```
pois/
├── sensoji.jpg              ← Imagen del Templo Senso-ji
├── hibiya-park.jpg          ← Imagen de Hibiya Park
├── ginza-six.jpg            ← etc...
├── ...
├── fallback-urls.json       ← URLs de fallback (Wikimedia)
├── POI_LIST.json            ← Lista de todos los POIs
└── README.md                ← Este archivo
```

## Cómo funciona el sistema de imágenes

1. **Primera intención**: Cargar desde la ruta local `/pois/{id}.jpg`
2. **Fallback**: Si el archivo local no existe, intenta desde Wikimedia (URLs en `fallback-urls.json`)
3. **Sin imagen**: Si ambas fallan, muestra un icono genérico por categoría

Esto permite que la app funcione incluso sin todas las imágenes descargadas, mejorando gradualmente conforme se agreguen.

## Tamaño estimado

Aproximadamente 15-20 MB en total para todas las imágenes.

## Notas

- Los archivos deben estar en formato JPG
- Resolución recomendada: 1280x720 o superior
- Licencia: Las imágenes provienen de Wikimedia Commons (ver `fallback-urls.json` para URLs originales)

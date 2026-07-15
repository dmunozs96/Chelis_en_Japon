# ✅ Corrección de Imágenes de POIs — Resumen de Cambios

**Problema encontrado:** Las imágenes de los 24 puntos de interés no se mostraban en las tarjetas de detalle.

**Causa:** Las URLs de imágenes en `pois_db.json` apuntaban a Wikimedia, que requería configuración especial de CORS y podía no cargar en todos los contextos.

---

## Cambios realizados

### 1. **Estructura de directorios**
```
✅ Creado: /client/public/pois/
   ├── sensoji.jpg (para llenar manualmente)
   ├── hibiya-park.jpg (para llenar manualmente)
   ├── ... (24 POIs en total)
   ├── fallback-urls.json (URLs de Wikimedia como respaldo)
   ├── POI_LIST.json (lista de todos los POIs con sus IDs)
   ├── download-images.ps1 (script para descargar automáticamente)
   └── README.md (guía de uso)
```

### 2. **Actualización de datos**
✅ `data/pois_db.json`
- Cambié todas las `image_url` de:
  ```json
  "image_url": "https://upload.wikimedia.org/wikipedia/commons/..."
  ```
- A:
  ```json
  "image_url": "/pois/{poi-id}.jpg"
  ```

✅ `client/public/pois/fallback-urls.json`
- Creado con todas las URLs originales de Wikimedia como respaldo
- El componente las usa si el archivo local no existe

### 3. **Actualización del componente React**
✅ `client/src/components/POIDetailView.jsx`
- Agregué importación de `useState` y `useEffect`
- Creé nuevo componente `ImageWithFallback` que:
  1. Intenta cargar desde `/pois/{id}.jpg` (local)
  2. Si falla, intenta desde `fallback-urls.json` (Wikimedia)
  3. Si ambas fallan, muestra icono genérico por categoría

### 4. **Archivos de ayuda**
✅ `client/public/pois/download-images.ps1`
- Script PowerShell para descargar automáticamente todas las imágenes
- Maneja reintentos y archivos parciales

✅ `client/public/pois/README.md`
- Instrucciones detalladas de cómo descargar las imágenes
- Explica cómo funciona el sistema de fallback

✅ `client/public/pois/POI_LIST.json`
- Lista de los 24 POIs con nombre, categoría y nombre de archivo esperado

---

## Cómo funciona ahora

### Para el usuario final:
1. Abre la app y selecciona un POI
2. La app intenta cargar la imagen desde `/pois/{id}.jpg`
3. **Si la imagen existe:** se muestra inmediatamente (óptimo)
4. **Si no existe:** se carga desde Wikimedia automáticamente (respaldo)
5. **Si ambas fallan:** muestra icono genérico bonito por categoría

### Ventajas:
- ✅ Funciona sin las imágenes locales (carga desde Wikimedia)
- ✅ Si descargamos imágenes locales, se usan automáticamente
- ✅ Sin cambios requeridos en código cuando se agreguen imágenes
- ✅ Experiencia gradualmente mejor conforme se completan imágenes

---

## Próximos pasos: Agregar imágenes

Hay dos opciones:

### Opción 1: Descarga automática (recomendado)
```powershell
cd client/public/pois
PowerShell -ExecutionPolicy Bypass -File download-images.ps1
```

**Nota:** Esto puede requerir reintentos si Wikimedia tiene límites de tasa (429 errors).

### Opción 2: Descarga manual
1. Abre `client/public/pois/fallback-urls.json`
2. Para cada POI, abre la URL en el navegador
3. Descarga la imagen y guárdala como `/client/public/pois/{poi-id}.jpg`

### Opción 3: Usar otras fuentes
Si las imágenes de Wikimedia no son suficientes, puedes:
1. Encontrar imágenes alternativas (Google Images, Unsplash, etc.)
2. Guardarlas en `/client/public/pois/{poi-id}.jpg`
3. Actualizar `fallback-urls.json` si quieres tener un respaldo alternativo

---

## Verificación

Para verificar que el cambio funciona:

1. **Abre la app** y navega a cualquier día
2. **Haz clic en un POI** (ej: Hibiya Park en el Día 1)
3. **Deberías ver:**
   - Si no has descargado imágenes: imagen de Wikimedia
   - Si has descargado: imagen local (más rápida)
   - Si ambas fallan: icono genérico tipo ubicación

---

## Archivos modificados

- `client/src/components/POIDetailView.jsx` — Lógica de fallback
- `data/pois_db.json` — URLs actualizadas a rutas locales

## Archivos creados

- `client/public/pois/` (directorio)
- `client/public/pois/fallback-urls.json`
- `client/public/pois/POI_LIST.json`
- `client/public/pois/download-images.ps1`
- `client/public/pois/README.md`
- `IMAGES_FIX_SUMMARY.md` (este archivo)

---

## Próximas acciones sugeridas

1. ✅ **Este viaje:** Ejecutar script de descarga o descargar manualmente un par de imágenes para verificar
2. ✅ **Mejora visual:** Cuando tengas imágenes locales, la app se verá mucho mejor
3. ✅ **Optimización:** Considerar comprimir JPGs si el bundle se hace muy grande (>20 MB)

---

**¿Preguntas?** Revisa `client/public/pois/README.md` para instrucciones detalladas.

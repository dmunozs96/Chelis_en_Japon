# Constitución del Producto — Guía Interactiva Japón Ago26

> Documento vivo. Cualquier modificación al producto, por pequeña que sea, debe reflejarse aquí.
> Versión: 2.0 | Fecha: 2026-07-15 — enmienda V2 aprobada por Daniel (Puerta A de `PLAN_V2.md` resuelta)

---

## Visión

Una guía de viaje interactiva y compartida que sustituye a PDFs sueltos, notas del móvil y pestañas de blogs abiertas. Un único enlace donde está: qué toca hoy, dónde está cada uno, qué billete/localizador enseñar, y qué comer o ver cerca, con contexto histórico real de cada sitio.

No es una app de turismo genérica: está construida sobre este viaje concreto (estas fechas, estos hoteles, estos trayectos, estas recomendaciones investigadas), no sobre datos en vivo de terceros.

**Listón de calidad V2:** durante este viaje, la guía debe poder **sustituir a una guía de pago** (Lonely Planet o equivalente). Eso se consigue con criterio y confianza — profundidad editorial, trazabilidad de fuentes y contexto aplicado al itinerario — no con volumen de fichas.

**Criterio de éxito absoluto:** El día 13 de agosto, con el móvil en la mano y sin haber mirado nada más, cualquiera de los dos viajeros puede responder en menos de 10 segundos: *"¿qué toca ahora, qué necesito enseñar en el mostrador, y qué hay interesante aquí cerca"* para cualquier momento del viaje.

---

## Usuarios

| Usuario | Rol | Necesidad principal |
|---|---|---|
| Daniel | Organizador, dueño del contenido | Editar datos sin tocar código; ver todo en móvil |
| Compañero de viaje | Solo lectura | Mismo contenido desde su móvil con el mismo enlace |

---

## Reglas no negociables (Constitution)

### 1. Contenido real, nunca inventado — con trazabilidad por campo (ampliada en V2)
Toda recomendación de comida, sitio o punto de interés debe venir de una fuente real ya investigada (están en `japon_info_base.md`) o, si se añade contenido nuevo, debe citar su fuente. **Nunca** generar nombres de restaurantes, horarios o precios inventados.

Esto incluye los recursos: las URLs (imágenes, webs de reserva) deben resolverse contra la fuente real (API de Wikipedia, web oficial), nunca construirse "de memoria" — una URL inventada es contenido inventado. Las imágenes de Wikimedia llevan su atribución en `client/public/pois/credits.json`.

Ampliación V2 (principios P1-P3 de `PLAN_V2.md`):
- Todo dato volátil (horario, precio, estrellas, política de reserva) lleva fuente identificable y fecha de verificación; un dato sin confirmar se marca como tal o no se publica.
- Una entidad genérica (calle, mercado, agrupación de puestos) **no se presenta como un restaurante**: se etiqueta como zona gastronómica y se trata como tal en la interfaz.
- Una cadena con varias sedes debe fijar sucursal concreta con dirección; una ficha sin identidad inequívoca no se publica.
- No se copian textos, fotografías ni bases de datos de guías comerciales; las reseñas de terceros se usan como señal agregada («patrón observado»), nunca copiadas ni presentadas como hecho universal.

### 2. Mobile-first sin excepción
La guía se usa desde el móvil, caminando por la calle, con una mano y a veces con mala conexión. Cualquier decisión de diseño prioriza el móvil sobre el escritorio. Diseñar y probar primero en viewport de móvil.

### 3. El contenido vive separado del código
Itinerario, billetes, localizadores y recomendaciones están en ficheros de datos (`trip.json` o similar) que se pueden editar sin tocar la lógica de la interfaz.

### 4. Resiliente a mala conexión
Itinerario, billetes/localizadores, recomendaciones e historia deben verse sin internet una vez cargada la página. Solo la geolocalización en el mapa en vivo depende de conexión activa.

### 5. Sin fricción para el grupo
Dos personas viajan juntas; ambas necesitan ver lo mismo desde su móvil con un único enlace. Nada de login, cuentas ni sincronización compleja para el MVP.

### 6. Simplicidad de despliegue (enmendada en V2)
Backend mínimo y sin mantenimiento manual: todo corre en Railway (frontend + API + PostgreSQL) con despliegue automático desde GitHub. **Sin claves de API de pago externas** que puedan romperse durante el viaje — decisión reconfirmada por Daniel en la Puerta A (15 jul 2026): cero servicios de pago, también para clima, mapas y fotos.

Enmienda V2 al alcance del backend: además del planificador de restaurantes, el backend puede persistir **estado compartido del itinerario** (actividad hecha/omitida, checklist de preparación) con el mismo patrón simple. La resolución de conflictos es **last-write-wins con marca de tiempo visible** — sin colas de sincronización, sin registro de cambios elaborado, sin deshacer distribuido. Para dos viajeros que van juntos, más que eso es sobreingeniería.

### 7. Honestidad sobre incertidumbre
Si un dato (hora de tren, política de un ryokan, etc.) no está confirmado, mostrarlo marcado como **"pendiente de confirmar"** en vez de asumir un valor inventado.

### 8. Privacidad — sin almacenar documentos personales (nueva en V2)
La app **nunca almacena documentos ni datos personales sensibles**: ni pasaportes, ni pólizas, ni recetas médicas, ni números de documentos — ni en Git, ni en el servidor, ni en el dispositivo. El checklist de preparación solo registra estados de verificación («hecho ✓», «pendiente») en localStorage. La evidencia real (el documento en sí) vive fuera de la app, en el soporte que cada viajero elija. Decisión de Daniel en la Puerta A: sin almacenar.

---

## Alcance V2 (aprobado 15 jul 2026) y fuera de alcance

**Entra en la V2** (antes fuera de alcance del MVP; enmienda aprobada en la Puerta A):

- Centro de preparación: checklist con vencimientos, prioridades, responsable y dependencias (sin almacenar documentos — regla 8)
- Lista de equipaje y outfits generados para este viaje concreto
- Previsión meteorológica cuando entre en horizonte útil — solo fuentes gratuitas sin clave, con fecha y origen visibles; las normales climatológicas ya existentes se mantienen separadas del pronóstico
- Guía cultural y gastronómica editorial (etiqueta, templos, onsen, platos por región)
- Directorio gastronómico: **Top 50 profundo + ~150 fichas operativas** (el objetivo de 400 queda descartado por decisión de calidad)
- Guía de compras (denim, relojes, cámaras, cuchillos y resto de categorías) con rutas alternativas para el día libre — día a elegir según situación
- Modo Ahora e itinerario vivo con estado compartido simple (regla 6)
- Rutas reales GeoJSON sobre Leaflet en tramos críticos (sin migración de stack cartográfico)

**Sigue fuera de alcance** (V2.1 o nunca):

- Recomendaciones dinámicas vía API (Google Places o similar)
- Seguimiento en vivo de retrasos de tren/vuelo
- Reparto de gastos entre viajeros
- Diario compartido de fotos (candidato a V2.1 post-viaje)
- Generalizar la plantilla para futuros viajes
- QR/barcode del billete de avión incrustado
- Navegación turn-by-turn (se delega en la app externa que elija el viajero)
- Migración a MapLibre/PMTiles y teselas offline (descartada para este viaje; no se precachean teselas de OSM — su política lo prohíbe)

---

## Arquitectura mandatoria

- **Frontend:** React + Vite — servido como build estático
- **Backend:** Node.js + Express en Railway — API REST para el estado del planificador
- **Base de datos:** PostgreSQL (plugin nativo de Railway) — persiste el estado compartido entre viajeros
- **Mapa:** Leaflet.js + OpenStreetMap — sin claves de API de pago
- **Geolocalización:** API nativa del navegador (`navigator.geolocation`)
- **Repositorio:** GitHub — despliegue automático a Railway en cada push
- **Offline:** Service worker para cachear contenido estático; el planificador requiere conexión para sincronizar

### Separación de datos
| Dato | Dónde vive | Cómo se actualiza |
|---|---|---|
| Itinerario, vuelos, hoteles | `trip.json` (estático) | git push |
| Base de restaurantes | `restaurants_db.json` (estático) | git push |
| Contenido editorial V2 (guía cultural, compras, checklist plantilla) | JSON estáticos en `data/` | git push |
| Asignaciones del planificador, reservas | PostgreSQL vía API | Desde la app, en tiempo real |
| Estado compartido del itinerario y checklist (V2) | PostgreSQL vía API — last-write-wins | Desde la app, en tiempo real |
| Estados privados (leído/hecho, contactos del seguro) | localStorage del dispositivo | Nunca salen del móvil |

---

*Última actualización: 2026-07-15 (v2.0) — Enmienda V2 aprobada por Daniel: entran preparación/equipaje/clima y la profundidad editorial; el backend se amplía al estado compartido simple (regla 6); nueva regla 8 de privacidad (sin almacenar documentos); cero APIs de pago reconfirmado; Leaflet se mantiene como stack cartográfico; objetivo gastronómico fijado en Top 50 + ~150 con contrato de verificación. La cena de despedida premium queda descartada por decisión del propietario. Detalle completo en `PLAN_V2.md` §17.*

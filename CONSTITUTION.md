# Constitución del Producto — Guía Interactiva Japón Ago26

> Documento vivo. Cualquier modificación al producto, por pequeña que sea, debe reflejarse aquí.
> Versión: 1.0 | Fecha: 2026-07-13

---

## Visión

Una guía de viaje interactiva y compartida que sustituye a PDFs sueltos, notas del móvil y pestañas de blogs abiertas. Un único enlace donde está: qué toca hoy, dónde está cada uno, qué billete/localizador enseñar, y qué comer o ver cerca, con contexto histórico real de cada sitio.

No es una app de turismo genérica: está construida sobre este viaje concreto (estas fechas, estos hoteles, estos trayectos, estas recomendaciones investigadas), no sobre datos en vivo de terceros.

**Criterio de éxito absoluto:** El día 13 de agosto, con el móvil en la mano y sin haber mirado nada más, cualquiera de los dos viajeros puede responder en menos de 10 segundos: *"¿qué toca ahora, qué necesito enseñar en el mostrador, y qué hay interesante aquí cerca"* para cualquier momento del viaje.

---

## Usuarios

| Usuario | Rol | Necesidad principal |
|---|---|---|
| Daniel | Organizador, dueño del contenido | Editar datos sin tocar código; ver todo en móvil |
| Compañero de viaje | Solo lectura | Mismo contenido desde su móvil con el mismo enlace |

---

## Reglas no negociables (Constitution)

### 1. Contenido real, nunca inventado
Toda recomendación de comida, sitio o punto de interés debe venir de una fuente real ya investigada (están en `japon_info_base.md`) o, si se añade contenido nuevo, debe citar su fuente. **Nunca** generar nombres de restaurantes, horarios o precios inventados.

Esto incluye los recursos: las URLs (imágenes, webs de reserva) deben resolverse contra la fuente real (API de Wikipedia, web oficial), nunca construirse "de memoria" — una URL inventada es contenido inventado. Las imágenes de Wikimedia llevan su atribución en `client/public/pois/credits.json`.

### 2. Mobile-first sin excepción
La guía se usa desde el móvil, caminando por la calle, con una mano y a veces con mala conexión. Cualquier decisión de diseño prioriza el móvil sobre el escritorio. Diseñar y probar primero en viewport de móvil.

### 3. El contenido vive separado del código
Itinerario, billetes, localizadores y recomendaciones están en ficheros de datos (`trip.json` o similar) que se pueden editar sin tocar la lógica de la interfaz.

### 4. Resiliente a mala conexión
Itinerario, billetes/localizadores, recomendaciones e historia deben verse sin internet una vez cargada la página. Solo la geolocalización en el mapa en vivo depende de conexión activa.

### 5. Sin fricción para el grupo
Dos personas viajan juntas; ambas necesitan ver lo mismo desde su móvil con un único enlace. Nada de login, cuentas ni sincronización compleja para el MVP.

### 6. Simplicidad de despliegue
Backend mínimo y sin mantenimiento manual: todo corre en Railway (frontend + API + PostgreSQL) con despliegue automático desde GitHub. Sin claves de API de pago externas que puedan romperse durante el viaje. La complejidad del backend se limita estrictamente al estado del planificador — nada más.

### 7. Honestidad sobre incertidumbre
Si un dato (hora de tren, política de un ryokan, etc.) no está confirmado, mostrarlo marcado como **"pendiente de confirmar"** en vez de asumir un valor inventado.

---

## Fuera de alcance para el MVP

Los siguientes puntos son backlog explícito — existen, no se han olvidado, pero no van en el MVP:

- Recomendaciones dinámicas vía API (Google Places o similar)
- Notas/fotos compartidas entre el grupo dentro de la guía
- Seguimiento en vivo de retrasos de tren/vuelo
- Lista de equipaje interactiva
- Frases útiles de japonés con traducción interactiva
- Reparto de gastos entre viajeros
- Previsión meteorológica integrada por ciudad y día
- Diario compartido de fotos
- Generalizar la plantilla para futuros viajes
- QR/barcode del billete de avión incrustado (solo disponible tras hacer el check-in online, antes del viaje)

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
| Asignaciones del planificador, reservas | PostgreSQL vía API | Desde la app, en tiempo real |

---

*Última actualización: 2026-07-15 — regla 1 ampliada a recursos (URLs resueltas contra fuente real, nunca inventadas) tras la Ola de Calidad Q1. Pendiente de decisión: la regla 4 (offline) sigue sin service worker — ver deuda técnica en SPEC §10.*

# Super-prompt para Claude Code — Guía interactiva Japón Ago26 (Spec-Driven Development)

Esto está pensado para pegarlo directamente en Claude Code usando **Spec Kit** (el toolkit oficial de spec-driven development de GitHub, compatible con Claude Code). La secuencia es: constitución → especificación → aclaración de dudas → plan técnico → checklist → tareas → análisis de coherencia → implementación, con revisión humana entre cada paso.

## 0. Instalar Spec Kit (una sola vez)

En una terminal, en la carpeta donde quieras crear el proyecto:

```
uvx --from git+https://github.com/github/spec-kit.git specify init japon-guia-2026
cd japon-guia-2026
```

(necesita `uv` instalado; si no lo tienes: `pip install uv` antes de lanzar el comando anterior.)

Esto añade a Claude Code, dentro de ese proyecto, los comandos: `/speckit.constitution`, `/speckit.specify`, `/speckit.clarify`, `/speckit.plan`, `/speckit.checklist`, `/speckit.tasks`, `/speckit.analyze`, `/speckit.implement`.

**Antes de escribir el primer prompt**, copia estos 4 archivos a la raíz del proyecto (son la fuente de verdad de contenido, ya investigada y verificada):
- `japon_info_base.md` — itinerario, localizadores, historia/práctica por ciudad, recomendaciones curadas con fuente.
- `producto_guia_interactiva.md` — la definición de producto que ya escribimos.
- `Itinerario_Dia_a_Dia.docx` — la agenda cerrada día a día.
- `Japon_Ago26_Itinerario_y_Trenes.docx` — plan y guía de reserva de trenes.

---

## 1. Prompt para `/speckit.constitution`

```
Estas son las reglas no negociables de este proyecto:

1. Contenido real, no inventado. Toda recomendación de comida, sitio o punto de interés
   debe venir de una fuente real ya investigada (están en japon_info_base.md) o, si se
   añade contenido nuevo más adelante, debe citar su fuente. Nunca generar nombres de
   restaurantes, horarios o precios inventados.
2. Mobile-first. La guía se usa desde el móvil, caminando por la calle, con una mano y
   a veces con mala conexión. Cualquier decisión de diseño prioriza eso sobre el escritorio.
3. El contenido vive separado del código. Itinerario, billetes, localizadores y
   recomendaciones están en ficheros de datos (JSON o similar) que se puedan editar sin
   tocar la lógica de la interfaz.
4. Resiliente a mala conexión. Itinerario, billetes/localizadores, recomendaciones e
   historia deben verse sin internet una vez cargada la página. Solo la geolocalización
   en el mapa en vivo depende de tener conexión en ese momento.
5. Sin fricción para el grupo. Viajamos dos personas y ambas necesitan ver lo mismo
   desde su propio móvil, con un único enlace compartido. Nada de login, cuentas ni
   sincronización compleja para el MVP.
6. Simplicidad de despliegue. Preferir sitio estático sin backend propio ni base de
   datos si es razonablemente posible, para minimizar mantenimiento durante el viaje.
7. Honestidad sobre incertidumbre. Si un dato (hora de tren, política de un ryokan,
   etc.) no está confirmado, mostrarlo marcado como "pendiente de confirmar" en vez de
   asumir un valor.
```

---

## 2. Prompt para `/speckit.specify` (el super-prompt)

```
Quiero construir una guía de viaje interactiva y compartida para un viaje a Japón que
hacemos dos personas, del 13 al 25 de agosto de 2026: Madrid - Tokio - Hakone - Kioto -
Hiroshima - Osaka - Tokio - Madrid. Todo el contenido de base (vuelos, hoteles,
localizadores, trenes, itinerario día a día, recomendaciones investigadas con fuente)
ya está preparado en los archivos japon_info_base.md, Itinerario_Dia_a_Dia.docx y
Japon_Ago26_Itinerario_y_Trenes.docx que acompañan a este prompt — úsalos como la
fuente de contenido real del proyecto, no inventes datos de viaje nuevos.

La guía tiene que resolver, para cada día del viaje, la pregunta "¿qué toca ahora y qué
necesito saber para hacerlo bien": qué día es, en qué ciudad estamos, qué hotel, qué
trayecto en tren toca, qué vamos a ver o comer, por qué es interesante (contexto
histórico/cultural), y dónde estamos ahora mismo en el mapa respecto a todo eso.

Funcionalidades que necesito, sin recortar ambición:

1. ITINERARIO DÍA A DÍA
   - Vista de "hoy": qué ciudad, qué hotel, qué toca en cada franja del día (mañana/
     tarde/noche), según la fecha real del dispositivo.
   - Vista de todo el itinerario completo, navegable día por día (13-25 agosto).
   - Dos días están marcados explícitamente como "tarde libre" / "día libre" (16 y 24
     de agosto) sin actividad fija — deben verse visualmente distintos del resto (planes
     cerrados) en vez de mostrar un hueco vacío.

2. BILLETES Y LOCALIZADORES SIEMPRE DISPONIBLES
   - Código de reserva y billete del vuelo de ida y vuelta.
   - Para cada hotel: nombre, dirección, teléfono, CRS locator, horario de entrada/salida.
   - Para cada trayecto en tren: origen, destino, y (en cuanto se reserven) hora y
     localizador — dejar el hueco preparado en el modelo de datos aunque hoy no tengamos
     todavía las horas exactas.
   - Todo esto tiene que verse en 1-2 toques, sin buscar en el email, incluso sin
     conexión y aunque el móvil esté con poca batería.

3. MAPA CON POSICIÓN EN VIVO
   - Geolocalización real del dispositivo mostrada sobre un mapa.
   - Sobre el mapa: el hotel del día actual y los puntos de interés/recomendaciones de
     esa etapa del viaje, para poder ver qué tengo cerca ahora mismo.
   - Si no hay señal GPS o permiso denegado, la guía debe seguir siendo útil (fallback:
     mostrar la lista de recomendaciones de la etapa actual sin mapa).

4. RECOMENDACIONES DE COMIDA Y SITIOS, CURADAS Y CON FUENTE
   - Por ciudad/barrio, ya investigadas y en japon_info_base.md: dónde comer y qué ver,
     cada una con su fuente (URL) visible o accesible desde la propia recomendación.
   - Organizadas por el día/etapa del itinerario al que pertenecen, no como una lista
     plana sin contexto.

5. CONTEXTO HISTÓRICO Y CULTURAL
   - Para cada ciudad/parada: por qué es relevante históricamente, qué la hace única,
     con el tono adecuado en el caso de Hiroshima (lugar de memoria, no atracción).
   - Accesible desde la vista de "hoy" sin tener que buscarlo aparte.

6. USO COMPARTIDO ENTRE VIAJEROS
   - Somos dos personas viajando juntas; ambas necesitan acceder a exactamente lo mismo
     desde su propio móvil con el mismo enlace, sin necesidad de crear cuenta ni pedir
     el archivo cada vez.

7. FUNCIONA CON MALA CONEXIÓN
   - Todo el contenido de texto (itinerario, billetes, recomendaciones, historia) debe
     funcionar aunque la conexión de datos en Japón sea intermitente. Solo la parte de
     geolocalización en vivo depende de tener internet en ese momento.

Ideas para una fase futura (anótalas en el spec como backlog, NO las implementes en el
MVP, pero quiero que quede constancia de que existen para no perder la ambición del
proyecto): lista de equipaje interactiva, frases útiles de japonés con traducción,
reparto de gastos entre los dos viajeros, seguimiento en vivo de retrasos de tren/vuelo,
previsión meteorológica integrada por ciudad y día, diario compartido de fotos del
viaje, recomendaciones dinámicas vía API en vez de curadas a mano, generalizar la
plantilla para futuros viajes más allá de este.

Success criteria: el día 13 de agosto, con el móvil en la mano y sin haber mirado nada
más, cualquiera de los dos viajeros tiene que poder responder en menos de 10 segundos
"¿qué toca ahora, qué necesito enseñar en el mostrador, y qué hay interesante aquí
cerca" para cualquier momento del viaje.
```

---

## 3. Prompt para `/speckit.plan`

```
Dirección técnica de alto nivel (los detalles finos los decides tú, pero respeta esto):

- Sitio estático (HTML/JS), sin backend propio ni base de datos — el contenido del
  viaje vive en un fichero de datos (JSON) versionado junto al código, generado a
  partir de japon_info_base.md, Itinerario_Dia_a_Dia.docx y
  Japon_Ago26_Itinerario_y_Trenes.docx.
- Mapa: Leaflet.js + capas de OpenStreetMap. Nada de Google Maps ni claves de API de
  pago — el proyecto no debe depender de facturación externa.
- Geolocalización vía la API nativa del navegador (navigator.geolocation).
- Resiliencia offline: cachear el contenido esencial (itinerario, billetes,
  recomendaciones, historia) para que funcione sin conexión una vez cargado una
  primera vez (service worker o equivalente); solo el mapa en vivo requiere conexión
  activa.
- Hosting en un proveedor gratuito con despliegue por git (Vercel, Netlify o GitHub
  Pages) — necesito un enlace único compartible para los dos viajeros, sin login.
- Mobile-first de verdad: diseña y prueba primero en viewport de móvil, no como
  adaptación de una versión de escritorio.
- Antes de escribir código, valida el modelo de datos (JSON) contra el contenido real
  de japon_info_base.md e Itinerario_Dia_a_Dia.docx para asegurar que no falta ni se
  inventa ningún dato del viaje.
```

---

## 4. Después de esto

1. Revisa el documento de especificación que genere `/speckit.specify` — confirma que refleja lo que quieres antes de seguir.
2. `/speckit.clarify` — deja que Claude Code te pregunte lo ambiguo (por ejemplo, cómo se marca visualmente un "día libre", o qué pasa si el GPS falla).
3. `/speckit.plan` con el prompt de la sección 3.
4. `/speckit.checklist` — pide una checklist de calidad antes de pasar a tareas (por ejemplo: "que todo dato de itinerario/billete venga de los ficheros fuente, no inventado").
5. `/speckit.tasks` — descompón el plan en tareas concretas.
6. `/speckit.analyze` — verifica que spec, plan y tareas son coherentes entre sí antes de tocar código.
7. `/speckit.implement` — a partir de aquí, revisa cada tarea a medida que se complete en vez de dejar que avance todo de golpe.

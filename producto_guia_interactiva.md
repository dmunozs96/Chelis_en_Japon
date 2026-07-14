# Definición de producto — Guía interactiva Japón Ago26

## 1. Visión

Una guía de viaje interactiva, compartida entre todos los que viajan, que sustituye a llevar PDFs de billetes sueltos, notas del móvil y pestañas de blogs abiertas. Un único sitio donde está: qué toca hoy, dónde está cada uno, qué billete/localizador enseñar, y qué comer o ver cerca, con contexto histórico real de cada sitio.

No es una app de turismo genérica: está construida sobre este viaje concreto (estas fechas, estos hoteles, estos trayectos), no sobre datos en vivo de terceros.

## 2. Usuarios

- Daniel (organizador, dueño del contenido).
- El resto del grupo que viaja con él — necesitan acceso de solo lectura al mismo contenido desde sus propios móviles, sin tener que pedir el archivo cada vez ni depender de que Daniel lo comparta a mano.

Esto descarta un simple archivo HTML local: hace falta que el contenido viva en un sitio con enlace, aunque el desarrollo y el hosting se resuelvan más adelante en Claude Code.

## 3. Alcance del MVP (para el viaje de agosto)

1. **Itinerario día a día**: ciudad, hotel, horarios de entrada/salida, trayecto en tren del día con hora aproximada, resaltando "qué toca hoy" según la fecha del dispositivo.
2. **Billetes y localizadores siempre a mano**: vuelos (código de reserva, número de billete), hoteles (CRS locator, dirección, teléfono), trenes (una vez reservados). Pensado para enseñarlo en un mostrador sin buscar en el email.
3. **Mapa con posición en vivo**: geolocalización del móvil sobre un mapa, mostrando el hotel del día, los puntos de interés recomendados y (si aplica) la siguiente estación de tren.
4. **Recomendaciones curadas por ciudad/barrio**: sitios para comer y ver, investigados de verdad (blogs de viaje, guías) por mí antes del viaje, no generados por una API en el momento. Cada recomendación con su fuente.
5. **Contexto histórico y cultural por parada**: lo que ya está en `japon_info_base.md`, ampliado con más detalle y con las paradas concretas de cada día (templos, museos, etc.).
6. **Funciona con mala conexión**: contenido de texto, itinerario y recomendaciones cacheados/embebidos en el propio sitio (no dependen de una llamada a API en el momento); solo el mapa en vivo necesita internet real.

## 4. Fuera de alcance para el MVP (ideas para después, "hasta el infinito")

- Recomendaciones dinámicas vía API (Google Places o similar) en vez de curadas a mano.
- Notas/fotos compartidas entre el grupo dentro de la propia guía.
- Seguimiento en vivo de vuelos/trenes (retrasos, cambios de andén).
- Traducción o frases útiles interactivas.
- Gasto compartido / control de presupuesto del grupo.
- Versión para futuros viajes (generalizar la plantilla más allá de este viaje concreto).

## 5. Recomendación de arquitectura (punto de partida para Claude Code)

Dado que hace falta enlace compartible + mapa en vivo + varios usuarios, la opción con menos fricción es:

- **Sitio estático** (HTML/JS, sin backend propio) con el contenido (itinerario, billetes, recomendaciones) en un archivo de datos (`trip.json` o similar), para poder editarlo sin tocar el código de la interfaz.
- **Mapa**: Leaflet.js + capas de OpenStreetMap — no necesita clave de API ni facturación, a diferencia de Google Maps. Geolocalización vía la API nativa del navegador (`navigator.geolocation`), que funciona igual de bien con Leaflet.
- **Hosting**: Vercel, Netlify o GitHub Pages (planes gratuitos, despliegue en minutos desde el propio repositorio) — da el enlace compartible que necesita el grupo.
- **Multi-usuario**: como es de solo lectura para el grupo (no hace falta que cada uno edite), no hace falta login ni base de datos — todos abren el mismo enlace.
- Estos son puntos de partida, no decisiones cerradas — para eso queda el trabajo en Claude Code.

## 6. Esquema de datos sugerido (borrador)

```json
{
  "days": [
    {
      "date": "2026-08-17",
      "city": "Hakone",
      "hotel": { "name": "Mizunoto", "locator": "9084059719578", "address": "492-23 Kowakidani, Hakone" },
      "transport": { "type": "train", "from": "Tokio", "to": "Hakone-Yumoto", "provider": "Odakyu Romancecar" },
      "pois": [
        { "name": "Owakudani", "type": "vista/naturaleza", "lat": 35.2401, "lng": 139.0197, "note": "Valle volcánico, huevos negros", "source": "" }
      ]
    }
  ]
}
```

## 7. Fuentes de contenido ya preparadas

- `japon_info_base.md` — itinerario, localizadores, contexto histórico/práctico por ciudad.
- `Japon_Ago26_Itinerario_y_Trenes.docx` — plan de trenes y guía de reserva.
- Pendiente: investigación real de recomendaciones concretas por ciudad/barrio (sección 7 de `japon_info_base.md`).

## 8. Próximos pasos

1. Terminar la investigación real de recomendaciones (comida/sitios) por ciudad — puedo hacerla aquí antes de pasar a código.
2. Abrir Claude Code con este documento + `japon_info_base.md` como contexto de partida.
3. Construir el MVP: estructura del sitio, carga del `trip.json`, mapa Leaflet con geolocalización, desplegar en Vercel/Netlify/GitHub Pages y compartir el enlace con el grupo.

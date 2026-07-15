# HANDOVER 12 — Ola 5A: Emergencias y Último kilómetro

> Fecha: 2026-07-15 | SPEC: v1.10 → v1.11 | Estado: ✅ `npm run check`

## Entregado

### F10 — Emergencias

- Llamada directa a Policía (110) y Ambulancia/Bomberos (119).
- Japan Visitor Hotline 24/7: 050-3816-2787.
- Embajada de España: centralita, emergencia consular 24/7 y dirección.
- Seguro 24h y contacto en España editables; se guardan solo en localStorage.
- Fuentes oficiales enlazadas desde la propia pantalla.

### F12 — Último kilómetro

- Instrucciones offline para los seis registros de alojamiento (cinco hoteles únicos).
- Salidas de estación, tiempo a pie, pasos con equipaje y enlace de ubicación.
- Hakone conserva honestamente el shuttle como pendiente de reconfirmar.
- Tokio, Kioto, Hiroshima y Osaka contrastados con las webs oficiales de los hoteles.

### Integración y calidad

- Dos tarjetas activas nuevas en el tab Más.
- Contenido separado en `data/travel_tools.json` y cargado mediante la caché existente.
- Validador ampliado: todos los hoteles deben tener exactamente una guía y todas las fuentes deben ser URLs válidas.

## Verificación

- `npm run check` verde.
- 13 días, 24 POIs, 32 restaurantes, 16 alertas y 6 accesos validados.
- Build PWA: 54 módulos; JS 418,38 kB / 118,59 kB gzip; precache ~7,13 MB.
- npm audit: 0 vulnerabilidades conocidas.

## Siguiente

1. Desplegar y comprobar llamadas/instalación en los dos móviles reales.
2. Completar los teléfonos privados de seguro y contacto en cada dispositivo.
3. Reconfirmar shuttle y política de tatuajes de Mizunoto.
4. Atender reservas de trenes del 18 al 24 de julio.
5. Continuar Ola 5 con F11 Guía Suica y F8 Frases; dejar clima online para después.

# HANDOVER 13 — Ola 5B: Welcome Suica y Frases

> Fecha: 2026-07-15 | SPEC: v1.11 → v1.12 | Estado: ✅ `npm run check`

## F11 — Guía Suica/IC

- Recomendación operativa: Welcome Suica física en Narita Terminal 2·3.
- Compra, uso, recarga, límite de ¥20.000 y validez de 28 días.
- Advierte que no reemplaza billetes N’EX, shinkansen, limited express o reserva de asiento.
- Explica que no hay reembolso del saldo y que debe conservarse el reference paper.
- Destacada automáticamente en Vista Hoy cuando `day.type === "arrival"`.
- Información contrastada con JR East y JNTO a fecha 15 de julio de 2026.

## F8 — Frases japonesas

- 25 frases offline en seis categorías: cortesía, restaurante, transporte, hotel, compras y emergencia.
- Español, japonés y pronunciación aproximada para hispanohablantes.
- Al tocar una frase se amplía para enseñársela directamente a otra persona.
- Contenido apoyado en JNTO y Japan Foundation/Irodori.

## Calidad

- El validador exige seis categorías, al menos 24 frases completas, fuentes válidas y bloques completos de compra/uso/recarga IC.
- `npm run check`: datos, test y build PWA verdes.
- Build: 56 módulos; JS 424,02 kB / 119,56 kB gzip; precache ~7,13 MB.

## Siguiente

1. Reservas de trenes entre el 18 y el 24 de julio.
2. F9 Conversor ¥/€ con tipo editable y fecha visible, evitando una API frágil.
3. F13 Clima base offline; valorar por separado una alerta online fiable.

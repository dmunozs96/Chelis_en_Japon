# HANDOVER 14 — Ola 5C: Conversor y Clima

> Fecha: 2026-07-15 | SPEC: v1.12 → v1.13 | Estado: ✅ `npm run check`

## F9 — Conversor ¥/€

- Conversión bidireccional offline.
- Valor inicial BCE: 1 € = ¥185,01, referencia del 14/07/2026.
- Tipo editable y persistido en localStorage para introducir el cambio real de la tarjeta.
- Fecha, carácter orientativo y posible diferencia por comisiones siempre visibles.

## F13 — Clima por etapa

- Normales JMA 1991–2020 de Tokio, Kioto, Hiroshima y Osaka.
- Hakone se mantiene cualitativo al no disponer de una estación urbana comparable en la fuente usada.
- Consejos offline contra calor, humedad y lluvia.
- Enlace directo a alertas JMA cuando existe conexión.
- No se implementa detección automática de tifones sobre endpoints no documentados: queda explícitamente aplazada.

## Verificación

- Validación de tipo/fecha/fuente del conversor.
- Validación de cobertura climática de las cinco etapas y coherencia máxima ≥ media ≥ mínima.
- `npm run check` verde; build PWA con 58 módulos y 0 vulnerabilidades conocidas.

## Estado

La Ola 5 funcional queda completa. El siguiente trabajo de desarrollo recomendado es calidad de entrega: CI, pruebas E2E móviles, iconos PWA definitivos, actualización visible del service worker y división del bundle.

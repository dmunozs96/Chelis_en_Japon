# HANDOVER 20 — Top 50 lote 1D: soba, tendon y sushi accesible en Tokio (40/50)

> Fecha: 2026-07-22 | Estado: V2 en ejecución; Top 50 al 80 %

## Objetivo

Continuar el Top 50 gastronómico (foco de desarrollo decidido el 22 jul) añadiendo fichas que cierran **huecos de categoría** de la base, no por volumen. Se eligieron tres clásicos accesibles de Tokio porque tapaban las omisiones más flagrantes para una guía que aspira a sustituir a una de pago.

## Entregado — 3 fichas nuevas (37 → 40)

| ID | Categoría cubierta | Por qué |
|---|---|---|
| `tokyo_39_kanda_matsuya` | **Soba** (estaba a cero) | Casa histórica de soba Edo (1884) en Kanda; el hueco surgió al eliminar Honke Owariya en el lote 0 |
| `tokyo_40_kaneko_hannosuke` | **Tempura/tendon** (categoría inexistente) | El tendon más famoso de Tokio (~¥1.000), Nihonbashi |
| `tokyo_41_midori_sushi_ginza` | **Sushi sentado accesible** | Antes solo puestos de Tsukiji + Jiro premium descartado |

Cada ficha lleva el esquema V2 completo (entity_type, verification_status, verified_fields, source_count, closure_risk, name_ja, coordenadas de sucursal), «qué pedir» trazable y 3-4 fuentes.

## Método y control de calidad (regla nº1: cero invenciones)

- Investigación con **3 agentes en paralelo**, uno por ficha, con instrucción estricta de no inventar URLs/datos y devolver solo lo verificado contra web en vivo, con sección de incertidumbre.
- **Reverificación propia** de las 3 URLs primarias vía WebFetch (nombre, dirección, horario coincidentes en las tres):
  - Kaneko Hannosuke — web oficial `kaneko-hannosuke.com/shop/?id=0020001` ✓
  - Sushi no Midori Ginza — web oficial `sushinomidori.co.jp/shops/ginza/` ✓
  - Kanda Matsuya — Tabelog EN (confirma cierre domingo + lunes) ✓
- Corrección editorial aplicada: en Midori, `closed_days` pasó de `["1 enero"]` (que rompía la convención de días de semana) a `[]`; el cierre de 1-ene y los días de mantenimiento quedan fuera de la ventana del viaje y se explican en el texto.
- **Kanda Matsuya sin web oficial** (fallo de certificado TLS de su dominio): se marca con fuentes solo de referencia y `closure_risk: medium` por la incógnita de Obon. Reconfirmar por teléfono cerca de la fecha.

## Verificación
`npm run check` completo en verde: 13 días, 24 POIs, **40 restaurantes**, 15 alertas, 6 accesos, 25 frases + tests + build PWA. El diff de `restaurants_db.json` es de solo inserciones (no se reformateó ninguna ficha existente; se usó un serializador que replica el estilo del archivo).

## Cómo continuar

1. **Top 50: faltan 10 fichas.** Huecos de categoría aún abiertos: **wagyu/yakiniku** (0 en toda la guía), **anago/Miyajima**, **kissaten/café**, **wagashi/dulces**, y quizá kappo/kaiseki accesible en Osaka. Mantener el método (agente verificador + reverificación de URLs + esquema V2 completo).
2. **Ola 8 (trenes reales):** sigue pendiente de que Daniel reserve (a 22 jul, ninguna reserva hecha; 4 de 5 ventanas ya abiertas). Al reservar, volcar localizadores en `trip.json`.
3. Después del Top 50: ~150 fichas operativas (a cero), semana 3 del roadmap (Modo Ahora / Comer ahora / compras / rutas GeoJSON), geocodificación de coordenadas aproximadas del lote 0 y revalidación final 3-10 ago.

## Estado del repositorio al cerrar
- Un commit con: `data/restaurants_db.json` (+3 fichas), `SPEC.md` (lote 1D) y este handover.
- Sin cambios de código de cliente/servidor: `RestaurantsView` ya muestra «qué pedir» y justificación editorial desde el lote 1A.

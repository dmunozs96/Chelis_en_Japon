# HANDOVER 18 — Semana 2 V2: esquema editorial, preparación, cultura y arranque del Top 50 (retroactivo)

> Fecha del trabajo: 2026-07-15 (commits `8e2cf27`→`f7b0fbd`) · Documento redactado retroactivamente el 2026-07-22
> Motivo: estos 7 commits se hicieron sin su handover correspondiente (SPEC sí se actualizó en cada uno). Este documento recupera la traza que exige la regla de documentación del proyecto.

## Contexto

Tras la aprobación de la Puerta A y la auditoría del lote 0 (HANDOVER_17), esta tanda ejecutó buena parte de la **semana 2 del roadmap V2** (22-28 jul) adelantándola al 15 jul: el esquema editorial V2, dos dominios de contenido completos (preparación y cultura) y el arranque del Top 50 gastronómico. Todo quedó commiteado con SPEC actualizado pero sin handover; de ahí este registro.

## Commits cubiertos (7)

| Commit | Hora | Qué |
|---|---|---|
| `8e2cf27` | 16:52 | SPEC F19 — contrato del buscador completo del directorio al terminar la base |
| `12ec95d` | 17:10 | Esquema editorial V2 + centro de preparación (Dominio A) |
| `ef55330` | 17:14 | Ampliación del contexto del checklist de preparación |
| `2fc02a3` | 17:24 | Guía cultural esencial (Dominio C) |
| `0df509a` | 18:15 | Inicia el Top 50 (lote 1A, 33/50) y corrige regresión de Tsuta |
| `3397f37` | 18:24 | Top 50 lote 1B (35/50) — kaisendon y tsukemen |
| `f7b0fbd` | 19:22 | Top 50 lote 1C (37/50) — tofu y tonkatsu |

## Entregado

### Esquema editorial V2 (`12ec95d`)
- `EDITORIAL_CONTRACT.md` nuevo: contrato de ficha (identidad inequívoca, estado operativo fechado, fuentes con URL real, «qué pedir» trazable, clasificación honesta).
- Migración de las fichas al esquema V2 (`scripts/migrate-restaurants-v2.mjs`): `entity_type`, `verification_status`, `last_verified_at`, `verified_fields`, `source_count`, `closure_risk`, `name_ja` — hoy presentes en las 37 fichas.
- `scripts/validate-data.mjs` ampliado para hacer cumplir el esquema.

### Dominio A — Centro de preparación (`12ec95d`, `ef55330`)
- `data/preparation_checklist.json`: catálogo de tareas por hitos con vencimiento absoluto/relativo, prioridad, responsable, dependencias, sensibilidad y fuentes (ampliado en `ef55330`).
- `PreparationView.jsx` + `usePreparationData.js`: pantalla completa con progreso/filtros/bloqueos; solo persiste estado por ID en localStorage (regla 8 de privacidad, sin documentos).
- `TodayView.jsx`: antes del viaje muestra resumen operativo + siguiente tarea prioritaria en vez de solo la cuenta atrás. Acceso desde el tab «Más».

### Dominio C — Guía cultural esencial (`2fc02a3`)
- `data/cultural_guide.json`: 7 artículos offline (convivencia, trenes, templos/santuarios, memoria de Hiroshima, onsen/ryokan, mesa, cocina regional), cada uno con qué es / por qué importa / qué observar / cómo comportarse / error a evitar / dónde aplica.
- `CulturalGuideView.jsx` + `useCulturalGuideData.js`; contrastado con JNTO y el Museo Memorial de la Paz. Validador amplía para impedir temas incompletos o fuentes sin fecha.

### Top 50 gastronómico — lotes 1A/1B/1C (`0df509a`, `3397f37`, `f7b0fbd`)
De 31 → **37 fichas** (faltan 13 para 50):
- 1A: Tamura Ginkatsutei (Hakone) y Omen Shijo Pontocho (Kioto). **Reparada regresión grave de Tsuta**: la base publicada aún tenía Sugamo/estrella/reserva web/teléfono antiguos pese a la auditoría; corregida e invariantes nuevas para evitar la regresión.
- 1B: Tsujihan (kaisendon, Nihonbashi) y Bakudanya (tsukemen, Hiroshima).
- 1C: Tousuiro (tofu/yuba, Kioto, con menú vegetariano real Rokuhara) y Ginza Tonkatsu Aoki (sucursal Ginza 4-chome fijada).
- `RestaurantsView.jsx` muestra platos recomendados y justificación editorial por ficha.

### F19 — contrato del buscador (`8e2cf27`)
Cuando la base llegue a Top 50 + ~150 operativas, `RestaurantsView` pasa de sugeridor a buscador: filtros por barrio/plato/«abierto hoy»/franja, vista-mapa de resultados (depende de pagar la deuda de geocodificación) y precio medio aproximado en € (tipo del conversor F9). Solo especificado, no implementado.

## Verificación
`npm run check` en verde al cierre de cada lote (datos, tests, build PWA).

## Estado al cierre de esta tanda
- 37 restaurantes, esquema V2 aplicado. Top 50 al 74%.
- Semanas 1 y 2 del roadmap V2 esencialmente cubiertas salvo Ola 8 (trenes reales) y las ~150 fichas operativas.
- Deuda viva: geocodificación de coordenadas aproximadas del lote 0, ~150 fichas operativas a cero, revalidación final 3-10 ago.

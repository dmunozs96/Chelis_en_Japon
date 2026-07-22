# HANDOVER 21 — Top 50 lote 1E: yakiniku, kissaten, wagashi y ramen (44/50)

> Fecha: 2026-07-22 | Estado: V2 en ejecución; Top 50 al 88 %

## Objetivo

Continuar el Top 50 (foco de desarrollo vigente) con un lote que cierra huecos de categoría y **equilibra la cobertura por ciudad**: Osaka tenía 10 fichas todas de street food, Kioto no tenía café ni dulces, y Tokio solo tenía un ramen atípico (Tsuta).

## Entregado — 4 fichas nuevas (40 → 44)

| ID | Ciudad | Categoría cubierta |
|---|---|---|
| `osaka_42_tsuruichi_tsuruhashi` | Osaka | **Yakiniku accesible** (Tsuruhashi/Koreatown) — carne a la parrilla, antes 0 en toda la guía |
| `kyoto_43_inoda_coffee` | Kyoto | **Kissaten** histórico (1940) — categoría nueva |
| `kyoto_44_kagizen_yoshifusa` | Kyoto | **Wagashi + salón de té** en Gion — categoría nueva |
| `tokyo_45_afuri_ebisu` | Tokyo | **Ramen** clásico accesible (yuzu shio), local original |

Cada ficha con esquema V2 completo, «qué pedir» trazable y 4-7 fuentes.

## Método y control de calidad (regla nº1: cero invenciones)

- **4 agentes verificadores en paralelo**, uno por ficha, con protocolo anti-fabricación y sección de incertidumbre.
- **Descarte editorial documentado:** el primer candidato de Osaka (Matsusaka Yakiniku M) estaba bien verificado pero era tier 4 (¥10.000-15.000), incompatible con el criterio cost-conscious de la Puerta A. Se reusó el contexto del agente para sustituirlo por **Yakiniku Tsuruichi** (tier 3, ¥4.000-5.000, superfamoso, web oficial).
- **Reverificación propia vía WebFetch** de las URLs oficiales de Tsuruichi, Kagizen y AFURI: dirección, horario y día de cierre coincidentes en las tres. Inoda quedó respaldada por web oficial + Tabelog + JTB.
- **Honestidad de datos:** teléfono de Tsuruichi en `null` (no lo publican; terceros daban números contradictorios → no se inventa ninguno). Cierres semanales en lunes marcados en Tsuruichi y Kagizen; ambos con `closure_risk: medium` por la incógnita de Obon.

## Verificación
`npm run check` completo en verde: 13 días, 24 POIs, **44 restaurantes**, 15 alertas, 6 accesos, 25 frases + tests + build PWA. Diff de `restaurants_db.json` de solo inserciones (+178, −0); no se reformateó ninguna ficha existente (serializador que replica el estilo del archivo).

## Cómo continuar

1. **Top 50: faltan 6 fichas.** Huecos sugeridos: anago, unagi o tempura de gama alta en Tokio, kappo/sushi accesible en Osaka, un dulce/matcha en Tokio, y quizá un segundo ramen regional. Mantener el método (agente verificador + reverificación de URLs + esquema V2).
2. **Ola 8 (trenes reales):** sigue pendiente de que Daniel reserve (a 22 jul, ninguna reserva; 4 de 5 ventanas abiertas).
3. Tras el Top 50: ~150 fichas operativas (a cero), semana 3 del roadmap (Modo Ahora / Comer ahora / compras / rutas GeoJSON), geocodificación del lote 0 y revalidación final 3-10 ago.

## Estado del repositorio al cerrar
- Un commit con: `data/restaurants_db.json` (+4 fichas), `SPEC.md` (lote 1E) y este handover.
- Sin cambios de código de cliente/servidor.

# HANDOVER 24 — Fichas operativas: colección «Sobre la marcha» (56 fichas)

> Fecha: 2026-07-23 | Estado: V2 en ejecución; arranca la fase de fichas operativas

## Objetivo

Petición de Daniel: seguir con fichas gastronómicas metiendo **más variedad** y, sobre todo, crear una **sección de comida "sobre la marcha"** — street food / sushi asequible / «aquí te pillo aquí te mato»: comidas on-the-go de calidad soberbia pagando cuatro perras (los sweet spots japoneses). Esto inaugura la fase de las ~150 fichas operativas.

## Mecanismo de «sección» (sin código nuevo)

El cliente (`RestaurantsView`) genera un chip de filtro por cada valor distinto de `good_for` (y lo muestra sustituyendo `_` por espacios). Basta con etiquetar las fichas con `good_for: "sobre_la_marcha"` para que aparezca un filtro **«sobre la marcha»** automáticamente. No se tocó código en esta iteración.

## Entregado — 6 fichas nuevas (50 → 56) + 5 retro-etiquetadas

| ID | Ciudad | Plato | Tier |
|---|---|---|---|
| `osaka_52_551_horai_honten` | Osaka | Butaman (bollo de cerdo) para llevar | 1 |
| `tokyo_53_uogashi_nihonichi` | Tokyo | Sushi de pie (tachigui-zushi) | 1 |
| `tokyo_54_onigiri_bongo` | Tokyo | Onigiri | 1 |
| `tokyo_55_yomoda_soba_nihonbashi` | Tokyo | Soba de pie + curry indio (`partial`) | 1 |
| `kyoto_56_demachi_futaba` | Kyoto | Mamemochi (wagashi to-go) | 1 |
| `tokyo_57_asakusa_menchi` | Tokyo | Menchikatsu callejero | 1 |

**Retro-etiquetadas** con `sobre_la_marcha` (ya eran grab-and-go): Takoyaki Wanaka, Kukuru, Acchichi, Mercado de Tsukiji y Mercado de Nishiki. La colección reúne 11 fichas.

## Control de calidad (regla nº1: cero invenciones)
- 6 agentes verificadores en paralelo; para la soba el agente eligió **Yomoda Soba** (fideo fresco propio + curry indio) sobre la cadena básica Fuji Soba, por calidad.
- **Reverificación propia vía WebFetch** de las webs oficiales de 551 Horai, Onigiri Bongo y Asakusa Menchi: coincidentes.
- **Normalización** de lo que devolvieron los agentes: ids a guion bajo, tags/`good_for` sin espacios, teléfonos a +81. Matiz de 551 Horai: cierra 1er y 3er martes → `closed_days` vacío con la nota en `hours` (la escala de días de semana no expresa cierres quincenales); por eso `closed_days` no entra en `verified_fields`. Yomoda Soba queda `verification_status: partial` (precios exactos sin confirmar, la web anunció reajuste en jul-2026).

## Verificación
`npm run check` completo en verde: 13 días, 24 POIs, **56 restaurantes**, 15 alertas, 6 accesos, 25 frases + tests + build PWA. Diff de solo inserciones + 5 líneas `good_for` (retag): +257, −5. Distribución de precio: 31×¥, 12×¥¥, 7×¥¥¥, 2×¥¥¥¥, 4×¥¥¥¥¥.

## Cómo continuar
1. **Seguir poblando «Sobre la marcha»** y otras colecciones operativas con más variedad: kaiten-zushi (conveyor) asequible, gyudon de calidad, taiyaki/imagawayaki, curry, gyoza, konbini-gourmet, depachika, un segundo ramen barato, más grab-and-go en Kioto/Hiroshima. Mantener el método.
2. **Idea UI opcional:** hoy «sobre la marcha» es un chip más entre las ocasiones; si se quiere una sección visualmente destacada (bloque propio con su icono), sería un cambio pequeño en `RestaurantsView`.
3. **Revalidación previa al viaje** (3-10 ago): atención a cierres de Obon marcados `closure_risk: medium` y a los cierres semanales que caen en la ventana (551 Horai mar 18; Demachi Futaba martes; Menami miércoles 19).
4. **Ola 8 (trenes):** sigue pendiente de que Daniel reserve.

## Estado del repositorio al cerrar
- Un commit con: `data/restaurants_db.json` (+6 fichas, +5 retag), `SPEC.md` (colección «Sobre la marcha») y este handover.
- Sin cambios de código de cliente/servidor.

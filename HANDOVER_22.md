# HANDOVER 22 — Nueva escala de precios de 5 tramos y re-tramado de todas las fichas

> Fecha: 2026-07-22 | Estado: V2 en ejecución

## Objetivo

Daniel redefinió la escala de `price_tier`: pasa de 4 a **5 tramos** y con topes de gasto por persona más altos. La escala anterior (tier 4 = >¥6.000) comprimía demasiado la gama alta. Esta iteración fija la escala nueva, re-trama las 44 fichas y actualiza cliente y SPEC. No añade fichas nuevas (eso es el lote 1F, siguiente).

## Escala nueva (tope de gasto por persona en una comida/cena)

| Tier | Símbolo | Tope aprox. |
|---|---|---|
| 1 | ¥ | hasta ~¥3.000 |
| 2 | ¥¥ | ~¥3.000–5.000 |
| 3 | ¥¥¥ | ~¥5.000–10.000 |
| 4 | ¥¥¥¥ | ~¥10.000–15.000 |
| 5 | ¥¥¥¥¥ | ~¥15.000–20.000 o más |

El tramo se asigna por el **extremo superior** del rango de precio de la ficha (el "tope").

## Entregado

- **`data/restaurants_db.json`:** re-tramadas **23 de 44** fichas (script determinista: parsea el yen máximo del rango y aplica la escala). Diff de solo 23 líneas `price_tier` (23 insert / 23 delete), sin tocar ningún otro campo ni el formato. Ejemplos: ESqUISSE, Jiro, Sushi Taizō y Roan Kikunoi → tier 5; Bird Land y Tousuiro → tier 4; mucho street food y casual (okonomiyaki, takoyaki, cafés, ramen accesible) → tier 1.
- **`client/src/components/RestaurantsView.jsx`:** `PRICE_TIER_LABELS` añade el tier 5 (¥¥¥¥¥) y el filtro itera `[1,2,3,4,5]`. La tarjeta ya usaba el mapa de etiquetas con fallback, así que muestra el nuevo símbolo sin más cambios.
- **`SPEC.md`:** nueva tabla canónica de la escala en la sección F5 (base de datos enriquecida), y menciones actualizadas de "¥ a ¥¥¥¥" → "¥ a ¥¥¥¥¥" y del filtro de presupuesto.

## Verificación
`npm run check` completo en verde (44 restaurantes, tests, build PWA con el cliente recompilado). El validador no restringe `price_tier`, así que el tier 5 no requiere cambios de esquema.

## Cómo continuar
1. **Top 50 — lote 1F (final, faltan 6):** con la escala nueva ya en vigor, añadir las 6 fichas restantes buscando **variedad de precios** (de tier 1 a tier 4/5) y estilos equilibrados. Huecos: anago, unagi/tempura en Tokio, sushi/kappo accesible en Osaka, obanzai en Kioto, un dulce o un segundo ramen. Mismo método (agente verificador + reverificación de URLs + esquema V2, ahora con la escala de 5 tramos).
2. Ola 8 (trenes) sigue pendiente de reservas de Daniel.

## Estado del repositorio al cerrar
- Un commit con: `restaurants_db.json` (re-tramado), `RestaurantsView.jsx` (tier 5), `SPEC.md` (escala) y este handover.

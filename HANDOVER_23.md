# HANDOVER 23 — Top 50 COMPLETO (50/50): lote 1F con variedad de precios

> Fecha: 2026-07-23 | Estado: V2 en ejecución; **Top 50 profundo terminado**

## Objetivo

Cerrar el Top 50 gastronómico con las 6 fichas restantes, cumpliendo la petición de Daniel de **variedad de precios y estilos equilibrados**, ya con la escala de 5 tramos fijada en HANDOVER_22.

## Entregado — 6 fichas nuevas (44 → 50)

| ID | Ciudad | Estilo | Tier |
|---|---|---|---|
| `tokyo_46_nodaiwa` | Tokyo | Unagi (1★ Michelin 2026) | 3 |
| `tokyo_47_tsunahachi` | Tokyo | Tempura (comida completa) | 3 |
| `osaka_48_harukoma` | Osaka | Sushi asequible | 2 |
| `kyoto_49_menami` | Kyoto | Obanzai (casero) | 3 |
| `hiroshima_50_anagomeshi_ueno` | Hiroshima | Anago-meshi (casa Ueno, 1901) | 2 |
| `tokyo_51_monja_kondo` | Tokyo | Monjayaki (Tsukishima) | 2 |

Con estas fichas la base cubre unagi, tempura, obanzai, monjayaki y anago (categorías antes inexistentes) y añade el primer sushi de Osaka.

## Decisiones y control de calidad (regla nº1: cero invenciones)

- **6 agentes verificadores en paralelo**; la de anago se cortó por un límite de sesión y se reanudó (SendMessage) hasta completarse.
- **Casos delicados resueltos:**
  - **Tsunahachi:** el sohonten original de Shinjuku está en reconstrucción hasta 2028. En lugar de publicar un local cerrado, la ficha apunta a su anexo oficial «Sohonten Bekkan» (abierto jun-2026), verificado en la web oficial.
  - **Anago sin Miyajima:** Miyajima está descartado del itinerario, así que se buscó anago-meshi en la ciudad de Hiroshima. Se encontró la sucursal de la mítica casa Ueno (1901) en el sótano de Hiroshima Mitsukoshi, a 1 min del tranvía Ebisuchō — verificada en la web oficial.
- **Normalización de datos** sobre lo que devolvieron los agentes: `hours` de Tsunahachi venía como objeto → string; `price_per_person_yen` de Harukoma y Kondo venían como número → string; `reservation_how` en frase → enum; ids a guion bajo; teléfonos a formato +81; se descartó una fuente Nominatim mal codificada en la de anago.
- **Reverificación propia vía WebFetch** de Anagomeshi Ueno (mitsukoshi), Tsunahachi (Bekkan) y Menami: dirección, horario, cierre y estado coincidentes. Nodaiwa respaldada por Michelin 2026 + Tabelog (su web es solo HTTP); Harukoma y Kondo por Tabelog + fuentes múltiples.

## Verificación
`npm run check` completo en verde: 13 días, 24 POIs, **50 restaurantes**, 15 alertas, 6 accesos, 25 frases + tests + build PWA. Diff de solo inserciones (+256, −0). Distribución de precio: 25×¥, 12×¥¥, 7×¥¥¥, 2×¥¥¥¥, 4×¥¥¥¥¥.

## Cómo continuar
1. **Top 50 terminado.** La siguiente fase gastronómica son las **~150 fichas operativas** (a cero) — fichas más ligeras que el Top 50, para dar volumen de opciones. Definir su alcance/estructura antes de arrancar.
2. **Revalidación previa al viaje** (semana del 3-10 ago): repasar `revalidate_on` de todas las fichas del plan, con atención a los cierres de Obon marcados `closure_risk: medium` (Kanda Matsuya, Tsuruichi, Kagizen, Nodaiwa, Menami, Harukoma) y al miércoles 19-ago (Menami cierra).
3. **Ola 8 (trenes):** sigue pendiente de que Daniel reserve.
4. Resto de la semana 3 del roadmap: Modo Ahora / Comer ahora, compras/día libre, rutas GeoJSON, geocodificación del lote 0.

## Estado del repositorio al cerrar
- Un commit con: `data/restaurants_db.json` (+6 fichas), `SPEC.md` (lote 1F + cierre del Top 50) y este handover.
- Sin cambios de código de cliente/servidor en esta iteración (el tier 5 ya entró en HANDOVER_22).

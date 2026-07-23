# HANDOVER 25 — «Sobre la marcha» lote O2 (62 fichas)

> Fecha: 2026-07-23 | Estado: V2 en ejecución; fase de fichas operativas

## Objetivo
Ampliar la colección «Sobre la marcha» (comida on-the-go barata y de calidad) con más variedad de plato y mejor reparto por ciudad, a petición de Daniel.

## Entregado — 6 fichas nuevas (56 → 62)

| ID | Ciudad | Plato | Tier |
|---|---|---|---|
| `tokyo_58_nemuro_hanamaru` | Tokyo | Kaiten-zushi de calidad (KITTE Marunouchi) | 2 |
| `tokyo_59_harajuku_gyozaro` | Tokyo | Gyoza barata (Harajuku) | 1 |
| `tokyo_60_naniwaya_sohonten` | Tokyo | Taiyaki original (1909, Azabu-Juban) | 1 |
| `hiroshima_61_musubi_musashi_hondori` | Hiroshima | Onigiri/bento to-go (`partial`) | 1 |
| `kyoto_62_gion_tsujiri` | Kyoto | Helado soft de matcha to-go (Gion) | 1 |
| `osaka_63_hanshin_ikayaki` | Osaka | Ikayaki del depachika Hanshin | 1 |

La colección «sobre la marcha» (good_for) reúne ya **17 fichas**.

## Control de calidad (regla nº1)
- 6 agentes verificadores en paralelo + **reverificación propia vía WebFetch** de Nemuro Hanamaru (web oficial confirma sin cierres en agosto 2026), Hanshin ikayaki (catálogo oficial, precios) y Gion Tsujiri (oficial).
- **Correcciones sobre lo devuelto por los agentes:**
  - `tokyo_58_nemuro_hanamaru` vino con `lat/lng: null` (el agente no verificó coordenadas). Como el validador exige coordenadas numéricas, se fijaron las del edificio KITTE Marunouchi (verificado por dirección y planta; coordenada a nivel de edificio, deuda menor).
  - `tokyo_60_naniwaya`: `closed_days` normalizado a `["Tuesday"]` (el valor `"third Wednesday"` que devolvió el agente no es un día de semana válido y rompería la lógica de «abierto hoy»); el 3er miércoles queda anotado en `hours`.
  - `hiroshima_61_musubi_musashi`: el puesto de Hondori se derribó en 2025 y reabrió en dic-2025 solo para llevar; su horario/teléfono aún no están publicados → `verification_status: partial`, `hours`/`phone` en null, con la situación explicada en `why_special`.
  - Estandarización: `good_for` con `sobre_la_marcha` primero, ids con guion bajo, teléfonos en +81.

## Verificación
`npm run check` en verde: 13 días, 24 POIs, **62 restaurantes**, 15 alertas, 6 accesos, 25 frases + tests + build PWA. Diff de solo inserciones (+250, −0). Distribución de precio: 36×¥, 13×¥¥, 7×¥¥¥, 2×¥¥¥¥, 4×¥¥¥¥¥.

## Cómo continuar
1. Seguir ampliando variedad on-the-go / operativa si se desea: curry económico, gyudon de calidad, dorayaki/dango, konbini-gourmet o depachika de otra ciudad, un segundo ramen barato, más grab-and-go en Kioto.
2. Idea UI pendiente (opcional): convertir «sobre la marcha» de chip de ocasión a sección visual destacada en `RestaurantsView`.
3. Revalidación previa al viaje (3-10 ago): cierres semanales en la ventana — Naniwaya (martes/3er miércoles), Demachi Futaba (martes), 551 Horai (1er/3er martes), Menami (miércoles 19); y confirmar el horario del puesto reabierto de Musubi Musashi.
4. Ola 8 (trenes): pendiente de reservas de Daniel.

## Estado del repositorio al cerrar
- Un commit con: `data/restaurants_db.json` (+6 fichas), `SPEC.md` (lote O2) y este handover.
- Sin cambios de código de cliente/servidor.

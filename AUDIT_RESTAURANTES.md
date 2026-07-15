# Auditoría de restaurantes — Lote 0 (V2)

> Fecha: 2026-07-15 | Alcance: los 32 registros de `data/restaurants_db.json` existentes al cierre de la V1
> Método: verificación web en vivo mediante 3 agentes en paralelo (Tokio / Kioto / Osaka+Hiroshima) contra webs oficiales, Tabelog, Guía Michelin, JNTO y prensa local. Cada corrección aplicada cita la fuente consultada y la fecha (15 jul 2026) en la propia ficha.
> Resultado: **31 fichas activas** (1 eliminada), 100 % verificadas. Ninguna resultó inventada.

## 1. Resumen de veredictos

| Veredicto | Nº | Fichas |
|---|---:|---|
| Abierto, sin cambios de fondo | 12 | Gado-shita*, Andy's, Tsukiji*, ESqUISSE, Nishiki*, Kukuru, Mizuno, Chibo, Imai, CREO-RU, Reichan, Ekinishi* |
| Abierto, con correcciones de datos | 14 | Ichiniisan, Bird Land, Jiro, Sanchoku*, Onikai, Kaneyo, Sushi Taizō, Roan Kikunoi, Okonomimura*, Micchan, Wanaka, Acchichi, Ajinoya, Bonkuraya, Daruma |
| Mudado / renombrado (corregido) | 4 | Tsuta (Sugamo→Yoyogi-Uehara), Janomeya (Pontocho→Kayukoji), Gion Kappa→Gahōjin Kappa, Kyōyū→Kyo Asobi |
| **Cerrado — eliminado de la base** | **1** | **Honke Owariya** (fin del servicio de soba el 11-ene-2026 tras 560 años; Kyoto Shimbun 9-oct-2025) |

\* Entidades genéricas (ver §3).

## 2. Hallazgos críticos (afectan al itinerario)

1. **Conflicto del miércoles 19 de agosto (CORREGIDO):** las dos opciones de cena previstas ese día en Kioto —Kyogoku Kaneyo y Roan Kikunoi— cierran los miércoles. El unagi se movió a la noche del jueves 20 (entrada 19:30; la cocina de Kaneyo cierra a las 20:00) y el miércoles 19 ofrece alternativas verificadas abiertas (Gahōjin Kappa, Janomeya, Onikai). Actualizado en `trip.json` y SPEC §2.
2. **Honke Owariya cerrado** desde el 11-ene-2026 (edificio en venta, negocio reorientado a e-commerce). No estaba asignado a ningún bloque del itinerario. Eliminado.
3. **Sukiyabashi Jiro: cierre de verano 14-19 ago 2026** (web oficial) — en plenas fechas del viaje. Además fue retirado de la guía Michelin en 2020; su ficha decía 3★ vigentes. Corregido; se conserva como referencia cultural.
4. **Bird Land perdió la estrella** (guía 2024; hoy Selected). Posible cierre por inventario 16-18 ago según su web — confirmar por teléfono solo si se decide ir.
5. **Roan Kikunoi: precio real 3-4× el de la ficha** (almuerzo desde ~¥14.500; cena ¥24.000-63.000 con cargos). La nota interna que decía «1 estrella» era errónea: tiene 2★ confirmadas (2026). Con la decisión «sin premium» de la Puerta A, queda como referencia editorial.
6. **Tsuta: la ficha estaba casi entera mal** — se mudó a Yoyogi-Uehara (dic-2019), el fundador falleció (2022), reabrió (feb-2023), sin estrella desde 2020, sin reserva web (walk-in con cola), cierra martes (no lunes). Reescrita por completo.

## 3. Entidades genéricas (no son un restaurante)

El principio P2 de `PLAN_V2.md` exige distinguir establecimientos concretos de zonas. Clasificación:

| Ficha | Tipo real | Decisión |
|---|---|---|
| Yurakucho Gado-shita | Calle/zona de izakayas | Se conserva descrita honestamente como zona; activa pese a la reurbanización de Yurakucho (afecta a 2 edificios de oficinas, no al viaducto) |
| Yurakucho Sanchoku Yokocho | Agrupación (11 locales) | Renombrada (el nombre «Inshokugai» caducó en 2019); descrita como agrupación |
| Tsukiji Outer Market | Mercado (ya existe como POI) | Se conserva; candidata a fusionarse con el POI en el esquema V2 |
| Nishiki Market | Mercado (ya existe como POI) | Ídem |
| Okonomimura | Food hall (~23 puestos, plantas 2-4) | Descrita como agrupación, con puestos concretos recomendados por fuentes de 2026: Atom (4ª), Hassho (2ª), Sarashina |
| Ekinishi | Barrio de izakayas | Descrita como zona; nota estacional añadida (agosto no es temporada de ostra cruda) |

Pendiente V2: campo `entity_type` (`restaurant` / `food_area` / `market` / `food_hall`) en el esquema definitivo, con distintivo visual en la interfaz. Hasta entonces, la honestidad vive en nombre y descripción.

## 4. Sucursales fijadas (antes ambiguas)

| Ficha | Sucursal fijada | Motivo |
|---|---|---|
| Kushikatsu Daruma | Dotonbori 1-6-8 (edificio propio, 140 plazas) | A 5-10 min del hotel; el sohonten de Shinsekai (12 asientos) queda como alternativa |
| Takoyaki Wanaka | Sennichimae Honten (11-19, junto a Doguyasuji) | Sede canónica de la cadena |
| Acchichi Honpo | Dotonbori (Soemoncho 7-19) | El honten oficial está en Tobita Shinchi, lejos del centro; esta es la útil |
| Chibo | Dotonbori Building (1-5-5) | La sospecha de cierre 2020-21 era infundada; sede confirmada en web oficial |
| Bonkuraya | Dotonbori 1-5-9, 2F | «Namba» genérico resuelto vía Tabelog |
| CREO-RU | Dotonbori 1-6-4 | Ídem; no confundir con locales satélite |
| Micchan | Sohonten Hatchobori 6-7 | Confirmada en web oficial |
| Ichiniisan | Ginza INZ 1, B1F | Nombre oficial: Yushoku Tonsai Ichiniisan, sucursal Ginza |

## 5. Correcciones de horarios y días de cierre relevantes

- **Ajinoya:** cierra los lunes (la ficha decía «sin cierre»); puede cerrar también último lunes/martes de mes.
- **Mizuno:** ya no cierra los jueves; último pedido 21:00; sin reservas (cola diaria).
- **Kyo Asobi (ex-Kyōyū):** cierra los domingos (la ficha decía lunes).
- **Imai:** cierra miércoles + 4º martes de mes.
- **Micchan:** horario partido (cerrado ~14:30-17:30) y cierre los martes, aunque varias guías digan lo contrario.
- **Kaneyo:** última entrada de cena 20:00 real (LO); martes solo almuerzo.
- **Ichiniisan:** abre a diario (la ficha decía cierre dominical); el precio bajo es solo del mediodía.
- **Andy's Shin Hinomoto:** solo efectivo; reserva online disponible en su web.

## 6. Deuda de esta auditoría (pendiente, consciente)

> Corrección posterior (15 jul 2026): se detectó que la ficha de Tsuta en `main` no contenía realmente las correcciones descritas por esta auditoría. Se repararon ubicación, coordenadas, estrella, horario, cierre, reserva, teléfono, texto y fuentes, y se añadieron invariantes específicas al validador para evitar la regresión.

1. **Coordenadas aproximadas:** los locales mudados o con sucursal re-fijada (Janomeya, Onikai, Kappa, Kaneyo, Sushi Taizō, Wanaka, Daruma, Bonkuraya, CREO-RU) llevan coordenadas de zona (±100-300 m), no geocodificación contrastada. Se corregirán en el paso de geocodificación del pipeline V2 antes de usarse para rutas.
2. **Esquema de verificación:** los campos del contrato V2 (`verification_status`, `last_verified_at`, `verified_fields`, `source_count`, `closure_risk`, `entity_type`, `name_ja`) se añadirán con el esquema definitivo del lote 1; de momento la fecha de verificación consta en texto en cada ficha.
3. **Planificador:** si algún slot del planificador (Postgres/localStorage) tenía asignado `kyoto_14_honke_owariya`, quedará huérfano; comprobar en el próximo despliegue.
4. **Precios no re-verificados uno a uno** en fichas de bajo riesgo (street food ¥500-1.500): riesgo bajo, se revalidarán con la pasada previa al viaje.
5. **Revalidación final:** todas las fichas usadas en el plan gastronómico deben revalidarse la semana del 3-10 de agosto (regla `revalidate_on` del plan V2).

# Plan director V2 — Chelis en Japón

> Estado: **APROBADO — Puerta A resuelta el 15 de julio de 2026** (ver §17). Implementación autorizada.
> Fecha de corte de la investigación: 15 de julio de 2026.
> Viaje: 13–25 de agosto de 2026.
> Ajuste de alcance aprobado: el objetivo de 400 fichas se sustituye por **Top 50 profundo + ~150 fichas operativas** (≈200 en total), con los mismos controles de calidad por lote. La migración cartográfica a MapLibre/PMTiles queda descartada para la V2: se mantiene Leaflet con rutas GeoJSON reales en tramos críticos.

## 1. Decisión de producto

La V1 resuelve principalmente la logística conocida: itinerario, billetes, POIs, mapa, restaurantes, alertas y herramientas. La V2 debe convertirla en una combinación de:

1. **Centro de preparación**, durante los 28 días anteriores.
2. **Asistente operativo**, capaz de responder «qué toca ahora y qué hacemos si cambia el plan».
3. **Guía cultural y gastronómica editorial**, con profundidad suficiente para sustituir una guía generalista durante este viaje.
4. **Guía de compras**, vinculada a intereses, ahorro real, normativa y días libres.
5. **Atlas práctico**, con mapas legibles y trayectos realmente útiles.

La idea rectora es **contexto antes que catálogo**. No basta con acumular 400 restaurantes o muchos artículos: la app debe mostrar el contenido apropiado para la ciudad, zona, hora, actividad y necesidad actuales.

### Criterio de éxito V2

Sin abrir otra guía, cualquiera de los dos viajeros debe poder responder en menos de 10 segundos:

- antes del viaje: «¿qué nos queda por preparar y cuándo vence?»;
- durante el viaje: «¿qué toca ahora, cómo llegamos y qué necesitamos?»;
- ante un cambio: «¿qué alternativa real tenemos aquí y ahora?»;
- ante una comida: «¿qué experiencia buscamos, dónde la encontramos y qué debemos pedir?»;
- ante una compra: «¿dónde conviene comprarlo, por qué y qué reglas fiscales o de garantía aplican?».

## 2. Principios no negociables de la V2

### P1. Cero invenciones y trazabilidad por campo

Todo establecimiento, horario, precio, ubicación, plato recomendado, regla fronteriza o consejo sanitario debe tener una fuente identificable y fecha de verificación. Un dato sin confirmar se muestra como tal o no se publica.

La generación de texto puede resumir fuentes, pero nunca crear entidades, completar huecos de memoria ni convertir rumores en hechos.

### P2. Las 400 fichas son un suelo cuantitativo, no el criterio de calidad

No se aceptarán duplicados, sucursales ambiguas, negocios cerrados, zonas genéricas presentadas como restaurantes ni fichas sin identidad verificable. Los 32 registros actuales también pasarán la auditoría; no quedan convalidados por existir ya.

### P3. Fuentes por autoridad

Orden recomendado:

1. Fuente oficial del organismo, establecimiento, centro comercial o marca.
2. Fuente primaria de reservas o directorio local con ficha inequívoca.
3. Guías editoriales reputadas: Michelin, JNTO, oficinas turísticas, prensa gastronómica y guías de viaje.
4. Agregadores y reseñas como señal complementaria, nunca como única prueba de datos críticos.

Lonely Planet y otras publicaciones pueden servir para descubrir o contrastar lugares, pero no se copiarán sus textos, fotografías ni bases de datos.

### P4. Offline por degradación elegante

La preparación, guía cultural, fichas curadas, plan diario, datos críticos y top gastronómico deben funcionar offline. Información volátil —meteorología, horarios en vivo, aforo o reseñas— mostrará la última actualización y requerirá conexión para refrescarse.

### P5. Mobile-first y decisión en una mano

La profundidad editorial no puede convertirse en paredes de texto. Cada tema tendrá una respuesta breve, expansión progresiva, contexto «por qué importa» y acciones relacionadas.

### P6. Privacidad y seguridad

Pasaportes, pólizas, medicación, contactos y documentos no vivirán en Git. En esta fase se definirá qué información puede guardarse localmente, cuál debe cifrarse y cuál solo debe representarse como «verificado» sin almacenar el documento.

## 3. Arquitectura funcional

```text
ANTES DEL VIAJE
Preparación → tareas → evidencia → estado compartido → cuenta atrás
                         ↓
DURANTE EL VIAJE
Ahora → bloque activo → trayecto → contexto cultural → comida/compra → Plan B
                         ↓
DESPUÉS DEL VIAJE
Historial de actividades, decisiones y diario (V2.1)
```

La V2 se organiza en ocho dominios, conectados por fecha, ciudad, barrio y bloque del itinerario:

1. Preparación.
2. Modo Ahora e itinerario vivo.
3. Guía cultural.
4. Guía gastronómica.
5. Directorio de restaurantes.
6. Guía de compras.
7. Cartografía y trayectos.
8. Reservas, clima y planes alternativos.

## 4. Dominio A — Centro de preparación

### 4.1 Experiencia

Durante el periodo previo, la Vista Hoy tendrá un modo «Preparación». Mostrará:

- días restantes;
- tareas críticas vencidas o próximas;
- progreso total y por viajero;
- próximo hito;
- tareas bloqueadas por otra tarea;
- accesos directos a documentación, equipaje, salud, dinero, conectividad y reservas.

Existirá además una pantalla completa «Preparar viaje». La Vista Hoy resume; la pantalla administra.

### 4.2 Modelo de checklist

Cada tarea deberá admitir:

| Campo | Uso |
|---|---|
| `id` | Identidad estable |
| `title` / `description` | Acción concreta y explicación |
| `category` | documentación, frontera, salud, reservas, dinero, conectividad, equipaje, hogar |
| `due_rule` | Fecha absoluta o relativa a la salida |
| `priority` | crítica, importante, conveniente |
| `assignee` | Daniel, acompañante, ambos |
| `status` | pendiente, en curso, bloqueada, completada, no aplica |
| `depends_on` | Dependencias explícitas |
| `evidence_mode` | confirmación, dato parcial o documento local |
| `source_refs` | Fuente y fecha de verificación |
| `sensitive` | Impide sincronizar contenido privado sin protección |
| `revalidate_on` | Cuándo volver a comprobar un dato cambiante |

### 4.3 Catálogo editorial inicial

El catálogo se diseñará por hitos, no como una lista plana.

#### T−28 a T−21

- Comprobar que el pasaporte está vigente durante toda la estancia, en perfecto estado y no figura como anulado.
- Confirmar billete de vuelta y reservas de alojamiento.
- Revisar requisitos de cualquier país de tránsito.
- Registrar el viaje en el Registro de Viajeros de Exteriores.
- Contratar o auditar seguro médico: asistencia, hospitalización, repatriación, exclusiones y teléfono 24 h.
- Revisar medicación habitual con nombre genérico, dosis, receta y restricciones japonesas.
- Consultar un Centro de Vacunación Internacional cuando el perfil médico o el tipo de viaje lo aconseje.
- Reservar trenes, restaurantes premium y actividades con cupo.

Para pasaporte español y turismo de hasta 90 días no se requiere visado; el DNI no sirve como documento de viaje. Debe evitarse presentar esta regla como universal: depende de nacionalidad y propósito. Fuentes: [Exteriores — Japón](https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=japon) y [MOFA — exención de visado](https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html?webview=true).

#### T−20 a T−14

- Completar los datos de entrada y aduanas en Visit Japan Web si se decide utilizarlo.
- Crear copias seguras y accesibles de pasaporte, póliza y reservas.
- Verificar tarjetas, límites, comisiones y efectivo inicial.
- Preparar eSIM/SIM, roaming y teléfonos desbloqueados.
- Probar PWA, actualización, modo avión y contactos de emergencia en ambos móviles.
- Confirmar compatibilidad eléctrica de cada aparato antes de comprar adaptadores o transformadores.
- Diseñar cápsula de ropa según calor, humedad, lluvia, etiqueta y lavandería.

#### T−13 a T−7

- Primera previsión meteorológica útil por etapa, marcada como provisional.
- Lista preliminar de equipaje y reparto de objetos compartidos.
- Descargar billetes, confirmaciones y mapas críticos.
- Confirmar restaurantes premium y sus políticas de cancelación, puntualidad y vestimenta.
- Revisar restricciones de equipaje de vuelos y trenes.
- Configurar conversor con tipo real de tarjeta o efectivo.

#### T−6 a T−2

- Previsión por día y ajustes de ropa.
- Check-in disponible, selección de asientos y tarjetas de embarque.
- Confirmación final de horarios, terminales, traslados y alojamientos.
- Descargar/actualizar todo el contenido offline.
- Preparar líquidos, batería externa, cables, adaptadores y medicación en equipaje de mano.

#### T−1 y salida

- Pasaporte físico, billete, cartera, teléfono y medicación crítica.
- Baterías cargadas y copias offline comprobadas.
- Equipaje pesado, identificado y dentro de límites.
- Datos fronterizos completados y accesibles.
- Casa, llaves y contactos resueltos.

### 4.4 Equipaje y outfits

El sistema no impondrá una lista universal. Generará una plantilla ajustada a:

- 13 días en agosto y ciudades del itinerario;
- calor, humedad, lluvia y aire acondicionado intenso;
- acceso a lavandería;
- caminatas y templos;
- onsen/ryokan y restricciones particulares;
- una posible cena premium;
- compras previstas y espacio de retorno.

Debe incluir conjuntos sugeridos —tránsito, día urbano, lluvia, cena premium y Hakone/ryokan— y no solo prendas aisladas. La ficha premium explicará que la etiqueta depende del restaurante; la app guardará la norma concreta de cada reserva. Como mínimo se evaluará camisa o polo estructurado, pantalón largo apropiado y calzado limpio, sin inventar un código formal donde no exista.

### 4.5 Salud y frontera: tratamiento editorial

- La app no diagnosticará ni prescribirá vacunas.
- Diferenciará «requisito de entrada», «recomendación general» y «recomendación médica individual».
- Las vacunas dependerán de salud, duración y exposición; Sanidad recomienda evaluación personalizada. Para un itinerario urbano corto, su ficha sobre encefalitis japonesa indica que normalmente no es necesaria, sin sustituir consejo clínico. Fuente: [Ministerio de Sanidad — consejos al viajero](https://www.sanidad.gob.es/areas/sanidadExterior/laSaludTambienViaja/consejosSanitarios/consejosViajero.htm).
- La medicación tendrá un aviso destacado: Japón limita cantidades y controla sustancias concretas; algunos medicamentos requieren autorización previa. Fuentes: [MHLW — medicación personal](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iyakuhin/kojinyunyu/topics/tp010401-1_00001.html) y [Japan Customs](https://www.customs.go.jp/english/c-answer_e/sonota/9005_e.htm).
- Aduanas incluirá solo reglas verificadas y un enlace a la declaración oficial. Fuente: [Japan Customs — pasajeros](https://www.customs.go.jp/english/summary/passenger.htm).

## 5. Dominio B — Modo Ahora e itinerario vivo

### 5.1 Vista Ahora

La actual Vista Hoy evolucionará según fase del viaje:

- antes de la salida: preparación;
- en tránsito: siguiente hito, documento y puerta/terminal;
- durante la estancia: actividad actual y siguiente;
- después del día: cierre y preparación del día siguiente.

La tarjeta principal mostrará actividad actual, siguiente actividad, hora de salida recomendada, trayecto, reserva o billete asociado, contexto útil y acciones «Llegamos», «Hecho», «Saltar», «Retrasar» y «Plan B».

### 5.2 Estado compartido

- Estado por actividad: pendiente, en curso, completada, omitida, reprogramada.
- Notas compartidas y cambios de orden.
- Registro de quién cambió qué y posibilidad de deshacer.
- Escritura offline con cola de sincronización.
- Resolución explícita de conflictos si ambos teléfonos editan el mismo elemento.

Esta ampliación contradice el límite actual de backend «solo planificador» y deberá aprobarse como enmienda constitucional antes de desarrollarse.

### 5.3 Plan B

Cada bloque relevante podrá enlazar alternativas verificadas para:

- lluvia o calor extremo;
- cansancio o movilidad reducida;
- retraso;
- cierre o saturación;
- reducción de presupuesto;
- preferencia espontánea por comida o compras.

La selección será determinista y explicable; nunca se presentará como disponibilidad en vivo si no hay una fuente en vivo.

## 6. Dominio C — Guía cultural de profundidad

### 6.1 Objetivo editorial

No se construirá una enciclopedia genérica de Japón, sino una guía cultural aplicada al viaje. Cada artículo responderá:

1. Qué es.
2. Por qué importa.
3. Qué observar durante este itinerario.
4. Cómo comportarse.
5. Qué error evitar.
6. En qué días o lugares resulta útil.

### 6.2 Taxonomía propuesta

#### Cultura cotidiana

- saludo, lenguaje indirecto y cortesía;
- espacio personal, volumen y colas;
- trenes, escaleras, equipaje y asientos prioritarios;
- basura, reciclaje, fumar y comer caminando;
- baños, calzado, casas y tatami;
- pagos, propinas, bandejas y efectivo;
- fotografía y respeto a personas y lugares.

#### Templos, santuarios y memoria

- diferencia entre templo budista y santuario sintoísta;
- torii, temizuya, incienso, ofrendas, ema, omikuji y goshuin;
- comportamiento y fotografía;
- contexto específico de Kioto, Hiroshima y los lugares visitados.

#### Onsen y ryokan

- secuencia completa del baño;
- desnudez, lavado previo, toalla, pelo y tatuajes;
- yukata y comportamiento en el ryokan;
- cena y desayuno kaiseki;
- ficha específica de Mizunoto con incertidumbres confirmadas o visibles.

#### Comer y beber

- uso de palillos y tabúes principales;
- sushi, ramen, soba/udon, tempura, yakitori, tonkatsu, okonomiyaki, kaiseki, izakaya y kissaten;
- cómo se pide, paga y reserva según tipo de local;
- vocabulario visual de menús y máquinas de tickets;
- alergias y restricciones sin prometer ausencia de contaminación cruzada;
- sake, shochu, whisky, cerveza, highball, té y bebidas sin alcohol.

La guía de etiqueta debe partir de fuentes institucionales como [JNTO — modales generales](https://www.japan.travel/en/guide/japanese-manners-dos-and-donts/) y [JNTO — etiqueta gastronómica](https://faq.japan-travel.jnto.go.jp/en/guide/japanese-food-etiquette/), complementadas con fuentes locales reputadas.

#### Cocina por etapa

- Tokio: edomae sushi, tempura, soba, monjayaki y cultura de izakaya.
- Hakone/Kanagawa: cocina de ryokan, productos locales y huevos negros como contexto turístico.
- Kioto: kaiseki, obanzai, yudofu, matcha y wagashi.
- Hiroshima: okonomiyaki de Hiroshima, ostras, anago y momiji manju.
- Osaka: okonomiyaki, takoyaki, kushikatsu, udon y cultura kuidaore.

Cada plato tendrá «qué es», «cómo se come», «variantes», «dónde encaja en el viaje» y restaurantes reales relacionados.

### 6.3 Arquitectura de contenido

Los artículos serán datos estructurados, no JSX: `guide_topics`, `guide_cards`, `regional_foods`, `etiquette_rules` y relaciones con `days`, `pois`, `restaurants` y `cities`. Cada afirmación cambiante incluirá fuente y fecha.

## 7. Dominio D — Directorio gastronómico de 400 establecimientos

### 7.1 Alcance geográfico

El objetivo no es cubrir «todo Japón» indiscriminadamente, sino crear gran densidad donde realmente estarán los viajeros:

| Zona | Objetivo inicial |
|---|---:|
| Tokio | 160 |
| Kioto | 90 |
| Osaka | 70 |
| Hiroshima/Miyajima | 50 |
| Hakone y conexiones útiles | 30 |
| **Total** | **400** |

Las cuotas podrán moverse después de medir cobertura por barrio, día y tipo de cocina.

### 7.2 Cobertura gastronómica mínima

La base debe cubrir, como mínimo:

- sushi/edomae, sashimi y marisco;
- ramen por estilos, tsukemen y abura soba;
- soba, udon y somen;
- yakitori, yakiniku, horumon y teppanyaki;
- tempura, tonkatsu, kushikatsu y karaage;
- okonomiyaki de Osaka e Hiroshima, takoyaki y monjayaki;
- izakaya, tachinomi, yokocho y comida nocturna;
- kaiseki, kappo, ryotei, shojin ryori y obanzai;
- unagi/anago, sukiyaki, shabu-shabu y nabe;
- curry japonés, yoshoku y kissaten;
- desayunos, mercados, depachika, dulces, wagashi y matcha;
- sake, whisky, cerveza artesanal y bares de cócteles;
- opciones vegetarianas, alergias comunicables y necesidades dietéticas, con cautelas verificadas;
- comida rápida excelente y salvavidas sin reserva;
- experiencias premium y restaurantes para ocasiones especiales.

### 7.3 Dos niveles editoriales

#### Nivel A — Top 50 profundo

Fichas completas con:

- identidad oficial y nombre japonés;
- dirección, coordenadas y sucursal inequívoca;
- horario y cierre con fecha de verificación;
- reserva, canal, antelación y cancelación;
- rango de precio fechado;
- especialidad y platos concretos que pedir;
- explicación de por qué esos platos representan el local;
- experiencia, etiqueta y duración;
- accesibilidad idiomática y forma de pago si está verificada;
- relación con día, barrio y trayecto;
- Plan B cercano;
- imagen reutilizable o integración admitida;
- mínimo dos fuentes, una primaria siempre que exista.

#### Nivel B — 350 fichas operativas

Identidad, geografía, cocina, precio orientativo, reserva, horario, «qué pedir», motivo de selección y trazabilidad. No se publicará una ficha si faltan identidad o estado operativo.

### 7.4 Pipeline de investigación y control de calidad

1. **Descubrimiento:** Michelin, JNTO, oficinas turísticas, Tabelog, guías reputadas, prensa local y fuentes temáticas.
2. **Resolución de identidad:** nombre japonés, sucursal, dirección y web oficial.
3. **Verificación operativa:** comprobar que sigue abierto y contrastar horario/reservas.
4. **Lectura gastronómica:** menú oficial y una muestra de reseñas recientes para identificar pedidos recurrentes.
5. **Síntesis original:** explicar qué pedir sin copiar texto protegido ni tratar una opinión aislada como consenso.
6. **Geocodificación:** coordenadas contrastadas y distancia respecto a puntos del viaje.
7. **Revisión automática:** esquema, URLs, duplicados, coordenadas, fechas y cobertura.
8. **Revisión humana:** top 50 completo y muestra estadística de las otras 350.
9. **Revalidación:** top 50 antes de salir; fichas restantes según riesgo y antigüedad.

Cada restaurante llevará `verification_status`, `last_verified_at`, `verified_fields`, `source_count` y `closure_risk`. Un validador fallará si un registro no cumple el mínimo.

### 7.5 Auditoría de los 32 existentes

Antes de ampliar:

- separar establecimientos concretos de mercados, calles o agrupaciones;
- detectar sucursales ambiguas;
- volver a verificar estrellas, horarios, precios, reservas, teléfonos y cierre;
- revisar lenguaje superlativo no demostrable;
- normalizar ciudades, barrios, cocinas y ocasiones;
- comprobar que cada «plato recomendado» procede del menú o de evidencia repetida;
- conservar únicamente las fichas que superen el nuevo contrato.

### 7.6 Política de reseñas

No se copiarán reseñas completas. Se registrarán señales estructuradas y fechadas:

- platos mencionados de forma recurrente;
- fortalezas y fricciones repetidas;
- idioma, colas y dificultad de reserva;
- discrepancias relevantes entre fuentes.

La interfaz dirá «patrón observado en fuentes consultadas», no lo presentará como hecho universal.

### 7.7 Imágenes: decisión de arquitectura

No se descargarán ni copiarán «imágenes de Google» al repositorio. Las políticas de Places restringen el almacenamiento de contenido y exigen atribución al autor y acceso al original: [Google Places — políticas y atribución](https://developers.google.com/maps/documentation/places/web-service/policies).

Orden propuesto para imágenes del top 50:

1. Imagen oficial con permiso/licencia compatible y atribución registrada.
2. Wikimedia Commons u otra fuente con licencia explícita.
3. Fotografía propia durante el viaje.
4. Google Place Photo solicitada en vivo, solo si se aprueba API, facturación, privacidad, atribución y dependencia online.
5. Fallback editorial sin fotografía.

Cada recurso tendrá `source_url`, `author`, `license`, `attribution`, `retrieved_at` y `offline_allowed`. La ausencia de una imagen legal nunca bloqueará una buena recomendación.

### 7.8 Riesgo de escala

Cuatrocientas fichas profundas antes de la salida pueden consumir el tiempo que necesitan los datos críticos. La estrategia será publicar por lotes auditables:

- lote 0: auditoría de 32;
- lote 1: top 50;
- lote 2: 150 de alta relevancia geográfica;
- lote 3: cobertura hasta 250;
- lote 4: cobertura hasta 400.

Ningún lote pasa a producción por alcanzar su cifra; pasa por superar el control de calidad.

## 8. Dominio E — Guía de compras

> **Entregado el 21 de julio de 2026.** El entregable editorial de §8.6 está en `data/shopping_guide.json` + `ShoppingGuideView.jsx` (acceso desde «Más»); detalle completo en `SPEC.md` §7 «Dominio E V2 — Guía de compras». Gotemba (§8.5) se estudió y se descartó explícitamente como ruta del 24 de agosto, con la comparativa de tiempos documentada en la propia guía.

### 8.1 Propósito

La guía no afirmará que algo es una ganga solo por el cambio euro/yen. Calculará o explicará el coste total considerando:

- precio japonés y tipo de cambio fechado;
- tax-free aplicable;
- comisiones de tarjeta o efectivo;
- garantía regional/internacional;
- compatibilidad eléctrica, idioma, bandas o bloqueo regional;
- equipaje, aduana de retorno y riesgo de falsificación;
- posibilidad real de encontrar stock o talla.

### 8.2 Categorías

- moda japonesa y occidental;
- denim y workwear japonés;
- sneakers y streetwear;
- relojes nuevos, vintage y de segunda mano;
- cámaras, audio, electrónica y gaming;
- cuchillos, cerámica y utensilios de cocina;
- papelería, diseño y artículos de viaje;
- cosmética y cuidado personal;
- artesanía, té, sake y regalos;
- segunda mano y coleccionismo.

### 8.3 Tipos de destino

- grandes almacenes y `depachika`;
- tiendas insignia y cadenas especializadas;
- centros de electrónica;
- barrios comerciales;
- outlets;
- tiendas de segunda mano;
- mercados y artesanía local.

JNTO identifica como grandes cadenas, entre otras, Mitsukoshi, Matsuzakaya, Sogo, Takashimaya, Isetan y Matsuya: [JNTO — compras en Japón](https://www.japan.travel/en/guide/shopping-in-japan/). Esto sirve como punto de partida, no como ranking final.

### 8.4 Tax-free y normativa

La guía deberá versionar la normativa porque cambia. Exteriores confirma la devolución en comercios identificados como tax-free, y las reglas concretas deben contrastarse con organismos japoneses y cada comercio. No se prometerá ahorro en marcas o productos excluidos.

Cada ficha incluirá:

- elegibilidad y documentación;
- umbral y tratamiento de consumibles según norma vigente;
- si el trámite ocurre en caja o mostrador;
- comisiones del establecimiento;
- restricciones de uso o apertura;
- obligaciones a la salida y a la entrada en España;
- fecha de verificación.

### 8.5 Día de compras propuesto

El candidato principal es **24 de agosto, día libre total en Tokio**, porque permite comprar al final del viaje sin transportar las compras entre ciudades. Se diseñarán tres rutas alternativas antes de escoger una:

1. **Diseño y grandes almacenes:** Ginza–Yurakucho, aprovechando la ubicación del hotel.
2. **Moda, gadgets y cultura urbana:** Shibuya–Harajuku–Shinjuku.
3. **Outlet de día completo:** solo si el ahorro y las marcas objetivo justifican el desplazamiento.

Gotemba merece estudio por sus aproximadamente 290 tiendas y conexión con Hakone/Tokio, pero no se insertará automáticamente: consume gran parte de un día y puede competir con el itinerario. Fuente: [Gotemba Premium Outlets — acceso](https://www.premiumoutlets.co.jp/en/gotemba/access/train/).

La decisión final se tomará mediante una matriz: marcas deseadas, categorías, ahorro esperado, tiempo puerta a puerta, tax-free, equipaje y coste de oportunidad.

### 8.6 Entregable editorial de compras

- 8–12 fichas de zonas o centros prioritarios.
- 30–50 tiendas concretas verificadas.
- 10 guías de categoría.
- Lista personal de objetivos: imprescindible, oportunidad y solo si hay precio.
- Calculadora «precio final estimado» con advertencias.
- Ruta del 24 de agosto con variantes corta, media y completa.

## 9. Dominio F — Mapas y trayectos

### 9.1 Problemas a resolver

- mapa base visualmente pobre;
- contraste y jerarquía insuficientes;
- rutas representadas por líneas rectas entre POIs;
- ausencia de tramos diferenciados a pie, metro, tren o bus;
- poca relación entre mapa, horario y pasos operativos;
- dependencia online del mapa base.

### 9.2 Experiencia propuesta

#### Mapa de lugar

- pin inequívoco y entrada correcta cuando se conozca;
- estación y salida recomendadas;
- hotel y puntos de referencia cercanos;
- «desde dónde vienes» y «adónde vas después»;
- tarjeta inferior con hora, duración y acción principal.

#### Ruta diaria

- tramos reales, no polilínea recta;
- color e icono por modo de transporte;
- numeración consistente con el itinerario;
- tiempos de traslado y márgenes;
- transbordos y salidas críticas;
- posibilidad de ocultar categorías para mejorar lectura;
- encuadre automático del tramo activo.

#### Navegación

La app no intentará reemplazar navegación turn-by-turn. Conservará instrucciones críticas offline y abrirá la app externa elegida para navegación viva.

### 9.3 Decisión técnica a estudiar

Se compararán dos caminos:

| Opción | Ventaja | Coste/riesgo |
|---|---|---|
| Mejorar Leaflet + rutas GeoJSON | Cambio contenido y compatible con arquitectura actual | Menor calidad vectorial y estilo menos flexible |
| MapLibre + PMTiles | Estilo vectorial rico, zoom fluido y opción offline por regiones | Migración, tamaño, generación y pruebas mayores |

No debe intentarse precachear `tile.openstreetmap.org`: su política prohíbe el uso offline. Fuente: [OSMF — política de teselas](https://operations.osmfoundation.org/policies/tiles/). PMTiles permite servir un archivo estático basado en OpenStreetMap y MapLibre ofrece mejor renderizado vectorial; se hará un prototipo antes de elegir: [Protomaps](https://docs.protomaps.com/) y [PMTiles para Leaflet](https://docs.protomaps.com/pmtiles/leaflet).

### 9.4 Contrato de ruta

Cada tramo tendrá origen, destino, modo, geometría, duración estimada, línea/servicio, dirección, parada o salida, accesibilidad, fuente, fecha y fallback textual. Las rutas sensibles se revisarán manualmente.

## 10. Dominio G — Restaurantes como sistema de decisión

El directorio de 400 alimentará tres experiencias distintas:

### Explorar

Buscar por ciudad, barrio, plato, estilo, presupuesto, reserva, ocasión y restricciones.

### Comer ahora

Ordenar por encaje contextual:

- cercanía al punto actual o siguiente;
- servicio de comida compatible con la hora;
- necesidad de reserva;
- duración disponible;
- presupuesto y experiencia deseada;
- variedad respecto a comidas anteriores.

No se mostrará «abierto ahora» sin dato horario estructurado, zona horaria y fecha de verificación suficientes.

### Plan gastronómico

- asignación al itinerario;
- reserva pendiente/solicitada/confirmada/cancelada;
- localizador y política;
- plato objetivo;
- etiqueta;
- alternativa cercana;
- control de diversidad gastronómica a lo largo del viaje.

## 11. Dominio H — Clima, reservas y alertas

### Clima

- normales históricas para preparar equipaje;
- previsión real cuando entre en horizonte útil;
- última actualización y fuente visibles;
- asociación de lluvia/calor a bloques exteriores;
- propuestas de intercambio, nunca cambios automáticos;
- alertas oficiales de JMA como autoridad.

Una predicción diaria a 28 días no se presentará como fiable. La checklist programará revisiones progresivas y distinguirá climatología de pronóstico.

### Reservas

- estado, fecha límite y responsable;
- confirmación, asiento y política de cancelación;
- evidencia offline sin almacenar secretos en Git;
- tareas automáticas derivadas: reservar, reconfirmar, descargar y hacer check-in.

### Alertas

Las alertas dejarán de duplicar manualmente tareas. Se derivarán, cuando sea posible, de fechas y estados estructurados.

## 12. Modelo de datos conceptual

No se decide aún el número final de ficheros, pero sí las entidades:

```text
Trip ── Days ── Blocks ── RouteLegs
  │       │        ├──── POIs
  │       │        ├──── GuideCards
  │       │        ├──── Restaurants
  │       │        └──── Alternatives
  │       ├──────── WeatherSnapshots
  │       └──────── ShoppingRoutes
  ├── PreparationTasks
  ├── Reservations
  ├── GuideTopics
  ├── Restaurants ── Dishes ── Sources ── MediaRights
  └── ShoppingPlaces ── Brands/Categories ── Sources
```

Todos los dominios compartirán:

- identificadores estables;
- referencias de fuente normalizadas;
- `last_verified_at`;
- nivel de certeza;
- caducidad o fecha de próxima revisión;
- separación entre contenido editorial y estado de usuario.

## 13. Cambios constitucionales que requerirán aprobación

La V2 entra en conflicto deliberado con decisiones del MVP:

1. Lista de equipaje deja de estar fuera de alcance.
2. Previsión meteorológica integrada deja de estar fuera de alcance.
3. Estado compartido supera el backend limitado al planificador.
4. Posible API de fotos o clima contradice «sin claves de pago».
5. Un mapa vectorial offline puede requerir cambiar la arquitectura Leaflet/tiles.
6. Documentos y datos de preparación exigen una política de privacidad nueva.

La Constitución no se modificará hasta escoger opciones y recibir autorización expresa.

## 14. Plan por fases y puertas de aprobación

### Fase 0 — Auditoría y decisiones

Entregables:

- auditoría de datos actuales;
- inventario de fuentes;
- decisión de privacidad;
- prototipo comparativo de mapas;
- decisión de APIs y presupuesto;
- esquema definitivo de datos;
- enmienda constitucional propuesta.

**Puerta A:** aprobación de arquitectura y reglas editoriales.

### Fase 1 — Preparación crítica

- checklist y cuenta atrás;
- tareas reales hasta el 13 de agosto;
- documentación, salud, medicación, frontera, equipaje y outfits;
- reservas conectadas con tareas;
- funcionamiento compartido/offline definido.

**Puerta B:** revisión de contenido sensible y prueba en ambos móviles.

### Fase 2 — Profundidad editorial

- guía cultural;
- guía gastronómica por platos y regiones;
- guía de compras;
- diseño del día 24;
- top 50 restaurantes.

**Puerta C:** revisión editorial humana.

### Fase 3 — Inteligencia operativa

- Modo Ahora;
- itinerario vivo;
- planes alternativos;
- restaurante «Comer ahora»;
- clima contextual.

**Puerta D:** simulación completa de varios días.

### Fase 4 — Escala gastronómica y cartográfica

- lotes progresivos hasta 400 restaurantes;
- rutas y mapas enriquecidos;
- revalidación completa previa al viaje.

**Puerta E:** congelación de contenido, verificación y build offline.

### V2.1 posterior

- diario automático;
- recorrido real opcional;
- exportación del viaje;
- mejoras no críticas detectadas en uso real.

## 15. Prioridad sugerida con 28 días disponibles

| Orden | Trabajo | Motivo |
|---:|---|---|
| 1 | Preparación y reservas reales | Riesgo inmediato y fechas límite |
| 2 | Auditoría de los 32 restaurantes | Evita conservar errores y define el estándar |
| 3 | Guía cultural/gastronómica esencial | Alto valor durante todo el viaje |
| 4 | Top 50 restaurantes profundos | Máximo impacto y manejabilidad |
| 5 | Modo Ahora básico | Conecta lo ya existente |
| 6 | Guía de compras + día 24 | Requiere decisiones personales |
| 7 | Mejora cartográfica por tramos críticos | Priorizar rutas difíciles, no todas por igual |
| 8 | Ampliación 150 → 250 → 400 | Escalar sin saltarse controles |

La cifra de 400 y una migración cartográfica completa son los elementos con mayor riesgo de calendario. Si compiten con la verificación de billetes, medicación, top 50 o rutas críticas, estos últimos tienen prioridad.

## 16. Criterios de aceptación globales

### Contenido

- 100 % de entidades reales con fuente accesible.
- 100 % de datos críticos con fecha de verificación.
- Cero URLs fabricadas.
- Cero textos copiados de guías o reseñas.
- Cero imágenes sin procedencia y derechos documentados.

### Restaurantes

- Cero duplicados o entidades genéricas disfrazadas de restaurante.
- Top 50 con doble fuente y «qué pedir» trazable.
- Todas las fichas con sucursal, geografía y estado operativo inequívocos.
- Cobertura equilibrada por barrio, cocina, precio, ocasión y reserva.

### Operación

- Datos críticos accesibles en dos toques y offline.
- Estado compartido consistente o degradación local claramente indicada.
- Toda información volátil muestra fecha y fuente.
- Plan B disponible para los bloques críticos.

### Calidad técnica

- Validación de esquemas, referencias, URLs, coordenadas, derechos de imagen y duplicados.
- Pruebas de modo avión y actualización en los dos dispositivos.
- Presupuesto de tamaño definido para mapas e imágenes.
- Ninguna clave privada incluida en el cliente o repositorio.

## 17. Decisiones del propietario — Puerta A RESUELTA (15 jul 2026)

Respuestas de Daniel, registradas literalmente en su intención:

1. **Datos personales:** sin almacenar. La app nunca guarda documentos (pasaporte, póliza, recetas) en ningún soporte — ni Git, ni servidor, ni dispositivo. Solo estados de verificación («hecho ✓») en localStorage.
2. **APIs de pago:** cero. Se mantiene la regla de la Constitución: nada que pueda romperse o facturar durante el viaje. Clima/fotos solo desde fuentes gratuitas sin clave o contenido estático fechado.
3. **Compras — intereses:** denim, relojes, cámaras y cuchillos, y en general todas las categorías propuestas («todo»). La guía de compras cubre el espectro completo con esas cuatro como prioritarias.
4. **Día de compras:** sin fijar. Se diseñan las rutas como opciones y se elige **el día que mejor encaje según la situación** (el 24 de agosto sigue siendo el candidato natural por ser día libre completo en Tokio, pero no es una decisión cerrada).
5. **Comida:** sin restricciones ni alergias.
6. **Cena premium:** descartada por precio — «irse a un Michelin es mucha pasta». La cena de despedida del 24 queda **abierta**: volver al favorito del viaje o improvisar. Las fichas Michelin de la base se conservan como referencia editorial, no como plan.
7. **Calidad vs. cantidad:** aprobada la rebaja de 400 → Top 50 profundo + ~150 operativas con revisión más profunda.
8. **Ruta del 24 de agosto:** sin preferencia cerrada; ver punto 4 — se decidirá sobre el terreno con las variantes diseñadas.

## 18. Próximo paso, sujeto a autorización

Tras aprobar este plan, el siguiente trabajo no será programar pantallas. Será producir tres documentos de ejecución:

1. **Contrato editorial y de fuentes**, con campos obligatorios y ejemplos válidos/no válidos.
2. **Especificación de datos y privacidad**, con migraciones y estado compartido.
3. **Backlog ejecutable**, dividido en entregas, estimaciones, dependencias y pruebas.

Solo después de aprobar esos documentos comenzará la implementación.

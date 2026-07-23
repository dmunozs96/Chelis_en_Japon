# SPEC — Ampliación gastronómica de 62 a 200 fichas

> Responsable de ejecución: Claude Code  
> Estado inicial obligatorio: 62 fichas publicadas  
> Alcance: investigar y añadir 138 restaurantes, sin modificar las 62 fichas existentes salvo corrección demostrable  
> Regla principal: 200 es un objetivo de cobertura, nunca una licencia para rellenar

## 1. Objetivo de producto

La guía debe ayudar a decidir **dónde merece la pena comer** durante el viaje, no limitarse a listar negocios con datos fáciles de obtener. Cada alta debe responder de forma útil y concreta a estas preguntas:

1. ¿Qué tipo de cocina hace y cuál es su especialidad real?
2. ¿Por qué escoger este sitio frente a otros de la misma zona?
3. ¿Qué platos concretos conviene pedir y por qué?
4. ¿Cuándo se puede ir de verdad?
5. ¿Hace falta reservar, se puede reservar o funciona por cola?
6. ¿Qué precio por persona cabe esperar?
7. ¿La ubicación y sucursal están inequívocamente identificadas?

La calidad editorial y factual debe igualar la de las mejores fichas de las primeras 62. Queda prohibida cualquier categoría de ficha “ligera”, “operativa” o de menor calidad.

## 2. Alcance y cupos

Estado inicial comprobado:

| Ciudad | Base | Objetivo | Altas |
|---|---:|---:|---:|
| Tokio | 26 | 72 | 46 |
| Kioto | 15 | 46 | 31 |
| Osaka | 14 | 46 | 32 |
| Hiroshima | 6 | 31 | 25 |
| Hakone | 1 | 5 | 4 |
| **Total** | **62** | **200** | **138** |

Hakone se limita a cuatro altas: el itinerario pasa menos días y solo contempla una comida. No se debe inflar esa ciudad para cuadrar cifras.

## 3. Principio de selección

La selección se basa primero en la comida y después en la facilidad de documentación.

Orden de decisión:

1. calidad, singularidad o relevancia gastronómica;
2. utilidad para el itinerario real y cobertura geográfica;
3. diversidad de cocina, precio, franja y sistema de acceso;
4. vigencia y posibilidad de verificar la información;
5. popularidad general, solo como señal secundaria.

Tener una web completa, aparecer en Tabelog o disponer de menú en inglés **no convierte por sí solo** a un restaurante en una buena recomendación. Google Maps puede usarse para descubrir candidatos y contrastar ubicación, pero no para copiar texto de reseñas.

### 3.1 Cobertura funcional

Tokio, Kioto y Osaka deben incluir:

- especialidades locales y japonesas;
- opciones excelentes de menos de ¥2.000 y de ¥2.000–6.000;
- comida rápida de calidad y restaurantes para sentarse;
- suficientes opciones sin reserva;
- cenas informales y ocasiones especiales;
- desayuno, café o dulce solo cuando encaje en el itinerario;
- cobertura de los barrios realmente visitados, estaciones y hoteles;
- alternativas para lluvia, cansancio, llegada tardía o comida fuera de hora.

Hiroshima debe equilibrar okonomiyaki con anago, ostras, ramen/noodles, izakaya, pescado y opciones cercanas a la estación y al Parque de la Paz.

No se fijan cuotas artificiales por tipo de cocina. Se rechazarán duplicados que no aporten una ventaja concreta.

## 4. Investigación obligatoria por restaurante

Cada candidato pasa por una investigación individual. No se admite generar 138 fichas desde un scraping y “pulirlas” después con plantillas.

### 4.1 Fuentes y precedencia

Usar, por orden:

1. web oficial del establecimiento o del grupo, en la página exacta de la sucursal;
2. sistema oficial de reservas o perfil oficial enlazado por el restaurante;
3. Tabelog japonés de la sucursal;
4. Google Maps para identidad, puerta, coordenadas y comprobación de actividad;
5. Michelin, JNTO, oficinas de turismo o prensa gastronómica fiable para contexto;
6. otras fuentes secundarias solo como apoyo.

Mínimo: dos fuentes por ficha. Siempre que exista, una debe ser oficial. La portada genérica de una cadena no acredita una sucursal.

No usar como hechos editoriales:

- snippets del buscador sin abrir la fuente;
- texto de reseñas individuales;
- agregadores SEO;
- blogs sin fecha para horarios, cierres o reservas;
- datos de otra sucursal;
- inferencias basadas únicamente en fotografías.

### 4.2 Evidencia mínima

Antes de redactar, registrar evidencia para:

- identidad y nombre japonés;
- estado abierto/cerrado;
- sucursal y dirección;
- coordenadas de la puerta;
- cocina y especialidad;
- uno o dos platos recomendables;
- horario por servicio;
- cierres regulares e irregulares;
- política exacta de reserva;
- precio por persona;
- URLs y fecha de consulta.

Si identidad, estado o ubicación no se pueden confirmar, el candidato se descarta. Si otro campo esencial es incierto, no se inventa: se describe la incertidumbre y la ficha queda fuera de publicación hasta resolverla.

## 5. Contrato editorial

Toda la información visible al viajero debe estar escrita en español natural. Se pueden conservar nombres japoneses o términos culinarios originales cuando aporten precisión, explicándolos la primera vez.

### 5.1 `cuisine_description`

Debe explicar en 2–4 frases:

- la cocina concreta;
- la técnica, producto o formato distintivo;
- la especialidad principal;
- información práctica gastronómica si cambia la experiencia.

No debe mencionar la investigación, las fuentes, “la ficha”, “el establecimiento” como relleno ni la disponibilidad genérica de datos.

### 5.2 `why_special`

Debe contestar por qué este restaurante merece estar en la selección. Incluir al menos un rasgo diferenciador comprobado: producto, técnica, historia, chef, especialidad local, reconocimiento vigente, relación calidad-precio o utilidad excepcional.

No basta con afirmar que es “una opción contrastada”, “muy valorada”, “auténtica” o “popular”.

### 5.3 `what_to_order`

Incluir uno o dos platos reales y disponibles en esa sucursal.

Cada elemento necesita:

- `dish`: nombre comprensible en español; puede conservar el japonés entre paréntesis;
- `why`: qué es, cómo se diferencia o por qué pedirlo;
- `source_url`: página exacta de menú, web oficial o fuente que demuestre el plato.

Son inválidos como plato: “Course”, “Dish”, “Our Recommendation”, “A la carte”, “6 Pieces”, texto sobre precios, instrucciones de reserva o encabezados de menú.

Es inválido como explicación: “plato publicado en el menú”, “confirma la especialidad”, “según la ficha” o cualquier frase que describa el proceso de verificación en vez de la comida.

### 5.4 Horarios

`hours` debe ser una síntesis en español y formato de 24 horas. Debe separar almuerzo, cena u otras franjas cuando corresponda, e incluir último pedido solo si es relevante.

`closed_days` contiene únicamente cierres semanales regulares, en español. Un cierre del segundo martes del mes no convierte todos los martes en cierre semanal: se conserva como nota en `hours` y aumenta `closure_risk`.

No copiar bloques completos de Tabelog. Eliminar avisos caducados, horarios históricos y texto legal que no ayude a planificar.

### 5.5 Reserva

Distinguir sin inferencias:

- `true`: reserva obligatoria o servicio exclusivamente con reserva;
- `"recommended"`: se admite sin reserva, pero una fuente o la operativa real justifican reservar;
- `"optional"`: acepta reservas, pero no hay evidencia para calificarlas de recomendables;
- `false`: no admite reserva o el acceso normal es por orden de llegada.

“Reservations available” significa que se puede reservar, no que sea recomendable. Una URL del restaurante no debe mostrarse como “Reservar” salvo que lleve a un canal real de reserva.

`must_book_in_advance` solo puede ser `true` cuando existe evidencia de antelación obligatoria o apertura limitada de cupos.

### 5.6 Dirección, etiquetas y nombres

- `neighborhood` debe ser una dirección o referencia de zona legible, no un bloque japonés sin contexto.
- `name_ja` se copia de una fuente japonesa; nunca se translitera de memoria.
- las etiquetas internas usan valores normalizados;
- la interfaz debe presentar etiquetas traducidas y legibles en español;
- nombres propios y términos como ramen, soba, udon, wagashi u omakase no se traducen de forma forzada.

## 6. Modelo de datos obligatorio

Cada alta debe respetar el esquema existente y completar:

```json
{
  "id": "city_serial_slug",
  "name": "Nombre inequívoco de la sucursal",
  "name_ja": "Nombre oficial japonés",
  "city": "Tokyo | Kyoto | Osaka | Hiroshima | Hakone",
  "neighborhood": "Dirección o zona legible",
  "lat": 0,
  "lng": 0,
  "entity_type": "restaurant",
  "cuisine_tags": ["tag_normalizado"],
  "cuisine_description": "Texto editorial gastronómico",
  "why_special": "Motivo concreto para elegirlo",
  "what_to_order": [
    {
      "dish": "Plato real",
      "why": "Explicación gastronómica útil",
      "source_url": "https://..."
    }
  ],
  "price_per_person_yen": "¥...",
  "price_tier": 1,
  "hours": "Horario sintetizado en español y 24 h",
  "closed_days": ["Lunes"],
  "meal_types": ["lunch"],
  "reservation_required": false,
  "reservation_how": "walk_in_only",
  "reservation_url": null,
  "phone": null,
  "walk_in_friendly": true,
  "good_for": ["casual"],
  "must_book_in_advance": false,
  "sources": [
    {
      "name": "Fuente concreta",
      "url": "https://...",
      "source_type": "official",
      "accessed_at": "AAAA-MM-DD"
    }
  ],
  "verification_status": "verified",
  "last_verified_at": "AAAA-MM-DD",
  "revalidate_on": "AAAA-MM-DD",
  "verified_fields": [
    "identity",
    "operating_status",
    "location",
    "hours",
    "closed_days",
    "reservation_policy",
    "price",
    "menu"
  ],
  "closure_risk": "low",
  "source_count": 2
}
```

`price_tier`, `meal_types`, `walk_in_friendly` y otros derivados deben revisarse contra los datos reales; no se obtienen con heurísticas ciegas.

## 7. Método de ejecución

### Fase A — inventario y matriz de cobertura

1. Leer las 62 fichas actuales y el itinerario.
2. Crear una matriz de huecos por ciudad, barrio, franja, precio, cocina y acceso.
3. Proponer un pool de candidatos mayor que el cupo.
4. Eliminar duplicados, sucursales inútiles, negocios cerrados y recomendaciones sin valor diferencial.

Entregable: lista de candidatos con una frase de justificación gastronómica por candidato. Todavía no se modifica la base publicada.

### Fase B — investigación en lotes

Trabajar en lotes máximos de 10 fichas. Para cada lote:

1. investigar individualmente;
2. guardar evidencia estructurada;
3. redactar a partir de esa evidencia;
4. ejecutar validadores;
5. revisar visualmente las tarjetas;
6. corregir el lote antes de iniciar el siguiente.

No acumular 138 fichas sin revisión intermedia. No usar una plantilla textual común para todo el lote.

### Fase C — integración

Solo se incorporan a `restaurants_db.json` las fichas que superan el gate. Una candidata rechazada se sustituye por otra; nunca se rebaja el estándar para alcanzar el total.

### Fase D — auditoría final

Auditar las 138 altas, no una muestra, para los campos automáticos. Revisar editorialmente al menos todas las fichas mediante lectura y, además, una muestra visual estratificada de cinco por ciudad —las cuatro de Hakone— que cubra distintos precios y cocinas.

## 8. Gates automáticos

Ampliar `scripts/validate-data.mjs` y sus tests para impedir:

- menos de dos fuentes o `source_count` incoherente;
- ausencia de fuente oficial cuando se declara que existe;
- nombres, coordenadas o URLs duplicados;
- coordenadas fuera de la ciudad o de la puerta indicada;
- `name_ja` vacío en fichas publicadas;
- etiquetas, horarios o días de cierre visibles en inglés;
- formato AM/PM;
- platos genéricos o encabezados de menú;
- textos duplicados entre restaurantes;
- descripciones o motivos con metatexto;
- horarios incoherentes con `meal_types`;
- reservas “recomendadas” derivadas solo de que existe un canal;
- enlace rotulado “Reservar” que no sea un canal real;
- fichas marcadas `verified` sin todos los grupos esenciales;
- URLs de plato que no pertenecen al restaurante o sucursal;
- cualquier texto prohibido de la lista siguiente.

Patrones prohibidos, sin distinguir mayúsculas:

```text
la ficha
opción contrastada
plato publicado
confirma la especialidad
información oficial
fuentes enlazadas
según nuestros datos
establecimiento de
check with the restaurant
business hours
reservations available
```

El validador debe aceptar 62 durante la fase de trabajo y exigir exactamente 200 únicamente al activar un flag explícito de release, por ejemplo `RESTAURANTS_RELEASE_TARGET=200`.

## 9. Revisión visual obligatoria

En escritorio y móvil comprobar:

- no aparece inglés residual;
- las etiquetas son españolas y legibles;
- la dirección no domina la cabecera;
- horario y cierres no se contradicen;
- el estado de reserva y el CTA coinciden;
- los textos no son repetitivos ni parecen generados por plantilla;
- “Qué pedir” explica comida real;
- no hay desbordamientos ni bloques absurdamente largos.

Guardar capturas de las muestras revisadas como evidencia de QA.

## 10. Ejemplo de calidad mínima

### Rechazado

> Aporta una opción contrastada de cafetería y dulces japoneses. La ficha cruza identidad, coordenadas, teléfono, horario, precio y carta.

> Amazake — Plato publicado en el menú individual del establecimiento; confirma la especialidad disponible.

Falla porque habla de la ficha y de la verificación, no del restaurante ni de la comida.

### Aceptable — Amazake Chaya

`cuisine_description`:

> Casa de té histórica del antiguo Tokaido, especializada en amazake y dulces japoneses sencillos. Su amazake se elabora con koji de arroz, sin azúcar añadido y sin alcohol; se acompaña bien con el mochi tostado de la casa.

`why_special`:

> Es una parada gastronómica con identidad propia en Hakone, no una cafetería genérica: conserva el formato de chaya de camino y sirve una bebida tradicional ligada al trayecto del Tokaido. Encaja especialmente bien como descanso breve antes o después del paso por el lago.

`what_to_order`:

- Amazake: bebida caliente de arroz fermentado con dulzor natural, sin alcohol ni azúcar añadido.
- Chikara mochi estilo isobe: mochi tostado con salsa de soja y alga nori, contraste salado para acompañar el amazake.

`hours`: `Todos los días, 07:00–17:30; último pedido 17:00.`

`closed_days`: `[]`

`reservation_required`: `false`

No copiar este texto como plantilla para otros locales.

## 11. Definición de terminado

El trabajo solo está terminado cuando:

1. existen exactamente 200 fichas, con los cupos de la sección 2;
2. las 138 altas han sido investigadas individualmente;
3. cada ficha supera todos los gates factuales y editoriales;
4. no queda inglés visible salvo nombres propios inevitables;
5. no hay metatexto ni explicaciones genéricas de platos;
6. los validadores y sus tests pasan;
7. el build del cliente pasa;
8. la revisión visual está documentada;
9. el diff no modifica accidentalmente las 62 fichas originales;
10. el commit final incluye la base, validadores, tests y evidencia de QA.

Si no se cumplen los diez puntos, el estado correcto es “en curso”, no “200 completados”.

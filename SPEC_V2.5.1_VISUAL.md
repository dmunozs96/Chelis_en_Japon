# V2.5.1 — Especificación visual “Grand Tour”

> Estado: **aprobada para ejecución** · 23 de julio de 2026  
> Producto: Chelis en Japón · guía privada para dos viajeros  
> Viewport maestro: 390 × 844 px  
> Dirección: lujo editorial japonés + precisión aeronáutica  
> Objetivo declarado por el propietario: una aplicación extraordinariamente bonita, emocionante y apetecible de usar  
> Supuesto operativo: SIM con datos ilimitados durante todo el viaje  

---

## 0. Autoridad y relación con V2.5

Esta especificación gobierna la evolución visual V2.5.1.

Cuando exista conflicto, prevalece sobre:

1. `V2.5_ART_DIRECTION.md`;
2. `SPEC_V2.5_VISUAL.md`;
3. los presupuestos visuales y de peso de `V2.5_IMPLEMENTATION_PLAN.md`;
4. los presupuestos visuales y de peso de `V2.5_EXECUTION_PLAYBOOK.md`.

No sustituye:

- `CONSTITUTION.md` para veracidad, seguridad y contenido no inventado;
- `SPEC.md` para comportamiento funcional;
- los datos reales del viaje;
- accesibilidad, reduced motion, estados de error y offline crítico.

### Cambio de doctrina

V2.5 buscó precisión mediante contención. Fue una corrección necesaria frente a la interfaz anterior, pero limitó en exceso la emoción:

- máximo una joya por viewport;
- solo tres ceremonias;
- fotografía muy contenida;
- límites rígidos de peso;
- casi toda la interfaz sobre una misma tinta;
- movimiento reducido a entradas discretas.

V2.5.1 conserva la disciplina y elimina la autocensura.

La regla nueva no es “añadir más”. Es:

> **Cada pantalla debe tener una composición, una atmósfera y una respuesta propias, dentro de un sistema común.**

---

## 1. North star

La app debe sentirse como un objeto privado encargado para este viaje: parte libro de viaje de gran formato, parte instrumento de navegación de alta precisión y parte lounge nocturno.

La referencia emocional combina dos cualidades:

- **Rolls-Royce:** tactilidad, silencio, materiales, detalle, sensación de encargo;
- **avión de combate:** información inmediata, jerarquía exacta, velocidad y confianza operativa.

No se copiarán interfaces de automóvil o aviación. No habrá salpicaderos, fibra de carbono falsa, HUD verde, tornillos, velocímetros ni cromados decorativos.

### Frase de producto

**Japón, editado para vosotros.**

### Mandato visual del propietario

V2.5.1 es **visual-first**. La fotografía, la composición, la luz, el color y el movimiento no son una capa decorativa ni una recompensa reservada a tres pantallas: forman la interfaz principal.

Esto implica:

- más fotografía en todas las áreas de descubrimiento;
- imágenes de mayor tamaño y mejor calidad;
- más variedad compositiva entre pantallas;
- más profundidad y materialidad;
- más momentos premium durante el uso normal;
- menos listas de texto indiferenciadas;
- menos fondos negros vacíos;
- menos dependencia de divisores como único recurso jerárquico.

La aplicación debe seguir siendo rápida de entender, pero no tiene que parecer ligera, austera o minimalista por obligación. Entre una solución meramente eficiente y otra claramente más bella, se elige la más bella siempre que la operación crítica siga siendo inmediata.

### Test de los ocho segundos

Tras ver una captura durante ocho segundos, una persona debe poder decir:

1. que es una guía de Japón;
2. que está hecha para un viaje concreto;
3. que contiene información real y operativa;
4. que es un producto premium;
5. que no parece una plantilla ni una app turística genérica.

### Test de deseo

La interfaz solo está terminada si provoca al menos tres de estas conductas:

- abrirla sin necesidad operativa inmediata;
- recorrer días futuros por placer;
- enseñar la app a otra persona;
- volver a una ficha por su presentación, no solo por sus datos;
- sentir anticipación antes del viaje;
- confiar en ella bajo presión durante el viaje.

---

## 2. Diagnóstico honesto del estado actual

### 2.1 Lo que V2.5 resolvió bien

- Paleta tinta, marfil y torii reconocible.
- Información operativa legible.
- Tipografía Inter Tight / Inter coherente.
- RouteLine propia y útil.
- Fotografías diarias vinculadas al itinerario.
- Billetes claros y fáciles de consultar.
- Navegación compacta.
- Menos cards arbitrarias que en versiones anteriores.
- Buen comportamiento móvil y ausencia de scroll horizontal.

Estas decisiones se conservan.

### 2.2 Por qué todavía no apetece usarla

#### A. Demasiado negro indiferenciado

Header, fondo, listas, documentos y navegación viven casi siempre en valores muy próximos. La interfaz es consistente, pero las pantallas no tienen temperatura ni memoria propias.

#### B. La fotografía existe, pero no construye un sistema

Los nuevos heroes diarios mejoran mucho la ruta, pero:

- no existe continuidad entre miniatura, hero, mapa y POI;
- todas las fotos reciben prácticamente el mismo tratamiento;
- no hay dirección de crop por día;
- las pantallas no toman color o luz de la imagen;
- la fotografía desaparece por completo en áreas como Restaurantes, Más y Billetes.

#### C. La composición es correcta, no memorable

Muchos layouts siguen la secuencia:

`eyebrow → título → párrafo → divisor → filas`.

Funciona, pero repetido en toda la aplicación genera monotonía.

#### D. Falta recompensa al tocar

Los controles cambian de estado, pero no transmiten:

- continuidad espacial;
- confirmación física;
- sensación de abrir una pieza;
- progreso;
- descubrimiento.

#### E. “Más” parece un menú de ajustes

Es funcional, pero no vende las capacidades de la app. Billetes, clima, frases, compras y cultura aparecen como filas equivalentes. No existe curiosidad ni jerarquía emocional.

#### F. Restaurantes parece una base de datos

Tiene buen contenido, pero su presentación prioriza controles y texto:

- demasiada interfaz antes de ver comida o lugares;
- la lista no crea apetito;
- no diferencia una cena especial de un bocado rápido;
- no hay narrativa de barrio, cocina o momento del día;
- el planificador carece de ceremonia.

#### G. Billetes es preciso pero estático

La pantalla comunica fiabilidad, pero puede elevarse con:

- estado temporal real;
- una tarjeta protagonista más material;
- acceso inmediato a la acción correcta;
- transición de “documento” a “modo embarque”;
- confirmación de copiado y estado resuelto más sofisticados.

#### H. La app no cambia suficientemente con el viaje

Antes, durante y después del viaje deberían sentirse como tres ediciones del mismo producto. Hoy cambian los datos, pero no la atmósfera global.

---

## 3. Principios V2.5.1

### P1 — Belleza antes de austeridad

Si una fotografía, una fuente, una transición o una textura mejoran de forma clara la experiencia, se incorporan. El peso solo es un problema si causa espera perceptible, bloqueo o inestabilidad.

### P1b — Densidad visual premium

Una pantalla premium no se consigue dejando grandes áreas vacías por sistema. El espacio negativo sigue siendo una herramienta, pero debe convivir con:

- fotografía;
- capas de profundidad;
- composiciones editoriales;
- información contextual;
- detalles materiales;
- ritmo entre escalas.

Los primeros dos viewports de una pantalla principal no pueden ser únicamente texto, controles y divisores salvo en emergencias o documentos puramente operativos.

### P2 — Espectáculo con jerarquía

Puede haber varias capas bellas en un viewport, pero solo un protagonista. Luz, textura, fotografía y motion deben apuntar al mismo foco.

### P3 — Variación dirigida

Las pantallas no comparten una plantilla rígida. Comparten tokens, materiales, motion y lenguaje; la composición cambia según la tarea.

### P4 — El viaje modifica la interfaz

La app tiene tres estados globales:

- **Anticipación:** deseo, preparación y countdown.
- **En ruta:** tiempo, posición, siguiente acción y energía.
- **Regreso:** cierre sobrio y archivo operativo.

### P5 — Lo operativo es lo más valioso

La capa espectacular nunca retrasa:

- abrir un billete;
- ver un localizador;
- encontrar el hotel;
- abrir el mapa;
- consultar una emergencia;
- leer el siguiente paso.

### P6 — Materiales, no cajas

Se amplía el sistema de superficies:

- tinta profunda;
- cristal ahumado;
- papel cálido;
- aluminio oscuro;
- fotografía;
- luz localizada.

Cada material tiene un uso semántico. No se usan por decoración aleatoria.

### P7 — Continuidad

Cuando el usuario toca una foto, un día, un POI o un documento, el destino debe sentirse relacionado con el origen mediante posición, color, imagen o movimiento.

### P8 — Personalización sustantiva

La belleza procede de:

- fechas y ruta reales;
- fotografías de cada día;
- nombres de hoteles, vuelos y trenes;
- ciudades y coordenadas;
- restaurantes elegidos;
- estado de preparación;
- hora real;
- clima y contexto del día cuando estén disponibles.

### P9 — Lujo silencioso, no ostentación

Prohibido:

- glow permanente alrededor de todo;
- dorado indiscriminado;
- partículas decorativas continuas;
- gradientes arcoíris;
- pseudo-3D plástico;
- iconografía cyberpunk;
- exceso de blur;
- animar cada elemento;
- sonido automático.

### P10 — La calidad vive en el comportamiento

Loading, error, offline, vacío, texto largo y reduced motion deben tener el mismo nivel de diseño que el estado ideal.

---

## 4. Nueva identidad visual

### 4.1 Paleta base

| Token | Valor inicial | Uso |
|---|---:|---|
| `--obsidian` | `#070809` | fondo exterior y escenas |
| `--ink` | `#0D0E10` | fondo principal |
| `--graphite` | `#151619` | superficie mate |
| `--smoke` | `#1D1F22` | cristal y controles |
| `--titanium` | `#A6A39D` | detalle técnico |
| `--ivory` | `#F3EEE5` | texto y papel |
| `--ivory-muted` | `#CFC8BC` | texto secundario |
| `--stone` | `#85827C` | metadata |
| `--torii` | `#E7002D` | firma y acción |
| `--moss` | `#799078` | confirmado |
| `--amber` | `#D9A357` | pendiente |
| `--danger` | `#DF5D5D` | peligro |
| `--champagne` | `#C5AE83` | inscripción premium muy limitada |
| `--sky` | `#8EACC3` | información de clima o aire |

### 4.2 Color atmosférico por etapa

Cada día obtiene un color ambiental derivado manualmente de su fotografía:

- Tokio nocturno: rojo profundo / azul acero.
- Yanaka: madera / té.
- Hakone: azul lago / verde mineral.
- Kioto: vermellón / ámbar.
- Arashiyama: verde bambú / oro.
- Hiroshima: gris agua / cobre tenue.
- Osaka: magenta eléctrico / naranja.
- Vuelo: azul cabina / amanecer.

El color ambiental puede aparecer en:

- luz de fondo del hero;
- borde activo;
- indicador del día;
- skeleton de imagen;
- transición entre días;
- mapa o sheet relacionado.

No sustituye el rojo torii como marca.

### 4.3 Materiales

#### Tinta

Base silenciosa para lectura larga y cronologías.

#### Cristal ahumado

Solo para elementos flotantes:

- bottom nav;
- acciones sobre fotografía;
- controles de mapa;
- sheets;
- HUD “Ahora”.

Debe mostrar profundidad real mediante contraste, blur contenido y borde óptico.

#### Papel cálido

Para piezas que deben sentirse guardables o documentales:

- billete activo;
- reserva especial;
- briefing;
- tarjeta “enséñale esto”.

No se aplica a páginas completas.

#### Aluminio oscuro

Para herramientas precisas:

- conversor;
- clima;
- controles de ruta;
- estados técnicos.

Usa líneas finas, números tabulares y reflejo localizado.

### 4.4 Luz

Se permiten hasta dos fuentes coordinadas por viewport:

1. luz derivada de fotografía o estado;
2. filo funcional en el elemento activo.

La luz nunca rodea todas las cards.

### 4.5 Textura

Se permite:

- grano fotográfico fino;
- ruido dither muy sutil;
- papel;
- tramado técnico en mapas/documentos.

La textura debe desaparecer en `prefers-contrast: more`.

---

## 5. Tipografía

### 5.1 Sistema

- Display/UI: `Inter Tight Variable`.
- Cuerpo/datos: `Inter Variable`.
- Editorial premium: `Newsreader Variable`.
- Japonés: `Noto Serif JP` para títulos confirmados y `Noto Sans JP` para UI.

V2.5.1 autoriza mezclar las rutas técnica y editorial con contratos estrictos.

### 5.2 Contratos

`Newsreader` solo se usa en:

- frase de portada;
- briefing;
- lead de POI;
- restaurante destacado;
- cierre del viaje.

Inter Tight conserva:

- navegación;
- títulos operativos;
- horas;
- estaciones;
- vuelos;
- herramientas;
- listas.

### 5.3 Escala ampliada

| Estilo | Tamaño / línea | Uso |
|---|---:|---|
| `cinema` | `72–112 / .82` | countdown o número de día |
| `hero` | `40–52 / .96` | título de escena |
| `editorial` | `32–40 / 1.02` | frase/lead |
| `page` | `30–36 / 1.05` | página |
| `section` | `21–25 / 1.15` | sección |
| `row` | `16–18 / 1.25` | fila |
| `body-lg` | `17–19 / 1.55` | lead |
| `body` | `15–16 / 1.5` | cuerpo |
| `meta` | `11–13 / 1.35` | metadata |
| `micro` | `9–10 / 1.4` | inscripción |

### 5.4 Números

Horas, precios, puertas, asientos, cuenta atrás y distancias:

- `tabular-nums`;
- kerning óptico;
- unidades más pequeñas;
- nunca partir en dos líneas;
- animación de cambio solo cuando aporta contexto.

---

## 6. Fotografía y vídeo

### 6.1 Biblioteca

Se crea una biblioteca curada con:

- 13 heroes diarios definitivos;
- 40–60 fotografías de POIs, barrios y escenas culturales;
- 30–50 fotografías de restaurantes, platos, barras y escenas gastronómicas;
- 10–15 fotografías de hoteles, habitaciones, onsen y entornos;
- 10–15 fotografías de aeropuertos, estaciones, Shinkansen, Romancecar y trayectos;
- 15–25 fotografías de compras, objetos, tiendas y producto;
- 8–12 imágenes de clima, naturaleza y estaciones;
- 8–12 texturas ambientales;
- 1 portada antes del viaje;
- 1 escena de regreso.

Objetivo inicial: **mínimo 120 assets visuales curados**, sin contar iconos, mapas o variantes responsive.

No es obligatorio mostrar todos los assets en una sesión. La abundancia permite elegir la imagen correcta para cada contexto y evita repetir cinco fotografías por toda la app.

### 6.1b Cobertura mínima por pantalla

| Pantalla | Cobertura visual mínima |
|---|---|
| Portada | fotografía o vídeo a sangre |
| Home | hero + al menos dos previews visuales |
| Hoy/Viaje | hero único por día + previews de etapa |
| POI | hero + galería de 2–4 imágenes cuando existan fuentes |
| Restaurantes | hero + imagen en todos los destacados + cobertura de al menos 60 % de resultados visibles |
| Más | una pieza protagonista + 4–6 tiles visuales |
| Billetes | escena de transporte o textura documental + documentos materiales |
| Hoteles | exterior/entorno + habitación u onsen cuando se verifique |
| Compras | portada + imágenes por categoría y producto prioritario |
| Clima | paisaje/atmósfera de etapa, no solo iconos |
| Cultura | fotografía editorial por capítulo |

Las imágenes ausentes no se sustituyen por degradados genéricos repetidos. Se utiliza una composición tipográfica específica del contenido.

### 6.2 Regla absoluta

No se utilizan imágenes que contengan:

- títulos editoriales añadidos;
- marcos;
- botones;
- logos ajenos dominantes;
- kanji decorativo incorporado como diseño;
- filtros “cyberpunk” evidentes;
- marcas de agua.

El texto siempre pertenece a la interfaz.

### 6.3 Dirección de arte por imagen

Cada asset debe registrar:

- fuente y licencia;
- autor cuando proceda;
- `object-position` para 320, 390 y 430 px;
- exposición;
- saturación;
- temperatura;
- color atmosférico;
- zona segura de texto;
- alt o condición decorativa;
- fallback.

### 6.4 Tratamiento

No se aplicará un filtro único a todas las fotografías.

Presets:

- `night-city`;
- `temple-warm`;
- `nature-air`;
- `memory-neutral`;
- `food-rich`;
- `flight-cool`.

### 6.5 Carga

Con SIM ilimitada:

- hero principal puede usar 1600–2200 px y calidad alta;
- se permiten `srcset` y AVIF/WebP/JPEG;
- la imagen siguiente del carrusel de días puede prefetchearse;
- POIs y restaurantes cargan progresivamente;
- el núcleo operativo no espera a las imágenes;
- no se precachea obligatoriamente todo.

### 6.6 Vídeo

Se autoriza un único vídeo corto o cinemagraph opcional en la portada:

- 4–8 segundos;
- sin audio automático;
- pausa al perder visibilidad;
- poster inmediato;
- alternativa estática;
- no debe impedir entrar.

No se crea hasta aprobar la portada estática.

---

## 7. Motion y respuesta

### 7.1 Principio

El movimiento explica continuidad, tiempo y estado. También puede emocionar, pero nunca entorpece.

### 7.2 Sistema de duraciones

| Tipo | Duración |
|---|---:|
| presión | 80–110 ms |
| microfeedback | 140–190 ms |
| cambio de estado | 180–260 ms |
| sheet | 280–380 ms |
| transición de página | 360–520 ms |
| ceremonia | 700–1400 ms |

### 7.3 Curva

Curva principal:

`cubic-bezier(.22, .8, .22, 1)`

Curva de objeto pesado:

`cubic-bezier(.16, 1, .3, 1)`

### 7.4 Ceremonias autorizadas

1. Entrada / countdown.
2. Briefing de la mañana.
3. Cambio de día.
4. Apertura de POI desde hero o mapa.
5. Billete que entra en estado activo.
6. Reserva confirmada.
7. Llegada a una nueva ciudad.
8. Cierre del viaje.

Solo una ceremonia puede ejecutarse a la vez.

### 7.5 Shared transitions

Prioridad:

- día → hero diario;
- timeline → POI;
- pin → POI;
- restaurante → detalle;
- documento compacto → billete completo.

Implementación progresiva:

1. View Transitions API cuando esté disponible;
2. crossfade + transform coordinado;
3. cambio inmediato en reduced motion.

### 7.6 Haptics

En dispositivos compatibles, se permite vibración breve y opcional:

- reserva confirmada;
- copiar localizador;
- completar tarea crítica;
- iniciar ruta.

Nunca en navegación normal. Debe poder desactivarse.

### 7.7 Sonido

No hay sonido automático.

Puede evaluarse un sonido opcional y muy breve para una única acción de confirmación, desactivado por defecto. No forma parte del primer corte.

---

## 8. Shell y navegación

### 8.1 Header vivo

El header deja de ser siempre idéntico.

Estados:

- transparente sobre hero;
- tinta al hacer scroll;
- compacto en herramientas;
- contextual en mapa/documentos.

Contiene:

- identidad mínima;
- hora Madrid / Japón;
- opcionalmente ciudad o estado “En ruta”;
- transición sin salto al cambiar de modo.

### 8.2 Bottom nav

Se mantiene flotante, pero gana:

- indicador activo con desplazamiento físico;
- profundidad y reflejo localizado;
- label completo o abreviado inteligentemente;
- morph del fondo al abrir una sección;
- ocultación parcial al hacer scroll descendente largo;
- reaparición inmediata al invertir el scroll.

No se oculta durante tareas críticas.

### 8.3 Navegación de días

El strip actual es útil, pero visualmente rígido y propenso a cortes.

V2.5.1 introduce:

- día activo centrado;
- inercia y snap;
- preview de la fotografía siguiente;
- ciudad como segunda línea contextual;
- progresión pasada/presente/futura;
- salto “Hoy” permanente durante el viaje;
- transición cromática entre etapas;
- máscaras laterales que comuniquen continuidad sin cortar texto.

---

## 9. Componentes nuevos y evolucionados

### 9.1 `AtmosphericHero`

Variantes:

- photo;
- video;
- typographic;
- document;
- map.

Capacidades:

- color ambiental;
- crop por viewport;
- zona segura;
- acciones flotantes;
- shared transition;
- fallback de calidad equivalente.

### 9.2 `JourneyRibbon`

Representación horizontal compacta de la ruta completa:

- ciudades;
- tramos;
- posición actual;
- transporte;
- progreso;
- toque para saltar.

No sustituye RouteLine.

### 9.3 `NowHUD`

Pieza operativa protagonista durante el viaje:

- acción actual;
- hora límite;
- siguiente paso;
- cuenta atrás contextual;
- accesos a ruta, billete o comida;
- estado de conexión/GPS solo si afecta.

### 9.4 `BriefingCard`

Documento matinal:

- clima;
- qué ponerse;
- primera salida;
- reserva;
- apunte cultural;
- riesgo relevante;
- CTA “Empezar el día”.

Solo usa datos existentes y verificados.

### 9.5 `EditorialMediaRow`

Fila con imagen, gradiente cromático o composición tipográfica. Sustituye listas idénticas en Más, Restaurantes y guías.

### 9.6 `TravelDocument`

Sistema común con composiciones específicas:

- vuelo;
- tren;
- hotel;
- restaurante reservado;
- entrada/actividad.

### 9.7 `ActionDock`

Dock contextual sobre hero o sheet:

- máximo tres acciones;
- una primaria;
- se adapta a estado;
- soporte de safe areas;
- desaparece al no ser relevante.

### 9.8 `MomentToast`

Feedback premium:

- copiado;
- guardado;
- completado;
- offline;
- ruta abierta.

Incluye icono, texto y progreso breve cuando proceda.

### 9.9 `AmbientSkeleton`

Loading derivado del color de la imagen o pantalla, no gris genérico.

### 9.10 `ShowThisCard`

Tarjeta a pantalla completa para enseñar a otra persona:

- dirección del hotel;
- nombre de estación;
- frase;
- reserva;
- teléfono.

Tipografía grande, japonés confirmado y brillo alto opcional.

---

## 10. Contratos por pantalla

### 10.1 Splash / portada

#### Objetivo

Generar anticipación real antes de entrar.

#### Composición

- fotografía o vídeo a sangre;
- ruta y edición arriba;
- countdown enorme;
- frase editorial breve;
- destino y fecha;
- CTA inequívoco;
- grano y luz cinematográfica;
- transición al home compartiendo color/foto.

#### Prohibido

- texto incorporado en la imagen;
- slideshow rápido;
- CTA que parezca parte de la foto;
- más de una llamada principal;
- espera forzada.

#### Wow

Al entrar, el countdown se transforma en el número de etapa o en el estado actual.

### 10.2 Home antes del viaje

Debe ser una portada operativa, no una pantalla vacía.

Incluye:

- countdown;
- estado de preparación;
- próxima fecha límite;
- ruta completa;
- una selección “Explora el viaje”;
- billete de ida como teaser;
- fotografía que cambia con el tiempo restante.

No muestra todas las herramientas.

### 10.3 Briefing durante el viaje

Al abrir por primera vez cada mañana:

1. ciudad y día;
2. clima;
3. primera salida;
4. reserva;
5. un consejo;
6. CTA para iniciar.

Se puede cerrar y no bloquea el acceso.

### 10.4 Hoy

Primer viewport:

- hero del día;
- ciudad, número y título;
- estado Ahora superpuesto o inmediatamente debajo;
- acción primaria contextual;
- ruta/mapa como secundarias.

Segundo viewport:

- RouteLine;
- siguiente reserva;
- hotel;
- herramientas contextuales.

El hero puede colapsar a una banda cromática al hacer scroll.

### 10.5 Viaje

Debe invitar a explorar los 13 días.

- strip de días mejorado;
- transición fotográfica entre días;
- JourneyRibbon;
- número de día grande;
- capítulos por ciudad;
- preview de mañana;
- “guardar este plan” cuando proceda.

### 10.6 POI

Debe sentirse como abrir una página de un libro excepcional.

- fotografía 4:5 o full bleed;
- japonés confirmado;
- nombre;
- lead en Newsreader;
- datos prácticos antes de scroll profundo;
- narrativa sin cards repetidas;
- mapa como sheet contextual;
- galería opcional de 2–4 fotos;
- audio no requerido.

Wow:

- continuidad de imagen desde timeline/mapa;
- color ambiental derivado de la foto.

### 10.7 Restaurantes

Debe abrir el apetito.

#### Primer viewport

- escena gastronómica;
- “Comer en Japón”;
- sugerencia contextual: ciudad, hora y cercanía;
- tres accesos: Ahora, Esta noche, Planificar.

#### Exploración

- filtros en sheet;
- resultados con imagen para todos los destacados y para la mayoría de los resultados visibles;
- ritmo alterno entre media rows y filas planas;
- fotografías de platos, barras, fachadas y barrios, evitando una sucesión de imágenes idénticas de comida;
- colecciones visuales como “ramen de madrugada”, “cena especial”, “barras bajo las vías” o “Kioto íntimo”;
- precio, reserva y ocasión legibles;
- barrios como capítulos;
- shortlist visible.

#### Planificador

- timeline de comidas del viaje;
- huecos con intención, no cajas vacías;
- reserva confirmada con ceremonia;
- conflicto comunicado antes de guardar;
- acceso directo a mapa y contacto.

### 10.8 Billetes y reservas

Debe sentirse como una cartera de viaje.

- próximo documento protagonista;
- estado temporal: futuro, listo, activo, usado;
- countdown hasta salida/check-in;
- acción primaria contextual;
- códigos copiables;
- modo alto brillo;
- modo “enséñalo”;
- resto de documentos en pila editorial.

Wow:

- el documento activo cambia de material;
- confirmación de copiado visible y háptica.

### 10.9 Más

Deja de ser un menú de ajustes.

Nueva estructura:

1. **Lo que necesitas ahora:** billetes, hotel, clima.
2. **Moverte y hablar:** IC, frases, conversor, emergencia.
3. **Disfrutar:** compras, cultura, restaurantes guardados.
4. **Preparación:** checklist y alertas.

Usa:

- una pieza protagonista fotográfica que cambia según la fase del viaje;
- tiles fotográficos para billetes, clima, frases, compras y cultura;
- fondos cromáticos derivados de imágenes reales cuando un tile no necesite fotografía literal;
- filas solo para utilidades menores;
- copy breve que explique valor;
- orden contextual según fase del viaje.

Al menos la mitad del primer viewport debe aportar información visual o atmosférica, no únicamente filas de texto.

### 10.10 Mapa

- mapa como escena, no fondo utilitario;
- sheet con material ahumado;
- ruta con color de etapa;
- pins numerados y fotografía al seleccionar;
- botón “centrarme” preciso;
- estado GPS claro;
- preview del siguiente POI;
- transición pin → ficha.

### 10.11 Compras y guías

Las herramientas largas necesitan capítulos visuales:

- portada específica;
- navegación sticky legible;
- imágenes de producto verificadas y en tamaño suficiente para disfrutar del objeto;
- galerías para relojes y categorías prioritarias;
- comparativas visuales, no solo textuales;
- tablas y comparativas reales;
- favoritos;
- menos emoji;
- más jerarquía editorial;
- calculadoras con material técnico.

---

## 11. Personalización temporal

### Antes del viaje

- countdown dominante;
- preparación;
- ventanas de reserva;
- exploración;
- luz más contenida y aspiracional.

### Durante el viaje

- NowHUD;
- briefing;
- ciudad actual;
- hora y clima;
- accesos operativos;
- color más vivo;
- hero diario.

### Después

- cierre sobrio;
- documentos todavía accesibles;
- ruta completada;
- no se convierte en diario ni álbum;
- prepara la muerte/renacimiento del producto según V3.

---

## 12. Responsive

### 320–350 px

- una columna;
- títulos con wrap controlado;
- acciones máximas de dos visibles;
- tercera acción en menú;
- nav con labels abreviadas;
- días centrados y snap;
- sin truncar fechas críticas.

### 390–430 px

Viewport maestro. Expresa la composición completa.

### 520–768 px

- shell más ancho;
- imagen y contenido pueden compartir plano;
- no estirar columnas de texto;
- herramientas aprovechan dos columnas.

### 768 px+

- rail lateral opcional;
- panel contextual;
- mapa + detalle simultáneos;
- fondos ambientales a sangre;
- ancho editorial máximo de lectura.

La app móvil sigue siendo la referencia, no una versión reducida de desktop.

---

## 13. Accesibilidad y preferencias

Obligatorio:

- contraste AA;
- foco visible;
- touch targets mínimos de 44 px;
- orden de foco lógico;
- sheets con focus trap;
- retorno de foco;
- labels accesibles;
- no comunicar estado solo con color;
- alt real o imagen decorativa explícita;
- zoom de texto soportado;
- `prefers-reduced-motion`;
- `prefers-contrast`;
- navegación crítica independiente de gestos.

### Reduced motion

Elimina:

- shared transitions;
- parallax;
- cambios de escala;
- cinemagraph/vídeo automático;
- indicadores animados.

Conserva:

- cambios de estado instantáneos;
- feedback de confirmación;
- jerarquía visual completa.

### Modo calma

Se evaluará un ajuste opcional que:

- reduce motion;
- elimina vídeo;
- reduce blur;
- mantiene fotografía;
- simplifica ceremonias.

---

## 14. Rendimiento bajo la nueva doctrina

No hay presupuesto rígido de MB.

Sí hay presupuestos de experiencia:

- shell interactivo sin esperar imágenes secundarias;
- navegación crítica inmediata tras primera carga;
- ninguna imagen provoca layout shift;
- scroll sostenido y estable;
- transiciones sin jank perceptible en los dos móviles reales;
- memoria controlada en galerías y mapas;
- vídeo pausado fuera de viewport;
- precarga únicamente del siguiente contexto probable;
- caché en runtime para contenido visual;
- fallback si una petición falla.

### Offline crítico

Debe incluir:

- shell;
- itinerario;
- billetes y localizadores;
- hoteles y direcciones;
- reservas;
- teléfonos y emergencias;
- frases esenciales;
- último estado del planificador;
- al menos la imagen del día actual cuando ya se haya visitado.

No requiere:

- galería completa;
- todas las fotos de restaurantes;
- vídeo;
- imágenes de días lejanos;
- mapa base.

---

## 15. Datos y contenido requeridos

V2.5.1 no inventa contenido.

Puede requerir añadir a datos existentes:

- `hero_image`;
- `hero_position`;
- `ambient_color`;
- `editorial_caption`;
- `featured`;
- `image_gallery`;
- `show_this_text`;
- `day_mood`;
- `briefing_reference`;
- `document_state`.

Todo campo factual debe proceder de una fuente real o de una decisión explícita del propietario.

---

## 16. Fases de ejecución

### Fase 0 — Inventario y baseline

- capturas de todas las pantallas;
- inventario de assets;
- peso y comportamiento actual;
- mapa de componentes;
- matriz de estados;
- validar ambos móviles.

Salida: baseline V2.5.1.

### Fase 1 — Sistema sensorial

- tokens nuevos;
- materiales;
- tipografía editorial;
- color atmosférico;
- motion primitives;
- skeletons;
- toast;
- accesibilidad.

Salida: laboratorio de componentes.

### Fase 2 — Tres frames de aprobación

Antes de propagar:

1. Home antes del viaje.
2. Hoy durante el viaje.
3. Restaurantes.

Cada frame incluye:

- estado ideal;
- 320/390/430;
- reduced motion;
- loading;
- offline crítico cuando aplique.

### Fase 3 — Shell y continuidad

- header vivo;
- bottom nav;
- navegación de días;
- transiciones;
- scroll behavior;
- JourneyRibbon.

### Fase 4 — Operación premium

- NowHUD;
- briefing;
- billetes;
- hotel;
- mapa;
- show-this cards.

### Fase 5 — Descubrimiento

- POI;
- restaurantes;
- Más;
- cultura;
- compras;
- clima.

### Fase 6 — Ceremonias

- entrada;
- cambio de día;
- llegada de ciudad;
- reserva confirmada;
- documento activo;
- cierre.

### Fase 7 — QA real

- 320/390/430;
- iPhone y Android reales;
- luz solar;
- noche;
- conexión degradada;
- offline crítico;
- reduced motion;
- teclado;
- textos largos;
- caché y actualización PWA.

---

## 17. Prioridades

### P0 — Cambian la percepción completa

1. Home/portada.
2. Hoy + NowHUD.
3. Navegación de días.
4. Restaurantes.
5. Más.
6. Billete activo.
7. Sistema de motion y materiales.

### P1 — Elevan profundidad

1. POI con continuidad.
2. Briefing.
3. Mapa + sheet.
4. Show-this cards.
5. Galerías.
6. Color atmosférico por día.

### P2 — Caprichos de alto acabado

1. Vídeo/cinemagraph.
2. Haptics.
3. Modo calma.
4. Cierre del viaje.
5. Sonido opcional.

---

## 18. Criterios de aceptación

V2.5.1 se considera visualmente cerrada cuando:

1. Ninguna pantalla principal parece una plantilla compartida con las demás.
2. Todas siguen perteneciendo inequívocamente al mismo producto.
3. Home, Hoy, Restaurantes, Billetes, POI y Más tienen un foco visual claro.
4. Las 13 portadas diarias usan fotografía limpia y específica.
5. No existe texto editorial incorporado dentro de las fotografías.
6. El día activo se centra y no queda cortado.
7. La navegación crítica sigue siendo inmediata.
8. El NowHUD muestra la acción correcta durante el viaje.
9. Restaurantes despierta apetito antes de mostrar controles avanzados.
10. Más comunica valor y no parece Ajustes.
11. El billete activo se distingue claramente del archivo.
12. Al menos cuatro transiciones expresan continuidad real.
13. Reduced motion conserva toda la información y belleza estática.
14. El offline crítico funciona.
15. No hay scroll horizontal accidental a 320, 390 o 430 px.
16. No hay layout shift perceptible por imágenes.
17. Accesibilidad Lighthouse es ≥95 o no empeora un baseline superior.
18. Las animaciones permanecen fluidas en ambos móviles reales.
19. Todos los assets tienen procedencia.
20. Cinco personas en revisión ciega identifican Japón, viaje privado y producto premium.
21. El propietario declara que le apetece abrirla sin necesitar consultar nada.
22. Existe una biblioteca inicial de al menos 120 assets visuales curados.
23. Ninguna pantalla principal se resuelve únicamente con fondo negro, texto y divisores.
24. Restaurantes muestra fotografía en al menos el 60 % de los resultados visibles de una exploración normal.
25. Más contiene una pieza protagonista y un mínimo de cuatro accesos visuales.
26. POIs prioritarios ofrecen hero y galería, no una única imagen aislada.
27. La revisión visual confirma variedad de escala: imagen a sangre, media row, galería, detalle y composición tipográfica.
28. No se repite una misma fotografía como hero de dos contextos diferentes.

---

## 19. Qué no entra

- refactor V3 a motor genérico;
- red social;
- diario o álbum;
- IA de traducción por cámara;
- audio guía completa;
- realidad aumentada;
- mapa 3D;
- datos inventados para rellenar;
- gamificación con puntos;
- tematización literal de samuráis, anime o cyberpunk;
- cambios de itinerario o reservas no confirmados.

---

## 20. Decisión final

V2.5.1 no será una capa cosmética sobre V2.5.

Será una segunda dirección artística que:

- conserva la precisión conseguida;
- introduce belleza, materialidad y emoción;
- da personalidad propia a cada parte del viaje;
- utiliza la conectividad ilimitada para enriquecer, no para cargar por cargar;
- convierte la app en un objeto que merece ser abierto.

La pregunta de revisión ya no será:

> “¿Está suficientemente pulida?”

Será:

> **“¿Hay alguna parte que todavía parezca una aplicación normal?”**

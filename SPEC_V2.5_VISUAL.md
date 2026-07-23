# V2.5 — Dirección visual y especificación cosmética

> Estado: propuesta para aprobación · 22 de julio de 2026  
> Alcance: auditoría y especificación; este documento no implementa cambios  
> Producto: Chelis en Japón  
> Prioridad: elevar percepción de calidad sin comprometer uso móvil, rapidez ni resiliencia offline

## Cómo se usa este documento

Este archivo conserva la auditoría, el razonamiento y el territorio creativo. **No es la fuente final para medidas o composición.**

La ejecución V2.5 se gobierna, en este orden:

1. `V2.5_ART_DIRECTION.md` — decisiones visuales cerradas, layouts y contratos de pantalla.
2. `V2.5_IMPLEMENTATION_PLAN.md` — migración técnica, fases, pruebas y definición de terminado.
3. `SPEC_V2.5_VISUAL.md` — contexto, diagnóstico, alternativas y referencias.
4. `SPEC.md` y `CONSTITUTION.md` — comportamiento, contenido y reglas funcionales vigentes.

Si este documento contradice la dirección artística, prevalece `V2.5_ART_DIRECTION.md`. La V2.5 no modifica contenido ni alcance funcional salvo que `SPEC.md` lo apruebe explícitamente.

### Decisiones cerradas tras la revisión crítica

- Dirección: **Polestar bespoke**, no “Rolls-Royce literal”.
- El ultra lujo se expresa con precisión, contenido real y tres momentos memorables; no con acumulación de efectos.
- Momentos heroicos aprobados: Portada, Hoy y POI. Billetes recibe acabado-objeto, pero no una cuarta intro teatral.
- Firma recurrente principal: línea de ruta. Firma excepcional: joya técnica, máximo una por viewport.
- Champagne es opcional y queda bloqueado hasta validarlo en mockup; no forma parte del primer corte de tokens.
- `Newsreader + Inter` es hipótesis, no decisión. La prueba tipográfica decide entre dos rutas documentadas.
- La Gallery personal es un tratamiento editorial del contenido existente, no una nueva función ni un carrusel.
- No se implementará ningún efecto visual antes de aprobarlo en los cinco frames maestros.
- Se prioriza eliminar patrones genéricos antes de añadir materiales, motion o componentes.

---

## 0. Resumen ejecutivo

La aplicación ya tiene una base funcional sólida, una arquitectura de información útil y un código de color reconocible. El problema no es que esté «fea» en un sentido elemental: el problema es que su lenguaje visual se parece demasiado al paquete de decisiones que hoy asociamos con una interfaz generada automáticamente:

- fondo negro azulado;
- auroras y glows decorativos;
- glassmorphism en header y navegación;
- todas las piezas dentro de cards redondeadas similares;
- rojo saturado aplicado a casi cualquier elemento activo;
- emojis como iconografía de producto;
- jerarquía basada casi exclusivamente en tamaño y negrita;
- ausencia de una voz editorial, una retícula propia y recursos gráficos memorables.

El resultado es competente pero genérico. Parece una app oscura «premium» antes que una guía personal de Japón diseñada con criterio.

La V2.5 propone evolucionar hacia una estética **editorial japonesa contemporánea, nocturna y cálida**: una mezcla de cuaderno de viaje, revista independiente y señalética ferroviaria. Debe sentirse cuidada y personal, no temática ni folclórica. Se mantiene el negro tinta y el rojo torii, pero se introducen superficies cálidas, tipografía con contraste, fotografía con intención, composición asimétrica, numeración editorial y una iconografía coherente.

La palabra guía es **intimidad**. El “wow” no debe venir de más efectos, sino de mejor gusto: una portada fotográfica bien compuesta, grandes silencios, detalles precisos, tipografía expresiva y cards solo donde haya una razón funcional.

### Resultado esperado

Tras la V2.5, la app debe percibirse como:

- una pieza hecha para este viaje concreto;
- una guía que apetece explorar y guardar;
- una herramienta profesional que sigue siendo rápida en la calle;
- un producto con identidad propia incluso si se oculta el nombre y el logotipo.

No debe percibirse como:

- una plantilla SaaS en dark mode;
- una demo de glassmorphism;
- un moodboard de clichés japoneses;
- una interfaz decorada con efectos para compensar falta de dirección artística.

---

## 1. Auditoría del estado actual

### 1.1 Lo que ya funciona y debe preservarse

1. **Paleta reconocible.** El negro azulado y el rojo `#E8002D` crean continuidad entre pantallas y conectan con Japón sin depender de ilustraciones literales.
2. **Legibilidad básica.** El contraste general es alto y la mayoría de los cuerpos de texto se encuentran entre 13 y 17 px.
3. **Patrones móviles comprensibles.** Header fijo, navegación inferior, filtros horizontales, hojas a pantalla completa y targets táctiles son patrones familiares.
4. **Contenido como protagonista funcional.** Itinerario, billetes, fichas y herramientas contienen información real y útil; la V2.5 no debe esconderla detrás de una composición caprichosa.
5. **Consistencia de variables.** Ya existen tokens globales para fondos, texto, acento, radios, sombras, espaciado y movimiento. La base permite una migración progresiva.
6. **Fotografía disponible.** La splash y las fichas POI ya cuentan con imágenes locales/offline. Hay materia prima para construir identidad sin introducir una dependencia de red.

### 1.2 Diagnóstico principal: por qué «huele a IA»

#### A. El tratamiento “premium” es genérico

La descripción interna del sistema como “Dark Premium” se traduce en fondo oscuro, blur, borde blanco translúcido, radio de 20 px y sombras profundas. Es un preset visual, no una dirección artística. La misma solución podría servir para una fintech, una app de hábitos o un dashboard de criptomonedas.

#### B. Todo es una card y todas las cards hablan igual

Hero, hotel, plan del día, alertas, vuelos, trenes, herramientas, restaurantes y contenido cultural utilizan contenedores muy parecidos. Cuando todo está elevado, nada tiene jerarquía. También se pierde continuidad vertical: el usuario no lee una página, salta entre cajas.

#### C. Hay exceso de efectos “cinematográficos”

La aurora global animada, tres auroras adicionales en la splash, scanlines, glows rojos, sombras grandes, slideshow a 900 ms y textos con entrada escalonada compiten entre sí. La suma se siente demostrativa. Una experiencia editorial sofisticada usa uno o dos gestos memorables y deja respirar el resto.

#### D. La tipografía no construye identidad

Todo se resuelve con `system-ui` y variaciones de peso. Es eficiente, pero no distingue títulos, datos operativos, texto editorial y microcopy. Los títulos grandes parecen headings de producto, no titulares de guía. Falta contraste entre una voz editorial y una voz utilitaria.

#### E. La iconografía cambia de idioma visual

Conviven SVG lineales, emojis de plataforma, símbolos de texto, estrellas emoji, banderas y flechas tipográficas. Los emojis varían entre iOS, Android y escritorio, bajan la percepción de acabado y convierten herramientas serias en tiles de prototipo.

#### F. El rojo no tiene jerarquía semántica

El acento sirve simultáneamente para selección, navegación, enlaces, CTA, error, alerta, decoración y glow. Si todo lo importante es rojo, el rojo deja de informar. Además, usar el mismo rojo para acción principal y peligro debilita ambos significados.

#### G. La interfaz no aprovecha el contenido específico del viaje

La identidad de Tokio, Kioto, Osaka, Hiroshima y Hakone apenas transforma la composición. Salvo la splash y algunas fotos de POI, la experiencia podría pertenecer a cualquier destino. Una guía personal debería hacer visible el ritmo del viaje, los lugares y sus materiales.

#### H. Falta una retícula editorial

El padding de 20 px y los gaps de 12/16 px se aplican de forma casi universal. Hay alineación, pero no composición. No existen elementos que crucen columnas, números de día sobredimensionados, captions, reglas verticales, sangrados fotográficos o cambios de densidad que creen ritmo.

#### I. La splash promete un producto distinto al interior

La entrada es fotográfica, animada y muy expresiva; el interior vuelve a una colección de superficies homogéneas. Esa ruptura hace que la splash parezca una capa promocional separada, no la puerta de entrada al mismo sistema.

#### J. La CSS está fragmentada por componente

La mayoría de componentes define grandes strings `STYLES` locales. Hay repetición de navegación, cards, botones, chips y encabezados. Este hecho no es solo técnico: dificulta afinar el sistema como un todo y facilita pequeñas divergencias visuales. La V2.5 debe centralizar fundamentos antes de pulir cada pantalla.

### 1.3 Inventario de deuda visual observable

| Área | Situación actual | Impacto perceptivo |
|---|---|---|
| Fondo | negro azulado + aurora violeta/roja animada | cliché “AI premium”; ruido constante |
| Cards | radio 20 px, borde translúcido y sombra en casi todo | monotonía, falta de jerarquía |
| Header | barra glass de 60 px con título y reloj | correcto pero genérico; poco carácter |
| Bottom nav | patrón iOS estándar con cinco iconos lineales | funcional, no distintivo |
| Tipografía | una única familia de sistema | identidad débil |
| Iconos | mezcla de emojis, SVG y caracteres | aspecto no profesional/inconsistente |
| Color | rojo para casi todos los estados importantes | semántica confusa |
| Splash | 5 fotos a 900 ms + auroras + scanlines + glow | sobreproducida, inquieta, desconectada |
| Restaurantes | lista de cards de texto sin imagen ni “portada” | contenido rico presentado como base de datos |
| Más | grid 2×N con emoji + label + flecha | aspecto de menú generado/launcher |
| Herramientas | mismo molde de `travel-card` para cualquier contenido | documentos diferentes parecen iguales |
| Motion | efectos ambientales y transiciones locales sin gramática | movimiento decorativo, no narrativo |

---

## 2. Dirección artística V2.5

### 2.1 Concepto: «Tokyo after rain, cuaderno en el bolsillo»

Una guía nocturna y táctil: tinta casi negra, papel marfil, rojo de sello, fotografía húmeda, tipografía editorial y datos inspirados en señalética ferroviaria. No se pretende imitar una app japonesa ni llenar la UI de kanji. Se busca el contraste entre precisión operativa y memoria de viaje.

### 2.2 Tres pilares

#### 1. Editorial

- titulares con personalidad;
- numeración de días y secciones como elementos gráficos;
- composición con aire, reglas finas y captions;
- contenidos largos tratados como artículo, no como card de dashboard;
- fotografía usada como narrativa, no como fondo genérico.

#### 2. Táctil y cozy

- negro tinta, no negro digital puro;
- superficies ligeramente cálidas;
- un marfil legible para momentos destacados;
- grano extremadamente sutil y estático, nunca una textura protagonista;
- radios menos uniformes y sombras más cortas;
- sensación de objeto impreso sin sacrificar contraste.

#### 3. Operativo

- horarios, estaciones, localizadores y precios en una tipografía clara/tabular;
- rojo reservado a acción/posición y no a toda la decoración;
- estados críticos diferenciados del branding;
- información accionable visible en menos de 10 segundos;
- targets de al menos 44×44 px y comportamiento usable con una mano.

### 2.3 Referencias de espíritu, no de copia

- revistas de viaje independientes con fotografía a sangre;
- cubiertas editoriales japonesas contemporáneas;
- wayfinding de estaciones: números, códigos, líneas y ritmo modular;
- papelería japonesa: sellos, notas, márgenes y precisión material;
- interiores de kissaten: oscuros, cálidos, sobrios y humanos.

### 2.4 Lo que queda explícitamente prohibido

- patrones de olas seigaiha, soles rojos, sakura o torii usados como decoración automática;
- kanji inventado o japonés ornamental sin significado;
- neón cyberpunk como lenguaje dominante;
- más auroras, blobs, gradients violeta/azul o glows “mágicos”;
- fotos de stock sin conexión con el itinerario;
- cristal esmerilado en cada superficie;
- iconos 3D, stickers o emojis de sistema como iconografía primaria;
- serif “de lujo” ilegible en cuerpos o datos operativos.

### 2.5 El criterio «Polestar × Rolls-Royce»: precisión que también sabe presumir

El propietario eleva el listón desde «un Volvo de web» a **un Volvo Polestar con detalles Rolls-Royce**. Esta comparación no significa copiar una web de automoción. Define una combinación más ambiciosa:

- la calidad se percibe antes de poder señalar un efecto concreto;
- cada elemento transmite solidez, protección y control;
- las proporciones son más importantes que la ornamentación;
- la interfaz es calmada, pero nunca anodina;
- los materiales parecen honestos;
- las funciones complejas resultan simples sin parecer infantiles;
- los detalles mantienen el mismo nivel de ejecución en pantallas principales y secundarias.
- algunos detalles sí reclaman atención y exhiben deliberadamente el nivel de ejecución;
- la personalización no parece una variable de plantilla, sino una pieza realizada por encargo;
- cada aparición teatral está rodeada de suficiente silencio para sentirse excepcional.

Polestar aporta minimalismo tecnológico, contraste arquitectónico, precisión, iluminación integrada y pequeños detalles que se descubren al acercarse. Rolls-Royce aporta ceremonia, bespoke, arte integrado y la idea de que el habitáculo puede contener una “Gallery” propia. La traducción a este producto es:

| Principio de ultra lujo | Traducción a Chelis en Japón |
|---|---|
| Seguridad | El usuario siempre sabe dónde está, cómo volver y qué acción va a ejecutar |
| Proporción | Cada pantalla tiene un foco dominante y una distribución deliberada de aire/densidad |
| Precisión Polestar | Retícula exacta, tipografía técnica, gráficos de ruta y controles casi instrumentales |
| Tecnología visible | Datos útiles tratados como piezas bellas, no escondidos para parecer minimalista |
| Autoridad | Pocos colores, cero efectos ansiosos y titulares con confianza |
| Cabina nocturna | Obsidiana, grafito, marfil y fotografía cinematográfica sobre una base tinta |
| Función emocional | La información útil también puede producir ilusión por el viaje |
| Bespoke Rolls-Royce | Nombre, ruta, fechas, fotografías y recuerdos tratados como una edición única |
| Gallery | Una franja editorial reservada a arte/fotografía/contexto en lugar de otro widget |
| Ceremonia | Entradas, aperturas y confirmaciones importantes tienen un gesto memorable |
| Artesanía | Estados, alineaciones, recortes, iconos, luz y transiciones están curados, no aceptados por defecto |
| Identidad constante | La app se reconoce por sus proporciones, tipografía y detalles, no por pegar el rojo en todas partes |

La expresión que debe guiar las revisiones es **“controlled spectacle”**: la app sabe ser silenciosa, pero también sabe abrir las puertas y enseñar que es extraordinaria.

#### Reparto estilístico

- **70 % Polestar:** monocromo, precisión, tecnología, tensión gráfica y reducción.
- **20 % Rolls-Royce:** ceremonia, bespoke, arte, detalle joya y sensación de encargo.
- **10 % Japón real:** fotografía, señalética, ruta y contenido del viaje.

Ese 20 % Rolls-Royce no se distribuye uniformemente. Se concentra en portada, hero del día, POI, billetes principales y cierre del viaje. Si todo fuese teatral, nada parecería exclusivo.

### 2.5.1 Ultra lujo frente a “premium de plantilla”

| Premium de plantilla | Ultra lujo V2.5 |
|---|---|
| Gradiente llamativo | Negro profundo con una luz integrada y localizada |
| Glow alrededor de todo | Un filo luminoso de 1 px en una pieza protagonista |
| Fuente serif en todos los títulos | Contraste exacto entre display, UI y datos |
| Dorado como color “caro” | Metal cálido casi neutro, usado como material y no como pintura |
| Muchas animaciones | Una ceremonia coreografiada en momentos seleccionados |
| Card con sombra grande | Volumen por capas, borde, oclusión y movimiento mínimo |
| Personalización con el nombre | Composición, ruta y fotografía únicas del viaje |
| Iconos especiales mezclados | Un set propio con una o dos piezas distintivas |
| Dashboard lleno de datos | Instrumentación selectiva y bellamente alineada |
| “Wow” inmediato y agotador | Impacto inicial más detalles que se descubren después |

### 2.5.2 Derecho a presumir

La V2.5 permite que determinados elementos digan “mira qué bien hecho está”, siempre que cumplan las tres condiciones:

1. representan contenido real del viaje;
2. su ejecución supera claramente a un componente estándar;
3. no compiten con otro elemento joya en el mismo viewport.

Elementos autorizados para presumir:

- countdown y número de día;
- fotografía/portada de etapa;
- línea global del viaje;
- localizador o billete activo;
- ficha editorial de un POI;
- recomendación gastronómica destacada;
- transición de entrada y cierre;
- sello personal del viaje.

Filtros, formularios, mensajes de error y navegación no tienen derecho a presumir.

### 2.6 Modelo de calidad percibida

La calidad no se evaluará solo por atractivo de una captura. Se divide en seis capas. Si una falla, el conjunto pierde el efecto Volvo:

#### Capa 1 — Confianza

- No hay saltos de layout.
- No aparecen pantallas vacías sin explicación.
- Los botones responden de inmediato.
- Back siempre se encuentra en el mismo lugar.
- El usuario distingue datos confirmados, pendientes y no disponibles.
- La interfaz nunca parece rota cuando falta una imagen o un campo.

#### Capa 2 — Proporción

- Un solo foco visual en el primer viewport.
- Máximo tres tamaños tipográficos claramente protagonistas por pantalla.
- La densidad cambia deliberadamente: hero respirada, zona operativa compacta.
- Las alineaciones no dependen de “aproximadamente 20 px”; siguen columnas repetibles.
- El final de cada sección tiene suficiente aire para que la siguiente no parezca otra card pegada.

#### Capa 3 — Materialidad

- Superficies diferenciadas por tono, borde y espacio, no por sombras enormes.
- Estados pressed/focus parecen físicos y precisos.
- Fotografía, papel y tinta forman una familia cromática.
- Los divisores son discretos pero consistentes.
- Ningún control parece plástico brillante o neón salvo una emergencia real.

#### Capa 4 — Precisión

- Iconos alineados ópticamente, no solo matemáticamente.
- Números tabulares en todas las lecturas que cambian.
- Baselines comunes para hora, título y metadata.
- Radios anidados coherentes: el radio interior nunca compite con el exterior.
- Flechas, separadores, capitalización y unidades siguen una única regla.

#### Capa 5 — Cuidado humano

- Los targets importantes se alcanzan con el pulgar.
- Los datos críticos no requieren desplegar contenido.
- El calor, el cansancio, la mala cobertura y la luz exterior se consideran estados normales de uso.
- Los mensajes hablan como una guía preparada por alguien, no como un sistema.
- El usuario puede equivocarse sin sentirse atrapado.

#### Capa 6 — Memoria

- Existen momentos visuales reconocibles y fotografiables.
- La app tiene una firma que permanece después de cerrar la pantalla.
- Esa firma no depende de un cliché japonés.
- La experiencia comunica que este viaje pertenece a Daniel y Chelis, no a “cualquier usuario”.

### 2.7 Las cuatro firmas visuales

Un producto premium no necesita que todas sus piezas sean llamativas. Necesita unas pocas firmas consistentes, como una parrilla, un faro o una línea de hombro reconocible. La V2.5 tendrá cuatro; las tres primeras forman el lenguaje cotidiano y la cuarta se reserva para momentos excepcionales:

#### Firma A — El marco de viaje

Una composición repetible formada por:

- número de día grande y sereno;
- ciudad + fecha como metadata;
- una línea roja corta de 24–32 px;
- título editorial;
- fotografía curada o portada tipográfica.

Aparece en Splash, Hoy, Viaje y portada de POI. No debe replicarse dentro de cada card.

#### Firma B — La línea de ruta

Una línea vertical o horizontal fina que conecta momentos, estaciones o pasos. Adopta el lenguaje de wayfinding ferroviario sin copiar mapas de metro:

- nodo activo rojo;
- nodos completados marfil atenuado;
- próximos nodos gris cálido;
- etiquetas horarias tabulares;
- separación generosa entre hitos.

Aparece en itinerario, trenes, última milla y preparación cuando haya dependencias. Es funcional y, por repetición, identitaria.

#### Firma C — El sello de acción

El rojo torii se concentra en un gesto pequeño pero inequívoco:

- línea, punto, marcador o botón primario;
- área roja maciza solo para una acción verdaderamente principal;
- pressed en rojo oscuro, sin glow;
- puede incorporar una microanimación de 160 ms.

El sello evita convertir todo el producto en rojo y hace que el acento parezca más caro.

#### Firma D — La joya técnica

Se añade una cuarta firma excepcional, no obligatoria en todas las pantallas:

- un borde o línea de luz de 1 px;
- información microscópica de precisión —coordenadas, secuencia, fecha, código de etapa—;
- material grafito/metal cálido;
- detalle gráfico que responde al movimiento o estado;
- acabado que solo se aprecia al detenerse.

Ejemplos: el nodo activo de una ruta, el contorno de un billete, el indicador de progreso del viaje o la atribución de una fotografía. Es el equivalente digital de una pieza mecanizada o un reloj integrado. Nunca debe parecer un glow CSS genérico.

### 2.8 Momentos wow y zonas de calma

La interfaz debe administrar el impacto como una buena experiencia física: entrada memorable, conducción silenciosa y detalles que se descubren.

#### Momento wow 1 — Entrar al viaje

Splash/portada con una única fotografía extraordinaria, título editorial y countdown. El impacto viene del encuadre, el contraste y la proporción. Debe poder capturarse y compartir sin parecer una pantalla de carga.

#### Momento wow 2 — Abrir el día

La pantalla Hoy debe contestar visualmente, antes que verbalmente:

1. dónde estamos;
2. qué tipo de día es;
3. qué viene ahora;
4. cómo abrir ruta/mapa.

El número del día, la hero y el nodo `Ahora` forman la escena. Al empezar a desplazarse, la interfaz se vuelve compacta y operativa.

#### Momento wow 3 — Descubrir un lugar

POI detail combina foto, lead editorial y contexto histórico como una mini pieza de revista. La transición desde timeline/mapa conserva orientación y hace sentir que el lugar estaba esperando detrás del itinerario.

#### Momento wow 4 — La reserva como objeto

El vuelo, tren u hotel más próximo aparece como una pieza documental de ultra lujo:

- composición propia y no card universal;
- código/ruta sobredimensionado;
- microtipografía de precisión;
- localizador tratado como dato valioso;
- gesto de copia impecable;
- estado confirmado que produce una respuesta visual breve y satisfactoria.

Debe recordar más a un objeto de colección o pase de atelier que a una tarjeta de wallet clonada.

#### Momento wow 5 — La Gallery personal

Una franja editorial inspirada conceptualmente en la Gallery de Phantom presenta una sola pieza:

- fotografía especialmente buena;
- nota personal;
- objeto/recuerdo del viaje;
- contexto breve de la etapa;
- al final, composición retrospectiva del recorrido.

En la primera entrega puede utilizar únicamente fotografía y copy existentes. No implica crear una función de diario. Es un tratamiento visual de contenido real, no contenido inventado.

#### Zonas de calma

Billetes, alertas, emergencia, conversor y filtros no persiguen el wow. Persiguen una confianza excepcional. Su calidad se expresa mediante:

- respuesta inmediata;
- jerarquía obvia;
- datos alineados;
- copy corto;
- estados impecables;
- ausencia de sorpresas.

### 2.9 Coeficiente de sofisticación

Antes de añadir cualquier recurso visual, debe pasar este filtro:

1. **¿Mejora comprensión, emoción o identidad?** Si no mejora ninguna, se elimina.
2. **¿Sigue pareciendo bueno después de verlo veinte veces?** Si cansa, se elimina.
3. **¿Funciona sin animación?** Si la composición depende del movimiento, se rediseña.
4. **¿Se ve intencional a 320 px?** Si solo funciona en mockup ancho, se descarta.
5. **¿Podría aparecer igual en una fintech?** Si la respuesta es sí, necesita relación real con el viaje.
6. **¿Añade una excepción al sistema?** Si la añade, debe justificar una firma o un momento wow.

El objetivo no es maximizar originalidad por componente. Es maximizar coherencia y cuidado.

---

## 3. Sistema visual propuesto

### 3.1 Paleta

Se conserva el rojo actual como activo de marca, pero se reduce su superficie y se amplía la paleta neutral.

| Token propuesto | Valor inicial | Uso |
|---|---:|---|
| `ink-950` | `#0B0B0C` | fondo principal |
| `ink-900` | `#121214` | superficie base |
| `ink-850` | `#19191B` | superficie elevada |
| `ink-800` | `#222225` | controles y estados hover |
| `paper-100` | `#F2EDE3` | texto principal cálido / superficies editoriales puntuales |
| `paper-300` | `#CFC7BA` | texto secundario de alta relevancia |
| `stone-500` | `#8D8982` | metadata |
| `torii-500` | `#E8002D` | acción principal, selección y marca |
| `torii-700` | `#A90B27` | presión/pressed y fondos tonales |
| `moss-500` | `#708A69` | éxito, disponible, completado |
| `amber-500` | `#D99A4E` | pendiente/atención |
| `signal-500` | `#E05252` | peligro/error real, separado de marca |
| `titanium-400` | `#A7A39B` | líneas técnicas, iconografía especial y microdetalles |
| `champagne-400` | `#B8A47B` | detalle joya excepcional, nunca CTA ni texto largo |

Reglas:

- El rojo de marca no debe superar aproximadamente el 8 % de la superficie visible en una pantalla normal.
- No usar rojo para mensajes de error salvo que el componente contenga además texto/icono inequívoco; preferir `signal-500`.
- `paper-100` puede aparecer como una card editorial invertida, pero no como fondo global: el producto conserva su ADN oscuro.
- El violeta de la aurora actual se elimina del sistema salvo que exista una razón de datos específica.
- `champagne-400` ocupa como máximo el 2 % del viewport y nunca forma gradientes “oro”.
- Titanium y champagne no sustituyen al rojo de marca: representan material/acabado, no interacción.
- Los ratios de contraste se validarán con WCAG AA: 4.5:1 para texto normal y 3:1 para texto grande/controles.

### 3.2 Tipografía

Se propone un sistema de tres voces, limitado y explícito:

1. **Display/editorial:** `Newsreader` variable o alternativa serif equivalente, incluida localmente. Uso en títulos de destino, día, artículos y momentos emocionales.
2. **UI/operativa:** `Inter` variable o `Manrope`, incluida localmente. Uso en navegación, botones, cuerpos y etiquetas.
3. **Datos:** la misma UI con números tabulares (`font-variant-numeric: tabular-nums`) para horas, countdown, precios y códigos. No hace falta una tercera descarga.

Si se decide no incorporar fuentes locales en V2.5, fallback aceptable: `Georgia` para display y el stack de sistema para UI. No es la opción preferida porque cambia entre plataformas.

Escala recomendada:

| Rol | Tamaño / línea | Peso | Observaciones |
|---|---|---|---|
| Display XL | 52/48 | 500 serif | portada/countdown, uso excepcional |
| Display L | 40/40 | 500 serif | título del día |
| H1 | 30/34 | 600 serif o UI | pantallas principales |
| H2 | 22/27 | 600 | secciones |
| H3 | 17/22 | 650 | cards y filas |
| Body L | 16/25 | 400 | lectura editorial |
| Body | 15/22 | 400 | UI general |
| Meta | 12/16 | 550 | captions y datos secundarios |
| Eyebrow | 10/14 | 700 | mayúsculas, tracking 0.10em |

Reglas:

- Evitar `font-weight: 800`; gran parte del aspecto artificial actual viene de titulares excesivamente pesados.
- No usar tracking amplio en frases completas; reservarlo para eyebrows de 10–11 px.
- Limitar cada vista a un único titular dominante.
- El japonés real, cuando exista en los datos, usa un stack CJK apropiado y nunca una fuente pseudoasiática.

### 3.3 Retícula y espaciado

- Viewport de referencia primario: 390×844 px.
- Ancho mínimo validado: 320 px.
- Ancho máximo del shell móvil: 520 px; en escritorio, fondo exterior discreto y shell sin sombra de “teléfono flotante”.
- Margen lateral base: 20 px; fotografía hero puede sangrar hasta el borde.
- Retícula base de 4 px con escala: 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.
- Separación entre secciones: 32–40 px.
- Separación interna de card: 16 o 20 px según densidad.
- La agrupación debe resolverse primero con proximidad y divisores; card solo cuando exista una unidad interactiva o semántica.

### 3.4 Forma, bordes y elevación

Radios:

- `6 px`: inputs compactos, tags y datos;
- `10 px`: botones y filas interactivas;
- `14 px`: cards estándar;
- `20 px`: hero fotográfica o sheet principal, máximo una pieza dominante por viewport;
- `999 px`: únicamente pills/estado, no todos los filtros por defecto.

Sombras:

- eliminar la sombra negra de 48 px como patrón global;
- superficies normales: sin sombra, separación por tono/borde;
- superficie flotante: `0 8px 24px rgba(0,0,0,.28)`;
- navegación: borde y blur suave, sin halo;
- evitar sombra + borde + glow al mismo tiempo.

### 3.5 Textura y fotografía

- Añadir una textura de grano monocromático local, inferior a 20 KB, a 2–3 % de opacidad y sin animación. Debe desaparecer en modo de alto contraste si afecta legibilidad.
- Usar fotos existentes del viaje y POI con un tratamiento común: saturación contenida, negros suaves y temperatura ligeramente cálida.
- Ratio principal: 4:5 para portada y 16:10 para hero de sección. Miniaturas: 72×88 o 96×72 según contexto.
- Cada foto debe tener `object-position` curado cuando el recorte automático elimine el sujeto.
- No aplicar overlay negro uniforme a todas: usar gradiente localizado donde vive el texto.
- No repetir imágenes en múltiples pantallas salvo portada + detalle correspondiente.
- Conservar atribuciones existentes y funcionamiento offline.
- Permitir en las tres heroes principales una gradación cinematográfica específica por fotografía, curada y almacenada como preset; no un filtro global uniforme.
- En portada se admite una máscara o recorte inesperado si mantiene legibilidad y produce una silueta reconocible.
- Los captions pueden incorporar coordenadas, etapa y fecha como microtipografía técnica.

### 3.5.1 Materiales digitales

La interfaz simulará materiales mediante comportamiento y contraste, no mediante texturas fotorrealistas:

| Material conceptual | Expresión digital |
|---|---|
| Obsidiana | fondo casi negro, profundidad por tono y reflejo localizado |
| Grafito | superficies operativas mates con borde frío |
| Papel japonés | superficie marfil de grano mínimo para piezas editoriales |
| Titanio | líneas e iconos de precisión en gris metálico |
| Champagne | una inscripción, índice o borde joya excepcional |
| Cristal | solo overlays necesarios sobre fotografía/mapa, sin glassmorphism universal |

Regla: máximo tres materiales conceptuales simultáneos por pantalla. El usuario debe sentir capas, no ver un catálogo de acabados.

### 3.6 Iconografía

- Crear o adoptar un único set SVG lineal de 20/24 px, stroke 1.75, extremos redondeados.
- Iconos prioritarios: calendario, ruta, alerta, comida, menú, billete, check, templo/cultura, frase, yen, emergencia, tren/IC, maleta, clima, mapa, reloj, teléfono, enlace externo, copiar y ubicación.
- Los iconos heredan `currentColor` y tienen estados activo/inactivo coherentes.
- Emojis se reservan para copy emocional excepcional (por ejemplo, cierre post-viaje), nunca como control ni categoría.
- Estrellas Michelin: usar texto “1 estrella Michelin” o icono vectorial neutro; no repetir `⭐`.

### 3.7 Movimiento

Gramática:

- microinteracción: 140–180 ms;
- cambio de estado/filtro: 180–220 ms;
- entrada de vista: 240–320 ms;
- easing principal: `cubic-bezier(.2,.8,.2,1)`;
- movimiento máximo: 8–12 px; evitar zooms y desplazamientos de 22 px repetidos;
- una pantalla no debe tener más de un movimiento ambiental continuo;
- actualmente se recomienda **cero movimiento ambiental continuo**.

Eliminar:

- aurora global animada;
- tres capas de aurora de splash;
- slideshow a 900 ms;
- glows pulsantes o permanentes;
- animación decorativa de progreso que fuerza cinco segundos de espera.

Mantener/mejorar:

- feedback `pressed` de botones a escala 0.98 solo en piezas grandes;
- crossfade corto de imagen de portada, si existe una única transición;
- expansión de detalles con altura/opacidad sutil;
- respeto integral a `prefers-reduced-motion`.

#### Ceremonias permitidas

1. **Welcome sequence:** 900–1400 ms, fotografía → línea → título → acción. Interrumpible desde el primer frame.
2. **Day reveal:** al abrir un día, el número/ciudad aparecen con un desplazamiento máximo de 8 px y la línea de ruta dibuja únicamente el primer tramo.
3. **Ticket confirmation:** al copiar o confirmar, un filo recorre una vez el contorno y desaparece en menos de 500 ms.
4. **POI reveal:** la imagen conserva continuidad espacial hacia la hero cuando técnicamente sea seguro.
5. **Trip completion:** composición final excepcional, ejecutada una sola vez.

No habrá partículas, confeti, parallax excesivo ni animaciones infinitas. Rolls-Royce no significa casino.

### 3.7.1 Iluminación ambiental

Se recupera la posibilidad de luz, pero bajo reglas distintas de la aurora actual:

- luz integrada en un borde, fotografía o línea de ruta;
- una única fuente visual de luz por viewport;
- radio contenido y baja saturación;
- responde a contexto/estado, no se mueve sin motivo;
- se apaga completamente en reduced motion/contrast si perjudica;
- nunca mezcla rojo, violeta y azul como blob ambiental.

Inspiración conceptual: iluminación orbital de Polestar, no fondo de videojuego.

### 3.8 Especificación de acabados

Esta sección reduce la distancia entre un mockup atractivo y un producto terminado.

#### Bordes

- Borde estándar oscuro: 1 px a 6–8 % de blanco cálido.
- Borde de foco: 2 px, separado 2 px del control.
- Nunca usar 1.5 px salvo iconografía; produce rasterizado inconsistente en superficies.
- No mezclar borde translúcido y sombra si el contraste de superficie ya separa el elemento.

#### Divisores

- Grosor físico de 1 px.
- Comienzan alineados con el contenido textual, no siempre con el borde del viewport.
- En listas con icono, el divisor comienza después del icono.
- No añadir divisor tras el último elemento.

#### Imágenes

- Todas tienen un estado de carga de relación de aspecto fija.
- El placeholder usa el color medio del sistema, no shimmer continuo.
- Error de imagen activa una portada tipográfica sin icono roto.
- El radio de la imagen es igual o dos puntos menor que su contenedor.
- Overlay máximo recomendado: 55 % en el extremo del texto y 0–10 % en el opuesto.

#### Controles

- Altura compacta: 40 px solo para filtros secundarios.
- Altura estándar: 48 px.
- Altura primaria: 52 px.
- Icon button: 44×44 px mínimo.
- Padding horizontal: 16–20 px.
- Label de botón: 14–15 px, peso 600; no 700/800.
- Feedback pressed visible en menos de 100 ms.

#### Cards

- Una card necesita al menos una de estas razones: unidad interactiva, documento independiente, cambio semántico de material o contenido que puede moverse como bloque.
- Una sección meramente textual no es una card.
- Una card no puede contener más de una subcard salvo documentos como billetes.
- Máximo dos radios distintos visibles dentro de una misma card.
- Máximo una card de énfasis por viewport.

#### Tipografía y truncado

- Los nombres de lugar nunca se truncan en la pantalla de detalle.
- En listas, máximo dos líneas antes de truncar; la metadata no compite con el título.
- Horarios y localizadores no se parten.
- Unidades permanecen pegadas al número.
- La viuda de una sola palabra en titulares se corrige mediante ancho o copy cuando sea viable, no con saltos `<br>` rígidos.

### 3.9 Sonido visual por estado

Cada estado tiene una intensidad predeterminada:

| Estado | Tratamiento |
|---|---|
| Reposo | superficie tinta, texto marfil, sin sombra |
| Hover escritorio | aumento de luminosidad de 3–4 %, sin desplazamiento |
| Pressed | escala 0.985 en piezas grandes o fondo más oscuro en filas |
| Focus | anillo claro/rojo según contexto, siempre visible |
| Seleccionado | sello rojo pequeño + contraste de texto |
| Completado | moss discreto + check SVG |
| Pendiente | ámbar + texto explícito |
| Error | signal + explicación y siguiente acción |
| Deshabilitado | contraste reducido, cursor/semántica correctos; nunca opacidad inferior a legibilidad |
| Loading | skeleton estático o pulso único muy suave; sin shimmer perpetuo |

### 3.10 Personalización del viaje sin caer en tematización

Para que se sienta hecho a medida se introducirán datos/recursos del viaje en los lugares correctos:

- nombre de etapa actual en header contextual;
- fotografía de la ciudad actual;
- número de día dentro del total;
- ruta global como elemento de portada;
- próximo hotel/tren cuando sea relevante;
- pequeños captions escritos para este itinerario;
- color de etapa opcional, siempre subordinado al rojo de marca;
- portada posterior al viaje construida con fotos realmente utilizadas.

No se añadirá una personalización ornamental por ciudad. Kioto no recibe automáticamente serif, beige y templos; Osaka no recibe neón; Hiroshima no recibe un tratamiento solemne permanente. La diferencia procede del contenido real y la fotografía.

---

## 4. Arquitectura visual común

### 4.1 App shell

- Fondo estático `ink-950`, con grano sutil opcional.
- Contenido hasta 520 px.
- Safe areas en header y bottom nav.
- El scroll pertenece a la página; evitar scrolls verticales anidados salvo mapa/sheets.
- Barra superior de 56–60 px, pero con tratamiento menos “cristal”: fondo tinta al 92 %, blur de 12 px y borde cálido muy tenue.

### 4.2 Header

Propuesta:

- izquierda: wordmark pequeño “CHELIS / 日本 2026” o “Chelis en Japón” en dos niveles;
- derecha: reloj dual simplificado a una sola lectura principal y segunda ciudad como metadata;
- en pantallas interiores: patrón back + título + acción, común a todas;
- no centrar artificialmente el título usando márgenes mágicos;
- el header puede volverse compacto al hacer scroll, pero no es obligatorio para V2.5.

### 4.3 Bottom navigation

- Mantener cinco destinos por estabilidad funcional.
- Sustituir iconos actuales por el set común.
- Fondo casi opaco, blur discreto y borde superior; sin caja glass evidente.
- Estado activo: icono rojo + pequeño marcador de 3 px o fondo tonal mínimo. No colorear simultáneamente icono, texto, glow y badge.
- Labels a 10–11 px, siempre visibles.
- Badge de alertas con tamaño mínimo legible y borde del color real del fondo.
- “Más” debe usar icono de cuadrícula/menú, no ticket; billetes no es el significado de la pestaña.

### 4.4 Componentes fundacionales a definir antes de pantallas

1. `PageHeader`
2. `SectionHeader`
3. `EditorialHero`
4. `Surface` con variantes `flat`, `raised`, `paper`, `danger`
5. `ActionRow`
6. `PrimaryButton`, `SecondaryButton`, `TextButton`
7. `Chip` y `FilterChip`
8. `StatusBadge`
9. `IconButton`
10. `DataPair`
11. `Timeline`
12. `MediaCard`
13. `EmptyState`, `LoadingState`, `ErrorState`
14. `BottomSheet` o acordeón accesible para detalle móvil

Estos componentes son una consecuencia de la auditoría visual, no una solicitud de reescritura funcional. Deben absorber los estilos hoy duplicados en strings locales.

---

## 5. Especificación por pantalla

### 5.1 Splash / entrada

#### Problema

Actualmente intenta ser cinematográfica mediante acumulación: slideshow rápido, oscurecimiento, tres auroras, scanlines, número gigante, rojo con doble glow, animaciones escalonadas y barra de progreso. Genera impacto inicial, pero se percibe más como intro de plantilla que como portada editorial.

#### V2.5

- Una sola fotografía hero, elegida en función de fase del viaje o rotada por sesión, no cada 900 ms.
- Composición a sangre con gradiente inferior localizado.
- Eyebrow pequeño: `JAPÓN · AGOSTO 2026`.
- Countdown en serif display, peso 500, sin glow.
- “Chelis en Japón” como título editorial; evitar que “TOKIO” represente todo el viaje.
- Botón explícito “Entrar en la guía” o autoentrada corta de 1.8–2.5 s. Nunca bloquear cinco segundos.
- Opción “Saltar” innecesaria si la intro deja de bloquear; si se mantiene, target 44 px.
- Durante el viaje, portada contextual: `Día 07 · Kioto`, foto asociada y CTA `Ver el plan de hoy`.
- Después del viaje, portada emocional estática; emoji opcional solo aquí.

#### Criterios de aceptación

- máximo una foto, un overlay y una animación de entrada;
- sin aurora, scanlines ni text-shadow luminoso;
- primer contenido útil accesible en menos de 2.5 s o con un tap inmediato;
- texto legible sobre todas las fotos seleccionadas;
- no superar el peso actual total de assets precacheados.

### 5.2 Hoy / cuenta atrás

#### V2.5 antes del viaje

- Transformar el contador en una portada editorial, no en un número rojo flotando sobre fondo vacío.
- Número principal en `paper-100`, serif; el rojo aparece en una regla, un punto o el CTA.
- Añadir una mini franja visual del recorrido: Tokio → Hakone → Kioto → Osaka → Hiroshima, sin convertirla en mapa complejo.
- “Preparar viaje” pasa a `ActionRow` con progreso fino, próxima tarea y estado. Evitar otra card genérica de 20 px.
- Mostrar una única recomendación contextual debajo del contador; no llenar la portada de widgets.

#### V2.5 durante el viaje

- Hero del día con foto asociada a ciudad/POI principal, ratio 16:10 y sangrado lateral parcial o total.
- Día y fecha como eyebrow; título en display.
- Acciones `Mapa` y `Ruta` en una banda inferior de la hero, una primaria y otra secundaria.
- Alojamiento como fila compacta con icono, no card completa salvo que haya check-in/out relevante ese día.
- Timeline del día directamente sobre el fondo, con una línea vertical y bloques separados por espacio/reglas. El contenedor `blocks-card` desaparece.
- Hora en columna fija de 48–56 px; actividad y detalle en columna flexible.
- El bloque actual obtiene indicador `Ahora` en rojo; pasado se atenúa; futuro permanece normal.
- Pasos operativos se despliegan como sub-timeline, no como otra lista de mini-cards.

### 5.3 Viaje / selector de días

- El strip de pills actual se convierte en una cinta de calendario más sobria.
- Día activo: número grande, línea roja inferior y nombre de ciudad; evitar una pill roja maciza por cada selección.
- Mostrar continuidad del viaje: pequeñas abreviaturas de ciudad o color secundario por etapa, siempre accesible con texto.
- Mantener sticky, scroll-snap y centrado del día seleccionado.
- Reutilizar exactamente la composición de `TodayView` para el detalle; no crear una variante visual divergente.

### 5.4 Restaurantes

#### Problema

El contenido editorial es rico, pero aparece como una base de datos de cards textuales. La primera impresión son tres filas de chips y un CTA rojo; los restaurantes carecen de ritmo visual, prioridades y señal de selección curada.

#### V2.5

- Header editorial: `Comer en Japón` + subtítulo corto sobre la selección curada.
- El planificador pasa a una action row destacada, no un bloque rojo completo antes del contenido.
- Filtros en una sola fila inicial (`Ciudad`, `Precio`, `Reserva`, `Ocasión`) que abre bottom sheets; como entrega intermedia se pueden mantener chips, pero máximo dos filas visibles.
- Añadir segmento `Selección / Cerca / Todos` si la lógica existente lo permite; si requiere producto nuevo, queda fuera del primer corte.
- Primer restaurante destacado con `MediaCard` fotográfica solo cuando exista imagen local verificada.
- Cards estándar más planas: nombre, barrio, especialidad, precio y distancia; tags secundarios limitados a dos más contador `+N`.
- El detalle no debe expandir una card infinita dentro de la lista. Preferencia: sheet o vista de detalle con fotografía, “por qué ir”, “qué pedir”, datos prácticos y CTA de reserva.
- “Qué pedir” tratado como recomendación editorial con numeración 01/02/03, no cajas dentro de cajas.
- Michelin se expresa de forma tipográfica y sobria.
- Fuentes/fecha de verificación accesibles en detalle sin competir con la decisión principal.

#### Sin imagen

Nunca inventar ni descargar una foto genérica del plato. Usar composición tipográfica: número editorial, nombre japonés confirmado, barrio y una franja de color cálido.

### 5.5 Más / herramientas

#### Problema

El grid 2×4 de emoji, texto y chevron es el patrón que más claramente parece autogenerado.

#### V2.5

- Sustituir el launcher uniforme por grupos con intención:
  - **En movimiento:** billetes, Suica, llegar al hotel;
  - **En Japón:** frases, moneda, clima;
  - **Antes y cultura:** preparación, guía cultural;
  - **Ayuda:** emergencias, siempre visible y diferenciada.
- Billetes mantiene prioridad, pero como hero utilitaria oscura con ruta próxima o siguiente reserva, no un rectángulo rojo genérico.
- Herramientas como filas de 56–64 px con SVG, label, descripción corta y chevron; se permiten dos piezas destacadas en formato horizontal.
- Emergencias utiliza color `signal`, no el rojo de marca, y no se mezcla visualmente con utilidades casuales.
- Eliminar todos los emojis de este menú.

### 5.6 Billetes

- Tratar cada reserva como documento operativo, inspirado en boarding pass sin imitar literalmente un billete.
- Vuelos: códigos de aeropuerto como dato dominante; horario y fecha en columna; PNR en bloque de copiar con feedback claro.
- Hoteles: nombre y ciudad; dirección accionable; fechas en retícula; localizador visualmente protegido pero legible.
- Trenes: ruta y estado primero; datos de coche/asiento después.
- Reducir radios y sombras; separar reservas con espacio y numeración, no con una colección de cards idénticas.
- Estado `pendiente` en ámbar, `reservado` en moss, error real en signal.
- El botón de copiar debe usar icono SVG y texto temporal `Copiado`, con región `aria-live`.
- Los datos críticos siguen disponibles offline y no se ocultan en acordeones.

### 5.7 Alertas

- Jerarquizar por gravedad y vigencia, no solo por borde/color.
- Estructura: icono semántico, label de severidad, título, fecha, acción.
- Alertas informativas planas; atención con borde lateral ámbar; críticas con superficie signal tonal.
- Evitar card completa para cada aviso leído; los leídos pueden ser filas compactas.
- Empty state sereno y útil, sin emoji grande de plantilla.

### 5.8 POI detail

- Esta pantalla debe convertirse en la pieza más editorial del producto.
- Imagen hero 4:5 o 16:10 según foto, con back flotante sobrio y caption/atribución.
- Título, nombre japonés confirmado, ciudad y categoría fuera de una card.
- “Por qué importa” como lead de 18–20 px.
- Historia y contexto en cuerpo de 16/25, con subtítulos serif.
- Datos de visita en módulo compacto y contrastado; mapa/ruta como CTA persistente o cercano al primer viewport.
- Fuentes al final como notas editoriales, no como chips.
- Sin imagen: portada tipográfica elegante, nunca placeholder degradado con icono genérico.

### 5.9 Mapa

- Mantener Leaflet y OSM.
- Oscurecer/armonizar controles propios, pero no aplicar filtros CSS que comprometan legibilidad del mapa.
- Sheet inferior para resumen de ruta/POI con radio superior 20 px; una única superficie flotante dominante.
- Pins propios minimalistas en rojo, hotel en marfil/moss y posición del usuario en azul estándar por convención.
- Estados de carga y error dentro del sheet, no banners flotantes múltiples.
- Botón de centrar ubicación, zoom y back comparten tamaño/iconografía.

### 5.10 Planner de comidas

- Priorizar calendario/slots sobre cards de configuración.
- Días como secciones; comida y cena como dos filas consistentes.
- Asignado: restaurante + barrio + estado de reserva.
- Vacío: CTA discreto `Elegir restaurante`, no gran superficie punteada si no aporta.
- Guardado/sincronización visible como metadata pequeña; error de sync persistente y accionable.
- El diseño debe aguantar nombres largos y funcionar a 320 px.

### 5.11 Preparación

- Convertir checklist en lista real con secciones por urgencia o fecha.
- Checkbox custom accesible, no emoji.
- Progreso global integrado bajo el título.
- Críticas/vencidas con indicador signal; próximas con ámbar; completas atenuadas, no verdes brillantes completas.
- Dependencias y responsable como metadata, no nuevos chips para cada atributo.

### 5.12 Guía cultural, frases, clima, Suica, última milla, moneda y emergencias

El molde compartido `travel-card` debe dejar de dominar el contenido. Cada herramienta conserva shell común, pero recibe una composición acorde a su tarea:

- **Cultura:** índice editorial + artículos, listas solo cuando el contenido lo pida.
- **Frases:** frase japonesa como protagonista en gran tamaño, lectura y español debajo; modo mostrar conserva alto contraste.
- **Clima:** tabla/strip por ciudad y kit de calor; aviso de normales históricas como nota editorial, no card de peligro.
- **Suica:** guía paso a paso numerada, con acción más inmediata fijada arriba.
- **Última milla:** secuencia de trayecto con estaciones y decisiones; no párrafos en cards.
- **Moneda:** conversión como herramienta dominante y referencia rápida debajo; teclado y números tabulares.
- **Emergencias:** números críticos siempre visibles, CTAs telefónicos grandes y color semántico; máxima sobriedad.

---

## 6. Copy y tono visual

El aspecto profesional también depende de la microcopy.

- Usar frases directas: `Abrir mapa`, `Copiar localizador`, `Ver ruta`, `Llamar`.
- Evitar entusiasmo genérico repetido, puntos suspensivos decorativos y exclamaciones constantes.
- Mantener personalidad en momentos concretos: splash, cuenta atrás y cierre del viaje.
- Sustituir `Billetes & Localizadores` por `Billetes y reservas` salvo razón editorial para mantener el anglicismo visual.
- Unificar Tokio/Kioto frente a Tokyo/Kyoto en UI española; los identificadores internos pueden permanecer.
- Unificar flechas con iconografía; no mezclar `→`, `›`, `↗` y chevrons SVG sin reglas.
- Revisar mojibake (`JapÃ³n`, `MÃ¡s`, etc.) en entornos/build como control de calidad, aunque parte de lo observado puede proceder de la consola usada para la auditoría.

---

## 7. Responsive, accesibilidad y rendimiento

### 7.1 Responsive

Validar al menos:

- 320×568;
- 360×800;
- 390×844;
- 430×932;
- escritorio a 1024 px para comprobar que el shell no parece accidental.

No debe existir scroll horizontal excepto cintas y filtros que lo indiquen visualmente. Los títulos largos pueden ocupar dos líneas; nunca reducirlos por debajo de la escala para forzar una sola.

### 7.2 Accesibilidad

- AA como mínimo.
- Targets de 44×44 px.
- Focus visible, no eliminado en favor de estética.
- Estado no comunicado solo por color.
- Orden de lectura idéntico al visual.
- Sheets con focus trap, cierre Escape y retorno de foco.
- Contenidos desplegables con `aria-expanded` y teclado.
- `aria-live` para copiar/guardar/error de sincronización.
- Serif display nunca para párrafos pequeños ni datos críticos.
- Soporte para `prefers-reduced-motion` y, si es viable, `prefers-contrast`.

### 7.3 Rendimiento/offline

- Fuentes locales en WOFF2 variable y subset cuando sea legal/técnicamente viable; presupuesto recomendado total ≤ 180 KB.
- Grano/texturas ≤ 20 KB.
- Nuevas fotos curadas en WebP/AVIF con fallback según compatibilidad del PWA; no superar aproximadamente 250 KB por hero móvil salvo justificación.
- Reservar dimensiones para evitar layout shift.
- Mantener precache selectivo; no precachear un catálogo fotográfico completo si hace crecer excesivamente la instalación.
- No añadir bibliotecas de animación para esta intervención.
- Lighthouse móvil orientativo tras build: Performance ≥ 85, Accessibility ≥ 95, sin regresión grave respecto al baseline medido al iniciar implementación.

---

## 8. Estrategia de implementación propuesta

### Fase 0 — Baseline y aprobación visual

Antes de tocar producción:

1. Capturar todas las pantallas en 390×844 y estados relevantes.
2. Medir Lighthouse, peso del build y assets.
3. Crear tres mockups de alta fidelidad: Splash, Hoy durante viaje, Restaurantes.
4. Aprobar paleta, pareja tipográfica, tratamiento de foto y densidad.
5. Construir una página interna de muestra con tokens/componentes esenciales.

**Puerta V2.5-A:** no migrar pantallas hasta aprobar los tres mockups como una familia coherente.

### Fase 1 — Fundamentos (impacto alto, riesgo bajo/medio)

- tokens de color, tipografía, espaciado, radio, borde, sombra y motion;
- fuentes locales;
- fondo sin aurora;
- set de iconos;
- botones, chips, surface, rows, headers y estados;
- shell, header y bottom nav;
- unificación progresiva de estilos compartidos.

**Puerta V2.5-B:** Storybook no es obligatorio; sí una ruta/dev page o capturas de todos los estados fundamentales.

### Fase 2 — Pantallas identitarias

1. Splash.
2. Hoy / DayCard / Viaje.
3. POI detail.
4. Restaurantes.
5. Más.

Estas cinco áreas determinan la percepción global. No conviene pulir primero pantallas secundarias.

### Fase 3 — Pantallas operativas

1. Billetes.
2. Alertas.
3. Mapa.
4. Planner.
5. Preparación.

### Fase 4 — Herramientas editoriales

- Cultura, frases, clima, Suica, última milla, moneda y emergencias.
- El objetivo es reutilizar el shell y los componentes ya validados sin volver a una única card universal.

### Fase 5 — QA visual y poda

- matriz de viewports;
- modo offline;
- reduced motion;
- contraste y teclado;
- textos largos/datos nulos/errores;
- eliminar CSS muerto y estilos locales sustituidos;
- comparar capturas antes/después;
- revisar que ninguna pantalla recupere emojis o glows por atajo.

---

## 9. Priorización por retorno visual

### P0 — Cambia inmediatamente la percepción

- eliminar aurora global y sobreproducción de splash;
- introducir tipografía editorial;
- sustituir emojis por SVG;
- reducir radios/sombras y dejar de encerrar todo en cards;
- rediseñar Hoy, Restaurantes y Más;
- reservar el rojo para una jerarquía clara.
- construir las cuatro firmas visuales, incluida la joya técnica;
- producir al menos dos momentos de espectáculo controlado en el primer corte.

### P1 — Consolida profesionalidad

- centralizar componentes visuales;
- rediseñar POI y billetes;
- jerarquía semántica de estados;
- tratamiento fotográfico y captions;
- unificar headers y navegación interior.

### P2 — Pulido

- textura sutil;
- transiciones de expansión;
- estados vacíos propios;
- ajustes de escritorio;
- microcopy y consistencia de flechas/capitalización.

### Quick wins si se necesita una V2.5a pequeña

Sin alterar estructura de pantallas:

1. Quitar aurora global, violeta y glows.
2. Cambiar fondo/textos a tinta + marfil.
3. Reducir `radius-card` de 20 a 14 px y sombras.
4. Incorporar display serif en títulos.
5. Reemplazar emojis del menú Más.
6. Limitar rojo en CTAs y selección.
7. Hacer la splash estática y más corta.
8. Cambiar el icono de la pestaña Más.

Estos cambios mejorarían la percepción, pero no sustituyen la intervención profunda: la monotonía de cards seguiría presente.

---

## 10. Criterios globales de aceptación

La V2.5 se considera terminada cuando:

1. Las cinco pantallas principales parecen pertenecer inequívocamente al mismo sistema.
2. La UI se reconoce sin depender de aurora, glass o emojis.
3. En una captura de Hoy existe un único foco dominante y no más de una card elevada en el primer viewport.
4. Ningún control primario usa emoji.
5. Ninguna pantalla normal usa glow decorativo permanente.
6. El rojo tiene función clara y no domina la superficie.
7. Los títulos editoriales y los datos operativos tienen voces tipográficas distintas pero compatibles.
8. El usuario encuentra plan actual, mapa/ruta y billetes críticos en menos de 10 segundos.
9. La app sigue funcionando offline con los mismos contenidos esenciales.
10. Se validan 320, 390 y 430 px sin clipping ni texto inaccesible.
11. Todos los targets críticos miden al menos 44×44 px.
12. La reducción de movimiento elimina toda animación no esencial.
13. Las fotos tienen atribución, crop curado y fallback sin imagen.
14. No se introduce japonismo decorativo ni contenido inventado.
15. El build, validadores de datos y pruebas existentes continúan en verde.
16. Ninguna pantalla secundaria parece menos terminada que Hoy o Splash.
17. Todos los estados de cada componente —vacío, loading, error, offline, activo, pressed y focus— están diseñados.
18. En el primer viewport, al menos el 35 % del espacio puede permanecer visualmente tranquilo; no todo debe contener información o decoración.
19. Cada pantalla supera una revisión a escala 100 % en dispositivo real, no solo en captura de escritorio.
20. Las alineaciones principales presentan una tolerancia máxima de 1 px respecto a su columna declarada.
21. No existe ningún valor visual arbitrario nuevo fuera de tokens sin comentario/justificación.
22. El usuario puede distinguir marca, éxito, pendiente y peligro sin depender solo del color.
23. El modo offline mantiene la misma dignidad visual; no aparece como una versión degradada del producto.
24. Splash, Hoy y POI detail proporcionan el efecto memorable; el resto prioriza serenidad.
25. En revisión ciega, “calidad”, “solidez” o “cuidado” deben aparecer antes que “efectos” o “llamativo”.
26. Al menos tres detalles pueden ser identificados por los evaluadores como “especiales” o “hechos a medida”.
27. La dimensión bespoke se sustenta en datos/fotos reales de este viaje, no solo en escribir el nombre de los viajeros.
28. Champagne/titanium no superan sus presupuestos visuales ni degradan contraste.
29. Cada ceremonia puede omitirse/interrumpirse y tiene alternativa reduced-motion.
30. Ningún viewport contiene más de una joya técnica protagonista.
31. La Gallery personal parece parte estructural del producto y no un banner promocional.
32. Los billetes principales tienen una composición reconocible propia sin imitar una app Wallet.

### 10.1 Auditoría de acabado por componente

Cada componente se considera terminado solo si se ha revisado:

- alineación óptica del icono;
- baseline de texto y números;
- título de una y dos líneas;
- contenido mínimo y máximo;
- datos `null`;
- textos en español con tildes;
- 320 y 430 px;
- zoom de texto al 200 % donde aplique;
- navegación por teclado;
- focus, pressed y disabled;
- reduced motion;
- carga lenta/offline;
- contraste;
- radio exterior/interior;
- ausencia de layout shift;
- copy de error y recuperación.

### 10.2 Revisión «cierra la puerta»

El equivalente digital a cerrar la puerta de un coche y percibir solidez será una revisión específica de microinteracciones:

- tap produce respuesta inmediata y contenida;
- cambios de vista no parpadean;
- acordeones no saltan;
- el scroll no pierde posición accidentalmente;
- copiar/guardar confirma sin toast estridente;
- volver devuelve al punto correcto;
- el teclado móvil no tapa el resultado;
- los sheets se detienen con una curva natural;
- no existen dobles bordes, píxeles sueltos ni radios incompatibles.

Una UI puede verse premium en estático y sentirse barata al tocarla. Esta revisión es obligatoria.

### Test cualitativo recomendado

En una revisión ciega con 5 personas, mostrar durante 8 segundos capturas de Splash, Hoy, Restaurantes y Más, sin explicar el proyecto. Objetivos:

- al menos 4/5 describen el producto como “guía de viaje” o equivalente;
- al menos 4/5 perciben que está diseñado para un viaje concreto;
- máximo 1/5 usa espontáneamente “plantilla”, “dashboard”, “IA” o “app genérica”;
- al menos 3/5 mencionan “editorial”, “cuidado”, “cálido”, “premium” o equivalente sin que esas palabras se sugieran.
- al menos 3/5 perciben “lujo” o “producto especial” sin mostrarles las referencias automovilísticas;
- ninguna persona describe el acabado como “ostentoso”, “casino”, “gaming” o “dorado”.

---

## 11. Riesgos y decisiones pendientes

### Riesgos

- **Serif mal elegida:** puede convertir lo editorial en “lujo genérico”. Debe probarse sobre español, números y nombres japoneses.
- **Demasiada fotografía:** puede elevar peso y reducir utilidad offline. Solo usar donde aporte jerarquía.
- **Cozy demasiado claro:** cambiar a una interfaz crema completa rompería la identidad y podría molestar de noche. El marfil es acento/superficie puntual.
- **Refactor visual invasivo:** mover todo el CSS a la vez puede introducir regresiones. Migración por componentes con capturas.
- **Confundir diseño con tematización:** símbolos japoneses literales no sustituyen una buena retícula.
- **Rediseñar sin datos de estados:** billetes, alertas y planner requieren revisar casos reales, vacíos, pendientes y error antes de maquetar.

### Decisiones que requieren aprobación del propietario

1. Pareja tipográfica final: `Newsreader + Inter` (recomendada) u otra.
2. Intensidad del cambio: V2.5 profunda o V2.5a rápida seguida de migración.
3. Portada: foto fija curada o foto contextual por fase/ciudad.
4. Restaurantes: mantener expansión inline o introducir detalle/sheet.
5. Shell oscuro permanente o habilitar más adelante un tema diurno; tema diurno queda fuera de esta V2.5 por defecto.
6. Wordmark definitivo del header.
7. Nivel de calidez: `dark cabin` recomendado frente a una interpretación más clara tipo revista.
8. Selección de 8–12 fotografías hero que soportarán el sistema completo.
9. Intensidad Rolls-Royce: detalle champagne mínimo o presencia más visible en portada/billetes.
10. Contenido que ocupará la Gallery personal en cada fase del viaje.

---

## 12. Fuera de alcance

- Cambiar lógica, datos o fuentes editoriales.
- Añadir recomendaciones dinámicas.
- Rediseñar el mapa base o migrar Leaflet.
- Crear una marca corporativa completa.
- Introducir login, perfiles o personalización de tema.
- Reescribir el frontend en otro framework.
- Añadir animación 3D, vídeo pesado o librerías de motion.
- Usar imágenes generadas por IA como sustituto de fotografías reales del destino.

---

## 13. Definición corta de la V2.5

> Chelis en Japón deja de ser una colección de cards oscuras “premium” y pasa a sentirse como una pieza de viaje construida por encargo: arquitectura Polestar, ceremonia Rolls-Royce, fotografía cinematográfica, instrumentación precisa y una Gallery personal. Menos efectos genéricos; más espectáculo controlado.

### Manifiesto de una frase

> Debe sentirse como entrar en un Polestar encargado por Rolls-Royce: la estructura es limpia, tecnológica y exacta; después la luz, los materiales, la ceremonia y los detalles bespoke dejan claro —sin ninguna falsa modestia— que estás dentro de algo excepcional.

---

## 14. Referencias públicas para calibración

Estas referencias sirven para discutir cualidades concretas, no para copiar sus interfaces:

- [Volvo Cars — dirección de diseño](https://www.volvocars.com/fr-be/media/press-releases/86465A7A1DE21670/): autoridad tranquila, inteligencia, solidez, precisión y cuidado del detalle.
- [Volvo Cars — Swedish luxury](https://www.volvocars.com/intl/media/press-releases/754C89CC6A5D2098/): belleza silenciosa, espacio, tiempo, confianza, calidez y funcionalidad inteligente frente al lujo ostentoso.
- [Polestar — identidad Pure, Progressive, Performance](https://www.polestar.com/uk/news/journal-1/): minimalismo de producto, innovación científica, contraste monocromo y atención sin compromisos al detalle.
- [Polestar 4 — interior](https://www.polestar.com/en-ca/polestar-4/interior/): materiales técnicos, iluminación inspirada en el sistema solar y “star knit” integrado; referencia para luz/material, no para copiar su interfaz.
- [Rolls-Royce Phantom — The Gallery](https://www.rolls-roycemotorcars.com/en_US/showroom/phantom-in-detail.html): arte bespoke integrado en la arquitectura del habitáculo; base conceptual de la Gallery personal.
- [Monocle City Guides](https://monocle.com/travel-guides/): estructura editorial, selección curada e identidad de guía.
- [Kinfolk](https://www.kinfolk.com/): fotografía, aire y ritmo contemplativo.
- [Aesop](https://www.aesop.com/): materialidad, sobriedad y control tipográfico.
- [Airbnb](https://www.airbnb.com/): patrones móviles comprensibles e imágenes de lugar al servicio de la decisión.
- [Time Out Tokyo](https://www.timeout.com/tokyo): densidad editorial y descubrimiento urbano; no se toma su densidad comercial.
- [Japan Travel — JNTO](https://www.japan.travel/en/): fotografía auténtica y relación entre inspiración e información práctica.

La combinación buscada no es “web de coches + web de Japón”. Es **arquitectura Polestar, ceremonia Rolls-Royce y contenido real de un viaje irrepetible**.

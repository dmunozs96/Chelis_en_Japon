# HANDOVER 16 — Plan director V2

> Fecha: 2026-07-15 | Estado: arquitectura documentada; implementación no autorizada

## Objetivo de esta sesión

Definir una V2 que profundice las funciones actuales y combine estas nuevas líneas:

1. Checklist operativo durante los 28 días anteriores al viaje.
2. Guía cultural y gastronómica con profundidad editorial comparable a una guía de viaje.
3. Guía de compras vinculada al itinerario y a un día libre.
4. Mapas y rutas más legibles y útiles.
5. Ampliación verificada de 32 a un mínimo de 400 restaurantes.
6. Evolución futura hacia Modo Ahora, itinerario vivo, planes alternativos y clima contextual.

## Entregable creado

- `PLAN_V2.md`: plan director completo, con visión, dominios, modelos conceptuales, fuentes, criterios editoriales, fases, riesgos, puertas de aprobación y decisiones pendientes.

No se han modificado componentes, datos, API, Constitución ni SPEC. La instrucción expresa del propietario es permanecer en fase de arquitectura hasta nueva autorización.

## Decisiones consolidadas

### Preparación

- La Vista Hoy tendrá un estado previo al viaje y existirá una pantalla completa de preparación.
- Las tareas tendrán vencimiento, prioridad, responsable, dependencias, evidencia, sensibilidad y fuentes.
- Se cubrirán documentación, frontera, seguro, salud, medicación, reservas, conectividad, dinero, equipaje, gadgets, electricidad y outfits.
- Pasaportes, pólizas, medicación y documentos nunca se almacenarán en Git.

### Guía editorial

- El contenido debe estar conectado con los días, lugares y situaciones reales del itinerario.
- Se incorporarán cultura cotidiana, etiqueta, templos/santuarios, onsen/ryokan, comida, bebida y cocina regional.
- La interfaz deberá usar profundidad progresiva; no convertir la app en paredes de texto.

### Restaurantes

- Objetivo mínimo: 400 fichas, concentradas en Tokio, Kioto, Osaka, Hiroshima/Miyajima y Hakone.
- Los 32 registros actuales deben reauditarse; no se consideran correctos por existir.
- Mercados, calles o agrupaciones no cuentan como restaurantes individuales.
- El top 50 tendrá fichas profundas, doble fuente, «qué pedir», reserva, etiqueta e imagen legalmente reutilizable o integración admitida.
- El crecimiento será por lotes: auditoría → 50 → 150 → 250 → 400.
- Cero invenciones, URLs fabricadas, reseñas copiadas o imágenes sin derechos documentados.

### Imágenes

- No descargar ni guardar «imágenes de Google» en el repositorio.
- Google Places restringe almacenamiento y exige atribuciones y enlaces al original.
- Prioridad: imagen oficial licenciada, Wikimedia/licencia compatible, foto propia, integración online aprobada o fallback editorial.

### Compras

- El día candidato es el 24 de agosto, libre en Tokio.
- Estudiar tres rutas: Ginza–Yurakucho; Shibuya–Harajuku–Shinjuku; outlet de día completo.
- Gotemba es una alternativa a evaluar, no una decisión tomada.
- Comparar ahorro total, tax-free, garantía, compatibilidad, equipaje y aduana, no solo euro/yen.

### Mapas

- La polilínea recta actual no es una ruta real.
- Comparar una mejora conservadora de Leaflet/GeoJSON con migración a MapLibre/PMTiles.
- No precachear teselas de `tile.openstreetmap.org`; su política no permite uso offline.
- La app conservará instrucciones críticas offline y delegará navegación viva en una app externa.

### Constitución

La V2 entra en conflicto con límites del MVP: equipaje y clima estaban fuera de alcance; el backend estaba limitado al planificador; no se admitían APIs de pago; Leaflet era mandatario. No modificar `CONSTITUTION.md` hasta que el propietario apruebe las nuevas decisiones.

## Investigación ya realizada

El plan enlaza fuentes actuales consultadas el 15 de julio de 2026:

- Ministerio de Exteriores de España: requisitos para Japón.
- MOFA Japón: exención de visado.
- Ministerio de Sanidad: recomendaciones sanitarias individualizadas.
- MHLW y Japan Customs: importación de medicación y trámites aduaneros.
- JNTO: etiqueta, gastronomía y compras.
- Gotemba Premium Outlets: tamaño y accesos.
- Google Places: almacenamiento y atribución de fotografías/reseñas.
- OSM Foundation y Protomaps: teselas y alternativas offline.

No asumir que los datos investigados permanecen vigentes: todos los datos sensibles o volátiles deben revalidarse antes de publicarse y antes del viaje.

## Cómo continuar en otra sesión

### Paso 1 — Recuperar contexto

Leer, en este orden:

1. `CONSTITUTION.md`
2. `README.md`
3. `SPEC.md`, especialmente funcionalidades, advertencias y deuda
4. `PLAN_V2.md` completo
5. Este `HANDOVER_16.md`

Después inspeccionar `data/trip.json`, `data/restaurants_db.json`, `data/travel_tools.json`, `client/src/App.jsx`, `TodayView.jsx`, `MapView.jsx`, `RestaurantsView.jsx`, `PlannerView.jsx` y `server/routes/planner.js`.

### Paso 2 — Confirmar autorización y alcance

Antes de escribir código, preguntar o confirmar qué fase ha aprobado el propietario. Si solo aprueba seguir diseñando, producir estos tres documentos:

1. Contrato editorial y de fuentes.
2. Especificación de datos, sincronización y privacidad.
3. Backlog ejecutable con entregas, dependencias, estimaciones y pruebas.

No poblar restaurantes ni cambiar pantallas hasta recibir autorización explícita de ejecución.

### Paso 3 — Resolver decisiones de Puerta A

Recoger del propietario:

- datos personales que se pueden guardar/sincronizar;
- aceptación o rechazo de APIs y costes;
- intereses, marcas y presupuesto de compras;
- restricciones alimentarias y alergias;
- presupuesto gastronómico y restaurantes premium;
- prioridad calidad/cantidad para las 400 fichas;
- ruta preferida para el 24 de agosto.

### Paso 4 — Si se autoriza ejecutar

Orden recomendado:

1. Auditar reservas y tareas críticas previas.
2. Auditar los 32 restaurantes actuales contra el nuevo contrato.
3. Proponer y aprobar la enmienda de `CONSTITUTION.md`.
4. Definir esquemas y validadores antes de cargar contenido.
5. Implementar checklist y preparación.
6. Crear guía cultural/gastronómica esencial y top 50.
7. Implementar Modo Ahora básico.
8. Prototipar ambas alternativas de mapa y decidir con evidencia.
9. Escalar restaurantes por lotes auditables.

### Paso 5 — Controles antes de cada publicación

- Ejecutar `npm run check`.
- Comprobar `git diff --check`.
- Probar viewport móvil y modo avión.
- No incluir datos personales, claves o documentos.
- Validar URLs, coordenadas, duplicados, fechas, fuentes y derechos de imagen.
- Actualizar `SPEC.md`, `README.md`, `CONSTITUTION.md` y el siguiente handover cuando corresponda.

## Estado del repositorio al cerrar

- Rama principal: `master`.
- `PLAN_V2.md` y `HANDOVER_16.md` son los únicos archivos de esta entrega.
- `.claude/` es contenido no versionado ajeno a esta entrega y no debe incluirse.
- No hay cambios funcionales que requieran ejecutar build o tests; se valida formato Git y alcance del commit.


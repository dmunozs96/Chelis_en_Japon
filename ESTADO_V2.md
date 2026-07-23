# Estado del proyecto y cierre funcional de V2

> Corte: 2026-07-23 · Fuente de verdad funcional: código y datos del repositorio · Verificación: `npm.cmd run check`

## Resumen ejecutivo

La aplicación base está operativa y construye correctamente como PWA. La V2 está **parcialmente funcional**: ya cubre preparación, contenido cultural, compras, reservas de tren, itinerario reconciliado y el Top 50 gastronómico. Aún no puede considerarse cerrada porque faltan las funciones de decisión durante el viaje, parte de la escala gastronómica y las pruebas operativas en dispositivos reales.

El siguiente objetivo no es ampliar contenido indiscriminadamente, sino cerrar un recorrido mínimo utilizable durante el viaje: **Ahora → qué toca → cómo llegar → alternativa → dónde comer → estado compartido**.

## Estado verificable

### Producto y datos

- 13 días de itinerario, con 5 trenes interurbanos confirmados y reconciliados con el plan diario.
- 24 POIs con ficha y coordenadas.
- 200 restaurantes profundos: Tokio 72, Kioto 46, Osaka 46, Hiroshima 31 y Hakone 5; 17 fichas etiquetadas como «sobre la marcha».
- 14 tareas/alertas de preparación visibles y 14 tareas en el checklist.
- 7 temas de guía cultural.
- Guía de compras funcional: 7 categorías, 25 tiendas y 4 rutas.
- Herramientas de viaje: 25 frases, 6 accesos de último kilómetro, emergencias, Welcome Suica, conversor y clima editorial.
- Planificador gastronómico compartido mediante API y PostgreSQL cuando existe `DATABASE_URL`.
- PWA instalable con caché del shell, datos e imágenes; mapas base y sincronización siguen necesitando red.

### Calidad técnica

`npm.cmd run check` pasa el 23 de julio:

- validación de datos: correcta;
- tests automatizados: 2/2;
- build Vite: correcto;
- service worker: 76 recursos y unos 8,5 MiB precacheados.

Queda una vulnerabilidad alta reportada en dependencias del cliente. No se ha aplicado `npm audit fix` automáticamente porque puede cambiar versiones y requiere revisión separada.

## Matriz V2

| Dominio | Estado | Qué existe | Qué falta para cierre |
|---|---|---|---|
| A. Preparación | Funcional, pendiente de prueba | Cuenta atrás, checklist local, contenido crítico y alertas | Revisar contenido sensible y probar persistencia/uso en ambos móviles |
| B. Modo Ahora | Básico funcional | Subpaso vigente, siguiente acción, accesos contextuales y Plan B en 8 conexiones críticas | Estado compartido con hora visible, incidencias y prueba de uso real |
| C. Cultura | Funcional | 7 temas trazables y fichas de 24 POIs | Revisión editorial humana final; ampliar solo si cubre un hueco real |
| D/G. Gastronomía | Parcial | 200 fichas profundas, filtros básicos, «sobre la marcha» y planificador | Comer ahora; búsqueda/filtros F19; abierto hoy; mapa; precio aproximado en euros; revalidación final de agosto |
| E. Compras | Funcional | Guía profunda, tiendas, checklists y 4 rutas | Integrar mejor las rutas con el día elegido y hacer revisión final de datos volátiles |
| F. Mapas y trayectos | Parcial | Leaflet, GPS, POIs y línea recta por orden de visita | GeoJSON real en tramos críticos, navegación/degradación clara y prueba offline |
| H. Clima, reservas y alertas | Parcial | Clima editorial, billetes, alertas y accesos | Clima contextual en Ahora; confirmar Mizunoto; comprar/reservar N'EX al llegar |
| Offline/operación | Parcial | PWA y caché automatizada | Ensayo de instalación, actualización y modo avión en los dos móviles |

## Qué falta para una V2 funcional

### P0 — Imprescindible antes del viaje

1. ✅ **Modo Ahora básico.** Subpaso vigente, siguiente acción y accesos rápidos a lugar, billetes, comida y mapa.
2. ✅ **Plan B en conexiones críticas.** Ocho bloques de Narita, Hakone y shinkansen tienen condición y acción explícitas.
3. **Comer ahora mínimo.** Filtrar por ciudad o etapa, franja, día de cierre, precio y necesidad de reserva; indicar cuándo el dato es incierto.
4. **Estado compartido comprensible.** Conservar last-write-wins, pero mostrar última actualización, origen remoto/local y degradación sin red.
5. **Rutas críticas reales.** Sustituir las líneas rectas por GeoJSON contrastado en los trayectos donde equivocarse tenga coste: llegadas con equipaje, conexiones de Hakone y accesos sensibles.
6. **Prueba operativa en dos móviles.** Instalar, actualizar, abrir en modo avión, comprobar datos críticos, privacidad local y recuperación al volver la red.
7. **Cierre operativo de reservas.** Confirmar shuttle/cena/tatuajes de Mizunoto y mantener explícito el procedimiento del N'EX.

### P1 — Completa el alcance aprobado

1. Revalidar las 200 fichas durante la ventana final del 3 al 10 de agosto.
2. Implementar F19: texto libre, barrio, plato, «abierto hoy», franja, mapa de resultados y precio aproximado en euros.
3. Revalidar Top 50 y contenido volátil entre el 3 y el 10 de agosto.
4. Revisar editorialmente cultura, compras y planes alternativos.
5. Congelar contenido y repetir `npm run check` antes del despliegue final.

### Fuera del cierre V2

- Migración a MapLibre/PMTiles.
- Objetivo antiguo de 400 restaurantes.
- Diario automático, recorrido real y exportación del viaje.
- Rediseño visual V2.5: tiene documentación propia y no es requisito para declarar funcional la V2.

## Orden recomendado de ejecución

1. ✅ Modo Ahora + contrato de Plan B.
2. Comer ahora mínimo + estado de sincronización visible.
3. GeoJSON de rutas críticas.
4. Ensayo en dos móviles y correcciones derivadas.
5. Escala gastronómica y F19.
6. Revalidación, congelación y build final.

## Riesgos abiertos

- No hay prueba automatizada de componentes ni recorrido end-to-end; los 2 tests actuales protegen datos y cuenta atrás, no la interacción.
- El mapa base no funciona offline y la ruta actual conecta POIs con líneas rectas.
- La sincronización del planificador depende de red y PostgreSQL.
- Los horarios/cierres de agosto y la política de Mizunoto siguen siendo datos volátiles.
- `SPEC.md` conserva deuda histórica de numeración y duplicación del itinerario; no debe usarse su sección narrativa como fuente de horarios frente a `data/trip.json`.

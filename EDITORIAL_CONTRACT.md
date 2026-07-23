# Contrato editorial y de fuentes V2

> Versión 1.0 · 15 de julio de 2026 · Aplica a `data/restaurants_db.json`

## Principios

Cada ficha debe identificar una entidad real e inequívoca, separar hechos de criterio editorial y permitir reconstruir cuándo y con qué fuentes se verificó. Un dato desconocido se expresa como `null` o como pendiente; nunca se completa por inferencia.

## Campos obligatorios de control

| Campo | Valores / regla |
|---|---|
| `entity_type` | `restaurant`, `food_area`, `market` o `food_hall` |
| `verification_status` | `verified`, `partial`, `needs_review` o `closed` |
| `last_verified_at` | Fecha ISO de la última comprobación sustantiva |
| `revalidate_on` | Fecha ISO de la próxima revisión |
| `name_ja` | Nombre japonés confirmado o `null`; nunca transliterado de memoria |
| `verified_fields` | Lista explícita de grupos comprobados |
| `closure_risk` | `low`, `medium` o `high` |
| `source_count` | Debe coincidir con la longitud de `sources` |

Los grupos admitidos en `verified_fields` son `identity`, `operating_status`, `location`, `hours`, `closed_days`, `reservation_policy`, `price`, `menu` y `accessibility`.

## Fuentes

Cada fuente requiere `name`, URL HTTP(S), `source_type` (`official` o `reference`) y `accessed_at`. La web oficial prima para identidad, dirección, horarios, cierres y reservas. Las fuentes de referencia pueden complementar contexto, reconocimiento y platos, pero no deben contradecir una fuente oficial más reciente.

Las 200 fichas objetivo son fichas profundas y siguen un único estándar. Cada una necesita al menos dos fuentes, incluyendo una fuente oficial concreta siempre que exista, y evidencia trazable para «qué pedir». Una portada genérica de cadena no verifica una sucursal. `source_count` es un control de integridad, no una valoración de calidad.

## Definición de ficha publicable

Una ficha cuenta para el objetivo de 200 únicamente si:

1. identifica establecimiento y sucursal sin ambigüedad;
2. confirma que sigue operando;
3. registra dirección y coordenada de puerta contrastadas;
4. confirma horario, cierres y política de reserva;
5. registra un rango de precio sustentado;
6. explica qué pedir con al menos una evidencia trazable;
7. incluye un mínimo de dos fuentes consultadas, con fecha;
8. queda en estado `verified` o `partial` solo cuando la incertidumbre residual está descrita y no afecta a identidad, estado o ubicación.

`needs_review` es estado de auditoría y no cuenta como cobertura publicada.

## Ejemplos

Válido: `name_ja: null` cuando el nombre oficial japonés aún no se ha comprobado; `entity_type: "market"` para Tsukiji Outer Market; horario descrito como variable cuando agrupa múltiples puestos.

No válido: etiquetar un mercado como restaurante; inventar caracteres japoneses; copiar un horario de una reseña antigua ignorando la web oficial; marcar `verified` sin fecha o sin fuente.

## Ciclo de revisión

La migración inicial refleja la auditoría del 15 de julio de 2026. Todas las fichas se revalidarán a partir del 3 de agosto antes de congelar contenido. Una revisión debe actualizar la fecha, los campos realmente comprobados y el riesgo de cierre; no basta con confirmar que la URL sigue respondiendo.

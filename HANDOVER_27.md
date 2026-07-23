# HANDOVER 27 — Base gastronómica profunda de 200

> Fecha: 2026-07-23 | Estado: ampliación completada y validada

## Cobertura

| Ciudad | Fichas |
|---|---:|
| Tokio | 72 |
| Kioto | 46 |
| Osaka | 46 |
| Hiroshima | 31 |
| Hakone | 5 |
| **Total** | **200** |

Hakone se limita a cinco opciones porque el itinerario solo deja una comida. El volumen se concentra en las ciudades con más días.

## Estándar único

Se eliminó de la SPEC la distinción entre Top 50 profundo y fichas operativas de calidad inferior. Las 200 fichas deben acreditar:

- entidad y sucursal inequívocas;
- nombre japonés;
- estado operativo;
- dirección y coordenada individual;
- teléfono, horario y cierres;
- precio y política de reserva;
- al menos un plato del menú con fuente;
- mínimo dos fuentes.

## Método

1. Muestreo de 1.380 listados individuales de Tabelog en las cinco áreas.
2. Primera criba de identidad, teléfono, coordenadas, precio, horario y ficha concreta.
3. Selección por calidad gastronómica, reputación, especialidad, diversidad y utilidad geográfica.
4. Cruce con versión japonesa, menú publicado y web oficial; cuando el local no dispone de web, consulta exacta de Google Maps.
5. Auditoría de duplicados, nombres genéricos, sucursales, distribución de precio/cocina y accesibilidad de fuentes.

No se utilizó la calidad de la web como sustituto de la calidad del restaurante. Un primer intento con ese sesgo fue descartado íntegramente antes de construir esta versión.

## Controles

El validador exige:

- exactamente 200 fichas;
- distribución 72/46/46/31/5;
- todos los grupos de verificación profunda;
- nombre japonés;
- dos fuentes como mínimo;
- «qué pedir» trazable;
- coordenadas no duplicadas;
- estado `verified` o `partial`;
- Daruma fijado a Dotonbori, no a Shinsekai.

La comprobación HTTP revisó 459 URLs: todas las fichas conservan al menos una fuente accesible. Cinco URLs aisladas devolvieron error temporal o bloqueo, pero sus fichas disponen de fuentes alternativas accesibles.

## Pendiente

- Revalidación final del 3 al 10 de agosto.
- Implementar F19 y «Comer ahora» sobre la cobertura ya estabilizada.

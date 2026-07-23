# Reservas de tren — completadas

Carpeta donde Daniel sube las reservas de tren conforme las va confirmando.
Sirve **PDF, captura de móvil o foto** — Claude los lee directamente de aquí y
vuelca los datos a `data/trip.json` (array `trains`).

Los comprobantes y QR de esta carpeta están excluidos de Git porque permiten
usar las reservas. Solo este README se versiona. No mover los QR a `client/public`
ni incluirlos en el service worker.

## Trenes del viaje

| id | Fecha | Trayecto | Servicio | Horario | Asientos |
|----|-------|----------|----------|---------|----------|
| `train_01` | lun 17 ago | Shinjuku → Hakone-Yumoto | Hakone 27 (GSE) | 13:20–14:56 | coche 1 · 4A/4B |
| `train_02` | mar 18 ago | Odawara → Kioto | Hikari 641 | 12:07–14:12 | coche 6 · 15A/15B |
| `train_03` | vie 21 ago | Kioto → Hiroshima | Nozomi 135 | 11:16–12:56 | coche 5 · 7A/7B |
| `train_04` | sáb 22 ago | Hiroshima → Shin-Osaka | Nozomi 94 | 12:03–13:28 | coche 4 · 5D/5E |
| `train_05` | dom 23 ago | Shin-Osaka → Tokio | Nozomi 34 | 16:06–18:33 | coche 5 · 5D/5E |

> N'EX de ida (14 ago) y vuelta (25 ago): **sobre la marcha**, no se reservan aquí.

## Cómo nombrar los archivos

Para que sea inequívoco a qué tren pertenece cada archivo:

```
train_02_odawara-kioto.pdf
train_03_kioto-hiroshima.jpg
```

## Qué dato necesito de cada reserva

- Hora de **salida** y de **llegada** exactas
- **Tren** (nº / nombre, p. ej. "Hikari 505")
- **Coche** y **asiento** (p. ej. coche 7, asiento 12E)
- **Localizador** / código de reserva

Procesado el 23 de julio de 2026: los cinco trenes están en `status: "reserved"`
y los bloques diarios del 17–18 y 21–23 de agosto se han adaptado a sus horarios.

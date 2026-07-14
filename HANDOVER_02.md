# Hand-Over 02 — Ola 1: Scaffold + Deploy

> Fecha: 2026-07-14
> Iteración: Ola 1 — Esqueleto del proyecto + primera URL desplegada
> Estado: COMPLETADA ✅

---

## URL de producción

**https://chelisenjapon-production.up.railway.app**

Pipeline activo: cada `git push` a `master` → Railway redespliega automáticamente.

---

## Qué se construyó

### Estructura del proyecto
```
Chelis_en_Japon/
├── client/                  ← React + Vite (frontend)
│   ├── src/
│   │   ├── App.jsx                  ← shell: header, DualClock, tabs
│   │   ├── components/
│   │   │   ├── DualClock.jsx        ← doble reloj JST + CEST en tiempo real
│   │   │   ├── TodayView.jsx        ← vista "hoy" + DayCard (exportada)
│   │   │   └── DayNav.jsx           ← navegación horizontal 13-25 ago
│   │   ├── hooks/
│   │   │   └── useTripData.js       ← fetch /data/trip.json
│   │   └── index.css                ← variables CSS, colores torii/washi
│   └── vite.config.js               ← proxy /api y /data → Express en dev
├── server/
│   ├── index.js                     ← Express: /api + /data + static build
│   ├── db.js                        ← pool pg (preparado, sin tablas aún)
│   └── routes/health.js             ← GET /api/health
├── data/
│   └── trip.json                    ← 13 días reales del viaje
└── railway.json                     ← build NIXPACKS, healthcheck /api/health
```

### Funcionalidades entregadas
- **Doble reloj en tiempo real:** JST (ciudad del día actual) + CEST Madrid, actualizado cada segundo
- **Vista "hoy":** detecta fecha del dispositivo, muestra ciudad/hotel/bloques del día
- **Cuenta atrás:** si hoy < 13 ago, muestra días que quedan para el viaje
- **Navegación día a día:** scroll horizontal, 13-25 ago, día actual resaltado
- **Días libres diferenciados:** 16 ago (mañana Yanaka + tarde libre) y 24 ago (día completo libre) con estilo visual distinto
- **Diseño mobile-first:** viewport 390px de referencia, CSS vanilla, sin frameworks externos
- **Favicon:** hinomaru (círculo rojo sobre fondo blanco) en SVG

### Decisiones técnicas adoptadas
- `trip.json` servido por Express en `/data/` (no en `client/public/`) para que el servidor también lo lea en olas futuras
- `DayCard` exportada desde `TodayView.jsx` y compartida con `DayNav` — evita duplicación
- CSS inline por componente en Ola 1 — migratable a CSS Modules si se decide en olas posteriores
- `db.js` preparado con `pg` pero sin tablas — graceful degradation si no hay `DATABASE_URL`

---

## Estado de las olas

| Ola | Estado |
|---|---|
| 0 — Datos | ✅ trip.json + restaurants_db.json completados |
| 1 — Scaffold + Deploy | ✅ URL activa en Railway |
| 2 — Billetes y Localizadores | ⬜ Pendiente |
| 3 — Mapa | ⬜ Pendiente |
| 4 — Restaurantes | ⬜ Pendiente |
| 5 — Contenido enriquecido | ⬜ Pendiente |
| 6 — Offline + PWA | ⬜ Pendiente |
| 7 — Trenes + Pulido final | ⬜ Pendiente (espera reservas jul 18-24) |

---

## Pendientes urgentes fuera del código

- ⚠️ **HOY (18 jul 10:00 JST):** abre ventana de reserva Tokio→Hakone (Odakyu Romancecar) — odakyu-romance.jp
- ⚠️ **19 jul:** abre ventana Odawara→Kioto (Shinkansen)
- ⚠️ **22 jul:** abre ventana Kioto→Hiroshima
- ⚠️ **23 jul:** abre ventana Hiroshima→Osaka
- ⚠️ **24 jul:** abre ventana Osaka→Tokio

---

## Por dónde continuar

**Ola 2 — Billetes y Localizadores:**
- Sección de vuelos (IB0281/IB0282, PNR 76HHZ9, billete 075-2530016629)
- Sección de hoteles (6 hoteles con CRS locator, dirección, teléfono, check-in/out)
- Sección de trenes con ventanas de reserva visibles + campos TBD actualizables
- Todo accesible en 1-2 toques, funciona offline

---

*Cerrado: 2026-07-14 | Próximo hand-over: HANDOVER_03.md — al terminar Ola 2*

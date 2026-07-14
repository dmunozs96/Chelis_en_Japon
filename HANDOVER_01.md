# Hand-Over 01 — Pre-desarrollo / Fase de clarificación

> Fecha: 2026-07-13  
> Iteración: Ola 0 — Lectura, análisis y definición de producto  
> Estado: PENDIENTE DE RESPUESTAS (ver sección "Preguntas abiertas")

---

## Qué se hizo en esta iteración

### 1. Lectura y análisis de todos los archivos fuente
- `japon_info_base.md` — itinerario, vuelos, hoteles, localizadores, contexto histórico por ciudad, recomendaciones curadas con fuentes (todo verificado a julio 2026)
- `producto_guia_interactiva.md` — definición de producto existente (visión, usuarios, MVP, arquitectura, esquema de datos)
- `superprompt_claude_code_speckit.md` — super-prompt para Spec Kit con constitución (7 reglas), especificación detallada y dirección técnica
- `Itinerario_Dia_a_Dia.docx` — **extraído y parseado** (el archivo es .docx, no legible directamente — se leyó mediante Python). Contiene el itinerario cerrado día a día con bloques mañana/tarde/noche para los 13 días del viaje.

### 2. Hallazgo clave del docx
El itinerario está **completamente cerrado** con planes hora a hora. Decisiones ya tomadas que no estaban claras en los otros archivos:
- **Miyajima está DESCARTADO** explícitamente (checkout Hiroshima a las 12:00 — tiempo insuficiente)
- **Día 16 ago:** mañana cerrada (teamLab Borderless) + tarde/noche libre
- **Día 24 ago:** día completo libre
- **Día 25 ago:** salida del hotel a las 07:00-07:30 (no esperar al checkout de las 11:00)

### 3. Documentación creada
- `CONSTITUTION.md` — constitución formal del producto (reglas no negociables, visión, usuarios, arquitectura mandatoria, backlog explícito)
- `SPEC.md` — especificación completa (itinerario día a día extraído del docx, billetes, localizadores, funcionalidades MVP, esquema de datos borrador, olas de desarrollo, advertencias activas)

---

## Estado actual del producto

### Lo que ya existe y está validado
| Recurso | Estado |
|---|---|
| Itinerario día a día (13-25 ago) | ✅ Cerrado y documentado en SPEC.md |
| Vuelos (IB0281/IB0282) | ✅ PNR 76HHZ9, billete 075-2530016629 |
| Hoteles + localizadores (todos) | ✅ 6 hoteles con CRS locator y dirección |
| Contexto histórico por ciudad | ✅ En japon_info_base.md |
| Recomendaciones curadas con fuente | ✅ Por ciudad en japon_info_base.md |
| Miyajima | ✅ Descartado del itinerario |

### Lo que está pendiente o abierto
| Pendiente | Urgencia |
|---|---|
| Horas exactas de trenes (ventana abre 18 jul) | 🔴 URGENTE (5 días) |
| Decisión JR Pass vs. billetes sueltos | 🔴 URGENTE (5 días) |
| Respuestas a preguntas de clarificación (ver abajo) | 🟡 Necesario para continuar |
| Política tatuajes Mizunoto (confirmar por teléfono) | 🟡 Antes del viaje |
| Reserva teamLab Borderless (16 ago) | 🟡 Antes de que se agote |
| Reserva Bird Land / ESqUISSE (24 ago, cena despedida) | 🟡 Antes del viaje |

---

## Preguntas abiertas (clarificación)

Las respuestas a estas preguntas son necesarias para cerrar la especificación y pasar a código. Están agrupadas por urgencia.

### Bloque A — Urgente (afecta a qué construir)

**A1. ✅ RESPONDIDA:** Billetes sueltos. La guía mostrará las fechas de apertura de cada ventana de reserva (18-24 jul) para que Daniel pueda agendarse cada tren. Modelo de datos actualizado en SPEC.md con campo `status` (pending/reserved) y flujo de actualización vía JSON.

**A2. ✅ RESPONDIDA:** teamLab descartado. Mañana del 16 ago reemplazada por **Yanaka** (barrio histórico, sin reserva necesaria). SPEC.md actualizado.

### Bloque B — Producto (afecta al diseño y UX)

**B1. ✅ RESPONDIDA:** Doble reloj persistente en tiempo real: hora local del dispositivo (etiquetada "Tokio" / JST) + hora española (etiquetada "Madrid" / CEST UTC+2). Detección de "hoy" por hora local del dispositivo. SPEC.md actualizado con F1b.

**B2. ✅ RESPONDIDA:** El 13 ago es un día completo en la guía: "Navalcarnero → Barajas T4 → Tokio". Igual el 25 ago a la vuelta. El viaje empieza y termina en Navalcarnero. SPEC.md actualizado.

**B3. ✅ RESPONDIDA:** Todo en español.

**B4. ✅ RESPONDIDA:** PWA sí — instalable desde pantalla de inicio. manifest.json + service worker en Ola 5.

**B5. ✅ RESPONDIDA:** Dark mode fuera del MVP.

**B6. ✅ RESPONDIDA:** QR fuera del MVP — solo disponible tras check-in online. Añadido al backlog en CONSTITUTION.md.

**B7. Cena de despedida (24 ago — Bird Land Ginza o ESqUISSE):** ¿Está ya reservada una de las dos? La guía puede marcarlo como "confirmar reserva" si no está. Ambos necesitan reserva con antelación.

**B8. Política de tatuajes Mizunoto (Hakone):** ¿Queréis que la guía muestre el aviso de "pendiente de confirmar — llamar al +81 460-82-6011"? ¿O ya lo habéis confirmado?

### Bloque C — Técnico (afecta a cómo construirlo)

**C1. ✅ RESPONDIDA:** GitHub como repositorio, Railway para hosting y despliegue. SPEC.md y CONSTITUTION.md actualizados.

**C2. Dominio:** ¿El subdominio que da Railway (ej. `japon2026.up.railway.app`) o tienes un dominio propio?

**C3. Framework frontend:** ¿Tienes preferencia entre Vanilla JS + Vite, React o Svelte? ¿Cuánto escribes de frontend normalmente?

---

## Por dónde continuar

1. **Responder las preguntas de clarificación** (sobre todo A1 y A2 — urgentes).
2. Con las respuestas, cerrar SPEC.md (eliminar los TBDs de decisiones técnicas).
3. Arrancar **Ola 0**: construir `trip.json` completo y validado con todos los datos del viaje.
4. Luego **Ola 1**: esqueleto del sitio + primera URL compartible.

---

*Próximo hand-over: HANDOVER_02.md — al cerrar Ola 0 (trip.json completo)*

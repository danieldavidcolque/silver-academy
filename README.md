# Silver Academy 🎓

App tipo Duolingo para aprender idiomas, con:

- **Niveles A1, A2, B1, B2, C1, C2** (CEFR).
- **Motor de lecciones interactivas**: elegir opción, ordenar palabras, escuchar y elegir, escribir.
- **Sistema de racha, XP, gemas y corazones**.
- **Ranking mensual** entre estudiantes.
- **Módulo Profesor**: editor de contenido (lecciones y ejercicios) y lista de alumnos.
- **Agenda 1‑a‑1** (booking): el profesor publica horarios y los estudiantes reservan según su plan.
- **Suscripción mensual** con planes Gratis, Plus, Premium (checkout mock).
- **PWA instalable en Android** (Chrome → "Añadir a pantalla de inicio").

## Cómo correr

Necesita cualquier servidor HTTP estático (no `file://`, porque el Service Worker requiere http/https).

```bash
python -m http.server 5177 --directory .
```

Y abrí <http://localhost:5177> en el navegador. En Chrome de Android, tocá el menú → **Instalar app** para agregarla a la pantalla de inicio y que se comporte como app nativa.

En este proyecto ya está configurado el launch: desde Claude Code corré la config **lingua-app**.

## Cuentas demo

- Estudiante: `demo@silveracademy.app` / `1234`
- Profesor: `profe@silveracademy.app` / `1234`

## Estructura

```
lingua-app/
├── index.html            # shell de la SPA
├── manifest.json         # PWA
├── sw.js                 # service worker
├── css/styles.css
├── icons/                # iconos de la app
└── js/
    ├── data.js           # contenido seed (niveles, lecciones, planes, slots)
    ├── store.js          # estado + localStorage
    ├── router.js         # hash router con soporte de query
    ├── ui.js             # helpers (toast, modal, iconos, bnav, confetti, TTS)
    ├── app.js            # bootstrap y rutas
    └── views/
        ├── auth.js       # welcome / login / registro
        ├── home.js       # árbol de lecciones + racha
        ├── lesson.js     # motor de lección
        ├── profile.js
        ├── leaderboard.js
        ├── schedule.js   # agenda 1‑a‑1 (estudiante)
        ├── subscription.js
        └── teacher.js    # contenido / alumnos / agenda del profesor
```

## Persistencia

Todo vive en `localStorage` (`silver-academy-db-v1`), con la posibilidad de resetear
desde **Perfil → Reiniciar datos de demo**.

Para pasar a producción se puede mover el store a Supabase / Firebase (misma API que ya expone `js/store.js`).

## Notas de UI/UX

- Paleta estilo Duolingo (verde `#58CC02`, azul `#1CB0F6`, amarillo `#FFC800`).
- Botones con "depth" (borde inferior sombreado) y feedback táctil.
- Progreso animado, mascota que se mueve, confetti al terminar lección.
- Bottom nav diferenciada por rol (estudiante vs profesor).
- TTS del navegador (Web Speech API) para los ejercicios de listening.
- Emulación mobile completa: safe areas, no zoom por doble tap, viewport optimizado.

## Próximos pasos sugeridos

- Backend real (Supabase) con RLS por rol (`teacher`/`student`).
- Pagos: Google Play Billing, Stripe o Mercado Pago (hoy es un checkout mock).
- Video 1‑a‑1: integración con Jitsi / Whereby / Daily.
- Notificaciones push (Web Push).
- Empaquetado con **Capacitor** para publicar en Google Play como app nativa.

# CHANGELOG.md

Historial de cambios del proyecto **Radio Trigal FM (PokéQuiz Music
Edition)**.

El formato sigue, a grandes rasgos, [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/):
cada versión agrupa sus cambios en `Añadido`, `Cambiado`, `Corregido` y
`Eliminado`. Las fechas están en formato AAAA-MM-DD.

> Nota: este changelog se crea en la sesión en la que se documenta por
> primera vez la arquitectura del proyecto (ver `PROJECT.md`), a partir
> del estado actual del código. No existía un registro de versiones
> previo, así que la primera entrada describe el estado actual como
> punto de partida en lugar de reconstruir el historial completo.
> A partir de aquí, cada cambio nuevo debe añadir su propia entrada.

## [Unreleased]

### Añadido
- `leaderboard.js` conectado a un backend real (**Firebase/Firestore**):
  `Leaderboard.fetchTop(n)` y `Leaderboard.submitScore(...)` ya no son un
  stub, hablan de verdad con la colección `leaderboard` de Firestore.
  Es el único fichero del proyecto que se carga como
  `<script type="module">` (lo exige el SDK de Firebase); expone su API
  en `window.Leaderboard` para que el resto del juego lo siga usando
  igual que antes.
- `storage.js`: nuevo campo `profile.playerId` (identificador anónimo
  aleatorio) + helper `ensurePlayerId()`, que lo genera y guarda la
  primera vez que hace falta. Se usa como clave del documento de
  Firestore de cada jugador en la clasificación global, para que al
  mejorar su récord se actualice su fila en vez de crearse una nueva.
- `game.js`: `showResult()` pasa ahora `ensurePlayerId()` a
  `Leaderboard.submitScore()`.
- Nuevo fichero de referencia `firestore.rules` (no se carga desde el
  juego) con las reglas de seguridad a pegar en la Consola de Firebase:
  lectura pública de `leaderboard`, escritura validada por forma de los
  datos, borrado bloqueado.

### Añadido (entrada anterior de esta sesión)
- **Nuevo fichero `leaderboard.js`**: adaptador hacia el backend/API que
  alojará la clasificación global (`Leaderboard.fetchTop(n)` /
  `Leaderboard.submitScore(username, avatarId, score)`). Es un stub
  listo para conectar: mientras `API_BASE_URL` (dentro del propio
  fichero) siga a `null`, `fetchTop()` devuelve `[]` y `submitScore()`
  no hace nada (solo avisan por consola), sin romper el resto de la
  app. Se carga justo después de `storage.js` por no depender de nada
  más.
- `index.html`/`ui.js`/`game.js`: nueva sección **Clasificaciones**,
  accesible desde un botón nuevo en el menú principal. Muestra el
  récord personal de Desafío Infinito (ya existente en
  `achievementsData.stats.bestInfiniteScore`) y, debajo, una tabla con
  el top 50 global (avatar + nombre + puntuación) obtenida de forma
  asíncrona vía `Leaderboard.fetchTop(50)`, con mensajes de carga,
  error y "todavía sin datos" mientras no haya backend conectado.
  `game.js` envía la puntuación a `Leaderboard.submitScore()` solo
  cuando se supera el récord personal del Desafío Infinito (no en cada
  partida).
- `pokemon.js`/`index.html`/`styles.css`: nuevo Evento Pokémon **Mew**.
  Mew "se transforma": tras su carta de aparición, se muestra un
  selector con 3 eventos Pokémon aleatorios del catálogo (sprite +
  nombre de cada uno) y el jugador elige tocando uno; el evento activo
  de la ronda pasa a ser el elegido (su `onAnswers`/`onAudio`, y
  cualquier caso especial de `game.js` que consulte
  `PokeEvents.activeId()` como los multiplicadores de Shiny/Pikachu o la
  vida extra de Venusaur, se aplican exactamente igual que si ese
  Pokémon hubiera aparecido directamente). `pokemon.js` añade el nuevo
  helper interno `showActiveEventAndContinue()` (usado tanto por el
  disparo normal como por el forzado desde el panel de debug) para no
  repetir en dos sitios la comprobación del caso especial de Mew.
- `pokemon.js`: nuevo Evento Pokémon **Mewtwo**. Añade dos respuestas
  incorrectas extra (títulos de canciones del pool actual que no estén
  ya entre las opciones mostradas), cada una insertada en una posición
  aleatoria de la rejilla en vez de siempre al final. El brillo psíquico
  y la animación de aparición (`styles.css`) se aplican a TODAS las
  respuestas de la ronda, reales y falsas por igual (solo retocan borde
  y `box-shadow`, nunca el fondo ni el color del texto de
  `.answer-btn`, para que se lean bien en modo claro y oscuro), de forma
  que no se pueden distinguir ni por su aspecto ni por su posición.
- `ui.js`: extraído el helper `addAnswerButton(gridEl, label, isCorrect)`
  a partir de la lógica ya existente en `renderAnswerButtons()`, para que
  el evento Mewtwo cree sus respuestas extra exactamente igual que las
  normales en vez de generar el HTML "a mano" en `pokemon.js`.
- `game.js`: logros `encounter_mewtwo` ("Clon psíquico") y
  `encounter_mew` ("Transformista"), generados junto al resto de logros
  `encounter_*` vía `ENCOUNTER_CONDITION_IDS`.

### Cambiado
- `pokemon.js`/`styles.css`: el evento Gengar ahora es un minijuego de
  búsqueda: la pantalla se oscurece por completo (negro totalmente
  opaco) y el sprite de Gengar aparece escondido en un punto aleatorio;
  el cursor actúa como una linterna (un hueco en el oscurecimiento que
  lo sigue) y es la única forma de ver, a través de ese hueco, el resto
  de la pantalla. El sprite y la linterna no aparecen hasta que termina
  la transición de oscurecimiento, para que Gengar no sea visible unos
  instantes mientras la pantalla todavía se está oscureciendo. Mientras
  Gengar no se ha encontrado, las respuestas no son pulsables y quedan
  cubiertas por un contenedor con fondo sólido y opaco propio (no
  depende del oscurecimiento ni de su hueco de linterna: las tapa pase
  lo que pase con el cursor), con el icono de fantasma y el texto
  pidiendo buscarlo pintados encima; ese contenedor y su texto quedan
  siempre visibles por encima del negro del oscurecimiento. Gengar
  nunca aparece dentro de esa zona (quedaría tapado sin forma de
  encontrarlo). Al clicar sobre Gengar, el oscurecimiento y el
  contenedor desaparecen y las respuestas vuelven a estar disponibles.
  `game.js` reutiliza el nuevo helper `clearGengarSearch()` (definido
  en `pokemon.js`) al empezar cada ronda, para no dejar colgados el
  sprite ni el listener de la linterna si la ronda anterior cambió
  antes de encontrarlo.

### Corregido
- `pokemon.js`/`styles.css`: el aviso de "busca a Gengar" (icono + texto)
  no llegaba a verse por encima del oscurecimiento pese a tener un
  `z-index` mayor: al colgar de `gridEl` (dentro de `#app`, que tiene su
  propio `position:relative; z-index:1`), quedaba atrapado en el
  stacking context de `#app` y su `z-index` nunca llegaba a competir con
  el de `#gengar-dark-overlay` (fuera de `#app`). Ahora se ancla
  directamente a `<body>` en `position:fixed`, con sus coordenadas
  puestas por JS a partir de la posición real de la rejilla de
  respuestas, igual que ya se hacía con el sprite escondido: así queda
  siempre visible por encima del negro opaco, sin depender de la
  linterna del cursor.
- `styles.css`: durante el parpadeo final del evento Jigglypuff, el
  overlay de somnolencia (`#jigglypuff-drowsy-overlay`) quedaba por
  detrás del sprite cantando (`#jigglypuff-sing-overlay`), así que no
  llegaba a taparlo del todo. Ahora su `z-index` es mayor que el del
  sprite, tal y como ya indicaba el propio comentario del archivo.
- `game.js`: en Modo Difícil e Infinito, el punto de inicio aleatorio de
  la canción se recalculaba cada vez que el navegador volvía a disparar
  `canplaythrough` durante la misma ronda (p. ej. al rebufferear),
  haciendo que la canción saltara de sitio repetidamente en vez de
  fijarse una sola vez al empezar la ronda. Ahora el listener se
  desactiva nada más ejecutarse la primera vez.

### Cambiado
- `ui.js`: mientras suena la canción del evento Jigglypuff, la canción
  de la ronda ahora se reduce al 15% de su volumen (antes, al 30%).
- `game.js`: el aviso de subida de nivel usa ahora el icono ⬆️ en vez
  de 🆙.
- Refactor interno (sin cambios de comportamiento visible) para eliminar
  código duplicado detectado en una auditoría:
  - `ui.js`: `spawnAchievementParticles()`, `spawnLogoParticles()` y
    `spawnParticles()` ahora son wrappers finos sobre un nuevo helper
    genérico `spawnParticleBurst()`.
  - `audio.js`: `startBlastoiseRainSound`/`stopBlastoiseRainSound` y
    `startSnorlaxSnoreSound`/`stopSnorlaxSnoreSound` ahora usan un
    helper genérico `startAmbientLoop()`/`stopAmbientLoop()`.
  - `ui.js`: `updateModeLocksUI()`/`updateOtherLocksUI()` y
    `showLockedModeMessage()`/`showLockedOtherMessage()` ahora
    comparten lógica a través de `updateLocksUI()`, `showLockedMessage()`
    y `lockReqText()`.
  - `game.js`: las 17 condiciones `encounter_*` de
    `ACHIEVEMENT_CONDITIONS` se generan ahora en un bucle a partir de
    `ENCOUNTER_CONDITION_IDS`, en vez de estar repetidas a mano.

### Eliminado
- `game.js`: eliminado el stub vacío `stopRoundTimer()` (ya no hacía
  nada desde que se quitó el cronómetro visual) y sus dos llamadas en
  `game.js` (`handleAnswer`) y `ui.js` (`showScreen`). Sin cambio de
  comportamiento. Actualizados también los comentarios de cabecera de
  `ui.js` y `PROJECT.md` que lo mencionaban como ejemplo.

## [0.1.0] — 2026-08-03 — Línea base documentada

Primera fotografía del proyecto en el momento de crear su
documentación (`PROJECT.md`, `CLAUDE.md`, este `CHANGELOG.md`).
Resumen del estado funcional en este punto:

### Añadido
- Estructura de 7 archivos: `index.html`, `styles.css`, `storage.js`,
  `audio.js`, `pokemon.js`, `ui.js`, `game.js`.
- 5 modos de juego principales: Fácil, Normal, Difícil, Combate y
  Desafío Infinito.
- Modo Historia: recorrido por 7 regiones (Kanto → Alola), cada una con
  fase de región (10 rondas) + fase de combate (3 rondas).
- Minijuegos: 8 categorías temáticas de 5 rondas cada una.
- Sistema de puntuación por velocidad de respuesta (20–100 pts) con
  multiplicador de racha (hasta x2 en racha 11+).
- Sistema de vidas (corazones) con recarga por región en Modo Historia.
- Perfil de jugador: nombre, avatar (catálogo de 20 avatares) y XP con
  sistema de niveles.
- Sistema de logros con condiciones de desbloqueo y desbloqueo de
  contenido (modos, minijuegos, Pokémon de fondo) ligado a logros
  concretos.
- Sonidex: colección de canciones que se desbloquean tras acertarlas
  10 veces (excepto en Modo Fácil).
- Sistema de Eventos Pokémon (módulo `PokeEvents` en `pokemon.js`):
  ~16 eventos con efectos visuales/de audio/de juego distintos
  (Gengar, Hypno, Weezing, Porygon, Jigglypuff, Electrode, Blastoise,
  Venusaur, Shiny, etc.), activos en Modo Historia y, tras completarlo,
  también en Desafío Infinito.
- Persistencia en `localStorage` de ajustes, perfil y logros/
  estadísticas (`storage.js`).
- Fondo animado (cielo, nubes, colinas con Pokémon paseando) y
  visualizador de forma de onda del audio en reproducción.
- Panel de depuración temporal para forzar Eventos Pokémon (pendiente
  de eliminar antes de una versión de producción — ver `CLAUDE.md`).

### Pendiente / conocido
- El array `songs[]` en `game.js` usa rutas de ejemplo
  (`songs/...`, `images/...`) que deben sustituirse/completarse por los
  archivos reales del proyecto.
- El botón/panel de depuración "Forzar evento" sigue presente en
  `index.html`, `pokemon.js` y `game.js`, marcado explícitamente como
  temporal.

---

_Añade aquí nuevas entradas por encima de esta línea, con la versión y
fecha correspondientes, cada vez que se haga un cambio funcional en el
proyecto._

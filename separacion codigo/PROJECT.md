# PROJECT.md — Radio Trigal FM (PokéQuiz Music Edition)

Quiz musical de Pokémon, hecho con **HTML + CSS + JavaScript clásico**
(sin build step, sin frameworks, sin módulos ES). Todo el JS vive en el
ámbito global de la página: cada `<script>` declara `const`/`let`/
`function` que quedan disponibles para los scripts que se cargan después,
como si todo fuera un único fichero repartido en siete.

## 1. Idea general del juego

El jugador escucha canciones del universo Pokémon y tiene que adivinar
la región o el título exacto, según el modo. Hay:

- **5 modos principales**: Fácil, Normal, Difícil, Combate, Desafío
  Infinito.
- **Minijuegos**: 8 categorías temáticas (Centro Pokémon, Laboratorios,
  Bicicletas, Surf, Mundo Misterioso, Colosseum/XD, Ranger, Pantallas
  de Título), partidas cortas de 5 rondas.
- **Modo Historia**: recorrido por las 7 regiones (Kanto → Alola), cada
  una con una fase de 10 rondas normales + una fase de combate de 3
  rondas contra un "enemigo poderoso".
- **Sistema de progresión del jugador**: perfil (nombre + avatar + XP →
  nivel), logros con condiciones de desbloqueo, y una **Sonidex**
  (colección de canciones que se desbloquean tras acertarlas 10 veces).
- **Eventos Pokémon**: durante el Modo Historia (y, tras completarlo,
  también en el Desafío Infinito) puede aparecer al azar un Pokémon con
  un efecto especial en esa ronda (oscurecer pantalla, temporizador de
  explosión, distorsión visual, vidas extra, segunda oportunidad...).

## 2. Orden de carga (crítico)

```html
<script src="storage.js"></script>
<script src="audio.js"></script>
<script src="pokemon.js"></script>
<script src="ui.js"></script>
<script src="game.js"></script>
```

Este orden **no es arbitrario** y no debe cambiarse sin entender por qué:

1. `storage.js` no depende de nadie. Define `settings`, `profile`,
   `achievementsData` y sus `loadX()/saveX()` antes de que nadie los use.
2. `audio.js` usa `settings` (dentro de funciones, no al cargarse).
3. `pokemon.js` usa `SFX` (de audio.js) **inmediatamente al registrarse**
   el catálogo de eventos (el evento Shiny referencia `SFX.shiny` al
   declarar el objeto del evento), así que audio.js debe ir antes.
4. `ui.js` usa datos/funciones de los tres anteriores
   (`settings`/`profile`/`AVATAR_CATALOG`, `playSFX`/`SFX`/`menuAudio`,
   `PokeEvents`/`bgPokeLayer`).
5. `game.js` es el último: usa funciones de los cuatro anteriores en su
   bloque INIT final (`loadSettings()`, `buildBgPokemon()`,
   `renderProfileBar()`...) y en toda su lógica de partida.

Las referencias "hacia adelante" (p. ej. `ui.js` llamando a `startGame`
o `session`, que se definen en `game.js`, cargado después) son seguras
**solo** porque ocurren dentro de manejadores de eventos o funciones que
se ejecutan más tarde (clics, timers), nunca durante la carga inicial
del script.

## 3. Los siete archivos

### `index.html`
Solo marcado: splash screen, overlays (perfil, Modo Historia, info de
eventos, confirmaciones...), las pantallas (`<section class="screen"
id="screen-...">`: home, main-modes, region-select, other-games,
options, guide, achievements, sonidex, quiz) y, al final del `<body>`,
la carga de los 5 scripts en el orden descrito arriba. No contiene JS
inline relevante ni estilos.

### `styles.css`
Todos los estilos visuales: variables CSS en `:root` (paleta de color
para modo oscuro, sobrescritas en `body.light` para modo claro),
tipografías, layout de cada pantalla, animaciones y los estilos de cada
overlay/evento Pokémon. No contiene lógica.

### `storage.js` — capa de persistencia
Única fuente de verdad sobre **qué se guarda en `localStorage`** y con
qué forma. Expone:

- `settings` (volumen música/SFX, modo oscuro, fondo animado,
  partículas) + `loadSettings()` / `saveSettings()`.
- `profile` (username, avatarId, xp) + `AVATAR_CATALOG` (20 avatares) +
  `getAvatarUrl()` + `loadProfile()` / `saveProfile()` / `hasProfile()`.
- `achievementsData` (`unlocked`: id→timestamp, `stats`: contadores y
  récords vía `defaultAchStats()`) + `loadAchievements()` /
  `saveAchievements()`.

Todas las funciones envuelven el acceso a `localStorage` en try/catch:
si falla (modo incógnito, storage deshabilitado...), simplemente no se
guarda/carga nada y se mantienen los valores por defecto. La *lógica de
negocio* que usa estos datos (calcular nivel a partir de xp, comprobar
si se desbloquea un logro...) vive en `game.js`, no aquí.

### `audio.js` — motor de audio
Catálogo de sonidos (`SFX`, `AMBIENT_SFX`) y todo lo relacionado con
reproducirlos:

- Música de menú: `MENU_SONGS`, cola aleatoria sin repetir la última
  (`refillMenuSongQueue`/`getNextMenuSong`/`playRandomMenuSong`),
  `unlockMenuMusic()` (desbloqueo por gesto del usuario, requisito de
  los navegadores), `ensureMenuMusicPlaying()`.
- Sonidos ambiente en bucle de eventos: lluvia de Blastoise
  (`startBlastoiseRainSound`/`stopBlastoiseRainSound`), ronquido de
  Snorlax (`startSnorlaxSnoreSound`/`stopSnorlaxSnoreSound`).
- Audio principal de ronda: `audio` (elemento `<audio>`), Web Audio API
  para el visualizador de onda (`audioCtx`, `analyser`), temporizador de
  10s del Modo Difícil (`startHardRoundTimer`/`stopHardRoundTimer`/
  `hardRoundTimeUp`), `playSFX()`, `fadeVolume()`, `stopAudioHard()`.
- Sonidex: `playSonidexSong()` / `stopSonidexPlayback()`.

### `pokemon.js` — sistema de Pokémon
Dos cosas independientes entre sí:

1. **Módulo `PokeEvents`** (IIFE con API pública reducida): catálogo de
   ~16 Eventos Pokémon (Inkay, Porygon, Slowpoke, Gengar, Hypno,
   Weezing, Chansey, Rapidash, Caterpie Shiny, Blastoise, Charizard,
   Pikachu, Electrode, Venusaur, Ditto, Jigglypuff, Snorlax) y el motor
   que decide **cuándo** aparece uno. Contrato con el resto del juego
   (los únicos puntos de contacto, usados desde `game.js`):
   - `PokeEvents.tryTrigger(onDone)` — tras terminar una canción, decide
     si activa un evento.
   - `PokeEvents.beginRound()` — red de seguridad al empezar cada ronda.
   - `PokeEvents.applyToAnswers(gridEl)` / `applyToAudio(audioEl)` —
     aplican el efecto del evento activo a las opciones/al audio.
   Los *efectos concretos* de cada evento (temblor de Hypno, canto de
   Jigglypuff, glitch de Porygon...) NO están aquí: viven en `game.js`
   (lógica) y `ui.js` (render), entrelazados con vidas/puntuación.
2. **Pokémon de fondo**: construidos automáticamente a partir del mismo
   catálogo (`buildBgPokemon`, `addBgPokemon`, `initBgPokeWalk`,
   `isHillPokemonUnlocked` — se desbloquean vía logros de "encuentro").
3. Panel de depuración para forzar un evento (`openDebugEventPanel` /
   `closeDebugEventPanel`) — **temporal, marcado para eliminar**.

### `ui.js` — capa de interfaz
Todo lo que "pinta cosas en pantalla" sin decidir reglas de juego:
navegación (`showScreen`, `goBackFromCurrentScreen`, `navStack`),
render de tarjetas/listas (perfil, logros, Sonidex, vidas, botones de
respuesta, streaks, récords), overlays/modales (perfil, splash, Modo
Historia, info de eventos), el fondo animado (cielo/colinas, canvas) y
el visualizador de onda, popups y partículas decorativas, y los efectos
visuales de los eventos Jigglypuff/Electrode/Porygon.

Regla de separación (explícita en la cabecera del archivo): si la
función **decide** algo sobre las reglas del juego → `game.js`; si solo
**refleja en el DOM** un estado ya decidido en otro sitio → `ui.js`. Por
eso `healLife()`/`loseLife()` están en `game.js` pero
`renderLives()`/`updateNervousState()` están aquí.

### `game.js` — núcleo del juego
El "cerebro": reglas y estado, no dibujado. Secciones principales (en
este orden dentro del archivo):

1. **Catálogo de canciones** (`REGIONS`, `EASY_REGIONS`, `songs[]` —
   objetos `{title, file, image, group, region}`).
2. **Cronómetro de ronda + sistema de puntos**
   (`startRoundTimer`/`getElapsedRoundTime`,
   `computeBasePoints` 20–100 pts según velocidad,
   `getStreakMultiplier` hasta x2 en racha 11+).
3. **Ajustes y perfil de jugador**: sistema de niveles a partir de xp
   (`xpNeededForLevel`, `computeLevelInfo`, `addProfileXp`) — usa
   `settings`/`profile` definidos en `storage.js`.
4. **Estado del juego/modo**: `GameMode` (enum de modos), `session`
   (config de la partida en curso: modo, región, pool, fase de
   historia, vidas...) y `state` (score, ronda, racha, canción actual).
5. **Sistema de logros**: `ACHIEVEMENTS[]` (catálogo),
   `ACHIEVEMENT_CONDITIONS` (condición de desbloqueo por id),
   `MODE_UNLOCKS`/`OTHER_UNLOCKS` (qué logro desbloquea qué modo/
   minijuego), `trackModePlayed`/`trackCorrectAnswer`/
   `trackSongCorrect`/`trackEncounter`/`trackGameFinished` (registran
   estadísticas tras cada evento relevante) y `checkAchievements()`
   (comprueba y desbloquea).
6. **Lógica del quiz**: `shuffle`, `buildPool()` (arma `session.pool`
   según el modo), `getRandomSongFromPool`,
   `generateOptionsForCurrent`.
7. **Modo Historia: sistema de vidas** (`hasActiveLivesSystem`,
   `getCurrentLives`, `healLife`, `loseLife`, `storyGameOver`,
   `electrodeExplode`) y **flujo de partida**: `startGame`,
   `startRound`, `resumeAudio`, `handleAnswer`, `nextRound`,
   `showResult`, `restartGame`, `exitGame`.
8. **Menús: handlers** — listeners de los botones de cada pantalla,
   `REGION_META`, pills de región.
9. **Modo Historia** (recorrido): `startStoryMode`,
   `handleStoryStageComplete`, `storyFinish`.
10. **INIT**: bloque que arranca la app al cargar la página (carga
    settings/achievements/profile, renderiza estado inicial, valida que
    haya canciones suficientes).

## 4. Flujo de datos resumido

```
storage.js  ──(settings, profile, achievementsData)──▶  game.js decide
                                                          │
audio.js    ──(SFX, playSFX, audio element)──────────────┤
                                                          │
pokemon.js  ──(PokeEvents.tryTrigger/applyToAnswers/──────┤
              applyToAudio, buildBgPokemon)               │
                                                          ▼
                                                    ui.js pinta el
                                                    resultado en el DOM
```

`game.js` es el único que **decide** (puntos, vidas, logros, qué evento
toca). `ui.js` es el único que **pinta**. `storage.js` es el único que
**persiste**. `audio.js` es el único que **reproduce sonido**.
`pokemon.js` es el único que **decide qué Evento Pokémon aparece y
cuándo** (aunque su *efecto* se reparta entre game.js y ui.js).

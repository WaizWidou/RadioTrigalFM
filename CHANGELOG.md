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

### Cambiado
- **Avatares de perfil desbloqueables por logro de avistamiento, en vez
  de por nivel.** `AVATAR_UNLOCKS` (`game.js`) admite ahora, además de
  `{ level }`, una forma `{ achId }`: el avatar se desbloquea al
  conseguir ese logro en vez de al alcanzar un nivel de perfil
  (`isAvatarUnlocked()` comprueba una u otra según el avatar, mismo
  criterio que `isModeUnlocked()`/`isOtherUnlocked()`). Se usa para 18
  avatares —Charizard, Venusaur, Blastoise, Pikachu, Ditto, Inkay,
  Rapidash, Slowpoke, Hypno, Chansey, Porygon, Gengar, Electrode,
  Snorlax, Jigglypuff, Caterpie, Mewtwo y Mew—, cada uno ligado al
  logro "Avistamiento: `<nombre>`" (`encounter_<id>_5` en
  `ACHIEVEMENTS`, el de 5 apariciones de ese Evento Pokémon) salvo
  Caterpie, ligado a "Avistamiento brillante" (`encounter_shiny_5`).
  Estos avatares ya existían en `AVATAR_CATALOG` y hasta ahora estaban
  disponibles desde el principio. Al conseguir uno de estos logros
  (`checkAchievements()`) se muestra un aviso de avatar nuevo
  disponible, igual que al desbloquear un modo o categoría de
  Minijuegos; el logro correspondiente también enlaza al avatar desde
  la pantalla de Logros (`getFeatureUnlocksForAchievement()`).
- **Rejilla de avatares y aviso de bloqueo, adaptados a logros.**
  `renderAvatarGrid()` (`ui.js`) ordena ahora los avatares
  desbloqueables por logro después de los desbloqueables por nivel
  (nueva `avatarSortWeight()`), y tanto el título del botón como el
  aviso al pulsar un avatar bloqueado usan el nuevo
  `avatarLockRequirementText()` (`game.js`), que describe el requisito
  real (nivel de perfil o nombre del logro) en vez de asumir siempre un
  nivel.

### Añadido
- **4 nuevos avatares de perfil.** Se amplía `AVATAR_CATALOG`
  (`storage.js`) con retratos estilo Pokémon Mundo Misterioso
  (PMDCollab/SpriteCollab) de Gible, Chespin, Fennekin y Froakie, para
  poder usarlos como recompensa de nivel (ver más abajo).

### Cambiado
- **Recompensas de avatar por nivel de perfil (niveles 2-29, segunda
  tanda).** Se añaden a `AVATAR_UNLOCKS` (`game.js`) desbloqueos por
  nivel para 19 avatares que hasta ahora estaban disponibles desde el
  principio: Snubbull (2), Rattata/Geodude (3), Sunkern/Wooper (4),
  Togepi/Mareep (5), Staryu/Teddiursa (7), Ralts/Magikarp (8),
  Smeargle/Corsola (9), Marill/Growlithe (10), Riolu/Feebas (11),
  Unown (28) y Sneasler (29). Riolu pasa a requerir nivel 11 (antes
  disponible desde el principio, tras el cambio de la sesión
  anterior).

- **Recompensas de avatar por nivel de perfil (niveles 13-31).** Se
  amplía `AVATAR_UNLOCKS` (`game.js`) con un nuevo tramo de
  desbloqueos por nivel, del 13 al 31: Gyarados/Dratini (13),
  Scyther/Larvitar (14), Arcanine/Beldum (15), Bagon/Onix (16),
  Gible/Heracross (17), Turtwig/Piplup/Chimchar (18), Milotic/Magmar
  (19), Jynx/Wobbuffet (20), Chatot/Electabuzz (21), Sylveon/Tauros
  (22), Shuckle/Aerodactyl (23), Snivy/Oshawott/Tepig (24),
  Alakazam/Flareon (25), Wigglytuff/Vaporeon (26), Lapras/Jolteon (27),
  Zoroark (28), Scizor (29), Fennekin/Chespin/Froakie (30) y Lucario
  (31). Las recompensas de nivel 12 e inferiores se mantienen igual.
  Piplup cambia de nivel de desbloqueo (antes 22, ahora 18). Riolu,
  Umbreon y Espeon pierden su entrada en `AVATAR_UNLOCKS` y pasan a
  estar disponibles desde el principio.
- **Orden de la rejilla de avatares de perfil.** `renderAvatarGrid()`
  (`ui.js`) ahora pinta los avatares ordenados de menor a mayor según
  el nivel necesario para desbloquearlos (`AVATAR_UNLOCKS`, `game.js`);
  antes seguían el orden de declaración en `AVATAR_CATALOG`
  (`storage.js`). Los avatares sin requisito de nivel (desbloqueados
  desde el principio) van primero, conservando entre ellos su orden
  original en el catálogo.

### Añadido
- **33 nuevos avatares de perfil.** Se amplía `AVATAR_CATALOG`
  (`storage.js`) con retratos estilo Pokémon Mundo Misterioso
  (PMDCollab/SpriteCollab) de Rattata, Geodude, Onix, Staryu,
  Aerodactyl, Larvitar, Mantine, Smeargle, Miltank, Lugia, Ho-Oh,
  Ralts, Shedinja, Loudred, Sableye, Aggron, Medicham, Sharpedo,
  Torkoal, Spoink, Spinda, Trapinch, Flygon, Cacnea, Swablu, Lunatone,
  Solrock, Whiscash, Bagon, Beldum, Latias, Latios y Jirachi. Se omite
  Celebi porque ya tenía avatar en el catálogo. Igual que las tandas
  anteriores, se añaden sin entrada en `AVATAR_UNLOCKS` (`game.js`),
  por lo que quedan disponibles desde el principio.

- **32 nuevos avatares de perfil.** Se amplía `AVATAR_CATALOG`
  (`storage.js`) con retratos estilo Pokémon Mundo Misterioso
  (PMDCollab/SpriteCollab) de Feebas, Magikarp, Gyarados, Milotic,
  Growlithe, Magnemite, Scyther, Electabuzz, Magmar, Jynx, Tauros,
  Jolteon, Flareon, Vaporeon, Dratini, Hoothoot, Ledian, Togepi,
  Mareep, Marill, Sunkern, Sunflora, Wooper, Unown, Wobbuffet,
  Dunsparce, Snubbull, Shuckle, Heracross, Teddiursa, Corsola y
  Sneasler. Igual que la tanda anterior, se añaden sin entrada en
  `AVATAR_UNLOCKS` (`game.js`), por lo que quedan disponibles desde el
  principio.

- **45 nuevos avatares de perfil.** Se amplía `AVATAR_CATALOG`
  (`storage.js`) con retratos estilo Pokémon Mundo Misterioso
  (PMDCollab/SpriteCollab) de Venusaur, Blastoise, Charizard, Caterpie,
  Rapidash, Slowpoke, Hypno, Electrode, Chansey, Ditto, Porygon,
  Mewtwo, Mew, Inkay, Treecko, Turtwig, Chimchar, Snivy, Oshawott,
  Tepig, Skitty, Cubone, Alakazam, Xatu, Absol, Ninetales, Gardevoir,
  Wigglytuff, Chatot, Grovyle, Dusknoir, Celebi, Kangaskhan, Kecleon,
  Lucario, Garchomp, Dragonite, Lapras, Arcanine, Scizor, Tyranitar,
  Salamence, Metagross, Zoroark y Sylveon. Se omiten los Pokémon que ya
  tenían avatar (Bulbasaur, Squirtle, Charmander, Pikachu, Jigglypuff,
  Gengar, Snorlax, Meowth, Chikorita, Cyndaquil, Totodile, Riolu,
  Eevee, Torchic, Piplup, Mudkip). Los avatares nuevos se añaden sin
  entrada en `AVATAR_UNLOCKS` (`game.js`), por lo que quedan
  disponibles desde el principio, igual que los 10 primeros del
  catálogo original.

- **Evento Electrode: sprite real y animación de carga/explosión.** El
  badge del temporizador ya no usa el emoticono 💣, sino el sprite de
  `images/electrode.png`. Mientras la mecha está encendida, el sprite se
  va poniendo cada vez más blanco y brillante (sincronizado con los 10s
  de `ELECTRODE_FUSE_SECONDS`), con un halo de luz alrededor que empieza
  inapreciable y va ganando brillo y tamaño al mismo ritmo, y en el
  instante de la explosión ambos revientan en un destello final antes de
  que el badge desaparezca.
  - `index.html`: sustituido el emoji por `<img id="electrode-sprite">`
    dentro de `#electrode-timer`, envuelto en
    `<span id="electrode-sprite-wrap">` (necesario para poder pintar el
    halo detrás con un `::before` sin tocar el propio sprite).
  - `styles.css`: estilos de `#electrode-sprite`/`#electrode-sprite-wrap`
    y las animaciones `electrode-charge`/`electrode-glow` (blanqueo del
    sprite y crecimiento del halo, clase `.charging`) y
    `electrode-blast`/`electrode-glow-blast` (destello final, clase
    `.exploding`).
  - `ui.js`: `startElectrodeTimer()` añade la clase `charging` y fija
    `--electrode-fuse` para sincronizar la duración de ambas animaciones
    con `ELECTRODE_FUSE_SECONDS`. `stopElectrodeTimer(exploded)` acepta
    un nuevo parámetro opcional: si es `true`, añade brevemente la clase
    `exploding` antes de ocultar el badge.
  - `game.js`: `electrodeExplode()` ahora distingue entre "ya había
    respondido" (limpieza silenciosa) y "ha explotado de verdad" (llama
    a `stopElectrodeTimer(true)` para disparar el destello). Solo afecta
    al Electrode junto al temporizador, no al que pasea de fondo en el
    menú (otro elemento distinto, en `pokemon.js`).

### Añadido
- **19 nuevos logros «de primer avistamiento» para los Eventos Pokémon.**
  Junto a cada logro `encounter_<id>` ya existente (que ahora pide 10
  apariciones), se añade uno nuevo con id `encounter_<id>_5` que se
  desbloquea a las 5 apariciones de ese mismo Pokémon/evento — el mismo
  umbral que tenían todos estos logros antes del cambio anterior.
  Reutilizan el mismo contador `stats.encounterCounts` (no hace falta
  tocar `storage.js`), así que un jugador desbloquea primero el logro
  de 5 y, más adelante, el de 10 sin perder progreso. El desbloqueo de
  Pokémon en las colinas de fondo (`isHillPokemonUnlocked` en
  `pokemon.js`) sigue atado únicamente al logro de 10, como hasta
  ahora: los nuevos ids `_5` no coinciden con ningún `PokeEvents.list()`
  al quitarles el prefijo `encounter_`, así que no disparan ese
  desbloqueo por error.

### Cambiado
- **Umbral de los logros de Eventos Pokémon: de 5 a 10 apariciones.**
  Los 19 logros `encounter_*` (uno por cada Pokémon/evento, más el de
  Pokémon shiny) ahora exigen que su Evento Pokémon correspondiente
  haya aparecido 10 veces en vez de 5. Cambio centralizado en
  `game.js`, en el bucle que genera `ACHIEVEMENT_CONDITIONS[encounter_*]`
  a partir de la nueva constante `ENCOUNTER_THRESHOLD`, más la
  actualización del texto (`desc`) de cada logro en `ACHIEVEMENTS[]`.
  Como sigue usando el mismo contador `stats.encounterCounts` de
  siempre, el progreso ya acumulado por los jugadores no se pierde: los
  logros que antes estaban en 5/5 pasan a mostrarse como 5/10.

- **Botón de información de Eventos Pokémon más grande** en la pantalla
  previa de región del Modo Historia (`.story-info-btn`): de 38×38px y
  1.15rem de icono a 50×50px y 1.5rem.

- **Evento Porygon: glitch también en el audio**, no solo en lo visual.
  Mientras el evento está activo, la canción de la ronda suena
  entrecortada (pequeños saltos hacia atrás al azar cada pocos cientos
  de ms), a juego con las letras corruptas y los píxeles de la interfaz.
  - `audio.js`: nuevas `startPorygonAudioGlitch(audioEl)` /
    `stopPorygonAudioGlitch()`, que manipulan directamente
    `audioEl.currentTime` del `<audio>` de la ronda (no es un sonido
    ambiente aparte, como la lluvia de Blastoise o el ronquido de
    Snorlax). `stopAudioHard()` la llama también como red de seguridad.
  - `pokemon.js`: el evento `porygon` añade un hook `onAudio` que arranca
    el efecto; `clearPokeEventVisuals()` lo detiene junto al resto de
    efectos al cambiar de ronda o salir del quiz.
  - `game.js`: `startRound()` detiene el efecto de la ronda anterior
    junto al resto de resets de Eventos Pokémon.
- **Avatares de perfil desbloqueables por nivel**: de los 20 avatares de
  `AVATAR_CATALOG` (`storage.js`), ahora solo los 10 primeros están
  disponibles desde el principio; los otros 10 se desbloquean
  progresivamente al subir de nivel.
  - `game.js`: nueva constante `AVATAR_UNLOCKS` (avatar → nivel
    requerido) y helper `isAvatarUnlocked(avatarId)`. `addProfileXp()`
    ahora también avisa (toast "🖼️ ¡Nuevo avatar disponible!") cuando
    subir de nivel desbloquea algún avatar nuevo, igual que ya hacía con
    los modos de juego.
  - `ui.js`: `renderAvatarGrid()` (usada tanto en la configuración
    inicial de perfil como en el modal de perfil) pinta en gris y con
    candado los avatares todavía bloqueados; tocarlos muestra un aviso
    con el nivel necesario en vez de seleccionarlos.
  - `styles.css`: estilos `.profile-avatar-option.locked` y
    `.avatar-lock-badge` para el candado sobre el avatar.
- `game.js`: catálogo real de canciones del minijuego **Mundo
  Misterioso** (30 pistas), sustituyendo las 7 de ejemplo. Rutas
  actualizadas a `songs/other/mistery-dungeon/<pista>.mp3` /
  `images/<pista>.png` (antes `songs/other/mundo-misterioso/...`), ya
  que es donde se han añadido los ficheros reales. Los títulos son
  provisionales (nombre del propio fichero, en formato legible) a la
  espera de que se sustituyan por los títulos definitivos; la clave
  `other: "mystery-dungeon"` no cambia, así que no afecta a
  desbloqueos ni al resto del juego.

- **Clasificaciones ahora tienen tres categorías** en vez de solo el
  Desafío Infinito: **Nivel de Jugador**, **Desafío Infinito** y **Modo
  Historia**, seleccionables con pestañas en la pantalla de
  Clasificaciones.
  - `leaderboard.js`: `Leaderboard.fetchTop()` y
    `Leaderboard.submitScore()` ahora reciben un primer parámetro
    `category` (`"level"` / `"infinite"` / `"story"`, ver la nueva
    constante `LEADERBOARD_CATEGORIES`). Cada jugador sigue teniendo un
    único documento en Firestore (ID = `playerId`), pero ahora con un
    campo por categoría (`level`/`infiniteScore`/`storyScore`);
    `submitScore()` actualiza (`merge: true`) solo el campo de la
    categoría indicada, sin pisar las otras dos. `fetchTop()` devuelve
    cada fila como `{ username, avatarId, value }`.
  - `game.js`: además del envío ya existente al superar el récord de
    Desafío Infinito, ahora también se envía la puntuación al superar
    el récord de Modo Historia (`storyGameOver()`/`storyFinish()`) y el
    nivel de jugador al subir de nivel (`addProfileXp()`).
  - `ui.js`/`index.html`: la pantalla de Clasificaciones muestra ahora
    los tres récords personales a la vez (tarjeta "Tus récords") y un
    selector de pestañas para elegir qué top 50 global se pide/pinta.
  - `styles.css`: nuevo estilo `.leaderboard-tabs`/`.leaderboard-tab`
    para las pestañas.
  - ⚠️ Como esta integración con Firebase todavía no se había publicado
    (sigue en `[Unreleased]`), no hay datos reales en Firestore que
    migrar: el cambio de forma de los datos (de `score` a
    `level`/`infiniteScore`/`storyScore` por documento) no requiere
    ningún paso adicional.
  - `firestore.rules` (fichero de referencia, no se carga desde el
    juego): actualizado a los 3 campos nuevos (`level`/`infiniteScore`/
    `storyScore`, cada uno opcional en la escritura ya que
    `submitScore()` solo manda el campo de la categoría que mejoró).
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
- `audio.js`: el glitch de audio del evento Porygon
  (`startPorygonAudioGlitch()`) saltaba con demasiada frecuencia; el
  intervalo entre saltos pasa de 650ms a 2600ms (x4, una cuarta parte de
  frecuencia).
- **Nubes de humo del evento Weezing: contorno estilo anime**. Cada
  degradado radial de `.weezing-cloud` mantiene ahora su color de
  relleno plano hasta cerca del borde y luego pasa, en un tramo muy
  estrecho, a un tono casi negro (`#170a2c`) totalmente opaco antes de
  desvanecerse a transparente — una "tinta" sólida que traza el
  contorno de la nube, en vez de un simple resplandor difuso sin línea.
  Al formar parte del propio degradado (y no un `border`/`box-shadow`
  aparte), esa línea pasa igual que el resto por el filtro de
  turbulencia de `#weezing-smoke-overlay`, así que queda pegada al
  borde irregular ya distorsionado de cada nube.
- **Pantalla de Logros reorganizada en secciones plegables**, en vez de
  una única rejilla plana con todos los logros a la vez.
  - `game.js`: cada logro de `ACHIEVEMENTS` declara ahora un campo
    `section`; nueva constante `ACHIEVEMENT_SECTIONS` (Progreso y
    rachas, Maestría y partidas perfectas, Sonidex, Modo Historia,
    Eventos Pokémon) que define esas categorías y su orden de
    aparición.
  - `ui.js`: `renderAchievementsScreen()` agrupa los logros por sección
    dentro de bloques `<details>` plegables, cada uno con su propio
    contador "X / Y". Todas las secciones empiezan plegadas, mostrando
    solo la cabecera con el título de la categoría (antes se abrían por
    defecto las secciones con algún logro pendiente).
  - `index.html`/`styles.css`: la lista de logros pasa de un único
    `.card` con `.ach-list` a `.ach-sections` (una tarjeta por
    categoría, con cabecera plegable `.ach-section-summary`).
- **Botones "Clasificaciones" y "Opciones" en pantalla de Inicio,
  agrupados en una fila compacta**: ya no son botones principales de
  ancho completo con título y subtítulo, sino dos botones uno junto al
  otro, cada uno mostrando solo su icono y ocupando la mitad del ancho
  horizontal que ocupa un botón principal (Jugar, Modo Historia...).
  - `index.html`: ambos botones (`#go-leaderboard`/`#go-options`) ahora
    van dentro de un contenedor `.menu-row-compact`, con la clase extra
    `.menu-btn-compact` y sin `.menu-btn-title` ni `<small>` (se añade
    `title`/`aria-label` para mantener el nombre accesible).
  - `styles.css`: nuevas reglas `.menu-row-compact` (fila flex) y
    `.menu-btn-compact` (variante compacta de `.menu-btn`, solo icono).
- **Pantalla de Logros: eliminada la tarjeta "Récords de puntuación"**
  (Desafío Infinito / Modo Historia); esos dos récords personales siguen
  visibles en la pantalla de Clasificaciones ("Tus récords") y en el
  modal de perfil, así que no se pierde el dato, solo se deja de
  duplicar en Logros.
  - `ui.js`: eliminada la función `renderRecordsCard()` y su llamada
    desde `renderAchievementsScreen()`.
  - `index.html`: eliminada la tarjeta y el contenedor `#records-list`
    de `#screen-achievements`.
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
- `game.js`: al acertar una respuesta, si mostrar el aviso de subida de
  nivel/logro/ficha de Sonidex desbloqueada (`addProfileXp()` /
  `trackCorrectAnswer()` / `trackSongCorrect()`, que además pueden tocar
  cosas más "delicadas" como `Leaderboard.submitScore()`) lanzaba una
  excepción inesperada, `handleAnswer()` se cortaba en ese punto y nunca
  llegaba a la línea final que muestra el botón "Siguiente Ronda": el
  botón se quedaba sin aparecer, dando la sensación de que "desaparecía"
  justo cuando saltaba una notificación. Ahora esas tres llamadas van
  cada una en su propio try/catch, así que un fallo ahí ya no puede
  impedir que el resto de la ronda (y el botón "Siguiente Ronda") siga
  su curso con normalidad.
- `game.js`: al pulsar repetidamente la barra espaciadora (atajo de
  "Siguiente Ronda") a veces se saltaba también la ronda siguiente,
  porque la clase `visible` del botón `#next-btn` se quita dentro de
  `startRound()`, que puede tardar en ejecutarse (Eventos Pokémon,
  timeouts...); si el jugador pulsaba varias veces antes de que
  desapareciera esa clase, cada pulsación llamaba a `nextRound()` por
  separado. Ahora el atajo, además de exigir que el botón esté visible,
  solo puede dispararse como mucho una vez cada 2 segundos.
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

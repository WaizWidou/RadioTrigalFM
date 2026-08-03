/* ══════════════════════════════════════════════════════════════════════
   RADIO TRIGAL FM — CAPA DE PERSISTENCIA (storage.js)
   ══════════════════════════════════════════════════════════════════════
   Este fichero agrupa TODO lo relacionado con guardar y leer datos del
   jugador en localStorage: los ajustes (volumen, tema, opciones
   gráficas), el perfil (nombre, avatar, experiencia) y los logros
   (desbloqueados + estadísticas acumuladas).

   Aquí solo vive la "forma de los datos" y las funciones para
   cargarlos/guardarlos (loadX / saveX), junto con el pequeño catálogo
   de avatares que necesita el perfil. La lógica de negocio que USA esos
   datos (calcular el nivel a partir de la experiencia, comprobar si se
   desbloquea un logro, pintar la rejilla de avatares en pantalla...)
   sigue viviendo en game.js, que las consume con total normalidad.

   Al ser un script clásico (sin módulos), todo lo que se declara aquí
   con `const`/`let`/`function` queda en el ámbito global de la página,
   exactamente igual que si siguiera estando dentro de game.js. Por eso
   este fichero debe cargarse ANTES que game.js (y, por seguridad, antes
   también que audio.js y pokemon.js, que en algún punto podrían llegar
   a usar `settings`/`profile`/`achievementsData`):
     <script src="storage.js"></script>
     <script src="audio.js"></script>
     <script src="pokemon.js"></script>
     <script src="game.js"></script>

   Ninguna de las funciones de aquí lanza excepciones hacia fuera: todas
   envuelven el acceso a localStorage en try/catch y, si algo falla (por
   ejemplo, en modo incógnito o con localStorage deshabilitado), se
   limitan a no guardar/cargar nada, dejando los valores por defecto.
   ══════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════
//  ⚙️ AJUSTES (persisten en localStorage)
// ═══════════════════════════════════════════════

// Objeto con las preferencias del jugador. Se modifica "in place" desde el
// resto del juego (game.js) y se guarda llamando a saveSettings(). Estos son
// los valores por defecto que se usan la primera vez que se juega, antes de
// que exista nada guardado en localStorage.
const settings = {
  musicVol: 0.3,      // volumen de la música (0 a 1)
  sfxVol: 0.5,         // volumen de los efectos de sonido (0 a 1)
  darkMode: true,      // true = tema oscuro, false = tema claro
  animatedBg: true,   // Opciones gráficas: cielo/nubes/Pokémon de fondo
  particles: true,    // Opciones gráficas: chispas al acertar / logros
};

/** Carga las opciones del jugador (volumen, modo oscuro, fondo animado,
 * partículas...) desde localStorage, sustituyendo los valores por
 * defecto de `settings` solo cuando el dato guardado es válido. */
function loadSettings() {
  try {
    // Lee el JSON guardado bajo la clave "pokequiz_settings". Si no hay
    // nada guardado todavía (primera vez que se abre el juego), no hay
    // nada que hacer y se mantienen los valores por defecto de arriba.
    const raw = localStorage.getItem("pokequiz_settings");
    if (!raw) return;
    const obj = JSON.parse(raw);
    // Se valida el tipo de cada campo antes de aplicarlo, por si el JSON
    // guardado estuviera corrupto o viniera de una versión distinta del
    // juego con una forma de datos diferente.
    if (typeof obj.musicVol === "number") settings.musicVol = clamp01(obj.musicVol);
    if (typeof obj.sfxVol === "number") settings.sfxVol = clamp01(obj.sfxVol);
    if (typeof obj.darkMode === "boolean") settings.darkMode = obj.darkMode;
    if (typeof obj.animatedBg === "boolean") settings.animatedBg = obj.animatedBg;
    if (typeof obj.particles === "boolean") settings.particles = obj.particles;
  } catch(e) {}
}
/** Persiste el objeto `settings` completo en localStorage. */
function saveSettings() {
  try { localStorage.setItem("pokequiz_settings", JSON.stringify(settings)); } catch(e) {}
}
/** Limita un número al rango [0, 1] (usado para volúmenes). */
function clamp01(x){ return Math.max(0, Math.min(1, x)); }

// ═══════════════════════════════════════════════
//  👤 PERFIL DE JUGADOR (nombre + avatar, persisten en localStorage)
// ═══════════════════════════════════════════════
// Catálogo de avatares: caras de Pokémon estilo Pokémon Mundo Misterioso
// (retratos de PMDCollab/SpriteCollab). Si estas URLs no cargan, se puede
// sustituir "url" por una ruta local, p.ej. "images/avatars/pikachu.png".
const AVATAR_CATALOG = [
  { id: "pikachu",    name: "Pikachu",    url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0025/Normal.png" },
  { id: "bulbasaur",  name: "Bulbasaur",  url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0001/Normal.png" },
  { id: "charmander", name: "Charmander", url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0004/Normal.png" },
  { id: "squirtle",   name: "Squirtle",   url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0007/Normal.png" },
  { id: "eevee",      name: "Eevee",      url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0133/Normal.png" },
  { id: "jigglypuff", name: "Jigglypuff", url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0039/Normal.png" },
  { id: "psyduck",    name: "Psyduck",    url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0054/Normal.png" },
  { id: "snorlax",    name: "Snorlax",    url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0143/Normal.png" },
  { id: "gengar",     name: "Gengar",     url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0094/Normal.png" },
  { id: "meowth",     name: "Meowth",     url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0052/Normal.png" },
  { id: "vulpix",     name: "Vulpix",     url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0037/Normal.png" },
  { id: "chikorita",  name: "Chikorita",  url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0152/Normal.png" },
  { id: "cyndaquil",  name: "Cyndaquil",  url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0155/Normal.png" },
  { id: "totodile",   name: "Totodile",   url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0158/Normal.png" },
  { id: "riolu",      name: "Riolu",      url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0447/Normal.png" },
  { id: "umbreon",    name: "Umbreon",    url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0197/Normal.png" },
  { id: "espeon",     name: "Espeon",     url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0196/Normal.png" },
  { id: "piplup",     name: "Piplup",     url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0393/Normal.png" },
  { id: "torchic",    name: "Torchic",    url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0255/Normal.png" },
  { id: "mudkip",     name: "Mudkip",     url: "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/0258/Normal.png" },
];
/** Devuelve la URL de imagen del avatar con ese id, o la del primer
 * avatar del catálogo si no se encuentra (avatar por defecto). */
function getAvatarUrl(avatarId) {
  const av = AVATAR_CATALOG.find(a => a.id === avatarId);
  return av ? av.url : AVATAR_CATALOG[0].url;
}

// Objeto con los datos del jugador. Igual que `settings`, se modifica "in
// place" desde game.js (p.ej. al ganar puntos) y se persiste llamando a
// saveProfile(). Valores por defecto para un jugador nuevo: sin nombre
// (username vacío significa "todavía no se ha creado el perfil"), avatar
// inicial = primero del catálogo, y 0 puntos de experiencia.
const profile = {
  username: "",
  avatarId: AVATAR_CATALOG[0].id,
  xp: 0,  // puntos totales acumulados en todas las partidas (determina el nivel)
  playerId: "",  // identificador anónimo y aleatorio, generado por ensurePlayerId(); NO identifica
                 // a la persona (no hay login), solo evita que leaderboard.js cree una entrada
                 // nueva en la clasificación global cada vez que este jugador mejora su récord.
};
/** Carga el perfil del jugador (nombre, avatar, puntos/XP) desde
 * localStorage, validando el tipo de cada campo antes de aplicarlo. */
function loadProfile() {
  try {
    const raw = localStorage.getItem("pokequiz_profile");
    if (!raw) return;
    const obj = JSON.parse(raw);
    // El nombre se recorta a 16 caracteres por seguridad, aunque ya se
    // valida su longitud al guardarlo (defensa extra ante datos antiguos
    // o manipulados a mano en localStorage).
    if (typeof obj.username === "string") profile.username = obj.username.trim().slice(0, 16);
    // El avatarId solo se acepta si sigue existiendo en el catálogo actual
    // (por si en una versión futura se eliminara algún avatar).
    if (typeof obj.avatarId === "string" && AVATAR_CATALOG.some(a => a.id === obj.avatarId)) profile.avatarId = obj.avatarId;
    if (typeof obj.xp === "number" && obj.xp >= 0) profile.xp = obj.xp;
    if (typeof obj.playerId === "string" && obj.playerId) profile.playerId = obj.playerId;
  } catch(e) {}
}
/** Persiste el objeto `profile` completo en localStorage. */
function saveProfile() {
  try { localStorage.setItem("pokequiz_profile", JSON.stringify(profile)); } catch(e) {}
}
/** True si el jugador ya se creó un perfil (tiene nombre guardado). */
function hasProfile() { return !!profile.username; }

/** Devuelve el identificador anónimo estable de este jugador,
 * generándolo (y guardándolo) la primera vez que se necesita. Solo lo
 * usa leaderboard.js, como clave de su entrada en la clasificación
 * global (así, al mejorar su récord, actualiza su fila en vez de crear
 * una nueva cada vez). No identifica a la persona: es un valor
 * aleatorio sin relación con su nombre, avatar ni ninguna cuenta. */
function ensurePlayerId() {
  if (!profile.playerId) {
    profile.playerId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : "p" + Date.now().toString(36) + Math.random().toString(36).slice(2);
    saveProfile();
  }
  return profile.playerId;
}

// ═══════════════════════════════════════════════
//  🏅 LOGROS Y ESTADÍSTICAS (persisten en localStorage)
// ═══════════════════════════════════════════════
// Nota: el catálogo de logros en sí (qué logros existen, sus condiciones de
// desbloqueo, etc.) y toda la lógica que los comprueba/desbloquea siguen
// viviendo en game.js; aquí solo está la forma de los datos guardados y su
// carga/guardado.

/** Estructura inicial (todo a cero) de las estadísticas de logros.
 * Se usa tanto para inicializar `achievementsData.stats` como para
 * rellenar los campos que falten al cargar datos guardados antiguos. */
function defaultAchStats() {
  return {
    gamesPlayed: 0,
    totalCorrect: 0,
    bestStreak: 0,
    bestStreakEasy: 0,
    bestStreakHard: 0,
    bestStreakInfinite: 0,
    bestStreakByRegion: {},   // { "Kanto": 7, "Johto": 4, ... } (incluye "Combate")
    perfectGame: false,
    modesPlayed: [],
    regionsPlayed: [],
    otherPlayed: [],
    songCorrectCounts: {},   // { "songs/main/kanto/pallet-town.mp3": 3, ... } (Sonidex)
    perfectGamesCount: 0,    // nº de partidas terminadas con el 100% de aciertos
    storyModeCompleted: false,        // true si se ha completado el Modo Historia entero
    storyModeCompletedPerfect: false, // true si el Modo Historia se completó con el 100% de aciertos
    storyRegionsCompleted: [], // regiones cuya fase de región + combate se han superado en Modo Historia
    bestInfiniteScore: 0,    // récord de puntuación en Modo Desafío Infinito
    bestStoryScore: 0,       // récord de puntuación en Modo Historia
    perfectEasyGame: false,   // true si se ha terminado alguna partida perfecta en Modo Fácil
    perfectHardGame: false,   // true si se ha terminado alguna partida perfecta en Modo Difícil
    perfectCombatGame: false, // true si se ha terminado alguna partida perfecta en Modo Combate
    perfectRegionsNormal: [], // regiones (Modo Normal) completadas alguna vez con el 100% de aciertos
    bestHardCorrectInGame: 0, // máximo de respuestas correctas en una sola partida del Modo Difícil
    encounterCounts: {},      // { "charizard": 3, "pikachu": 1, ... } nº de apariciones de cada evento Pokémon
  };
}

// Objeto con los logros desbloqueados y las estadísticas acumuladas del
// jugador. `unlocked` mapea el id de cada logro a la marca de tiempo en la
// que se desbloqueó; `stats` contiene los contadores/récords que game.js va
// actualizando partida a partida (ver defaultAchStats() para su forma).
let achievementsData = {
  unlocked: {},        // id -> timestamp
  stats: defaultAchStats(),
};

/** Carga de localStorage los logros desbloqueados y las estadísticas
 * acumuladas, fusionando con los valores por defecto para tolerar
 * versiones antiguas del guardado que no tuvieran algún campo nuevo. */
function loadAchievements() {
  try {
    const raw = localStorage.getItem("pokequiz_achievements");
    if (!raw) return;
    const obj = JSON.parse(raw);
    achievementsData.unlocked = obj.unlocked && typeof obj.unlocked === "object" ? obj.unlocked : {};
    // Object.assign sobre una base "defaultAchStats()" fresca asegura que,
    // si se añadió un campo nuevo en una versión posterior del juego, el
    // guardado antiguo (que no lo tiene) no deje ese campo en `undefined`.
    achievementsData.stats = Object.assign(defaultAchStats(), obj.stats || {});
  } catch (e) {}
}
/** Persiste `achievementsData` (logros + estadísticas) en localStorage. */
function saveAchievements() {
  try { localStorage.setItem("pokequiz_achievements", JSON.stringify(achievementsData)); } catch (e) {}
}

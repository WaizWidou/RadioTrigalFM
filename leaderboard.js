/* ══════════════════════════════════════════════════════════════════════
   RADIO TRIGAL FM — CLASIFICACIÓN GLOBAL (leaderboard.js)
   ══════════════════════════════════════════════════════════════════════
   Adaptador hacia Firebase/Firestore, la base de datos donde vive la
   clasificación global (top 50 del Desafío Infinito). Este fichero NO
   decide nada de las reglas del juego ni pinta nada en pantalla: solo
   sabe pedir la clasificación y guardar una puntuación, escondiendo el
   "cómo" (Firestore, sus colecciones, su sintaxis) detrás de dos
   funciones. El resto del juego (game.js/ui.js) solo llama a
   `Leaderboard.fetchTop()` y `Leaderboard.submitScore()`, sin saber
   nada de Firebase.

   ⚠️ DIFERENCIA IMPORTANTE con el resto del proyecto: este es el ÚNICO
   fichero que se carga como `<script type="module">` en vez de como
   script clásico (mira el `<script>` correspondiente en index.html).
   Es obligatorio porque el SDK de Firebase se reparte en "módulos" de
   JavaScript que se cargan con `import`, algo que un script clásico no
   sabe hacer. Como consecuencia, lo que se declara aquí con
   `const`/`function` NO queda automáticamente en el ámbito global de la
   página (a diferencia de todos los demás ficheros): por eso, al final
   de este fichero, se cuelga explícitamente el resultado de
   `window.Leaderboard = { fetchTop, submitScore }`. Para el resto del
   juego (ui.js/game.js) esto es invisible: siguen escribiendo
   `Leaderboard.fetchTop(...)` / `Leaderboard.submitScore(...)` exactamente
   igual que si fuera un script clásico más.

   Los scripts `type="module"` también se ejecutan un poco más tarde que
   los scripts clásicos normales (después de que el HTML termine de
   analizarse), pero eso no da ningún problema aquí: `Leaderboard` solo
   se usa dentro de funciones que se ejecutan cuando el jugador
   interactúa (pulsar "Clasificaciones", terminar una partida...), nunca
   durante la carga inicial de la página.

   ── ¿Qué hace falta en la Consola de Firebase para que esto funcione? ──
   1. Firestore Database debe estar creado (Compilación → Firestore
      Database → Crear base de datos).
   2. Las reglas de seguridad de Firestore deben permitir leer la
      colección "leaderboard" a cualquiera y escribir en ella con los
      campos validados (ver el bloque de reglas que se entrega aparte,
      para pegar en la pestaña "Reglas" de Firestore).
   Sin esos dos pasos, `fetchTop()`/`submitScore()` fallarán con un
   error de permisos (se verá en la consola del navegador), pero el
   resto de la app seguirá funcionando con normalidad: no lanzan
   excepciones hacia fuera, igual que storage.js con localStorage.

   ── Forma de los datos en Firestore ──
   Colección "leaderboard": un documento por jugador, con el ID del
   documento = `profile.playerId` (identificador anónimo aleatorio,
   generado y guardado en localStorage por storage.js — ver
   `ensurePlayerId()` allí). Usar ese ID fijo como clave del documento
   es lo que hace que, al mejorar su récord, un jugador ACTUALICE su
   entrada existente en vez de crear una nueva cada vez (si no,
   `fetchTop()` acabaría devolviendo varias filas con el mismo nombre).
   Cada documento tiene: { username, avatarId, score, createdAt }.
   ══════════════════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, getDocs, query, orderBy, limit as fsLimit,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// Configuración de tu proyecto de Firebase (Consola de Firebase → ⚙️
// Configuración del proyecto → tus apps → "SDK setup and configuration").
// Estos datos identifican a QUÉ proyecto de Firebase se conecta el
// juego; no son secretos (es normal y seguro que aparezcan en el código
// del lado del navegador), la seguridad real la dan las reglas de
// Firestore, no esto.
const firebaseConfig = {
  apiKey: "AIzaSyAdcWAgmoUoATjeMvYLIded3vmaZH_MSzg",
  authDomain: "radio-trigal-fm.firebaseapp.com",
  projectId: "radio-trigal-fm",
  storageBucket: "radio-trigal-fm.firebasestorage.app",
  messagingSenderId: "550325474877",
  appId: "1:550325474877:web:24e55c0d4839d6ea163c54",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Nombre de la colección de Firestore donde vive cada entrada de la
// clasificación. Si algún día quieres clasificaciones separadas por
// modo, sería tan sencillo como usar un nombre de colección distinto
// por modo (p. ej. "leaderboard_infinito", "leaderboard_historia"...).
const LEADERBOARD_COLLECTION = "leaderboard";

/**
 * Pide a Firestore los N mejores jugadores del Desafío Infinito,
 * ordenados de mayor a menor puntuación.
 * @returns {Promise<Array|null>}
 *   - Array de { username, avatarId, score } (puede estar vacío) si la
 *     petición fue bien.
 *   - null si hubo un error (reglas de Firestore, sin conexión...), para
 *     que quien llama pueda distinguir "no hay nadie todavía" de
 *     "no se ha podido cargar".
 */
async function fetchTop(n = 50) {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy("score", "desc"),
      fsLimit(n)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data());
  } catch (e) {
    console.error("[Leaderboard] Error al obtener la clasificación:", e);
    return null;
  }
}

/**
 * Guarda en Firestore la puntuación del jugador actual en el Desafío
 * Infinito, sobrescribiendo su entrada anterior (si la tenía) en vez de
 * crear una nueva cada vez que mejora su récord.
 * @param {string} username
 * @param {string} avatarId
 * @param {number} score
 * @param {string} playerId  identificador anónimo estable del jugador
 *   (ver ensurePlayerId() en storage.js), usado como ID del documento.
 */
async function submitScore(username, avatarId, score, playerId) {
  if (!playerId) {
    console.warn("[Leaderboard] Falta playerId: no se puede enviar la puntuación.");
    return;
  }
  try {
    await setDoc(doc(db, LEADERBOARD_COLLECTION, playerId), {
      username: (username || "Entrenador").slice(0, 16),
      avatarId: avatarId || "pikachu",
      score: Math.max(0, Math.round(score)),
      createdAt: Date.now(),
    });
  } catch (e) {
    console.error("[Leaderboard] Error al enviar la puntuación:", e);
  }
}

window.Leaderboard = { fetchTop, submitScore };

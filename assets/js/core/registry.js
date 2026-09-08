/* ============================================================
   TechTrack — Núcleo: registro de contenido
   ------------------------------------------------------------
   Arquitectura de plugins: el núcleo NO conoce ningún ejercicio.
   Cada archivo de content/exercises/*.js se auto-registra llamando
   a TT.defineExercise(...). Para añadir contenido nuevo solo hay
   que crear el archivo y añadir una línea en content/manifest.js.

   Se usan scripts clásicos (no ES modules) a propósito: así la
   plataforma funciona abriendo los HTML con doble clic (file://),
   donde los módulos fallarían por CORS.
   ============================================================ */
(function (global) {
  'use strict';

  var TT = global.TT || (global.TT = {});

  /* ---------- Taxonomía (extensible sin tocar el núcleo) ---------- */

  TT.LEVELS = {
    'junior':     { label: 'Junior',          order: 1, cls: 'lvl-junior',     desc: 'Fundamentos y ejercicios guiados.' },
    'junior-adv': { label: 'Junior avanzado', order: 2, cls: 'lvl-junior-adv', desc: 'Problemas cercanos a aplicaciones reales.' },
    'mid':        { label: 'Mid',             order: 3, cls: 'lvl-mid',        desc: 'Arquitectura, testing, debugging y decisiones técnicas.' },
    'senior':     { label: 'Senior',          order: 4, cls: 'lvl-senior',     desc: 'Problemas abiertos con múltiples soluciones válidas que hay que justificar.' }
  };

  TT.CATEGORIES = {};
  TT.defineCategory = function (cat) {
    TT.CATEGORIES[cat.id] = cat;
    return cat;
  };

  /* ---------- Almacén ---------- */

  var exercises = [];
  var byId = {};
  var paths = [];
  var pathById = {};

  /** Campos obligatorios del contrato de ejercicio (los 26 bloques). */
  var REQUIRED = [
    'id', 'title', 'category', 'level', 'context', 'situation', 'goal',
    'tech', 'skills', 'time', 'requirements', 'docs', 'solution',
    'rationale', 'alternatives', 'commonErrors', 'bestPractices',
    'companyLooksFor', 'scoring', 'reinforce'
  ];

  /* La explicación paso a paso puede darse de dos formas, y basta con una:
     `walkthrough` (qué / por qué / cómo sobre la solución terminada) o
     `fases` (el archivo completo en cada punto de la construcción).
     Exigir las dos solo produciría contenido duplicado. */

  /**
   * Bloque `docs`: material de estudio que hace la prueba autosuficiente.
   * Regla de oro: quien lea `docs` debe poder resolver el ejercicio sin
   * buscar nada fuera y sin ver la solución. No es un resumen de la
   * solución, es el conocimiento previo que la solución da por sabido.
   *
   *   resumen     Qué hay que entender, en dos o tres líneas.
   *   conceptos   [{ titulo, texto, codigo? }]  la teoría necesaria.
   *   referencia  [{ nombre, texto }]           API y sintaxis a mano.
   *   ejemplo     { titulo, codigo, texto }     caso resuelto ANÁLOGO,
   *                                             nunca el del ejercicio.
   *   glosario    [{ termino, definicion }]
   *   preparado   [string]  preguntas de autocomprobación previas.
   */
  var DOCS_REQUIRED = ['resumen', 'conceptos', 'referencia', 'ejemplo', 'glosario', 'preparado'];

  /**
   * Bloque `fases`: construcción incremental de la solución.
   *
   * Regla innegociable: el campo `codigo` de cada fase es el archivo
   * ENTERO tal como queda al terminar esa fase, nunca un fragmento.
   * El motivo es evitar la ambigüedad de "¿dónde va este trozo?": si
   * ves el archivo completo en cada punto, la posición nunca se
   * interpreta, se lee.
   *
   * Y la última fase debe coincidir exactamente con `solution.code`.
   * tools/verificar.js lo comprueba, de modo que es imposible que las
   * fases y la solución se desincronicen al editar una de las dos.
   *
   *   titulo      "Fase 1 — Esqueleto y validación"
   *   objetivo    Qué se consigue al terminar esta fase.
   *   codigo      EL ARCHIVO COMPLETO en este punto.
   *   explicacion Qué cambia respecto a la fase anterior y por qué.
   *   anadido     [string] resumen de lo nuevo (opcional).
   *   comprueba   Cómo verificar que esta fase funciona (opcional).
   */
  var FASE_REQUIRED = ['titulo', 'objetivo', 'codigo', 'explicacion'];

  /**
   * Valida y registra un ejercicio.
   * Falla ruidosamente en consola si falta algún bloque: preferimos
   * detectar contenido incompleto en desarrollo antes que servirlo.
   */
  TT.defineExercise = function (ex) {
    var missing = REQUIRED.filter(function (k) {
      var v = ex[k];
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0) || v === '';
    });
    if (!ex.walkthrough && !ex.fases) missing.push('walkthrough o fases');
    if (missing.length) {
      console.warn('[TechTrack] Ejercicio "' + (ex.id || '?') + '" incompleto. Faltan bloques:', missing);
    }
    if (ex.docs) {
      var faltaDoc = DOCS_REQUIRED.filter(function (k) {
        var v = ex.docs[k];
        return !v || (Array.isArray(v) && !v.length);
      });
      if (faltaDoc.length) {
        console.warn('[TechTrack] Documentación incompleta en "' + ex.id + '":', faltaDoc);
      }
    }
    if (ex.fases) {
      ex.fases.forEach(function (f, i) {
        var falta = FASE_REQUIRED.filter(function (k) { return !f[k]; });
        if (falta.length) {
          console.warn('[TechTrack] Fase ' + (i + 1) + ' de "' + ex.id + '" incompleta:', falta);
        }
      });
      var ultima = ex.fases[ex.fases.length - 1];
      if (ultima && ex.solution && ultima.codigo.trim() !== ex.solution.code.trim()) {
        console.warn('[TechTrack] En "' + ex.id + '" la última fase no coincide con la solución.');
      }
    }
    if (byId[ex.id]) {
      console.error('[TechTrack] id duplicado: ' + ex.id);
      return;
    }
    ex.version = ex.version || 1;
    ex.optional = ex.optional || [];
    ex.hints = ex.hints || [];
    ex.security = ex.security || [];
    ex.performance = ex.performance || [];
    ex.tests = ex.tests || null;
    ex.starter = ex.starter || null;
    ex.tags = ex.tags || [];
    ex.categorias = ex.categorias || [];   // categorías secundarias
    byId[ex.id] = ex;
    exercises.push(ex);
    return ex;
  };

  /**
   * Registro ligero: solo los campos que necesitan las páginas de listado
   * (catálogo, rutas, inicio, progreso) — id, título, categorización,
   * tecnologías y los textos cortos que alimentan la búsqueda. Sin
   * solución, documentación ni fases: eso solo hace falta en prueba.html.
   * Sin validación de campos obligatorios: un índice generado no necesita
   * la misma red de seguridad que el contrato completo de un ejercicio.
   */
  TT.defineExerciseIndice = function (ex) {
    if (byId[ex.id]) return;   // ya registrado (o el índice y el detalle coinciden)
    ex.categorias = ex.categorias || [];
    ex.tags = ex.tags || [];
    ex.liviano = true;
    byId[ex.id] = ex;
    exercises.push(ex);
    return ex;
  };

  TT.definePath = function (p) {
    pathById[p.id] = p;
    paths.push(p);
    return p;
  };

  /* ---------- Consultas ---------- */

  TT.all = function () { return exercises.slice(); };
  TT.get = function (id) { return byId[id] || null; };
  TT.paths = function () { return paths.slice(); };
  TT.path = function (id) { return pathById[id] || null; };

  TT.query = function (filters) {
    filters = filters || {};
    var text = (filters.text || '').toLowerCase().trim();
    return exercises.filter(function (ex) {
      // Una prueba vive en una categoría principal (la más específica) y puede
      // aparecer además en otras. Sin esto, "Refactorización" se lleva un
      // ejercicio que también es de Backend y el área de Backend sale vacía.
      if (filters.category &&
          ex.category !== filters.category &&
          ex.categorias.indexOf(filters.category) === -1) return false;
      if (filters.level && ex.level !== filters.level) return false;
      if (filters.kind && ex.kind !== filters.kind) return false;
      if (filters.tech && ex.tech.indexOf(filters.tech) === -1) return false;
      if (text) {
        var hay = [ex.title, ex.goal, ex.context, ex.tech.join(' '), ex.skills.join(' '), ex.tags.join(' ')]
          .join(' ').toLowerCase();
        if (hay.indexOf(text) === -1) return false;
      }
      return true;
    }).sort(function (a, b) {
      return TT.LEVELS[a.level].order - TT.LEVELS[b.level].order || a.title.localeCompare(b.title);
    });
  };

  /** Tecnologías presentes en el catálogo, ordenadas por frecuencia. */
  TT.techIndex = function () {
    var counts = {};
    exercises.forEach(function (ex) {
      ex.tech.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); })
      .map(function (t) { return { tech: t, count: counts[t] }; });
  };

  /* ---------- Carga dinámica del manifiesto ---------- */

  /**
   * Inyecta los scripts de contenido en orden y resuelve cuando todos
   * han ejecutado su auto-registro. Funciona igual en file:// y http://.
   */
  TT.loadContent = function (base, files) {
    return files.reduce(function (chain, file) {
      return chain.then(function () {
        return new Promise(function (resolve) {
          var s = document.createElement('script');
          s.src = base + file;
          s.onload = resolve;
          s.onerror = function () {
            console.error('[TechTrack] No se pudo cargar el contenido: ' + file);
            resolve();
          };
          document.head.appendChild(s);
        });
      });
    }, Promise.resolve());
  };

  /**
   * Punto de entrada de cualquier página de la plataforma.
   *
   * Por defecto carga el contenido completo (content/manifest.js y cada
   * archivo de content/exercises/), que es lo que necesita prueba.html
   * para mostrar solución, documentación y fases.
   *
   * Las páginas de listado (inicio, catálogo, rutas, progreso) no
   * necesitan nada de eso: solo id, título, categorización y los textos
   * cortos que alimenta la búsqueda. Con { liviano: true } se carga en su
   * lugar content/indice.js — un archivo generado con
   * tools/generar-indice.js que registra esos mismos campos mediante
   * TT.defineExerciseIndice — evitando bajar y parsear el bloque de
   * documentación, fases y solución de cada prueba.
   */
  TT.boot = function (base, opciones) {
    base = base || '';
    opciones = opciones || {};

    if (opciones.liviano) {
      return TT.loadContent(base, ['content/taxonomy.js', 'content/indice.js', 'content/paths.js'])
        .then(function () { return TT; });
    }

    return TT.loadContent(base, ['content/manifest.js'])
      .then(function () {
        return TT.loadContent(base, (TT.MANIFEST || []).map(function (f) { return 'content/' + f; }));
      })
      .then(function () { return TT; });
  };

})(window);

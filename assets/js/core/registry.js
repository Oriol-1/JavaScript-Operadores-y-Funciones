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

   Que no haya módulos NO significa escribir como en 2010: la
   restricción afecta a import/export, no a la sintaxis. const, let,
   funciones flecha y plantillas funcionan igual en un script clásico
   y son lo que se usa aquí.
   ============================================================ */
(function (global) {
  'use strict';

  const TT = global.TT || (global.TT = {});

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

  const exercises = [];
  const byId = {};
  const paths = [];
  const pathById = {};
  const companies = [];
  const companyById = {};

  /* ---------- Empresas ----------
     Una ficha de empresa describe un proceso de selección REAL. El
     campo `verificacion` dice hasta dónde llega la evidencia:
       'documentado'  la empresa publica su proceso (fuente oficial
                      o de su blog de ingeniería);
       'parcial'      reconstruido a partir de testimonios públicos.
     Sin al menos una fuente con URL la ficha NO se registra: es la
     regla que impide que aquí acabe información inventada. */

  const COMPANY_REQUIRED = ['id', 'nombre', 'pais', 'sector', 'tech', 'perfiles',
                          'formatos', 'proceso', 'evalua', 'verificacion', 'fuentes'];

  TT.defineCompany = function (c) {
    const missing = COMPANY_REQUIRED.filter(function (k) {
      const v = c[k];
      return v === undefined || v === null || (Array.isArray(v) && !v.length) || v === '';
    });
    if (missing.length) {
      console.warn('[TechTrack] Ficha de empresa "' + (c.id || '?') + '" incompleta:', missing);
    }
    const conUrl = (c.fuentes || []).filter(function (f) { return f && f.url; });
    if (!conUrl.length) {
      console.error('[TechTrack] La empresa "' + c.id + '" no tiene ninguna fuente con URL. No se registra.');
      return null;
    }
    if (c.verificacion === 'documentado' &&
        !conUrl.some(function (f) { return f.tipo === 'oficial' || f.tipo === 'ingenieria'; })) {
      console.warn('[TechTrack] "' + c.id + '" se declara documentado sin fuente oficial ni de ingeniería.');
    }
    if (companyById[c.id]) { console.error('[TechTrack] empresa duplicada: ' + c.id); return null; }
    c.dificultad = c.dificultad || 3;
    /* Sin valor declarado NO se asume que hay prueba de código: se marca
       como desconocido. Dar por hecho que la hay es el sesgo natural de
       quien escribe sobre entrevistas técnicas, y es justo lo que hace
       que la mitad del mercado quede invisible. */
    if (['si', 'no', 'depende'].indexOf(c.pruebaCodigo) === -1) {
      if (c.pruebaCodigo !== undefined) {
        console.warn('[TechTrack] "' + c.id + '": pruebaCodigo debe ser "si", "no" o "depende".');
      }
      c.pruebaCodigo = 'depende';
    }
    companyById[c.id] = c;
    companies.push(c);
    return c;
  };

  /** Campos obligatorios del contrato de ejercicio (los 26 bloques). */
  const REQUIRED = [
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
  const DOCS_REQUIRED = ['resumen', 'conceptos', 'referencia', 'ejemplo', 'glosario', 'preparado'];

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
  const FASE_REQUIRED = ['titulo', 'objetivo', 'codigo', 'explicacion'];

  /**
   * Valida y registra un ejercicio.
   * Falla ruidosamente en consola si falta algún bloque: preferimos
   * detectar contenido incompleto en desarrollo antes que servirlo.
   */
  TT.defineExercise = function (ex) {
    const missing = REQUIRED.filter(function (k) {
      const v = ex[k];
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0) || v === '';
    });
    if (!ex.walkthrough && !ex.fases) missing.push('walkthrough o fases');
    if (missing.length) {
      console.warn('[TechTrack] Ejercicio "' + (ex.id || '?') + '" incompleto. Faltan bloques:', missing);
    }
    if (ex.docs) {
      const faltaDoc = DOCS_REQUIRED.filter(function (k) {
        const v = ex.docs[k];
        return !v || (Array.isArray(v) && !v.length);
      });
      if (faltaDoc.length) {
        console.warn('[TechTrack] Documentación incompleta en "' + ex.id + '":', faltaDoc);
      }
    }
    if (ex.fases) {
      ex.fases.forEach(function (f, i) {
        const falta = FASE_REQUIRED.filter(function (k) { return !f[k]; });
        if (falta.length) {
          console.warn('[TechTrack] Fase ' + (i + 1) + ' de "' + ex.id + '" incompleta:', falta);
        }
      });
      const ultima = ex.fases[ex.fases.length - 1];
      if (ultima && ex.solution && ultima.codigo.trim() !== ex.solution.code.trim()) {
        console.warn('[TechTrack] En "' + ex.id + '" la última fase no coincide con la solución.');
      }
    }
    /* Bloque `empresa`: quién usa una prueba como esta y con qué
       evidencia. Es opcional en el contrato (hay pruebas de estudio
       puro), pero si existe se valida sin piedad: una etiqueta de
       empresa mal puesta es peor que no ponerla. */
    if (ex.empresa) validarBloqueEmpresa(ex);

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
    if (ex.empresa) {
      ex.empresa.empresas = ex.empresa.empresas || [];
      ex.empresa.fuentes = ex.empresa.fuentes || [];
      ex.empresa.evalua = ex.empresa.evalua || [];
    }
    ex.liviano = true;
    byId[ex.id] = ex;
    exercises.push(ex);
    return ex;
  };

  /**
   * Reglas del bloque `empresa` — la parte del proyecto donde más
   * fácil sería mentir, así que es donde más se valida.
   *
   *  - `evidencia` solo puede ser 'documentada' o 'inspirada'.
   *      documentada  hay constancia pública de que esa empresa usa
   *                   una prueba así, y se aporta la fuente.
   *      inspirada    NO afirmamos que sea su prueba: está construida
   *                   a partir de su pila, su puesto y su proceso.
   *  - Una prueba 'documentada' necesita al menos una fuente con URL.
   *    Sin fuente se degrada automáticamente a 'inspirada', en vez de
   *    dejar en la interfaz una afirmación que no podemos sostener.
   *  - Toda empresa referenciada tiene que existir en el registro.
   */
  function validarBloqueEmpresa(ex) {
    const e = ex.empresa;
    e.empresas = e.empresas || [];
    e.fuentes = e.fuentes || [];
    e.evalua = e.evalua || [];

    if (e.evidencia !== 'documentada' && e.evidencia !== 'inspirada') {
      console.warn('[TechTrack] "' + ex.id + '": evidencia debe ser "documentada" o "inspirada".');
      e.evidencia = 'inspirada';
    }
    if (e.evidencia === 'documentada' && !e.fuentes.some(function (f) { return f && f.url; })) {
      console.warn('[TechTrack] "' + ex.id + '" se declaraba documentada sin fuente. Degradada a inspirada.');
      e.evidencia = 'inspirada';
    }
    e.empresas.forEach(function (id) {
      if (!companyById[id]) {
        console.warn('[TechTrack] "' + ex.id + '" referencia una empresa desconocida: ' + id);
      }
    });
  }

  TT.definePath = function (p) {
    pathById[p.id] = p;
    paths.push(p);
    return p;
  };

  /* ---------- Consultas ---------- */

  TT.all = function () { return exercises.slice(); };

  TT.companies = function () {
    return companies.slice().sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });
  };
  TT.company = function (id) { return companyById[id] || null; };

  /** Pruebas asociadas a una empresa, las documentadas primero. */
  TT.exercisesByCompany = function (id) {
    return exercises.filter(function (ex) {
      return ex.empresa && ex.empresa.empresas.indexOf(id) !== -1;
    }).sort(function (a, b) {
      const da = a.empresa.evidencia === 'documentada' ? 0 : 1;
      const db = b.empresa.evidencia === 'documentada' ? 0 : 1;
      return da - db || TT.LEVELS[a.level].order - TT.LEVELS[b.level].order;
    });
  };

  /** Cuántas pruebas hay por empresa, para las tarjetas del listado. */
  TT.companyCounts = function () {
    const counts = {};
    exercises.forEach(function (ex) {
      if (!ex.empresa) return;
      ex.empresa.empresas.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; });
    });
    return counts;
  };
  TT.get = function (id) { return byId[id] || null; };
  TT.paths = function () { return paths.slice(); };
  TT.path = function (id) { return pathById[id] || null; };

  TT.query = function (filters) {
    filters = filters || {};
    const text = (filters.text || '').toLowerCase().trim();
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

      /* Ejes que solo existen en las pruebas con bloque `empresa`.
         Filtrar por cualquiera de ellos descarta, por definición, las
         pruebas de estudio puro: eso es exactamente lo que se pide. */
      if (filters.company &&
          (!ex.empresa || ex.empresa.empresas.indexOf(filters.company) === -1)) return false;
      if (filters.role && (!ex.empresa || ex.empresa.rol !== filters.role)) return false;
      if (filters.formato && (!ex.empresa || ex.empresa.formato !== filters.formato)) return false;
      if (filters.evidencia && (!ex.empresa || ex.empresa.evidencia !== filters.evidencia)) return false;
      if (filters.dificultad &&
          (!ex.empresa || ex.empresa.dificultad !== Number(filters.dificultad))) return false;

      // Duración de la prueba: corta ≤ 30 min · media 31-90 · larga > 90.
      if (filters.duracion) {
        const t = ex.time;
        if (filters.duracion === 'corta' && t > 30) return false;
        if (filters.duracion === 'media' && (t <= 30 || t > 90)) return false;
        if (filters.duracion === 'larga' && t <= 90) return false;
      }

      if (text) {
        const hay = [ex.title, ex.goal, ex.context, ex.tech.join(' '), ex.skills.join(' '), ex.tags.join(' '),
                   ex.empresa
                     ? (ex.empresa.puesto || '') + ' ' + ex.empresa.empresas.map(function (id) {
                         return companyById[id] ? companyById[id].nombre : id;
                       }).join(' ')
                     : '']
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
    const counts = {};
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
          const s = document.createElement('script');
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
      return TT.loadContent(base, ['content/taxonomy.js', 'content/companies.js',
                                   'content/indice.js', 'content/paths.js'])
        .then(function () { return TT; });
    }

    return TT.loadContent(base, ['content/manifest.js'])
      .then(function () {
        return TT.loadContent(base, (TT.MANIFEST || []).map(function (f) { return 'content/' + f; }));
      })
      .then(function () { return TT; });
  };

})(window);

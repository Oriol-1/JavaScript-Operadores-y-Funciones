/* Verificación de contenido: ejecuta cada solución de referencia contra
   sus propios tests usando exactamente el harness del sandbox. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Ejecutar desde la raíz:  node tools/verificar.js
const ROOT = process.argv[2] || path.join(__dirname, '..');

// --- Entorno mínimo de navegador para cargar el registro y el contenido ---
const sandboxGlobal = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  Promise, JSON, Math, Date, Number, String, Object, Array, Error,
  document: { createElement: () => ({ addEventListener() {} }), head: { appendChild() {} } },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  addEventListener() {}
};
sandboxGlobal.window = sandboxGlobal;
const ctx = vm.createContext(sandboxGlobal);

function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
}

load('assets/js/core/registry.js');
load('assets/js/core/store.js');
load('content/manifest.js');
ctx.TT.MANIFEST.forEach(f => load('content/' + f));

const TT = ctx.TT;

// --- Harness idéntico al del sandbox ---
// El `var` de estas cadenas es deliberado: se concatenan con el código
// de la solución, y con let/const una redeclaración sería SyntaxError.
function harnessSource() {
  return [
    'return (async function () {',
    '  for (var __i__ = 0; __i__ < __CASES__.length; __i__++) {',
    '    var __c__ = __CASES__[__i__];',
    '    try {',
    '      var __r__ = await eval(__c__.code);',
    '      __OUT__.push({ name: __c__.name, pass: __r__ !== false,',
    '        detail: __r__ === false ? "La comprobación devolvió false." : "" });',
    '    } catch (__e__) {',
    '      __OUT__.push({ name: __c__.name, pass: false, detail: __e__.message });',
    '    }',
    '  }',
    '  return __OUT__;',
    '})();'
  ].join('\n');
}

function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function fmt(v) { try { return JSON.stringify(v); } catch (e) { return String(v); } }
function expect(actual) {
  return {
    toBe: e => { if (actual !== e) throw new Error('Se esperaba ' + fmt(e) + ' y se recibió ' + fmt(actual)); return true; },
    toEqual: e => { if (!eq(actual, e)) throw new Error('Se esperaba ' + fmt(e) + ' y se recibió ' + fmt(actual)); return true; },
    toBeTruthy: () => { if (!actual) throw new Error('Se esperaba verdadero, se recibió ' + fmt(actual)); return true; },
    toBeFalsy: () => { if (actual) throw new Error('Se esperaba falso, se recibió ' + fmt(actual)); return true; },
    toBeCloseTo: (e, d = 2) => { if (Math.abs(actual - e) > Math.pow(10, -d) / 2) throw new Error('~' + e + ' vs ' + actual); return true; },
    toContain: x => { if (!actual || actual.indexOf(x) === -1) throw new Error(fmt(actual) + ' no contiene ' + fmt(x)); return true; },
    toHaveLength: n => { if (!actual || actual.length !== n) throw new Error('Longitud ' + n + ' esperada, recibida ' + (actual ? actual.length : 'nada')); return true; },
    toThrow: () => { let t = false; try { actual(); } catch (e) { t = true; } if (!t) throw new Error('No lanzó'); return true; }
  };
}

(async () => {
  let fallos = 0, total = 0, conTests = 0;

  // --- Validación estructural de los 26 bloques ---
  const REQ = ['id','title','category','level','context','situation','goal','tech','skills','time',
    'requirements','docs','solution','rationale','alternatives','commonErrors','bestPractices',
    'companyLooksFor','scoring','reinforce'];

  const DOCS_REQ = ['resumen','conceptos','referencia','ejemplo','glosario','preparado'];

  for (const ex of TT.all()) {
    const falta = REQ.filter(k => !ex[k] || (Array.isArray(ex[k]) && !ex[k].length));
    // La explicación paso a paso vale en cualquiera de sus dos formas.
    if (!ex.walkthrough && !ex.fases) falta.push('walkthrough o fases');
    if (falta.length) { console.log('  ESTRUCTURA  ' + ex.id + ' faltan: ' + falta.join(', ')); fallos++; }

    // La documentación debe bastar por sí sola para intentar la prueba.
    if (ex.docs) {
      const faltaDoc = DOCS_REQ.filter(k => {
        const v = ex.docs[k];
        return !v || (Array.isArray(v) && !v.length);
      });
      if (faltaDoc.length) { console.log('  DOCS  ' + ex.id + ' faltan: ' + faltaDoc.join(', ')); fallos++; }
      else {
        if (!ex.docs.ejemplo.codigo || !ex.docs.ejemplo.titulo || !ex.docs.ejemplo.texto) {
          console.log('  DOCS  ' + ex.id + ': el ejemplo necesita titulo, codigo y texto'); fallos++;
        }
        if (ex.docs.conceptos.length < 3) {
          console.log('  DOCS  ' + ex.id + ': solo ' + ex.docs.conceptos.length + ' concepto(s), mínimo 3'); fallos++;
        }
        // Un ejemplo idéntico a la solución convertiría la documentación
        // en un atajo y vaciaría de sentido el ejercicio.
        if (ex.docs.ejemplo.codigo.trim() === ex.solution.code.trim()) {
          console.log('  DOCS  ' + ex.id + ': el ejemplo es la propia solución'); fallos++;
        }
      }
    }

    // Las fases deben mostrar el archivo COMPLETO y desembocar en la solución.
    if (ex.fases) {
      // Detector de fragmentos, estructural en vez de por longitud: toda fase
      // debe contener la función PRINCIPAL, que es la última declaración de
      // nivel superior de la solución (los auxiliares se declaran antes y
      // pueden aparecer solo en fases avanzadas).
      const decls = [...ex.solution.code.matchAll(
        /^(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
      const decl = decls[decls.length - 1];

      ex.fases.forEach((f, i) => {
        ['titulo', 'objetivo', 'codigo', 'explicacion'].forEach(k => {
          if (!f[k]) { console.log('  FASES ' + ex.id + ' fase ' + (i + 1) + ': falta ' + k); fallos++; }
        });
        if (decl && f.codigo && f.codigo.indexOf(decl) === -1) {
          console.log('  FASES ' + ex.id + ' fase ' + (i + 1) + ': no contiene "' + decl +
                      '"; ¿es un fragmento en vez del archivo completo?');
          fallos++;
        }
      });
      const ultima = ex.fases[ex.fases.length - 1];
      if (ultima && ultima.codigo.trim() !== ex.solution.code.trim()) {
        console.log('  FASES ' + ex.id + ': la última fase NO coincide con solution.code'); fallos++;
      }
      if (ex.fases.length < 3) {
        console.log('  FASES ' + ex.id + ': solo ' + ex.fases.length + ' fase(s), mínimo 3'); fallos++;
      }
    }
    // Vídeos de apoyo: opcionales, pero si están, que sean enlaces
    // presentables. Un enlace sin `porque` es un enlace que nadie va a
    // abrir, y uno sin https se lo come el navegador.
    if (ex.recursos && ex.recursos.length) {
      ex.recursos.forEach((r, i) => {
        const faltaRec = ['titulo', 'canal', 'url', 'idioma', 'porque'].filter(k => !r[k]);
        if (faltaRec.length) {
          console.log('  RECURSOS ' + ex.id + ' #' + (i + 1) + ' faltan: ' + faltaRec.join(', ')); fallos++;
        }
        if (r.url && r.url.indexOf('https://') !== 0) {
          console.log('  RECURSOS ' + ex.id + ' #' + (i + 1) + ' no usa https: ' + r.url); fallos++;
        }
        if (r.idioma && r.idioma !== 'es' && r.idioma !== 'en') {
          console.log('  RECURSOS ' + ex.id + ' #' + (i + 1) + ' idioma desconocido: ' + r.idioma); fallos++;
        }
      });
    }
    if (!TT.CATEGORIES[ex.category]) { console.log('  CATEGORIA desconocida en ' + ex.id + ': ' + ex.category); fallos++; }
    if (!TT.LEVELS[ex.level]) { console.log('  NIVEL desconocido en ' + ex.id + ': ' + ex.level); fallos++; }
    const suma = ex.scoring.rubric.reduce((a, r) => a + r.weight, 0);
    if (suma !== 100) { console.log('  RUBRICA de ' + ex.id + ' suma ' + suma + ', no 100'); fallos++; }
  }

  // --- Fichas de empresa: ninguna afirmación sin fuente ---
  //
  // Esta sección existe por un requisito explícito del proyecto: nunca
  // presentar como prueba oficial algo que no podamos demostrar. Si
  // alguien añade una empresa sin enlace, o marca una prueba como
  // documentada sin evidencia, la verificación falla y no llega a la
  // rama principal.
  const EMPRESA_REQ = ['id', 'nombre', 'pais', 'sector', 'tech', 'perfiles',
                       'formatos', 'proceso', 'evalua', 'verificacion', 'fuentes'];

  for (const c of TT.companies()) {
    const falta = EMPRESA_REQ.filter(k => !c[k] || (Array.isArray(c[k]) && !c[k].length));
    if (falta.length) { console.log('  EMPRESA ' + c.id + ' faltan: ' + falta.join(', ')); fallos++; }

    const conUrl = (c.fuentes || []).filter(f => f && f.url && /^https?:\/\//.test(f.url));
    if (!conUrl.length) {
      console.log('  EMPRESA ' + c.id + ': ninguna fuente con URL válida'); fallos++;
    }
    if (c.verificacion !== 'documentado' && c.verificacion !== 'parcial') {
      console.log('  EMPRESA ' + c.id + ": verificacion debe ser 'documentado' o 'parcial'"); fallos++;
    }
    if (c.verificacion === 'documentado' &&
        !conUrl.some(f => f.tipo === 'oficial' || f.tipo === 'ingenieria')) {
      console.log('  EMPRESA ' + c.id + ': declarada documentado sin fuente oficial ni de ingeniería'); fallos++;
    }
    for (const f of c.formatos) {
      if (!TT.FORMATOS[f]) { console.log('  EMPRESA ' + c.id + ': formato desconocido "' + f + '"'); fallos++; }
    }
    for (const p of c.perfiles) {
      if (!TT.ROLES[p]) { console.log('  EMPRESA ' + c.id + ': perfil desconocido "' + p + '"'); fallos++; }
    }
    if (!TT.DIFICULTAD[c.dificultad]) {
      console.log('  EMPRESA ' + c.id + ': dificultad fuera de la escala 1-5'); fallos++;
    }
    if (!TT.PRUEBA_CODIGO[c.pruebaCodigo]) {
      console.log('  EMPRESA ' + c.id + ": pruebaCodigo debe ser 'si', 'no' o 'depende'"); fallos++;
    }
    // Coherencia: si se dice que NO hay prueba de código, no puede
    // declararse a la vez un formato que consiste en escribir código.
    const FORMATOS_CON_CODIGO = ['algoritmos', 'live-coding', 'pair-programming', 'bug-squash',
                                 'refactor', 'take-home', 'mini-app', 'api-integration', 'sql'];
    if (c.pruebaCodigo === 'no' && c.formatos.some(f => FORMATOS_CON_CODIGO.indexOf(f) !== -1)) {
      console.log('  EMPRESA ' + c.id + ': dice no tener prueba de código pero declara un formato que la implica');
      fallos++;
    }
    for (const fase of c.proceso) {
      if (!fase.fase || !fase.que) { console.log('  EMPRESA ' + c.id + ': fase del proceso incompleta'); fallos++; }
      if (fase.formato && !TT.FORMATOS[fase.formato]) {
        console.log('  EMPRESA ' + c.id + ': fase con formato desconocido "' + fase.formato + '"'); fallos++;
      }
    }
  }

  // --- Bloque `empresa` de cada prueba ---
  for (const ex of TT.all()) {
    const e = ex.empresa;
    if (!e) continue;
    if (e.evidencia !== 'documentada' && e.evidencia !== 'inspirada') {
      console.log('  VINCULO ' + ex.id + ": evidencia debe ser 'documentada' o 'inspirada'"); fallos++;
    }
    if (!e.empresas || !e.empresas.length) {
      console.log('  VINCULO ' + ex.id + ': sin empresas asociadas'); fallos++;
    }
    for (const id of (e.empresas || [])) {
      if (!TT.company(id)) { console.log('  VINCULO ' + ex.id + ': empresa inexistente "' + id + '"'); fallos++; }
    }
    if (!TT.ROLES[e.rol]) { console.log('  VINCULO ' + ex.id + ': rol desconocido "' + e.rol + '"'); fallos++; }
    if (!TT.FORMATOS[e.formato]) { console.log('  VINCULO ' + ex.id + ': formato desconocido "' + e.formato + '"'); fallos++; }
    if (!TT.DIFICULTAD[e.dificultad]) { console.log('  VINCULO ' + ex.id + ': dificultad fuera de 1-5'); fallos++; }
    if (!e.evalua || !e.evalua.length) { console.log('  VINCULO ' + ex.id + ': falta "evalua"'); fallos++; }
    if (!e.nota) { console.log('  VINCULO ' + ex.id + ': falta "nota" (qué es nuestro y qué de la empresa)'); fallos++; }
    // La regla que impide vender como oficial algo que no lo es.
    const fuentesOk = (e.fuentes || []).filter(f => f && f.url && /^https?:\/\//.test(f.url));
    if (!fuentesOk.length) {
      console.log('  VINCULO ' + ex.id + ': ninguna fuente con URL'); fallos++;
    }
    if (e.evidencia === 'documentada' && !fuentesOk.length) {
      console.log('  VINCULO ' + ex.id + ': declarada documentada sin fuente comprobable'); fallos++;
    }
  }

  // --- Referencias de las rutas ---
  for (const p of TT.paths()) {
    for (const s of p.steps) {
      if (s.exercise && !TT.get(s.exercise)) { console.log('  RUTA ' + p.id + ' apunta a prueba inexistente: ' + s.exercise); fallos++; }
      if (s.lab && !fs.existsSync(path.join(ROOT, s.lab))) { console.log('  RUTA ' + p.id + ' apunta a laboratorio inexistente: ' + s.lab); fallos++; }
    }
  }

  // --- Ejecución de las soluciones de referencia ---
  for (const ex of TT.all()) {
    if (!ex.tests) { console.log('· ' + ex.id + ' — sin tests automáticos (rúbrica)'); continue; }
    if (ex.tests.mode === 'checklist') {
      const suma = ex.tests.items.reduce((a, i) => a + i.peso, 0);
      console.log((suma === 100 ? '· ' : '✗ ') + ex.id + ' — checklist, pesos suman ' + suma);
      if (suma !== 100) fallos++;
      continue;
    }
    conTests++;
    const cuerpo = (ex.tests.setup || '') + '\n;;\n' + ex.solution.code + '\n;;\n' + harnessSource();
    const out = [];
    // Algunas soluciones de referencia imprimen por consola a propósito
    // (el ejercicio del bucle de eventos, por ejemplo). Silenciamos esa
    // salida para que el informe del verificador quede legible.
    const logOriginal = console.log;
    console.log = () => {};
    try {
      const fn = new Function('expect', '__CASES__', '__OUT__', cuerpo);
      await fn(expect, ex.tests.cases, out);
      await new Promise(r => setTimeout(r, 0));   // deja salir los timers de la solución
    } catch (e) {
      console.log = logOriginal;
      console.log('✗ ' + ex.id + ' — la solución de referencia no ejecuta: ' + e.message);
      fallos++; continue;
    }
    console.log = logOriginal;
    const ok = out.filter(r => r.pass).length;
    total += out.length;
    if (ok === out.length && out.length === ex.tests.cases.length) {
      console.log('✓ ' + ex.id + ' — ' + ok + '/' + out.length + ' tests');
    } else {
      console.log('✗ ' + ex.id + ' — ' + ok + '/' + out.length);
      out.filter(r => !r.pass).forEach(r => console.log('     ✕ ' + r.name + ' :: ' + r.detail));
      fallos++;
    }
  }

  const conFases = TT.all().filter(e => e.fases).length;
  const conDocs = TT.all().filter(e => e.docs).length;
  const conEmpresa = TT.all().filter(e => e.empresa).length;
  const documentadas = TT.all().filter(e => e.empresa && e.empresa.evidencia === 'documentada').length;
  const empDoc = TT.companies().filter(c => c.verificacion === 'documentado').length;
  const conVideos = TT.all().filter(e => e.recursos && e.recursos.length);
  const videos = conVideos.reduce((a, e) => a + e.recursos.length, 0);
  console.log('\n' + TT.all().length + ' pruebas · ' + conTests + ' con tests automáticos · ' + total +
              ' aserciones · ' + conDocs + ' con documentación · ' + conFases + ' con fases · ' +
              conVideos.length + ' con vídeos de apoyo (' + videos + ' enlaces)');
  const porPrueba = { si: 0, no: 0, depende: 0 };
  TT.companies().forEach(c => { porPrueba[c.pruebaCodigo]++; });
  console.log(TT.companies().length + ' empresas (' + empDoc + ' con proceso publicado) · ' +
              conEmpresa + ' pruebas vinculadas · ' + documentadas + ' documentadas · ' +
              (conEmpresa - documentadas) + ' inspiradas');
  console.log('Prueba de código: ' + porPrueba.si + ' sí · ' + porPrueba.depende +
              ' según equipo o nivel · ' + porPrueba.no + ' no');
  console.log(fallos === 0 ? 'TODO CORRECTO' : fallos + ' PROBLEMA(S)');
  process.exit(fallos ? 1 : 0);
})();

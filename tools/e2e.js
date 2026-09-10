/* ============================================================
   Pruebas en un navegador de verdad
   ------------------------------------------------------------
   Cubre los dos huecos que dejan las demás comprobaciones:

   1. Los LABORATORIOS, que cargan Monaco, Babel y highlight.js
      desde un CDN. `humo.js` no los toca, así que una subida de
      versión que los rompiera pasaría desapercibida hasta que
      alguien abriera el archivo.
   2. Los MANEJADORES DE EVENTOS: clics en filtros, cambio de
      pestañas, ejecutar los tests en el sandbox. `humo.js`
      ejerce el renderizado, no la interacción.

   No está en la integración continua porque necesita un Chrome
   instalado y salida a internet. Se ejecuta a mano tras tocar
   dependencias o el JavaScript de las páginas:

     node tools/e2e.js
   ============================================================ */
'use strict';

const path = require('path');
const { lanzar, abrirPestana, esperar, buscarNavegador } = require('./navegador.js');

const RAIZ = path.join(__dirname, '..');
const url = (archivo, consulta) =>
  'file:///' + encodeURI(RAIZ.replace(/\\/g, '/')) + '/' + archivo + (consulta || '');

let fallos = 0;
let p = null;

async function caso(nombre, fn) {
  process.stdout.write('  ' + nombre.padEnd(54));
  try {
    const detalle = await fn();
    console.log('OK' + (detalle ? '  ' + detalle : ''));
  } catch (e) {
    console.log('FALLA  ' + e.message);
    if (p && p.fallosDeRed.length) console.log('          red: ' + p.fallosDeRed.slice(0, 2).join(' | '));
    fallos++;
  }
}

/** Los errores de favicon son ruido inevitable con file://. */
function sinErrores() {
  const e = p.errores.filter(x => !/favicon/i.test(x));
  if (e.length) throw new Error('errores en consola: ' + e.slice(0, 2).join(' | '));
}

/* ---------------- Laboratorios ---------------- */

const LABS = [
  { archivo: 'ts_lab.html',    editores: 2, babel: true },
  { archivo: 'async_lab.html', editores: 1 },
  { archivo: 'scope_lab.html', editores: 1 },
  { archivo: 'dom_lab.html',   editores: 1 }
];

async function probarLaboratorios() {
  console.log('\n--- laboratorios (Monaco, Babel y highlight.js desde CDN) ---');

  for (const lab of LABS) {
    await caso(lab.archivo, async () => {
      await p.ir(url(lab.archivo));

      await p.esperarQue('typeof require === "function" && typeof require.config === "function"', 30000);
      await p.esperarQue('typeof monaco !== "undefined" && !!monaco.editor', 45000);

      const nEditores = await p.esperarQue(
        'monaco.editor.getEditors ? monaco.editor.getEditors().length : 0', 30000);
      const contenido = await p.evaluar('monaco.editor.getEditors().map(e => e.getValue().length)');
      const version = await p.evaluar(
        'document.querySelector(\'script[src*="monaco-editor"]\').src.match(/monaco-editor\\/([0-9.]+)\\//)[1]');

      let extra = '';
      if (lab.babel) {
        await p.esperarQue('typeof Babel !== "undefined" && !!Babel.transform', 45000);
        const vBabel = await p.evaluar('Babel.version');
        // Compila TypeScript de verdad, igual que el botón del laboratorio.
        const salida = await p.evaluar(
          'Babel.transform("interface U{n:string} const f=(u:U):string=>u.n;", ' +
          '{ presets:["typescript"], filename:"example.ts" }).code');
        if (!salida.includes('const f')) throw new Error('Babel no compiló el TypeScript');
        extra = ' · Babel ' + vBabel + ' compila';
      }

      if (nEditores < lab.editores) throw new Error('esperaba ' + lab.editores + ' editores, hay ' + nEditores);
      if (contenido.some(c => c === 0)) throw new Error('hay un editor vacío');
      sinErrores();

      return 'Monaco ' + version + ' · ' + nEditores + ' editor(es) · ' + contenido.join('/') + ' chars' + extra;
    });
  }

  await caso('algoritmos.html', async () => {
    await p.ir(url('algoritmos.html'));
    await p.esperarQue('typeof hljs !== "undefined" && !!hljs.highlightElement', 30000);
    const v = await p.evaluar('hljs.versionString || "?"');
    const resalta = await p.evaluar(
      '(function(){ var e=document.createElement("code"); e.textContent="const x = 1;";' +
      ' hljs.highlightElement(e); return e.innerHTML.includes("hljs-"); })()');
    if (!resalta) throw new Error('highlight.js no resalta');
    return 'highlight.js ' + v + ' · resalta';
  });
}

/* ---------------- Interacción de la plataforma ---------------- */

async function probarCatalogo() {
  console.log('\n--- catalogo.html ---');
  await p.ir(url('catalogo.html'));
  await p.esperarQue('document.querySelectorAll("#resultados .card").length > 0', 20000);

  const total = await p.evaluar('TT.all().length');

  await caso('pinta todas las pruebas del catálogo', async () => {
    sinErrores();
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n !== total) throw new Error('esperaba ' + total + ', hay ' + n);
    return n + ' tarjetas';
  });

  await caso('un clic en un chip de área filtra', async () => {
    await p.evaluar('document.querySelector(\'#f-categorias .chip[data-valor="ai"]\').click()');
    await esperar(300);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    const pulsado = await p.evaluar(
      'document.querySelector(\'#f-categorias .chip[data-valor="ai"]\').getAttribute("aria-pressed")');
    if (n >= total) throw new Error('no filtró');
    if (pulsado !== 'true') throw new Error('el chip no quedó marcado');
    return total + ' -> ' + n;
  });

  /* El contador de vídeos viaja en el índice ligero, no en el contenido
     completo: si alguien lo deja de generar, el catálogo se queda sin
     marca y sin filtro sin que falle nada más. */
  await caso('el filtro de vídeos deja solo las pruebas marcadas', async () => {
    await p.evaluar('document.querySelector(\'#f-categorias .chip[data-valor="ai"]\').click()');
    await esperar(200);
    await p.evaluar('document.querySelector(\'#f-videos .chip[data-valor="si"]\').click()');
    await esperar(300);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    const esperados = await p.evaluar('TT.all().filter(e=>e.videos).length');
    const marcadas = await p.evaluar(
      'Array.from(document.querySelectorAll("#resultados .card")).filter(c=>c.textContent.indexOf("▶")>-1).length');
    if (n !== esperados) throw new Error('esperaba ' + esperados + ' tarjetas, hay ' + n);
    if (marcadas !== n) throw new Error('solo ' + marcadas + ' de ' + n + ' llevan la marca ▶');
    await p.evaluar('document.querySelector(\'#f-videos .chip[data-valor="si"]\').click()');
    await esperar(200);
    await p.evaluar('document.querySelector(\'#f-categorias .chip[data-valor="ai"]\').click()');
    await esperar(200);
    return n + ' pruebas, todas marcadas';
  });

  await caso('el filtro se sincroniza con la URL', async () => {
    const q = await p.evaluar('location.search');
    if (!q.includes('categoria=ai')) throw new Error('la URL no cambió: ' + q);
    return q;
  });

  await caso('el segundo clic desactiva el filtro', async () => {
    await p.evaluar('document.querySelector(\'#f-categorias .chip[data-valor="ai"]\').click()');
    await esperar(300);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n !== total) throw new Error('esperaba volver a ' + total + ', hay ' + n);
    return 'vuelve a ' + n;
  });

  await caso('la búsqueda con retardo filtra', async () => {
    await p.evaluar('(function(){ var i=document.getElementById("q"); i.value="stripe";' +
                    ' i.dispatchEvent(new Event("input",{bubbles:true})); })()');
    await esperar(600);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n === 0 || n === total) throw new Error('la búsqueda no filtró (' + n + ')');
    return '"stripe" -> ' + n;
  });

  await caso('un filtro en la URL abre el bloque plegado', async () => {
    await p.ir(url('catalogo.html', '?empresa=holded'));
    await p.esperarQue('document.querySelectorAll("#resultados .card").length > 0', 20000);
    sinErrores();
    if (!await p.evaluar('document.getElementById("filtros-empresa").open')) {
      throw new Error('el <details> no se abrió solo');
    }
    return 'abierto';
  });
}

async function probarEmpresas() {
  console.log('\n--- empresas.html ---');
  await p.ir(url('empresas.html'));
  await p.esperarQue('document.querySelectorAll("#resultados .card").length > 0', 20000);

  const total = await p.evaluar('TT.companies().length');

  await caso('lista todas las empresas', async () => {
    sinErrores();
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n !== total) throw new Error('esperaba ' + total + ', hay ' + n);
    return n + ' empresas';
  });

  await caso('el filtro de prueba de código funciona', async () => {
    const esperado = await p.evaluar('TT.companies().filter(c => c.pruebaCodigo === "no").length');
    await p.evaluar('document.querySelector(\'#f-prueba .chip[data-valor="no"]\').click()');
    await esperar(300);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n !== esperado) throw new Error('esperaba ' + esperado + ', hay ' + n);
    await p.evaluar('document.querySelector(\'#f-prueba .chip[data-valor="no"]\').click()');
    await esperar(200);
    return 'sin prueba de código -> ' + n;
  });

  await caso('el filtro de ubicación cuadra con su propia etiqueta', async () => {
    // El número esperado se lee del chip ("Barcelona · 11") en vez de fijarlo
    // a mano: así el test comprueba coherencia y no caduca al añadir empresas.
    const chip = await p.evaluar('document.querySelector(\'#f-ciudades .chip\').textContent');
    const esperado = Number(chip.split('·').pop().trim());
    await p.evaluar('document.querySelector(\'#f-ciudades .chip\').click()');
    await esperar(300);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n !== esperado) throw new Error('el chip anuncia ' + esperado + ' y se muestran ' + n);
    return chip.trim() + ' -> ' + n + ', coincide';
  });

  await caso('limpiar filtros restaura la lista', async () => {
    await p.evaluar('document.getElementById("limpiar").click()');
    await esperar(300);
    const n = await p.evaluar('document.querySelectorAll("#resultados .card").length');
    if (n !== total) throw new Error('esperaba ' + total + ', hay ' + n);
    return 'vuelve a ' + n;
  });

  await caso('una ficha muestra proceso y fuentes enlazadas', async () => {
    await p.ir(url('empresas.html', '?id=holded'));
    await p.esperarQue('document.querySelectorAll(".proceso li").length > 0', 20000);
    sinErrores();
    const fases = await p.evaluar('document.querySelectorAll(".proceso li").length');
    const fuentes = await p.evaluar('document.querySelectorAll(".fuente a").length');
    if (fases < 3 || fuentes < 1) throw new Error('fases=' + fases + ' fuentes=' + fuentes);
    return fases + ' fases · ' + fuentes + ' fuentes';
  });

  await caso('la ficha sin prueba de código avisa en vez de quedar vacía', async () => {
    await p.ir(url('empresas.html', '?id=consultora-servicios'));
    await p.esperarQue('document.body.textContent.length > 2000', 20000);
    sinErrores();
    if (!await p.evaluar('document.body.textContent.includes("Aquí no hay nada que practicar")')) {
      throw new Error('falta el aviso');
    }
    return 'aviso presente';
  });
}

async function probarRunner() {
  console.log('\n--- prueba.html: runner y sandbox ---');
  const id = 'bcn-desembolsos-comisiones';
  await p.ir(url('prueba.html', '?id=' + id));
  await p.esperarQue('!!document.getElementById("editor")', 25000);

  await caso('carga con la cabecera de empresa y su evidencia', async () => {
    sinErrores();
    const t = await p.evaluar('document.body.textContent');
    if (!t.includes('SeQura')) throw new Error('no aparece la empresa');
    if (!t.includes('Prueba documentada')) throw new Error('no aparece la etiqueta de evidencia');
    return 'empresa y evidencia visibles';
  });

  await caso('las pestañas cambian de panel', async () => {
    await p.evaluar('document.querySelector(\'.tab[data-tab="documentacion"]\').click()');
    await esperar(200);
    const vis = await p.evaluar('document.getElementById("p-documentacion").classList.contains("activo")');
    const ocu = await p.evaluar('document.getElementById("p-enunciado").hidden');
    if (!vis || !ocu) throw new Error('el panel no cambió');
    return 'Documentación se muestra';
  });

  await caso('abrir una pista queda registrado', async () => {
    await p.evaluar('document.querySelector(\'.tab[data-tab="resolver"]\').click()');
    await esperar(150);
    await p.evaluar('(function(){ var d=document.querySelector("[data-pista]"); d.open=true;' +
                    ' d.dispatchEvent(new Event("toggle")); })()');
    await esperar(300);
    const t = await p.evaluar('document.getElementById("tarjeta-estado").textContent');
    if (!/Pistas usadas: 1/.test(t)) throw new Error('no se registró');
    return 'registrada';
  });

  await caso('EL SANDBOX ejecuta la solución y pasa todos los tests', async () => {
    const esperados = await p.evaluar('TT.get("' + id + '").tests.cases.length');
    await p.evaluar('(function(){ var e=document.getElementById("editor");' +
                    ' e.value = TT.get("' + id + '").solution.code;' +
                    ' e.dispatchEvent(new Event("input",{bubbles:true})); })()');
    await p.evaluar('document.getElementById("btn-run").click()');
    await p.esperarQue('document.querySelectorAll("#resultados .test-row").length > 0', 30000);
    const total = await p.evaluar('document.querySelectorAll("#resultados .test-row").length');
    const pasan = await p.evaluar('document.querySelectorAll("#resultados .test-pass").length');
    if (pasan !== total || total !== esperados) throw new Error(pasan + '/' + total + ' de ' + esperados);
    return pasan + ' de ' + total + ' superados en el iframe aislado';
  });

  await caso('una solución incorrecta falla como debe', async () => {
    await p.evaluar('(function(){ var e=document.getElementById("editor");' +
                    ' e.value = "function calcularDesembolsos(p){ return []; }";' +
                    ' e.dispatchEvent(new Event("input",{bubbles:true})); })()');
    await p.evaluar('document.getElementById("btn-run").click()');
    await p.esperarQue('document.querySelectorAll("#resultados .test-fail").length > 0', 30000);
    const fallan = await p.evaluar('document.querySelectorAll("#resultados .test-fail").length');
    return fallan + ' tests fallan, como corresponde';
  });

  await caso('desbloquear muestra fases y solución', async () => {
    await p.evaluar('document.querySelector(\'.tab[data-tab="solucion"]\').click()');
    await esperar(150);
    await p.evaluar('document.getElementById("btn-desbloquear").click()');
    await esperar(400);
    const bloques = await p.evaluar('document.querySelectorAll("#p-solucion pre.code").length');
    if (bloques < 2) throw new Error('no aparecieron fases y solución');
    return bloques + ' bloques de código';
  });

  /* Los vídeos de apoyo son enlaces a un sitio de fuera: lo que puede
     romperse no es el texto sino que se abran mal (misma pestaña, sin
     rel) o que el bloque desaparezca al tocar la documentación. */
  await caso('los vídeos de apoyo salen enlazados a YouTube', async () => {
    await p.ir(url('prueba.html', '?id=alg-ventana-deslizante'));
    await p.esperarQue('!!document.getElementById("editor")', 25000);
    await p.evaluar('document.querySelector(\'.tab[data-tab="documentacion"]\').click()');
    await esperar(200);
    const enlaces = await p.evaluar(
      'JSON.stringify(Array.from(document.querySelectorAll("#p-documentacion a"))' +
      '.filter(a=>a.href.indexOf("youtube.com")>-1)' +
      '.map(a=>({t:a.target,r:a.rel})))');
    const lista = JSON.parse(enlaces);
    const esperados = await p.evaluar('TT.get("alg-ventana-deslizante").recursos.length');
    if (lista.length !== esperados) {
      throw new Error('esperaba ' + esperados + ' enlaces, hay ' + lista.length);
    }
    const malos = lista.filter(a => a.t !== '_blank' || a.r.indexOf('noopener') === -1);
    if (malos.length) throw new Error(malos.length + ' enlaces sin target o sin rel seguro');
    return lista.length + ' vídeos, todos en pestaña nueva';
  });
}

async function probarSimulacion() {
  console.log('\n--- modo simulación ---');
  await p.ir(url('prueba.html', '?id=alg-ventana-deslizante&sim=1'));
  await p.esperarQue('!!document.getElementById("sim-reloj")', 25000);

  await caso('oculta documentación, solución y análisis', async () => {
    sinErrores();
    const tabs = await p.evaluar(
      'Array.from(document.querySelectorAll(".tab")).map(t=>t.dataset.tab).join(",")');
    if (tabs !== 'enunciado,resolver') throw new Error('pestañas visibles: ' + tabs);
    return 'solo ' + tabs;
  });

  await caso('no ofrece pistas', async () => {
    const n = await p.evaluar('document.querySelectorAll("[data-pista]").length');
    if (n !== 0) throw new Error('hay ' + n + ' pistas');
    return '0 pistas';
  });

  await caso('la cuenta atrás avanza', async () => {
    const a = await p.evaluar('document.getElementById("sim-reloj").textContent');
    await esperar(2200);
    const b = await p.evaluar('document.getElementById("sim-reloj").textContent');
    if (a === b) throw new Error('el reloj no se mueve (' + a + ')');
    return a + ' -> ' + b;
  });

  await caso('la cabecera muestra empresa, puesto y nivel', async () => {
    const t = await p.evaluar('document.querySelector(".sim-cabecera").textContent');
    for (const x of ['Google', 'Software Engineer', 'Mid']) {
      if (!t.includes(x)) throw new Error('falta "' + x + '"');
    }
    return 'completa';
  });
}

async function probarInicio() {
  console.log('\n--- index.html ---');
  await p.ir(url('index.html'));
  await p.esperarQue('document.querySelectorAll("#panel-empresas .card").length > 0', 20000);

  await caso('el panel de empresas se pinta', async () => {
    sinErrores();
    const n = await p.evaluar('document.querySelectorAll("#panel-empresas .card").length');
    if (n < 4) throw new Error('solo ' + n + ' fichas');
    return n + ' empresas destacadas';
  });

  await caso('el conmutador de tema cambia y persiste', async () => {
    const antes = await p.evaluar('document.documentElement.getAttribute("data-theme")');
    await p.evaluar('document.getElementById("tt-theme").click()');
    await esperar(200);
    const despues = await p.evaluar('document.documentElement.getAttribute("data-theme")');
    const guardado = await p.evaluar('localStorage.getItem("techtrack.theme")');
    if (antes === despues) throw new Error('el tema no cambió');
    if (guardado !== despues) throw new Error('no se guardó la preferencia');
    return (antes || 'por defecto') + ' -> ' + despues;
  });
}

/* ---------------- Puesta en marcha ---------------- */

(async () => {
  if (!buscarNavegador()) {
    console.log('No hay Chrome ni Edge instalado. Estas pruebas necesitan un navegador.');
    process.exit(0);           // no es un fallo del proyecto: se omite
  }

  const { proc, binario } = await lanzar();
  console.log('Navegador: ' + binario);
  p = await abrirPestana();

  try {
    await probarLaboratorios();
    await probarCatalogo();
    await probarEmpresas();
    await probarRunner();
    await probarSimulacion();
    await probarInicio();
  } finally {
    p.cerrar();
    proc.kill();
  }

  console.log('\n' + (fallos === 0 ? 'NAVEGADOR: TODO CORRECTO' : 'NAVEGADOR: ' + fallos + ' FALLO(S)'));
  process.exit(fallos ? 1 : 0);
})();

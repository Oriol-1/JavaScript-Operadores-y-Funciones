/* ============================================================
   Genera content/indice.js — el registro ligero de ejercicios
   ------------------------------------------------------------
   Las páginas de listado (inicio, catálogo, rutas, progreso) no
   necesitan la solución, la documentación ni las fases de cada
   prueba: solo lo que hace falta para tarjetas, filtros y
   búsqueda. Cargar el contenido completo en esas páginas baja
   cientos de KB que nunca se usan, y ese coste crece con cada
   prueba nueva que se añade al catálogo.

   Este script lee el mismo contenido que carga la plataforma,
   extrae los campos ligeros de cada ejercicio y escribe
   content/indice.js con llamadas a TT.defineExerciseIndice(...).

   Se ejecuta a mano tras añadir o editar un ejercicio:

     node tools/generar-indice.js

   y con --check falla si el índice no está actualizado (lo usa
   la integración continua para que nadie olvide regenerarlo).
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SALIDA = path.join(ROOT, 'content', 'indice.js');

/** Campos que necesitan las páginas de listado, y solo esos. */
const CAMPOS_LIGEROS = [
  'id', 'title', 'category', 'categorias', 'kind', 'level',
  'context', 'situation', 'goal', 'tech', 'skills', 'tags', 'time',
  // El bloque `empresa` es pequeño (una decena de líneas) y lo necesitan
  // el catálogo, las fichas de empresa y la búsqueda. Sin él, filtrar por
  // empresa o por formato obligaría a cargar el contenido completo.
  'empresa'
];

function cargarCatalogo() {
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

  return ctx.TT;
}

function extraerCampos(ex) {
  const ligero = {};
  for (const campo of CAMPOS_LIGEROS) ligero[campo] = ex[campo];
  /* Los vídeos de apoyo no viajan al índice —son texto largo que solo
     hace falta al abrir la prueba—, pero el catálogo sí necesita saber
     CUÁNTOS hay para marcarlo en la tarjeta y poder filtrar. Con el
     número basta, y son dos bytes. */
  if (ex.recursos && ex.recursos.length) ligero.videos = ex.recursos.length;
  return ligero;
}

function generarFuente(entradas) {
  const cabecera =
    '/* ============================================================\n' +
    '   ÍNDICE LIGERO — generado, no editar a mano\n' +
    '   ------------------------------------------------------------\n' +
    '   Regenerar con: node tools/generar-indice.js\n' +
    '   Fuente: content/exercises/*.js (los campos ligeros de cada\n' +
    '   ejercicio: identidad, categorización, textos cortos de\n' +
    '   búsqueda y tecnologías). NO contiene solución, documentación\n' +
    '   ni fases: eso solo se carga en prueba.html.\n' +
    '   ============================================================ */\n' +
    '(function (TT) {\n' +
    "  'use strict';\n\n";

  const cuerpo = entradas
    .map(ex => '  TT.defineExerciseIndice(' + JSON.stringify(ex, null, 2).replace(/\n/g, '\n  ') + ');')
    .join('\n\n');

  const pie = '\n\n})(window.TT);\n';

  return cabecera + cuerpo + pie;
}

function main() {
  const modoComprobacion = process.argv.includes('--check');

  const TT = cargarCatalogo();
  const entradas = TT.all().map(extraerCampos);
  const fuente = generarFuente(entradas);

  if (modoComprobacion) {
    // La comparación ignora el estilo de fin de línea: Windows convierte a
    // CRLF al hacer checkout (core.autocrlf=true, el valor por defecto de
    // Git para Windows), mientras que este script siempre escribe LF. Sin
    // normalizar, cualquier persona en Windows vería un falso positivo
    // aunque el CONTENIDO esté perfectamente al día.
    const normalizar = (s) => (s || '').replace(/\r\n/g, '\n');
    const actual = fs.existsSync(SALIDA) ? fs.readFileSync(SALIDA, 'utf8') : null;
    if (normalizar(actual) === normalizar(fuente)) {
      console.log('content/indice.js está actualizado (' + entradas.length + ' pruebas).');
      process.exit(0);
    }
    console.error(
      'content/indice.js NO está actualizado respecto a content/exercises/.\n' +
      'Ejecuta "node tools/generar-indice.js" y añade el archivo al commit.'
    );
    process.exit(1);
  }

  fs.writeFileSync(SALIDA, fuente);
  console.log('content/indice.js generado con ' + entradas.length + ' pruebas.');
}

main();

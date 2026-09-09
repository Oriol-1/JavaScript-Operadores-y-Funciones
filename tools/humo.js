/* ============================================================
   Prueba de humo: ejecuta de verdad el JavaScript de cada página
   ------------------------------------------------------------
   `verificar.js` comprueba el CONTENIDO: que las pruebas tengan
   sus bloques, que las soluciones pasen sus tests, que las fichas
   de empresa tengan fuentes. Pero no ejecuta ni una línea de
   `assets/js/pages/`, así que un error de programación en el
   render del catálogo o de una ficha de empresa no lo detectaba
   nadie hasta abrir el navegador.

   Este script cierra ese hueco. Monta un DOM mínimo —lo justo
   para que el código de las páginas se ejecute— y arranca cada
   página como lo haría el navegador, incluida la inyección de
   scripts de contenido que hace TT.boot().

   No sustituye a probarlo en un navegador: aquí no hay
   maquetación, ni estilos, ni eventos reales. Detecta lo que más
   duele y más fácil se cuela: excepciones al renderizar.

     node tools/humo.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = process.argv[2] || path.join(__dirname, '..');

/* ---------- DOM mínimo ----------
   Cada nodo acepta cualquier operación que use el proyecto y
   registra lo que se le escribe, para poder comprobar después
   que la página realmente pintó algo. */

function crearNodo(nombre) {
  const nodo = {
    tagName: (nombre || 'div').toUpperCase(),
    hijos: [],
    dataset: {},
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    _html: '',
    textContent: '',
    value: '',
    hidden: false,
    open: false,
    tabIndex: 0,
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); },
    setAttribute() {}, getAttribute: () => null, removeAttribute() {},
    addEventListener() {}, removeEventListener() {}, focus() {}, click() {},
    appendChild(hijo) { this.hijos.push(hijo); return hijo; },
    insertBefore(hijo) { this.hijos.unshift(hijo); return hijo; },
    removeChild() {}, closest: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  };
  return nodo;
}

/**
 * Construye un contexto de navegador de mentira y ejecuta una página.
 *
 * La pieza importante es `head.appendChild`: TT.boot() carga el
 * contenido inyectando etiquetas <script>. Aquí eso se traduce en
 * leer el archivo del disco, ejecutarlo en el MISMO contexto y
 * llamar a su `onload`, que es exactamente lo que hace el navegador.
 */
function ejecutarPagina(pagina) {
  const nodos = {};          // id -> nodo, para que getElementById sea estable
  const errores = [];
  const contador = { scripts: 0 };

  const head = crearNodo('head');
  const body = crearNodo('body');

  const documento = {
    documentElement: {
      getAttribute: () => null,
      setAttribute() {},
      dataset: {}
    },
    head: head,
    body: body,
    title: '',
    createElement: crearNodo,
    getElementById: function (id) {
      if (!nodos[id]) nodos[id] = crearNodo('div');
      return nodos[id];
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}
  };

  const ctx = {
    console: {
      log() {}, info() {}, warn() {},
      error: function () { errores.push(Array.prototype.join.call(arguments, ' ')); }
    },
    setTimeout, clearTimeout, setInterval, clearInterval,
    Promise, JSON, Math, Date, Number, String, Object, Array, Error, RegExp, Boolean,
    encodeURIComponent, decodeURIComponent, isNaN, parseInt, parseFloat,
    URLSearchParams,
    document: documento,
    location: { search: pagina.search || '', pathname: '/' + pagina.archivo, hash: pagina.hash || '', href: '' },
    history: { replaceState() {}, pushState() {} },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    addEventListener() {},
    confirm: () => false,
    alert() {}
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);

  head.appendChild = function (elemento) {
    // Reproduce la carga de <script src="..."> del navegador.
    if (elemento.src) {
      const ruta = path.join(RAIZ, elemento.src);
      try {
        vm.runInContext(fs.readFileSync(ruta, 'utf8'), ctx, { filename: elemento.src });
        contador.scripts++;
      } catch (e) {
        errores.push('al cargar ' + elemento.src + ': ' + e.message);
      }
      if (elemento.onload) elemento.onload();
    }
    return elemento;
  };
  // El setter de `src` no existe en el nodo genérico: se asigna directo.

  const orden = [
    'assets/js/core/registry.js',
    'assets/js/core/store.js',
    'assets/js/core/sandbox.js',
    'assets/js/core/ui.js',
    'assets/js/pages/' + pagina.script
  ];

  for (const rel of orden) {
    try {
      vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), ctx, { filename: rel });
    } catch (e) {
      return { ok: false, errores: [rel + ': ' + e.message], nodos, contador };
    }
  }

  return { ctx, nodos, errores, contador, ok: true };
}

/* ---------- Las páginas y qué debe haber pintado cada una ---------- */

const PAGINAS = [
  { archivo: 'index.html',     script: 'inicio.js',   pinta: ['panel-areas', 'panel-empresas', 'pie'] },
  { archivo: 'catalogo.html',  script: 'catalogo.js', pinta: ['resultados', 'contador', 'pie'] },
  { archivo: 'catalogo.html',  script: 'catalogo.js', pinta: ['resultados'], search: '?empresa=holded', nombre: 'catalogo.html (filtrado por empresa)' },
  { archivo: 'empresas.html',  script: 'empresas.js', pinta: ['resultados', 'contador'] },
  { archivo: 'empresas.html',  script: 'empresas.js', pinta: ['app'], search: '?id=holded', nombre: 'empresas.html (ficha)' },
  { archivo: 'empresas.html',  script: 'empresas.js', pinta: ['app'], search: '?id=consultora-servicios', nombre: 'empresas.html (ficha sin prueba de código)' },
  { archivo: 'rutas.html',     script: 'rutas.js',    pinta: ['rutas', 'pie'] },
  { archivo: 'progreso.html',  script: 'progreso.js', pinta: ['contenido', 'pie'] },
  { archivo: 'prueba.html',    script: 'prueba.js',   pinta: ['app'], search: '?id=bcn-desembolsos-comisiones', nombre: 'prueba.html (runner)' },
  { archivo: 'prueba.html',    script: 'prueba.js',   pinta: ['app'], search: '?id=bcn-desembolsos-comisiones&sim=1', nombre: 'prueba.html (simulación)' },
  { archivo: 'prueba.html',    script: 'prueba.js',   pinta: ['app'], search: '?id=alg-ventana-deslizante', hash: '#solucion', nombre: 'prueba.html (solución abierta)' },
  { archivo: 'prueba.html',    script: 'prueba.js',   pinta: ['app'], search: '?id=no-existe', nombre: 'prueba.html (id inexistente)' }
];

(async () => {
  let fallos = 0;

  for (const pagina of PAGINAS) {
    const nombre = pagina.nombre || pagina.archivo;
    const r = ejecutarPagina(pagina);

    if (!r.ok) {
      console.log('✗ ' + nombre + ' — no llegó a ejecutarse');
      r.errores.forEach(e => console.log('     ' + e));
      fallos++;
      continue;
    }

    // El render ocurre dentro de la promesa de TT.boot(): hay que dejar
    // que se vacíe la cola de microtareas antes de mirar el resultado.
    await new Promise(res => setTimeout(res, 50));

    const pintado = id => {
      const n = r.nodos[id];
      return n ? (n.innerHTML || n.textContent || '') : '';
    };
    const vacios = pagina.pinta.filter(id => !pintado(id));

    if (r.errores.length || vacios.length) {
      console.log('✗ ' + nombre);
      r.errores.forEach(e => console.log('     error: ' + e));
      vacios.forEach(id => console.log('     no pintó nada en #' + id));
      fallos++;
    } else {
      const total = pagina.pinta.reduce((a, id) => a + pintado(id).length, 0);
      console.log('✓ ' + nombre + ' — ' + r.contador.scripts + ' scripts de contenido, ' +
                  total.toLocaleString('es-ES') + ' caracteres renderizados');
    }
  }

  console.log('\n' + PAGINAS.length + ' escenarios de página');
  console.log(fallos === 0 ? 'TODO CORRECTO' : fallos + ' FALLO(S)');
  process.exit(fallos ? 1 : 0);
})();

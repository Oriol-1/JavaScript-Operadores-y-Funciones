/* ============================================================
   TechTrack — Núcleo: ejecución aislada de código de usuario
   ------------------------------------------------------------
   QUÉ: ejecuta el código que escribe el usuario y sus tests.
   POR QUÉ aislado: el código de una prueba puede tener bucles
   infinitos, tocar el DOM de la plataforma o borrar el progreso
   guardado en localStorage. Nada de eso debe poder ocurrir.

   CÓMO: iframe con atributo sandbox="allow-scripts" (sin
   allow-same-origin). Eso le da un origen opaco: no puede leer
   nuestro DOM, ni nuestras cookies, ni nuestro localStorage.
   La comunicación es solo por postMessage, y un temporizador en
   el padre mata el iframe si no responde (bucle infinito).
   ============================================================ */
(function (global) {
  'use strict';

  var TT = global.TT || (global.TT = {});
  var DEFAULT_TIMEOUT = 4000;

  /**
   * @param {string} userCode  código del usuario
   * @param {Array}  cases     [{ name, code }] — code es una expresión/bloque
   *                           que usa expect(...) y puede devolver false
   * @param {object} opts      { timeout, setup }
   * @returns {Promise<{results, timedOut, error}>}
   */
  TT.runTests = function (userCode, cases, opts) {
    opts = opts || {};
    var timeout = opts.timeout || DEFAULT_TIMEOUT;
    var token = 'tt_' + Math.random().toString(36).slice(2);

    return new Promise(function (resolve) {
      var iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px';

      var settled = false;
      var timer = setTimeout(function () {
        finish({
          timedOut: true,
          results: cases.map(function (c) {
            return { name: c.name, pass: false, detail: 'Tiempo agotado (' + timeout + ' ms). Posible bucle infinito u operación demasiado costosa.' };
          })
        });
      }, timeout);

      function finish(payload) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        window.removeEventListener('message', onMessage);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        payload.results = payload.results || [];
        payload.passed = payload.results.filter(function (r) { return r.pass; }).length;
        payload.total = payload.results.length;
        resolve(payload);
      }

      function onMessage(e) {
        if (!e.data || e.data.token !== token) return;
        finish({ results: e.data.results, error: e.data.error, timedOut: false });
      }

      window.addEventListener('message', onMessage);
      iframe.srcdoc = buildDoc(token, opts.setup || '', userCode, cases);
      document.body.appendChild(iframe);
    });
  };

  function buildDoc(token, setup, userCode, cases) {
    var payload = JSON.stringify({ token: token, cases: cases });
    return '<!doctype html><meta charset="utf-8"><body><script>(function(){\n' +
      'var CFG = ' + payload + ';\n' +
      'var results = [];\n' +
      'var fatal = null;\n' +
      // --- mini librería de aserciones ---
      'function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }\n' +
      'function fmt(v){ try { return typeof v==="string"? JSON.stringify(v) : JSON.stringify(v); } catch(e){ return String(v); } }\n' +
      'function expect(actual){ return {\n' +
      '  toBe: function(exp){ if(actual!==exp) throw new Error("Se esperaba "+fmt(exp)+" y se recibió "+fmt(actual)); return true; },\n' +
      '  toEqual: function(exp){ if(!eq(actual,exp)) throw new Error("Se esperaba "+fmt(exp)+" y se recibió "+fmt(actual)); return true; },\n' +
      '  toBeTruthy: function(){ if(!actual) throw new Error("Se esperaba un valor verdadero, se recibió "+fmt(actual)); return true; },\n' +
      '  toBeFalsy: function(){ if(actual) throw new Error("Se esperaba un valor falso, se recibió "+fmt(actual)); return true; },\n' +
      '  toBeCloseTo: function(exp,d){ d=d===undefined?2:d; if(Math.abs(actual-exp)>Math.pow(10,-d)/2) throw new Error("Se esperaba ~"+exp+" y se recibió "+actual); return true; },\n' +
      '  toContain: function(x){ if(!actual || actual.indexOf(x)===-1) throw new Error(fmt(actual)+" no contiene "+fmt(x)); return true; },\n' +
      '  toHaveLength: function(n){ if(!actual || actual.length!==n) throw new Error("Se esperaba longitud "+n+" y se recibió "+(actual? actual.length : "nada")); return true; },\n' +
      '  toThrow: function(){ var t=false; try{ actual(); }catch(e){ t=true; } if(!t) throw new Error("Se esperaba que lanzara un error y no lo hizo"); return true; }\n' +
      '};}\n' +
      // --- Código del usuario y casos comparten un mismo ámbito ---
      // El harness se concatena DESPUÉS del código del usuario dentro de
      // la misma función, y cada caso se evalúa con eval directo: así ve
      // las funciones y variables que el usuario acaba de declarar, sin
      // obligarle a exportar nada.
      // El código de preparación del ejercicio se concatena DENTRO de la
      // misma función: si se declarase fuera, `new Function` no lo vería
      // (su ámbito léxico es el global) y los tests fallarían por sorpresa.
      'var CUERPO = ' + JSON.stringify(setup + '\n;;\n') + ' + ' + JSON.stringify(userCode) +
      ' + "\\n;;\\n" + ' + JSON.stringify(harnessSource()) + ';\n' +
      'var __run__ = null;\n' +
      'try {\n' +
      '  __run__ = new Function("expect", "__CASES__", "__OUT__", CUERPO);\n' +
      '} catch(e) { fatal = "Error de sintaxis en tu código: " + e.message; }\n' +
      'function send(){ parent.postMessage({ token: CFG.token, results: results, error: fatal }, "*"); }\n' +
      'function abort(msg){ fatal = msg; results.length = 0;\n' +
      '  CFG.cases.forEach(function(c){ results.push({ name:c.name, pass:false, detail: fatal }); }); send(); }\n' +
      'if(fatal){ abort(fatal); }\n' +
      'else {\n' +
      '  try {\n' +
      '    Promise.resolve(__run__(expect, CFG.cases, results))\n' +
      '      .then(send, function(e){ abort("Tu código lanzó un error al ejecutarse: " + e.message); });\n' +
      '  } catch(e) { abort("Tu código lanzó un error al ejecutarse: " + e.message); }\n' +
      '}\n' +
      '})();<\/script>';
  }

  /**
   * Bucle de aserciones que se inyecta detrás del código del usuario.
   * Devuelve una promesa: así un caso puede ser asíncrono (await) sin
   * que el ejercicio tenga que declararlo de forma especial.
   * eval() es directo, por lo que ve el ámbito del usuario.
   */
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
})(window);

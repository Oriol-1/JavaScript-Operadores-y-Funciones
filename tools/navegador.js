/* ============================================================
   Controlador mínimo de Chrome por el protocolo DevTools
   ------------------------------------------------------------
   Sin dependencias, fiel a la restricción del proyecto: Node 22
   ya trae `fetch` y `WebSocket` globales, que es todo lo que
   hace falta para hablar con un Chrome en modo headless.

   Existe para cubrir lo único que ninguna otra comprobación
   alcanza: que los laboratorios carguen sus librerías desde CDN
   y que los manejadores de eventos de la plataforma —clics en
   filtros, pestañas, ejecutar tests— hagan lo que dicen.

   No se ejecuta en la integración continua: necesita un Chrome
   instalado y salida a internet. Es una comprobación manual, y
   `tools/e2e.js` es quien la usa.
   ============================================================ */
'use strict';

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const PUERTO = 9333;

/** Busca un Chrome o Edge instalado en las rutas habituales. */
function buscarNavegador() {
  const candidatos = process.platform === 'win32'
    ? [
        path.join(process.env['ProgramFiles'] || '', 'Google/Chrome/Application/chrome.exe'),
        path.join(process.env['ProgramFiles(x86)'] || '', 'Google/Chrome/Application/chrome.exe'),
        path.join(process.env['LOCALAPPDATA'] || '', 'Google/Chrome/Application/chrome.exe'),
        path.join(process.env['ProgramFiles(x86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
        path.join(process.env['ProgramFiles'] || '', 'Microsoft/Edge/Application/msedge.exe')
      ]
    : [
        '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      ];

  for (const c of candidatos) {
    try { if (c && fs.existsSync(c)) return c; } catch (e) { /* siguiente */ }
  }
  return null;
}

function esperar(ms) { return new Promise(r => setTimeout(r, ms)); }

async function esperarPuerto(intentos = 60) {
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await fetch('http://127.0.0.1:' + PUERTO + '/json/version');
      if (r.ok) return await r.json();
    } catch (e) { /* todavía no escucha */ }
    await esperar(250);
  }
  throw new Error('Chrome no abrió el puerto de depuración');
}

async function lanzar() {
  const binario = buscarNavegador();
  if (!binario) {
    throw new Error('No se encontró Chrome ni Edge. Estas pruebas necesitan un navegador instalado.');
  }

  const perfil = path.join(os.tmpdir(), 'perfil-techtrack-' + Date.now());
  const proc = spawn(binario, [
    '--headless=new',
    '--remote-debugging-port=' + PUERTO,
    '--user-data-dir=' + perfil,
    '--no-first-run', '--no-default-browser-check',
    '--disable-gpu', '--hide-scrollbars', '--mute-audio',
    // La plataforma se abre con file:// a propósito; esto reproduce
    // el escenario real de uso, que es abrir el HTML con doble clic.
    '--allow-file-access-from-files',
    '--window-size=1400,1000',
    'about:blank'
  ], { stdio: 'ignore' });

  await esperarPuerto();
  return { proc, binario };
}

/** Abre una pestaña y devuelve las operaciones que se pueden hacer sobre ella. */
async function abrirPestana() {
  const r = await fetch('http://127.0.0.1:' + PUERTO + '/json/new?about:blank', { method: 'PUT' });
  const destino = await r.json();
  const ws = new WebSocket(destino.webSocketDebuggerUrl);

  let id = 0;
  const pendientes = new Map();
  const consola = [];
  const errores = [];
  const fallosDeRed = [];

  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);

    if (m.id && pendientes.has(m.id)) {
      const { res, rej } = pendientes.get(m.id);
      pendientes.delete(m.id);
      if (m.error) rej(new Error(JSON.stringify(m.error)));
      else res(m.result);
      return;
    }
    if (m.method === 'Runtime.consoleAPICalled') {
      consola.push({
        tipo: m.params.type,
        texto: (m.params.args || [])
          .map(a => a.value !== undefined ? String(a.value) : (a.description || a.type)).join(' ')
      });
    }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      errores.push((d.exception && (d.exception.description || d.exception.value)) || d.text);
    }
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      const e = m.params.entry;
      if (e.source === 'network') fallosDeRed.push(e.url + ' :: ' + e.text);
      else errores.push('[' + e.source + '] ' + e.text);
    }
  };

  function enviar(method, params) {
    return new Promise((res, rej) => {
      const mid = ++id;
      pendientes.set(mid, { res, rej });
      ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
      setTimeout(() => {
        if (pendientes.has(mid)) { pendientes.delete(mid); rej(new Error('timeout en ' + method)); }
      }, 60000);
    });
  }

  await enviar('Runtime.enable');
  await enviar('Page.enable');
  await enviar('Log.enable');

  async function evaluar(expr) {
    const r = await enviar('Runtime.evaluate', {
      expression: expr, returnByValue: true, awaitPromise: true
    });
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error((d.exception && d.exception.description) || d.text);
    }
    return r.result.value;
  }

  async function ir(url) {
    consola.length = 0; errores.length = 0; fallosDeRed.length = 0;
    await enviar('Page.navigate', { url });
    for (let i = 0; i < 200; i++) {
      try { if (await evaluar('document.readyState') === 'complete') break; }
      catch (e) { /* aún navegando */ }
      await esperar(100);
    }
  }

  /**
   * Reintenta una expresión hasta que sea cierta. Imprescindible aquí:
   * la plataforma carga su contenido inyectando scripts, y los
   * laboratorios traen Monaco y Babel de un CDN. Nada está listo al
   * terminar de cargar el documento.
   */
  async function esperarQue(expr, ms = 30000, cada = 200) {
    const limite = Date.now() + ms;
    let ultimo;
    while (Date.now() < limite) {
      try { ultimo = await evaluar(expr); if (ultimo) return ultimo; }
      catch (e) { ultimo = 'error: ' + e.message; }
      await esperar(cada);
    }
    throw new Error('no se cumplió en ' + ms + ' ms: ' + expr +
                    '  (último valor: ' + JSON.stringify(ultimo) + ')');
  }

  return {
    ir, evaluar, esperarQue, enviar,
    consola, errores, fallosDeRed,
    cerrar() { try { ws.close(); } catch (e) { /* ya cerrada */ } }
  };
}

module.exports = { lanzar, abrirPestana, esperar, buscarNavegador };

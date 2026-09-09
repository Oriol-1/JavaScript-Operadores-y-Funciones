/* ============================================================
   Barra de navegación para los laboratorios heredados.
   Se inyecta al principio del body sin tocar su marcado, para
   que desde cualquier laboratorio se pueda volver a la
   plataforma y saltar a la prueba que evalúa ese contenido.
   ============================================================ */
(function () {
  'use strict';

  // Qué prueba evalúa cada laboratorio. Añadir uno nuevo es una línea.
  const PRUEBA_RELACIONADA = {
    'fundamentos.html': null,
    'algoritmos.html': null,
    'dom_lab.html': 'fe-estados-accesibles',
    'scope_lab.html': 'js-orden-ejecucion',
    'async_lab.html': 'fe-buscador-debounce',
    'ts_lab.html': null,
    'buscador.html': null
  };

  const TEMA_KEY = 'techtrack.theme';
  try {
    const guardado = localStorage.getItem(TEMA_KEY);
    if (guardado) document.documentElement.setAttribute('data-theme', guardado);
  } catch (e) { /* sin persistencia disponible */ }

  function montar() {
    const archivo = location.pathname.split('/').pop() || 'index.html';
    const prueba = PRUEBA_RELACIONADA[archivo];

    const bar = document.createElement('div');
    bar.className = 'lab-bar';
    bar.innerHTML =
      '<a class="lab-brand" href="index.html"><span class="lab-logo">T</span>TechTrack</a>' +
      '<a href="laboratorios.html">Laboratorios</a>' +
      '<a href="catalogo.html">Pruebas</a>' +
      '<a href="rutas.html">Rutas</a>' +
      '<span class="lab-sep"></span>' +
      (prueba
        ? '<a href="prueba.html?id=' + prueba + '" style="color:var(--brand-soft)">Prueba relacionada →</a>'
        : '<span class="lab-tag">Laboratorio</span>') +
      '<button type="button" id="lab-tema" title="Cambiar tema" aria-label="Cambiar tema" ' +
        'style="background:none;border:0;color:var(--text-soft);cursor:pointer;font-size:15px;padding:4px 8px">◐</button>';

    document.body.insertBefore(bar, document.body.firstChild);

    document.getElementById('lab-tema').addEventListener('click', function () {
      const ahora = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', ahora);
      try { localStorage.setItem(TEMA_KEY, ahora); } catch (e) { /* ignorado */ }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();

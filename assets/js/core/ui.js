/* ============================================================
   TechTrack — Núcleo: utilidades de interfaz
   Navegación compartida, tema, formateo y helpers de render.
   ============================================================ */
(function (global) {
  'use strict';

  var TT = global.TT || (global.TT = {});
  var UI = {};

  /* ---------- Tema ---------- */

  var THEME_KEY = 'techtrack.theme';

  UI.initTheme = function () {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { saved = null; }
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  };

  UI.toggleTheme = function () {
    var now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', now);
    try { localStorage.setItem(THEME_KEY, now); } catch (e) { /* sin persistencia, no pasa nada */ }
    return now;
  };

  /* ---------- Formateo ---------- */

  UI.esc = function (s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /** Marcado ligero: `código`, **negrita**, saltos de línea. */
  UI.md = function (s) {
    return UI.esc(s)
      .replace(/`([^`]+)`/g, '<code class="mono" style="background:var(--bg-3);padding:1px 5px;border-radius:4px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--text)">$1</strong>')
      .replace(/\n/g, '<br>');
  };

  UI.minutes = function (m) {
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  };

  UI.duration = function (secs) {
    if (!secs) return '0 min';
    if (secs < 60) return secs + ' s';
    return UI.minutes(Math.round(secs / 60));
  };

  UI.levelBadge = function (level) {
    var l = TT.LEVELS[level];
    if (!l) return '';
    return '<span class="badge ' + l.cls + '">' + l.label + '</span>';
  };

  UI.catBadge = function (catId) {
    var c = TT.CATEGORIES[catId];
    if (!c) return '<span class="badge badge-neutral">' + UI.esc(catId) + '</span>';
    return '<span class="badge ' + (c.badge || 'badge-neutral') + '">' + c.icon + ' ' + UI.esc(c.label) + '</span>';
  };

  /* ---------- Navegación compartida ---------- */

  var NAV = [
    { href: 'index.html', label: 'Inicio' },
    { href: 'catalogo.html', label: 'Pruebas' },
    { href: 'rutas.html', label: 'Rutas' },
    { href: 'progreso.html', label: 'Progreso' },
    { href: 'laboratorios.html', label: 'Laboratorios' }
  ];

  /**
   * Inserta la barra de navegación al principio del body.
   * @param {string} current  href de la página actual
   * @param {string} base     prefijo de ruta (para páginas anidadas)
   */
  UI.mountNav = function (current, base) {
    base = base || '';
    var links = NAV.map(function (n) {
      var isCurrent = n.href === current;
      return '<a href="' + base + n.href + '"' + (isCurrent ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');

    var nav = document.createElement('nav');
    nav.className = 'nav';
    nav.innerHTML =
      '<a class="nav-brand" href="' + base + 'index.html">' +
        '<span class="nav-logo">T</span><span>TechTrack</span>' +
      '</a>' +
      '<div class="nav-links">' + links + '</div>' +
      '<div class="nav-actions">' +
        '<span class="badge badge-neutral tiny" id="tt-nav-level">Nivel: sin calibrar</span>' +
        '<button class="btn btn-icon btn-ghost" id="tt-theme" title="Cambiar tema" aria-label="Cambiar tema">◐</button>' +
      '</div>';
    document.body.insertBefore(nav, document.body.firstChild);
    document.getElementById('tt-theme').addEventListener('click', UI.toggleTheme);
    return nav;
  };

  UI.refreshNavLevel = function () {
    var el = document.getElementById('tt-nav-level');
    if (!el || !TT.store) return;
    var s = TT.store.summary();
    if (!s.estimatedLevel) { el.textContent = 'Nivel: sin calibrar'; return; }
    var l = TT.LEVELS[s.estimatedLevel];
    el.className = 'badge tiny ' + l.cls;
    el.textContent = 'Nivel estimado: ' + l.label;
  };

  UI.footer = function () {
    return '<footer class="footer"><div class="wrap row row-wrap">' +
      '<span>TechTrack — plataforma de preparación técnica. Contenido original; las referencias del sector se usan como inspiración metodológica, no como copia.</span>' +
      '<span class="spacer"></span>' +
      '<a href="docs/ARQUITECTURA.md">Arquitectura</a>' +
      '<a href="docs/INVESTIGACION.md">Investigación</a>' +
      '</div></footer>';
  };

  /* ---------- Cronómetro de sesión ---------- */

  UI.timer = function (exerciseId, onTick) {
    var start = Date.now();
    var handle = setInterval(function () {
      if (onTick) onTick(Math.round((Date.now() - start) / 1000));
    }, 1000);
    function stop() {
      clearInterval(handle);
      TT.store.addSeconds(exerciseId, (Date.now() - start) / 1000);
    }
    window.addEventListener('beforeunload', stop);
    return { stop: stop };
  };

  /* ---------- Componentes reutilizables ---------- */

  UI.exerciseCard = function (ex, base) {
    base = base || '';
    var a = TT.store.attempt(ex.id);
    var state = '';
    if (a && a.status === 'passed') state = '<span class="badge badge-ok badge-dot">Superada</span>';
    else if (a) state = '<span class="badge badge-warn badge-dot">En curso</span>';

    return '<a class="card card-tight stack" href="' + base + 'prueba.html?id=' + encodeURIComponent(ex.id) + '">' +
      '<div class="row row-wrap" style="gap:6px">' + UI.catBadge(ex.category) + UI.levelBadge(ex.level) + state + '</div>' +
      '<div class="card-title">' + UI.esc(ex.title) + '</div>' +
      '<p class="small soft" style="margin:0">' + UI.esc(ex.goal) + '</p>' +
      '<div class="row row-wrap tiny muted" style="gap:6px;margin-top:auto">' +
        '<span>⏱ ' + UI.minutes(ex.time) + '</span><span>·</span>' +
        '<span class="mono">' + ex.tech.slice(0, 4).map(UI.esc).join(' · ') + '</span>' +
        (ex.docs ? '<span>·</span><span title="Incluye la documentación necesaria para resolverla">📖 docs</span>' : '') +
      '</div>' +
    '</a>';
  };

  UI.empty = function (msg) {
    return '<div class="card center soft" style="padding:var(--sp-7)">' + UI.esc(msg) + '</div>';
  };

  TT.ui = UI;
  UI.initTheme();

})(window);

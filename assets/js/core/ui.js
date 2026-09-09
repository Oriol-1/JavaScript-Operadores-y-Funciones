/* ============================================================
   TechTrack — Núcleo: utilidades de interfaz
   Navegación compartida, tema, formateo y helpers de render.
   ============================================================ */
(function (global) {
  'use strict';

  const TT = global.TT || (global.TT = {});
  const UI = {};

  /* ---------- Tema ---------- */

  const THEME_KEY = 'techtrack.theme';

  UI.initTheme = function () {
    let saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { saved = null; }
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  };

  UI.toggleTheme = function () {
    const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
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
    let h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  };

  UI.duration = function (secs) {
    if (!secs) return '0 min';
    if (secs < 60) return secs + ' s';
    return UI.minutes(Math.round(secs / 60));
  };

  UI.levelBadge = function (level) {
    const l = TT.LEVELS[level];
    if (!l) return '';
    return '<span class="badge ' + l.cls + '">' + l.label + '</span>';
  };

  UI.catBadge = function (catId) {
    const c = TT.CATEGORIES[catId];
    if (!c) return '<span class="badge badge-neutral">' + UI.esc(catId) + '</span>';
    return '<span class="badge ' + (c.badge || 'badge-neutral') + '">' + c.icon + ' ' + UI.esc(c.label) + '</span>';
  };

  /* ---------- Empresas y evidencia ----------
     La distinción entre "prueba documentada" y "prueba inspirada" es
     la pieza de honestidad del proyecto, así que se renderiza siempre
     que se muestre una prueba, no solo en la ficha de detalle. */

  UI.EVIDENCIA = {
    'documentada': {
      etiqueta: 'Prueba documentada',
      corto: 'Documentada',
      clase: 'badge-ok',
      icono: '✔',
      explica: 'Existe evidencia pública de que la empresa utiliza una prueba de este tipo. ' +
               'El enunciado concreto es original nuestro; lo documentado es el formato.'
    },
    'inspirada': {
      etiqueta: 'Inspirada en su proceso',
      corto: 'Inspirada',
      clase: 'badge-warn',
      icono: '≈',
      explica: 'No podemos afirmar que sea una prueba de esta empresa. Está construida a partir de ' +
               'su pila tecnológica, el puesto y lo que se conoce de su proceso técnico.'
    }
  };

  UI.evidenciaBadge = function (evidencia, corto) {
    const e = UI.EVIDENCIA[evidencia];
    if (!e) return '';
    return '<span class="badge ' + e.clase + '" title="' + UI.esc(e.explica) + '">' +
           e.icono + ' ' + (corto ? e.corto : e.etiqueta) + '</span>';
  };

  /** Nombres de las empresas de una prueba, en texto plano. */
  UI.companyNames = function (ids) {
    return (ids || []).map(function (id) {
      const c = TT.company(id);
      return c ? c.nombre : id;
    });
  };

  UI.companyLinks = function (ids, base) {
    base = base || '';
    return (ids || []).map(function (id) {
      const c = TT.company(id);
      if (!c) return '<span class="badge badge-neutral">' + UI.esc(id) + '</span>';
      return '<a class="badge badge-brand" href="' + base + 'empresas.html?id=' +
             encodeURIComponent(id) + '">' + UI.esc(c.nombre) + '</a>';
    }).join('');
  };

  UI.formatoLabel = function (id) {
    return (TT.FORMATOS && TT.FORMATOS[id]) ? TT.FORMATOS[id].label : id;
  };
  UI.rolLabel = function (id) {
    return (TT.ROLES && TT.ROLES[id]) ? TT.ROLES[id] : id;
  };
  UI.dificultadLabel = function (n) {
    const d = TT.DIFICULTAD && TT.DIFICULTAD[n];
    return d ? d.label : ('Nivel ' + n);
  };

  /** Barras llenas/vacías para la dificultad. Más legible que un número suelto. */
  UI.dificultadBarra = function (n) {
    let out = '';
    for (let i = 1; i <= 5; i++) {
      out += '<i class="dif-paso' + (i <= n ? ' on' : '') + '"></i>';
    }
    return '<span class="dif" title="' + UI.esc(UI.dificultadLabel(n)) + '">' + out + '</span>';
  };

  /** ¿El proceso incluye escribir código que alguien evalúa? */
  UI.pruebaCodigoBadge = function (valor, corto) {
    const p = TT.PRUEBA_CODIGO && TT.PRUEBA_CODIGO[valor];
    if (!p) return '';
    return '<span class="badge ' + p.clase + '" title="' + UI.esc(p.desc) + '">' +
           p.icono + ' ' + (corto ? p.corto : p.label) + '</span>';
  };

  UI.verificacionNota = function (c) {
    if (c.verificacion === 'documentado') {
      return '<div class="note note-ok"><strong>Proceso publicado por la empresa.</strong> ' +
        'Lo que se describe aquí procede de su propia documentación (página de empleo, handbook o blog ' +
        'de ingeniería). Las fuentes están al final de la ficha.</div>';
    }
    return '<div class="note note-warn"><strong>Proceso reconstruido, no publicado.</strong> ' +
      'Esta empresa no publica el detalle de su proceso técnico. Lo que sigue se ha reconstruido a ' +
      'partir de testimonios públicos de candidatos y de fuentes del sector, así que puede haber ' +
      'cambiado o variar entre equipos. Las fuentes están al final de la ficha.</div>';
  };

  /* ---------- Navegación compartida ---------- */

  const NAV = [
    { href: 'index.html', label: 'Inicio' },
    { href: 'catalogo.html', label: 'Pruebas' },
    { href: 'empresas.html', label: 'Empresas' },
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
    const links = NAV.map(function (n) {
      const isCurrent = n.href === current;
      return '<a href="' + base + n.href + '"' + (isCurrent ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');

    const nav = document.createElement('nav');
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
    const el = document.getElementById('tt-nav-level');
    if (!el || !TT.store) return;
    const s = TT.store.summary();
    if (!s.estimatedLevel) { el.textContent = 'Nivel: sin calibrar'; return; }
    const l = TT.LEVELS[s.estimatedLevel];
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
    const start = Date.now();
    const handle = setInterval(function () {
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
    const a = TT.store.attempt(ex.id);
    let state = '';
    if (a && a.status === 'passed') state = '<span class="badge badge-ok badge-dot">Superada</span>';
    else if (a) state = '<span class="badge badge-warn badge-dot">En curso</span>';

    const emp = ex.empresa;

    return '<a class="card card-tight stack" href="' + base + 'prueba.html?id=' + encodeURIComponent(ex.id) + '">' +
      '<div class="row row-wrap" style="gap:6px">' + UI.catBadge(ex.category) + UI.levelBadge(ex.level) + state + '</div>' +
      (emp
        ? '<div class="row row-wrap tiny" style="gap:6px">' +
            '<span class="empresa-linea">' + UI.esc(UI.companyNames(emp.empresas).join(' · ')) + '</span>' +
            UI.evidenciaBadge(emp.evidencia, true) +
          '</div>'
        : '') +
      '<div class="card-title">' + UI.esc(ex.title) + '</div>' +
      '<p class="small soft" style="margin:0">' + UI.esc(ex.goal) + '</p>' +
      '<div class="row row-wrap tiny muted" style="gap:6px;margin-top:auto">' +
        '<span>⏱ ' + UI.minutes(ex.time) + '</span><span>·</span>' +
        (emp ? '<span>' + UI.esc(UI.formatoLabel(emp.formato)) + '</span><span>·</span>' : '') +
        '<span class="mono">' + ex.tech.slice(0, 3).map(UI.esc).join(' · ') + '</span>' +
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

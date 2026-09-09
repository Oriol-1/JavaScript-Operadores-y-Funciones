/* Página de inicio: panel de estado, recomendación, rutas y áreas. */
(function () {
  'use strict';

  TT.boot('', { liviano: true }).then(function () {
    const UI = TT.ui;
    UI.mountNav('index.html');
    UI.refreshNavLevel();

    const s = TT.store.summary();

    /* ---------- Panel de estado ---------- */
    const panel = document.getElementById('panel-usuario');
    if (s.started === 0) {
      panel.innerHTML =
        '<div class="card row row-wrap" style="gap:var(--sp-5);align-items:center">' +
          '<div style="flex:1;min-width:280px">' +
            '<div class="card-title">Todavía no has resuelto ninguna prueba</div>' +
            '<p class="soft small" style="margin:0">' +
              'El nivel estimado se calcula con tus resultados, no con lo que declares. ' +
              'Empieza por una prueba corta para calibrar y la plataforma te propondrá la siguiente.' +
            '</p>' +
          '</div>' +
          '<a class="btn btn-primary" href="prueba.html?id=js-orden-ejecucion">Calibrar mi nivel (25 min)</a>' +
        '</div>';
    } else {
      panel.innerHTML =
        '<div class="grid grid-4">' +
          stat('Pruebas superadas', s.passed + ' / ' + s.total) +
          stat('Precisión media', s.accuracy + ' %') +
          stat('Tiempo invertido', UI.duration(s.seconds)) +
          stat('Nivel estimado', s.estimatedLevel ? TT.LEVELS[s.estimatedLevel].label : 'Sin calibrar') +
        '</div>';
    }

    function stat(label, value) {
      return '<div class="stat"><div class="stat-label">' + UI.esc(label) + '</div>' +
             '<div class="stat-value">' + UI.esc(value) + '</div></div>';
    }

    /* ---------- Recomendación ---------- */
    const recos = TT.store.recommend(3);
    const cont = document.getElementById('panel-recomendacion');
    if (recos.length) {
      cont.innerHTML =
        '<div class="row"><h2>' + (s.started ? 'Tu siguiente paso' : 'Por dónde empezar') + '</h2></div>' +
        (s.started ? '<p class="soft small">Elegido a partir de tus resultados: primero se refuerza lo flojo, después se avanza.</p>' : '') +
        '<div class="grid grid-3" style="margin-top:var(--sp-3)">' +
        recos.map(function (r) {
          return '<a class="card card-tight stack" href="prueba.html?id=' + encodeURIComponent(r.exercise.id) + '">' +
            '<div class="row row-wrap" style="gap:6px">' + UI.catBadge(r.exercise.category) + UI.levelBadge(r.exercise.level) + '</div>' +
            '<div class="card-title">' + UI.esc(r.exercise.title) + '</div>' +
            '<p class="small soft" style="margin:0">' + UI.esc(r.reason) + '</p>' +
            '<div class="tiny muted">⏱ ' + UI.minutes(r.exercise.time) + '</div>' +
          '</a>';
        }).join('') +
        '</div>';
    }

    /* ---------- Rutas ---------- */
    document.getElementById('panel-rutas').innerHTML = TT.paths().map(function (p) {
      const pr = TT.store.pathProgress(p);
      return '<a class="card stack" href="rutas.html#' + p.id + '">' +
        '<div class="row"><span style="font-size:1.3rem">' + p.icon + '</span>' +
          '<span class="card-title" style="margin:0">' + UI.esc(p.title) + '</span>' +
          '<span class="spacer"></span>' +
          '<span class="badge badge-neutral">' + p.steps.length + ' pasos</span></div>' +
        '<p class="small soft" style="margin:0">' + UI.esc(p.resumen.slice(0, 180)) + '…</p>' +
        '<div class="bar' + (pr.pct === 100 ? ' ok' : '') + '"><i style="width:' + pr.pct + '%"></i></div>' +
        '<div class="tiny muted">' + pr.done + ' de ' + pr.total + ' pruebas superadas</div>' +
      '</a>';
    }).join('');

    /* ---------- Áreas ---------- */
    document.getElementById('panel-areas').innerHTML = Object.keys(TT.CATEGORIES).map(function (id) {
      const c = TT.CATEGORIES[id];
      const n = TT.query({ category: id }).length;
      // Las áreas sin pruebas todavía se muestran igualmente: la plataforma
      // enseña su alcance completo, pero no finge tener contenido que no tiene.
      const etiqueta = n
        ? '<span class="tiny muted">' + n + '</span>'
        : '<span class="tiny muted" style="font-size:10px">pronto</span>';
      const apertura = n
        ? '<a class="card card-tight stack" style="gap:var(--sp-2)" href="catalogo.html?categoria=' + id + '">'
        : '<div class="card card-tight stack" style="gap:var(--sp-2);opacity:.5">';
      const cierre = n ? '</a>' : '</div>';

      return apertura +
        '<div class="row"><span style="font-size:1.15rem">' + c.icon + '</span>' +
          '<strong style="font-size:var(--fs-sm)">' + UI.esc(c.label) + '</strong>' +
          '<span class="spacer"></span>' + etiqueta + '</div>' +
        '<p class="tiny muted" style="margin:0;line-height:1.5">' + UI.esc(c.desc) + '</p>' +
      cierre;
    }).join('');

    /* ---------- Empresas ----------
       Se muestran primero las que publican su proceso: son las fichas en
       las que podemos afirmar más cosas, y por tanto las más útiles. */
    const counts = TT.companyCounts();
    document.getElementById('panel-empresas').innerHTML = TT.companies()
      .slice()
      .sort(function (a, b) {
        const da = a.verificacion === 'documentado' ? 0 : 1;
        const db = b.verificacion === 'documentado' ? 0 : 1;
        return da - db || (counts[b.id] || 0) - (counts[a.id] || 0) || a.nombre.localeCompare(b.nombre);
      })
      .slice(0, 8)
      .map(function (c) {
        const n = counts[c.id] || 0;
        return '<a class="card card-tight stack" style="gap:var(--sp-2)" href="empresas.html?id=' +
            encodeURIComponent(c.id) + '">' +
          '<div class="row" style="gap:var(--sp-3)">' +
            '<span class="empresa-logo" style="width:30px;height:30px;font-size:var(--fs-sm)">' +
              UI.esc(c.nombre.charAt(0)) + '</span>' +
            '<strong style="font-size:var(--fs-sm)">' + UI.esc(c.nombre) + '</strong>' +
          '</div>' +
          '<p class="tiny muted" style="margin:0;line-height:1.5">' + UI.esc(c.sector) + '</p>' +
          '<div class="row tiny muted" style="gap:6px">' +
            (c.verificacion === 'documentado'
              ? '<span style="color:var(--ok)">✔ publicado</span>'
              : '<span style="color:var(--warn)">≈ reconstruido</span>') +
            '<span class="spacer"></span>' +
            '<span>' + n + (n === 1 ? ' prueba' : ' pruebas') + '</span>' +
          '</div>' +
        '</a>';
      }).join('');

    document.getElementById('pie').innerHTML = UI.footer();
  });
})();

/* Rutas: recorrido visual con estado por paso. */
(function () {
  'use strict';

  TT.boot('', { liviano: true }).then(function () {
    const UI = TT.ui;
    UI.mountNav('rutas.html');
    UI.refreshNavLevel();

    document.getElementById('rutas').innerHTML = TT.paths().map(function (p) {
      const pr = TT.store.pathProgress(p);
      let primeroPendiente = true;

      const nodos = p.steps.map(function (paso, i) {
        const ex = paso.exercise ? TT.get(paso.exercise) : null;
        const intento = ex ? TT.store.attempt(ex.id) : null;
        const hecho = intento && intento.status === 'passed';

        let clase = hecho ? 'done' : '';
        if (!hecho && ex && primeroPendiente) { clase = 'current'; primeroPendiente = false; }

        const destino = ex ? 'prueba.html?id=' + encodeURIComponent(ex.id)
                         : (paso.lab || null);

        const etiqueta = ex
          ? '<span class="badge badge-brand">Prueba</span>'
          : paso.lab ? '<span class="badge badge-neutral">Laboratorio</span>'
                     : '<span class="badge badge-neutral" style="opacity:.6">Próximamente</span>';

        const interior =
          '<div class="path-num">' + (hecho ? '✓' : i + 1) + '</div>' +
          '<div>' +
            '<div class="path-node-title">' + UI.esc(paso.titulo) + '</div>' +
            '<div class="tiny muted">' + UI.esc(paso.detalle || '') + '</div>' +
          '</div>' +
          '<div class="row" style="gap:6px">' + etiqueta +
            (ex ? UI.levelBadge(ex.level) : '') +
          '</div>';

        return (i ? '<div class="path-connector"></div>' : '') +
          (destino ? '<a class="path-node ' + clase + '" href="' + destino + '">' + interior + '</a>'
                   : '<div class="path-node ' + clase + '" style="opacity:.55">' + interior + '</div>');
      }).join('');

      return '<section id="' + p.id + '" style="margin-bottom:var(--sp-8);scroll-margin-top:80px">' +
        '<div class="card" style="margin-bottom:var(--sp-4)">' +
          '<div class="row row-wrap">' +
            '<span style="font-size:1.6rem">' + p.icon + '</span>' +
            '<h2 style="margin:0">' + UI.esc(p.title) + '</h2>' +
            '<span class="spacer"></span>' +
            '<span class="badge ' + (pr.pct === 100 ? 'badge-ok' : 'badge-neutral') + '">' +
              pr.done + ' / ' + pr.total + ' pruebas</span>' +
          '</div>' +
          '<p class="soft small" style="margin:var(--sp-3) 0 0">' + UI.esc(p.resumen) + '</p>' +
          '<div class="bar' + (pr.pct === 100 ? ' ok' : '') + '" style="margin-top:var(--sp-4)"><i style="width:' + pr.pct + '%"></i></div>' +
        '</div>' +
        '<div class="path-flow">' + nodos + '</div>' +
      '</section>';
    }).join('');

    // Si se llega con ancla desde el inicio, se enfoca la ruta.
    if (location.hash) {
      const t = document.querySelector(location.hash);
      if (t) t.scrollIntoView();
    }

    document.getElementById('pie').innerHTML = UI.footer();
  });
})();

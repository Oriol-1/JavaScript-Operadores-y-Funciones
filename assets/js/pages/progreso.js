/* Seguimiento del aprendizaje: métricas derivadas y recomendación. */
(function () {
  'use strict';

  TT.boot('', { liviano: true }).then(function () {
    var UI = TT.ui;
    UI.mountNav('progreso.html');
    UI.refreshNavLevel();
    render();

    function render() {
      var s = TT.store.summary();
      var cont = document.getElementById('contenido');

      if (s.started === 0) {
        cont.innerHTML =
          '<div class="card gate center" style="padding:var(--sp-8)">' +
            '<div class="card-title">Todavía no hay datos que analizar</div>' +
            '<p class="soft" style="max-width:52ch;margin:0 auto var(--sp-4)">' +
              'En cuanto resuelvas la primera prueba aparecerán aquí tus puntos fuertes, los que conviene ' +
              'reforzar, el nivel estimado y la recomendación de qué hacer a continuación.' +
            '</p>' +
            '<a class="btn btn-primary" href="catalogo.html">Ir al catálogo</a>' +
          '</div>' + herramientas();
        conectarHerramientas();
        return;
      }

      cont.innerHTML =
        // --- Resumen ---
        '<div class="grid grid-4">' +
          stat('Superadas', s.passed + ' / ' + s.total) +
          stat('Empezadas', String(s.started)) +
          stat('Precisión media', s.accuracy + ' %') +
          stat('Tiempo invertido', UI.duration(s.seconds)) +
        '</div>' +

        // --- Nivel estimado ---
        '<div class="card" style="margin-top:var(--sp-5)">' +
          '<div class="row row-wrap" style="gap:var(--sp-5)">' +
            '<div class="ring" style="--p:' + s.completion + ';--size:96px"><span>' + s.completion + '%</span></div>' +
            '<div style="flex:1;min-width:260px">' +
              '<div class="card-title">Nivel estimado: ' +
                (s.estimatedLevel ? TT.LEVELS[s.estimatedLevel].label : 'sin calibrar todavía') + '</div>' +
              '<p class="small soft" style="margin:0">' + textoNivel(s) + '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // --- Recomendación ---
        recomendacion() +

        // --- Por área ---
        '<h2 style="margin-top:var(--sp-7)">Progreso por área</h2>' +
        '<div class="card table-scroll" style="padding:0;margin-top:var(--sp-3)"><table class="table">' +
          '<thead><tr><th>Área</th><th style="width:90px">Superadas</th><th>Avance</th><th style="width:110px">Precisión</th></tr></thead><tbody>' +
          Object.keys(s.byCategory).map(function (id) {
            var c = s.byCategory[id];
            var pct = c.total ? Math.round(c.passed / c.total * 100) : 0;
            var prec = c.max ? Math.round(c.score / c.max * 100) : null;
            return '<tr>' +
              '<td>' + UI.catBadge(id) + '</td>' +
              '<td class="mono">' + c.passed + ' / ' + c.total + '</td>' +
              '<td><div class="bar' + (pct === 100 ? ' ok' : '') + '"><i style="width:' + pct + '%"></i></div></td>' +
              '<td class="mono">' + (prec === null ? '—' : prec + ' %') + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody></table></div>' +

        // --- Fortalezas y debilidades ---
        '<div class="grid grid-2" style="margin-top:var(--sp-5)">' +
          panelSkills('Tecnologías y conceptos dominados', s.strongSkills, 'ok',
            'Has resuelto pruebas de estos temas por encima del 70 %.') +
          panelSkills('Conviene reforzar', s.weakSkills, 'err',
            'Aquí las pruebas se quedaron por debajo del 70 %. Es donde más rápido vas a mejorar.') +
        '</div>' +

        // --- Actividad reciente ---
        '<h2 style="margin-top:var(--sp-7)">Actividad reciente</h2>' +
        '<div class="card table-scroll" style="padding:0;margin-top:var(--sp-3)"><table class="table">' +
          '<thead><tr><th>Prueba</th><th style="width:120px">Estado</th><th style="width:110px">Resultado</th><th style="width:150px">Última vez</th></tr></thead><tbody>' +
          s.recent.map(function (r) {
            return '<tr>' +
              '<td><a href="prueba.html?id=' + encodeURIComponent(r.id) + '">' + UI.esc(r.title) + '</a></td>' +
              '<td><span class="badge ' + (r.status === 'passed' ? 'badge-ok' : 'badge-warn') + '">' +
                (r.status === 'passed' ? 'Superada' : 'En curso') + '</span></td>' +
              '<td class="mono">' + Math.round(r.ratio * 100) + ' %</td>' +
              '<td class="tiny muted">' + fecha(r.at) + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody></table></div>' +

        herramientas();

      conectarHerramientas();
    }

    /* ---------- Fragmentos ---------- */

    function stat(label, value) {
      return '<div class="stat"><div class="stat-label">' + UI.esc(label) + '</div>' +
             '<div class="stat-value">' + UI.esc(value) + '</div></div>';
    }

    function textoNivel(s) {
      if (!s.estimatedLevel) {
        return 'Hace falta superar al menos una prueba para empezar a calibrar. El nivel no se declara: se deduce ' +
               'de qué pruebas apruebas, con qué precisión y con cuánta ayuda.';
      }
      var l = TT.LEVELS[s.estimatedLevel];
      var siguiente = { 'junior': 'junior-adv', 'junior-adv': 'mid', 'mid': 'senior', 'senior': null }[s.estimatedLevel];
      return l.desc + (siguiente
        ? ' Para llegar a ' + TT.LEVELS[siguiente].label + ' necesitas superar pruebas de ese nivel manteniendo ' +
          'la precisión por encima del 70 %.'
        : ' Estás en el tramo más alto del catálogo: consolida con las pruebas de empresa.');
    }

    function recomendacion() {
      var recos = TT.store.recommend(3);
      if (!recos.length) return '';
      return '<h2 style="margin-top:var(--sp-7)">Qué hacer a continuación</h2>' +
        '<p class="soft small">La plataforma prioriza reforzar lo flojo antes de avanzar: repetir una prueba ' +
        'suspendida enseña más que empezar una nueva.</p>' +
        '<div class="grid grid-3" style="margin-top:var(--sp-3)">' +
        recos.map(function (r) {
          return '<a class="card card-tight stack" href="prueba.html?id=' + encodeURIComponent(r.exercise.id) + '">' +
            '<div class="row row-wrap" style="gap:6px">' + UI.catBadge(r.exercise.category) + UI.levelBadge(r.exercise.level) + '</div>' +
            '<div class="card-title">' + UI.esc(r.exercise.title) + '</div>' +
            '<p class="small soft" style="margin:0">' + UI.esc(r.reason) + '</p>' +
          '</a>';
        }).join('') + '</div>';
    }

    function panelSkills(titulo, mapa, color, ayuda) {
      var claves = Object.keys(mapa).sort(function (a, b) { return mapa[b] - mapa[a]; });
      return '<div class="card">' +
        '<div class="card-title" style="color:var(--' + color + ')">' + UI.esc(titulo) + '</div>' +
        '<p class="tiny muted">' + UI.esc(ayuda) + '</p>' +
        (claves.length
          ? '<div class="row row-wrap" style="gap:6px;margin-top:var(--sp-3)">' +
              claves.map(function (k) {
                return '<span class="badge badge-' + (color === 'ok' ? 'ok' : 'err') + '">' + UI.esc(k) + '</span>';
              }).join('') + '</div>'
          : '<p class="small muted" style="margin:var(--sp-3) 0 0">Sin datos suficientes todavía.</p>') +
      '</div>';
    }

    function fecha(iso) {
      if (!iso) return '—';
      var d = new Date(iso);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ' · ' +
             d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    function herramientas() {
      return '<div class="card" style="margin-top:var(--sp-7)">' +
        '<div class="card-title">Tus datos</div>' +
        '<p class="small soft">El progreso vive en el <code class="mono">localStorage</code> de este navegador. ' +
        'Se pierde si borras los datos del sitio o si usas otro equipo: expórtalo si te importa conservarlo.</p>' +
        '<div class="row row-wrap" style="margin-top:var(--sp-4)">' +
          '<button class="btn btn-sm" id="exportar">Exportar progreso</button>' +
          '<button class="btn btn-sm" id="importar">Importar</button>' +
          '<button class="btn btn-sm btn-ghost" id="borrar" style="color:var(--err)">Borrar todo</button>' +
        '</div>' +
        '<textarea class="textarea hidden" id="caja" style="margin-top:var(--sp-4)" spellcheck="false"></textarea>' +
      '</div>';
    }

    function conectarHerramientas() {
      var caja = document.getElementById('caja');

      document.getElementById('exportar').addEventListener('click', function () {
        caja.classList.remove('hidden');
        caja.value = TT.store.export();
        caja.select();
      });

      document.getElementById('importar').addEventListener('click', function () {
        if (caja.classList.contains('hidden')) {
          caja.classList.remove('hidden');
          caja.value = '';
          caja.placeholder = 'Pega aquí el progreso exportado y vuelve a pulsar Importar.';
          caja.focus();
          return;
        }
        try {
          TT.store.import(caja.value);
          render();
        } catch (e) {
          alert('No se pudo importar: ' + e.message);
        }
      });

      document.getElementById('borrar').addEventListener('click', function () {
        if (!confirm('Se borrará todo tu progreso en este navegador. Esta acción no se puede deshacer.')) return;
        TT.store.resetAll();
        render();
        UI.refreshNavLevel();
      });
    }

    document.getElementById('pie').innerHTML = UI.footer();
  });
})();

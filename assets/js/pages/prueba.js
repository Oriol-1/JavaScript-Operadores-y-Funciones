/* ============================================================
   Runner de una prueba.
   Renderiza los 26 bloques del contrato de ejercicio, ejecuta
   los tests en sandbox y registra el intento.
   ============================================================ */
(function () {
  'use strict';

  TT.boot().then(function () {
    var UI = TT.ui;
    UI.mountNav('');
    UI.refreshNavLevel();

    var id = new URLSearchParams(location.search).get('id');
    var ex = TT.get(id);
    var app = document.getElementById('app');

    if (!ex) {
      app.innerHTML = '<h1>Prueba no encontrada</h1>' +
        UI.empty('El identificador "' + UI.esc(id || '') + '" no existe en el catálogo.') +
        '<p style="margin-top:var(--sp-4)"><a class="btn" href="catalogo.html">Volver al catálogo</a></p>';
      return;
    }

    document.title = ex.title + ' — TechTrack';
    var intento = TT.store.attempt(ex.id) || {};
    var cronometro = null;

    /* ================= Render ================= */

    app.innerHTML =
      cabecera() +
      '<div class="exercise-layout" style="margin-top:var(--sp-5)">' +
        '<div>' +
          '<div class="tabs" id="tabs">' +
            tab('enunciado', 'Enunciado', true) +
            tab('documentacion', 'Documentación') +
            tab('resolver', 'Resolver') +
            tab('solucion', 'Solución') +
            tab('analisis', 'Análisis') +
          '</div>' +
          '<div style="margin-top:var(--sp-5)">' +
            '<div class="panel activo" id="p-enunciado">' + panelEnunciado() + '</div>' +
            '<div class="panel" id="p-documentacion">' + panelDocumentacion() + '</div>' +
            '<div class="panel" id="p-resolver">' + panelResolver() + '</div>' +
            '<div class="panel" id="p-solucion">' + panelSolucionBloqueada() + '</div>' +
            '<div class="panel" id="p-analisis">' + panelAnalisis() + '</div>' +
          '</div>' +
        '</div>' +
        '<aside class="sticky-side stack">' + lateral() + '</aside>' +
      '</div>' +
      UI.footer();

    conectar();

    /* ---------- Bloques 1-9: cabecera ---------- */
    function cabecera() {
      return '<a class="tiny muted" href="catalogo.html">← Catálogo</a>' +
        '<div class="row row-wrap" style="gap:6px;margin:var(--sp-3) 0">' +
          UI.catBadge(ex.category) + UI.levelBadge(ex.level) +
          (ex.kind ? '<span class="badge badge-neutral">' + UI.esc(TT.KINDS[ex.kind] || ex.kind) + '</span>' : '') +
          '<span class="badge badge-neutral">⏱ ' + UI.minutes(ex.time) + '</span>' +
          (ex.tests ? '<span class="badge badge-ok">' +
            (ex.tests.mode === 'js' ? ex.tests.cases.length + ' tests automáticos' : 'Evaluación con rúbrica') +
            '</span>' : '') +
          (ex.docs ? '<span class="badge badge-info">Documentación incluida</span>' : '') +
        '</div>' +
        '<h1>' + UI.esc(ex.title) + '</h1>';
    }

    function tab(clave, etiqueta, activo) {
      return '<button class="tab" role="tab" data-tab="' + clave + '" aria-selected="' + !!activo + '">' + etiqueta + '</button>';
    }

    function panelEnunciado() {
      return '<div class="stack">' +
        bloque('Contexto de empresa', UI.md(ex.context)) +
        bloque('Situación que hay que resolver', UI.md(ex.situation)) +
        '<div class="note"><strong>Objetivo.</strong> ' + UI.md(ex.goal) + '</div>' +
        listaBloque('Requisitos obligatorios', ex.requirements, 'dot-list') +
        (ex.optional.length ? listaBloque('Requisitos opcionales', ex.optional, 'dot-list') : '') +
        (ex.starter ? '<div><div class="code-head">Proyecto inicial · ' + UI.esc(ex.starter.lang) + '</div>' +
          '<pre class="code">' + UI.esc(ex.starter.code) + '</pre></div>' : '') +
        '<div class="note"><strong>¿No sabes por dónde empezar?</strong> ' +
          'La pestaña <strong>Documentación</strong> contiene todo lo que necesitas saber para resolver ' +
          'esta prueba: los conceptos, la sintaxis y un ejemplo resuelto parecido. Está pensada para que ' +
          'no tengas que buscar nada fuera. No es la solución.</div>' +
        '<div class="note note-warn"><strong>Antes de mirar la solución.</strong> ' +
          'Intenta resolverlo aunque no llegues al final. El valor está en el intento: la explicación ' +
          'se entiende de otra manera cuando ya te has peleado con el problema.</div>' +
      '</div>';
    }

    /* ---------- Documentación: hace la prueba autosuficiente ---------- */
    function panelDocumentacion() {
      var d = ex.docs;
      if (!d) return UI.empty('Esta prueba todavía no tiene documentación propia.');

      return '<div class="stack">' +

        '<div class="note"><strong>Para qué sirve esta pestaña.</strong> ' +
          'Aquí está el conocimiento que la prueba da por sabido. Léelo entero antes de resolver y ' +
          'no necesitarás buscar nada fuera. Es material de estudio, no la solución del ejercicio.</div>' +

        '<div><h3 style="margin-bottom:var(--sp-2)">Qué necesitas entender</h3>' +
          '<p class="soft" style="margin:0">' + UI.md(d.resumen) + '</p></div>' +

        '<div><h3 style="margin-bottom:var(--sp-3)">Conceptos</h3>' +
          d.conceptos.map(function (c, i) {
            return '<details class="acc"' + (i === 0 ? ' open' : '') + '>' +
              '<summary>' + UI.esc(c.titulo) + '</summary>' +
              '<div class="acc-body">' +
                '<p class="soft small">' + UI.md(c.texto) + '</p>' +
                (c.codigo ? '<pre class="code">' + UI.esc(c.codigo) + '</pre>' : '') +
              '</div></details>';
          }).join('') +
        '</div>' +

        '<div><h3 style="margin-bottom:var(--sp-2)">Referencia rápida</h3>' +
          '<p class="small muted">Lo que vas a necesitar tener a mano mientras resuelves.</p>' +
          '<div class="card table-scroll" style="padding:0"><table class="table">' +
            '<thead><tr><th style="width:34%">Elemento</th><th>Para qué sirve</th></tr></thead><tbody>' +
            d.referencia.map(function (r) {
              return '<tr><td><code class="mono" style="color:var(--brand-soft)">' + UI.esc(r.nombre) + '</code></td>' +
                     '<td>' + UI.md(r.texto) + '</td></tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</div>' +

        '<div><h3 style="margin-bottom:var(--sp-2)">Ejemplo resuelto</h3>' +
          '<p class="small muted">Un problema <strong>distinto</strong> al de la prueba, resuelto con la misma técnica. ' +
            'Estúdialo y aplica el patrón, no lo copies.</p>' +
          '<div class="code-head">' + UI.esc(d.ejemplo.titulo) + '</div>' +
          '<pre class="code">' + UI.esc(d.ejemplo.codigo) + '</pre>' +
          '<p class="soft small" style="margin-top:var(--sp-3)">' + UI.md(d.ejemplo.texto) + '</p>' +
        '</div>' +

        '<div><h3 style="margin-bottom:var(--sp-2)">Glosario</h3>' +
          '<div class="card table-scroll" style="padding:0"><table class="table">' +
            '<thead><tr><th style="width:30%">Término</th><th>Qué significa</th></tr></thead><tbody>' +
            d.glosario.map(function (g) {
              return '<tr><td style="color:var(--text);font-weight:560">' + UI.esc(g.termino) + '</td>' +
                     '<td>' + UI.md(g.definicion) + '</td></tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</div>' +

        '<div class="card" style="border-color:var(--ok)">' +
          '<div class="card-title" style="color:var(--ok)">¿Estás listo para resolverla?</div>' +
          '<p class="small muted">Si puedes responder a todo esto sin volver atrás, ya puedes ir a Resolver. ' +
            'Si alguna te falla, vuelve al concepto correspondiente: te ahorrará más tiempo del que crees.</p>' +
          '<ul class="check-list dot-list" style="margin-top:var(--sp-3)">' +
            d.preparado.map(function (p) { return '<li>' + UI.md(p) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +

      '</div>';
    }

    /* ---------- Bloques 10-15: resolución ---------- */
    function panelResolver() {
      if (!ex.tests) {
        return '<div class="note">Esta prueba se resuelve en tu propio entorno. Usa la pestaña Análisis cuando termines.</div>';
      }

      var pistas = ex.hints.map(function (h, i) {
        return '<details class="acc" data-pista="' + i + '">' +
          '<summary>Pista ' + (i + 1) + ' de ' + ex.hints.length + '</summary>' +
          '<div class="acc-body small soft">' + UI.md(h) + '</div>' +
        '</details>';
      }).join('');

      var zona = ex.tests.mode === 'checklist'
        ? '<div class="card"><div class="card-title">' + UI.esc(ex.tests.titulo) + '</div>' +
            '<p class="small muted">Resuelve la prueba en tu entorno y después marca con honestidad lo que cumpliste. ' +
            'La puntuación solo sirve si es real.</p>' +
            '<div style="margin-top:var(--sp-4)" id="checklist">' +
              ex.tests.items.map(function (it, i) {
                return '<label class="check-item"><input type="checkbox" data-peso="' + it.peso + '" data-idx="' + i + '">' +
                       '<span>' + UI.md(it.texto) + '</span></label>';
              }).join('') +
            '</div>' +
            '<div class="row" style="margin-top:var(--sp-4)">' +
              '<button class="btn btn-primary" id="btn-checklist">Calcular puntuación</button>' +
              '<span class="small muted" id="check-live"></span>' +
            '</div>' +
          '</div>'
        : '<div>' +
            '<div class="code-head">Tu solución · JavaScript' +
              '<span class="spacer" style="flex:1"></span>' +
              '<button class="btn btn-sm btn-ghost" id="btn-reset">Restaurar código inicial</button>' +
            '</div>' +
            '<textarea class="editor" id="editor" spellcheck="false" aria-label="Editor de código"></textarea>' +
            '<div class="row row-wrap" style="margin-top:var(--sp-4)">' +
              '<button class="btn btn-primary" id="btn-run">▶ Ejecutar tests</button>' +
              '<span class="small muted" id="run-estado"></span>' +
            '</div>' +
            '<div id="resultados" style="margin-top:var(--sp-4)"></div>' +
          '</div>';

      return '<div class="stack">' +
        zona +
        (pistas ? '<div><h3 style="margin-bottom:var(--sp-3)">Pistas progresivas</h3>' +
          '<p class="small muted">Ábrelas solo si te atascas. Cada una revela un poco más y queda registrada.</p>' +
          pistas + '</div>' : '') +
      '</div>';
    }

    /* ---------- Bloques 16-17: solución ---------- */
    function panelSolucionBloqueada() {
      if (intento.solutionSeen) return contenidoSolucion();
      return '<div class="card gate">' +
        '<div class="card-title">La solución está disponible cuando quieras</div>' +
        '<p class="soft" style="max-width:52ch;margin:0 auto var(--sp-4)">' +
          'Verla antes de intentarlo no está penalizado en la nota máxima, pero se registra y la puntuación de ' +
          'esta prueba se limita al 60 %. El motivo es simple: el nivel estimado solo vale si refleja lo que ' +
          'resuelves por tu cuenta.' +
        '</p>' +
        '<button class="btn btn-primary" id="btn-desbloquear">Mostrar la solución completa</button>' +
      '</div>';
    }

    /**
     * Construcción por fases. Cada fase muestra el archivo ENTERO,
     * no un fragmento: así la posición de cada línea nunca hay que
     * deducirla. La última fase es, por contrato, la solución final.
     */
    function panelFases() {
      if (!ex.fases || !ex.fases.length) return '';

      return '<div><h3 style="margin-bottom:var(--sp-2)">Construcción por fases</h3>' +
        '<p class="small muted">Cada fase muestra <strong>el archivo completo</strong> tal como queda al ' +
          'terminarla, no fragmentos sueltos. Puedes copiar cualquier fase y ejecutarla: la última es ' +
          'exactamente la solución final.</p>' +

        ex.fases.map(function (f, i) {
          var ultima = i === ex.fases.length - 1;
          return '<details class="acc"' + (i === 0 ? ' open' : '') + ' style="margin-top:var(--sp-3)">' +
            '<summary>' +
              '<span class="fase-num">' + (i + 1) + '</span>' +
              '<span>' + UI.esc(f.titulo) + '</span>' +
              (ultima ? '<span class="spacer" style="flex:1"></span><span class="badge badge-ok">= solución final</span>' : '') +
            '</summary>' +
            '<div class="acc-body">' +

              '<div class="note" style="margin-bottom:var(--sp-4)">' +
                '<strong>Objetivo de esta fase.</strong> ' + UI.md(f.objetivo) + '</div>' +

              (f.anadido && f.anadido.length
                ? '<div style="margin-bottom:var(--sp-4)">' +
                    '<div class="field-label">Qué cambia respecto a la fase anterior</div>' +
                    '<ul class="check-list dot-list" style="margin:0">' +
                      f.anadido.map(function (a) { return '<li>' + UI.md(a) + '</li>'; }).join('') +
                    '</ul></div>'
                : '') +

              '<div class="code-head">Archivo completo tras la fase ' + (i + 1) +
                ' · ' + UI.esc(ex.solution.lang) + '</div>' +
              '<pre class="code">' + UI.esc(f.codigo) + '</pre>' +

              '<p class="soft small" style="margin-top:var(--sp-4)">' + UI.md(f.explicacion) + '</p>' +

              (f.comprueba
                ? '<div class="note note-ok" style="margin-top:var(--sp-3)">' +
                    '<strong>Cómo comprobar que esta fase funciona.</strong> ' + UI.md(f.comprueba) + '</div>'
                : '') +

            '</div></details>';
        }).join('') +
      '</div>';
    }

    function contenidoSolucion() {
      return '<div class="stack">' +
        panelFases() +
        '<div><h3 style="margin-bottom:var(--sp-2)">Solución completa</h3>' +
          '<div class="code-head">Solución de referencia · ' + UI.esc(ex.solution.lang) + '</div>' +
          '<pre class="code">' + UI.esc(ex.solution.code) + '</pre></div>' +
        '<div class="note"><strong>Por qué esta solución.</strong> ' + UI.md(ex.rationale) + '</div>' +
        (!ex.walkthrough ? '' :
        '<div><h3>Explicación paso a paso</h3>' +
          '<p class="small muted">Cada paso responde a lo mismo: qué hacemos, por qué y cómo funciona.</p>' +
          '<div class="card" style="padding-top:0">' +
            ex.walkthrough.map(function (p, i) {
              return '<div class="paso">' +
                '<div class="paso-num">' + (i + 1) + '</div>' +
                '<div>' +
                  '<div class="paso-q">' + UI.md(p.what) + '</div>' +
                  '<div class="paso-linea"><div class="paso-etiq">Por qué</div><div class="paso-txt">' + UI.md(p.why) + '</div></div>' +
                  '<div class="paso-linea"><div class="paso-etiq">Cómo</div><div class="paso-txt">' + UI.md(p.how) + '</div></div>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>') +
      '</div>';
    }

    /* ---------- Bloques 18-26: análisis ---------- */
    function panelAnalisis() {
      return '<div class="stack">' +

        '<div><h3>Alternativas válidas</h3>' +
          '<p class="small muted">Casi nunca hay una única solución correcta. Lo que se evalúa es que sepas cuál eliges y qué sacrificas.</p>' +
          '<div class="card table-scroll" style="padding:0"><table class="table">' +
            '<thead><tr><th>Alternativa</th><th>Cuándo usarla</th><th>Qué ganas y qué pierdes</th></tr></thead><tbody>' +
            ex.alternatives.map(function (a) {
              return '<tr><td style="color:var(--text);font-weight:560">' + UI.esc(a.name) + '</td>' +
                     '<td>' + UI.md(a.when) + '</td><td>' + UI.md(a.tradeoff) + '</td></tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</div>' +

        '<div><h3>Errores frecuentes</h3>' +
          '<p class="small muted">Salidos de revisiones reales. Si has cometido alguno, léelo dos veces: es lo que más rápido sube tu nivel.</p>' +
          ex.commonErrors.map(function (e) {
            return '<div class="err-item">' +
              '<div class="err-titulo">✕ ' + UI.md(e.error) + '</div>' +
              '<div class="small soft" style="margin-bottom:6px"><strong style="color:var(--text)">Por qué falla:</strong> ' + UI.md(e.why) + '</div>' +
              '<div class="small soft"><strong style="color:var(--ok)">Cómo se corrige:</strong> ' + UI.md(e.fix) + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +

        listaBloque('Buenas prácticas', ex.bestPractices, 'check-list') +
        (ex.security.length ? '<div class="card"><div class="card-title" style="color:var(--err)">⛨ Posibles problemas de seguridad</div>' +
          '<ul class="check-list dot-list" style="margin-top:var(--sp-3)">' + ex.security.map(function (s) { return '<li>' + UI.md(s) + '</li>'; }).join('') + '</ul></div>' : '') +
        (ex.performance.length ? '<div class="card"><div class="card-title" style="color:var(--warn)">⚡ Posibles problemas de rendimiento</div>' +
          '<ul class="check-list dot-list" style="margin-top:var(--sp-3)">' + ex.performance.map(function (s) { return '<li>' + UI.md(s) + '</li>'; }).join('') + '</ul></div>' : '') +

        '<div class="card" style="border-color:var(--brand-line)">' +
          '<div class="card-title">★ Qué valoraría una empresa</div>' +
          '<ul class="check-list" style="margin-top:var(--sp-3)">' +
            ex.companyLooksFor.map(function (s) { return '<li>' + UI.md(s) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +

        '<div><h3>Cómo se puntúa</h3>' +
          '<div class="card table-scroll" style="padding:0"><table class="table">' +
            '<thead><tr><th>Criterio</th><th style="width:120px">Peso</th></tr></thead><tbody>' +
            ex.scoring.rubric.map(function (r) {
              return '<tr><td>' + UI.esc(r.criteria) + '</td><td>' +
                '<div class="row" style="gap:8px"><div class="bar" style="flex:1;min-width:60px"><i style="width:' + r.weight + '%"></i></div>' +
                '<span class="tiny mono">' + r.weight + '</span></div></td></tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</div>' +

        '<div class="card" style="border-color:var(--border-strong)">' +
          '<div class="card-title">Qué reforzar después de esta prueba</div>' +
          '<ul class="check-list dot-list" style="margin-top:var(--sp-3)">' +
            ex.reinforce.map(function (s) { return '<li>' + UI.md(s) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +

      '</div>';
    }

    /* ---------- Lateral ---------- */
    function lateral() {
      return '<div class="card card-tight stack" id="tarjeta-estado">' + estadoHTML() + '</div>' +
        '<div class="card card-tight">' +
          '<div class="field-label">Tecnologías necesarias</div>' +
          '<div class="row row-wrap" style="gap:5px">' +
            ex.tech.map(function (t) { return '<span class="badge badge-neutral">' + UI.esc(t) + '</span>'; }).join('') +
          '</div>' +
          '<div class="field-label" style="margin-top:var(--sp-4)">Conocimientos evaluados</div>' +
          '<ul class="check-list dot-list" style="margin:0">' +
            ex.skills.map(function (s) { return '<li>' + UI.esc(s) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +
        '<div class="card card-tight">' +
          '<div class="field-label">Nivel</div>' +
          '<div class="small soft">' + UI.esc(TT.LEVELS[ex.level].desc) + '</div>' +
          '<button class="btn btn-sm btn-ghost" id="btn-reiniciar" style="margin-top:var(--sp-4);width:100%">Reiniciar mi progreso en esta prueba</button>' +
        '</div>';
    }

    function estadoHTML() {
      var a = TT.store.attempt(ex.id);
      var pct = a && a.maxScore ? Math.round(a.score / a.maxScore * 100) : 0;
      var etiqueta = !a ? 'Sin empezar' : a.status === 'passed' ? 'Superada' : 'En curso';
      var clase = !a ? 'badge-neutral' : a.status === 'passed' ? 'badge-ok' : 'badge-warn';

      return '<div class="row"><span class="badge ' + clase + ' badge-dot">' + etiqueta + '</span>' +
          '<span class="spacer"></span><span class="tiny mono muted" id="reloj">00:00</span></div>' +
        '<div class="row" style="gap:var(--sp-4);margin-top:var(--sp-2)">' +
          '<div class="ring" style="--p:' + pct + '"><span>' + pct + '%</span></div>' +
          '<div class="small soft">' +
            (a ? 'Puntuación: <strong style="color:var(--text)">' + (a.score || 0) + ' / ' + (a.maxScore || ex.scoring.max) + '</strong><br>' +
                 'Tiempo: ' + UI.duration(a.seconds || 0) + '<br>' +
                 'Pistas usadas: ' + (a.hintsUsed || 0) + ' de ' + ex.hints.length +
                 (a.solutionSeen ? '<br><span style="color:var(--warn)">Solución consultada</span>' : '')
               : 'Aún no has ejecutado esta prueba.') +
          '</div>' +
        '</div>';
    }

    /* ---------- Utilidades de render ---------- */
    function bloque(titulo, html) {
      return '<div><h3 style="margin-bottom:var(--sp-2)">' + UI.esc(titulo) + '</h3>' +
             '<p class="soft" style="margin:0">' + html + '</p></div>';
    }

    function listaBloque(titulo, items, clase) {
      return '<div><h3 style="margin-bottom:var(--sp-2)">' + UI.esc(titulo) + '</h3>' +
             '<ul class="check-list ' + clase + '">' +
             items.map(function (i) { return '<li>' + UI.md(i) + '</li>'; }).join('') + '</ul></div>';
    }

    /* ================= Comportamiento ================= */

    function conectar() {
      /* --- Pestañas --- */
      document.getElementById('tabs').addEventListener('click', function (e) {
        var b = e.target.closest('.tab');
        if (!b) return;
        document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', t === b); });
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('activo'); });
        document.getElementById('p-' + b.dataset.tab).classList.add('activo');
      });

      /* --- Cronómetro: mide el tiempo real dedicado --- */
      var reloj = document.getElementById('reloj');
      cronometro = UI.timer(ex.id, function (s) {
        if (!reloj) return;
        var m = Math.floor(s / 60), r = s % 60;
        reloj.textContent = (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
      });

      /* --- Editor --- */
      var editor = document.getElementById('editor');
      if (editor) {
        editor.value = intento.code || (ex.starter ? ex.starter.code : '');
        // Tab inserta indentación en vez de saltar de campo.
        editor.addEventListener('keydown', function (e) {
          if (e.key !== 'Tab') return;
          e.preventDefault();
          var i = editor.selectionStart;
          editor.value = editor.value.slice(0, i) + '  ' + editor.value.slice(editor.selectionEnd);
          editor.selectionStart = editor.selectionEnd = i + 2;
        });
        var guardar;
        editor.addEventListener('input', function () {
          clearTimeout(guardar);
          guardar = setTimeout(function () { TT.store.update(ex.id, { code: editor.value }); }, 600);
        });
        document.getElementById('btn-reset').addEventListener('click', function () {
          if (!confirm('¿Restaurar el código inicial? Se perderá lo que hayas escrito.')) return;
          editor.value = ex.starter ? ex.starter.code : '';
          TT.store.update(ex.id, { code: editor.value });
        });
        document.getElementById('btn-run').addEventListener('click', ejecutar);
      }

      /* --- Pistas: se registran al abrirlas --- */
      document.querySelectorAll('[data-pista]').forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (d.open) { TT.store.useHint(ex.id, Number(d.dataset.pista)); refrescarEstado(); }
        });
      });

      /* --- Checklist --- */
      var btnCheck = document.getElementById('btn-checklist');
      if (btnCheck) btnCheck.addEventListener('click', puntuarChecklist);

      /* --- Desbloqueo de la solución --- */
      var btnSol = document.getElementById('btn-desbloquear');
      if (btnSol) btnSol.addEventListener('click', function () {
        TT.store.update(ex.id, { solutionSeen: true });
        intento = TT.store.attempt(ex.id);
        document.getElementById('p-solucion').innerHTML = contenidoSolucion();
        refrescarEstado();
      });

      document.getElementById('btn-reiniciar').addEventListener('click', function () {
        if (!confirm('¿Borrar tu progreso en esta prueba? No afecta al resto.')) return;
        TT.store.reset(ex.id);
        location.reload();
      });
    }

    function refrescarEstado() {
      var t = document.getElementById('reloj') ? document.getElementById('reloj').textContent : '00:00';
      document.getElementById('tarjeta-estado').innerHTML = estadoHTML();
      var r = document.getElementById('reloj');
      if (r) r.textContent = t;
      UI.refreshNavLevel();
    }

    /* ---------- Ejecución de tests ---------- */
    function ejecutar() {
      var editor = document.getElementById('editor');
      var estado = document.getElementById('run-estado');
      var salida = document.getElementById('resultados');
      var boton = document.getElementById('btn-run');

      boton.disabled = true;
      estado.textContent = 'Ejecutando en sandbox aislado…';
      estado.className = 'small muted pulse';
      salida.innerHTML = '';

      TT.runTests(editor.value, ex.tests.cases, {
        timeout: ex.tests.timeout,
        setup: ex.tests.setup
      }).then(function (res) {
        boton.disabled = false;
        estado.className = 'small muted';
        estado.textContent = res.passed + ' de ' + res.total + ' tests superados' +
          (res.timedOut ? ' · tiempo agotado' : '');

        salida.innerHTML = res.results.map(function (r) {
          return '<div class="test-row ' + (r.pass ? 'test-pass' : 'test-fail') + '">' +
            '<span class="test-icon">' + (r.pass ? '✓' : '✕') + '</span>' +
            '<div><div>' + UI.esc(r.name) + '</div>' +
            (r.detail ? '<div class="test-detail">' + UI.esc(r.detail) + '</div>' : '') +
            '</div></div>';
        }).join('') + resumen(res);

        registrar(res.passed, res.total);
      });
    }

    function resumen(res) {
      if (res.passed === res.total) {
        return '<div class="note note-ok" style="margin-top:var(--sp-4)"><strong>Todos los tests pasan.</strong> ' +
          'Antes de pasar a la solución, contrástala con la tuya: casi siempre hay una decisión que no te habías ' +
          'planteado, y ahí está la mitad del aprendizaje.</div>';
      }
      return '<div class="note note-warn" style="margin-top:var(--sp-4)"><strong>Aún faltan casos.</strong> ' +
        'Lee el detalle del primer test que falla antes de tocar nada: normalmente un solo cambio arregla varios.</div>';
    }

    /* ---------- Puntuación ---------- */
    function registrar(pasados, total) {
      var bruto = Math.round(pasados / total * ex.scoring.max);
      var penalizado = aplicarPenalizaciones(bruto);
      TT.store.update(ex.id, {
        score: penalizado,
        maxScore: ex.scoring.max,
        tests: { passed: pasados, total: total },
        status: pasados === total ? 'passed' : 'failed',
        attempts: (TT.store.attempt(ex.id) || {}).attempts + 1 || 1
      });
      refrescarEstado();
    }

    function puntuarChecklist() {
      var marcados = Array.prototype.filter.call(
        document.querySelectorAll('#checklist input'), function (i) { return i.checked; });
      var bruto = marcados.reduce(function (acc, i) { return acc + Number(i.dataset.peso); }, 0);
      bruto = Math.round(bruto / 100 * ex.scoring.max);
      var penalizado = aplicarPenalizaciones(bruto);

      TT.store.update(ex.id, {
        score: penalizado, maxScore: ex.scoring.max,
        status: penalizado >= ex.scoring.max * 0.7 ? 'passed' : 'failed'
      });

      var live = document.getElementById('check-live');
      live.textContent = penalizado + ' / ' + ex.scoring.max +
        (penalizado >= ex.scoring.max * 0.7 ? ' · superada' : ' · por debajo del 70 %, conviene repasar');
      refrescarEstado();
    }

    /**
     * La puntuación refleja cómo lo resolviste, no solo el resultado:
     * cada pista resta un poco y consultar la solución antes de aprobar
     * limita la nota. Es lo que hace que el nivel estimado signifique algo.
     */
    function aplicarPenalizaciones(bruto) {
      var a = TT.store.attempt(ex.id) || {};
      var n = bruto;
      if (a.hintsUsed) n = Math.round(n * (1 - Math.min(a.hintsUsed * 0.05, 0.2)));
      if (a.solutionSeen) n = Math.min(n, Math.round(ex.scoring.max * 0.6));
      return n;
    }
  });
})();

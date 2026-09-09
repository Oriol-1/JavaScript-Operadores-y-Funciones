/* ============================================================
   Empresas — listado y ficha
   ------------------------------------------------------------
   Una sola página con dos vistas, porque comparten datos y
   navegación: sin ?id= es el listado, con ?id= es la ficha.

   Regla de esta página: nunca presentar como oficial lo que no
   podemos demostrar. Cada ficha abre con una nota que dice si el
   proceso está publicado por la empresa o reconstruido a partir
   de testimonios, y cierra con las fuentes enlazadas.
   ============================================================ */
(function () {
  'use strict';

  TT.boot('', { liviano: true }).then(function () {
    const UI = TT.ui;
    UI.mountNav('empresas.html');
    UI.refreshNavLevel();

    const id = new URLSearchParams(location.search).get('id');
    const app = document.getElementById('app');

    if (id) {
      const c = TT.company(id);
      if (!c) {
        app.innerHTML = '<h1>Empresa no encontrada</h1>' +
          UI.empty('El identificador "' + UI.esc(id) + '" no está en el registro.') +
          '<p style="margin-top:var(--sp-4)"><a class="btn" href="empresas.html">Ver todas las empresas</a></p>' +
          UI.footer();
        return;
      }
      document.title = c.nombre + ' — TechTrack';
      app.innerHTML = ficha(c) + UI.footer();
    } else {
      app.innerHTML = listado() + UI.footer();
      conectarListado();
    }

    /* ================= Listado ================= */

    function listado() {
      return '<h1>Empresas</h1>' +
        '<p class="soft" style="max-width:74ch">' +
          'Cómo es el proceso técnico de cada empresa, qué evalúa en cada ronda y qué pruebas de la ' +
          'plataforma se le parecen. Nada de lo que aparece aquí está inventado: cada ficha lleva sus ' +
          'fuentes y dice claramente si la empresa publica su proceso o si lo hemos reconstruido a ' +
          'partir de testimonios públicos.' +
        '</p>' +
        '<div class="note" style="max-width:74ch">' +
          '<strong>Empieza por el filtro de prueba de código.</strong> En buena parte del mercado ' +
          'español —consultoras, servicios y departamentos de IT— <strong>no hay ninguna</strong>: se ' +
          'decide con la conversación técnica, el currículum y una entrevista con el cliente final. ' +
          'Saberlo antes cambia por completo en qué merece la pena invertir el tiempo de preparación.' +
        '</div>' +

        '<div class="card" style="margin-top:var(--sp-5)">' +
          '<div class="stack">' +
            '<div><label class="field-label" for="q">Buscar empresa</label>' +
              '<input class="input" id="q" type="search" autocomplete="off" ' +
              'placeholder="Stripe, Barcelona, Kotlin, banca…"></div>' +
            '<div><span class="field-label">Dónde tienen el equipo</span>' +
              '<div class="row row-wrap" id="f-ciudades" style="gap:6px"></div></div>' +
            '<div><span class="field-label">Perfil que contrata</span>' +
              '<div class="row row-wrap" id="f-perfiles" style="gap:6px"></div></div>' +
            '<div><span class="field-label">Formato de prueba</span>' +
              '<div class="row row-wrap" id="f-formatos" style="gap:6px"></div></div>' +
            '<div><span class="field-label">¿Hay prueba de código?</span>' +
              '<div class="row row-wrap" id="f-prueba" style="gap:6px"></div>' +
              '<p class="tiny muted" style="margin:var(--sp-2) 0 0">Si en algún momento escribes código que alguien evalúa. Hablar de código no cuenta.</p></div>' +
            '<div><span class="field-label">Evidencia del proceso</span>' +
              '<div class="row row-wrap" id="f-verif" style="gap:6px"></div></div>' +
          '</div>' +
        '</div>' +

        '<div class="row" style="margin:var(--sp-5) 0 var(--sp-3)">' +
          '<span class="small muted" id="contador"></span>' +
          '<span class="spacer"></span>' +
          '<button class="btn btn-sm btn-ghost" id="limpiar">Limpiar filtros</button>' +
        '</div>' +

        '<div class="grid grid-2" id="resultados"></div>';
    }

    function tarjeta(c, counts) {
      const n = counts[c.id] || 0;
      return '<a class="card empresa-card" href="empresas.html?id=' + encodeURIComponent(c.id) + '">' +
        '<div class="row" style="gap:var(--sp-3);align-items:flex-start">' +
          '<span class="empresa-logo">' + UI.esc(c.nombre.charAt(0)) + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="card-title" style="margin-bottom:2px">' + UI.esc(c.nombre) + '</div>' +
            '<div class="tiny muted">' + UI.esc(c.pais) + ' · ' + UI.esc(c.sector) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="row row-wrap" style="gap:6px">' +
          (c.verificacion === 'documentado'
            ? '<span class="badge badge-ok" title="La empresa publica su proceso">✔ Proceso publicado</span>'
            : '<span class="badge badge-warn" title="Reconstruido a partir de testimonios públicos">≈ Reconstruido</span>') +
          UI.pruebaCodigoBadge(c.pruebaCodigo, true) +
        '</div>' +

        '<div class="row row-wrap tiny" style="gap:5px">' +
          c.formatos.slice(0, 4).map(function (f) {
            return '<span class="badge badge-neutral">' + UI.esc(UI.formatoLabel(f)) + '</span>';
          }).join('') +
        '</div>' +

        '<div class="row tiny muted" style="gap:var(--sp-3);margin-top:auto">' +
          '<span>Dificultad</span>' + UI.dificultadBarra(c.dificultad) +
          '<span class="spacer"></span>' +
          '<span>' + (n ? n + (n === 1 ? ' prueba' : ' pruebas')
                        : c.pruebaCodigo === 'no' ? 'No pone prueba de código'
                        : 'Sin pruebas todavía') + '</span>' +
        '</div>' +
      '</a>';
    }

    function conectarListado() {
      const counts = TT.companyCounts();
      let estado = { text: '', ciudad: '', perfil: '', formato: '', prueba: '', verificacion: '' };

      function grupo(contId, opciones, campo) {
        const cont = document.getElementById(contId);
        cont.innerHTML = opciones.map(function (o) {
          return '<button class="chip" data-valor="' + UI.esc(o.valor) + '" ' +
                 'aria-pressed="false">' + UI.esc(o.etiqueta) + '</button>';
        }).join('');
        cont.addEventListener('click', function (e) {
          const b = e.target.closest('.chip');
          if (!b) return;
          estado[campo] = estado[campo] === b.dataset.valor ? '' : b.dataset.valor;
          Array.prototype.forEach.call(cont.querySelectorAll('.chip'), function (c) {
            c.setAttribute('aria-pressed', estado[campo] === c.dataset.valor);
          });
          render();
        });
      }

      // Solo se ofrecen los valores que existen en el registro: un filtro
      // que siempre devuelve cero resultados es ruido, no una opción.
      let perfiles = {}, formatos = {}, ciudades = {};
      TT.companies().forEach(function (c) {
        c.perfiles.forEach(function (p) { perfiles[p] = true; });
        c.formatos.forEach(function (f) { formatos[f] = true; });
        if (c.ciudad) ciudades[c.ciudad] = (ciudades[c.ciudad] || 0) + 1;
      });

      // `ciudad` solo lo llevan las empresas con equipo en una plaza concreta;
      // para el resto (grandes tecnológicas repartidas, empresas remotas) no
      // hay una respuesta honesta, así que no se inventa una etiqueta.
      grupo('f-ciudades', Object.keys(ciudades)
        .sort(function (a, b) { return ciudades[b] - ciudades[a] || a.localeCompare(b); })
        .map(function (c) {
          return { valor: c, etiqueta: c + ' · ' + ciudades[c],
                   titulo: 'Empresas con equipo de ingeniería en ' + c };
        }), 'ciudad');

      grupo('f-perfiles', Object.keys(perfiles).map(function (p) {
        return { valor: p, etiqueta: UI.rolLabel(p) };
      }), 'perfil');

      grupo('f-formatos', Object.keys(formatos).map(function (f) {
        return { valor: f, etiqueta: UI.formatoLabel(f) };
      }), 'formato');

      grupo('f-prueba', Object.keys(TT.PRUEBA_CODIGO).map(function (v) {
        return { valor: v, etiqueta: TT.PRUEBA_CODIGO[v].label, titulo: TT.PRUEBA_CODIGO[v].desc };
      }), 'prueba');

      grupo('f-verif', [
        { valor: 'documentado', etiqueta: 'Proceso publicado' },
        { valor: 'parcial', etiqueta: 'Reconstruido' }
      ], 'verificacion');

      const $q = document.getElementById('q');
      let timer;
      $q.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { estado.text = $q.value; render(); }, 200);
      });

      document.getElementById('limpiar').addEventListener('click', function () {
        estado = { text: '', ciudad: '', perfil: '', formato: '', prueba: '', verificacion: '' };
        $q.value = '';
        document.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        render();
      });

      function render() {
        const texto = estado.text.toLowerCase().trim();
        const lista = TT.companies().filter(function (c) {
          if (estado.ciudad && c.ciudad !== estado.ciudad) return false;
          if (estado.perfil && c.perfiles.indexOf(estado.perfil) === -1) return false;
          if (estado.formato && c.formatos.indexOf(estado.formato) === -1) return false;
          if (estado.prueba && c.pruebaCodigo !== estado.prueba) return false;
          if (estado.verificacion && c.verificacion !== estado.verificacion) return false;
          if (texto) {
            const hay = [c.nombre, c.pais, c.sector, c.tamano, c.tech.join(' ')].join(' ').toLowerCase();
            if (hay.indexOf(texto) === -1) return false;
          }
          return true;
        });

        document.getElementById('resultados').innerHTML = lista.length
          ? lista.map(function (c) { return tarjeta(c, counts); }).join('')
          : UI.empty('Ninguna empresa coincide con estos filtros.');

        document.getElementById('contador').textContent =
          lista.length + (lista.length === 1 ? ' empresa' : ' empresas') +
          (lista.length !== TT.companies().length ? ' de ' + TT.companies().length : '');
      }

      render();
    }

    /* ================= Ficha ================= */

    function ficha(c) {
      const pruebas = TT.exercisesByCompany(c.id);
      const duracionTotal = c.proceso.reduce(function (a, f) { return a + (f.duracion || 0); }, 0);

      return '<a class="tiny muted" href="empresas.html">← Todas las empresas</a>' +

        '<div class="row" style="gap:var(--sp-4);align-items:center;margin:var(--sp-4) 0 var(--sp-2)">' +
          '<span class="empresa-logo" style="width:52px;height:52px;font-size:var(--fs-xl)">' +
            UI.esc(c.nombre.charAt(0)) + '</span>' +
          '<div><h1 style="margin:0">' + UI.esc(c.nombre) + '</h1>' +
            '<div class="small muted">' + UI.esc(c.pais) + ' · ' + UI.esc(c.sector) + '</div></div>' +
        '</div>' +

        '<div class="row row-wrap" style="gap:6px;margin-bottom:var(--sp-5)">' +
          '<span class="badge badge-neutral">' + UI.esc(c.tamano || '') + '</span>' +
          (c.verificacion === 'documentado'
            ? '<span class="badge badge-ok">✔ Proceso publicado por la empresa</span>'
            : '<span class="badge badge-warn">≈ Proceso reconstruido</span>') +
          UI.pruebaCodigoBadge(c.pruebaCodigo) +
          '<span class="badge badge-neutral">Revisado ' + UI.esc(c.revisado || '') + '</span>' +
        '</div>' +

        UI.verificacionNota(c) +

        '<div class="exercise-layout" style="margin-top:var(--sp-5)">' +
          '<div class="stack">' +

            /* --- El proceso, fase a fase --- */
            '<div><h3 style="margin-bottom:var(--sp-2)">Cómo es su proceso técnico</h3>' +
              '<p class="small muted">' + c.proceso.length + ' fases · unas ' +
                UI.minutes(duracionTotal) + ' de entrevista efectiva, sin contar el tiempo de las ' +
                'pruebas para casa.</p>' +
              '<div class="card" style="padding-top:0"><ul class="proceso">' +
                c.proceso.map(function (f, i) {
                  return '<li><span class="proceso-num">' + (i + 1) + '</span>' +
                    '<div><div class="proceso-fase">' + UI.esc(f.fase) + '</div>' +
                      '<div class="proceso-meta">' +
                        (f.formato ? UI.esc(UI.formatoLabel(f.formato)) : 'Conversación') +
                        (f.duracion ? ' · ' + UI.minutes(f.duracion) : '') +
                      '</div>' +
                      '<div class="small soft">' + UI.md(f.que) + '</div></div></li>';
                }).join('') +
              '</ul></div>' +
            '</div>' +

            /* --- Qué evalúan --- */
            '<div class="card" style="border-color:var(--brand-line)">' +
              '<div class="card-title">Qué intenta comprobar</div>' +
              '<ul class="check-list" style="margin-top:var(--sp-3)">' +
                c.evalua.map(function (s) { return '<li>' + UI.md(s) + '</li>'; }).join('') +
              '</ul>' +
            '</div>' +

            (c.consejo
              ? '<div class="note"><strong>Cómo prepararte para esta empresa.</strong> ' +
                  UI.md(c.consejo) + '</div>'
              : '') +

            /* --- Pruebas de la plataforma --- */
            '<div><h3 style="margin-bottom:var(--sp-2)">Practicar pruebas similares</h3>' +
              (pruebas.length
                ? '<p class="small muted">Cada tarjeta dice si la prueba está <strong>documentada</strong> ' +
                    '(hay evidencia pública de que usan una prueba así) o <strong>inspirada</strong> en su ' +
                    'proceso. En ningún caso el enunciado es una copia: son ejercicios originales.</p>' +
                  '<div class="grid grid-2" style="margin-top:var(--sp-4)">' +
                    pruebas.map(function (ex) { return UI.exerciseCard(ex); }).join('') +
                  '</div>'
                : c.pruebaCodigo === 'no'
                  ? '<div class="note note-warn"><strong>Aquí no hay nada que practicar, y es el dato.</strong> ' +
                      'Su proceso no incluye ninguna prueba de código, así que no tendría sentido asociarle ' +
                      'ejercicios: preparar katas para este proceso es tiempo perdido. Lo que sí se evalúa está ' +
                      'arriba, en <strong>qué intenta comprobar</strong>, y se prepara de otra manera — con ' +
                      'ejemplos concretos de tu experiencia, no con un editor.</div>'
                  : UI.empty('Todavía no hay pruebas asociadas a esta empresa en el catálogo.')) +
            '</div>' +

            /* --- Fuentes --- */
            '<div><h3 style="margin-bottom:var(--sp-2)">Fuentes</h3>' +
              '<p class="small muted">De dónde sale lo que se afirma en esta ficha. Si un enlace deja de ' +
                'funcionar o el proceso cambia, la ficha está desactualizada: la fecha de revisión está arriba.</p>' +
              '<div class="card">' +
                c.fuentes.map(function (f) {
                  return '<div class="fuente">' +
                    '<span class="fuente-tipo ' + UI.esc(f.tipo || '') + '">' + UI.esc(etiquetaFuente(f.tipo)) + '</span>' +
                    '<a href="' + UI.esc(f.url) + '" target="_blank" rel="noopener noreferrer">' +
                      UI.esc(f.titulo) + ' ↗</a>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>' +

          '</div>' +

          /* --- Lateral --- */
          '<aside class="sticky-side stack">' +
            '<div class="card card-tight">' +
              '<div class="field-label">Dificultad del proceso</div>' +
              '<div class="row" style="gap:var(--sp-3)">' + UI.dificultadBarra(c.dificultad) +
                '<span class="small" style="color:var(--text)">' + UI.esc(UI.dificultadLabel(c.dificultad)) + '</span></div>' +
              '<p class="tiny muted" style="margin:var(--sp-2) 0 0">' +
                UI.esc(TT.DIFICULTAD[c.dificultad].desc) + '</p>' +
            '</div>' +

            '<div class="card card-tight">' +
              '<div class="field-label">Tecnologías habituales</div>' +
              '<div class="row row-wrap" style="gap:5px">' +
                c.tech.map(function (t) { return '<span class="badge badge-neutral">' + UI.esc(t) + '</span>'; }).join('') +
              '</div>' +
              '<div class="field-label" style="margin-top:var(--sp-4)">Perfiles que suele contratar</div>' +
              '<div class="row row-wrap" style="gap:5px">' +
                c.perfiles.map(function (p) { return '<span class="badge badge-info">' + UI.esc(UI.rolLabel(p)) + '</span>'; }).join('') +
              '</div>' +
              '<div class="field-label" style="margin-top:var(--sp-4)">Formatos de prueba</div>' +
              '<div class="row row-wrap" style="gap:5px">' +
                c.formatos.map(function (f) { return '<span class="badge badge-brand">' + UI.esc(UI.formatoLabel(f)) + '</span>'; }).join('') +
              '</div>' +
            '</div>' +

            '<div class="card card-tight">' +
              '<div class="field-label">Filtrar el catálogo</div>' +
              '<a class="btn btn-sm" style="width:100%" href="catalogo.html?empresa=' +
                encodeURIComponent(c.id) + '">Ver sus pruebas en el catálogo</a>' +
            '</div>' +
          '</aside>' +
        '</div>';
    }

    function etiquetaFuente(tipo) {
      return { oficial: 'Oficial', ingenieria: 'Ingeniería', testimonios: 'Testimonios', comunidad: 'Comunidad' }[tipo] || 'Fuente';
    }
  });
})();

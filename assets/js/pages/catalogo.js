/* Catálogo: filtros combinables sincronizados con la URL.

   Hay dos familias de filtros:
     · los de contenido  — área, nivel y qué se te pide hacer;
     · los de proceso    — empresa, formato, puesto, dificultad,
                           duración y evidencia.
   Los segundos solo tienen sentido sobre pruebas con bloque
   `empresa`, así que aplicarlos descarta las de estudio puro. Eso
   es deliberado: quien filtra por "Stripe" no quiere ver un
   ejercicio de fundamentos. */
(function () {
  'use strict';

  TT.boot('', { liviano: true }).then(function () {
    const UI = TT.ui;
    UI.mountNav('catalogo.html');
    UI.refreshNavLevel();

    /* Cada filtro declara aquí su nombre en la URL una sola vez: leer,
       escribir y limpiar se derivan de esta tabla, de modo que añadir
       un eje nuevo no obliga a tocar tres funciones distintas. */
    const CAMPOS = [
      { campo: 'text',       param: 'q' },
      { campo: 'category',   param: 'categoria' },
      { campo: 'level',      param: 'nivel' },
      { campo: 'kind',       param: 'tipo' },
      { campo: 'company',    param: 'empresa',    deEmpresa: true },
      { campo: 'formato',    param: 'formato',    deEmpresa: true },
      { campo: 'role',       param: 'puesto',     deEmpresa: true },
      { campo: 'dificultad', param: 'dificultad', deEmpresa: true },
      { campo: 'duracion',   param: 'duracion',   deEmpresa: true },
      { campo: 'evidencia',  param: 'evidencia',  deEmpresa: true }
    ];

    const params = new URLSearchParams(location.search);
    const estado = {};
    CAMPOS.forEach(function (c) { estado[c.campo] = params.get(c.param) || ''; });

    const $q = document.getElementById('q');
    $q.value = estado.text;

    // Si se llega con un filtro de proceso en la URL (por ejemplo desde
    // una ficha de empresa), el bloque plegado se abre: si no, el usuario
    // vería resultados filtrados sin ver por qué.
    const detalles = document.getElementById('filtros-empresa');
    if (CAMPOS.some(function (c) { return c.deEmpresa && estado[c.campo]; })) detalles.open = true;

    /* --- Construcción de los grupos de filtros --- */
    function grupo(contenedorId, opciones, campo) {
      const cont = document.getElementById(contenedorId);
      if (!cont) return;
      cont.innerHTML = opciones.map(function (o) {
        return '<button class="chip" data-campo="' + campo + '" data-valor="' + UI.esc(o.valor) + '" ' +
               'aria-pressed="' + (estado[campo] === o.valor) + '"' +
               (o.titulo ? ' title="' + UI.esc(o.titulo) + '"' : '') + '>' + UI.esc(o.etiqueta) + '</button>';
      }).join('');
      cont.addEventListener('click', function (e) {
        const b = e.target.closest('.chip');
        if (!b) return;
        const valor = b.dataset.valor;
        estado[campo] = estado[campo] === valor ? '' : valor;   // segundo clic desactiva
        sincronizar();
      });
    }

    grupo('f-categorias', Object.keys(TT.CATEGORIES).map(function (id) {
      return { valor: id, etiqueta: TT.CATEGORIES[id].icon + ' ' + TT.CATEGORIES[id].label,
               titulo: TT.CATEGORIES[id].desc };
    }), 'category');

    grupo('f-niveles', Object.keys(TT.LEVELS).map(function (id) {
      return { valor: id, etiqueta: TT.LEVELS[id].label, titulo: TT.LEVELS[id].desc };
    }), 'level');

    // Solo se ofrecen los valores presentes en el catálogo cargado: un
    // filtro que siempre devuelve cero resultados es ruido, no una opción.
    const presentes = { kind: {}, company: {}, formato: {}, role: {}, dificultad: {} };
    TT.all().forEach(function (ex) {
      if (ex.kind) presentes.kind[ex.kind] = true;
      if (!ex.empresa) return;
      ex.empresa.empresas.forEach(function (id) { presentes.company[id] = true; });
      presentes.formato[ex.empresa.formato] = true;
      presentes.role[ex.empresa.rol] = true;
      presentes.dificultad[ex.empresa.dificultad] = true;
    });

    grupo('f-kinds', Object.keys(presentes.kind).map(function (id) {
      return { valor: id, etiqueta: TT.KINDS[id] || id };
    }), 'kind');

    grupo('f-empresas', Object.keys(presentes.company).map(function (id) {
      const c = TT.company(id);
      return { valor: id, etiqueta: c ? c.nombre : id, titulo: c ? c.sector : '' };
    }).sort(function (a, b) { return a.etiqueta.localeCompare(b.etiqueta); }), 'company');

    grupo('f-formatos', Object.keys(presentes.formato).map(function (id) {
      return { valor: id, etiqueta: UI.formatoLabel(id),
               titulo: TT.FORMATOS[id] ? TT.FORMATOS[id].desc : '' };
    }), 'formato');

    grupo('f-roles', Object.keys(presentes.role).map(function (id) {
      return { valor: id, etiqueta: UI.rolLabel(id) };
    }), 'role');

    grupo('f-dificultad', Object.keys(presentes.dificultad).sort().map(function (n) {
      return { valor: n, etiqueta: n + ' · ' + UI.dificultadLabel(Number(n)),
               titulo: TT.DIFICULTAD[n] ? TT.DIFICULTAD[n].desc : '' };
    }), 'dificultad');

    grupo('f-duracion', [
      { valor: 'corta', etiqueta: 'Corta · hasta 30 min', titulo: 'Preguntas rápidas y ejercicios de un solo método.' },
      { valor: 'media', etiqueta: 'Media · 30 a 90 min',  titulo: 'La duración típica de una ronda técnica en vivo.' },
      { valor: 'larga', etiqueta: 'Larga · más de 90 min', titulo: 'Pruebas para casa y ejercicios de varias horas.' }
    ], 'duracion');

    grupo('f-evidencia', [
      { valor: 'documentada', etiqueta: '✔ Documentada', titulo: UI.EVIDENCIA.documentada.explica },
      { valor: 'inspirada',   etiqueta: '≈ Inspirada',   titulo: UI.EVIDENCIA.inspirada.explica }
    ], 'evidencia');

    /* --- Render --- */
    function render() {
      const lista = TT.query(estado);
      document.getElementById('resultados').innerHTML = lista.length
        ? lista.map(function (ex) { return UI.exerciseCard(ex); }).join('')
        : UI.empty('Ninguna prueba coincide con estos filtros. Prueba a quitar alguno.');

      const deEmpresa = CAMPOS.some(function (c) { return c.deEmpresa && estado[c.campo]; });
      document.getElementById('contador').innerHTML =
        UI.esc(lista.length + (lista.length === 1 ? ' prueba' : ' pruebas') +
               (lista.length !== TT.all().length ? ' de ' + TT.all().length : '')) +
        (deEmpresa
          ? ' <span class="muted">· los filtros de proceso solo aplican a pruebas vinculadas a una empresa</span>'
          : '');

      document.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('aria-pressed', estado[c.dataset.campo] === c.dataset.valor);
      });
    }

    /* --- Los filtros viven en la URL: se comparten y sobreviven a la recarga --- */
    function sincronizar() {
      const p = new URLSearchParams();
      CAMPOS.forEach(function (c) { if (estado[c.campo]) p.set(c.param, estado[c.campo]); });
      const qs = p.toString();
      // Si history.replaceState lanza (algunos navegadores restringen la
      // API de historial sobre file://), la aplicación del filtro no debe
      // depender de que la sincronización de la URL tenga éxito.
      try {
        history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      } catch (e) { /* la URL no se pudo actualizar; el filtro sigue aplicándose */ }
      render();
    }

    let timer;
    $q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { estado.text = $q.value; sincronizar(); }, 200);
    });

    document.getElementById('limpiar').addEventListener('click', function () {
      CAMPOS.forEach(function (c) { estado[c.campo] = ''; });
      $q.value = '';
      sincronizar();
    });

    render();
    document.getElementById('pie').innerHTML = UI.footer();
  });
})();

/* Catálogo: filtros combinables sincronizados con la URL. */
(function () {
  'use strict';

  TT.boot().then(function () {
    var UI = TT.ui;
    UI.mountNav('catalogo.html');
    UI.refreshNavLevel();

    var params = new URLSearchParams(location.search);
    var estado = {
      text: params.get('q') || '',
      category: params.get('categoria') || '',
      level: params.get('nivel') || '',
      kind: params.get('tipo') || ''
    };

    var $q = document.getElementById('q');
    $q.value = estado.text;

    /* --- Construcción de los grupos de filtros --- */
    function grupo(contenedorId, opciones, campo) {
      var cont = document.getElementById(contenedorId);
      cont.innerHTML = opciones.map(function (o) {
        return '<button class="chip" data-campo="' + campo + '" data-valor="' + UI.esc(o.valor) + '" ' +
               'aria-pressed="' + (estado[campo] === o.valor) + '">' + o.etiqueta + '</button>';
      }).join('');
      cont.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var valor = b.dataset.valor;
        estado[campo] = estado[campo] === valor ? '' : valor;   // segundo clic desactiva
        sincronizar();
      });
    }

    grupo('f-categorias', Object.keys(TT.CATEGORIES).map(function (id) {
      return { valor: id, etiqueta: TT.CATEGORIES[id].icon + ' ' + TT.CATEGORIES[id].label };
    }), 'category');

    grupo('f-niveles', Object.keys(TT.LEVELS).map(function (id) {
      return { valor: id, etiqueta: TT.LEVELS[id].label };
    }), 'level');

    // Solo se ofrecen los tipos que existen en el catálogo cargado.
    var kindsPresentes = {};
    TT.all().forEach(function (ex) { if (ex.kind) kindsPresentes[ex.kind] = true; });
    grupo('f-kinds', Object.keys(kindsPresentes).map(function (id) {
      return { valor: id, etiqueta: TT.KINDS[id] || id };
    }), 'kind');

    /* --- Render --- */
    function render() {
      var lista = TT.query(estado);
      document.getElementById('resultados').innerHTML = lista.length
        ? lista.map(function (ex) { return UI.exerciseCard(ex); }).join('')
        : UI.empty('Ninguna prueba coincide con estos filtros. Prueba a quitar alguno.');

      document.getElementById('contador').textContent =
        lista.length + (lista.length === 1 ? ' prueba' : ' pruebas') +
        (lista.length !== TT.all().length ? ' de ' + TT.all().length : '');

      document.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('aria-pressed', estado[c.dataset.campo] === c.dataset.valor);
      });
    }

    /* --- Los filtros viven en la URL: se comparten y sobreviven a la recarga --- */
    function sincronizar() {
      var p = new URLSearchParams();
      if (estado.text) p.set('q', estado.text);
      if (estado.category) p.set('categoria', estado.category);
      if (estado.level) p.set('nivel', estado.level);
      if (estado.kind) p.set('tipo', estado.kind);
      var qs = p.toString();
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      render();
    }

    var timer;
    $q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { estado.text = $q.value; sincronizar(); }, 200);
    });

    document.getElementById('limpiar').addEventListener('click', function () {
      estado = { text: '', category: '', level: '', kind: '' };
      $q.value = '';
      sincronizar();
    });

    render();
    document.getElementById('pie').innerHTML = UI.footer();
  });
})();

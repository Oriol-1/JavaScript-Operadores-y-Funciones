/* ============================================================
   Pruebas — Frontend y JavaScript
   Contenido original. La metodología (contexto de empresa,
   requisitos, pistas progresivas y explicación del porqué) se
   inspira en cómo evalúan hoy las empresas, no copia ejercicios.
   ============================================================ */
(function (TT) {
  'use strict';

  /* ------------------------------------------------------------------
     1. Buscador con debounce y cancelación de peticiones
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'fe-buscador-debounce',
    categorias: ['javascript'],
    title: 'Buscador en vivo sin peticiones de más',
    category: 'frontend',
    kind: 'build',
    level: 'junior-adv',
    time: 40,
    tags: ['debounce', 'async', 'race condition'],

    context:
      'Trabajas en el equipo de un marketplace. El buscador de la cabecera lanza una petición ' +
      'por cada tecla pulsada. Con 40 000 usuarios simultáneos, el backend recibe picos de tráfico ' +
      'que no vienen de búsquedas reales, sino de gente escribiendo.',

    situation:
      'Además del exceso de peticiones hay un bug reportado por soporte: si el usuario escribe rápido, ' +
      'a veces la lista muestra los resultados de una búsqueda anterior. La respuesta lenta llega después ' +
      'de la rápida y pisa el resultado correcto.',

    goal:
      'Implementar una función createSearch que agrupe las pulsaciones, cancele las búsquedas obsoletas ' +
      'y garantice que solo se pinta el resultado de la última consulta escrita.',

    tech: ['JavaScript', 'DOM', 'Async'],
    skills: ['debounce', 'race conditions', 'cierres (closures)', 'gestión de estado asíncrono'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * @param {(q:string)=>Promise<string[]>} fetchResults  Busca en el servidor.\n' +
' * @param {(items:string[])=>void} render               Pinta resultados.\n' +
' * @param {number} wait                                 Espera en ms.\n' +
' * @returns {(query:string)=>void}                      Se llama en cada tecla.\n' +
' */\n' +
'function createSearch(fetchResults, render, wait) {\n' +
'  // Implementación ingenua: una petición por tecla y sin control de orden.\n' +
'  return function (query) {\n' +
'    fetchResults(query).then(render);\n' +
'  };\n' +
'}\n'
    },

    requirements: [
      'Agrupar las pulsaciones: si el usuario escribe varias letras seguidas, solo se lanza una petición cuando pasan `wait` ms sin escribir.',
      'Ignorar la respuesta de cualquier búsqueda que ya no sea la última lanzada (aunque llegue más tarde).',
      'Una búsqueda vacía debe renderizar una lista vacía sin llamar al servidor.',
      'No usar variables globales: el estado vive en el cierre de `createSearch`.'
    ],

    optional: [
      'Devolver también una función `cancel()` para limpiar el temporizador al desmontar el componente.',
      'Cachear en memoria los resultados por término para no repetir consultas idénticas.',
      'Exponer un estado de carga para que la interfaz pueda mostrar un indicador.'
    ],

    hints: [
      'El debounce se construye guardando el id de `setTimeout` en el cierre y llamando a `clearTimeout` en cada nueva pulsación.',
      'Para el orden de llegada no sirve cancelar el temporizador: la petición ya salió. Necesitas un contador (o token) que se incrementa en cada búsqueda y comprobar, al resolver la promesa, si ese token sigue siendo el vigente.',
      'Estructura: `let timer, lastToken = 0;` … dentro del timeout `const token = ++lastToken;` y al resolver `if (token !== lastToken) return;`.'
    ],

    docs: {
      resumen:
        'Necesitas dos técnicas que suelen confundirse. **Debounce** reduce cuántas veces se ejecuta algo ' +
        'mientras el usuario actúa. **Invalidación por token** decide qué respuesta se acepta cuando varias ' +
        'peticiones vuelven desordenadas. Son problemas distintos y hacen falta las dos.',

      conceptos: [
        {
          titulo: 'Un cierre (closure) es una función que recuerda dónde nació',
          texto:
            'Cuando declaras una función dentro de otra, la de dentro conserva acceso a las variables de la de ' +
            'fuera **aunque la exterior ya haya terminado**. Eso te da estado privado: nadie desde fuera puede ' +
            'tocarlo, y cada llamada a la función exterior crea su propio juego de variables.\n' +
            'Es la base del ejercicio: el temporizador y el token tienen que vivir en un sitio que sobreviva ' +
            'entre pulsaciones, pero que no sea global.',
          codigo:
'function crearContador() {\n' +
'  let n = 0;                 // vive en el cierre\n' +
'  return function () {\n' +
'    n = n + 1;               // la función interior sigue viéndola\n' +
'    return n;\n' +
'  };\n' +
'}\n' +
'\n' +
'const a = crearContador();\n' +
'const b = crearContador();   // estado propio, independiente de `a`\n' +
'a();  // 1\n' +
'a();  // 2\n' +
'b();  // 1  <- no comparte nada con `a`\n' +
'\n' +
'// ERROR TÍPICO: si `n` se declara DENTRO de la función devuelta,\n' +
'// se reinicia en cada llamada y el estado no existe.'
        },
        {
          titulo: 'setTimeout y clearTimeout: aplazar y cancelar',
          texto:
            '`setTimeout(fn, ms)` programa una ejecución futura y **devuelve un identificador**. Guardando ese ' +
            'identificador puedes cancelar la ejecución pendiente con `clearTimeout(id)`.\n' +
            'Ese par es todo el mecanismo del debounce: en cada evento cancelas lo pendiente y vuelves a ' +
            'programar. Si el usuario sigue escribiendo, la ejecución nunca llega a ocurrir; cuando para ' +
            '`ms` milisegundos, se dispara una sola vez.\n' +
            '`clearTimeout` con un identificador que ya se ejecutó o con `null` no da error, así que no ' +
            'necesitas comprobar nada antes de llamarlo.',
          codigo:
'let temporizador = null;\n' +
'\n' +
'function alEscribir() {\n' +
'  clearTimeout(temporizador);          // anula el disparo pendiente\n' +
'  temporizador = setTimeout(function () {\n' +
'    console.log("el usuario ha parado de escribir");\n' +
'  }, 300);                             // y programa uno nuevo\n' +
'}\n' +
'\n' +
'// Con 5 pulsaciones seguidas rápidas: 5 clearTimeout, 5 setTimeout,\n' +
'// pero el mensaje se imprime UNA sola vez, 300 ms después de la última.'
        },
        {
          titulo: 'Las promesas no se resuelven en el orden en que se lanzan',
          texto:
            'Si lanzas dos peticiones, la respuesta de la segunda puede llegar **antes** que la de la primera: ' +
            'depende de la red y del servidor, no de tu código. A eso se le llama **condición de carrera**.\n' +
            'En un buscador se traduce en el bug del enunciado: escribes "movil", la petición de "mov" tarda ' +
            'más y llega después, y su resultado pisa al bueno.\n' +
            'Importante: el debounce **no** resuelve esto. Reduce el número de peticiones, pero en cuanto haya ' +
            'dos en vuelo el problema vuelve a existir.',
          codigo:
'// Simulación del problema\n' +
'function pedir(nombre, tardanza) {\n' +
'  return new Promise(function (resolver) {\n' +
'    setTimeout(function () { resolver(nombre); }, tardanza);\n' +
'  });\n' +
'}\n' +
'\n' +
'pedir("primera", 300).then(function (r) { console.log(r); });\n' +
'pedir("segunda",  50).then(function (r) { console.log(r); });\n' +
'\n' +
'// Imprime:  segunda  →  primera\n' +
'// El orden de llegada NO es el orden de salida.'
        },
        {
          titulo: 'Token de invalidación: decidir qué respuesta sigue siendo válida',
          texto:
            'La solución es marcar cada operación con un número que solo crece, y guardar aparte cuál es la ' +
            '**última** lanzada. Cuando una promesa se resuelve, compara su número con el último: si no ' +
            'coinciden, esa respuesta ya no interesa y se descarta.\n' +
            'Funciona porque cada ejecución captura su propio número en su cierre, mientras que la variable ' +
            'compartida siempre refleja la operación más reciente.\n' +
            'No uses el texto de la búsqueda como identificador: si el usuario vuelve al mismo término, dos ' +
            'respuestas distintas pasarían el filtro. Un contador es inequívoco.',
          codigo:
'let ultimo = 0;                  // compartido, en el cierre\n' +
'\n' +
'function operacion(valor) {\n' +
'  const mio = ++ultimo;          // copia local de ESTA ejecución\n' +
'\n' +
'  tarda(valor).then(function (resultado) {\n' +
'    if (mio !== ultimo) return;  // llegó tarde: alguien lanzó otra después\n' +
'    pintar(resultado);\n' +
'  });\n' +
'}'
        },
        {
          titulo: 'Toda promesa que toca la interfaz necesita su rama de error',
          texto:
            'Si una promesa se rechaza y nadie la captura, el indicador de carga se queda colgado para siempre ' +
            'y el usuario no sabe qué ha pasado.\n' +
            'En el `catch` hay que comprobar el token igual que en el `then`: un error de una búsqueda antigua ' +
            'tampoco debe borrar los resultados de la actual.',
          codigo:
'buscar(texto)\n' +
'  .then(function (items) {\n' +
'    if (mio !== ultimo) return;\n' +
'    pintar(items);\n' +
'  })\n' +
'  .catch(function (err) {\n' +
'    if (mio !== ultimo) return;   // también aquí\n' +
'    pintar([]);\n' +
'    console.error(err);\n' +
'  });'
        },
        {
          titulo: 'Añadir propiedades a una función',
          texto:
            'En JavaScript las funciones son objetos, así que puedes colgarles propiedades. Es la forma ' +
            'habitual de devolver una función principal con utilidades asociadas, como `cancel()`, sin ' +
            'obligar a quien la usa a manejar un objeto con varias claves.',
          codigo:
'function crear() {\n' +
'  let t = null;\n' +
'  function principal() { /* ... */ }\n' +
'\n' +
'  principal.cancel = function () { clearTimeout(t); };\n' +
'  return principal;\n' +
'}\n' +
'\n' +
'const f = crear();\n' +
'f();          // se usa como función normal\n' +
'f.cancel();   // y además tiene utilidades'
        }
      ],

      referencia: [
        { nombre: 'setTimeout(fn, ms)', texto: 'Programa `fn` para dentro de `ms` milisegundos. Devuelve un identificador que sirve para cancelarla.' },
        { nombre: 'clearTimeout(id)', texto: 'Cancela una ejecución pendiente. Es seguro llamarla con `null` o con un identificador ya consumido.' },
        { nombre: 'promesa.then(fn)', texto: 'Registra qué hacer cuando la promesa se resuelve correctamente.' },
        { nombre: 'promesa.catch(fn)', texto: 'Registra qué hacer si la promesa se rechaza. Sin esto, un fallo de red deja la interfaz colgada.' },
        { nombre: 'cadena.trim()', texto: 'Devuelve la cadena sin espacios al principio ni al final. Útil para detectar una búsqueda que en realidad está vacía.' },
        { nombre: '++variable', texto: 'Incrementa **y devuelve el valor ya incrementado**. `const t = ++n` deja en `t` el número nuevo, que es lo que se necesita para el token.' },
        { nombre: 'const dentro de una función', texto: 'Crea una variable nueva en cada llamada. Es lo que permite que cada ejecución tenga su propio token.' }
      ],

      ejemplo: {
        titulo: 'Guardado automático de un borrador (mismo patrón, problema distinto)',
        codigo:
'/**\n' +
' * Guarda un borrador mientras el usuario escribe:\n' +
' *  - no guarda en cada tecla, solo cuando para (debounce)\n' +
' *  - si dos guardados se solapan, solo cuenta el último (token)\n' +
' */\n' +
'function crearAutoguardado(guardarEnServidor, mostrarEstado, espera) {\n' +
'  let temporizador = null;\n' +
'  let ultimo = 0;\n' +
'\n' +
'  function guardarAhora(texto) {\n' +
'    const mio = ++ultimo;\n' +
'\n' +
'    if (!texto.trim()) {            // nada que guardar\n' +
'      mostrarEstado("vacío");\n' +
'      return;\n' +
'    }\n' +
'\n' +
'    mostrarEstado("guardando…");\n' +
'\n' +
'    guardarEnServidor(texto)\n' +
'      .then(function () {\n' +
'        if (mio !== ultimo) return;      // ya hay un guardado más nuevo\n' +
'        mostrarEstado("guardado");\n' +
'      })\n' +
'      .catch(function () {\n' +
'        if (mio !== ultimo) return;\n' +
'        mostrarEstado("error al guardar");\n' +
'      });\n' +
'  }\n' +
'\n' +
'  function alEscribir(texto) {\n' +
'    clearTimeout(temporizador);\n' +
'    temporizador = setTimeout(function () { guardarAhora(texto); }, espera);\n' +
'  }\n' +
'\n' +
'  alEscribir.cancel = function () {\n' +
'    clearTimeout(temporizador);\n' +
'    ultimo++;                      // invalida cualquier guardado en vuelo\n' +
'  };\n' +
'\n' +
'  return alEscribir;\n' +
'}',
        texto:
          'Fíjate en la estructura, porque es exactamente la que necesitas: **dos variables en el cierre** ' +
          '(`temporizador` y `ultimo`), **una función que hace el trabajo** y **otra que lo aplaza**. ' +
          'El caso vacío se resuelve antes de llamar al servidor, pero **después** de incrementar el token, ' +
          'para que cualquier respuesta en vuelo quede invalidada. Y `cancel()` hace las dos cosas: para el ' +
          'temporizador e invalida lo pendiente.\n' +
          'Tu ejercicio cambia el "guardar" por "buscar y pintar resultados", pero el esqueleto es el mismo.'
      },

      glosario: [
        { termino: 'Debounce', definicion: 'Agrupar una ráfaga de eventos en una sola ejecución, que ocurre cuando la ráfaga termina. Se usa para búsquedas, autoguardado o validación mientras se escribe.' },
        { termino: 'Throttle', definicion: 'Distinto del debounce: limita la frecuencia máxima (por ejemplo, "como mucho una vez cada 200 ms") pero sí ejecuta durante la ráfaga. Se usa en scroll o redimensionado.' },
        { termino: 'Condición de carrera', definicion: 'Situación en la que el resultado depende del orden en que terminan operaciones simultáneas, y ese orden no está garantizado.' },
        { termino: 'Cierre (closure)', definicion: 'Función que conserva acceso a las variables del ámbito donde fue creada, incluso después de que ese ámbito haya terminado.' },
        { termino: 'Token de invalidación', definicion: 'Número creciente que identifica una operación, para poder descartar los resultados de las que ya han quedado obsoletas.' },
        { termino: 'AbortController', definicion: 'API del navegador que permite cancelar de verdad un `fetch`, no solo ignorar su respuesta. No se usa aquí porque el ejercicio recibe una función genérica, pero es la opción preferible cuando controlas la capa de red.' },
        { termino: 'Efecto manada', definicion: 'Cuando muchos clientes reaccionan a la vez de la misma forma y provocan un pico que agrava el problema original.' }
      ],

      preparado: [
        '¿Por qué el temporizador tiene que declararse fuera de la función que se llama en cada tecla?',
        '¿Qué devuelve `setTimeout` y para qué sirve guardarlo?',
        '¿Por qué el debounce no arregla el bug de los resultados desordenados?',
        '¿Qué diferencia hay entre `++n` y `n++` al asignar el resultado a una variable?',
        '¿Por qué hay que comprobar el token también dentro del `catch`?',
        '¿Por qué se incrementa el token antes de comprobar si la búsqueda está vacía?'
      ]
    },

    tests: {
      mode: 'js',
      timeout: 5000,
      setup: 'function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }',
      cases: [
        {
          name: 'Agrupa las pulsaciones en una sola petición',
          code:
'(async () => {\n' +
'  let calls = 0;\n' +
'  const search = createSearch(async q => { calls++; return [q]; }, () => {}, 30);\n' +
'  search("m"); search("mo"); search("mov"); search("movil");\n' +
'  await sleep(90);\n' +
'  expect(calls).toBe(1);\n' +
'})()'
        },
        {
          name: 'Renderiza el resultado del último término escrito',
          code:
'(async () => {\n' +
'  let painted = null;\n' +
'  const search = createSearch(async q => [q + "-ok"], items => { painted = items; }, 20);\n' +
'  search("a"); search("ab");\n' +
'  await sleep(80);\n' +
'  expect(painted).toEqual(["ab-ok"]);\n' +
'})()'
        },
        {
          name: 'Descarta una respuesta lenta de una búsqueda antigua',
          code:
'(async () => {\n' +
'  let painted = null;\n' +
'  const delays = { lento: 120, rapido: 10 };\n' +
'  const search = createSearch(async q => { await sleep(delays[q] || 0); return [q]; },\n' +
'                              items => { painted = items; }, 10);\n' +
'  search("lento");\n' +
'  await sleep(40);\n' +
'  search("rapido");\n' +
'  await sleep(250);\n' +
'  expect(painted).toEqual(["rapido"]);\n' +
'})()'
        },
        {
          name: 'La búsqueda vacía no llega al servidor',
          code:
'(async () => {\n' +
'  let calls = 0, painted = null;\n' +
'  const search = createSearch(async q => { calls++; return [q]; }, items => { painted = items; }, 10);\n' +
'  search("");\n' +
'  await sleep(60);\n' +
'  expect(calls).toBe(0);\n' +
'  expect(painted).toEqual([]);\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'function createSearch(fetchResults, render, wait) {\n' +
'  let timer = null;\n' +
'  let lastToken = 0;   // identifica la búsqueda vigente\n' +
'\n' +
'  function run(query) {\n' +
'    const token = ++lastToken;\n' +
'\n' +
'    if (!query.trim()) {      // nada que buscar: limpiamos sin ir al servidor\n' +
'      render([]);\n' +
'      return;\n' +
'    }\n' +
'\n' +
'    fetchResults(query)\n' +
'      .then(items => {\n' +
'        if (token !== lastToken) return;   // llegó tarde: ya no interesa\n' +
'        render(items);\n' +
'      })\n' +
'      .catch(err => {\n' +
'        if (token !== lastToken) return;\n' +
'        render([]);\n' +
'        console.error("Búsqueda fallida:", err);\n' +
'      });\n' +
'  }\n' +
'\n' +
'  function search(query) {\n' +
'    clearTimeout(timer);\n' +
'    timer = setTimeout(() => run(query), wait);\n' +
'  }\n' +
'\n' +
'  search.cancel = () => { clearTimeout(timer); lastToken++; };\n' +
'  return search;\n' +
'}\n'
    },

    walkthrough: [
      {
        what: 'Guardamos `timer` y `lastToken` en el cierre de `createSearch`.',
        why: 'Cada buscador necesita su propio estado y nadie de fuera debe poder tocarlo. Un cierre da encapsulación real sin clases ni variables globales.',
        how: 'Al retornar `search`, la función mantiene viva la referencia a esas variables aunque `createSearch` ya haya terminado.'
      },
      {
        what: 'En cada pulsación hacemos `clearTimeout` y reprogramamos.',
        why: 'Es la definición de debounce: la acción se ejecuta cuando el usuario para, no mientras escribe. Reduce las peticiones de una por tecla a una por palabra.',
        how: '`clearTimeout(timer)` anula el disparo pendiente; `setTimeout` crea uno nuevo con la espera completa.'
      },
      {
        what: 'Antes de lanzar la petición incrementamos `lastToken` y guardamos una copia local.',
        why: 'El debounce no resuelve el orden de llegada. Dos peticiones pueden estar en vuelo y la lenta puede resolverse después de la rápida. El token identifica cuál sigue siendo relevante.',
        how: '`const token = ++lastToken;` captura el valor en el cierre de esa ejecución concreta.'
      },
      {
        what: 'Al resolver comparamos `token !== lastToken` y salimos si no coincide.',
        why: 'Convierte una condición de carrera en un descarte explícito. La respuesta obsoleta se ignora en vez de pisar la buena.',
        how: 'Como `lastToken` vive en el cierre compartido, siempre refleja la búsqueda más reciente en el momento en que la promesa se resuelve.'
      },
      {
        what: 'La consulta vacía renderiza `[]` sin llamar a `fetchResults`.',
        why: 'Buscar la cadena vacía suele devolver el catálogo entero: es la consulta más cara del sistema y no aporta nada al usuario.',
        how: 'Un `if (!query.trim())` antes de la llamada, después de haber incrementado el token para invalidar cualquier respuesta en vuelo.'
      },
      {
        what: 'Añadimos `search.cancel()`.',
        why: 'En React o Vue el componente puede desmontarse con una petición en vuelo. Sin cancelación, el render se ejecuta sobre un componente que ya no existe.',
        how: 'Limpia el temporizador e invalida el token vigente, de modo que ninguna respuesta pendiente se pinte.'
      }
    ],

    rationale:
      'Elegimos token de invalidación en lugar de AbortController porque el ejercicio recibe una función `fetchResults` ' +
      'genérica que puede no ser fetch. El token funciona con cualquier promesa y es la técnica que se usa cuando la ' +
      'capa de datos no expone cancelación. Si controlas el fetch, AbortController es mejor: además de descartar la ' +
      'respuesta, corta la petición y libera la conexión y el trabajo del servidor.',

    alternatives: [
      { name: 'AbortController + fetch', when: 'Controlas la capa de red.', tradeoff: 'Cancela de verdad la petición (ahorra ancho de banda y carga en servidor), pero solo sirve para APIs que aceptan signal.' },
      { name: 'Throttle en vez de debounce', when: 'Quieres resultados intermedios mientras el usuario escribe.', tradeoff: 'Más peticiones y más feedback; peor para búsquedas caras, mejor para autocompletados muy rápidos.' },
      { name: 'RxJS: debounceTime + switchMap', when: 'El proyecto ya usa Angular o RxJS.', tradeoff: '`switchMap` resuelve el orden de forma declarativa, pero añade una dependencia y una curva de aprendizaje solo por esto.' },
      { name: 'React Query / SWR con clave por término', when: 'Aplicación React con muchas búsquedas.', tradeoff: 'Te da caché, deduplicación y estados de carga gratis; a cambio dejas de controlar los detalles finos.' }
    ],

    commonErrors: [
      { error: 'Declarar `let timer` dentro de la función devuelta.', why: 'Se reinicia en cada pulsación, así que `clearTimeout` nunca cancela nada y el debounce no existe.', fix: 'El estado va en el cierre exterior, fuera de la función que se llama en cada tecla.' },
      { error: 'Confiar solo en el debounce para el orden de llegada.', why: 'El debounce reduce el número de peticiones, pero dos siguen pudiendo solaparse. Es exactamente el bug que reporta soporte.', fix: 'Token de invalidación o AbortController, siempre además del debounce.' },
      { error: 'Comparar `query === ultimaQuery` en lugar de un token.', why: 'Si el usuario vuelve al mismo texto, dos respuestas distintas pasan el filtro y vuelve la carrera.', fix: 'Un contador monótono es inequívoco; el texto no.' },
      { error: 'Olvidar el `catch`.', why: 'Una promesa rechazada sin manejar deja la interfaz con el indicador de carga colgado para siempre.', fix: 'Capturar el error, comprobar el token también ahí y mostrar un estado de error.' },
      { error: 'Usar `setTimeout` sin limpiar al desmontar.', why: 'Provoca actualizaciones sobre componentes destruidos y fugas de memoria.', fix: 'Exponer `cancel()` y llamarlo desde el efecto de limpieza.' }
    ],

    bestPractices: [
      'El estado asíncrono compartido vive en un cierre o en un store, nunca en variables globales.',
      'Toda operación asíncrona que puede quedar obsoleta necesita una forma explícita de invalidarse.',
      'La espera del debounce se configura desde fuera (`wait`): 300 ms funciona para búsquedas, 50 ms para autocompletado local.',
      'Toda promesa que toca la interfaz necesita su rama de error.'
    ],

    security: [
      'Nunca interpoles el término de búsqueda en el HTML con `innerHTML`: es XSS directo. Usa `textContent` o el escapado del framework.',
      'Codifica el término con `encodeURIComponent` al construir la URL, o un `&` en la búsqueda romperá la query string.',
      'El debounce no es un límite de peticiones: el servidor debe seguir aplicando su propio rate limiting, porque un cliente malicioso no ejecuta tu JavaScript.'
    ],

    performance: [
      'Pasar de una petición por tecla a una por palabra reduce el tráfico en torno a un 80 % en un término medio.',
      'Cachear por término evita repetir la consulta cuando el usuario borra una letra y la vuelve a escribir.',
      'Si la lista es larga, renderiza solo los primeros N resultados o virtualiza: el cuello de botella se traslada al DOM.'
    ],

    companyLooksFor: [
      'Que identifiques la condición de carrera sin que nadie te la señale: es lo que separa a quien ha sufrido esto en producción de quien solo conoce el patrón.',
      'Que expliques por qué el debounce no basta.',
      'Limpieza de recursos (cancelación al desmontar): indica experiencia real con frameworks de componentes.',
      'Manejo del caso vacío y del error, no solo del camino feliz.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Debounce correcto (estado en el cierre)', weight: 25 },
        { criteria: 'Invalidación de respuestas obsoletas', weight: 35 },
        { criteria: 'Casos borde: vacío y error', weight: 20 },
        { criteria: 'Limpieza y legibilidad del código', weight: 10 },
        { criteria: 'Justificación de la decisión técnica', weight: 10 }
      ]
    },

    reinforce: [
      'Cierres y captura de variables: revisa el Módulo 5 (Scope & Closures) del laboratorio.',
      'Orden de resolución de promesas y microtareas: Módulo 4 (Asincronía).',
      'AbortController y cancelación real de fetch.',
      'Patrones equivalentes en React: `useEffect` con función de limpieza.'
    ]
  });

  /* ------------------------------------------------------------------
     2. Predecir la salida: bucle de eventos y cierres
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'js-orden-ejecucion',
    title: 'Predecir la salida: microtareas, macrotareas y cierres',
    category: 'javascript',
    kind: 'complete',
    level: 'junior-adv',
    time: 25,
    tags: ['event loop', 'closures', 'hoisting'],

    context:
      'Una parte muy común de la criba técnica consiste en enseñarte un fragmento corto y preguntarte qué imprime. ' +
      'No se evalúa la memoria: se evalúa si tienes un modelo mental correcto de cómo ejecuta JavaScript.',

    situation:
      'Te dan un fragmento con `var` en un bucle, un `setTimeout`, una promesa resuelta y un `console.log` síncrono. ' +
      'Un candidato que solo ha memorizado "async/await espera" falla; quien entiende la cola de microtareas acierta.',

    goal:
      'Declarar una variable `salida` con el array exacto de valores que imprime el fragmento, en orden, ' +
      'y después explicar el porqué de cada posición.',

    tech: ['JavaScript'],
    skills: ['bucle de eventos', 'microtareas', 'cierres (closures)', 'ámbito de var y let'],

    starter: {
      lang: 'javascript',
      code:
'// Analiza este fragmento SIN ejecutarlo:\n' +
'//\n' +
'//   console.log("A");\n' +
'//   setTimeout(() => console.log("B"), 0);\n' +
'//   Promise.resolve().then(() => console.log("C"));\n' +
'//   for (var i = 0; i < 2; i++) {\n' +
'//     setTimeout(() => console.log("D" + i), 0);\n' +
'//   }\n' +
'//   for (let j = 0; j < 2; j++) {\n' +
'//     setTimeout(() => console.log("E" + j), 0);\n' +
'//   }\n' +
'//   console.log("F");\n' +
'\n' +
'// Escribe el orden EXACTO de lo que se imprime:\n' +
'const salida = [];\n'
    },

    requirements: [
      'La variable `salida` debe contener las cadenas impresas, en orden, sin omitir ninguna.',
      'Debes poder explicar por qué "C" va antes que "B" aunque el `setTimeout` se registrase primero.',
      'Debes poder explicar por qué el bucle con `var` y el bucle con `let` imprimen valores distintos.'
    ],

    optional: [
      'Reescribe el bucle con `var` para que imprima lo mismo que el de `let`, sin cambiar `var` por `let`.',
      'Añade un `queueMicrotask` y predice dónde encaja.'
    ],

    hints: [
      'El código síncrono se ejecuta entero antes que cualquier callback. Empieza por ahí: qué se imprime sin esperar nada.',
      'Después de vaciar la pila, el motor vacía **toda** la cola de microtareas (promesas) antes de tocar la primera macrotarea (`setTimeout`).',
      '`var` tiene ámbito de función: los tres callbacks del primer bucle ven la MISMA variable `i`, que al ejecutarse ya vale 2. `let` crea un binding nuevo por iteración.'
    ],

    docs: {
      resumen:
        'JavaScript ejecuta en un solo hilo con tres reglas que lo explican todo: primero se ejecuta el código ' +
        'síncrono entero, después **todas** las microtareas (promesas) y solo entonces la primera macrotarea ' +
        '(`setTimeout`). Aparte, `var` y `let` capturan variables de forma distinta en los bucles.',

      conceptos: [
        {
          titulo: 'La pila de llamadas: nada se interrumpe a medias',
          texto:
            'JavaScript tiene **un solo hilo**. Mientras se está ejecutando una función, ninguna otra cosa ' +
            'puede colarse: ni un temporizador, ni una promesa, ni un clic.\n' +
            'Por eso lo primero que se imprime siempre es todo el código síncrono, de arriba abajo. Los ' +
            'callbacks solo se registran; se ejecutarán cuando la pila esté vacía.',
          codigo:
'console.log("1");\n' +
'setTimeout(function () { console.log("2"); }, 0);\n' +
'console.log("3");\n' +
'\n' +
'// Imprime: 1, 3, 2\n' +
'// El "0" de setTimeout NO significa "ahora": significa\n' +
'// "lo antes posible DESPUÉS de que la pila se vacíe".'
        },
        {
          titulo: 'Dos colas con prioridades distintas',
          texto:
            'Cuando la pila se vacía, el motor no atiende los callbacks en el orden en que se registraron. ' +
            'Hay **dos colas**:\n' +
            '**Microtareas** — lo que registran `.then()`, `.catch()`, `await` y `queueMicrotask()`.\n' +
            '**Macrotareas** — lo que registran `setTimeout`, `setInterval` y los eventos del DOM.\n' +
            'La regla es: al vaciarse la pila se ejecutan **todas** las microtareas pendientes, y solo cuando ' +
            'no queda ninguna se coge **una** macrotarea. Por eso una promesa siempre adelanta a un ' +
            '`setTimeout(…, 0)`, aunque el `setTimeout` se hubiera escrito antes.',
          codigo:
'setTimeout(function () { console.log("macro"); }, 0);   // cola lenta\n' +
'Promise.resolve().then(function () { console.log("micro"); });\n' +
'console.log("sincrono");\n' +
'\n' +
'// Imprime: sincrono → micro → macro\n' +
'//\n' +
'//   pila vacía\n' +
'//        ↓\n' +
'//   [ microtareas ]  se vacían ENTERAS\n' +
'//        ↓\n' +
'//   [ macrotareas ]  se coge UNA\n' +
'//        ↓  (y vuelta a empezar)'
        },
        {
          titulo: 'Varias macrotareas con el mismo retardo: orden de registro',
          texto:
            'Entre macrotareas no hay prioridad especial. Si registras tres `setTimeout(…, 0)`, se ejecutan ' +
            'en el mismo orden en que los escribiste. La cola de macrotareas es FIFO: el primero que entra ' +
            'es el primero que sale.',
          codigo:
'setTimeout(function () { console.log("A"); }, 0);\n' +
'setTimeout(function () { console.log("B"); }, 0);\n' +
'setTimeout(function () { console.log("C"); }, 0);\n' +
'\n' +
'// Imprime: A, B, C  (siempre en ese orden)'
        },
        {
          titulo: 'var captura la variable; let captura el valor de cada vuelta',
          texto:
            '`var` tiene **ámbito de función**: aunque la declares dentro de un `for`, solo existe **una** ' +
            'variable para todo el bucle. Los callbacks que crees dentro no guardan una copia del número: ' +
            'guardan una referencia a esa única variable. Cuando se ejecutan, el bucle ya terminó y la ' +
            'variable vale su valor final.\n' +
            '`let` tiene **ámbito de bloque** y, además, el estándar define un caso especial para los bucles ' +
            '`for`: se crea un enlace nuevo en cada iteración. Cada callback captura el suyo.\n' +
            'La pregunta que debes hacerte siempre es: **¿cuánto vale esta variable en el momento en que se ' +
            'ejecuta el callback?**, no en el momento en que se escribe.',
          codigo:
'for (var i = 0; i < 3; i++) {\n' +
'  setTimeout(function () { console.log("var:", i); }, 0);\n' +
'}\n' +
'// var: 3, var: 3, var: 3\n' +
'// Una sola `i`. Cuando los callbacks corren, el bucle acabó e i vale 3.\n' +
'\n' +
'for (let j = 0; j < 3; j++) {\n' +
'  setTimeout(function () { console.log("let:", j); }, 0);\n' +
'}\n' +
'// let: 0, let: 1, let: 2\n' +
'// Una `j` distinta por iteración.'
        },
        {
          titulo: 'Recuperar el comportamiento de let sin usar let',
          texto:
            'Antes de que existiera `let`, el truco era crear un ámbito nuevo a mano: una función que se ' +
            'invoca en el momento (IIFE, *immediately invoked function expression*) y recibe el valor como ' +
            'parámetro. Los parámetros son variables locales, así que cada llamada tiene el suyo.\n' +
            'Sigue siendo útil saberlo para entender código antiguo y para razonar sobre qué captura un cierre.',
          codigo:
'for (var i = 0; i < 3; i++) {\n' +
'  (function (copia) {                    // `copia` es local de esta llamada\n' +
'    setTimeout(function () { console.log(copia); }, 0);\n' +
'  })(i);                                 // se ejecuta ya, con el valor actual\n' +
'}\n' +
'// 0, 1, 2\n' +
'\n' +
'// forEach funciona igual sin trucos: cada iteración es una llamada\n' +
'// a función, así que cada callback tiene su propio ámbito.\n' +
'[0, 1, 2].forEach(function (n) {\n' +
'  setTimeout(function () { console.log(n); }, 0);\n' +
'});'
        },
        {
          titulo: 'Cómo se analiza un fragmento paso a paso',
          texto:
            'Método fiable para no equivocarte:\n' +
            '**1.** Recorre el código de arriba abajo y anota solo lo síncrono. Eso es el principio de la salida.\n' +
            '**2.** Anota aparte, en orden de aparición, qué microtareas se registraron.\n' +
            '**3.** Anota aparte qué macrotareas se registraron.\n' +
            '**4.** La salida final es: síncrono → microtareas (en orden) → macrotareas (en orden).\n' +
            '**5.** Para cada callback dentro de un bucle, pregúntate qué vale la variable **cuando se ejecuta**.',
          codigo:
'// Ejemplo de análisis\n' +
'console.log("uno");                                  // SÍNCRONO\n' +
'setTimeout(() => console.log("dos"), 0);             // macro #1\n' +
'Promise.resolve().then(() => console.log("tres"));   // micro #1\n' +
'console.log("cuatro");                               // SÍNCRONO\n' +
'\n' +
'// síncrono : uno, cuatro\n' +
'// micro    : tres\n' +
'// macro    : dos\n' +
'// RESULTADO: uno, cuatro, tres, dos'
        }
      ],

      referencia: [
        { nombre: 'Cola de microtareas', texto: 'La alimentan `.then()`, `.catch()`, `.finally()`, `await` y `queueMicrotask()`. Se vacía **entera** antes de cualquier macrotarea.' },
        { nombre: 'Cola de macrotareas', texto: 'La alimentan `setTimeout`, `setInterval` y los eventos. Se coge **una** por vuelta del bucle de eventos.' },
        { nombre: 'setTimeout(fn, 0)', texto: 'No es "inmediato". Es "en la próxima macrotarea disponible", después de todo lo síncrono y de todas las microtareas.' },
        { nombre: 'var', texto: 'Ámbito de función. Una sola variable para todo el bucle. Se eleva (hoisting) al principio de la función.' },
        { nombre: 'let / const', texto: 'Ámbito de bloque. En un `for`, un enlace nuevo por iteración.' },
        { nombre: 'Promise.resolve().then(fn)', texto: 'La forma más corta de meter algo en la cola de microtareas.' },
        { nombre: 'queueMicrotask(fn)', texto: 'Aplaza sin crear una promesa. Va a la misma cola que `.then`, con la misma prioridad.' },
        { nombre: 'requestAnimationFrame(fn)', texto: 'Se ejecuta antes del siguiente repintado. Es lo correcto para animaciones, no `setTimeout`.' }
      ],

      ejemplo: {
        titulo: 'Analiza este fragmento distinto y comprueba tu razonamiento',
        codigo:
'console.log("inicio");\n' +
'\n' +
'setTimeout(function () { console.log("timeout 1"); }, 0);\n' +
'\n' +
'Promise.resolve()\n' +
'  .then(function () { console.log("promesa 1"); })\n' +
'  .then(function () { console.log("promesa 2"); });\n' +
'\n' +
'for (var k = 0; k < 2; k++) {\n' +
'  Promise.resolve().then(function () { console.log("P" + k); });\n' +
'}\n' +
'\n' +
'setTimeout(function () { console.log("timeout 2"); }, 0);\n' +
'\n' +
'console.log("fin");\n' +
'\n' +
'\n' +
'/*  RESULTADO\n' +
' *\n' +
' *  inicio        <- síncrono\n' +
' *  fin           <- síncrono\n' +
' *  promesa 1     <- microtareas, en orden de registro\n' +
' *  P2\n' +
' *  P2            <- `var k` compartida: las dos ven k === 2\n' +
' *  promesa 2     <- se registró al resolverse "promesa 1",\n' +
' *                   así que entra en la cola DESPUÉS de P2 y P2\n' +
' *  timeout 1     <- macrotareas, en orden de registro\n' +
' *  timeout 2\n' +
' */',
        texto:
          'Dos detalles que merecen atención. Primero, `promesa 2` **no** va justo detrás de `promesa 1`: un ' +
          '`.then` encadenado no se registra hasta que el anterior se resuelve, así que entra en la cola por ' +
          'detrás de las microtareas que ya estaban esperando.\n' +
          'Segundo, el bucle con `var` produce `P2` dos veces exactamente por la misma razón que en tu ' +
          'ejercicio, aunque aquí sean promesas y no temporizadores: el problema es de **captura de ' +
          'variables**, no de qué cola se use.\n' +
          'Aplica este mismo método al fragmento de la prueba: separa síncrono, microtareas y macrotareas, ' +
          'y para cada callback de bucle pregúntate qué vale la variable al ejecutarse.'
      },

      glosario: [
        { termino: 'Bucle de eventos (event loop)', definicion: 'El mecanismo que, cuando la pila está vacía, decide qué callback se ejecuta a continuación consultando las colas.' },
        { termino: 'Pila de llamadas', definicion: 'Donde se apilan las funciones en ejecución. Mientras no esté vacía, ningún callback puede entrar.' },
        { termino: 'Microtarea', definicion: 'Tarea de prioridad alta, típicamente de promesas. Todas las pendientes se ejecutan antes de la siguiente macrotarea.' },
        { termino: 'Macrotarea', definicion: 'Tarea de prioridad normal: temporizadores y eventos. Se atiende de una en una.' },
        { termino: 'Hoisting (elevación)', definicion: 'Las declaraciones `var` y las funciones se mueven conceptualmente al principio de su ámbito. `let` y `const` no se pueden usar antes de declararse.' },
        { termino: 'Ámbito de bloque', definicion: 'La variable solo existe entre las llaves donde se declaró. Es el comportamiento de `let` y `const`.' },
        { termino: 'IIFE', definicion: 'Función que se define y se invoca en el mismo punto. Se usaba para crear un ámbito nuevo antes de que existiera `let`.' },
        { termino: 'FIFO', definicion: '"First in, first out": el primero que entra en la cola es el primero en salir.' }
      ],

      preparado: [
        '¿Qué se ejecuta primero: todo el código síncrono o el primer callback registrado?',
        '¿Por qué una promesa ya resuelta adelanta siempre a un `setTimeout(fn, 0)`?',
        'Si registras tres `setTimeout` con el mismo retardo, ¿en qué orden se ejecutan?',
        'En un bucle con `var`, ¿cuántas variables existen realmente?',
        '¿Qué vale la variable de un bucle `var` cuando se ejecuta un callback registrado dentro?',
        '¿Sabrías reescribir un bucle `var` para que capture el valor de cada vuelta sin usar `let`?'
      ]
    },

    tests: {
      mode: 'js',
      cases: [
        { name: 'El orden es exactamente el correcto', code: 'expect(salida).toEqual(["A","F","C","B","D2","D2","E0","E1"])' },
        { name: 'El código síncrono va primero', code: 'expect(salida.slice(0,2)).toEqual(["A","F"])' },
        { name: 'La microtarea adelanta al setTimeout', code: 'expect(salida.indexOf("C") < salida.indexOf("B")).toBeTruthy()' },
        { name: 'El bucle con var comparte la variable', code: 'expect(salida.filter(x => x === "D2")).toHaveLength(2)' }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'const salida = ["A", "F", "C", "B", "D2", "D2", "E0", "E1"];\n' +
'\n' +
'// Opcional: mismo comportamiento que `let` sin usar `let`.\n' +
'// Se crea un ámbito nuevo por iteración con una función invocada al momento.\n' +
'for (var i = 0; i < 2; i++) {\n' +
'  (function (copia) {\n' +
'    setTimeout(function () { console.log("D" + copia); }, 0);\n' +
'  })(i);\n' +
'}\n'
    },

    walkthrough: [
      { what: '"A" y "F".', why: 'Son las dos únicas llamadas síncronas. Todo lo demás son callbacks que se registran ahora y se ejecutan después.', how: 'La pila de llamadas se vacía por completo antes de que el bucle de eventos mire ninguna cola.' },
      { what: '"C" antes que "B".', why: 'Las promesas van a la cola de microtareas y `setTimeout` a la de macrotareas. El bucle de eventos vacía todas las microtareas después de cada tarea, antes de coger la siguiente macrotarea.', how: 'Aunque el `setTimeout(…, 0)` se registró antes, la microtarea le adelanta siempre.' },
      { what: '"D2" dos veces.', why: '`var i` tiene ámbito de función, no de bloque. Solo existe una `i`. Cuando los callbacks se ejecutan, el bucle ya terminó y `i` vale 2.', how: 'Los dos cierres capturan la misma variable, no su valor en el momento de la iteración.' },
      { what: '"E0" y "E1".', why: '`let` crea un binding nuevo en cada vuelta del bucle. Cada callback captura su propia `j`.', how: 'Es una garantía específica del estándar para `let` en bucles `for`, no un efecto del ámbito de bloque en general.' },
      { what: 'El orden entre "B", "D2", "D2", "E0", "E1".', why: 'Todos son macrotareas con el mismo retardo: se ejecutan en el orden en que se registraron.', how: 'La cola de macrotareas es FIFO; `0` no significa "ya", significa "lo antes posible después de lo pendiente".' }
    ],

    rationale:
      'Este ejercicio existe porque los dos errores que más caro salen en producción tienen aquí su raíz: ' +
      'asumir que `setTimeout(fn, 0)` ejecuta inmediatamente, y capturar una variable de bucle esperando su valor congelado. ' +
      'Entender el modelo de colas te evita depurar a ciegas problemas de orden en cualquier framework.',

    alternatives: [
      { name: 'Cerrar sobre el valor con una IIFE', when: 'Código heredado que no puede migrar a `let`.', tradeoff: 'Funciona en cualquier motor pero es más ruidoso de leer.' },
      { name: '`Array.prototype.forEach`', when: 'Iteras sobre una colección.', tradeoff: 'Cada iteración es una llamada a función, así que cada callback tiene su propio ámbito de forma natural.' },
      { name: '`queueMicrotask`', when: 'Quieres aplazar sin crear una promesa.', tradeoff: 'Va a la misma cola que `.then`, así que también adelanta a `setTimeout`.' }
    ],

    commonErrors: [
      { error: 'Decir que "B" va antes que "C" porque se escribió antes.', why: 'Confunde el orden de registro con el orden de ejecución. Son colas distintas con prioridades distintas.', fix: 'Microtareas siempre antes que macrotareas.' },
      { error: 'Esperar "D0" y "D1".', why: 'Asume que el cierre guarda una copia del valor. Guarda una referencia a la variable.', fix: 'Piensa siempre "¿cuánto vale esta variable en el momento en que se ejecuta el callback?".' },
      { error: 'Creer que `setTimeout(fn, 0)` es inmediato.', why: 'El retardo es un mínimo, no una garantía. Si la pila está ocupada, espera.', fix: 'Para trabajo urgente aplazado usa `queueMicrotask`; para trabajo pesado, `requestIdleCallback` o un Web Worker.' },
      { error: 'Bloquear el hilo con un bucle pesado y culpar al framework.', why: 'Todo lo anterior comparte un solo hilo: un cálculo largo congela render, eventos y timers.', fix: 'Trocea el trabajo o muévelo a un worker.' }
    ],

    bestPractices: [
      'Usa `let`/`const` por defecto: elimina de raíz toda esta clase de errores.',
      'No dependas del orden entre callbacks que no compartan la misma cola.',
      'Si el orden importa de verdad, hazlo explícito con `await` o encadenando promesas.'
    ],

    security: [
      'Aplazar validaciones con `setTimeout` para "dar tiempo" a que llegue un dato es un antipatrón: crea ventanas donde el estado es inconsistente y se puede explotar.'
    ],

    performance: [
      'Una cadena larga de microtareas puede dejar sin ejecutar los timers y bloquear el render: no encadenes cientos de `.then` sin ceder el hilo.',
      'Los callbacks de `setTimeout` se ejecutan entre frames; para animaciones usa `requestAnimationFrame`.'
    ],

    companyLooksFor: [
      'Que razones en voz alta con el modelo de pila + colas en lugar de recitar la respuesta.',
      'Que conectes el ejercicio con un bug real que hayas visto.',
      'Que sepas que `let` en bucles es un caso especial del estándar, no magia.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Orden correcto de la salida', weight: 40 },
        { criteria: 'Explicación de microtareas frente a macrotareas', weight: 25 },
        { criteria: 'Explicación de var frente a let en bucles', weight: 25 },
        { criteria: 'Solución alternativa con IIFE', weight: 10 }
      ]
    },

    reinforce: [
      'Módulo 4 (Asincronía) del laboratorio: promesas y orden de resolución.',
      'Módulo 5 (Scope & Closures): captura de variables.',
      'Lee sobre el bucle de eventos del navegador frente al de Node.js: las fases no son idénticas.'
    ]
  });

  /* ------------------------------------------------------------------
     3. Estados de una lista y accesibilidad
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'fe-estados-accesibles',
    title: 'Los cinco estados de una lista de datos',
    category: 'frontend',
    kind: 'build',
    level: 'mid',
    time: 60,
    tags: ['accesibilidad', 'estados de UI', 'ARIA'],

    context:
      'Una fintech recibe muchas incidencias del tipo "la pantalla se queda en blanco". Al revisarlo, la mayoría de ' +
      'componentes solo contemplan dos estados: cargando y con datos. Falta todo lo demás.',

    situation:
      'Tienes un componente que pinta una lista de transacciones. Debes convertirlo en un componente que cubra los ' +
      'cinco estados reales de cualquier vista de datos y que sea usable con teclado y lector de pantalla.',

    goal:
      'Implementar una función pura `estadoVista(datos)` que decida el estado a renderizar, y describir el marcado ' +
      'accesible de cada uno.',

    tech: ['JavaScript', 'HTML', 'ARIA', 'CSS'],
    skills: ['estados de interfaz', 'accesibilidad', 'gestión de errores en UI', 'HTML semántico'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * @param {{loading:boolean, error:any, items:any[]|null, filtro:string}} datos\n' +
' * @returns {"cargando"|"error"|"vacio"|"sin-resultados"|"listo"}\n' +
' */\n' +
'function estadoVista(datos) {\n' +
'  if (datos.loading) return "cargando";\n' +
'  return "listo";   // faltan tres estados\n' +
'}\n'
    },

    requirements: [
      '`cargando`: la petición está en curso.',
      '`error`: la petición falló. Tiene prioridad sobre cualquier dato antiguo en memoria.',
      '`vacio`: la petición fue bien pero el usuario no tiene ningún dato todavía (primera vez).',
      '`sin-resultados`: hay datos, pero el filtro activo no devuelve ninguno. Es un estado distinto de `vacio`.',
      '`listo`: hay elementos que mostrar.'
    ],

    optional: [
      'Añadir un estado `recargando` para cuando ya hay datos y llega una actualización en segundo plano.',
      'Distinguir errores recuperables (reintentar) de no recuperables (sin permisos).'
    ],

    hints: [
      'El orden de las comprobaciones es la parte importante. Piensa cuál gana si `loading` y `error` son ciertos a la vez.',
      '`vacio` y `sin-resultados` se distinguen por si hay filtro activo: sin datos y sin filtro es cuenta nueva; sin datos y con filtro es búsqueda infructuosa.',
      'Los mensajes de cada estado deben proponer una acción: "Crea tu primera transacción" frente a "Prueba con otro término".'
    ],

    docs: {
      resumen:
        'Toda vista que carga datos tiene cinco estados posibles, no dos. La parte de código es una función ' +
        'pura con `return` tempranos en el orden correcto; la parte importante es entender **por qué ese ' +
        'orden** y cómo se anuncia cada estado a quien no ve la pantalla.',

      conceptos: [
        {
          titulo: 'Los cinco estados de cualquier vista de datos',
          texto:
            'La mayoría de componentes solo contemplan "cargando" y "hay datos". Faltan tres, y son los que ' +
            'generan incidencias:\n' +
            '**cargando** — la petición está en curso.\n' +
            '**error** — la petición falló.\n' +
            '**vacío** — fue bien, pero el usuario todavía no tiene datos. Es una cuenta nueva.\n' +
            '**sin resultados** — sí tiene datos, pero el filtro activo no devuelve ninguno.\n' +
            '**listo** — hay elementos que mostrar.\n' +
            'Vacío y sin resultados parecen lo mismo y no lo son: uno se soluciona creando datos y el otro ' +
            'quitando el filtro. Un mensaje genérico deja al usuario sin saber qué hacer.',
          codigo:
'// Lo que casi todo el mundo escribe\n' +
'if (loading) return <Spinner />;\n' +
'return <Lista items={items} />;     // ¿y si falló? ¿y si está vacío?\n' +
'\n' +
'// Lo que hace falta\n' +
'//   error           -> mensaje + botón reintentar\n' +
'//   cargando        -> esqueleto\n' +
'//   listo           -> la lista\n' +
'//   sin resultados  -> "nada para «abc»" + quitar filtros\n' +
'//   vacío           -> "aún no tienes nada" + crear el primero'
        },
        {
          titulo: 'Función pura: la decisión, separada del dibujo',
          texto:
            'Una **función pura** es la que, con las mismas entradas, siempre devuelve lo mismo y no toca nada ' +
            'de fuera. Sacar la decisión del estado a una función pura tiene tres ventajas concretas:\n' +
            'se puede probar sin montar DOM ni framework; se lee de un vistazo si falta algún caso; y sirve ' +
            'igual en React, Vue o JavaScript a secas.\n' +
            'Cuando estas condiciones viven dentro del JSX, quedan escondidas entre el marcado y es cuando se ' +
            'olvidan estados.',
          codigo:
'// Pura: solo mira sus parámetros y devuelve un valor\n' +
'function estado(datos) {\n' +
'  if (datos.error) return "error";\n' +
'  return "listo";\n' +
'}\n' +
'\n' +
'// NO pura: lee de fuera y provoca efectos\n' +
'function estadoMalo() {\n' +
'  if (window.errorGlobal) { mostrarAviso(); return "error"; }\n' +
'  return "listo";\n' +
'}'
        },
        {
          titulo: 'return temprano: el orden ES la lógica',
          texto:
            'Con `return` tempranos, la primera condición que se cumple gana. Eso convierte el orden en una ' +
            'declaración de prioridades, y aquí las prioridades importan:\n' +
            '**el error va primero** porque, si la petición falló, enseñar datos antiguos como si fueran ' +
            'actuales es engañar al usuario. En una aplicación financiera, eso es mostrar un saldo que no es real.\n' +
            '**cargando va después del error** porque un reintento puede tener las dos cosas a la vez, y no ' +
            'queremos que un indicador de carga tape un fallo que el usuario aún no ha visto.',
          codigo:
'function estadoVista(datos) {\n' +
'  if (datos.error) return "error";       // 1º: el fallo se comunica siempre\n' +
'  if (datos.loading) return "cargando";  // 2º\n' +
'  // 3º: a partir de aquí, hay respuesta buena\n' +
'  // ...\n' +
'}\n' +
'\n' +
'// Si inviertes las dos primeras líneas, un reintento sobre un error\n' +
'// previo oculta el error detrás del spinner.'
        },
        {
          titulo: 'Normalizar null: el origen de la "pantalla en blanco"',
          texto:
            'Una API puede devolver `null` donde esperabas una lista vacía. Si haces `datos.items.length` sin ' +
            'comprobarlo, lanza `TypeError` y el componente entero deja de renderizar: eso es literalmente la ' +
            'incidencia "se queda en blanco".\n' +
            'La solución es normalizar **en un solo punto de entrada**, no repartir comprobaciones por toda la ' +
            'vista. El operador `||` cubre `null`, `undefined` y también `0` o `""`; el `??` solo cubre `null` ' +
            'y `undefined`, que suele ser lo más preciso.',
          codigo:
'const items = datos.items || [];     // null y undefined pasan a []\n' +
'items.length;                        // ya nunca lanza\n' +
'\n' +
'// Diferencia entre || y ??\n' +
'0 || "por defecto"      // "por defecto"   (0 es falsy)\n' +
'0 ?? "por defecto"      // 0               (solo null/undefined)\n' +
'null ?? "por defecto"   // "por defecto"'
        },
        {
          titulo: 'Regiones vivas: cómo se entera de un cambio quien no ve la pantalla',
          texto:
            'Un lector de pantalla lee la página cuando llega. Si después cambias el contenido con JavaScript, ' +
            '**no se entera de nada**: para esa persona la página parece congelada.\n' +
            'Las *regiones vivas* son zonas que el lector vigila y anuncia cuando cambian:\n' +
            '`aria-live="polite"` espera a que termine lo que está leyendo. Para cargas y recuentos.\n' +
            '`aria-live="assertive"` interrumpe. Solo para lo urgente.\n' +
            '`role="status"` equivale a una región `polite`; `role="alert"` equivale a `assertive`.\n' +
            'Regla práctica: el error interrumpe, todo lo demás espera.',
          codigo:
'<!-- Cargando: anuncia sin interrumpir -->\n' +
'<div role="status" aria-live="polite">Cargando transacciones…</div>\n' +
'\n' +
'<!-- El esqueleto visual no aporta nada al lector: se oculta -->\n' +
'<div class="esqueleto" aria-hidden="true">…</div>\n' +
'\n' +
'<!-- Error: interrumpe, el usuario debe enterarse -->\n' +
'<div role="alert">No hemos podido cargar tus transacciones.\n' +
'  <button>Reintentar</button>\n' +
'</div>\n' +
'\n' +
'<!-- Recuento tras filtrar: visible solo para el lector -->\n' +
'<div role="status" aria-live="polite" class="sr-only">12 resultados</div>'
        },
        {
          titulo: 'La primera regla de ARIA es no usar ARIA',
          texto:
            'Si existe un elemento HTML que ya hace lo que necesitas, úsalo. Un `<button>` recibe foco, ' +
            'responde a Enter y Espacio y se anuncia como botón, todo gratis. Un `<div role="button">` no ' +
            'hace nada de eso: solo *dice* que es un botón.\n' +
            'Este es el error de accesibilidad que más introduce el código generado automáticamente: atributos ' +
            'sintácticamente correctos sobre elementos semánticamente equivocados.',
          codigo:
'<!-- MAL: parece un botón, no se comporta como uno -->\n' +
'<div role="button" onclick="borrar()">Borrar</div>\n' +
'<!-- no recibe foco con Tab, no responde a Enter ni a Espacio -->\n' +
'\n' +
'<!-- BIEN -->\n' +
'<button type="button" onclick="borrar()">Borrar</button>\n' +
'\n' +
'<!-- Si navega a otro sitio, es un enlace, no un botón -->\n' +
'<a href="/detalle/12">Ver detalle</a>'
        }
      ],

      referencia: [
        { nombre: 'valor || alternativa', texto: 'Devuelve la alternativa si el valor es falsy (`null`, `undefined`, `0`, `""`, `false`, `NaN`).' },
        { nombre: 'valor ?? alternativa', texto: 'Devuelve la alternativa solo si el valor es `null` o `undefined`. Más preciso cuando `0` o `""` son válidos.' },
        { nombre: 'array.length', texto: 'Número de elementos. Lanza `TypeError` si el array es `null`: por eso hay que normalizar antes.' },
        { nombre: 'cadena.trim()', texto: 'Quita espacios de los extremos. Un filtro con solo espacios no debería contar como filtro activo.' },
        { nombre: 'role="status"', texto: 'Región viva educada. El lector anuncia el cambio cuando termina lo que estaba diciendo.' },
        { nombre: 'role="alert"', texto: 'Región viva urgente. Interrumpe al lector. Reservado para errores.' },
        { nombre: 'aria-live="polite" / "assertive"', texto: 'Forma explícita de declarar una región viva sobre cualquier elemento.' },
        { nombre: 'aria-hidden="true"', texto: 'Oculta un elemento al lector de pantalla sin ocultarlo visualmente. Para esqueletos de carga e iconos decorativos.' },
        { nombre: 'clase .sr-only', texto: 'Convención CSS para texto visible solo para lectores de pantalla (no `display:none`, que también lo oculta a ellos).' }
      ],

      ejemplo: {
        titulo: 'Bandeja de mensajes: mismos cinco estados, otro dominio',
        codigo:
'/**\n' +
' * Decide qué pintar en una bandeja de mensajes.\n' +
' * Pura: sin efectos, sin DOM, testeable en una línea.\n' +
' */\n' +
'function estadoBandeja(datos) {\n' +
'  if (datos.fallo) return "error";              // 1º el fallo\n' +
'  if (datos.cargando) return "cargando";        // 2º la carga\n' +
'\n' +
'  const mensajes = datos.mensajes || [];        // null -> []\n' +
'  if (mensajes.length > 0) return "listo";\n' +
'\n' +
'  const hayBusqueda = Boolean((datos.busqueda || "").trim());\n' +
'  return hayBusqueda ? "sin-resultados" : "vacio";\n' +
'}\n' +
'\n' +
'\n' +
'/*  Marcado accesible de cada estado\n' +
' *\n' +
' *  cargando\n' +
' *    <div role="status" aria-live="polite">Cargando mensajes…</div>\n' +
' *    <ul class="esqueleto" aria-hidden="true"> … </ul>\n' +
' *\n' +
' *  error\n' +
' *    <div role="alert">\n' +
' *      No hemos podido cargar tu bandeja.\n' +
' *      <button type="button">Reintentar</button>\n' +
' *    </div>\n' +
' *\n' +
' *  vacio            (cuenta nueva: es bienvenida, no fallo)\n' +
' *    <p>Tu bandeja está vacía.</p>\n' +
' *    <button type="button">Escribir el primer mensaje</button>\n' +
' *\n' +
' *  sin-resultados   (repetimos el término y ofrecemos la salida)\n' +
' *    <p>Ningún mensaje coincide con «pedido».</p>\n' +
' *    <button type="button">Quitar la búsqueda</button>\n' +
' *\n' +
' *  listo\n' +
' *    <ul> … <li> por mensaje … </ul>\n' +
' *    <div role="status" aria-live="polite" class="sr-only">8 mensajes</div>\n' +
' */',
        texto:
          'Tres cosas para llevarte a la prueba. **El orden de los `return`**: fallo, carga y después el resto. ' +
          '**La normalización con `|| []`** antes de tocar `.length`. Y **la distinción vacío / sin resultados** ' +
          'a partir de si hay filtro activo, usando `trim()` para que unos espacios no cuenten como búsqueda.\n' +
          'Fíjate también en que cada estado vacío **ofrece la acción siguiente** en lugar de limitarse a ' +
          'describir la ausencia. Eso es lo que se puntúa como pensamiento de producto.'
      },

      glosario: [
        { termino: 'Función pura', definicion: 'Con las mismas entradas devuelve siempre la misma salida y no modifica nada externo. Trivial de testear.' },
        { termino: 'Return temprano', definicion: 'Salir de la función en cuanto se cumple una condición. Evita anidar y hace explícitas las prioridades.' },
        { termino: 'Estado vacío', definicion: 'La vista no tiene datos porque todavía no existen. Es un momento de bienvenida, no un fallo.' },
        { termino: 'Sin resultados', definicion: 'Sí hay datos, pero el filtro o la búsqueda no encuentra ninguno. Se resuelve quitando el filtro.' },
        { termino: 'Región viva (live region)', definicion: 'Zona de la página cuyos cambios anuncia el lector de pantalla automáticamente.' },
        { termino: 'Lector de pantalla', definicion: 'Programa que lee la interfaz en voz alta. Depende del HTML semántico y de ARIA para saber qué es cada cosa.' },
        { termino: 'ARIA', definicion: 'Conjunto de atributos que añaden significado accesible cuando el HTML no llega. Complemento del HTML semántico, nunca sustituto.' },
        { termino: 'CLS', definicion: '*Cumulative Layout Shift*: métrica de cuánto "salta" el contenido al cargar. Se evita reservando el espacio del esqueleto.' },
        { termino: 'Falsy', definicion: 'Valores que JavaScript trata como falsos: `false`, `0`, `""`, `null`, `undefined` y `NaN`.' }
      ],

      preparado: [
        '¿Sabrías nombrar los cinco estados sin mirar?',
        '¿Por qué el error se comprueba antes que la carga?',
        '¿Qué diferencia hay entre el estado vacío y el estado sin resultados, y qué acción ofrece cada uno?',
        '¿Qué pasa si la API devuelve `null` en lugar de `[]` y no lo normalizas?',
        '¿Cuándo usas `role="status"` y cuándo `role="alert"`?',
        '¿Por qué un `<div role="button">` no es un sustituto válido de un `<button>`?'
      ]
    },

    tests: {
      mode: 'js',
      cases: [
        { name: 'Cargando gana cuando no hay error', code: 'expect(estadoVista({loading:true, error:null, items:null, filtro:""})).toBe("cargando")' },
        { name: 'El error gana sobre datos antiguos', code: 'expect(estadoVista({loading:false, error:new Error("500"), items:[1,2], filtro:""})).toBe("error")' },
        { name: 'Sin datos y sin filtro es estado vacío', code: 'expect(estadoVista({loading:false, error:null, items:[], filtro:""})).toBe("vacio")' },
        { name: 'Sin datos con filtro activo es sin-resultados', code: 'expect(estadoVista({loading:false, error:null, items:[], filtro:"abc"})).toBe("sin-resultados")' },
        { name: 'Con elementos, estado listo', code: 'expect(estadoVista({loading:false, error:null, items:[{id:1}], filtro:"a"})).toBe("listo")' },
        { name: 'items null tras cargar se trata como vacío, no como listo', code: 'expect(estadoVista({loading:false, error:null, items:null, filtro:""})).toBe("vacio")' }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'function estadoVista(datos) {\n' +
'  if (datos.error) return "error";        // el fallo se comunica siempre\n' +
'  if (datos.loading) return "cargando";\n' +
'\n' +
'  const items = datos.items || [];        // null y [] se tratan igual\n' +
'  if (items.length > 0) return "listo";\n' +
'\n' +
'  return datos.filtro ? "sin-resultados" : "vacio";\n' +
'}\n' +
'\n' +
'/* Marcado accesible por estado:\n' +
'\n' +
'   cargando   <div role="status" aria-live="polite">Cargando transacciones…</div>\n' +
'              El esqueleto visual va con aria-hidden="true": no aporta nada al lector.\n' +
'\n' +
'   error      <div role="alert">No hemos podido cargar tus transacciones.\n' +
'                <button>Reintentar</button></div>\n' +
'              role="alert" interrumpe al lector: el usuario debe enterarse.\n' +
'\n' +
'   vacio      <p>Todavía no tienes transacciones.</p><button>Crear la primera</button>\n' +
'              Estado de bienvenida, no de fallo. Debe ofrecer la acción siguiente.\n' +
'\n' +
'   sin-result <p>Ningún resultado para "abc".</p><button>Quitar filtros</button>\n' +
'              Se repite el término buscado y se ofrece la salida.\n' +
'\n' +
'   listo      <ul> con un <li> por transacción y\n' +
'              <div role="status" aria-live="polite" class="sr-only">12 resultados</div>\n' +
'              para que el lector anuncie el cambio de recuento.\n' +
'*/\n'
    },

    walkthrough: [
      { what: '`error` se comprueba primero.', why: 'Si falló la petición, mostrar datos antiguos como si fueran actuales es engañar al usuario. En una fintech eso significa enseñar un saldo que no es el real.', how: 'Un `return` temprano antes que cualquier otra rama.' },
      { what: '`loading` va después del error.', why: 'Un reintento puede tener `loading: true` y un `error` previo a la vez; queremos que el error se limpie explícitamente, no que lo tape un spinner.', how: 'Segundo `return` temprano.' },
      { what: '`items || []` normaliza `null`.', why: 'La API puede devolver `null` en vez de lista vacía. Sin normalizar, `datos.items.length` lanza y la pantalla se queda en blanco: exactamente la incidencia reportada.', how: 'Un valor por defecto en el punto de entrada, no repartido por toda la vista.' },
      { what: 'Separar `vacio` de `sin-resultados`.', why: 'Son problemas distintos con soluciones distintas: uno se resuelve creando datos, el otro quitando el filtro. Un mensaje genérico deja al usuario atascado.', how: 'La presencia de filtro decide cuál es.' },
      { what: '`aria-live` en cargando y en el recuento, `role="alert"` en el error.', why: 'Un usuario de lector de pantalla no ve que la lista cambió. Sin regiones vivas, la actualización es invisible para él.', how: '`polite` espera a que termine de leer; `alert` interrumpe. El error interrumpe, el resto no.' }
    ],

    rationale:
      'Convertimos la decisión en una función pura separada del render porque así se puede testear sin DOM, ' +
      'reutilizar en cualquier framework y revisar de un vistazo. Meter estas condiciones dentro del JSX es ' +
      'lo que hace que se olviden estados: quedan escondidas entre el marcado.',

    alternatives: [
      { name: 'Máquina de estados (XState o un reducer)', when: 'El flujo tiene transiciones complejas (reintentos, paginación, optimistic UI).', tradeoff: 'Hace imposible un estado inválido, a cambio de más ceremonia.' },
      { name: 'Estados derivados de React Query / SWR', when: 'Usas una librería de datos.', tradeoff: 'Te da `isLoading`, `isError`, `isFetching` ya resueltos; sigues teniendo que distinguir vacío de sin-resultados, que es lógica de tu dominio.' },
      { name: 'Renderizado condicional en el propio JSX', when: 'Componentes muy pequeños.', tradeoff: 'Menos indirección pero se vuelve ilegible y se olvidan casos en cuanto crece.' }
    ],

    commonErrors: [
      { error: 'Solo contemplar cargando y listo.', why: 'Es la causa número uno de "pantalla en blanco": el error no se pinta y el usuario no sabe qué pasa.', fix: 'Trata los cinco estados como el contrato mínimo de cualquier vista de datos.' },
      { error: 'Usar el mismo mensaje para vacío y sin resultados.', why: 'Decirle "todavía no tienes transacciones" a alguien que tiene 500 pero filtró mal es confuso y parece un fallo.', fix: 'Mensaje y acción distintos por estado.' },
      { error: 'Poner un spinner sin `aria-live`.', why: 'Para un lector de pantalla no ocurre nada: la página parece congelada.', fix: '`role="status"` con `aria-live="polite"`.' },
      { error: 'Aplicar `aria-label` a un `<div>` clicable en vez de usar `<button>`.', why: 'Un div no recibe foco ni responde a Enter/Espacio. Es el error de accesibilidad que más introduce el código generado por IA.', fix: 'Elemento semántico correcto primero; ARIA solo cuando el HTML no llega.' },
      { error: 'Ocultar el esqueleto de carga sin `aria-hidden`.', why: 'El lector lee decenas de elementos de relleno sin sentido.', fix: '`aria-hidden="true"` en el esqueleto y un único `role="status"` con el texto.' }
    ],

    bestPractices: [
      'La primera regla de ARIA: no usar ARIA. Un `<button>` real vence a cualquier `role="button"`.',
      'Normaliza la respuesta de la API en un solo punto de entrada, no en cada componente.',
      'Cada estado vacío debe ofrecer la acción siguiente, no solo describir la ausencia.',
      'Contraste mínimo 4.5:1 en texto normal; los mensajes de estado suelen ser los primeros en incumplirlo por usar gris claro.'
    ],

    security: [
      'No vuelques el mensaje de error del servidor tal cual en pantalla: puede filtrar rutas internas, versiones o trazas. Muestra un mensaje propio y registra el detalle.',
      'El término del filtro se repite en la interfaz: escápalo o tendrás XSS reflejado en tu propio estado vacío.'
    ],

    performance: [
      'Reserva el espacio del esqueleto con las mismas dimensiones que el contenido real para no provocar saltos de layout (CLS).',
      'No montes y desmontes el contenedor entero al cambiar de estado: cambia solo el contenido interior y conserva el foco.'
    ],

    companyLooksFor: [
      'Que distingas vacío de sin-resultados sin que te lo pidan: demuestra que has trabajado con usuarios reales.',
      'Accesibilidad tratada como requisito, no como añadido final.',
      'Lógica de estado separada y testeable.',
      'Que no expongas errores crudos del backend.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Los cinco estados con el orden de prioridad correcto', weight: 35 },
        { criteria: 'Normalización de datos nulos', weight: 15 },
        { criteria: 'Marcado accesible por estado', weight: 30 },
        { criteria: 'Mensajes con acción siguiente', weight: 10 },
        { criteria: 'Separación entre lógica y render', weight: 10 }
      ]
    },

    reinforce: [
      'WAI-ARIA Authoring Practices: patrones de regiones vivas.',
      'Módulo 3 (Laboratorio DOM) para el marcado y los eventos de teclado.',
      'Máquinas de estado finito aplicadas a interfaces.'
    ]
  });

})(window.TT);

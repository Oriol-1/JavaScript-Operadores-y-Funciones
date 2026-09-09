/* ============================================================
   Algoritmos y SQL — los dos formatos de prueba que faltaban
   ------------------------------------------------------------
   El catálogo cubría bien el trabajo de producto, pero dejaba
   fuera dos rondas que siguen siendo muy frecuentes en 2026:

   · La ronda de algoritmos con análisis de complejidad, que
     Google y Meta documentan en sus propias guías oficiales de
     preparación.
   · La ronda de SQL, habitual en banca y en producto con datos,
     donde no se evalúa si te sabes la sintaxis sino si entiendes
     lo que la base de datos va a hacer con tu consulta.
   ============================================================ */
(function (TT) {
  'use strict';

  /* ------------------------------------------------------------------
     1. Ventana deslizante — ronda de algoritmos
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'alg-ventana-deslizante',
    empresa: {
      empresas: ['google', 'meta', 'netflix'],
      evidencia: 'documentada',
      puesto: 'Software Engineer',
      rol: 'backend',
      formato: 'algoritmos',
      dificultad: 3,
      evalua: [
        'Análisis de complejidad explícito: llegar a O(n) y saber decir por qué lo es.',
        'Casos límite tratados antes de escribir el bucle, no después de que falle un test.',
        'Narrar el razonamiento mientras programas: el comité de Google solo lee lo que el entrevistador anotó.'
      ],
      nota:
        'Google y Meta publican en sus guías oficiales que sus rondas técnicas evalúan estructuras de ' +
        'datos, algoritmos y complejidad, y Netflix documenta que sus problemas son piezas de ' +
        'infraestructura reconocibles como un limitador de peticiones. Ese formato está documentado; ' +
        'el enunciado concreto de esta prueba es original nuestro.',
      fuentes: [
        { titulo: 'Software Engineer interview prep guide — Google Careers', url: 'https://www.google.com/about/careers/applications/candidate-prep/swe' },
        { titulo: 'Preparing for your software engineering interview at Meta', url: 'https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/' },
        { titulo: 'Demystifying Interviewing for Backend Engineers @ Netflix', url: 'https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495' }
      ]
    },
    categorias: ['performance'],
    title: 'El pico de peticiones: ventana deslizante en O(n)',
    category: 'javascript',
    kind: 'build',
    level: 'mid',
    time: 35,
    tags: ['algoritmos', 'dos punteros', 'complejidad', 'rate limiting'],

    context:
      'Ronda de algoritmos de 45 minutos, con un ingeniero al otro lado y un editor compartido sin ' +
      'autocompletado. El problema está sacado de un sistema real: el equipo de infraestructura necesita ' +
      'saber cuál fue el momento de más carga de cada cliente para dimensionar sus límites de peticiones.',

    situation:
      'Tienes las marcas de tiempo (en milisegundos) de todas las peticiones que un cliente hizo ayer. ' +
      'Quieren saber **cuántas peticiones llegó a hacer, como máximo, en una ventana de tiempo cualquiera**: ' +
      'si el límite es de 100 peticiones por minuto y su pico real fue de 340, hay que hablar con ese cliente.\n' +
      'El entrevistador te avisa de dos cosas antes de empezar: que hay clientes con millones de peticiones ' +
      'diarias, y que el fichero de origen **no siempre llega ordenado**.',

    goal:
      'Implementar `picoDePeticiones(marcas, ventanaMs)`, que devuelve el número máximo de peticiones ' +
      'contenidas en cualquier ventana de `ventanaMs` milisegundos, con complejidad lineal tras ordenar.',

    tech: ['JavaScript', 'Algoritmos'],
    skills: ['dos punteros', 'ventana deslizante', 'análisis de complejidad', 'casos límite', 'inmutabilidad'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * Máximo de peticiones contenidas en una ventana deslizante.\n' +
' *\n' +
' * @param {number[]} marcas    Marcas de tiempo en ms. Pueden llegar desordenadas.\n' +
' * @param {number}   ventanaMs Duración de la ventana, en ms.\n' +
' * @returns {number} El pico de peticiones simultáneas en esa ventana.\n' +
' *\n' +
' * La ventana es SEMIABIERTA: [t, t + ventanaMs).\n' +
' * Dos peticiones separadas exactamente ventanaMs NO cuentan juntas.\n' +
' */\n' +
'function picoDePeticiones(marcas, ventanaMs) {\n' +
'  // Tu solución aquí.\n' +
'}\n'
    },

    requirements: [
      'Complejidad **O(n) tras la ordenación**: nada de comparar cada marca con todas las demás.',
      'La ventana es semiabierta `[t, t + ventanaMs)`: dos peticiones separadas exactamente `ventanaMs` no cuentan juntas.',
      'La entrada puede llegar desordenada y hay que tratarla.',
      '**No mutar el array recibido**: quien te llama lo sigue usando después.',
      'Array vacío o no válido devuelve `0`.',
      '`ventanaMs` menor o igual que cero devuelve `0`: una ventana sin duración no contiene nada.',
      'Sin librerías externas.'
    ],

    optional: [
      'Devolver también el instante en el que empieza la ventana del pico.',
      'Adaptar la función para responder en flujo, sin tener todas las marcas en memoria.',
      'Explicar qué cambiaría si las marcas llegasen ya ordenadas y garantizadas por el origen.'
    ],

    hints: [
      'La fuerza bruta es "para cada marca, contar cuántas caen dentro de su ventana". Escríbela primero si te ayuda a fijar la semántica, y después pregúntate qué trabajo estás repitiendo.',
      'Cuando avanzas el final de la ventana una posición, el principio **nunca retrocede**. Esa propiedad es la que convierte dos bucles anidados en dos punteros.',
      'El puntero de inicio no se reinicia en cada vuelta: se queda donde lo dejaste. Por eso, aunque haya un `while` dentro del `for`, cada elemento se visita como mucho dos veces.',
      'Semiabierta significa `>=`, no `>`: mientras `orden[fin] - orden[inicio] >= ventanaMs`, la marca de inicio ya no cabe.',
      '`array.sort()` ordena **en el sitio** y además compara como texto. Necesitas `slice()` y un comparador numérico.'
    ],

    docs: {
      resumen:
        'Esta prueba se resuelve con **dos punteros sobre una secuencia ordenada**, el patrón que hay ' +
        'detrás de casi todos los problemas de "ventana". Lo que se evalúa no es que conozcas el truco, ' +
        'sino que sepas **por qué el coste baja de O(n²) a O(n)** y que trates los casos límite antes de ' +
        'que un test te los recuerde.',

      conceptos: [
        {
          titulo: 'La ventana deslizante y por qué el inicio nunca retrocede',
          texto:
            'Una ventana deslizante es un par de índices, `inicio` y `fin`, que delimitan un tramo de la ' +
            'secuencia ordenada. `fin` avanza una posición en cada vuelta del bucle. `inicio` avanza solo ' +
            'cuando el tramo se ha hecho demasiado ancho.\n' +
            'La clave está en una propiedad de la entrada ordenada: **si una marca ya no cabe en la ventana ' +
            'que termina en `fin`, tampoco cabrá en ninguna ventana posterior**, porque las siguientes ' +
            'terminan aún más tarde. Por eso `inicio` nunca necesita volver atrás.\n' +
            'Esa es la razón de que el coste sea lineal aunque haya un `while` dentro de un `for`: cada ' +
            'índice recorre el array **una sola vez** de principio a fin. Entre los dos hacen como mucho ' +
            '`2n` pasos, y 2n sigue siendo O(n).',
          codigo:
'// marcas = [10, 20, 30, 100, 105], ventanaMs = 50\n' +
'//\n' +
'//  fin=0  [10]                       inicio=0  ancho 0    -> 1\n' +
'//  fin=1  [10 20]                    inicio=0  ancho 10   -> 2\n' +
'//  fin=2  [10 20 30]                 inicio=0  ancho 20   -> 3   <- pico\n' +
'//  fin=3  [10 20 30 100]  90 >= 50 -> inicio avanza...\n' +
'//         [100]                      inicio=3  ancho 0    -> 1\n' +
'//  fin=4  [100 105]                  inicio=3  ancho 5    -> 2\n' +
'//\n' +
'// inicio pasó por 0,1,2,3 UNA vez. fin pasó por 0..4 UNA vez.'
        },
        {
          titulo: 'Intervalo semiabierto: dónde se pierden la mitad de los candidatos',
          texto:
            'Decir "una ventana de 1000 ms" es ambiguo hasta que dices si el extremo entra o no.\n' +
            '**Semiabierto `[t, t+1000)`** significa que la marca `t` entra y la marca `t+1000` ya no. Es la ' +
            'convención habitual en límites de peticiones, y es la que pide esta prueba.\n' +
            'En código, la diferencia es un solo carácter: la condición de expulsión es ' +
            '`orden[fin] - orden[inicio] >= ventanaMs`. Con `>` en vez de `>=` estarías usando un ' +
            'intervalo cerrado y contarías de más justo en el borde.\n' +
            'En una entrevista real esto se pregunta **antes** de escribir código. Preguntar "¿el extremo ' +
            'entra?" suma puntos; asumirlo en silencio y equivocarte, los resta.',
          codigo:
'// ventanaMs = 1000, marcas = [0, 1000]\n' +
'//\n' +
'//   semiabierto  [0, 1000)  ->  el 1000 queda fuera  ->  pico = 1\n' +
'//   cerrado      [0, 1000]  ->  el 1000 entra        ->  pico = 2\n' +
'//\n' +
'// while (orden[fin] - orden[inicio] >= ventanaMs) inicio++;   // semiabierto\n' +
'// while (orden[fin] - orden[inicio] >  ventanaMs) inicio++;   // cerrado'
        },
        {
          titulo: 'Ordenar sin destrozar la entrada',
          texto:
            '`Array.prototype.sort` tiene dos trampas y las dos aparecen en revisiones de código reales:\n' +
            '**1. Ordena en el sitio.** Devuelve el mismo array, ya modificado. Si te lo pasaron por ' +
            'parámetro, acabas de cambiar un dato de quien te llamó sin avisar. La copia es `marcas.slice()`.\n' +
            '**2. Sin comparador, compara como texto.** `[10, 9, 100].sort()` devuelve `[10, 100, 9]`, ' +
            'porque `"100" < "9"` alfabéticamente. Con números siempre hace falta ' +
            '`sort((a, b) => a - b)`.\n' +
            'La ordenación cuesta O(n log n), así que el coste total del algoritmo es O(n log n); el ' +
            'recorrido en sí es O(n). Decir esa frase completa en la entrevista es exactamente lo que se ' +
            'espera de un perfil mid.',
          codigo:
'[10, 9, 100].sort();                  // [10, 100, 9]   ← comparación textual\n' +
'[10, 9, 100].sort((a, b) => a - b);   // [9, 10, 100]\n' +
'\n' +
'const original = [3, 1, 2];\n' +
'original.sort((a, b) => a - b);       // original ES AHORA [1, 2, 3]\n' +
'\n' +
'const copia = original.slice().sort((a, b) => a - b);   // original intacto'
        },
        {
          titulo: 'Casos límite: la parte que se evalúa y casi nadie escribe primero',
          texto:
            'Antes del bucle hay cuatro preguntas que un entrevistador espera oír:\n' +
            '**¿Y si el array está vacío?** No hay ninguna petición: `0`.\n' +
            '**¿Y si no es un array?** Devolver `0` en lugar de reventar: la función se llama desde un ' +
            'proceso por lotes que no debería caerse por un dato malo.\n' +
            '**¿Y si `ventanaMs` es cero o negativo?** Una ventana sin duración no contiene nada: `0`. ' +
            'Ojo con escribir `if (ventanaMs <= 0)` sin más, porque un `undefined` no cumple ninguna ' +
            'comparación; `if (!(ventanaMs > 0))` cubre también ese caso.\n' +
            '**¿Y si solo hay una marca?** El resultado es `1`, y el algoritmo debe darlo sin ningún ' +
            'tratamiento especial. Si necesitas un `if` para ese caso, el bucle está mal planteado.',
          codigo:
'picoDePeticiones([], 1000);              // 0   sin peticiones\n' +
'picoDePeticiones(null, 1000);            // 0   entrada no válida\n' +
'picoDePeticiones([5], 1000);             // 1   sin caso especial\n' +
'picoDePeticiones([1, 2, 3], 0);          // 0   ventana sin duración\n' +
'picoDePeticiones([1, 2, 3], undefined);  // 0   !(undefined > 0) es true'
        }
      ],

      referencia: [
        { nombre: 'array.slice()', texto: 'Copia superficial del array. Es la forma corta de no mutar lo que te han pasado.' },
        { nombre: 'array.sort(cmp)', texto: 'Ordena **en el sitio** y devuelve el mismo array. Con números, el comparador `(a, b) => a - b` no es opcional.' },
        { nombre: 'Array.isArray(v)', texto: 'La comprobación fiable de "esto es un array". `typeof []` devuelve `"object"`, que no sirve de nada.' },
        { nombre: 'while dentro de for', texto: 'No implica O(n²). Lo determina cuántas veces avanza el índice interno **en total**, no por vuelta.' },
        { nombre: 'Math.max(a, b)', texto: 'Alternativa legible a un `if` para quedarse con el mayor de dos valores.' },
        { nombre: 'O(n log n)', texto: 'Coste de ordenar. Domina al O(n) del recorrido, así que es el coste total de la función.' }
      ],

      ejemplo: {
        titulo: 'Problema ANÁLOGO resuelto: suma máxima de k elementos consecutivos',
        codigo:
'/**\n' +
' * Suma más alta que se puede obtener con k elementos consecutivos.\n' +
' * Es el mismo patrón, con la ventana de tamaño FIJO en vez de por tiempo.\n' +
' */\n' +
'function sumaMaximaDeK(numeros, k) {\n' +
'  if (!Array.isArray(numeros) || numeros.length < k || k <= 0) return 0;\n' +
'\n' +
'  // 1. Se calcula la primera ventana entera, una sola vez.\n' +
'  let suma = 0;\n' +
'  for (let i = 0; i < k; i++) suma += numeros[i];\n' +
'\n' +
'  let mejor = suma;\n' +
'\n' +
'  // 2. Cada paso ENTRA uno por la derecha y SALE uno por la izquierda.\n' +
'  //    No se vuelve a sumar la ventana: se ajusta. Ahí está el O(n).\n' +
'  for (let fin = k; fin < numeros.length; fin++) {\n' +
'    suma += numeros[fin] - numeros[fin - k];\n' +
'    if (suma > mejor) mejor = suma;\n' +
'  }\n' +
'\n' +
'  return mejor;\n' +
'}\n' +
'\n' +
'sumaMaximaDeK([1, 9, 2, 8, 3], 2);   // 11  (9 + 2)\n' +
'sumaMaximaDeK([1, 9, 2, 8, 3], 3);   // 19  (9 + 2 + 8)',
        texto:
          'Fíjate en lo que **sí** se traslada a la prueba y en lo que **no**.\n' +
          'Se traslada la idea central: en lugar de recalcular la ventana entera en cada posición ' +
          '(O(n·k)), se ajusta lo que cambia en los extremos y el coste cae a O(n).\n' +
          'No se traslada la forma de la ventana. Aquí es de **tamaño fijo** —siempre `k` elementos— así ' +
          'que el inicio avanza exactamente una posición por vuelta y basta con un bucle. En la prueba la ' +
          'ventana es de **duración fija pero con un número variable de elementos**, así que el inicio ' +
          'tiene que avanzar "las que hagan falta": de ahí el `while` interno.\n' +
          'Si entiendes por qué ese `while` no rompe el O(n), tienes resuelta la parte difícil.'
      },

      glosario: [
        { termino: 'Ventana deslizante', definicion: 'Tramo contiguo de una secuencia delimitado por dos índices que solo avanzan.' },
        { termino: 'Dos punteros', definicion: 'Técnica de recorrer una secuencia con dos índices que se mueven en la misma dirección sin retroceder.' },
        { termino: 'Intervalo semiabierto', definicion: 'Rango que incluye el extremo inicial y excluye el final: `[a, b)`.' },
        { termino: 'Coste amortizado', definicion: 'Coste medio por operación a lo largo de toda la ejecución. Es lo que hace que `2n` pasos sean O(n).' },
        { termino: 'Mutación', definicion: 'Modificar un dato en el sitio en lugar de devolver una copia. Sobre un parámetro, es un efecto secundario que quien llama no espera.' },
        { termino: 'Rate limiting', definicion: 'Limitar cuántas peticiones acepta un sistema por unidad de tiempo. El caso de uso real de este algoritmo.' }
      ],

      preparado: [
        '¿Sabes decir por qué un `while` dentro de un `for` puede seguir siendo O(n)?',
        '¿Qué devuelve `[10, 9, 100].sort()` y por qué?',
        '¿Cuál es la diferencia, en una línea de código, entre ventana semiabierta y cerrada?',
        '¿Cómo ordenas sin modificar el array que te han pasado?',
        '¿Qué debe devolver la función con `ventanaMs` a `undefined`, y qué condición lo cubre?'
      ]
    },

    tests: {
      mode: 'js',
      timeout: 5000,
      cases: [
        { name: 'Un array vacío no tiene pico', code: 'expect(picoDePeticiones([], 1000)).toBe(0)' },
        { name: 'Una entrada no válida devuelve 0 en vez de romper', code: 'expect(picoDePeticiones(null, 1000)).toBe(0)' },
        { name: 'Una sola petición cuenta como pico de 1', code: 'expect(picoDePeticiones([42], 1000)).toBe(1)' },
        { name: 'Si todas caben en la ventana, el pico son todas', code: 'expect(picoDePeticiones([0, 100, 200, 300], 1000)).toBe(4)' },
        { name: 'La ventana es semiabierta: el extremo NO entra', code: 'expect(picoDePeticiones([0, 1000], 1000)).toBe(1)' },
        { name: 'Justo por debajo del extremo sí entra', code: 'expect(picoDePeticiones([0, 999], 1000)).toBe(2)' },
        { name: 'Encuentra el pico aunque esté en medio', code: 'expect(picoDePeticiones([0, 5000, 10000, 10010, 10020, 10030, 20000], 1000)).toBe(4)' },
        { name: 'Una ventana de duración cero no contiene nada', code: 'expect(picoDePeticiones([1, 2, 3], 0)).toBe(0)' },
        { name: 'Una ventana no definida devuelve 0, no NaN', code: 'expect(picoDePeticiones([1, 2, 3], undefined)).toBe(0)' },
        { name: 'Ordena la entrada desordenada', code: 'expect(picoDePeticiones([10030, 0, 10010, 20000, 10020, 10000, 5000], 1000)).toBe(4)' },
        { name: 'No muta el array que recibe', code: 'var entrada = [30, 10, 20]; picoDePeticiones(entrada, 5); expect(entrada).toEqual([30, 10, 20])' },
        {
          name: 'Es lineal: 60 000 marcas no agotan el tiempo',
          code:
            'var muchas = []; for (var i = 0; i < 60000; i++) muchas.push(i * 10);' +
            'expect(picoDePeticiones(muchas, 1000)).toBe(100)'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'/**\n' +
' * Máximo de peticiones contenidas en una ventana deslizante.\n' +
' *\n' +
' * Coste: O(n log n) por la ordenación, O(n) el recorrido.\n' +
' * Memoria: O(n) por la copia que evita mutar la entrada.\n' +
' */\n' +
'function picoDePeticiones(marcas, ventanaMs) {\n' +
'  // Casos límite primero: así el bucle de abajo no necesita ni un `if`.\n' +
'  if (!Array.isArray(marcas) || marcas.length === 0) return 0;\n' +
'  // !(x > 0) cubre también undefined y NaN, que x <= 0 dejaría pasar.\n' +
'  if (!(ventanaMs > 0)) return 0;\n' +
'\n' +
'  // slice() antes de sort(): sort ordena en el sitio y el array es de quien\n' +
'  // nos llama. El comparador numérico no es opcional: sin él se compara texto.\n' +
'  const orden = marcas.slice().sort(function (a, b) { return a - b; });\n' +
'\n' +
'  let inicio = 0;\n' +
'  let pico = 0;\n' +
'\n' +
'  for (let fin = 0; fin < orden.length; fin++) {\n' +
'    // La ventana es semiabierta [t, t + ventanaMs): con >= el extremo cae fuera.\n' +
'    // `inicio` nunca retrocede, así que entre los dos índices se recorre el\n' +
'    // array como mucho dos veces: 2n pasos, es decir, O(n).\n' +
'    while (orden[fin] - orden[inicio] >= ventanaMs) inicio++;\n' +
'\n' +
'    const enVentana = fin - inicio + 1;\n' +
'    if (enVentana > pico) pico = enVentana;\n' +
'  }\n' +
'\n' +
'  return pico;\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — Casos límite y contrato',
        objetivo:
          'Fijar qué devuelve la función cuando no hay nada que calcular, antes de pensar en el ' +
          'algoritmo. En una entrevista esto se dice en voz alta y se escribe primero: demuestra que ' +
          'piensas en la entrada antes que en el bucle.',
        codigo:
'/**\n' +
' * Máximo de peticiones contenidas en una ventana deslizante.\n' +
' * Fase 1: solo los casos límite.\n' +
' */\n' +
'function picoDePeticiones(marcas, ventanaMs) {\n' +
'  if (!Array.isArray(marcas) || marcas.length === 0) return 0;\n' +
'  if (!(ventanaMs > 0)) return 0;\n' +
'\n' +
'  return 0;   // todavía sin algoritmo\n' +
'}\n',
        explicacion:
          'Las dos guardas cubren los cuatro casos que un entrevistador pregunta siempre: array vacío, ' +
          'entrada no válida, ventana de duración cero y ventana no definida.\n' +
          'El detalle que marca la diferencia es `!(ventanaMs > 0)` en lugar de `ventanaMs <= 0`. Con ' +
          '`undefined`, la comparación `undefined <= 0` es `false` y el caso se colaría hasta el bucle, ' +
          'donde toda resta daría `NaN` y la función devolvería un número sin sentido. Negar la ' +
          'condición positiva cubre `undefined` y `NaN` de una sola vez.',
        anadido: [
          'Guardas para array vacío y entrada no válida.',
          'Guarda para `ventanaMs` no positiva, no definida o `NaN`.'
        ],
        comprueba: 'Ya deberían pasar los cuatro tests de casos límite y el de la ventana de duración cero.'
      },
      {
        titulo: 'Fase 2 — Fuerza bruta correcta',
        objetivo:
          'Conseguir el resultado correcto sin preocuparse aún del coste. Tener algo que funciona te da ' +
          'una referencia contra la que comparar la versión rápida, y en una entrevista te asegura no ' +
          'quedarte con la hoja en blanco.',
        codigo:
'/**\n' +
' * Máximo de peticiones contenidas en una ventana deslizante.\n' +
' * Fase 2: correcta pero O(n^2).\n' +
' */\n' +
'function picoDePeticiones(marcas, ventanaMs) {\n' +
'  if (!Array.isArray(marcas) || marcas.length === 0) return 0;\n' +
'  if (!(ventanaMs > 0)) return 0;\n' +
'\n' +
'  const orden = marcas.slice().sort(function (a, b) { return a - b; });\n' +
'\n' +
'  let pico = 0;\n' +
'\n' +
'  // Para cada marca, contar cuántas caen en SU ventana.\n' +
'  for (let i = 0; i < orden.length; i++) {\n' +
'    let enVentana = 0;\n' +
'    for (let j = i; j < orden.length; j++) {\n' +
'      if (orden[j] - orden[i] >= ventanaMs) break;\n' +
'      enVentana++;\n' +
'    }\n' +
'    if (enVentana > pico) pico = enVentana;\n' +
'  }\n' +
'\n' +
'  return pico;\n' +
'}\n',
        explicacion:
          'Aquí ya está toda la semántica resuelta: la copia ordenada con comparador numérico y la ' +
          'condición `>=` que hace la ventana semiabierta.\n' +
          'Lo único que sobra es el trabajo repetido. Al pasar de `i` a `i+1`, el bucle interno vuelve a ' +
          'recorrer casi exactamente las mismas marcas que acaba de recorrer. Esa repetición es lo que ' +
          'convierte el coste en O(n²) y lo que se elimina en la fase siguiente.\n' +
          'Con 60 000 marcas esto son unos 3 600 millones de comparaciones: el test de rendimiento ' +
          'agotará el tiempo.',
        anadido: [
          'Copia ordenada sin mutar la entrada.',
          'Condición semiabierta `>=`.',
          'Recuento por fuerza bruta con dos bucles anidados.'
        ],
        comprueba: 'Pasan todos los tests menos el último, el de las 60 000 marcas.'
      },
      {
        titulo: 'Fase 3 — Dos punteros: de O(n²) a O(n)',
        objetivo:
          'Eliminar el trabajo repetido aprovechando que, sobre una secuencia ordenada, el inicio de la ' +
          'ventana nunca necesita retroceder. Esta es la versión final.',
        codigo:
'/**\n' +
' * Máximo de peticiones contenidas en una ventana deslizante.\n' +
' *\n' +
' * Coste: O(n log n) por la ordenación, O(n) el recorrido.\n' +
' * Memoria: O(n) por la copia que evita mutar la entrada.\n' +
' */\n' +
'function picoDePeticiones(marcas, ventanaMs) {\n' +
'  // Casos límite primero: así el bucle de abajo no necesita ni un `if`.\n' +
'  if (!Array.isArray(marcas) || marcas.length === 0) return 0;\n' +
'  // !(x > 0) cubre también undefined y NaN, que x <= 0 dejaría pasar.\n' +
'  if (!(ventanaMs > 0)) return 0;\n' +
'\n' +
'  // slice() antes de sort(): sort ordena en el sitio y el array es de quien\n' +
'  // nos llama. El comparador numérico no es opcional: sin él se compara texto.\n' +
'  const orden = marcas.slice().sort(function (a, b) { return a - b; });\n' +
'\n' +
'  let inicio = 0;\n' +
'  let pico = 0;\n' +
'\n' +
'  for (let fin = 0; fin < orden.length; fin++) {\n' +
'    // La ventana es semiabierta [t, t + ventanaMs): con >= el extremo cae fuera.\n' +
'    // `inicio` nunca retrocede, así que entre los dos índices se recorre el\n' +
'    // array como mucho dos veces: 2n pasos, es decir, O(n).\n' +
'    while (orden[fin] - orden[inicio] >= ventanaMs) inicio++;\n' +
'\n' +
'    const enVentana = fin - inicio + 1;\n' +
'    if (enVentana > pico) pico = enVentana;\n' +
'  }\n' +
'\n' +
'  return pico;\n' +
'}\n',
        explicacion:
          'El bucle interno de la fase 2 desaparece y en su lugar queda un único índice `inicio` que se ' +
          'conserva entre vueltas. Esa es toda la diferencia.\n' +
          'La justificación de que sigue siendo lineal es la que hay que saber decir en voz alta: `fin` ' +
          'avanza `n` veces y `inicio` avanza como mucho `n` veces **en total** a lo largo de toda la ' +
          'función, no por vuelta. El `while` no multiplica el coste porque cada elemento entra y sale de ' +
          'la ventana una sola vez.\n' +
          'El número de peticiones dentro de la ventana ya no hace falta contarlo: es la distancia entre ' +
          'los dos índices, `fin - inicio + 1`.',
        anadido: [
          'Un único puntero `inicio` que se conserva entre iteraciones.',
          'El recuento pasa de contar elementos a restar índices.',
          'Coste lineal en el recorrido.'
        ],
        comprueba: 'Pasan los doce tests, incluido el de las 60 000 marcas.'
      }
    ],

    rationale:
      'Se elige la ventana deslizante con dos punteros porque la entrada, una vez ordenada, tiene la ' +
      'propiedad que hace válida la técnica: el límite inferior de la ventana es **monótono**, nunca ' +
      'retrocede. Cuando esa propiedad existe, dos punteros es la solución de referencia; cuando no ' +
      'existe, lo correcto suele ser un montículo o un árbol de intervalos.\n' +
      'Ordenar antes cuesta O(n log n) y domina al recorrido, así que el coste total es O(n log n). ' +
      'Merece la pena decirlo así de completo: un candidato que responde solo "O(n)" está describiendo ' +
      'media función.',

    alternatives: [
      { name: 'Fuerza bruta O(n²)', when: 'Entradas pequeñas o como paso intermedio para fijar la semántica.', tradeoff: 'Trivial de escribir y de verificar, pero inviable con millones de marcas.' },
      { name: 'Cola de dos extremos', when: 'La ventana llega en flujo y hay que ir descartando por el frente.', tradeoff: 'Mismo coste lineal, y funciona sin tener todas las marcas en memoria; a cambio, más estado que mantener.' },
      { name: 'Recuento por cubos', when: 'Las marcas caben en un rango pequeño y conocido, y la ventana es un múltiplo del cubo.', tradeoff: 'Se acerca a O(n) sin ordenar, pero pierde precisión en los bordes y gasta memoria proporcional al rango.' },
      { name: 'Delegar en la base de datos', when: 'Las marcas ya están almacenadas y hay índice por tiempo.', tradeoff: 'Una función ventana de SQL resuelve esto sin traer los datos a la aplicación; a cambio, el cálculo deja de ser reutilizable fuera de la consulta.' }
    ],

    commonErrors: [
      {
        error: 'Usar `>` en vez de `>=` al expulsar marcas de la ventana.',
        why: 'Convierte el intervalo en cerrado `[t, t+v]` y cuenta una petición de más justo en el borde. Es el fallo que más veces pasa desapercibido, porque solo falla en un caso de cada diez.',
        fix: 'Fijar la convención **antes** de escribir código, preguntándola si hace falta, y usar `>=` para el intervalo semiabierto.'
      },
      {
        error: 'Llamar a `marcas.sort()` directamente sobre el parámetro.',
        why: 'Dos problemas a la vez: se muta un array que pertenece a quien llama, y sin comparador se ordena como texto, así que `[10, 9, 100]` queda `[10, 100, 9]`.',
        fix: '`marcas.slice().sort(function (a, b) { return a - b; })`.'
      },
      {
        error: 'Reiniciar `inicio` a 0 en cada vuelta del bucle exterior.',
        why: 'Es la fuerza bruta disfrazada de ventana deslizante: el código *parece* lineal pero vuelve a ser O(n²), y el test de rendimiento lo destapa.',
        fix: 'Declarar `inicio` **fuera** del bucle y no reiniciarlo nunca.'
      },
      {
        error: 'Escribir `if (ventanaMs <= 0) return 0;`.',
        why: 'Deja pasar `undefined` y `NaN`, porque ninguna comparación con ellos es cierta. A partir de ahí todas las restas dan `NaN` y la función devuelve un resultado inventado.',
        fix: '`if (!(ventanaMs > 0)) return 0;`, que niega la condición positiva y cubre los tres casos.'
      },
      {
        error: 'Responder "es O(n)" sin mencionar la ordenación.',
        why: 'El recorrido es O(n), pero la función completa es O(n log n). En una ronda de algoritmos el análisis de complejidad puntúa aparte de que el código funcione.',
        fix: 'Dar el coste de la función entera y señalar cuál es el término dominante.'
      },
      {
        error: 'Contar los elementos de la ventana con un bucle interno.',
        why: 'Reintroduce el coste cuadrático que la técnica venía a eliminar.',
        fix: 'El recuento es aritmética de índices: `fin - inicio + 1`.'
      }
    ],

    bestPractices: [
      'Preguntar por la convención del intervalo antes de escribir la primera línea.',
      'Escribir los casos límite primero: dejan el bucle principal libre de condicionales.',
      'No mutar nunca los parámetros; si hay que ordenar, se ordena una copia.',
      'Enunciar el coste de la función completa, no solo el de la parte que acabas de optimizar.',
      'Empezar por la fuerza bruta si te desbloquea, y decir en voz alta que sabes que la vas a mejorar.',
      'Nombrar las variables por lo que significan (`inicio`, `fin`, `pico`) y no por su letra.'
    ],

    security: [
      'Con una entrada controlada por el usuario, ordenar un array de millones de elementos es un vector de agotamiento de CPU: conviene limitar el tamaño aceptado antes de procesarlo.'
    ],

    performance: [
      'La ordenación domina el coste. Si el origen ya garantiza orden, saltársela baja el total a O(n) y merece un comentario que lo justifique.',
      'La copia con `slice()` duplica la memoria. Con volúmenes enormes puede compensar procesar por lotes o recibir el array ya ordenado por contrato.',
      'Un array de números que el motor mantiene como enteros contiguos es mucho más rápido de recorrer: evitar mezclar `undefined` o cadenas dentro de `marcas`.'
    ],

    companyLooksFor: [
      'Que preguntes por la semántica del intervalo en lugar de asumirla.',
      'Que llegues a la solución lineal y sepas **justificar** por qué el `while` interno no la rompe.',
      'Que trates los casos límite por iniciativa propia, no cuando falla un test.',
      'Que des el coste completo, incluida la ordenación.',
      'Que narres el razonamiento: en procesos como el de Google decide un comité que solo lee las notas del entrevistador.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Resultado correcto, incluido el borde semiabierto', weight: 30 },
        { criteria: 'Complejidad lineal en el recorrido', weight: 25 },
        { criteria: 'Casos límite tratados antes del bucle', weight: 15 },
        { criteria: 'No mutar la entrada y ordenar con comparador', weight: 15 },
        { criteria: 'Análisis de complejidad enunciado correctamente', weight: 15 }
      ]
    },

    reinforce: [
      'Resolver dos problemas más de ventana deslizante con ventana variable, para que el patrón deje de parecer un truco.',
      'Estudiar el algoritmo de ventana deslizante que usan los limitadores de peticiones reales, y en qué se diferencia del de cubo con fichas.',
      'Repasar el laboratorio de algoritmos para ver el recorrido paso a paso de los dos punteros.',
      'Practicar decir el coste en voz alta mientras escribes: es una habilidad distinta de saber calcularlo.'
    ]
  });

  /* ------------------------------------------------------------------
     2. Consulta SQL — ronda de datos
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'sql-informe-actividad',
    empresa: {
      empresas: ['revolut', 'amazon', 'travelperk'],
      evidencia: 'inspirada',
      puesto: 'Backend / Data Engineer',
      rol: 'data',
      formato: 'sql',
      dificultad: 3,
      evalua: [
        'Entender qué va a hacer el motor con tu consulta, no solo que devuelva las filas correctas.',
        'Agregación correcta con fechas y zonas horarias, que es donde se rompen casi todos los informes.',
        'Índices: saber cuál hace falta y por qué el que hay no sirve.'
      ],
      nota:
        'Ninguna de las tres empresas publica sus enunciados de SQL. El formato de ronda de datos y su ' +
        'peso está descrito en testimonios públicos y, en el caso de Amazon, en su propia página de ' +
        'proceso, que menciona pruebas específicas por puesto. El esquema y el enunciado son nuestros.',
      fuentes: [
        { titulo: 'Interviewing at Amazon — amazon.jobs', url: 'https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon' },
        { titulo: 'How do we hire engineers @ TravelPerk?', url: 'https://medium.com/@alexander.ludwick/how-do-we-hire-engineers-travelperk-afabbf82aedc' },
        { titulo: 'Companies that don’t have a broken hiring process', url: 'https://github.com/poteto/hiring-without-whiteboards' }
      ]
    },
    categorias: ['performance', 'backend'],
    title: 'Informe de actividad: la consulta que tarda ocho minutos',
    category: 'databases',
    kind: 'optimize',
    level: 'mid',
    time: 45,
    tags: ['SQL', 'agregación', 'índices', 'plan de ejecución', 'fechas'],

    context:
      'Ronda de datos de 45 minutos con un editor SQL compartido. No hay ejecución: escribes la consulta ' +
      'y la defiendes. El entrevistador te avisa de que le interesa más **por qué** eliges cada cosa que ' +
      'que la sintaxis compile a la primera.',

    situation:
      'El equipo de producto necesita un informe mensual: cuántos usuarios distintos hicieron al menos ' +
      'una operación cada mes del último año, y cuánto movieron en total.\n' +
      'La consulta que hay escrita ahora tarda **ocho minutos** y bloquea el panel de control. La tabla ' +
      '`operaciones` tiene 400 millones de filas y crece cinco millones al día.\n\n' +
      '```sql\n' +
      'CREATE TABLE usuarios (\n' +
      '  id            BIGINT PRIMARY KEY,\n' +
      '  pais          CHAR(2)     NOT NULL,\n' +
      '  creado_en     TIMESTAMPTZ NOT NULL\n' +
      ');\n\n' +
      'CREATE TABLE operaciones (\n' +
      '  id            BIGINT PRIMARY KEY,\n' +
      '  usuario_id    BIGINT      NOT NULL REFERENCES usuarios(id),\n' +
      '  importe_cent  BIGINT      NOT NULL,   -- céntimos, nunca coma flotante\n' +
      '  moneda        CHAR(3)     NOT NULL,\n' +
      '  estado        TEXT        NOT NULL,   -- pendiente | confirmada | anulada\n' +
      '  creada_en     TIMESTAMPTZ NOT NULL\n' +
      ');\n\n' +
      'CREATE INDEX idx_op_usuario ON operaciones (usuario_id);\n' +
      '```\n\n' +
      'Y la consulta actual:\n\n' +
      '```sql\n' +
      'SELECT DATE_TRUNC(\'month\', o.creada_en) AS mes,\n' +
      '       COUNT(*)          AS usuarios,\n' +
      '       SUM(o.importe_cent) AS total\n' +
      '  FROM operaciones o, usuarios u\n' +
      ' WHERE o.usuario_id = u.id\n' +
      '   AND EXTRACT(YEAR FROM o.creada_en) = 2026\n' +
      ' GROUP BY 1\n' +
      ' ORDER BY 1;\n' +
      '```',

    goal:
      'Reescribir la consulta para que sea **correcta** y **rápida**, y justificar qué índice hace falta ' +
      'y por qué el que existe no se está usando.',

    tech: ['SQL', 'PostgreSQL', 'Índices'],
    skills: ['agregación', 'DISTINCT frente a COUNT', 'sargabilidad', 'índices compuestos', 'zonas horarias'],

    starter: {
      lang: 'sql',
      code:
'-- Corrige los errores de resultado y después los de rendimiento.\n' +
'-- Escribe debajo tu versión y, en comentarios, el índice que crearías.\n' +
'\n' +
'SELECT DATE_TRUNC(\'month\', o.creada_en) AS mes,\n' +
'       COUNT(*)            AS usuarios,\n' +
'       SUM(o.importe_cent) AS total\n' +
'  FROM operaciones o, usuarios u\n' +
' WHERE o.usuario_id = u.id\n' +
'   AND EXTRACT(YEAR FROM o.creada_en) = 2026\n' +
' GROUP BY 1\n' +
' ORDER BY 1;\n' +
'\n' +
'-- Tu consulta:\n' +
'\n' +
'\n' +
'-- Índice o índices que crearías, y por qué:\n' +
'\n'
    },

    requirements: [
      '`usuarios` debe contar **usuarios distintos**, no filas: hoy cuenta operaciones.',
      'Excluir las operaciones que no cuentan como actividad real (`anulada`, y decidir razonadamente qué hacer con `pendiente`).',
      'El filtro de fecha debe ser **sargable**: un rango sobre la columna, no una función aplicada sobre ella.',
      'Eliminar el `JOIN` con `usuarios` si no aporta nada al resultado.',
      'Proponer el índice que permite resolver la consulta y explicar por qué `idx_op_usuario` no sirve aquí.',
      'Dejar claro en qué zona horaria se agrupa por mes y por qué importa.'
    ],

    optional: [
      'Añadir el desglose por país sin volver a recorrer la tabla grande.',
      'Proponer una vista materializada o una tabla de agregados y decir cuándo compensa.',
      'Explicar qué cambiaría si hubiera varias monedas mezcladas en `importe_cent`.'
    ],

    hints: [
      'Empieza por la corrección, no por la velocidad: la consulta actual devuelve un número que no es el que piden. Optimizar una consulta incorrecta es tiempo perdido.',
      '`COUNT(*)` cuenta filas. Si un usuario hizo 300 operaciones en enero, ¿cuántas veces lo estás contando?',
      'Una función aplicada sobre la columna del `WHERE` impide usar el índice sobre esa columna. ¿Cómo se expresa "el año 2026" sin tocar `creada_en`?',
      'Mira si `usuarios` aporta alguna columna al `SELECT`, al `WHERE` o al `GROUP BY`. Si no aporta ninguna, el `JOIN` solo puede quitar filas… o duplicarlas.',
      'El índice que hay empieza por `usuario_id`. La consulta filtra por fecha. Un índice compuesto solo sirve si su primera columna es la que filtras.'
    ],

    docs: {
      resumen:
        'Tres ideas resuelven esta prueba: **contar lo que te piden** (usuarios distintos, no filas), ' +
        '**escribir filtros que el índice pueda aprovechar** y **saber qué índice hace falta**. La ' +
        'sintaxis es lo de menos; lo que se evalúa es si sabes qué va a hacer el motor con tu consulta.',

      conceptos: [
        {
          titulo: 'Sargabilidad: por qué una función en el WHERE anula el índice',
          texto:
            '"Sargable" viene de *Search ARGument ABLE*: una condición es sargable si el motor puede ' +
            'usar un índice para resolverla.\n' +
            'Un índice sobre `creada_en` guarda los valores de `creada_en` ordenados. Si escribes ' +
            '`EXTRACT(YEAR FROM creada_en) = 2026`, el motor **no tiene un índice de años**: tiene uno de ' +
            'marcas de tiempo. Para saber el año de cada fila tiene que calcularlo, y para calcularlo ' +
            'tiene que leer todas las filas. Resultado: recorrido secuencial de 400 millones de filas.\n' +
            'La misma condición expresada como **rango sobre la columna desnuda** sí es sargable: el ' +
            'motor baja por el índice hasta el 1 de enero y lee hacia delante hasta el 1 de enero ' +
            'siguiente. Lee solo el trozo que necesita.\n' +
            'La regla práctica: **la columna indexada tiene que aparecer sola a un lado de la ' +
            'comparación**. Nada de funciones, nada de aritmética, nada de conversiones de tipo sobre ella.',
          codigo:
'-- NO sargable: la función obliga a leer y calcular fila por fila\n' +
'WHERE EXTRACT(YEAR FROM creada_en) = 2026\n' +
'WHERE DATE(creada_en) = \'2026-03-01\'\n' +
'WHERE creada_en::date >= \'2026-01-01\'\n' +
'\n' +
'-- Sargable: rango sobre la columna desnuda, medio abierto por la derecha\n' +
'WHERE creada_en >= TIMESTAMPTZ \'2026-01-01 00:00+00\'\n' +
'  AND creada_en <  TIMESTAMPTZ \'2027-01-01 00:00+00\'\n' +
'\n' +
'-- El < final, en vez de <=, evita discutir sobre milisegundos del 31 de diciembre.'
        },
        {
          titulo: 'COUNT(*), COUNT(columna) y COUNT(DISTINCT columna)',
          texto:
            'Las tres formas cuentan cosas distintas y confundirlas es el error de resultado más ' +
            'frecuente en informes:\n' +
            '`COUNT(*)` cuenta **filas del grupo**. Si un usuario hizo 300 operaciones en marzo, aporta 300.\n' +
            '`COUNT(columna)` cuenta filas **con esa columna no nula**. Se usa para contar "cuántas de ' +
            'estas tienen valor".\n' +
            '`COUNT(DISTINCT columna)` cuenta **valores diferentes**. Es lo que significa "usuarios ' +
            'activos": el mismo usuario, cuente lo que cuente, suma uno.\n' +
            'Y una advertencia de coste: `COUNT(DISTINCT ...)` obliga al motor a mantener todos los ' +
            'valores distintos del grupo, así que es notablemente más caro que un `COUNT(*)`. Es el ' +
            'precio de la respuesta correcta, y conviene decirlo en la entrevista para que quede claro ' +
            'que lo sabes.',
          codigo:
'-- El mismo mes, tres respuestas distintas:\n' +
'SELECT COUNT(*),                     -- 300  operaciones\n' +
'       COUNT(usuario_id),            -- 300  (la columna es NOT NULL)\n' +
'       COUNT(DISTINCT usuario_id)    --   1  usuario activo   <- lo que piden\n' +
'  FROM operaciones\n' +
' WHERE creada_en >= \'2026-03-01\' AND creada_en < \'2026-04-01\';'
        },
        {
          titulo: 'Índices compuestos: el orden de las columnas no es decorativo',
          texto:
            'Un índice compuesto `(a, b)` está ordenado primero por `a` y, dentro de cada valor de `a`, ' +
            'por `b`. Es exactamente una guía telefónica ordenada por apellido y luego por nombre.\n' +
            'Con esa guía puedes buscar rápido "todos los García". No puedes buscar rápido "todos los ' +
            'que se llaman Ana", porque las Anas están repartidas por todo el libro.\n' +
            'Por eso `idx_op_usuario (usuario_id)` no sirve para esta consulta: no filtramos por usuario, ' +
            'filtramos por fecha. El motor tendría que recorrer el índice entero, y para eso ya le sale ' +
            'más barato recorrer la tabla.\n' +
            'El índice que hace falta empieza por la columna del filtro: `(creada_en, usuario_id)`. Y si ' +
            'además se añaden las columnas que la consulta necesita, el motor puede responder **sin tocar ' +
            'la tabla**: es lo que se llama un índice de cobertura.',
          codigo:
'-- No sirve: la primera columna no es por la que filtramos\n' +
'CREATE INDEX idx_op_usuario ON operaciones (usuario_id);\n' +
'\n' +
'-- Sirve: primero la columna del rango\n' +
'CREATE INDEX idx_op_fecha_usuario ON operaciones (creada_en, usuario_id);\n' +
'\n' +
'-- Mejor: índice PARCIAL, solo sobre las filas que el informe mira.\n' +
'-- Ocupa mucho menos y descarta las anuladas antes de empezar.\n' +
'CREATE INDEX idx_op_confirmadas\n' +
'    ON operaciones (creada_en, usuario_id, importe_cent)\n' +
' WHERE estado = \'confirmada\';'
        },
        {
          titulo: 'JOIN que no aporta: ni columnas, ni filtro, ni garantía',
          texto:
            'La consulta original une con `usuarios` y no usa ni una sola columna de esa tabla. Un ' +
            '`JOIN` así solo puede hacer tres cosas, y ninguna buena:\n' +
            '**Costar tiempo**, porque hay que resolver la unión de todas formas.\n' +
            '**Quitar filas**, si alguna operación apuntara a un usuario borrado. Aquí no puede pasar ' +
            'porque hay clave foránea, pero en un esquema sin ella sí.\n' +
            '**Duplicar filas**, si la tabla del otro lado tuviera varias coincidencias. Contra una ' +
            'clave primaria no ocurre; contra cualquier otra cosa, sí, y entonces las sumas salen ' +
            'infladas sin que nada avise.\n' +
            'La regla: **si una tabla no aporta columnas ni filtra, fuera**. Y de paso, la sintaxis ' +
            '`FROM a, b WHERE a.x = b.y` es un `JOIN` implícito de hace treinta años; escribir ' +
            '`JOIN ... ON` deja la intención a la vista.',
          codigo:
'-- Une, no usa nada de usuarios, y encima con sintaxis antigua\n' +
'  FROM operaciones o, usuarios u\n' +
' WHERE o.usuario_id = u.id\n' +
'\n' +
'-- Si de verdad hiciera falta filtrar por algo de usuarios, así:\n' +
'  FROM operaciones o\n' +
'  JOIN usuarios u ON u.id = o.usuario_id\n' +
' WHERE u.pais = \'ES\'\n' +
'\n' +
'-- Y si solo hiciera falta comprobar que existe, sin traer columnas:\n' +
' WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = o.usuario_id)'
        },
        {
          titulo: 'Agrupar por mes con zonas horarias',
          texto:
            'La columna es `TIMESTAMPTZ`, es decir, un instante absoluto. "Marzo" no es un instante ' +
            'absoluto: depende de dónde estés.\n' +
            'Una operación hecha el 1 de marzo a las 00:30 en Madrid ocurrió el 28 de febrero a las 23:30 ' +
            'en UTC. Según la zona en la que agrupes, esa operación cae en un mes o en otro.\n' +
            '`DATE_TRUNC(\'month\', creada_en)` agrupa en la zona horaria de la sesión, que puede cambiar ' +
            'entre el panel y tu editor y dar dos informes distintos con la misma consulta. Hacerlo ' +
            'explícito con `AT TIME ZONE` elimina esa ambigüedad.\n' +
            'En una entrevista, mencionar esto por iniciativa propia es de las cosas que más diferencian: ' +
            'es un fallo silencioso, que nadie detecta hasta que alguien cuadra las cifras a mano.',
          codigo:
'-- Ambiguo: depende de la zona horaria de la sesión\n' +
'DATE_TRUNC(\'month\', creada_en)\n' +
'\n' +
'-- Explícito: siempre el mismo resultado, lo ejecute quien lo ejecute\n' +
'DATE_TRUNC(\'month\', creada_en AT TIME ZONE \'UTC\')\n' +
'\n' +
'-- Importante: esto va en el SELECT y el GROUP BY, NUNCA en el WHERE.\n' +
'-- En el WHERE rompería la sargabilidad que acabamos de conseguir.'
        }
      ],

      referencia: [
        { nombre: 'DATE_TRUNC(unidad, ts)', texto: 'Recorta una marca de tiempo al inicio de la unidad. `\'month\'` sobre el 17 de marzo devuelve el 1 de marzo.' },
        { nombre: 'ts AT TIME ZONE \'UTC\'', texto: 'Interpreta el instante en una zona concreta. Hace el resultado independiente de la sesión.' },
        { nombre: 'COUNT(DISTINCT c)', texto: 'Cuenta valores diferentes de `c` en el grupo. Es la respuesta a "cuántos usuarios activos".' },
        { nombre: 'FILTER (WHERE ...)', texto: 'Agregación condicional en Postgres: `COUNT(*) FILTER (WHERE estado = \'confirmada\')`. Más legible que un `CASE` dentro del `SUM`.' },
        { nombre: 'CREATE INDEX ... WHERE', texto: 'Índice parcial: solo indexa las filas que cumplen la condición. Mucho más pequeño y rápido.' },
        { nombre: 'EXPLAIN (ANALYZE, BUFFERS)', texto: 'Muestra el plan real y cuántos bloques se han leído. Es la única forma de afirmar algo sobre rendimiento sin adivinar.' },
        { nombre: 'Seq Scan / Index Scan', texto: 'En el plan: recorrido completo de la tabla frente a acceso por índice. Ver `Seq Scan` sobre 400 millones de filas es la señal de alarma.' }
      ],

      ejemplo: {
        titulo: 'Problema ANÁLOGO resuelto: sesiones únicas por semana en una tabla de eventos',
        codigo:
'-- Consulta lenta y además incorrecta:\n' +
'SELECT DATE(e.ocurrido_en) AS dia,\n' +
'       COUNT(*)            AS sesiones\n' +
'  FROM eventos e, dispositivos d\n' +
' WHERE e.dispositivo_id = d.id\n' +
'   AND YEAR(e.ocurrido_en) = 2026\n' +
' GROUP BY 1;\n' +
'\n' +
'-- Corregida: cuenta lo que toca, filtra por rango y no une de más.\n' +
'SELECT DATE_TRUNC(\'week\', e.ocurrido_en AT TIME ZONE \'UTC\') AS semana,\n' +
'       COUNT(DISTINCT e.sesion_id)                          AS sesiones\n' +
'  FROM eventos e\n' +
' WHERE e.ocurrido_en >= TIMESTAMPTZ \'2026-01-01 00:00+00\'\n' +
'   AND e.ocurrido_en <  TIMESTAMPTZ \'2027-01-01 00:00+00\'\n' +
'   AND e.tipo = \'inicio_sesion\'\n' +
' GROUP BY 1\n' +
' ORDER BY 1;\n' +
'\n' +
'CREATE INDEX idx_eventos_inicio\n' +
'    ON eventos (ocurrido_en, sesion_id)\n' +
' WHERE tipo = \'inicio_sesion\';',
        texto:
          'Es el mismo esqueleto de razonamiento, sobre otro dominio y con otra granularidad.\n' +
          'Los cuatro movimientos son idénticos: **contar valores distintos** en vez de filas, **cambiar ' +
          'la función del `WHERE` por un rango**, **quitar la tabla que no aporta nada** y **crear un ' +
          'índice parcial que empieza por la columna del rango**.\n' +
          'Lo que cambia es la unidad de agrupación (semana en vez de mes), la columna que se cuenta ' +
          '(`sesion_id` en vez de `usuario_id`) y el filtro de negocio (`tipo` en vez de `estado`). El ' +
          'ejercicio te pide aplicar el patrón, no copiar esta consulta.'
      },

      glosario: [
        { termino: 'Sargable', definicion: 'Condición que el motor puede resolver usando un índice. La rompe cualquier función aplicada sobre la columna indexada.' },
        { termino: 'Seq Scan', definicion: 'Recorrido secuencial: leer la tabla entera. Sobre cientos de millones de filas, casi siempre es el problema.' },
        { termino: 'Índice de cobertura', definicion: 'Índice que contiene todas las columnas que la consulta necesita, de modo que no hace falta leer la tabla.' },
        { termino: 'Índice parcial', definicion: 'Índice que solo incluye las filas que cumplen una condición. Menos tamaño y menos coste de mantenimiento.' },
        { termino: 'Cardinalidad', definicion: 'Cuántos valores distintos tiene una columna. Determina si un índice sobre ella es útil.' },
        { termino: 'Vista materializada', definicion: 'Resultado de una consulta almacenado en disco y refrescado cada cierto tiempo. Cambia frescura por velocidad.' },
        { termino: 'TIMESTAMPTZ', definicion: 'Marca de tiempo con zona horaria: representa un instante absoluto, no una hora local.' }
      ],

      preparado: [
        '¿Por qué `EXTRACT(YEAR FROM columna) = 2026` impide usar el índice sobre esa columna?',
        '¿Qué diferencia hay entre `COUNT(*)` y `COUNT(DISTINCT usuario_id)` en un grupo mensual?',
        '¿Por qué un índice sobre `(usuario_id)` no ayuda a una consulta que filtra por fecha?',
        '¿Qué puede provocar un `JOIN` con una tabla de la que no usas ninguna columna?',
        '¿En qué zona horaria agrupa `DATE_TRUNC` si no lo dices, y por qué es un problema?'
      ]
    },

    /* Sin ejecución de SQL en el navegador: se evalúa con rúbrica, que es
       exactamente como se corrige esta ronda en una empresa cuando no hay
       un entorno de base de datos delante. La autoevaluación honesta es
       parte del ejercicio. */
    tests: {
      mode: 'checklist',
      titulo: 'Autoevaluación de tu consulta',
      items: [
        { peso: 20, texto: 'Cuento **usuarios distintos** con `COUNT(DISTINCT usuario_id)`, no filas con `COUNT(*)`.' },
        { peso: 20, texto: 'El filtro de fecha es un **rango sobre la columna desnuda** (`>= ... AND < ...`), sin ninguna función sobre `creada_en`.' },
        { peso: 15, texto: 'Filtro por `estado` para excluir las anuladas, y he decidido de forma razonada qué hago con las pendientes.' },
        { peso: 15, texto: 'He **eliminado el `JOIN`** con `usuarios`, porque no aporta columnas ni filtro.' },
        { peso: 15, texto: 'Propongo un índice que **empieza por `creada_en`** y explico por qué `idx_op_usuario` no se puede usar aquí.' },
        { peso: 10, texto: 'Hago explícita la zona horaria al agrupar por mes, y la dejo **fuera** del `WHERE`.' },
        { peso: 5,  texto: 'Menciono `EXPLAIN (ANALYZE, BUFFERS)` como forma de comprobar la mejora en vez de darla por supuesta.' }
      ]
    },

    solution: {
      lang: 'sql',
      code:
'-- ============================================================\n' +
'-- Informe mensual de actividad — versión corregida\n' +
'-- ============================================================\n' +
'--\n' +
'-- Cuatro cambios, en este orden: primero los de RESULTADO,\n' +
'-- después los de RENDIMIENTO. Optimizar una consulta que\n' +
'-- devuelve el número equivocado no sirve de nada.\n' +
'--\n' +
'--   1. COUNT(*)          -> COUNT(DISTINCT usuario_id)\n' +
'--   2. EXTRACT(YEAR ...) -> rango sargable sobre creada_en\n' +
'--   3. JOIN con usuarios -> eliminado (no aporta nada)\n' +
'--   4. estado            -> se excluye lo que no es actividad real\n' +
'\n' +
'SELECT DATE_TRUNC(\'month\', o.creada_en AT TIME ZONE \'UTC\') AS mes,\n' +
'       COUNT(DISTINCT o.usuario_id)                        AS usuarios_activos,\n' +
'       SUM(o.importe_cent)                                 AS total_cent\n' +
'  FROM operaciones o\n' +
' WHERE o.creada_en >= TIMESTAMPTZ \'2026-01-01 00:00+00\'\n' +
'   AND o.creada_en <  TIMESTAMPTZ \'2027-01-01 00:00+00\'\n' +
'   AND o.estado = \'confirmada\'\n' +
' GROUP BY 1\n' +
' ORDER BY 1;\n' +
'\n' +
'-- ------------------------------------------------------------\n' +
'-- Índice\n' +
'-- ------------------------------------------------------------\n' +
'--\n' +
'-- idx_op_usuario (usuario_id) NO sirve: un índice compuesto solo\n' +
'-- se puede recorrer por rango si la PRIMERA columna es la que se\n' +
'-- filtra, y aquí filtramos por fecha. El motor tendría que leer el\n' +
'-- índice entero, y para eso le sale más barato leer la tabla.\n' +
'--\n' +
'-- Este índice sí sirve, y por tres motivos a la vez:\n' +
'--   · empieza por creada_en, que es la columna del rango;\n' +
'--   · es PARCIAL, así que solo indexa las filas que el informe mira;\n' +
'--   · incluye usuario_id e importe_cent, de modo que la consulta se\n' +
'--     puede resolver sin tocar la tabla (índice de cobertura).\n' +
'\n' +
'CREATE INDEX CONCURRENTLY idx_op_confirmadas_fecha\n' +
'    ON operaciones (creada_en, usuario_id, importe_cent)\n' +
' WHERE estado = \'confirmada\';\n' +
'\n' +
'-- CONCURRENTLY porque son 400 millones de filas en producción:\n' +
'-- sin él, CREATE INDEX bloquea las escrituras sobre la tabla.\n' +
'\n' +
'-- ------------------------------------------------------------\n' +
'-- Comprobación\n' +
'-- ------------------------------------------------------------\n' +
'-- EXPLAIN (ANALYZE, BUFFERS) sobre la consulta debe pasar de\n' +
'-- "Seq Scan on operaciones" a "Index Only Scan using\n' +
'-- idx_op_confirmadas_fecha". Si sigue apareciendo Seq Scan, el\n' +
'-- planificador ha estimado que va a leer demasiada tabla: hay que\n' +
'-- mirar las estadísticas (ANALYZE operaciones) antes de tocar nada más.\n'
    },

    walkthrough: [
      {
        what: 'Cambiar `COUNT(*)` por `COUNT(DISTINCT o.usuario_id)`.',
        why: 'Es un error de **resultado**, no de velocidad, y por eso va primero. La consulta actual no responde a "cuántos usuarios estuvieron activos": responde a "cuántas operaciones hubo". Un usuario con 300 operaciones en marzo aportaba 300 al recuento de marzo, de modo que el informe daba cifras de usuarios activos varias veces más altas que las reales.',
        how: 'Se cuenta el valor distinto de la columna que identifica al usuario. Conviene decir en la entrevista que `DISTINCT` es más caro —el motor mantiene el conjunto de valores vistos por grupo— y que se asume ese coste porque es la respuesta correcta.'
      },
      {
        what: 'Sustituir `EXTRACT(YEAR FROM o.creada_en) = 2026` por un rango sobre la columna.',
        why: 'Este es el cambio que se lleva la mayor parte de los ocho minutos. Con la función aplicada sobre la columna, el motor no puede usar ningún índice de `creada_en`: para conocer el año de una fila tiene que calcularlo, y para calcularlo tiene que leerla. Son 400 millones de lecturas garantizadas.',
        how: '`creada_en >= \'2026-01-01\' AND creada_en < \'2027-01-01\'`. Con la columna sola a un lado, el motor baja por el índice hasta el primer valor del rango y lee de forma contigua hasta el último. Se usa `<` en el extremo superior en lugar de `<=` sobre el 31 de diciembre para no depender de la precisión de los milisegundos.'
      },
      {
        what: 'Eliminar la unión con `usuarios`.',
        why: 'La consulta original une dos tablas y después no usa ni una sola columna de la segunda. Ese `JOIN` no puede mejorar el resultado: solo puede costar tiempo o, en un esquema sin clave foránea, alterar el recuento quitando o duplicando filas sin que nada lo advierta.',
        how: 'Se quita `usuarios` del `FROM` y su condición del `WHERE`. Si en el futuro hiciera falta filtrar por país, se añade con `JOIN ... ON` explícito, o con `EXISTS` si solo hay que comprobar que la fila existe.'
      },
      {
        what: 'Filtrar por `estado = \'confirmada\'`.',
        why: 'Sin este filtro se suman importes de operaciones anuladas, así que la columna de total es directamente falsa. Es una decisión de negocio, no técnica: conviene enunciarla en voz alta —"cuento como actividad solo las confirmadas; si quieres incluir las pendientes, es cambiar una línea"— porque enseña que distingues un supuesto de un hecho.',
        how: 'Una condición más en el `WHERE`. Además abre la puerta al índice parcial, que es lo que más reduce el tamaño del índice.'
      },
      {
        what: 'Hacer explícita la zona horaria al truncar por mes.',
        why: 'La columna es `TIMESTAMPTZ`, un instante absoluto. `DATE_TRUNC(\'month\', creada_en)` agrupa según la zona horaria de la sesión, así que el mismo informe puede dar cifras distintas ejecutado desde el panel o desde tu editor. Las operaciones de las primeras horas de cada mes cambian de grupo.',
        how: '`DATE_TRUNC(\'month\', o.creada_en AT TIME ZONE \'UTC\')`. Y una precaución importante: esto va en el `SELECT` y el `GROUP BY`, nunca en el `WHERE`, porque ahí volvería a romper la sargabilidad que se acaba de conseguir.'
      },
      {
        what: 'Crear un índice parcial de cobertura que empiece por `creada_en`.',
        why: '`idx_op_usuario (usuario_id)` no se puede aprovechar aquí: un índice se recorre por rango solo si la primera columna es la del filtro, y esta consulta no filtra por usuario. El índice nuevo hace tres cosas a la vez: permite el acceso por rango de fechas, excluye de entrada las filas que no son confirmadas y contiene todas las columnas que la consulta necesita.',
        how: '`CREATE INDEX CONCURRENTLY idx_op_confirmadas_fecha ON operaciones (creada_en, usuario_id, importe_cent) WHERE estado = \'confirmada\';`. `CONCURRENTLY` es obligatorio en una tabla de este tamaño en producción: sin él, la creación bloquea las escrituras durante todo el proceso.'
      },
      {
        what: 'Comprobar el resultado con `EXPLAIN (ANALYZE, BUFFERS)`.',
        why: 'Todo lo anterior es una hipótesis hasta que el plan de ejecución la confirma. Afirmar que una consulta es más rápida sin haber mirado el plan es exactamente lo que un entrevistador de datos está esperando pillarte haciendo.',
        how: 'Se ejecuta antes y después y se compara. El objetivo es ver `Index Only Scan` en lugar de `Seq Scan on operaciones`. Si sigue saliendo `Seq Scan`, el planificador estima que va a leer una fracción demasiado grande de la tabla: el siguiente paso es `ANALYZE operaciones` para actualizar las estadísticas, no seguir reescribiendo la consulta.'
      }
    ],

    rationale:
      'El orden de los cambios es la parte que se evalúa. Primero los que arreglan el **resultado** ' +
      '(`DISTINCT` y `estado`), porque una consulta rápida que devuelve el número equivocado es peor ' +
      'que una lenta que acierta: la lenta molesta, la rápida engaña. Después los de **rendimiento** ' +
      '(rango sargable, `JOIN` eliminado, índice). Y al final la **comprobación**, porque sin mirar el ' +
      'plan todo lo anterior son suposiciones.\n' +
      'Se elige un índice parcial y de cobertura, en lugar de uno simple sobre `creada_en`, porque en ' +
      'esta tabla las tres propiedades se pagan solas: el rango filtra, la condición parcial reduce el ' +
      'tamaño del índice y las columnas incluidas evitan volver a la tabla.',

    alternatives: [
      { name: 'Vista materializada refrescada cada noche', when: 'El informe se consulta muchas veces al día y un desfase de horas es aceptable.', tradeoff: 'Respuesta casi instantánea a cambio de datos no actualizados y de un proceso de refresco que hay que operar y vigilar.' },
      { name: 'Tabla de agregados incremental', when: 'El volumen sigue creciendo y hace falta consultar varios años.', tradeoff: 'Escala mucho mejor, pero introduce un camino de escritura nuevo que puede desincronizarse; hay que poder recalcularlo desde cero.' },
      { name: 'Índice simple sobre `(creada_en)`', when: 'No se pueden crear índices grandes o hay poco espacio en disco.', tradeoff: 'Habilita el acceso por rango, que es la mayor parte de la mejora, pero obliga a volver a la tabla por cada fila para leer usuario e importe.' },
      { name: '`COUNT(DISTINCT ...)` aproximado con HyperLogLog', when: 'Un panel donde un error del uno por ciento no cambia ninguna decisión.', tradeoff: 'Muchísimo más barato en memoria y tiempo; deja de valer en cuanto alguien use la cifra para algo contable.' },
      { name: 'Réplica de solo lectura para informes', when: 'Las consultas analíticas compiten con el tráfico de producción.', tradeoff: 'Aísla la carga sin tocar la consulta, a cambio de infraestructura adicional y de un pequeño retraso de replicación.' }
    ],

    commonErrors: [
      {
        error: 'Optimizar antes de corregir el resultado.',
        why: 'Es el error de criterio más grave de esta prueba. Si dedicas los 45 minutos a índices y no ves que `COUNT(*)` cuenta operaciones en vez de usuarios, entregas una consulta rápida que miente. Un entrevistador lo interpreta como que optimizas por reflejo, sin leer lo que te han pedido.',
        fix: 'Leer el enunciado y comprobar la semántica de cada columna del `SELECT` antes de mirar el plan.'
      },
      {
        error: 'Envolver la columna en una función para "simplificar" el filtro.',
        why: '`DATE(creada_en) BETWEEN ...` o `creada_en::date >= ...` se leen bien y anulan el índice igual que `EXTRACT`. La sargabilidad se pierde con cualquier operación sobre la columna, incluida una conversión de tipo.',
        fix: 'Dejar la columna sola a un lado de la comparación y poner las conversiones, si hacen falta, del lado del literal.'
      },
      {
        error: 'Crear el índice como `(usuario_id, creada_en)`.',
        why: 'Repite el problema del índice que ya existe: la primera columna no es la del rango, así que el motor no puede acotar la lectura por fecha.',
        fix: 'La columna por la que se filtra por rango va primero: `(creada_en, usuario_id, ...)`.'
      },
      {
        error: 'Crear el índice sin `CONCURRENTLY` en una tabla de 400 millones de filas.',
        why: '`CREATE INDEX` toma un bloqueo que impide las escrituras durante toda la construcción. En una tabla que recibe cinco millones de filas al día, eso es una incidencia de producción.',
        fix: '`CREATE INDEX CONCURRENTLY`, asumiendo que tarda más y que no puede ir dentro de una transacción.'
      },
      {
        error: 'Poner `AT TIME ZONE` también en el `WHERE`.',
        why: 'Deshace justo lo que se acaba de arreglar: vuelve a haber una función sobre la columna del filtro y el índice deja de usarse.',
        fix: 'La zona horaria solo en `SELECT` y `GROUP BY`. El `WHERE` compara la columna desnuda con literales que ya llevan su desplazamiento.'
      },
      {
        error: 'Ignorar el campo `estado`.',
        why: 'Se suman importes de operaciones anuladas y el total es falso. Además es una señal de que no has leído el esquema completo antes de escribir.',
        fix: 'Filtrar por los estados que cuentan y **decir en voz alta** qué supuesto estás tomando con los pendientes.'
      },
      {
        error: 'Afirmar que la consulta es más rápida sin haber mirado el plan.',
        why: 'En una ronda de datos, "creo que ahora usará el índice" y "he comprobado que usa el índice" son dos respuestas de nivel muy distinto.',
        fix: '`EXPLAIN (ANALYZE, BUFFERS)` antes y después, y comparar el nodo de acceso y los bloques leídos.'
      }
    ],

    bestPractices: [
      'Arreglar la corrección antes que el rendimiento, y decir en voz alta que ese es el orden.',
      'Enunciar los supuestos de negocio en lugar de tomarlos en silencio.',
      'Escribir los `JOIN` con `JOIN ... ON` y eliminar los que no aportan columnas ni filtro.',
      'Filtrar por rangos sobre la columna desnuda, siempre.',
      'Hacer explícita la zona horaria en cualquier agregación por fecha.',
      'Crear índices en producción con `CONCURRENTLY` y justificar el orden de sus columnas.',
      'Cerrar con la comprobación: qué mirarías en `EXPLAIN` para saber si has acertado.'
    ],

    security: [
      'Un informe que se filtra por parámetros de usuario debe usar consultas parametrizadas: concatenar el año recibido en la cadena SQL es inyección de libro.',
      'Los importes agregados por país o por usuario pueden ser información sensible: conviene comprobar que quien consulta el panel tiene permiso para ese ámbito, no solo para el panel.'
    ],

    performance: [
      'El índice parcial reduce mucho el tamaño frente a uno completo, porque solo indexa las confirmadas.',
      'Un índice de cobertura permite un `Index Only Scan`, que evita ir a la tabla por cada fila; para que funcione, el mapa de visibilidad debe estar al día (`VACUUM`).',
      'Cada índice nuevo penaliza las escrituras, y esta tabla recibe cinco millones de filas al día: hay que justificar el índice, no añadirlo por si acaso.',
      '`COUNT(DISTINCT ...)` es sensiblemente más caro que `COUNT(*)`; si el informe creciera mucho, es el primer candidato a resolverse con agregados precalculados.'
    ],

    companyLooksFor: [
      'Que distingas un error de resultado de uno de rendimiento y los ataques en ese orden.',
      'Que sepas explicar por qué una función en el `WHERE` anula el índice, no solo que "hay que evitarlo".',
      'Que razones el orden de las columnas del índice en vez de proponerlo de memoria.',
      'Que menciones la zona horaria sin que te pregunten: es la señal de que has hecho informes de verdad.',
      'Que cierres proponiendo cómo comprobarlo, en lugar de afirmar la mejora.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Corrección del resultado (DISTINCT y filtro de estado)', weight: 30 },
        { criteria: 'Filtro de fecha sargable', weight: 25 },
        { criteria: 'Índice propuesto y justificación del orden de columnas', weight: 25 },
        { criteria: 'Eliminación del JOIN innecesario', weight: 10 },
        { criteria: 'Zona horaria explícita y método de comprobación', weight: 10 }
      ]
    },

    reinforce: [
      'Leer un plan de `EXPLAIN (ANALYZE, BUFFERS)` real y localizar el nodo que más tiempo consume.',
      'Practicar el mismo informe con desglose por país, sin recorrer dos veces la tabla grande.',
      'Estudiar cuándo compensa una vista materializada frente a una tabla de agregados incremental.',
      'Repasar la prueba de N+1 del catálogo: es el mismo problema visto desde la aplicación en vez de desde la consulta.'
    ]
  });

})(window.TT);

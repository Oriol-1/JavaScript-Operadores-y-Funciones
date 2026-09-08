/* ============================================================
   Pruebas — Nivel Junior
   ------------------------------------------------------------
   Fundamentos guiados: una sola función pura, sin asincronía ni
   cierres complejos. El objetivo es afianzar los métodos de
   array y el manejo de datos que aparecen en cualquier criba
   técnica, con el mismo nivel de explicación que el resto del
   catálogo — nada de "esto es fácil, no hace falta explicarlo".
   ============================================================ */
(function (TT) {
  'use strict';

  /* ==================================================================
     1. Limpiar una lista de correos
     ================================================================== */
  TT.defineExercise({
    id: 'js-limpiar-correos',
    title: 'Limpia una lista de correos para una newsletter',
    category: 'javascript',
    categorias: ['frontend'],
    kind: 'build',
    level: 'junior',
    time: 30,
    tags: ['arrays', 'strings', 'expresiones regulares', 'duplicados'],

    context:
      'Una tienda online importa la lista de correos de sus clientes desde un fichero antiguo para darlos de ' +
      'alta en la newsletter. El fichero es un desastre: hay correos repetidos escritos con mayúsculas ' +
      'distintas, espacios de más, campos vacíos y alguna cadena que no es un correo en absoluto.',

    situation:
      'Si se suben tal cual, el sistema de correo envía dos veces el mismo boletín a la misma persona y ' +
      'rechaza el lote entero en cuanto encuentra una entrada no válida.',

    goal:
      'Implementar `limpiarCorreos(lista)`: una función que reciba el array tal cual viene del fichero y ' +
      'devuelva solo los correos válidos, normalizados y sin duplicados, conservando el orden de la primera ' +
      'aparición.',

    tech: ['JavaScript'],
    skills: ['métodos de array', 'expresiones regulares', 'normalización de datos', 'eliminación de duplicados'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * @param {string[]} lista  Puede contener espacios de más, mayúsculas\n' +
' *                          mezcladas, cadenas vacías, null/undefined\n' +
' *                          y valores que no son un correo válido.\n' +
' * @returns {string[]}      Correos válidos, en minúsculas, sin\n' +
' *                          espacios, sin duplicados y en el orden\n' +
' *                          de su primera aparición.\n' +
' */\n' +
'function limpiarCorreos(lista) {\n' +
'  // tu implementación\n' +
'}\n'
    },

    requirements: [
      'Quitar los espacios sobrantes de cada entrada (al principio y al final).',
      'Convertir cada correo a minúsculas.',
      'Descartar las entradas que no tengan formato de correo (algo antes de una @, algo después, y un punto en el dominio).',
      'Descartar `null`, `undefined` y cadenas vacías sin que la función se rompa.',
      'Eliminar duplicados: si el mismo correo aparece varias veces (con mayúsculas o espacios distintos), debe quedar una sola vez.',
      'Conservar el orden: el correo se sitúa donde apareció la primera vez que fue válido.'
    ],

    optional: [
      'Devolver también, en un segundo valor, cuántas entradas se descartaron por inválidas.',
      'Aceptar un segundo parámetro con un dominio obligatorio (por ejemplo, solo admitir @empresa.com).'
    ],

    hints: [
      'Divide el problema en dos pasos: primero normaliza cada entrada (trim + minúsculas), después decide si te la quedas.',
      'Antes de aplicar `trim()` o `toLowerCase()`, comprueba que la entrada es realmente una cadena de texto: `null.trim()` lanza un error.',
      'Un patrón simple para validar formato de correo es: algo, luego una @, luego algo, luego un punto, luego algo. No hace falta una expresión regular perfecta para cumplir el ejercicio.',
      'Para quitar duplicados sin perder el orden, recorre la lista y guarda en un `Set` lo que ya has visto; añade al resultado solo lo que sea nuevo.'
    ],

    tests: {
      mode: 'js',
      timeout: 4000,
      cases: [
        {
          name: 'Quita espacios y pasa a minúsculas',
          code: 'expect(limpiarCorreos(["  Ana@Tienda.com  "])).toEqual(["ana@tienda.com"])'
        },
        {
          name: 'Elimina duplicados aunque cambien mayúsculas y espacios',
          code: 'expect(limpiarCorreos(["ana@tienda.com", "ANA@TIENDA.COM", " ana@tienda.com "])).toEqual(["ana@tienda.com"])'
        },
        {
          name: 'Descarta entradas sin formato de correo',
          code: 'expect(limpiarCorreos(["no-es-un-correo", "otra vez mal", "luis@tienda.com"])).toEqual(["luis@tienda.com"])'
        },
        {
          name: 'Descarta null, undefined y cadenas vacías sin romperse',
          code: 'expect(limpiarCorreos([null, "", undefined, "eva@tienda.com"])).toEqual(["eva@tienda.com"])'
        },
        {
          name: 'Conserva el orden de la primera aparición',
          code: 'expect(limpiarCorreos(["b@x.com", "a@x.com", "b@x.com", "c@x.com"])).toEqual(["b@x.com", "a@x.com", "c@x.com"])'
        },
        {
          name: 'Una lista vacía devuelve una lista vacía',
          code: 'expect(limpiarCorreos([])).toEqual([])'
        },
        {
          name: 'Si todo es inválido, devuelve una lista vacía',
          code: 'expect(limpiarCorreos(["mal", null, "  ", "tampoco@"])).toEqual([])'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'const CORREO_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n' +
'\n' +
'function limpiarCorreos(lista) {\n' +
'  const vistos = new Set();\n' +
'  const resultado = [];\n' +
'\n' +
'  for (const entrada of lista) {\n' +
'    if (typeof entrada !== "string") continue;   // null, undefined, números...\n' +
'\n' +
'    const limpio = entrada.trim().toLowerCase();\n' +
'    if (!limpio) continue;                        // cadena vacía o solo espacios\n' +
'    if (!CORREO_RE.test(limpio)) continue;         // no tiene forma de correo\n' +
'    if (vistos.has(limpio)) continue;              // ya lo teníamos\n' +
'\n' +
'    vistos.add(limpio);\n' +
'    resultado.push(limpio);\n' +
'  }\n' +
'\n' +
'  return resultado;\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — Normalizar cada entrada sin romper con datos raros',
        objetivo:
          'Antes de decidir qué correos son válidos, hay que poder recorrer la lista sin que un `null` o un ' +
          'número hagan explotar la función.',
        anadido: [
          'Comprobación de que la entrada es una cadena de texto antes de tocarla.',
          '`trim()` y `toLowerCase()` para normalizar.',
          'Descarte de la cadena vacía resultante.'
        ],
        codigo:
'function limpiarCorreos(lista) {\n' +
'  const resultado = [];\n' +
'\n' +
'  for (const entrada of lista) {\n' +
'    if (typeof entrada !== "string") continue;   // null, undefined, números...\n' +
'\n' +
'    const limpio = entrada.trim().toLowerCase();\n' +
'    if (!limpio) continue;                        // cadena vacía o solo espacios\n' +
'\n' +
'    resultado.push(limpio);   // todavía sin validar formato ni duplicados\n' +
'  }\n' +
'\n' +
'  return resultado;\n' +
'}\n',
        explicacion:
          'La comprobación `typeof entrada !== "string"` va **antes** de llamar a `trim()`. Si el array trae ' +
          'un `null` (algo muy habitual en datos importados de un fichero) y llamas a `null.trim()`, ' +
          'JavaScript lanza `TypeError: Cannot read properties of null` y la función entera se detiene, ' +
          'aunque el resto de la lista fuera perfecta.\n' +
          '`continue` salta a la siguiente vuelta del bucle sin añadir nada al resultado: es la forma de ' +
          'decir "esta entrada no cuenta" sin necesidad de anidar un montón de `if`.\n' +
          'Fíjate en que después de `trim().toLowerCase()`, una cadena que solo tenía espacios (`"   "`) se ' +
          'queda en `""`, que es *falsy* en JavaScript: por eso `if (!limpio)` la descarta también.'
      },
      {
        titulo: 'Fase 2 — Descartar lo que no tiene forma de correo',
        objetivo:
          'De las entradas ya normalizadas, quedarse solo con las que parecen un correo real.',
        anadido: [
          'Una expresión regular `CORREO_RE` declarada fuera de la función.',
          'Comprobación `CORREO_RE.test(limpio)` antes de añadir al resultado.'
        ],
        codigo:
'const CORREO_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n' +
'\n' +
'function limpiarCorreos(lista) {\n' +
'  const resultado = [];\n' +
'\n' +
'  for (const entrada of lista) {\n' +
'    if (typeof entrada !== "string") continue;\n' +
'\n' +
'    const limpio = entrada.trim().toLowerCase();\n' +
'    if (!limpio) continue;\n' +
'    if (!CORREO_RE.test(limpio)) continue;   // no tiene forma de correo\n' +
'\n' +
'    resultado.push(limpio);   // todavía sin quitar duplicados\n' +
'  }\n' +
'\n' +
'  return resultado;\n' +
'}\n',
        explicacion:
          'La expresión regular se lee por partes: `^[^\\s@]+` es "uno o más caracteres que no sean espacio ' +
          'ni @, desde el principio"; `@` es la arroba literal; `[^\\s@]+` es lo mismo otra vez para el ' +
          'dominio; `\\.` es un punto literal (sin la barra invertida, el punto significaría "cualquier ' +
          'carácter"); y el último `[^\\s@]+$` exige que después del punto haya algo hasta el final de la ' +
          'cadena.\n' +
          'Se declara **fuera** de la función y no dentro del bucle. Si la crearas en cada vuelta con ' +
          '`new RegExp(...)`, estarías reconstruyendo el mismo patrón una y otra vez sin necesidad: una ' +
          'expresión regular literal como esta se puede reutilizar siempre.\n' +
          'No es una validación perfecta de correos (esas son notoriamente complicadas), pero cumple lo que ' +
          'pide el ejercicio: separar "algo con forma de correo" de "una cadena cualquiera".'
      },
      {
        titulo: 'Fase 3 — Eliminar duplicados conservando el orden',
        objetivo:
          'Que un correo repetido, aunque venga con mayúsculas o espacios distintos, aparezca una sola vez ' +
          'en el resultado, en la posición de su primera aparición.',
        anadido: [
          'Un `Set` llamado `vistos` para recordar qué correos ya se han añadido.',
          'Comprobación `vistos.has(limpio)` antes de aceptar la entrada.'
        ],
        codigo:
'const CORREO_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n' +
'\n' +
'function limpiarCorreos(lista) {\n' +
'  const vistos = new Set();\n' +
'  const resultado = [];\n' +
'\n' +
'  for (const entrada of lista) {\n' +
'    if (typeof entrada !== "string") continue;   // null, undefined, números...\n' +
'\n' +
'    const limpio = entrada.trim().toLowerCase();\n' +
'    if (!limpio) continue;                        // cadena vacía o solo espacios\n' +
'    if (!CORREO_RE.test(limpio)) continue;         // no tiene forma de correo\n' +
'    if (vistos.has(limpio)) continue;              // ya lo teníamos\n' +
'\n' +
'    vistos.add(limpio);\n' +
'    resultado.push(limpio);\n' +
'  }\n' +
'\n' +
'  return resultado;\n' +
'}\n',
        explicacion:
          'Un `Set` es una colección que no admite valores repetidos y en la que comprobar "¿esto ya está?" ' +
          'con `.has()` es prácticamente instantáneo, a diferencia de recorrer un array entero con `indexOf` ' +
          'cada vez.\n' +
          'El orden en que se comprueban las cuatro condiciones importa: primero se descarta lo que no es ' +
          'texto, después lo que queda vacío, después lo que no tiene forma de correo, y **solo al final** ' +
          'se comprueba si ya lo habíamos visto. Si comprobaras los duplicados antes que el formato, un ' +
          'correo inválido repetido podría colarse por casualidad en el `Set` y bloquear uno válido que ' +
          'normalizase igual (raro, pero es la razón de mantener el orden lógico).\n' +
          'Como se recorre la lista de principio a fin y solo se añade al resultado la primera vez que se ve ' +
          'cada correo, el orden de aparición se conserva sin esfuerzo extra: `push` siempre añade al final, ' +
          'así que el resultado refleja el orden en que fueron llegando las novedades.\n' +
          'Esta es la solución final.'
      }
    ],

    docs: {
      resumen:
        'El ejercicio combina tres cosas muy comunes: recorrer un array con datos sucios sin que la función ' +
        'se rompa, usar una expresión regular sencilla para validar un formato, y quitar duplicados con un ' +
        '`Set`. Ninguna por separado es difícil; la parte junior es hacerlas en el orden correcto.',

      conceptos: [
        {
          titulo: '¿Por qué comprobar el tipo antes de usar métodos de cadena?',
          texto:
            'En JavaScript, un array puede contener cualquier cosa: cadenas, números, `null`, `undefined`, ' +
            'objetos. Si llamas a `.trim()` sobre algo que no es una cadena, el resultado depende de qué sea:\n' +
            'sobre `null` o `undefined` **lanza un error** y detiene todo el programa.\n' +
            'sobre un número, JavaScript lo convierte automáticamente y puede que "funcione" de forma rara.\n' +
            'La forma segura es comprobar `typeof valor === "string"` **antes** de usar cualquier método de ' +
            'cadena. Es la primera línea de defensa contra datos que no controlas.',
          codigo:
'typeof "hola";       // "string"\n' +
'typeof 42;            // "number"\n' +
'typeof null;          // "object"   <- ¡ojo! null también es "object"\n' +
'typeof undefined;     // "undefined"\n' +
'\n' +
'null.trim();           // TypeError: Cannot read properties of null\n' +
'"  hola  ".trim();    // "hola"     -> esto sí funciona'
        },
        {
          titulo: 'trim() y toLowerCase(): normalizar antes de comparar',
          texto:
            '`trim()` quita los espacios en blanco del principio y del final de una cadena (no los de en ' +
            'medio). `toLowerCase()` convierte todas las letras a minúsculas.\n' +
            'Se aplican **siempre en el mismo orden y a todo por igual**, para que dos entradas que ' +
            '"deberían" ser el mismo correo (`"Ana@X.com"` y `"  ana@x.com  "`) acaben siendo literalmente la ' +
            'misma cadena después de normalizar. Sin esto, un `Set` los trataría como dos correos distintos, ' +
            'porque compara cadenas de forma exacta.',
          codigo:
'"  Ana@Tienda.COM  ".trim();\n' +
'// "Ana@Tienda.COM"      <- ya sin espacios, pero mayúsculas mezcladas\n' +
'\n' +
'"  Ana@Tienda.COM  ".trim().toLowerCase();\n' +
'// "ana@tienda.com"      <- ahora sí es comparable con otras entradas'
        },
        {
          titulo: 'Expresiones regulares: lo mínimo para validar un formato',
          texto:
            'Una expresión regular describe un patrón de texto. `regex.test(cadena)` devuelve `true` o ' +
            '`false` según si la cadena cumple el patrón.\n' +
            'Símbolos usados aquí:\n' +
            '`^` y `$` — principio y final de la cadena. Sin ellos, el patrón podría cumplirse con solo una ' +
            'parte de la cadena, dejando pasar cosas como `"algo @bien.com raro"`.\n' +
            '`[^\\s@]` — "cualquier carácter que no sea un espacio ni una arroba". La `^` **dentro** de los ' +
            'corchetes significa negación, distinto de la `^` de fuera.\n' +
            '`+` — "una o más veces" del elemento anterior.\n' +
            '`\\.` — un punto literal. Sin la barra invertida, un punto en una expresión regular significa ' +
            '"cualquier carácter", no un punto de verdad.',
          codigo:
'const CORREO_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n' +
'\n' +
'CORREO_RE.test("ana@tienda.com");   // true\n' +
'CORREO_RE.test("no-es-un-correo");  // false: falta la @\n' +
'CORREO_RE.test("ana@sinpunto");     // false: falta el punto\n' +
'CORREO_RE.test("@tienda.com");      // false: no hay nada antes de la @'
        },
        {
          titulo: 'Set: la forma correcta de quitar duplicados',
          texto:
            'Un `Set` es una colección que **nunca** admite valores repetidos: si intentas añadir un valor ' +
            'que ya tiene, simplemente no pasa nada.\n' +
            '`.add(valor)` añade un valor. `.has(valor)` comprueba si ya está, y es mucho más rápido que ' +
            'buscar en un array con `indexOf` cuando la lista es grande.\n' +
            'Aquí no se usa el `Set` como resultado final (el ejercicio pide un array), sino como una ' +
            '**memoria auxiliar**: se usa solo para preguntar "¿esto ya lo vi?" mientras se construye el ' +
            'array de resultado con `push`, que sí conserva el orden.',
          codigo:
'const vistos = new Set();\n' +
'\n' +
'vistos.has("ana@x.com");   // false, todavía no está\n' +
'vistos.add("ana@x.com");\n' +
'vistos.has("ana@x.com");   // true, ya está\n' +
'\n' +
'vistos.add("ana@x.com");   // no pasa nada, ya estaba\n' +
'vistos.size;                // 1, sigue habiendo solo uno'
        }
      ],

      referencia: [
        { nombre: 'typeof valor', texto: 'Devuelve el tipo como texto: "string", "number", "object", "undefined"... Ojo: `typeof null` es "object".' },
        { nombre: 'cadena.trim()', texto: 'Quita espacios del principio y del final. No modifica la cadena original, devuelve una nueva.' },
        { nombre: 'cadena.toLowerCase()', texto: 'Devuelve la cadena en minúsculas.' },
        { nombre: 'regex.test(cadena)', texto: 'Devuelve `true` o `false` según si la cadena cumple el patrón de la expresión regular.' },
        { nombre: 'new Set()', texto: 'Crea una colección sin duplicados. `.add(v)` añade, `.has(v)` comprueba, `.size` cuenta.' },
        { nombre: 'for (const x of lista)', texto: 'Recorre los elementos de un array uno a uno, en orden.' },
        { nombre: 'continue', texto: 'Salta a la siguiente vuelta del bucle sin ejecutar el resto del cuerpo.' },
        { nombre: 'array.push(valor)', texto: 'Añade un valor al final del array, en el sitio.' }
      ],

      ejemplo: {
        titulo: 'Limpiar una lista de nombres de usuario (mismo patrón, otro dato)',
        codigo:
'const USUARIO_RE = /^[a-z0-9_]{3,15}$/;   // solo minúsculas, dígitos y guion bajo\n' +
'\n' +
'/**\n' +
' * Limpia una lista de nombres de usuario: normaliza, valida el\n' +
' * formato y elimina duplicados conservando el orden.\n' +
' */\n' +
'function limpiarUsuarios(lista) {\n' +
'  const vistos = new Set();\n' +
'  const resultado = [];\n' +
'\n' +
'  for (const entrada of lista) {\n' +
'    if (typeof entrada !== "string") continue;\n' +
'\n' +
'    const limpio = entrada.trim().toLowerCase();\n' +
'    if (!limpio) continue;\n' +
'    if (!USUARIO_RE.test(limpio)) continue;\n' +
'    if (vistos.has(limpio)) continue;\n' +
'\n' +
'    vistos.add(limpio);\n' +
'    resultado.push(limpio);\n' +
'  }\n' +
'\n' +
'  return resultado;\n' +
'}\n' +
'\n' +
'limpiarUsuarios(["  Ana92  ", "ana92", "AB", null, "luis_2000", ""]);\n' +
'// ["ana92", "luis_2000"]\n' +
'//   "AB" se descarta: menos de 3 caracteres, no cumple la expresión regular',
        texto:
          'Es exactamente la misma estructura que necesitas para los correos, cambiando solo el patrón de la ' +
          'expresión regular y el nombre de la función. Fíjate en que el esqueleto —comprobar tipo, ' +
          'normalizar, validar formato, comprobar duplicado, añadir— no cambia.\n' +
          '`{3,15}` dentro de la expresión regular es otra forma de repetición: significa "entre 3 y 15 ' +
          'veces", en vez del `+` que usarás tú para el correo (que significa "una o más veces, sin límite ' +
          'superior").\n' +
          'Aplica este mismo orden de comprobaciones a tu ejercicio: tipo, normalización, formato de correo, ' +
          'duplicado.'
      },

      glosario: [
        { termino: 'Normalizar', definicion: 'Transformar datos con formatos distintos a una forma única y comparable (aquí: sin espacios y en minúsculas).' },
        { termino: 'Expresión regular (regex)', definicion: 'Patrón que describe una forma de texto. Sirve para validar formatos como correos, teléfonos o códigos.' },
        { termino: 'Set', definicion: 'Colección de JavaScript que no admite valores repetidos.' },
        { termino: 'Falsy', definicion: 'Valor que JavaScript trata como falso en una condición: `false`, `0`, `""`, `null`, `undefined`, `NaN`.' },
        { termino: 'continue', definicion: 'Instrucción que salta el resto del cuerpo del bucle y pasa a la siguiente vuelta.' },
        { termino: 'typeof', definicion: 'Operador que devuelve el tipo de un valor como una cadena de texto.' }
      ],

      preparado: [
        '¿Por qué hay que comprobar el tipo antes de llamar a `.trim()`?',
        '¿Qué le pasa a `"   "` (solo espacios) después de `trim().toLowerCase()`, y por qué se descarta?',
        '¿Sabrías explicar qué significa cada símbolo de `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/`?',
        '¿Por qué se usa un `Set` en vez de comprobar con `resultado.indexOf(limpio) !== -1`?',
        '¿En qué orden se aplican las cuatro comprobaciones (tipo, vacío, formato, duplicado), y por qué en ese orden?'
      ]
    },

    rationale:
      'La función se construye como una única pasada por la lista con comprobaciones en cascada, cada una ' +
      'con su propio `continue`. Es el patrón más legible para "filtrar y transformar a la vez" cuando las ' +
      'condiciones dependen unas de otras (no puedes comprobar si un correo es duplicado antes de haberlo ' +
      'normalizado). Usar un `Set` como memoria auxiliar evita el coste de buscar en el array de resultado en ' +
      'cada vuelta, y es la herramienta que cualquier código junior debería usar por defecto para "quitar ' +
      'duplicados".',

    alternatives: [
      { name: 'Encadenar filter/map/reduce', when: 'Se prefiere un estilo más declarativo.', tradeoff: 'Cada método recorre el array por separado, así que se hacen varias pasadas en vez de una. Con listas pequeñas no se nota nada; es útil saber que existe la alternativa.' },
      { name: 'new Set(lista) directamente', when: 'Los datos ya vienen limpios y sin formato que validar.', tradeoff: 'Mucho más corto (`[...new Set(lista.map(...))]`), pero no permite intercalar la validación de formato con la misma claridad.' },
      { name: 'Librería de validación de correos', when: 'El formato tiene que ser muy preciso (dominios reales, longitud máxima, etc.).', tradeoff: 'Una expresión regular simple nunca cubre el 100% de los casos válidos de correo; una librería lo hace mejor, a cambio de una dependencia.' }
    ],

    commonErrors: [
      { error: 'Llamar a `.trim()` sin comprobar el tipo antes.', why: 'Un `null` o `undefined` en la lista lanza un error y detiene la función entera, en vez de simplemente descartarse.', fix: '`typeof entrada !== "string"` como primera comprobación.' },
      { error: 'Comparar correos sin normalizar mayúsculas.', why: '"Ana@X.com" y "ana@x.com" acaban tratándose como dos correos distintos y ambos se envían.', fix: '`toLowerCase()` antes de comparar o guardar.' },
      { error: 'Usar `resultado.includes(limpio)` para detectar duplicados dentro de un bucle grande.', why: 'Recorre todo el array de resultado en cada vuelta: con miles de correos se vuelve lento.', fix: 'Un `Set` aparte, con `.has()` en tiempo prácticamente constante.' },
      { error: 'Olvidar `^` y `$` en la expresión regular.', why: 'Sin ellos, "algo antes de un correo válido algo después" también pasaría la validación, porque el patrón se busca en cualquier parte de la cadena.', fix: 'Anclar el patrón al principio y al final con `^` y `$`.' },
      { error: 'No conservar el orden de aparición.', why: 'Si se construye el resultado a partir de las claves de un objeto o de un Set convertido a array sin cuidado, el orden puede no coincidir con el original.', fix: 'Recorrer la lista en orden y usar `push` para añadir al resultado.' }
    ],

    bestPractices: [
      'Comprobar el tipo de los datos antes de operar sobre ellos, sobre todo si vienen de fuera (ficheros, formularios, APIs).',
      'Normalizar (trim + minúsculas) antes de comparar cualquier texto que represente el mismo dato.',
      'Usar `Set` para comprobaciones de pertenencia repetidas: es la herramienta correcta, no un array con `indexOf`.',
      'Anclar las expresiones regulares con `^` y `$` cuando se valida el formato completo de una cadena.'
    ],

    security: [
      'Nunca insertes el correo directamente en una consulta SQL o en HTML sin sanear: aunque aquí se valide el formato, sigue siendo texto que viene de fuera.',
      'Una lista de correos es un dato personal: si se procesa en el servidor, debe tratarse con las mismas precauciones que cualquier dato de usuario (no volcarla en logs sin necesidad).'
    ],

    performance: [
      'Usar un `Set` para los duplicados hace que la función sea rápida incluso con listas de miles de entradas; con `indexOf` sobre un array se volvería notablemente más lenta.',
      'La expresión regular se declara una sola vez fuera de la función, no dentro del bucle.'
    ],

    companyLooksFor: [
      'Que no des por hecho que los datos de entrada están limpios.',
      'Que sepas explicar qué hace cada parte de una expresión regular sencilla, no solo copiarla.',
      'Que elijas la estructura de datos correcta (`Set`) para el problema de "quitar duplicados".',
      'Que el código se lea de arriba abajo sin necesidad de saltar entre funciones.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Normalización correcta (trim + minúsculas)', weight: 20 },
        { criteria: 'Validación del formato de correo', weight: 25 },
        { criteria: 'Eliminación de duplicados', weight: 25 },
        { criteria: 'Manejo de datos no válidos sin romper (null, vacíos)', weight: 20 },
        { criteria: 'Orden conservado', weight: 10 }
      ]
    },

    reinforce: [
      'Métodos de cadena: trim, toLowerCase, includes.',
      'Expresiones regulares básicas: anclas, clases de caracteres, cuantificadores.',
      'Set y Map como estructuras de datos.',
      'Prueba después: `js-resumen-carrito` y, cuando te sientas cómodo, `fe-buscador-debounce`.'
    ]
  });

  /* ==================================================================
     2. Resumen de un carrito simple
     ================================================================== */
  TT.defineExercise({
    id: 'js-resumen-carrito',
    title: 'Calcula el resumen de un carrito de la compra',
    category: 'javascript',
    categorias: ['frontend'],
    kind: 'build',
    level: 'junior',
    time: 30,
    tags: ['reduce', 'arrays', 'operadores', 'aritmética'],

    context:
      'Una tienda pequeña quiere mostrar, antes de pasar por caja, un resumen del carrito: cuántas unidades ' +
      'lleva el cliente, cuánto suma todo, si tiene descuento por compra grande y el total final.',

    situation:
      'El equipo de frontend necesita una función que reciba la lista de productos del carrito y calcule ese ' +
      'resumen, para poder usarla igual en la web y en la aplicación móvil.',

    goal:
      'Implementar `resumenCarrito(items)`: una función pura que calcule el subtotal, las unidades totales, ' +
      'el descuento aplicable y el total final de un carrito.',

    tech: ['JavaScript'],
    skills: ['reduce', 'operadores aritméticos', 'redondeo', 'funciones puras'],

    starter: {
      lang: 'javascript',
      code:
'/* ============================================================\n' +
'   ESPECIFICACIÓN\n' +
'   ------------------------------------------------------------\n' +
'   items : [{ precio: number, cantidad: number }]\n' +
'\n' +
'   1. subtotal  = suma de precio x cantidad de cada línea\n' +
'   2. unidades  = suma de todas las cantidades\n' +
'   3. descuento = 10 si el subtotal es MÁS de 100, si no 0\n' +
'                  (nota: "más de 100" es estricto: 100 no cuenta,\n' +
'                   100.01 sí)\n' +
'   4. total     = subtotal - descuento, redondeado a 2 decimales\n' +
'   5. Un carrito vacío devuelve todo a 0\n' +
'   ============================================================ */\n' +
'\n' +
'/**\n' +
' * @param {{precio:number, cantidad:number}[]} items\n' +
' * @returns {{subtotal:number, unidades:number, descuento:number, total:number}}\n' +
' */\n' +
'function resumenCarrito(items) {\n' +
'  // tu implementación\n' +
'}\n'
    },

    requirements: [
      'El subtotal es la suma de `precio × cantidad` de todas las líneas.',
      'Las unidades son la suma de todas las `cantidad`, no el número de líneas.',
      'El descuento es 10 si el subtotal supera estrictamente 100; en caso contrario es 0.',
      'El total es el subtotal menos el descuento, redondeado a 2 decimales.',
      'Un carrito vacío (`[]`) devuelve `{ subtotal: 0, unidades: 0, descuento: 0, total: 0 }`.'
    ],

    optional: [
      'Redondear también el subtotal a 2 decimales en el resultado.',
      'Aceptar un segundo parámetro con el umbral de descuento en lugar de dejarlo fijo en 100.'
    ],

    hints: [
      'El método `reduce` está pensado exactamente para esto: recorrer una lista y acumular un solo valor. Si todavía no lo conoces bien, primero calcula el subtotal con un bucle `for` normal; funciona igual de bien.',
      'Calcula primero el subtotal y las unidades. El descuento y el total dependen del subtotal, así que tienen que calcularse después, no a la vez.',
      '"Más de 100" es una comparación estricta (`>`), no "100 o más" (`>=`). Con subtotal exactamente 100 no hay descuento.',
      'Para redondear a 2 decimales en JavaScript, el patrón habitual es `Math.round(numero * 100) / 100`.'
    ],

    tests: {
      mode: 'js',
      timeout: 4000,
      cases: [
        {
          name: 'Un producto calcula bien el subtotal y las unidades',
          code:
'(function () {\n' +
'  var r = resumenCarrito([{ precio: 10, cantidad: 3 }]);\n' +
'  expect(r.subtotal).toBe(30);\n' +
'  expect(r.unidades).toBe(3);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Varios productos se suman correctamente',
          code:
'(function () {\n' +
'  var r = resumenCarrito([{ precio: 10, cantidad: 2 }, { precio: 5, cantidad: 4 }]);\n' +
'  expect(r.subtotal).toBe(40);\n' +
'  expect(r.unidades).toBe(6);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Por debajo del umbral no hay descuento',
          code:
'(function () {\n' +
'  var r = resumenCarrito([{ precio: 30, cantidad: 3 }]);   // subtotal 90\n' +
'  expect(r.descuento).toBe(0);\n' +
'  expect(r.total).toBe(90);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Justo en el umbral (100 exactos) no hay descuento',
          code:
'(function () {\n' +
'  var r = resumenCarrito([{ precio: 50, cantidad: 2 }]);   // subtotal 100 exactos\n' +
'  expect(r.descuento).toBe(0);\n' +
'  expect(r.total).toBe(100);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Justo por encima del umbral sí aplica el descuento',
          code:
'(function () {\n' +
'  var r = resumenCarrito([{ precio: 50.01, cantidad: 2 }]);   // subtotal 100.02\n' +
'  expect(r.descuento).toBe(10);\n' +
'  expect(r.total).toBe(90.02);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Un carrito vacío devuelve todo a cero',
          code:
'(function () {\n' +
'  var r = resumenCarrito([]);\n' +
'  expect(r).toEqual({ subtotal: 0, unidades: 0, descuento: 0, total: 0 });\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'El total viene redondeado a dos decimales',
          code:
'(function () {\n' +
'  var r = resumenCarrito([{ precio: 10.1, cantidad: 3 }, { precio: 20, cantidad: 5 }]);\n' +
'  // subtotal = 30.299999999999997 + 100 = 130.3 -> descuento 10 -> total 120.3\n' +
'  expect(r.total).toBe(120.3);\n' +
'  return true;\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'const UMBRAL_DESCUENTO = 100;\n' +
'const IMPORTE_DESCUENTO = 10;\n' +
'\n' +
'function resumenCarrito(items) {\n' +
'  let subtotal = 0;\n' +
'  let unidades = 0;\n' +
'\n' +
'  for (const linea of items) {\n' +
'    subtotal += linea.precio * linea.cantidad;\n' +
'    unidades += linea.cantidad;\n' +
'  }\n' +
'\n' +
'  const descuento = subtotal > UMBRAL_DESCUENTO ? IMPORTE_DESCUENTO : 0;\n' +
'  const total = Math.round((subtotal - descuento) * 100) / 100;\n' +
'\n' +
'  return { subtotal, unidades, descuento, total };\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — Sumar el subtotal y las unidades',
        objetivo:
          'Recorrer las líneas del carrito y acumular dos totales a la vez: el importe y las unidades.',
        anadido: [
          'Un bucle `for...of` sobre `items`.',
          'Dos acumuladores, `subtotal` y `unidades`, que empiezan en 0.'
        ],
        codigo:
'function resumenCarrito(items) {\n' +
'  let subtotal = 0;\n' +
'  let unidades = 0;\n' +
'\n' +
'  for (const linea of items) {\n' +
'    subtotal += linea.precio * linea.cantidad;\n' +
'    unidades += linea.cantidad;\n' +
'  }\n' +
'\n' +
'  return { subtotal, unidades, descuento: 0, total: subtotal };   // provisional\n' +
'}\n',
        explicacion:
          'Los dos acumuladores se declaran con `let` porque su valor cambia en cada vuelta del bucle, y ' +
          'empiezan en `0`: si el carrito estuviera vacío, el bucle no ejecutaría ninguna vuelta y ambos se ' +
          'quedarían en su valor inicial, que es exactamente el resultado correcto para ese caso.\n' +
          '`subtotal += linea.precio * linea.cantidad` es la forma corta de escribir ' +
          '`subtotal = subtotal + linea.precio * linea.cantidad`. La multiplicación se calcula antes que la ' +
          'suma porque en JavaScript, como en matemáticas, `*` tiene más prioridad que `+`.\n' +
          'El resultado que se devuelve aquí es solo provisional: `descuento` y `total` todavía no están ' +
          'bien calculados, se arreglan en la fase siguiente.'
      },
      {
        titulo: 'Fase 2 — Calcular el descuento a partir del subtotal',
        objetivo:
          'Decidir si el carrito tiene derecho a descuento, una vez que ya se conoce el subtotal completo.',
        anadido: [
          'Constantes `UMBRAL_DESCUENTO` e `IMPORTE_DESCUENTO` en la parte superior del archivo.',
          'Cálculo de `descuento` con el operador condicional (`? :`).'
        ],
        codigo:
'const UMBRAL_DESCUENTO = 100;\n' +
'const IMPORTE_DESCUENTO = 10;\n' +
'\n' +
'function resumenCarrito(items) {\n' +
'  let subtotal = 0;\n' +
'  let unidades = 0;\n' +
'\n' +
'  for (const linea of items) {\n' +
'    subtotal += linea.precio * linea.cantidad;\n' +
'    unidades += linea.cantidad;\n' +
'  }\n' +
'\n' +
'  const descuento = subtotal > UMBRAL_DESCUENTO ? IMPORTE_DESCUENTO : 0;\n' +
'\n' +
'  return { subtotal, unidades, descuento, total: subtotal - descuento };   // sin redondear aún\n' +
'}\n',
        explicacion:
          'El descuento **tiene que** calcularse después de terminar el bucle, porque necesita el ' +
          '`subtotal` ya completo. Calcularlo dentro del bucle, línea a línea, no tendría sentido: no sabes ' +
          'si el carrito supera el umbral hasta haber sumado todas las líneas.\n' +
          'Las dos constantes se han sacado a la parte de arriba del archivo, con nombres en mayúsculas por ' +
          'convención (son valores que no cambian durante la ejecución). Así, si mañana la tienda decide que ' +
          'el umbral pasa a ser 150, se cambia en un solo sitio.\n' +
          'El operador `?:` es un atajo para un `if/else` que solo decide un valor: ' +
          '`condicion ? valorSiCierto : valorSiFalso`. Aquí: "si el subtotal es mayor que el umbral, el ' +
          'descuento es el importe fijo; si no, es 0".\n' +
          'Fíjate en que es `>` y no `>=`: con subtotal exactamente igual al umbral, la condición es falsa y ' +
          'no hay descuento. Es el detalle que separa un `>` de un `>=`, y es donde suelen aparecer los ' +
          'errores en este tipo de reglas.'
      },
      {
        titulo: 'Fase 3 — Redondear el total a dos decimales',
        objetivo:
          'Evitar que la resta de subtotal menos descuento arrastre los restos de la coma flotante.',
        anadido: [
          'Redondeo del total con `Math.round(... * 100) / 100`.'
        ],
        codigo:
'const UMBRAL_DESCUENTO = 100;\n' +
'const IMPORTE_DESCUENTO = 10;\n' +
'\n' +
'function resumenCarrito(items) {\n' +
'  let subtotal = 0;\n' +
'  let unidades = 0;\n' +
'\n' +
'  for (const linea of items) {\n' +
'    subtotal += linea.precio * linea.cantidad;\n' +
'    unidades += linea.cantidad;\n' +
'  }\n' +
'\n' +
'  const descuento = subtotal > UMBRAL_DESCUENTO ? IMPORTE_DESCUENTO : 0;\n' +
'  const total = Math.round((subtotal - descuento) * 100) / 100;\n' +
'\n' +
'  return { subtotal, unidades, descuento, total };\n' +
'}\n',
        explicacion:
          'Los ordenadores representan los números decimales en binario, y muchos decimales que en base 10 ' +
          'son exactos (como 0.1) no lo son en binario. Por eso `10.1 * 3` no da exactamente `30.3`, sino ' +
          '`30.299999999999997`. Sin redondear, ese resto se vería en el total mostrado al cliente.\n' +
          '`Math.round(n * 100) / 100` es el patrón habitual para redondear a dos decimales: multiplicar por ' +
          '100 desplaza los dos decimales a la parte entera, `Math.round` los redondea al entero más cercano ' +
          '(eliminando el resto binario), y dividir entre 100 devuelve el número a su magnitud original.\n' +
          'El redondeo se aplica **una sola vez, al final**, sobre el resultado ya completo. Si redondearas ' +
          'el subtotal de cada línea por separado antes de sumarlas, podrías acumular pequeños errores de ' +
          'redondeo en carritos con muchas líneas.\n' +
          'Esta es la solución final: subtotal y unidades exactos, descuento decidido sobre el subtotal ' +
          'completo, y el total redondeado una sola vez.'
      }
    ],

    docs: {
      resumen:
        'Un `reduce` mental hecho a mano con un bucle: recorrer una lista acumulando varios totales a la ' +
        'vez, decidir algo (el descuento) que depende del resultado acumulado, y redondear el número final ' +
        'para que sea presentable. Son las tres operaciones más comunes al trabajar con listas de precios.',

      conceptos: [
        {
          titulo: 'Acumular un total recorriendo una lista',
          texto:
            'El patrón más básico para "convertir una lista en un solo número" es: declarar una variable que ' +
            'empieza en 0, recorrer la lista, y en cada vuelta sumarle algo a esa variable.\n' +
            'Se puede acumular **más de un valor a la vez** en el mismo bucle, siempre que sean ' +
            'independientes entre sí: aquí `subtotal` y `unidades` se calculan juntos porque ninguno depende ' +
            'del otro, solo de la línea actual.',
          codigo:
'let total = 0;\n' +
'\n' +
'for (const n of [10, 20, 30]) {\n' +
'  total += n;      // equivale a: total = total + n\n' +
'}\n' +
'\n' +
'total;   // 60\n' +
'\n' +
'// Dos acumuladores a la vez, en el mismo bucle\n' +
'let suma = 0, cuenta = 0;\n' +
'for (const n of [10, 20, 30]) {\n' +
'  suma += n;\n' +
'  cuenta += 1;\n' +
'}\n' +
'// suma = 60, cuenta = 3'
        },
        {
          titulo: 'Prioridad de operadores: por qué * va antes que +',
          texto:
            'JavaScript sigue las mismas reglas de prioridad que la aritmética normal: la multiplicación y la ' +
            'división se calculan antes que la suma y la resta, aunque estén escritas después.\n' +
            'Por eso `precio * cantidad` se calcula entero antes de sumarse a `subtotal`, sin necesidad de ' +
            'paréntesis. Si alguna vez tienes dudas sobre el orden, los paréntesis siempre lo dejan ' +
            'explícito y no cuestan nada.',
          codigo:
'2 + 3 * 4;      // 14, no 20 -> el * se calcula primero: 3*4=12, luego 2+12\n' +
'(2 + 3) * 4;    // 20 -> los paréntesis fuerzan el orden\n' +
'\n' +
'subtotal += linea.precio * linea.cantidad;\n' +
'// equivale a: subtotal = subtotal + (linea.precio * linea.cantidad)'
        },
        {
          titulo: 'El operador condicional ?: como atajo de if/else',
          texto:
            'Cuando un `if/else` solo sirve para decidir el valor de una variable, se puede escribir en una ' +
            'línea con el operador `?:`: `condicion ? valorSiVerdadero : valorSiFalso`.\n' +
            'Es exactamente equivalente a un `if/else` normal, solo que más corto cuando el resultado es un ' +
            'único valor. Para lógica más compleja (varias líneas de código, varias condiciones), el ' +
            '`if/else` tradicional se lee mejor.',
          codigo:
'// Con if/else\n' +
'let descuento;\n' +
'if (subtotal > 100) {\n' +
'  descuento = 10;\n' +
'} else {\n' +
'  descuento = 0;\n' +
'}\n' +
'\n' +
'// Con el operador condicional: mismo resultado, una línea\n' +
'const descuento = subtotal > 100 ? 10 : 0;'
        },
        {
          titulo: 'Comparación estricta: > frente a >=',
          texto:
            '`>` significa "estrictamente mayor que": el valor límite queda excluido. `>=` significa "mayor o ' +
            'igual que": el valor límite queda incluido.\n' +
            'La diferencia solo se nota exactamente en el valor del límite. Con subtotal 99 o 101 da igual ' +
            'cuál uses; con subtotal exactamente 100 es donde `>` y `>=` dan resultados distintos.\n' +
            'Cuando un enunciado dice "más de 100", eso es `>`. Cuando dice "100 o más", eso es `>=`. Leer ' +
            'con cuidado esa palabra es lo que evita el error más típico en este tipo de reglas.',
          codigo:
'100 > 100;    // false  -> "más de 100" excluye el 100\n' +
'100 >= 100;   // true   -> "100 o más" incluye el 100\n' +
'101 > 100;    // true\n' +
'\n' +
'// "más de 100" -> usa >\n' +
'const descuento = subtotal > 100 ? 10 : 0;'
        }
      ],

      referencia: [
        { nombre: 'for (const x of lista)', texto: 'Recorre los elementos de un array, en orden, uno a uno.' },
        { nombre: 'variable += valor', texto: 'Suma `valor` a `variable` y guarda el resultado. Atajo de `variable = variable + valor`.' },
        { nombre: 'condicion ? a : b', texto: 'Operador condicional: devuelve `a` si la condición es verdadera, `b` si es falsa.' },
        { nombre: '> frente a >=', texto: '`>` excluye el valor límite ("estrictamente mayor"); `>=` lo incluye ("mayor o igual").' },
        { nombre: 'Math.round(n)', texto: 'Redondea al entero más cercano.' },
        { nombre: 'Math.round(n * 100) / 100', texto: 'Patrón habitual para redondear a dos decimales.' },
        { nombre: '{ subtotal, unidades, descuento, total }', texto: 'Forma corta de crear un objeto cuando las claves tienen el mismo nombre que las variables (shorthand de propiedades).' }
      ],

      ejemplo: {
        titulo: 'Resumen de horas trabajadas (mismo patrón, otro dominio)',
        codigo:
'const HORAS_EXTRA_DESDE = 40;\n' +
'const RECARGO_POR_HORA_EXTRA = 5;   // euros/hora de recargo\n' +
'\n' +
'/**\n' +
' * @param {{horas:number, tarifa:number}[]} registros  Un registro por día trabajado.\n' +
' */\n' +
'function resumenNomina(registros) {\n' +
'  let horasTotales = 0;\n' +
'  let importeBase = 0;\n' +
'\n' +
'  for (const dia of registros) {\n' +
'    horasTotales += dia.horas;\n' +
'    importeBase += dia.horas * dia.tarifa;\n' +
'  }\n' +
'\n' +
'  const horasExtra = horasTotales > HORAS_EXTRA_DESDE\n' +
'    ? horasTotales - HORAS_EXTRA_DESDE\n' +
'    : 0;\n' +
'\n' +
'  const recargo = horasExtra * RECARGO_POR_HORA_EXTRA;\n' +
'  const total = Math.round((importeBase + recargo) * 100) / 100;\n' +
'\n' +
'  return { horasTotales, importeBase, horasExtra, recargo, total };\n' +
'}\n' +
'\n' +
'resumenNomina([{ horas: 25, tarifa: 12 }, { horas: 20, tarifa: 12 }]);\n' +
'// horasTotales: 45, importeBase: 540\n' +
'// horasExtra: 5 (45 - 40), recargo: 25 (5 x 5), total: 565',
        texto:
          'La estructura es idéntica a la de tu ejercicio: un bucle que acumula dos totales a la vez (aquí ' +
          '`horasTotales` e `importeBase`), una decisión que depende del total acumulado (aquí no es un ' +
          '`?:` con dos valores fijos, sino un cálculo: cuántas horas pasan del umbral), y un redondeo final ' +
          'sobre el resultado completo.\n' +
          'La diferencia con tu ejercicio es que aquí el "extra" no es un importe fijo, sino que depende de ' +
          'cuánto se pase del umbral. Aun así, el orden de los pasos es el mismo: primero se acumula todo lo ' +
          'que no depende de nada más, después se calcula lo que depende de ese acumulado, y al final se ' +
          'redondea una sola vez.\n' +
          'Aplica exactamente este orden a `resumenCarrito`: subtotal y unidades primero, descuento después, ' +
          'redondeo al final.'
      },

      glosario: [
        { termino: 'Acumulador', definicion: 'Variable que va sumando (o combinando) un valor en cada vuelta de un bucle, hasta obtener un resultado final.' },
        { termino: 'Operador condicional (ternario)', definicion: 'La forma corta de un if/else de una sola línea: `condicion ? siVerdadero : siFalso`.' },
        { termino: 'Comparación estricta', definicion: 'Uso de `>` o `<` en vez de `>=` o `<=`, que excluye el valor límite exacto.' },
        { termino: 'Coma flotante', definicion: 'Forma en que los ordenadores representan los números decimales, que puede introducir pequeños errores de precisión.' },
        { termino: 'Función pura', definicion: 'Función que, con la misma entrada, siempre devuelve la misma salida y no modifica nada fuera de sí misma.' }
      ],

      preparado: [
        '¿En qué orden hay que calcular subtotal, descuento y total, y por qué en ese orden y no otro?',
        '¿Qué diferencia hay entre `>` y `>=`, y cuál corresponde a "más de 100"?',
        '¿Por qué se pueden acumular `subtotal` y `unidades` en el mismo bucle?',
        '¿Sabrías reescribir `const descuento = subtotal > 100 ? 10 : 0;` usando un `if/else` normal?',
        '¿Por qué el redondeo se aplica al final y no en cada línea del carrito?'
      ]
    },

    rationale:
      'La función se estructura en tres pasos que dependen unos de otros en orden estricto: primero acumular ' +
      'lo que no depende de nada más (subtotal y unidades), después decidir el descuento a partir del ' +
      'subtotal ya completo, y por último redondear el resultado final. Intentar calcular el descuento dentro ' +
      'del mismo bucle que el subtotal no funcionaría, porque en la primera línea del carrito todavía no se ' +
      'sabe si el total va a superar el umbral.',

    alternatives: [
      { name: 'array.reduce()', when: 'Ya conoces bien los métodos de array de orden superior.', tradeoff: 'Más idiomático en JavaScript moderno y evita declarar variables mutables con `let`, pero acumular dos valores a la vez con `reduce` obliga a devolver un objeto en cada vuelta, lo que puede ser menos legible para quien empieza.' },
      { name: 'Descuento porcentual en vez de fijo', when: 'El negocio lo pide así.', tradeoff: 'Cambia una línea (`subtotal * 0.1` en vez de una constante), pero conviene decidirlo con claridad en la especificación: un descuento fijo y uno porcentual se comportan de forma muy distinta cerca del umbral.' },
      { name: 'Separar el cálculo en varias funciones pequeñas', when: 'La lógica crece (más reglas de descuento, impuestos, envío).', tradeoff: 'Facilita añadir reglas nuevas sin tocar las existentes; para una función tan pequeña como esta sería sobreingeniería.' }
    ],

    commonErrors: [
      { error: 'Calcular el descuento dentro del bucle, línea a línea.', why: 'El descuento depende del subtotal COMPLETO, que solo se conoce después de recorrer todas las líneas.', fix: 'Acumular primero, decidir el descuento después de terminar el bucle.' },
      { error: 'Usar `>=` en vez de `>` para "más de 100".', why: 'Aplica el descuento a un carrito de exactamente 100, que la especificación excluye explícitamente.', fix: 'Leer con cuidado si el enunciado dice "más de" (estricto) o "o más" (incluye el límite).' },
      { error: 'Contar el número de líneas en vez de sumar las cantidades.', why: 'Un carrito con una línea de 5 unidades tiene 1 línea pero 5 unidades; son cosas distintas.', fix: 'Acumular `linea.cantidad`, no incrementar un contador de líneas.' },
      { error: 'No redondear el total.', why: 'La resta de subtotal menos descuento puede arrastrar decimales de la coma flotante y mostrar un precio con muchos decimales.', fix: '`Math.round(n * 100) / 100` sobre el resultado final.' },
      { error: 'Devolver un objeto con las claves en otro orden o con nombres distintos.', why: 'Los tests (y el resto del equipo) esperan exactamente `{ subtotal, unidades, descuento, total }`.', fix: 'Seguir el contrato del enunciado al pie de la letra.' }
    ],

    bestPractices: [
      'Cuando un cálculo depende de un total acumulado, primero se termina de acumular y después se calcula lo que depende de él.',
      'Las reglas de negocio (umbral, importe del descuento) se guardan en constantes con nombre, no como números sueltos en medio del código.',
      'Se redondea una sola vez, al final, sobre el resultado completo.',
      'Se presta atención literal a las palabras del enunciado ("más de" no es lo mismo que "o más").'
    ],

    security: [
      'Este cálculo nunca debe hacerse solo en el navegador para un pago real: el precio final que se cobra tiene que recalcularse siempre en el servidor, porque cualquier cosa que ocurra en el cliente puede manipularse.'
    ],

    performance: [
      'Un único recorrido de la lista (`for...of`) es suficiente: no hace falta recorrer el carrito más de una vez para calcular subtotal y unidades a la vez.'
    ],

    companyLooksFor: [
      'Que identifiques que el descuento depende del subtotal completo y no se puede calcular línea a línea.',
      'Que leas con precisión la diferencia entre "más de" y "o más".',
      'Que sepas por qué hace falta redondear un resultado en coma flotante.',
      'Que el objeto devuelto siga exactamente la forma que pide el contrato.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Subtotal y unidades correctos', weight: 25 },
        { criteria: 'Descuento aplicado con la comparación correcta (> y no >=)', weight: 30 },
        { criteria: 'Redondeo correcto del total', weight: 25 },
        { criteria: 'Carrito vacío manejado correctamente', weight: 20 }
      ]
    },

    reinforce: [
      'array.reduce() como alternativa al bucle for con acumulador.',
      'Prioridad de operadores aritméticos.',
      'Módulo 1 (Fundamentos) del laboratorio para operadores y tipos de datos.',
      'Prueba después: `js-limpiar-correos` si no la has hecho, y `test-tests-que-detectan` para aprender a poner a prueba funciones como esta.'
    ]
  });

})(window.TT);

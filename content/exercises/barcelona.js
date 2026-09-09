/* ============================================================
   Pruebas del ecosistema de Barcelona
   ------------------------------------------------------------
   Dos empresas de Barcelona publican —o dejan circular— el
   enunciado de su prueba técnica, no solo el formato:

   · SeQura (fintech, pago aplazado): calcular los desembolsos a
     comercios con comisiones por tramos. El enunciado aparece
     descrito de forma coincidente en varios repositorios
     públicos de candidatos.
   · Holded (gestión para pymes): modelar una máquina
     expendedora. El enunciado está en su repositorio público
     de contratación, junto con su stack.

   Los dos ejercicios de aquí abajo son ORIGINALES: reproducen
   el problema de negocio y el listón de evaluación, no el
   enunciado. Y los dos llenan una categoría que estaba vacía en
   el catálogo: Backend y Arquitectura.
   ============================================================ */
(function (TT) {
  'use strict';

  /* ------------------------------------------------------------------
     1. Desembolsos y comisiones por tramos — fintech de Barcelona
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'bcn-desembolsos-comisiones',
    empresa: {
      empresas: ['sequra', 'revolut', 'glovo'],
      evidencia: 'documentada',
      puesto: 'Backend Engineer',
      rol: 'backend',
      formato: 'take-home',
      dificultad: 3,
      evalua: [
        'Aritmética de dinero sin coma flotante: en una fintech esto no es una preferencia de estilo, es un requisito.',
        'Fronteras de tramo tratadas a propósito y no por accidente: es donde se pierde o se gana dinero real.',
        'Redondear por pedido y no sobre el total, porque así es como se factura de verdad.',
        'Agrupación temporal correcta, con la semana empezando el lunes y sin sorpresas de zona horaria.'
      ],
      nota:
        'SeQura publica en sus ofertas que su proceso es una prueba asíncrona seguida de una revisión ' +
        'en vivo de tu propio código, y su reto de backend —desembolsos a comercios con comisiones del ' +
        '1 %, 0,95 % y 0,85 % por tramos de importe— aparece descrito de forma coincidente en varios ' +
        'repositorios públicos de candidatos independientes. Esos tramos son los que se reproducen ' +
        'aquí. El resto del enunciado, el contrato de la función y los tests son originales nuestros.',
      fuentes: [
        { titulo: 'SeQura — Senior Software Engineer: proceso (take-home + peer review en vivo)', url: 'https://sequra.recruitee.com/o/senior-software-engineer-2' },
        { titulo: 'Reto de backend de SeQura publicado por un candidato (tramos de comisión)', url: 'https://github.com/joelGarcia93/sequra-challenge' },
        { titulo: 'Segundo repositorio independiente con los mismos tramos', url: 'https://github.com/languita/sequra-challenge' }
      ]
    },
    categorias: ['javascript', 'databases'],
    title: 'Desembolsos a comercios: comisiones por tramos, al céntimo',
    category: 'backend',
    kind: 'build',
    level: 'mid',
    time: 50,
    tags: ['dinero', 'redondeo', 'tramos', 'fechas', 'fintech', 'Barcelona'],

    context:
      'Prueba para casa de una fintech de Barcelona que ofrece pago aplazado a tiendas en línea. Te dan ' +
      'un enunciado corto, te dicen que no dediques más de tres horas y que valoran la calidad por ' +
      'encima de terminarlo todo. Después hay una segunda ronda en la que revisas tu propio código en ' +
      'vivo con dos ingenieros: todo lo que entregues, tendrás que defenderlo.',

    situation:
      'La empresa cobra al comercio una comisión por cada pedido y le paga el resto **una vez por ' +
      'semana**, agrupando todos los pedidos completados en esa semana.\n\n' +
      'La comisión depende del importe del pedido:\n\n' +
      '| Importe del pedido | Comisión |\n' +
      '| --- | --- |\n' +
      '| Menos de 50 € | 1,00 % |\n' +
      '| De 50 € a menos de 300 € | 0,95 % |\n' +
      '| 300 € o más | 0,85 % |\n\n' +
      'Los importes llegan **en céntimos y como enteros**, porque en dinero nadie usa coma flotante. ' +
      'Cada pedido trae la fecha en la que se completó, en formato ISO y en UTC, o `null` si todavía ' +
      'no se ha completado.\n\n' +
      'El equipo de finanzas cuadra estas cifras a mano contra el banco. Un céntimo de diferencia ' +
      'multiplicado por cien mil pedidos es una reunión muy larga.',

    goal:
      'Implementar `calcularDesembolsos(pedidos)`, que devuelve un desembolso por semana con el número ' +
      'de pedidos, el importe bruto, la comisión total y el neto a pagar al comercio.',

    tech: ['JavaScript', 'Node.js'],
    skills: ['aritmética entera', 'redondeo', 'reglas de negocio por tramos', 'agrupación por fecha', 'inmutabilidad'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * Desembolsos semanales a un comercio.\n' +
' *\n' +
' * @param {Array<{id:string, importeCent:number, completadoEn:string|null}>} pedidos\n' +
' * @returns {Array<{semana:string, pedidos:number, brutoCent:number,\n' +
' *                  comisionCent:number, netoCent:number}>}\n' +
' *\n' +
' * `semana` es la fecha del LUNES de esa semana, en formato "YYYY-MM-DD" y en UTC.\n' +
' * El resultado va ordenado por semana, de más antigua a más reciente.\n' +
' *\n' +
' * Comisión por pedido:\n' +
' *   importe <  5000 cent  ->  1,00 %\n' +
' *   importe <  30000 cent ->  0,95 %\n' +
' *   resto                 ->  0,85 %\n' +
' */\n' +
'function calcularDesembolsos(pedidos) {\n' +
'  // Tu solución aquí.\n' +
'}\n'
    },

    requirements: [
      'La comisión se calcula **por pedido** y se redondea por pedido, no sobre el total de la semana.',
      'Redondeo al céntimo más cercano, con el medio céntimo hacia arriba.',
      'Los tramos son **semiabiertos**: 50,00 € exactos ya pagan 0,95 %, y 300,00 € exactos ya pagan 0,85 %.',
      'Los pedidos con `completadoEn` a `null` **no** entran en ningún desembolso.',
      'La semana empieza el **lunes**, y se identifica con la fecha de ese lunes en UTC.',
      'El resultado va ordenado por semana ascendente.',
      '`netoCent` es siempre `brutoCent - comisionCent`.',
      'No mutar el array de pedidos ni sus objetos.',
      'Una entrada vacía o no válida devuelve un array vacío, no un error.',
      'Nada de números con decimales para representar dinero. Ni uno.'
    ],

    optional: [
      'Devolver también el desglose por tramo, para que finanzas pueda auditar de dónde sale cada comisión.',
      'Aceptar una configuración de tramos inyectada, en vez de tenerla fija en el módulo.',
      'Añadir una comisión mínima mensual y calcular el complemento cuando no se alcance.'
    ],

    hints: [
      'Empieza por una función que, dado un importe, devuelva solo la comisión de ese importe. Si esa función está bien, el resto es agrupar.',
      'Para los porcentajes, piensa en **puntos básicos** (enteros) en vez de en decimales: 1 % son 100 puntos básicos, 0,95 % son 95 y 0,85 % son 85. Así toda la operación se queda en enteros hasta el redondeo final.',
      'Los tramos son semiabiertos. Escribe la condición como "menor que el techo del tramo" y las fronteras caen solas en el lado correcto.',
      'En JavaScript, `getUTCDay()` devuelve 0 para el domingo. Para retroceder al lunes necesitas `(dia + 6) % 7`, no `dia - 1`.',
      'Las cadenas "YYYY-MM-DD" se ordenan igual como texto que como fecha. Eso hace que ordenar el resultado sea un `.sort()` sin comparador.'
    ],

    docs: {
      resumen:
        'Tres ideas resuelven esta prueba: **el dinero se maneja en enteros**, **las fronteras de los ' +
        'tramos se deciden a propósito** y **se redondea por pedido, no sobre el total**. La cuarta, ' +
        'menos vistosa pero igual de eliminatoria, es que la semana empieza el lunes y JavaScript ' +
        'cree que empieza el domingo.',

      conceptos: [
        {
          titulo: 'Dinero en enteros y puntos básicos',
          texto:
            'Los números de JavaScript son de coma flotante binaria, y hay decimales que **no existen** ' +
            'en esa representación. Por eso `0.1 + 0.2` no es `0.3`. Sobre un importe suelto no se nota; ' +
            'sobre cien mil pedidos, se nota en el arqueo.\n' +
            'La regla profesional es que **el dinero se guarda y se opera en la unidad más pequeña**: ' +
            'céntimos, como entero. Nunca euros con decimales.\n' +
            'Los porcentajes tienen el mismo problema: `0.0095` tampoco es exacto. La solución del ' +
            'sector son los **puntos básicos**, centésimas de punto porcentual, que sí son enteros: ' +
            '1 % son 100 puntos básicos y 0,95 % son 95. Multiplicas por el entero y divides por 10 000 ' +
            'al final, así la única operación con decimales es la última, la que vas a redondear de ' +
            'todas formas.',
          codigo:
'0.1 + 0.2;                    // 0.30000000000000004\n' +
'4999 * 0.01;                  // 49.99000000000001   ← ya arrastra error\n' +
'\n' +
'// Con puntos básicos, todo entero hasta el final:\n' +
'//   1,00 %  ->  100 pb\n' +
'//   0,95 %  ->   95 pb\n' +
'//   0,85 %  ->   85 pb\n' +
'\n' +
'Math.round(4999 * 100 / 10000);   // 50   comisión de 49,99 € al 1 %\n' +
'Math.round(5000 *  95 / 10000);   // 48   comisión de 50,00 € al 0,95 %'
        },
        {
          titulo: 'Tramos semiabiertos: dónde se decide el dinero',
          texto:
            'Un tramo es un intervalo, y un intervalo no está definido hasta que dices si sus extremos ' +
            'entran. "De 50 a 300 euros" es ambiguo; "50 € incluido, 300 € excluido" no lo es.\n' +
            'El enunciado dice **menos de 50 €** para el primer tramo, así que 50,00 € exactos ya paga ' +
            'el segundo. Y **300 € o más** para el tercero, así que 300,00 € exactos ya paga el tercero. ' +
            'En código eso es una sola comparación por tramo: `importe < techo`.\n' +
            'La forma de no equivocarse es no escribir la condición dos veces. Si defines los tramos ' +
            'como una lista de techos y recorres hasta encontrar el primero que supera el importe, la ' +
            'frontera está definida en un único sitio y no puede desincronizarse.\n' +
            'Fíjate en que es exactamente el mismo razonamiento del intervalo semiabierto de una ' +
            'ventana de tiempo: el problema cambia de dominio, la trampa no.',
          codigo:
'// Frágil: las fronteras están repetidas y pueden desincronizarse\n' +
'if (c < 5000) return 100;\n' +
'if (c >= 5000 && c < 30000) return 95;\n' +
'if (c >= 30000) return 85;\n' +
'\n' +
'// Robusto: cada frontera aparece UNA vez\n' +
'const TRAMOS = [\n' +
'  { hastaCent: 5000,     puntosBasicos: 100 },\n' +
'  { hastaCent: 30000,    puntosBasicos: 95  },\n' +
'  { hastaCent: Infinity, puntosBasicos: 85  }\n' +
'];\n' +
'// El primero cuyo techo supere el importe, y ya está.'
        },
        {
          titulo: 'Redondear por pedido no es lo mismo que redondear el total',
          texto:
            'Este es el detalle que separa una entrega correcta de una que cuadra por casualidad.\n' +
            'Si redondeas la comisión de cada pedido y luego sumas, obtienes un número. Si sumas las ' +
            'comisiones sin redondear y redondeas al final, obtienes **otro**. Pueden diferir en varios ' +
            'céntimos por semana.\n' +
            'Ninguno de los dos es "más correcto" en abstracto: lo correcto es **el que coincide con lo ' +
            'que se factura**. Y lo que se factura es cada pedido, con su comisión propia, porque cada ' +
            'pedido es una línea en la factura del comercio. Por tanto se redondea por pedido.\n' +
            'En una entrevista, decir esto en voz alta vale tanto como escribirlo: demuestra que ' +
            'entiendes que la regla viene del negocio, no de la aritmética.',
          codigo:
'// Tres pedidos de 49,99 € al 1 %\n' +
'//\n' +
'//   por pedido:  round(49.99) x 3  =  50 + 50 + 50  =  150 cent\n' +
'//   sobre total: round(49.99 x 3)  =  round(149.97) =  150 cent\n' +
'//\n' +
'// Con otros importes divergen. Tres pedidos de 12,50 € al 1 %:\n' +
'//\n' +
'//   por pedido:  round(12.5) x 3   =  13 + 13 + 13  =   39 cent\n' +
'//   sobre total: round(12.5 x 3)   =  round(37.5)   =   38 cent\n' +
'//\n' +
'// Un céntimo de diferencia. Multiplícalo por el volumen de un mes.'
        },
        {
          titulo: 'La semana empieza el lunes; JavaScript cree que empieza el domingo',
          texto:
            '`Date.prototype.getUTCDay()` devuelve **0 para el domingo**, 1 para el lunes y 6 para el ' +
            'sábado. Casi todo el mundo escribe `dia - 1` para retroceder al lunes, y casi todo el mundo ' +
            'manda los domingos a la semana siguiente.\n' +
            'La fórmula correcta es `(dia + 6) % 7`: convierte lunes en 0 y domingo en 6, que es ' +
            'exactamente cuántos días hay que retroceder.\n' +
            'El segundo detalle es hacerlo **todo en UTC**. `new Date("2026-03-15")` se interpreta como ' +
            'medianoche UTC, pero `getDate()` y compañía devuelven la fecha en la zona horaria de quien ' +
            'ejecuta el código. Un servidor en Madrid y otro en Londres darían semanas distintas para ' +
            'los mismos pedidos. Con las variantes `getUTC*` y `Date.UTC` el resultado no depende de ' +
            'dónde se ejecute.',
          codigo:
'const d = new Date("2026-03-15T10:00:00Z");   // domingo\n' +
'd.getUTCDay();                              // 0\n' +
'\n' +
'// MAL: el domingo salta a la semana siguiente\n' +
'd.getUTCDate() - (d.getUTCDay() - 1);       // 15 - (-1) = 16  ← lunes SIGUIENTE\n' +
'\n' +
'// BIEN: (dia + 6) % 7 = (0 + 6) % 7 = 6 días atrás\n' +
'const atras = (d.getUTCDay() + 6) % 7;        // 6\n' +
'new Date(Date.UTC(2026, 2, 15 - atras))\n' +
'  .toISOString().slice(0, 10);              // "2026-03-09"  ← lunes correcto\n' +
'\n' +
'// Date.UTC normaliza solo los desbordamientos: el día 0 es el último\n' +
'// del mes anterior, así que no hay que tratar los cambios de mes a mano.'
        },
        {
          titulo: 'Agrupar con un objeto acumulador',
          texto:
            'Agrupar una lista por una clave calculada es el patrón más frecuente en informes de ' +
            'negocio. La forma limpia es un objeto donde la clave es el grupo y el valor es el ' +
            'acumulador.\n' +
            'Dos detalles que se agradecen en una revisión: **crear el acumulador con todos sus campos ' +
            'a cero** en el momento en que aparece el grupo (así ninguna suma empieza en `undefined`), ' +
            'y **no mutar los objetos de entrada** — se leen, no se tocan.\n' +
            'Para ordenar el resultado, si la clave es una fecha en formato `YYYY-MM-DD`, el orden ' +
            'alfabético coincide con el cronológico. Es la razón por la que ese formato se llama ' +
            'ordenable y por la que conviene usarlo siempre para claves de fecha.',
          codigo:
'const porGrupo = {};\n' +
'\n' +
'lista.forEach(function (item) {\n' +
'  const clave = calcularClave(item);\n' +
'  const acumulado = porGrupo[clave] ||\n' +
'    (porGrupo[clave] = { clave: clave, n: 0, totalCent: 0 });\n' +
'  acumulado.n += 1;\n' +
'  acumulado.totalCent += item.importeCent;\n' +
'});\n' +
'\n' +
'// "2026-03-09" < "2026-03-16" como texto Y como fecha\n' +
'Object.keys(porGrupo).sort().map(function (k) { return porGrupo[k]; });'
        }
      ],

      referencia: [
        { nombre: 'Math.round(n)', texto: 'Redondea al entero más cercano, con el `.5` hacia arriba en positivos. Es justo la regla de redondeo comercial que pide el enunciado.' },
        { nombre: 'date.getUTCDay()', texto: 'Día de la semana en UTC. **0 es domingo**, 1 lunes… 6 sábado.' },
        { nombre: 'Date.UTC(a, m, d)', texto: 'Construye una marca de tiempo en UTC. El mes va de 0 a 11 y los desbordamientos de día se normalizan solos.' },
        { nombre: 'date.toISOString()', texto: 'Devuelve `"YYYY-MM-DDTHH:mm:ss.sssZ"`. Con `.slice(0, 10)` te quedas con la fecha.' },
        { nombre: 'array.reduce(fn, ini)', texto: 'Alternativa a un objeto acumulador cuando prefieres no declarar la variable fuera.' },
        { nombre: 'Object.keys(o).sort()', texto: 'Claves ordenadas alfabéticamente. Con fechas `YYYY-MM-DD` eso ya es orden cronológico.' },
        { nombre: 'Infinity', texto: 'Sirve como techo del último tramo y evita tener que tratar el último caso aparte.' }
      ],

      ejemplo: {
        titulo: 'Problema ANÁLOGO resuelto: coste de envío por tramos de peso',
        codigo:
'/**\n' +
' * Coste de envío de una lista de paquetes, agrupado por transportista.\n' +
' * Mismo patrón: tramos + redondeo por unidad + agrupación.\n' +
' */\n' +
'const TRAMOS_PESO = [\n' +
'  { hastaGramos: 1000,     centimosPorKilo: 350 },\n' +
'  { hastaGramos: 5000,     centimosPorKilo: 280 },\n' +
'  { hastaGramos: Infinity, centimosPorKilo: 210 }\n' +
'];\n' +
'\n' +
'function tarifaDe(gramos) {\n' +
'  for (let i = 0; i < TRAMOS_PESO.length; i++) {\n' +
'    if (gramos < TRAMOS_PESO[i].hastaGramos) return TRAMOS_PESO[i].centimosPorKilo;\n' +
'  }\n' +
'  return TRAMOS_PESO[TRAMOS_PESO.length - 1].centimosPorKilo;\n' +
'}\n' +
'\n' +
'function costeDe(gramos) {\n' +
'  // Todo entero hasta el redondeo final, igual que con los puntos básicos.\n' +
'  return Math.round(gramos * tarifaDe(gramos) / 1000);\n' +
'}\n' +
'\n' +
'function costesPorTransportista(paquetes) {\n' +
'  if (!Array.isArray(paquetes)) return [];\n' +
'\n' +
'  const porTransportista = {};\n' +
'\n' +
'  paquetes.forEach(function (p) {\n' +
'    if (!p || !p.transportista) return;\n' +
'    const acumulado = porTransportista[p.transportista] ||\n' +
'      (porTransportista[p.transportista] =\n' +
'        { transportista: p.transportista, paquetes: 0, costeCent: 0 });\n' +
'    acumulado.paquetes += 1;\n' +
'    acumulado.costeCent += costeDe(p.gramos);   // redondeo POR PAQUETE\n' +
'  });\n' +
'\n' +
'  return Object.keys(porTransportista).sort().map(function (t) {\n' +
'    return porTransportista[t];\n' +
'  });\n' +
'}',
        texto:
          'Es la misma columna vertebral: **una tabla de tramos declarada una sola vez**, una función ' +
          'que traduce una magnitud a su tarifa, una que calcula el coste de una unidad redondeando ' +
          'ahí mismo, y una que agrupa y suma.\n' +
          'Fíjate en lo que se traslada y en lo que no. Se traslada la estructura, el `Infinity` como ' +
          'techo del último tramo, el redondeo por unidad y el objeto acumulador.\n' +
          'No se traslada la clave de agrupación: aquí el grupo viene **dado** en el dato ' +
          '(`p.transportista`), mientras que en la prueba hay que **calcularlo** a partir de una fecha, ' +
          'con el asunto del lunes. Esa es justamente la parte que el ejemplo no te resuelve.'
      },

      glosario: [
        { termino: 'Punto básico', definicion: 'Una centésima de punto porcentual. 100 puntos básicos son un 1 %. Permite expresar comisiones con enteros.' },
        { termino: 'Desembolso', definicion: 'El pago que la plataforma hace al comercio, agrupando pedidos de un periodo y descontando comisiones.' },
        { termino: 'Bruto y neto', definicion: 'Bruto es la suma de los pedidos; neto es lo que cobra el comercio tras restar la comisión.' },
        { termino: 'Tramo', definicion: 'Intervalo de importe con una tarifa propia. Requiere decidir si sus extremos entran.' },
        { termino: 'Redondeo comercial', definicion: 'Redondear al céntimo más cercano con el medio céntimo hacia arriba. Es lo que hace `Math.round` con positivos.' },
        { termino: 'UTC', definicion: 'Tiempo universal coordinado. Operar en UTC hace que el resultado no dependa de dónde se ejecute el código.' },
        { termino: 'Formato ordenable', definicion: 'Formato de fecha cuyo orden alfabético coincide con el cronológico, como `YYYY-MM-DD`.' }
      ],

      preparado: [
        '¿Por qué `4999 * 0.01` no es exactamente `49.99`, y cómo lo evitas?',
        '¿Cuánta comisión paga un pedido de 5000 céntimos exactos, y por qué?',
        '¿En qué se diferencian redondear por pedido y redondear sobre el total? ¿Cuál pide el enunciado?',
        '¿Qué devuelve `getUTCDay()` para un domingo, y cuántos días hay que retroceder para llegar al lunes?',
        '¿Por qué se puede ordenar el resultado con un `.sort()` sin comparador?'
      ]
    },

    tests: {
      mode: 'js',
      timeout: 5000,
      cases: [
        { name: 'Sin pedidos no hay desembolsos', code: 'expect(calcularDesembolsos([])).toEqual([])' },
        { name: 'Una entrada no válida devuelve [] en vez de romper', code: 'expect(calcularDesembolsos(null)).toEqual([])' },
        {
          name: 'Los pedidos sin completar no entran',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 10000, completadoEn: null }])).toEqual([])'
        },
        {
          name: 'Tramo bajo: 49,99 € paga el 1 %',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 4999, completadoEn: "2026-03-11T09:00:00Z" }])[0].comisionCent).toBe(50)'
        },
        {
          name: 'Frontera: 50,00 € exactos ya pagan el 0,95 %',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 5000, completadoEn: "2026-03-11T09:00:00Z" }])[0].comisionCent).toBe(48)'
        },
        {
          name: 'Frontera: 299,99 € siguen pagando el 0,95 %',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 29999, completadoEn: "2026-03-11T09:00:00Z" }])[0].comisionCent).toBe(285)'
        },
        {
          name: 'Frontera: 300,00 € exactos ya pagan el 0,85 %',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 30000, completadoEn: "2026-03-11T09:00:00Z" }])[0].comisionCent).toBe(255)'
        },
        {
          name: 'La comisión se redondea por pedido, no sobre el total',
          code:
            'var tres = [1, 2, 3].map(function (n) {' +
            '  return { id: "p" + n, importeCent: 1250, completadoEn: "2026-03-11T09:00:00Z" };' +
            '});' +
            'expect(calcularDesembolsos(tres)[0].comisionCent).toBe(39)'
        },
        {
          name: 'La semana se identifica con el lunes en UTC',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 1000, completadoEn: "2026-03-11T09:00:00Z" }])[0].semana).toBe("2026-03-09")'
        },
        {
          name: 'Un domingo pertenece a la semana que empieza el lunes anterior',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 1000, completadoEn: "2026-03-15T23:59:00Z" }])[0].semana).toBe("2026-03-09")'
        },
        {
          name: 'Un lunes abre su propia semana',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 1000, completadoEn: "2026-03-16T00:00:00Z" }])[0].semana).toBe("2026-03-16")'
        },
        {
          name: 'Los pedidos de la misma semana se agrupan y se suman',
          code:
            'var d = calcularDesembolsos([' +
            '  { id: "a", importeCent: 1000, completadoEn: "2026-03-09T08:00:00Z" },' +
            '  { id: "b", importeCent: 2000, completadoEn: "2026-03-15T08:00:00Z" }' +
            ']);' +
            'expect(d).toHaveLength(1); expect(d[0].pedidos).toBe(2); expect(d[0].brutoCent).toBe(3000)'
        },
        {
          name: 'El resultado va ordenado por semana ascendente',
          code:
            'var d = calcularDesembolsos([' +
            '  { id: "b", importeCent: 1000, completadoEn: "2026-03-23T08:00:00Z" },' +
            '  { id: "a", importeCent: 1000, completadoEn: "2026-03-09T08:00:00Z" }' +
            ']);' +
            'expect(d.map(function (x) { return x.semana; })).toEqual(["2026-03-09", "2026-03-23"])'
        },
        {
          name: 'El neto es siempre el bruto menos la comisión',
          code:
            'var d = calcularDesembolsos([' +
            '  { id: "a", importeCent: 45000, completadoEn: "2026-03-09T08:00:00Z" },' +
            '  { id: "b", importeCent: 7350, completadoEn: "2026-03-10T08:00:00Z" }' +
            '])[0];' +
            'expect(d.netoCent).toBe(d.brutoCent - d.comisionCent)'
        },
        {
          name: 'Un cambio de mes no rompe el cálculo del lunes',
          code: 'expect(calcularDesembolsos([{ id: "a", importeCent: 1000, completadoEn: "2026-03-01T12:00:00Z" }])[0].semana).toBe("2026-02-23")'
        },
        {
          name: 'No muta los pedidos que recibe',
          code:
            'var entrada = [{ id: "a", importeCent: 5000, completadoEn: "2026-03-11T09:00:00Z" }];' +
            'var copia = JSON.parse(JSON.stringify(entrada));' +
            'calcularDesembolsos(entrada);' +
            'expect(entrada).toEqual(copia)'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'/* Los tramos viven en un único sitio y con una sola frontera cada uno.\n' +
'   `hastaCent` es el techo EXCLUIDO del tramo, que es justo lo que dice\n' +
'   el enunciado: "menos de 50 €", "menos de 300 €".\n' +
'   Los porcentajes se expresan en puntos básicos —enteros— para que la\n' +
'   única operación con decimales sea la última, la del redondeo. */\n' +
'const TRAMOS = [\n' +
'  { hastaCent: 5000,     puntosBasicos: 100 },   // 1,00 %\n' +
'  { hastaCent: 30000,    puntosBasicos: 95  },   // 0,95 %\n' +
'  { hastaCent: Infinity, puntosBasicos: 85  }    // 0,85 %\n' +
'];\n' +
'\n' +
'function puntosBasicosDe(importeCent) {\n' +
'  for (let i = 0; i < TRAMOS.length; i++) {\n' +
'    if (importeCent < TRAMOS[i].hastaCent) return TRAMOS[i].puntosBasicos;\n' +
'  }\n' +
'  return TRAMOS[TRAMOS.length - 1].puntosBasicos;\n' +
'}\n' +
'\n' +
'function comisionDe(importeCent) {\n' +
'  return Math.round(importeCent * puntosBasicosDe(importeCent) / 10000);\n' +
'}\n' +
'\n' +
'/* Lunes de la semana a la que pertenece una fecha, en UTC.\n' +
'   getUTCDay() devuelve 0 para el domingo, así que (dia + 6) % 7 da\n' +
'   exactamente cuántos días hay que retroceder: lunes -> 0, domingo -> 6.\n' +
'   Date.UTC normaliza los desbordamientos, de modo que restar días a\n' +
'   principio de mes cae solo en el mes anterior. */\n' +
'function lunesDeLaSemana(iso) {\n' +
'  const fecha = new Date(iso);\n' +
'  const retroceso = (fecha.getUTCDay() + 6) % 7;\n' +
'  const lunes = new Date(Date.UTC(\n' +
'    fecha.getUTCFullYear(),\n' +
'    fecha.getUTCMonth(),\n' +
'    fecha.getUTCDate() - retroceso\n' +
'  ));\n' +
'  return lunes.toISOString().slice(0, 10);\n' +
'}\n' +
'\n' +
'function calcularDesembolsos(pedidos) {\n' +
'  if (!Array.isArray(pedidos)) return [];\n' +
'\n' +
'  const porSemana = {};\n' +
'\n' +
'  pedidos.forEach(function (pedido) {\n' +
'    // Sin fecha de completado no hay nada que desembolsar todavía.\n' +
'    if (!pedido || !pedido.completadoEn) return;\n' +
'\n' +
'    const semana = lunesDeLaSemana(pedido.completadoEn);\n' +
'    const acumulado = porSemana[semana] || (porSemana[semana] = {\n' +
'      semana: semana, pedidos: 0, brutoCent: 0, comisionCent: 0, netoCent: 0\n' +
'    });\n' +
'\n' +
'    acumulado.pedidos += 1;\n' +
'    acumulado.brutoCent += pedido.importeCent;\n' +
'    // Redondeo POR PEDIDO: es cada pedido el que factura su comisión.\n' +
'    acumulado.comisionCent += comisionDe(pedido.importeCent);\n' +
'  });\n' +
'\n' +
'  // "YYYY-MM-DD" ordena igual como texto que como fecha: sin comparador.\n' +
'  return Object.keys(porSemana).sort().map(function (semana) {\n' +
'    const desembolso = porSemana[semana];\n' +
'    desembolso.netoCent = desembolso.brutoCent - desembolso.comisionCent;\n' +
'    return desembolso;\n' +
'  });\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — La comisión de un pedido',
        objetivo:
          'Resolver primero la regla de negocio pequeña y verificable: dado un importe, cuánta comisión ' +
          'paga. Si esta parte está mal, todo lo demás da igual, y es la única que el equipo de ' +
          'finanzas va a mirar con lupa.',
        codigo:
'/* Los tramos viven en un único sitio y con una sola frontera cada uno.\n' +
'   `hastaCent` es el techo EXCLUIDO del tramo. */\n' +
'const TRAMOS = [\n' +
'  { hastaCent: 5000,     puntosBasicos: 100 },   // 1,00 %\n' +
'  { hastaCent: 30000,    puntosBasicos: 95  },   // 0,95 %\n' +
'  { hastaCent: Infinity, puntosBasicos: 85  }    // 0,85 %\n' +
'];\n' +
'\n' +
'function puntosBasicosDe(importeCent) {\n' +
'  for (let i = 0; i < TRAMOS.length; i++) {\n' +
'    if (importeCent < TRAMOS[i].hastaCent) return TRAMOS[i].puntosBasicos;\n' +
'  }\n' +
'  return TRAMOS[TRAMOS.length - 1].puntosBasicos;\n' +
'}\n' +
'\n' +
'function comisionDe(importeCent) {\n' +
'  return Math.round(importeCent * puntosBasicosDe(importeCent) / 10000);\n' +
'}\n' +
'\n' +
'function calcularDesembolsos(pedidos) {\n' +
'  if (!Array.isArray(pedidos)) return [];\n' +
'  return [];   // todavía sin agrupar\n' +
'}\n',
        explicacion:
          'La tabla de tramos declara cada frontera **una sola vez**. Eso elimina de raíz el error de ' +
          'escribir `< 5000` en un sitio y `>= 5001` en otro, que es de donde salen los descuadres de ' +
          'un céntimo en producción.\n' +
          'Los puntos básicos mantienen la operación en enteros hasta la división final. La alternativa ' +
          '—guardar `0.0095` y multiplicar— arrastra error de coma flotante desde el primer pedido.\n' +
          '`Infinity` como techo del último tramo evita tener que tratar el caso "y si no encaja en ' +
          'ninguno" como una excepción.',
        anadido: [
          'Tabla de tramos con la frontera declarada una sola vez.',
          'Comisión en puntos básicos, con la única división al final.',
          'Guarda para entradas no válidas.'
        ],
        comprueba: 'Ya deberían pasar los tres tests de fronteras y los dos de entradas no válidas.'
      },
      {
        titulo: 'Fase 2 — Agrupar por semana',
        objetivo:
          'Calcular a qué semana pertenece cada pedido y acumular por grupo. Aquí está la trampa del ' +
          'domingo, que es el fallo más frecuente de esta prueba.',
        codigo:
'/* Los tramos viven en un único sitio y con una sola frontera cada uno.\n' +
'   `hastaCent` es el techo EXCLUIDO del tramo. */\n' +
'const TRAMOS = [\n' +
'  { hastaCent: 5000,     puntosBasicos: 100 },   // 1,00 %\n' +
'  { hastaCent: 30000,    puntosBasicos: 95  },   // 0,95 %\n' +
'  { hastaCent: Infinity, puntosBasicos: 85  }    // 0,85 %\n' +
'];\n' +
'\n' +
'function puntosBasicosDe(importeCent) {\n' +
'  for (let i = 0; i < TRAMOS.length; i++) {\n' +
'    if (importeCent < TRAMOS[i].hastaCent) return TRAMOS[i].puntosBasicos;\n' +
'  }\n' +
'  return TRAMOS[TRAMOS.length - 1].puntosBasicos;\n' +
'}\n' +
'\n' +
'function comisionDe(importeCent) {\n' +
'  return Math.round(importeCent * puntosBasicosDe(importeCent) / 10000);\n' +
'}\n' +
'\n' +
'/* Lunes de la semana a la que pertenece una fecha, en UTC.\n' +
'   getUTCDay() devuelve 0 para el domingo, así que (dia + 6) % 7 da\n' +
'   exactamente cuántos días hay que retroceder. */\n' +
'function lunesDeLaSemana(iso) {\n' +
'  const fecha = new Date(iso);\n' +
'  const retroceso = (fecha.getUTCDay() + 6) % 7;\n' +
'  const lunes = new Date(Date.UTC(\n' +
'    fecha.getUTCFullYear(),\n' +
'    fecha.getUTCMonth(),\n' +
'    fecha.getUTCDate() - retroceso\n' +
'  ));\n' +
'  return lunes.toISOString().slice(0, 10);\n' +
'}\n' +
'\n' +
'function calcularDesembolsos(pedidos) {\n' +
'  if (!Array.isArray(pedidos)) return [];\n' +
'\n' +
'  const porSemana = {};\n' +
'\n' +
'  pedidos.forEach(function (pedido) {\n' +
'    if (!pedido || !pedido.completadoEn) return;\n' +
'\n' +
'    const semana = lunesDeLaSemana(pedido.completadoEn);\n' +
'    const acumulado = porSemana[semana] || (porSemana[semana] = {\n' +
'      semana: semana, pedidos: 0, brutoCent: 0, comisionCent: 0, netoCent: 0\n' +
'    });\n' +
'\n' +
'    acumulado.pedidos += 1;\n' +
'    acumulado.brutoCent += pedido.importeCent;\n' +
'    acumulado.comisionCent += comisionDe(pedido.importeCent);\n' +
'  });\n' +
'\n' +
'  return Object.keys(porSemana).map(function (semana) {\n' +
'    return porSemana[semana];\n' +
'  });\n' +
'}\n',
        explicacion:
          'Tres decisiones que conviene poder defender en la revisión en vivo:\n' +
          '**`(dia + 6) % 7`** en lugar de `dia - 1`. Con `getUTCDay()` el domingo es 0, así que ' +
          '`dia - 1` daría `-1` y el domingo saltaría a la semana **siguiente**. La fórmula del módulo ' +
          'convierte lunes en 0 y domingo en 6, que es cuántos días hay que retroceder.\n' +
          '**Todo en UTC.** Con `getDate()` y `new Date(a, m, d)` el resultado dependería de la zona ' +
          'horaria del servidor, y dos réplicas darían informes distintos.\n' +
          '**El acumulador nace con todos los campos a cero.** Así ninguna suma empieza en `undefined` ' +
          'y se convierte en `NaN` a la primera.',
        anadido: [
          'Cálculo del lunes de la semana, en UTC y con la fórmula correcta del módulo.',
          'Objeto acumulador por semana con todos los campos inicializados.',
          'Exclusión de los pedidos sin completar.'
        ],
        comprueba: 'Pasan ya los tests de semana, domingo, cambio de mes y agrupación. Falta el orden y el neto.'
      },
      {
        titulo: 'Fase 3 — Neto, orden y contrato cerrado',
        objetivo:
          'Cerrar el contrato de salida: calcular el neto, ordenar por semana y dejar el resultado tal ' +
          'como lo espera quien consume la función. Es la versión final.',
        codigo:
'/* Los tramos viven en un único sitio y con una sola frontera cada uno.\n' +
'   `hastaCent` es el techo EXCLUIDO del tramo, que es justo lo que dice\n' +
'   el enunciado: "menos de 50 €", "menos de 300 €".\n' +
'   Los porcentajes se expresan en puntos básicos —enteros— para que la\n' +
'   única operación con decimales sea la última, la del redondeo. */\n' +
'const TRAMOS = [\n' +
'  { hastaCent: 5000,     puntosBasicos: 100 },   // 1,00 %\n' +
'  { hastaCent: 30000,    puntosBasicos: 95  },   // 0,95 %\n' +
'  { hastaCent: Infinity, puntosBasicos: 85  }    // 0,85 %\n' +
'];\n' +
'\n' +
'function puntosBasicosDe(importeCent) {\n' +
'  for (let i = 0; i < TRAMOS.length; i++) {\n' +
'    if (importeCent < TRAMOS[i].hastaCent) return TRAMOS[i].puntosBasicos;\n' +
'  }\n' +
'  return TRAMOS[TRAMOS.length - 1].puntosBasicos;\n' +
'}\n' +
'\n' +
'function comisionDe(importeCent) {\n' +
'  return Math.round(importeCent * puntosBasicosDe(importeCent) / 10000);\n' +
'}\n' +
'\n' +
'/* Lunes de la semana a la que pertenece una fecha, en UTC.\n' +
'   getUTCDay() devuelve 0 para el domingo, así que (dia + 6) % 7 da\n' +
'   exactamente cuántos días hay que retroceder: lunes -> 0, domingo -> 6.\n' +
'   Date.UTC normaliza los desbordamientos, de modo que restar días a\n' +
'   principio de mes cae solo en el mes anterior. */\n' +
'function lunesDeLaSemana(iso) {\n' +
'  const fecha = new Date(iso);\n' +
'  const retroceso = (fecha.getUTCDay() + 6) % 7;\n' +
'  const lunes = new Date(Date.UTC(\n' +
'    fecha.getUTCFullYear(),\n' +
'    fecha.getUTCMonth(),\n' +
'    fecha.getUTCDate() - retroceso\n' +
'  ));\n' +
'  return lunes.toISOString().slice(0, 10);\n' +
'}\n' +
'\n' +
'function calcularDesembolsos(pedidos) {\n' +
'  if (!Array.isArray(pedidos)) return [];\n' +
'\n' +
'  const porSemana = {};\n' +
'\n' +
'  pedidos.forEach(function (pedido) {\n' +
'    // Sin fecha de completado no hay nada que desembolsar todavía.\n' +
'    if (!pedido || !pedido.completadoEn) return;\n' +
'\n' +
'    const semana = lunesDeLaSemana(pedido.completadoEn);\n' +
'    const acumulado = porSemana[semana] || (porSemana[semana] = {\n' +
'      semana: semana, pedidos: 0, brutoCent: 0, comisionCent: 0, netoCent: 0\n' +
'    });\n' +
'\n' +
'    acumulado.pedidos += 1;\n' +
'    acumulado.brutoCent += pedido.importeCent;\n' +
'    // Redondeo POR PEDIDO: es cada pedido el que factura su comisión.\n' +
'    acumulado.comisionCent += comisionDe(pedido.importeCent);\n' +
'  });\n' +
'\n' +
'  // "YYYY-MM-DD" ordena igual como texto que como fecha: sin comparador.\n' +
'  return Object.keys(porSemana).sort().map(function (semana) {\n' +
'    const desembolso = porSemana[semana];\n' +
'    desembolso.netoCent = desembolso.brutoCent - desembolso.comisionCent;\n' +
'    return desembolso;\n' +
'  });\n' +
'}\n',
        explicacion:
          'El neto se calcula **al final**, una vez, en lugar de irlo actualizando en cada vuelta. Es ' +
          'un campo derivado: recalcularlo en cada pedido no aporta nada y abre la puerta a que se ' +
          'quede desincronizado si alguien toca una de las dos sumas.\n' +
          'El `.sort()` va sin comparador a propósito, y eso merece un comentario en el código: solo ' +
          'es correcto porque la clave está en formato `YYYY-MM-DD`. Con `DD/MM/YYYY` sería un error ' +
          'silencioso.\n' +
          'Y una nota sobre inmutabilidad: los objetos de `porSemana` son **nuestros**, creados dentro ' +
          'de la función, así que mutarlos es correcto. Lo que no se toca en ningún momento son los ' +
          'objetos de `pedidos`, que pertenecen a quien nos llama.',
        anadido: [
          'Cálculo del neto como campo derivado, una sola vez.',
          'Orden por semana aprovechando el formato de fecha ordenable.'
        ],
        comprueba: 'Pasan los dieciséis tests.'
      }
    ],

    rationale:
      'La estructura sale de separar **tres responsabilidades que cambian por motivos distintos**: la ' +
      'tabla de tarifas (cambia cuando negocia el equipo comercial), el cálculo de la comisión (cambia ' +
      'si cambia la norma de redondeo) y la agrupación (cambia si pasan a desembolsar a diario). Cada ' +
      'una en su función, y ninguna sabe de las otras más de lo necesario.\n' +
      'La decisión que más se defiende en la revisión en vivo es la de los enteros. No es purismo: es ' +
      'que un informe que no cuadra con el banco al céntimo obliga a un cuadre manual, y ese es el ' +
      'coste real de haber usado `0.0095`.',

    alternatives: [
      { name: 'Biblioteca de decimales (decimal.js, big.js)', when: 'Hay divisiones, porcentajes compuestos o varias monedas.', tradeoff: 'Precisión arbitraria y código más expresivo, a cambio de una dependencia y de operaciones más lentas. Con enteros y una sola división, no compensa.' },
      { name: '`BigInt` para los importes', when: 'Los importes pueden superar el entero seguro de JavaScript.', tradeoff: 'Exactitud garantizada, pero no se mezcla con `Number` sin conversión explícita y complica todo el código. A 9 000 billones de céntimos de techo, aquí sobra.' },
      { name: 'Agrupar con `Map` en vez de objeto', when: 'Las claves pueden colisionar con propiedades heredadas de `Object`.', tradeoff: 'Más seguro y con orden de inserción garantizado; a cambio, ordenar y serializar es algo más verboso. Con claves de fecha, ambos valen.' },
      { name: 'Delegar la agrupación a SQL', when: 'Los pedidos ya están en base de datos.', tradeoff: 'Mucho más rápido con volumen, pero la regla de negocio se reparte entre la consulta y la aplicación, y se vuelve más difícil de probar.' },
      { name: 'Semana ISO 8601 (`2026-W11`)', when: 'El informe se comparte con sistemas que ya usan numeración de semana.', tradeoff: 'Estándar reconocible, pero la numeración a final de año tiene reglas propias y hay que implementarlas bien. La fecha del lunes es más simple y no admite interpretación.' }
    ],

    commonErrors: [
      {
        error: 'Guardar los importes en euros con decimales.',
        why: 'Es el error de esta prueba. `0.1 + 0.2 !== 0.3`, y ese error se acumula pedido a pedido hasta que el desembolso no cuadra con el banco. En una fintech es descarte directo.',
        fix: 'Enteros en céntimos de principio a fin, y porcentajes en puntos básicos.'
      },
      {
        error: 'Usar `dia - 1` para retroceder al lunes.',
        why: '`getUTCDay()` devuelve 0 para el domingo, así que la resta da `-1` y el domingo se va a la semana siguiente. Falla solo un día de cada siete, que es lo que lo hace difícil de detectar.',
        fix: '`(dia + 6) % 7`, que manda el lunes a 0 y el domingo a 6.'
      },
      {
        error: 'Sumar las comisiones sin redondear y redondear el total al final.',
        why: 'Da un resultado distinto del que se factura. Cada pedido es una línea de factura con su propia comisión ya redondeada.',
        fix: 'Redondear dentro de `comisionDe`, es decir, una vez por pedido.'
      },
      {
        error: 'Escribir las fronteras de los tramos dos veces (`< 5000` y `>= 5000`).',
        why: 'Cuando comercial renegocie los tramos, alguien cambiará una de las dos y no la otra. El fallo aparecerá meses después y solo en los importes frontera.',
        fix: 'Una tabla de tramos con un único techo por tramo.'
      },
      {
        error: 'Usar la hora local en vez de UTC.',
        why: 'El mismo conjunto de pedidos produce semanas distintas según dónde se ejecute el proceso. Es un fallo que no aparece en tu portátil y sí en producción.',
        fix: 'Las variantes `getUTC*` y `Date.UTC` en todo el cálculo.'
      },
      {
        error: 'Incluir los pedidos con `completadoEn` a `null`.',
        why: 'Se paga al comercio dinero de pedidos que aún no se han completado. Es un problema de negocio, no de código.',
        fix: 'Descartarlos al principio del bucle, y decir en voz alta que se ha entendido el motivo.'
      },
      {
        error: 'Ordenar el resultado con un comparador de fechas construyendo `Date` en cada comparación.',
        why: 'No está mal, pero es trabajo innecesario y ruido en la revisión. Con `YYYY-MM-DD` el orden de texto ya es el cronológico.',
        fix: '`.sort()` a secas, con un comentario que explique por qué basta.'
      }
    ],

    bestPractices: [
      'El dinero, en la unidad más pequeña y en enteros. Siempre.',
      'Cada regla de negocio configurable declarada en un único sitio.',
      'Enunciar los supuestos —qué redondeo, qué frontera, qué zona horaria— antes de escribir código.',
      'Campos derivados calculados una vez, no mantenidos a mano en cada iteración.',
      'No mutar nunca lo que te han pasado; los objetos que creas tú son otra cosa.',
      'Comentar solo lo que el código no puede decir: por qué el `.sort()` va sin comparador, por qué `(dia + 6) % 7`.',
      'Escribir primero los tests de frontera: son los que descubren el 90 % de los fallos de esta prueba.'
    ],

    security: [
      'Los importes vienen de fuera: conviene validar que `importeCent` es un entero no negativo antes de sumarlo, o un dato corrupto se convierte en un desembolso corrupto.',
      'Un informe de desembolsos es información financiera de un comercio concreto: el endpoint que lo sirva tiene que comprobar que quien consulta es ese comercio, no solo que está autenticado.'
    ],

    performance: [
      'Es una sola pasada sobre los pedidos, O(n), más la ordenación de las semanas, que son pocas.',
      'Construir un `Date` por pedido tiene coste. Con millones de pedidos compensa agrupar en la base de datos o cachear el lunes por fecha, ya que muchos pedidos comparten día.',
      'Acumular en un objeto evita crear arrays intermedios por grupo, que es lo que hace lento el patrón "filtrar por cada semana".'
    ],

    companyLooksFor: [
      'Que uses enteros para el dinero sin que nadie te lo pida.',
      'Que trates las fronteras de los tramos a propósito y sepas decir qué pasa en 50,00 € exactos.',
      'Que distingas redondear por pedido de redondear el total, y sepas por qué el negocio pide lo primero.',
      'Que la regla de negocio esté en un sitio del que se pueda sacar sin reescribir la función.',
      'Que puedas defender cada decisión en la revisión en vivo: esa segunda ronda existe precisamente para eso.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Aritmética entera del dinero, sin coma flotante', weight: 25 },
        { criteria: 'Comisión correcta en las tres fronteras de tramo', weight: 25 },
        { criteria: 'Agrupación semanal correcta, incluido el domingo', weight: 20 },
        { criteria: 'Redondeo por pedido y neto derivado', weight: 15 },
        { criteria: 'Reglas de negocio aisladas y código defendible', weight: 15 }
      ]
    },

    reinforce: [
      'Repetir el cálculo con una comisión mínima mensual: es la ampliación que suelen pedir en la ronda de defensa.',
      'Estudiar cómo se representa el dinero en un sistema real: enteros, decimales de precisión fija y por qué casi nadie usa coma flotante.',
      'Repasar la prueba de la ventana deslizante: los tramos y los intervalos de tiempo comparten exactamente la misma trampa de frontera.',
      'Practicar la explicación en voz alta de por qué se redondea por pedido; es una pregunta de entrevista, no solo de código.'
    ]
  });

  /* ------------------------------------------------------------------
     2. Máquina expendedora — modelado de dominio y cambio limitado
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'bcn-maquina-expendedora',
    empresa: {
      empresas: ['holded', 'seatcode', 'cabify'],
      evidencia: 'documentada',
      puesto: 'Senior Backend Engineer',
      rol: 'backend',
      formato: 'take-home',
      dificultad: 4,
      evalua: [
        'Modelado de dominio: cómo representas reglas de negocio con estado y que sigan siendo legibles.',
        'Extensibilidad: qué hay que tocar para añadir un producto, una moneda o una regla nueva.',
        'Reconocer que el algoritmo obvio —dar siempre la moneda más grande— falla con inventario limitado.',
        'Estados de error tratados como parte del diseño, no como excepciones sueltas.'
      ],
      nota:
        'Holded publica el enunciado de sus pruebas técnicas en un repositorio público de GitHub, y el ' +
        'de Senior Backend Engineer es exactamente una máquina expendedora, con el detalle explícito ' +
        'de que la máquina debe llevar la cuenta del **cambio disponible**. Su enunciado pide PHP y ' +
        'evalúa con rúbrica; aquí se traslada el problema a JavaScript y se añaden tests automáticos ' +
        'para que se pueda practicar solo. El contrato de la función, los casos y la solución son ' +
        'originales nuestros.',
      fuentes: [
        { titulo: 'Reto de Senior Backend Engineer de Holded (máquina expendedora)', url: 'https://github.com/holdedhub/careers/blob/main/challenges/backend/README.md' },
        { titulo: 'holdedhub/careers — repositorio público de contratación', url: 'https://github.com/holdedhub/careers' },
        { titulo: 'SEAT CODE — Join Us: proceso de tres fases con prueba práctica', url: 'https://www.code.seat/workwithus' }
      ]
    },
    categorias: ['backend', 'javascript'],
    title: 'Máquina expendedora: el cambio que no siempre se puede dar',
    category: 'architecture',
    kind: 'build',
    level: 'senior',
    time: 75,
    tags: ['modelado de dominio', 'estado', 'algoritmos', 'backtracking', 'Barcelona'],

    context:
      'Prueba para casa de una empresa de Barcelona que la publica en abierto, con una advertencia poco ' +
      'habitual en el enunciado: *"no se trata de que simplemente funcione"*. Avisan de que un script ' +
      'de un solo archivo que procesa comandos no demuestra nivel senior, y de que tendrás que ' +
      'defender cada decisión de arquitectura en una entrevista posterior.\n' +
      'También dicen algo que casi nadie escribe: **puedes usar IA**, pero el código que entregues ' +
      'tiene que ser código que entiendas lo bastante como para explicarlo, modificarlo y ampliarlo ' +
      'si las herramientas de IA desaparecieran mañana.',

    situation:
      'La máquina acepta monedas de 5, 10, 25 y 100 céntimos. Tiene artículos con precio y existencias, ' +
      'y un inventario de monedas para dar cambio. Un operario puede abrirla para reponer ambas cosas.\n\n' +
      'El detalle que hunde la mayoría de las entregas está en una sola línea del enunciado: la máquina ' +
      '**lleva la cuenta del cambio disponible**. Es decir, no siempre puede dar cambio. Y cuando no ' +
      'puede, no vende: devuelve el dinero.\n\n' +
      'Hay una segunda trampa, más silenciosa: las monedas que el cliente acaba de meter **también ' +
      'sirven para dar cambio**. El cambio se calcula sobre el inventario resultante, no sobre el que ' +
      'había antes de la compra.',

    goal:
      'Implementar `crearMaquina(configuracion)`, que devuelve un objeto con las operaciones de la ' +
      'máquina: insertar moneda, seleccionar artículo, devolver el dinero, hacer servicio y consultar ' +
      'el estado.',

    tech: ['JavaScript', 'Node.js'],
    skills: ['modelado de dominio', 'máquinas de estado', 'backtracking', 'diseño de API', 'casos límite'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * Máquina expendedora con cambio limitado.\n' +
' *\n' +
' * @param {{\n' +
' *   articulos: Object<string, {precioCent:number, stock:number}>,\n' +
' *   cambio:    Object<number, number>      // valor de moneda -> unidades\n' +
' * }} configuracion\n' +
' *\n' +
' * @returns {{\n' +
' *   insertar(monedaCent): {ok:boolean, saldoCent?:number, error?:string, devuelto?:number[]},\n' +
' *   seleccionar(codigo): {ok:boolean, articulo?:string, cambio?:number[],\n' +
' *                         error?:string, faltanCent?:number, devuelto?:number[]},\n' +
' *   devolver(): {ok:boolean, devuelto:number[]},\n' +
' *   servicio(reposicion): {ok:boolean},\n' +
' *   estado(): {articulos:Object, cambio:Object, insertadas:number[]}\n' +
' * }}\n' +
' *\n' +
' * Monedas aceptadas: 5, 10, 25 y 100 céntimos.\n' +
' *\n' +
' * Errores posibles al seleccionar:\n' +
' *   ARTICULO_DESCONOCIDO   el código no existe\n' +
' *   SIN_STOCK              no quedan unidades\n' +
' *   FONDOS_INSUFICIENTES   falta dinero (se conserva lo insertado)\n' +
' *   SIN_CAMBIO             no se puede componer la vuelta (se DEVUELVE el dinero)\n' +
' */\n' +
'function crearMaquina(configuracion) {\n' +
'  // Tu solución aquí.\n' +
'}\n'
    },

    requirements: [
      'Aceptar solo monedas de 5, 10, 25 y 100 céntimos; cualquier otra se rechaza y se devuelve.',
      '`devolver()` reintegra **exactamente** las monedas insertadas, no un equivalente.',
      'Si falta dinero, no se vende y **se conserva** lo insertado, indicando cuánto falta.',
      'Si no quedan existencias, no se vende y se conserva lo insertado.',
      'Si no se puede componer el cambio con las monedas disponibles, **no se vende y se devuelve el dinero**.',
      'Las monedas recién insertadas cuentan como cambio disponible para esa misma venta.',
      'El cambio debe encontrarse **si existe alguna combinación posible**, aunque no sea la que sale de coger siempre la moneda más grande.',
      '`servicio(reposicion)` repone artículos y monedas sin perder lo que ya había.',
      '`estado()` devuelve una copia: quien la reciba no puede alterar la máquina.',
      'No mutar el objeto de configuración recibido.'
    ],

    optional: [
      'Registrar un histórico de operaciones para que el operario pueda auditar la recaudación.',
      'Permitir configurar el juego de monedas en la construcción, en vez de fijarlo en el módulo.',
      'Devolver, cuando no hay cambio, cuánto dinero exacto habría que insertar para que sí lo hubiera.'
    ],

    hints: [
      'Antes de escribir nada, enumera los estados de salida de `seleccionar`. Son cinco: vendido y cuatro formas de no vender. Si los tienes claros, el código se escribe solo.',
      'Ojo con el orden de las operaciones: el cambio se calcula sobre el inventario **después** de añadir las monedas insertadas. Es el detalle que más entregas suspende.',
      'Coger siempre la moneda más grande que quepa funciona con monedas infinitas. Con inventario limitado, no. Busca un contraejemplo con monedas de 25 y de 10 antes de seguir.',
      'Cuando el algoritmo obvio falla, el patrón es **probar y retroceder**: para cada valor, prueba desde el máximo número de monedas que caben hasta cero, y sigue con el valor siguiente.',
      'Empieza por el valor más grande al buscar: así la primera combinación que encuentres será también la de menos monedas, que es lo que espera un cliente.',
      'Si `SIN_CAMBIO` devuelve el dinero, ese caso tiene que dejar la máquina exactamente como estaba: ni artículo menos, ni moneda de más.'
    ],

    docs: {
      resumen:
        'Dos problemas en uno. El primero es de **modelado**: cinco resultados posibles de una compra, ' +
        'un estado que hay que mantener coherente y una API que otros van a usar. El segundo es ' +
        '**algorítmico** y es el que separa las entregas: con inventario limitado de monedas, dar ' +
        'siempre la más grande no funciona, y hay que probar y retroceder.',

      conceptos: [
        {
          titulo: 'Por qué el algoritmo goloso falla aquí',
          texto:
            'Con monedas de 5, 10, 25 y 100 y existencias **infinitas**, coger siempre la mayor que ' +
            'quepa da la solución óptima. Ese sistema de monedas es "canónico" y por eso el método ' +
            'goloso funciona con el euro o el dólar.\n' +
            'Con existencias **limitadas** deja de funcionar, y no hace falta un caso rebuscado. ' +
            'Supón que hay que devolver 30 céntimos y quedan una moneda de 25 y tres de 10. El método ' +
            'goloso coge la de 25, se queda con 5 por devolver, no hay monedas de 5 y concluye que no ' +
            'puede dar cambio. Pero sí puede: tres monedas de 10.\n' +
            'El error no es "coger la grande primero": es **no poder deshacer esa decisión**. Cuando ' +
            'una elección temprana puede invalidar la solución, la técnica correcta es probar y ' +
            'retroceder, no elegir y seguir.',
          codigo:
'// Devolver 30 con inventario { 25: 1, 10: 3, 5: 0 }\n' +
'//\n' +
'//  GOLOSO      25 -> quedan 5 -> no hay monedas de 5 -> "sin cambio"   ✗\n' +
'//  RETROCESO   25 x1 -> callejón sin salida -> se DESHACE\n' +
'//              25 x0 -> 10 x3 = 30                                     ✓\n' +
'//\n' +
'// El goloso no es más rápido aquí: es que directamente da mal el resultado.'
        },
        {
          titulo: 'Probar y retroceder sobre valores con existencias',
          texto:
            'El esquema es siempre el mismo y cabe en quince líneas.\n' +
            'Recorres los valores **de mayor a menor**. Para cada valor calculas cuántas monedas de ese ' +
            'valor podrías usar como mucho: el mínimo entre las que quedan en el inventario y las que ' +
            'caben en lo que falta por devolver. Y pruebas desde ese máximo hacia abajo, hasta cero.\n' +
            'Si al llegar al final del recorrido queda algo por devolver, esa rama no vale y se ' +
            'retrocede a la anterior para probar con una moneda menos.\n' +
            'Empezar por el máximo tiene una ventaja práctica: la **primera** combinación válida que ' +
            'encuentras usa el menor número de monedas, que es lo que espera cualquiera que compre. ' +
            'No hace falta explorar el resto ni comparar soluciones.\n' +
            'El coste en el peor caso es exponencial, pero el espacio de búsqueda aquí es diminuto: ' +
            'cuatro valores y un cambio siempre menor que una moneda de 100.',
          codigo:
'function buscar(i, restante, elegidas) {\n' +
'  if (restante === 0) return elegidas;          // solución encontrada\n' +
'  if (i >= valores.length) return null;         // sin más valores: rama muerta\n' +
'\n' +
'  const valor  = valores[i];\n' +
'  const maximo = Math.min(inventario[valor], Math.floor(restante / valor));\n' +
'\n' +
'  for (let n = maximo; n >= 0; n--) {           // de más monedas a menos\n' +
'    const siguiente = elegidas.slice();\n' +
'    for (let k = 0; k < n; k++) siguiente.push(valor);\n' +
'\n' +
'    const resultado = buscar(i + 1, restante - valor * n, siguiente);\n' +
'    if (resultado) return resultado;            // vale: se corta la búsqueda\n' +
'  }\n' +
'  return null;                                  // ninguna cantidad funcionó\n' +
'}'
        },
        {
          titulo: 'Los estados de error son parte del diseño, no un añadido',
          texto:
            'Una compra tiene cinco desenlaces, y cada uno deja la máquina en un estado distinto:\n' +
            '**Vendido** — baja el stock, entran las monedas, sale el cambio, se vacía lo insertado.\n' +
            '**Artículo desconocido** — no cambia nada.\n' +
            '**Sin stock** — no cambia nada, el dinero **se queda dentro** para que elijas otra cosa.\n' +
            '**Fondos insuficientes** — no cambia nada, el dinero se queda dentro, y conviene decir ' +
            'cuánto falta.\n' +
            '**Sin cambio** — no cambia nada **y el dinero se devuelve**, porque retenerlo sería quedarse ' +
            'con dinero de un cliente al que no le has vendido.\n' +
            'Que dos de ellos conserven el dinero y uno lo devuelva no es un capricho: es la regla de ' +
            'negocio. Enumerarlos antes de programar es lo que evita descubrirlos a base de tests que ' +
            'fallan.',
          codigo:
'// El contrato de salida, escrito antes que el código:\n' +
'//\n' +
'//  { ok: true,  articulo: "AGUA", cambio: [25, 10] }\n' +
'//\n' +
'//  { ok: false, error: "ARTICULO_DESCONOCIDO" }\n' +
'//  { ok: false, error: "SIN_STOCK" }                    dinero dentro\n' +
'//  { ok: false, error: "FONDOS_INSUFICIENTES", faltanCent: 15 }   dinero dentro\n' +
'//  { ok: false, error: "SIN_CAMBIO", devuelto: [100] }  dinero FUERA\n' +
'//\n' +
'// Códigos de error estables, no frases: quien consume la API decide\n' +
'// qué mensaje enseñar y en qué idioma.'
        },
        {
          titulo: 'Estado encapsulado con un cierre',
          texto:
            'La máquina tiene estado —artículos, monedas, lo insertado— y ese estado debe ser ' +
            'imposible de corromper desde fuera. Sin clases, el mecanismo idiomático en JavaScript es ' +
            'una función que declara variables locales y devuelve un objeto con métodos que las ' +
            'capturan: un **cierre**.\n' +
            'De ahí salen dos reglas que un revisor mira siempre:\n' +
            '**Copiar la configuración de entrada** al construir. Si guardas el objeto que te pasaron, ' +
            'quien te llama puede cambiar los precios después, y además tú estarías mutándole su dato.\n' +
            '**Devolver copias en `estado()`**. Si devuelves el objeto interno, cualquiera puede ' +
            'escribirle `stock = 9999` y todas tus reglas dejan de servir para nada.',
          codigo:
'function crearContador(inicial) {\n' +
'  let valor = inicial;                 // inaccesible desde fuera\n' +
'\n' +
'  return {\n' +
'    sumar: function (n) { valor += n; return valor; },\n' +
'    leer:  function () { return valor; }\n' +
'  };\n' +
'}\n' +
'\n' +
'const c = crearContador(10);\n' +
'c.valor;        // undefined: no hay forma de tocarlo\n' +
'c.sumar(5);     // 15\n' +
'\n' +
'// Con objetos hay que copiar además al leer:\n' +
'//   estado: function () { return { cambio: Object.assign({}, cambio) }; }\n' +
'// Si devolvieras `cambio` directamente, sería editable desde fuera.'
        },
        {
          titulo: 'Todo o nada: no dejar la máquina a medias',
          texto:
            'Una venta toca cuatro cosas: el stock del artículo, el inventario de monedas, las ' +
            'monedas insertadas y lo que se entrega. Si algo falla a mitad —y `SIN_CAMBIO` falla ' +
            'justo a mitad— la máquina no puede quedarse con el stock descontado y el dinero dentro.\n' +
            'La forma de garantizarlo sin transacciones es **calcular primero y aplicar después**: ' +
            'no se toca nada hasta saber que la venta va a salir bien. En el código, eso significa ' +
            'que la llamada que busca el cambio ocurre **antes** de cualquier resta, y que el camino ' +
            'de error sale de la función sin haber modificado ni una variable.\n' +
            'Es la misma idea que una transacción de base de datos, aplicada a un objeto en memoria: ' +
            'todas las escrituras juntas, al final, o ninguna.',
          codigo:
'// FRÁGIL: descuenta antes de saber si podrá dar el cambio\n' +
'articulo.stock -= 1;\n' +
'const vuelta = calcularCambio(...);\n' +
'if (!vuelta) return { ok: false, error: "SIN_CAMBIO" };   // stock perdido ✗\n' +
'\n' +
'// CORRECTO: primero se comprueba todo, después se aplica todo\n' +
'const vuelta = calcularCambio(disponible, saldo - articulo.precioCent);\n' +
'if (!vuelta) { /* devolver dinero y salir sin tocar nada */ }\n' +
'\n' +
'cambio = disponible;\n' +
'vuelta.forEach(function (m) { cambio[m] -= 1; });\n' +
'articulo.stock -= 1;\n' +
'insertadas = [];'
        }
      ],

      referencia: [
        { nombre: 'Object.keys(o).map(Number)', texto: 'Las claves de un objeto son cadenas. Con monedas como clave numérica hay que convertirlas antes de operar.' },
        { nombre: 'Object.assign({}, o)', texto: 'Copia superficial de un objeto. Suficiente para el inventario de monedas, que es plano.' },
        { nombre: 'array.slice()', texto: 'Copia de un array. Necesaria tanto al ramificar en la búsqueda como al devolver las monedas insertadas.' },
        { nombre: 'array.indexOf(v)', texto: 'Comprobación de pertenencia a la lista de monedas válidas.' },
        { nombre: 'Math.floor(a / b)', texto: 'Cuántas monedas de un valor caben en lo que falta por devolver.' },
        { nombre: 'array.reduce(fn, 0)', texto: 'Sumar las monedas insertadas para conocer el saldo.' },
        { nombre: 'Cierre (closure)', texto: 'Una función que devuelve un objeto cuyos métodos capturan variables locales. Es la forma de tener estado privado sin clases.' }
      ],

      ejemplo: {
        titulo: 'Problema ANÁLOGO resuelto: repartir un pedido entre cajas de tamaño limitado',
        codigo:
'/**\n' +
' * Un pedido de N unidades hay que enviarlo en cajas de tamaños fijos,\n' +
' * y de cada tamaño quedan unas pocas en el almacén. Hay que llenarlas\n' +
' * EXACTAMENTE: no se admite hueco ni exceso.\n' +
' *\n' +
' * Es el mismo esqueleto de probar-y-retroceder, con otro dominio.\n' +
' */\n' +
'function repartirEnCajas(unidades, existencias) {\n' +
'  const tamanos = Object.keys(existencias)\n' +
'    .map(Number)\n' +
'    .sort(function (a, b) { return b - a; });      // de mayor a menor\n' +
'\n' +
'  function buscar(i, restantes, usadas) {\n' +
'    if (restantes === 0) return usadas;\n' +
'    if (i >= tamanos.length) return null;\n' +
'\n' +
'    const tamano = tamanos[i];\n' +
'    const maximo = Math.min(existencias[tamano], Math.floor(restantes / tamano));\n' +
'\n' +
'    for (let n = maximo; n >= 0; n--) {\n' +
'      const siguiente = usadas.slice();\n' +
'      for (let k = 0; k < n; k++) siguiente.push(tamano);\n' +
'\n' +
'      const resultado = buscar(i + 1, restantes - tamano * n, siguiente);\n' +
'      if (resultado) return resultado;\n' +
'    }\n' +
'    return null;\n' +
'  }\n' +
'\n' +
'  return buscar(0, unidades, []);\n' +
'}\n' +
'\n' +
'repartirEnCajas(30, { 25: 1, 10: 3 });   // [10, 10, 10]  ← el goloso fallaría\n' +
'repartirEnCajas(30, { 25: 1, 5: 1 });    // [25, 5]\n' +
'repartirEnCajas(30, { 25: 1 });          // null: no hay reparto exacto',
        texto:
          'El motor de búsqueda es literalmente el que necesitas: valores ordenados de mayor a menor, ' +
          'un tope por valor que combina existencias y espacio restante, y un bucle descendente que ' +
          'permite retroceder.\n' +
          'Lo que **no** te da el ejemplo es todo lo demás, que es la mitad de la prueba: el estado de ' +
          'la máquina, el orden en que se aplican los cambios, los cinco desenlaces de una compra y el ' +
          'detalle de que las monedas insertadas se incorporan al inventario **antes** de calcular la ' +
          'vuelta. El algoritmo es el ladrillo; el modelado es la casa.'
      },

      glosario: [
        { termino: 'Algoritmo goloso', definicion: 'El que toma en cada paso la decisión que parece mejor sin revisarla después. Óptimo solo en algunos problemas.' },
        { termino: 'Backtracking', definicion: 'Probar una opción, explorar a fondo y deshacerla si no lleva a solución. En español, "vuelta atrás".' },
        { termino: 'Sistema de monedas canónico', definicion: 'Aquel en el que el método goloso da siempre el mínimo de monedas. El euro lo es… con existencias infinitas.' },
        { termino: 'Cierre', definicion: 'Función que conserva acceso a las variables del ámbito donde se creó. La base del estado privado en JavaScript.' },
        { termino: 'Atomicidad', definicion: 'Que una operación se aplique entera o no se aplique. Aquí se consigue calculando todo antes de escribir nada.' },
        { termino: 'Código de error', definicion: 'Identificador estable de un fallo, independiente del mensaje que se muestre al usuario.' },
        { termino: 'Copia superficial', definicion: 'Copia de un nivel del objeto. Basta cuando los valores son primitivos, como el inventario de monedas.' }
      ],

      preparado: [
        '¿Sabes construir un caso con monedas de 25 y de 10 donde el método goloso falle?',
        '¿Cuáles son los cinco desenlaces de `seleccionar`, y en cuáles se devuelve el dinero?',
        '¿Por qué hay que calcular el cambio antes de descontar el stock?',
        '¿Qué pasa si `estado()` devuelve el objeto interno en vez de una copia?',
        '¿Por qué las monedas recién insertadas cambian el resultado del cálculo del cambio?'
      ]
    },

    tests: {
      mode: 'js',
      timeout: 5000,
      setup:
        'function config() {\n' +
        '  return {\n' +
        '    articulos: {\n' +
        '      AGUA:     { precioCent: 65,  stock: 2 },\n' +
        '      ZUMO:     { precioCent: 100, stock: 1 },\n' +
        '      REFRESCO: { precioCent: 150, stock: 0 }\n' +
        '    },\n' +
        '    cambio: { 5: 4, 10: 4, 25: 4, 100: 0 }\n' +
        '  };\n' +
        '}\n',
      cases: [
        {
          name: 'Importe exacto: entrega el artículo y no da cambio',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(25); m.insertar(25); m.insertar(10); m.insertar(5);\n' +
            'var r = m.seleccionar("AGUA");\n' +
            'expect(r.ok).toBe(true); expect(r.articulo).toBe("AGUA"); expect(r.cambio).toEqual([])'
        },
        {
          name: 'Con una moneda de 1 € devuelve 35 en el menor número de monedas',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(100);\n' +
            'var r = m.seleccionar("AGUA");\n' +
            'expect(r.ok).toBe(true); expect(r.cambio).toEqual([25, 10])'
        },
        {
          name: 'Rechaza una moneda que no acepta y la devuelve',
          code:
            'var m = crearMaquina(config());\n' +
            'var r = m.insertar(2);\n' +
            'expect(r.ok).toBe(false); expect(r.error).toBe("MONEDA_NO_VALIDA");\n' +
            'expect(m.estado().insertadas).toEqual([])'
        },
        {
          name: 'Fondos insuficientes: no vende, conserva el dinero y dice cuánto falta',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(25);\n' +
            'var r = m.seleccionar("AGUA");\n' +
            'expect(r.ok).toBe(false); expect(r.error).toBe("FONDOS_INSUFICIENTES");\n' +
            'expect(r.faltanCent).toBe(40); expect(m.estado().insertadas).toEqual([25])'
        },
        {
          name: 'Sin existencias: no vende y conserva el dinero',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(100); m.insertar(100);\n' +
            'var r = m.seleccionar("REFRESCO");\n' +
            'expect(r.error).toBe("SIN_STOCK"); expect(m.estado().insertadas).toHaveLength(2)'
        },
        {
          name: 'Un artículo que no existe no altera nada',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(100);\n' +
            'expect(m.seleccionar("CERVEZA").error).toBe("ARTICULO_DESCONOCIDO");\n' +
            'expect(m.estado().insertadas).toEqual([100])'
        },
        {
          name: 'devolver() reintegra exactamente las monedas insertadas',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(10); m.insertar(25); m.insertar(10);\n' +
            'var r = m.devolver();\n' +
            'expect(r.devuelto).toEqual([10, 25, 10]);\n' +
            'expect(m.estado().insertadas).toEqual([])'
        },
        {
          name: 'EL CASO CLAVE: encuentra el cambio aunque el método goloso falle',
          code:
            'var c = config();\n' +
            'c.cambio = { 5: 0, 10: 1, 25: 0, 100: 0 };\n' +
            'var m = crearMaquina(c);\n' +
            '// 25+25+25+10+10 = 95 por un agua de 65 -> hay que devolver 30.\n' +
            '// Tras insertar, el inventario es { 10: 3, 25: 3 }: el goloso cogería\n' +
            '// 25 y se quedaría sin poder completar los 5 restantes.\n' +
            'm.insertar(25); m.insertar(25); m.insertar(25); m.insertar(10); m.insertar(10);\n' +
            'var r = m.seleccionar("AGUA");\n' +
            'expect(r.ok).toBe(true); expect(r.cambio).toEqual([10, 10, 10])'
        },
        {
          name: 'Las monedas insertadas cuentan como cambio disponible',
          code:
            'var c = config();\n' +
            'c.cambio = { 5: 0, 10: 1, 25: 0, 100: 0 };\n' +
            'var m = crearMaquina(c);\n' +
            '// 25x4 = 100 por un agua de 65 -> hay que devolver 35.\n' +
            '// En el inventario NO había ninguna moneda de 25: las cuatro que\n' +
            '// devuelven el cambio son las que el cliente acaba de insertar.\n' +
            'm.insertar(25); m.insertar(25); m.insertar(25); m.insertar(25);\n' +
            'var r = m.seleccionar("AGUA");\n' +
            'expect(r.ok).toBe(true); expect(r.cambio).toEqual([25, 10])'
        },
        {
          name: 'Sin cambio posible: no vende, devuelve el dinero y no toca el stock',
          code:
            'var c = config();\n' +
            'c.cambio = { 5: 0, 10: 0, 25: 0, 100: 0 };\n' +
            'var m = crearMaquina(c);\n' +
            'm.insertar(100);\n' +
            'var r = m.seleccionar("AGUA");\n' +
            'expect(r.ok).toBe(false); expect(r.error).toBe("SIN_CAMBIO");\n' +
            'expect(r.devuelto).toEqual([100]);\n' +
            'expect(m.estado().articulos.AGUA.stock).toBe(2)'
        },
        {
          name: 'Tras vender, baja el stock y el inventario refleja lo cobrado',
          code:
            'var m = crearMaquina(config());\n' +
            'm.insertar(25); m.insertar(25); m.insertar(10); m.insertar(5);\n' +
            'm.seleccionar("AGUA");\n' +
            'var e = m.estado();\n' +
            'expect(e.articulos.AGUA.stock).toBe(1);\n' +
            'expect(e.cambio[25]).toBe(6); expect(e.insertadas).toEqual([])'
        },
        {
          name: 'servicio() repone artículos y monedas sin perder lo que había',
          code:
            'var m = crearMaquina(config());\n' +
            'm.servicio({ articulos: { REFRESCO: { stock: 3 } }, cambio: { 5: 10 } });\n' +
            'var e = m.estado();\n' +
            'expect(e.articulos.REFRESCO.stock).toBe(3);\n' +
            'expect(e.cambio[5]).toBe(10); expect(e.cambio[25]).toBe(4)'
        },
        {
          name: 'estado() devuelve una copia: no se puede alterar la máquina desde fuera',
          code:
            'var m = crearMaquina(config());\n' +
            'var e = m.estado();\n' +
            'e.articulos.AGUA.stock = 999; e.cambio[25] = 999;\n' +
            'expect(m.estado().articulos.AGUA.stock).toBe(2);\n' +
            'expect(m.estado().cambio[25]).toBe(4)'
        },
        {
          name: 'No muta la configuración recibida',
          code:
            'var c = config();\n' +
            'var copia = JSON.parse(JSON.stringify(c));\n' +
            'var m = crearMaquina(c);\n' +
            'm.insertar(100); m.seleccionar("AGUA");\n' +
            'expect(c).toEqual(copia)'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'const MONEDAS_VALIDAS = [5, 10, 25, 100];\n' +
'\n' +
'/**\n' +
' * Busca una combinación EXACTA de monedas que sume `objetivoCent`,\n' +
' * respetando las existencias de `inventario`.\n' +
' *\n' +
' * No se puede usar el método goloso: con existencias limitadas, coger\n' +
' * siempre la moneda mayor puede llevar a un callejón sin salida aunque\n' +
' * exista solución (devolver 30 con { 25: 1, 10: 3 } es el caso clásico).\n' +
' * Por eso se prueba y se retrocede.\n' +
' *\n' +
' * Se recorren los valores de mayor a menor y, dentro de cada uno, del\n' +
' * máximo número de monedas hacia abajo. Así la PRIMERA solución que se\n' +
' * encuentra es también la de menos monedas, y se puede cortar ahí.\n' +
' *\n' +
' * @returns {number[]|null} las monedas a entregar, o null si no hay forma.\n' +
' */\n' +
'function calcularCambio(inventario, objetivoCent) {\n' +
'  const valores = Object.keys(inventario)\n' +
'    .map(Number)\n' +
'    .sort(function (a, b) { return b - a; });\n' +
'\n' +
'  function buscar(indice, restante, elegidas) {\n' +
'    if (restante === 0) return elegidas;\n' +
'    if (indice >= valores.length) return null;\n' +
'\n' +
'    const valor = valores[indice];\n' +
'    const maximo = Math.min(inventario[valor], Math.floor(restante / valor));\n' +
'\n' +
'    for (let n = maximo; n >= 0; n--) {\n' +
'      const siguiente = elegidas.slice();\n' +
'      for (let k = 0; k < n; k++) siguiente.push(valor);\n' +
'\n' +
'      const resultado = buscar(indice + 1, restante - valor * n, siguiente);\n' +
'      if (resultado) return resultado;\n' +
'    }\n' +
'    return null;\n' +
'  }\n' +
'\n' +
'  return buscar(0, objetivoCent, []);\n' +
'}\n' +
'\n' +
'function crearMaquina(configuracion) {\n' +
'  /* Se COPIA todo lo que llega: quien nos construye conserva su objeto\n' +
'     intacto y no puede cambiarnos los precios por detrás. */\n' +
'  const articulos = {};\n' +
'  Object.keys(configuracion.articulos).forEach(function (codigo) {\n' +
'    articulos[codigo] = {\n' +
'      precioCent: configuracion.articulos[codigo].precioCent,\n' +
'      stock: configuracion.articulos[codigo].stock\n' +
'    };\n' +
'  });\n' +
'\n' +
'  let cambio = {};\n' +
'  MONEDAS_VALIDAS.forEach(function (moneda) {\n' +
'    cambio[moneda] = (configuracion.cambio && configuracion.cambio[moneda]) || 0;\n' +
'  });\n' +
'\n' +
'  let insertadas = [];\n' +
'\n' +
'  function saldoCent() {\n' +
'    return insertadas.reduce(function (total, moneda) { return total + moneda; }, 0);\n' +
'  }\n' +
'\n' +
'  function vaciarMonedero() {\n' +
'    const devuelto = insertadas.slice();\n' +
'    insertadas = [];\n' +
'    return devuelto;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    insertar: function (monedaCent) {\n' +
'      if (MONEDAS_VALIDAS.indexOf(monedaCent) === -1) {\n' +
'        return { ok: false, error: "MONEDA_NO_VALIDA", devuelto: [monedaCent] };\n' +
'      }\n' +
'      insertadas.push(monedaCent);\n' +
'      return { ok: true, saldoCent: saldoCent() };\n' +
'    },\n' +
'\n' +
'    devolver: function () {\n' +
'      return { ok: true, devuelto: vaciarMonedero() };\n' +
'    },\n' +
'\n' +
'    seleccionar: function (codigo) {\n' +
'      const articulo = articulos[codigo];\n' +
'\n' +
'      /* Primero las comprobaciones que NO tocan nada. Cada una deja la\n' +
'         máquina como estaba, con el dinero dentro para que el cliente\n' +
'         pueda elegir otra cosa o pedir la devolución. */\n' +
'      if (!articulo) return { ok: false, error: "ARTICULO_DESCONOCIDO" };\n' +
'      if (articulo.stock <= 0) return { ok: false, error: "SIN_STOCK" };\n' +
'\n' +
'      const saldo = saldoCent();\n' +
'      if (saldo < articulo.precioCent) {\n' +
'        return {\n' +
'          ok: false, error: "FONDOS_INSUFICIENTES",\n' +
'          faltanCent: articulo.precioCent - saldo\n' +
'        };\n' +
'      }\n' +
'\n' +
'      /* Las monedas recién insertadas YA forman parte del cambio: se\n' +
'         calcula sobre el inventario resultante, no sobre el anterior.\n' +
'         Se trabaja sobre una copia para no dejar la máquina a medias si\n' +
'         resulta que no hay cambio posible. */\n' +
'      const disponible = {};\n' +
'      MONEDAS_VALIDAS.forEach(function (moneda) { disponible[moneda] = cambio[moneda]; });\n' +
'      insertadas.forEach(function (moneda) { disponible[moneda] += 1; });\n' +
'\n' +
'      const vuelta = calcularCambio(disponible, saldo - articulo.precioCent);\n' +
'\n' +
'      /* Sin cambio no se vende, y el dinero se devuelve: quedárselo sería\n' +
'         cobrar por algo que no se ha entregado. */\n' +
'      if (!vuelta) {\n' +
'        return { ok: false, error: "SIN_CAMBIO", devuelto: vaciarMonedero() };\n' +
'      }\n' +
'\n' +
'      /* A partir de aquí ya no puede fallar nada: todas las escrituras\n' +
'         juntas, al final. */\n' +
'      cambio = disponible;\n' +
'      vuelta.forEach(function (moneda) { cambio[moneda] -= 1; });\n' +
'      articulo.stock -= 1;\n' +
'      insertadas = [];\n' +
'\n' +
'      return { ok: true, articulo: codigo, cambio: vuelta };\n' +
'    },\n' +
'\n' +
'    servicio: function (reposicion) {\n' +
'      reposicion = reposicion || {};\n' +
'\n' +
'      Object.keys(reposicion.articulos || {}).forEach(function (codigo) {\n' +
'        const nuevo = reposicion.articulos[codigo];\n' +
'        const actual = articulos[codigo] || (articulos[codigo] = { precioCent: 0, stock: 0 });\n' +
'        if (nuevo.precioCent !== undefined) actual.precioCent = nuevo.precioCent;\n' +
'        if (nuevo.stock !== undefined) actual.stock = nuevo.stock;\n' +
'      });\n' +
'\n' +
'      Object.keys(reposicion.cambio || {}).forEach(function (moneda) {\n' +
'        if (MONEDAS_VALIDAS.indexOf(Number(moneda)) !== -1) {\n' +
'          cambio[moneda] = reposicion.cambio[moneda];\n' +
'        }\n' +
'      });\n' +
'\n' +
'      return { ok: true };\n' +
'    },\n' +
'\n' +
'    /* Copia profunda de lo que se expone: si devolviéramos las\n' +
'       referencias internas, cualquiera podría ponerse stock a 9999. */\n' +
'    estado: function () {\n' +
'      const copiaArticulos = {};\n' +
'      Object.keys(articulos).forEach(function (codigo) {\n' +
'        copiaArticulos[codigo] = {\n' +
'          precioCent: articulos[codigo].precioCent,\n' +
'          stock: articulos[codigo].stock\n' +
'        };\n' +
'      });\n' +
'      return {\n' +
'        articulos: copiaArticulos,\n' +
'        cambio: Object.assign({}, cambio),\n' +
'        insertadas: insertadas.slice()\n' +
'      };\n' +
'    }\n' +
'  };\n' +
'}\n'
    },

    walkthrough: [
      {
        what: 'Enumerar los cinco desenlaces de una compra antes de escribir código.',
        why: 'Es la diferencia entre modelar y parchear. Si empiezas por el camino feliz y vas añadiendo `if` según fallan los tests, acabas con condiciones dispersas y con estados imposibles de razonar. Los cinco desenlaces son el contrato de la operación, y cada uno deja la máquina en un estado distinto que hay que decidir a propósito.',
        how: 'Se escriben primero como comentario: vendido, artículo desconocido, sin stock, fondos insuficientes y sin cambio. Se decide para cada uno qué pasa con el dinero. Tres conservan lo insertado, uno lo devuelve y uno lo consume. Esa tabla es después el orden literal de las comprobaciones en `seleccionar`.'
      },
      {
        what: 'Copiar la configuración al construir, en vez de guardar el objeto recibido.',
        why: 'Si guardas la referencia, ocurren dos cosas malas a la vez: mutas un dato que pertenece a quien te llamó —y que probablemente reutilice— y dejas que te cambien los precios por detrás en cualquier momento. Una máquina cuyo estado puede modificarse desde fuera no puede garantizar ninguna de sus reglas.',
        how: 'Se recorren los artículos creando objetos nuevos con `precioCent` y `stock`, y se normaliza el inventario de monedas a las cuatro válidas con `|| 0`. Esa normalización tiene un beneficio extra: a partir de ahí el resto del código puede dar por hecho que las cuatro claves existen y no necesita comprobarlo nunca más.'
      },
      {
        what: 'Guardar el estado en variables locales de `crearMaquina` y exponer solo métodos.',
        why: 'Es la forma idiomática de tener estado privado en JavaScript sin clases. `articulos`, `cambio` e `insertadas` viven en el ámbito de la función y los métodos devueltos las capturan en un cierre. Desde fuera no hay ninguna referencia a ellas, así que la única manera de cambiar la máquina es a través de sus operaciones, que es exactamente lo que se quiere.',
        how: 'Se declaran las tres variables y dos ayudantes privados, `saldoCent()` y `vaciarMonedero()`. Que estos dos no formen parte del objeto devuelto es deliberado: son detalles internos, no parte de la API, y sacarlos fuera sería ampliar la superficie pública sin motivo.'
      },
      {
        what: 'Reconocer que dar siempre la moneda más grande no sirve, y usar vuelta atrás.',
        why: 'Es la parte que decide la nota. Con existencias infinitas, el método goloso es óptimo para 5, 10, 25 y 100. Con existencias limitadas deja de serlo: para devolver 30 con una moneda de 25 y tres de 10, el goloso coge la de 25, se queda sin poder completar los 5 restantes y concluye que no hay cambio, cuando tres monedas de 10 lo resuelven. El problema no es la heurística, es que no se puede deshacer.',
        how: '`calcularCambio` recorre los valores de mayor a menor y, para cada uno, prueba desde el máximo número de monedas que caben hasta cero. Si una rama muere, el bucle sigue con una moneda menos. Empezar por el máximo hace que la primera solución encontrada sea también la de menos monedas, así que se puede devolver en cuanto aparece, sin explorar el resto ni comparar candidatas.'
      },
      {
        what: 'Incorporar las monedas insertadas al inventario **antes** de calcular la vuelta.',
        why: 'Es el detalle que más entregas suspende, porque el código funciona en casi todos los casos. Las monedas que el cliente acaba de meter se quedan en la máquina, así que están disponibles para componer el cambio de esa misma venta. Calcular sobre el inventario anterior hace que la máquina rechace ventas que sí podía servir, y eso es dinero que se deja de ingresar.',
        how: 'Se construye un objeto `disponible` copiando el inventario y sumando una unidad por cada moneda insertada. La búsqueda del cambio se hace sobre esa copia. Como es una copia y no el inventario real, si resulta que no hay cambio posible no hay nada que revertir.'
      },
      {
        what: 'Calcular primero y aplicar después, todo junto al final.',
        why: 'Una venta modifica cuatro cosas. Si se descuenta el stock antes de saber si habrá cambio, el caso `SIN_CAMBIO` deja la máquina con una unidad menos y sin haber vendido nada: has perdido producto. Es el equivalente en memoria de una transacción a medias.',
        how: 'Todas las comprobaciones y el cálculo del cambio ocurren sin tocar ninguna variable de estado. Solo cuando `vuelta` es una combinación válida se ejecutan las cuatro escrituras seguidas: se adopta el inventario con las monedas nuevas, se descuentan las que salen, se baja el stock y se vacía el monedero. Cualquier salida anterior devuelve sin haber escrito nada.'
      },
      {
        what: 'Usar códigos de error estables en lugar de mensajes de texto.',
        why: 'El mensaje que ve una persona depende del idioma, del canal y del producto; el motivo del fallo, no. Si `seleccionar` devuelve `"No hay suficiente dinero"`, quien consuma la API acabará comparando cadenas, y el día que se corrija una tilde se romperá su código. Con `FONDOS_INSUFICIENTES` la interfaz decide qué enseñar y en qué idioma.',
        how: 'Cada rama de error devuelve `{ ok: false, error: CODIGO }` más los datos que ayuden a reaccionar: `faltanCent` cuando falta dinero, `devuelto` cuando se reintegra. La forma del objeto de respuesta es la misma en el éxito y en el fallo, con `ok` como discriminador, para que quien lo use no tenga que recordar dos formatos.'
      },
      {
        what: 'Devolver copias en `estado()`.',
        why: 'Un método de lectura no puede ser una puerta de escritura. Si `estado()` devuelve las referencias internas, basta con `estado().articulos.AGUA.stock = 999` para saltarse todas las reglas de la máquina. El test lo comprueba precisamente porque es un descuido habitual y silencioso.',
        how: 'Se reconstruyen los artículos como objetos nuevos, y el inventario y las monedas insertadas se copian con `Object.assign` y `slice`. Es una copia profunda **suficiente** para esta estructura: los artículos tienen un solo nivel de anidamiento y el resto son primitivos. Una copia genérica con `structuredClone` valdría, pero aquí sería más lenta y menos explícita sobre qué se está exponiendo.'
      }
    ],

    rationale:
      'El diseño separa dos cosas que cambian por motivos distintos: **la política de cambio**, que es ' +
      'un problema algorítmico puro, y **la máquina**, que es un problema de estado y de reglas de ' +
      'negocio. Por eso `calcularCambio` es una función libre que no sabe nada de artículos ni de ' +
      'ventas: recibe un inventario y un objetivo. Se puede probar sola, sustituir por una versión con ' +
      'programación dinámica si el juego de monedas creciera, o reutilizar en una caja registradora.\n' +
      'La máquina, por su parte, se construye con un cierre en vez de con una clase porque no hay ' +
      'herencia ni polimorfismo que justifiquen `class`, y el cierre da privacidad real. Con una clase, ' +
      '`this.cambio` sería público y el test de la copia fallaría.\n' +
      'La decisión más discutible, y por tanto la que hay que saber defender, es devolver objetos de ' +
      'resultado en vez de lanzar excepciones. Se elige así porque **ninguno de los cinco desenlaces es ' +
      'excepcional**: quedarse sin stock o sin cambio es funcionamiento normal de una máquina ' +
      'expendedora, y las excepciones son para lo que no debería pasar.',

    alternatives: [
      { name: 'Programación dinámica en vez de vuelta atrás', when: 'El juego de monedas es grande o el cambio puede ser de miles de unidades.', tradeoff: 'Coste predecible, proporcional al importe por el número de valores, en lugar de exponencial en el peor caso. A cambio, más código y más memoria; con cuatro monedas y un cambio menor de 100, no compensa.' },
      { name: 'Clase de ES6 con campos privados (`#`)', when: 'El equipo usa clases y necesitas herencia o varias implementaciones intercambiables.', tradeoff: 'Privacidad real también, y más familiar para quien viene de Java o C#. Aquí obliga a un paso de compilación en entornos antiguos y no aporta nada que el cierre no dé.' },
      { name: 'Excepciones en lugar de objetos de resultado', when: 'Los fallos son de verdad excepcionales y quieres que se propaguen solos.', tradeoff: 'Menos comprobaciones en quien llama, pero convierte flujo de negocio normal en control por excepción, y obliga a envolver cada llamada en `try/catch`.' },
      { name: 'Máquina de estados explícita (`REPOSO`, `COBRANDO`, `SIRVIENDO`)', when: 'Aparecen operaciones concurrentes o pasos que tardan, como cobrar con tarjeta.', tradeoff: 'Hace imposibles las transiciones inválidas y documenta el dominio, a cambio de bastante más código. Con operaciones instantáneas es sobreingeniería.' },
      { name: 'Devolver el cambio con más monedas pequeñas a propósito', when: 'Quieres conservar monedas grandes para futuras ventas.', tradeoff: 'Optimiza la disponibilidad de cambio a lo largo del día, pero es una regla de negocio que hay que acordar: el cliente espera el menor número de monedas.' }
    ],

    commonErrors: [
      {
        error: 'Dar siempre la moneda más grande que quepa.',
        why: 'Es el fallo central de esta prueba. Funciona en casi todos los casos y falla justo cuando la máquina se queda sin monedas pequeñas, que es cuando más importa. La máquina rechaza ventas que sí podía servir.',
        fix: 'Probar y retroceder: para cada valor, del máximo de monedas hacia abajo, deshaciendo cuando la rama no lleva a solución.'
      },
      {
        error: 'Calcular el cambio sobre el inventario anterior a la venta.',
        why: 'Las monedas que el cliente acaba de insertar se quedan en la máquina y sirven para dar el cambio. Ignorarlas provoca falsos `SIN_CAMBIO`.',
        fix: 'Construir el inventario disponible sumando las monedas insertadas antes de buscar la vuelta.'
      },
      {
        error: 'Descontar el stock antes de comprobar que hay cambio.',
        why: 'El camino `SIN_CAMBIO` deja la máquina con una unidad menos sin haber vendido. Es una operación a medias, del mismo tipo que una transacción sin `rollback`.',
        fix: 'Comprobarlo todo primero y aplicar las cuatro escrituras juntas al final.'
      },
      {
        error: 'Quedarse el dinero cuando no hay cambio.',
        why: 'Es un problema de negocio, no de código: se cobra por algo que no se entrega. Un revisor lo lee como que no has pensado en el usuario.',
        fix: 'Devolver las monedas insertadas en ese camino, y solo en ese.'
      },
      {
        error: 'Devolver el estado interno desde `estado()`.',
        why: 'Convierte un método de lectura en una puerta de escritura: quien lo reciba puede alterar stock e inventario y saltarse todas las reglas.',
        fix: 'Copiar artículos, inventario y monedas insertadas antes de devolverlos.'
      },
      {
        error: 'Resolverlo todo en una función de doscientas líneas.',
        why: 'El enunciado real avisa literalmente de que un script de un solo archivo que procesa comandos no demuestra nivel senior. El problema es pequeño a propósito **para** que se vea cómo estructuras.',
        fix: 'Separar el cálculo del cambio de la máquina, y los ayudantes internos de la API pública.'
      },
      {
        error: 'Guardar el objeto de configuración recibido en lugar de copiarlo.',
        why: 'Mutas un dato que no es tuyo y permites que te cambien los precios desde fuera después de construir la máquina.',
        fix: 'Copiar artículos y monedas en el constructor, normalizando de paso las cuatro monedas válidas.'
      }
    ],

    bestPractices: [
      'Enumerar los desenlaces de una operación antes de escribir su primera línea.',
      'Separar el algoritmo puro del objeto con estado: se prueba mejor y se sustituye sin tocar nada más.',
      'Calcular primero y escribir después, para que ningún camino de error deje el estado a medias.',
      'Códigos de error estables, y el mensaje para quien tenga que enseñarlo.',
      'Misma forma de respuesta en éxito y en fallo, con un discriminador claro.',
      'Copiar en la frontera: al entrar la configuración y al salir el estado.',
      'Comentar el porqué de las decisiones no obvias —por qué no es goloso, por qué se suman las monedas insertadas— porque son justo las que te van a preguntar.'
    ],

    security: [
      '`servicio()` cambia precios y existencias: en un sistema real sería una operación privilegiada y necesitaría autenticación del operario, no estar expuesta en la misma API que comprar.',
      'Validar que las monedas insertadas pertenecen al juego aceptado evita que un cliente manipulado inserte valores arbitrarios y vacíe el inventario de cambio.',
      'El importe insertado debería tener un tope: sin él, alguien puede introducir monedas indefinidamente y forzar una búsqueda de cambio innecesariamente grande.'
    ],

    performance: [
      'La búsqueda del cambio es exponencial en el peor caso, pero el espacio real es minúsculo: cuatro valores y un cambio siempre menor de 100 céntimos.',
      'Si el juego de monedas creciera o el cambio pudiera ser de miles de unidades, el cambio natural es programación dinámica, con coste proporcional al importe.',
      'Copiar el inventario en cada selección es despreciable —cuatro claves— y compra la garantía de no dejar el estado a medias. Es un buen ejemplo de copia barata que evita un error caro.'
    ],

    companyLooksFor: [
      'Que el diseño aguante requisitos nuevos: otro producto, otra moneda, otra regla de negocio.',
      'Que hayas detectado por tu cuenta que el método goloso no vale, sin que un test te lo diga.',
      'Que los estados de error estén pensados desde el principio, no añadidos al final.',
      'Que la estrategia de tests cubra niveles distintos: el algoritmo del cambio por su cuenta y la máquina como un todo.',
      'Que puedas defender cada decisión en la entrevista posterior, incluido lo que decidiste **no** hacer.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Cambio correcto también cuando el método goloso falla', weight: 30 },
        { criteria: 'Los cinco desenlaces con el estado correcto en cada uno', weight: 25 },
        { criteria: 'Estado encapsulado y copias en la frontera', weight: 20 },
        { criteria: 'Separación entre algoritmo y modelo de dominio', weight: 15 },
        { criteria: 'API coherente y códigos de error estables', weight: 10 }
      ]
    },

    reinforce: [
      'Reescribir `calcularCambio` con programación dinámica y comparar los dos enfoques: es la ampliación típica de la ronda de defensa.',
      'Añadir una operación de cobro con tarjeta que tarda, y ver cómo obliga a una máquina de estados explícita.',
      'Practicar la defensa en voz alta: por qué un cierre y no una clase, por qué objetos de resultado y no excepciones.',
      'Leer el enunciado original de Holded en su repositorio público y contrastar tu solución con lo que dicen que evalúan.'
    ]
  });

})(window.TT);

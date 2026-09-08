/* ============================================================
   Pruebas — Testing y Debugging
   ============================================================ */
(function (TT) {
  'use strict';

  /* ==================================================================
     1. Escribir tests que de verdad detecten bugs
     ================================================================== */
  TT.defineExercise({
    id: 'test-tests-que-detectan',
    title: 'Escribe tests que detecten bugs de verdad',
    category: 'testing',
    kind: 'test-write',
    level: 'junior-adv',
    time: 45,
    tags: ['testing', 'casos borde', 'mutation testing'],

    context:
      'Un comercio electrónico tiene el 87 % de cobertura de tests y aun así se les coló en producción un ' +
      'cupón que se aplicaba sin importe mínimo. Perdieron 12 000 € en tres días. Los tests pasaban todos.',

    situation:
      'Al revisarlo, los 40 tests comprobaban el mismo caso con datos distintos: un producto, sin cupón, ' +
      'importe alto. Ninguno tocaba un límite. La cobertura medía qué líneas se ejecutaban, no qué fallos ' +
      'se detectaban.',

    goal:
      'Escribir una batería de tests para `calcularPrecio` que pase con la implementación correcta y ' +
      '**falle con cada una de las cinco versiones defectuosas** que la plataforma va a probar contra tus tests.',

    tech: ['JavaScript', 'Testing'],
    skills: ['diseño de casos de prueba', 'casos borde', 'valores límite', 'testing de mutación'],

    starter: {
      lang: 'javascript',
      code:
'/* ============================================================\n' +
'   ESPECIFICACIÓN de calcularPrecio(items, cupon)\n' +
'   ------------------------------------------------------------\n' +
'   items : [{ precio: number, cantidad: number }]\n' +
'   cupon : string | null\n' +
'\n' +
'   1. subtotal = suma de precio x cantidad de cada línea\n' +
'   2. Si el carrito está vacío, el total es 0 (sin gastos de envío)\n' +
'   3. El cupón "DESC10" aplica un 10 % de descuento,\n' +
'      pero SOLO si el subtotal es 50 o más\n' +
'   4. Envío: gratis si el importe (ya con descuento) es 30 o más,\n' +
'      4,99 € en caso contrario\n' +
'   5. El total se redondea a 2 decimales\n' +
'   ============================================================ */\n' +
'\n' +
'/**\n' +
' * Escribe aquí tus tests.\n' +
' *\n' +
' * Recibe la función a probar como parámetro: la plataforma la llamará\n' +
' * varias veces, una con la versión correcta y otra con cada versión\n' +
' * defectuosa. Usa expect(...) — si una comprobación falla, lanza, y eso\n' +
' * es exactamente lo que queremos que ocurra con las versiones malas.\n' +
' *\n' +
' * @param {(items:Array, cupon:string|null) => number} calcular\n' +
' */\n' +
'function misTests(calcular) {\n' +
'\n' +
'  // Un producto de 10 €, sin cupón: 10 + 4,99 de envío = 14,99\n' +
'  expect(calcular([{ precio: 10, cantidad: 1 }], null)).toBe(14.99);\n' +
'\n' +
'  // Este único test deja pasar cuatro de los cinco bugs.\n' +
'  // Añade los que faltan.\n' +
'\n' +
'}\n'
    },

    requirements: [
      'Tus tests deben pasar sin lanzar cuando reciben la implementación correcta.',
      'Deben detectar el bug 1: el cupón se aplica aunque el subtotal no llegue al mínimo de 50.',
      'Deben detectar el bug 2: la condición del envío está invertida.',
      'Deben detectar el bug 3: el total no se redondea a 2 decimales.',
      'Deben detectar el bug 4: se ignora el campo `cantidad` de cada línea.',
      'Deben detectar el bug 5: un carrito vacío cobra gastos de envío.',
      'Deben hacer al menos 6 llamadas a la función: un test único y genérico no vale.'
    ],

    optional: [
      'Probar exactamente los valores límite: subtotal 49,99 / 50 y total 29,99 / 30.',
      'Añadir un test con varias líneas de producto distintas.',
      'Comprobar que un cupón desconocido no aplica ningún descuento.'
    ],

    hints: [
      'Cada bug vive en una regla distinta de la especificación. Recorre las cinco reglas y escribe al menos un test por cada una: eso solo ya detecta casi todos.',
      'Para cazar el bug del mínimo del cupón necesitas un carrito **por debajo** de 50 con el cupón puesto. Si todos tus carritos superan 50, ese bug es invisible.',
      'Para cazar el redondeo necesitas un caso donde la coma flotante se note. `10.1 * 3` da `30.299999999999997`, no `30.3`.',
      'Para cazar el bug de `cantidad` necesitas alguna línea con cantidad mayor que 1. Con cantidad 1 las dos versiones dan lo mismo.',
      'Piensa en los límites: si la regla dice "50 o más", prueba con 49,99 y con 50. Ahí es donde viven los errores de `>` frente a `>=`.'
    ],

    tests: {
      mode: 'js',
      timeout: 5000,
      setup:
'// Implementación correcta según la especificación.\n' +
'function correcta(items, cupon) {\n' +
'  var subtotal = items.reduce(function (a, i) { return a + i.precio * i.cantidad; }, 0);\n' +
'  if (subtotal === 0) return 0;\n' +
'  var total = subtotal;\n' +
'  if (cupon === "DESC10" && subtotal >= 50) total = subtotal * 0.9;\n' +
'  var envio = total >= 30 ? 0 : 4.99;\n' +
'  return Math.round((total + envio) * 100) / 100;\n' +
'}\n' +
'\n' +
'// BUG 1: aplica el cupón sin comprobar el mínimo de 50.\n' +
'function bug1(items, cupon) {\n' +
'  var subtotal = items.reduce(function (a, i) { return a + i.precio * i.cantidad; }, 0);\n' +
'  if (subtotal === 0) return 0;\n' +
'  var total = subtotal;\n' +
'  if (cupon === "DESC10") total = subtotal * 0.9;\n' +
'  var envio = total >= 30 ? 0 : 4.99;\n' +
'  return Math.round((total + envio) * 100) / 100;\n' +
'}\n' +
'\n' +
'// BUG 2: la condición del envío está invertida.\n' +
'function bug2(items, cupon) {\n' +
'  var subtotal = items.reduce(function (a, i) { return a + i.precio * i.cantidad; }, 0);\n' +
'  if (subtotal === 0) return 0;\n' +
'  var total = subtotal;\n' +
'  if (cupon === "DESC10" && subtotal >= 50) total = subtotal * 0.9;\n' +
'  var envio = total >= 30 ? 4.99 : 0;\n' +
'  return Math.round((total + envio) * 100) / 100;\n' +
'}\n' +
'\n' +
'// BUG 3: no redondea.\n' +
'function bug3(items, cupon) {\n' +
'  var subtotal = items.reduce(function (a, i) { return a + i.precio * i.cantidad; }, 0);\n' +
'  if (subtotal === 0) return 0;\n' +
'  var total = subtotal;\n' +
'  if (cupon === "DESC10" && subtotal >= 50) total = subtotal * 0.9;\n' +
'  var envio = total >= 30 ? 0 : 4.99;\n' +
'  return total + envio;\n' +
'}\n' +
'\n' +
'// BUG 4: ignora la cantidad.\n' +
'function bug4(items, cupon) {\n' +
'  var subtotal = items.reduce(function (a, i) { return a + i.precio; }, 0);\n' +
'  if (subtotal === 0) return 0;\n' +
'  var total = subtotal;\n' +
'  if (cupon === "DESC10" && subtotal >= 50) total = subtotal * 0.9;\n' +
'  var envio = total >= 30 ? 0 : 4.99;\n' +
'  return Math.round((total + envio) * 100) / 100;\n' +
'}\n' +
'\n' +
'// BUG 5: el carrito vacío paga envío.\n' +
'function bug5(items, cupon) {\n' +
'  var subtotal = items.reduce(function (a, i) { return a + i.precio * i.cantidad; }, 0);\n' +
'  var total = subtotal;\n' +
'  if (cupon === "DESC10" && subtotal >= 50) total = subtotal * 0.9;\n' +
'  var envio = total >= 30 ? 0 : 4.99;\n' +
'  return Math.round((total + envio) * 100) / 100;\n' +
'}\n' +
'\n' +
'// Envoltorio que cuenta cuántas veces se llama a la función.\n' +
'function espia() {\n' +
'  var f = function (items, cupon) { f.llamadas++; return correcta(items, cupon); };\n' +
'  f.llamadas = 0;\n' +
'  return f;\n' +
'}',
      cases: [
        {
          name: 'Tus tests pasan con la implementación correcta',
          code: '(function () { misTests(correcta); return true; })()'
        },
        {
          name: 'Detectan el bug 1: el cupón se aplica sin llegar al mínimo de 50',
          code: 'expect(function () { misTests(bug1); }).toThrow()'
        },
        {
          name: 'Detectan el bug 2: la condición del envío está invertida',
          code: 'expect(function () { misTests(bug2); }).toThrow()'
        },
        {
          name: 'Detectan el bug 3: el total no se redondea',
          code: 'expect(function () { misTests(bug3); }).toThrow()'
        },
        {
          name: 'Detectan el bug 4: se ignora la cantidad de cada línea',
          code: 'expect(function () { misTests(bug4); }).toThrow()'
        },
        {
          name: 'Detectan el bug 5: el carrito vacío cobra envío',
          code: 'expect(function () { misTests(bug5); }).toThrow()'
        },
        {
          name: 'No son triviales: hacen al menos 6 comprobaciones distintas',
          code:
'(function () {\n' +
'  var e = espia();\n' +
'  misTests(e);\n' +
'  expect(e.llamadas >= 6).toBeTruthy();\n' +
'  return true;\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  // Con cantidad > 1. Es lo único que distingue la versión correcta\n' +
'  // de la que ignora el campo `cantidad`.\n' +
'  expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'\n' +
'  // Varias líneas distintas: 2x15 + 1x20 = 50, envío gratis.\n' +
'  expect(calcular([{ precio: 15, cantidad: 2 },\n' +
'                   { precio: 20, cantidad: 1 }], null)).toBe(50);\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  // Sin este test, cobrar envío por un carrito vacío pasa inadvertido.\n' +
'  expect(calcular([], null)).toBe(0);\n' +
'  expect(calcular([], "DESC10")).toBe(0);\n' +
'\n' +
'  // --- Regla 3: el cupón exige un mínimo de 50 -------------------\n' +
'  // POR DEBAJO del mínimo: el cupón NO debe aplicarse.\n' +
'  // Este es el test que le faltaba a la empresa del enunciado.\n' +
'  expect(calcular([{ precio: 40, cantidad: 1 }], "DESC10")).toBe(40);\n' +
'\n' +
'  // Justo por debajo del límite: 49,99 sigue sin descuento.\n' +
'  expect(calcular([{ precio: 49.99, cantidad: 1 }], "DESC10")).toBe(49.99);\n' +
'\n' +
'  // Justo en el límite: 50 SÍ lleva descuento -> 45.\n' +
'  // Distingue un `>` mal escrito de un `>=`.\n' +
'  expect(calcular([{ precio: 50, cantidad: 1 }], "DESC10")).toBe(45);\n' +
'\n' +
'  // Por encima del mínimo: 60 -> 54.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "DESC10")).toBe(54);\n' +
'\n' +
'  // Un cupón desconocido no descuenta nada.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "NOEXISTE")).toBe(60);\n' +
'\n' +
'  // --- Regla 4: envío gratis a partir de 30 ----------------------\n' +
'  // Por debajo del umbral: se cobra el envío.\n' +
'  expect(calcular([{ precio: 10, cantidad: 2 }], null)).toBe(24.99);\n' +
'\n' +
'  // Justo por debajo: 29,99 + 4,99 = 34,98.\n' +
'  expect(calcular([{ precio: 29.99, cantidad: 1 }], null)).toBe(34.98);\n' +
'\n' +
'  // Justo en el umbral: 30 exactos, envío gratis.\n' +
'  expect(calcular([{ precio: 30, cantidad: 1 }], null)).toBe(30);\n' +
'\n' +
'  // El envío se decide sobre el importe YA DESCONTADO:\n' +
'  // 55 - 10 % = 49,50, que sigue estando por encima de 30.\n' +
'  expect(calcular([{ precio: 55, cantidad: 1 }], "DESC10")).toBe(49.5);\n' +
'\n' +
'  // --- Regla 5: redondeo a 2 decimales ---------------------------\n' +
'  // 10.1 * 3 da 30.299999999999997 en coma flotante.\n' +
'  // Sin redondeo, este test falla; con redondeo, pasa.\n' +
'  expect(calcular([{ precio: 10.1, cantidad: 3 }], null)).toBe(30.3);\n' +
'\n' +
'  // 55.55 - 10 % = 49.995000000000005 -> debe quedar en 50.\n' +
'  expect(calcular([{ precio: 55.55, cantidad: 1 }], "DESC10")).toBe(50);\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — Un test por cada regla, sin pensar todavía en los límites',
        objetivo:
          'Cubrir las cinco reglas de la especificación con un caso evidente cada una. Con esto ya se ' +
          'detectan tres de los cinco bugs, y se tarda cinco minutos.',
        anadido: [
          'Un caso con `cantidad` mayor que 1 (regla 1).',
          'Un caso de carrito vacío (regla 2).',
          'Un caso con cupón por encima del mínimo (regla 3).',
          'Un caso por debajo del umbral de envío (regla 4).'
        ],
        codigo:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  expect(calcular([], null)).toBe(0);\n' +
'\n' +
'  // --- Regla 3: el cupón descuenta un 10 % -----------------------\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "DESC10")).toBe(54);\n' +
'\n' +
'  // --- Regla 4: envío cobrado por debajo de 30 -------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 2 }], null)).toBe(24.99);\n' +
'}\n',
        explicacion:
          'El primer test usa `cantidad: 3`, y solo por eso ya caza el bug 4 (ignorar la cantidad): la ' +
          'versión defectuosa devolvería 14,99 en vez de 30. El del carrito vacío caza el bug 5. Y el del ' +
          'envío caza el bug 2, porque con la condición invertida daría 20 en lugar de 24,99.\n' +
          'Fíjate en lo que **no** se detecta todavía: el mínimo del cupón (bug 1) y el redondeo (bug 3). ' +
          'Los dos casos con cupón superan los 50 €, así que la versión sin mínimo da el mismo resultado; ' +
          'y ningún importe produce decimales problemáticos.',
        comprueba:
          'Ejecuta los tests: deberían pasar los casos de los bugs 2, 4 y 5, y fallar los del 1 y el 3.'
      },
      {
        titulo: 'Fase 2 — El caso que le faltaba a la empresa: el cupón por debajo del mínimo',
        objetivo:
          'Detectar el bug 1. Requiere un carrito que **no** llegue al mínimo pero que lleve el cupón puesto.',
        anadido: [
          'Un carrito de 40 € con `DESC10`: el cupón no debe aplicarse y el total debe seguir siendo 40.',
          'Un cupón desconocido, que tampoco debe descontar nada.'
        ],
        codigo:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  expect(calcular([], null)).toBe(0);\n' +
'\n' +
'  // --- Regla 3: el cupón exige un mínimo de 50 -------------------\n' +
'  // POR DEBAJO del mínimo: el cupón NO debe aplicarse.\n' +
'  // Este es el test que le faltaba a la empresa del enunciado.\n' +
'  expect(calcular([{ precio: 40, cantidad: 1 }], "DESC10")).toBe(40);\n' +
'\n' +
'  // Por encima del mínimo: 60 -> 54.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "DESC10")).toBe(54);\n' +
'\n' +
'  // Un cupón desconocido no descuenta nada.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "NOEXISTE")).toBe(60);\n' +
'\n' +
'  // --- Regla 4: envío cobrado por debajo de 30 -------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 2 }], null)).toBe(24.99);\n' +
'}\n',
        explicacion:
          'La línea nueva es la del carrito de 40 € con cupón. Con la implementación correcta el descuento ' +
          'no se aplica y el total es 40 (envío gratis porque 40 ≥ 30). Con el bug 1, el descuento sí se ' +
          'aplica y devuelve 36. El test falla, que es justo lo que queremos.\n' +
          'Esta es la línea que le habría ahorrado 12 000 € a la empresa del enunciado. No es un test ' +
          'sofisticado: es el caso obvio que nadie escribió porque todos los ejemplos del ticket usaban ' +
          'importes altos.',
        comprueba: 'Ahora deberían pasar todos los casos menos el del bug 3 (redondeo).'
      },
      {
        titulo: 'Fase 3 — Redondeo: el bug que solo aparece con decimales incómodos',
        objetivo:
          'Detectar el bug 3. Hace falta una operación en la que la coma flotante binaria produzca un ' +
          'resultado que no sea exacto.',
        anadido: [
          '`10.1 × 3`, que en coma flotante da `30.299999999999997`.',
          '`55.55 − 10 %`, que da `49.995000000000005` y debe redondear a 50.'
        ],
        codigo:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  expect(calcular([], null)).toBe(0);\n' +
'\n' +
'  // --- Regla 3: el cupón exige un mínimo de 50 -------------------\n' +
'  // POR DEBAJO del mínimo: el cupón NO debe aplicarse.\n' +
'  // Este es el test que le faltaba a la empresa del enunciado.\n' +
'  expect(calcular([{ precio: 40, cantidad: 1 }], "DESC10")).toBe(40);\n' +
'\n' +
'  // Por encima del mínimo: 60 -> 54.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "DESC10")).toBe(54);\n' +
'\n' +
'  // Un cupón desconocido no descuenta nada.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "NOEXISTE")).toBe(60);\n' +
'\n' +
'  // --- Regla 4: envío cobrado por debajo de 30 -------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 2 }], null)).toBe(24.99);\n' +
'\n' +
'  // --- Regla 5: redondeo a 2 decimales ---------------------------\n' +
'  // 10.1 * 3 da 30.299999999999997 en coma flotante.\n' +
'  // Sin redondeo, este test falla; con redondeo, pasa.\n' +
'  expect(calcular([{ precio: 10.1, cantidad: 3 }], null)).toBe(30.3);\n' +
'\n' +
'  // 55.55 - 10 % = 49.995000000000005 -> debe quedar en 50.\n' +
'  expect(calcular([{ precio: 55.55, cantidad: 1 }], "DESC10")).toBe(50);\n' +
'}\n',
        explicacion:
          'Aquí está la clave de por qué la elección de los datos importa tanto. Con `precio: 10` y ' +
          '`cantidad: 3` el resultado es 30 exacto y las dos versiones coinciden: el bug es invisible. ' +
          'Con `precio: 10.1` el producto es `30.299999999999997`, y ahí sí se separan.\n' +
          'El segundo caso ataca el redondeo por otro camino: el descuento. `55.55 * 0.9` da ' +
          '`49.995000000000005`, que redondeado a dos decimales es 50.\n' +
          'Con esta fase ya se detectan **los cinco bugs**. Lo que queda es endurecer la batería.',
        comprueba: 'Los seis primeros casos de la plataforma deberían estar en verde.'
      },
      {
        titulo: 'Fase 4 — Valores límite: donde viven los errores de `>` frente a `>=`',
        objetivo:
          'Cubrir los dos umbrales de la especificación (50 del cupón y 30 del envío) probando el valor ' +
          'exacto y el inmediatamente inferior. Es la técnica que caza los bugs que aún no existen.',
        anadido: [
          '49,99 y 50 exactos para el mínimo del cupón.',
          '29,99 y 30 exactos para el umbral de envío.',
          'Un caso donde el envío se decide sobre el importe ya descontado.'
        ],
        codigo:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  expect(calcular([], null)).toBe(0);\n' +
'\n' +
'  // --- Regla 3: el cupón exige un mínimo de 50 -------------------\n' +
'  // POR DEBAJO del mínimo: el cupón NO debe aplicarse.\n' +
'  // Este es el test que le faltaba a la empresa del enunciado.\n' +
'  expect(calcular([{ precio: 40, cantidad: 1 }], "DESC10")).toBe(40);\n' +
'\n' +
'  // Justo por debajo del límite: 49,99 sigue sin descuento.\n' +
'  expect(calcular([{ precio: 49.99, cantidad: 1 }], "DESC10")).toBe(49.99);\n' +
'\n' +
'  // Justo en el límite: 50 SÍ lleva descuento -> 45.\n' +
'  // Distingue un `>` mal escrito de un `>=`.\n' +
'  expect(calcular([{ precio: 50, cantidad: 1 }], "DESC10")).toBe(45);\n' +
'\n' +
'  // Por encima del mínimo: 60 -> 54.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "DESC10")).toBe(54);\n' +
'\n' +
'  // Un cupón desconocido no descuenta nada.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "NOEXISTE")).toBe(60);\n' +
'\n' +
'  // --- Regla 4: envío gratis a partir de 30 ----------------------\n' +
'  // Por debajo del umbral: se cobra el envío.\n' +
'  expect(calcular([{ precio: 10, cantidad: 2 }], null)).toBe(24.99);\n' +
'\n' +
'  // Justo por debajo: 29,99 + 4,99 = 34,98.\n' +
'  expect(calcular([{ precio: 29.99, cantidad: 1 }], null)).toBe(34.98);\n' +
'\n' +
'  // Justo en el umbral: 30 exactos, envío gratis.\n' +
'  expect(calcular([{ precio: 30, cantidad: 1 }], null)).toBe(30);\n' +
'\n' +
'  // El envío se decide sobre el importe YA DESCONTADO:\n' +
'  // 55 - 10 % = 49,50, que sigue estando por encima de 30.\n' +
'  expect(calcular([{ precio: 55, cantidad: 1 }], "DESC10")).toBe(49.5);\n' +
'\n' +
'  // --- Regla 5: redondeo a 2 decimales ---------------------------\n' +
'  // 10.1 * 3 da 30.299999999999997 en coma flotante.\n' +
'  // Sin redondeo, este test falla; con redondeo, pasa.\n' +
'  expect(calcular([{ precio: 10.1, cantidad: 3 }], null)).toBe(30.3);\n' +
'\n' +
'  // 55.55 - 10 % = 49.995000000000005 -> debe quedar en 50.\n' +
'  expect(calcular([{ precio: 55.55, cantidad: 1 }], "DESC10")).toBe(50);\n' +
'}\n',
        explicacion:
          'Ninguno de estos tests hace falta para superar la prueba: los cinco bugs ya se detectaban en la ' +
          'fase 3. Se añaden porque cazan los bugs que **todavía no se han escrito**.\n' +
          'Cuando la especificación dice "50 o más", hay exactamente tres casos interesantes: justo debajo, ' +
          'el valor exacto y justo encima. Un `>` escrito donde debía ir un `>=` solo se manifiesta en el ' +
          'valor exacto, y es de los errores más frecuentes que existen.\n' +
          'El caso de 55 € con cupón comprueba algo distinto: que el envío se decide sobre el importe ya ' +
          'descontado. Es la clase de detalle que la especificación menciona de pasada y que se implementa ' +
          'mal muy a menudo.',
        comprueba: 'Los siete casos de la plataforma en verde, incluido el de "no son triviales".'
      },
      {
        titulo: 'Fase 5 — Batería final, organizada por reglas',
        objetivo:
          'Dejar los tests agrupados por la regla que verifican y con comentarios que expliquen qué caza ' +
          'cada uno. Un test que nadie entiende se acaba borrando en el primer refactor.',
        anadido: [
          'Un caso con varias líneas de producto distintas.',
          'Un carrito vacío **con** cupón, para cubrir el cruce de las dos reglas.',
          'Comentarios de sección que agrupan los tests por regla.'
        ],
        codigo:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  // Con cantidad > 1. Es lo único que distingue la versión correcta\n' +
'  // de la que ignora el campo `cantidad`.\n' +
'  expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'\n' +
'  // Varias líneas distintas: 2x15 + 1x20 = 50, envío gratis.\n' +
'  expect(calcular([{ precio: 15, cantidad: 2 },\n' +
'                   { precio: 20, cantidad: 1 }], null)).toBe(50);\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  // Sin este test, cobrar envío por un carrito vacío pasa inadvertido.\n' +
'  expect(calcular([], null)).toBe(0);\n' +
'  expect(calcular([], "DESC10")).toBe(0);\n' +
'\n' +
'  // --- Regla 3: el cupón exige un mínimo de 50 -------------------\n' +
'  // POR DEBAJO del mínimo: el cupón NO debe aplicarse.\n' +
'  // Este es el test que le faltaba a la empresa del enunciado.\n' +
'  expect(calcular([{ precio: 40, cantidad: 1 }], "DESC10")).toBe(40);\n' +
'\n' +
'  // Justo por debajo del límite: 49,99 sigue sin descuento.\n' +
'  expect(calcular([{ precio: 49.99, cantidad: 1 }], "DESC10")).toBe(49.99);\n' +
'\n' +
'  // Justo en el límite: 50 SÍ lleva descuento -> 45.\n' +
'  // Distingue un `>` mal escrito de un `>=`.\n' +
'  expect(calcular([{ precio: 50, cantidad: 1 }], "DESC10")).toBe(45);\n' +
'\n' +
'  // Por encima del mínimo: 60 -> 54.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "DESC10")).toBe(54);\n' +
'\n' +
'  // Un cupón desconocido no descuenta nada.\n' +
'  expect(calcular([{ precio: 60, cantidad: 1 }], "NOEXISTE")).toBe(60);\n' +
'\n' +
'  // --- Regla 4: envío gratis a partir de 30 ----------------------\n' +
'  // Por debajo del umbral: se cobra el envío.\n' +
'  expect(calcular([{ precio: 10, cantidad: 2 }], null)).toBe(24.99);\n' +
'\n' +
'  // Justo por debajo: 29,99 + 4,99 = 34,98.\n' +
'  expect(calcular([{ precio: 29.99, cantidad: 1 }], null)).toBe(34.98);\n' +
'\n' +
'  // Justo en el umbral: 30 exactos, envío gratis.\n' +
'  expect(calcular([{ precio: 30, cantidad: 1 }], null)).toBe(30);\n' +
'\n' +
'  // El envío se decide sobre el importe YA DESCONTADO:\n' +
'  // 55 - 10 % = 49,50, que sigue estando por encima de 30.\n' +
'  expect(calcular([{ precio: 55, cantidad: 1 }], "DESC10")).toBe(49.5);\n' +
'\n' +
'  // --- Regla 5: redondeo a 2 decimales ---------------------------\n' +
'  // 10.1 * 3 da 30.299999999999997 en coma flotante.\n' +
'  // Sin redondeo, este test falla; con redondeo, pasa.\n' +
'  expect(calcular([{ precio: 10.1, cantidad: 3 }], null)).toBe(30.3);\n' +
'\n' +
'  // 55.55 - 10 % = 49.995000000000005 -> debe quedar en 50.\n' +
'  expect(calcular([{ precio: 55.55, cantidad: 1 }], "DESC10")).toBe(50);\n' +
'}\n',
        explicacion:
          'La versión final añade dos casos y, sobre todo, **estructura**. Los comentarios de sección hacen ' +
          'que se vea de un vistazo qué regla queda cubierta y cuál no; sin ellos, dentro de seis meses ' +
          'nadie sabrá si falta algo.\n' +
          'El carrito vacío con cupón cubre el cruce de dos reglas, que es donde suelen aparecer los fallos ' +
          'al añadir funcionalidad nueva.\n' +
          'Y el caso de varias líneas comprueba que la suma recorre todo el array: con una sola línea, un ' +
          '`reduce` mal escrito que devolviera siempre el primer elemento pasaría desapercibido.\n' +
          'Son 15 comprobaciones. La empresa del enunciado tenía 40 y detectaban menos.',
        comprueba: 'Los siete casos en verde. Esta es la solución final.'
      }
    ],

    docs: {
      resumen:
        'La cobertura mide qué líneas se **ejecutan**, no qué fallos se **detectan**. Un test solo aporta ' +
        'si existe alguna versión rota del código que lo haga fallar. Este ejercicio te enseña a diseñar ' +
        'casos por esa pregunta: **¿qué bug cazaría este test?**',

      conceptos: [
        {
          titulo: 'Por qué el 87 % de cobertura no impidió el fallo',
          texto:
            'La **cobertura** cuenta el porcentaje de líneas que se ejecutan al pasar los tests. Es una ' +
            'métrica de ejecución, no de verificación.\n' +
            'Cuarenta tests que llaman a la función con importes distintos ejecutan las mismas líneas ' +
            'cuarenta veces. La cobertura es altísima y la capacidad de detección, mínima.\n' +
            'La pregunta correcta no es "¿cuántas líneas cubro?" sino **"¿qué versión rota de este código ' +
            'haría fallar mi test?"**. Si no se te ocurre ninguna, ese test no aporta nada.',
          codigo:
'// Estos tres tests dan 100 % de cobertura de esta función\n' +
'// y no detectan NINGUNO de los cinco bugs del ejercicio.\n' +
'\n' +
'expect(calcular([{ precio: 100, cantidad: 1 }], null)).toBe(100);\n' +
'expect(calcular([{ precio: 200, cantidad: 1 }], null)).toBe(200);\n' +
'expect(calcular([{ precio: 300, cantidad: 1 }], "DESC10")).toBe(270);\n' +
'\n' +
'// Todos: cantidad 1, importe alto, sin decimales incómodos,\n' +
'// carrito no vacío, cupón siempre por encima del mínimo.\n' +
'// Cambian los datos, pero es SIEMPRE EL MISMO CASO.'
        },
        {
          titulo: 'Testing de mutación: la idea que hay detrás de este ejercicio',
          texto:
            'El **testing de mutación** evalúa la calidad de una batería de tests introduciendo fallos ' +
            'deliberados en el código (mutantes) y comprobando cuántos detectan los tests.\n' +
            'Un mutante que sobrevive —los tests siguen en verde con el código roto— señala un hueco exacto ' +
            'en tu batería.\n' +
            'Eso es literalmente lo que hace esta prueba: la plataforma tiene cinco mutantes y ejecuta ' +
            '**tus** tests contra cada uno. La nota mide cuántos matas.\n' +
            'Mutaciones típicas: cambiar `>=` por `>`, invertir una condición, quitar una llamada, cambiar ' +
            'un `+` por un `-`, devolver una constante.',
          codigo:
'// ORIGINAL\n' +
'if (cupon === "DESC10" && subtotal >= 50) total = subtotal * 0.9;\n' +
'\n' +
'// MUTANTE A: se elimina la condición del mínimo\n' +
'if (cupon === "DESC10") total = subtotal * 0.9;\n' +
'//   -> lo mata un carrito de 40 € CON cupón\n' +
'\n' +
'// MUTANTE B: >= pasa a >\n' +
'if (cupon === "DESC10" && subtotal > 50) total = subtotal * 0.9;\n' +
'//   -> lo mata SOLO un carrito de exactamente 50 €\n' +
'\n' +
'// Si ningún test usa un importe por debajo de 50 ni exactamente 50,\n' +
'// los dos mutantes sobreviven y el bug llega a producción.'
        },
        {
          titulo: 'Análisis de valores límite: tres casos por cada umbral',
          texto:
            'Los errores no se reparten al azar por el rango de valores: **se concentran en los bordes**. ' +
            'Por eso, cada vez que la especificación menciona un umbral, hay tres casos que probar:\n' +
            '**Justo por debajo** — 49,99 para el mínimo de 50.\n' +
            '**El valor exacto** — 50. Es el que distingue `>` de `>=`, y el que más se olvida.\n' +
            '**Justo por encima** — 50,01 o cualquier valor mayor.\n' +
            'En este ejercicio hay dos umbrales (50 del cupón y 30 del envío), así que hay seis casos ' +
            'límite. La especificación te está diciendo dónde escribir los tests.',
          codigo:
'// Umbral del cupón: "50 o más"\n' +
'expect(calcular([{ precio: 49.99, cantidad: 1 }], "DESC10")).toBe(49.99); // sin descuento\n' +
'expect(calcular([{ precio: 50,    cantidad: 1 }], "DESC10")).toBe(45);    // CON descuento\n' +
'expect(calcular([{ precio: 60,    cantidad: 1 }], "DESC10")).toBe(54);    // con descuento\n' +
'\n' +
'// Umbral del envío: "30 o más"\n' +
'expect(calcular([{ precio: 29.99, cantidad: 1 }], null)).toBe(34.98);  // 29,99 + 4,99\n' +
'expect(calcular([{ precio: 30,    cantidad: 1 }], null)).toBe(30);     // envío gratis\n' +
'expect(calcular([{ precio: 40,    cantidad: 1 }], null)).toBe(40);     // envío gratis'
        },
        {
          titulo: 'Elegir los datos para que el bug sea visible',
          texto:
            'Un test solo detecta un fallo si el dato elegido produce **resultados distintos** en la versión ' +
            'correcta y en la rota. Elegir mal el dato hace el test inútil aunque el caso sea el adecuado.\n' +
            '**Cantidad 1** no distingue una implementación que ignora `cantidad`: `precio × 1` es `precio`.\n' +
            '**Importes redondos** no distinguen una que no redondea: 30 es 30 con y sin `Math.round`.\n' +
            '**Carritos por encima de 50** no distinguen si el mínimo del cupón se comprueba o no.\n' +
            'Antes de escribir un test, pregúntate: *si el código estuviera roto de esta forma concreta, ' +
            '¿mi dato daría un número distinto?*',
          codigo:
'// Dato mal elegido: no distingue nada\n' +
'expect(calcular([{ precio: 10, cantidad: 1 }], null)).toBe(14.99);\n' +
'//   con cantidad 1, la versión que ignora `cantidad` da lo mismo\n' +
'\n' +
'// Dato bien elegido: separa las dos versiones\n' +
'expect(calcular([{ precio: 10, cantidad: 3 }], null)).toBe(30);\n' +
'//   correcta -> 30      ignora cantidad -> 10 + 4,99 = 14,99\n' +
'\n' +
'// Dato bien elegido para el redondeo\n' +
'expect(calcular([{ precio: 10.1, cantidad: 3 }], null)).toBe(30.3);\n' +
'//   correcta -> 30.3    sin redondear -> 30.299999999999997'
        },
        {
          titulo: 'Coma flotante: por qué 10.1 × 3 no es 30.3',
          texto:
            'Los números de JavaScript son binarios de doble precisión. Los decimales que en base 10 son ' +
            'exactos, en base 2 a menudo no lo son, y aparecen restos.\n' +
            'Por eso `0.1 + 0.2` da `0.30000000000000004` y `10.1 * 3` da `30.299999999999997`.\n' +
            'En importes eso se traduce en totales con quince decimales que no cuadran en contabilidad. La ' +
            'solución habitual es trabajar en céntimos enteros, o redondear con ' +
            '`Math.round(n * 100) / 100`.\n' +
            'Para los tests, este comportamiento es una **herramienta**: te da datos que separan una ' +
            'implementación que redondea de una que no.',
          codigo:
'0.1 + 0.2;              // 0.30000000000000004\n' +
'0.1 + 0.2 === 0.3;      // false\n' +
'10.1 * 3;               // 30.299999999999997\n' +
'55.55 * 0.9;            // 49.995000000000005\n' +
'\n' +
'// Redondeo a 2 decimales\n' +
'Math.round(30.299999999999997 * 100) / 100;   // 30.3\n' +
'Math.round(49.995000000000005 * 100) / 100;   // 50\n' +
'\n' +
'// Para comparar decimales sin exigir igualdad exacta:\n' +
'expect(resultado).toBeCloseTo(30.3, 2);'
        },
        {
          titulo: 'Un test por regla: usar la especificación como índice',
          texto:
            'La forma más rápida de no dejarte casos es tratar la especificación como una lista de tareas. ' +
            'Cada regla numerada necesita al menos un test, y cada regla con un umbral necesita tres.\n' +
            'Esta prueba tiene cinco reglas y dos umbrales: eso son cinco tests base más seis de límite. ' +
            'Sin inventar nada, la especificación te ha dictado once casos.\n' +
            'Y agrupa los tests por regla con comentarios de sección: así se ve de un vistazo qué queda ' +
            'cubierto. Un test que nadie entiende se borra en el primer refactor.',
          codigo:
'function misTests(calcular) {\n' +
'\n' +
'  // --- Regla 1: subtotal = precio x cantidad ---------------------\n' +
'  // ...\n' +
'\n' +
'  // --- Regla 2: carrito vacío ------------------------------------\n' +
'  // ...\n' +
'\n' +
'  // --- Regla 3: el cupón exige un mínimo de 50 -------------------\n' +
'  // ...\n' +
'\n' +
'  // --- Regla 4: envío gratis a partir de 30 ----------------------\n' +
'  // ...\n' +
'\n' +
'  // --- Regla 5: redondeo a 2 decimales ---------------------------\n' +
'  // ...\n' +
'}\n' +
'\n' +
'// La estructura del archivo refleja la estructura del contrato.'
        },
        {
          titulo: 'Cruces entre reglas: donde aparecen los fallos al añadir funcionalidad',
          texto:
            'Los bugs más difíciles no viven dentro de una regla, sino en la **interacción** entre dos. ' +
            'Aquí hay dos cruces interesantes:\n' +
            '**Carrito vacío + cupón.** ¿Qué manda? Debe seguir siendo 0.\n' +
            '**Descuento + envío.** El envío se decide sobre el importe **ya descontado**, no sobre el ' +
            'subtotal. Con 55 € y `DESC10` quedan 49,50, que sigue por encima de 30: envío gratis. Si la ' +
            'implementación mirase el subtotal, en algunos casos daría el mismo resultado y en otros no.\n' +
            'Estos cruces son los que se rompen cuando alguien añade una regla nueva seis meses después.',
          codigo:
'// Cruce 1: carrito vacío con cupón\n' +
'expect(calcular([], "DESC10")).toBe(0);\n' +
'\n' +
'// Cruce 2: el envío mira el importe YA DESCONTADO\n' +
'// subtotal 55 -> descuento -> 49,50 -> 49,50 >= 30 -> envío gratis\n' +
'expect(calcular([{ precio: 55, cantidad: 1 }], "DESC10")).toBe(49.5);\n' +
'\n' +
'// Un caso donde importa de verdad el orden:\n' +
'// subtotal 33 con un descuento del 10 % daría 29,70 < 30 -> envío\n' +
'// Si la implementación mirase el SUBTOTAL, daría envío gratis.'
        }
      ],

      referencia: [
        { nombre: 'expect(x).toBe(y)', texto: 'Igualdad estricta. Para números y cadenas. **Lanza** si no coinciden, que es lo que hace fallar el test.' },
        { nombre: 'expect(x).toEqual(y)', texto: 'Igualdad estructural, para objetos y arrays.' },
        { nombre: 'expect(x).toBeCloseTo(y, d)', texto: 'Compara decimales con tolerancia. Útil cuando no quieres exigir redondeo exacto.' },
        { nombre: 'expect(fn).toThrow()', texto: 'Comprueba que la función lanza. Recibe una **función**, no su resultado.' },
        { nombre: 'expect(x).toBeTruthy() / toBeFalsy()', texto: 'Para condiciones booleanas.' },
        { nombre: 'expect(a).toHaveLength(n)', texto: 'Longitud de un array o cadena.' },
        { nombre: 'array.reduce((acc, x) => …, inicial)', texto: 'Acumula sobre una lista. Es como se calcula el subtotal.' },
        { nombre: 'Math.round(n * 100) / 100', texto: 'Redondeo a dos decimales, el patrón estándar en JavaScript.' },
        { nombre: 'Cobertura', texto: 'Porcentaje de líneas ejecutadas por los tests. No mide capacidad de detección.' },
        { nombre: 'Mutante', texto: 'Versión del código con un fallo introducido a propósito para evaluar los tests.' }
      ],

      ejemplo: {
        titulo: 'Batería para otra función con umbrales: cálculo de una comisión',
        codigo:
'/* ESPECIFICACIÓN de comision(importe, tipoCliente)\n' +
' *  1. Base: 2 % del importe\n' +
' *  2. Los clientes "premium" pagan la mitad (1 %)\n' +
' *  3. Comisión mínima: 1,50 €\n' +
' *  4. Comisión máxima: 25 €\n' +
' *  5. Importe 0 o negativo -> comisión 0\n' +
' *  6. Redondeo a 2 decimales\n' +
' */\n' +
'\n' +
'function testsComision(comision) {\n' +
'\n' +
'  // --- Regla 1: 2 % del importe ----------------------------------\n' +
'  // 500 * 2 % = 10, dentro de los límites\n' +
'  expect(comision(500, "normal")).toBe(10);\n' +
'\n' +
'  // --- Regla 2: premium paga la mitad ----------------------------\n' +
'  // Mismo importe, tipo distinto: separa las dos ramas\n' +
'  expect(comision(500, "premium")).toBe(5);\n' +
'\n' +
'  // Un tipo desconocido se trata como normal\n' +
'  expect(comision(500, "loquesea")).toBe(10);\n' +
'\n' +
'  // --- Regla 3: mínimo de 1,50 € ---------------------------------\n' +
'  // 50 * 2 % = 1 -> sube al mínimo\n' +
'  expect(comision(50, "normal")).toBe(1.5);\n' +
'\n' +
'  // LÍMITE: 75 * 2 % = 1,50 exactos -> no se toca\n' +
'  expect(comision(75, "normal")).toBe(1.5);\n' +
'\n' +
'  // LÍMITE: 76 * 2 % = 1,52 -> por encima del mínimo\n' +
'  expect(comision(76, "normal")).toBe(1.52);\n' +
'\n' +
'  // --- Regla 4: máximo de 25 € -----------------------------------\n' +
'  // 5000 * 2 % = 100 -> se recorta a 25\n' +
'  expect(comision(5000, "normal")).toBe(25);\n' +
'\n' +
'  // LÍMITE: 1250 * 2 % = 25 exactos -> no se recorta\n' +
'  expect(comision(1250, "normal")).toBe(25);\n' +
'\n' +
'  // LÍMITE: 1249 * 2 % = 24,98 -> por debajo del máximo\n' +
'  expect(comision(1249, "normal")).toBe(24.98);\n' +
'\n' +
'  // --- Regla 5: importes no positivos ----------------------------\n' +
'  expect(comision(0, "normal")).toBe(0);\n' +
'  expect(comision(-100, "normal")).toBe(0);\n' +
'\n' +
'  // Cruce: importe 0 y cliente premium sigue siendo 0\n' +
'  expect(comision(0, "premium")).toBe(0);\n' +
'\n' +
'  // --- Regla 6: redondeo a 2 decimales ---------------------------\n' +
'  // 333.33 * 0.02 = 6.666600000000001\n' +
'  expect(comision(333.33, "normal")).toBe(6.67);\n' +
'\n' +
'  // --- Cruce mínimo + premium ------------------------------------\n' +
'  // 100 premium = 1 % = 1 -> sube al mínimo de 1,50\n' +
'  // Comprueba que el mínimo se aplica DESPUÉS del descuento premium\n' +
'  expect(comision(100, "premium")).toBe(1.5);\n' +
'}',
        texto:
          'Mismo método, otra función. Cuenta los tests: **catorce**, y ninguno inventado. Salen de aplicar ' +
          'dos reglas mecánicas.\n' +
          '**Una por regla:** seis reglas, seis tests base.\n' +
          '**Tres por umbral:** hay dos umbrales (el mínimo de 1,50 € y el máximo de 25 €), y para cada uno ' +
          'se prueba por debajo, el valor exacto y por encima. Fíjate en que los importes están elegidos ' +
          'para que el resultado caiga **justo** en el umbral: 75 × 2 % = 1,50 exactos, 1250 × 2 % = 25 ' +
          'exactos. Eso requiere hacer la cuenta al revés, y es donde está el trabajo real.\n' +
          '**Los cruces:** importe 0 con premium, y el mínimo aplicado después del descuento premium. Este ' +
          'último es el más valioso de toda la batería, porque comprueba el **orden** de aplicación de las ' +
          'reglas, que es exactamente lo que la especificación no dice de forma explícita.\n' +
          'Aplica el mismo procedimiento a `calcularPrecio`: cinco reglas, dos umbrales, dos cruces.'
      },

      glosario: [
        { termino: 'Cobertura (coverage)', definicion: 'Porcentaje de líneas o ramas ejecutadas durante los tests. Alta cobertura no implica buenos tests.' },
        { termino: 'Testing de mutación', definicion: 'Técnica que mide la calidad de los tests introduciendo fallos deliberados y contando cuántos detectan.' },
        { termino: 'Mutante', definicion: 'Versión del código con un fallo introducido a propósito.' },
        { termino: 'Mutante superviviente', definicion: 'Fallo introducido que los tests no detectan. Señala un hueco exacto en la batería.' },
        { termino: 'Valor límite', definicion: 'Valor justo en la frontera de una condición. Donde más se concentran los errores.' },
        { termino: 'Análisis de valores límite', definicion: 'Técnica de diseño de casos que prueba por debajo, en el umbral y por encima de cada frontera.' },
        { termino: 'Caso borde (edge case)', definicion: 'Entrada poco frecuente pero válida: lista vacía, valor cero, cantidad negativa, texto muy largo.' },
        { termino: 'Aserción', definicion: 'Comprobación individual dentro de un test. Si falla, lanza y el test se marca en rojo.' },
        { termino: 'Test frágil', definicion: 'Test que se rompe al refactorizar sin que haya cambiado el comportamiento. Suele deberse a comprobar implementación en vez de resultado.' },
        { termino: 'Coma flotante', definicion: 'Representación binaria de los decimales. Produce restos en operaciones que en base 10 serían exactas.' }
      ],

      preparado: [
        '¿Por qué un 87 % de cobertura no garantiza detectar bugs?',
        'Ante cualquier test, ¿sabrías responder a "qué versión rota del código haría fallar esto"?',
        'Si la especificación dice "50 o más", ¿qué tres valores pruebas?',
        '¿Por qué un test con `cantidad: 1` no detecta que la implementación ignora la cantidad?',
        '¿Qué dato elegirías para detectar que el total no se redondea, y por qué ese?',
        '¿Cuántos tests te dicta esta especificación aplicando "uno por regla y tres por umbral"?',
        '¿Sabrías nombrar los dos cruces entre reglas que hay en este ejercicio?'
      ]
    },

    rationale:
      'La prueba está construida al revés de lo habitual: en vez de darte tests y pedirte que hagas pasar el ' +
      'código, te da el código y evalúa **tus tests**. Es testing de mutación aplicado a la evaluación de una ' +
      'persona, y mide justo lo que la cobertura no mide. Los cinco bugs no son aleatorios: cada uno ' +
      'corresponde a una regla distinta de la especificación, de modo que la batería mínima que los mata es ' +
      'exactamente "un test por regla, con los datos bien elegidos".',

    alternatives: [
      { name: 'Testing basado en propiedades (fast-check)', when: 'La función tiene invariantes claras.', tradeoff: 'Genera cientos de entradas y encuentra casos borde que no se te ocurrirían (por ejemplo, que el total nunca sea negativo). A cambio, los fallos son más difíciles de leer y hace falta pensar en propiedades, no en ejemplos.' },
      { name: 'Tests parametrizados (test.each)', when: 'Muchos casos con la misma forma.', tradeoff: 'Una tabla de entradas y salidas esperadas es muy compacta y legible; se pierde algo de claridad en el mensaje de error si no se nombra bien cada fila.' },
      { name: 'Herramienta de mutación real (Stryker)', when: 'Proyecto con batería consolidada.', tradeoff: 'Genera los mutantes automáticamente y da una puntuación objetiva. Es lento, así que suele ejecutarse en un trabajo nocturno y no en cada commit.' },
      { name: 'Tests de aprobación (snapshot)', when: 'La salida es grande y estable.', tradeoff: 'Muy rápidos de escribir; peligrosos porque se actualizan sin leer y acaban aprobando el bug.' }
    ],

    commonErrors: [
      { error: 'Escribir muchos tests del mismo caso con datos distintos.', why: 'Sube la cobertura y no aumenta la detección. Es exactamente lo que le pasó a la empresa del enunciado con sus 40 tests.', fix: 'Un test por regla y por límite, no por dato.' },
      { error: 'Usar siempre `cantidad: 1`.', why: 'Hace invisible cualquier fallo relacionado con la multiplicación.', fix: 'Al menos un caso con cantidad mayor que 1 y otro con varias líneas.' },
      { error: 'Probar solo importes redondos.', why: 'Un total sin redondear da el mismo resultado que uno redondeado cuando no hay decimales problemáticos.', fix: 'Incluir un caso con decimales que produzcan resto en coma flotante.' },
      { error: 'No probar nunca el valor exacto del umbral.', why: 'Un `>` escrito donde debía ir `>=` solo se manifiesta ahí. Es uno de los errores más frecuentes que existen.', fix: 'Para cada umbral: justo debajo, exacto y justo encima.' },
      { error: 'Olvidar la entrada vacía.', why: 'Lista vacía, `null` y cero son las tres entradas que más fallos producen y las que menos se prueban.', fix: 'Un caso de carrito vacío en toda batería que reciba una colección.' },
      { error: 'Comprobar la implementación en vez del resultado.', why: 'Verificar que se llamó a una función interna hace el test frágil: se rompe al refactorizar aunque el comportamiento sea idéntico.', fix: 'Comprobar solo lo que entra y lo que sale.' },
      { error: 'Tests sin nombre ni comentario que expliquen qué cazan.', why: 'Cuando uno falla dentro de seis meses, nadie sabe si el test estaba mal o el código.', fix: 'Un comentario por caso indicando la regla que verifica.' }
    ],

    bestPractices: [
      'Antes de escribir un test, responde: ¿qué bug cazaría esto?',
      'La especificación es el índice de la batería: un test por regla, tres por umbral.',
      'Elige los datos para que la versión correcta y la rota den resultados **distintos**.',
      'Prueba siempre la entrada vacía y el valor cero.',
      'Comprueba resultados, no implementación: así el test sobrevive a los refactors.',
      'Agrupa los tests por regla y coméntalos: se mantienen mucho mejor.'
    ],

    security: [
      'Los tests con datos reales de clientes acaban en el repositorio y en los registros de CI. Usa datos sintéticos.',
      'Un test que necesita credenciales reales para pasar es un secreto esperando a filtrarse: usa dobles de prueba.',
      'Comprobar los límites de importe no es solo corrección: un cálculo sin mínimo ni máximo es un vector de abuso económico.'
    ],

    performance: [
      'Una batería lenta no se ejecuta, y una batería que no se ejecuta no protege nada. Los tests unitarios deben tardar milisegundos.',
      'Prefiere muchos tests unitarios rápidos a pocos de extremo a extremo lentos: el fallo se localiza antes.',
      'Las herramientas de mutación son caras de ejecutar: van en un trabajo periódico, no en cada commit.'
    ],

    companyLooksFor: [
      'Que pruebes los límites sin que nadie te lo pida: es la señal más clara de experiencia real en testing.',
      'Que elijas los datos con intención en lugar de poner números al azar.',
      'Que contemples la entrada vacía.',
      'Que sepas explicar la diferencia entre cobertura y capacidad de detección.',
      'Que los tests se lean como documentación de la especificación.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Los tests pasan con la implementación correcta', weight: 15 },
        { criteria: 'Detectan los cinco fallos introducidos', weight: 45 },
        { criteria: 'Cubren valores límite de los dos umbrales', weight: 20 },
        { criteria: 'Contemplan entrada vacía y cruces entre reglas', weight: 10 },
        { criteria: 'Organización y comentarios que expliquen qué caza cada test', weight: 10 }
      ]
    },

    reinforce: [
      'Análisis de valores límite y particiones de equivalencia.',
      'Testing basado en propiedades con fast-check.',
      'Herramientas de mutación: Stryker para JavaScript.',
      'Aritmética de coma flotante y manejo de dinero en enteros.',
      'Prueba después: `dbg-carrito-fantasma`, donde los bugs los tienes que encontrar tú.'
    ]
  });

  /* ==================================================================
     2. Debugging Challenge: el carrito fantasma
     ================================================================== */
  TT.defineExercise({
    id: 'dbg-carrito-fantasma',
    categorias: ['javascript'],
    title: 'Debugging Challenge: el carrito que suma mal',
    category: 'debugging',
    kind: 'fix',
    level: 'mid',
    time: 50,
    tags: ['debugging', 'estado', 'arrays', 'diagnóstico'],

    context:
      'Atención al cliente ha abierto 31 incidencias en dos semanas sobre el carrito de la tienda. Los ' +
      'mensajes no se parecen entre sí: "aparece dos veces el mismo producto", "el contador dice 3 y tengo ' +
      '7 unidades", "al quitar un artículo se rompe la página", "el total tiene mil decimales".',

    situation:
      'El desarrollador que lo escribió ya no está. El módulo son 30 líneas, no tiene tests y en apariencia ' +
      'funciona: si añades un producto y miras el total, todo parece correcto. Los fallos solo salen cuando ' +
      'el usuario hace algo más que el camino feliz.',

    goal:
      'Encontrar y corregir los cuatro fallos de `crearCarrito` sin cambiar su interfaz pública: los métodos ' +
      'deben seguir llamándose igual y recibiendo los mismos parámetros.',

    tech: ['JavaScript'],
    skills: ['diagnóstico de fallos', 'manejo de arrays', 'estado mutable', 'lectura de código ajeno'],

    starter: {
      lang: 'javascript',
      code:
'/* ============================================================\n' +
'   COMPORTAMIENTO ESPERADO\n' +
'   ------------------------------------------------------------\n' +
'   anadir(producto, cantidad)\n' +
'     - producto = { id, nombre, precio }\n' +
'     - si el producto YA está en el carrito, suma la cantidad\n' +
'       a la línea existente en vez de crear otra\n' +
'\n' +
'   eliminar(id)\n' +
'     - quita por completo la línea de ese producto\n' +
'     - si el id no existe, no hace nada y no rompe\n' +
'\n' +
'   total()\n' +
'     - suma de precio x cantidad de todas las líneas\n' +
'     - redondeado a 2 decimales\n' +
'     - carrito vacío -> 0\n' +
'\n' +
'   contar()\n' +
'     - número total de UNIDADES, no de líneas\n' +
'\n' +
'   lineas()\n' +
'     - array de líneas del carrito\n' +
'   ============================================================ */\n' +
'\n' +
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  return {\n' +
'    anadir: function (producto, cantidad) {\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: cantidad\n' +
'      });\n' +
'    },\n' +
'\n' +
'    eliminar: function (id) {\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        if (items[i].id === id) {\n' +
'          delete items[i];\n' +
'        }\n' +
'      }\n' +
'    },\n' +
'\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return t;\n' +
'    },\n' +
'\n' +
'    contar: function () {\n' +
'      return items.length;\n' +
'    },\n' +
'\n' +
'    lineas: function () {\n' +
'      return items;\n' +
'    }\n' +
'  };\n' +
'}\n'
    },

    requirements: [
      'Bug 1 — `anadir` crea una línea nueva cada vez, aunque el producto ya esté en el carrito.',
      'Bug 2 — `eliminar` usa `delete`, que deja un hueco en el array: el resto de métodos revienta después.',
      'Bug 3 — `contar` devuelve el número de líneas en lugar de la suma de unidades.',
      'Bug 4 — `total` no redondea, así que arrastra los restos de la coma flotante.',
      'La interfaz pública no cambia: mismos nombres de método y mismos parámetros.',
      'Un `eliminar` con un id inexistente no debe romper nada.'
    ],

    optional: [
      'Validar que la cantidad sea un entero positivo y descartar el resto.',
      'Copiar los datos del producto en lugar de guardar la referencia, para que una modificación externa no altere el carrito.',
      'Que `lineas()` devuelva una copia, de modo que nadie pueda modificar el estado interno desde fuera.'
    ],

    hints: [
      'Antes de tocar nada, escribe en un papel qué hace cada método con un carrito de dos productos, uno de ellos repetido. La mitad de los fallos aparecen solo al hacer esa simulación.',
      '`delete miArray[2]` **no** elimina el elemento: lo sustituye por un hueco vacío y deja `length` intacto. El método que sí elimina y recoloca es `splice`.',
      'Después de un `delete`, `items[i]` vale `undefined`, y `undefined.precio` lanza `TypeError`. Ese es el "al quitar un artículo se rompe la página".',
      'Para agrupar duplicados necesitas buscar la línea existente antes de insertar. `findIndex` o un bucle con `indexOf` sobre los ids sirven igual.',
      'Contar unidades es sumar el campo `cantidad` de todas las líneas, no medir la longitud del array.'
    ],

    tests: {
      mode: 'js',
      timeout: 5000,
      setup:
'var CAMISETA = { id: "p1", nombre: "Camiseta", precio: 19.99 };\n' +
'var TAZA     = { id: "p2", nombre: "Taza",     precio: 10.10 };\n' +
'var LIBRO    = { id: "p3", nombre: "Libro",    precio: 24.50 };',
      cases: [
        {
          name: 'Un carrito recién creado está vacío',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  expect(c.total()).toBe(0);\n' +
'  expect(c.contar()).toBe(0);\n' +
'  expect(c.lineas()).toHaveLength(0);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Añadir un producto suelto funciona',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 2);\n' +
'  expect(c.lineas()).toHaveLength(1);\n' +
'  expect(c.total()).toBe(39.98);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Bug 1 — añadir dos veces el mismo producto agrupa en una sola línea',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 2);\n' +
'  c.anadir(CAMISETA, 3);\n' +
'  expect(c.lineas()).toHaveLength(1);\n' +
'  expect(c.lineas()[0].cantidad).toBe(5);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Bug 2 — eliminar deja el array sin huecos',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 1);\n' +
'  c.anadir(TAZA, 1);\n' +
'  c.eliminar("p1");\n' +
'  expect(c.lineas()).toHaveLength(1);\n' +
'  expect(c.lineas()[0].id).toBe("p2");\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Bug 2 — el total sigue funcionando después de eliminar',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 1);\n' +
'  c.anadir(LIBRO, 2);\n' +
'  c.eliminar("p1");\n' +
'  expect(c.total()).toBe(49);\n' +
'  expect(c.contar()).toBe(2);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Bug 3 — contar devuelve unidades, no líneas',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 3);\n' +
'  c.anadir(TAZA, 4);\n' +
'  expect(c.lineas()).toHaveLength(2);\n' +
'  expect(c.contar()).toBe(7);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Bug 4 — el total viene redondeado a dos decimales',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(TAZA, 3);\n' +
'  expect(c.total()).toBe(30.3);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Eliminar un id que no existe no rompe nada',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 1);\n' +
'  c.eliminar("no-existe");\n' +
'  expect(c.lineas()).toHaveLength(1);\n' +
'  expect(c.total()).toBe(19.99);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Eliminar todo deja el carrito en su estado inicial',
          code:
'(function () {\n' +
'  var c = crearCarrito();\n' +
'  c.anadir(CAMISETA, 2);\n' +
'  c.anadir(TAZA, 1);\n' +
'  c.eliminar("p1");\n' +
'  c.eliminar("p2");\n' +
'  expect(c.lineas()).toHaveLength(0);\n' +
'  expect(c.total()).toBe(0);\n' +
'  expect(c.contar()).toBe(0);\n' +
'  return true;\n' +
'})()'
        },
        {
          name: 'Dos carritos no comparten estado',
          code:
'(function () {\n' +
'  var a = crearCarrito();\n' +
'  var b = crearCarrito();\n' +
'  a.anadir(CAMISETA, 1);\n' +
'  expect(b.contar()).toBe(0);\n' +
'  expect(b.total()).toBe(0);\n' +
'  return true;\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  /** Índice de la línea de un producto, o -1 si no está. */\n' +
'  function indiceDe(id) {\n' +
'    for (var i = 0; i < items.length; i++) {\n' +
'      if (items[i].id === id) return i;\n' +
'    }\n' +
'    return -1;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    // BUG 1 corregido: si el producto ya está, se suma a su línea.\n' +
'    anadir: function (producto, cantidad) {\n' +
'      var unidades = Number(cantidad);\n' +
'      if (!Number.isInteger(unidades) || unidades < 1) return;\n' +
'\n' +
'      var i = indiceDe(producto.id);\n' +
'      if (i !== -1) {\n' +
'        items[i].cantidad = items[i].cantidad + unidades;\n' +
'        return;\n' +
'      }\n' +
'\n' +
'      // Copiamos los campos en vez de guardar el producto recibido:\n' +
'      // si quien llama lo modifica después, el carrito no cambia.\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: unidades\n' +
'      });\n' +
'    },\n' +
'\n' +
'    // BUG 2 corregido: splice elimina de verdad y recoloca el array.\n' +
'    eliminar: function (id) {\n' +
'      var i = indiceDe(id);\n' +
'      if (i === -1) return;        // id inexistente: no hacemos nada\n' +
'      items.splice(i, 1);\n' +
'    },\n' +
'\n' +
'    // BUG 4 corregido: se redondea a 2 decimales al final.\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return Math.round(t * 100) / 100;\n' +
'    },\n' +
'\n' +
'    // BUG 3 corregido: se suman las unidades, no las líneas.\n' +
'    contar: function () {\n' +
'      var n = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        n = n + items[i].cantidad;\n' +
'      }\n' +
'      return n;\n' +
'    },\n' +
'\n' +
'    // Copia superficial: nadie puede alterar el estado interno\n' +
'    // haciendo push sobre lo que devolvemos.\n' +
'    lineas: function () {\n' +
'      return items.slice();\n' +
'    }\n' +
'  };\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 0 — Diagnóstico: reproducir cada fallo antes de tocar nada',
        objetivo:
          'Convertir las cuatro quejas de atención al cliente en cuatro reproducciones concretas. Sin esto ' +
          'se corrige a ciegas y se rompen cosas que funcionaban.',
        anadido: [
          'Todavía no se modifica el código: solo se anota qué hace cada método con datos reales.'
        ],
        codigo:
'/* ============================================================\n' +
'   DIAGNÓSTICO — código sin tocar, simulación a mano\n' +
'   ============================================================\n' +
'\n' +
'   var c = crearCarrito();\n' +
'   c.anadir({ id: "p1", nombre: "Camiseta", precio: 19.99 }, 2);\n' +
'   c.anadir({ id: "p1", nombre: "Camiseta", precio: 19.99 }, 3);\n' +
'\n' +
'   items = [ { id:"p1", cantidad:2 }, { id:"p1", cantidad:3 } ]\n' +
'            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
'   BUG 1 -> "aparece dos veces el mismo producto"\n' +
'            `anadir` hace push siempre, sin mirar si ya está.\n' +
'\n' +
'   c.contar()  ->  items.length  ->  2\n' +
'   pero hay 5 unidades\n' +
'   BUG 3 -> "el contador dice 3 y tengo 7 unidades"\n' +
'            `contar` mide líneas, no unidades.\n' +
'\n' +
'   c.eliminar("p1")\n' +
'   delete items[0]  ->  items = [ <hueco>, { id:"p1", cantidad:3 } ]\n' +
'                        items.length sigue siendo 2\n' +
'   c.total()  ->  items[0] es undefined  ->  undefined.precio\n' +
'                  TypeError: Cannot read properties of undefined\n' +
'   BUG 2 -> "al quitar un artículo se rompe la página"\n' +
'            `delete` deja un hueco; hace falta `splice`.\n' +
'\n' +
'   var c2 = crearCarrito();\n' +
'   c2.anadir({ id:"p2", nombre:"Taza", precio:10.10 }, 3);\n' +
'   c2.total()  ->  10.10 * 3  ->  30.299999999999997\n' +
'   BUG 4 -> "el total tiene mil decimales"\n' +
'            falta redondear.\n' +
'\n' +
'   PLAN: corregir en este orden, de dentro afuera.\n' +
'     1. Extraer una función `indiceDe(id)`: la necesitan\n' +
'        tanto `anadir` (para agrupar) como `eliminar`.\n' +
'     2. anadir  -> agrupar duplicados      (bug 1)\n' +
'     3. eliminar -> splice en vez de delete (bug 2)\n' +
'     4. contar  -> sumar cantidades         (bug 3)\n' +
'     5. total   -> redondear                (bug 4)\n' +
'   ============================================================ */\n' +
'\n' +
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  return {\n' +
'    anadir: function (producto, cantidad) {\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: cantidad\n' +
'      });\n' +
'    },\n' +
'\n' +
'    eliminar: function (id) {\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        if (items[i].id === id) {\n' +
'          delete items[i];\n' +
'        }\n' +
'      }\n' +
'    },\n' +
'\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return t;\n' +
'    },\n' +
'\n' +
'    contar: function () {\n' +
'      return items.length;\n' +
'    },\n' +
'\n' +
'    lineas: function () {\n' +
'      return items;\n' +
'    }\n' +
'  };\n' +
'}\n',
        explicacion:
          'El código de esta fase es **idéntico al de partida**: lo único que se ha añadido es el bloque de ' +
          'diagnóstico. Esa es la fase que más gente se salta y la que más tiempo ahorra.\n' +
          'Cada queja de atención al cliente se ha traducido a una secuencia concreta de llamadas y al ' +
          'estado exacto de `items` en cada paso. Con eso, los cuatro fallos dejan de ser síntomas y pasan a ' +
          'ser líneas concretas.\n' +
          'Fíjate en que el orden del plan no es el orden de aparición en el archivo: primero se extrae ' +
          '`indiceDe`, porque dos correcciones distintas la necesitan. Corregir sin ver esa dependencia ' +
          'lleva a escribir el mismo bucle dos veces.',
        comprueba:
          'Ejecuta los tests tal cual, sin cambiar nada. Deberías ver fallar los casos de los bugs 1, 2, 3 y 4, ' +
          'y pasar los dos primeros. Eso confirma que el diagnóstico es correcto.'
      },
      {
        titulo: 'Fase 1 — Extraer `indiceDe` y corregir el agrupado (bug 1)',
        objetivo:
          'Que añadir dos veces el mismo producto sume la cantidad a la línea existente en lugar de crear ' +
          'una segunda.',
        anadido: [
          'Función auxiliar `indiceDe(id)` dentro del cierre, antes del `return`.',
          '`anadir` busca primero y solo hace `push` si el producto no estaba.'
        ],
        codigo:
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  /** Índice de la línea de un producto, o -1 si no está. */\n' +
'  function indiceDe(id) {\n' +
'    for (var i = 0; i < items.length; i++) {\n' +
'      if (items[i].id === id) return i;\n' +
'    }\n' +
'    return -1;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    // BUG 1 corregido: si el producto ya está, se suma a su línea.\n' +
'    anadir: function (producto, cantidad) {\n' +
'      var i = indiceDe(producto.id);\n' +
'      if (i !== -1) {\n' +
'        items[i].cantidad = items[i].cantidad + cantidad;\n' +
'        return;\n' +
'      }\n' +
'\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: cantidad\n' +
'      });\n' +
'    },\n' +
'\n' +
'    eliminar: function (id) {\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        if (items[i].id === id) {\n' +
'          delete items[i];\n' +
'        }\n' +
'      }\n' +
'    },\n' +
'\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return t;\n' +
'    },\n' +
'\n' +
'    contar: function () {\n' +
'      return items.length;\n' +
'    },\n' +
'\n' +
'    lineas: function () {\n' +
'      return items;\n' +
'    }\n' +
'  };\n' +
'}\n',
        explicacion:
          '`indiceDe` se declara **dentro** de `crearCarrito` pero **fuera** del objeto que se devuelve. Esa ' +
          'posición importa: al estar en el cierre, ve la variable `items` de este carrito concreto y no es ' +
          'accesible desde fuera. Si la pusieras fuera de `crearCarrito`, no tendría acceso a `items`; si la ' +
          'pusieras dentro del objeto devuelto, pasaría a formar parte de la interfaz pública, que el ' +
          'enunciado pide no cambiar.\n' +
          'En `anadir`, el `return` después de sumar la cantidad es lo que evita que se ejecute también el ' +
          '`push`. Sin él tendrías la línea actualizada **y** una línea nueva: peor que el bug original.\n' +
          'Los demás métodos siguen exactamente igual que antes. En esta fase solo se ha tocado `anadir`.',
        comprueba:
          'El caso "Bug 1 — añadir dos veces el mismo producto agrupa" debería pasar a verde. Los de los ' +
          'bugs 2, 3 y 4 siguen en rojo.'
      },
      {
        titulo: 'Fase 2 — `splice` en lugar de `delete` (bug 2)',
        objetivo:
          'Que eliminar una línea la quite de verdad y recoloque el array, en lugar de dejar un hueco que ' +
          'hace reventar al resto de métodos.',
        anadido: [
          '`eliminar` reutiliza `indiceDe` en vez de recorrer el array a mano.',
          'Salida temprana si el id no existe.',
          '`items.splice(i, 1)` sustituye a `delete items[i]`.'
        ],
        codigo:
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  /** Índice de la línea de un producto, o -1 si no está. */\n' +
'  function indiceDe(id) {\n' +
'    for (var i = 0; i < items.length; i++) {\n' +
'      if (items[i].id === id) return i;\n' +
'    }\n' +
'    return -1;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    // BUG 1 corregido: si el producto ya está, se suma a su línea.\n' +
'    anadir: function (producto, cantidad) {\n' +
'      var i = indiceDe(producto.id);\n' +
'      if (i !== -1) {\n' +
'        items[i].cantidad = items[i].cantidad + cantidad;\n' +
'        return;\n' +
'      }\n' +
'\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: cantidad\n' +
'      });\n' +
'    },\n' +
'\n' +
'    // BUG 2 corregido: splice elimina de verdad y recoloca el array.\n' +
'    eliminar: function (id) {\n' +
'      var i = indiceDe(id);\n' +
'      if (i === -1) return;        // id inexistente: no hacemos nada\n' +
'      items.splice(i, 1);\n' +
'    },\n' +
'\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return t;\n' +
'    },\n' +
'\n' +
'    contar: function () {\n' +
'      return items.length;\n' +
'    },\n' +
'\n' +
'    lineas: function () {\n' +
'      return items;\n' +
'    }\n' +
'  };\n' +
'}\n',
        explicacion:
          'Este es el fallo más grave de los cuatro, porque no da un resultado incorrecto: **lanza una ' +
          'excepción** y tumba la página entera.\n' +
          '`delete items[0]` no acorta el array. Deja `length` en 2 y coloca un hueco donde estaba el ' +
          'elemento. Cuando `total` llega a esa posición, `items[0]` vale `undefined` y `undefined.precio` ' +
          'lanza `TypeError`.\n' +
          '`items.splice(i, 1)` sí elimina el elemento, desplaza los siguientes y deja `length` en 1.\n' +
          'Como ahora la agrupación de la fase 1 garantiza que no hay ids repetidos, basta con eliminar la ' +
          'primera coincidencia: por eso el bucle desaparece y se sustituye por `indiceDe` más una salida ' +
          'temprana. Esa salida temprana es también lo que hace que borrar un id inexistente no rompa nada.',
        comprueba:
          'Los dos casos del bug 2 y el de "eliminar un id que no existe" deberían pasar a verde. Quedan en ' +
          'rojo los de `contar` y el redondeo.'
      },
      {
        titulo: 'Fase 3 — `contar` suma unidades (bug 3)',
        objetivo:
          'Que el contador de la cabecera muestre las unidades reales del carrito y no el número de líneas.',
        anadido: [
          '`contar` recorre las líneas y acumula el campo `cantidad`.'
        ],
        codigo:
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  /** Índice de la línea de un producto, o -1 si no está. */\n' +
'  function indiceDe(id) {\n' +
'    for (var i = 0; i < items.length; i++) {\n' +
'      if (items[i].id === id) return i;\n' +
'    }\n' +
'    return -1;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    // BUG 1 corregido: si el producto ya está, se suma a su línea.\n' +
'    anadir: function (producto, cantidad) {\n' +
'      var i = indiceDe(producto.id);\n' +
'      if (i !== -1) {\n' +
'        items[i].cantidad = items[i].cantidad + cantidad;\n' +
'        return;\n' +
'      }\n' +
'\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: cantidad\n' +
'      });\n' +
'    },\n' +
'\n' +
'    // BUG 2 corregido: splice elimina de verdad y recoloca el array.\n' +
'    eliminar: function (id) {\n' +
'      var i = indiceDe(id);\n' +
'      if (i === -1) return;        // id inexistente: no hacemos nada\n' +
'      items.splice(i, 1);\n' +
'    },\n' +
'\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return t;\n' +
'    },\n' +
'\n' +
'    // BUG 3 corregido: se suman las unidades, no las líneas.\n' +
'    contar: function () {\n' +
'      var n = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        n = n + items[i].cantidad;\n' +
'      }\n' +
'      return n;\n' +
'    },\n' +
'\n' +
'    lineas: function () {\n' +
'      return items;\n' +
'    }\n' +
'  };\n' +
'}\n',
        explicacion:
          'La corrección es de tres líneas, pero conviene entender por qué el fallo pasó tanto tiempo ' +
          'inadvertido: **con un producto y una unidad, `items.length` y la suma de cantidades valen lo ' +
          'mismo**. Solo se separan cuando alguien añade más de una unidad, que es justo lo que no hacía ' +
          'ninguna prueba manual.\n' +
          'Es el mismo motivo por el que en la prueba de testing insistimos en usar `cantidad` mayor que 1: ' +
          'un dato mal elegido hace invisible el bug.\n' +
          'El carrito vacío sigue devolviendo 0 sin necesidad de un caso especial, porque el bucle no ' +
          'ejecuta ninguna vuelta y `n` conserva su valor inicial.',
        comprueba: 'El caso del bug 3 pasa a verde. Solo queda el del redondeo.'
      },
      {
        titulo: 'Fase 4 — Redondeo del total (bug 4)',
        objetivo:
          'Que el total sea un importe presentable y contable, sin los restos de la aritmética en coma ' +
          'flotante.',
        anadido: [
          '`total` redondea a dos decimales antes de devolver.'
        ],
        codigo:
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  /** Índice de la línea de un producto, o -1 si no está. */\n' +
'  function indiceDe(id) {\n' +
'    for (var i = 0; i < items.length; i++) {\n' +
'      if (items[i].id === id) return i;\n' +
'    }\n' +
'    return -1;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    // BUG 1 corregido: si el producto ya está, se suma a su línea.\n' +
'    anadir: function (producto, cantidad) {\n' +
'      var i = indiceDe(producto.id);\n' +
'      if (i !== -1) {\n' +
'        items[i].cantidad = items[i].cantidad + cantidad;\n' +
'        return;\n' +
'      }\n' +
'\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: cantidad\n' +
'      });\n' +
'    },\n' +
'\n' +
'    // BUG 2 corregido: splice elimina de verdad y recoloca el array.\n' +
'    eliminar: function (id) {\n' +
'      var i = indiceDe(id);\n' +
'      if (i === -1) return;        // id inexistente: no hacemos nada\n' +
'      items.splice(i, 1);\n' +
'    },\n' +
'\n' +
'    // BUG 4 corregido: se redondea a 2 decimales al final.\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return Math.round(t * 100) / 100;\n' +
'    },\n' +
'\n' +
'    // BUG 3 corregido: se suman las unidades, no las líneas.\n' +
'    contar: function () {\n' +
'      var n = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        n = n + items[i].cantidad;\n' +
'      }\n' +
'      return n;\n' +
'    },\n' +
'\n' +
'    lineas: function () {\n' +
'      return items;\n' +
'    }\n' +
'  };\n' +
'}\n',
        explicacion:
          'El redondeo va **una sola vez, al final**. Redondear en cada vuelta del bucle acumularía errores ' +
          'de redondeo en carritos grandes, que es un fallo más sutil y más difícil de detectar que el ' +
          'original.\n' +
          '`Math.round(t * 100) / 100` funciona así: multiplicar por 100 mueve los dos decimales a la parte ' +
          'entera, `Math.round` elimina el resto binario y la división lo devuelve a su sitio.\n' +
          'Con esto los cuatro bugs del enunciado están corregidos y todos los tests pasan. La fase ' +
          'siguiente no arregla nada: endurece el módulo.',
        comprueba: 'Los diez casos de la plataforma deberían estar en verde.'
      },
      {
        titulo: 'Fase 5 — Endurecer: validación de entrada y estado encapsulado',
        objetivo:
          'Cerrar las dos puertas que quedan abiertas: cantidades inválidas y acceso directo al estado ' +
          'interno desde fuera. Ninguna de las dos aparece en las incidencias todavía, y las dos aparecerán.',
        anadido: [
          '`anadir` valida que la cantidad sea un entero positivo y descarta el resto.',
          '`anadir` copia los campos del producto en lugar de guardar la referencia recibida.',
          '`lineas` devuelve una copia del array, no el array interno.'
        ],
        codigo:
'function crearCarrito() {\n' +
'  var items = [];\n' +
'\n' +
'  /** Índice de la línea de un producto, o -1 si no está. */\n' +
'  function indiceDe(id) {\n' +
'    for (var i = 0; i < items.length; i++) {\n' +
'      if (items[i].id === id) return i;\n' +
'    }\n' +
'    return -1;\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    // BUG 1 corregido: si el producto ya está, se suma a su línea.\n' +
'    anadir: function (producto, cantidad) {\n' +
'      var unidades = Number(cantidad);\n' +
'      if (!Number.isInteger(unidades) || unidades < 1) return;\n' +
'\n' +
'      var i = indiceDe(producto.id);\n' +
'      if (i !== -1) {\n' +
'        items[i].cantidad = items[i].cantidad + unidades;\n' +
'        return;\n' +
'      }\n' +
'\n' +
'      // Copiamos los campos en vez de guardar el producto recibido:\n' +
'      // si quien llama lo modifica después, el carrito no cambia.\n' +
'      items.push({\n' +
'        id: producto.id,\n' +
'        nombre: producto.nombre,\n' +
'        precio: producto.precio,\n' +
'        cantidad: unidades\n' +
'      });\n' +
'    },\n' +
'\n' +
'    // BUG 2 corregido: splice elimina de verdad y recoloca el array.\n' +
'    eliminar: function (id) {\n' +
'      var i = indiceDe(id);\n' +
'      if (i === -1) return;        // id inexistente: no hacemos nada\n' +
'      items.splice(i, 1);\n' +
'    },\n' +
'\n' +
'    // BUG 4 corregido: se redondea a 2 decimales al final.\n' +
'    total: function () {\n' +
'      var t = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        t = t + items[i].precio * items[i].cantidad;\n' +
'      }\n' +
'      return Math.round(t * 100) / 100;\n' +
'    },\n' +
'\n' +
'    // BUG 3 corregido: se suman las unidades, no las líneas.\n' +
'    contar: function () {\n' +
'      var n = 0;\n' +
'      for (var i = 0; i < items.length; i++) {\n' +
'        n = n + items[i].cantidad;\n' +
'      }\n' +
'      return n;\n' +
'    },\n' +
'\n' +
'    // Copia superficial: nadie puede alterar el estado interno\n' +
'    // haciendo push sobre lo que devolvemos.\n' +
'    lineas: function () {\n' +
'      return items.slice();\n' +
'    }\n' +
'  };\n' +
'}\n',
        explicacion:
          'Tres endurecimientos, cada uno cerrando un fallo futuro concreto.\n' +
          '**Validar la cantidad.** Sin esta comprobación, `anadir(producto, -5)` resta unidades y ' +
          '`anadir(producto, "3")` guarda una cadena que luego se concatena en vez de sumarse. Un usuario ' +
          'que manipule la petición puede dejar el total en negativo.\n' +
          '**Copiar los campos del producto.** Ya estaba así en el código original y conviene no perderlo: ' +
          'si guardases `producto` directamente y quien llama cambiase su precio después, el carrito ' +
          'cambiaría solo. Ese es el fallo que produce las incidencias imposibles de reproducir.\n' +
          '**Devolver una copia en `lineas`.** Devolver el array interno permite que cualquiera haga ' +
          '`carrito.lineas().push(...)` y meta datos sin pasar por `anadir`, saltándose toda la validación. ' +
          '`slice()` corta esa vía.\n' +
          'Esta es la solución final: los mismos cinco métodos, la misma interfaz y ninguna de las cuatro ' +
          'incidencias reproducible.',
        comprueba:
          'Los diez casos siguen en verde. Prueba además a mano `c.anadir(CAMISETA, 0)` y ' +
          '`c.lineas().push({})`: ninguna de las dos debería alterar el carrito.'
      }
    ],

    docs: {
      resumen:
        'Depurar no es leer código hasta que algo te llame la atención: es un **método**. Reproducir, ' +
        'localizar, entender, corregir y verificar. Este ejercicio te da ese método y los tres fallos de ' +
        'JavaScript que producen la mayoría de bugs con arrays y estado.',

      conceptos: [
        {
          titulo: 'El método: reproducir antes que corregir',
          texto:
            'La tentación es abrir el archivo y empezar a cambiar cosas. Es la forma más rápida de romper lo ' +
            'que funcionaba y de "arreglar" un fallo que no era el que se reportaba.\n' +
            'El orden que funciona es siempre el mismo:\n' +
            '**1. Reproducir.** Encuentra la secuencia exacta de llamadas que produce el fallo. Si no puedes ' +
            'reproducirlo, no puedes saber si lo has arreglado.\n' +
            '**2. Localizar.** Reduce el problema al método o la línea concreta.\n' +
            '**3. Entender.** Explica *por qué* falla. Corregir sin entender produce parches que reaparecen.\n' +
            '**4. Corregir.** Un fallo cada vez.\n' +
            '**5. Verificar.** Que el caso reportado funcione y que no hayas roto los demás.\n' +
            'En este ejercicio los tests te dan los pasos 1 y 5 hechos. Tu trabajo son el 2, el 3 y el 4.',
          codigo:
'// De síntoma a reproducción: traduce cada queja a llamadas concretas\n' +
'//\n' +
'//   "aparece dos veces el mismo producto"\n' +
'//      c.anadir(CAMISETA, 2); c.anadir(CAMISETA, 3);\n' +
'//      -> mira c.lineas().length\n' +
'//\n' +
'//   "al quitar un artículo se rompe la página"\n' +
'//      c.anadir(A,1); c.anadir(B,1); c.eliminar("A"); c.total();\n' +
'//      -> ¿lanza?\n' +
'//\n' +
'// Una queja sin reproducción es una opinión.'
        },
        {
          titulo: '`delete` sobre un array deja un hueco (no elimina)',
          texto:
            'Es el fallo más peligroso del ejercicio porque no produce un número incorrecto: **lanza una ' +
            'excepción** y tumba la interfaz.\n' +
            '`delete miArray[1]` borra el **valor** pero no la **posición**. El array queda con un hueco, ' +
            '`length` no cambia, y al recorrerlo te encuentras `undefined` donde esperabas un objeto.\n' +
            'El método correcto es `splice(indice, cuantos)`, que elimina de verdad y desplaza los ' +
            'siguientes.\n' +
            'Regla práctica: `delete` es para propiedades de objetos. Para arrays, `splice` o `filter`.',
          codigo:
'var a = ["x", "y", "z"];\n' +
'\n' +
'delete a[1];\n' +
'a;            // ["x", <1 empty item>, "z"]\n' +
'a.length;     // 3  <- NO ha cambiado\n' +
'a[1];         // undefined\n' +
'a[1].length;  // TypeError: Cannot read properties of undefined\n' +
'\n' +
'var b = ["x", "y", "z"];\n' +
'b.splice(1, 1);   // elimina 1 elemento desde el índice 1\n' +
'b;                // ["x", "z"]\n' +
'b.length;         // 2  <- correcto\n' +
'\n' +
'// Alternativa sin mutar: crea un array nuevo\n' +
'var c = ["x", "y", "z"].filter(function (v) { return v !== "y"; });'
        },
        {
          titulo: 'Buscar antes de insertar: agrupar en vez de duplicar',
          texto:
            'Un `push` directo no comprueba nada. Si la regla de negocio dice que un producto tiene una sola ' +
            'línea, hay que **buscar primero**.\n' +
            'El patrón es siempre el mismo: obtener el índice, y si existe actualizar; si no, insertar.\n' +
            'El detalle que más se falla es el `return` después de actualizar. Sin él se ejecuta también la ' +
            'inserción y acabas con la línea actualizada **y** una duplicada: peor que el bug de partida.',
          codigo:
'// Patrón buscar-o-insertar\n' +
'var i = indiceDe(producto.id);\n' +
'\n' +
'if (i !== -1) {\n' +
'  items[i].cantidad = items[i].cantidad + unidades;\n' +
'  return;                    // <- IMPRESCINDIBLE\n' +
'}\n' +
'\n' +
'items.push({ /* línea nueva */ });\n' +
'\n' +
'\n' +
'// Formas de obtener el índice (equivalentes aquí)\n' +
'items.findIndex(function (l) { return l.id === id; });   // -1 si no está\n' +
'items.find(function (l) { return l.id === id; });        // undefined si no está'
        },
        {
          titulo: 'Contar elementos frente a sumar un campo',
          texto:
            '`array.length` cuenta **posiciones**. Si cada posición representa una línea con varias ' +
            'unidades, la longitud no es lo que el usuario ve en el icono del carrito.\n' +
            'Este fallo es especialmente traicionero porque **con una unidad por línea los dos valores ' +
            'coinciden**. Solo se separan cuando alguien añade cantidad mayor que 1, que es justo lo que no ' +
            'hace nadie al probar a mano.\n' +
            'Es el mismo motivo por el que un test con `cantidad: 1` no detecta nada.',
          codigo:
'var items = [\n' +
'  { id: "p1", cantidad: 3 },\n' +
'  { id: "p2", cantidad: 4 }\n' +
'];\n' +
'\n' +
'items.length;   // 2  <- líneas\n' +
'                // 7  <- unidades, que es lo que espera el usuario\n' +
'\n' +
'// Con bucle\n' +
'var n = 0;\n' +
'for (var i = 0; i < items.length; i++) n = n + items[i].cantidad;\n' +
'\n' +
'// Con reduce\n' +
'var n = items.reduce(function (a, l) { return a + l.cantidad; }, 0);'
        },
        {
          titulo: 'Redondear una vez, al final',
          texto:
            'Los decimales binarios arrastran restos: `10.10 * 3` da `30.299999999999997`. En un total eso ' +
            'se ve directamente en pantalla.\n' +
            'El redondeo va **una sola vez, justo antes de devolver**. Redondear dentro del bucle acumula ' +
            'errores de redondeo línea a línea, y produce un fallo más sutil y más difícil de encontrar que ' +
            'el original.\n' +
            'En sistemas donde el dinero es crítico se trabaja en céntimos enteros durante todo el cálculo y ' +
            'se divide solo al presentar.',
          codigo:
'// MAL: redondea en cada vuelta, acumula error\n' +
'for (var i = 0; i < items.length; i++) {\n' +
'  t = t + Math.round(items[i].precio * items[i].cantidad * 100) / 100;\n' +
'}\n' +
'\n' +
'// BIEN: acumula con precisión y redondea al final\n' +
'for (var i = 0; i < items.length; i++) {\n' +
'  t = t + items[i].precio * items[i].cantidad;\n' +
'}\n' +
'return Math.round(t * 100) / 100;\n' +
'\n' +
'// Cómo funciona: 30.299999999999997\n' +
'//   * 100      -> 3029.9999999999995\n' +
'//   Math.round -> 3030\n' +
'//   / 100      -> 30.3'
        },
        {
          titulo: 'Estado encapsulado: qué se devuelve y qué se guarda',
          texto:
            'Dos fugas de encapsulación que aparecen en casi todo módulo con estado:\n' +
            '**Devolver el array interno.** Si `lineas()` devuelve `items`, cualquiera puede hacer ' +
            '`carrito.lineas().push({...})` y meter datos saltándose toda la validación. `items.slice()` ' +
            'devuelve una copia y corta esa vía.\n' +
            '**Guardar la referencia recibida.** Si guardas el objeto `producto` tal cual y quien llama ' +
            'cambia su precio después, el carrito cambia solo. Ese es el origen de las incidencias ' +
            'imposibles de reproducir. Copiar los campos que necesitas lo evita.\n' +
            'Ambas cosas son baratas y evitan una clase entera de fallos.',
          codigo:
'// FUGA 1: se devuelve el array interno\n' +
'lineas: function () { return items; }\n' +
'//   carrito.lineas().push({ id: "falso", precio: -999 });  // funciona :(\n' +
'\n' +
'// CERRADA\n' +
'lineas: function () { return items.slice(); }\n' +
'\n' +
'\n' +
'// FUGA 2: se guarda la referencia recibida\n' +
'items.push(producto);\n' +
'//   producto.precio = 0;   // el carrito cambia solo\n' +
'\n' +
'// CERRADA: se copian los campos necesarios\n' +
'items.push({ id: producto.id, nombre: producto.nombre,\n' +
'             precio: producto.precio, cantidad: unidades });'
        },
        {
          titulo: 'Validar la entrada en el punto de entrada',
          texto:
            'Todo método público es una frontera. `anadir(producto, "3")` guardaría una cadena, y ' +
            '`"3" + 2` da `"32"`, no 5. `anadir(producto, -5)` dejaría el total en negativo.\n' +
            'La comprobación va **al principio del método**, antes de tocar el estado. Así o la operación se ' +
            'realiza entera o no se realiza: nunca se queda a medias.\n' +
            '`Number.isInteger` es más seguro que comprobaciones a mano porque descarta de un golpe ' +
            '`NaN`, los decimales, los infinitos y los valores no numéricos.',
          codigo:
'var unidades = Number(cantidad);\n' +
'if (!Number.isInteger(unidades) || unidades < 1) return;\n' +
'\n' +
'// Qué descarta cada parte\n' +
'Number("3");            // 3        -> válido\n' +
'Number("abc");          // NaN      -> Number.isInteger(NaN) es false\n' +
'Number(2.5);            // 2.5      -> no es entero\n' +
'Number(-5);             // -5       -> falla el < 1\n' +
'Number(0);              // 0        -> falla el < 1\n' +
'Number(null);           // 0        -> falla el < 1'
        }
      ],

      referencia: [
        { nombre: 'array.splice(i, n)', texto: 'Elimina `n` elementos desde el índice `i` y **recoloca** el resto. Modifica el array original.' },
        { nombre: 'delete array[i]', texto: 'Deja un hueco y NO cambia `length`. Para arrays es casi siempre un error.' },
        { nombre: 'array.findIndex(fn)', texto: 'Índice del primer elemento que cumple la condición, o `-1`.' },
        { nombre: 'array.find(fn)', texto: 'El elemento en sí, o `undefined`.' },
        { nombre: 'array.slice()', texto: 'Copia superficial del array. Sin argumentos, copia entero.' },
        { nombre: 'array.reduce((acc, x) => …, 0)', texto: 'Acumula sobre la lista. Alternativa al bucle para sumar cantidades o importes.' },
        { nombre: 'array.filter(fn)', texto: 'Array nuevo con los elementos que cumplen la condición. Alternativa a `splice` sin mutar.' },
        { nombre: 'Number.isInteger(n)', texto: 'Comprueba entero real. Descarta `NaN`, decimales e infinitos de un golpe.' },
        { nombre: 'Math.round(n * 100) / 100', texto: 'Redondeo a dos decimales.' },
        { nombre: 'TypeError: Cannot read properties of undefined', texto: 'Estás accediendo a una propiedad de algo que no existe. En arrays, señal casi segura de un hueco o de un índice fuera de rango.' }
      ],

      ejemplo: {
        titulo: 'Mismo método aplicado a otro módulo con los mismos fallos: una lista de favoritos',
        codigo:
'/* SÍNTOMAS REPORTADOS\n' +
' *   "puedo marcar como favorito dos veces el mismo artículo"\n' +
' *   "al quitar un favorito se queda la lista rara"\n' +
' *   "el contador de favoritos no coincide"\n' +
' */\n' +
'\n' +
'// ---------- ANTES ----------\n' +
'function crearFavoritos() {\n' +
'  var ids = [];\n' +
'  return {\n' +
'    marcar: function (id) { ids.push(id); },\n' +
'    desmarcar: function (id) {\n' +
'      for (var i = 0; i < ids.length; i++) {\n' +
'        if (ids[i] === id) delete ids[i];\n' +
'      }\n' +
'    },\n' +
'    esFavorito: function (id) { return ids.indexOf(id) !== -1; },\n' +
'    cuantos: function () { return ids.length; },\n' +
'    todos: function () { return ids; }\n' +
'  };\n' +
'}\n' +
'\n' +
'/* DIAGNÓSTICO\n' +
' *   f.marcar("a"); f.marcar("a");\n' +
' *     ids = ["a", "a"]        -> duplicado (falta buscar antes)\n' +
' *   f.desmarcar("a");\n' +
' *     delete deja huecos      -> ids = [<hueco>, <hueco>], length 2\n' +
' *     f.cuantos() -> 2        -> el contador miente\n' +
' *     f.esFavorito("a") -> false, pero cuantos() dice 2\n' +
' *\n' +
' *   Además: `todos()` devuelve el array interno; cualquiera puede\n' +
' *   hacer push y saltarse `marcar`.\n' +
' */\n' +
'\n' +
'// ---------- DESPUÉS ----------\n' +
'function crearFavoritos() {\n' +
'  var ids = [];\n' +
'\n' +
'  return {\n' +
'    // Buscar antes de insertar: nunca duplicados\n' +
'    marcar: function (id) {\n' +
'      if (typeof id !== "string" || !id) return;   // validación de entrada\n' +
'      if (ids.indexOf(id) !== -1) return;          // ya estaba: no hacemos nada\n' +
'      ids.push(id);\n' +
'    },\n' +
'\n' +
'    // splice, no delete\n' +
'    desmarcar: function (id) {\n' +
'      var i = ids.indexOf(id);\n' +
'      if (i === -1) return;                        // no estaba: no rompe\n' +
'      ids.splice(i, 1);\n' +
'    },\n' +
'\n' +
'    esFavorito: function (id) {\n' +
'      return ids.indexOf(id) !== -1;\n' +
'    },\n' +
'\n' +
'    cuantos: function () {\n' +
'      return ids.length;    // aquí SÍ es correcto: una posición = un favorito\n' +
'    },\n' +
'\n' +
'    // Copia: nadie modifica el estado interno desde fuera\n' +
'    todos: function () {\n' +
'      return ids.slice();\n' +
'    }\n' +
'  };\n' +
'}',
        texto:
          'Deliberadamente son los **mismos fallos** que en tu ejercicio, sobre una estructura más simple, ' +
          'para que el patrón se vea desnudo: `push` sin buscar, `delete` en vez de `splice`, y devolver el ' +
          'array interno.\n' +
          'Fíjate en una diferencia importante: aquí `cuantos()` **sí** puede devolver `ids.length`, porque ' +
          'cada posición representa exactamente un favorito. En tu carrito no, porque cada posición ' +
          'representa una línea con varias unidades. El mismo código es correcto en un sitio e incorrecto ' +
          'en el otro: lo que decide es el modelo de datos, no la sintaxis.\n' +
          'Observa también el orden dentro de `marcar`: primero se valida la entrada, después se comprueba ' +
          'si ya existe y solo al final se toca el estado. Ese orden —validar, decidir, mutar— es el que ' +
          'garantiza que la operación nunca se quede a medias.\n' +
          'Aplica exactamente este recorrido a `crearCarrito`, con la diferencia de que allí hay que sumar ' +
          'cantidades en vez de ignorar el duplicado.'
      },

      glosario: [
        { termino: 'Reproducir', definicion: 'Encontrar la secuencia exacta de pasos que provoca el fallo. Sin reproducción no hay diagnóstico ni forma de verificar la corrección.' },
        { termino: 'Array disperso (sparse)', definicion: 'Array con huecos, típicamente creado por `delete` o asignando un índice muy alto. Rompe los recorridos.' },
        { termino: 'Mutación', definicion: 'Modificar una estructura existente en lugar de crear una nueva. `push` y `splice` mutan; `filter` y `slice` no.' },
        { termino: 'Encapsulación', definicion: 'Que el estado interno solo se pueda cambiar por los métodos previstos.' },
        { termino: 'Copia superficial', definicion: 'Copia del contenedor, no de los objetos que contiene. `slice()` impide añadir o quitar elementos desde fuera, pero no modificar los objetos existentes.' },
        { termino: 'Referencia compartida', definicion: 'Dos variables que apuntan al mismo objeto. Modificar por una afecta a la otra: origen de fallos difíciles de reproducir.' },
        { termino: 'Cierre (closure)', definicion: 'Aquí, lo que hace que `items` sea privado de cada carrito y que `indiceDe` pueda verlo.' },
        { termino: 'Salida temprana', definicion: 'Salir del método en cuanto se detecta que no hay nada que hacer. Evita anidar y hace explícitos los casos especiales.' },
        { termino: 'Interfaz pública', definicion: 'Los métodos que expone un módulo. Cambiarla obliga a modificar a todos sus usuarios, por eso el enunciado pide conservarla.' },
        { termino: 'Regresión', definicion: 'Fallo nuevo introducido al corregir otro. Se detecta ejecutando toda la batería después de cada cambio.' }
      ],

      preparado: [
        '¿Sabrías enumerar los cinco pasos del método de depuración?',
        '¿Qué le pasa exactamente a un array cuando le aplicas `delete` en una posición?',
        '¿Por qué el fallo de `eliminar` lanza una excepción en lugar de dar un número incorrecto?',
        'En el patrón buscar-o-insertar, ¿qué ocurre si te olvidas del `return` tras actualizar?',
        '¿Por qué el bug de `contar` no se detecta si pruebas con una unidad por producto?',
        '¿Por qué el redondeo va al final y no dentro del bucle?',
        '¿Qué problema concreto evita devolver `items.slice()` en lugar de `items`?'
      ]
    },

    rationale:
      'El ejercicio está construido para que el trabajo real sea el diagnóstico, no la corrección: las cuatro ' +
      'soluciones son de una a tres líneas cada una. Los cuatro fallos se eligieron porque representan las ' +
      'cuatro familias que más aparecen en código con estado: no comprobar antes de insertar, usar la ' +
      'operación de array equivocada, confundir contar posiciones con sumar un campo, y arrastrar imprecisión ' +
      'numérica. Y están ordenados a propósito para que corregir el primero facilite el segundo: al garantizar ' +
      'ids únicos, `eliminar` puede parar en la primera coincidencia.',

    alternatives: [
      { name: 'Un objeto o `Map` indexado por id en vez de un array', when: 'El carrito puede tener muchas líneas.', tradeoff: 'La búsqueda pasa de recorrer el array a acceso directo, y los duplicados son imposibles por construcción. A cambio se pierde el orden de inserción (salvo con `Map`) y hay que convertir a array para renderizar.' },
      { name: 'Estado inmutable: cada operación devuelve un carrito nuevo', when: 'React, Redux o cualquier flujo unidireccional.', tradeoff: 'Elimina de raíz los fallos por referencia compartida y facilita deshacer. A cambio crea más objetos y obliga a cambiar la interfaz.' },
      { name: '`filter` en lugar de `splice`', when: 'Prefieres no mutar.', tradeoff: '`items = items.filter(l => l.id !== id)` es más declarativo y elimina todas las coincidencias de golpe; crea un array nuevo en cada eliminación.' },
      { name: 'Trabajar en céntimos enteros', when: 'El dinero es crítico.', tradeoff: 'Elimina por completo el problema de la coma flotante en lugar de mitigarlo con redondeo; obliga a convertir en los bordes del sistema.' },
      { name: 'TypeScript', when: 'El proyecto lo permite.', tradeoff: 'El bug de la cantidad como cadena no habría llegado a producción. No habría evitado ninguno de los otros tres, que son errores de lógica.' }
    ],

    commonErrors: [
      { error: 'Empezar a corregir sin reproducir el fallo.', why: 'Acabas arreglando algo que no era el problema reportado y sin forma de saber si has terminado.', fix: 'Traduce cada síntoma a una secuencia de llamadas concreta antes de tocar nada.' },
      { error: 'Corregir los cuatro fallos a la vez.', why: 'Si algo se rompe, no sabes cuál de los cuatro cambios fue. Y las correcciones pueden interferir entre sí.', fix: 'Un fallo, una comprobación. Los tests te dicen cuándo pasar al siguiente.' },
      { error: 'Usar `delete` para eliminar de un array.', why: 'Deja un hueco, `length` no cambia y el siguiente recorrido lanza `TypeError`.', fix: '`splice` para eliminar mutando, `filter` para eliminar creando un array nuevo.' },
      { error: 'Olvidar el `return` tras actualizar la línea existente.', why: 'Se ejecuta también el `push` y acabas con la línea actualizada y una duplicada.', fix: 'Salida temprana inmediatamente después de actualizar.' },
      { error: 'Recorrer un array hacia delante mientras eliminas de él.', why: 'Al eliminar, los siguientes se desplazan y el índice se salta un elemento. Con ids únicos no se nota; con duplicados sí.', fix: 'Recorrer hacia atrás, usar `filter`, o garantizar que solo hay una coincidencia.' },
      { error: 'Redondear dentro del bucle.', why: 'Acumula errores de redondeo línea a línea. Es un fallo más sutil que el original y mucho más difícil de detectar.', fix: 'Redondear una sola vez, justo antes de devolver.' },
      { error: 'Devolver el array interno desde `lineas()`.', why: 'Cualquiera puede modificar el estado saltándose la validación de `anadir`.', fix: 'Devolver `items.slice()`.' },
      { error: 'Cambiar la interfaz pública para que sea más cómoda.', why: 'Rompe a todos los que ya la usan. El enunciado lo prohíbe precisamente por eso.', fix: 'Corrige el comportamiento, no la firma.' }
    ],

    bestPractices: [
      'Reproducir siempre antes de corregir, y verificar después.',
      'Un fallo cada vez, con la batería completa entre cambio y cambio.',
      'Extrae la lógica repetida (aquí, la búsqueda por id) antes de corregir: suele ser la mitad del problema.',
      'Valida en el punto de entrada, antes de tocar el estado.',
      'No devuelvas tus estructuras internas: devuelve copias.',
      'Cuando corrijas un fallo, deja un test que lo cubra para que no vuelva.'
    ],

    security: [
      'Sin validar la cantidad, un cliente manipulado puede enviar valores negativos y dejar el total por debajo de cero: es fraude, no solo un error de cálculo.',
      'Devolver el estado interno permite inyectar líneas con precios arbitrarios saltándose toda la lógica del módulo.',
      'El total del carrito **debe** recalcularse en el servidor. Todo lo que ocurre en el navegador es una sugerencia del usuario, nunca un dato de confianza.'
    ],

    performance: [
      '`indiceDe` recorre el array: con carritos de decenas de líneas es irrelevante, pero con miles conviene un índice por id.',
      '`splice` desplaza los elementos posteriores. En listas grandes con muchas eliminaciones, un `Map` es preferible.',
      '`lineas()` crea una copia en cada llamada: no la invoques dentro de un bucle de renderizado.'
    ],

    companyLooksFor: [
      'Que reproduzcas antes de tocar el código: es la señal más clara de experiencia depurando en producción.',
      'Que expliques la causa de cada fallo, no solo la corrección.',
      'Que detectes que los cuatro fallos comparten una necesidad común y extraigas la función auxiliar.',
      'Que respetes la interfaz pública aunque te parezca mejorable.',
      'Que propongas los endurecimientos de la última fase sin que nadie te los pida.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Los cuatro fallos corregidos', weight: 45 },
        { criteria: 'Casos borde: id inexistente, carrito vacío, carritos independientes', weight: 15 },
        { criteria: 'Interfaz pública intacta', weight: 10 },
        { criteria: 'Diagnóstico explicado: causa de cada fallo, no solo la corrección', weight: 20 },
        { criteria: 'Endurecimiento: validación de entrada y estado encapsulado', weight: 10 }
      ]
    },

    reinforce: [
      'Métodos de array que mutan y que no mutan: `splice`, `push`, `filter`, `slice`, `map`.',
      'Arrays dispersos y su comportamiento en los recorridos.',
      'Módulo 5 (Scope & Closures) del laboratorio: por qué `items` es privado.',
      'Manejo de dinero: céntimos enteros frente a redondeo.',
      'Prueba antes: `test-tests-que-detectan`. Prueba después: `emp-code-review`.'
    ]
  });

})(window.TT);

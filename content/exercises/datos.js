/* ============================================================
   Pruebas — Bases de datos, rendimiento y seguridad
   ============================================================ */
(function (TT) {
  'use strict';

  /* ==================================================================
     1. El problema N+1
     ================================================================== */
  TT.defineExercise({
    id: 'db-n-mas-uno',
    categorias: ['backend', 'performance'],
    title: 'La consulta que se multiplica: resolver un N+1',
    category: 'databases',
    kind: 'optimize',
    level: 'mid',
    time: 50,
    tags: ['N+1', 'rendimiento', 'consultas', 'agrupación en memoria'],

    context:
      'El panel de pedidos de una tienda tarda 400 ms con clientes pequeños y 14 segundos con los grandes. ' +
      'El equipo de infraestructura ha subido la máquina de la base de datos dos veces y no ha servido de ' +
      'nada: la CPU está al 12 %.',

    situation:
      'Al activar el registro de consultas aparece el motivo. Para un usuario con 200 pedidos se ejecutan ' +
      '401 consultas: una para traer los pedidos, una por pedido para traer su cliente y una por pedido para ' +
      'traer sus líneas. Cada una tarda 30 ms de ida y vuelta, y 401 × 30 ms son 12 segundos de espera pura.',

    goal:
      'Reescribir `obtenerPedidos` para que el número de consultas sea **constante** —tres— sin importar ' +
      'cuántos pedidos tenga el usuario, manteniendo exactamente la misma estructura de datos devuelta.',

    tech: ['JavaScript', 'SQL', 'Node.js'],
    skills: ['problema N+1', 'consultas por lotes', 'agrupación en memoria', 'análisis de rendimiento'],

    starter: {
      lang: 'javascript',
      code:
'/* ============================================================\n' +
'   API DEL REPOSITORIO (ya existe, no la modifiques)\n' +
'   ------------------------------------------------------------\n' +
'   Consultas de UNA fila / UN pedido  (las que causan el N+1)\n' +
'     db.pedidosDeUsuario(usuarioId) -> [{ id, clienteId, total }]\n' +
'     db.clientePorId(id)            -> { id, nombre } | null\n' +
'     db.lineasDePedido(pedidoId)    -> [{ pedidoId, producto, unidades }]\n' +
'\n' +
'   Consultas POR LOTES  (existen, pero nadie las usa)\n' +
'     db.clientesPorIds(ids)         -> [{ id, nombre }]\n' +
'     db.lineasDePedidos(pedidoIds)  -> [{ pedidoId, producto, unidades }]\n' +
'\n' +
'   Todas devuelven promesas y todas cuentan como UNA consulta.\n' +
'\n' +
'   RESULTADO ESPERADO\n' +
'     [{ id, total, cliente: { id, nombre }, lineas: [...] }]\n' +
'   ============================================================ */\n' +
'\n' +
'/**\n' +
' * Versión actual: 1 + N + N consultas.\n' +
' * @param {object} db\n' +
' * @param {string} usuarioId\n' +
' */\n' +
'async function obtenerPedidos(db, usuarioId) {\n' +
'  const pedidos = await db.pedidosDeUsuario(usuarioId);   // 1 consulta\n' +
'\n' +
'  const resultado = [];\n' +
'  for (const pedido of pedidos) {\n' +
'    const cliente = await db.clientePorId(pedido.clienteId);   // +1 por pedido\n' +
'    const lineas = await db.lineasDePedido(pedido.id);         // +1 por pedido\n' +
'    resultado.push({\n' +
'      id: pedido.id,\n' +
'      total: pedido.total,\n' +
'      cliente: cliente,\n' +
'      lineas: lineas\n' +
'    });\n' +
'  }\n' +
'  return resultado;\n' +
'}\n'
    },

    requirements: [
      'Como máximo 3 consultas en total, sea cual sea el número de pedidos.',
      'La estructura devuelta no cambia: `[{ id, total, cliente, lineas }]`.',
      'Se conserva el orden de los pedidos tal como los devuelve la base de datos.',
      'Si dos pedidos son del mismo cliente, ese cliente se pide **una sola vez**.',
      'Un usuario sin pedidos gasta **una sola consulta** y devuelve un array vacío.',
      'Un pedido cuyo cliente no exista debe devolver `cliente: null`, no romper.',
      'Un pedido sin líneas debe devolver `lineas: []`, no `undefined`.'
    ],

    optional: [
      'Lanzar las dos consultas por lotes en paralelo con `Promise.all`.',
      'Extraer la agrupación a una función auxiliar reutilizable.',
      'Añadir un aviso en el log cuando el número de pedidos supere un umbral, para detectar la falta de paginación.'
    ],

    hints: [
      'El patrón se llama N+1 y siempre se resuelve igual: **recoger todos los identificadores primero, pedirlos de una vez, y unir en memoria**.',
      'Para no repetir clientes necesitas los identificadores únicos. `new Set(...)` seguido de `Array.from(...)` lo resuelve en una línea.',
      'Buscar cada cliente con `find` dentro del bucle vuelve a ser un problema de multiplicación, esta vez en memoria. Construye un objeto o un `Map` de `id -> cliente` y accede por clave.',
      'Las líneas llegan todas mezcladas en un solo array: hay que agruparlas por `pedidoId` antes de repartirlas.',
      'Ojo con el caso de cero pedidos: si llamas a las consultas por lotes con un array vacío, gastas dos consultas para nada.'
    ],

    tests: {
      mode: 'js',
      timeout: 5000,
      setup:
'function crearDb(pedidos, clientes, lineas) {\n' +
'  var db = {\n' +
'    consultas: 0,\n' +
'    pedidosDeUsuario: async function () { db.consultas++; return pedidos.slice(); },\n' +
'    clientePorId: async function (id) {\n' +
'      db.consultas++;\n' +
'      return clientes.filter(function (c) { return c.id === id; })[0] || null;\n' +
'    },\n' +
'    clientesPorIds: async function (ids) {\n' +
'      db.consultas++;\n' +
'      return clientes.filter(function (c) { return ids.indexOf(c.id) !== -1; });\n' +
'    },\n' +
'    lineasDePedido: async function (pedidoId) {\n' +
'      db.consultas++;\n' +
'      return lineas.filter(function (l) { return l.pedidoId === pedidoId; });\n' +
'    },\n' +
'    lineasDePedidos: async function (ids) {\n' +
'      db.consultas++;\n' +
'      return lineas.filter(function (l) { return ids.indexOf(l.pedidoId) !== -1; });\n' +
'    }\n' +
'  };\n' +
'  return db;\n' +
'}\n' +
'\n' +
'var CLIENTES = [\n' +
'  { id: "c1", nombre: "Ana" },\n' +
'  { id: "c2", nombre: "Luis" }\n' +
'];\n' +
'var PEDIDOS = [\n' +
'  { id: "p1", clienteId: "c1", total: 30 },\n' +
'  { id: "p2", clienteId: "c2", total: 50 },\n' +
'  { id: "p3", clienteId: "c1", total: 20 }\n' +
'];\n' +
'var LINEAS = [\n' +
'  { pedidoId: "p1", producto: "Taza",     unidades: 2 },\n' +
'  { pedidoId: "p1", producto: "Camiseta", unidades: 1 },\n' +
'  { pedidoId: "p2", producto: "Libro",    unidades: 3 }\n' +
'];\n' +
'\n' +
'// Genera un usuario con muchos pedidos para comprobar que el número\n' +
'// de consultas no crece con N.\n' +
'function dbGrande(n) {\n' +
'  var pedidos = [], lineas = [];\n' +
'  for (var i = 0; i < n; i++) {\n' +
'    pedidos.push({ id: "p" + i, clienteId: "c" + (i % 2 === 0 ? 1 : 2), total: i });\n' +
'    lineas.push({ pedidoId: "p" + i, producto: "x", unidades: 1 });\n' +
'  }\n' +
'  return crearDb(pedidos, CLIENTES, lineas);\n' +
'}',
      cases: [
        {
          name: 'Devuelve la estructura correcta con tres pedidos',
          code:
'(async () => {\n' +
'  const db = crearDb(PEDIDOS, CLIENTES, LINEAS);\n' +
'  const r = await obtenerPedidos(db, "u1");\n' +
'  expect(r).toHaveLength(3);\n' +
'  expect(r[0].id).toBe("p1");\n' +
'  expect(r[0].total).toBe(30);\n' +
'  expect(r[0].cliente.nombre).toBe("Ana");\n' +
'  expect(r[0].lineas).toHaveLength(2);\n' +
'})()'
        },
        {
          name: 'Como máximo 3 consultas con tres pedidos',
          code:
'(async () => {\n' +
'  const db = crearDb(PEDIDOS, CLIENTES, LINEAS);\n' +
'  await obtenerPedidos(db, "u1");\n' +
'  expect(db.consultas <= 3).toBeTruthy();\n' +
'})()'
        },
        {
          name: 'El número de consultas NO crece con el número de pedidos',
          code:
'(async () => {\n' +
'  const pocos = dbGrande(3);\n' +
'  const muchos = dbGrande(200);\n' +
'  await obtenerPedidos(pocos, "u1");\n' +
'  await obtenerPedidos(muchos, "u1");\n' +
'  expect(muchos.consultas).toBe(pocos.consultas);\n' +
'  expect(muchos.consultas <= 3).toBeTruthy();\n' +
'})()'
        },
        {
          name: 'Con 200 pedidos el resultado sigue siendo correcto',
          code:
'(async () => {\n' +
'  const db = dbGrande(200);\n' +
'  const r = await obtenerPedidos(db, "u1");\n' +
'  expect(r).toHaveLength(200);\n' +
'  expect(r[0].cliente.nombre).toBe("Ana");\n' +
'  expect(r[1].cliente.nombre).toBe("Luis");\n' +
'  expect(r[199].lineas).toHaveLength(1);\n' +
'})()'
        },
        {
          name: 'Se conserva el orden original de los pedidos',
          code:
'(async () => {\n' +
'  const db = crearDb(PEDIDOS, CLIENTES, LINEAS);\n' +
'  const r = await obtenerPedidos(db, "u1");\n' +
'  expect(r.map(p => p.id)).toEqual(["p1", "p2", "p3"]);\n' +
'})()'
        },
        {
          name: 'Un usuario sin pedidos gasta una sola consulta',
          code:
'(async () => {\n' +
'  const db = crearDb([], CLIENTES, LINEAS);\n' +
'  const r = await obtenerPedidos(db, "u1");\n' +
'  expect(r).toEqual([]);\n' +
'  expect(db.consultas).toBe(1);\n' +
'})()'
        },
        {
          name: 'Un pedido sin líneas devuelve un array vacío, no undefined',
          code:
'(async () => {\n' +
'  const db = crearDb(PEDIDOS, CLIENTES, LINEAS);\n' +
'  const r = await obtenerPedidos(db, "u1");\n' +
'  const p3 = r.filter(p => p.id === "p3")[0];\n' +
'  expect(p3.lineas).toEqual([]);\n' +
'})()'
        },
        {
          name: 'Un pedido con cliente inexistente devuelve cliente null',
          code:
'(async () => {\n' +
'  const db = crearDb([{ id: "px", clienteId: "borrado", total: 10 }], CLIENTES, []);\n' +
'  const r = await obtenerPedidos(db, "u1");\n' +
'  expect(r).toHaveLength(1);\n' +
'  expect(r[0].cliente).toBe(null);\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'/** Agrupa una lista en un objeto { claveDeCadaFila: [filas] }. */\n' +
'function agruparPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) {\n' +
'    const clave = fila[campo];\n' +
'    if (!mapa[clave]) mapa[clave] = [];\n' +
'    mapa[clave].push(fila);\n' +
'  }\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'/** Indexa una lista en un objeto { id: fila } para acceso directo. */\n' +
'function indexarPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) mapa[fila[campo]] = fila;\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'async function obtenerPedidos(db, usuarioId) {\n' +
'  // --- Consulta 1: los pedidos ---\n' +
'  const pedidos = await db.pedidosDeUsuario(usuarioId);\n' +
'\n' +
'  // Sin pedidos no hay nada que buscar: nos ahorramos dos consultas\n' +
'  // que además irían con listas de identificadores vacías.\n' +
'  if (pedidos.length === 0) return [];\n' +
'\n' +
'  // Recogemos los identificadores ANTES de consultar nada más.\n' +
'  // El Set elimina los clientes repetidos: si diez pedidos son del\n' +
'  // mismo cliente, se pide una sola vez.\n' +
'  const clienteIds = Array.from(new Set(pedidos.map(p => p.clienteId)));\n' +
'  const pedidoIds = pedidos.map(p => p.id);\n' +
'\n' +
'  // --- Consultas 2 y 3: en lote y en paralelo ---\n' +
'  // Son independientes entre sí, así que no tiene sentido esperar\n' +
'  // a que termine una para lanzar la otra.\n' +
'  const [clientes, lineas] = await Promise.all([\n' +
'    db.clientesPorIds(clienteIds),\n' +
'    db.lineasDePedidos(pedidoIds)\n' +
'  ]);\n' +
'\n' +
'  // --- Unión en memoria ---\n' +
'  // Índices de acceso directo. Buscar con `find` dentro del bucle\n' +
'  // sería volver a multiplicar el trabajo, esta vez en la aplicación.\n' +
'  const clientePorId = indexarPor(clientes, "id");\n' +
'  const lineasPorPedido = agruparPor(lineas, "pedidoId");\n' +
'\n' +
'  // Recorremos `pedidos` en su orden original: así el resultado\n' +
'  // conserva el orden que decidió la base de datos.\n' +
'  return pedidos.map(pedido => ({\n' +
'    id: pedido.id,\n' +
'    total: pedido.total,\n' +
'    cliente: clientePorId[pedido.clienteId] || null,\n' +
'    lineas: lineasPorPedido[pedido.id] || []\n' +
'  }));\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — Recoger los identificadores antes de consultar',
        objetivo:
          'Dejar de consultar dentro del bucle. En esta fase todavía no se une nada: solo se separa el ' +
          '"qué necesito" del "cómo lo pido".',
        anadido: [
          'Salida temprana cuando no hay pedidos.',
          'Extracción de `clienteIds` (sin repetidos) y `pedidoIds`.',
          'Dos consultas por lotes que sustituyen a las 2N del bucle.'
        ],
        codigo:
'async function obtenerPedidos(db, usuarioId) {\n' +
'  // --- Consulta 1: los pedidos ---\n' +
'  const pedidos = await db.pedidosDeUsuario(usuarioId);\n' +
'\n' +
'  if (pedidos.length === 0) return [];\n' +
'\n' +
'  // Recogemos los identificadores ANTES de consultar nada más.\n' +
'  const clienteIds = Array.from(new Set(pedidos.map(p => p.clienteId)));\n' +
'  const pedidoIds = pedidos.map(p => p.id);\n' +
'\n' +
'  // --- Consultas 2 y 3: en lote ---\n' +
'  const clientes = await db.clientesPorIds(clienteIds);\n' +
'  const lineas = await db.lineasDePedidos(pedidoIds);\n' +
'\n' +
'  // Todavía no unimos nada: devolvemos la forma mínima para\n' +
'  // comprobar que el número de consultas ya es constante.\n' +
'  return pedidos.map(pedido => ({\n' +
'    id: pedido.id,\n' +
'    total: pedido.total,\n' +
'    cliente: null,\n' +
'    lineas: []\n' +
'  }));\n' +
'}\n',
        explicacion:
          'Este es el salto conceptual del ejercicio, y ocurre entero en cinco líneas. El bucle que ' +
          'consultaba ha desaparecido; en su lugar hay dos listas de identificadores y dos consultas.\n' +
          'El `Set` es lo que garantiza que un cliente con veinte pedidos se pida una sola vez. ' +
          '`new Set(array)` elimina duplicados y `Array.from(...)` lo devuelve a un array normal, que es lo ' +
          'que espera `clientesPorIds`.\n' +
          'La salida temprana con cero pedidos no es un detalle menor: sin ella se lanzarían dos consultas ' +
          'con listas vacías, que en SQL se traducen en un `WHERE id IN ()` que según el motor da error o ' +
          'recorre la tabla entera.\n' +
          'El resultado todavía es incorrecto —`cliente: null` y `lineas: []` para todos— y es ' +
          'deliberado: primero se arregla el número de consultas, después el contenido.',
        comprueba:
          'Los tres casos de conteo de consultas deberían pasar a verde. Los de contenido siguen en rojo, ' +
          'como se espera en esta fase.'
      },
      {
        titulo: 'Fase 2 — Índice de clientes: unir sin volver a multiplicar',
        objetivo:
          'Asociar cada pedido con su cliente usando acceso directo por clave, no búsqueda lineal.',
        anadido: [
          'Función auxiliar `indexarPor(filas, campo)`.',
          'Construcción de `clientePorId` antes del bucle final.',
          '`cliente: clientePorId[pedido.clienteId] || null`.'
        ],
        codigo:
'/** Indexa una lista en un objeto { id: fila } para acceso directo. */\n' +
'function indexarPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) mapa[fila[campo]] = fila;\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'async function obtenerPedidos(db, usuarioId) {\n' +
'  // --- Consulta 1: los pedidos ---\n' +
'  const pedidos = await db.pedidosDeUsuario(usuarioId);\n' +
'\n' +
'  if (pedidos.length === 0) return [];\n' +
'\n' +
'  // Recogemos los identificadores ANTES de consultar nada más.\n' +
'  const clienteIds = Array.from(new Set(pedidos.map(p => p.clienteId)));\n' +
'  const pedidoIds = pedidos.map(p => p.id);\n' +
'\n' +
'  // --- Consultas 2 y 3: en lote ---\n' +
'  const clientes = await db.clientesPorIds(clienteIds);\n' +
'  const lineas = await db.lineasDePedidos(pedidoIds);\n' +
'\n' +
'  // --- Unión en memoria ---\n' +
'  const clientePorId = indexarPor(clientes, "id");\n' +
'\n' +
'  return pedidos.map(pedido => ({\n' +
'    id: pedido.id,\n' +
'    total: pedido.total,\n' +
'    cliente: clientePorId[pedido.clienteId] || null,\n' +
'    lineas: []\n' +
'  }));\n' +
'}\n',
        explicacion:
          '`indexarPor` se declara **fuera** de `obtenerPedidos`, en el nivel superior del archivo: no ' +
          'necesita nada del cierre y así se puede reutilizar y testear por separado.\n' +
          'La tentación aquí es escribir ' +
          '`clientes.find(c => c.id === pedido.clienteId)` dentro del `map`. Funciona, pero recorre el array ' +
          'de clientes una vez por pedido: has cambiado N consultas a la base de datos por N recorridos en ' +
          'memoria. Con 200 pedidos y 200 clientes son 40 000 comparaciones.\n' +
          'Construir el índice cuesta un solo recorrido y convierte cada búsqueda en un acceso directo por ' +
          'clave.\n' +
          'El `|| null` cubre el pedido cuyo cliente ya no existe: `clientePorId["borrado"]` es `undefined`, ' +
          'y sin ese `||` devolveríamos `undefined` en vez del `null` que pide el contrato.',
        comprueba:
          'Los casos de cliente correcto y de cliente inexistente pasan a verde. Falta el de las líneas.'
      },
      {
        titulo: 'Fase 3 — Agrupar las líneas por pedido',
        objetivo:
          'Repartir el array plano de líneas entre los pedidos a los que pertenece cada una.',
        anadido: [
          'Función auxiliar `agruparPor(filas, campo)`.',
          'Construcción de `lineasPorPedido`.',
          '`lineas: lineasPorPedido[pedido.id] || []`.'
        ],
        codigo:
'/** Agrupa una lista en un objeto { claveDeCadaFila: [filas] }. */\n' +
'function agruparPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) {\n' +
'    const clave = fila[campo];\n' +
'    if (!mapa[clave]) mapa[clave] = [];\n' +
'    mapa[clave].push(fila);\n' +
'  }\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'/** Indexa una lista en un objeto { id: fila } para acceso directo. */\n' +
'function indexarPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) mapa[fila[campo]] = fila;\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'async function obtenerPedidos(db, usuarioId) {\n' +
'  // --- Consulta 1: los pedidos ---\n' +
'  const pedidos = await db.pedidosDeUsuario(usuarioId);\n' +
'\n' +
'  if (pedidos.length === 0) return [];\n' +
'\n' +
'  // Recogemos los identificadores ANTES de consultar nada más.\n' +
'  const clienteIds = Array.from(new Set(pedidos.map(p => p.clienteId)));\n' +
'  const pedidoIds = pedidos.map(p => p.id);\n' +
'\n' +
'  // --- Consultas 2 y 3: en lote ---\n' +
'  const clientes = await db.clientesPorIds(clienteIds);\n' +
'  const lineas = await db.lineasDePedidos(pedidoIds);\n' +
'\n' +
'  // --- Unión en memoria ---\n' +
'  const clientePorId = indexarPor(clientes, "id");\n' +
'  const lineasPorPedido = agruparPor(lineas, "pedidoId");\n' +
'\n' +
'  return pedidos.map(pedido => ({\n' +
'    id: pedido.id,\n' +
'    total: pedido.total,\n' +
'    cliente: clientePorId[pedido.clienteId] || null,\n' +
'    lineas: lineasPorPedido[pedido.id] || []\n' +
'  }));\n' +
'}\n',
        explicacion:
          'La diferencia entre `indexarPor` y `agruparPor` es la cardinalidad de la relación, y conviene ' +
          'tenerla clara porque es la fuente de la mitad de los errores en este tipo de código.\n' +
          '**Uno a uno** (un pedido tiene un cliente): el mapa guarda **la fila**. `indexarPor`.\n' +
          '**Uno a muchos** (un pedido tiene varias líneas): el mapa guarda **un array de filas**. ' +
          '`agruparPor`.\n' +
          'Si usaras `indexarPor` con las líneas, cada pedido acabaría con **una sola** línea, la última que ' +
          'apareciera en el array: un bug silencioso que solo se ve con pedidos de más de un producto.\n' +
          'El `|| []` es tan importante como el `|| null` anterior: un pedido sin líneas no aparece como ' +
          'clave en el mapa, y devolver `undefined` haría que cualquier `.length` o `.map` posterior lanzase.\n' +
          'Ahora todos los tests pasan. La fase siguiente no cambia el resultado: reduce la latencia.',
        comprueba: 'Los ocho casos de la plataforma en verde.'
      },
      {
        titulo: 'Fase 4 — Paralelizar las dos consultas independientes',
        objetivo:
          'Ahorrar una ida y vuelta completa a la base de datos. Las consultas de clientes y de líneas no ' +
          'dependen la una de la otra, así que no hay motivo para encadenarlas.',
        anadido: [
          'Las dos consultas por lotes pasan a lanzarse con `Promise.all`.',
          'Desestructuración del resultado en `[clientes, lineas]`.'
        ],
        codigo:
'/** Agrupa una lista en un objeto { claveDeCadaFila: [filas] }. */\n' +
'function agruparPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) {\n' +
'    const clave = fila[campo];\n' +
'    if (!mapa[clave]) mapa[clave] = [];\n' +
'    mapa[clave].push(fila);\n' +
'  }\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'/** Indexa una lista en un objeto { id: fila } para acceso directo. */\n' +
'function indexarPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) mapa[fila[campo]] = fila;\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'async function obtenerPedidos(db, usuarioId) {\n' +
'  // --- Consulta 1: los pedidos ---\n' +
'  const pedidos = await db.pedidosDeUsuario(usuarioId);\n' +
'\n' +
'  // Sin pedidos no hay nada que buscar: nos ahorramos dos consultas\n' +
'  // que además irían con listas de identificadores vacías.\n' +
'  if (pedidos.length === 0) return [];\n' +
'\n' +
'  // Recogemos los identificadores ANTES de consultar nada más.\n' +
'  // El Set elimina los clientes repetidos: si diez pedidos son del\n' +
'  // mismo cliente, se pide una sola vez.\n' +
'  const clienteIds = Array.from(new Set(pedidos.map(p => p.clienteId)));\n' +
'  const pedidoIds = pedidos.map(p => p.id);\n' +
'\n' +
'  // --- Consultas 2 y 3: en lote y en paralelo ---\n' +
'  // Son independientes entre sí, así que no tiene sentido esperar\n' +
'  // a que termine una para lanzar la otra.\n' +
'  const [clientes, lineas] = await Promise.all([\n' +
'    db.clientesPorIds(clienteIds),\n' +
'    db.lineasDePedidos(pedidoIds)\n' +
'  ]);\n' +
'\n' +
'  // --- Unión en memoria ---\n' +
'  // Índices de acceso directo. Buscar con `find` dentro del bucle\n' +
'  // sería volver a multiplicar el trabajo, esta vez en la aplicación.\n' +
'  const clientePorId = indexarPor(clientes, "id");\n' +
'  const lineasPorPedido = agruparPor(lineas, "pedidoId");\n' +
'\n' +
'  // Recorremos `pedidos` en su orden original: así el resultado\n' +
'  // conserva el orden que decidió la base de datos.\n' +
'  return pedidos.map(pedido => ({\n' +
'    id: pedido.id,\n' +
'    total: pedido.total,\n' +
'    cliente: clientePorId[pedido.clienteId] || null,\n' +
'    lineas: lineasPorPedido[pedido.id] || []\n' +
'  }));\n' +
'}\n',
        explicacion:
          'Dos `await` seguidos se ejecutan **en serie**: el segundo no empieza hasta que termina el ' +
          'primero. Con 30 ms por consulta, eso son 60 ms. Con `Promise.all` las dos salen a la vez y el ' +
          'tiempo total es el de la más lenta: 30 ms.\n' +
          'La regla para decidir es sencilla: **si la segunda operación no necesita el resultado de la ' +
          'primera, van en paralelo**. Aquí `clientesPorIds` y `lineasDePedidos` solo dependen de los ' +
          'identificadores, que ya tenemos.\n' +
          'Lo que **no** se puede paralelizar es la consulta 1: sin los pedidos no sabemos qué ' +
          'identificadores pedir. Esa dependencia es real y por eso queda fuera del `Promise.all`.\n' +
          'El balance final: de 401 consultas en serie (unos 12 s) a 2 idas y vueltas (unos 60 ms). Y lo más ' +
          'importante, **ese número ya no crece** con el número de pedidos.\n' +
          'Los comentarios añadidos en esta fase explican las tres decisiones que un revisor preguntaría: ' +
          'por qué la salida temprana, por qué el `Set` y por qué se recorre `pedidos` al final.',
        comprueba:
          'Los ocho casos siguen en verde. Esta es la solución final: mismo resultado, una ida y vuelta menos.'
      }
    ],

    docs: {
      resumen:
        'El N+1 es el problema de rendimiento más común en aplicaciones con base de datos. Aparece siempre ' +
        'igual —una consulta dentro de un bucle— y se resuelve siempre igual: **recoger identificadores, ' +
        'consultar en lote, unir en memoria**. Lo caro no es la consulta: es la ida y vuelta.',

      conceptos: [
        {
          titulo: 'Qué es un N+1 y por qué no se ve en desarrollo',
          texto:
            'El nombre viene de la cuenta: **1** consulta para traer la lista principal, más **N** consultas, ' +
            'una por cada elemento. Aquí hay dos consultas por elemento, así que son 1 + 2N.\n' +
            'No se detecta en desarrollo por dos motivos que se suman. Primero, con 3 registros de prueba ' +
            'son 7 consultas y todo va rápido. Segundo, la base de datos local no tiene latencia de red: ' +
            'cada consulta tarda menos de 1 ms en vez de 30.\n' +
            'En producción, con 200 pedidos y 30 ms de ida y vuelta, esas mismas líneas tardan 12 segundos.\n' +
            'La pista que lo delata: **el tiempo crece de forma lineal con la cantidad de datos y la CPU de ' +
            'la base de datos está ociosa**. No es un problema de potencia, es de número de viajes.',
          codigo:
'// La forma canónica del N+1: un await dentro de un bucle\n' +
'for (const pedido of pedidos) {\n' +
'  const cliente = await db.clientePorId(pedido.clienteId);   // <- aquí\n' +
'}\n' +
'\n' +
'// La cuenta con 200 pedidos\n' +
'//   1 consulta   pedidos\n' +
'// + 200          clientes\n' +
'// + 200          líneas\n' +
'// = 401 consultas x 30 ms = 12,03 segundos\n' +
'//\n' +
'// Con 3 pedidos de prueba: 7 consultas x 1 ms = 7 ms. Invisible.'
        },
        {
          titulo: 'Lo caro es la ida y vuelta, no la consulta',
          texto:
            'Una consulta por identificador con índice es de las operaciones más baratas que existe: menos ' +
            'de un milisegundo de trabajo real en el servidor.\n' +
            'Lo que cuesta es todo lo que la rodea: enviar la petición por la red, que el servidor la ' +
            'analice y planifique, y devolver el resultado. Ese coste fijo, entre 1 y 50 ms según dónde esté ' +
            'la base de datos, se paga **una vez por consulta**.\n' +
            'Por eso 200 consultas que traen una fila cada una son mucho más lentas que una consulta que ' +
            'trae 200 filas, aunque el trabajo de base de datos sea idéntico.\n' +
            'Esta es la razón por la que subir la máquina no arregló nada: el cuello de botella no estaba en ' +
            'la CPU.',
          codigo:
'// 200 consultas: se paga 200 veces el coste fijo\n' +
'//   [ida 15ms][trabajo 0,5ms][vuelta 15ms] x 200 = ~6100 ms\n' +
'\n' +
'// 1 consulta con 200 identificadores: se paga una vez\n' +
'//   [ida 15ms][trabajo 3ms][vuelta 15ms]         = ~33 ms\n' +
'\n' +
'SELECT * FROM clientes WHERE id IN (?, ?, ?, ... );'
        },
        {
          titulo: 'El patrón: recoger, consultar en lote, unir',
          texto:
            'Los tres pasos son siempre los mismos, y el orden importa.\n' +
            '**1. Recoger.** Extraer todos los identificadores que vas a necesitar, sin consultar nada. Aquí ' +
            'es donde se eliminan los duplicados.\n' +
            '**2. Consultar en lote.** Una consulta por tabla relacionada, con todos los identificadores de ' +
            'golpe.\n' +
            '**3. Unir en memoria.** Construir índices y recorrer la lista principal asociando cada ' +
            'elemento con lo suyo.\n' +
            'La clave está en que el paso 1 ocurre **entero** antes del 2. Si mezclas recoger y consultar, ' +
            'vuelves al bucle.',
          codigo:
'// 1. RECOGER (sin consultar)\n' +
'const clienteIds = Array.from(new Set(pedidos.map(p => p.clienteId)));\n' +
'const pedidoIds  = pedidos.map(p => p.id);\n' +
'\n' +
'// 2. CONSULTAR EN LOTE\n' +
'const [clientes, lineas] = await Promise.all([\n' +
'  db.clientesPorIds(clienteIds),\n' +
'  db.lineasDePedidos(pedidoIds)\n' +
']);\n' +
'\n' +
'// 3. UNIR EN MEMORIA\n' +
'const clientePorId     = indexarPor(clientes, "id");\n' +
'const lineasPorPedido  = agruparPor(lineas, "pedidoId");\n' +
'\n' +
'return pedidos.map(p => ({ ...p, cliente: ..., lineas: ... }));'
        },
        {
          titulo: 'Set: identificadores únicos en una línea',
          texto:
            'Si diez pedidos son del mismo cliente, `pedidos.map(p => p.clienteId)` devuelve ese ' +
            'identificador diez veces. Pedirlo diez veces a la base de datos es trabajo tirado y hace la ' +
            'consulta más grande de lo necesario.\n' +
            '`Set` es una colección sin duplicados. Construirlo a partir de un array los elimina, y ' +
            '`Array.from` lo convierte de nuevo en array, que es lo que espera la consulta.\n' +
            'La comparación es por identidad estricta, así que funciona con cadenas y números pero **no** ' +
            'con objetos: dos objetos con el mismo contenido son distintos para un `Set`.',
          codigo:
'const ids = ["c1", "c2", "c1", "c1", "c2"];\n' +
'\n' +
'Array.from(new Set(ids));      // ["c1", "c2"]\n' +
'[...new Set(ids)];             // igual, con sintaxis de propagación\n' +
'\n' +
'// Cuidado: no deduplica objetos por contenido\n' +
'new Set([{ id: 1 }, { id: 1 }]).size;   // 2, son objetos distintos'
        },
        {
          titulo: 'Índice frente a búsqueda lineal: no cambies N consultas por N recorridos',
          texto:
            'Es el error que más aparece al resolver un N+1 por primera vez. Se sustituyen las consultas por ' +
            'un `find` dentro del bucle, y el problema de multiplicación sigue ahí, solo que ahora en ' +
            'memoria.\n' +
            '`clientes.find(c => c.id === pedido.clienteId)` recorre el array de clientes **por cada ' +
            'pedido**. Con 200 pedidos y 200 clientes son hasta 40 000 comparaciones.\n' +
            'Construir un índice cuesta **un** recorrido y convierte cada búsqueda posterior en un acceso ' +
            'directo por clave. Se pasa de trabajo cuadrático a lineal.\n' +
            'Con listas pequeñas la diferencia es imperceptible, pero el hábito importa: es el mismo ' +
            'razonamiento que el del N+1.',
          codigo:
'// LINEAL DENTRO DEL BUCLE: N x M comparaciones\n' +
'pedidos.map(p => ({\n' +
'  cliente: clientes.find(c => c.id === p.clienteId)   // recorre TODO por cada pedido\n' +
'}));\n' +
'\n' +
'// ÍNDICE: un recorrido para construirlo, acceso directo después\n' +
'const clientePorId = {};\n' +
'for (const c of clientes) clientePorId[c.id] = c;\n' +
'\n' +
'pedidos.map(p => ({\n' +
'  cliente: clientePorId[p.clienteId] || null          // acceso por clave\n' +
'}));'
        },
        {
          titulo: 'Indexar frente a agrupar: uno a uno y uno a muchos',
          texto:
            'Las dos funciones auxiliares se parecen y hacen cosas distintas. Confundirlas produce un bug ' +
            'silencioso.\n' +
            '**`indexarPor`** es para relaciones **uno a uno**: un pedido tiene un cliente. El mapa guarda ' +
            'la fila directamente. Si hubiera claves repetidas, la última pisaría a las anteriores.\n' +
            '**`agruparPor`** es para relaciones **uno a muchos**: un pedido tiene varias líneas. El mapa ' +
            'guarda un array, y hay que inicializarlo la primera vez que aparece cada clave.\n' +
            'Si usas `indexarPor` con las líneas, cada pedido acaba con una sola línea —la última— y el ' +
            'error solo se ve en pedidos de más de un producto.',
          codigo:
'// UNO A UNO -> el mapa guarda la fila\n' +
'function indexarPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) mapa[fila[campo]] = fila;\n' +
'  return mapa;\n' +
'}\n' +
'// { "c1": {id:"c1",...}, "c2": {id:"c2",...} }\n' +
'\n' +
'// UNO A MUCHOS -> el mapa guarda un array\n' +
'function agruparPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) {\n' +
'    const clave = fila[campo];\n' +
'    if (!mapa[clave]) mapa[clave] = [];   // inicializar la primera vez\n' +
'    mapa[clave].push(fila);\n' +
'  }\n' +
'  return mapa;\n' +
'}\n' +
'// { "p1": [linea, linea], "p2": [linea] }'
        },
        {
          titulo: 'Valores por defecto: la clave que no está en el mapa',
          texto:
            'Un pedido sin líneas no aparece como clave en el mapa agrupado, y un cliente borrado no aparece ' +
            'en el indexado. En los dos casos el acceso devuelve `undefined`.\n' +
            'Devolver `undefined` donde el contrato promete un array rompe a quien consuma el resultado: ' +
            '`pedido.lineas.length` lanza `TypeError`. Es exactamente el mismo tipo de fallo que la ' +
            '"pantalla en blanco" de las vistas de datos.\n' +
            'El valor por defecto se pone **en el punto donde se construye el resultado**, no repartido por ' +
            'todo el código que lo consume.',
          codigo:
'cliente: clientePorId[pedido.clienteId] || null,   // objeto o null\n' +
'lineas:  lineasPorPedido[pedido.id] || []          // array, nunca undefined\n' +
'\n' +
'// Sin el || []\n' +
'//   pedido.lineas          -> undefined\n' +
'//   pedido.lineas.length   -> TypeError\n' +
'//   pedido.lineas.map(...) -> TypeError'
        },
        {
          titulo: 'Promise.all: paralelizar solo lo independiente',
          texto:
            'Dos `await` consecutivos se ejecutan en serie: el segundo espera al primero aunque no lo ' +
            'necesite. `Promise.all` lanza varias promesas a la vez y espera a todas; el tiempo total es el ' +
            'de la más lenta.\n' +
            'La regla para decidir: **si la operación B no usa el resultado de A, van en paralelo**.\n' +
            'Aquí las consultas de clientes y de líneas solo dependen de los identificadores, que ya ' +
            'tenemos. La consulta de pedidos no se puede paralelizar porque de ella salen esos ' +
            'identificadores: esa dependencia es real.\n' +
            'Detalle importante: si una de las promesas se rechaza, `Promise.all` rechaza de inmediato. ' +
            'Cuando quieras el resultado de todas pase lo que pase, `Promise.allSettled`.',
          codigo:
'// SERIE: 30 + 30 = 60 ms\n' +
'const clientes = await db.clientesPorIds(clienteIds);\n' +
'const lineas   = await db.lineasDePedidos(pedidoIds);\n' +
'\n' +
'// PARALELO: max(30, 30) = 30 ms\n' +
'const [clientes, lineas] = await Promise.all([\n' +
'  db.clientesPorIds(clienteIds),\n' +
'  db.lineasDePedidos(pedidoIds)\n' +
']);\n' +
'\n' +
'// NO se puede paralelizar: la segunda necesita la primera\n' +
'const pedidos = await db.pedidosDeUsuario(usuarioId);\n' +
'const ids = pedidos.map(p => p.id);        // <- depende de `pedidos`'
        },
        {
          titulo: 'Por qué no siempre un JOIN',
          texto:
            'La pregunta natural es: ¿por qué no resolverlo todo con un `JOIN` en una sola consulta?\n' +
            'Es una opción válida y a menudo la mejor para el cliente (uno a uno). Pero con las líneas ' +
            '(uno a muchos) un `JOIN` **multiplica las filas**: un pedido con 5 líneas aparece 5 veces, y ' +
            'sus datos y los del cliente viajan repetidos por la red. Con varias relaciones a la vez la ' +
            'explosión es multiplicativa.\n' +
            'Por eso los ORM modernos usan consultas separadas por lotes para las relaciones uno a muchos: ' +
            'menos datos por la red y unión en memoria, que es barata.\n' +
            'Saber explicar este compromiso es lo que se espera en una entrevista de nivel mid.',
          codigo:
'-- JOIN: 1 consulta, pero filas duplicadas\n' +
'SELECT p.*, c.*, l.*\n' +
'  FROM pedidos p\n' +
'  JOIN clientes c ON c.id = p.cliente_id\n' +
'  LEFT JOIN lineas l ON l.pedido_id = p.id;\n' +
'\n' +
'-- Un pedido con 5 líneas -> 5 filas con los datos del pedido\n' +
'-- y del cliente repetidos en cada una.\n' +
'\n' +
'-- POR LOTES: 3 consultas, cada dato viaja una sola vez\n' +
'SELECT * FROM pedidos  WHERE usuario_id = ?;\n' +
'SELECT * FROM clientes WHERE id IN (?, ?);\n' +
'SELECT * FROM lineas   WHERE pedido_id IN (?, ?, ?);'
        }
      ],

      referencia: [
        { nombre: 'array.map(fn)', texto: 'Transforma cada elemento. Aquí, extraer identificadores y construir el resultado final.' },
        { nombre: 'new Set(array)', texto: 'Colección sin duplicados. Comparación por identidad estricta.' },
        { nombre: 'Array.from(set)', texto: 'Convierte un `Set` (o cualquier iterable) en array. También vale `[...set]`.' },
        { nombre: 'Promise.all([p1, p2])', texto: 'Lanza varias promesas a la vez y espera a todas. Devuelve un array de resultados en el mismo orden.' },
        { nombre: 'Promise.allSettled([...])', texto: 'Como `all`, pero no falla si alguna se rechaza: devuelve el estado de cada una.' },
        { nombre: 'const [a, b] = array', texto: 'Desestructuración. Recoge los resultados de `Promise.all` en variables con nombre.' },
        { nombre: 'objeto[clave]', texto: 'Acceso directo por clave. Es lo que hace que el índice sea rápido.' },
        { nombre: 'valor || null / valor || []', texto: 'Valor por defecto cuando la clave no existe en el mapa.' },
        { nombre: 'WHERE id IN (?, ?, ?)', texto: 'La consulta por lotes en SQL. Cuidado con listas enormes: conviene trocearlas.' },
        { nombre: 'DataLoader', texto: 'Librería que agrupa automáticamente las peticiones individuales de un mismo ciclo de eventos en una consulta por lotes. El estándar en GraphQL.' }
      ],

      ejemplo: {
        titulo: 'Mismo patrón en otro dominio: artículos con autor y etiquetas',
        codigo:
'/* API del repositorio\n' +
' *   db.articulosPublicados()          -> [{ id, titulo, autorId }]\n' +
' *   db.autorPorId(id)                 -> { id, nombre }        <- individual\n' +
' *   db.autoresPorIds(ids)             -> [{ id, nombre }]      <- por lotes\n' +
' *   db.etiquetasDeArticulo(id)        -> [{ articuloId, nombre }]  <- individual\n' +
' *   db.etiquetasDeArticulos(ids)      -> [{ articuloId, nombre }]  <- por lotes\n' +
' */\n' +
'\n' +
'// ---------- ANTES: 1 + 2N consultas ----------\n' +
'async function listarArticulosLento(db) {\n' +
'  const articulos = await db.articulosPublicados();\n' +
'  const salida = [];\n' +
'  for (const a of articulos) {\n' +
'    salida.push({\n' +
'      id: a.id,\n' +
'      titulo: a.titulo,\n' +
'      autor: await db.autorPorId(a.autorId),          // +1 por artículo\n' +
'      etiquetas: await db.etiquetasDeArticulo(a.id)   // +1 por artículo\n' +
'    });\n' +
'  }\n' +
'  return salida;\n' +
'}\n' +
'\n' +
'\n' +
'// ---------- DESPUÉS: 3 consultas siempre ----------\n' +
'function indexarPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) mapa[fila[campo]] = fila;\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'function agruparPor(filas, campo) {\n' +
'  const mapa = {};\n' +
'  for (const fila of filas) {\n' +
'    const clave = fila[campo];\n' +
'    if (!mapa[clave]) mapa[clave] = [];\n' +
'    mapa[clave].push(fila);\n' +
'  }\n' +
'  return mapa;\n' +
'}\n' +
'\n' +
'async function listarArticulos(db) {\n' +
'  // --- 1. Consulta principal ---\n' +
'  const articulos = await db.articulosPublicados();\n' +
'  if (articulos.length === 0) return [];        // ni una consulta de más\n' +
'\n' +
'  // --- 2. Recoger identificadores, sin duplicados ---\n' +
'  const autorIds = Array.from(new Set(articulos.map(a => a.autorId)));\n' +
'  const articuloIds = articulos.map(a => a.id);\n' +
'\n' +
'  // --- 3. Consultar en lote y en paralelo ---\n' +
'  const [autores, etiquetas] = await Promise.all([\n' +
'    db.autoresPorIds(autorIds),\n' +
'    db.etiquetasDeArticulos(articuloIds)\n' +
'  ]);\n' +
'\n' +
'  // --- 4. Índices: uno a uno indexa, uno a muchos agrupa ---\n' +
'  const autorPorId = indexarPor(autores, "id");                 // 1:1\n' +
'  const etiquetasPorArticulo = agruparPor(etiquetas, "articuloId");  // 1:N\n' +
'\n' +
'  // --- 5. Unir conservando el orden original ---\n' +
'  return articulos.map(a => ({\n' +
'    id: a.id,\n' +
'    titulo: a.titulo,\n' +
'    autor: autorPorId[a.autorId] || null,\n' +
'    etiquetas: etiquetasPorArticulo[a.id] || []\n' +
'  }));\n' +
'}',
        texto:
          'Es literalmente la misma estructura, cambiando pedidos por artículos, clientes por autores y ' +
          'líneas por etiquetas. Esa es la idea: **el patrón es siempre el mismo**, y una vez que lo ' +
          'reconoces lo aplicas sin pensar.\n' +
          'Los cinco pasos numerados marcan la posición exacta de cada bloque: consulta principal, recogida ' +
          'de identificadores, consulta por lotes en paralelo, construcción de índices y unión final.\n' +
          'Fíjate en los tres detalles que se puntúan y que en tu ejercicio tienen su propio test: la ' +
          '**salida temprana** con lista vacía, el **`Set`** para no pedir dos veces el mismo autor, y la ' +
          'diferencia entre **indexar** (autor, uno a uno) y **agrupar** (etiquetas, uno a muchos).\n' +
          'Y en que el resultado se construye recorriendo `articulos`, no los mapas: así el orden que ' +
          'decidió la base de datos —normalmente un `ORDER BY` que importa— se conserva.'
      },

      glosario: [
        { termino: 'N+1', definicion: 'Patrón en el que una consulta que devuelve N elementos provoca N consultas adicionales, una por elemento.' },
        { termino: 'Consulta por lotes (batch)', definicion: 'Una sola consulta que trae todos los registros necesarios usando `IN (...)`.' },
        { termino: 'Ida y vuelta (round trip)', definicion: 'El viaje completo de una petición al servidor y su respuesta. Tiene un coste fijo que no depende de cuántos datos traigas.' },
        { termino: 'Latencia', definicion: 'Tiempo de espera antes de recibir el primer byte. Es lo que domina cuando haces muchas consultas pequeñas.' },
        { termino: 'Índice en memoria', definicion: 'Objeto o `Map` de `clave -> valor` que convierte una búsqueda lineal en acceso directo.' },
        { termino: 'Relación uno a uno', definicion: 'Cada elemento tiene exactamente un relacionado. Se resuelve indexando.' },
        { termino: 'Relación uno a muchos', definicion: 'Cada elemento tiene varios relacionados. Se resuelve agrupando en arrays.' },
        { termino: 'DataLoader', definicion: 'Patrón y librería que agrupa automáticamente las peticiones individuales de un mismo ciclo en una consulta por lotes.' },
        { termino: 'Carga ansiosa (eager loading)', definicion: 'Traer las relaciones junto a la consulta principal, en vez de bajo demanda. Es lo que hace esta solución.' },
        { termino: 'Carga perezosa (lazy loading)', definicion: 'Traer la relación cuando se accede a ella. Cómodo de escribir y causa habitual de N+1.' }
      ],

      preparado: [
        '¿Cuántas consultas ejecuta la versión de partida con 200 pedidos, y por qué esa cifra?',
        '¿Por qué subir la potencia de la base de datos no resolvió el problema?',
        '¿Cuáles son los tres pasos del patrón y por qué el primero tiene que terminar antes de empezar el segundo?',
        '¿Qué problema resuelve el `Set` sobre los identificadores de cliente?',
        '¿Por qué usar `find` dentro del `map` final sería repetir el mismo error en memoria?',
        '¿Cuándo usas `indexarPor` y cuándo `agruparPor`, y qué bug produce confundirlos?',
        '¿Qué pasa si llamas a la consulta por lotes con un array de identificadores vacío?',
        '¿Cuál de las tres consultas **no** se puede paralelizar y por qué?'
      ]
    },

    rationale:
      'La solución no usa un `JOIN` a propósito. Con una relación uno a muchos, un `JOIN` multiplica las ' +
      'filas: un pedido con cinco líneas viaja cinco veces con todos sus datos y los de su cliente ' +
      'repetidos. Tres consultas por lotes mueven cada dato una sola vez y dejan la unión en memoria, que es ' +
      'prácticamente gratis. Es la misma estrategia que emplean los ORM modernos y las implementaciones de ' +
      'DataLoader, y escala mucho mejor cuando hay varias relaciones a la vez.',

    alternatives: [
      { name: 'JOIN único', when: 'Relaciones uno a uno o pocas filas relacionadas.', tradeoff: 'Una sola ida y vuelta, pero duplica los datos de la tabla principal por cada fila relacionada. Con dos relaciones uno a muchos la explosión es multiplicativa.' },
      { name: 'DataLoader', when: 'GraphQL o cualquier API donde no controlas el orden de las llamadas.', tradeoff: 'Agrupa automáticamente las peticiones individuales de un mismo ciclo de eventos: mantienes código sencillo y obtienes el lote gratis. Añade una dependencia y una capa de caché por petición que hay que entender.' },
      { name: 'Carga ansiosa del ORM (`include` / `with`)', when: 'Usas Prisma, Sequelize o Eloquent.', tradeoff: 'Una línea resuelve el N+1 porque el ORM hace exactamente esto por dentro. Conviene saber qué genera: algunos usan `JOIN` y otros consultas separadas.' },
      { name: 'Vista materializada o tabla desnormalizada', when: 'La lectura es muy frecuente y los datos cambian poco.', tradeoff: 'Latencia mínima; a cambio hay que mantener la vista sincronizada y se acepta consistencia eventual.' },
      { name: 'Paginación', when: 'La lista puede ser enorme.', tradeoff: 'Es complementaria, no alternativa: reduce N pero no cambia el patrón. Un N+1 paginado sigue siendo un N+1, solo que más pequeño.' }
    ],

    commonErrors: [
      { error: 'Sustituir las consultas por un `find` dentro del bucle.', why: 'Se cambian N consultas por N recorridos del array. Con listas grandes el trabajo pasa a ser cuadrático.', fix: 'Construir un índice y acceder por clave.' },
      { error: 'No deduplicar los identificadores.', why: 'Si diez pedidos son del mismo cliente, la consulta lleva ese identificador diez veces. Funciona, pero es trabajo tirado.', fix: '`Array.from(new Set(ids))`.' },
      { error: 'Llamar a la consulta por lotes con un array vacío.', why: '`WHERE id IN ()` es sintaxis inválida en varios motores, y en otros provoca un recorrido completo de la tabla.', fix: 'Salida temprana cuando la lista principal está vacía.' },
      { error: 'Usar `indexarPor` para una relación uno a muchos.', why: 'Cada clave se sobrescribe y solo sobrevive la última fila. El bug es silencioso: solo se ve con más de un elemento relacionado.', fix: '`agruparPor` cuando la relación es uno a muchos.' },
      { error: 'Devolver `undefined` en lugar de `[]` o `null`.', why: 'Quien consuma el resultado hará `.length` o `.map` y lanzará. Es la "pantalla en blanco" trasladada al backend.', fix: 'Valor por defecto en el punto donde se construye el resultado.' },
      { error: 'Construir el resultado recorriendo los mapas.', why: 'Se pierde el orden que decidió la base de datos, que casi siempre viene de un `ORDER BY` que importa.', fix: 'Recorrer la lista principal y consultar los mapas.' },
      { error: 'Encadenar consultas independientes con `await` seguidos.', why: 'Se suman las latencias sin necesidad.', fix: '`Promise.all` para lo que no dependa entre sí.' },
      { error: 'Meter miles de identificadores en un solo `IN`.', why: 'Muchos motores tienen un límite de parámetros y el planificador se degrada con listas enormes.', fix: 'Trocear en lotes de unos cientos.' }
    ],

    bestPractices: [
      'Ningún `await` dentro de un bucle que recorra datos: es la señal de alarma del N+1.',
      'Recoge todos los identificadores antes de lanzar la primera consulta relacionada.',
      'Deduplica siempre antes de consultar.',
      'Un índice en memoria por cada relación, construido una sola vez.',
      'Valores por defecto explícitos: `null` para uno a uno, `[]` para uno a muchos.',
      'Paraleliza lo independiente, encadena solo lo que tenga una dependencia real.',
      'Registra el número de consultas por petición: es la métrica que detecta un N+1 antes de que llegue a producción.'
    ],

    security: [
      'La consulta por lotes recibe una lista de identificadores construida por tu código, pero asegúrate de que sigue siendo parametrizada: un `IN` montado por concatenación es inyección SQL igual que cualquier otro.',
      'Filtra por permisos en la consulta principal, no después de unir: si un pedido ajeno entra en el conjunto, sus datos ya han salido de la base de datos.',
      'Sin paginación, un usuario con muchos registros puede provocar una consulta enorme. Un límite máximo de resultados es también una protección frente a abuso.'
    ],

    performance: [
      'De 401 idas y vueltas a 2: con 30 ms cada una, de unos 12 s a unos 60 ms.',
      'Lo que más importa no es el tiempo absoluto, sino que el número de consultas deje de crecer con los datos.',
      'La unión en memoria es lineal y ocurre en la aplicación, que escala horizontalmente mucho mejor que la base de datos.',
      'Los índices en las columnas de las claves foráneas (`cliente_id`, `pedido_id`) siguen siendo imprescindibles: sin ellos, la consulta con `IN` recorre la tabla entera.',
      'Con listas muy grandes, trocear el `IN` en lotes de unos cientos evita degradar el planificador.'
    ],

    companyLooksFor: [
      'Que reconozcas el patrón por su forma —un `await` dentro de un bucle— sin necesidad de medir.',
      'Que sepas explicar por qué el coste está en la ida y vuelta y no en la consulta.',
      'Que no sustituyas el N+1 por una búsqueda lineal en memoria.',
      'Que distingas relación uno a uno de uno a muchos al construir los mapas.',
      'Que trates el caso vacío para no gastar consultas de más.',
      'Que sepas argumentar por qué no siempre un `JOIN`.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Número de consultas constante e independiente de N', weight: 35 },
        { criteria: 'Unión por índices en memoria, sin búsquedas lineales', weight: 25 },
        { criteria: 'Casos borde: lista vacía, cliente inexistente, pedido sin líneas', weight: 20 },
        { criteria: 'Orden original conservado', weight: 10 },
        { criteria: 'Paralelización de las consultas independientes', weight: 10 }
      ]
    },

    reinforce: [
      'Planes de ejecución: `EXPLAIN ANALYZE` para ver qué hace realmente una consulta.',
      'Índices en claves foráneas y su efecto sobre `WHERE id IN (...)`.',
      'DataLoader y el patrón de agrupación por ciclo de eventos.',
      'Paginación por cursor frente a `OFFSET`.',
      'Módulo 4 (Asincronía) para `Promise.all` y la diferencia entre serie y paralelo.',
      'Prueba después: `sec-control-acceso`, sobre el mismo tipo de endpoint.'
    ]
  });

  /* ==================================================================
     2. Control de acceso roto
     ================================================================== */
  TT.defineExercise({
    id: 'sec-control-acceso',
    categorias: ['backend', 'apis'],
    title: 'Control de acceso roto: el endpoint que edita facturas ajenas',
    category: 'security',
    kind: 'security',
    level: 'mid',
    time: 55,
    tags: ['IDOR', 'asignación masiva', 'autorización', 'OWASP'],

    context:
      'Una auditoría externa ha encontrado que, en la plataforma de facturación, cualquier usuario ' +
      'autenticado puede modificar la factura de otro cambiando un número en la petición. También ha ' +
      'descubierto que se pueden marcar facturas como pagadas sin pasar por el cobro.',

    situation:
      'El endpoint que edita facturas comprueba que hay sesión iniciada y da por hecho que eso basta. ' +
      'Después aplica sobre la factura todo lo que venga en el cuerpo de la petición, sin filtrar, y ' +
      'devuelve el registro completo tal como está en la base de datos.',

    goal:
      'Reescribir `editarFactura` para que solo se pueda modificar lo que corresponde, solo por quien ' +
      'corresponde, y sin devolver información que el cliente no necesita.',

    tech: ['Node.js', 'JavaScript', 'HTTP'],
    skills: ['autorización', 'IDOR', 'asignación masiva', 'principio de mínimo privilegio', 'exposición de datos'],

    starter: {
      lang: 'javascript',
      code:
'/* ============================================================\n' +
'   PETICIÓN:  PATCH /facturas/:id\n' +
'   ------------------------------------------------------------\n' +
'   req = {\n' +
'     usuario: { id, rol },            <- de la sesión, es de fiar\n' +
'     params:  { id },                 <- de la URL, NO es de fiar\n' +
'     body:    { ... }                 <- del cliente, NO es de fiar\n' +
'   }\n' +
'\n' +
'   deps.repo.facturaPorId(id)      -> factura | null\n' +
'   deps.repo.actualizar(id, campos)-> factura actualizada\n' +
'   deps.log.warn(evento, datos)\n' +
'\n' +
'   Una factura en base de datos:\n' +
'     { id, usuarioId, concepto, notas, importe,\n' +
'       estado: "borrador"|"emitida"|"pagada",\n' +
'       costeInterno, margen, referenciaBanco }\n' +
'\n' +
'   REGLAS DE NEGOCIO\n' +
'     - El propietario puede editar `concepto` y `notas`.\n' +
'     - El propietario NO puede tocar `importe`, `estado`,\n' +
'       `usuarioId` ni ningún campo interno.\n' +
'     - Un usuario con rol "admin" puede editar además `importe`.\n' +
'     - Nadie cambia `estado` por esta vía: hay otro flujo para eso.\n' +
'     - Una factura ya "pagada" no se puede editar.\n' +
'   ============================================================ */\n' +
'\n' +
'async function editarFactura(deps, req) {\n' +
'  const factura = await deps.repo.facturaPorId(req.params.id);\n' +
'  if (!factura) return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'\n' +
'  // Se aplica todo lo que venga en el cuerpo, tal cual.\n' +
'  const actualizada = await deps.repo.actualizar(factura.id, req.body);\n' +
'\n' +
'  return { status: 200, body: actualizada };\n' +
'}\n'
    },

    requirements: [
      'Comprobar la propiedad: un usuario que no sea el dueño de la factura no puede editarla.',
      'Responder 404 y no 403 cuando la factura es de otro: un 403 confirma que ese identificador existe.',
      'Lista blanca de campos editables: `concepto` y `notas` para el propietario, más `importe` para admin.',
      'Ignorar cualquier otro campo del cuerpo, aunque exista en la tabla: `estado`, `usuarioId`, `costeInterno`, `margen`.',
      'Una factura en estado `pagada` no se puede editar: responder 409.',
      'La respuesta solo devuelve campos públicos, nunca `costeInterno`, `margen` ni `referenciaBanco`.',
      'Registrar un aviso cuando alguien intenta editar una factura ajena o enviar campos no permitidos.'
    ],

    optional: [
      'Devolver 422 si el cuerpo no contiene ningún campo editable.',
      'Validar el tipo y el rango de `importe` cuando lo envía un admin.',
      'Añadir la lista de campos ignorados a la respuesta, para ayudar a quien integra.'
    ],

    hints: [
      'La comprobación de propiedad es lo primero que debe ocurrir después de encontrar el registro. Todo lo que hagas antes de comprobarla, lo estás haciendo sobre un recurso que quizá no le corresponde a quien llama.',
      'No filtres el cuerpo quitando los campos peligrosos: esa lista siempre se queda corta. Construye un objeto nuevo tomando solo los campos permitidos.',
      'Los campos permitidos dependen del rol. Empieza por los del propietario y añade los del admin si procede: así el permiso extra es aditivo y explícito.',
      'El rol se lee de `req.usuario`, que viene de la sesión. Si lo lees de `req.body`, cualquiera puede declararse administrador.',
      'La respuesta también es una superficie de exposición: construye un objeto con los campos públicos en vez de devolver la fila entera.'
    ],

    tests: {
      mode: 'js',
      timeout: 5000,
      setup:
'function crearDeps(facturas) {\n' +
'  var avisos = [];\n' +
'  var almacen = JSON.parse(JSON.stringify(facturas));\n' +
'  return {\n' +
'    avisos: avisos,\n' +
'    almacen: almacen,\n' +
'    repo: {\n' +
'      facturaPorId: async function (id) {\n' +
'        var f = almacen.filter(function (x) { return x.id === id; })[0];\n' +
'        return f ? JSON.parse(JSON.stringify(f)) : null;\n' +
'      },\n' +
'      actualizar: async function (id, campos) {\n' +
'        var f = almacen.filter(function (x) { return x.id === id; })[0];\n' +
'        Object.keys(campos).forEach(function (k) { f[k] = campos[k]; });\n' +
'        return JSON.parse(JSON.stringify(f));\n' +
'      }\n' +
'    },\n' +
'    log: { warn: function (e, d) { avisos.push({ evento: e, datos: d }); } }\n' +
'  };\n' +
'}\n' +
'\n' +
'var FACTURAS = [\n' +
'  { id: "f1", usuarioId: "u1", concepto: "Diseño web", notas: "", importe: 1000,\n' +
'    estado: "emitida", costeInterno: 400, margen: 0.6, referenciaBanco: "ES99-SECRETO" },\n' +
'  { id: "f2", usuarioId: "u2", concepto: "Consultoría", notas: "", importe: 2000,\n' +
'    estado: "emitida", costeInterno: 900, margen: 0.55, referenciaBanco: "ES88-SECRETO" },\n' +
'  { id: "f3", usuarioId: "u1", concepto: "Hosting", notas: "", importe: 300,\n' +
'    estado: "pagada", costeInterno: 100, margen: 0.66, referenciaBanco: "ES77-SECRETO" }\n' +
'];\n' +
'\n' +
'function peticion(usuario, id, body) {\n' +
'  return { usuario: usuario, params: { id: id }, body: body };\n' +
'}\n' +
'var ANA   = { id: "u1", rol: "usuario" };\n' +
'var LUIS  = { id: "u2", rol: "usuario" };\n' +
'var ADMIN = { id: "u9", rol: "admin" };',
      cases: [
        {
          name: 'El propietario puede editar el concepto',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  const r = await editarFactura(d, peticion(ANA, "f1", { concepto: "Rediseño web" }));\n' +
'  expect(r.status).toBe(200);\n' +
'  expect(r.body.concepto).toBe("Rediseño web");\n' +
'})()'
        },
        {
          name: 'IDOR — editar la factura de otro devuelve 404 y no la modifica',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  const r = await editarFactura(d, peticion(LUIS, "f1", { concepto: "Robada" }));\n' +
'  expect(r.status).toBe(404);\n' +
'  expect(d.almacen[0].concepto).toBe("Diseño web");\n' +
'})()'
        },
        {
          name: 'El intento de acceso ajeno queda registrado',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  await editarFactura(d, peticion(LUIS, "f1", { concepto: "Robada" }));\n' +
'  expect(d.avisos.length > 0).toBeTruthy();\n' +
'})()'
        },
        {
          name: 'Asignación masiva — no se puede cambiar el estado a pagada',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  await editarFactura(d, peticion(ANA, "f1", { concepto: "ok", estado: "pagada" }));\n' +
'  expect(d.almacen[0].estado).toBe("emitida");\n' +
'})()'
        },
        {
          name: 'Asignación masiva — no se puede cambiar el propietario',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  await editarFactura(d, peticion(ANA, "f1", { notas: "x", usuarioId: "u2" }));\n' +
'  expect(d.almacen[0].usuarioId).toBe("u1");\n' +
'})()'
        },
        {
          name: 'Asignación masiva — un usuario normal no puede cambiar el importe',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  await editarFactura(d, peticion(ANA, "f1", { importe: 1 }));\n' +
'  expect(d.almacen[0].importe).toBe(1000);\n' +
'})()'
        },
        {
          name: 'Un admin sí puede cambiar el importe',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  const r = await editarFactura(d, peticion(ADMIN, "f1", { importe: 1500 }));\n' +
'  expect(r.status).toBe(200);\n' +
'  expect(d.almacen[0].importe).toBe(1500);\n' +
'})()'
        },
        {
          name: 'El rol se lee de la sesión, no del cuerpo de la petición',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  await editarFactura(d, peticion(ANA, "f1", { importe: 1, rol: "admin" }));\n' +
'  expect(d.almacen[0].importe).toBe(1000);\n' +
'})()'
        },
        {
          name: 'Ni siquiera un admin cambia el estado por esta vía',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  await editarFactura(d, peticion(ADMIN, "f1", { estado: "pagada" }));\n' +
'  expect(d.almacen[0].estado).toBe("emitida");\n' +
'})()'
        },
        {
          name: 'Una factura pagada no se puede editar (409)',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  const r = await editarFactura(d, peticion(ANA, "f3", { concepto: "Cambio" }));\n' +
'  expect(r.status).toBe(409);\n' +
'  expect(d.almacen[2].concepto).toBe("Hosting");\n' +
'})()'
        },
        {
          name: 'La respuesta no expone campos internos',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  const r = await editarFactura(d, peticion(ANA, "f1", { notas: "urgente" }));\n' +
'  const texto = JSON.stringify(r.body);\n' +
'  expect(texto.indexOf("costeInterno")).toBe(-1);\n' +
'  expect(texto.indexOf("margen")).toBe(-1);\n' +
'  expect(texto.indexOf("SECRETO")).toBe(-1);\n' +
'})()'
        },
        {
          name: 'Una factura inexistente devuelve 404',
          code:
'(async () => {\n' +
'  const d = crearDeps(FACTURAS);\n' +
'  const r = await editarFactura(d, peticion(ANA, "no-existe", { notas: "x" }));\n' +
'  expect(r.status).toBe(404);\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'// Campos que cada rol puede modificar. Lista blanca: lo que no está\n' +
'// aquí no entra, aunque exista en la tabla.\n' +
'const EDITABLES_PROPIETARIO = ["concepto", "notas"];\n' +
'const EDITABLES_ADMIN = ["importe"];\n' +
'\n' +
'// Campos que salen en la respuesta. Todo lo demás es interno.\n' +
'const CAMPOS_PUBLICOS = ["id", "concepto", "notas", "importe", "estado"];\n' +
'\n' +
'/** Copia solo las claves permitidas de un objeto no confiable. */\n' +
'function soloCampos(origen, permitidos) {\n' +
'  const salida = {};\n' +
'  for (const campo of permitidos) {\n' +
'    if (Object.prototype.hasOwnProperty.call(origen, campo)) {\n' +
'      salida[campo] = origen[campo];\n' +
'    }\n' +
'  }\n' +
'  return salida;\n' +
'}\n' +
'\n' +
'async function editarFactura(deps, req) {\n' +
'  const usuario = req.usuario;\n' +
'  const body = req.body || {};\n' +
'\n' +
'  const factura = await deps.repo.facturaPorId(req.params.id);\n' +
'  if (!factura) {\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Autorización: lo primero después de encontrar el recurso ---\n' +
'  // Un usuario normal solo accede a lo suyo. El admin, a todo.\n' +
'  const esPropietario = factura.usuarioId === usuario.id;\n' +
'  const esAdmin = usuario.rol === "admin";\n' +
'\n' +
'  if (!esPropietario && !esAdmin) {\n' +
'    deps.log.warn("factura.acceso_ajeno", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id\n' +
'    });\n' +
'    // 404 y no 403: un 403 confirmaría que esa factura existe.\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Regla de negocio: una factura pagada es inmutable ---\n' +
'  if (factura.estado === "pagada") {\n' +
'    return { status: 409, body: { error: "FACTURA_PAGADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Lista blanca de campos, según el rol de la SESIÓN ---\n' +
'  // El rol nunca se lee del cuerpo: ahí lo controla el atacante.\n' +
'  const permitidos = esAdmin\n' +
'    ? EDITABLES_PROPIETARIO.concat(EDITABLES_ADMIN)\n' +
'    : EDITABLES_PROPIETARIO;\n' +
'\n' +
'  const cambios = soloCampos(body, permitidos);\n' +
'\n' +
'  // Si el cliente mandó campos que no puede tocar, lo anotamos:\n' +
'  // puede ser una integración mal hecha o una tentativa.\n' +
'  const ignorados = Object.keys(body).filter(function (k) {\n' +
'    return permitidos.indexOf(k) === -1;\n' +
'  });\n' +
'  if (ignorados.length) {\n' +
'    deps.log.warn("factura.campos_ignorados", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id, campos: ignorados\n' +
'    });\n' +
'  }\n' +
'\n' +
'  if (Object.keys(cambios).length === 0) {\n' +
'    return { status: 422, body: { error: "SIN_CAMPOS_EDITABLES" } };\n' +
'  }\n' +
'\n' +
'  const actualizada = await deps.repo.actualizar(factura.id, cambios);\n' +
'\n' +
'  // --- La respuesta también se filtra ---\n' +
'  return { status: 200, body: soloCampos(actualizada, CAMPOS_PUBLICOS) };\n' +
'}\n'
    },

    fases: [
      {
        titulo: 'Fase 1 — Comprobar la propiedad (cerrar el IDOR)',
        objetivo:
          'Impedir que un usuario edite una factura que no es suya. Es el fallo más grave de los cuatro y ' +
          'el que la auditoría señala primero.',
        anadido: [
          'Cálculo de `esPropietario` y `esAdmin` a partir de `req.usuario`.',
          'Retorno 404 —no 403— cuando el recurso es de otro.',
          'Registro del intento de acceso ajeno.'
        ],
        codigo:
'async function editarFactura(deps, req) {\n' +
'  const usuario = req.usuario;\n' +
'  const body = req.body || {};\n' +
'\n' +
'  const factura = await deps.repo.facturaPorId(req.params.id);\n' +
'  if (!factura) {\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Autorización: lo primero después de encontrar el recurso ---\n' +
'  const esPropietario = factura.usuarioId === usuario.id;\n' +
'  const esAdmin = usuario.rol === "admin";\n' +
'\n' +
'  if (!esPropietario && !esAdmin) {\n' +
'    deps.log.warn("factura.acceso_ajeno", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id\n' +
'    });\n' +
'    // 404 y no 403: un 403 confirmaría que esa factura existe.\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // Se sigue aplicando todo lo que venga en el cuerpo: lo arreglamos\n' +
'  // en la fase siguiente.\n' +
'  const actualizada = await deps.repo.actualizar(factura.id, body);\n' +
'\n' +
'  return { status: 200, body: actualizada };\n' +
'}\n',
        explicacion:
          'La **posición** de este bloque es lo importante: va inmediatamente después de encontrar el ' +
          'recurso y antes de cualquier otra cosa. Todo lo que ejecutes antes de la comprobación lo estás ' +
          'ejecutando sobre un recurso que quizá no le corresponde a quien llama.\n' +
          'El rol se lee de `req.usuario`, que viene de la sesión validada en el servidor. Leerlo de ' +
          '`req.body` sería dejar que el atacante se declare administrador.\n' +
          'La decisión de devolver **404 en vez de 403** es deliberada. Un 403 dice "existe, pero no puedes": ' +
          'con eso se puede recorrer el rango de identificadores y averiguar cuántas facturas hay y cuáles. ' +
          'Un 404 no distingue entre "no existe" y "no es tuya".\n' +
          'El aviso en el log es lo que permite detectar un recorrido sistemático de identificadores: un ' +
          'usuario que genera cincuenta de estos avisos en un minuto no está equivocándose.',
        comprueba:
          'Los tres primeros casos —edición propia, IDOR y registro del intento— deberían pasar a verde. ' +
          'Los de asignación masiva siguen en rojo.'
      },
      {
        titulo: 'Fase 2 — Lista blanca de campos (cerrar la asignación masiva)',
        objetivo:
          'Que solo se apliquen los campos que ese usuario puede modificar, e ignorar todo lo demás aunque ' +
          'venga en el cuerpo.',
        anadido: [
          'Constantes `EDITABLES_PROPIETARIO` y `EDITABLES_ADMIN` en el nivel superior del archivo.',
          'Función auxiliar `soloCampos(origen, permitidos)`.',
          'Cálculo de `permitidos` según el rol y construcción de `cambios`.'
        ],
        codigo:
'// Campos que cada rol puede modificar. Lista blanca: lo que no está\n' +
'// aquí no entra, aunque exista en la tabla.\n' +
'const EDITABLES_PROPIETARIO = ["concepto", "notas"];\n' +
'const EDITABLES_ADMIN = ["importe"];\n' +
'\n' +
'/** Copia solo las claves permitidas de un objeto no confiable. */\n' +
'function soloCampos(origen, permitidos) {\n' +
'  const salida = {};\n' +
'  for (const campo of permitidos) {\n' +
'    if (Object.prototype.hasOwnProperty.call(origen, campo)) {\n' +
'      salida[campo] = origen[campo];\n' +
'    }\n' +
'  }\n' +
'  return salida;\n' +
'}\n' +
'\n' +
'async function editarFactura(deps, req) {\n' +
'  const usuario = req.usuario;\n' +
'  const body = req.body || {};\n' +
'\n' +
'  const factura = await deps.repo.facturaPorId(req.params.id);\n' +
'  if (!factura) {\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Autorización: lo primero después de encontrar el recurso ---\n' +
'  const esPropietario = factura.usuarioId === usuario.id;\n' +
'  const esAdmin = usuario.rol === "admin";\n' +
'\n' +
'  if (!esPropietario && !esAdmin) {\n' +
'    deps.log.warn("factura.acceso_ajeno", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id\n' +
'    });\n' +
'    // 404 y no 403: un 403 confirmaría que esa factura existe.\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Lista blanca de campos, según el rol de la SESIÓN ---\n' +
'  // El rol nunca se lee del cuerpo: ahí lo controla el atacante.\n' +
'  const permitidos = esAdmin\n' +
'    ? EDITABLES_PROPIETARIO.concat(EDITABLES_ADMIN)\n' +
'    : EDITABLES_PROPIETARIO;\n' +
'\n' +
'  const cambios = soloCampos(body, permitidos);\n' +
'\n' +
'  const actualizada = await deps.repo.actualizar(factura.id, cambios);\n' +
'\n' +
'  return { status: 200, body: actualizada };\n' +
'}\n',
        explicacion:
          'La lista blanca es la única defensa que aguanta. La alternativa —quitar del cuerpo los campos ' +
          'peligrosos— exige acordarse de todos, y esa lista siempre se queda corta: en cuanto alguien ' +
          'añade una columna a la tabla, el agujero vuelve sin que nadie toque este archivo.\n' +
          'Fíjate en que `permitidos` es **aditivo**: el admin obtiene los campos del propietario más los ' +
          'suyos. Escribirlo así hace explícito que el permiso extra es exactamente `importe`, y evita ' +
          'tener dos listas que haya que mantener sincronizadas.\n' +
          '`estado` y `usuarioId` no aparecen en ninguna de las dos listas, así que ni un admin puede ' +
          'tocarlos por esta vía. Eso implementa la regla del enunciado sin necesidad de una comprobación ' +
          'aparte: **lo que no está permitido, simplemente no existe**.\n' +
          '`hasOwnProperty` en lugar de `if (origen[campo])` es importante: permite asignar valores válidos ' +
          'pero falsy, como una cadena vacía en `notas` o un importe de 0.',
        comprueba:
          'Los cinco casos de asignación masiva y el del admin pasan a verde. Quedan el de la factura ' +
          'pagada y el de los campos internos en la respuesta.'
      },
      {
        titulo: 'Fase 3 — Regla de negocio: la factura pagada es inmutable',
        objetivo:
          'Impedir que se modifique una factura que ya está cobrada, con el código de estado correcto.',
        anadido: [
          'Comprobación de `factura.estado === "pagada"` con respuesta 409.'
        ],
        codigo:
'// Campos que cada rol puede modificar. Lista blanca: lo que no está\n' +
'// aquí no entra, aunque exista en la tabla.\n' +
'const EDITABLES_PROPIETARIO = ["concepto", "notas"];\n' +
'const EDITABLES_ADMIN = ["importe"];\n' +
'\n' +
'/** Copia solo las claves permitidas de un objeto no confiable. */\n' +
'function soloCampos(origen, permitidos) {\n' +
'  const salida = {};\n' +
'  for (const campo of permitidos) {\n' +
'    if (Object.prototype.hasOwnProperty.call(origen, campo)) {\n' +
'      salida[campo] = origen[campo];\n' +
'    }\n' +
'  }\n' +
'  return salida;\n' +
'}\n' +
'\n' +
'async function editarFactura(deps, req) {\n' +
'  const usuario = req.usuario;\n' +
'  const body = req.body || {};\n' +
'\n' +
'  const factura = await deps.repo.facturaPorId(req.params.id);\n' +
'  if (!factura) {\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Autorización: lo primero después de encontrar el recurso ---\n' +
'  const esPropietario = factura.usuarioId === usuario.id;\n' +
'  const esAdmin = usuario.rol === "admin";\n' +
'\n' +
'  if (!esPropietario && !esAdmin) {\n' +
'    deps.log.warn("factura.acceso_ajeno", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id\n' +
'    });\n' +
'    // 404 y no 403: un 403 confirmaría que esa factura existe.\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Regla de negocio: una factura pagada es inmutable ---\n' +
'  if (factura.estado === "pagada") {\n' +
'    return { status: 409, body: { error: "FACTURA_PAGADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Lista blanca de campos, según el rol de la SESIÓN ---\n' +
'  // El rol nunca se lee del cuerpo: ahí lo controla el atacante.\n' +
'  const permitidos = esAdmin\n' +
'    ? EDITABLES_PROPIETARIO.concat(EDITABLES_ADMIN)\n' +
'    : EDITABLES_PROPIETARIO;\n' +
'\n' +
'  const cambios = soloCampos(body, permitidos);\n' +
'\n' +
'  const actualizada = await deps.repo.actualizar(factura.id, cambios);\n' +
'\n' +
'  return { status: 200, body: actualizada };\n' +
'}\n',
        explicacion:
          'La comprobación va **después** de la autorización, y ese orden importa por un motivo de ' +
          'seguridad que no es evidente: si la pusieras antes, un usuario ajeno recibiría un 409 en vez de ' +
          'un 404 y aprendería que esa factura existe y está pagada. Las comprobaciones de negocio nunca van ' +
          'antes que las de acceso, porque sus respuestas filtran información.\n' +
          'El código 409 (Conflict) es el correcto: la petición está bien formada y quien llama tiene ' +
          'permiso, pero choca con el estado actual del recurso. No es un 400 (petición mal formada) ni un ' +
          '403 (sin permiso).\n' +
          'El estado se lee de la factura que está en base de datos, nunca del cuerpo de la petición.',
        comprueba: 'El caso de la factura pagada pasa a verde. Queda el de los campos internos.'
      },
      {
        titulo: 'Fase 4 — Filtrar la respuesta y registrar los campos ignorados',
        objetivo:
          'Dejar de exponer datos internos en la respuesta y dar visibilidad a los intentos de enviar campos ' +
          'no permitidos.',
        anadido: [
          'Constante `CAMPOS_PUBLICOS` y filtrado de la respuesta con `soloCampos`.',
          'Cálculo de `ignorados` y aviso en el log.',
          'Respuesta 422 cuando el cuerpo no trae ningún campo editable.'
        ],
        codigo:
'// Campos que cada rol puede modificar. Lista blanca: lo que no está\n' +
'// aquí no entra, aunque exista en la tabla.\n' +
'const EDITABLES_PROPIETARIO = ["concepto", "notas"];\n' +
'const EDITABLES_ADMIN = ["importe"];\n' +
'\n' +
'// Campos que salen en la respuesta. Todo lo demás es interno.\n' +
'const CAMPOS_PUBLICOS = ["id", "concepto", "notas", "importe", "estado"];\n' +
'\n' +
'/** Copia solo las claves permitidas de un objeto no confiable. */\n' +
'function soloCampos(origen, permitidos) {\n' +
'  const salida = {};\n' +
'  for (const campo of permitidos) {\n' +
'    if (Object.prototype.hasOwnProperty.call(origen, campo)) {\n' +
'      salida[campo] = origen[campo];\n' +
'    }\n' +
'  }\n' +
'  return salida;\n' +
'}\n' +
'\n' +
'async function editarFactura(deps, req) {\n' +
'  const usuario = req.usuario;\n' +
'  const body = req.body || {};\n' +
'\n' +
'  const factura = await deps.repo.facturaPorId(req.params.id);\n' +
'  if (!factura) {\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Autorización: lo primero después de encontrar el recurso ---\n' +
'  // Un usuario normal solo accede a lo suyo. El admin, a todo.\n' +
'  const esPropietario = factura.usuarioId === usuario.id;\n' +
'  const esAdmin = usuario.rol === "admin";\n' +
'\n' +
'  if (!esPropietario && !esAdmin) {\n' +
'    deps.log.warn("factura.acceso_ajeno", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id\n' +
'    });\n' +
'    // 404 y no 403: un 403 confirmaría que esa factura existe.\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Regla de negocio: una factura pagada es inmutable ---\n' +
'  if (factura.estado === "pagada") {\n' +
'    return { status: 409, body: { error: "FACTURA_PAGADA" } };\n' +
'  }\n' +
'\n' +
'  // --- Lista blanca de campos, según el rol de la SESIÓN ---\n' +
'  // El rol nunca se lee del cuerpo: ahí lo controla el atacante.\n' +
'  const permitidos = esAdmin\n' +
'    ? EDITABLES_PROPIETARIO.concat(EDITABLES_ADMIN)\n' +
'    : EDITABLES_PROPIETARIO;\n' +
'\n' +
'  const cambios = soloCampos(body, permitidos);\n' +
'\n' +
'  // Si el cliente mandó campos que no puede tocar, lo anotamos:\n' +
'  // puede ser una integración mal hecha o una tentativa.\n' +
'  const ignorados = Object.keys(body).filter(function (k) {\n' +
'    return permitidos.indexOf(k) === -1;\n' +
'  });\n' +
'  if (ignorados.length) {\n' +
'    deps.log.warn("factura.campos_ignorados", {\n' +
'      usuarioId: usuario.id, facturaId: factura.id, campos: ignorados\n' +
'    });\n' +
'  }\n' +
'\n' +
'  if (Object.keys(cambios).length === 0) {\n' +
'    return { status: 422, body: { error: "SIN_CAMPOS_EDITABLES" } };\n' +
'  }\n' +
'\n' +
'  const actualizada = await deps.repo.actualizar(factura.id, cambios);\n' +
'\n' +
'  // --- La respuesta también se filtra ---\n' +
'  return { status: 200, body: soloCampos(actualizada, CAMPOS_PUBLICOS) };\n' +
'}\n',
        explicacion:
          'La respuesta es tan superficie de exposición como la escritura, y se olvida mucho más a menudo. ' +
          'Devolver la fila entera filtraba `costeInterno`, `margen` y `referenciaBanco`: información con la ' +
          'que un cliente puede calcular tus precios de coste.\n' +
          'Reutilizar `soloCampos` para la respuesta no es casualidad: **entrada y salida se filtran con la ' +
          'misma herramienta y con la misma lógica de lista blanca**.\n' +
          'El registro de campos ignorados aporta algo que no se ve a simple vista: distingue una ' +
          'integración mal hecha de una tentativa. Un cliente que manda `estado: "pagada"` una vez ' +
          'probablemente tiene un error; uno que lo manda quinientas veces está probando.\n' +
          'El 422 cuando no hay nada editable evita una escritura vacía en base de datos y le dice a quien ' +
          'integra que su petición no ha hecho nada, en lugar de responder 200 y dejarle creer que sí.\n' +
          'Esta es la solución final: los cuatro fallos de la auditoría cerrados.',
        comprueba: 'Los doce casos de la plataforma en verde.'
      }
    ],

    docs: {
      resumen:
        'El control de acceso roto es el riesgo número uno del OWASP Top 10. Aquí se ven sus dos formas más ' +
        'comunes: **IDOR** (acceder a un recurso ajeno cambiando un identificador) y **asignación masiva** ' +
        '(modificar campos que no deberías porque el código aplica el cuerpo entero). Las dos se cierran con ' +
        'listas blancas y con el orden correcto de comprobaciones.',

      conceptos: [
        {
          titulo: 'Autenticación no es autorización',
          texto:
            'Son dos preguntas distintas y confundirlas es el origen del fallo:\n' +
            '**Autenticación** — ¿quién eres? La resuelve la sesión o el token.\n' +
            '**Autorización** — ¿puedes hacer *esto* con *este* recurso concreto? La tiene que resolver cada ' +
            'endpoint.\n' +
            'El código de partida comprueba la primera y da por hecha la segunda. Estar autenticado te ' +
            'convierte en "un usuario", no en "el dueño de la factura f1".\n' +
            'La autorización siempre tiene dos partes: **qué acción** y **sobre qué recurso**. Un middleware ' +
            'genérico puede cubrir la acción; el recurso concreto solo lo puede comprobar el endpoint, ' +
            'porque solo él sabe a quién pertenece.',
          codigo:
'// Lo que hace el middleware de sesión\n' +
'//   ¿hay sesión válida?  ->  req.usuario = { id, rol }\n' +
'//   AUTENTICACIÓN: resuelta\n' +
'\n' +
'// Lo que tiene que hacer el endpoint\n' +
'//   ¿esta factura es de req.usuario?\n' +
'//   ¿este rol puede cambiar este campo?\n' +
'//   AUTORIZACIÓN: es responsabilidad tuya\n' +
'\n' +
'const esPropietario = factura.usuarioId === usuario.id;\n' +
'if (!esPropietario && usuario.rol !== "admin") { /* denegar */ }'
        },
        {
          titulo: 'IDOR: cambiar un número en la URL',
          texto:
            'IDOR son las siglas de *Insecure Direct Object Reference*: referencia directa insegura a un ' +
            'objeto. El ataque es tan simple como cambiar `/facturas/f1` por `/facturas/f2` y ver qué pasa.\n' +
            'Funciona siempre que el endpoint use el identificador de la URL para buscar el recurso sin ' +
            'comprobar después a quién pertenece. No requiere herramientas ni conocimientos: se hace desde ' +
            'la barra del navegador.\n' +
            'Y es sistemático: recorriendo identificadores se puede volcar la base de datos entera.\n' +
            'La defensa es comprobar la propiedad, y la forma más robusta de hacerlo es **incluirla en la ' +
            'consulta**, para que sea imposible olvidarla.',
          codigo:
'// VULNERABLE\n' +
'const factura = await repo.facturaPorId(req.params.id);\n' +
'// ...se usa sin comprobar de quién es\n' +
'\n' +
'// CORRECTO (comprobación explícita)\n' +
'const factura = await repo.facturaPorId(req.params.id);\n' +
'if (factura.usuarioId !== req.usuario.id) return { status: 404, ... };\n' +
'\n' +
'// MÁS ROBUSTO (la propiedad forma parte de la consulta)\n' +
'const factura = await repo.facturaDeUsuario(req.params.id, req.usuario.id);\n' +
'if (!factura) return { status: 404, ... };\n' +
'//   así no se puede olvidar en el siguiente endpoint'
        },
        {
          titulo: 'Por qué 404 y no 403',
          texto:
            'La respuesta a un acceso no autorizado también filtra información.\n' +
            'Un **403 Forbidden** dice: "este recurso existe, pero no es tuyo". Con eso, recorriendo ' +
            'identificadores, se puede averiguar cuántas facturas hay en el sistema y cuáles existen. Es ' +
            '**enumeración de recursos**.\n' +
            'Un **404 Not Found** no distingue entre "no existe" y "no es tuyo". Desde fuera, un recurso ' +
            'ajeno es indistinguible de uno inexistente.\n' +
            'La regla práctica: usa 403 cuando el usuario **sabe legítimamente** que el recurso existe (por ' +
            'ejemplo, un documento compartido de su equipo al que le falta permiso de edición). Usa 404 ' +
            'cuando no debería ni saber de su existencia.',
          codigo:
'// Filtra información\n' +
'if (!esPropietario) return { status: 403, body: { error: "SIN_PERMISO" } };\n' +
'//   GET /facturas/1 -> 403  (existe)\n' +
'//   GET /facturas/2 -> 404  (no existe)\n' +
'//   ...se puede mapear la base de datos entera\n' +
'\n' +
'// No filtra nada\n' +
'if (!esPropietario) return { status: 404, body: { error: "NO_ENCONTRADA" } };\n' +
'//   todas las respuestas son iguales desde fuera'
        },
        {
          titulo: 'Asignación masiva: el peligro de aplicar el cuerpo entero',
          texto:
            'La **asignación masiva** (*mass assignment*) ocurre cuando el código aplica sobre un registro ' +
            'todos los campos que llegan en la petición.\n' +
            'Es cómodo de escribir y funciona perfectamente mientras los clientes se porten bien. El ' +
            'problema es que el cuerpo de la petición lo controla el atacante por completo: puede incluir ' +
            'cualquier columna de tu tabla.\n' +
            'Aquí permite marcar una factura como pagada sin pagarla, cambiar el propietario o alterar el ' +
            'importe. En otros sistemas es como se consigue `rol: "admin"` o `saldo: 999999`.\n' +
            'La defensa **no** es quitar los campos peligrosos: esa lista siempre se queda corta y se rompe ' +
            'sola en cuanto alguien añade una columna. La defensa es una lista blanca.',
          codigo:
'// VULNERABLE: el cliente decide qué columnas se escriben\n' +
'await repo.actualizar(factura.id, req.body);\n' +
'\n' +
'//   PATCH /facturas/f1\n' +
'//   { "concepto": "ok", "estado": "pagada", "usuarioId": "yo" }\n' +
'//   -> factura pagada, y ahora es mía\n' +
'\n' +
'// LISTA NEGRA: frágil, siempre se queda corta\n' +
'delete req.body.estado;\n' +
'delete req.body.usuarioId;\n' +
'//   ¿y costeInterno? ¿y la columna que añadan mañana?\n' +
'\n' +
'// LISTA BLANCA: solo entra lo declarado\n' +
'const cambios = soloCampos(req.body, ["concepto", "notas"]);'
        },
        {
          titulo: 'Construir la lista blanca según el rol',
          texto:
            'Los campos editables dependen de quién edita. La forma clara de expresarlo es **aditiva**: se ' +
            'parte de los permisos básicos y se añaden los del rol superior.\n' +
            'Escribirlo así tiene dos ventajas. Deja explícito qué añade exactamente cada rol —aquí, ' +
            'únicamente `importe`— y evita mantener dos listas completas que se desincronizan.\n' +
            'Y un detalle que resuelve una regla del enunciado sin código adicional: **`estado` y ' +
            '`usuarioId` no aparecen en ninguna lista**, así que ni un administrador puede tocarlos por esta ' +
            'vía. Lo que no está permitido, simplemente no existe.',
          codigo:
'const EDITABLES_PROPIETARIO = ["concepto", "notas"];\n' +
'const EDITABLES_ADMIN = ["importe"];\n' +
'\n' +
'const permitidos = esAdmin\n' +
'  ? EDITABLES_PROPIETARIO.concat(EDITABLES_ADMIN)   // ["concepto","notas","importe"]\n' +
'  : EDITABLES_PROPIETARIO;                          // ["concepto","notas"]\n' +
'\n' +
'// `estado` y `usuarioId` no están en NINGUNA lista:\n' +
'// no hay rol que pueda cambiarlos por este endpoint.'
        },
        {
          titulo: 'hasOwnProperty: no confundir "no enviado" con "enviado vacío"',
          texto:
            'Al copiar campos permitidos, la comprobación importa. `if (origen[campo])` descarta los valores ' +
            '*falsy*: una cadena vacía, un cero, un `false`.\n' +
            'Eso significa que borrar las notas (`notas: ""`) o poner un importe a cero no funcionaría, y el ' +
            'usuario no entendería por qué.\n' +
            '`Object.prototype.hasOwnProperty.call(origen, campo)` pregunta si la clave **está presente**, ' +
            'sin mirar su valor. Es lo correcto.\n' +
            'Se llama con `.call` en lugar de `origen.hasOwnProperty(campo)` porque el cuerpo de la petición ' +
            'es un objeto no confiable: podría traer una clave `hasOwnProperty` propia y romper la ' +
            'comprobación.',
          codigo:
'// MAL: descarta valores válidos pero falsy\n' +
'if (origen[campo]) salida[campo] = origen[campo];\n' +
'//   { notas: "" }      -> se ignora, no se puede borrar la nota\n' +
'//   { importe: 0 }     -> se ignora\n' +
'\n' +
'// BIEN: mira si la clave está presente\n' +
'if (Object.prototype.hasOwnProperty.call(origen, campo)) {\n' +
'  salida[campo] = origen[campo];\n' +
'}\n' +
'\n' +
'// Por qué .call y no origen.hasOwnProperty(campo):\n' +
'//   el cuerpo podría llegar como { "hasOwnProperty": "hola", ... }\n' +
'//   y la llamada directa fallaría.'
        },
        {
          titulo: 'El orden de las comprobaciones también es seguridad',
          texto:
            'No basta con hacer todas las comprobaciones: el **orden** determina qué información se filtra.\n' +
            'El orden correcto es: **existe → puede acceder → reglas de negocio → validación → escritura**.\n' +
            'Si comprobaras el estado "pagada" antes que la propiedad, un usuario ajeno recibiría un 409 en ' +
            'lugar de un 404 y aprendería dos cosas: que esa factura existe y que está pagada.\n' +
            'La regla general: **las comprobaciones de negocio nunca van antes que las de acceso**, porque ' +
            'sus respuestas revelan información sobre un recurso que quien pregunta no debería ni saber que ' +
            'existe.',
          codigo:
'// ORDEN CORRECTO\n' +
'const factura = await repo.facturaPorId(id);\n' +
'if (!factura) return 404;                       // 1. ¿existe?\n' +
'if (!puedeAcceder) return 404;                  // 2. ¿es suya?\n' +
'if (factura.estado === "pagada") return 409;    // 3. reglas de negocio\n' +
'const cambios = soloCampos(body, permitidos);   // 4. validación\n' +
'await repo.actualizar(id, cambios);             // 5. escritura\n' +
'\n' +
'// ORDEN INCORRECTO: el 409 llega antes de comprobar la propiedad\n' +
'//   -> un extraño descubre que la factura existe Y que está pagada'
        },
        {
          titulo: 'La respuesta también es una superficie de exposición',
          texto:
            'Devolver el registro tal como está en la base de datos es cómodo y filtra todo lo que ese ' +
            'registro contenga: costes internos, márgenes, referencias bancarias, marcas internas.\n' +
            'Aquí, con `costeInterno` y `margen`, un cliente puede calcular exactamente cuánto ganas con él. ' +
            'No es una brecha catastrófica, pero es información comercial que no debería salir.\n' +
            'La solución es la misma lista blanca, aplicada a la salida. Reutilizar la misma función para ' +
            'entrada y salida no es casualidad: **el mismo criterio en las dos direcciones**.\n' +
            'Y este filtrado va en el punto donde se construye la respuesta, no repartido por la aplicación.',
          codigo:
'// EXPUESTO: sale la fila entera\n' +
'return { status: 200, body: actualizada };\n' +
'//   { id, usuarioId, concepto, notas, importe, estado,\n' +
'//     costeInterno: 400, margen: 0.6, referenciaBanco: "ES99-..." }\n' +
'\n' +
'// FILTRADO\n' +
'const CAMPOS_PUBLICOS = ["id", "concepto", "notas", "importe", "estado"];\n' +
'return { status: 200, body: soloCampos(actualizada, CAMPOS_PUBLICOS) };'
        },
        {
          titulo: 'Registrar los intentos: seguridad que se puede detectar',
          texto:
            'Un control que bloquea un ataque en silencio te protege de ese intento. Uno que además lo ' +
            'registra te permite **detectar la campaña**.\n' +
            'Los dos avisos de esta solución responden a preguntas distintas:\n' +
            '`factura.acceso_ajeno` — alguien está tocando recursos que no son suyos. Cincuenta de estos en ' +
            'un minuto es un recorrido sistemático de identificadores.\n' +
            '`factura.campos_ignorados` — alguien manda campos que no puede editar. Una vez es una ' +
            'integración mal hecha; quinientas es alguien probando qué cuela.\n' +
            'Registra identificadores y nombres de campo, nunca el cuerpo completo: en un endpoint de ' +
            'facturación eso metería datos personales y financieros en el sistema de logs.',
          codigo:
'deps.log.warn("factura.acceso_ajeno", {\n' +
'  usuarioId: usuario.id, facturaId: factura.id\n' +
'});\n' +
'\n' +
'deps.log.warn("factura.campos_ignorados", {\n' +
'  usuarioId: usuario.id, facturaId: factura.id, campos: ignorados\n' +
'});\n' +
'\n' +
'// Nombres de evento estables -> se puede alertar sobre ellos\n' +
'// Solo identificadores -> nada de datos personales en los logs'
        }
      ],

      referencia: [
        { nombre: 'Object.prototype.hasOwnProperty.call(o, k)', texto: 'Comprueba si la clave existe en el objeto, sin importar su valor. Forma segura frente a objetos no confiables.' },
        { nombre: 'Object.keys(objeto)', texto: 'Array con las claves propias. Sirve para saber qué mandó el cliente y qué se ha ignorado.' },
        { nombre: 'array.concat(otro)', texto: 'Une dos arrays en uno nuevo, sin modificar los originales. Para componer la lista de campos por rol.' },
        { nombre: 'array.indexOf(x) === -1', texto: 'Comprueba que un valor no está en la lista.' },
        { nombre: 'array.filter(fn)', texto: 'Aquí, calcular qué claves del cuerpo no estaban permitidas.' },
        { nombre: 'HTTP 401', texto: 'Unauthorized: no estás autenticado. Falta o no vale la credencial.' },
        { nombre: 'HTTP 403', texto: 'Forbidden: estás autenticado pero no puedes. Confirma que el recurso existe.' },
        { nombre: 'HTTP 404', texto: 'Not Found. La respuesta preferible ante un recurso ajeno, porque no revela su existencia.' },
        { nombre: 'HTTP 409', texto: 'Conflict: la petición choca con el estado actual del recurso. Aquí, la factura ya pagada.' },
        { nombre: 'HTTP 422', texto: 'Unprocessable Entity: se entiende la petición pero los datos no sirven. Aquí, ningún campo editable.' },
        { nombre: 'OWASP A01:2021', texto: 'Broken Access Control. El riesgo número uno de la lista, e incluye IDOR y asignación masiva.' }
      ],

      ejemplo: {
        titulo: 'Los mismos fallos en otro endpoint: editar el perfil de usuario',
        codigo:
'/* PATCH /perfil/:id\n' +
' *   Un usuario del perfil de una organización.\n' +
' *   Campos en base de datos:\n' +
' *     { id, orgId, nombre, bio, email, rol, plan, verificado, saldoCreditos }\n' +
' *\n' +
' *   REGLAS\n' +
' *     - El propietario edita `nombre` y `bio`.\n' +
' *     - El admin de la organización edita además `rol`.\n' +
' *     - Nadie toca `plan`, `verificado` ni `saldoCreditos` por aquí.\n' +
' *     - El email tiene su propio flujo con confirmación.\n' +
' */\n' +
'\n' +
'// ---------- ANTES: vulnerable ----------\n' +
'async function editarPerfilMal(deps, req) {\n' +
'  const perfil = await deps.repo.perfilPorId(req.params.id);\n' +
'  if (!perfil) return { status: 404, body: { error: "NO_ENCONTRADO" } };\n' +
'  const actualizado = await deps.repo.actualizar(perfil.id, req.body);\n' +
'  return { status: 200, body: actualizado };\n' +
'}\n' +
'//   PATCH /perfil/otro-usuario  { "rol": "admin", "saldoCreditos": 99999 }\n' +
'//   -> IDOR + asignación masiva + escalada de privilegios\n' +
'\n' +
'\n' +
'// ---------- DESPUÉS: corregido ----------\n' +
'const EDITABLES_PROPIETARIO = ["nombre", "bio"];\n' +
'const EDITABLES_ADMIN = ["rol"];\n' +
'const CAMPOS_PUBLICOS = ["id", "nombre", "bio", "rol"];\n' +
'\n' +
'function soloCampos(origen, permitidos) {\n' +
'  const salida = {};\n' +
'  for (const campo of permitidos) {\n' +
'    if (Object.prototype.hasOwnProperty.call(origen, campo)) {\n' +
'      salida[campo] = origen[campo];\n' +
'    }\n' +
'  }\n' +
'  return salida;\n' +
'}\n' +
'\n' +
'async function editarPerfil(deps, req) {\n' +
'  const usuario = req.usuario;\n' +
'  const body = req.body || {};\n' +
'\n' +
'  // 1. ¿EXISTE?\n' +
'  const perfil = await deps.repo.perfilPorId(req.params.id);\n' +
'  if (!perfil) return { status: 404, body: { error: "NO_ENCONTRADO" } };\n' +
'\n' +
'  // 2. ¿PUEDE ACCEDER?  (propiedad o admin de LA MISMA organización)\n' +
'  const esPropietario = perfil.id === usuario.id;\n' +
'  const esAdminDeSuOrg = usuario.rol === "admin" && usuario.orgId === perfil.orgId;\n' +
'\n' +
'  if (!esPropietario && !esAdminDeSuOrg) {\n' +
'    deps.log.warn("perfil.acceso_ajeno", {\n' +
'      usuarioId: usuario.id, perfilId: perfil.id\n' +
'    });\n' +
'    return { status: 404, body: { error: "NO_ENCONTRADO" } };\n' +
'  }\n' +
'\n' +
'  // 3. REGLAS DE NEGOCIO (después del acceso, nunca antes)\n' +
'  if (perfil.bloqueado) {\n' +
'    return { status: 409, body: { error: "PERFIL_BLOQUEADO" } };\n' +
'  }\n' +
'\n' +
'  // 4. LISTA BLANCA según el rol de la SESIÓN\n' +
'  const permitidos = esAdminDeSuOrg\n' +
'    ? EDITABLES_PROPIETARIO.concat(EDITABLES_ADMIN)\n' +
'    : EDITABLES_PROPIETARIO;\n' +
'\n' +
'  const cambios = soloCampos(body, permitidos);\n' +
'\n' +
'  const ignorados = Object.keys(body).filter(k => permitidos.indexOf(k) === -1);\n' +
'  if (ignorados.length) {\n' +
'    deps.log.warn("perfil.campos_ignorados", {\n' +
'      usuarioId: usuario.id, perfilId: perfil.id, campos: ignorados\n' +
'    });\n' +
'  }\n' +
'\n' +
'  if (Object.keys(cambios).length === 0) {\n' +
'    return { status: 422, body: { error: "SIN_CAMPOS_EDITABLES" } };\n' +
'  }\n' +
'\n' +
'  // 5. ESCRITURA\n' +
'  const actualizado = await deps.repo.actualizar(perfil.id, cambios);\n' +
'\n' +
'  // 6. RESPUESTA FILTRADA\n' +
'  return { status: 200, body: soloCampos(actualizado, CAMPOS_PUBLICOS) };\n' +
'}',
        texto:
          'Los seis pasos numerados marcan la posición exacta de cada bloque, y es el mismo esqueleto que ' +
          'necesitas: existe → puede acceder → reglas de negocio → lista blanca → escritura → respuesta ' +
          'filtrada.\n' +
          'Hay una diferencia deliberada respecto a tu ejercicio, y merece atención: aquí ser admin **no ' +
          'basta**, tiene que ser admin *de la misma organización*. Un admin de otra empresa no puede tocar ' +
          'estos perfiles. Es un recordatorio de que "es admin" casi nunca es una comprobación completa: ' +
          'suele faltar el ámbito.\n' +
          'Fíjate también en `rol`, que está en la lista blanca del admin pero **no** en la del propietario. ' +
          'Si estuviera en las dos, cualquiera podría ascenderse a sí mismo: escalada de privilegios en una ' +
          'línea.\n' +
          'Y en que `plan`, `verificado` y `saldoCreditos` no aparecen en ninguna lista, igual que `estado` ' +
          'y `usuarioId` en tu ejercicio. Esa es la propiedad que hace segura la lista blanca: **lo que no ' +
          'declaras, no se puede tocar**, hoy ni cuando añadan columnas nuevas.'
      },

      glosario: [
        { termino: 'Autenticación', definicion: 'Verificar quién es alguien. La resuelve la sesión o el token.' },
        { termino: 'Autorización', definicion: 'Verificar si puede hacer una acción concreta sobre un recurso concreto. La resuelve cada endpoint.' },
        { termino: 'IDOR', definicion: 'Acceso a un recurso ajeno cambiando su identificador en la petición, por no comprobar la propiedad.' },
        { termino: 'Asignación masiva', definicion: 'Aplicar sobre un registro todos los campos que llegan en la petición, permitiendo modificar los que no debería.' },
        { termino: 'Lista blanca', definicion: 'Aceptar solo lo explícitamente permitido. Más segura que una lista negra porque no depende de prever cada caso.' },
        { termino: 'Escalada de privilegios', definicion: 'Conseguir permisos superiores a los propios. Aquí sería asignarse el rol de administrador.' },
        { termino: 'Enumeración', definicion: 'Descubrir qué recursos existen aprovechando que las respuestas distinguen entre "no existe" y "no es tuyo".' },
        { termino: 'Mínimo privilegio', definicion: 'Dar exactamente los permisos necesarios y ninguno más. Aquí, el admin solo suma `importe`.' },
        { termino: 'Exposición excesiva de datos', definicion: 'Devolver más campos de los que el cliente necesita. Riesgo propio del OWASP para APIs.' },
        { termino: 'OWASP Top 10', definicion: 'Lista de referencia de los diez riesgos de seguridad web más críticos. El control de acceso roto ocupa el primer puesto.' },
        { termino: 'Entrada no confiable', definicion: 'Todo lo que venga del cliente: cuerpo, parámetros de URL, cabeceras y cookies. La sesión validada en servidor sí es de fiar.' }
      ],

      preparado: [
        '¿Cuál es la diferencia entre autenticación y autorización, y cuál falta en el código de partida?',
        '¿Por qué devolver 404 en lugar de 403 ante un recurso ajeno?',
        '¿Por qué una lista negra de campos prohibidos es una defensa frágil?',
        '¿De dónde hay que leer el rol del usuario y qué pasa si lo lees del cuerpo?',
        '¿Por qué la comprobación de "factura pagada" va después de la de propiedad y no antes?',
        '¿Qué diferencia hay entre `if (origen[campo])` y `hasOwnProperty`, y qué caso rompe la primera?',
        '¿Por qué hay que filtrar también la respuesta y no solo la escritura?',
        '¿Qué te permite detectar el registro de intentos que no permite el simple bloqueo?'
      ]
    },

    rationale:
      'Los cuatro fallos se cierran con dos ideas y un orden. Las ideas son **comprobar la propiedad del ' +
      'recurso concreto** y **listas blancas en las dos direcciones**, entrada y salida. El orden ' +
      '—existe, puede acceder, reglas de negocio, validación, escritura— no es estético: cualquier ' +
      'comprobación de negocio colocada antes de la de acceso convierte su respuesta en una filtración. ' +
      'La lista blanca se elige frente a la negra porque no depende de que alguien recuerde actualizarla ' +
      'cuando se añade una columna a la tabla.',

    alternatives: [
      { name: 'Filtrar por propiedad en la consulta (`WHERE id = ? AND usuario_id = ?`)', when: 'Siempre que se pueda.', tradeoff: 'Es más robusto que comprobar después, porque hace imposible olvidar la comprobación en el siguiente endpoint. A cambio no puedes distinguir "no existe" de "es de otro" para el registro de intentos.' },
      { name: 'Validación por esquema (Zod, Joi) con modo estricto', when: 'Hay muchos endpoints.', tradeoff: 'El esquema declara los campos permitidos y rechaza los desconocidos, dando lista blanca y validación de tipos a la vez. Añade una dependencia y hay que configurarlo para que rechace en vez de ignorar.' },
      { name: 'Motor de políticas (CASL, Casbin, OPA)', when: 'Las reglas de permisos son complejas o cambian a menudo.', tradeoff: 'Centraliza la autorización y permite auditarla en un sitio; añade una capa que hay que aprender y puede resultar excesiva para tres reglas.' },
      { name: 'DTO de respuesta por caso de uso', when: 'API con muchos consumidores distintos.', tradeoff: 'Cada endpoint declara exactamente qué devuelve, lo que evita fugas al añadir columnas. Más código repetitivo.' },
      { name: 'Seguridad a nivel de fila en la base de datos', when: 'PostgreSQL con políticas RLS.', tradeoff: 'La base de datos garantiza el aislamiento aunque la aplicación tenga un fallo: es la defensa más profunda. A cambio, la lógica de permisos se reparte entre dos sitios.' }
    ],

    commonErrors: [
      { error: 'Dar por hecho que estar autenticado basta.', why: 'La sesión dice quién eres, no qué te pertenece. Es el origen exacto del IDOR.', fix: 'Comprobar la propiedad del recurso concreto en cada endpoint.' },
      { error: 'Responder 403 ante un recurso ajeno.', why: 'Confirma que ese identificador existe y permite enumerar la base de datos.', fix: '404, salvo que el usuario tenga motivos legítimos para saber que existe.' },
      { error: 'Aplicar `req.body` completo.', why: 'El cliente controla el cuerpo por completo y puede incluir cualquier columna de la tabla.', fix: 'Lista blanca de campos editables.' },
      { error: 'Usar una lista negra de campos prohibidos.', why: 'Se queda corta en cuanto alguien añade una columna, y el agujero aparece sin que nadie toque este archivo.', fix: 'Lista blanca: lo que no está declarado, no entra.' },
      { error: 'Leer el rol del cuerpo de la petición.', why: 'Permite que cualquiera se declare administrador. Es escalada de privilegios directa.', fix: 'El rol se lee siempre de la sesión validada en el servidor.' },
      { error: 'Comprobar reglas de negocio antes que el acceso.', why: 'Sus respuestas revelan información sobre un recurso que quien pregunta no debería saber que existe.', fix: 'Orden fijo: existe, puede acceder, reglas de negocio, validación, escritura.' },
      { error: 'Devolver el registro entero de la base de datos.', why: 'Expone costes, márgenes y datos internos, y vuelve a exponer cada columna nueva que se añada.', fix: 'Lista blanca también en la respuesta.' },
      { error: 'Usar `if (body[campo])` al copiar campos.', why: 'Descarta valores válidos pero falsy: no se puede borrar una nota ni poner un importe a cero.', fix: '`hasOwnProperty` para comprobar presencia, no valor.' },
      { error: 'Bloquear sin registrar.', why: 'Te protege del intento pero te impide detectar la campaña. Un recorrido sistemático de identificadores pasa desapercibido.', fix: 'Registrar accesos ajenos y campos ignorados, con identificadores y sin datos personales.' }
    ],

    bestPractices: [
      'Autorización en cada endpoint, sobre el recurso concreto, no solo en el middleware.',
      'Listas blancas en las dos direcciones: lo que entra y lo que sale.',
      'Orden fijo: existe, puede acceder, reglas de negocio, validación, escritura.',
      'El rol y la identidad se leen siempre de la sesión, nunca de datos controlados por el cliente.',
      'Mínimo privilegio: cada rol añade exactamente lo que necesita.',
      'Registra los intentos con identificadores, nunca con el cuerpo completo.',
      'Cuando sea posible, incluye la propiedad en la propia consulta: así no se puede olvidar.'
    ],

    security: [
      'Control de acceso roto (OWASP A01): incluye tanto el IDOR como la asignación masiva de este ejercicio.',
      'Escalada de privilegios: leer el rol de una fuente controlada por el cliente es la vía más directa.',
      'Enumeración de recursos mediante la diferencia entre 403 y 404.',
      'Exposición excesiva de datos en la respuesta: costes y márgenes son información comercial sensible.',
      'Datos personales en logs: registrar identificadores y nombres de campo, nunca el cuerpo de la petición.',
      'Rate limiting sobre este endpoint: sin él, un atacante puede recorrer identificadores a gran velocidad aunque cada intento falle.'
    ],

    performance: [
      'Incluir la propiedad en el `WHERE` evita traer un registro que después vas a descartar.',
      'La respuesta 422 cuando no hay campos editables evita una escritura innecesaria en base de datos.',
      'El filtrado de campos es una operación en memoria sobre unas pocas claves: su coste es irrelevante frente a la consulta.'
    ],

    companyLooksFor: [
      'Que compruebes la propiedad sin que nadie te lo señale.',
      'Que sepas argumentar la elección entre 404 y 403.',
      'Que uses lista blanca y sepas explicar por qué la negra no sirve.',
      'Que detectes que el rol no puede leerse del cuerpo.',
      'Que razones el orden de las comprobaciones como parte de la seguridad.',
      'Que filtres también la respuesta: es lo que más se olvida.',
      'Que añadas trazabilidad de los intentos.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Comprobación de propiedad y respuesta que no filtra existencia', weight: 30 },
        { criteria: 'Lista blanca de campos editables por rol', weight: 30 },
        { criteria: 'Orden correcto de las comprobaciones y regla de la factura pagada', weight: 15 },
        { criteria: 'Respuesta filtrada sin campos internos', weight: 15 },
        { criteria: 'Registro de intentos y campos ignorados', weight: 10 }
      ]
    },

    reinforce: [
      'OWASP Top 10, A01:2021 Broken Access Control.',
      'OWASP API Security Top 10: BOLA (autorización a nivel de objeto) y exposición excesiva de datos.',
      'Validación por esquema con Zod o Joi en modo estricto.',
      'Row Level Security en PostgreSQL como defensa en profundidad.',
      'Prueba antes: `be-refactor-produccion`. Prueba después: `emp-code-review`, donde estos mismos fallos aparecen en un PR.'
    ]
  });

})(window.TT);

/* ============================================================
   Pruebas — Backend y APIs
   ============================================================ */
(function (TT) {
  'use strict';

  /* ------------------------------------------------------------------
     1. De código que funciona a código de producción
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'be-refactor-produccion',
    empresa: {
      empresas: ['cabify', 'gitlab', 'automattic'],
      evidencia: 'inspirada',
      puesto: 'Backend Engineer',
      rol: 'backend',
      formato: 'refactor',
      dificultad: 3,
      evalua: [
        'Separar capas sin cambiar el comportamiento observable.',
        'Justificar cada movimiento: un refactor que no sabes defender no vale.',
        'Reconocer qué NO hay que tocar todavía.'
      ],
      nota: 'Las tres evalúan sobre código que ya existe: Cabify revisa tu entrega contigo delante, GitLab trabaja sobre repositorios grandes y Automattic publica que su prueba consiste en modificar código existente con un compañero asignado. El código a refactorizar es nuestro.',
      fuentes: [
        { titulo: 'Pruebas técnicas en procesos de selección en España', url: 'https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion' },
        { titulo: 'Technical Interviews — The GitLab Handbook', url: 'https://handbook.gitlab.com/handbook/hiring/interviewing/technical/' },
        { titulo: 'How We Hire Developers — Automattic', url: 'https://automattic.com/work-with-us/how-we-hire-developers/' }
      ]
    },
    categorias: ['backend', 'testing'],
    title: 'De "funciona en mi máquina" a código de producción',
    category: 'refactor',
    kind: 'refactor',
    level: 'mid',
    time: 55,
    tags: ['node', 'errores', 'validación', 'capas'],

    context:
      'Heredas el endpoint de alta de usuarios de una startup que creció rápido. Funciona: el registro da de alta ' +
      'gente todos los días. Pero el equipo de guardia recibe alertas que no sabe interpretar y hay un incidente ' +
      'abierto porque una contraseña apareció en los logs.',

    situation:
      'El código mezcla en una sola función la validación, el acceso a datos, el envío de correo y el formato de la ' +
      'respuesta HTTP. Los errores se tragan con `catch` vacíos o se devuelven como texto, y el `catch` general ' +
      'responde 200 con `{ ok: false }`.',

    goal:
      'Reescribir `registrarUsuario` separando responsabilidades, distinguiendo errores operativos de errores de ' +
      'programación y sin filtrar datos sensibles, manteniendo exactamente el mismo comportamiento funcional.',

    tech: ['Node.js', 'JavaScript'],
    skills: ['gestión de errores', 'validación', 'separación por capas', 'logging seguro'],

    starter: {
      lang: 'javascript',
      code:
'// Código heredado. Lo que ves es literal: así está en producción.\n' +
'//\n' +
'// async function registrarUsuario(req, res) {\n' +
'//   try {\n' +
'//     const u = req.body;\n' +
'//     if (!u.email) return res.send("falta email");\n' +
'//     const existe = await db.query("SELECT * FROM users WHERE email = \'" + u.email + "\'");\n' +
'//     if (existe.length) return res.send("ya existe");\n' +
'//     await db.query("INSERT INTO users (email, pass) VALUES (?,?)", [u.email, u.password]);\n' +
'//     console.log("nuevo usuario", JSON.stringify(u));\n' +
'//     try { await mail.enviar(u.email); } catch (e) {}\n' +
'//     res.json({ ok: true });\n' +
'//   } catch (e) {\n' +
'//     console.log("error");\n' +
'//     res.json({ ok: false });\n' +
'//   }\n' +
'// }\n' +
'\n' +
'// Implementa la versión de producción. Firma acordada con el equipo:\n' +
'// deps = { repo: { buscarPorEmail, crear }, hash, mail, log }\n' +
'// Devuelve { status, body } en lugar de tocar `res`: así es testeable.\n' +
'\n' +
'class ErrorApp extends Error {}\n' +
'\n' +
'async function registrarUsuario(deps, datos) {\n' +
'  // tu implementación\n' +
'}\n'
    },

    requirements: [
      'Validar email y contraseña antes de tocar la base de datos, devolviendo 422 con la lista de campos inválidos.',
      'Devolver 409 si el email ya existe, no 200 ni 500.',
      'Nunca guardar ni registrar la contraseña en claro: se almacena el hash y jamás aparece en los logs.',
      'Distinguir error operativo (esperable: email duplicado, validación) de error de programación (inesperado): el primero se convierte en respuesta, el segundo se propaga tras registrarlo.',
      'Un fallo al enviar el correo de bienvenida no debe impedir el alta, pero sí debe quedar registrado.',
      'La respuesta de éxito es 201 y no incluye la contraseña ni el hash.'
    ],

    optional: [
      'Añadir un identificador de correlación a los logs para poder seguir una petición completa.',
      'Devolver un `Location` con la URL del recurso creado.',
      'Hacer idempotente el alta mediante una cabecera `Idempotency-Key`.'
    ],

    hints: [
      'Empieza por separar tres bloques: validar → decidir → responder. La función no debe saber nada de Express.',
      'Crea una clase `ErrorApp` con `status` y `codigo`. Todo lo que herede de ella es esperable; lo demás es un fallo real que debe llegar al manejador central.',
      'El `catch` vacío del correo es correcto en intención (no debe tumbar el alta) pero incorrecto en ejecución: hay que registrar el fallo, no ocultarlo.',
      'Para no filtrar datos, nunca registres el objeto completo de entrada. Registra campos elegidos uno a uno.'
    ],

    docs: {
      resumen:
        'Tres ideas sostienen esta refactorización: **clasificar los errores** en esperables e inesperados, ' +
        '**inyectar las dependencias** para que la lógica no dependa del framework ni de la base de datos, y ' +
        'tratar **los logs como una salida más** del sistema, con sus propias reglas de seguridad.',

      conceptos: [
        {
          titulo: 'Error operativo frente a error de programación',
          texto:
            'Esta distinción es el eje de todo el ejercicio.\n' +
            'Un **error operativo** es algo que sabes que va a pasar y para lo que tienes una respuesta: un ' +
            'email duplicado, un campo mal rellenado, un recurso que no existe. No es un incidente: es parte ' +
            'del funcionamiento normal. Se convierte en una respuesta HTTP y no despierta a nadie.\n' +
            'Un **error de programación** es un fallo que no habías previsto: una conexión perdida, un `null` ' +
            'donde esperabas un objeto, un bug. Ese debe registrarse, propagarse y acabar en un 500 con alerta.\n' +
            'Si los tratas igual, ocurre lo del código heredado: todo cae en el mismo `catch` y se responde ' +
            'siempre lo mismo, así que ni el cliente ni la monitorización pueden distinguir nada.',
          codigo:
'class ErrorApp extends Error {\n' +
'  constructor(codigo, status, detalles) {\n' +
'    super(codigo);            // conserva la traza de pila\n' +
'    this.name = "ErrorApp";\n' +
'    this.codigo = codigo;     // estable: los clientes programan contra esto\n' +
'    this.status = status;     // qué HTTP le corresponde\n' +
'    this.detalles = detalles || null;\n' +
'    this.esOperativo = true;  // la marca que lo distingue\n' +
'  }\n' +
'}\n' +
'\n' +
'// Y en el catch final:\n' +
'catch (err) {\n' +
'  if (err && err.esOperativo) {\n' +
'    return { status: err.status, body: { error: err.codigo } };   // respuesta\n' +
'  }\n' +
'  log.error("fallo_inesperado", { motivo: err.message });\n' +
'  throw err;                                                      // incidente\n' +
'}'
        },
        {
          titulo: 'Inyección de dependencias: la lógica no importa nada',
          texto:
            'En lugar de que la función haga `import db from "./db"`, recibe todo lo que necesita como ' +
            'parámetro (`deps`). El punto de entrada HTTP construye ese objeto una vez y se lo pasa.\n' +
            'Qué ganas: puedes testear sin base de datos ni servidor, cambiar el repositorio sin tocar la ' +
            'lógica, y la función sirve igual desde una API, una cola o un comando de consola.\n' +
            'En los tests verás `fakeDeps()`: un objeto con las mismas funciones pero guardando en memoria. ' +
            'Eso solo es posible porque la función no sabe de dónde vienen.',
          codigo:
'// Acoplado: imposible de testear sin base de datos real\n' +
'const db = require("./db");\n' +
'async function registrar(datos) {\n' +
'  await db.query("INSERT ...");\n' +
'}\n' +
'\n' +
'// Desacoplado: recibe lo que necesita\n' +
'async function registrar(deps, datos) {\n' +
'  await deps.repo.crear(datos);\n' +
'}\n' +
'\n' +
'// En producción\n' +
'registrar({ repo: repoReal, hash, mail, log }, req.body);\n' +
'// En tests\n' +
'registrar({ repo: repoEnMemoria, hash: async p => "hash:" + p, ... }, datos);'
        },
        {
          titulo: 'Devolver { status, body } en vez de tocar `res`',
          texto:
            'Si la función llama a `res.json(...)`, queda atada a Express para siempre y solo se puede probar ' +
            'levantando un servidor. Si en cambio **devuelve** un objeto con el código y el cuerpo, es una ' +
            'función normal: se llama, se mira lo que devuelve y se comprueba.\n' +
            'Un adaptador de tres líneas traduce ese objeto a la respuesta real. Esa capa fina es la frontera ' +
            'entre tu dominio y el framework.',
          codigo:
'// La lógica devuelve datos, no efectos\n' +
'async function registrarUsuario(deps, datos) {\n' +
'  return { status: 201, body: { id: 7, email: "a@b.com" } };\n' +
'}\n' +
'\n' +
'// El adaptador HTTP es lo único que conoce Express\n' +
'router.post("/usuarios", async (req, res, next) => {\n' +
'  try {\n' +
'    const r = await registrarUsuario(deps, req.body);\n' +
'    res.status(r.status).json(r.body);\n' +
'  } catch (err) {\n' +
'    next(err);        // al manejador central: 500 + alerta\n' +
'  }\n' +
'});'
        },
        {
          titulo: 'Códigos HTTP: 422, 409, 201 y por qué importan',
          texto:
            'El código de estado es parte del contrato, no decoración. Con un 200 los clientes no reintentan, ' +
            'los proxies pueden cachear y los cuadros de mando no ven nada durante una caída.\n' +
            '**201 Created** — se creó el recurso. La respuesta de alta correcta.\n' +
            '**409 Conflict** — el recurso choca con el estado actual. El email ya registrado.\n' +
            '**422 Unprocessable Entity** — la petición se entiende pero los datos no son válidos. Validación.\n' +
            '**400 Bad Request** — la petición está mal formada (JSON roto, falta el cuerpo).\n' +
            '**500** — fallo del servidor. Nunca se devuelve a propósito: se llega por un error no previsto.\n' +
            'Regla mental: **4xx es culpa de quien llama, 5xx es culpa tuya**.',
          codigo:
'// El antipatrón del código heredado\n' +
'res.json({ ok: false });          // status 200 con un fallo dentro\n' +
'\n' +
'// Lo correcto\n' +
'return { status: 422, body: { error: "VALIDACION",\n' +
'         detalles: [{ campo: "email", motivo: "formato no válido" }] } };\n' +
'return { status: 409, body: { error: "EMAIL_YA_REGISTRADO" } };\n' +
'return { status: 201, body: { id: usuario.id, email: usuario.email } };'
        },
        {
          titulo: 'Validar antes de tocar la base de datos, y acumular los errores',
          texto:
            'Validar primero evita una consulta por cada petición basura y evita ejecutar el hash de ' +
            'contraseña, que es intencionadamente costoso.\n' +
            'Además, acumula **todos** los fallos en un array antes de responder. Devolver el primero obliga ' +
            'al usuario a descubrir sus errores de uno en uno.\n' +
            'Normaliza mientras validas: `trim()` y minúsculas en el email evitan duplicados que solo difieren ' +
            'en mayúsculas.',
          codigo:
'const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;\n' +
'\n' +
'function validar(datos) {\n' +
'  const errores = [];\n' +
'  const email = String(datos && datos.email || "").trim().toLowerCase();\n' +
'  const password = String(datos && datos.password || "");\n' +
'\n' +
'  if (!EMAIL_RE.test(email)) errores.push({ campo: "email", motivo: "formato no válido" });\n' +
'  if (password.length < 10)  errores.push({ campo: "password", motivo: "mínimo 10 caracteres" });\n' +
'\n' +
'  if (errores.length) throw new ErrorApp("VALIDACION", 422, errores);\n' +
'  return { email, password };      // ya normalizado\n' +
'}'
        },
        {
          titulo: 'Contraseñas: hash, nunca texto; y jamás en los logs',
          texto:
            'Se guarda el **hash**, no la contraseña. Un hash es una transformación de un solo sentido: si ' +
            'mañana se filtra la base de datos, las contraseñas siguen protegidas. Para contraseñas se usa ' +
            'bcrypt o argon2, que son lentos a propósito; SHA-256 a secas es demasiado rápido y por tanto ' +
            'fácil de atacar por fuerza bruta.\n' +
            'El incidente del enunciado viene de `console.log(JSON.stringify(u))`: al volcar el objeto de ' +
            'entrada completo, la contraseña acabó en los logs, que suelen tener menos control de acceso que ' +
            'la base de datos y a menudo son un servicio externo.\n' +
            'La regla es sencilla: **nunca registres el objeto de entrada**. Elige los campos uno a uno.',
          codigo:
'// MAL: vuelca todo, incluida la contraseña\n' +
'log.info("nuevo usuario", JSON.stringify(datos));\n' +
'\n' +
'// BIEN: nombre de evento estable + solo los campos elegidos\n' +
'log.info("usuario.creado", { id: usuario.id });\n' +
'\n' +
'// Y se guarda el hash, nunca el original\n' +
'const passwordHash = await deps.hash(password);\n' +
'await deps.repo.crear({ email, passwordHash });   // sin `password`'
        },
        {
          titulo: 'Efectos secundarios no críticos: aislar sin ocultar',
          texto:
            'El correo de bienvenida no debe impedir el alta: cuando llegas ahí, el usuario ya está creado en ' +
            'base de datos. Fallar la respuesta porque el servidor de correo no contesta perdería al usuario ' +
            'por algo secundario.\n' +
            'Pero el `catch (e) {}` vacío del código heredado es peor: convierte una caída del correo en ' +
            'silencio absoluto. El sistema parece sano mientras deja de funcionar.\n' +
            'La forma correcta es capturar, **registrar como error** y continuar.',
          codigo:
'// MAL: el fallo desaparece\n' +
'try { await mail.enviar(email); } catch (e) {}\n' +
'\n' +
'// BIEN: no bloquea, pero deja rastro\n' +
'try {\n' +
'  await deps.mail.enviarBienvenida(email);\n' +
'} catch (err) {\n' +
'  deps.log.error("usuario.bienvenida_fallida", { id: usuario.id, motivo: err.message });\n' +
'}\n' +
'\n' +
'// Regla: un catch vacío necesita SIEMPRE un comentario que lo justifique.'
        },
        {
          titulo: 'Consultas parametrizadas: la inyección SQL en una línea',
          texto:
            'Concatenar un valor del usuario dentro de una consulta permite que ese valor **cambie la consulta**. ' +
            'Con un email como `a@a.com\' OR \'1\'=\'1`, el `WHERE` se vuelve siempre cierto y devuelve toda la tabla.\n' +
            'Con parámetros, el motor recibe la consulta y los valores por separado: el valor nunca se ' +
            'interpreta como código, hagas lo que hagas con él.\n' +
            'No hay excepciones a esta regla, ni siquiera "es un número" o "ya lo he validado".',
          codigo:
'// Vulnerable\n' +
'db.query("SELECT * FROM users WHERE email = \'" + email + "\'");\n' +
'\n' +
'// Seguro: el ? es un hueco para un VALOR, nunca para código\n' +
'db.query("SELECT * FROM users WHERE email = ?", [email]);'
        }
      ],

      referencia: [
        { nombre: 'class X extends Error', texto: 'Crea un tipo de error propio conservando la traza de pila. Añade tus campos después de llamar a `super()`.' },
        { nombre: 'err instanceof ErrorApp', texto: 'Alternativa a la marca `esOperativo` para distinguir familias de error.' },
        { nombre: 'throw', texto: 'Lanza un error. En una función `async` equivale a devolver una promesa rechazada.' },
        { nombre: 'async / await', texto: 'Espera a que una promesa se resuelva. Dentro de un `try`, sus rechazos se capturan en el `catch`.' },
        { nombre: 'Object.assign(destino, origen)', texto: 'Copia propiedades. Útil para combinar valores por defecto con los recibidos.' },
        { nombre: 'String(v).trim().toLowerCase()', texto: 'Normalización defensiva: funciona aunque `v` sea `null` o un número.' },
        { nombre: 'regex.test(cadena)', texto: 'Devuelve `true` o `false`. Es lo que necesitas para validar un formato.' },
        { nombre: 'bcrypt / argon2', texto: 'Algoritmos de hash pensados para contraseñas: lentos y con coste ajustable.' },
        { nombre: 'Índice UNIQUE', texto: 'Restricción de la base de datos que impide duplicados. Es la única garantía real frente a dos peticiones simultáneas.' }
      ],

      ejemplo: {
        titulo: 'Alta de una reserva: mismo esqueleto, otro dominio',
        codigo:
'class ErrorApp extends Error {\n' +
'  constructor(codigo, status, detalles) {\n' +
'    super(codigo);\n' +
'    this.name = "ErrorApp";\n' +
'    this.codigo = codigo;\n' +
'    this.status = status;\n' +
'    this.detalles = detalles || null;\n' +
'    this.esOperativo = true;\n' +
'  }\n' +
'}\n' +
'\n' +
'function validarReserva(datos) {\n' +
'  const errores = [];\n' +
'  const sala = String(datos && datos.sala || "").trim();\n' +
'  const personas = Number(datos && datos.personas);\n' +
'\n' +
'  if (!sala) errores.push({ campo: "sala", motivo: "obligatorio" });\n' +
'  if (!Number.isInteger(personas) || personas < 1) {\n' +
'    errores.push({ campo: "personas", motivo: "entero mayor que 0" });\n' +
'  }\n' +
'\n' +
'  if (errores.length) throw new ErrorApp("VALIDACION", 422, errores);\n' +
'  return { sala, personas };\n' +
'}\n' +
'\n' +
'async function crearReserva(deps, datos) {\n' +
'  try {\n' +
'    const { sala, personas } = validarReserva(datos);          // 1. validar\n' +
'\n' +
'    if (await deps.repo.estaOcupada(sala, datos.franja)) {     // 2. decidir\n' +
'      throw new ErrorApp("SALA_OCUPADA", 409);\n' +
'    }\n' +
'\n' +
'    const reserva = await deps.repo.crear({ sala, personas, franja: datos.franja });\n' +
'    deps.log.info("reserva.creada", { id: reserva.id });       // solo el id\n' +
'\n' +
'    try {                                                      // 3. efecto no crítico\n' +
'      await deps.calendario.sincronizar(reserva.id);\n' +
'    } catch (err) {\n' +
'      deps.log.error("reserva.sincronizacion_fallida",\n' +
'                     { id: reserva.id, motivo: err.message });\n' +
'    }\n' +
'\n' +
'    return { status: 201, body: { id: reserva.id, sala: reserva.sala } };\n' +
'\n' +
'  } catch (err) {\n' +
'    if (err && err.esOperativo) {\n' +
'      return { status: err.status, body: { error: err.codigo, detalles: err.detalles } };\n' +
'    }\n' +
'    deps.log.error("reserva.fallo_inesperado", { motivo: err.message });\n' +
'    throw err;\n' +
'  }\n' +
'}',
        texto:
          'El esqueleto es exactamente el que necesitas: **validar → decidir → escribir → efecto no crítico → ' +
          'responder**, todo envuelto en un `try` cuyo `catch` separa lo operativo de lo inesperado.\n' +
          'Fíjate en cinco detalles que se puntúan: la validación acumula errores; el conflicto es 409 y no ' +
          '500; el log lleva solo el identificador; el efecto secundario tiene su propio `try` con registro; ' +
          'y lo inesperado se **relanza** en vez de convertirse en una respuesta falsamente correcta.\n' +
          'Cambia reserva por usuario y sala ocupada por email duplicado, y tienes la estructura de la prueba.'
      },

      glosario: [
        { termino: 'Error operativo', definicion: 'Fallo esperable y previsto que se traduce en una respuesta al cliente. No es un incidente.' },
        { termino: 'Error de programación', definicion: 'Fallo no previsto (bug o caída de infraestructura). Debe registrarse, propagarse y alertar.' },
        { termino: 'Inyección de dependencias', definicion: 'Pasar a una función lo que necesita en vez de que ella lo importe. Permite testear y sustituir piezas.' },
        { termino: 'Repositorio', definicion: 'Capa que encapsula el acceso a datos. La lógica de negocio habla con ella y no con el driver de la base de datos.' },
        { termino: 'Hash', definicion: 'Transformación de un solo sentido. Se puede comprobar si una contraseña coincide, pero no recuperarla.' },
        { termino: 'Consulta parametrizada', definicion: 'Consulta con huecos (`?`) donde el motor inserta valores sin interpretarlos como código. La defensa contra la inyección SQL.' },
        { termino: 'Inyección SQL', definicion: 'Ataque que aprovecha la concatenación de valores para alterar la consulta y leer o modificar datos ajenos.' },
        { termino: 'Log estructurado', definicion: 'Registro con nombre de evento estable y campos, en vez de una frase. Se puede buscar, agrupar y alertar sobre él.' },
        { termino: 'Idempotencia', definicion: 'Propiedad de una operación que, repetida con los mismos datos, produce el mismo resultado sin duplicar efectos.' },
        { termino: 'Condición de carrera', definicion: 'Aquí: entre el `SELECT` que comprueba y el `INSERT` que crea cabe otra petición, y se crean dos registros.' }
      ],

      preparado: [
        '¿Sabrías explicar la diferencia entre un error operativo y uno de programación con un ejemplo de cada uno?',
        '¿Qué código HTTP corresponde a un email ya registrado, y cuál a un email mal formado?',
        '¿Por qué devolver `{ status, body }` en lugar de llamar a `res.json()` hace la función testeable?',
        '¿Qué tiene de malo `catch (e) {}` aunque la intención de no bloquear el alta sea correcta?',
        '¿Por qué nunca se debe registrar el cuerpo completo de la petición?',
        '¿Por qué comprobar el email con un `SELECT` previo no basta para evitar duplicados?'
      ]
    },

    tests: {
      mode: 'js',
      timeout: 5000,
      setup:
'function fakeDeps(overrides) {\n' +
'  var logs = [];\n' +
'  var creados = [];\n' +
'  var base = {\n' +
'    logs: logs, creados: creados,\n' +
'    repo: {\n' +
'      buscarPorEmail: async function (email) { return creados.find(function(u){ return u.email === email; }) || null; },\n' +
'      crear: async function (u) { var nuevo = Object.assign({ id: creados.length + 1 }, u); creados.push(nuevo); return nuevo; }\n' +
'    },\n' +
'    hash: async function (p) { return "hash:" + p; },\n' +
'    mail: { enviarBienvenida: async function () { return true; } },\n' +
'    log: { info: function (m, d) { logs.push({ nivel: "info", m: m, d: d }); },\n' +
'           error: function (m, d) { logs.push({ nivel: "error", m: m, d: d }); } }\n' +
'  };\n' +
'  return Object.assign(base, overrides || {});\n' +
'}\n' +
'function textoDeLogs(deps) { return JSON.stringify(deps.logs); }',
      cases: [
        {
          name: 'Alta correcta devuelve 201 sin datos sensibles',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  const r = await registrarUsuario(d, { email: "ana@ejemplo.com", password: "SuperSecreta9!" });\n' +
'  expect(r.status).toBe(201);\n' +
'  expect(JSON.stringify(r.body).indexOf("SuperSecreta9!")).toBe(-1);\n' +
'  expect(JSON.stringify(r.body).indexOf("hash:")).toBe(-1);\n' +
'})()'
        },
        {
          name: 'La contraseña se guarda hasheada, nunca en claro',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  await registrarUsuario(d, { email: "b@ejemplo.com", password: "Clave123456!" });\n' +
'  expect(d.creados).toHaveLength(1);\n' +
'  expect(d.creados[0].password).toBe(undefined);\n' +
'  expect(String(d.creados[0].passwordHash || "").indexOf("hash:")).toBe(0);\n' +
'})()'
        },
        {
          name: 'La contraseña no aparece en ningún log',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  await registrarUsuario(d, { email: "c@ejemplo.com", password: "NoDebeSalir42!" });\n' +
'  expect(textoDeLogs(d).indexOf("NoDebeSalir42!")).toBe(-1);\n' +
'})()'
        },
        {
          name: 'Email inválido devuelve 422 y no toca la base de datos',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  const r = await registrarUsuario(d, { email: "no-es-un-email", password: "Clave123456!" });\n' +
'  expect(r.status).toBe(422);\n' +
'  expect(d.creados).toHaveLength(0);\n' +
'})()'
        },
        {
          name: 'Contraseña demasiado corta devuelve 422',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  const r = await registrarUsuario(d, { email: "d@ejemplo.com", password: "123" });\n' +
'  expect(r.status).toBe(422);\n' +
'})()'
        },
        {
          name: 'Email duplicado devuelve 409',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  await registrarUsuario(d, { email: "e@ejemplo.com", password: "Clave123456!" });\n' +
'  const r = await registrarUsuario(d, { email: "e@ejemplo.com", password: "Otra123456!" });\n' +
'  expect(r.status).toBe(409);\n' +
'  expect(d.creados).toHaveLength(1);\n' +
'})()'
        },
        {
          name: 'Un fallo del correo no impide el alta pero se registra',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  d.mail = { enviarBienvenida: async function () { throw new Error("SMTP caído"); } };\n' +
'  const r = await registrarUsuario(d, { email: "f@ejemplo.com", password: "Clave123456!" });\n' +
'  expect(r.status).toBe(201);\n' +
'  expect(d.creados).toHaveLength(1);\n' +
'  expect(d.logs.some(l => l.nivel === "error")).toBeTruthy();\n' +
'})()'
        },
        {
          name: 'Un fallo inesperado del repositorio se propaga, no se disfraza de 200',
          code:
'(async () => {\n' +
'  const d = fakeDeps();\n' +
'  d.repo.crear = async function () { throw new Error("conexión perdida"); };\n' +
'  let lanzo = false;\n' +
'  try { await registrarUsuario(d, { email: "g@ejemplo.com", password: "Clave123456!" }); }\n' +
'  catch (e) { lanzo = true; }\n' +
'  expect(lanzo).toBeTruthy();\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'/** Error esperable del dominio: se traduce a respuesta HTTP. */\n' +
'class ErrorApp extends Error {\n' +
'  constructor(codigo, status, detalles) {\n' +
'    super(codigo);\n' +
'    this.name = "ErrorApp";\n' +
'    this.codigo = codigo;\n' +
'    this.status = status;\n' +
'    this.detalles = detalles || null;\n' +
'    this.esOperativo = true;      // la marca que distingue las dos familias\n' +
'  }\n' +
'}\n' +
'\n' +
'const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;\n' +
'\n' +
'/** Validación pura: sin efectos, fácil de testear y de reutilizar. */\n' +
'function validar(datos) {\n' +
'  const errores = [];\n' +
'  const email = String(datos && datos.email || "").trim().toLowerCase();\n' +
'  const password = String(datos && datos.password || "");\n' +
'\n' +
'  if (!EMAIL_RE.test(email)) errores.push({ campo: "email", motivo: "formato no válido" });\n' +
'  if (password.length < 10) errores.push({ campo: "password", motivo: "mínimo 10 caracteres" });\n' +
'\n' +
'  if (errores.length) throw new ErrorApp("VALIDACION", 422, errores);\n' +
'  return { email, password };\n' +
'}\n' +
'\n' +
'async function registrarUsuario(deps, datos) {\n' +
'  try {\n' +
'    const { email, password } = validar(datos);\n' +
'\n' +
'    if (await deps.repo.buscarPorEmail(email)) {\n' +
'      throw new ErrorApp("EMAIL_YA_REGISTRADO", 409);\n' +
'    }\n' +
'\n' +
'    const passwordHash = await deps.hash(password);\n' +
'    const usuario = await deps.repo.crear({ email, passwordHash });\n' +
'\n' +
'    // Solo campos elegidos: nunca el objeto de entrada completo.\n' +
'    deps.log.info("usuario.creado", { id: usuario.id });\n' +
'\n' +
'    // Efecto secundario no crítico: aislado y registrado si falla.\n' +
'    try {\n' +
'      await deps.mail.enviarBienvenida(email);\n' +
'    } catch (err) {\n' +
'      deps.log.error("usuario.bienvenida_fallida", { id: usuario.id, motivo: err.message });\n' +
'    }\n' +
'\n' +
'    return { status: 201, body: { id: usuario.id, email: usuario.email } };\n' +
'\n' +
'  } catch (err) {\n' +
'    if (err && err.esOperativo) {\n' +
'      // Esperable: es una respuesta, no un incidente.\n' +
'      return { status: err.status, body: { error: err.codigo, detalles: err.detalles } };\n' +
'    }\n' +
'    // Inesperado: lo registramos y lo dejamos subir al manejador central,\n' +
'    // que responderá 500 y disparará la alerta de guardia.\n' +
'    deps.log.error("usuario.registro_fallido", { motivo: err.message });\n' +
'    throw err;\n' +
'  }\n' +
'}\n'
    },

    walkthrough: [
      { what: 'Creamos `ErrorApp` con `status`, `codigo` y la marca `esOperativo`.', why: 'Sin esa distinción, todos los errores acaban en el mismo `catch` y se responden igual. Un email duplicado no es un incidente; una conexión perdida sí.', how: 'Heredar de `Error` conserva la traza; los campos extra transportan la información que necesita la capa HTTP.' },
      { what: 'La validación es una función pura que lanza `ErrorApp` 422.', why: 'Validar antes de tocar la base de datos evita trabajo inútil y ataques de coste. Además, una función pura se testea sin infraestructura.', how: 'Normaliza (trim, minúsculas) y acumula todos los errores en un array: al usuario le sirve más recibir los tres fallos de golpe que uno por intento.' },
      { what: 'La firma recibe `deps` en lugar de importar la base de datos.', why: 'Inyección de dependencias: permite testear sin base de datos real y cambiar el repositorio sin tocar la lógica. Es la frontera entre la capa de dominio y la de acceso a datos.', how: 'El punto de entrada HTTP construye `deps` una vez y llama a esta función.' },
      { what: 'Devolvemos `{status, body}` en vez de usar `res`.', why: 'La función deja de depender de Express. Se puede reutilizar desde una cola, un comando de CLI o una función serverless, y se testea sin levantar servidor.', how: 'Un adaptador fino traduce el objeto a `res.status(...).json(...)`.' },
      { what: 'Guardamos `passwordHash` y jamás `password`.', why: 'Si mañana se filtra la base de datos, las contraseñas siguen protegidas. Es el requisito mínimo, no una mejora.', how: 'El hash lo produce `deps.hash` (bcrypt o argon2 en la implementación real, con coste configurable).' },
      { what: 'Los logs registran campos concretos, nunca el objeto de entrada.', why: 'El incidente abierto viene precisamente de `JSON.stringify(u)`: al volcar el objeto completo, la contraseña acabó en los logs y en el sistema de agregación de terceros.', how: '`deps.log.info("usuario.creado", { id })`: un nombre de evento estable y solo los campos que hacen falta.' },
      { what: 'El envío de correo se envuelve en su propio try/catch con log de error.', why: 'El alta ya está confirmada en base de datos; fallar la respuesta porque el SMTP no responde perdería al usuario. Pero un `catch {}` vacío hace invisible una caída de correo.', how: 'Capturar, registrar como error y continuar. Mejor todavía: encolar el envío y que lo reintente un worker.' },
      { what: 'El `catch` final relanza lo que no es operativo.', why: 'Responder 200 con `{ok:false}` ante un fallo de base de datos rompe a todos los clientes, impide los reintentos automáticos y deja los cuadros de mando en verde durante una caída.', how: 'Se registra y se propaga: el manejador central de errores decide el 500 y la alerta.' }
    ],

    rationale:
      'La reescritura se apoya en tres decisiones: separar capas (dominio sin framework), clasificar errores en operativos ' +
      'y de programación, y tratar el log como una salida más del sistema, con su propio contrato de seguridad. ' +
      'Son las tres que más impacto tienen cuando alguien te llama a las tres de la madrugada.',

    alternatives: [
      { name: 'Validación por esquema (Zod, Joi, JSON Schema)', when: 'Más de un endpoint o contratos compartidos.', tradeoff: 'Elimina validaciones escritas a mano y genera tipos y documentación; añade una dependencia y hay que cuidar los mensajes de error.' },
      { name: 'Índice UNIQUE en la base de datos en vez de comprobar antes', when: 'Hay concurrencia real.', tradeoff: 'Es la única forma correcta: entre el SELECT y el INSERT cabe otra petición. Lo ideal es hacer las dos cosas: comprobar para dar buen mensaje y confiar en la restricción para la corrección.' },
      { name: 'Outbox + cola para el correo', when: 'El correo importa de verdad.', tradeoff: 'Garantiza el envío con reintentos y aísla el fallo; a cambio necesitas infraestructura de colas.' },
      { name: 'Result en lugar de excepciones', when: 'Equipos que prefieren errores explícitos en la firma.', tradeoff: 'Hace visible el fallo en el tipo, pero en JavaScript obliga a comprobar en cada nivel y suele ser más verboso.' }
    ],

    commonErrors: [
      { error: 'Concatenar el email en la consulta SQL.', why: 'Inyección SQL directa. `\'" + email + "\'` con un email como `a@a.com\' OR 1=1--` devuelve toda la tabla.', fix: 'Consultas parametrizadas siempre, sin excepciones.' },
      { error: 'Responder 200 con `{ok:false}`.', why: 'El código de estado es parte del contrato. Con 200 los clientes no reintentan, los proxies cachean y la monitorización no ve nada.', fix: 'Códigos correctos: 422 validación, 409 conflicto, 500 fallo del servidor.' },
      { error: '`catch (e) {}` vacío.', why: 'Convierte un fallo en silencio. El sistema parece sano mientras deja de funcionar.', fix: 'Si decides continuar, registra el porqué. Un catch vacío debe llevar siempre un comentario que lo justifique.' },
      { error: 'Registrar el cuerpo de la petición completo.', why: 'Contraseñas, tokens y datos personales acaban en el sistema de logs, que suele tener menos control de acceso que la base de datos y a menudo es un servicio externo.', fix: 'Lista blanca de campos, o un redactor que enmascare claves sensibles.' },
      { error: 'Devolver el mensaje de la excepción al cliente.', why: 'Filtra estructura interna, versiones y a veces credenciales de conexión.', fix: 'Código de error estable hacia fuera, detalle completo solo en el log.' },
      { error: 'Comprobar duplicados solo con un SELECT previo.', why: 'Dos peticiones simultáneas pasan las dos la comprobación y crean dos usuarios.', fix: 'Restricción UNIQUE en base de datos y traducir su error a 409.' }
    ],

    bestPractices: [
      'Una función, una responsabilidad: validar, decidir y responder son tres cosas distintas.',
      'La lógica de negocio no importa el framework HTTP.',
      'Errores tipados con código estable: los clientes programan contra el código, no contra el texto.',
      'Los logs son estructurados y con nombre de evento, no frases sueltas.',
      'Todo efecto secundario no crítico se aísla y se registra.'
    ],

    security: [
      'Consultas parametrizadas o consulta construida por el ORM: nunca concatenación.',
      'Hash con bcrypt o argon2 y coste ajustado al hardware; nunca SHA-256 a secas para contraseñas.',
      'No reveles si un email existe en mensajes de recuperación de contraseña: es enumeración de usuarios. En el alta el 409 es aceptable y habitual, pero conviene añadirle rate limiting.',
      'Rate limiting por IP y por email en el endpoint de registro para evitar altas masivas automatizadas.',
      'Redacción de campos sensibles en el pipeline de logs, como red de seguridad además de la disciplina en el código.'
    ],

    performance: [
      'Validar antes de consultar evita una ida a base de datos por cada petición basura.',
      'El hash de contraseña es intencionadamente costoso (decenas de ms): no lo ejecutes antes de haber validado ni dentro de un bucle.',
      'Encolar el correo devuelve la respuesta cientos de milisegundos antes.'
    ],

    companyLooksFor: [
      'Que detectes la inyección SQL sin que forme parte del enunciado.',
      'Que sepas justificar la diferencia entre 409, 422 y 500.',
      'Sensibilidad con los datos que salen por los logs: es una señal fuerte de experiencia en producción.',
      'Que la refactorización no cambie el comportamiento funcional: mismo resultado, mejor estructura.',
      'Que menciones la condición de carrera del SELECT + INSERT.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Separación de capas y dependencias inyectadas', weight: 20 },
        { criteria: 'Clasificación de errores y códigos HTTP correctos', weight: 25 },
        { criteria: 'Tratamiento seguro de la contraseña (hash y logs)', weight: 25 },
        { criteria: 'Aislamiento del efecto secundario no crítico', weight: 15 },
        { criteria: 'Validación completa y legible', weight: 15 }
      ]
    },

    reinforce: [
      'Node.js Best Practices: capítulos de error handling y de seguridad.',
      'Códigos de estado HTTP y semántica de 4xx frente a 5xx.',
      'Logging estructurado y correlación de peticiones.',
      'Prueba después: `sec-auditoria-api` y `test-detectar-bugs`.'
    ]
  });

  /* ------------------------------------------------------------------
     2. Cliente de API resistente
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'api-cliente-resistente',
    empresa: {
      empresas: ['stripe', 'cloudflare', 'edreams'],
      evidencia: 'inspirada',
      puesto: 'Backend Engineer',
      rol: 'backend',
      formato: 'api-integration',
      dificultad: 3,
      evalua: [
        'Implementar contra una API que no conoces, con la documentación abierta: es literalmente su ronda de integración.',
        'Reintentos con espera exponencial, respeto de los límites de peticiones e idempotencia.',
        'Errores tratados como parte del contrato, no como excepción rara.'
      ],
      nota: 'Stripe tiene una ronda de integración con API documentada por testimonios; en Cloudflare, HTTP y los límites de peticiones aparecen en casi todas las rondas; y eDreams ODIGEO vive de integrarse con proveedores de viaje que fallan, cachean mal y limitan las consultas. El cliente concreto es nuestro.',
      fuentes: [
        { titulo: 'La ronda Bug Squash de Stripe, según testimonios de candidatos', url: 'https://www.coditioning.com/blog/804/stripe-swe-bug-squash-interview' },
        { titulo: 'Experiencias de entrevista en Cloudflare — Taro', url: 'https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/' },
        { titulo: 'eDreams ODIGEO Tech Blog', url: 'https://tech.edreamsodigeo.com/' }
      ]
    },
    categorias: ['backend', 'performance'],
    title: 'Cliente de API que sobrevive a la red real',
    category: 'apis',
    kind: 'api-consume',
    level: 'mid',
    time: 50,
    tags: ['reintentos', 'backoff', 'rate limit', 'idempotencia'],

    context:
      'Integráis un proveedor externo de tipos de cambio. Su API tiene un límite de 60 peticiones por minuto, ' +
      'devuelve 429 con cabecera `Retry-After` cuando te pasas y, un par de veces al día, algún 503 pasajero.',

    situation:
      'La integración actual hace `fetch` y confía. Cuando el proveedor devuelve 429, vuestro servicio propaga el ' +
      'error al usuario final. Cuando devuelve 503, se pierde la operación aunque bastaba con reintentar.',

    goal:
      'Implementar `peticionRobusta(fetchFn, opciones)` con reintentos, retroceso exponencial con jitter, respeto ' +
      'de `Retry-After` y una regla clara sobre qué se reintenta y qué no.',

    tech: ['JavaScript', 'HTTP'],
    skills: ['reintentos', 'backoff exponencial', 'idempotencia', 'diseño de clientes HTTP'],

    starter: {
      lang: 'javascript',
      code:
'/**\n' +
' * @param {() => Promise<{status:number, headers?:object, body?:any}>} fetchFn\n' +
' * @param {{intentos?:number, baseMs?:number, sleep?:(ms:number)=>Promise<void>}} opciones\n' +
' * @returns {Promise<{status:number, body:any, intentos:number}>}\n' +
' */\n' +
'async function peticionRobusta(fetchFn, opciones) {\n' +
'  return fetchFn();   // sin reintentos, sin control de nada\n' +
'}\n'
    },

    requirements: [
      'Reintentar ante 429, 502, 503, 504 y ante errores de red (la promesa se rechaza).',
      'NO reintentar ante 400, 401, 403, 404 y 422: reintentar un error del cliente solo malgasta cuota.',
      'Retroceso exponencial: la espera del intento n es `baseMs * 2^(n-1)`, más un jitter aleatorio.',
      'Si la respuesta 429 trae `Retry-After` en segundos, respetar ese valor en lugar del backoff calculado.',
      'Limitar a `intentos` (por defecto 3) e informar del número de intentos realizados en el resultado.',
      'Después de agotar los intentos, devolver la última respuesta de error en vez de lanzar, salvo que fuese error de red.'
    ],

    optional: [
      'Añadir un circuit breaker: tras N fallos consecutivos, dejar de intentar durante un tiempo.',
      'Deduplicar peticiones idénticas en vuelo.',
      'Caché con TTL corto para respuestas 200.'
    ],

    hints: [
      'Un bucle `for` con `await` es más legible aquí que la recursión, y evita crecer la pila con cada reintento.',
      'El jitter existe para evitar el efecto manada: si mil clientes fallan a la vez y esperan exactamente lo mismo, vuelven todos juntos y tumban el servicio otra vez.',
      '`Retry-After` puede venir en segundos o como fecha HTTP. Aquí solo hace falta soportar segundos, pero merece un comentario.',
      'Separa la decisión "¿esto se reintenta?" en su propia función: se lee mejor y se testea aparte.'
    ],

    docs: {
      resumen:
        'Un cliente HTTP robusto responde a tres preguntas: **¿qué merece reintentarse?**, **¿cuánto hay que ' +
        'esperar entre intentos?** y **¿cuándo hay que rendirse?**. Reintentar todo es tan malo como no ' +
        'reintentar nada, y hacerlo mal convierte un fallo puntual en una tormenta de peticiones.',

      conceptos: [
        {
          titulo: 'Qué se reintenta y qué no',
          texto:
            'Solo tiene sentido reintentar lo que puede salir bien la próxima vez:\n' +
            '**429 Too Many Requests** — has superado el límite. Esperando se arregla.\n' +
            '**502 / 503 / 504** — el servidor está saturado, caído o lento. Suele ser pasajero.\n' +
            '**Errores de red** — la promesa se rechaza sin llegar a haber respuesta.\n' +
            'Lo que **nunca** se reintenta:\n' +
            '**400 / 422** — la petición es incorrecta. Repetirla da el mismo error.\n' +
            '**401 / 403** — falta autorización. No mejora con el tiempo.\n' +
            '**404** — no existe. Tampoco.\n' +
            'Reintentar un 4xx solo malgasta tu cuota y retrasa el error real que el usuario necesita ver.',
          codigo:
'const REINTENTABLES = [429, 502, 503, 504];\n' +
'\n' +
'function esReintentable(status) {\n' +
'  return REINTENTABLES.indexOf(status) !== -1;\n' +
'}\n' +
'\n' +
'// Como función aparte: se lee mejor, se testea sola\n' +
'// y se ajusta por proveedor sin tocar el bucle.'
        },
        {
          titulo: 'Retroceso exponencial (backoff): duplicar la espera',
          texto:
            'Si el servicio está saturado, insistir cada 200 ms **empeora** la saturación. El retroceso ' +
            'exponencial duplica la espera en cada intento, dando tiempo real a que se recupere.\n' +
            'La fórmula es `base * 2^(n-1)`, donde `n` es el número de intento. Con base 300 ms: 300, 600, ' +
            '1200, 2400…\n' +
            'Ojo con el exponente: el **primer** intento no espera (aún no ha fallado nada). La primera espera ' +
            'corresponde a `n = 1` y vale la base.',
          codigo:
'function esperaBackoff(intento, baseMs) {\n' +
'  return baseMs * Math.pow(2, intento - 1);\n' +
'}\n' +
'\n' +
'esperaBackoff(1, 300);   //  300\n' +
'esperaBackoff(2, 300);   //  600\n' +
'esperaBackoff(3, 300);   // 1200\n' +
'\n' +
'// Math.pow(2, n) también se escribe 2 ** n'
        },
        {
          titulo: 'Jitter: por qué la espera lleva un poco de azar',
          texto:
            'Imagina mil clientes que fallan en el mismo segundo porque el servidor se cayó. Si todos esperan ' +
            'exactamente 300 ms, vuelven **todos a la vez** y reproducen el pico que causó el fallo. A eso se ' +
            'le llama **efecto manada** (*thundering herd*).\n' +
            'El *jitter* es una cantidad aleatoria que se suma a la espera para desincronizar a los clientes. ' +
            'Es una línea de código y evita una clase entera de incidentes.\n' +
            'En el ejercicio, los tests solo comprueban que la espera **crece** y que la primera es al menos ' +
            'la base: el jitter cabe perfectamente dentro de esa condición.',
          codigo:
'function esperaBackoff(intento, baseMs) {\n' +
'  const exponencial = baseMs * Math.pow(2, intento - 1);\n' +
'  const jitter = Math.random() * baseMs;    // 0 .. baseMs\n' +
'  return Math.round(exponencial + jitter);\n' +
'}\n' +
'\n' +
'// Math.random() devuelve un decimal en [0, 1)\n' +
'// Math.random() * 300  ->  entre 0 y 300'
        },
        {
          titulo: 'Retry-After: cuando el servidor te dice cuánto esperar',
          texto:
            'Junto a un 429 (y a veces a un 503) muchos proveedores envían la cabecera `Retry-After`. Es una ' +
            'instrucción explícita: "no vuelvas antes de este tiempo".\n' +
            'Tu cálculo de backoff es una estimación; la cabecera es información real. **La cabecera gana ' +
            'siempre.** Ignorarla es la vía rápida a que te bloqueen la clave de API.\n' +
            'Puede venir en segundos (`"120"`) o como fecha HTTP. Aquí basta con soportar segundos, ' +
            'convirtiéndolos a milisegundos.\n' +
            'Detalle práctico: las cabeceras HTTP no distinguen mayúsculas, así que conviene contemplar las ' +
            'dos formas de escribirlas.',
          codigo:
'function esperaServidor(headers) {\n' +
'  const v = headers && (headers["retry-after"] || headers["Retry-After"]);\n' +
'  if (!v) return null;                        // no la envió\n' +
'  const segundos = Number(v);\n' +
'  return Number.isFinite(segundos) ? segundos * 1000 : null;\n' +
'}\n' +
'\n' +
'// Y al elegir la espera, la del servidor tiene prioridad:\n' +
'const espera = esperaServidor(res.headers) || esperaBackoff(intento, baseMs);'
        },
        {
          titulo: 'Bucle con await: más legible que la recursión',
          texto:
            'Un `for` con `await` dentro se lee de arriba abajo, no hace crecer la pila y deja el número de ' +
            'intento a la vista. Es la estructura natural para esto.\n' +
            'Dos detalles importantes:\n' +
            '**No duermas después del último intento.** Esperar para no volver a intentar solo añade latencia ' +
            'a un error que ya es seguro.\n' +
            '**Distingue la respuesta de error del error de red.** En un caso el servidor te contestó algo que ' +
            'puedes devolver; en el otro no hay nada que devolver y toca lanzar.',
          codigo:
'let ultimaRespuesta = null;\n' +
'let ultimoError = null;\n' +
'\n' +
'for (let intento = 1; intento <= cfg.intentos; intento++) {\n' +
'  try {\n' +
'    const res = await fetchFn();\n' +
'    ultimaRespuesta = res; ultimoError = null;\n' +
'\n' +
'    if (!esReintentable(res.status)) return { ... };   // éxito o 4xx: fuera\n' +
'    if (intento === cfg.intentos) break;               // agotado: no dormir\n' +
'    await dormir(espera);\n' +
'\n' +
'  } catch (err) {\n' +
'    ultimoError = err; ultimaRespuesta = null;         // no hubo respuesta\n' +
'    if (intento === cfg.intentos) break;\n' +
'    await dormir(esperaBackoff(intento, cfg.baseMs));\n' +
'  }\n' +
'}\n' +
'\n' +
'if (ultimaRespuesta) return { ...ultimaRespuesta, intentos: cfg.intentos };\n' +
'throw ultimoError;      // nunca llegamos a hablar con el servidor'
        },
        {
          titulo: 'Inyectar el reloj: un cliente de red que se puede testear rápido',
          texto:
            'Si la función usa `setTimeout` directamente, probar tres reintentos con backoff tarda segundos ' +
            'reales. Un test lento no se ejecuta, y un cliente de red sin tests es donde se esconden los bugs.\n' +
            'La solución es recibir la función de espera como opción, con `setTimeout` por defecto. En los ' +
            'tests se sustituye por una que solo apunta cuánto se habría esperado.\n' +
            'Es la misma idea que la inyección de dependencias, aplicada al tiempo.',
          codigo:
'const dormir = cfg.sleep || (ms => new Promise(r => setTimeout(r, ms)));\n' +
'\n' +
'// En los tests del ejercicio ya viene preparado:\n' +
'//   var esperas = [];\n' +
'//   var sleepFalso = ms => { esperas.push(ms); return Promise.resolve(); };\n' +
'//\n' +
'// Así se puede comprobar que las esperas crecen sin esperar de verdad.'
        },
        {
          titulo: 'Idempotencia: el motivo por el que no todo se puede reintentar',
          texto:
            'Una operación es **idempotente** si repetirla no cambia el resultado. `GET`, `PUT` y `DELETE` lo ' +
            'son por definición; `POST` normalmente no.\n' +
            'El peligro es sutil: la primera petición pudo **llegar y ejecutarse**, y perderse solo la ' +
            'respuesta. El reintento crea entonces un segundo pedido o un segundo cobro.\n' +
            'Por eso los reintentos automáticos se limitan a operaciones idempotentes, o se exige una clave de ' +
            'idempotencia que el servidor use para reconocer la repetición.\n' +
            'Aunque el ejercicio no lo pida, mencionarlo es lo que se espera de un nivel mid.',
          codigo:
'// Seguro de reintentar\n' +
'GET  /pedidos/42\n' +
'PUT  /pedidos/42   { estado: "enviado" }   // dejarlo igual N veces = igual\n' +
'\n' +
'// Peligroso sin protección\n' +
'POST /pagos        { importe: 100 }        // dos veces = cobrar dos veces\n' +
'\n' +
'// Con clave de idempotencia el servidor detecta el duplicado\n' +
'POST /pagos\n' +
'Idempotency-Key: 7f3a-...'
        }
      ],

      referencia: [
        { nombre: 'Math.pow(base, exp)', texto: 'Potencia. `Math.pow(2, n)` o `2 ** n` para el crecimiento exponencial.' },
        { nombre: 'Math.random()', texto: 'Decimal aleatorio en [0, 1). Multiplícalo por la base para obtener el jitter.' },
        { nombre: 'Math.round(n)', texto: 'Redondea al entero más próximo. Las esperas en milisegundos deben ser enteras.' },
        { nombre: 'Number(v)', texto: 'Convierte a número. Devuelve `NaN` si no se puede.' },
        { nombre: 'Number.isFinite(n)', texto: 'Comprueba que es un número real y no `NaN` ni infinito. Más seguro que `!isNaN`.' },
        { nombre: 'array.indexOf(x) !== -1', texto: 'Comprueba pertenencia a una lista. También vale `array.includes(x)`.' },
        { nombre: 'Object.assign({}, defectos, opciones)', texto: 'Combina la configuración por defecto con la recibida, sin mutar ninguna.' },
        { nombre: 'new Promise(r => setTimeout(r, ms))', texto: 'La forma estándar de crear una espera que se puede `await`.' },
        { nombre: 'HTTP 429', texto: 'Too Many Requests. Has superado el límite del proveedor. Suele venir con `Retry-After`.' },
        { nombre: 'HTTP 503', texto: 'Service Unavailable. Servidor no disponible temporalmente. Reintentable.' }
      ],

      ejemplo: {
        titulo: 'Envío de webhooks con reintentos (misma técnica, otro escenario)',
        codigo:
'const REINTENTABLES = [408, 429, 500, 502, 503, 504];\n' +
'\n' +
'function esReintentable(status) {\n' +
'  return REINTENTABLES.indexOf(status) !== -1;\n' +
'}\n' +
'\n' +
'function espera(intento, baseMs) {\n' +
'  return Math.round(baseMs * Math.pow(2, intento - 1) + Math.random() * baseMs);\n' +
'}\n' +
'\n' +
'function esperaCabecera(headers) {\n' +
'  const v = headers && (headers["retry-after"] || headers["Retry-After"]);\n' +
'  const s = Number(v);\n' +
'  return v && Number.isFinite(s) ? s * 1000 : null;\n' +
'}\n' +
'\n' +
'/**\n' +
' * Entrega un webhook a un cliente que puede estar caído.\n' +
' * Devuelve el resultado y cuántos intentos hicieron falta.\n' +
' */\n' +
'async function entregarWebhook(enviar, opciones) {\n' +
'  const cfg = Object.assign({ intentos: 4, baseMs: 200 }, opciones || {});\n' +
'  const dormir = cfg.sleep || (ms => new Promise(r => setTimeout(r, ms)));\n' +
'\n' +
'  let ultima = null;\n' +
'  let fallo = null;\n' +
'\n' +
'  for (let intento = 1; intento <= cfg.intentos; intento++) {\n' +
'    try {\n' +
'      const res = await enviar();\n' +
'      ultima = res;\n' +
'      fallo = null;\n' +
'\n' +
'      if (!esReintentable(res.status)) {              // 2xx o 4xx definitivo\n' +
'        return { status: res.status, body: res.body, intentos: intento };\n' +
'      }\n' +
'      if (intento === cfg.intentos) break;            // no dormir de más\n' +
'\n' +
'      await dormir(esperaCabecera(res.headers) || espera(intento, cfg.baseMs));\n' +
'\n' +
'    } catch (err) {                                   // ni siquiera hubo respuesta\n' +
'      fallo = err;\n' +
'      ultima = null;\n' +
'      if (intento === cfg.intentos) break;\n' +
'      await dormir(espera(intento, cfg.baseMs));\n' +
'    }\n' +
'  }\n' +
'\n' +
'  if (ultima) return { status: ultima.status, body: ultima.body, intentos: cfg.intentos };\n' +
'  throw fallo;\n' +
'}',
        texto:
          'Es la misma estructura que necesitas, con dos diferencias deliberadas: aquí los códigos ' +
          'reintentables incluyen el 408 y el 500 (en un webhook interesa insistir más), y el número de ' +
          'intentos por defecto es otro. Eso es justamente lo que se ajusta por proveedor.\n' +
          'Presta atención a **el orden dentro del bucle**: obtener respuesta, guardarla, decidir si es ' +
          'definitiva, comprobar si era el último intento y solo entonces dormir. Y a que el `catch` limpia ' +
          '`ultima = null`, porque un error de red no deja ninguna respuesta que devolver.\n' +
          'En tu prueba, la diferencia principal es que el resultado también debe informar de `intentos` en ' +
          'el caso de éxito tras varios fallos.'
      },

      glosario: [
        { termino: 'Backoff exponencial', definicion: 'Estrategia en la que cada espera duplica la anterior, para no castigar a un servicio que ya está degradado.' },
        { termino: 'Jitter', definicion: 'Aleatoriedad añadida a la espera para que muchos clientes no reintenten a la vez.' },
        { termino: 'Efecto manada', definicion: 'Pico de tráfico causado porque todos los clientes reaccionan de forma sincronizada al mismo evento.' },
        { termino: 'Retry-After', definicion: 'Cabecera HTTP con la que el servidor indica cuánto esperar antes de volver a intentarlo.' },
        { termino: 'Rate limiting', definicion: 'Límite de peticiones por unidad de tiempo que impone el proveedor. Superarlo produce un 429.' },
        { termino: 'Idempotencia', definicion: 'Propiedad de una operación que puede repetirse sin efectos adicionales.' },
        { termino: 'Circuit breaker', definicion: 'Patrón que deja de intentar durante un tiempo tras varios fallos seguidos, para fallar rápido en vez de acumular esperas.' },
        { termino: 'Timeout', definicion: 'Tiempo máximo que esperas una respuesta. Sin él, un proveedor lento agota tus conexiones.' },
        { termino: 'Presupuesto de tiempo', definicion: 'Límite total de la operación completa, independiente del número de intentos.' }
      ],

      preparado: [
        '¿Sabrías decir de memoria qué códigos se reintentan y cuáles no, y por qué?',
        '¿Cuánto vale la espera del segundo intento con base 300 ms y backoff exponencial?',
        '¿Qué problema concreto resuelve el jitter?',
        'Si llega un 429 con `Retry-After: 2`, ¿cuánto esperas y por qué no usas tu cálculo?',
        '¿Por qué no hay que dormir después del último intento?',
        '¿Qué diferencia hay, en lo que devuelve tu función, entre un 503 final y un error de red final?',
        '¿Por qué es peligroso reintentar automáticamente un `POST`?'
      ]
    },

    tests: {
      mode: 'js',
      timeout: 6000,
      setup:
'function respuestas(lista) {\n' +
'  var i = 0;\n' +
'  var fn = async function () {\n' +
'    var r = lista[Math.min(i, lista.length - 1)];\n' +
'    i++;\n' +
'    fn.llamadas = i;\n' +
'    if (r instanceof Error) throw r;\n' +
'    return r;\n' +
'  };\n' +
'  fn.llamadas = 0;\n' +
'  return fn;\n' +
'}\n' +
'var esperas = [];\n' +
'var sleepFalso = function (ms) { esperas.push(ms); return Promise.resolve(); };',
      cases: [
        {
          name: 'Una respuesta 200 no genera reintentos',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 200, body: { ok: 1 } }]);\n' +
'  const r = await peticionRobusta(f, { sleep: sleepFalso });\n' +
'  expect(r.status).toBe(200);\n' +
'  expect(f.llamadas).toBe(1);\n' +
'})()'
        },
        {
          name: 'Un 503 pasajero se reintenta y acaba en 200',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 503 }, { status: 200, body: "ok" }]);\n' +
'  const r = await peticionRobusta(f, { sleep: sleepFalso });\n' +
'  expect(r.status).toBe(200);\n' +
'  expect(f.llamadas).toBe(2);\n' +
'})()'
        },
        {
          name: 'Un 404 no se reintenta nunca',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 404 }]);\n' +
'  const r = await peticionRobusta(f, { sleep: sleepFalso });\n' +
'  expect(r.status).toBe(404);\n' +
'  expect(f.llamadas).toBe(1);\n' +
'})()'
        },
        {
          name: 'Se respetan los intentos máximos',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 503 }]);\n' +
'  const r = await peticionRobusta(f, { intentos: 3, sleep: sleepFalso });\n' +
'  expect(f.llamadas).toBe(3);\n' +
'  expect(r.status).toBe(503);\n' +
'})()'
        },
        {
          name: 'El retroceso es creciente',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 503 }]);\n' +
'  await peticionRobusta(f, { intentos: 3, baseMs: 100, sleep: sleepFalso });\n' +
'  expect(esperas).toHaveLength(2);\n' +
'  expect(esperas[1] > esperas[0]).toBeTruthy();\n' +
'  expect(esperas[0] >= 100).toBeTruthy();\n' +
'})()'
        },
        {
          name: 'Retry-After manda sobre el backoff calculado',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 429, headers: { "retry-after": "2" } }, { status: 200, body: "ok" }]);\n' +
'  const r = await peticionRobusta(f, { baseMs: 50, sleep: sleepFalso });\n' +
'  expect(r.status).toBe(200);\n' +
'  expect(esperas[0]).toBe(2000);\n' +
'})()'
        },
        {
          name: 'Un error de red se reintenta',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([new Error("ECONNRESET"), { status: 200, body: "ok" }]);\n' +
'  const r = await peticionRobusta(f, { sleep: sleepFalso });\n' +
'  expect(r.status).toBe(200);\n' +
'  expect(f.llamadas).toBe(2);\n' +
'})()'
        },
        {
          name: 'El resultado informa del número de intentos',
          code:
'(async () => {\n' +
'  esperas = [];\n' +
'  const f = respuestas([{ status: 503 }, { status: 503 }, { status: 200, body: "ok" }]);\n' +
'  const r = await peticionRobusta(f, { intentos: 4, sleep: sleepFalso });\n' +
'  expect(r.intentos).toBe(3);\n' +
'})()'
        }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'const REINTENTABLES = [429, 502, 503, 504];\n' +
'\n' +
'function esReintentable(status) {\n' +
'  return REINTENTABLES.indexOf(status) !== -1;\n' +
'}\n' +
'\n' +
'/** Espera del intento n: exponencial + jitter para romper la sincronía. */\n' +
'function esperaBackoff(intento, baseMs) {\n' +
'  const exponencial = baseMs * Math.pow(2, intento - 1);\n' +
'  const jitter = Math.random() * baseMs;   // "full jitter" simplificado\n' +
'  return Math.round(exponencial + jitter);\n' +
'}\n' +
'\n' +
'/** Retry-After en segundos. La forma con fecha HTTP quedaría aquí. */\n' +
'function esperaServidor(headers) {\n' +
'  const v = headers && (headers["retry-after"] || headers["Retry-After"]);\n' +
'  if (!v) return null;\n' +
'  const segundos = Number(v);\n' +
'  return Number.isFinite(segundos) ? segundos * 1000 : null;\n' +
'}\n' +
'\n' +
'async function peticionRobusta(fetchFn, opciones) {\n' +
'  const cfg = Object.assign({ intentos: 3, baseMs: 300 }, opciones || {});\n' +
'  const dormir = cfg.sleep || (ms => new Promise(r => setTimeout(r, ms)));\n' +
'\n' +
'  let ultimaRespuesta = null;\n' +
'  let ultimoError = null;\n' +
'\n' +
'  for (let intento = 1; intento <= cfg.intentos; intento++) {\n' +
'    try {\n' +
'      const res = await fetchFn();\n' +
'      ultimaRespuesta = res;\n' +
'      ultimoError = null;\n' +
'\n' +
'      if (!esReintentable(res.status)) {\n' +
'        return { status: res.status, body: res.body, intentos: intento };\n' +
'      }\n' +
'      if (intento === cfg.intentos) break;   // agotado: no dormimos de más\n' +
'\n' +
'      // El servidor sabe mejor que nosotros cuánto esperar.\n' +
'      const espera = esperaServidor(res.headers) || esperaBackoff(intento, cfg.baseMs);\n' +
'      await dormir(espera);\n' +
'\n' +
'    } catch (err) {\n' +
'      ultimoError = err;             // fallo de red: no hubo respuesta\n' +
'      ultimaRespuesta = null;\n' +
'      if (intento === cfg.intentos) break;\n' +
'      await dormir(esperaBackoff(intento, cfg.baseMs));\n' +
'    }\n' +
'  }\n' +
'\n' +
'  if (ultimaRespuesta) {\n' +
'    return { status: ultimaRespuesta.status, body: ultimaRespuesta.body, intentos: cfg.intentos };\n' +
'  }\n' +
'  throw ultimoError;   // nunca llegamos a hablar con el servidor\n' +
'}\n'
    },

    walkthrough: [
      { what: 'Una lista explícita de códigos reintentables.', why: 'Reintentar un 400 o un 422 no cambia nada: la petición es incorrecta. Solo gastas cuota y retrasas el error real que el usuario necesita ver.', how: 'Función `esReintentable` aparte, fácil de ajustar por proveedor y de testear.' },
      { what: 'Retroceso exponencial en vez de espera fija.', why: 'Si el servicio está saturado, insistir cada 200 ms empeora la saturación. Duplicar la espera da tiempo real a recuperarse.', how: '`baseMs * 2^(n-1)`: 300, 600, 1200 ms…' },
      { what: 'Jitter aleatorio sumado a la espera.', why: 'Sin él, todos los clientes que fallaron en el mismo segundo vuelven exactamente a la vez y repiten el pico. Es el efecto manada.', how: 'Sumar `Math.random() * baseMs` desincroniza los reintentos.' },
      { what: '`Retry-After` tiene prioridad sobre el cálculo.', why: 'Es una instrucción explícita del proveedor. Ignorarla es la vía rápida a que te bloqueen la clave de API.', how: 'Se lee la cabecera y, si es un número válido, se usa esa espera en milisegundos.' },
      { what: 'No dormimos después del último intento.', why: 'Esperar para no volver a intentar solo añade latencia a un error que ya es seguro.', how: '`if (intento === cfg.intentos) break;` antes de la espera.' },
      { what: 'El error de red se distingue de la respuesta de error.', why: 'Son situaciones distintas: en una el servidor te contestó algo y en la otra ni llegaste. La primera se devuelve, la segunda se lanza porque no hay nada que devolver.', how: 'Se guardan por separado `ultimaRespuesta` y `ultimoError`.' },
      { what: '`sleep` es inyectable.', why: 'Permite testear el backoff sin esperar segundos reales. Un cliente de red que no se puede testear rápido no se testea nunca.', how: 'Por defecto usa `setTimeout`; en tests se sustituye por una función que solo registra la espera.' }
    ],

    rationale:
      'La decisión clave es reintentar poco y con criterio. Reintentar todo convierte un fallo puntual en una tormenta ' +
      'de peticiones, y reintentar operaciones no idempotentes duplica cobros o pedidos. Por eso la lista de códigos ' +
      'es explícita y por eso conviene limitar los reintentos automáticos a GET y a operaciones con clave de idempotencia.',

    alternatives: [
      { name: 'Circuit breaker (abierto/semiabierto/cerrado)', when: 'El proveedor se cae durante minutos.', tradeoff: 'Deja de castigar a un servicio caído y falla rápido, pero añade estado compartido y una ventana de recuperación que hay que afinar.' },
      { name: 'Cola con reintentos diferidos', when: 'La operación no necesita respuesta inmediata.', tradeoff: 'Aguanta caídas largas y sobrevive a un reinicio; a cambio la respuesta al usuario pasa a ser asíncrona.' },
      { name: 'Librería (p-retry, got, axios-retry)', when: 'Proyecto real.', tradeoff: 'Cubre casos borde que aquí no vemos (fechas en Retry-After, cancelación); implementarlo a mano una vez te enseña qué configurar en ellas.' },
      { name: 'Token bucket del lado cliente', when: 'Conoces el límite exacto del proveedor.', tradeoff: 'Evita el 429 en lugar de reaccionar a él, que siempre es mejor; requiere coordinación si tienes varias instancias.' }
    ],

    commonErrors: [
      { error: 'Reintentar cualquier código de error.', why: 'Un 401 no mejora con el tiempo y un 422 tampoco. Multiplicas por 3 la carga sin ninguna posibilidad de éxito.', fix: 'Lista explícita de códigos reintentables.' },
      { error: 'Reintentar un POST no idempotente.', why: 'La primera petición pudo llegar y solo se perdió la respuesta. El reintento crea un segundo pedido o un segundo cobro.', fix: 'Reintenta solo GET/PUT/DELETE, o exige clave de idempotencia en los POST.' },
      { error: 'Backoff sin jitter.', why: 'Sincroniza a todos los clientes y reproduce el pico que causó el fallo.', fix: 'Añadir aleatoriedad siempre.' },
      { error: 'Ignorar `Retry-After`.', why: 'El proveedor te ha dicho exactamente cuándo volver. Insistir antes suele acabar en bloqueo de la clave.', fix: 'La cabecera del servidor gana sobre tu cálculo.' },
      { error: 'Reintentos sin límite ni timeout global.', why: 'Una petición puede quedarse minutos en vuelo, agotar el pool de conexiones y colgar el servicio entero.', fix: 'Máximo de intentos y presupuesto total de tiempo.' },
      { error: 'No registrar los reintentos.', why: 'El sistema parece sano mientras hace tres veces el trabajo. La degradación se ve solo en la factura.', fix: 'Métrica de reintentos por endpoint y alerta cuando suba.' }
    ],

    bestPractices: [
      'Reintentos únicamente en operaciones idempotentes.',
      'Siempre exponencial y siempre con jitter.',
      'Respeta las cabeceras del proveedor antes que tu propia heurística.',
      'Presupuesto de tiempo total además del número de intentos.',
      'Instrumenta: intentos, códigos y latencias por proveedor.'
    ],

    security: [
      'La clave de API vive en variables de entorno o en un gestor de secretos, nunca en el código ni en la URL (las URLs acaban en los logs de acceso).',
      'Valida y acota el tamaño de la respuesta externa: un proveedor comprometido puede devolverte megabytes o payloads maliciosos.',
      'Timeout obligatorio en toda llamada externa: sin él, un proveedor lento es un ataque de denegación de servicio gratuito contra ti.'
    ],

    performance: [
      'Cachear respuestas con TTL corto suele reducir más peticiones que cualquier ajuste de reintentos.',
      'Deduplicar peticiones idénticas en vuelo evita multiplicar la carga cuando llega un pico.',
      'Reutiliza conexiones (keep-alive): abrir TLS en cada petición domina la latencia.'
    ],

    companyLooksFor: [
      'Que menciones la idempotencia sin que aparezca en el enunciado.',
      'Que conozcas el jitter y sepas explicar el efecto manada.',
      'Que hagas testeable el tiempo inyectando `sleep`.',
      'Que sepas cuándo NO reintentar, que es lo que separa a mid de junior aquí.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Clasificación correcta de códigos reintentables', weight: 25 },
        { criteria: 'Backoff exponencial con jitter', weight: 20 },
        { criteria: 'Respeto de Retry-After', weight: 20 },
        { criteria: 'Distinción entre error de red y respuesta de error', weight: 15 },
        { criteria: 'Diseño testeable (sleep inyectable, límites)', weight: 20 }
      ]
    },

    reinforce: [
      'Idempotencia en APIs HTTP y claves de idempotencia.',
      'Patrones de resiliencia: circuit breaker, bulkhead, timeout.',
      'Módulo 4 (Asincronía) para el manejo de promesas y temporizadores.',
      'Prueba después: `sd-plataforma-eventos`.'
    ]
  });

})(window.TT);

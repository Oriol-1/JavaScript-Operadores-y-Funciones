/* ============================================================
   Pruebas de empresa — simulaciones de proceso de selección
   Sin tests automáticos: se evalúan con rúbrica, igual que en
   una empresa. La autoevaluación honesta es parte del ejercicio.
   ============================================================ */
(function (TT) {
  'use strict';

  /* ------------------------------------------------------------------
     1. Code Review Challenge
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'emp-code-review',
    empresa: {
      empresas: ['gitlab', 'github'],
      evidencia: 'documentada',
      puesto: 'Senior Backend Engineer',
      rol: 'backend',
      formato: 'code-review',
      dificultad: 4,
      evalua: [
        'Revisión de un Merge Request como ronda técnica principal: es literalmente el formato que GitLab publica en su handbook.',
        'Priorizar por impacto y comunicar sin atacar a la persona.',
        'Detectar ausencias — transacción, idempotencia, tests — y no solo lo que está escrito.'
      ],
      nota: 'GitLab documenta en su handbook público que su entrevista técnica es la revisión de un Merge Request, y GitHub que sus entregas se revisan como un Pull Request con rúbrica. El PR concreto de este ejercicio es nuestro.',
      fuentes: [
        { titulo: 'Technical Interviews — The GitLab Handbook', url: 'https://handbook.gitlab.com/handbook/hiring/interviewing/technical/' },
        { titulo: 'How GitHub does take home technical interviews — The GitHub Blog', url: 'https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/' }
      ]
    },
    categorias: ['security', 'backend', 'databases'],
    title: 'Code Review Challenge: revisa este Pull Request',
    category: 'company',
    kind: 'code-review',
    level: 'senior',
    time: 45,
    tags: ['code review', 'seguridad', 'concurrencia'],

    context:
      'Segunda ronda de un proceso para un puesto senior. Te comparten un Pull Request real de su repositorio ' +
      '(anonimizado) y te piden que hagas la revisión que harías a un compañero. No buscan que encuentres "un fallo": ' +
      'buscan ver cómo priorizas, cómo comunicas y qué das por bueno.',

    situation:
      'El PR se titula "feat: canjeo de cupones de descuento". Pasa los tests, el compañero tiene prisa por entrar en ' +
      'la release de mañana y ya tiene una aprobación de otro miembro del equipo.',

    goal:
      'Escribir la revisión: identificar los problemas, clasificarlos por gravedad (bloqueante, importante, sugerencia) ' +
      'y redactar los comentarios como se los dirías a una persona con la que vas a seguir trabajando.',

    tech: ['Node.js', 'SQL', 'Express'],
    skills: ['revisión de código', 'concurrencia', 'seguridad', 'comunicación técnica', 'priorización'],

    starter: {
      lang: 'javascript',
      code:
'// ============ PULL REQUEST #482 ============\n' +
'// feat: canjeo de cupones de descuento\n' +
'// +58 −2   ·   1 aprobación   ·   CI en verde\n' +
'\n' +
'router.post("/cupones/canjear", async (req, res) => {\n' +
'  const { codigo, pedidoId } = req.body;\n' +
'\n' +
'  const cupon = await db.query(\n' +
'    `SELECT * FROM cupones WHERE codigo = \'${codigo}\'`\n' +
'  );\n' +
'\n' +
'  if (!cupon[0]) {\n' +
'    return res.status(404).json({ error: "Cupón " + codigo + " no encontrado" });\n' +
'  }\n' +
'\n' +
'  if (cupon[0].usos_restantes <= 0) {\n' +
'    return res.status(400).json({ error: "agotado" });\n' +
'  }\n' +
'\n' +
'  const pedido = await db.query("SELECT * FROM pedidos WHERE id = ?", [pedidoId]);\n' +
'  const total = pedido[0].total;\n' +
'  const descuento = total * (cupon[0].porcentaje / 100);\n' +
'\n' +
'  await db.query("UPDATE cupones SET usos_restantes = usos_restantes - 1 WHERE id = ?", [cupon[0].id]);\n' +
'  await db.query("UPDATE pedidos SET total = ? WHERE id = ?", [total - descuento, pedidoId]);\n' +
'\n' +
'  logger.info(`Cupón canjeado: ${JSON.stringify(req.body)} por ${req.user.email}`);\n' +
'\n' +
'  res.json({ ok: true, nuevoTotal: total - descuento, cupon: cupon[0] });\n' +
'});\n' +
'\n' +
'// ---- test incluido en el PR ----\n' +
'it("aplica el descuento", async () => {\n' +
'  const r = await request(app).post("/cupones/canjear")\n' +
'    .send({ codigo: "VERANO10", pedidoId: 1 });\n' +
'  expect(r.body.ok).toBe(true);\n' +
'});\n' +
'\n' +
'// ============ TU REVISIÓN ============\n' +
'// Escribe aquí tus comentarios. Formato sugerido:\n' +
'//\n' +
'// [BLOQUEANTE] línea X — problema, impacto y propuesta\n' +
'// [IMPORTANTE] línea X — ...\n' +
'// [SUGERENCIA] línea X — ...\n' +
'\n'
    },

    requirements: [
      'Identificar al menos los problemas bloqueantes antes de mirar la solución.',
      'Clasificar cada hallazgo por gravedad y justificar la clasificación con su impacto real.',
      'Proponer una solución concreta en cada comentario, no solo señalar el problema.',
      'Emitir un veredicto: aprobar, aprobar con cambios menores o solicitar cambios.',
      'Redactar los comentarios de forma que no ataquen a la persona.'
    ],

    optional: [
      'Reescribir el endpoint completo tal como lo dejarías tú.',
      'Proponer los tests que faltan.',
      'Redactar el mensaje que enviarías al compañero por chat dada la prisa de la release.'
    ],

    hints: [
      'Empieza por lo que puede causar pérdida de dinero o de datos. Un problema de estilo nunca es bloqueante; una condición de carrera sobre un descuento sí.',
      'Pregúntate qué pasa si dos peticiones llegan en el mismo milisegundo. Los cupones son el ejemplo clásico de recurso limitado bajo concurrencia.',
      'Mira las dos escrituras seguidas: si la segunda falla, ¿en qué estado queda el sistema?',
      'Revisa qué sale por la respuesta y qué sale por los logs. Ambos son salidas del sistema con requisitos de seguridad.',
      'Un test que solo comprueba el camino feliz no es cobertura, es decoración.'
    ],

    docs: {
      resumen:
        'Revisar código es una habilidad con método, no intuición. Necesitas dos cosas: **un recorrido por ' +
        'categorías** para no depender de que un fallo te llame la atención, y **un vocabulario de ' +
        'vulnerabilidades** para reconocer los patrones. Este documento te da las dos.',

      conceptos: [
        {
          titulo: 'El orden de revisión: por categorías, no por líneas',
          texto:
            'Leer el diff de arriba abajo hace que encuentres lo llamativo y se te escape lo importante. El ' +
            'método fiable es recorrer el código **cinco veces**, buscando una cosa cada vez:\n' +
            '**1. Entrada** — ¿se valida y se sanea todo lo que viene de fuera?\n' +
            '**2. Autorización** — ¿se comprueba que este usuario puede tocar **este** recurso?\n' +
            '**3. Concurrencia** — ¿qué pasa si dos peticiones llegan a la vez?\n' +
            '**4. Consistencia** — si algo falla a mitad, ¿en qué estado queda el sistema?\n' +
            '**5. Salida** — ¿qué se devuelve y qué se registra, y debería salir todo eso?\n' +
            'Y una sexta pregunta que atraviesa las cinco: **¿qué debería estar y no está?** Los peores fallos ' +
            'son ausencias, y las ausencias no aparecen en el diff.',
          codigo:
'// Recorrido mental sobre cualquier endpoint\n' +
'//\n' +
'//  1. ENTRADA        codigo, pedidoId  -> ¿validados? ¿parametrizados?\n' +
'//  2. AUTORIZACIÓN   ¿el pedido es de req.user? ¿o de cualquiera?\n' +
'//  3. CONCURRENCIA   dos peticiones simultáneas sobre el mismo cupón\n' +
'//  4. CONSISTENCIA   falla el 2º UPDATE -> ¿cupón gastado sin descuento?\n' +
'//  5. SALIDA         res.json(...) y logger.info(...) -> ¿qué se filtra?\n' +
'//\n' +
'//  AUSENCIAS         transacción, idempotencia, caducidad, tests'
        },
        {
          titulo: 'Condición de carrera sobre un recurso limitado',
          texto:
            'Es el patrón más importante de este PR y uno de los más frecuentes en comercio electrónico.\n' +
            'Cuando lees un valor, decides con él y después escribes, **entre la lectura y la escritura cabe ' +
            'otra petición**. Un `if` en JavaScript no es atómico respecto a la base de datos.\n' +
            'Con un cupón de un solo uso y 50 peticiones simultáneas, las 50 leen `usos_restantes = 1`, las 50 ' +
            'pasan la comprobación y las 50 aplican el descuento.\n' +
            'La solución no está en la aplicación: está donde está el dato. Se decrementa **de forma ' +
            'condicional en una sola sentencia** y se comprueban las filas afectadas.',
          codigo:
'// VULNERABLE: leer, decidir, escribir\n' +
'const cupon = await db.query("SELECT * FROM cupones WHERE codigo = ?", [codigo]);\n' +
'if (cupon[0].usos_restantes <= 0) return res.status(400)...;\n' +
'//        ← aquí caben otras 50 peticiones\n' +
'await db.query("UPDATE cupones SET usos_restantes = usos_restantes - 1 WHERE id = ?", [id]);\n' +
'\n' +
'// CORRECTO: la base de datos resuelve la carrera\n' +
'const r = await db.query(\n' +
'  `UPDATE cupones SET usos_restantes = usos_restantes - 1\n' +
'    WHERE codigo = ? AND usos_restantes > 0`, [codigo]);\n' +
'\n' +
'if (r.affectedRows === 0) {      // alguien llegó antes, o está agotado\n' +
'  return { status: 409, body: { error: "CUPON_NO_APLICABLE" } };\n' +
'}'
        },
        {
          titulo: 'Transacciones: todo o nada',
          texto:
            'Una **transacción** agrupa varias escrituras para que se apliquen todas o ninguna. Sin ella, un ' +
            'fallo intermedio deja el sistema en un estado imposible.\n' +
            'En este PR hay dos `UPDATE` seguidos: si el segundo falla, el cupón queda consumido y el pedido ' +
            'sin descuento. Eso llega a atención al cliente como "me ha desaparecido el cupón".\n' +
            'La estructura es siempre la misma: abrir, escribir, confirmar, y **deshacer en el `catch`**. ' +
            'Cualquier `return` intermedio debe hacer `rollback` antes de salir.',
          codigo:
'const tx = await db.transaccion();\n' +
'try {\n' +
'  const [pedido] = await tx.query(...);\n' +
'  if (!pedido) { await tx.rollback(); return { status: 404, ... }; }\n' +
'\n' +
'  await tx.query("UPDATE cupones ...");\n' +
'  await tx.query("UPDATE pedidos ...");\n' +
'  await tx.commit();                    // ahora sí, todo firme\n' +
'\n' +
'} catch (err) {\n' +
'  await tx.rollback();                  // se deshace todo\n' +
'  next(err);\n' +
'}'
        },
        {
          titulo: 'IDOR: el fallo de autorización que más se escapa',
          texto:
            'IDOR (*Insecure Direct Object Reference*) es acceder a un recurso ajeno simplemente cambiando un ' +
            'identificador en la petición. Está en el primer puesto del OWASP Top 10 como "control de acceso ' +
            'roto".\n' +
            'Aquí el endpoint recibe `pedidoId` y lo usa **sin comprobar que ese pedido pertenece a quien ' +
            'llama**. Cualquier usuario autenticado puede aplicar descuentos al pedido de otro.\n' +
            'La forma robusta de arreglarlo no es añadir un `if` después, sino **meter la condición en el ' +
            '`WHERE`**: así es imposible olvidarla y no hay ventana entre la lectura y la comprobación.',
          codigo:
'// VULNERABLE: cualquier pedidoId vale\n' +
'const pedido = await db.query("SELECT * FROM pedidos WHERE id = ?", [pedidoId]);\n' +
'\n' +
'// FRÁGIL: correcto, pero fácil de olvidar en el siguiente endpoint\n' +
'const pedido = await db.query("SELECT * FROM pedidos WHERE id = ?", [pedidoId]);\n' +
'if (pedido.usuario_id !== req.user.id) return res.status(403)...;\n' +
'\n' +
'// ROBUSTO: la propiedad es parte de la consulta\n' +
'const [pedido] = await db.query(\n' +
'  "SELECT id, total FROM pedidos WHERE id = ? AND usuario_id = ?",\n' +
'  [pedidoId, req.user.id]);\n' +
'if (!pedido) return { status: 404, body: { error: "PEDIDO_NO_ENCONTRADO" } };'
        },
        {
          titulo: 'Idempotencia: qué pasa si el usuario hace doble clic',
          texto:
            'Reenviar la misma petición vuelve a aplicar el descuento **sobre el total ya rebajado**. Dos ' +
            'clics, doble descuento. Y no hace falta mala fe: un reintento de red produce lo mismo.\n' +
            'Comprobarlo en el cliente no sirve, porque el cliente no es de fiar. La única solución que ' +
            'aguanta es una **restricción UNIQUE** en la base de datos: una tabla que registre el canje y que ' +
            'físicamente no admita el duplicado.\n' +
            'El error de la restricción se traduce entonces a un 409.',
          codigo:
'-- Migración\n' +
'CREATE TABLE canjes (\n' +
'  pedido_id INT NOT NULL,\n' +
'  cupon_id  INT NOT NULL,\n' +
'  UNIQUE (pedido_id, cupon_id)     -- imposible aplicarlo dos veces\n' +
');\n' +
'\n' +
'-- En el endpoint\n' +
'try {\n' +
'  await tx.query("INSERT INTO canjes (pedido_id, cupon_id) VALUES (?, ?)",\n' +
'                 [pedidoId, cupon.id]);\n' +
'} catch (e) {\n' +
'  await tx.rollback();\n' +
'  return { status: 409, body: { error: "CUPON_YA_APLICADO" } };\n' +
'}'
        },
        {
          titulo: 'Dinero en coma flotante: por qué no cuadra la contabilidad',
          texto:
            'Los números decimales de JavaScript son binarios: `0.1 + 0.2` da `0.30000000000000004`. Con ' +
            'importes, esos restos se acumulan y aparecen totales con quince decimales que no cuadran.\n' +
            'La práctica estándar es **trabajar en céntimos enteros** y redondear una sola vez al final. ' +
            'Multiplicar por 100, operar con enteros y dividir al presentar.\n' +
            'En base de datos, el tipo correcto es `DECIMAL`, nunca `FLOAT`.',
          codigo:
'0.1 + 0.2 === 0.3;              // false\n' +
'\n' +
'// MAL\n' +
'const descuento = total * (porcentaje / 100);\n' +
'const nuevo = total - descuento;      // 89.99999999999999\n' +
'\n' +
'// BIEN: enteros y un solo redondeo\n' +
'const totalCent = Math.round(total * 100);\n' +
'const nuevoTotal = Math.round(totalCent * (100 - porcentaje) / 100) / 100;'
        },
        {
          titulo: 'Fugas por la salida: respuesta, mensajes de error y logs',
          texto:
            'Tres formas de filtrar información sin darse cuenta, todas presentes en este PR:\n' +
            '**Devolver el objeto entero.** `res.json({ cupon: cupon[0] })` expone usos restantes, condiciones ' +
            'internas y a veces márgenes. Devuelve solo lo que el cliente necesita.\n' +
            '**Mensajes de error específicos.** Repetir el código introducido en el 404 permite enumerar ' +
            'cupones válidos por fuerza bruta. Un mensaje genérico no confirma si existe.\n' +
            '**Logs con datos personales.** `JSON.stringify(req.body)` más el email del usuario mete datos ' +
            'personales en un sistema que suele tener menos control de acceso que la base de datos.',
          codigo:
'// MAL\n' +
'res.json({ ok: true, nuevoTotal, cupon: cupon[0] });\n' +
'res.status(404).json({ error: "Cupón " + codigo + " no encontrado" });\n' +
'logger.info(`Cupón canjeado: ${JSON.stringify(req.body)} por ${req.user.email}`);\n' +
'\n' +
'// BIEN\n' +
'res.json({ nuevoTotal });\n' +
'res.status(409).json({ error: "CUPON_NO_APLICABLE" });\n' +
'logger.info("cupon.canjeado", { pedidoId, cuponId: cupon.id, usuarioId: req.user.id });'
        },
        {
          titulo: 'Cómo se escribe un comentario de revisión',
          texto:
            'Un comentario útil tiene tres partes: **problema, impacto y propuesta**. Sin el impacto, el autor ' +
            'no sabe por qué le corre prisa; sin la propuesta, hace falta otra ronda solo para averiguar qué ' +
            'querías decir.\n' +
            'Y una regla de gravedad: **bloqueante se reserva para pérdida de datos, de dinero o de ' +
            'seguridad**. Si todo bloquea, nada bloquea, y el autor deja de distinguir lo urgente.\n' +
            'El comentario habla del **código**, nunca de la persona. Y reconocer lo que está bien hecho no es ' +
            'cortesía vacía: una revisión solo negativa se recibe peor y se aplica peor.',
          codigo:
'// Vacío\n' +
'//   "esto está mal"\n' +
'//   "yo lo haría de otra forma"\n' +
'\n' +
'// Útil\n' +
'//   [BLOQUEANTE] L9-19 — Condición de carrera. Entre leer usos_restantes\n' +
'//   y decrementarlo pueden entrar N peticiones, así que un cupón de un\n' +
'//   uso se canjea N veces (impacto: pérdida económica directa).\n' +
'//   Propuesta: decrementar condicionalmente en una sola sentencia\n' +
'//   (WHERE usos_restantes > 0) y comprobar affectedRows.\n' +
'\n' +
'// Gravedades\n' +
'//   [BLOQUEANTE]  datos, dinero o seguridad. Impide la fusión.\n' +
'//   [IMPORTANTE]  hay que arreglarlo, no necesariamente hoy.\n' +
'//   [SUGERENCIA]  mejora opcional, es tu opinión.'
        },
        {
          titulo: 'Qué hacer con la presión de la release',
          texto:
            'El PR llega con prisa, una aprobación previa y el CI en verde. Nada de eso cambia el criterio: un ' +
            'canjeo de cupones explotable cuesta más que un día de retraso, y ceder una vez convierte la ' +
            'excepción en norma.\n' +
            'Pero decir "solicito cambios" sin más te convierte en un obstáculo. Lo que se valora es mantener ' +
            'el listón **y ofrecer un camino**: partir el PR y sacar primero la parte segura, o desplegar con ' +
            'la funcionalidad desactivada por una bandera.\n' +
            'Sobre el CI verde: los tests cubren el camino feliz y **ninguno de los cinco bloqueantes se ' +
            'manifiesta con una petición secuencial y correcta**. El CI es un requisito, no un criterio de ' +
            'aprobación.',
          codigo:
'// Veredicto con salida práctica\n' +
'//\n' +
'//   SOLICITAR CAMBIOS. Cinco bloqueantes, dos con pérdida económica\n' +
'//   directa. Propuesta para no bloquear la release:\n' +
'//\n' +
'//   1. Sacar hoy la parte de lectura y la interfaz, sin el canjeo.\n' +
'//   2. Desplegar el canjeo detrás de una bandera desactivada.\n' +
'//   3. Mañana: transacción + UPDATE condicional + comprobación de\n' +
'//      propiedad + tabla de canjes. Lo reviso en cuanto esté.'
        }
      ],

      referencia: [
        { nombre: 'affectedRows / rowCount', texto: 'Filas modificadas por un `UPDATE`. Si es 0, la condición no se cumplió: alguien llegó antes.' },
        { nombre: 'UPDATE ... WHERE condición', texto: 'Comprobar y escribir en una sola operación atómica. La forma correcta de resolver una carrera.' },
        { nombre: 'BEGIN / COMMIT / ROLLBACK', texto: 'Delimitan una transacción. Todo lo de dentro se aplica junto o no se aplica.' },
        { nombre: 'SELECT ... FOR UPDATE', texto: 'Bloqueo pesimista: reserva la fila hasta el final de la transacción. Correcto, pero serializa el acceso.' },
        { nombre: 'UNIQUE (a, b)', texto: 'Restricción que impide duplicados. La base de la idempotencia real.' },
        { nombre: 'Consulta parametrizada (?)', texto: 'Separa consulta y valores. La defensa contra la inyección SQL.' },
        { nombre: 'DECIMAL vs FLOAT', texto: 'Para dinero se usa `DECIMAL`. `FLOAT` acumula errores de redondeo.' },
        { nombre: 'HTTP 409 / 422 / 403 / 404', texto: 'Conflicto de estado / datos inválidos / sin permiso / no existe. Devolver 404 en lugar de 403 evita revelar que el recurso existe.' },
        { nombre: 'Índice en la columna de búsqueda', texto: 'Sin índice en `cupones.codigo`, cada canjeo recorre la tabla entera.' }
      ],

      ejemplo: {
        titulo: 'Revisión completa de otro PR con los mismos patrones',
        codigo:
'// ===== PR #311: "feat: canjear puntos de fidelidad" =====\n' +
'//\n' +
'// router.post("/puntos/canjear", async (req, res) => {\n' +
'//   const { usuarioId, puntos } = req.body;\n' +
'//   const u = await db.query(`SELECT * FROM usuarios WHERE id = ${usuarioId}`);\n' +
'//   if (u[0].puntos < puntos) return res.send("saldo insuficiente");\n' +
'//   await db.query("UPDATE usuarios SET puntos = puntos - ? WHERE id = ?",\n' +
'//                  [puntos, usuarioId]);\n' +
'//   await db.query("INSERT INTO vales (usuario_id, valor) VALUES (?,?)",\n' +
'//                  [usuarioId, puntos / 10]);\n' +
'//   logger.info("canje " + JSON.stringify(req.body));\n' +
'//   res.json({ ok: true, usuario: u[0] });\n' +
'// });\n' +
'\n' +
'\n' +
'// ===== REVISIÓN =====\n' +
'// Veredicto: SOLICITAR CAMBIOS (4 bloqueantes).\n' +
'\n' +
'// [BLOQUEANTE] L3 — Inyección SQL: `usuarioId` interpolado en la consulta.\n' +
'//   Con "1 OR 1=1" se devuelve la primera fila de la tabla.\n' +
'//   Propuesta: consulta parametrizada, como ya haces dos líneas más abajo.\n' +
'\n' +
'// [BLOQUEANTE] L2 — El usuarioId viene del CUERPO, no de la sesión.\n' +
'//   Cualquiera puede gastar los puntos de otro. IDOR de manual.\n' +
'//   Propuesta: usar req.user.id e ignorar por completo el del cuerpo.\n' +
'\n' +
'// [BLOQUEANTE] L4-6 — Condición de carrera sobre el saldo. Entre el\n' +
'//   SELECT y el UPDATE caben N peticiones: se pueden gastar más puntos\n' +
'//   de los que hay (impacto: pérdida económica).\n' +
'//   Propuesta:\n' +
'//     UPDATE usuarios SET puntos = puntos - ?\n' +
'//      WHERE id = ? AND puntos >= ?\n' +
'//     y comprobar affectedRows === 0 -> 409.\n' +
'\n' +
'// [BLOQUEANTE] L6-8 — Dos escrituras sin transacción. Si falla el INSERT,\n' +
'//   los puntos se han restado y el vale no existe.\n' +
'//   Propuesta: envolver ambas en una transacción con rollback.\n' +
'\n' +
'// [IMPORTANTE] L4 — `puntos` no se valida: acepta negativos (sumaría saldo)\n' +
'//   y decimales. Propuesta: Number.isInteger(puntos) && puntos > 0 -> 422.\n' +
'\n' +
'// [IMPORTANTE] L9 — El log vuelca el cuerpo entero.\n' +
'//   Propuesta: logger.info("puntos.canjeados", { usuarioId, puntos }).\n' +
'\n' +
'// [IMPORTANTE] L10 — Se devuelve el usuario completo (hash de contraseña,\n' +
'//   email, rol...). Propuesta: devolver solo { saldoRestante, valeId }.\n' +
'\n' +
'// [IMPORTANTE] L4 — `res.send("saldo insuficiente")` responde 200 con un\n' +
'//   error dentro. Propuesta: 409 con código estable.\n' +
'\n' +
'// [IMPORTANTE] L7 — `puntos / 10` en coma flotante y sin redondear.\n' +
'\n' +
'// [SUGERENCIA] Extraer a un servicio `canjearPuntos(deps, datos)`: hoy no\n' +
'//   se puede testear sin levantar el servidor HTTP.\n' +
'\n' +
'// Bien hecho: los dos últimos queries ya usan parámetros y los nombres\n' +
'// de las columnas son claros. El problema es solo el primero.',
        texto:
          'Observa que la revisión **no sigue el orden de las líneas**: empieza por los cuatro bloqueantes ' +
          '—inyección, IDOR, carrera y falta de transacción— y después baja a lo importante. El primer ' +
          'comentario es el más grave, que es exactamente lo que se evalúa.\n' +
          'Cada comentario tiene **problema, impacto y propuesta concreta**, y en los de seguridad se indica ' +
          'el vector real ("con 1 OR 1=1…"), porque eso convierte una objeción teórica en algo accionable.\n' +
          'Fíjate en las **ausencias detectadas**: la validación de `puntos` negativos y la transacción no ' +
          'aparecen en el diff, hay que buscarlas preguntándose qué debería estar.\n' +
          'Y en el cierre: se reconoce lo que está bien hecho. El PR de tu prueba tiene los mismos patrones ' +
          'más idempotencia y caducidad. Aplica este mismo formato.'
      },

      glosario: [
        { termino: 'IDOR', definicion: 'Acceso a un recurso ajeno cambiando un identificador, por no comprobar la propiedad. Categoría "control de acceso roto" del OWASP Top 10.' },
        { termino: 'Inyección SQL', definicion: 'Alterar una consulta insertando código en un valor concatenado.' },
        { termino: 'Condición de carrera', definicion: 'El resultado depende del orden de operaciones simultáneas. Sobre recursos limitados, produce pérdida económica.' },
        { termino: 'Transacción', definicion: 'Grupo de escrituras que se aplican todas o ninguna.' },
        { termino: 'Rollback', definicion: 'Deshacer una transacción y volver al estado anterior.' },
        { termino: 'Atómico', definicion: 'Operación que ocurre entera o no ocurre, sin estado intermedio observable por otros.' },
        { termino: 'Bloqueo optimista', definicion: 'Escribir comprobando que el dato no ha cambiado (columna de versión) y reintentar si cambió.' },
        { termino: 'Bloqueo pesimista', definicion: 'Reservar la fila antes de trabajar con ella (`FOR UPDATE`). Correcto, pero serializa.' },
        { termino: 'Idempotencia', definicion: 'Repetir la operación no produce efectos adicionales.' },
        { termino: 'Enumeración', definicion: 'Descubrir valores válidos (cupones, usuarios) aprovechando que los mensajes de error distinguen entre existe y no existe.' },
        { termino: 'Bloqueante', definicion: 'Hallazgo que impide fusionar el PR. Se reserva para pérdida de datos, dinero o seguridad.' },
        { termino: 'OWASP Top 10', definicion: 'Lista de referencia de los diez riesgos de seguridad web más críticos.' }
      ],

      preparado: [
        '¿Sabrías recorrer un endpoint por las cinco categorías (entrada, autorización, concurrencia, consistencia, salida) sin mirar la lista?',
        '¿Por qué un `if` en JavaScript no protege un recurso limitado bajo concurrencia?',
        '¿Cómo se decrementa un contador de forma segura en una sola sentencia SQL?',
        '¿Qué queda roto exactamente si falla la segunda de dos escrituras sin transacción?',
        '¿Por qué meter la comprobación de propiedad en el `WHERE` es mejor que un `if` posterior?',
        '¿Qué mecanismo impide de verdad que un doble clic aplique el descuento dos veces?',
        '¿Qué tres cosas debe contener cada comentario de revisión?',
        '¿Por qué un CI en verde no es motivo suficiente para aprobar este PR?'
      ]
    },

    tests: {
      mode: 'checklist',
      titulo: 'Hallazgos esperados. Marca los que identificaste ANTES de abrir la solución.',
      items: [
        { id: 'sql', peso: 15, texto: '[BLOQUEANTE] Inyección SQL: `codigo` se interpola directamente en la consulta.' },
        { id: 'race', peso: 15, texto: '[BLOQUEANTE] Condición de carrera: entre el SELECT y el UPDATE cabe otra petición, así que un cupón de un solo uso se puede canjear N veces.' },
        { id: 'tx', peso: 10, texto: '[BLOQUEANTE] Sin transacción: si el segundo UPDATE falla, el cupón queda consumido y el pedido sin descuento.' },
        { id: 'idem', peso: 10, texto: '[BLOQUEANTE] Sin idempotencia ni comprobación de cupón ya aplicado: reenviar la petición acumula descuentos sobre el mismo pedido.' },
        { id: 'authz', peso: 15, texto: '[BLOQUEANTE] No se comprueba que el pedido pertenezca a `req.user`: cualquiera puede aplicar descuentos al pedido de otro.' },
        { id: 'logs', peso: 5, texto: '[IMPORTANTE] El log vuelca `req.body` completo y el email del usuario: datos personales en el sistema de logs.' },
        { id: 'leak', peso: 4, texto: '[IMPORTANTE] La respuesta devuelve el objeto `cupon` entero, exponiendo campos internos (usos restantes, condiciones, márgenes).' },
        { id: 'enum', peso: 4, texto: '[IMPORTANTE] El 404 repite el código introducido: permite enumerar cupones válidos por fuerza bruta.' },
        { id: 'null', peso: 4, texto: '[IMPORTANTE] `pedido[0].total` sin comprobar que el pedido existe: petición con `pedidoId` inexistente lanza un 500.' },
        { id: 'money', peso: 4, texto: '[IMPORTANTE] Aritmética de dinero en coma flotante y sin redondeo: aparecen totales con quince decimales.' },
        { id: 'expira', peso: 4, texto: '[IMPORTANTE] No se comprueba la fecha de caducidad ni el importe mínimo del cupón.' },
        { id: 'test', peso: 5, texto: '[IMPORTANTE] El test solo cubre el camino feliz: no hay caso de cupón agotado, caducado, concurrente ni de pedido ajeno.' },
        { id: 'tono', peso: 5, texto: 'Comentarios redactados sobre el código y no sobre la persona, con propuesta concreta en cada uno.' }
      ]
    },

    solution: {
      lang: 'javascript',
      code:
'// ===== REVISIÓN =====\n' +
'// Veredicto: SOLICITAR CAMBIOS. Hay cinco bloqueantes; dos permiten\n' +
'// pérdida económica directa. La prisa de la release no cambia esto:\n' +
'// lo que sí propongo es partir el PR y sacar primero la parte segura.\n' +
'\n' +
'// [BLOQUEANTE] L5 — Inyección SQL. `codigo` viene del cuerpo sin sanear.\n' +
'//   Con codigo = "x\' OR \'1\'=\'1" se devuelve el primer cupón de la tabla.\n' +
'//   Propuesta: consulta parametrizada, como ya haces en la línea del pedido.\n' +
'\n' +
'// [BLOQUEANTE] L9-19 — Condición de carrera. Entre leer `usos_restantes`\n' +
'//   y decrementarlo pueden entrar 50 peticiones. Un cupón de un uso se\n' +
'//   canjea 50 veces. Es el patrón clásico de "recurso limitado sin bloqueo".\n' +
'//   Propuesta: decrementar de forma condicional en una sola sentencia y\n' +
'//   comprobar las filas afectadas.\n' +
'\n' +
'// [BLOQUEANTE] L19-20 — Dos escrituras sin transacción. Si la segunda\n' +
'//   falla, el cupón está gastado y el cliente no tiene su descuento.\n' +
'//   Propuesta: envolver ambas en una transacción.\n' +
'\n' +
'// [BLOQUEANTE] L14 — Falta comprobación de propiedad. No se valida que\n' +
'//   `pedido.usuario_id === req.user.id`. Cualquier usuario autenticado\n' +
'//   puede modificar el total del pedido de otro. Es IDOR de manual.\n' +
'\n' +
'// [BLOQUEANTE] — Sin idempotencia. Reenviar la misma petición vuelve a\n' +
'//   aplicar el descuento sobre el total ya rebajado. Dos clics = doble\n' +
'//   descuento. Propuesta: registrar el canje (pedido_id, cupon_id) con\n' +
'//   restricción UNIQUE.\n' +
'\n' +
'// [IMPORTANTE] L22 — El log vuelca el cuerpo completo y el email.\n' +
'// [IMPORTANTE] L24 — Se devuelve el cupón entero: expone datos internos.\n' +
'// [IMPORTANTE] L11 — El 404 repite el código: facilita enumerarlos.\n' +
'// [IMPORTANTE] L15 — `pedido[0]` sin comprobar: 500 con id inexistente.\n' +
'// [IMPORTANTE] L17 — Dinero en coma flotante sin redondear.\n' +
'// [IMPORTANTE] — No se validan caducidad ni importe mínimo.\n' +
'// [IMPORTANTE] — Test solo del camino feliz.\n' +
'\n' +
'// [SUGERENCIA] Extraer la lógica a un servicio `canjearCupon(deps, datos)`:\n' +
'//   hoy no se puede testear sin levantar el servidor HTTP.\n' +
'\n' +
'\n' +
'// ===== CÓMO QUEDARÍA =====\n' +
'router.post("/cupones/canjear", async (req, res, next) => {\n' +
'  const { codigo, pedidoId } = req.body;\n' +
'  if (typeof codigo !== "string" || !codigo.trim() || !Number.isInteger(pedidoId)) {\n' +
'    return res.status(422).json({ error: "DATOS_INVALIDOS" });\n' +
'  }\n' +
'\n' +
'  const tx = await db.transaccion();\n' +
'  try {\n' +
'    // Propiedad del pedido: la autorización va antes que nada.\n' +
'    const [pedido] = await tx.query(\n' +
'      "SELECT id, total, usuario_id FROM pedidos WHERE id = ? AND usuario_id = ?",\n' +
'      [pedidoId, req.user.id]\n' +
'    );\n' +
'    if (!pedido) { await tx.rollback(); return res.status(404).json({ error: "PEDIDO_NO_ENCONTRADO" }); }\n' +
'\n' +
'    // Decremento condicional: la propia base de datos resuelve la carrera.\n' +
'    // Si dos peticiones entran a la vez, solo una afecta a una fila.\n' +
'    const r = await tx.query(\n' +
'      `UPDATE cupones SET usos_restantes = usos_restantes - 1\n' +
'        WHERE codigo = ? AND usos_restantes > 0 AND caduca_el > NOW()`,\n' +
'      [codigo]\n' +
'    );\n' +
'    if (r.affectedRows === 0) {\n' +
'      await tx.rollback();\n' +
'      // Mensaje genérico: no confirmamos si el código existe.\n' +
'      return res.status(409).json({ error: "CUPON_NO_APLICABLE" });\n' +
'    }\n' +
'\n' +
'    const [cupon] = await tx.query("SELECT id, porcentaje FROM cupones WHERE codigo = ?", [codigo]);\n' +
'\n' +
'    // Idempotencia: UNIQUE(pedido_id, cupon_id) impide el doble canje.\n' +
'    try {\n' +
'      await tx.query("INSERT INTO canjes (pedido_id, cupon_id) VALUES (?, ?)", [pedidoId, cupon.id]);\n' +
'    } catch (e) {\n' +
'      await tx.rollback();\n' +
'      return res.status(409).json({ error: "CUPON_YA_APLICADO" });\n' +
'    }\n' +
'\n' +
'    // Dinero en céntimos enteros: nada de coma flotante.\n' +
'    const totalCent = Math.round(pedido.total * 100);\n' +
'    const nuevoTotal = Math.round(totalCent * (100 - cupon.porcentaje) / 100) / 100;\n' +
'\n' +
'    await tx.query("UPDATE pedidos SET total = ? WHERE id = ?", [nuevoTotal, pedidoId]);\n' +
'    await tx.commit();\n' +
'\n' +
'    // Log con identificadores, sin datos personales ni cuerpo completo.\n' +
'    logger.info("cupon.canjeado", { pedidoId, cuponId: cupon.id, usuarioId: req.user.id });\n' +
'\n' +
'    // Respuesta mínima: solo lo que el cliente necesita.\n' +
'    res.json({ nuevoTotal });\n' +
'  } catch (err) {\n' +
'    await tx.rollback();\n' +
'    next(err);   // 500 y alerta desde el manejador central\n' +
'  }\n' +
'});\n'
    },

    walkthrough: [
      { what: 'Ordenamos los hallazgos por impacto económico y de datos, no por orden de aparición.', why: 'Una revisión que mezcla la inyección SQL con el nombre de una variable diluye lo importante. Quien revisa tiene que dirigir la atención.', how: 'Tres niveles: bloqueante, importante y sugerencia, y solo lo bloqueante impide la fusión.' },
      { what: 'La condición de carrera se resuelve con un UPDATE condicional, no con un bloqueo en la aplicación.', why: 'Un `if` en JavaScript no es atómico respecto a la base de datos. La única garantía real está donde está el dato.', how: '`WHERE usos_restantes > 0` dentro del propio UPDATE, y se comprueban las filas afectadas: si son cero, alguien llegó antes.' },
      { what: 'Una transacción envuelve todas las escrituras.', why: 'Sin ella, un fallo intermedio deja al cliente sin descuento y con el cupón gastado, y eso llega a atención al cliente.', how: 'Begin, escrituras, commit, y rollback en el catch.' },
      { what: 'La autorización se comprueba en la misma consulta que lee el pedido.', why: 'Filtrar por `usuario_id` en el WHERE hace imposible olvidar la comprobación después. Separarla en un `if` posterior es el origen habitual del IDOR.', how: '`WHERE id = ? AND usuario_id = ?`.' },
      { what: 'La idempotencia se apoya en una restricción UNIQUE.', why: 'Es la única forma que no depende de que el cliente se porte bien. Un doble clic, un reintento de red o un usuario malicioso chocan igual contra la base de datos.', how: 'Tabla `canjes` con UNIQUE(pedido_id, cupon_id) y traducción del error a 409.' },
      { what: 'El dinero se calcula en enteros.', why: '`0.1 + 0.2` no es `0.3` en coma flotante. En importes se acumulan céntimos que no cuadran en contabilidad.', how: 'Trabajar en céntimos y redondear una sola vez al final.' },
      { what: 'El mensaje de error es genérico y el log estructurado.', why: 'Uno evita enumerar cupones válidos; el otro evita meter datos personales en un sistema con menos control de acceso que la base de datos.', how: 'Código de error estable hacia fuera, identificadores hacia dentro.' },
      { what: 'El veredicto va acompañado de una salida práctica.', why: 'Decir "solicito cambios" el día antes de la release sin proponer alternativa te convierte en un obstáculo. Proponer partir el PR mantiene el estándar y desbloquea al equipo.', how: 'Separar los bloqueantes de seguridad del resto y sacar primero lo que sí está listo.' }
    ],

    rationale:
      'Una buena revisión no es una lista de defectos: es una priorización argumentada más una propuesta. Este PR ' +
      'concentra los cuatro fallos que más aparecen en código de comercio electrónico revisado en entrevistas: ' +
      'inyección, carrera sobre recurso limitado, falta de transacción y ausencia de comprobación de propiedad. ' +
      'Los tres primeros los detecta mucha gente; el IDOR y la idempotencia son los que separan la revisión senior.',

    alternatives: [
      { name: 'Bloqueo pesimista (SELECT … FOR UPDATE)', when: 'Necesitas leer y decidir con lógica compleja antes de escribir.', tradeoff: 'Correcto y explícito, pero serializa el acceso y puede provocar contención en cupones muy populares.' },
      { name: 'Bloqueo optimista con columna de versión', when: 'La contención es baja.', tradeoff: 'Sin bloqueos, a cambio de tener que reintentar cuando falla la comparación.' },
      { name: 'Reserva del cupón en dos fases', when: 'El proceso de compra es largo.', tradeoff: 'Evita que el usuario pierda el cupón al final del embudo; añade estado y expiraciones que mantener.' },
      { name: 'Contador atómico en Redis', when: 'Volumen muy alto de canjeos.', tradeoff: 'Muy rápido, pero introduce dos fuentes de verdad que hay que reconciliar.' }
    ],

    commonErrors: [
      { error: 'Aprobar porque los tests pasan y el CI está verde.', why: 'Los tests cubren el camino feliz. Ninguno de los cinco bloqueantes se manifiesta con una petición secuencial y correcta.', fix: 'El CI verde es un requisito, no un criterio de aprobación.' },
      { error: 'Detectar solo la inyección SQL.', why: 'Es el fallo más visible, pero la condición de carrera y el IDOR tienen impacto igual o mayor y son más difíciles de encontrar después en producción.', fix: 'Revisa por categorías: entrada, autorización, concurrencia, consistencia, salida.' },
      { error: 'Comentarios sin propuesta ("esto está mal").', why: 'Genera una segunda ronda para averiguar qué querías decir y desgasta la relación con el equipo.', fix: 'Problema, impacto y propuesta concreta en cada comentario.' },
      { error: 'Marcar todo como bloqueante.', why: 'Si todo bloquea, nada bloquea: el autor deja de distinguir lo urgente.', fix: 'Reserva bloqueante para pérdida de datos, dinero o seguridad.' },
      { error: 'Ceder por la prisa de la release.', why: 'Un canjeo de cupones explotable cuesta más que un día de retraso, y el precedente convierte la excepción en norma.', fix: 'Mantener el criterio y ofrecer un camino: partir el PR o desplegar con la funcionalidad desactivada.' },
      { error: 'Revisar solo el código añadido.', why: 'Lo que falta (transacción, autorización, tests de concurrencia) no aparece en el diff. Los peores fallos son ausencias.', fix: 'Pregúntate siempre qué debería estar y no está.' }
    ],

    bestPractices: [
      'Revisa en este orden: seguridad, corrección, concurrencia, legibilidad, estilo.',
      'Etiqueta la gravedad de cada comentario para que el autor sepa qué bloquea.',
      'Comenta sobre el código, nunca sobre la persona.',
      'Distingue lo que es tu opinión de lo que es un estándar del equipo.',
      'Reconoce explícitamente lo que está bien hecho: una revisión solo negativa se recibe peor y se aplica peor.'
    ],

    security: [
      'Inyección SQL por interpolación de cadena.',
      'IDOR: acceso a un recurso ajeno por falta de comprobación de propiedad.',
      'Enumeración de cupones mediante mensajes de error específicos.',
      'Datos personales en logs.',
      'Exposición de campos internos en la respuesta de la API.'
    ],

    performance: [
      'Cuatro idas y vueltas a la base de datos donde caben dos.',
      'Sin índice en `cupones.codigo`, cada canjeo hace un recorrido completo de la tabla.',
      'El bloqueo pesimista sobre un cupón muy usado puede serializar todo el proceso de compra: mídelo antes de elegirlo.'
    ],

    companyLooksFor: [
      'Priorización: que el primer comentario sea el más grave.',
      'Que detectes lo que falta, no solo lo que sobra.',
      'Tono profesional bajo presión de calendario.',
      'Un veredicto claro y argumentado.',
      'Que propongas cómo desbloquear al equipo sin bajar el listón.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Detección de los bloqueantes de seguridad (inyección, IDOR)', weight: 30 },
        { criteria: 'Detección de concurrencia, transacción e idempotencia', weight: 30 },
        { criteria: 'Clasificación por gravedad coherente', weight: 15 },
        { criteria: 'Propuestas concretas y aplicables', weight: 15 },
        { criteria: 'Comunicación y veredicto', weight: 10 }
      ]
    },

    reinforce: [
      'OWASP Top 10, en especial control de acceso roto e inyección.',
      'Niveles de aislamiento de transacciones y bloqueo optimista frente a pesimista.',
      'Idempotencia en APIs de pago.',
      'Prueba antes: `be-refactor-produccion`.'
    ]
  });

  /* ------------------------------------------------------------------
     2. Frontend Developer Challenge
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'emp-frontend-challenge',
    empresa: {
      empresas: ['github', 'shopify'],
      evidencia: 'documentada',
      puesto: 'Frontend Engineer',
      rol: 'frontend',
      formato: 'take-home',
      dificultad: 3,
      evalua: [
        'Entrega con límite de tiempo declarado y evaluada con rúbrica: el formato que GitHub describe en su blog de ingeniería.',
        'Saber qué dejar fuera: entregar de más no suma puntos.',
        'Decisiones de producto y de accesibilidad justificadas por escrito.'
      ],
      nota: 'GitHub publica el formato de su take-home (límite de tiempo, entrega anonimizada, rúbrica y scorecard en el Pull Request) y Shopify el suyo de ejercicio práctico. El enunciado del ejercicio es nuestro.',
      fuentes: [
        { titulo: 'How GitHub does take home technical interviews — The GitHub Blog', url: 'https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/' },
        { titulo: 'Shopify’s Technical Interview Process', url: 'https://shopify.engineering/nail-your-technical-shopify-interview' }
      ]
    },
    categorias: ['frontend', 'testing'],
    title: 'Frontend Developer Challenge: panel de incidencias',
    category: 'company',
    kind: 'build',
    level: 'mid',
    time: 240,
    tags: ['take-home', 'React', 'accesibilidad', 'testing'],

    context:
      'Prueba para llevar a casa de una empresa de software de logística. Te dan 48 horas y esperan entre 3 y 4 horas ' +
      'de trabajo. En la ronda siguiente te pedirán que defiendas cada decisión: en 2026 casi todas las empresas asumen ' +
      'que has usado IA y lo que evalúan es si entiendes y justificas lo que has entregado.',

    situation:
      'Necesitan un panel donde el equipo de operaciones vea las incidencias abiertas, filtre, ordene y cambie el estado ' +
      'de cada una. La API existe y está documentada. El diseño te lo dan en Figma, pero aceptan una interpretación ' +
      'razonable si justificas las decisiones.',

    goal:
      'Entregar una aplicación pequeña pero completa: consumo de API, gestión de estado, filtros, responsive, ' +
      'accesible, con manejo de errores y con tests que aporten algo.',

    tech: ['React', 'TypeScript', 'Vitest', 'CSS'],
    skills: ['consumo de APIs', 'gestión de estado', 'accesibilidad', 'testing', 'diseño responsive', 'toma de decisiones técnicas'],

    starter: {
      lang: 'markdown',
      code:
'## Especificación funcional\n' +
'\n' +
'GET  /api/incidencias?estado=&prioridad=&pagina=   -> { items, total, pagina, porPagina }\n' +
'PATCH /api/incidencias/:id                          -> { ...incidencia }   body: { estado }\n' +
'\n' +
'Incidencia = {\n' +
'  id: string, titulo: string, descripcion: string,\n' +
'  estado: "abierta" | "en_curso" | "resuelta",\n' +
'  prioridad: "baja" | "media" | "alta" | "critica",\n' +
'  creadaEl: string (ISO), asignadaA: { id, nombre } | null\n' +
'}\n' +
'\n' +
'La API responde 429 si haces más de 30 peticiones por minuto.\n' +
'La API tarda entre 200 ms y 3 s. Un 5 % de las peticiones falla con 503.\n' +
'\n' +
'## Historias de usuario\n' +
'\n' +
'1. Como operador quiero ver las incidencias abiertas ordenadas por prioridad\n' +
'   para atender antes lo urgente.\n' +
'2. Como operador quiero filtrar por estado y prioridad y que el filtro se\n' +
'   conserve al recargar la página, para no perder el contexto.\n' +
'3. Como operador quiero cambiar el estado de una incidencia desde la lista\n' +
'   sin abrir el detalle, para ir rápido.\n' +
'4. Como operador quiero saber si algo ha fallado y poder reintentar, para no\n' +
'   quedarme sin saber si mi cambio se guardó.\n' +
'5. Como responsable quiero usarlo desde el móvil durante una guardia.\n' +
'\n' +
'## Qué entregar\n' +
'\n' +
'- Repositorio con historial de commits legible.\n' +
'- README con: decisiones tomadas, qué dejarías fuera, qué harías con más tiempo.\n' +
'- Instrucciones de arranque que funcionen a la primera.\n'
    },

    requirements: [
      'Listado con los cinco estados de vista resueltos: cargando, error, vacío, sin resultados y con datos.',
      'Filtros por estado y prioridad, persistidos en la URL (no en estado local): así el filtro sobrevive a la recarga y el enlace se puede compartir.',
      'Cambio de estado desde la lista con actualización optimista y reversión si la API falla.',
      'Manejo del 503 con reintento y del 429 respetando el límite.',
      'Navegable por teclado completo y usable con lector de pantalla.',
      'Responsive real: la tabla debe seguir siendo utilizable en 375 px de ancho.',
      'Tests que cubran al menos: filtrado, reversión de la actualización optimista y estado de error.',
      'README con las decisiones y sus motivos.'
    ],

    optional: [
      'Paginación o scroll infinito con anuncio accesible del contenido nuevo.',
      'Búsqueda de texto con debounce.',
      'Modo oscuro.',
      'Métrica de tiempo hasta el primer dato útil.'
    ],

    hints: [
      'Con 3 horas no cabe todo. Lo que se valora es que elijas bien qué dejas fuera y lo escribas en el README. Entregar la mitad sin explicar es lo que suspende.',
      'La actualización optimista es el punto que más diferencia candidatos: cambiar el estado en pantalla al instante y revertir si la API falla demuestra que piensas en el usuario y en el fallo a la vez.',
      'Guardar los filtros en la URL sale casi gratis con `URLSearchParams` y resuelve dos historias a la vez.',
      'Tres tests que comprueben comportamiento valen más que veinte que comprueben que un `div` existe.',
      'Un commit por unidad de trabajo con mensaje descriptivo. El historial forma parte de la entrega.'
    ],

    docs: {
      resumen:
        'Una prueba para llevar a casa no mide si sabes React: eso se da por supuesto. Mide **criterio bajo ' +
        'restricción de tiempo**. Esta documentación te da las técnicas concretas que la rúbrica puntúa y, ' +
        'sobre todo, el método para decidir qué construir y qué dejar fuera.',

      conceptos: [
        {
          titulo: 'Los detalles del enunciado son requisitos encubiertos',
          texto:
            'Lee otra vez la especificación. Dice tres cosas que parecen contexto y son trampas de lectura ' +
            'deliberadas:\n' +
            '**"La API tarda entre 200 ms y 3 s"** → tu interfaz no puede asumir respuestas instantáneas. ' +
            'Necesita esqueletos de carga y actualización optimista.\n' +
            '**"Un 5 % de las peticiones falla con 503"** → necesitas manejo de errores y reintento. No es ' +
            'opcional: te están diciendo que va a fallar.\n' +
            '**"429 si haces más de 30 peticiones por minuto"** → si pones un buscador sin debounce, chocas.\n' +
            'Quien ignora estos datos ha fallado justo la parte que se evaluaba. Es el filtro más barato que ' +
            'tiene la empresa.',
          codigo:
'// Señales del enunciado -> requisitos reales\n' +
'//\n' +
'//   "tarda hasta 3 s"        -> esqueleto + actualización optimista\n' +
'//   "5 % falla con 503"      -> estado de error + reintento visible\n' +
'//   "429 a las 30 peticiones"-> debounce en la búsqueda\n' +
'//   "48 horas / 3-4 horas"   -> hay que recortar, y decirlo en el README\n' +
'//   "5 historias de usuario" -> priorizar, no intentar las cinco a medias'
        },
        {
          titulo: 'Gestión del alcance: lo que más puntúa y casi nadie hace',
          texto:
            'Con 3 horas y 5 historias **no cabe todo**. La rúbrica reparte puntos entre ocho áreas: pulir una ' +
            'y dejar tres en blanco baja la nota total más que hacer las ocho de forma correcta.\n' +
            'El error clásico es dedicar dos horas a que la tabla quede preciosa y entregar sin tests, sin ' +
            'README y sin manejo de errores.\n' +
            'La regla es **recorrido completo antes que perfección parcial**: que todo funcione de principio a ' +
            'fin, aunque sea sencillo, y después refinar con el tiempo que sobre.\n' +
            'Un reparto que funciona: 30 min de estructura y capa de datos, 60 de listado y filtros, 40 de ' +
            'cambio de estado y errores, 30 de accesibilidad y responsive, 20 de tests y 20 de README.',
          codigo:
'// Prioriza por lo que la rúbrica pesa, no por lo que te apetece\n' +
'//\n' +
'//   25 %  funcionalidad de las historias priorizadas\n' +
'//   20 %  estados, errores y latencia\n' +
'//   20 %  accesibilidad y responsive\n' +
'//   15 %  tests con valor real\n' +
'//   20 %  README, commits y criterio de alcance\n' +
'//\n' +
'// El CSS bonito no aparece en ninguna línea.'
        },
        {
          titulo: 'Actualización optimista: el punto que más diferencia candidatos',
          texto:
            'Con 3 segundos de latencia, esperar la respuesta antes de mover nada en pantalla hace la ' +
            'aplicación inusable. La **actualización optimista** aplica el cambio en local al instante, lanza ' +
            'la petición y **revierte** si falla.\n' +
            'La parte que se evalúa no es el "optimista": es la **reversión**. Sin ella, el operador cree que ' +
            'guardó y no guardó, que es peor que no tener la funcionalidad.\n' +
            'Y el aviso de fallo debe ofrecer reintentar, no solo informar.',
          codigo:
'async function cambiarEstado(id, nuevo) {\n' +
'  const previo = estadoActual(id);\n' +
'\n' +
'  aplicarLocal(id, nuevo);                  // la interfaz responde YA\n' +
'\n' +
'  try {\n' +
'    await api.patch(id, { estado: nuevo });\n' +
'  } catch (e) {\n' +
'    aplicarLocal(id, previo);               // ← esto es lo que puntúa\n' +
'    mostrarAviso("No se pudo guardar el cambio", {\n' +
'      reintentar: () => cambiarEstado(id, nuevo)\n' +
'    });\n' +
'  }\n' +
'}'
        },
        {
          titulo: 'Los filtros viven en la URL, no en el estado del componente',
          texto:
            'La historia 2 pide que el filtro sobreviva a la recarga. Guardarlo en `useState` no lo consigue; ' +
            'guardarlo en la URL sí, **y además** hace la aplicación enlazable, que es justo lo que necesita ' +
            'un equipo de guardia que se pasa incidencias por chat.\n' +
            'La URL pasa a ser la fuente de verdad y el estado de React se deriva de ella. Con React Router es ' +
            '`useSearchParams`; sin él, `URLSearchParams` más `history.replaceState`.\n' +
            'Usa `replaceState` en vez de `pushState` para los filtros: si no, el botón Atrás recorre cada ' +
            'letra que escribió el usuario.',
          codigo:
'// Leer\n' +
'const params = new URLSearchParams(location.search);\n' +
'const estado = params.get("estado") || "";\n' +
'\n' +
'// Escribir sin ensuciar el historial\n' +
'function actualizarFiltros(nuevos) {\n' +
'  const p = new URLSearchParams();\n' +
'  Object.entries(nuevos).forEach(([k, v]) => { if (v) p.set(k, v); });\n' +
'  const qs = p.toString();\n' +
'  history.replaceState(null, "", qs ? "?" + qs : location.pathname);\n' +
'}\n' +
'\n' +
'// Resuelve dos historias (persistencia + compartir) casi gratis.'
        },
        {
          titulo: 'Arquitectura mínima que el revisor entiende en dos minutos',
          texto:
            'El revisor le dedicará quince minutos. Una estructura clara vale más que una sofisticada.\n' +
            'La regla que lo ordena todo: **el componente no sabe hacer fetch y el cliente HTTP no sabe de ' +
            'React**. Esa separación es la que hace que los tests sean rápidos y que el proyecto se entienda ' +
            'de un vistazo.\n' +
            'Y cada dependencia que añades se justifica en el README o no entra: cinco librerías para un panel ' +
            'pequeño sugiere falta de criterio.',
          codigo:
'src/\n' +
'  api/                     cliente HTTP: reintentos, timeout, tipos\n' +
'  features/incidencias/\n' +
'    useIncidencias.ts      consulta, caché y estados derivados\n' +
'    ListaIncidencias.tsx   render puro a partir de props\n' +
'    FilaIncidencia.tsx     cambio de estado optimista\n' +
'    filtros.ts             lectura y escritura de la URL\n' +
'  ui/                      componentes sin lógica de dominio'
        },
        {
          titulo: 'Accesibilidad concreta: qué mirar en 30 minutos',
          texto:
            'No hace falta una auditoría completa. Con estos cinco puntos cubres lo que la rúbrica busca:\n' +
            '**Elementos nativos.** `<button>` y `<select>` de verdad, nunca un `<div onClick>`. Un div no ' +
            'recibe foco ni responde a Enter.\n' +
            '**Tabla real** con `<th scope="col">` si los datos son tabulares.\n' +
            '**Regiones vivas**: `role="status"` para anunciar "12 incidencias" al filtrar, `role="alert"` ' +
            'para los errores.\n' +
            '**El foco no se pierde** al actualizar la lista.\n' +
            '**Contraste** suficiente: los textos gris claro sobre blanco son el incumplimiento más común.\n' +
            'Comprobación rápida: recorre toda la aplicación **solo con el teclado**. Si no puedes hacer algo, ' +
            'ahí está el fallo.',
          codigo:
'<table>\n' +
'  <thead><tr><th scope="col">Título</th><th scope="col">Prioridad</th></tr></thead>\n' +
'  <tbody>\n' +
'    <tr>\n' +
'      <td>Camión averiado</td>\n' +
'      <td>\n' +
'        <select aria-label="Estado de la incidencia 1042">…</select>\n' +
'      </td>\n' +
'    </tr>\n' +
'  </tbody>\n' +
'</table>\n' +
'\n' +
'<div role="status" aria-live="polite" class="sr-only">12 incidencias</div>\n' +
'<div role="alert">No se pudo guardar. <button>Reintentar</button></div>'
        },
        {
          titulo: 'Tres tests elegidos por riesgo, no por cobertura',
          texto:
            'Veinte tests de "renderiza sin fallar" no dicen nada y el revisor lo nota. Un test que no puede ' +
            'fallar no aporta.\n' +
            'Elige por **qué puede romperse de verdad**:\n' +
            '**1.** Al filtrar por prioridad crítica solo quedan las críticas.\n' +
            '**2.** Si el PATCH falla, la fila vuelve a su estado anterior y aparece el aviso.\n' +
            '**3.** Si la carga inicial falla, se ve el error con botón de reintento.\n' +
            'Y prueba **comportamiento, no implementación**: busca por texto y por rol accesible, no por ' +
            'clases CSS ni por estructura interna. Así el test sobrevive a un refactor.',
          codigo:
'test("revierte el cambio si la API falla", async () => {\n' +
'  api.patch.mockRejectedValue(new Error("503"));\n' +
'  render(<Panel />);\n' +
'\n' +
'  await userEvent.selectOptions(\n' +
'    await screen.findByRole("combobox", { name: /estado/i }), "resuelta");\n' +
'\n' +
'  expect(await screen.findByRole("alert")).toBeInTheDocument();\n' +
'  expect(screen.getByRole("combobox", { name: /estado/i })).toHaveValue("abierta");\n' +
'});\n' +
'\n' +
'// Por rol y por texto: sobrevive a cualquier cambio de CSS o de estructura.'
        },
        {
          titulo: 'El README es parte del producto, no documentación',
          texto:
            'Es lo que convierte cada recorte en una **decisión defendible** en vez de en un olvido. Sin él, el ' +
            'revisor no puede distinguir uno de otro, y ante la duda asume lo segundo.\n' +
            'Diez minutos de README suben más la nota que una hora de CSS. Tres secciones bastan: qué decidiste ' +
            'y por qué, qué dejaste fuera conscientemente, y qué harías con más tiempo.\n' +
            'Además es el guion de la ronda de defensa: llegas con tus argumentos ya escritos.',
          codigo:
'## Decisiones\n' +
'- Sin librería de estado: con una vista y un recurso, useState + un hook\n' +
'  basta. Con dos recursos más metería React Query por la caché.\n' +
'- Filtros en la URL: compartibles y sobreviven a la recarga (historia 2).\n' +
'- Actualización optimista: el enunciado indica hasta 3 s de latencia.\n' +
'\n' +
'## Fuera de alcance (consciente)\n' +
'- Paginación: solo la primera página. Con más tiempo, paginación por cursor.\n' +
'- Sin i18n: no aparece en los requisitos.\n' +
'\n' +
'## Con dos horas más\n' +
'- Tests de accesibilidad automatizados y virtualización de la lista.\n' +
'\n' +
'## Uso de IA\n' +
'- Generé el andamiaje de la tabla y lo reescribí para usar <th scope>.\n' +
'- Revisé el manejo de errores: la primera versión no contemplaba el 503.'
        },
        {
          titulo: 'La ronda de defensa y el uso de IA',
          texto:
            'Casi todas las empresas permiten usar IA en una prueba para llevar a casa y muchas lo esperan. Lo ' +
            'que evalúan es otra cosa:\n' +
            '**Que entiendas cada línea** y puedas explicarla. Esta ronda existe precisamente para eso, y es ' +
            'donde cae la mayoría.\n' +
            '**Que hayas revisado lo generado.** El código de IA tiende a producir HTML no semántico, ARIA ' +
            'incorrecto, manejo de errores optimista y tests que solo cubren el camino feliz: justo las cuatro ' +
            'cosas que más pesan en esta rúbrica.\n' +
            '**Que el resultado sea coherente**, no un collage de estilos distintos.\n' +
            'Mencionar en el README qué generaste y qué revisaste suma. Fingir que no lo usaste y no saber ' +
            'explicar tu propio código es lo que descarta.',
          codigo:
'// Preguntas típicas de la ronda de defensa\n' +
'//\n' +
'//   "¿Por qué guardaste los filtros en la URL y no en el estado?"\n' +
'//   "¿Qué pasa si el PATCH falla a mitad? Enséñamelo."\n' +
'//   "¿Por qué este test y no otro?"\n' +
'//   "¿Qué quitarías si tuvieras que entregar en una hora?"\n' +
'//   "Aquí usas useCallback. ¿Qué problema resuelve exactamente?"\n' +
'//\n' +
'// Si alguna línea no la puedes defender, reescríbela antes de entregar.'
        }
      ],

      referencia: [
        { nombre: 'URLSearchParams', texto: 'Lee y construye la query string. `get`, `set`, `toString`.' },
        { nombre: 'history.replaceState(null, "", url)', texto: 'Cambia la URL sin añadir entrada al historial. Lo correcto para filtros.' },
        { nombre: 'useSearchParams (React Router)', texto: 'Equivalente idiomático en React: estado sincronizado con la URL.' },
        { nombre: 'AbortController', texto: 'Cancela un `fetch` en curso. Úsalo en la limpieza del efecto para no actualizar componentes desmontados.' },
        { nombre: 'useEffect(() => { … return limpieza; })', texto: 'La función devuelta se ejecuta al desmontar. Ahí van cancelaciones y temporizadores.' },
        { nombre: 'screen.getByRole(rol, { name })', texto: 'Testing Library: busca por rol accesible. Prueba comportamiento y además valida accesibilidad.' },
        { nombre: 'findBy…', texto: 'Versión asíncrona: espera a que el elemento aparezca. Necesaria con datos que tardan.' },
        { nombre: 'aria-live="polite" / role="alert"', texto: 'Anunciar cambios sin interrumpir / interrumpiendo. Recuento y errores respectivamente.' },
        { nombre: '<th scope="col">', texto: 'Asocia la cabecera con su columna para el lector de pantalla.' },
        { nombre: 'HTTP 429 / 503', texto: 'Límite de peticiones superado / servicio no disponible. El enunciado avisa de ambos.' }
      ],

      ejemplo: {
        titulo: 'Fragmento de referencia: fila con cambio optimista y filtros en la URL',
        codigo:
'// ---------- filtros.ts : la URL es la fuente de verdad ----------\n' +
'export function leerFiltros() {\n' +
'  const p = new URLSearchParams(location.search);\n' +
'  return { estado: p.get("estado") || "", prioridad: p.get("prioridad") || "" };\n' +
'}\n' +
'\n' +
'export function escribirFiltros(f) {\n' +
'  const p = new URLSearchParams();\n' +
'  if (f.estado) p.set("estado", f.estado);\n' +
'  if (f.prioridad) p.set("prioridad", f.prioridad);\n' +
'  const qs = p.toString();\n' +
'  history.replaceState(null, "", qs ? "?" + qs : location.pathname);\n' +
'}\n' +
'\n' +
'\n' +
'// ---------- api/cliente.ts : reintentos donde corresponde ----------\n' +
'const REINTENTABLES = [429, 502, 503, 504];\n' +
'\n' +
'export async function pedir(url, opciones = {}, intentos = 3) {\n' +
'  for (let i = 1; i <= intentos; i++) {\n' +
'    const res = await fetch(url, opciones);\n' +
'    if (!REINTENTABLES.includes(res.status)) {\n' +
'      if (!res.ok) throw new Error("HTTP " + res.status);\n' +
'      return res.json();\n' +
'    }\n' +
'    if (i === intentos) throw new Error("HTTP " + res.status);\n' +
'    const espera = Number(res.headers.get("retry-after")) * 1000\n' +
'                || 300 * 2 ** (i - 1) + Math.random() * 300;\n' +
'    await new Promise(r => setTimeout(r, espera));\n' +
'  }\n' +
'}\n' +
'\n' +
'\n' +
'// ---------- FilaIncidencia.tsx : optimista CON reversión ----------\n' +
'function FilaIncidencia({ incidencia, onCambio }) {\n' +
'  const [estado, setEstado] = useState(incidencia.estado);\n' +
'  const [error, setError] = useState(null);\n' +
'\n' +
'  async function cambiar(nuevo) {\n' +
'    const previo = estado;\n' +
'    setEstado(nuevo);            // 1. la interfaz responde al instante\n' +
'    setError(null);\n' +
'\n' +
'    try {\n' +
'      await pedir(`/api/incidencias/${incidencia.id}`, {\n' +
'        method: "PATCH",\n' +
'        headers: { "Content-Type": "application/json" },\n' +
'        body: JSON.stringify({ estado: nuevo })\n' +
'      });\n' +
'      onCambio(incidencia.id, nuevo);\n' +
'    } catch (e) {\n' +
'      setEstado(previo);         // 2. reversión: esto es lo que puntúa\n' +
'      setError("No se pudo guardar");\n' +
'    }\n' +
'  }\n' +
'\n' +
'  return (\n' +
'    <tr>\n' +
'      <td>{incidencia.titulo}</td>\n' +
'      <td>\n' +
'        {/* control nativo: foco y teclado gratis */}\n' +
'        <select\n' +
'          value={estado}\n' +
'          aria-label={`Estado de la incidencia ${incidencia.id}`}\n' +
'          onChange={e => cambiar(e.target.value)}\n' +
'        >\n' +
'          <option value="abierta">Abierta</option>\n' +
'          <option value="en_curso">En curso</option>\n' +
'          <option value="resuelta">Resuelta</option>\n' +
'        </select>\n' +
'\n' +
'        {error && (\n' +
'          <span role="alert">\n' +
'            {error} <button type="button" onClick={() => cambiar(estado)}>Reintentar</button>\n' +
'          </span>\n' +
'        )}\n' +
'      </td>\n' +
'    </tr>\n' +
'  );\n' +
'}',
        texto:
          'Estos tres fragmentos cubren tres de las áreas mejor puntuadas y se escriben en menos de una hora ' +
          'entre los tres. Son el mejor uso posible de tu tiempo.\n' +
          'Fíjate en lo que **no** hay: ni librería de estado, ni componentes genéricos, ni abstracciones ' +
          'prematuras. El código es directo y se entiende de una lectura, que es exactamente lo que busca ' +
          'quien revisa.\n' +
          'Y en lo que **sí** hay: reversión explícita en el `catch`, un control nativo con `aria-label`, un ' +
          '`role="alert"` que además ofrece reintentar, y reintentos solo en los códigos que lo merecen.\n' +
          'Este es el nivel de detalle que separa un aprobado de una oferta. No necesitas más.'
      },

      glosario: [
        { termino: 'Prueba para llevar a casa (take-home)', definicion: 'Ejercicio que se resuelve sin supervisión en un plazo. Desde 2026 casi siempre va seguido de una ronda de defensa.' },
        { termino: 'Ronda de defensa', definicion: 'Entrevista en directo donde explicas tu entrega y justificas cada decisión. Es la ronda que no se puede fingir.' },
        { termino: 'Actualización optimista', definicion: 'Aplicar el cambio en la interfaz antes de confirmar con el servidor, revirtiendo si falla.' },
        { termino: 'Reversión (rollback de UI)', definicion: 'Devolver la interfaz a su estado anterior cuando la petición falla. La parte que de verdad se evalúa.' },
        { termino: 'Fuente de verdad', definicion: 'El sitio donde vive el dato real. Para los filtros, la URL; el estado del componente se deriva de ella.' },
        { termino: 'Debounce', definicion: 'Agrupar una ráfaga de eventos en una sola ejecución. Aquí, evitar el 429 al escribir en el buscador.' },
        { termino: 'Esqueleto (skeleton)', definicion: 'Marcador visual del contenido mientras carga. Debe reservar el mismo espacio para no provocar saltos de layout.' },
        { termino: 'CLS', definicion: 'Métrica de cuánto salta el contenido al cargar. Se evita reservando espacio.' },
        { termino: 'Rol accesible', definicion: 'Qué es un elemento para las tecnologías de apoyo. Buscar por rol en los tests valida accesibilidad de paso.' },
        { termino: 'Alcance consciente', definicion: 'Decidir y documentar qué no se construye. Convierte un hueco en una decisión defendible.' }
      ],

      preparado: [
        '¿Qué tres datos del enunciado son en realidad requisitos encubiertos?',
        '¿Por qué es peor entregar una parte perfecta que ocho partes correctas?',
        '¿Cuál es la parte de la actualización optimista que realmente se puntúa?',
        '¿Por qué los filtros van en la URL y no en `useState`, y por qué `replaceState` y no `pushState`?',
        '¿Sabrías nombrar los tres tests que elegirías y justificar por qué esos?',
        '¿Qué tres secciones debe tener el README?',
        '¿Qué cuatro cosas suele hacer mal el código generado por IA que además son las que más pesan aquí?',
        '¿Podrías defender ahora mismo, en voz alta, cada decisión que piensas tomar?'
      ]
    },

    tests: {
      mode: 'checklist',
      titulo: 'Autoevaluación con la rúbrica real. Sé honesto: la rúbrica es la de la empresa, no la tuya.',
      items: [
        { id: 'estados', peso: 12, texto: 'Los cinco estados de vista están implementados y son visualmente distintos.' },
        { id: 'url', peso: 10, texto: 'Los filtros viven en la URL y sobreviven a una recarga.' },
        { id: 'optimista', peso: 12, texto: 'El cambio de estado es optimista y revierte correctamente cuando la API falla.' },
        { id: 'errores', peso: 10, texto: 'Los 503 se reintentan y los 429 se respetan; el usuario siempre sabe qué ha pasado.' },
        { id: 'a11y', peso: 12, texto: 'Se puede operar entero con teclado y los cambios se anuncian con regiones vivas.' },
        { id: 'responsive', peso: 8, texto: 'Es utilizable en 375 px sin scroll horizontal.' },
        { id: 'tests', peso: 12, texto: 'Los tests cubren comportamiento (filtrado, reversión, error), no solo renderizado.' },
        { id: 'readme', peso: 10, texto: 'El README explica decisiones, recortes conscientes y siguientes pasos.' },
        { id: 'commits', peso: 6, texto: 'El historial de commits se entiende sin leer el código.' },
        { id: 'defensa', peso: 8, texto: 'Puedo justificar en voz alta cada decisión y cada línea, incluida la generada con IA.' }
      ]
    },

    solution: {
      lang: 'markdown',
      code:
'# Cómo se resuelve bien esta prueba\n' +
'\n' +
'No hay una única solución correcta. Sí hay una forma correcta de abordarla.\n' +
'\n' +
'## 1. Los primeros 20 minutos no se programa\n' +
'\n' +
'Lee la especificación entera, apunta las ambigüedades y decide el alcance.\n' +
'Con 3 horas el reparto que funciona es aproximadamente:\n' +
'\n' +
'  30 min   estructura, capa de datos y tipos\n' +
'  60 min   listado, estados y filtros en URL\n' +
'  40 min   cambio de estado optimista y manejo de errores\n' +
'  30 min   accesibilidad y responsive\n' +
'  20 min   tests\n' +
'  20 min   README y limpieza\n' +
'\n' +
'El error clásico es dedicar 2 horas a que la tabla quede preciosa y entregar\n' +
'sin tests, sin README y sin manejo de errores. La rúbrica pesa al revés.\n' +
'\n' +
'## 2. Arquitectura mínima que aguanta\n' +
'\n' +
'  src/\n' +
'    api/            cliente HTTP: reintentos, timeout, tipado de respuestas\n' +
'    features/incidencias/\n' +
'      useIncidencias.ts    consulta, caché y estados derivados\n' +
'      ListaIncidencias.tsx render puro a partir de props\n' +
'      FilaIncidencia.tsx   cambio de estado optimista\n' +
'      filtros.ts           lectura y escritura de la URL\n' +
'    ui/             componentes sin lógica de dominio\n' +
'\n' +
'Regla: el componente no sabe hacer fetch y el cliente HTTP no sabe de React.\n' +
'Esa separación es lo que hace que los tests sean rápidos y que el revisor\n' +
'entienda el proyecto en dos minutos.\n' +
'\n' +
'## 3. Actualización optimista, el punto que más diferencia\n' +
'\n' +
'  async function cambiarEstado(id, nuevo) {\n' +
'    const previo = estadoActual(id);\n' +
'    aplicarLocal(id, nuevo);                 // la interfaz responde ya\n' +
'    try {\n' +
'      await api.patch(id, { estado: nuevo });\n' +
'    } catch (e) {\n' +
'      aplicarLocal(id, previo);              // revertimos\n' +
'      mostrarAviso("No se pudo guardar el cambio", { reintentar: () => cambiarEstado(id, nuevo) });\n' +
'    }\n' +
'  }\n' +
'\n' +
'Qué demuestra: que piensas en la latencia de 3 s que dice el enunciado y en\n' +
'el 5 % de fallos. Sin reversión, el operador cree que guardó y no guardó.\n' +
'\n' +
'## 4. Los filtros van en la URL\n' +
'\n' +
'Resuelve la historia 2 y además hace la aplicación enlazable y depurable.\n' +
'Con React Router es `useSearchParams`; sin él, `URLSearchParams` e `history.replaceState`.\n' +
'\n' +
'## 5. Accesibilidad concreta, no genérica\n' +
'\n' +
'  - La lista es una `<table>` real con `<th scope="col">` si son datos tabulares.\n' +
'  - El cambio de estado es un `<select>` o un menú con patrón ARIA completo,\n' +
'    nunca un `<div onClick>`.\n' +
'  - `<div role="status" aria-live="polite">` anuncia "12 incidencias" al filtrar.\n' +
'  - Los errores usan `role="alert"`.\n' +
'  - El foco no se pierde al actualizar la lista.\n' +
'\n' +
'## 6. Tres tests bien elegidos\n' +
'\n' +
'  1. Al filtrar por prioridad crítica solo quedan las críticas.\n' +
'  2. Si el PATCH falla, la fila vuelve a su estado anterior y aparece el aviso.\n' +
'  3. Si la carga inicial falla, se muestra el error con botón de reintento.\n' +
'\n' +
'Cubren las tres cosas que pueden romper de verdad. Veinte tests de\n' +
'"renderiza sin fallar" no dicen nada y el revisor lo nota.\n' +
'\n' +
'## 7. El README es parte de la prueba\n' +
'\n' +
'  ## Decisiones\n' +
'  - Sin librería de estado: con una vista y un recurso, useState + un hook basta.\n' +
'    Con dos recursos más metería React Query por la caché y la deduplicación.\n' +
'  - Filtros en la URL para que sean compartibles y sobrevivan a la recarga.\n' +
'  - Actualización optimista porque la API tarda hasta 3 s.\n' +
'\n' +
'  ## Fuera de alcance (consciente)\n' +
'  - Paginación: implementada solo la primera página. Con más tiempo, cursor.\n' +
'  - Sin i18n: no aparece en los requisitos.\n' +
'\n' +
'  ## Con dos horas más\n' +
'  - Tests de accesibilidad automatizados y virtualización de la lista.\n' +
'\n' +
'Esto convierte cada recorte en una decisión defendible en vez de en un olvido.\n' +
'\n' +
'## 8. Sobre el uso de IA\n' +
'\n' +
'Casi todas las empresas lo permiten y muchas lo esperan. Lo que evalúan es:\n' +
'\n' +
'  - Que entiendas cada línea entregada y puedas explicarla.\n' +
'  - Que hayas revisado lo generado: el código de IA tiende a producir HTML\n' +
'    no semántico, ARIA incorrecto, manejo de errores optimista y tests que\n' +
'    solo cubren el camino feliz. Justo lo que pesa en esta rúbrica.\n' +
'  - Que el resultado sea coherente y no un collage de estilos distintos.\n' +
'\n' +
'Mencionar en el README qué generaste y qué revisaste suma. Fingir que no lo\n' +
'usaste y no saber explicar tu propio código es lo que descarta.\n'
    },

    walkthrough: [
      { what: 'Se decide el alcance antes de escribir código.', why: 'Una prueba de 3 horas con 5 historias no cabe entera. Quien no decide, entrega cinco cosas a medias en lugar de tres terminadas.', how: 'Reparto de tiempo por bloque y lista explícita de lo que queda fuera.' },
      { what: 'La capa de datos se separa de los componentes.', why: 'Permite testear la lógica sin montar el DOM y hace el proyecto legible para el revisor, que le dedicará quince minutos.', how: 'Carpeta `api/` sin React y hooks que exponen estados derivados.' },
      { what: 'Los filtros se guardan en la URL.', why: 'Resuelve la persistencia pedida y añade enlaces compartibles, que es exactamente lo que necesita un equipo de guardia.', how: '`URLSearchParams` como fuente de verdad; el estado de React se deriva de ella.' },
      { what: 'El cambio de estado es optimista con reversión.', why: 'El enunciado avisa de 3 s de latencia y un 5 % de fallos: son pistas deliberadas. Ignorarlas es no leer.', how: 'Aplicar en local, llamar, revertir y avisar con opción de reintento si falla.' },
      { what: 'La accesibilidad se implementa con elementos nativos.', why: 'Es más rápido, más robusto y evita el error típico del código generado por IA: `role="button"` sobre un div que no recibe foco.', how: 'Tabla real, controles nativos y regiones vivas para los cambios.' },
      { what: 'Los tests eligen los tres riesgos reales.', why: 'La cobertura no es el objetivo: detectar regresiones que importan sí lo es. Un test que no puede fallar no aporta.', how: 'Filtrado, reversión y error de carga.' },
      { what: 'El README documenta decisiones y recortes.', why: 'Convierte lo que falta en criterio en lugar de en descuido, y es lo que se usa en la entrevista de defensa.', how: 'Tres secciones: decisiones, fuera de alcance y siguientes pasos.' }
    ],

    rationale:
      'Esta prueba no mide si sabes React: eso se da por supuesto. Mide criterio bajo restricción de tiempo. ' +
      'Por eso el enunciado incluye latencia alta, fallos aleatorios y límite de peticiones: son trampas de lectura. ' +
      'Y por eso el README pesa tanto como el código, porque en 2026 la parte imitable por una herramienta es ' +
      'precisamente escribir componentes, mientras que decidir qué no construir sigue siendo humano.',

    alternatives: [
      { name: 'React Query / TanStack Query', when: 'Más de un recurso o necesidad de caché.', tradeoff: 'Resuelve caché, deduplicación, reintentos y estados; en una prueba de un solo recurso puede parecer sobreingeniería si no lo justificas.' },
      { name: 'Estado local con useState y useReducer', when: 'Alcance pequeño como este.', tradeoff: 'Cero dependencias y control total; se queda corto en cuanto aparece caché entre vistas.' },
      { name: 'Server components / SSR', when: 'La empresa usa Next.js.', tradeoff: 'Mejor primera carga y menos JavaScript en cliente; para un panel interno detrás de login aporta poco y complica la prueba.' },
      { name: 'Tabla virtualizada', when: 'Miles de filas.', tradeoff: 'Necesaria a partir de cierto volumen, pero complica bastante la accesibilidad. Solo si el enunciado lo pide.' }
    ],

    commonErrors: [
      { error: 'Pulir el diseño y no llegar a los tests ni al README.', why: 'La rúbrica reparte puntos entre ocho áreas. Perfeccionar una y dejar tres en blanco baja la nota total.', fix: 'Recorrido completo primero, refinamiento después.' },
      { error: 'Ignorar la latencia y los fallos que menciona el enunciado.', why: 'Están puestos a propósito. Si tu interfaz asume respuestas instantáneas y correctas, has fallado la parte que evaluaban.', fix: 'Todo dato mencionado en el enunciado es un requisito encubierto.' },
      { error: 'Entregar sin README.', why: 'El revisor no puede distinguir un recorte consciente de un olvido, y ante la duda asume lo segundo.', fix: 'Diez minutos de README suben más la nota que una hora de CSS.' },
      { error: 'Un único commit "solución".', why: 'Impide ver cómo trabajas, que es la mitad de lo que se evalúa en un take-home.', fix: 'Commits pequeños con mensajes descriptivos.' },
      { error: 'Añadir cinco dependencias para un panel pequeño.', why: 'Sugiere falta de criterio y hace la revisión más lenta.', fix: 'Cada dependencia se justifica en el README o no entra.' },
      { error: 'Entregar código generado que no sabes explicar.', why: 'La ronda de defensa está diseñada exactamente para esto y es donde cae la mayoría.', fix: 'Revisa y reescribe lo que no entiendas: si no lo puedes defender, no lo entregues.' },
      { error: 'Superar en mucho el tiempo indicado.', why: 'Además de ser injusto para ti, distorsiona la señal: entregan un trabajo de 15 horas para una prueba de 3 y luego no lo sostienen en la defensa.', fix: 'Ajústate al tiempo y documenta qué harías con más.' }
    ],

    bestPractices: [
      'Recorrido completo antes que perfección parcial.',
      'Cada detalle del enunciado es un requisito: latencia, errores y límites incluidos.',
      'Los tests se eligen por riesgo, no por cobertura.',
      'El README es parte del producto entregado.',
      'Menos dependencias y más justificación.'
    ],

    security: [
      'No metas la clave de la API en el bundle del cliente: todo lo que llega al navegador es público.',
      'Escapa el texto que venga de la API antes de renderizarlo si usas `dangerouslySetInnerHTML`; lo más seguro es no usarlo.',
      'No confíes en el filtrado del cliente para ocultar datos: si llegan al navegador, están expuestos.',
      'Si guardas el token, valora las implicaciones de `localStorage` frente a una cookie `httpOnly`, y menciónalo en el README.'
    ],

    performance: [
      'Debounce en la búsqueda para no chocar contra el límite de 30 peticiones por minuto.',
      'Reserva espacio para el esqueleto de carga: evita saltos de layout con una API que tarda hasta 3 s.',
      'Memoiza el filtrado y la ordenación si la lista crece; antes de eso, mide.'
    ],

    companyLooksFor: [
      'Criterio para recortar y capacidad de explicarlo.',
      'Que hayas leído el enunciado completo, trampas incluidas.',
      'Accesibilidad y manejo de errores tratados como requisitos, no como extras.',
      'Un README que demuestre pensamiento de producto.',
      'Que puedas defender cada línea en la ronda siguiente.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Funcionalidad completa de las historias priorizadas', weight: 25 },
        { criteria: 'Manejo de estados, errores y latencia', weight: 20 },
        { criteria: 'Accesibilidad y responsive', weight: 20 },
        { criteria: 'Tests con valor real', weight: 15 },
        { criteria: 'README, commits y criterio de alcance', weight: 20 }
      ]
    },

    reinforce: [
      'Prueba antes: `fe-estados-accesibles` y `api-cliente-resistente`.',
      'Actualizaciones optimistas y reconciliación de estado.',
      'Testing Library: probar comportamiento, no implementación.',
      'Patrones ARIA para tablas y menús.'
    ]
  });

  /* ------------------------------------------------------------------
     3. System Design Challenge
     ------------------------------------------------------------------ */
  TT.defineExercise({
    id: 'emp-system-design',
    empresa: {
      empresas: ['atlassian', 'netflix', 'cloudflare', 'adevinta'],
      evidencia: 'documentada',
      puesto: 'Senior Backend Engineer',
      rol: 'backend',
      formato: 'system-design',
      dificultad: 4,
      evalua: [
        'Ronda de system design de 60 minutos: la publican Atlassian en su guía oficial y Netflix en su blog de ingeniería.',
        'Defender compromisos explícitos en vez de dibujar la arquitectura de moda.',
        'Fallos parciales, consistencia y coste como parte del diseño.'
      ],
      nota: 'La existencia y el formato de esta ronda están documentados por Atlassian, Netflix y Cloudflare. Adevinta Spain se añade porque sus ofertas de Barcelona piden exactamente este perfil —sistemas de alta disponibilidad y baja latencia, Kubernetes y datos en streaming con Kafka y Flink—, aunque no publica el detalle de su proceso. El sistema concreto que se pide diseñar es nuestro.',
      fuentes: [
        { titulo: 'Atlassian Engineering Interview Guide', url: 'https://www.atlassian.com/company/careers/resources/interviewing/engineering' },
        { titulo: 'Demystifying Interviewing for Backend Engineers @ Netflix', url: 'https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495' },
        { titulo: 'Experiencias de entrevista en Cloudflare — Taro', url: 'https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/' },
        { titulo: 'Product & Tech — Adevinta Careers', url: 'https://adevinta.com/careers/product-tech/' }
      ]
    },
    categorias: ['architecture', 'performance'],
    title: 'System Design: 2 millones de eventos por minuto',
    category: 'system-design',
    kind: 'design',
    level: 'senior',
    time: 60,
    tags: ['escalabilidad', 'colas', 'caché', 'consistencia'],

    context:
      'Ronda de diseño de sistemas para un puesto senior. Cuarenta y cinco minutos, una pizarra compartida y un ' +
      'entrevistador que va a ir subiendo la escala y añadiendo restricciones a medida que respondas.',

    situation:
      'Enunciado inicial, deliberadamente vago: "Diseña la plataforma que recoge la actividad de los usuarios de ' +
      'nuestra aplicación y les muestra recomendaciones personalizadas". No te dan cifras. Que las pidas forma parte ' +
      'de la evaluación.',

    goal:
      'Conducir la sesión: acotar requisitos, estimar magnitudes, proponer una arquitectura, justificar las decisiones ' +
      'y reconocer los puntos débiles antes de que te los señalen.',

    tech: ['Arquitectura', 'Kafka', 'Redis', 'PostgreSQL', 'Almacenamiento de objetos'],
    skills: ['diseño de sistemas', 'estimación de capacidad', 'consistencia y disponibilidad', 'caché', 'colas', 'compromisos de diseño'],

    starter: {
      lang: 'markdown',
      code:
'## Cómo se conduce la sesión (repártela así)\n' +
'\n' +
'  5 min   Preguntas de acotación\n' +
'  5 min   Estimaciones de magnitud\n' +
'  5 min   API y modelo de datos\n' +
' 15 min   Diseño de alto nivel\n' +
' 10 min   Profundizar en 1-2 componentes que elija el entrevistador\n' +
'  5 min   Cuellos de botella, fallos y qué mejorarías\n' +
'\n' +
'## Preguntas que DEBES hacer antes de dibujar nada\n' +
'\n' +
'  - ¿Cuántos usuarios activos al día? ¿Cuántos eventos por usuario?\n' +
'  - ¿Las recomendaciones deben reflejar la actividad de hace 5 segundos\n' +
'    o basta con 15 minutos? (esto cambia toda la arquitectura)\n' +
'  - ¿Se pueden perder eventos? ¿Cuál es el coste de perder uno?\n' +
'  - ¿Latencia aceptable al servir recomendaciones?\n' +
'  - ¿Es solo lectura desde la app o hay consumidores analíticos?\n' +
'  - ¿Ámbito geográfico? ¿Requisitos de RGPD y borrado de datos?\n' +
'\n' +
'## Escribe aquí tu diseño\n' +
'\n' +
'1. Requisitos funcionales y no funcionales\n' +
'2. Estimaciones (escritura/s, lectura/s, almacenamiento al año)\n' +
'3. API\n' +
'4. Diagrama de componentes\n' +
'5. Decisiones y alternativas descartadas (con el motivo)\n' +
'6. Fallos, cuellos de botella y evolución\n'
    },

    requirements: [
      'Acotar con preguntas antes de proponer nada.',
      'Estimar escrituras por segundo, lecturas por segundo y almacenamiento anual, con los cálculos a la vista.',
      'Separar explícitamente la ruta de ingesta (escritura masiva) de la ruta de servicio (lectura de baja latencia).',
      'Justificar el nivel de consistencia elegido para cada dato, no para el sistema entero.',
      'Definir estrategia de caché con invalidación, no solo "ponemos Redis".',
      'Identificar al menos dos cuellos de botella y dos modos de fallo con su mitigación.',
      'Reconocer qué has dejado fuera y por qué.'
    ],

    optional: [
      'Añadir la ruta de reentrenamiento del modelo de recomendación y su cadencia.',
      'Diseñar el borrado de datos de un usuario a efectos de RGPD atravesando todo el sistema.',
      'Plantear despliegue multirregión y sus implicaciones de consistencia.'
    ],

    hints: [
      'Si empiezas a dibujar antes de preguntar, ya has perdido puntos. La vaguedad del enunciado es la primera prueba.',
      'Estimación rápida: 20 millones de usuarios activos al día, 100 eventos cada uno, son 2 000 millones de eventos al día ≈ 23 000 por segundo de media, con picos de 3 a 5 veces esa cifra.',
      'Los eventos son escrituras masivas que toleran retraso; las recomendaciones son lecturas que necesitan pocos milisegundos. Son dos sistemas distintos que se comunican por una cola.',
      'La pregunta sobre frescura de las recomendaciones es la que más determina el diseño: 5 segundos obliga a procesamiento en flujo; 15 minutos permite lotes, que es mucho más barato.',
      'Di en voz alta lo que descartas y por qué. "No uso una base de datos relacional para los eventos porque el patrón es de escritura pura y sin joins" vale más que la elección en sí.'
    ],

    docs: {
      resumen:
        'En una ronda de diseño no se busca la arquitectura correcta, que no existe. Se busca que **las ' +
        'decisiones se deriven de requisitos que tú mismo has acotado** y que sepas qué estás sacrificando. ' +
        'Esta documentación te da el guion de la sesión, la aritmética de estimación y los bloques de ' +
        'construcción con su porqué.',

      conceptos: [
        {
          titulo: 'El guion de la sesión: preguntar antes de dibujar',
          texto:
            'El enunciado es vago **a propósito**. Un sistema para 10 000 usuarios y otro para 20 millones no ' +
            'se parecen en nada; empezar a dibujar sin saberlo demuestra que nunca has diseñado nada real. ' +
            'Es la primera prueba, y muchos la fallan en el primer minuto.\n' +
            'Reparte los 45 minutos así: 5 de acotación, 5 de estimaciones, 5 de API y modelo de datos, 15 de ' +
            'diseño de alto nivel, 10 de profundizar donde te pidan y 5 de fallos y mejoras.\n' +
            'Las preguntas que cambian el diseño de verdad son estas: cuántos usuarios y eventos, **qué ' +
            'frescura necesitan las recomendaciones**, si se pueden perder eventos, qué latencia se acepta al ' +
            'leer, y si hay requisitos de RGPD.\n' +
            'La de la frescura es la más importante de todas: 5 segundos obliga a procesamiento en flujo, ' +
            '15 minutos permite lotes, que es muchísimo más barato.',
          codigo:
'// Las seis preguntas, en orden de impacto sobre el diseño\n' +
'//\n' +
'//  1. ¿Usuarios activos al día? ¿Eventos por usuario?\n' +
'//        -> decide la escala y por tanto la tecnología\n' +
'//  2. ¿Las recomendaciones reflejan la actividad de hace 5 s o de hace 15 min?\n' +
'//        -> decide flujo vs lotes. LA PREGUNTA CLAVE.\n' +
'//  3. ¿Se puede perder un evento? ¿Cuánto cuesta?\n' +
'//        -> decide las garantías de entrega\n' +
'//  4. ¿Latencia aceptable al servir?\n' +
'//        -> decide si se precomputa o se calcula al vuelo\n' +
'//  5. ¿Solo la app lee, o hay consumidores analíticos?\n' +
'//        -> decide si hace falta almacén histórico\n' +
'//  6. ¿Ámbito geográfico? ¿RGPD?\n' +
'//        -> decide replicación y diseño del borrado'
        },
        {
          titulo: 'Estimación: aritmética simple en voz alta',
          texto:
            'Las magnitudes son las que justifican las decisiones. Sin ellas todo suena arbitrario, y con ' +
            'ellas media arquitectura se descarta sola.\n' +
            'El método: usuarios × eventos por usuario ÷ 86 400 segundos = escrituras por segundo de media. ' +
            'Multiplica por 3 o 4 para el pico.\n' +
            'Números que conviene tener memorizados: **86 400 segundos al día**, y que 1 millón al día ≈ 12 por ' +
            'segundo.\n' +
            'La conclusión que hay que decir en voz alta en este ejercicio: la ingesta supera a la lectura en ' +
            '**dos órdenes de magnitud** y tolera retraso, mientras que la lectura no lo tolera pero es poca. ' +
            'Todo el diseño se deriva de ahí.',
          codigo:
'ESCRITURAS\n' +
'  20 M usuarios × 100 eventos = 2 000 M eventos/día\n' +
'  2 000 M / 86 400 s          ≈ 23 000 eventos/s de media\n' +
'  pico ×4                     ≈ 92 000 eventos/s\n' +
'\n' +
'LECTURAS\n' +
'  ~5 peticiones por usuario/día = 100 M/día\n' +
'  100 M / 86 400                ≈ 1 200 lecturas/s, pico ≈ 5 000/s\n' +
'\n' +
'ALMACENAMIENTO\n' +
'  ~400 B por evento comprimido\n' +
'  2 000 M × 400 B ≈ 800 GB/día ≈ 290 TB/año\n' +
'\n' +
'// 23 000 escrituras/s descartan por sí solas media docena de opciones.\n' +
'// 290 TB/año es una partida presupuestaria: menciónala.'
        },
        {
          titulo: 'Separar la ruta de ingesta de la de servicio',
          texto:
            'Es la decisión estructural del ejercicio. Las dos rutas tienen requisitos **opuestos**:\n' +
            'La **ingesta** debe absorber picos enormes y tolera retraso de minutos.\n' +
            'El **servicio** necesita latencia de milisegundos pero tiene volumen modesto.\n' +
            'Un único sistema que intente las dos cosas hace las dos mal. La frontera entre ambas es una cola, ' +
            'que además actúa de amortiguador.\n' +
            'Decir esto explícitamente, derivándolo de las estimaciones, vale más que cualquier caja concreta ' +
            'del diagrama.',
          codigo:
'[ App ]\n' +
'   | lotes de eventos\n' +
'   v\n' +
'[ API de ingesta ] --> [ Cola ] ---> [ Sumidero a almacén de objetos ]\n' +
'  sin estado,             |            (histórico, Parquet)\n' +
'  autoescalada            v\n' +
'                 [ Procesador ]  agrega por usuario\n' +
'                          |\n' +
'                          v\n' +
'                 [ Almacén de perfiles (K/V) ]\n' +
'                          |\n' +
'                          v\n' +
'[ App ] <-- [ API de recomendaciones ] <-- [ Caché: top-N por usuario ]\n' +
'                                                  ^\n' +
'                                        [ Lote cada 15 min ]'
        },
        {
          titulo: 'La cola: tres razones concretas, no "porque sí"',
          texto:
            '"Ponemos Kafka" no dice nada. Una cola se justifica con tres motivos verificables:\n' +
            '**Absorción de picos.** El pico de ×4 lo aguanta la cola, no el procesador. Sin ella tendrías que ' +
            'dimensionar todo para el peor momento.\n' +
            '**Desacople.** El productor y el consumidor van a ritmos distintos y ninguno tumba al otro.\n' +
            '**Reprocesado.** Cuando cambies el algoritmo de recomendación, puedes volver a leer el histórico. ' +
            'Este tercer motivo es el que más se valora y el que más se olvida.\n' +
            'La **clave de partición** también hay que justificarla: particionar por `usuario_id` garantiza ' +
            'orden por usuario —el único orden que importa aquí— y permite paralelizar por completo.',
          codigo:
'// Alternativa descartada, y por qué (dilo en voz alta)\n' +
'//\n' +
'//   "Escribir directo a la base de datos": a 92 000 escrituras/s el pico\n' +
'//   tumba cualquier base relacional, y un fallo del consumidor se traduce\n' +
'//   en pérdida de eventos sin posibilidad de recuperarlos.\n' +
'\n' +
'// Garantías de entrega — hay que elegir explícitamente\n' +
'//   como máximo una vez  -> rápido, se pueden perder eventos\n' +
'//   al menos una vez     -> nunca se pierde, puede duplicar  <-- lo habitual\n' +
'//   exactamente una vez  -> caro y complejo, rara vez necesario\n' +
'//\n' +
'// Con "al menos una vez" se desduplica por (usuario_id, evento_id).'
        },
        {
          titulo: 'Precomputar frente a calcular al vuelo',
          texto:
            'Como la frescura acordada es de minutos, puedes calcular las recomendaciones **por adelantado** en ' +
            'un trabajo por lotes y dejar la lectura como una simple consulta de clave-valor de menos de 5 ms.\n' +
            'Lo importante es que esta decisión **se apoya en un requisito** que tú mismo acotaste, no en una ' +
            'preferencia. Si la frescura exigida fuera de segundos, la respuesta correcta sería otra.\n' +
            'Precomputar traslada el coste del momento de la lectura al del proceso, que es donde puedes ' +
            'controlarlo, y desacopla la latencia del usuario de la complejidad del algoritmo.',
          codigo:
'// Al vuelo                       Precomputado\n' +
'// ---------                      ------------\n' +
'// máxima frescura                hasta 15 min de desfase\n' +
'// latencia = coste del algoritmo latencia = una lectura K/V (<5 ms)\n' +
'// escala con las lecturas        escala con los datos\n' +
'// bien si el catálogo es pequeño bien a partir de cierto volumen\n' +
'\n' +
'// Elegimos precomputar PORQUE la acotación fijó frescura de minutos.\n' +
'// Ese "porque" es lo que se evalúa.'
        },
        {
          titulo: 'Un almacenamiento por patrón de acceso',
          texto:
            'El error de diseño más común es forzar tres perfiles de acceso incompatibles en una sola ' +
            'tecnología. Aquí hay tres datos muy distintos:\n' +
            '**Eventos crudos** — escritura masiva, lectura en diferido, sin joins → almacén de objetos en ' +
            'formato columnar (Parquet). Barato, inmutable, consultable para reentrenar.\n' +
            '**Perfiles agregados** — acceso por clave, escritura alta, sin relaciones → clave-valor ' +
            '(DynamoDB, Cassandra).\n' +
            '**Catálogo y metadatos** — volumen pequeño, relaciones, transacciones → relacional (PostgreSQL).\n' +
            'Justificar cada elección por su patrón de acceso es lo que distingue un diseño de una lista de ' +
            'tecnologías de moda.',
          codigo:
'// Pregúntate por cada dato:\n' +
'//   ¿cómo se escribe?   masivo / puntual\n' +
'//   ¿cómo se lee?       por clave / por rango / con joins / analítico\n' +
'//   ¿cambia?            inmutable / mutable\n' +
'//   ¿cuánto vive?       días / años\n' +
'//\n' +
'// Eventos:   masivo, analítico, inmutable, años   -> objetos + Parquet\n' +
'// Perfiles:  alto,   por clave, mutable,   meses  -> K/V\n' +
'// Catálogo:  bajo,   con joins, mutable,   años   -> relacional'
        },
        {
          titulo: 'Caché: qué, cuánto y cómo se invalida',
          texto:
            '"Ponemos Redis" tampoco dice nada. Una estrategia de caché responde a tres preguntas: **qué se ' +
            'cachea**, **con qué TTL** y **cómo se invalida**.\n' +
            'Aquí: el top-N por usuario, con TTL alineado al lote (15 min), escrito desde el propio lote ' +
            '(*write-through*) y con el TTL como red de seguridad. La invalidación por evento no compensa, ' +
            'porque la frescura acordada la hace innecesaria.\n' +
            'Y hay que anticipar la **estampida**: si millones de claves expiran en el mismo segundo, toda la ' +
            'carga cae de golpe sobre el origen. Se evita con TTL escalonado y bloqueo por clave al recalcular.',
          codigo:
'// Patrones de caché\n' +
'//   cache-aside    la aplicación consulta la caché y, si falla, el origen\n' +
'//   write-through  se escribe en caché al escribir en el origen  <-- aquí\n' +
'//   write-behind   se escribe en caché y se vuelca después\n' +
'\n' +
'// Estampida (cache stampede)\n' +
'//   problema:  N claves expiran a la vez -> N peticiones al origen\n' +
'//   mitigación: TTL con jitter (15 min ± 2) + bloqueo por clave'
        },
        {
          titulo: 'Consistencia por dato, no por sistema',
          texto:
            'Es el punto donde se distingue a quien ha leído sobre el teorema CAP de quien ha operado un ' +
            'sistema. **Un sistema no es "CP" o "AP": cada dato tiene su requisito.**\n' +
            '**Eventos** — eventual, al menos una vez. Se desduplica.\n' +
            '**Recomendaciones** — eventual. Ver una lista de hace 10 minutos no rompe nada.\n' +
            '**Preferencias y consentimiento RGPD** — fuerte. Si alguien retira el consentimiento, no puede ' +
            'haber ventana de inconsistencia.\n' +
            'Decir "usamos consistencia eventual" sin decir dónde es un error: aplicada a un saldo o a un ' +
            'consentimiento es grave; aplicada a una recomendación es correcta.',
          codigo:
'// Clasifica dato a dato, en voz alta\n' +
'//\n' +
'//   evento de actividad   -> eventual, al menos una vez, desduplicado\n' +
'//   perfil agregado       -> eventual\n' +
'//   top-N recomendado     -> eventual (hasta 15 min de desfase, acordado)\n' +
'//   consentimiento RGPD   -> FUERTE, sin ventana\n' +
'//   catálogo de productos -> fuerte en escritura, eventual en réplicas'
        },
        {
          titulo: 'Fallos, degradación y la métrica que avisa primero',
          texto:
            'Diseñar solo el camino feliz es exactamente lo que no se espera de un senior. Recorre cada ' +
            'componente preguntándote qué pasa si se cae:\n' +
            '**Partición caliente** — un bot satura su partición. Mitigación: clave compuesta con sufijo y ' +
            'límite por usuario.\n' +
            '**Retraso del consumidor** — las recomendaciones envejecen en silencio. El **lag de consumo** es ' +
            'la métrica más importante de todo el sistema: es la que primero avisa.\n' +
            '**Caída de la caché** — 5 000 lecturas/s caen sobre el origen. Mitigación: **degradar** a ' +
            'recomendaciones genéricas por segmento. Peor recomendación, no pantalla rota.\n' +
            '**Evento malformado** — bloquea el consumidor. Mitigación: cola de mensajes fallidos y validación ' +
            'de esquema en la ingesta.\n' +
            'Responder "servimos recomendaciones por segmento" a "¿y si se cae Redis?" demuestra que piensas ' +
            'en degradar antes que en romper.',
          codigo:
'// Recorrido de fallos\n' +
'//   componente          fallo               mitigación\n' +
'//   ------------------------------------------------------------\n' +
'//   partición           clave caliente      sufijo + límite por usuario\n' +
'//   consumidor          retraso creciente   ALERTA sobre el lag\n' +
'//   caché               caída total         degradar a genéricas\n' +
'//   cola                mensaje venenoso    cola de fallidos (DLQ)\n' +
'//   RGPD                borrado de usuario  diseñarlo desde el principio:\n' +
'//                                           cola, histórico, K/V y caché'
        }
      ],

      referencia: [
        { nombre: '86 400', texto: 'Segundos que tiene un día. La constante que necesitas en toda estimación.' },
        { nombre: 'Partición / sharding', texto: 'Repartir los datos por una clave para paralelizar. La clave decide el orden garantizado y el riesgo de puntos calientes.' },
        { nombre: 'Lag de consumo', texto: 'Cuánto se ha retrasado el consumidor respecto al productor. La métrica que primero avisa de una degradación.' },
        { nombre: 'DLQ (dead letter queue)', texto: 'Cola donde van los mensajes que no se pueden procesar, para que no bloqueen al resto.' },
        { nombre: 'TTL', texto: 'Tiempo de vida de una entrada en caché. Conviene escalonarlo para evitar expiraciones masivas simultáneas.' },
        { nombre: 'Parquet', texto: 'Formato columnar comprimido. Estándar para almacenar eventos históricos de forma barata y consultable.' },
        { nombre: 'Almacén clave-valor', texto: 'DynamoDB, Cassandra. Acceso por clave con escritura alta; sin joins ni consultas complejas.' },
        { nombre: '202 Accepted', texto: 'Código HTTP para "lo he recibido, lo procesaré". Correcto en una ingesta asíncrona: no bloqueas al cliente.' },
        { nombre: 'Envío por lotes (batching)', texto: 'Agrupar N eventos por petición. Con lotes de 50 reduces en 50× el número de peticiones y su sobrecarga.' },
        { nombre: 'Teorema CAP', texto: 'Ante una partición de red hay que elegir entre consistencia y disponibilidad. Se aplica por dato, no al sistema entero.' }
      ],

      ejemplo: {
        titulo: 'Sesión resuelta de otro enunciado: "diseña un acortador de URLs con analítica"',
        codigo:
'# 1. ACOTACIÓN (5 min) — preguntar antes de dibujar\n' +
'\n' +
'  - ¿Enlaces creados al día?          -> 10 M\n' +
'  - ¿Redirecciones al día?            -> 5 000 M   (500:1 lectura/escritura)\n' +
'  - ¿La analítica es en tiempo real?  -> no, basta con 5 min\n' +
'  - ¿Los enlaces caducan?             -> opcional, por defecto nunca\n' +
'  - ¿URLs personalizadas?             -> sí, para clientes de pago\n' +
'  - ¿Latencia de la redirección?      -> p99 < 50 ms (es lo crítico)\n' +
'\n' +
'# 2. ESTIMACIONES (5 min)\n' +
'\n' +
'  escrituras : 10 M / 86 400        ≈ 115/s      (pico ×4 ≈ 460/s)\n' +
'  lecturas   : 5 000 M / 86 400     ≈ 58 000/s   (pico ×4 ≈ 230 000/s)\n' +
'  almacén    : 10 M × 500 B × 365   ≈ 1,8 TB/año de enlaces\n' +
'  clics      : 5 000 M × 100 B      ≈ 500 GB/día de eventos\n' +
'\n' +
'  >> CONCLUSIÓN EN VOZ ALTA: proporción 500:1 a favor de la lectura.\n' +
'     Esto es un sistema de LECTURA. Todo el diseño gira en torno a eso.\n' +
'     (Nota: es el caso OPUESTO al de tu ejercicio, donde manda la escritura.)\n' +
'\n' +
'# 3. API (5 min)\n' +
'\n' +
'  POST /v1/enlaces      { url, alias? }  -> 201 { codigo, urlCorta }\n' +
'  GET  /{codigo}                         -> 301/302 Location\n' +
'  GET  /v1/enlaces/{codigo}/stats        -> { clics, porDia, porPais }\n' +
'\n' +
'  301 (permanente) lo cachea el navegador: menos carga, pero pierdes\n' +
'  la analítica de las visitas repetidas. Usamos 302. <- compromiso explícito\n' +
'\n' +
'# 4. ARQUITECTURA (15 min)\n' +
'\n' +
'  [ cliente ]\n' +
'       |  GET /abc123\n' +
'       v\n' +
'  [ CDN / borde ]  <- 90 % de aciertos: la mayoría no llega al origen\n' +
'       |\n' +
'       v\n' +
'  [ Servicio de redirección ] --> [ Caché: codigo -> url ]\n'  +
'       |          (sin estado)          |  fallo de caché\n' +
'       |                                v\n' +
'       |                         [ K/V: enlaces ]\n' +
'       |\n' +
'       +--> [ Cola: clics ] --> [ Agregador 5 min ] --> [ Analítica ]\n' +
'            (asíncrono: NUNCA en la ruta de redirección)\n' +
'\n' +
'# 5. DECISIONES Y ALTERNATIVAS DESCARTADAS\n' +
'\n' +
'  Generación del código\n' +
'    QUÉ: contador global codificado en base62 (7 caracteres = 3,5 billones).\n' +
'    POR QUÉ: sin colisiones por construcción, corto y no adivinable si se\n' +
'      mezcla con un desplazamiento. Cada instancia reserva rangos de\n' +
'      100 000 para no depender del contador en cada escritura.\n' +
'    DESCARTADO: hash de la URL. Produce colisiones que hay que resolver,\n' +
'      y la misma URL de dos usuarios daría el mismo código (mal para\n' +
'      la analítica por cliente).\n' +
'\n' +
'  El registro del clic NO bloquea la redirección\n' +
'    POR QUÉ: es lo único que puede hacer subir el p99. Se encola y se\n' +
'      responde. Perder un 0,01 % de clics es aceptable; que la\n' +
'      redirección tarde 200 ms, no.\n' +
'\n' +
'  Almacenamiento por patrón\n' +
'    enlaces -> K/V (lectura por clave, 58 000/s)\n' +
'    clics   -> objetos + agregados en columnar (analítico)\n' +
'    cuentas -> relacional (poco volumen, relaciones, facturación)\n' +
'\n' +
'  Consistencia por dato\n' +
'    enlace recién creado -> fuerte (si acabo de crearlo, debe funcionar YA)\n' +
'    contador de clics    -> eventual (nadie nota 5 min de desfase)\n' +
'\n' +
'# 6. FALLOS Y DEGRADACIÓN (5 min)\n' +
'\n' +
'  Caída de la caché    -> 230 000/s sobre el K/V. Mitigación: caché local\n' +
'                          por instancia + limitación de peticiones al origen.\n' +
'  Enlace caliente      -> una campaña concentra el tráfico en una clave.\n' +
'                          La CDN lo absorbe; sin ella, réplicas de lectura.\n' +
'  Cola de clics llena  -> se descartan clics ANTES que fallar la redirección.\n' +
'                          Degradación deliberada: la analítica es secundaria.\n' +
'  Abuso                -> enlaces a malware. Verificación asíncrona y\n' +
'                          lista de bloqueo consultada en el borde.\n' +
'\n' +
'# 7. QUÉ QUEDA FUERA\n' +
'\n' +
'  - Multirregión: añadiría réplicas de solo lectura y afinidad geográfica.\n' +
'  - Retención de clics: 500 GB/día obliga a políticas de ciclo de vida.\n' +
'  - Enlaces privados y control de acceso por enlace.',
        texto:
          'Estudia la **estructura**, no el contenido: siete secciones en el mismo orden que debes seguir. ' +
          'Es un enunciado deliberadamente **opuesto** al tuyo (allí manda la lectura, en el tuyo la escritura), ' +
          'precisamente para que veas que el método es el mismo aunque la respuesta sea distinta.\n' +
          'Fíjate en cinco cosas que se puntúan y que aquí aparecen de forma explícita: la **conclusión en voz ' +
          'alta** tras estimar (la proporción 500:1 decide todo lo demás); las **alternativas descartadas con ' +
          'su motivo** (el hash frente al contador); el compromiso **explícito** del 301 frente al 302; la ' +
          '**consistencia clasificada por dato**; y la **degradación deliberada** (descartar clics antes que ' +
          'fallar la redirección).\n' +
          'En tu ejercicio la conclusión equivalente es que la ingesta supera a la lectura en dos órdenes de ' +
          'magnitud y tolera retraso. Dilo en voz alta y deriva todo lo demás de ahí.'
      },

      glosario: [
        { termino: 'Requisito funcional', definicion: 'Qué debe hacer el sistema. "Mostrar recomendaciones personalizadas".' },
        { termino: 'Requisito no funcional', definicion: 'Con qué garantías: latencia, disponibilidad, coste, consistencia. Suele ser lo que decide la arquitectura.' },
        { termino: 'Ingesta', definicion: 'La ruta de entrada de datos. Aquí, escritura masiva que tolera retraso.' },
        { termino: 'Ruta de servicio', definicion: 'La ruta de lectura de cara al usuario. Aquí, poco volumen pero latencia baja obligatoria.' },
        { termino: 'Procesamiento en flujo (streaming)', definicion: 'Procesar los eventos según llegan. Máxima frescura, mucha más complejidad operativa.' },
        { termino: 'Procesamiento por lotes (batch)', definicion: 'Procesar en tandas periódicas. Más barato y simple; introduce desfase.' },
        { termino: 'Precomputar', definicion: 'Calcular por adelantado para que la lectura sea trivial.' },
        { termino: 'Consistencia eventual', definicion: 'Las réplicas convergen con el tiempo. Aceptable para recomendaciones, no para un consentimiento.' },
        { termino: 'Consistencia fuerte', definicion: 'Toda lectura ve la última escritura. Necesaria para consentimientos, saldos e inventario.' },
        { termino: 'Partición caliente', definicion: 'Una clave concentra tráfico desproporcionado y satura su partición.' },
        { termino: 'Al menos una vez', definicion: 'Garantía de entrega que nunca pierde mensajes pero puede duplicarlos. Obliga a desduplicar.' },
        { termino: 'Degradación', definicion: 'Ofrecer un servicio peor pero funcional cuando algo falla, en lugar de devolver un error.' },
        { termino: 'Minimización de datos', definicion: 'Principio del RGPD: recoger y conservar solo lo estrictamente necesario.' }
      ],

      preparado: [
        '¿Cuáles son las seis preguntas de acotación y cuál de ellas cambia más el diseño?',
        '¿Sabrías calcular las escrituras por segundo a partir de usuarios y eventos, sin calculadora?',
        '¿Por qué la ingesta y el servicio tienen que ser sistemas separados?',
        '¿Sabrías dar las tres razones que justifican la cola, incluida la del reprocesado?',
        '¿Qué requisito concreto permite precomputar las recomendaciones en vez de calcularlas al vuelo?',
        '¿Por qué no usarías una sola base de datos para eventos, perfiles y catálogo?',
        '¿Qué dato de este sistema necesita consistencia fuerte y por qué?',
        '¿Qué responderías a "¿y si se cae Redis?" en menos de treinta segundos?',
        '¿Cuál es la métrica que primero avisa de que el sistema se está degradando?'
      ]
    },

    tests: {
      mode: 'checklist',
      titulo: 'Rúbrica de una ronda de system design senior. Marca lo que cubriste de verdad.',
      items: [
        { id: 'acotar', peso: 12, texto: 'Hice preguntas de acotación antes de proponer arquitectura y ajusté el diseño a las respuestas.' },
        { id: 'estimar', peso: 12, texto: 'Estimé escrituras/s, lecturas/s y almacenamiento con los cálculos explícitos.' },
        { id: 'separar', peso: 14, texto: 'Separé la ruta de ingesta de la de servicio y expliqué por qué tienen requisitos opuestos.' },
        { id: 'cola', peso: 10, texto: 'Justifiqué la cola: absorción de picos, desacople y reprocesado, no "porque sí".' },
        { id: 'almacen', peso: 10, texto: 'Elegí el almacenamiento según el patrón de acceso de cada dato, no uno para todo.' },
        { id: 'cache', peso: 10, texto: 'Definí qué se cachea, con qué TTL y cómo se invalida.' },
        { id: 'consistencia', peso: 10, texto: 'Razoné la consistencia por tipo de dato y acepté explícitamente la eventual donde procede.' },
        { id: 'fallos', peso: 12, texto: 'Identifiqué cuellos de botella y modos de fallo con mitigación concreta.' },
        { id: 'limites', peso: 10, texto: 'Reconocí qué queda fuera y qué haría en la siguiente iteración.' }
      ]
    },

    solution: {
      lang: 'markdown',
      code:
'# Diseño de referencia (uno válido entre varios)\n' +
'\n' +
'## 1. Acotación\n' +
'\n' +
'Supuestos acordados con el entrevistador:\n' +
'  - 20 M usuarios activos diarios, ~100 eventos por usuario y día.\n' +
'  - Recomendaciones con frescura de 1-2 minutos: NO hace falta tiempo real estricto.\n' +
'  - Perder un 0,01 % de eventos es aceptable; perder un pedido no.\n' +
'  - p95 de lectura por debajo de 100 ms.\n' +
'  - Una región principal, réplicas de lectura. RGPD aplicable.\n' +
'\n' +
'## 2. Estimaciones\n' +
'\n' +
'  Escrituras: 20M x 100 = 2 000 M eventos/día\n' +
'             2 000 M / 86 400 s ≈ 23 000 eventos/s de media\n' +
'             pico x4  ≈ 92 000 eventos/s\n' +
'  Lecturas:  ~5 peticiones de recomendación por usuario/día\n' +
'             100 M/día ≈ 1 200 lecturas/s, pico ≈ 5 000/s\n' +
'  Tamaño:    ~400 B por evento comprimido\n' +
'             2 000 M x 400 B ≈ 800 GB/día ≈ 290 TB/año en crudo\n' +
'\n' +
'  Conclusión que hay que decir en voz alta: la ingesta es dos órdenes de\n' +
'  magnitud mayor que la lectura. Son dos sistemas, no uno.\n' +
'\n' +
'## 3. API\n' +
'\n' +
'  POST /v1/eventos            (lote de hasta 50, responde 202 Accepted)\n' +
'  GET  /v1/recomendaciones    (devuelve lista ya calculada + versión)\n' +
'\n' +
'  El 202 es una decisión, no un detalle: no bloqueamos al cliente hasta\n' +
'  haber procesado. El envío por lotes reduce en 50x el coste por petición.\n' +
'\n' +
'## 4. Arquitectura\n' +
'\n' +
'  [ App ]\n' +
'     | lotes de eventos\n' +
'     v\n' +
'  [ API de ingesta ] --> [ Kafka: topic eventos, particionado por usuario_id ]\n' +
'     (sin estado,              |                    |\n' +
'      autoescalada)            |                    +--> [ Sumidero a almacén de objetos ]\n' +
'                               |                              (histórico, Parquet)\n' +
'                               v\n' +
'                    [ Procesador en flujo ]\n' +
'                     agrega por usuario en ventanas\n' +
'                               |\n' +
'                               v\n' +
'                    [ Almacén de perfiles (K/V) ]\n' +
'                               |\n' +
'                               v\n' +
'  [ App ] <--- [ API de recomendaciones ] <--- [ Redis: top-N por usuario ]\n' +
'                        ^\n' +
'                        |\n' +
'              [ Trabajo por lotes cada 15 min ]\n' +
'                recalcula y precomputa el top-N\n' +
'\n' +
'## 5. Decisiones y por qué\n' +
'\n' +
'  Cola entre ingesta y proceso\n' +
'    QUÉ: Kafka particionado por usuario_id.\n' +
'    POR QUÉ: absorbe los picos x4 sin escalar el proceso, desacopla el ritmo\n' +
'      del productor del consumidor y permite reprocesar el histórico cuando\n' +
'      cambie el algoritmo (esto último es lo que más valoran).\n' +
'    PARTICIÓN POR USUARIO: garantiza orden por usuario, que es el único\n' +
'      orden que importa aquí, y permite paralelizar por completo.\n' +
'    ALTERNATIVA DESCARTADA: escribir directo a la base de datos. A 92 000\n' +
'      escrituras/s el pico tumba cualquier base relacional y un fallo del\n' +
'      consumidor se traduce en pérdida de eventos.\n' +
'\n' +
'  Recomendaciones precomputadas, no calculadas al vuelo\n' +
'    POR QUÉ: la frescura acordada es de minutos. Precomputar convierte una\n' +
'      lectura cara en una consulta de clave-valor de menos de 5 ms y\n' +
'      desacopla la latencia del usuario del coste del algoritmo.\n' +
'    COSTE: hasta 15 min de desfase, aceptado explícitamente en la acotación.\n' +
'\n' +
'  Almacenamiento por patrón de acceso\n' +
'    Eventos crudos -> almacén de objetos en Parquet: barato, inmutable,\n' +
'      consultable en diferido para reentrenar.\n' +
'    Perfiles agregados -> K/V (DynamoDB o Cassandra): acceso por clave,\n' +
'      escritura alta, sin joins.\n' +
'    Catálogo y metadatos -> PostgreSQL: volumen pequeño, relaciones y\n' +
'      necesidad de transacciones.\n' +
'    ANTIPATRÓN: una sola base de datos para todo. Los tres perfiles de\n' +
'      acceso son incompatibles entre sí.\n' +
'\n' +
'  Caché\n' +
'    QUÉ: Redis con el top-N por usuario, TTL 15 min alineado con el lote.\n' +
'    INVALIDACIÓN: escritura desde el lote (write-through) más TTL como red\n' +
'      de seguridad. La invalidación por evento no compensa: la frescura\n' +
'      acordada la hace innecesaria.\n' +
'    ESTAMPIDA: bloqueo por clave al recalcular y valores con TTL escalonado,\n' +
'      para que no expiren millones de claves en el mismo segundo.\n' +
'\n' +
'  Consistencia POR DATO, no global\n' +
'    Eventos: eventual, al menos una vez. Se desduplica por (usuario, evento_id).\n' +
'    Recomendaciones: eventual. Ver una lista de hace 10 minutos no rompe nada.\n' +
'    Preferencias del usuario y consentimiento RGPD: fuerte. Si alguien\n' +
'      retira el consentimiento, no puede haber ventana de inconsistencia.\n' +
'    Decir esto explícitamente es lo que distingue una respuesta senior:\n' +
'    el sistema no es "CP" o "AP", cada dato tiene su requisito.\n' +
'\n' +
'## 6. Cuellos de botella y fallos\n' +
'\n' +
'  Partición caliente: un usuario o bot con volumen anómalo satura su\n' +
'    partición. Mitigación: clave compuesta con sufijo y límite por usuario.\n' +
'\n' +
'  Retraso del consumidor: si el proceso se retrasa, las recomendaciones\n' +
'    envejecen en silencio. Mitigación: alerta sobre el lag de consumo, que\n' +
'    es la métrica más importante de todo el sistema.\n' +
'\n' +
'  Caída de Redis: 5 000 lecturas/s caen sobre el almacén de perfiles.\n' +
'    Mitigación: degradar a recomendaciones genéricas por segmento antes\n' +
'    que devolver error. Peor recomendación, no pantalla rota.\n' +
'\n' +
'  Envenenamiento de datos: un evento malformado bloquea el consumidor.\n' +
'    Mitigación: cola de mensajes fallidos y validación de esquema en la\n' +
'    ingesta.\n' +
'\n' +
'  RGPD: el borrado debe atravesar Kafka (retención), el almacén de objetos\n' +
'    (particionado por usuario para poder borrar), el K/V y la caché.\n' +
'    Diseñarlo desde el principio; añadirlo después es un proyecto entero.\n' +
'\n' +
'## 7. Qué queda fuera y qué haría después\n' +
'\n' +
'  - El algoritmo de recomendación en sí: aquí se trata como una caja negra\n' +
'    que consume perfiles y produce un top-N.\n' +
'  - Multirregión: añadiría replicación asíncrona y afinidad por región.\n' +
'  - Experimentación A/B sobre versiones del modelo.\n' +
'  - Control de coste: 290 TB/año obliga a políticas de ciclo de vida y\n' +
'    a decidir cuánto histórico se conserva en caliente.\n'
    },

    walkthrough: [
      { what: 'Se pregunta antes de diseñar.', why: 'El enunciado es vago a propósito. Un sistema para 10 000 usuarios y otro para 20 millones no se parecen en nada; empezar a dibujar sin saberlo demuestra que no has diseñado nunca nada real.', how: 'Seis preguntas de acotación, y el diseño se ajusta a las respuestas.' },
      { what: 'Se estima en voz alta con números redondos.', why: 'Las magnitudes deciden la arquitectura. 23 000 escrituras por segundo descartan por sí solas la mitad de las opciones, y llegar a esa conclusión con aritmética simple es la habilidad que se evalúa.', how: 'Usuarios × eventos ÷ segundos del día, y un factor de pico.' },
      { what: 'Se separan ingesta y servicio.', why: 'Tienen requisitos opuestos: una necesita absorber picos enormes tolerando retraso, la otra necesita latencia baja con volumen modesto. Un único sistema que intente ambas cosas hace las dos mal.', how: 'Una cola en medio como frontera y como amortiguador.' },
      { what: 'La cola se justifica por tres motivos concretos.', why: '"Ponemos Kafka" no dice nada. Absorción de picos, desacople y capacidad de reprocesar el histórico son razones verificables, y la tercera es la que suele faltar.', how: 'Se enuncian los tres y se explica la elección de la clave de partición.' },
      { what: 'Las recomendaciones se precomputan.', why: 'Convierte la operación cara en un trabajo en segundo plano y la lectura del usuario en una consulta trivial. Es posible solo porque la acotación estableció una frescura de minutos: la decisión se apoya en un requisito, no en una preferencia.', how: 'Lote cada 15 minutos que escribe el top-N en la caché.' },
      { what: 'Cada dato usa el almacenamiento que le corresponde.', why: 'Eventos, perfiles y catálogo tienen patrones de acceso incompatibles. Forzar los tres en una sola tecnología es el error de diseño más común.', how: 'Objetos para el histórico, K/V para perfiles, relacional para el catálogo.' },
      { what: 'La consistencia se razona dato a dato.', why: 'Es el punto donde se distingue a alguien que ha leído sobre el teorema CAP de alguien que ha operado un sistema. El consentimiento RGPD no puede ser eventual; una recomendación sí.', how: 'Se clasifica cada dato y se acepta la consistencia eventual de forma explícita donde procede.' },
      { what: 'Se anticipan fallos y degradación.', why: 'La pregunta "¿y si se cae Redis?" llega siempre. Responder "servimos recomendaciones genéricas por segmento" demuestra que piensas en degradar antes que en romper.', how: 'Cuatro modos de fallo con su mitigación, más el lag de consumo como métrica principal.' }
    ],

    rationale:
      'El diseño se organiza alrededor de una única observación: las escrituras superan a las lecturas en dos ' +
      'órdenes de magnitud y toleran retraso, mientras que las lecturas no lo toleran pero son pocas. Todo lo demás ' +
      'se deriva de ahí. En una ronda de system design no se busca la arquitectura correcta, que no existe: se busca ' +
      'que las decisiones se deriven de requisitos que tú mismo has acotado y que sepas qué estás sacrificando.',

    alternatives: [
      { name: 'Procesamiento en flujo en tiempo real (Flink) en vez de lotes', when: 'La frescura exigida baja a segundos.', tradeoff: 'Recomendaciones al instante, a cambio de mucha más complejidad operativa y coste. Solo se justifica si el requisito lo pide.' },
      { name: 'Lambda o Kappa como arquitectura global', when: 'Necesitas histórico y tiempo real a la vez.', tradeoff: 'Kappa (solo flujo) evita mantener dos rutas de código; Lambda da respuestas exactas en el histórico. La duplicación de lógica de Lambda es su mayor coste.' },
      { name: 'Base de datos de series temporales para los eventos', when: 'El análisis es principalmente temporal.', tradeoff: 'Consultas temporales excelentes; peor para recuperar el perfil completo de un usuario.' },
      { name: 'Cálculo al vuelo con caché agresiva', when: 'El catálogo es pequeño y el algoritmo barato.', tradeoff: 'Máxima frescura y menos infraestructura; se rompe en cuanto el algoritmo o el catálogo crecen.' },
      { name: 'Servicio gestionado de recomendaciones', when: 'No es el núcleo del negocio.', tradeoff: 'Semanas de trabajo ahorradas frente a dependencia del proveedor y menos control fino. Mencionarlo demuestra criterio de producto.' }
    ],

    commonErrors: [
      { error: 'Dibujar la arquitectura en el primer minuto.', why: 'Sin requisitos, cualquier diseño es una plantilla memorizada. El entrevistador lo detecta de inmediato.', fix: 'Cinco minutos de preguntas, siempre.' },
      { error: 'No estimar, o estimar sin enseñar el cálculo.', why: 'Las magnitudes son las que justifican las decisiones. Sin ellas todo suena arbitrario.', fix: 'Aritmética simple en voz alta, con números redondos.' },
      { error: 'Añadir tecnologías sin justificarlas.', why: 'Un diagrama con Kafka, Redis, Elasticsearch, Spark y Kubernetes sin motivo es señal de inseguridad, no de conocimiento.', fix: 'Cada caja necesita una frase que explique qué problema resuelve.' },
      { error: 'Ignorar los modos de fallo.', why: 'Diseñar solo el camino feliz es exactamente lo que no se espera de un senior.', fix: 'Recorre cada componente preguntándote qué pasa si se cae.' },
      { error: 'Decir "usamos consistencia eventual" sin decir dónde.', why: 'Aplicada al consentimiento de RGPD o a un saldo es un fallo grave; aplicada a una recomendación es correcta.', fix: 'Clasifica dato a dato.' },
      { error: 'No mencionar el coste.', why: '290 TB al año es una partida presupuestaria real. Un diseño que ignora el coste no es un diseño completo.', fix: 'Menciona retención, ciclo de vida y compresión.' },
      { error: 'Defender el diseño cuando el entrevistador propone una restricción nueva.', why: 'Está probando tu flexibilidad, no atacándote. Cambiar la escala es parte del guion.', fix: 'Ajusta el diseño en voz alta y di qué decisión anterior deja de valer.' }
    ],

    bestPractices: [
      'Requisitos, estimaciones, diseño, profundización y fallos. En ese orden.',
      'Cada componente se justifica con el problema que resuelve.',
      'La consistencia es una propiedad de cada dato, no del sistema.',
      'Diseña la degradación, no solo el funcionamiento.',
      'Enuncia los compromisos: lo que sacrificas es tan importante como lo que eliges.'
    ],

    security: [
      'Los eventos pueden contener datos personales: minimiza en la ingesta y no envíes lo que no necesitas.',
      'El borrado a efectos de RGPD debe atravesar cola, almacén histórico, perfiles y caché; se diseña al principio o se convierte en un proyecto propio.',
      'Autenticación entre servicios y cifrado en tránsito y en reposo, especialmente en el almacén histórico, que suele ser el más olvidado.',
      'Rate limiting en la ingesta: un cliente comprometido puede inyectar eventos falsos y envenenar las recomendaciones.'
    ],

    performance: [
      'El envío por lotes reduce en 50x el número de peticiones y su sobrecarga.',
      'La compresión en la cola y en el almacén histórico reduce el coste de forma directa.',
      'El lag de consumo es la métrica que primero avisa de una degradación.',
      'Precomputar traslada el coste del momento de la lectura al del proceso, que es donde puedes controlarlo.'
    ],

    companyLooksFor: [
      'Que acotes antes de diseñar.',
      'Que las decisiones se deriven de las estimaciones.',
      'Que digas en voz alta lo que descartas y por qué.',
      'Que razones la consistencia por tipo de dato.',
      'Que diseñes la degradación y menciones el coste.',
      'Que aceptes bien las restricciones nuevas a mitad de sesión.'
    ],

    scoring: {
      max: 100,
      rubric: [
        { criteria: 'Acotación de requisitos mediante preguntas', weight: 15 },
        { criteria: 'Estimaciones y su uso para decidir', weight: 15 },
        { criteria: 'Arquitectura coherente con los requisitos', weight: 25 },
        { criteria: 'Justificación de cada componente y sus alternativas', weight: 20 },
        { criteria: 'Fallos, degradación y cuellos de botella', weight: 15 },
        { criteria: 'Reconocimiento de límites y siguientes pasos', weight: 10 }
      ]
    },

    /* Vídeos que explican la técnica que evalúa esta prueba. No son la
       solución: son el material de fuera al que recurrirías si la
       documentación de arriba no te bastara. Enlaces comprobados. */
    recursos: [
      {
        titulo: 'DISEÑO de SISTEMAS para una ENTREVISTA de INGENIERO de SOFTWARE',
        canal: 'Rafa Páez - Más allá del código',
        url: 'https://www.youtube.com/watch?v=j83X1if9h1A',
        idioma: 'es',
        porque: 'El método de la entrevista: cómo estructurar la respuesta y en qué orden hablar.'
      },
      {
        titulo: 'Distributed Message Queue (Kafka): System Design Interview (Stripe & Amazon Offers)',
        canal: 'TechPrep',
        url: 'https://www.youtube.com/watch?v=Qay43Km1NwY',
        idioma: 'en',
        porque: 'El caso concreto de ingestión masiva de eventos, que es el enunciado de esta prueba.'
      },
      {
        titulo: 'Arquitectura de alto rendimiento orientada a eventos con Go y Kafka - David Torres Garrigós',
        canal: 'VLC TechFest',
        url: 'https://www.youtube.com/watch?v=OB-FtgCnQ7w',
        idioma: 'es',
        porque: 'Una charla con números de producción reales: útil para justificar decisiones, no solo dibujarlas.'
      }
    ],

    reinforce: [
      'Fundamentos: particionado, replicación, consistencia y consenso.',
      'Patrones de caché: cache-aside, write-through, estampida.',
      'Semánticas de entrega en colas: al menos una vez, como máximo una vez, exactamente una vez.',
      'Practica en voz alta con temporizador: la parte de comunicación se entrena aparte.'
    ]
  });

})(window.TT);

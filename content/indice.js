/* ============================================================
   ÍNDICE LIGERO — generado, no editar a mano
   ------------------------------------------------------------
   Regenerar con: node tools/generar-indice.js
   Fuente: content/exercises/*.js (los campos ligeros de cada
   ejercicio: identidad, categorización, textos cortos de
   búsqueda y tecnologías). NO contiene solución, documentación
   ni fases: eso solo se carga en prueba.html.
   ============================================================ */
(function (TT) {
  'use strict';

  TT.defineExerciseIndice({
    "id": "js-limpiar-correos",
    "title": "Limpia una lista de correos para una newsletter",
    "category": "javascript",
    "categorias": [
      "frontend"
    ],
    "kind": "build",
    "level": "junior",
    "context": "Una tienda online importa la lista de correos de sus clientes desde un fichero antiguo para darlos de alta en la newsletter. El fichero es un desastre: hay correos repetidos escritos con mayúsculas distintas, espacios de más, campos vacíos y alguna cadena que no es un correo en absoluto.",
    "situation": "Si se suben tal cual, el sistema de correo envía dos veces el mismo boletín a la misma persona y rechaza el lote entero en cuanto encuentra una entrada no válida.",
    "goal": "Implementar `limpiarCorreos(lista)`: una función que reciba el array tal cual viene del fichero y devuelva solo los correos válidos, normalizados y sin duplicados, conservando el orden de la primera aparición.",
    "tech": [
      "JavaScript"
    ],
    "skills": [
      "métodos de array",
      "expresiones regulares",
      "normalización de datos",
      "eliminación de duplicados"
    ],
    "tags": [
      "arrays",
      "strings",
      "expresiones regulares",
      "duplicados"
    ],
    "time": 30
  });

  TT.defineExerciseIndice({
    "id": "js-resumen-carrito",
    "title": "Calcula el resumen de un carrito de la compra",
    "category": "javascript",
    "categorias": [
      "frontend"
    ],
    "kind": "build",
    "level": "junior",
    "context": "Una tienda pequeña quiere mostrar, antes de pasar por caja, un resumen del carrito: cuántas unidades lleva el cliente, cuánto suma todo, si tiene descuento por compra grande y el total final.",
    "situation": "El equipo de frontend necesita una función que reciba la lista de productos del carrito y calcule ese resumen, para poder usarla igual en la web y en la aplicación móvil.",
    "goal": "Implementar `resumenCarrito(items)`: una función pura que calcule el subtotal, las unidades totales, el descuento aplicable y el total final de un carrito.",
    "tech": [
      "JavaScript"
    ],
    "skills": [
      "reduce",
      "operadores aritméticos",
      "redondeo",
      "funciones puras"
    ],
    "tags": [
      "reduce",
      "arrays",
      "operadores",
      "aritmética"
    ],
    "time": 30
  });

  TT.defineExerciseIndice({
    "id": "fe-buscador-debounce",
    "title": "Buscador en vivo sin peticiones de más",
    "category": "frontend",
    "categorias": [
      "javascript"
    ],
    "kind": "build",
    "level": "junior-adv",
    "context": "Trabajas en el equipo de un marketplace. El buscador de la cabecera lanza una petición por cada tecla pulsada. Con 40 000 usuarios simultáneos, el backend recibe picos de tráfico que no vienen de búsquedas reales, sino de gente escribiendo.",
    "situation": "Además del exceso de peticiones hay un bug reportado por soporte: si el usuario escribe rápido, a veces la lista muestra los resultados de una búsqueda anterior. La respuesta lenta llega después de la rápida y pisa el resultado correcto.",
    "goal": "Implementar una función createSearch que agrupe las pulsaciones, cancele las búsquedas obsoletas y garantice que solo se pinta el resultado de la última consulta escrita.",
    "tech": [
      "JavaScript",
      "DOM",
      "Async"
    ],
    "skills": [
      "debounce",
      "race conditions",
      "cierres (closures)",
      "gestión de estado asíncrono"
    ],
    "tags": [
      "debounce",
      "async",
      "race condition"
    ],
    "time": 40
  });

  TT.defineExerciseIndice({
    "id": "js-orden-ejecucion",
    "title": "Predecir la salida: microtareas, macrotareas y cierres",
    "category": "javascript",
    "categorias": [],
    "kind": "complete",
    "level": "junior-adv",
    "context": "Una parte muy común de la criba técnica consiste en enseñarte un fragmento corto y preguntarte qué imprime. No se evalúa la memoria: se evalúa si tienes un modelo mental correcto de cómo ejecuta JavaScript.",
    "situation": "Te dan un fragmento con `var` en un bucle, un `setTimeout`, una promesa resuelta y un `console.log` síncrono. Un candidato que solo ha memorizado \"async/await espera\" falla; quien entiende la cola de microtareas acierta.",
    "goal": "Declarar una variable `salida` con el array exacto de valores que imprime el fragmento, en orden, y después explicar el porqué de cada posición.",
    "tech": [
      "JavaScript"
    ],
    "skills": [
      "bucle de eventos",
      "microtareas",
      "cierres (closures)",
      "ámbito de var y let"
    ],
    "tags": [
      "event loop",
      "closures",
      "hoisting"
    ],
    "time": 25
  });

  TT.defineExerciseIndice({
    "id": "fe-estados-accesibles",
    "title": "Los cinco estados de una lista de datos",
    "category": "frontend",
    "categorias": [],
    "kind": "build",
    "level": "mid",
    "context": "Una fintech recibe muchas incidencias del tipo \"la pantalla se queda en blanco\". Al revisarlo, la mayoría de componentes solo contemplan dos estados: cargando y con datos. Falta todo lo demás.",
    "situation": "Tienes un componente que pinta una lista de transacciones. Debes convertirlo en un componente que cubra los cinco estados reales de cualquier vista de datos y que sea usable con teclado y lector de pantalla.",
    "goal": "Implementar una función pura `estadoVista(datos)` que decida el estado a renderizar, y describir el marcado accesible de cada uno.",
    "tech": [
      "JavaScript",
      "HTML",
      "ARIA",
      "CSS"
    ],
    "skills": [
      "estados de interfaz",
      "accesibilidad",
      "gestión de errores en UI",
      "HTML semántico"
    ],
    "tags": [
      "accesibilidad",
      "estados de UI",
      "ARIA"
    ],
    "time": 60
  });

  TT.defineExerciseIndice({
    "id": "be-refactor-produccion",
    "title": "De \"funciona en mi máquina\" a código de producción",
    "category": "refactor",
    "categorias": [
      "backend",
      "testing"
    ],
    "kind": "refactor",
    "level": "mid",
    "context": "Heredas el endpoint de alta de usuarios de una startup que creció rápido. Funciona: el registro da de alta gente todos los días. Pero el equipo de guardia recibe alertas que no sabe interpretar y hay un incidente abierto porque una contraseña apareció en los logs.",
    "situation": "El código mezcla en una sola función la validación, el acceso a datos, el envío de correo y el formato de la respuesta HTTP. Los errores se tragan con `catch` vacíos o se devuelven como texto, y el `catch` general responde 200 con `{ ok: false }`.",
    "goal": "Reescribir `registrarUsuario` separando responsabilidades, distinguiendo errores operativos de errores de programación y sin filtrar datos sensibles, manteniendo exactamente el mismo comportamiento funcional.",
    "tech": [
      "Node.js",
      "JavaScript"
    ],
    "skills": [
      "gestión de errores",
      "validación",
      "separación por capas",
      "logging seguro"
    ],
    "tags": [
      "node",
      "errores",
      "validación",
      "capas"
    ],
    "time": 55
  });

  TT.defineExerciseIndice({
    "id": "api-cliente-resistente",
    "title": "Cliente de API que sobrevive a la red real",
    "category": "apis",
    "categorias": [
      "backend",
      "performance"
    ],
    "kind": "api-consume",
    "level": "mid",
    "context": "Integráis un proveedor externo de tipos de cambio. Su API tiene un límite de 60 peticiones por minuto, devuelve 429 con cabecera `Retry-After` cuando te pasas y, un par de veces al día, algún 503 pasajero.",
    "situation": "La integración actual hace `fetch` y confía. Cuando el proveedor devuelve 429, vuestro servicio propaga el error al usuario final. Cuando devuelve 503, se pierde la operación aunque bastaba con reintentar.",
    "goal": "Implementar `peticionRobusta(fetchFn, opciones)` con reintentos, retroceso exponencial con jitter, respeto de `Retry-After` y una regla clara sobre qué se reintenta y qué no.",
    "tech": [
      "JavaScript",
      "HTTP"
    ],
    "skills": [
      "reintentos",
      "backoff exponencial",
      "idempotencia",
      "diseño de clientes HTTP"
    ],
    "tags": [
      "reintentos",
      "backoff",
      "rate limit",
      "idempotencia"
    ],
    "time": 50
  });

  TT.defineExerciseIndice({
    "id": "test-tests-que-detectan",
    "title": "Escribe tests que detecten bugs de verdad",
    "category": "testing",
    "categorias": [],
    "kind": "test-write",
    "level": "junior-adv",
    "context": "Un comercio electrónico tiene el 87 % de cobertura de tests y aun así se les coló en producción un cupón que se aplicaba sin importe mínimo. Perdieron 12 000 € en tres días. Los tests pasaban todos.",
    "situation": "Al revisarlo, los 40 tests comprobaban el mismo caso con datos distintos: un producto, sin cupón, importe alto. Ninguno tocaba un límite. La cobertura medía qué líneas se ejecutaban, no qué fallos se detectaban.",
    "goal": "Escribir una batería de tests para `calcularPrecio` que pase con la implementación correcta y **falle con cada una de las cinco versiones defectuosas** que la plataforma va a probar contra tus tests.",
    "tech": [
      "JavaScript",
      "Testing"
    ],
    "skills": [
      "diseño de casos de prueba",
      "casos borde",
      "valores límite",
      "testing de mutación"
    ],
    "tags": [
      "testing",
      "casos borde",
      "mutation testing"
    ],
    "time": 45
  });

  TT.defineExerciseIndice({
    "id": "dbg-carrito-fantasma",
    "title": "Debugging Challenge: el carrito que suma mal",
    "category": "debugging",
    "categorias": [
      "javascript"
    ],
    "kind": "fix",
    "level": "mid",
    "context": "Atención al cliente ha abierto 31 incidencias en dos semanas sobre el carrito de la tienda. Los mensajes no se parecen entre sí: \"aparece dos veces el mismo producto\", \"el contador dice 3 y tengo 7 unidades\", \"al quitar un artículo se rompe la página\", \"el total tiene mil decimales\".",
    "situation": "El desarrollador que lo escribió ya no está. El módulo son 30 líneas, no tiene tests y en apariencia funciona: si añades un producto y miras el total, todo parece correcto. Los fallos solo salen cuando el usuario hace algo más que el camino feliz.",
    "goal": "Encontrar y corregir los cuatro fallos de `crearCarrito` sin cambiar su interfaz pública: los métodos deben seguir llamándose igual y recibiendo los mismos parámetros.",
    "tech": [
      "JavaScript"
    ],
    "skills": [
      "diagnóstico de fallos",
      "manejo de arrays",
      "estado mutable",
      "lectura de código ajeno"
    ],
    "tags": [
      "debugging",
      "estado",
      "arrays",
      "diagnóstico"
    ],
    "time": 50
  });

  TT.defineExerciseIndice({
    "id": "db-n-mas-uno",
    "title": "La consulta que se multiplica: resolver un N+1",
    "category": "databases",
    "categorias": [
      "backend",
      "performance"
    ],
    "kind": "optimize",
    "level": "mid",
    "context": "El panel de pedidos de una tienda tarda 400 ms con clientes pequeños y 14 segundos con los grandes. El equipo de infraestructura ha subido la máquina de la base de datos dos veces y no ha servido de nada: la CPU está al 12 %.",
    "situation": "Al activar el registro de consultas aparece el motivo. Para un usuario con 200 pedidos se ejecutan 401 consultas: una para traer los pedidos, una por pedido para traer su cliente y una por pedido para traer sus líneas. Cada una tarda 30 ms de ida y vuelta, y 401 × 30 ms son 12 segundos de espera pura.",
    "goal": "Reescribir `obtenerPedidos` para que el número de consultas sea **constante** —tres— sin importar cuántos pedidos tenga el usuario, manteniendo exactamente la misma estructura de datos devuelta.",
    "tech": [
      "JavaScript",
      "SQL",
      "Node.js"
    ],
    "skills": [
      "problema N+1",
      "consultas por lotes",
      "agrupación en memoria",
      "análisis de rendimiento"
    ],
    "tags": [
      "N+1",
      "rendimiento",
      "consultas",
      "agrupación en memoria"
    ],
    "time": 50
  });

  TT.defineExerciseIndice({
    "id": "sec-control-acceso",
    "title": "Control de acceso roto: el endpoint que edita facturas ajenas",
    "category": "security",
    "categorias": [
      "backend",
      "apis"
    ],
    "kind": "security",
    "level": "mid",
    "context": "Una auditoría externa ha encontrado que, en la plataforma de facturación, cualquier usuario autenticado puede modificar la factura de otro cambiando un número en la petición. También ha descubierto que se pueden marcar facturas como pagadas sin pasar por el cobro.",
    "situation": "El endpoint que edita facturas comprueba que hay sesión iniciada y da por hecho que eso basta. Después aplica sobre la factura todo lo que venga en el cuerpo de la petición, sin filtrar, y devuelve el registro completo tal como está en la base de datos.",
    "goal": "Reescribir `editarFactura` para que solo se pueda modificar lo que corresponde, solo por quien corresponde, y sin devolver información que el cliente no necesita.",
    "tech": [
      "Node.js",
      "JavaScript",
      "HTTP"
    ],
    "skills": [
      "autorización",
      "IDOR",
      "asignación masiva",
      "principio de mínimo privilegio",
      "exposición de datos"
    ],
    "tags": [
      "IDOR",
      "asignación masiva",
      "autorización",
      "OWASP"
    ],
    "time": 55
  });

  TT.defineExerciseIndice({
    "id": "ai-salidas-estructuradas",
    "title": "Salidas estructuradas que no rompen el sistema",
    "category": "ai",
    "categorias": [],
    "kind": "ai-build",
    "level": "junior-adv",
    "context": "Una gestoría procesa facturas en PDF. El texto extraído se envía a un modelo que devuelve JSON con los campos de la factura y ese JSON entra directo en la contabilidad. Ya han tenido dos incidencias: un importe con coma decimal que se guardó como texto y un NIF que el modelo se inventó porque el PDF estaba borroso.",
    "situation": "La capa que llama al modelo hace `JSON.parse(respuesta)` y lo inserta. Si el modelo devuelve texto antes del JSON, revienta. Si devuelve campos de más, se guardan. Si no encuentra un dato, lo rellena con algo plausible.",
    "goal": "Implementar `procesarFactura(modelo, texto)`: llama al modelo, valida la salida contra un esquema estricto, normaliza tipos, descarta lo que no está en el esquema y nunca deja pasar un dato inventado sin marcar.",
    "tech": [
      "JavaScript",
      "LLM APIs",
      "JSON Schema"
    ],
    "skills": [
      "salidas estructuradas",
      "validación de datos",
      "gestión de alucinaciones",
      "diseño de contratos con LLM"
    ],
    "tags": [
      "structured outputs",
      "validación",
      "alucinaciones"
    ],
    "time": 45
  });

  TT.defineExerciseIndice({
    "id": "ai-rag-con-evidencia",
    "title": "RAG que sabe decir \"no lo sé\"",
    "category": "ai",
    "categorias": [],
    "kind": "ai-build",
    "level": "mid",
    "context": "Una aseguradora despliega un asistente interno sobre sus condiciones de póliza. En la demo funcionaba. En producción, un agente de atención al cliente comunicó a un asegurado una cobertura que no existe: el modelo la generó a partir de un fragmento recuperado de otra póliza distinta.",
    "situation": "El pipeline recupera los 5 fragmentos más parecidos y los mete en el prompt sin más. No filtra por relevancia, no comprueba que la respuesta se apoye en ellos y nunca se abstiene: siempre contesta algo.",
    "goal": "Implementar `responderConEvidencia(indice, modelo, pregunta, opciones)` que recupere, filtre por umbral, se abstenga cuando no hay evidencia suficiente y devuelva la respuesta acompañada de las citas que la sostienen.",
    "tech": [
      "JavaScript",
      "RAG",
      "Embeddings",
      "LLM APIs"
    ],
    "skills": [
      "recuperación",
      "umbral de relevancia",
      "abstención",
      "citas verificables",
      "evaluación de RAG"
    ],
    "tags": [
      "RAG",
      "citas",
      "abstención",
      "evaluación"
    ],
    "time": 60
  });

  TT.defineExerciseIndice({
    "id": "ai-agente-en-bucle",
    "title": "AI Debugging Challenge: el agente que quemó el presupuesto",
    "category": "agents",
    "categorias": [
      "ai",
      "debugging",
      "performance"
    ],
    "kind": "agent-debug",
    "level": "senior",
    "context": "Un agente de soporte lleva dos semanas en producción. Funciona: resuelve consultas. Pero la factura de tokens se ha multiplicado por siete y ayer una conversación consumió 400 000 tokens antes de que alguien la cortara a mano. El equipo dice que \"a veces se queda pensando\".",
    "situation": "Al revisar las trazas aparecen cuatro patrones: llama a la misma herramienta con los mismos argumentos una y otra vez; cuando una herramienta falla, reintenta indefinidamente; el historial crece sin límite en cada vuelta; y da por buenos resultados de herramienta que son errores.",
    "goal": "Reescribir el bucle del agente añadiendo los controles que faltan, sin perder la capacidad de resolver tareas que sí requieren varias llamadas.",
    "tech": [
      "JavaScript",
      "Agents SDK",
      "Observabilidad"
    ],
    "skills": [
      "bucles de agente",
      "guardrails",
      "control de coste",
      "validación de resultados de herramientas",
      "trazabilidad"
    ],
    "tags": [
      "agentes",
      "bucles",
      "coste",
      "guardrails",
      "observabilidad"
    ],
    "time": 75
  });

  TT.defineExerciseIndice({
    "id": "ai-evals-juez",
    "title": "Evals: saber si tu cambio de prompt mejora o empeora",
    "category": "agents",
    "categorias": [
      "ai",
      "testing"
    ],
    "kind": "eval",
    "level": "mid",
    "context": "El asistente de soporte de una empresa lleva cuatro meses en producción. Cada vez que alguien retoca el prompt, el equipo prueba tres o cuatro preguntas a mano, le parece que va mejor y despliega. La semana pasada un cambio que \"claramente mejoraba\" disparó las quejas: había roto las respuestas sobre devoluciones, que nadie probó.",
    "situation": "No hay forma de saber si una versión es mejor que otra. No hay conjunto de casos, no hay métricas y no hay historial. Las decisiones se toman por impresión, y cada despliegue es una apuesta.",
    "goal": "Implementar `ejecutarEvals`, el motor que ejecuta un conjunto de casos contra el sistema, combina comprobaciones deterministas con un modelo juez, agrega los resultados y detecta regresiones respecto a la ejecución anterior.",
    "tech": [
      "JavaScript",
      "LLM APIs",
      "Evaluación"
    ],
    "skills": [
      "diseño de evals",
      "LLM como juez",
      "detección de regresiones",
      "control de coste",
      "métricas de calidad"
    ],
    "tags": [
      "evals",
      "LLM como juez",
      "regresiones",
      "coste"
    ],
    "time": 60
  });

  TT.defineExerciseIndice({
    "id": "ai-mcp-servidor",
    "title": "MCP: publica herramientas que un modelo pueda usar sin romperse",
    "category": "ai",
    "categorias": [
      "agents"
    ],
    "kind": "agent-build",
    "level": "mid",
    "context": "Vuestra empresa quiere exponer sus operaciones internas —consultar inventario, crear tickets— para que los asistentes de IA del equipo puedan usarlas. La primera versión se hizo pasando las funciones directamente al modelo.",
    "situation": "Lleva dos semanas dando problemas. El modelo llama a herramientas con nombres que se inventa, pasa argumentos con el tipo equivocado o incompletos, y cuando una herramienta lanza, la excepción sube y tumba la conversación entera. Además, una herramienta que se colgó dejó la sesión bloqueada cuarenta segundos.",
    "goal": "Implementar `crearServidor`, la capa que publica las herramientas con su esquema, valida cada llamada antes de ejecutarla y **nunca lanza**: todo error se devuelve como resultado estructurado.",
    "tech": [
      "JavaScript",
      "MCP",
      "JSON Schema"
    ],
    "skills": [
      "diseño de herramientas",
      "validación por esquema",
      "errores estructurados",
      "timeouts",
      "contratos para modelos"
    ],
    "tags": [
      "MCP",
      "herramientas",
      "esquemas",
      "validación"
    ],
    "time": 60
  });

  TT.defineExerciseIndice({
    "id": "emp-code-review",
    "title": "Code Review Challenge: revisa este Pull Request",
    "category": "company",
    "categorias": [
      "security",
      "backend",
      "databases"
    ],
    "kind": "code-review",
    "level": "senior",
    "context": "Segunda ronda de un proceso para un puesto senior. Te comparten un Pull Request real de su repositorio (anonimizado) y te piden que hagas la revisión que harías a un compañero. No buscan que encuentres \"un fallo\": buscan ver cómo priorizas, cómo comunicas y qué das por bueno.",
    "situation": "El PR se titula \"feat: canjeo de cupones de descuento\". Pasa los tests, el compañero tiene prisa por entrar en la release de mañana y ya tiene una aprobación de otro miembro del equipo.",
    "goal": "Escribir la revisión: identificar los problemas, clasificarlos por gravedad (bloqueante, importante, sugerencia) y redactar los comentarios como se los dirías a una persona con la que vas a seguir trabajando.",
    "tech": [
      "Node.js",
      "SQL",
      "Express"
    ],
    "skills": [
      "revisión de código",
      "concurrencia",
      "seguridad",
      "comunicación técnica",
      "priorización"
    ],
    "tags": [
      "code review",
      "seguridad",
      "concurrencia"
    ],
    "time": 45
  });

  TT.defineExerciseIndice({
    "id": "emp-frontend-challenge",
    "title": "Frontend Developer Challenge: panel de incidencias",
    "category": "company",
    "categorias": [
      "frontend",
      "testing"
    ],
    "kind": "build",
    "level": "mid",
    "context": "Prueba para llevar a casa de una empresa de software de logística. Te dan 48 horas y esperan entre 3 y 4 horas de trabajo. En la ronda siguiente te pedirán que defiendas cada decisión: en 2026 casi todas las empresas asumen que has usado IA y lo que evalúan es si entiendes y justificas lo que has entregado.",
    "situation": "Necesitan un panel donde el equipo de operaciones vea las incidencias abiertas, filtre, ordene y cambie el estado de cada una. La API existe y está documentada. El diseño te lo dan en Figma, pero aceptan una interpretación razonable si justificas las decisiones.",
    "goal": "Entregar una aplicación pequeña pero completa: consumo de API, gestión de estado, filtros, responsive, accesible, con manejo de errores y con tests que aporten algo.",
    "tech": [
      "React",
      "TypeScript",
      "Vitest",
      "CSS"
    ],
    "skills": [
      "consumo de APIs",
      "gestión de estado",
      "accesibilidad",
      "testing",
      "diseño responsive",
      "toma de decisiones técnicas"
    ],
    "tags": [
      "take-home",
      "React",
      "accesibilidad",
      "testing"
    ],
    "time": 240
  });

  TT.defineExerciseIndice({
    "id": "emp-system-design",
    "title": "System Design: 2 millones de eventos por minuto",
    "category": "system-design",
    "categorias": [
      "architecture",
      "performance"
    ],
    "kind": "design",
    "level": "senior",
    "context": "Ronda de diseño de sistemas para un puesto senior. Cuarenta y cinco minutos, una pizarra compartida y un entrevistador que va a ir subiendo la escala y añadiendo restricciones a medida que respondas.",
    "situation": "Enunciado inicial, deliberadamente vago: \"Diseña la plataforma que recoge la actividad de los usuarios de nuestra aplicación y les muestra recomendaciones personalizadas\". No te dan cifras. Que las pidas forma parte de la evaluación.",
    "goal": "Conducir la sesión: acotar requisitos, estimar magnitudes, proponer una arquitectura, justificar las decisiones y reconocer los puntos débiles antes de que te los señalen.",
    "tech": [
      "Arquitectura",
      "Kafka",
      "Redis",
      "PostgreSQL",
      "Almacenamiento de objetos"
    ],
    "skills": [
      "diseño de sistemas",
      "estimación de capacidad",
      "consistencia y disponibilidad",
      "caché",
      "colas",
      "compromisos de diseño"
    ],
    "tags": [
      "escalabilidad",
      "colas",
      "caché",
      "consistencia"
    ],
    "time": 60
  });

})(window.TT);

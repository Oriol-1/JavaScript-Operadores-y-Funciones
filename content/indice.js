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
    "time": 30,
    "empresa": {
      "empresas": [
        "factorial",
        "typeform",
        "caixabank-tech"
      ],
      "evidencia": "inspirada",
      "puesto": "Full Stack Engineer (Junior)",
      "rol": "fullstack",
      "formato": "take-home",
      "dificultad": 1,
      "evalua": [
        "Limpieza de datos de entrada, que es la mitad del trabajo real en producto de RRHH y formularios.",
        "Casos límite silenciosos: espacios, mayúsculas, duplicados y valores vacíos.",
        "Código legible en una función pequeña, sin librerías."
      ],
      "nota": "Ninguna de las tres publica esta prueba. Se construye a partir de su dominio —datos introducidos por personas en formularios, fichas de empleado o formularios bancarios— y del nivel de entrada de sus ofertas: CaixaBank Tech es de las pocas empresas del ecosistema que publica vacantes con seis meses de experiencia mínima.",
      "fuentes": [
        {
          "titulo": "Careers in Factorial",
          "url": "https://factorialhr.com/join-factorial"
        },
        {
          "titulo": "Engineering Jobs — Careers at Typeform",
          "url": "https://www.typeform.com/careers/engineering"
        },
        {
          "titulo": "CaixaBank Tech — Junior Software Engineer Java + Python",
          "url": "https://caixabanktech.com/en/job/junior-software-engineer-java-python-3/"
        }
      ]
    }
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
    "time": 30,
    "empresa": {
      "empresas": [
        "glovo",
        "wallapop"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend Engineer (Junior)",
      "rol": "backend",
      "formato": "take-home",
      "dificultad": 2,
      "evalua": [
        "Agregar y resumir una colección sin perder precisión en los importes.",
        "Reglas de negocio pequeñas pero con casos límite: carrito vacío, cantidades cero, descuentos.",
        "Elegir la estructura de datos adecuada en vez de encadenar bucles."
      ],
      "nota": "Inspirada en el dominio de marketplace de ambas empresas (carrito, precios, totales). No es su prueba: ninguna la publica.",
      "fuentes": [
        {
          "titulo": "Pruebas técnicas en procesos de selección en España",
          "url": "https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion"
        },
        {
          "titulo": "Companies that don’t have a broken hiring process",
          "url": "https://github.com/poteto/hiring-without-whiteboards"
        }
      ]
    }
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
    "time": 40,
    "empresa": {
      "empresas": [
        "meta",
        "airbnb"
      ],
      "evidencia": "inspirada",
      "puesto": "Frontend Engineer",
      "rol": "frontend",
      "formato": "live-coding",
      "dificultad": 3,
      "evalua": [
        "JavaScript y DOM por debajo del framework: temporizadores, cancelación y eventos.",
        "Condiciones de carrera en la interfaz: respuestas que llegan desordenadas.",
        "Escribir código ejecutable, no pseudocódigo — es un requisito explícito en ambos procesos."
      ],
      "nota": "El buscador con debounce y cancelación es un clásico del live coding de frontend. Meta y Airbnb documentan el formato (código ejecutable, tiempo corto); el enunciado concreto es nuestro.",
      "fuentes": [
        {
          "titulo": "Preparing for your software engineering interview at Meta",
          "url": "https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/"
        },
        {
          "titulo": "Airbnb interview questions — interviewing.io",
          "url": "https://interviewing.io/airbnb-interview-questions"
        }
      ]
    }
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
    "time": 25,
    "empresa": {
      "empresas": [
        "meta",
        "google"
      ],
      "evidencia": "inspirada",
      "puesto": "Frontend / JavaScript Engineer",
      "rol": "frontend",
      "formato": "quiz",
      "dificultad": 3,
      "evalua": [
        "Modelo mental del bucle de eventos: microtareas, macrotareas y orden de resolución.",
        "Explicar el porqué, no solo acertar la salida: es lo que separa a un mid de un junior.",
        "Precisión bajo presión de tiempo, sin ejecutar el código."
      ],
      "nota": "Formato de pregunta rápida eliminatoria. Ambas empresas publican que se espera razonar sin compilador; el ejercicio concreto es nuestro.",
      "fuentes": [
        {
          "titulo": "Preparing for your software engineering interview at Meta",
          "url": "https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/"
        },
        {
          "titulo": "Software Engineer interview prep guide — Google Careers",
          "url": "https://www.google.com/about/careers/applications/candidate-prep/swe"
        }
      ]
    }
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
    "time": 60,
    "empresa": {
      "empresas": [
        "airbnb",
        "vercel",
        "typeform",
        "spotify"
      ],
      "evidencia": "inspirada",
      "puesto": "Frontend Engineer",
      "rol": "frontend",
      "formato": "mini-app",
      "dificultad": 3,
      "evalua": [
        "Todos los estados de una interfaz, no solo el feliz: carga, vacío, error y éxito.",
        "Accesibilidad real con ARIA y foco, no como añadido final.",
        "Criterio de producto: qué ve el usuario mientras algo falla."
      ],
      "nota": "Construir un componente completo con todos sus estados es el formato habitual de frontend en las cuatro. El componente concreto es nuestro.",
      "fuentes": [
        {
          "titulo": "Airbnb interview questions — interviewing.io",
          "url": "https://interviewing.io/airbnb-interview-questions"
        },
        {
          "titulo": "Engineering Jobs — Careers at Typeform",
          "url": "https://www.typeform.com/careers/engineering"
        },
        {
          "titulo": "Start Your Journey — Life at Spotify",
          "url": "https://www.lifeatspotify.com/start-your-journey"
        },
        {
          "titulo": "Companies that don’t have a broken hiring process",
          "url": "https://github.com/poteto/hiring-without-whiteboards"
        }
      ]
    }
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
    "time": 55,
    "empresa": {
      "empresas": [
        "cabify",
        "gitlab",
        "automattic"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend Engineer",
      "rol": "backend",
      "formato": "refactor",
      "dificultad": 3,
      "evalua": [
        "Separar capas sin cambiar el comportamiento observable.",
        "Justificar cada movimiento: un refactor que no sabes defender no vale.",
        "Reconocer qué NO hay que tocar todavía."
      ],
      "nota": "Las tres evalúan sobre código que ya existe: Cabify revisa tu entrega contigo delante, GitLab trabaja sobre repositorios grandes y Automattic publica que su prueba consiste en modificar código existente con un compañero asignado. El código a refactorizar es nuestro.",
      "fuentes": [
        {
          "titulo": "Pruebas técnicas en procesos de selección en España",
          "url": "https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion"
        },
        {
          "titulo": "Technical Interviews — The GitLab Handbook",
          "url": "https://handbook.gitlab.com/handbook/hiring/interviewing/technical/"
        },
        {
          "titulo": "How We Hire Developers — Automattic",
          "url": "https://automattic.com/work-with-us/how-we-hire-developers/"
        }
      ]
    }
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
    "time": 50,
    "empresa": {
      "empresas": [
        "stripe",
        "cloudflare",
        "edreams"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend Engineer",
      "rol": "backend",
      "formato": "api-integration",
      "dificultad": 3,
      "evalua": [
        "Implementar contra una API que no conoces, con la documentación abierta: es literalmente su ronda de integración.",
        "Reintentos con espera exponencial, respeto de los límites de peticiones e idempotencia.",
        "Errores tratados como parte del contrato, no como excepción rara."
      ],
      "nota": "Stripe tiene una ronda de integración con API documentada por testimonios; en Cloudflare, HTTP y los límites de peticiones aparecen en casi todas las rondas; y eDreams ODIGEO vive de integrarse con proveedores de viaje que fallan, cachean mal y limitan las consultas. El cliente concreto es nuestro.",
      "fuentes": [
        {
          "titulo": "La ronda Bug Squash de Stripe, según testimonios de candidatos",
          "url": "https://www.coditioning.com/blog/804/stripe-swe-bug-squash-interview"
        },
        {
          "titulo": "Experiencias de entrevista en Cloudflare — Taro",
          "url": "https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/"
        },
        {
          "titulo": "eDreams ODIGEO Tech Blog",
          "url": "https://tech.edreamsodigeo.com/"
        }
      ]
    }
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
    "time": 45,
    "empresa": {
      "empresas": [
        "github",
        "cabify"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend / QA Engineer",
      "rol": "qa",
      "formato": "testing",
      "dificultad": 2,
      "evalua": [
        "Distinguir cobertura de detección: un test que no puede fallar no prueba nada.",
        "Escribir el caso límite antes que el camino feliz.",
        "Tests como documentación del comportamiento esperado."
      ],
      "nota": "GitHub evalúa las entregas con tests automáticos y rúbrica; en Cabify la calidad de los tests pesa más que la funcionalidad extra. El ejercicio es nuestro.",
      "fuentes": [
        {
          "titulo": "How GitHub does take home technical interviews — The GitHub Blog",
          "url": "https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/"
        },
        {
          "titulo": "Pruebas técnicas en procesos de selección en España",
          "url": "https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion"
        }
      ]
    }
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
    "time": 50,
    "empresa": {
      "empresas": [
        "stripe",
        "netflix"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend Engineer",
      "rol": "backend",
      "formato": "bug-squash",
      "dificultad": 3,
      "evalua": [
        "Depuración metódica y narrada: leer el síntoma, formular una hipótesis y comprobarla antes de tocar código.",
        "Encontrar la causa raíz en lugar de tapar el síntoma.",
        "Moverse por código que no escribiste tú."
      ],
      "nota": "El formato reproduce la ronda \"Bug Squash\" de Stripe (repositorio ajeno, fallo real, diagnóstico en voz alta) documentada por testimonios de candidatos. El bug concreto es nuestro.",
      "fuentes": [
        {
          "titulo": "La ronda Bug Squash de Stripe, según testimonios de candidatos",
          "url": "https://www.coditioning.com/blog/804/stripe-swe-bug-squash-interview"
        },
        {
          "titulo": "Demystifying Interviewing for Backend Engineers @ Netflix",
          "url": "https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495"
        }
      ]
    }
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
    "time": 50,
    "empresa": {
      "empresas": [
        "travelperk",
        "wallapop"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend Engineer",
      "rol": "backend",
      "formato": "optimizacion",
      "dificultad": 3,
      "evalua": [
        "Medir antes de optimizar: identificar el cuello de botella con datos.",
        "El patrón N+1, que es el problema de rendimiento más frecuente en producto con base de datos.",
        "Índices y consultas que escalan con el volumen real, no con el de tu portátil."
      ],
      "nota": "Ambas trabajan con catálogos y búsquedas de gran volumen. La optimización concreta es nuestra.",
      "fuentes": [
        {
          "titulo": "How do we hire engineers @ TravelPerk?",
          "url": "https://medium.com/@alexander.ludwick/how-do-we-hire-engineers-travelperk-afabbf82aedc"
        },
        {
          "titulo": "Pruebas técnicas en procesos de selección en España",
          "url": "https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion"
        }
      ]
    }
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
    "time": 55,
    "empresa": {
      "empresas": [
        "revolut",
        "cloudflare"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend / Security Engineer",
      "rol": "security",
      "formato": "code-review",
      "dificultad": 4,
      "evalua": [
        "Autorización a nivel de recurso, no solo autenticación: el fallo de acceso más común y más caro.",
        "Pensar como quien ataca: qué pasa si cambio el identificador de la URL.",
        "Defensa en profundidad y registro de auditoría."
      ],
      "nota": "En banca digital y en seguridad de red el control de acceso es tema obligado en el proceso. El endpoint vulnerable es nuestro.",
      "fuentes": [
        {
          "titulo": "Companies that don’t have a broken hiring process",
          "url": "https://github.com/poteto/hiring-without-whiteboards"
        },
        {
          "titulo": "Experiencias de entrevista en Cloudflare — Taro",
          "url": "https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/"
        }
      ]
    }
  });

  TT.defineExerciseIndice({
    "id": "alg-ventana-deslizante",
    "title": "El pico de peticiones: ventana deslizante en O(n)",
    "category": "javascript",
    "categorias": [
      "performance"
    ],
    "kind": "build",
    "level": "mid",
    "context": "Ronda de algoritmos de 45 minutos, con un ingeniero al otro lado y un editor compartido sin autocompletado. El problema está sacado de un sistema real: el equipo de infraestructura necesita saber cuál fue el momento de más carga de cada cliente para dimensionar sus límites de peticiones.",
    "situation": "Tienes las marcas de tiempo (en milisegundos) de todas las peticiones que un cliente hizo ayer. Quieren saber **cuántas peticiones llegó a hacer, como máximo, en una ventana de tiempo cualquiera**: si el límite es de 100 peticiones por minuto y su pico real fue de 340, hay que hablar con ese cliente.\nEl entrevistador te avisa de dos cosas antes de empezar: que hay clientes con millones de peticiones diarias, y que el fichero de origen **no siempre llega ordenado**.",
    "goal": "Implementar `picoDePeticiones(marcas, ventanaMs)`, que devuelve el número máximo de peticiones contenidas en cualquier ventana de `ventanaMs` milisegundos, con complejidad lineal tras ordenar.",
    "tech": [
      "JavaScript",
      "Algoritmos"
    ],
    "skills": [
      "dos punteros",
      "ventana deslizante",
      "análisis de complejidad",
      "casos límite",
      "inmutabilidad"
    ],
    "tags": [
      "algoritmos",
      "dos punteros",
      "complejidad",
      "rate limiting"
    ],
    "time": 35,
    "empresa": {
      "empresas": [
        "google",
        "meta",
        "netflix"
      ],
      "evidencia": "documentada",
      "puesto": "Software Engineer",
      "rol": "backend",
      "formato": "algoritmos",
      "dificultad": 3,
      "evalua": [
        "Análisis de complejidad explícito: llegar a O(n) y saber decir por qué lo es.",
        "Casos límite tratados antes de escribir el bucle, no después de que falle un test.",
        "Narrar el razonamiento mientras programas: el comité de Google solo lee lo que el entrevistador anotó."
      ],
      "nota": "Google y Meta publican en sus guías oficiales que sus rondas técnicas evalúan estructuras de datos, algoritmos y complejidad, y Netflix documenta que sus problemas son piezas de infraestructura reconocibles como un limitador de peticiones. Ese formato está documentado; el enunciado concreto de esta prueba es original nuestro.",
      "fuentes": [
        {
          "titulo": "Software Engineer interview prep guide — Google Careers",
          "url": "https://www.google.com/about/careers/applications/candidate-prep/swe"
        },
        {
          "titulo": "Preparing for your software engineering interview at Meta",
          "url": "https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/"
        },
        {
          "titulo": "Demystifying Interviewing for Backend Engineers @ Netflix",
          "url": "https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495"
        }
      ]
    }
  });

  TT.defineExerciseIndice({
    "id": "sql-informe-actividad",
    "title": "Informe de actividad: la consulta que tarda ocho minutos",
    "category": "databases",
    "categorias": [
      "performance",
      "backend"
    ],
    "kind": "optimize",
    "level": "mid",
    "context": "Ronda de datos de 45 minutos con un editor SQL compartido. No hay ejecución: escribes la consulta y la defiendes. El entrevistador te avisa de que le interesa más **por qué** eliges cada cosa que que la sintaxis compile a la primera.",
    "situation": "El equipo de producto necesita un informe mensual: cuántos usuarios distintos hicieron al menos una operación cada mes del último año, y cuánto movieron en total.\nLa consulta que hay escrita ahora tarda **ocho minutos** y bloquea el panel de control. La tabla `operaciones` tiene 400 millones de filas y crece cinco millones al día.\n\n```sql\nCREATE TABLE usuarios (\n  id            BIGINT PRIMARY KEY,\n  pais          CHAR(2)     NOT NULL,\n  creado_en     TIMESTAMPTZ NOT NULL\n);\n\nCREATE TABLE operaciones (\n  id            BIGINT PRIMARY KEY,\n  usuario_id    BIGINT      NOT NULL REFERENCES usuarios(id),\n  importe_cent  BIGINT      NOT NULL,   -- céntimos, nunca coma flotante\n  moneda        CHAR(3)     NOT NULL,\n  estado        TEXT        NOT NULL,   -- pendiente | confirmada | anulada\n  creada_en     TIMESTAMPTZ NOT NULL\n);\n\nCREATE INDEX idx_op_usuario ON operaciones (usuario_id);\n```\n\nY la consulta actual:\n\n```sql\nSELECT DATE_TRUNC('month', o.creada_en) AS mes,\n       COUNT(*)          AS usuarios,\n       SUM(o.importe_cent) AS total\n  FROM operaciones o, usuarios u\n WHERE o.usuario_id = u.id\n   AND EXTRACT(YEAR FROM o.creada_en) = 2026\n GROUP BY 1\n ORDER BY 1;\n```",
    "goal": "Reescribir la consulta para que sea **correcta** y **rápida**, y justificar qué índice hace falta y por qué el que existe no se está usando.",
    "tech": [
      "SQL",
      "PostgreSQL",
      "Índices"
    ],
    "skills": [
      "agregación",
      "DISTINCT frente a COUNT",
      "sargabilidad",
      "índices compuestos",
      "zonas horarias"
    ],
    "tags": [
      "SQL",
      "agregación",
      "índices",
      "plan de ejecución",
      "fechas"
    ],
    "time": 45,
    "empresa": {
      "empresas": [
        "revolut",
        "amazon",
        "travelperk"
      ],
      "evidencia": "inspirada",
      "puesto": "Backend / Data Engineer",
      "rol": "data",
      "formato": "sql",
      "dificultad": 3,
      "evalua": [
        "Entender qué va a hacer el motor con tu consulta, no solo que devuelva las filas correctas.",
        "Agregación correcta con fechas y zonas horarias, que es donde se rompen casi todos los informes.",
        "Índices: saber cuál hace falta y por qué el que hay no sirve."
      ],
      "nota": "Ninguna de las tres empresas publica sus enunciados de SQL. El formato de ronda de datos y su peso está descrito en testimonios públicos y, en el caso de Amazon, en su propia página de proceso, que menciona pruebas específicas por puesto. El esquema y el enunciado son nuestros.",
      "fuentes": [
        {
          "titulo": "Interviewing at Amazon — amazon.jobs",
          "url": "https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon"
        },
        {
          "titulo": "How do we hire engineers @ TravelPerk?",
          "url": "https://medium.com/@alexander.ludwick/how-do-we-hire-engineers-travelperk-afabbf82aedc"
        },
        {
          "titulo": "Companies that don’t have a broken hiring process",
          "url": "https://github.com/poteto/hiring-without-whiteboards"
        }
      ]
    }
  });

  TT.defineExerciseIndice({
    "id": "bcn-desembolsos-comisiones",
    "title": "Desembolsos a comercios: comisiones por tramos, al céntimo",
    "category": "backend",
    "categorias": [
      "javascript",
      "databases"
    ],
    "kind": "build",
    "level": "mid",
    "context": "Prueba para casa de una fintech de Barcelona que ofrece pago aplazado a tiendas en línea. Te dan un enunciado corto, te dicen que no dediques más de tres horas y que valoran la calidad por encima de terminarlo todo. Después hay una segunda ronda en la que revisas tu propio código en vivo con dos ingenieros: todo lo que entregues, tendrás que defenderlo.",
    "situation": "La empresa cobra al comercio una comisión por cada pedido y le paga el resto **una vez por semana**, agrupando todos los pedidos completados en esa semana.\n\nLa comisión depende del importe del pedido:\n\n| Importe del pedido | Comisión |\n| --- | --- |\n| Menos de 50 € | 1,00 % |\n| De 50 € a menos de 300 € | 0,95 % |\n| 300 € o más | 0,85 % |\n\nLos importes llegan **en céntimos y como enteros**, porque en dinero nadie usa coma flotante. Cada pedido trae la fecha en la que se completó, en formato ISO y en UTC, o `null` si todavía no se ha completado.\n\nEl equipo de finanzas cuadra estas cifras a mano contra el banco. Un céntimo de diferencia multiplicado por cien mil pedidos es una reunión muy larga.",
    "goal": "Implementar `calcularDesembolsos(pedidos)`, que devuelve un desembolso por semana con el número de pedidos, el importe bruto, la comisión total y el neto a pagar al comercio.",
    "tech": [
      "JavaScript",
      "Node.js"
    ],
    "skills": [
      "aritmética entera",
      "redondeo",
      "reglas de negocio por tramos",
      "agrupación por fecha",
      "inmutabilidad"
    ],
    "tags": [
      "dinero",
      "redondeo",
      "tramos",
      "fechas",
      "fintech",
      "Barcelona"
    ],
    "time": 50,
    "empresa": {
      "empresas": [
        "sequra",
        "revolut",
        "glovo"
      ],
      "evidencia": "documentada",
      "puesto": "Backend Engineer",
      "rol": "backend",
      "formato": "take-home",
      "dificultad": 3,
      "evalua": [
        "Aritmética de dinero sin coma flotante: en una fintech esto no es una preferencia de estilo, es un requisito.",
        "Fronteras de tramo tratadas a propósito y no por accidente: es donde se pierde o se gana dinero real.",
        "Redondear por pedido y no sobre el total, porque así es como se factura de verdad.",
        "Agrupación temporal correcta, con la semana empezando el lunes y sin sorpresas de zona horaria."
      ],
      "nota": "SeQura publica en sus ofertas que su proceso es una prueba asíncrona seguida de una revisión en vivo de tu propio código, y su reto de backend —desembolsos a comercios con comisiones del 1 %, 0,95 % y 0,85 % por tramos de importe— aparece descrito de forma coincidente en varios repositorios públicos de candidatos independientes. Esos tramos son los que se reproducen aquí. El resto del enunciado, el contrato de la función y los tests son originales nuestros.",
      "fuentes": [
        {
          "titulo": "SeQura — Senior Software Engineer: proceso (take-home + peer review en vivo)",
          "url": "https://sequra.recruitee.com/o/senior-software-engineer-2"
        },
        {
          "titulo": "Reto de backend de SeQura publicado por un candidato (tramos de comisión)",
          "url": "https://github.com/joelGarcia93/sequra-challenge"
        },
        {
          "titulo": "Segundo repositorio independiente con los mismos tramos",
          "url": "https://github.com/languita/sequra-challenge"
        }
      ]
    }
  });

  TT.defineExerciseIndice({
    "id": "bcn-maquina-expendedora",
    "title": "Máquina expendedora: el cambio que no siempre se puede dar",
    "category": "architecture",
    "categorias": [
      "backend",
      "javascript"
    ],
    "kind": "build",
    "level": "senior",
    "context": "Prueba para casa de una empresa de Barcelona que la publica en abierto, con una advertencia poco habitual en el enunciado: *\"no se trata de que simplemente funcione\"*. Avisan de que un script de un solo archivo que procesa comandos no demuestra nivel senior, y de que tendrás que defender cada decisión de arquitectura en una entrevista posterior.\nTambién dicen algo que casi nadie escribe: **puedes usar IA**, pero el código que entregues tiene que ser código que entiendas lo bastante como para explicarlo, modificarlo y ampliarlo si las herramientas de IA desaparecieran mañana.",
    "situation": "La máquina acepta monedas de 5, 10, 25 y 100 céntimos. Tiene artículos con precio y existencias, y un inventario de monedas para dar cambio. Un operario puede abrirla para reponer ambas cosas.\n\nEl detalle que hunde la mayoría de las entregas está en una sola línea del enunciado: la máquina **lleva la cuenta del cambio disponible**. Es decir, no siempre puede dar cambio. Y cuando no puede, no vende: devuelve el dinero.\n\nHay una segunda trampa, más silenciosa: las monedas que el cliente acaba de meter **también sirven para dar cambio**. El cambio se calcula sobre el inventario resultante, no sobre el que había antes de la compra.",
    "goal": "Implementar `crearMaquina(configuracion)`, que devuelve un objeto con las operaciones de la máquina: insertar moneda, seleccionar artículo, devolver el dinero, hacer servicio y consultar el estado.",
    "tech": [
      "JavaScript",
      "Node.js"
    ],
    "skills": [
      "modelado de dominio",
      "máquinas de estado",
      "backtracking",
      "diseño de API",
      "casos límite"
    ],
    "tags": [
      "modelado de dominio",
      "estado",
      "algoritmos",
      "backtracking",
      "Barcelona"
    ],
    "time": 75,
    "empresa": {
      "empresas": [
        "holded",
        "seatcode",
        "cabify"
      ],
      "evidencia": "documentada",
      "puesto": "Senior Backend Engineer",
      "rol": "backend",
      "formato": "take-home",
      "dificultad": 4,
      "evalua": [
        "Modelado de dominio: cómo representas reglas de negocio con estado y que sigan siendo legibles.",
        "Extensibilidad: qué hay que tocar para añadir un producto, una moneda o una regla nueva.",
        "Reconocer que el algoritmo obvio —dar siempre la moneda más grande— falla con inventario limitado.",
        "Estados de error tratados como parte del diseño, no como excepciones sueltas."
      ],
      "nota": "Holded publica el enunciado de sus pruebas técnicas en un repositorio público de GitHub, y el de Senior Backend Engineer es exactamente una máquina expendedora, con el detalle explícito de que la máquina debe llevar la cuenta del **cambio disponible**. Su enunciado pide PHP y evalúa con rúbrica; aquí se traslada el problema a JavaScript y se añaden tests automáticos para que se pueda practicar solo. El contrato de la función, los casos y la solución son originales nuestros.",
      "fuentes": [
        {
          "titulo": "Reto de Senior Backend Engineer de Holded (máquina expendedora)",
          "url": "https://github.com/holdedhub/careers/blob/main/challenges/backend/README.md"
        },
        {
          "titulo": "holdedhub/careers — repositorio público de contratación",
          "url": "https://github.com/holdedhub/careers"
        },
        {
          "titulo": "SEAT CODE — Join Us: proceso de tres fases con prueba práctica",
          "url": "https://www.code.seat/workwithus"
        }
      ]
    }
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
    "time": 45,
    "empresa": {
      "empresas": [
        "ia-generalista",
        "microsoft"
      ],
      "evidencia": "inspirada",
      "puesto": "AI Engineer",
      "rol": "ai-engineer",
      "formato": "ai-case",
      "dificultad": 3,
      "evalua": [
        "Convertir la salida de un modelo en un contrato de datos fiable, con validación y reintento.",
        "Tratar al modelo como una dependencia poco fiable, igual que una API externa.",
        "Fallar de forma controlada cuando la salida no cumple el esquema."
      ],
      "nota": "Las salidas estructuradas y su validación son tema recurrente en las convocatorias públicas de AI Engineer de 2026. El caso concreto es nuestro.",
      "fuentes": [
        {
          "titulo": "AI Engineer interview roadmap 2026: RAG, LLM y bases vectoriales",
          "url": "https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms"
        },
        {
          "titulo": "Take-Home Engineering Challenge (Microsoft CSE)",
          "url": "https://github.com/seushermsft/Take-Home-Engineering-Challenge"
        }
      ]
    }
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
    "time": 60,
    "empresa": {
      "empresas": [
        "ia-generalista"
      ],
      "evidencia": "inspirada",
      "puesto": "AI Engineer",
      "rol": "ai-engineer",
      "formato": "ai-case",
      "dificultad": 4,
      "evalua": [
        "Recuperación con citas comprobables: distinguir lo que el modelo sabe de lo que ha leído.",
        "Depurar un RAG que devuelve basura sabiendo si el fallo está en el índice o en el prompt.",
        "Fidelidad y relevancia como métricas, no como impresión."
      ],
      "nota": "Depurar un RAG y justificar sus métricas es uno de los casos prácticos más repetidos en procesos de IA. El escenario es nuestro.",
      "fuentes": [
        {
          "titulo": "AI Engineer interview roadmap 2026: RAG, LLM y bases vectoriales",
          "url": "https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms"
        },
        {
          "titulo": "How to interview for an AI Engineer role in 2026",
          "url": "https://chiraghasija.cc/posts/how-to-interview-ai-engineer-role-2026/"
        }
      ]
    }
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
    "time": 75,
    "empresa": {
      "empresas": [
        "ia-generalista"
      ],
      "evidencia": "inspirada",
      "puesto": "AI Engineer (Senior)",
      "rol": "ai-engineer",
      "formato": "debugging",
      "dificultad": 5,
      "evalua": [
        "Diagnosticar por qué un agente se queda en bucle en vez de limitarse a subir el límite de pasos.",
        "Coste y latencia por petición como restricción de diseño.",
        "Observabilidad: qué habría que registrar para que este fallo fuera evidente."
      ],
      "nota": "Los fallos de agentes y el control de coste son preguntas explícitas en las ofertas de AI Engineer. La traza concreta es nuestra.",
      "fuentes": [
        {
          "titulo": "How to interview for an AI Engineer role in 2026",
          "url": "https://chiraghasija.cc/posts/how-to-interview-ai-engineer-role-2026/"
        },
        {
          "titulo": "AI Engineer interview roadmap 2026: RAG, LLM y bases vectoriales",
          "url": "https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms"
        }
      ]
    }
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
    "time": 60,
    "empresa": {
      "empresas": [
        "ia-generalista"
      ],
      "evidencia": "inspirada",
      "puesto": "AI Engineer",
      "rol": "ai-engineer",
      "formato": "ai-case",
      "dificultad": 4,
      "evalua": [
        "Decidir si un cambio de modelo mejora algo de verdad, antes de desplegarlo.",
        "Diseñar un conjunto de evaluación y un juez automático con sus propios sesgos controlados.",
        "Medir en lugar de opinar: la competencia que más se repite en estas entrevistas."
      ],
      "nota": "\"¿Cómo sabes que la versión nueva es mejor?\" es la pregunta central de las entrevistas de IA de 2026. El caso es nuestro.",
      "fuentes": [
        {
          "titulo": "How to interview for an AI Engineer role in 2026",
          "url": "https://chiraghasija.cc/posts/how-to-interview-ai-engineer-role-2026/"
        },
        {
          "titulo": "AI Engineer interview roadmap 2026: RAG, LLM y bases vectoriales",
          "url": "https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms"
        }
      ]
    }
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
    "time": 60,
    "empresa": {
      "empresas": [
        "ia-generalista",
        "microsoft"
      ],
      "evidencia": "inspirada",
      "puesto": "AI Engineer",
      "rol": "ai-engineer",
      "formato": "mini-app",
      "dificultad": 4,
      "evalua": [
        "Exponer capacidades a un agente con un contrato de herramientas explícito y validado.",
        "Límites de confianza entre la instrucción del sistema y los datos del usuario.",
        "Diseño de API pensado para que lo consuma un modelo, no una persona."
      ],
      "nota": "Construir un servidor de herramientas para un agente es el equivalente actual del \"haz una pequeña API\". El enunciado es nuestro.",
      "fuentes": [
        {
          "titulo": "AI Engineer interview roadmap 2026: RAG, LLM y bases vectoriales",
          "url": "https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms"
        },
        {
          "titulo": "Take-Home Engineering Challenge (Microsoft CSE)",
          "url": "https://github.com/seushermsft/Take-Home-Engineering-Challenge"
        }
      ]
    }
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
    "time": 45,
    "empresa": {
      "empresas": [
        "gitlab",
        "github"
      ],
      "evidencia": "documentada",
      "puesto": "Senior Backend Engineer",
      "rol": "backend",
      "formato": "code-review",
      "dificultad": 4,
      "evalua": [
        "Revisión de un Merge Request como ronda técnica principal: es literalmente el formato que GitLab publica en su handbook.",
        "Priorizar por impacto y comunicar sin atacar a la persona.",
        "Detectar ausencias — transacción, idempotencia, tests — y no solo lo que está escrito."
      ],
      "nota": "GitLab documenta en su handbook público que su entrevista técnica es la revisión de un Merge Request, y GitHub que sus entregas se revisan como un Pull Request con rúbrica. El PR concreto de este ejercicio es nuestro.",
      "fuentes": [
        {
          "titulo": "Technical Interviews — The GitLab Handbook",
          "url": "https://handbook.gitlab.com/handbook/hiring/interviewing/technical/"
        },
        {
          "titulo": "How GitHub does take home technical interviews — The GitHub Blog",
          "url": "https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/"
        }
      ]
    }
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
    "time": 240,
    "empresa": {
      "empresas": [
        "github",
        "shopify"
      ],
      "evidencia": "documentada",
      "puesto": "Frontend Engineer",
      "rol": "frontend",
      "formato": "take-home",
      "dificultad": 3,
      "evalua": [
        "Entrega con límite de tiempo declarado y evaluada con rúbrica: el formato que GitHub describe en su blog de ingeniería.",
        "Saber qué dejar fuera: entregar de más no suma puntos.",
        "Decisiones de producto y de accesibilidad justificadas por escrito."
      ],
      "nota": "GitHub publica el formato de su take-home (límite de tiempo, entrega anonimizada, rúbrica y scorecard en el Pull Request) y Shopify el suyo de ejercicio práctico. El enunciado del ejercicio es nuestro.",
      "fuentes": [
        {
          "titulo": "How GitHub does take home technical interviews — The GitHub Blog",
          "url": "https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/"
        },
        {
          "titulo": "Shopify’s Technical Interview Process",
          "url": "https://shopify.engineering/nail-your-technical-shopify-interview"
        }
      ]
    }
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
    "time": 60,
    "empresa": {
      "empresas": [
        "atlassian",
        "netflix",
        "cloudflare",
        "adevinta"
      ],
      "evidencia": "documentada",
      "puesto": "Senior Backend Engineer",
      "rol": "backend",
      "formato": "system-design",
      "dificultad": 4,
      "evalua": [
        "Ronda de system design de 60 minutos: la publican Atlassian en su guía oficial y Netflix en su blog de ingeniería.",
        "Defender compromisos explícitos en vez de dibujar la arquitectura de moda.",
        "Fallos parciales, consistencia y coste como parte del diseño."
      ],
      "nota": "La existencia y el formato de esta ronda están documentados por Atlassian, Netflix y Cloudflare. Adevinta Spain se añade porque sus ofertas de Barcelona piden exactamente este perfil —sistemas de alta disponibilidad y baja latencia, Kubernetes y datos en streaming con Kafka y Flink—, aunque no publica el detalle de su proceso. El sistema concreto que se pide diseñar es nuestro.",
      "fuentes": [
        {
          "titulo": "Atlassian Engineering Interview Guide",
          "url": "https://www.atlassian.com/company/careers/resources/interviewing/engineering"
        },
        {
          "titulo": "Demystifying Interviewing for Backend Engineers @ Netflix",
          "url": "https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495"
        },
        {
          "titulo": "Experiencias de entrevista en Cloudflare — Taro",
          "url": "https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/"
        },
        {
          "titulo": "Product & Tech — Adevinta Careers",
          "url": "https://adevinta.com/careers/product-tech/"
        }
      ]
    }
  });

})(window.TT);

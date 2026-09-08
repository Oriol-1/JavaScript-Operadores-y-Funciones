/* ============================================================
   Rutas de aprendizaje
   Cada paso puede apuntar a un laboratorio (lab), a una prueba
   (exercise) o a ninguno de los dos (hito conceptual pendiente
   de contenido). El progreso solo cuenta los pasos con prueba.
   ============================================================ */
(function (TT) {
  'use strict';

  TT.definePath({
    id: 'frontend',
    title: 'Frontend',
    icon: '◆',
    color: 'brand',
    resumen:
      'Del lenguaje al navegador y del navegador a una prueba de empresa. La ruta sigue el orden en el que ' +
      'las empresas evalúan a un frontend: primero que el código sea correcto, después que la interfaz aguante ' +
      'la realidad (latencia, errores, teclado, móvil) y por último que sepas defender tus decisiones.',
    steps: [
      { titulo: 'HTML semántico y CSS', detalle: 'La base de la accesibilidad y del rendimiento percibido.', lab: 'fundamentos.html' },
      { titulo: 'JavaScript: operadores, funciones y arrays', detalle: 'Sintaxis y métodos que aparecen en cualquier criba técnica.', lab: 'fundamentos.html' },
      { titulo: 'Limpiar datos con arrays y regex', detalle: 'Normalización, validación de formato y eliminación de duplicados.', exercise: 'js-limpiar-correos' },
      { titulo: 'Calcular un resumen con reduce', detalle: 'Acumular totales, aplicar reglas y redondear con precisión.', exercise: 'js-resumen-carrito' },
      { titulo: 'Lógica y algoritmos', detalle: 'map, filter, reduce, ordenación y búsqueda vistos paso a paso.', lab: 'algoritmos.html' },
      { titulo: 'DOM y eventos', detalle: 'Manipulación, delegación y creación dinámica.', lab: 'dom_lab.html' },
      { titulo: 'Scope, cierres y this', detalle: 'El origen de la mitad de los bugs sutiles de JavaScript.', lab: 'scope_lab.html' },
      { titulo: 'Predecir la ejecución', detalle: 'Bucle de eventos, microtareas y captura de variables.', exercise: 'js-orden-ejecucion' },
      { titulo: 'Escribir tests que detecten bugs', detalle: 'Casos borde, valores límite y testing de mutación.', exercise: 'test-tests-que-detectan' },
      { titulo: 'Depurar código ajeno', detalle: 'Reproducir, localizar, entender, corregir y verificar.', exercise: 'dbg-carrito-fantasma' },
      { titulo: 'Asincronía y consumo de APIs', detalle: 'Promesas, async/await y fetch.', lab: 'async_lab.html' },
      { titulo: 'Buscador con debounce', detalle: 'Agrupar pulsaciones y descartar respuestas obsoletas.', exercise: 'fe-buscador-debounce' },
      { titulo: 'TypeScript', detalle: 'Tipado estático, interfaces y genéricos.', lab: 'ts_lab.html' },
      { titulo: 'Estados de interfaz y accesibilidad', detalle: 'Los cinco estados de cualquier vista de datos.', exercise: 'fe-estados-accesibles' },
      { titulo: 'Cliente de API resistente', detalle: 'Reintentos, backoff y límites de peticiones.', exercise: 'api-cliente-resistente' },
      { titulo: 'Prueba de empresa', detalle: 'Panel de incidencias completo con rúbrica real.', exercise: 'emp-frontend-challenge' }
    ]
  });

  TT.definePath({
    id: 'backend',
    title: 'Backend',
    icon: '▣',
    color: 'info',
    resumen:
      'El backend se evalúa sobre todo por lo que ocurre cuando algo va mal: errores, concurrencia, seguridad y ' +
      'trazabilidad. Esta ruta prioriza esos temas frente a la sintaxis, porque son los que se preguntan en la ' +
      'segunda ronda y los que separan a un mid de un junior.',
    steps: [
      { titulo: 'Lenguaje y asincronía en el servidor', detalle: 'Promesas, errores y modelo de ejecución.', lab: 'async_lab.html' },
      { titulo: 'HTTP de verdad', detalle: 'Métodos, códigos de estado, cabeceras e idempotencia.' },
      { titulo: 'Diseño y consumo de APIs', detalle: 'Contratos, paginación, versionado y errores.', exercise: 'api-cliente-resistente' },
      { titulo: 'Validación y gestión de errores', detalle: 'Errores operativos frente a errores de programación.', exercise: 'be-refactor-produccion' },
      { titulo: 'Bases de datos y rendimiento', detalle: 'Consultas por lotes, índices en memoria y el problema N+1.', exercise: 'db-n-mas-uno' },
      { titulo: 'Autenticación y autorización', detalle: 'IDOR, asignación masiva y mínimo privilegio.', exercise: 'sec-control-acceso' },
      { titulo: 'Testing', detalle: 'Qué probar, con qué datos y por qué la cobertura no basta.', exercise: 'test-tests-que-detectan' },
      { titulo: 'Seguridad aplicada', detalle: 'Inyección, IDOR, secretos y datos en logs.', exercise: 'emp-code-review' },
      { titulo: 'Arquitectura', detalle: 'Capas, límites y dependencias que no se pagan caro.' },
      { titulo: 'System Design', detalle: 'Escala, colas, caché, consistencia y degradación.', exercise: 'emp-system-design' }
    ]
  });

  TT.definePath({
    id: 'ia',
    title: 'Inteligencia Artificial',
    icon: '✦',
    color: 'ai',
    resumen:
      'El puesto que se contrata en 2026 no es "quien entrena modelos" sino "quien construye sistemas fiables ' +
      'sobre modelos que no ha entrenado". Por eso la ruta pasa rápido por los fundamentos y se concentra en ' +
      'fiabilidad, coste, evaluación y observabilidad, que es donde se caen la mayoría de candidaturas.',
    steps: [
      { titulo: 'Fundamentos de LLM', detalle: 'Tokens, contexto, temperatura, coste y latencia.' },
      { titulo: 'APIs de modelos', detalle: 'Mensajes, streaming, parámetros y manejo de errores.' },
      { titulo: 'Prompting con criterio', detalle: 'Instrucciones, ejemplos y por qué el prompt no es un mecanismo de control.' },
      { titulo: 'Salidas estructuradas', detalle: 'Esquemas, validación y detección de datos inventados.', exercise: 'ai-salidas-estructuradas' },
      { titulo: 'Herramientas y function calling', detalle: 'Definir, validar y ejecutar herramientas con seguridad.' },
      { titulo: 'RAG', detalle: 'Recuperación, umbrales, citas verificables y abstención.', exercise: 'ai-rag-con-evidencia' },
      { titulo: 'MCP y herramientas', detalle: 'Publicar herramientas con esquema, validación y errores estructurados.', exercise: 'ai-mcp-servidor' },
      { titulo: 'Agentes', detalle: 'Bucles, guardrails, límites de coste y degradación.', exercise: 'ai-agente-en-bucle' },
      { titulo: 'Sistemas multiagente', detalle: 'Handoffs, coordinación y propagación de errores.' },
      { titulo: 'Evals', detalle: 'Conjuntos de casos, modelo juez, coste y detección de regresiones.', exercise: 'ai-evals-juez' },
      { titulo: 'Observabilidad', detalle: 'Trazas por paso, coste por tarea resuelta y detección de deriva.' },
      { titulo: 'Seguridad en IA', detalle: 'Inyección de prompt directa e indirecta, permisos y datos sensibles.' }
    ]
  });

  TT.definePath({
    id: 'empresa',
    title: 'Preparación de proceso',
    icon: '★',
    color: 'brand',
    resumen:
      'Ruta corta e intensiva para las dos semanas previas a un proceso de selección. Recorre los cuatro formatos ' +
      'que casi todas las empresas usan hoy: prueba para llevar a casa, revisión de código, depuración y diseño de ' +
      'sistemas, más la ronda de defensa donde tienes que justificar lo que entregaste.',
    steps: [
      { titulo: 'Calibra tu nivel', detalle: 'Resuelve dos pruebas de niveles distintos y compara la puntuación.', exercise: 'js-orden-ejecucion' },
      { titulo: 'Prueba para llevar a casa', detalle: 'Gestión del alcance bajo límite de tiempo.', exercise: 'emp-frontend-challenge' },
      { titulo: 'Código listo para producción', detalle: 'Convertir código que funciona en código mantenible.', exercise: 'be-refactor-produccion' },
      { titulo: 'Revisión de código', detalle: 'Priorizar, comunicar y sostener el criterio bajo presión.', exercise: 'emp-code-review' },
      { titulo: 'Diseño de sistemas', detalle: 'Conducir la sesión y justificar los compromisos.', exercise: 'emp-system-design' },
      { titulo: 'Ronda de IA', detalle: 'Cada vez más presente incluso fuera de puestos de AI Engineer.', exercise: 'ai-agente-en-bucle' }
    ]
  });

})(window.TT);

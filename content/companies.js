/* ============================================================
   TechTrack — Registro de empresas
   ------------------------------------------------------------
   REGLA INNEGOCIABLE DE ESTE ARCHIVO:

   Nada de lo que se afirma aquí sobre una empresa puede estar
   inventado. Cada ficha lleva `fuentes` con enlaces reales y un
   campo `verificacion` que dice hasta dónde llega la evidencia:

     'documentado'  La propia empresa publica cómo es su proceso
                    (página de empleo, handbook o blog de
                    ingeniería). Al menos una fuente de tipo
                    'oficial' o 'ingenieria'.
     'parcial'      No hay publicación oficial del proceso. Lo que
                    se describe procede de testimonios agregados
                    (Glassdoor, interviewing.io, Blind, prensa
                    técnica). Se marca como tal en la interfaz.

   tools/verificar.js comprueba las dos reglas: que toda ficha
   tenga al menos una fuente con URL, y que ninguna marcada como
   'documentado' carezca de fuente oficial o de ingeniería.

   Consultado por última vez: septiembre de 2026. Los procesos de
   selección cambian; `revisado` deja constancia de la fecha.
   ============================================================ */
(function (TT) {
  'use strict';

  const REVISADO = '2026-09';

  /* ---------- Eje: qué puesto ---------- */
  TT.ROLES = {
    'frontend':    'Frontend',
    'backend':     'Backend',
    'fullstack':   'Full Stack',
    'mobile':      'Mobile',
    'data':        'Data / Analytics',
    'infra':       'DevOps / SRE / Infraestructura',
    'ai-engineer': 'AI Engineer / LLM',
    'security':    'Seguridad',
    'qa':          'QA / Testing'
  };

  /* ---------- Eje: qué formato de evaluación ---------- */
  TT.FORMATOS = {
    'quiz':             { label: 'Preguntas rápidas',    desc: 'Tanda corta de preguntas conceptuales, a menudo eliminatoria.' },
    'algoritmos':       { label: 'Algoritmos',           desc: 'Estructuras de datos y complejidad, estilo LeetCode.' },
    'live-coding':      { label: 'Live coding',          desc: 'Programar delante de alguien, narrando lo que haces.' },
    'pair-programming': { label: 'Pair programming',     desc: 'Resolver junto a un ingeniero de la empresa, como un compañero más.' },
    'bug-squash':       { label: 'Resolución de bugs',   desc: 'Repositorio desconocido, test que falla: encuentra la causa y arréglala.' },
    'debugging':        { label: 'Debugging',            desc: 'Diagnóstico metódico de un fallo a partir de síntomas.' },
    'refactor':         { label: 'Refactorización',      desc: 'Código que funciona pero que no se puede mantener.' },
    'code-review':      { label: 'Code review',          desc: 'Revisar un Pull Request o Merge Request y emitir veredicto.' },
    'take-home':        { label: 'Take-home',            desc: 'Ejercicio para hacer en casa con un límite de tiempo declarado.' },
    'mini-app':         { label: 'Mini aplicación',      desc: 'Construir una funcionalidad pequeña pero completa.' },
    'api-integration':  { label: 'Integración con API',  desc: 'Implementar contra una API que no conoces, con la documentación abierta.' },
    'sql':              { label: 'SQL',                  desc: 'Consultas, modelado e índices sobre un esquema dado.' },
    'system-design':    { label: 'System design',        desc: 'Diseñar un sistema a escala y defender los compromisos.' },
    'optimizacion':     { label: 'Optimización',         desc: 'Medir, encontrar el cuello de botella y arreglarlo.' },
    'testing':          { label: 'Testing',              desc: 'Escribir o criticar pruebas: qué cubren y qué no.' },
    'ai-case':          { label: 'Caso de IA',           desc: 'Evaluación, coste, RAG, agentes y fallos de sistemas con LLM.' },
    'trial':            { label: 'Proyecto de prueba',   desc: 'Trabajo real, a veces remunerado, durante días o semanas.' }
  };

  /* ---------- Escala de dificultad del proceso (1-5) ---------- */
  TT.DIFICULTAD = {
    1: { label: 'Accesible',     desc: 'Una prueba breve y una entrevista técnica.' },
    2: { label: 'Moderada',      desc: 'Proceso corto con un ejercicio práctico.' },
    3: { label: 'Exigente',      desc: 'Varias rondas técnicas con criterios explícitos.' },
    4: { label: 'Muy exigente',  desc: 'Loop completo con algoritmos y diseño de sistemas.' },
    5: { label: 'Extrema',       desc: 'Listón muy alto y alta tasa de descarte en cada ronda.' }
  };

  /* ---------- Eje: ¿hay prueba de código? ----------
     Se pregunta algo muy concreto: ¿en algún momento del proceso
     escribes código que alguien evalúa? No cuenta hablar de código,
     ni explicar un proyecto tuyo, ni un test psicotécnico.

     Es un eje aparte de `formatos` porque hay una parte enorme del
     mercado —consultoras, corporaciones, servicios— donde la
     respuesta es simplemente NO, y esa información es la que más
     falta a quien se prepara: te dice si estudiar katas te va a
     servir de algo en ese proceso concreto. */
  TT.PRUEBA_CODIGO = {
    'si':      { label: 'Con prueba de código',  corto: 'Prueba de código',  clase: 'badge-brand', icono: '⌨',
                 desc: 'En algún momento escribes código que se evalúa: prueba para casa, live coding, pair programming o depuración.' },
    'depende': { label: 'Depende del equipo',    corto: 'Variable',          clase: 'badge-warn',  icono: '≈',
                 desc: 'Unos equipos o niveles la ponen y otros no. Pregúntalo al recruiter antes de prepararte.' },
    'no':      { label: 'Sin prueba de código',  corto: 'Sin prueba',        clase: 'badge-neutral', icono: '—',
                 desc: 'No se escribe código. Se decide con la conversación técnica, el currículum, el portafolio o una entrevista con el cliente final.' }
  };

  function empresa(e) { e.revisado = e.revisado || REVISADO; return TT.defineCompany(e); }

  /* ==========================================================
     1. Empresas que PUBLICAN su proceso
     ========================================================== */

  empresa({
    id: 'gitlab',
    nombre: 'GitLab',
    pais: 'Remoto (constituida en EE. UU.)',
    sector: 'DevOps / plataforma de desarrollo',
    tamano: 'Grande · cotizada · 100 % remota',
    tech: ['Ruby on Rails', 'Vue', 'Go', 'PostgreSQL', 'Kubernetes', 'Git'],
    perfiles: ['backend', 'frontend', 'fullstack', 'infra', 'security'],
    formatos: ['code-review', 'pair-programming', 'take-home', 'system-design'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening con selección', formato: 'quiz', duracion: 30, que: 'Encaje con el puesto, expectativas y trabajo asíncrono.' },
      { fase: 'Entrevista técnica', formato: 'code-review', duracion: 60, que: 'Revisión de un Merge Request: qué detectas, cómo lo priorizas y cómo lo comunicas.' },
      { fase: 'Sesión práctica', formato: 'pair-programming', duracion: 60, que: 'Trabajar sobre el ejercicio junto a un ingeniero e implementar las correcciones.' },
      { fase: 'Entrevistas de equipo', formato: 'quiz', duracion: 90, que: 'Managers y dirección: trayectoria, autonomía y valores.' }
    ],
    evalua: [
      'Revisión de código con criterio: distinguir lo bloqueante de lo opinable.',
      'Comunicación escrita — es una empresa asíncrona y se nota en el proceso.',
      'Trabajo real sobre repositorios grandes, no algoritmos de pizarra.'
    ],
    consejo:
      'Es la empresa con el proceso más transparente del sector: el handbook es público e incluye las ' +
      'propias rúbricas. Leerlo antes de la entrevista no es hacer trampa, es exactamente lo que esperan.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Technical Interviews — The GitLab Handbook', url: 'https://handbook.gitlab.com/handbook/hiring/interviewing/technical/', tipo: 'oficial' },
      { titulo: 'Candidate FAQ — The GitLab Handbook', url: 'https://handbook.gitlab.com/handbook/hiring/candidate-faq', tipo: 'oficial' },
      { titulo: 'Conducting a GitLab Interview', url: 'https://handbook.gitlab.com/handbook/hiring/conducting-a-gitlab-interview/', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'github',
    nombre: 'GitHub',
    pais: 'EE. UU. (Microsoft) · remota',
    sector: 'Plataforma de desarrollo',
    tamano: 'Grande',
    tech: ['Ruby on Rails', 'Go', 'TypeScript', 'React', 'MySQL', 'Git'],
    perfiles: ['backend', 'frontend', 'fullstack', 'infra'],
    formatos: ['take-home', 'code-review', 'system-design'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Experiencia y encaje.' },
      { fase: 'Take-home', formato: 'take-home', duracion: 120, que: 'Ejercicio con límite de tiempo declarado, resuelto en tu entorno o en Codespaces.' },
      { fase: 'Revisión anonimizada', formato: 'code-review', duracion: 0, que: 'La entrega se revisa sin tu nombre, con tests automáticos y una rúbrica, sobre un Pull Request.' },
      { fase: 'Entrevistas técnicas', formato: 'system-design', duracion: 120, que: 'Profundizar en la entrega y diseño de sistemas.' }
    ],
    evalua: [
      'Resolver el tipo de problema del día a día, no acertijos ni conocimiento oscuro.',
      'Calidad de la entrega evaluada con rúbrica y tests, no con impresiones.',
      'El propio flujo de trabajo de GitHub: la prueba se entrega y se revisa como un Pull Request.'
    ],
    consejo:
      'GitHub anonimiza las entregas (aparecen firmadas por "Interview-bot") y las puntúa con un ' +
      'scorecard en el Pull Request. Respeta el límite de tiempo: está puesto a propósito para no ' +
      'premiar a quien tiene más horas libres, y entregar de más no suma.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'How GitHub does take home technical interviews — The GitHub Blog', url: 'https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/', tipo: 'ingenieria' }
    ]
  });

  empresa({
    id: 'automattic',
    nombre: 'Automattic',
    pais: 'Remoto (EE. UU.)',
    sector: 'WordPress.com, WooCommerce, Tumblr',
    tamano: 'Grande · 100 % remota',
    tech: ['PHP', 'JavaScript', 'React', 'WordPress', 'MySQL'],
    perfiles: ['fullstack', 'frontend', 'backend'],
    formatos: ['take-home', 'trial', 'code-review'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Entrevista por Slack', formato: 'quiz', duracion: 60, que: 'Todo el proceso es escrito y asíncrono: Slack, GitHub y P2.' },
      { fase: 'Prueba de código', formato: 'take-home', duracion: 300, que: 'Modificar código existente, con un compañero asignado que revisa y responde dudas.' },
      { fase: 'Proyecto de prueba', formato: 'trial', duracion: 1200, que: 'Trabajo real remunerado, a tiempo parcial, de dos a ocho semanas (unas 15-35 horas en total).' },
      { fase: 'Cierre', formato: 'quiz', duracion: 45, que: 'Conversación final.' }
    ],
    evalua: [
      'Comunicación escrita: si no sabes explicarte por texto, el proceso lo detecta enseguida.',
      'Resolución de problemas y diseño sobre código ajeno, no conocimiento de su plataforma.',
      'Autonomía real trabajando en remoto y asíncrono durante semanas.'
    ],
    consejo:
      'El proyecto de prueba es trabajo pagado y evalúa efectividad sostenida, no un pico de ' +
      'rendimiento de 45 minutos. Preguntar bien a tu buddy suma; desaparecer una semana resta.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'How We Hire — Automattic', url: 'https://automattic.com/how-we-hire/', tipo: 'oficial' },
      { titulo: 'How We Hire Developers — Automattic', url: 'https://automattic.com/work-with-us/how-we-hire-developers/', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'shopify',
    nombre: 'Shopify',
    pais: 'Canadá · remota',
    sector: 'Comercio electrónico',
    tamano: 'Grande · cotizada',
    tech: ['Ruby on Rails', 'React', 'TypeScript', 'GraphQL', 'MySQL', 'Kubernetes'],
    perfiles: ['backend', 'frontend', 'fullstack', 'data'],
    formatos: ['pair-programming', 'live-coding', 'system-design'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Life Story', formato: 'quiz', duracion: 45, que: 'Conversación sobre tu trayectoria: decisiones, aprendizajes e impacto. No es un trámite, puntúa.' },
      { fase: 'Pair programming', formato: 'pair-programming', duracion: 90, que: 'Ejercicio en remoto junto a un desarrollador, en el lenguaje que elijas.' },
      { fase: 'Technical deep dive', formato: 'system-design', duracion: 60, que: 'Profundizar en un proyecto tuyo y en sus decisiones de diseño.' },
      { fase: 'Entrevista final', formato: 'quiz', duracion: 45, que: 'Encaje con el equipo y con la forma de trabajar.' }
    ],
    evalua: [
      'Cómo colaboras mientras programas: preguntar, pensar en voz alta y aceptar sugerencias.',
      'Criterio de producto: entender por qué se construye algo, no solo cómo.',
      'Capacidad de contar tu propia historia profesional con honestidad.'
    ],
    consejo:
      'En el pair programming el silencio penaliza más que un error. Trabajas con alguien: verbaliza ' +
      'la hipótesis, propón el siguiente paso y pregunta cuando dudes.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Shopify’s Technical Interview Process: What to Expect and How to Prepare', url: 'https://shopify.engineering/nail-your-technical-shopify-interview', tipo: 'ingenieria' }
    ]
  });

  empresa({
    id: 'atlassian',
    nombre: 'Atlassian',
    pais: 'Australia · global',
    sector: 'Herramientas de equipo (Jira, Confluence)',
    tamano: 'Grande · cotizada',
    tech: ['Java', 'Kotlin', 'React', 'TypeScript', 'AWS', 'PostgreSQL'],
    perfiles: ['backend', 'frontend', 'fullstack', 'infra'],
    formatos: ['live-coding', 'algoritmos', 'system-design', 'quiz'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje con el puesto.' },
      { fase: 'Coding I', formato: 'live-coding', duracion: 60, que: 'Problema práctico en el lenguaje que prefieras.' },
      { fase: 'Coding II', formato: 'live-coding', duracion: 60, que: 'Segundo ejercicio, normalmente con más ambigüedad.' },
      { fase: 'System design', formato: 'system-design', duracion: 60, que: 'Diseño de un sistema y defensa de los compromisos.' },
      { fase: 'Values', formato: 'quiz', duracion: 45, que: 'Ronda dedicada a sus cinco valores. Descarta por sí sola.' }
    ],
    evalua: [
      'Resolución de problemas y aprendizaje por encima del dominio de un lenguaje concreto.',
      'Diseño de sistemas con criterio explícito de compromisos.',
      'Encaje con valores, evaluado en una ronda con el mismo peso que las técnicas.'
    ],
    consejo:
      'La ronda de valores no es relleno: Atlassian la puntúa formalmente. Lleva ejemplos reales de ' +
      'conflictos, decisiones difíciles y errores propios.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Atlassian Engineering Interview Guide', url: 'https://www.atlassian.com/company/careers/resources/interviewing/engineering', tipo: 'oficial' },
      { titulo: 'Early Careers Interview Guide — Atlassian', url: 'https://www.atlassian.com/company/careers/resources/applying/early-careers-interview-guide', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'netflix',
    nombre: 'Netflix',
    pais: 'EE. UU. · global',
    sector: 'Streaming',
    tamano: 'Grande · cotizada',
    tech: ['Java', 'Kotlin', 'Spring Boot', 'gRPC', 'AWS', 'Cassandra', 'React'],
    perfiles: ['backend', 'frontend', 'infra', 'data'],
    formatos: ['live-coding', 'system-design', 'optimizacion'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Trayectoria e interés por el equipo concreto.' },
      { fase: 'Ronda técnica', formato: 'live-coding', duracion: 60, que: 'Problema práctico ejecutable (por ejemplo, un limitador de peticiones), no algoritmia abstracta.' },
      { fase: 'Diseño de sistemas', formato: 'system-design', duracion: 60, que: 'Sistemas distribuidos a escala real.' },
      { fase: 'Rondas de equipo', formato: 'quiz', duracion: 120, que: 'Cultura, autonomía y responsabilidad. El proceso es descentralizado: cada equipo lo ajusta.' }
    ],
    evalua: [
      'Ingeniería práctica sobre teoría: construir sistemas que funcionan, no recitar algoritmos.',
      'Criterio de escala: fallos parciales, latencia y coste.',
      'Juicio autónomo, en línea con su cultura de "libertad y responsabilidad".'
    ],
    consejo:
      'Su blog de ingeniería publicó cómo entrevistan a backend. Los problemas suelen ser piezas de ' +
      'infraestructura reconocibles: limitadores de peticiones, caché, reintentos y colas.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Demystifying Interviewing for Backend Engineers @ Netflix — Netflix TechBlog', url: 'https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495', tipo: 'ingenieria' },
      { titulo: 'Netflix Software Engineer — entrevistas en Glassdoor', url: 'https://www.glassdoor.com/Interview/Netflix-Software-Engineer-Interview-Questions-EI_IE11891.0,7_KO8,25.htm', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'google',
    nombre: 'Google',
    pais: 'EE. UU. · global (oficinas en Madrid)',
    sector: 'Buscador, cloud, publicidad e IA',
    tamano: 'Muy grande · cotizada',
    tech: ['C++', 'Java', 'Go', 'Python', 'TypeScript', 'Angular', 'Kubernetes'],
    perfiles: ['backend', 'frontend', 'fullstack', 'infra', 'data', 'ai-engineer'],
    formatos: ['algoritmos', 'live-coding', 'system-design', 'quiz'],
    dificultad: 5,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Trayectoria, nivel y expectativas.' },
      { fase: 'Entrevista técnica telefónica', formato: 'algoritmos', duracion: 60, que: 'Estructuras de datos, algoritmos y complejidad. Es eliminatoria.' },
      { fase: 'Loop', formato: 'live-coding', duracion: 240, que: 'Varias rondas de código, una de diseño según el nivel y una de "Googleyness".' },
      { fase: 'Comité de contratación', formato: 'quiz', duracion: 0, que: 'Deciden Googlers que no te entrevistaron, a partir de las notas escritas.' }
    ],
    evalua: [
      'Algoritmos y complejidad con rigor: es de las pocas grandes que mantiene ese listón.',
      'Comunicación del razonamiento — el comité solo lee lo que el entrevistador escribió sobre ti.',
      'Tolerancia a la ambigüedad y curiosidad técnica.'
    ],
    consejo:
      'Google publica su propia guía de preparación para SWE. Como decide un comité que no te vio, ' +
      'todo lo que no verbalices no existe: narra el enfoque, la complejidad y por qué descartas ' +
      'cada alternativa.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Software Engineer interview prep guide — Google Careers', url: 'https://www.google.com/about/careers/applications/candidate-prep/swe', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'meta',
    nombre: 'Meta',
    pais: 'EE. UU. · global',
    sector: 'Redes sociales, realidad virtual e IA',
    tamano: 'Muy grande · cotizada',
    tech: ['React', 'React Native', 'PHP/Hack', 'Python', 'C++', 'GraphQL'],
    perfiles: ['frontend', 'backend', 'fullstack', 'mobile', 'ai-engineer'],
    formatos: ['algoritmos', 'live-coding', 'system-design'],
    dificultad: 5,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening técnico', formato: 'algoritmos', duracion: 45, que: 'Normalmente dos problemas en unos 40 minutos de código efectivo.' },
      { fase: 'Coding onsite', formato: 'algoritmos', duracion: 90, que: 'Dos rondas de dos problemas cada una, con código ejecutable.' },
      { fase: 'System design', formato: 'system-design', duracion: 45, que: 'Para perfiles con experiencia.' },
      { fase: 'Behavioral', formato: 'quiz', duracion: 45, que: 'Impacto, conflicto y velocidad de ejecución.' }
    ],
    evalua: [
      'Velocidad y precisión: el tiempo por problema es corto y se nota.',
      'Código correcto a la primera, sin depender del compilador.',
      'En frontend, dominio real de JavaScript y del DOM, no solo de un framework.'
    ],
    consejo:
      'Meta publica su propia guía de preparación. El factor diferencial es el reloj: practica dos ' +
      'problemas en 40 minutos, en voz alta y sin ejecutar el código.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Preparing for your software engineering interview at Meta — Meta Careers', url: 'https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'amazon',
    nombre: 'Amazon / AWS',
    pais: 'EE. UU. · global (oficinas en Madrid y Barcelona)',
    sector: 'Comercio electrónico y cloud',
    tamano: 'Muy grande · cotizada',
    tech: ['Java', 'Python', 'TypeScript', 'AWS', 'DynamoDB', 'React'],
    perfiles: ['backend', 'frontend', 'fullstack', 'infra', 'data'],
    formatos: ['algoritmos', 'live-coding', 'system-design', 'quiz'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Solicitud y assessment', formato: 'quiz', duracion: 60, que: 'Prueba online específica del puesto, con ejercicios de código y simulaciones de trabajo.' },
      { fase: 'Phone screen', formato: 'algoritmos', duracion: 60, que: 'Un problema de código más preguntas de Leadership Principles.' },
      { fase: 'Loop', formato: 'system-design', duracion: 300, que: 'Cuatro o cinco rondas. Cada una mezcla técnica y comportamiento, y una la conduce un Bar Raiser.' }
    ],
    evalua: [
      'Los 16 Leadership Principles, presentes en TODAS las rondas, también en las de código.',
      'Respuestas estructuradas en STAR con datos concretos: los entrevistadores están formados en ese formato.',
      'Diseño de sistemas orientado a coste y a operación.'
    ],
    consejo:
      'Es la gran tecnológica que más peso da al comportamiento. Prepara entre 8 y 12 historias reales ' +
      'con métricas y ten claro qué principio ilustra cada una; se reutilizan entre rondas.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Interviewing at Amazon — amazon.jobs', url: 'https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon', tipo: 'oficial' }
    ]
  });

  /* ==========================================================
     2. Procesos reconstruidos a partir de testimonios públicos
        (verificacion: 'parcial' — la interfaz lo advierte)
     ========================================================== */

  empresa({
    id: 'stripe',
    nombre: 'Stripe',
    pais: 'EE. UU. / Irlanda · global',
    sector: 'Pagos e infraestructura financiera',
    tamano: 'Grande',
    tech: ['Ruby', 'Java', 'Go', 'TypeScript', 'React', 'API REST'],
    perfiles: ['backend', 'fullstack', 'frontend', 'infra'],
    formatos: ['bug-squash', 'api-integration', 'system-design', 'debugging'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje y nivel.' },
      { fase: 'Bug squash', formato: 'bug-squash', duracion: 60, que: 'Repositorio real que no conoces y un test que falla: diagnostica desde la traza y arregla la causa.' },
      { fase: 'Integración', formato: 'api-integration', duracion: 60, que: 'Implementar una funcionalidad pequeña contra una API dentro de código ajeno, con la documentación abierta.' },
      { fase: 'Diseño y equipo', formato: 'system-design', duracion: 90, que: 'Diseño de sistemas y rondas de encaje.' }
    ],
    evalua: [
      'El proceso de ingeniería, no la memoria: son rondas de libro abierto, con documentación e internet.',
      'Depuración metódica y narrada: leer la traza, formular una hipótesis y comprobarla.',
      'Moverse con soltura por un código que nunca habías visto.'
    ],
    consejo:
      'Stripe publica solo la forma general de su proceso; el detalle de las rondas procede de ' +
      'testimonios de candidatos. Lo que se repite en todos: depurar despacio y en voz alta puntúa ' +
      'más que adivinar rápido y en silencio.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Testimonios de candidatos sobre el loop de Stripe (Blind)', url: 'https://www.teamblind.com/post/stripe-full-loop-sde-interview-mmzxmgv0', tipo: 'testimonios' },
      { titulo: 'Guía de la ronda Bug Squash de Stripe', url: 'https://www.coditioning.com/blog/804/stripe-swe-bug-squash-interview', tipo: 'comunidad' }
    ]
  });

  empresa({
    id: 'airbnb',
    nombre: 'Airbnb',
    pais: 'EE. UU. · global',
    sector: 'Viajes y alojamiento',
    tamano: 'Grande · cotizada',
    tech: ['React', 'TypeScript', 'Java', 'Kotlin', 'GraphQL', 'Ruby'],
    perfiles: ['frontend', 'backend', 'fullstack', 'mobile'],
    formatos: ['live-coding', 'algoritmos', 'system-design', 'mini-app'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 40, que: 'Experiencia y conocimiento de la misión de la empresa.' },
      { fase: 'Código', formato: 'live-coding', duracion: 60, que: 'Código real y ejecutable: no se acepta pseudocódigo.' },
      { fase: 'Frontend o diseño', formato: 'mini-app', duracion: 60, que: 'Construir un componente o diseñar un sistema, según el puesto.' },
      { fase: 'Core Values', formato: 'quiz', duracion: 90, que: 'Dos rondas conducidas por personas de fuera de ingeniería. Pesan en la decisión final.' }
    ],
    evalua: [
      'Código que compila y se ejecuta, no esquemas en la pizarra.',
      'En frontend, construir interfaz de verdad con estados y accesibilidad.',
      'Encaje con valores, evaluado por entrevistadores no técnicos.'
    ],
    consejo:
      'Las rondas de valores las llevan personas ajenas a ingeniería y descartan candidatos que ya ' +
      'habían aprobado lo técnico. Prepáralas con el mismo cuidado.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Airbnb Software Engineer — entrevistas en Glassdoor', url: 'https://www.glassdoor.com/Interview/Airbnb-Software-Engineer-Interview-Questions-EI_IE391850.0,6_KO7,24.htm', tipo: 'testimonios' },
      { titulo: 'Airbnb interview questions — interviewing.io', url: 'https://interviewing.io/airbnb-interview-questions', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'spotify',
    nombre: 'Spotify',
    pais: 'Suecia · global (oficinas en Madrid)',
    sector: 'Audio y streaming',
    tamano: 'Grande · cotizada',
    tech: ['Java', 'Scala', 'Python', 'React', 'TypeScript', 'GCP', 'Backstage'],
    perfiles: ['backend', 'frontend', 'fullstack', 'data', 'infra'],
    formatos: ['live-coding', 'system-design', 'take-home', 'quiz'],
    dificultad: 3,
    pruebaCodigo: 'depende',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje con el puesto y con el trabajo por squads.' },
      { fase: 'Entrevista con el manager', formato: 'live-coding', duracion: 70, que: 'Conversación técnica que puede incluir un problema de dificultad media.' },
      { fase: 'Ejercicio técnico', formato: 'take-home', duracion: 180, que: 'Ejercicio de programación o caso práctico, según el equipo.' },
      { fase: 'Arquitectura', formato: 'system-design', duracion: 60, que: 'Diseño de sistemas, con más peso cuanto mayor es el nivel.' },
      { fase: 'Entrevista final', formato: 'quiz', duracion: 45, que: 'Valores, autonomía alineada y colaboración.' }
    ],
    evalua: [
      'Autonomía dentro de un equipo pequeño: su cultura de "aligned autonomy" se evalúa de verdad.',
      'Criterio de producto y capacidad de entregar en iteraciones cortas.',
      'Arquitectura orientada a equipos independientes.'
    ],
    consejo:
      'El proceso varía bastante entre squads. Pregunta al recruiter el formato exacto de cada ronda: ' +
      'en Spotify esa pregunta se considera normal y te ahorra prepararte lo que no toca.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Start Your Journey — Life at Spotify', url: 'https://www.lifeatspotify.com/start-your-journey', tipo: 'oficial' },
      { titulo: 'Spotify Software Engineer — entrevistas en Glassdoor', url: 'https://www.glassdoor.com/Interview/Spotify-Software-Engineer-Interview-Questions-EI_IE408251.0,7_KO8,25.htm', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'cloudflare',
    nombre: 'Cloudflare',
    pais: 'EE. UU. · global',
    sector: 'Red de distribución, seguridad y edge computing',
    tamano: 'Grande · cotizada',
    tech: ['Go', 'Rust', 'TypeScript', 'Workers', 'Kubernetes', 'ClickHouse'],
    perfiles: ['backend', 'infra', 'security', 'fullstack'],
    formatos: ['live-coding', 'system-design', 'optimizacion', 'debugging'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje general.' },
      { fase: 'Hiring manager', formato: 'quiz', duracion: 45, que: 'Proyectos previos e interés por el equipo. Aquí llega antes que en otras empresas.' },
      { fase: 'Rondas técnicas', formato: 'live-coding', duracion: 120, que: 'Código práctico y preguntas de red, concurrencia y sistemas.' },
      { fase: 'System design', formato: 'system-design', duracion: 60, que: 'Caché en el edge, replicación, límites de peticiones y latencia global.' }
    ],
    evalua: [
      'Conocimiento real de red y protocolos: HTTP, caché, DNS y TLS.',
      'Diseño pensado para fallos parciales y escala global.',
      'Rendimiento medido, no intuido.'
    ],
    consejo:
      'Es la empresa donde más rentable resulta entender HTTP a fondo: cabeceras de caché, ' +
      'idempotencia, reintentos y límites de peticiones aparecen en casi todas las rondas.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Experiencias de entrevista en Cloudflare — Taro', url: 'https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'travelperk',
    nombre: 'TravelPerk',
    pais: 'España (Barcelona) · Europa',
    ciudad: 'Barcelona',
    sector: 'Gestión de viajes de empresa',
    tamano: 'Scale-up · unicornio',
    tech: ['Python', 'Django', 'React', 'TypeScript', 'AWS', 'PostgreSQL'],
    perfiles: ['backend', 'frontend', 'fullstack', 'data'],
    formatos: ['take-home', 'live-coding', 'system-design', 'quiz'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Llamada con selección', formato: 'quiz', duracion: 45, que: 'Competencias, encaje cultural, preaviso y expectativas salariales.' },
      { fase: 'Prueba técnica', formato: 'take-home', duracion: 180, que: 'Ejercicio práctico cercano al dominio del producto.' },
      { fase: 'Entrevista técnica', formato: 'live-coding', duracion: 60, que: 'Revisión de la entrega y ampliación en vivo.' },
      { fase: 'Cultural', formato: 'quiz', duracion: 45, que: 'Conversaciones difíciles y contribución a proyectos complejos.' }
    ],
    evalua: [
      'Capacidad de razonar sobre tus propias decisiones técnicas pasadas.',
      'Encaje cultural con mucho peso, según su propio equipo de ingeniería.',
      'Producto real: integraciones con proveedores, reservas y tratamiento de dinero.'
    ],
    consejo:
      'Su responsable de ingeniería publicó cómo contratan y el mensaje se repite en los testimonios: ' +
      'lleva ejemplos concretos de conversaciones difíciles y de proyectos que salieron mal.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'How do we hire engineers @ TravelPerk? — Alexander Ludwick', url: 'https://medium.com/@alexander.ludwick/how-do-we-hire-engineers-travelperk-afabbf82aedc', tipo: 'ingenieria' },
      { titulo: 'TravelPerk — entrevistas en Glassdoor', url: 'https://www.glassdoor.com/Interview/TravelPerk-Interview-Questions-E1174739.htm', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'typeform',
    nombre: 'Typeform',
    pais: 'España (Barcelona) · remota',
    ciudad: 'Barcelona',
    sector: 'Formularios y captación de datos',
    tamano: 'Scale-up',
    tech: ['Go', 'TypeScript', 'React', 'PHP', 'AWS', 'PostgreSQL'],
    perfiles: ['frontend', 'backend', 'fullstack'],
    formatos: ['take-home', 'live-coding', 'system-design'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje con el puesto y con el trabajo distribuido.' },
      { fase: 'Prueba técnica', formato: 'take-home', duracion: 180, que: 'Ejercicio práctico orientado a producto, no a algoritmia.' },
      { fase: 'Entrevista técnica', formato: 'live-coding', duracion: 60, que: 'Defensa de la entrega y ampliación.' },
      { fase: 'Diseño y encaje', formato: 'system-design', duracion: 60, que: 'Arquitectura y forma de trabajar.' }
    ],
    evalua: [
      'Ingeniería práctica con menos peso de algoritmia que en las grandes tecnológicas.',
      'Cuidado por la experiencia de uso: es una empresa de producto muy centrada en diseño.',
      'Comunicación en equipos distribuidos.'
    ],
    consejo:
      'No hay publicación oficial del proceso. Lo que sí es público es su cultura de producto: en la ' +
      'entrega, justificar decisiones de experiencia de usuario y accesibilidad diferencia mucho.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Engineering Jobs — Careers at Typeform', url: 'https://www.typeform.com/careers/engineering', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'factorial',
    nombre: 'Factorial',
    pais: 'España (Barcelona)',
    ciudad: 'Barcelona',
    sector: 'Software de recursos humanos',
    tamano: 'Scale-up · unicornio · oficina primero, 20 % remoto',
    tech: ['Ruby on Rails', 'React', 'React Native', 'PostgreSQL', 'AWS', 'CI/CD'],
    perfiles: ['fullstack', 'backend', 'frontend', 'mobile', 'infra', 'ai-engineer'],
    formatos: ['pair-programming', 'live-coding', 'system-design'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Intro Call', formato: 'quiz', duracion: 30, que: 'Con un Talent Acquisition Partner: tu trayectoria, tus objetivos y las rúbricas de ingeniería que usan.' },
      { fase: 'Hiring Manager', formato: 'quiz', duracion: 60, que: 'Con el Engineering Manager: mentalidad de producto, trabajo en equipo y resolución de problemas.' },
      { fase: 'Live Engineering Challenge', formato: 'pair-programming', duracion: 90, que: 'Ejercicio colaborativo con DOS ingenieros de Factorial sobre un problema real. No buscan un producto terminado, sino cómo estructuras el problema, qué preguntas haces, cómo usas la tecnología y cómo razonas la solución.' },
      { fase: 'Coffee chat final', formato: 'quiz', duracion: 45, que: 'Con el CTO y el VP de Ingeniería: visión, cultura y tu crecimiento.' }
    ],
    evalua: [
      'Cómo **estructuras** un problema y qué preguntas haces, por encima de terminar el ejercicio.',
      'Uso de herramientas —incluida la IA— como lo haría un ingeniero senior: acelerando, no sustituyendo el criterio.',
      'Modelado de dominio con muchos casos límite: fechas, jornadas, festivos y permisos.',
      'Comunicación: es un proceso enteramente remoto por videoconferencia y se nota.'
    ],
    consejo:
      'Factorial publica el proceso completo dentro de cada oferta, y también la banda salarial: los ' +
      'anuncios de 2026 van de 60.000 € para un Senior Software Engineer a 94.300-106.950 € para un AI ' +
      'Staff Engineer. En el Live Challenge no vayas a terminar: ve a pensar en voz alta con los dos ' +
      'ingenieros que tienes delante.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Factorial — Senior Software Engineer (stack, salario y proceso paso a paso)', url: 'https://careers.factorialhr.com/job_posting/senior-software-engineer-foundations-248454', tipo: 'oficial' },
      { titulo: 'Factorial — AI Staff Engineer (requisitos de IA en producción y banda salarial)', url: 'https://careers.factorialhr.com/job_posting/ai-staff-engineer-operations-domain-287783', tipo: 'oficial' },
      { titulo: 'Careers in Factorial', url: 'https://factorialhr.com/join-factorial', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'glovo',
    nombre: 'Glovo',
    pais: 'España (Barcelona) · Europa y África',
    ciudad: 'Barcelona',
    sector: 'Reparto a domicilio y marketplace',
    tamano: 'Scale-up · unicornio · ~1.700 en tecnología',
    tech: ['Kotlin', 'Java', 'Spring', 'MySQL', 'Redis', 'Kafka', 'AWS', 'React'],
    perfiles: ['backend', 'frontend', 'mobile', 'data', 'infra'],
    formatos: ['live-coding', 'system-design', 'algoritmos'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Recruiter screen', formato: 'quiz', duracion: 30, que: 'Motivación, trayectoria y encaje cultural. Te explican los siguientes pasos.' },
      { fase: 'Entrevista técnica', formato: 'live-coding', duracion: 60, que: 'Un problema técnico concreto. Miran cómo piensas, cómo estructuras la solución y si escribes código limpio y fácil de seguir: estructuras de datos, rendimiento y enfoque de resolución.' },
      { fase: 'Whiteboard', formato: 'system-design', duracion: 60, que: 'Resolver un problema de alto nivel y comunicarlo con claridad. Evalúan lo simple, mantenible y flexible al cambio que sea tu solución.' },
      { fase: 'Stakeholder', formato: 'quiz', duracion: 45, que: 'Encaje mutuo: valores, energía y forma de trabajar juntos.' },
      { fase: 'Oferta', formato: 'quiz', duracion: 0, que: 'El recruiter comparte la oferta y los siguientes pasos.' }
    ],
    evalua: [
      'Cómo estructuras la solución y si el código se lee bien, más que si llegas a la respuesta.',
      'Diseño de alto nivel **comunicado con claridad**: la ronda de whiteboard es explícita sobre esto.',
      'Sistemas orientados a eventos: un pedido pasa por muchos estados y nada puede perderse.',
      'Concurrencia y consistencia sobre operaciones con dinero.'
    ],
    consejo:
      'Glovo publica su proceso y separa dos carreras: la técnica cambia la "practical challenge" del ' +
      'itinerario de negocio por dos rondas propias, una de código y otra de whiteboard. La palabra que ' +
      'repiten en las dos es **comunicar**: la solución mantenible y bien explicada puntúa por encima ' +
      'de la ingeniosa.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Our Hiring Process — Glovo Careers', url: 'https://careers.glovoapp.com/our-hiring-process/', tipo: 'oficial' },
      { titulo: 'The Glovo Tech Blog', url: 'https://tech-blog.glovoapp.com/', tipo: 'ingenieria' },
      { titulo: 'Tech @ Glovo — hub de Barcelona', url: 'https://engineering.glovoapp.com/tech-hubs/barcelona/', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'cabify',
    nombre: 'Cabify',
    pais: 'España (Madrid) · Latinoamérica',
    ciudad: 'Madrid',
    sector: 'Movilidad',
    tamano: 'Scale-up',
    tech: ['Elixir', 'Ruby', 'Go', 'React', 'PostgreSQL', 'Kubernetes'],
    perfiles: ['backend', 'frontend', 'mobile', 'infra'],
    formatos: ['take-home', 'live-coding', 'system-design', 'code-review'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje y expectativas.' },
      { fase: 'Prueba técnica', formato: 'take-home', duracion: 240, que: 'Ejercicio en casa con especial atención a tests y estructura.' },
      { fase: 'Revisión de la entrega', formato: 'code-review', duracion: 60, que: 'Defensa de decisiones y refactor en vivo sobre tu propio código.' },
      { fase: 'Arquitectura y encaje', formato: 'system-design', duracion: 60, que: 'Servicios distribuidos y trabajo en equipo.' }
    ],
    evalua: [
      'Calidad de la entrega: tests, límites entre capas y legibilidad por encima de funcionalidad extra.',
      'Capacidad de defender y revisar tu propio código sin ponerte a la defensiva.',
      'Sistemas de tiempo real con estado geográfico.'
    ],
    consejo:
      'Sin publicación oficial. En los testimonios se repite que la entrega se revisa contigo delante: ' +
      'entrega algo pequeño que puedas defender entero antes que algo grande que no controles.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Pruebas técnicas en procesos de selección en España', url: 'https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion', tipo: 'comunidad' }
    ]
  });

  empresa({
    id: 'wallapop',
    nombre: 'Wallapop',
    pais: 'España (Barcelona)',
    ciudad: 'Barcelona',
    sector: 'Marketplace de segunda mano',
    tamano: 'Scale-up · ~15 millones de usuarios',
    tech: ['Java', 'Kotlin', 'Spring Boot', 'Swift', 'RxSwift', 'Bazel', 'Python', 'AWS', 'Kafka'],
    perfiles: ['backend', 'frontend', 'mobile', 'data', 'infra'],
    formatos: ['take-home', 'code-review', 'system-design', 'live-coding'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Intro Call', formato: 'quiz', duracion: 50, que: 'La lleva Talent Acquisition: te cuentan el puesto y repasan experiencia, motivación y expectativas.' },
      { fase: 'Technical Task', formato: 'take-home', duracion: 240, que: 'Prueba técnica con un máximo de 7 días — o, en su lugar, un trabajo reciente tuyo: una prueba de otro proceso o un repositorio, con código suficientemente complejo, en un lenguaje de la JVM, autoejecutable y autocompilable.' },
      { fase: 'Expertise Interview', formato: 'code-review', duracion: 75, que: 'La lleva el equipo. Se centra en las competencias técnicas y en tu capacidad de entregar en un contexto dado.' },
      { fase: 'Stakeholder Interview', formato: 'quiz', duracion: 60, que: 'Colaboración en un entorno multidisciplinar.' },
      { fase: 'Culture-Add Interview', formato: 'quiz', duracion: 60, que: 'Encaje con el propósito de Wallapop, con entrevistadores formados para esta ronda.' },
      { fase: 'Oferta', formato: 'quiz', duracion: 0, que: 'Se discute la oferta.' }
    ],
    evalua: [
      'Diseño de dominio: sus ofertas de backend piden **Domain-Driven Design aplicando diseño táctico y estratégico**, no como palabra de moda.',
      'Que sepas defender código tuyo — por eso aceptan una entrega anterior en lugar de una prueba nueva.',
      'En móvil, escala de verdad: base de código muy modular, builds con Bazel, tiempo de arranque, fluidez y tasa de sesiones sin fallos como objetivos medibles.',
      'Búsqueda y relevancia: es el corazón de su producto.'
    ],
    consejo:
      'Detalle poco conocido y muy aprovechable: **puedes evitar hacer una prueba nueva** entregando ' +
      'una que ya hiciste para otro proceso, si es JVM y se compila y ejecuta sola. Guarda siempre tus ' +
      'pruebas técnicas anteriores. Todo el proceso es Barcelona con modelo híbrido, mínimo seis días ' +
      'de oficina al mes.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Ofertas de Wallapop con el proceso de selección detallado (Greenhouse)', url: 'https://job-boards.eu.greenhouse.io/wallapop', tipo: 'oficial' },
      { titulo: 'Wallapop iOS Engineer - Platform: proceso, stack y objetivos de rendimiento', url: 'https://job-boards.eu.greenhouse.io/wallapop/jobs/4521032101', tipo: 'oficial' },
      { titulo: 'Wallapop MLOps Engineer: case study técnico y stack de ML', url: 'https://job-boards.eu.greenhouse.io/wallapop/jobs/4741205101', tipo: 'oficial' }
    ]
  });

  empresa({
    id: 'revolut',
    nombre: 'Revolut',
    pais: 'Reino Unido · Europa (oficinas en Madrid y Barcelona)',
    sector: 'Banca digital',
    tamano: 'Grande · scale-up financiera',
    tech: ['Kotlin', 'Java', 'Spring Boot', 'PostgreSQL', 'React', 'Kafka'],
    perfiles: ['backend', 'frontend', 'mobile', 'data', 'security'],
    formatos: ['algoritmos', 'take-home', 'live-coding', 'system-design'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje y nivel.' },
      { fase: 'Test online', formato: 'algoritmos', duracion: 90, que: 'Prueba en plataforma con problemas cronometrados.' },
      { fase: 'Entrevistas técnicas', formato: 'live-coding', duracion: 120, que: 'Código, concurrencia y modelo de datos.' },
      { fase: 'Arquitectura y valores', formato: 'system-design', duracion: 90, que: 'Diseño de sistemas financieros y encaje con un entorno muy exigente.' }
    ],
    evalua: [
      'Corrección absoluta sobre dinero: precisión decimal, idempotencia y auditoría.',
      'Rendimiento bajo carga y consistencia transaccional.',
      'Resistencia a un proceso largo con listón alto en cada ronda.'
    ],
    consejo:
      'Sin publicación oficial detallada. Todo lo que toque dinero se evalúa sin margen: nunca uses ' +
      'coma flotante para importes y ten claro qué es una operación idempotente.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Companies that don’t have a broken hiring process — poteto/hiring-without-whiteboards', url: 'https://github.com/poteto/hiring-without-whiteboards', tipo: 'comunidad' }
    ]
  });

  empresa({
    id: 'microsoft',
    nombre: 'Microsoft',
    pais: 'EE. UU. · global (oficinas en Madrid y Barcelona)',
    sector: 'Software, cloud e IA',
    tamano: 'Muy grande · cotizada',
    tech: ['C#', '.NET', 'TypeScript', 'React', 'Azure', 'Python'],
    perfiles: ['backend', 'frontend', 'fullstack', 'infra', 'ai-engineer', 'data'],
    formatos: ['algoritmos', 'live-coding', 'system-design', 'take-home'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje con el equipo concreto.' },
      { fase: 'Entrevista técnica', formato: 'algoritmos', duracion: 60, que: 'Estructuras de datos y código en vivo.' },
      { fase: 'Loop', formato: 'system-design', duracion: 240, que: 'Varias rondas: código, diseño y una final con un responsable con capacidad de decisión.' }
    ],
    evalua: [
      'Fundamentos sólidos con énfasis en casos límite y calidad del código.',
      'Diseño de sistemas y de API.',
      'Colaboración: la última ronda pesa mucho en la decisión.'
    ],
    consejo:
      'Su equipo de ingeniería en la nube publica ejercicios de take-home de ejemplo en abierto, lo que ' +
      'da una idea bastante fiel del tipo de problema que plantean para perfiles de ingeniería de cliente.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Take-Home Engineering Challenge (Microsoft CSE, repositorio público)', url: 'https://github.com/seushermsft/Take-Home-Engineering-Challenge', tipo: 'ingenieria' }
    ]
  });

  empresa({
    id: 'vercel',
    nombre: 'Vercel',
    pais: 'EE. UU. · remota',
    sector: 'Plataforma de despliegue frontend (Next.js)',
    tamano: 'Scale-up',
    tech: ['TypeScript', 'Next.js', 'React', 'Go', 'Rust', 'Edge Functions'],
    perfiles: ['frontend', 'fullstack', 'infra'],
    formatos: ['take-home', 'mini-app', 'live-coding', 'optimizacion'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje y trabajo en remoto.' },
      { fase: 'Ejercicio práctico', formato: 'mini-app', duracion: 180, que: 'Construir algo pequeño y real con su propia pila.' },
      { fase: 'Entrevista técnica', formato: 'live-coding', duracion: 60, que: 'Ampliar el ejercicio y hablar de rendimiento en el navegador.' },
      { fase: 'Encaje', formato: 'quiz', duracion: 45, que: 'Producto, comunidad y forma de trabajar en abierto.' }
    ],
    evalua: [
      'Rendimiento web medido: Core Web Vitals, renderizado en servidor y caché.',
      'Dominio de la plataforma web por debajo del framework.',
      'Gusto por el detalle en la experiencia de desarrollo.'
    ],
    consejo:
      'Sin publicación oficial del proceso. Su producto marca el temario: renderizado, caché, streaming ' +
      'de la respuesta y métricas de carga.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Companies that don’t have a broken hiring process — poteto/hiring-without-whiteboards', url: 'https://github.com/poteto/hiring-without-whiteboards', tipo: 'comunidad' }
    ]
  });

  /* ==========================================================
     3. Barcelona
     ----------------------------------------------------------
     Bloque dedicado. Barcelona concentra en torno a una cuarta
     parte del talento tecnológico de España y, a diferencia de
     Madrid —más de gran empresa, Java y .NET—, su ecosistema es
     de producto: Python, Node y React. Eso cambia el tipo de
     prueba que te vas a encontrar, y por eso estas fichas van
     juntas.

     Tres de ellas son un caso poco común y muy aprovechable:
     publican el ENUNCIADO de su prueba, no solo el formato.
     ========================================================== */

  empresa({
    id: 'holded',
    nombre: 'Holded',
    pais: 'España (Barcelona)',
    ciudad: 'Barcelona',
    sector: 'Software de gestión para pymes',
    tamano: 'Scale-up (grupo Visma)',
    tech: ['PHP', 'Go', 'TypeScript', 'React', 'Redux', 'Tailwind', 'React Native', 'MongoDB', 'DynamoDB', 'Redis', 'Docker'],
    perfiles: ['backend', 'frontend', 'fullstack', 'mobile', 'infra'],
    formatos: ['take-home', 'code-review', 'system-design'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Primer contacto', formato: 'quiz', duracion: 30, que: 'Encaje con el puesto y con el modelo híbrido: tres días en remoto y dos en la oficina.' },
      { fase: 'Prueba técnica', formato: 'take-home', duracion: 300, que: 'El enunciado es PÚBLICO, está en su repositorio de GitHub y hay uno por perfil. Se entrega en un repositorio propio, sin mencionar a Holded, y piden commits frecuentes desde el principio: van a leer tu historial de Git.' },
      { fase: 'Entrevista técnica', formato: 'code-review', duracion: 60, que: 'Defensa de la entrega. Te piden explicar cada decisión de arquitectura, qué alternativas valoraste y cómo extenderías el sistema ante requisitos nuevos.' },
      { fase: 'Encaje', formato: 'quiz', duracion: 45, que: 'Equipo y forma de trabajar.' }
    ],
    evalua: [
      'Decisiones de arquitectura y modelado de negocio, no que el programa funcione: lo dicen con estas palabras, "no se trata de que simplemente funcione".',
      'Extensibilidad: cómo aguanta tu diseño un producto nuevo, una regla nueva o un desarrollador nuevo.',
      'Estrategia de tests a distintos niveles, no cobertura por cobertura.',
      'Uso honesto de la IA: la aceptan explícitamente, pero avisan de que tendrás que defender el código como si las herramientas de IA desaparecieran mañana.'
    ],
    consejo:
      'Es la empresa de Barcelona con la prueba más transparente: su repositorio público incluye los ' +
      'enunciados de backend, frontend, full stack, móvil y SRE, además de su stack completo. Léelos ' +
      'antes de postular. Y ojo al aviso del enunciado de frontend: **prohíbe React, Angular y ' +
      'Socket.io** — quieren ver que sabes construir sin framework.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'holdedhub/careers — repositorio público con sus pruebas técnicas y su stack', url: 'https://github.com/holdedhub/careers', tipo: 'ingenieria' },
      { titulo: 'Reto de Senior Backend Engineer (máquina expendedora)', url: 'https://github.com/holdedhub/careers/blob/main/challenges/backend/README.md', tipo: 'ingenieria' },
      { titulo: 'Reto de Frontend Engineer (sin frameworks, con WebSocket)', url: 'https://github.com/holdedhub/careers/blob/main/challenges/frontend/README.md', tipo: 'ingenieria' },
      { titulo: 'stacks.md — tecnologías y decisiones técnicas de Holded', url: 'https://github.com/holdedhub/careers/blob/main/stacks.md', tipo: 'ingenieria' }
    ]
  });

  empresa({
    id: 'sequra',
    nombre: 'SeQura',
    pais: 'España (Barcelona) · sur de Europa',
    ciudad: 'Barcelona',
    sector: 'Fintech · pago aplazado para comercio electrónico',
    tamano: 'Scale-up · cerca de 100 M€ de ingresos recurrentes',
    tech: ['Ruby on Rails', 'JavaScript', 'Elixir', 'Kotlin', 'Java', 'Python', 'Redshift', 'Airflow', 'dbt'],
    perfiles: ['backend', 'frontend', 'fullstack', 'data', 'ai-engineer', 'security'],
    formatos: ['take-home', 'code-review', 'mini-app'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Entrevista con People', formato: 'quiz', duracion: 45, que: 'Encaje, motivación y expectativas.' },
      { fase: 'Prueba técnica asíncrona', formato: 'take-home', duracion: 180, que: 'Enunciado con límite declarado —en el reto de frontend, "no deberías dedicar más de 3 horas"— y una instrucción clave: no hace falta terminar, valoran calidad por encima de completitud, y esperan que expliques en el README lo que dejaste fuera y por qué.' },
      { fase: 'Revisión en vivo de tu propio código', formato: 'code-review', duracion: 60, que: 'Peer review con el equipo sobre tu entrega. Es la ronda que más pesa.' },
      { fase: 'Meet the team', formato: 'quiz', duracion: 45, que: 'Conoces al equipo con el que trabajarías.' }
    ],
    evalua: [
      'Que la entrega esté lista para producción: la piden tratada como un Pull Request que va a revisar un compañero, con los commits que tendría un encargo real.',
      'Criterio para dejar cosas fuera y saber justificarlo por escrito.',
      'Dinero sin margen de error: comisiones por tramos, desembolsos y precisión decimal.',
      'En frontend, código que se carga **dentro de la web de otro**: cuidado con dependencias, estilos y colisiones de código.',
      'OOP, código limpio y TDD aparecen literalmente en sus requisitos.'
    ],
    consejo:
      'Sus retos han circulado en repositorios públicos de candidatos durante años, y coinciden entre ' +
      'sí: en backend, calcular desembolsos a comercios con comisiones por tramos; en frontend, un ' +
      'widget de financiación que se incrusta en la ficha de producto de una tienda ajena. Si te toca ' +
      'el de frontend, la parte que separa a los candidatos no es el widget: es el aislamiento respecto ' +
      'a la página que lo hospeda.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'SeQura — Senior Software Engineer: requisitos y proceso (take-home + peer review en vivo)', url: 'https://sequra.recruitee.com/o/senior-software-engineer-2', tipo: 'oficial' },
      { titulo: 'SeQura — Senior Backend Engineer, AI Agents: requisitos de sistemas agénticos', url: 'https://sequra.recruitee.com/o/senior-backend-engineer-ai-agents', tipo: 'oficial' },
      { titulo: 'Enunciado del reto de frontend de SeQura, publicado por un candidato', url: 'https://github.com/sergioggdev/sequra-challenge', tipo: 'testimonios' },
      { titulo: 'Reto de backend de SeQura (desembolsos y comisiones), publicado por un candidato', url: 'https://github.com/joelGarcia93/sequra-challenge', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'seatcode',
    nombre: 'SEAT:CODE',
    pais: 'España (Barcelona) · contrata en toda España',
    ciudad: 'Barcelona',
    sector: 'Automoción y movilidad conectada (grupo SEAT / Volkswagen)',
    tamano: 'Centro tecnológico corporativo',
    tech: ['Kotlin', 'Java', 'Spring Boot', 'Swift', 'Angular', 'TypeScript', 'AWS'],
    perfiles: ['backend', 'frontend', 'mobile', 'data', 'qa'],
    formatos: ['take-home', 'code-review', 'live-coding'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Primera conversación', formato: 'quiz', duracion: 45, que: 'Quién eres, qué te importa y qué buscas. Textual de su web: "sin rondas infinitas, sin trucos".' },
      { fase: 'Evaluación de competencias', formato: 'take-home', duracion: 240, que: 'Prueba técnica —la de backend circula como PDF con un enunciado de robots sobre una cuadrícula, fichero de entrada y salida esperada— seguida de conversación sobre escenarios reales.' },
      { fase: 'Decisión y feedback', formato: 'quiz', duracion: 0, que: 'Cierran con claridad y prometen feedback siempre, con independencia del resultado.' }
    ],
    evalua: [
      'Diseño limpio sobre un problema pequeño: el enunciado es corto a propósito para que se vea cómo modelas.',
      'Tests: los candidatos que publican su solución coinciden en que es donde se juzga el nivel.',
      'Producto por encima de sector: dicen explícitamente que no hace falta experiencia en automoción.',
      'Curiosidad y adaptabilidad, con mentalidad de usuario primero.'
    ],
    consejo:
      'Proceso corto de tres pasos, poco habitual en una empresa de este tamaño. El reto de backend ' +
      'es una kata clásica de robot sobre cuadrícula con órdenes de giro y avance: resuélvela sencilla, ' +
      'modela bien el dominio y dedica el tiempo que sobre a los tests y a los casos límite de la ' +
      'entrada, que es lo que miran.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'SEAT CODE — Join Us: las tres fases de su proceso', url: 'https://www.code.seat/workwithus', tipo: 'oficial' },
      { titulo: 'Solución de un candidato al reto de backend de SEAT:CODE (Kotlin, con el enunciado descrito)', url: 'https://github.com/rballeba/seatCodeChallenge', tipo: 'testimonios' },
      { titulo: 'Otra solución independiente al mismo reto, con la salida esperada', url: 'https://github.com/d0vi/seat-code-challenge', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'edreams',
    nombre: 'eDreams ODIGEO',
    pais: 'España (Barcelona) · Europa',
    ciudad: 'Barcelona',
    sector: 'Viajes en línea · suscripción',
    tamano: 'Grande · cotizada',
    tech: ['Java', 'Kotlin', 'Spring', 'React', 'Swift', 'AWS', 'Kafka'],
    perfiles: ['backend', 'frontend', 'mobile', 'data'],
    formatos: ['take-home', 'system-design', 'live-coding'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Perfil y expectativas, a veces con una agencia externa antes de RRHH.' },
      { fase: 'Prueba técnica', formato: 'take-home', duracion: 180, que: 'Prueba para casa o ejercicio cronometrado en plataforma tipo Codility, según el puesto.' },
      { fase: 'Entrevista técnica', formato: 'system-design', duracion: 60, que: 'Con dos ingenieros senior: tu experiencia y un problema de diseño.' },
      { fase: 'Ronda final', formato: 'quiz', duracion: 60, que: 'Con dos responsables técnicos.' }
    ],
    evalua: [
      'Escala real de un buscador de vuelos: caché, latencia y coste por consulta a proveedores.',
      'Diseño de sistemas por encima de algoritmia pura.',
      'Trabajo con integraciones de terceros poco fiables, que es su día a día.'
    ],
    consejo:
      'Mantienen blog de ingeniería público, que es la mejor forma de saber qué les preocupa antes de ' +
      'la entrevista. El proceso dura entre dos y cuatro semanas según los testimonios, y la prueba ' +
      'automatizada en plataforma es eliminatoria.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'eDreams ODIGEO Tech Blog', url: 'https://tech.edreamsodigeo.com/', tipo: 'ingenieria' },
      { titulo: 'eDreams ODIGEO — entrevistas en Barcelona (Glassdoor)', url: 'https://www.glassdoor.com/Interview/eDreams-ODIGEO-Barcelona-Interview-Questions-EI_IE12822.0,14_IL.15,24_IM1015.htm', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'adevinta',
    nombre: 'Adevinta Spain',
    pais: 'España (Barcelona)',
    ciudad: 'Barcelona',
    sector: 'Marketplaces: InfoJobs, Fotocasa, coches.net, Milanuncios, Habitaclia',
    tamano: 'Grande · hub tecnológico con más de 150 especialistas',
    tech: ['Kotlin', 'Java', 'Scala', 'Kubernetes', 'Docker', 'Kafka', 'Flink', 'AWS'],
    perfiles: ['backend', 'frontend', 'infra', 'data', 'mobile'],
    formatos: ['live-coding', 'system-design', 'take-home'],
    dificultad: 3,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Encaje con el equipo concreto: son marcas y equipos bastante independientes.' },
      { fase: 'Entrevista técnica', formato: 'live-coding', duracion: 60, que: 'Código y preguntas sobre JVM, contenedores y datos en streaming.' },
      { fase: 'Arquitectura', formato: 'system-design', duracion: 60, que: 'Sistemas de alta disponibilidad y baja latencia, plataforma como servicio.' },
      { fase: 'Encaje', formato: 'quiz', duracion: 45, que: 'Equipo y forma de trabajar.' }
    ],
    evalua: [
      'JVM a fondo: sus ofertas piden perfilado y ajuste de rendimiento de aplicaciones de baja latencia.',
      'Kubernetes y Docker como herramienta diaria, no como línea del currículum.',
      'Datos en streaming con Kafka y Flink.',
      'Escala de marketplace: millones de anuncios y de visitas al mes.'
    ],
    consejo:
      'No publican el detalle del proceso, pero sus ofertas son muy explícitas sobre el listón técnico: ' +
      '"conocimiento profundo de Kotlin, Java o Scala", Kubernetes, streaming y ajuste de rendimiento ' +
      'de la JVM. Si vienes de producto puro y no has perfilado nunca una aplicación, ahí está el hueco.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'Product & Tech — Adevinta Careers', url: 'https://adevinta.com/careers/product-tech/', tipo: 'oficial' },
      { titulo: 'Ofertas de Adevinta en Barcelona (SmartRecruiters)', url: 'https://careers.smartrecruiters.com/Adevinta', tipo: 'oficial' },
      { titulo: 'Adevinta Spain — opiniones de ingeniería en Barcelona (Glassdoor)', url: 'https://www.glassdoor.com/Reviews/Adevinta-Spain-Software-Engineer-Barcelona-Reviews-EI_IE3430143.0,14_KO15,32_IL.33,42_IC2547194.htm', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'caixabank-tech',
    nombre: 'CaixaBank Tech',
    pais: 'España (Barcelona y Madrid)',
    ciudad: 'Barcelona',
    sector: 'Banca · filial tecnológica',
    tamano: 'Grande · corporativa',
    tech: ['Java', 'J2EE', 'WebLogic', 'Python', 'Angular', 'React Native', 'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'AWS'],
    perfiles: ['backend', 'frontend', 'mobile', 'data', 'ai-engineer', 'qa'],
    formatos: ['quiz', 'take-home', 'live-coding'],
    dificultad: 2,
    pruebaCodigo: 'depende',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Formación, experiencia y encaje. Piden titulación técnica de forma explícita en muchas ofertas.' },
      { fase: 'Prueba técnica', formato: 'take-home', duracion: 120, que: 'Ejercicio o test según el puesto. Varía mucho entre equipos y proveedores.' },
      { fase: 'Entrevista técnica', formato: 'live-coding', duracion: 60, que: 'Java o el stack del equipo, metodologías ágiles y herramientas de gestión.' }
    ],
    evalua: [
      'Fundamentos de Java empresarial y de aplicaciones web, incluido stack heredado (J2EE, WebLogic).',
      'Metodologías ágiles y herramientas de proceso (Jira, Confluence) como parte del puesto, no como añadido.',
      'En las ofertas de IA: integración de servicios de IA reutilizables sobre plataformas de nube, no investigación.',
      'Trabajo en equipos multidisciplinares y en inglés.'
    ],
    consejo:
      'Es la puerta de entrada corporativa más accesible del ecosistema: publican ofertas junior con ' +
      '**seis meses de experiencia mínima**, algo casi imposible de encontrar en las scale-ups de ' +
      'producto. A cambio, el listón de arquitectura es más bajo y el peso del stack heredado, mayor.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'CaixaBank Tech — Junior Software Engineer Java + Python (requisitos y stack)', url: 'https://caixabanktech.com/en/job/junior-software-engineer-java-python-3/', tipo: 'oficial' },
      { titulo: 'CaixaBank Tech — Software Engineer AI (requisitos y plataformas)', url: 'https://caixabanktech.com/en/job/software-engineer-ai-3/', tipo: 'oficial' }
    ]
  });

  /* ==========================================================
     4. El otro mercado: procesos SIN prueba de código
     ----------------------------------------------------------
     Casi toda la conversación pública sobre entrevistas técnicas
     habla de empresas de producto, que son una minoría del empleo
     real. La mayor parte del mercado español de desarrollo está en
     consultoras, empresas de servicios y departamentos de IT de
     grandes corporaciones, y ahí el proceso suele NO incluir
     ninguna prueba de código.

     Omitirlo daría una imagen falsa del mercado: alguien podría
     pasarse meses practicando katas para procesos donde nunca va a
     escribir una línea. Por eso estas fichas están aquí.
     ========================================================== */

  empresa({
    id: 'minsait',
    nombre: 'Minsait (Indra)',
    pais: 'España (Madrid, Barcelona y toda la península)',
    // Sede en Madrid. Contrata en toda España, incluida Barcelona, pero el
    // filtro de ubicación señala dónde está el equipo, no dónde hay vacantes:
    // marcarla como Barcelona la confundiría con las empresas de producto
    // que sí tienen allí su ingeniería.
    ciudad: 'Madrid',
    sector: 'Consultoría tecnológica y servicios de IT',
    tamano: 'Muy grande · cotizada · miles de personas en tecnología',
    tech: ['Java', 'Spring', 'Angular', '.NET', 'SQL', 'Cloud', 'SAP'],
    perfiles: ['backend', 'frontend', 'fullstack', 'data', 'qa', 'infra'],
    formatos: ['quiz'],
    pruebaCodigo: 'depende',
    dificultad: 2,
    proceso: [
      { fase: 'Pruebas técnicas e idiomas', formato: 'quiz', duracion: 90, que: 'Solo para perfiles con MENOS DE DOS AÑOS de experiencia. Evalúan cómo te desenvuelves en situaciones reales, la resolución de problemas bajo presión y el nivel de inglés. No es un ejercicio de programación al uso.' },
      { fase: 'Entrevistas de habilidades y conocimientos', formato: 'quiz', duracion: 60, que: 'Conversación con miembros del equipo sobre visión global, capacidad analítica y creatividad.' },
      { fase: 'Entrevista con Recursos Humanos', formato: 'quiz', duracion: 45, que: 'Inquietudes, motivaciones y encaje cultural.' }
    ],
    evalua: [
      'Que sepas explicar lo que has hecho: el peso recae en la conversación técnica, no en escribir código.',
      'Inglés, que en muchos proyectos es requisito de cliente y no de la empresa.',
      'Adaptación a proyectos de cliente que cambian, y a stacks que no eliges tú.',
      'Titulación y certificaciones, que pesan más aquí que en una empresa de producto.'
    ],
    consejo:
      'Cambia por completo cómo hay que prepararse. Si tienes más de dos años de experiencia, según su ' +
      'propio proceso publicado **no hay prueba técnica de código**: lo que se evalúa es tu relato ' +
      'profesional. Invierte el tiempo en preparar ejemplos concretos de proyectos, tecnologías y ' +
      'problemas resueltos, y en el inglés. Practicar katas aquí no te suma casi nada.',
    verificacion: 'documentado',
    fuentes: [
      { titulo: 'Minsait — Proceso de selección (las tres fases, publicadas por la empresa)', url: 'https://www.minsait.com/es/talento/proceso-seleccion', tipo: 'oficial' },
      { titulo: 'Indra — Proceso de selección', url: 'https://careers.indragroup.com/content/Proceso-de-Seleccion_ES/?locale=es_ES', tipo: 'oficial' },
      { titulo: 'Minsait — entrevistas relatadas por candidatos (Glassdoor)', url: 'https://www.glassdoor.com/Interview/Minsait-Interview-Questions-E1201389.htm', tipo: 'testimonios' }
    ]
  });

  empresa({
    id: 'consultora-servicios',
    nombre: 'Consultoras y empresas de servicios',
    pais: 'España · todo el territorio',
    sector: 'Servicios de IT, outsourcing y subcontratación',
    tamano: 'Desde 20 personas hasta multinacionales de decenas de miles',
    tech: ['Java', '.NET', 'Angular', 'PHP', 'SQL', 'SAP', 'Cobol'],
    perfiles: ['backend', 'frontend', 'fullstack', 'data', 'qa', 'infra'],
    formatos: ['quiz'],
    pruebaCodigo: 'no',
    dificultad: 1,
    proceso: [
      { fase: 'Contacto de un reclutador', formato: 'quiz', duracion: 20, que: 'A menudo por LinkedIn y sin oferta concreta todavía. Se pregunta disponibilidad, expectativa salarial y tecnologías del currículum.' },
      { fase: 'Entrevista técnica conversada', formato: 'quiz', duracion: 45, que: 'Preguntas sobre lo que pone tu currículum y sobre el stack del proyecto. Se habla de código, no se escribe.' },
      { fase: 'Entrevista con el cliente final', formato: 'quiz', duracion: 45, que: 'La decisión real. Trabajarás en el proyecto de otra empresa y es esa empresa la que aprueba tu perfil.' },
      { fase: 'Periodo de prueba', formato: 'trial', duracion: 0, que: 'La evaluación de verdad se traslada al contrato: hasta seis meses para técnicos titulados, según el artículo 14 del Estatuto de los Trabajadores.' }
    ],
    evalua: [
      'Que el currículum encaje con lo que el cliente ha pedido por escrito: es un proceso de emparejamiento, no de descubrimiento.',
      'Disponibilidad, movilidad y expectativa salarial, con frecuencia antes que la parte técnica.',
      'Capacidad de explicar tu experiencia con soltura, porque es prácticamente la única señal técnica que recogen.',
      'Certificaciones y titulación, que aquí sí puntúan.'
    ],
    consejo:
      'Esta ficha **no es una empresa concreta**: describe el modelo de contratación de la mayor parte ' +
      'del mercado español de desarrollo, del que casi nunca se habla en las guías de entrevistas.\n' +
      'Prepararse aquí es otro oficio: currículum ajustado a las palabras exactas de la oferta, ' +
      'ejemplos concretos de proyectos y buenas preguntas propias — para qué cliente, cuánto dura el ' +
      'proyecto, qué pasa cuando termina, quién es tu responsable. La ausencia de prueba técnica es ' +
      'una comodidad a corto plazo y una señal a largo: si no evalúan tu nivel al entrar, tampoco ' +
      'suelen tener una carrera técnica clara dentro.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'La distribución hexamodal de los salarios tech en España — Manfred', url: 'https://www.getmanfred.com/en/blog/la-distribucion-hexamodal-de-los-salarios-tech-en-espana', tipo: 'comunidad' },
      { titulo: 'Entendiendo los salarios en tecnología en España — Manfred', url: 'https://www.getmanfred.com/en/blog/los-triple-naturaleza-del-salario-tech-en-espana', tipo: 'comunidad' },
      { titulo: 'Artículo 14 del Estatuto de los Trabajadores: periodo de prueba', url: 'https://www.iberley.es/legislacion/articulo-14-estatuto-trabajadores', tipo: 'oficial' },
      { titulo: 'Pruebas técnicas en procesos de selección en España', url: 'https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion', tipo: 'comunidad' }
    ]
  });

  empresa({
    id: 'ia-generalista',
    nombre: 'Empresas con producto de IA',
    pais: 'Global',
    sector: 'Producto construido sobre modelos de lenguaje',
    tamano: 'Desde startup a gran tecnológica',
    tech: ['Python', 'TypeScript', 'LLM', 'RAG', 'Bases vectoriales', 'MCP', 'Evals'],
    perfiles: ['ai-engineer', 'backend', 'fullstack', 'data'],
    formatos: ['ai-case', 'take-home', 'system-design', 'debugging'],
    dificultad: 4,
    pruebaCodigo: 'si',
    proceso: [
      { fase: 'Screening', formato: 'quiz', duracion: 30, que: 'Qué has puesto en producción con LLM y qué se rompió.' },
      { fase: 'Caso práctico', formato: 'ai-case', duracion: 120, que: 'Diseñar una evaluación, depurar un RAG que devuelve basura o reducir el coste por petición.' },
      { fase: 'Diseño', formato: 'system-design', duracion: 60, que: 'Arquitectura de recuperación, herramientas del agente y límites de confianza.' },
      { fase: 'Producto', formato: 'quiz', duracion: 45, que: 'Cómo decides si un cambio de modelo mejora algo de verdad.' }
    ],
    evalua: [
      'Evaluación antes que intuición: cómo demuestras que una versión es mejor que otra.',
      'Coste y latencia por petición como restricción de diseño, no como detalle final.',
      'Límites de confianza entre la instrucción del sistema y los datos del usuario.',
      'Depuración de fallos de recuperación: distinguir un problema de índice de uno de prompt.'
    ],
    consejo:
      'Esta ficha no describe una empresa concreta: agrupa el patrón común de las pruebas de AI ' +
      'Engineer de 2026. Lo que se repite en las convocatorias públicas es que preguntan por *evals*, ' +
      'coste y fallos de agentes, no por entrenar modelos.',
    verificacion: 'parcial',
    fuentes: [
      { titulo: 'AI Engineer interview roadmap 2026: RAG, LLM y bases vectoriales', url: 'https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms', tipo: 'comunidad' },
      { titulo: 'How to interview for an AI Engineer role in 2026', url: 'https://chiraghasija.cc/posts/how-to-interview-ai-engineer-role-2026/', tipo: 'comunidad' }
    ]
  });

})(window.TT);

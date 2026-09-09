# Investigación: cómo son las pruebas técnicas en 2026

Documento de referencia del contenido de la plataforma. Recoge qué se comprobó,
qué se concluyó y cómo cada conclusión se ha convertido en ejercicios concretos.

---

## 1. Estado de las referencias consultadas

Se verificó la actividad real de cada repositorio antes de usarlo como referencia,
porque varios de los clásicos ya no reflejan la práctica actual.

| Referencia | Estado comprobado | Qué se ha tomado |
| --- | --- | --- |
| **Front End Interview Handbook** | Activo, actualizado para 2026, ~44k estrellas | La estructura de rondas (criba, técnica, código, frontend system design, comportamental) y el peso creciente del *frontend system design* |
| **JavaScript Questions** (lydiahallie) | Referencia consolidada | El formato "explica **por qué** ocurre esto", no "memoriza la respuesta". Origen directo de `js-orden-ejecucion` |
| **Tech Interview Handbook** | Activo | Estrategia de resolución y priorización del estudio |
| **Coding Interview University** | Enorme, pero funciona más como instantánea de enlaces que como ruta viva | Solo la idea de ruta progresiva. **No** se ha usado su reparto de temas: sobrepondera algoritmia clásica frente a lo que se evalúa hoy |
| **System Design Primer** | Sigue siendo la referencia estructural | Vocabulario y bloques de construcción de `emp-system-design` |
| **Awesome System Design Resources** | La lista curada más activa en 2026 | Qué temas de arquitectura se consideran vigentes |
| **RealWorld** | Activo, dos mantenedores, +100 implementaciones | **La idea más aprovechable**: una especificación única implementable en cualquier tecnología, validada contra el mismo conjunto de tests |
| **Node.js Best Practices** | Activo, "edición 2026" | Base de `be-refactor-produccion`: errores operativos frente a de programación, capas, secretos y logging |
| **Public APIs** | Vigente | Escenarios de consumo real: paginación, límites, autenticación |
| **App Ideas** | Útil solo como formato | Se ha tomado la estructura (objetivo, historias de usuario, requisitos, extras) y se ha subido el nivel a caso de empresa con rúbrica |
| **OpenAI Cookbook / Agents SDK (JS y Python)** | Activos | Conceptos de `ai-*`: salidas estructuradas, herramientas, handoffs, guardrails, tracing, `max_turns` |
| **LangGraph** | Activo | Contraste entre bucle libre y grafo de estados en `ai-agente-en-bucle` |
| **Microsoft Agent Framework** | Activo (~13k estrellas, Python y .NET, Go aparte). Incluye guías de migración **desde AutoGen y desde Semantic Kernel** | Se confirma el aviso del enunciado: AutoGen ya no es la referencia principal de Microsoft. Se cita MAF como alternativa de orquestación por grafo |

---

## 2. Qué pruebas hacen hoy las empresas

**El cambio de fondo:** una encuesta de 2026 a 400 responsables de ingeniería
recogía que el **71 % considera que la IA hace más difícil evaluar el nivel
técnico**, y que la señal que más rápido se ha degradado es la de las pruebas para
llevar a casa. Si cualquiera puede generar una entrega pulida, la entrega deja de
distinguir.

La respuesta del sector no ha sido eliminar el formato, sino **añadirle una ronda
de defensa**: se mantiene la prueba, y después se pide explicar el código y las
decisiones en directo. Eso no se puede fingir.

**Formatos vigentes:**

1. **Criba técnica** — conceptos y "explica por qué ocurre esto".
2. **Prueba para llevar a casa + defensa en directo.** La defensa es la ronda real.
3. **Ronda en directo** con la IA desactivada, normalmente algoritmia acotada.
4. **Ronda asistida por IA**, cada vez más frecuente: te dan la herramienta a
   propósito para ver **cómo la usas**.
5. **Revisión de código / depuración** sobre código existente, en claro aumento.
6. **System design**, estándar para *senior* y *staff*. En frontend es una ronda
   que hace cinco años no existía y hoy es donde más se cae.

El **78 %** de los equipos que mejoraron sus resultados de contratación usan
procesos multietapa que combinan formatos, en lugar de apostar por uno solo.

**Sobre el uso de IA:** las políticas se han separado en tres. En las pruebas para
llevar a casa se espera que la uses y que defiendas el resultado; en las rondas de
algoritmia en directo suele estar desactivada; y ha aparecido una ronda propia de
"IA asistida". Algunas empresas la exigen explícitamente en sus procesos de
backend, frontend y ML. Coinbase formalizó en marzo de 2026 una señal de
*fluidez con IA* con tres dimensiones: **uso, aplicación y comprensión de los
límites**.

→ **En la plataforma:** `emp-frontend-challenge` incluye la ronda de defensa como
parte de la rúbrica y una sección explícita sobre cómo se evalúa el uso de IA.
`emp-code-review` y `ai-agente-en-bucle` cubren el formato de revisar y depurar
código ajeno.

---

## 3. Qué se valora ahora

**Frontend.** JavaScript, React, CSS, accesibilidad y system design. Para un puesto
con Next.js, no saber explicar la diferencia entre componente de servidor y de
cliente termina la entrevista antes del diseño. Una respuesta fuerte en la ronda de
diseño cubre estrategia de estado, de renderizado, capas de caché, división de
código y accesibilidad. **Rendimiento, accesibilidad e internacionalización son lo
que separa a un senior de un junior.**

Un detalle recogido de forma repetida: el código generado por IA produce atributos
de accesibilidad *sintácticamente correctos pero semánticamente equivocados* —el
ejemplo canónico es `role="button"` sobre algo que debería ser un enlace, o sobre
un `<div>` que no recibe foco.

→ `fe-estados-accesibles` ataca exactamente eso.

**Backend.** Gestión de errores, capas, concurrencia, transacciones, seguridad y
observabilidad. Lo que se mira no es que el camino feliz funcione, sino qué pasa
cuando algo falla.

→ `be-refactor-produccion` y `emp-code-review`.

**IA.** El puesto que se contrata en 2026 es "quien construye sistemas fiables
sobre modelos que no ha entrenado", no "quien entrena modelos". Las cinco áreas
más discriminantes en las cribas: **diseño de evals, optimización de coste,
integración de MCP, modos de fallo en orquestación de agentes e ingeniería de
prompts**. La lista completa añade RAG y bases vectoriales, guardrails,
observabilidad en producción y soltura con los modelos frontera.

→ `ai-salidas-estructuradas`, `ai-rag-con-evidencia` y `ai-agente-en-bucle`.

---

## 4. Junior, Mid, Senior

La diferencia no está en el número de tecnologías, sino en **el alcance de lo que
puedes responsabilizarte y en el horizonte temporal**:

| | Alcance | Horizonte | Qué se evalúa |
| --- | --- | --- | --- |
| **Junior** | Tareas definidas dentro de un componente | Días | Fundamentos y capacidad de aprender |
| **Junior avanzado** | Funcionalidad pequeña de principio a fin | Semana | Autonomía en problemas acotados |
| **Mid** | Funcionalidad que cruza módulos o servicios | Semanas | Resolución sólida más criterio de diseño |
| **Senior** | Sistemas complejos e iniciativas entre equipos | Meses, incluida la evolución posterior | Diseño, decisiones, comunicación y mentoría |

Una formulación de 2026 que resume bien el salto: *senior* significa "resuelvo
problemas mal definidos, tomo decisiones de compromiso y me hago responsable del
resultado después del lanzamiento", no "escribo más código".

→ Los cuatro niveles de la plataforma son exactamente estos, y las pruebas
*senior* (`emp-code-review`, `emp-system-design`, `ai-agente-en-bucle`) son
deliberadamente abiertas: no tienen una única solución correcta y se puntúan por
la justificación.

---

## 5. Errores frecuentes de los candidatos

De las fuentes sobre corrección de pruebas para llevar a casa:

- **No leer el enunciado completo.** Se empieza a programar en lugar de leer.
- **No presupuestar el tiempo.** Pruebas de "3 horas" a las que se dedican quince.
- **Código innecesariamente complejo.** Las soluciones simples y bien estructuradas
  puntúan mejor que las ingeniosas.
- **Dejar el problema a medias** sin explicar qué falta ni por qué.
- **Ignorar los detalles del enunciado** que en realidad son requisitos encubiertos
  (latencia alta, porcentaje de fallos, límites de peticiones).
- **Expansión del alcance:** algunas empresas dejan requisitos vagos a propósito
  para ver dónde pones el límite.

Señales específicas de código generado sin revisar:

- **Optimismo:** se cubre el camino feliz y falta el código defensivo. Un humano
  con experiencia anticipa el fallo; el modelo escribe suponiendo condiciones
  perfectas.
- **Tests que solo validan lo predecible**, creando ilusión de cobertura mientras
  se dejan fuera los escenarios que realmente fallan en producción.
- **Sobrecomentado e hiperconsistente:** mismo esquema de nombres y estructura
  repetido de forma mecánica.
- **Estilo incoherente** entre partes del mismo proyecto.

→ Estos errores están en el bloque `commonErrors` de cada prueba, redactados como
lo que son: consecuencias concretas, no reglas abstractas.

---

## 6. Modos de fallo de los agentes en producción

Los tres que separan un agente que aguanta de uno que se degrada en silencio:
**errores en llamadas a herramientas, bucles infinitos y propagación de errores**.
La lista extendida de fallos propios de agentes: mal uso de herramientas, pérdida
de contexto, deriva del objetivo, bucles de reintento, errores en cascada en
sistemas multiagente y degradación silenciosa de la calidad.

Detalles operativos recogidos:

- Las APIs externas devuelven esquemas inconsistentes; **el contexto se llena y
  expulsa las definiciones de herramientas**; una respuesta malformada se convierte
  en la entrada del paso siguiente.
- Un agente en bucle de reintentos puede **agotar el presupuesto en minutos**. Sin
  detección de bucle y límite duro de iteraciones, se gasta el presupuesto de nube
  antes de que nadie lo note.
- **La mayoría de incidentes vienen de fallos de herramienta, truncado de contexto
  y bucles, no de errores del modelo.** Las herramientas de monitorización
  convencionales no los ven sin instrumentación específica.
- La observabilidad cuesta entre un 5 % y un 15 % del gasto del propio agente.
- Un agente fiable necesita evals unitarias por paso, suites de regresión con
  modelo juez para la calidad subjetiva y muestreo continuo de trazas en producción.

→ `ai-agente-en-bucle` reproduce los cuatro patrones (repetición idéntica,
reintento sin límite, historial sin cota y resultados de herramienta no validados)
y exige resolverlos con límites en el código, no en el prompt.

---

## 7. Cómo se traduce todo esto en la plataforma

| Conclusión de la investigación | Implementación |
| --- | --- |
| Las pruebas para llevar a casa se defienden en directo | Rúbrica de `emp-frontend-challenge` con criterio explícito de defensa |
| Se evalúa el criterio, no la sintaxis | Bloques `rationale`, `alternatives` y `companyLooksFor` en las 11 pruebas |
| Revisar y depurar código ajeno gana peso | `emp-code-review`, `ai-agente-en-bucle`, `be-refactor-produccion` |
| Frontend system design es la ronda que más elimina | `fe-estados-accesibles` y la rúbrica de `emp-frontend-challenge` |
| Accesibilidad separa senior de junior | Requisito puntuable, no extra |
| El código de IA falla en accesibilidad, defensa y tests | `commonErrors` recoge esos patrones concretos |
| AI Engineer = fiabilidad, coste, evals, observabilidad | Toda la ruta de IA |
| Filosofía RealWorld | Rúbricas independientes de la tecnología en las pruebas de empresa |
| Metodología de App Ideas | Historias de usuario y requisitos, elevados a caso de empresa |
| Node.js Best Practices | `be-refactor-produccion`, capa por capa |
| Formato de JavaScript Questions | `js-orden-ejecucion`: explicar el porqué, no memorizar |

**Lo que no se ha copiado:** ningún ejercicio, texto ni solución de las
referencias. Se han analizado patrones, metodologías y tipos de problema, y todo
el contenido es original.

---

## 8. Fuentes

Investigación realizada en septiembre de 2026.

- [Front End Interview Handbook](https://github.com/yangshun/front-end-interview-handbook) · [sitio 2026](https://www.frontendinterviewhandbook.com/front-end-system-design)
- [JavaScript Questions](https://github.com/lydiahallie/javascript-questions)
- [Tech Interview Handbook](https://github.com/yangshun/tech-interview-handbook)
- [Coding Interview University](https://github.com/jwasham/coding-interview-university)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Awesome System Design Resources](https://github.com/ashishps1/awesome-system-design-resources)
- [RealWorld](https://github.com/gothinkster/realworld)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Public APIs](https://github.com/public-apis/public-apis)
- [App Ideas](https://github.com/florinpop17/app-ideas)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook) · [Agents SDK JS](https://github.com/openai/openai-agents-js) · [Agents SDK Python](https://github.com/openai/openai-agents-python)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [Microsoft Agent Framework](https://github.com/microsoft/agent-framework)
- [What Actually Changed in Tech Interviews in 2026](https://www.techinterview.org/post/3233475417/what-changed-tech-interviews-2026/)
- [Take-Home vs Live Coding in 2026](https://jobsbyculture.com/blog/take-home-vs-live-coding-2026)
- [The Death of Whiteboard Interviews (2026)](https://jobsbyculture.com/blog/death-of-whiteboard-interviews-2026)
- [Three Ways AI is Reshaping Traditional Technical Interviews in 2026 — IEEE-USA](https://insight.ieeeusa.org/articles/three-ways-ai-is-reshaping-traditional-technical-interviews-in-2026/)
- [Frontend Interview Questions: A 2026 Prep Guide — Scrimba](https://scrimba.com/articles/frontend-interview-prep-guide-2026/)
- [Frontend Engineering 2026: Core Web Vitals, React 19 & DX Patterns](https://www.mockexperts.com/blog/frontend-engineering-2026-performance-dx)
- [AI Engineer Interview Questions 2026 — KORE1](https://www.kore1.com/ai-engineer-interview-questions-2026/)
- [How to Interview for an AI Engineer Role in 2026](https://chiraghasija.cc/posts/how-to-interview-ai-engineer-role-2026/)
- [AI Developer Hiring 2026: Skills That Actually Matter](https://www.digitalapplied.com/blog/ai-developer-hiring-skills-that-matter-2026)
- [AI Agent Failure Modes: Tool-Calling Errors, Infinite Loops & Propagation — Openlayer](https://www.openlayer.com/blog/ai-agent-failure-modes-tool-calling-loops-propagation)
- [Agent Observability 2026: Evals, Traces, Cost Guide](https://www.digitalapplied.com/blog/agent-observability-2026-evals-traces-cost-guide)
- [Why AI Agents Fail in Production, and the Observability That Catches It](https://winder.ai/why-ai-agents-fail-in-production/)
- [5 Reasons Devs Fail Take-Home Code Challenges](https://www.emergentsoftware.net/blog/5-common-reasons-developers-fail-take-home-code-challenges/)
- [Secrets from the Interview Room — What Reviewers Look For](https://medium.com/bigpanda-engineering/secrets-from-the-interview-room-what-reviewers-look-for-in-a-take-home-coding-assignment-1aaec70dabe0)
- [The Essential Guide to Take-Home Coding Challenges — freeCodeCamp](https://www.freecodecamp.org/news/the-essential-guide-to-take-home-coding-challenges-a0e746220dd7/)
- [How to Tell if Code is AI Generated: 2026 Detection Guide](https://vegavid.com/blog/how-to-detect-ai-generated-code)
- [Junior, Mid-Level, and Senior Developers in the Age of AI — Full Scale](https://fullscale.io/blog/difference-junior-mid-level-senior-developers/)
- [How to Go From Junior to Senior Developer in 2026 — daily.dev](https://daily.dev/blog/how-to-go-from-junior-to-senior-developer/)
- [10 GitHub Repositories to Ace Any Tech Interview — KDnuggets](https://www.kdnuggets.com/10-github-repositories-to-ace-any-tech-interview)

---

## 9. Investigación por empresa

Esta sección documenta la segunda fase del trabajo: pasar de "cómo son las pruebas
técnicas en general" a **qué empresa concreta usa qué formato, y con qué prueba
podemos demostrarlo**.

### 9.1 La regla que gobierna todo el capítulo

> Nunca presentamos como prueba oficial algo que no podamos demostrar.

Se traduce en dos etiquetas, visibles en la interfaz junto a cada prueba:

| Etiqueta | Qué afirma | Qué exige |
| --- | --- | --- |
| **Prueba documentada** | Hay evidencia pública de que la empresa usa una prueba **de ese tipo** | Al menos una fuente con URL. El enunciado sigue siendo original nuestro |
| **Prueba inspirada en su proceso** | **No** afirmamos que sea su prueba. Está construida a partir de su pila, el puesto y lo que se conoce de su proceso | Al menos una fuente con URL que sustente la pila o el proceso |

Y en dos más para las fichas de empresa:

| Etiqueta | Significado |
| --- | --- |
| **Proceso publicado** | La empresa documenta su proceso (página de empleo, handbook o blog de ingeniería) |
| **Proceso reconstruido** | No hay publicación oficial; se ha reconstruido a partir de testimonios públicos y se advierte en la propia ficha |

Estas reglas no son solo una convención de redacción: `tools/verificar.js` las
comprueba en cada ejecución y la integración continua falla si alguien añade una
empresa sin fuente o marca como documentada una prueba sin evidencia. Además,
`registry.js` **degrada automáticamente a "inspirada"** cualquier prueba que se
declare documentada sin fuente, antes que servir una afirmación que no se sostiene.

### 9.2 Empresas con proceso publicado por ellas mismas

Son las nueve fichas donde podemos afirmar más cosas, porque la fuente es la
propia empresa.

| Empresa | Qué publica | Fuente primaria |
| --- | --- | --- |
| **GitLab** | Handbook público con el proceso completo y las rúbricas. Su entrevista técnica es la **revisión de un Merge Request** seguida de una sesión de pair programming | [Technical Interviews](https://handbook.gitlab.com/handbook/hiring/interviewing/technical/) · [Candidate FAQ](https://handbook.gitlab.com/handbook/hiring/candidate-faq) |
| **GitHub** | El formato de su take-home: **límite de tiempo declarado**, entrega **anonimizada** (aparece "Interview-bot" como autor), tests automáticos y **rúbrica con scorecard** sobre un Pull Request | [How GitHub does take home technical interviews](https://github.blog/developer-skills/career-growth/how-github-does-take-home-technical-interviews/) |
| **Automattic** | Proceso íntegramente escrito y asíncrono (Slack, GitHub, P2), con una prueba de código sobre código existente y un **proyecto de prueba remunerado** de dos a ocho semanas | [How We Hire](https://automattic.com/how-we-hire/) · [How We Hire Developers](https://automattic.com/work-with-us/how-we-hire-developers/) |
| **Shopify** | La **Life Story** y el **pair programming** de 75-90 minutos en el lenguaje que elija el candidato | [Technical Interview Process](https://shopify.engineering/nail-your-technical-shopify-interview) |
| **Atlassian** | Guía oficial con las etapas: dos rondas de código de 60 minutos, una de system design y una **ronda de valores** con peso propio | [Engineering Interview Guide](https://www.atlassian.com/company/careers/resources/interviewing/engineering) |
| **Netflix** | Cómo entrevistan a backend: problemas **prácticos y ejecutables** (un limitador de peticiones, por ejemplo) en vez de algoritmia abstracta | [Demystifying Interviewing for Backend Engineers](https://netflixtechblog.com/demystifying-interviewing-for-backend-engineers-netflix-aceb26a83495) |
| **Google** | Guía oficial de preparación para SWE: estructuras de datos, algoritmos y complejidad. Decide un **comité que no te ha entrevistado** | [SWE interview prep guide](https://www.google.com/about/careers/applications/candidate-prep/swe) |
| **Meta** | Guía oficial de preparación: código correcto **sin compilador** y con muy poco tiempo por problema | [Preparing for your software engineering interview](https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/) |
| **Amazon** | Fases del proceso y assessments por puesto. Los **16 Leadership Principles** se evalúan en todas las rondas, incluidas las de código | [Interviewing at Amazon](https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon) |

### 9.3 Empresas con proceso reconstruido

Catorce fichas más, marcadas explícitamente como **reconstruidas**. Se incluyen
porque son relevantes para quien busca trabajo —siete son españolas o tienen sede
en España— pero la ficha advierte que la información procede de testimonios y que
puede haber cambiado.

| Empresa | Por qué está | Fuente principal |
| --- | --- | --- |
| **Stripe** | Sus rondas **Bug Squash** e **Integración** son el mejor ejemplo descrito de evaluación de libro abierto sobre un repositorio ajeno | [Testimonios en Blind](https://www.teamblind.com/post/stripe-full-loop-sde-interview-mmzxmgv0) · [Guía de Bug Squash](https://www.coditioning.com/blog/804/stripe-swe-bug-squash-interview) |
| **Airbnb** | Código ejecutable obligatorio y rondas de valores conducidas por personas ajenas a ingeniería | [interviewing.io](https://interviewing.io/airbnb-interview-questions) · [Glassdoor](https://www.glassdoor.com/Interview/Airbnb-Software-Engineer-Interview-Questions-EI_IE391850.0,6_KO7,24.htm) |
| **Spotify** | Proceso que varía por squad; su página oficial describe las etapas pero no el detalle técnico | [Life at Spotify](https://www.lifeatspotify.com/start-your-journey) · [Glassdoor](https://www.glassdoor.com/Interview/Spotify-Software-Engineer-Interview-Questions-EI_IE408251.0,7_KO8,25.htm) |
| **Cloudflare** | HTTP, caché y límites de peticiones aparecen en casi todas las rondas | [Taro](https://www.jointaro.com/interviews/companies/cloudflare/experiences/software-engineer-october-17-2025-no-offer-neutral-ff798d3e/) |
| **TravelPerk** | Su responsable de ingeniería publicó cómo contratan, aunque no los enunciados | [How do we hire engineers @ TravelPerk?](https://medium.com/@alexander.ludwick/how-do-we-hire-engineers-travelperk-afabbf82aedc) |
| **Typeform** | Pila y cultura de producto públicas; el proceso, no | [Careers — Engineering](https://www.typeform.com/careers/engineering) |
| **Factorial** | Dominio con muchas reglas de calendario; proceso no publicado | [Join Factorial](https://factorialhr.com/join-factorial) |
| **Glovo** | Dominio de eventos y estados de pedido; proceso no publicado | [Get Manfred](https://www.getmanfred.com/en/blog/los-triple-naturaleza-del-salario-tech-en-espana) |
| **Cabify** | En los testimonios se repite que la entrega se revisa contigo delante | [Pruebas técnicas en España](https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion) |
| **Wallapop** | Sus ofertas insisten en arquitectura hexagonal y en tests | [Pruebas técnicas: ejemplos reales](https://tadatic.com/pruebas-tecnicas-ejemplos-reales/) |
| **Revolut** | Listón muy alto en todo lo que toca dinero: precisión decimal e idempotencia | [hiring-without-whiteboards](https://github.com/poteto/hiring-without-whiteboards) |
| **Microsoft** | Su equipo de ingeniería en la nube publica ejercicios de take-home de ejemplo en abierto | [Take-Home Engineering Challenge (CSE)](https://github.com/seushermsft/Take-Home-Engineering-Challenge) |
| **Vercel** | Su producto marca el temario: renderizado, caché y métricas de carga | [hiring-without-whiteboards](https://github.com/poteto/hiring-without-whiteboards) |
| **Empresas con producto de IA** | Ficha **agregada**, no de una empresa concreta: recoge el patrón común de las pruebas de AI Engineer de 2026 (evals, coste, fallos de agentes) | [AI Engineer roadmap 2026](https://www.mockexperts.com/blog/2026-ai-engineer-interview-roadmap-rag-llms) · [Interviewing for an AI Engineer role](https://chiraghasija.cc/posts/how-to-interview-ai-engineer-role-2026/) |

### 9.4 Qué se descartó, y por qué

- **Copiar enunciados reales.** Ni uno. Aunque circulen públicamente, reproducirlos
  no enseña —el candidato memoriza en vez de aprender— y arrastra un problema de
  propiedad. Lo que se reproduce es el **formato**, que es lo que está documentado.
- **Empresas sin ninguna fuente comprobable.** Varias candidatas quedaron fuera del
  registro por no encontrar ni publicación oficial ni testimonios agregados
  fiables. El verificador lo habría impedido de todas formas.
- **Cifras de proceso presentadas como exactas.** Las duraciones de las fases son
  aproximadas y así se dicen. Un "60 min" en una ficha reconstruida es el valor que
  más se repite en los testimonios, no un dato oficial.
- **Glassdoor como fuente única para una ficha documentada.** Los testimonios
  sostienen una ficha *reconstruida*; nunca la afirmación de que una empresa usa
  una prueba concreta.

### 9.5 Cobertura resultante

Las 23 fichas cubren 15 de los 17 formatos de evaluación del catálogo y los siete
perfiles con contenido. Cada empresa tiene al menos una prueba asociada, y cada
prueba declara su formato, su puesto, su nivel, su duración, su dificultad, qué
intenta comprobar la empresa y con qué evidencia lo afirmamos.

Los dos formatos sin contenido propio todavía son **pair programming** y
**proyecto de prueba remunerado**: los dos requieren una segunda persona o varias
semanas de trabajo, así que se documentan en las fichas de empresa pero no tienen
ejercicio equivalente en la plataforma.

---

## 10. Barcelona a fondo: empresas, pruebas técnicas y ofertas

Investigación específica sobre el ecosistema de Barcelona, hecha en septiembre de
2026. Tres preguntas: **qué empresas hay**, **qué prueba técnica ponen** y **qué
piden exactamente en sus ofertas**.

Todo lo que sigue procede de fuentes comprobables: repositorios de contratación
públicos, ofertas de empleo vigentes en el momento de la consulta, blogs de
ingeniería y repositorios de candidatos. Cuando la fuente es un testimonio y no la
empresa, se dice.

### 10.1 Por qué Barcelona no se prepara como Madrid

Barcelona y Madrid concentran cada una en torno a una cuarta parte del talento
tecnológico de España, pero no son el mismo mercado, y eso cambia qué prueba te van
a poner:

| | Barcelona | Madrid |
| --- | --- | --- |
| Tipo de empresa | Empresas de **producto digital** y scale-ups | Grandes organizaciones y entornos **corporativos** |
| Stack dominante | Python, Node.js, React, Ruby on Rails, Kotlin | Java, .NET y sistemas heredados |
| Prueba típica | Take-home + defensa en vivo de tu código | Entrevista técnica y test de conocimientos |
| Backend 5+ años | 42.000-65.000 € | 42.000-68.000 € |
| Tech Lead | 60.000-80.000 € | 65.000-85.000 € |

La consecuencia práctica: en Barcelona **se evalúa cómo construyes producto**, no
cuánta sintaxis recuerdas. Y el factor que más determina el salario no es la ciudad
sino el tipo de empresa: una multinacional con hub en Barcelona paga cerca de sus
bandas de origen.

### 10.2 El mapa: doce empresas españolas en el catálogo

Once tienen su equipo de ingeniería en Barcelona; la duodécima, Cabify, está en
Madrid y se incluye como contraste. Barcelona es la sede de tres unicornios
—Factorial, Glovo y TravelPerk— además de Adevinta, Wallapop, Typeform, SeQura,
Wallbox, vLex y eDreams ODIGEO.

| Empresa | Sector | Stack | Prueba | Evidencia |
| --- | --- | --- | --- | --- |
| **Holded** | Gestión para pymes | PHP, Go, TypeScript, React, MongoDB | Take-home + defensa | Enunciado **público en GitHub** |
| **SeQura** | Fintech, pago aplazado | Ruby on Rails, Elixir, Kotlin | Take-home 3 h + peer review en vivo | Proceso en sus ofertas; enunciados en repos de candidatos |
| **Factorial** | RRHH | Ruby on Rails, React, React Native | **Live Challenge con dos ingenieros** | Proceso y salario en cada oferta |
| **Glovo** | Reparto | Java, Kotlin, Spring, MySQL, Redis, Kafka | Técnica + **whiteboard** | Proceso publicado en su web |
| **Wallapop** | Marketplace | Java, Kotlin, Swift, Bazel, Python | Take-home 7 días **o trabajo previo** | Proceso completo en cada oferta |
| **SEAT:CODE** | Automoción | Kotlin, Swift, Angular | Kata de robot sobre cuadrícula | 3 fases en su web; enunciado en repos de candidatos |
| **eDreams ODIGEO** | Viajes | Java, Kotlin, Spring, React | Take-home o Codility + diseño | Blog de ingeniería; testimonios |
| **Adevinta Spain** | Marketplaces | Kotlin, Java, Scala, Kubernetes, Kafka, Flink | Técnica + arquitectura | Ofertas; testimonios |
| **TravelPerk** | Viajes de empresa | Python, Django, React | Take-home + defensa | Artículo de su responsable de ingeniería |
| **Typeform** | Formularios | Go, TypeScript, React, PHP | Take-home orientado a producto | Página de empleo |
| **CaixaBank Tech** | Banca | Java, J2EE, Python, Angular | Variable por equipo | Ofertas con requisitos detallados |
| **Cabify** | Movilidad (Madrid) | Elixir, Ruby, Go, React | Take-home + refactor en vivo | Testimonios |

Fuera del catálogo pero parte del mapa: **Landbot** (TypeScript, React, Python,
Django; con vacante abierta de *AI Engineer – Agentic Systems*), **Marfeel**,
**Red Points**, **Preply**, **Exoticca** (Node.js, NestJS, TypeScript), **Holded**,
**vLex** (legaltech, unicornio en 2025), **Wallbox** y los estudios de videojuegos
**King**, **Socialpoint** y **Ubisoft Barcelona**, donde la prueba es de C++ y
programación de gameplay.

### 10.3 El hallazgo: dos empresas publican el enunciado, no solo el formato

Esto es poco habitual en cualquier parte del mundo y merece la pena aprovecharlo.

#### Holded — el repositorio de contratación más transparente de Barcelona

`github.com/holdedhub/careers` contiene sus **pruebas técnicas reales**, una por
perfil, además de su stack completo y su política de trabajo híbrido.

- **Backend senior** — modelar una máquina expendedora. Acepta monedas de 0,05,
  0,10, 0,25 y 1; tres artículos a 0,65, 1,00 y 1,50; devolución de monedas; y el
  detalle decisivo: **la máquina lleva la cuenta del cambio disponible**. Piden PHP,
  `Dockerfile`, y avisan de que *"no se trata de que simplemente funcione"* y de que
  *"un script de un solo archivo que procesa comandos no demuestra nivel senior"*.
- **Frontend** — una aplicación de listado de documentos con notificaciones en
  tiempo real por WebSocket contra un servidor que ellos proporcionan. Y una
  restricción que lo cambia todo: **prohíbe React, Angular y Socket.io**. Quieren
  ver que sabes construir sin framework.
- **Full Stack** — la máquina expendedora, pero con interfaz cuidada y modo de
  servicio separado del flujo de cliente.
- **SRE** — Terraform sobre GKE con failover multirregión, Prometheus/Grafana,
  autoescalado por métricas propias, CI/CD con despliegues canary y rollback.

Su sección sobre IA es de las más claras que se han encontrado en todo el estudio:
las herramientas de IA son bienvenidas, pero *"deberás defender tu solución en una
entrevista técnica"* y el código entregado tiene que ser código que puedas
*"explicar, modificar y ampliar con seguridad por si los agentes de IA
desaparecieran mañana"*.

#### SeQura — el reto que circula en repositorios de candidatos

No lo publican ellos, pero coincide entre repositorios independientes:

- **Backend** — calcular los desembolsos semanales a comercios aplicando una
  comisión por tramos: **1,00 % por debajo de 50 €, 0,95 % entre 50 y 300 €, y
  0,85 % a partir de 300 €**. Dos repositorios de candidatos distintos recogen
  exactamente los mismos tramos.
- **Frontend** — un widget que muestra el coste de financiación en la ficha de
  producto de una tienda ajena, integrado con dos de sus APIs y emitiendo eventos
  por cada interacción. El enunciado, reproducido literalmente por un candidato,
  incluye instrucciones muy reveladoras: *"no deberías dedicar más de 3 horas"*,
  *"considera este código listo para producción, como si fuera un PR que va a
  revisar un compañero"*, *"no necesitas terminar: valoramos calidad por encima de
  completitud"* y una advertencia técnica de fondo — *"estás trabajando con recursos
  que se van a cargar en las webs de nuestros comercios, así que ten cuidado con
  dependencias, estilos y colisiones de código"*.

#### SEAT:CODE — la kata del robot

Varios candidatos publican su solución al reto de backend, y coinciden: un PDF con
un enunciado de robots que se mueven por una cuadrícula con órdenes de giro y
avance, un fichero de entrada y una salida esperada del tipo `1 3 N / 5 1 E`. Es la
kata clásica de cortacésped o rover. Los propios candidatos señalan que el peso de
la evaluación está en el modelado y en los tests, no en resolver el movimiento.

### 10.4 El patrón que define a Barcelona: entregar y defender

Es la conclusión más útil de todo este capítulo. En Barcelona, **el take-home casi
nunca es el final del proceso: es el material de la ronda siguiente**.

| Empresa | Qué dicen exactamente |
| --- | --- |
| SeQura | *"Live peer review of your own code"* — una ronda entera revisando tu entrega contigo |
| Holded | *"Prepárate para defender tu trabajo"*: explicar cada decisión de arquitectura, las alternativas que valoraste y cómo lo extenderías |
| Wallapop | *Expertise Interview* de 60-90 minutos sobre las competencias y tu capacidad de entregar en contexto |
| Cabify | Defensa de decisiones y refactor en vivo sobre tu propio código |
| eDreams | Entrevista técnica con dos ingenieros senior sobre tu experiencia y un problema de diseño |
| TravelPerk | Te entrevistan los ingenieros con los que trabajarías |

**Consecuencia práctica para quien se prepara:** entregar algo grande que no
controlas es peor que entregar algo pequeño que puedes defender línea a línea. Esa
es exactamente la razón de que las pruebas de esta plataforma tengan bloque de
*alternativas*, de *por qué esta solución* y de *errores frecuentes*: no basta con
que pasen los tests.

Dos matices importantes:

- **Casi nadie hace algoritmia de pizarra.** En todo el estudio de Barcelona, el
  único formato claramente algorítmico son los tests automatizados de eDreams
  (Codility) y de Revolut. Es el contraste más fuerte con las grandes tecnológicas
  estadounidenses.
- **Dos excepciones al take-home**, y las dos por el mismo motivo: quieren verte
  trabajar en directo. **Factorial** sustituye la prueba para casa por un *Live
  Engineering Challenge* con dos de sus ingenieros, donde dicen explícitamente que
  *"no buscamos un producto terminado, sino cómo estructuras el problema, qué
  preguntas haces, cómo usas la tecnología y cómo razonas la solución"*. **Glovo**
  hace una ronda de código y otra de whiteboard, y en la segunda evalúa *"lo simple,
  mantenible y flexible al cambio"* que sea tu solución.

Y un detalle poco conocido y muy rentable: **Wallapop acepta que entregues una
prueba técnica que ya hiciste para otro proceso**, o un repositorio tuyo, siempre
que sea de la JVM, suficientemente complejo y que se compile y ejecute solo.
Conviene guardar todas las pruebas técnicas que hagas.

### 10.5 Análisis de las ofertas: qué piden, puesto por puesto

Requisitos extraídos de ofertas reales vigentes en septiembre de 2026.

#### Backend

Lo que se repite en casi todas:

- **Diseño de dominio.** Wallapop pide *"Domain-Driven Design aplicando diseño
  táctico y estratégico"*; Holded, *"diseñarás sistemas orientados al dominio
  combinando diseño estratégico y táctico (DDD)"*; Exoticca, DDD junto con
  arquitectura orientada a eventos. Tres empresas distintas, la misma expresión.
- **Testing como requisito, no como extra.** SeQura pide *"sólido conocimiento de
  OOP, código limpio, TDD y agile"*; Holded, unit e integración; Cabify pone los
  tests por delante de la funcionalidad extra en la evaluación de la entrega.
- **DevOps propio.** Holded lo dice sin rodeos: *"practicarás DevOps, ayudarás a
  mantener la infraestructura"* y *"cuando hayas desarrollado algo, sabrás —y
  querrás— desplegarlo a producción"*.
- **Liderazgo técnico desde senior.** Mentorizar, liderar decisiones de arquitectura
  y **comunicarlas** aparece en las ofertas senior de Holded, Factorial y SeQura.
  Factorial añade participar en RFCs, revisar código a diario y **hablar con
  clientes** para entender sus problemas.

Lo que cambia según la empresa:

| Empresa | Lenguaje | Bases de datos | Distintivo |
| --- | --- | --- | --- |
| Holded | PHP, Go | MongoDB, DynamoDB, Redis | Solo NoSQL |
| SeQura | Ruby on Rails | — | 7+ años para senior |
| Factorial | Ruby on Rails | PostgreSQL | RFCs y llamadas con clientes |
| Glovo | Java, Kotlin, Spring | MySQL, Redis | SQS, Kinesis, Kafka |
| Adevinta | Kotlin, Java, Scala | — | **Perfilado y tuning de JVM de baja latencia**, Kafka y Flink |
| Exoticca | Node.js, NestJS, TypeScript | — | 3+ años, arquitectura de eventos |
| TravelPerk | Python, Django | — | *"Product Engineering mindset"* |
| CaixaBank Tech | Java, J2EE, WebLogic | — | Vacantes junior con **6 meses** de experiencia |

#### Frontend

El listón es notablemente más alto de lo que suele esperarse:

- **Arquitectura de capas en el cliente.** Holded documenta que separan dominio,
  aplicación, infraestructura y UI, con *"las dependencias yendo en una sola
  dirección: UI → aplicación → dominio"*.
- **Desconfianza deliberada de las dependencias.** Holded: *"solo usamos componentes
  de terceros headless"* y *"nos lo pensamos dos veces antes de añadir una librería
  de terceros"*. SeQura, en su reto, pide justificar cada librería y qué
  alternativas se valoraron.
- **Saber programar sin framework.** Es la restricción del reto de Holded y el
  criterio que declaran: *"capacidad de escribir buen código por encima de usar un
  framework concreto"*.
- **Rendimiento medido.** Wallapop define objetivos explícitos para su equipo de
  plataforma iOS: *"tiempo de arranque, capacidad de respuesta, fluidez del
  renderizado, huella de memoria y tasa de sesiones sin fallos"*, con Bazel y caché
  remota para los builds, y Sentry y OpenTelemetry para observabilidad.
- **Stack habitual:** TypeScript, React, Redux, Tailwind, Jest, Vite.

#### Full stack y perfiles de producto

Factorial es el ejemplo más claro y el que mejor documenta lo que espera:
*"asumir la responsabilidad de grandes iniciativas centradas en resultados, no solo
en entregas"*, fijar objetivos y planificar hojas de ruta trimestrales, participar
en RFCs, revisar código a diario y mentorizar. Stack: Ruby on Rails, React y React
Native.

#### Datos, IA y agentes — donde está el crecimiento

Es el cambio más marcado respecto de años anteriores: **las ofertas de Barcelona ya
piden evaluación de sistemas con LLM y orquestación de agentes, no investigación en
modelos**.

- **Wallapop — MLOps Engineer.** AWS (SageMaker, Lambda, S3), Kubernetes, Python,
  Git y CI/CD; *"arquitecturas de ML en tiempo real, con herramientas como Kafka
  para ingesta de baja latencia"*; **bases de datos vectoriales o infraestructura de
  búsqueda semántica** (OpenSearch, Vertex AI); Flyte, MLFlow y Feast. Como deseable:
  LLMs, arquitecturas RAG, LangChain o LlamaIndex, Spark, Airflow y dbt.
- **SeQura — Senior Backend Engineer, AI Agents.** 5+ años de backend y
  *"experiencia con sistemas agénticos o agentes con LLM (RAG, orquestación de
  flujos, chatbots)"*. La responsabilidad principal es *"orquestar flujos de agentes
  entre múltiples servicios, gestionando contexto, estado e interacciones"*.
- **Factorial — AI Staff Engineer.** Piden trayectoria demostrable con *"sistemas o
  flujos de trabajo con IA reales, no solo experimentos"*, y entre las
  responsabilidades: *"promover una cultura de definir especificaciones claras antes
  de construir"* y *"liderar el desarrollo de sistemas de evaluación automatizados y
  con humano en el bucle"*. Dicen expresamente que les importa más qué has
  construido que con qué stack.
- **CaixaBank Tech — Software Engineer AI.** Perfil de integración: *"desarrollar
  servicios de IA reutilizables en toda la organización"* sobre Watson, Google
  Cloud, AWS o Azure.
- **Landbot** tiene abierta una vacante de *AI Engineer – Agentic Systems &
  Backend*.

Traducido a preparación: **evals, coste por petición, RAG y depuración de agentes
son temario de entrevista en Barcelona**, no solo en San Francisco. Es exactamente
lo que cubren las pruebas `ai-*` y `agents` del catálogo.

#### Videojuegos

Un mercado aparte dentro de la misma ciudad. King, Socialpoint y Ubisoft Barcelona
usan pruebas de **C++** y programación de gameplay, a menudo cronometradas. El
proceso de Socialpoint son cuatro pasos: entrevista inicial, prueba técnica,
entrevista técnica con el equipo y entrevista con el responsable técnico.

### 10.6 Salarios publicados

Solo cifras que la propia empresa publica en su oferta o que provienen de un estudio
con metodología declarada:

| Fuente | Puesto | Cifra |
| --- | --- | --- |
| Factorial (oferta) | Senior Software Engineer | 60.000 € |
| Factorial (oferta) | AI Staff Engineer | 94.300 - 106.950 € |
| Manfred, guía 2026 | Backend (mediana / P75, España) | ~45.000 € / ~65.000 € |
| Manfred, guía 2026 | AI Engineer (mediana / P75, España) | 52.250 € / 68.500 € |
| Manfred | Backend 5+ años, Barcelona | 42.000 - 65.000 € |
| Manfred | Tech Lead, Barcelona | 60.000 - 80.000 € |

Dos observaciones del estudio de Manfred que conviene tener presentes: nunca había
habido tanta diferencia salarial entre personas con **el mismo puesto y experiencia
parecida**, y quienes integran IA en su flujo de trabajo ven subir sus
oportunidades mientras que quienes trabajan igual que hace cinco años ven su salario
estancarse.

### 10.7 Qué se ha incorporado a la plataforma

- **Seis fichas de empresa nuevas**: Holded, SeQura, SEAT:CODE, eDreams ODIGEO,
  Adevinta Spain y CaixaBank Tech.
- **Tres fichas ascendidas a "proceso publicado"** al encontrar la fuente oficial:
  Glovo (su web publica las cinco fases del itinerario técnico), Wallapop (cada
  oferta detalla las seis) y Factorial (proceso y banda salarial en cada anuncio).
- **Un filtro de ubicación** en la página de Empresas, porque con doce empresas de
  Barcelona ya tiene sentido preguntarse dónde está el equipo.
- **Dos pruebas nuevas**, adaptadas de retos reales de Barcelona y que además llenan
  dos categorías que estaban vacías:
  - `bcn-desembolsos-comisiones` (Backend) — comisiones por tramos y desembolsos
    semanales, del reto de SeQura. Enseña aritmética entera del dinero, fronteras de
    tramo y la trampa del domingo en `getUTCDay()`.
  - `bcn-maquina-expendedora` (Arquitectura) — la máquina expendedora de Holded, con
    el detalle que hunde la mayoría de las entregas: con inventario limitado de
    monedas, dar siempre la moneda más grande **falla aunque exista solución**.

Ninguna de las dos copia el enunciado. Reproducen el problema de negocio y el listón
de evaluación, con contrato, tests y solución propios, y su bloque `empresa` enlaza
la fuente para que cualquiera pueda comprobarlo.

### 10.8 Fuentes de este capítulo

#### Repositorios y blogs de ingeniería

- [holdedhub/careers](https://github.com/holdedhub/careers) · [reto de backend](https://github.com/holdedhub/careers/blob/main/challenges/backend/README.md) · [reto de frontend](https://github.com/holdedhub/careers/blob/main/challenges/frontend/README.md) · [stacks.md](https://github.com/holdedhub/careers/blob/main/stacks.md)
- [The Glovo Tech Blog](https://tech-blog.glovoapp.com/) · [Tech @ Glovo, hub de Barcelona](https://engineering.glovoapp.com/tech-hubs/barcelona/)
- [eDreams ODIGEO Tech Blog](https://tech.edreamsodigeo.com/)
- [How do we hire engineers @ TravelPerk?](https://medium.com/@alexander.ludwick/how-do-we-hire-engineers-travelperk-afabbf82aedc)

#### Procesos publicados por la empresa

- [Our Hiring Process — Glovo Careers](https://careers.glovoapp.com/our-hiring-process/)
- [SEAT CODE — Join Us](https://www.code.seat/workwithus)
- [Ofertas de Wallapop con proceso detallado](https://job-boards.eu.greenhouse.io/wallapop) · [iOS Engineer - Platform](https://job-boards.eu.greenhouse.io/wallapop/jobs/4521032101) · [MLOps Engineer](https://job-boards.eu.greenhouse.io/wallapop/jobs/4741205101)
- [Factorial — Senior Software Engineer](https://careers.factorialhr.com/job_posting/senior-software-engineer-foundations-248454) · [AI Staff Engineer](https://careers.factorialhr.com/job_posting/ai-staff-engineer-operations-domain-287783) · [Staff Software Engineer, DX](https://careers.factorialhr.com/job_posting/staff-software-engineer-developer-experience-261530)
- [SeQura — Senior Software Engineer](https://sequra.recruitee.com/o/senior-software-engineer-2) · [Senior Backend Engineer, AI Agents](https://sequra.recruitee.com/o/senior-backend-engineer-ai-agents)
- [Careers at Typeform — Engineering](https://www.typeform.com/careers/engineering)
- [Careers in Factorial](https://factorialhr.com/join-factorial)
- [CaixaBank Tech — Junior Software Engineer Java + Python](https://caixabanktech.com/en/job/junior-software-engineer-java-python-3/) · [Software Engineer AI](https://caixabanktech.com/en/job/software-engineer-ai-3/)
- [Product & Tech — Adevinta Careers](https://adevinta.com/careers/product-tech/) · [Ofertas de Adevinta](https://careers.smartrecruiters.com/Adevinta)
- [Holded — Senior Backend Developer](https://jobs.holded.com/o/senior-backend-developer-barcelona) · [Jobs Landbot](https://jobs.landbot.io/)

#### Enunciados publicados por candidatos

- [Reto de frontend de SeQura, reproducido íntegro](https://github.com/sergioggdev/sequra-challenge)
- [Reto de backend de SeQura, con los tramos de comisión](https://github.com/joelGarcia93/sequra-challenge) · [segundo repositorio independiente](https://github.com/languita/sequra-challenge)
- [Reto de SEAT:CODE en Kotlin, con descripción del enunciado](https://github.com/rballeba/seatCodeChallenge) · [otra solución independiente](https://github.com/d0vi/seat-code-challenge)

#### Mercado y salarios

- [Guía Salarial 2026 — Manfred](https://www.getmanfred.com/en/blog/guia-salarial-2026-salarios-en-tecnologia-espana-manfred)
- [Salarios Barcelona vs Madrid vs resto de España — Manfred](https://www.getmanfred.com/en/blog/salaries-barcelona-vs-madrid-vs-rest-of-spain)
- [Barcelona, hub tecnológico — catalonia.com](https://catalonia.com/why-catalonia/tech-and-digital-hubs-in-catalonia)
- [Salarios tech en España, análisis de la guía 2026 — Xataka](https://www.xataka.com/empresas-y-economia/salarios-tech-espana-se-mueven-a-dos-velocidades-ia-pisa-acelerador-echan-freno)

#### Testimonios

- [Glovo — entrevista de Backend Engineer en Barcelona](https://freezefrancis.medium.com/glovo-barcelona-backend-engineer-interview-experience-19e2c30f159d)
- [eDreams ODIGEO — entrevistas en Barcelona (Glassdoor)](https://www.glassdoor.com/Interview/eDreams-ODIGEO-Barcelona-Interview-Questions-EI_IE12822.0,14_IL.15,24_IM1015.htm)
- [Socialpoint — entrevistas en Barcelona (Glassdoor)](https://www.glassdoor.com/Interview/Socialpoint-Barcelona-Interview-Questions-EI_IE662378.0,11_IL.12,21_IC2547194.htm)
- [King — entrevistas en Barcelona (Glassdoor)](https://www.glassdoor.com/Interview/King-Barcelona-Interview-Questions-EI_IE597128.0,4_IL.5,14_IM1015.htm)
- [Ubisoft — entrevistas en Barcelona (Glassdoor)](https://www.glassdoor.com/Interview/Ubisoft-Barcelona-Interview-Questions-EI_IE12717.0,7_IL.8,17_IM1015.htm)
- [Adevinta Spain — opiniones de ingeniería en Barcelona (Glassdoor)](https://www.glassdoor.com/Reviews/Adevinta-Spain-Software-Engineer-Barcelona-Reviews-EI_IE3430143.0,14_KO15,32_IL.33,42_IC2547194.htm)

### 10.9 Advertencia de vigencia

Las ofertas de empleo caducan. Varias de las consultadas para este capítulo ya no
estaban disponibles al terminar la investigación, y algunas de las enlazadas habrán
caducado cuando leas esto. Lo que se ha procurado citar es lo estable —repositorios
de contratación, páginas de proceso, blogs de ingeniería— y lo que cambia rápido
—una vacante concreta— se ha usado como evidencia de lo que pedían en septiembre de
2026, no como una afirmación permanente.

Los procesos también cambian. El campo `revisado` de cada ficha de empresa dice
cuándo se comprobó por última vez.

---

## 11. Tipos de oferta, y las empresas donde no hay prueba técnica

Los capítulos anteriores describen procesos de selección de empresas de producto.
Ese es el mundo del que habla toda la literatura sobre entrevistas técnicas, y es
**una minoría del empleo real de desarrollo en España**.

Este capítulo corrige ese sesgo. Analiza qué tipos de oferta existen, qué prueba
pone cada uno y —lo que casi nadie documenta— **qué pasa en la mayor parte del
mercado, donde no hay ninguna prueba de código**.

### 11.1 Seis tipos de empresa, seis procesos distintos

La clasificación más útil que existe del mercado español es la que Manfred llama
*distribución hexamodal*: los salarios tecnológicos no forman una campana, forman
seis grupos con dinámicas distintas. Y resulta que **el tipo de empresa predice el
tipo de prueba** casi mejor que ninguna otra variable.

| Tipo | Ejemplos | Mediana senior | Qué prueba pone |
| --- | --- | --- | --- |
| **1. Consultora pequeña** | Consultoras locales, pymes de servicios | ~30.000 € | Casi nunca hay prueba de código. Conversación técnica y currículum |
| **2. Gran corporación / consultora** | Accenture, Capgemini, Indra/Minsait, IT de bancos y telcos | ~45.000 € | Entrevista competencial, inglés y, para juniors, pruebas de aptitud. Rara vez código |
| **3. Startup nacional** | Producto propio, financiación limitada | ~55.000 € | Take-home corto, a veces sustituido por ver tu GitHub |
| **4. Scale-up nacional** | Factorial, Glovo, Typeform, Wallapop, SeQura, Holded | ~70.000 € | **Take-home + defensa en vivo.** Es el patrón de Barcelona |
| **5. Scale-up internacional** | GitHub, GitLab, Stripe, Vercel | ~100.000 € | Loop completo: take-home con rúbrica, diseño de sistemas, depuración |
| **6. Big Tech** | Google, Meta, Amazon, Netflix, Microsoft | ~150.000 € | Algoritmos, complejidad y system design, con varias rondas eliminatorias |

Las cifras son medianas nacionales y la fuente las da como orientativas. Lo que
importa aquí es la última columna: **el esfuerzo de preparación se multiplica al
subir de tipo, y el tipo de preparación cambia por completo**. Estudiar algoritmos
para un proceso de tipo 1 o 2 es tiempo tirado; presentarse a uno de tipo 6 sin
haberlos estudiado es no presentarse.

Un matiz importante: el tipo de empresa **no es una escala de calidad**. Una
consultora pequeña puede ofrecer estabilidad, horario razonable y poca presión, que
para mucha gente vale más que 20.000 € y un proceso de cinco rondas.

### 11.2 Empresas sin prueba técnica: quiénes son y cómo deciden

Esta es la parte que falta en todas las guías, y afecta a más gente que ninguna otra.

#### Quiénes

- **Consultoras y empresas de servicios de IT.** El grueso del empleo de desarrollo
  en España. Trabajas en el proyecto de un cliente, no en un producto propio.
- **Grandes corporaciones.** Departamentos de tecnología de bancos, aseguradoras,
  telecos, industria y administración pública.
- **Agencias y estudios pequeños.** Deciden con el portafolio y una conversación.
- **Contratación por referencia interna.** En muchas empresas —también de producto—
  una recomendación de alguien de dentro se salta o abrevia la parte técnica.
- **Freelance y contratación por proyecto.** Aquí la "prueba" son tus referencias y
  trabajos anteriores; en el peor de los casos, un primer encargo pequeño pagado.

#### Cómo deciden entonces

El caso mejor documentado es **Minsait**, del grupo Indra, porque publica su proceso.
Son tres fases y llama la atención lo que dicen y lo que no:

1. **Pruebas técnicas e idiomas** — y esto es literal: *solo para perfiles con menos
   de dos años de experiencia*. Evalúan *"cómo te desenvuelves en situaciones reales,
   tu capacidad para resolver problemas bajo presión y tu nivel de inglés"*.
2. **Entrevistas de habilidades y conocimientos** — *"tu visión global, tu capacidad
   analítica y tu creatividad"*, conversando con gente del equipo.
3. **Entrevista con Recursos Humanos** — motivaciones y encaje cultural.

Es decir: **si tienes más de dos años de experiencia, según su propio proceso
publicado no hay ninguna prueba de código**. La decisión se toma con tu relato
profesional y tu inglés.

En el modelo de consultora de servicios la secuencia habitual añade una cuarta pieza
que no aparece en ningún artículo sobre entrevistas técnicas:

1. Contacto de un reclutador, a menudo sin oferta concreta todavía.
2. Entrevista técnica **conversada**: se habla de código, no se escribe.
3. **Entrevista con el cliente final**, que es donde se decide de verdad, porque es
   la empresa para la que vas a trabajar aunque no te contrate.
4. **El periodo de prueba**, que es donde se traslada la evaluación real.

#### El periodo de prueba como sustituto de la prueba técnica

Conviene entenderlo bien porque tiene consecuencias. El artículo 14 del Estatuto de
los Trabajadores permite un periodo de prueba de **hasta seis meses para técnicos
titulados** y **dos meses para el resto** (tres en empresas de menos de veinticinco
personas), y durante ese tiempo cualquiera de las dos partes puede resolver el
contrato sin preaviso ni indemnización.

Una empresa que no hace prueba técnica no está renunciando a evaluarte: está
evaluándote **después de contratarte**, cuando el coste de equivocarse ya no es
suyo del todo. Los convenios colectivos pueden ampliar esos plazos, así que merece
la pena mirar qué convenio se aplica antes de firmar.

#### Qué significa que no haya prueba

No es ni bueno ni malo por sí mismo, pero sí es información:

**A favor.** El proceso es mucho más rápido y menos exigente en tiempo no
remunerado. Si buscas entrar rápido al mercado, cambiar de trabajo sin dedicar
veinte horas a pruebas, o vienes de otro sector, es la puerta más practicable. Para
un primer empleo es, con diferencia, la vía más realista.

**En contra.** Si no miden tu nivel al entrar, normalmente tampoco lo miden dentro:
suele venir acompañado de carrera técnica poco definida, promoción por antigüedad
más que por competencia, y compañeros de nivel muy desigual. Y el filtro que
sustituye a la prueba es el currículum, lo que penaliza a quien tiene buen nivel y
poca trayectoria formal — justo al revés que una prueba técnica bien hecha, que es
el mecanismo más meritocrático que existe para alguien sin contactos ni marca.

**La consecuencia práctica**, que es lo que importa: si vas a un proceso sin prueba
de código, **preparar katas no te suma casi nada**. Lo que suma es tener tres o
cuatro proyectos que sepas contar con detalle —qué problema, qué decidiste, qué
salió mal—, el currículum ajustado a las palabras exactas de la oferta, el inglés
listo, y buenas preguntas propias: para qué cliente es, cuánto dura el proyecto, qué
pasa cuando termina, quién es tu responsable técnico.

### 11.3 Anatomía de una oferta: qué leer y qué significa

Lo que aparece en un anuncio y lo que revela:

| Lo que dice | Lo que suele significar |
| --- | --- |
| Nombra al **cliente final** o dice "proyecto para cliente" | Consultoría o servicios: no es producto propio |
| Publica **banda salarial** | Empresa de producto o internacional; a partir de 2026 debería ser lo normal (ver 11.5) |
| **Stack muy largo** (10+ tecnologías) | O es una consultora que cubre varios proyectos, o el equipo es muy pequeño |
| **Stack corto y específico** con versiones | Equipo con criterio técnico y decisiones tomadas |
| Enlaza **repositorio, blog de ingeniería o handbook** | Cultura técnica real; además te da material para preparar |
| Detalla **el proceso de selección** | Señal excelente: respeta tu tiempo. Lo hacen Factorial, Wallapop, SeQura, Glovo y Minsait |
| Pide **titulación obligatoria** | Corporación, banca o administración |
| "Ambiente joven y dinámico", "somos una familia" | Sin información. A veces sustituye a las condiciones |
| **Años de experiencia mayores que la edad de la tecnología** | El anuncio lo ha escrito quien no conoce el puesto |
| No dice **modalidad de trabajo** ni ubicación exacta | Se sabrá al final del proceso, y no suele ser a tu favor |

Un contraste que se ve muy bien entre las empresas estudiadas: los anuncios de
Factorial y Wallapop enumeran las fases del proceso, el stack concreto y —en el caso
de Factorial— la banda salarial. Los de las consultoras que aparecen en los mismos
portales rara vez dicen para qué cliente es, cuánto dura el proyecto o cuánto pagan.

### 11.4 Tipos de contrato en España, 2026

La reforma laboral de 2022 cambió el mapa y todavía hay ofertas que usan
nomenclatura antigua:

- **Indefinido.** Es la norma general. Puede ser ordinario, a tiempo parcial o fijo
  discontinuo.
- **Fijo discontinuo.** *No es un contrato temporal*: es una modalidad de indefinido
  para actividad intermitente. En consultoría se usa para trabajo por contratas.
- **Temporal.** Solo se justifica por circunstancias de la producción o por
  sustitución. Encadenar más de 18 meses en un periodo de 24 convierte el contrato
  en indefinido de forma automática.
- **Formativo.** Dos modalidades: en alternancia y para la obtención de la práctica
  profesional. Es la vía de entrada habitual de perfiles junior.
- **El contrato por obra y servicio ya no existe.** Si una oferta de 2026 lo
  menciona, la plantilla del anuncio tiene cuatro años.
- **Freelance / autónomo.** No es contrato laboral. Cambia la fiscalidad, la
  cotización y la protección; las tarifas de referencia rondan los 22-35 €/hora para
  perfiles junior y los 50 €/hora de media para desarrollo de aplicaciones, con la
  advertencia de que entre el 30 % y el 40 % de lo facturado se va en cuota, IRPF,
  formación, herramientas y semanas sin proyecto.

### 11.5 El cambio de 2026: transparencia salarial

La **Directiva (UE) 2023/970** tenía como fecha límite de transposición el **7 de
junio de 2026**. Obliga a informar del salario o de la banda salarial **antes de la
primera entrevista** y **prohíbe preguntar cuánto cobrabas en tu empleo anterior**.
También reconoce el derecho a conocer lo que cobran compañeros en puestos de igual
valor.

En el momento de esta investigación **España no había completado la transposición**,
así que en la práctica conviven ofertas con banda publicada y ofertas sin ella. Dos
consecuencias prácticas para quien busca trabajo:

- Preguntar la banda salarial en la primera llamada no solo es legítimo: es la
  dirección en la que va la norma.
- La pregunta "¿cuánto cobras ahora?" es exactamente la práctica que la directiva
  pretende eliminar, porque perpetúa las diferencias de partida.

### 11.6 Modalidad de trabajo: lo que dicen las empresas estudiadas

Cifras concretas, no impresiones:

| Empresa | Modalidad declarada |
| --- | --- |
| GitLab, Automattic | 100 % remoto, con proceso también asíncrono |
| Holded | Tres días en remoto y dos en oficina; ayuda de 30 €/mes en remoto y 15 €/mes en híbrido |
| Wallapop | Híbrido con **mínimo seis días de oficina al mes**, y cada equipo se organiza el resto |
| Factorial | Oficina primero, con un 20 % de flexibilidad remota |
| SEAT:CODE | Oficinas en Barcelona pero contratan en toda España, con modelo remoto estructurado |
| SeQura | Mezcla: algunas vacantes híbridas y otras en remoto, indicado por oferta |

El patrón: **el remoto total se ha replegado a las empresas que ya nacieron
remotas**. En Barcelona lo habitual en 2026 es híbrido con un mínimo de presencia
declarado en la propia oferta — y ese mínimo es información que conviene leer antes
de empezar el proceso, no después.

### 11.7 El sesgo de este registro, dicho en voz alta

De las 31 fichas de la plataforma, **27 tienen prueba de código, 3 dependen del
equipo o del nivel, y solo 1 no la tiene**.

Esa proporción **no describe el mercado**: lo invierte. Es consecuencia directa de
cómo se hizo la investigación — se buscaron empresas con proceso documentado, y las
que documentan su proceso son precisamente las que tienen uno elaborado. Una
consultora que decide con una conversación de cuarenta minutos no publica un
handbook explicando cómo lo hace.

Se deja constancia por dos motivos. Primero, porque es la clase de sesgo que
convierte una investigación en propaganda si no se declara. Y segundo, porque tiene
una consecuencia útil: si estás buscando trabajo y solo miras empresas con proceso
técnico elaborado, estás mirando una fracción pequeña de las ofertas que existen.

### 11.8 Cómo prepararse según el tipo de oferta

El resumen práctico de todo el capítulo:

| Si vas a… | Dedica el tiempo a… | No lo dediques a… |
| --- | --- | --- |
| Consultora o corporación | Contar tus proyectos con detalle, inglés, currículum ajustado a la oferta, certificaciones | Katas y algoritmos |
| Startup o scale-up nacional | Una entrega pequeña y bien acabada, con tests, y **saber defenderla entera** | Añadir funcionalidad extra a la entrega |
| Scale-up internacional | Diseño de sistemas, depuración sobre código ajeno, comunicación en inglés | Memorizar sintaxis |
| Big Tech | Algoritmos, complejidad, system design y narrar en voz alta | Preparar un portafolio bonito |
| Freelance | Referencias, portafolio verificable y saber presupuestar | Prepararte una entrevista técnica que no va a haber |

Y una recomendación que vale para todos los casos, porque es la que más veces se
repite en las fuentes: **guarda todas las pruebas técnicas que hagas**. Wallapop
acepta explícitamente una entrega anterior en lugar de una nueva, y en cualquier
proceso sin prueba de código, un repositorio tuyo bien explicado es la única señal
técnica objetiva que puedes aportar por iniciativa propia.

### 11.9 Fuentes de este capítulo

#### Clasificación del mercado y salarios

- [La distribución hexamodal de los salarios tech en España — Manfred](https://www.getmanfred.com/en/blog/la-distribucion-hexamodal-de-los-salarios-tech-en-espana)
- [Entendiendo los salarios en tecnología en España — Manfred](https://www.getmanfred.com/en/blog/los-triple-naturaleza-del-salario-tech-en-espana)
- [Guía Salarial 2026 — Manfred](https://www.getmanfred.com/en/blog/guia-salarial-2026-salarios-en-tecnologia-espana-manfred)
- [Tarifas de programador freelance en España 2026](https://tarifaautonomo.com/blog/tarifa-hora-programador-espana)

#### Procesos sin prueba de código

- [Minsait — Proceso de selección](https://www.minsait.com/es/talento/proceso-seleccion)
- [Indra — Proceso de selección](https://careers.indragroup.com/content/Proceso-de-Seleccion_ES/?locale=es_ES)
- [Minsait — entrevistas relatadas por candidatos (Glassdoor)](https://www.glassdoor.com/Interview/Minsait-Interview-Questions-E1201389.htm)
- [Indra — entrevistas relatadas por candidatos (Glassdoor)](https://www.glassdoor.com/Interview/Indra-Interview-Questions-E9757.htm)
- [Qué es una "cárnica" o empresa multiservicios](https://laboro-spain.blogspot.com/2018/05/empresas-multiservicios-ilegales.html)
- [Pruebas técnicas en procesos de selección — Leonardo Poza](https://leonardopoza.substack.com/p/pruebas-tecnicas-procesos-seleccion)
- [Software jobs without coding tests — Arbeitnow](https://www.arbeitnow.com/hiring-without-whiteboard)

#### Marco legal

- [Artículo 14 del Estatuto de los Trabajadores — periodo de prueba](https://www.iberley.es/legislacion/articulo-14-estatuto-trabajadores)
- [Tipos de contrato tras la reforma laboral — Sage](https://www.sage.com/es-es/blog/modalidades-y-tipos-de-contrato-de-trabajo-que-quedan-en-vigor/)
- [Directiva (UE) 2023/970 de transparencia salarial: calendario](https://www.coverflex.com/es/blog/transparencia-salarial-calendario)
- [Transparencia salarial 2026: qué cambia](https://leynverabogados.es/transparencia-salarial-2026-que-cambia-con-la-directiva-2023-970-y-que-debe-hacer-tu-empresa/)

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

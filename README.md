# TechTrack

Plataforma para aprender programación resolviendo **pruebas técnicas reales de
empresa**, con corrección automática y explicaciones que nunca son solo código.

> Aprender → Practicar → Equivocarse → Entender → Corregir → Prepararse para una empresa

## Empezar

Abre `index.html`. No hay build, no hay dependencias, no hace falta servidor.

```text
index.html          Panel de inicio: estado, recomendación, áreas y empresas
catalogo.html       Todas las pruebas, con filtros
empresas.html       Fichas de empresa: proceso, qué evalúan y fuentes
rutas.html          Rutas de aprendizaje (Frontend, Backend, IA, Proceso)
progreso.html       Seguimiento, puntos fuertes y débiles, nivel estimado
laboratorios.html   Los laboratorios interactivos
```

## Qué hay dentro

**23 pruebas completas** con los 26 bloques del contrato (contexto de empresa,
requisitos, pistas progresivas, tests, solución explicada, alternativas, errores
frecuentes, seguridad, rendimiento, rúbrica y refuerzo), **más tres bloques
propios**: documentación que hace cada prueba autosuficiente (9 000–19 000
caracteres de material por ejercicio), la construcción **por fases con el archivo
completo en cada punto** en 10 de ellas, y el **vínculo con la empresa** que usa
una prueba así.
**19 se corrigen solas** con 172 aserciones ejecutadas en un sandbox aislado;
las 4 restantes se evalúan con la rúbrica que usaría el equipo que te entrevista.

**31 fichas de empresa** con su proceso técnico fase a fase, qué intenta comprobar
cada ronda, qué pruebas de la plataforma se le parecen y **sus fuentes enlazadas**.
Dieciséis publican su proceso; las otras quince están reconstruidas a partir de
testimonios públicos y la ficha lo dice antes que nada.

Cada ficha responde además a una pregunta que ninguna guía de entrevistas suele
contestar: **¿hay prueba de código?** Sí, no, o depende del equipo y del nivel. Es
un filtro propio en la página de Empresas, porque saber que un proceso *no* la
tiene te ahorra semanas de preparación equivocada.

**7 laboratorios interactivos** heredados del proyecto original, ahora integrados
en el sistema visual y enlazados desde las rutas: fundamentos, algoritmos
visualizados, DOM, asincronía, scope y closures, TypeScript y el buscador de
métodos.

Cubre los cuatro niveles, desde ejercicios guiados de un solo método hasta
problemas abiertos de nivel senior: frontend, JavaScript a fondo, backend, APIs,
bases de datos y rendimiento, testing, debugging, refactorización, seguridad,
revisión de código, system design, IA aplicada (salidas estructuradas, RAG, MCP)
y agentes (guardrails, control de coste, depuración de agentes, evals).

### Foco en Barcelona

**Once de las fichas son de empresas con equipo de ingeniería en Barcelona** —
Glovo, Factorial, Wallapop, Holded, SeQura, SEAT:CODE, TravelPerk, Typeform,
Adevinta Spain, eDreams ODIGEO y CaixaBank Tech—, más Cabify en Madrid, con lo que
piden en sus ofertas y cómo es su prueba.

De ese trabajo salió el hallazgo que más cambia la forma de prepararse aquí: en
Barcelona **el take-home casi nunca es el final del proceso, es el material de la
ronda siguiente**. SeQura lo llama *live peer review of your own code*, Holded
avisa de que tendrás que defender cada decisión de arquitectura, y Cabify y
Wallapop hacen lo mismo con otro nombre. Entregar algo grande que no controlas es
peor que entregar algo pequeño que puedes defender línea a línea.

Dos empresas de Barcelona publican el **enunciado** de su prueba, no solo el
formato: [Holded lo tiene entero en GitHub](https://github.com/holdedhub/careers)
junto con su stack, y el de SeQura circula en repositorios de candidatos que
coinciden entre sí. Las dos pruebas nuevas del catálogo salen de ahí.

El análisis completo —empresas, pruebas, requisitos por puesto y salarios
publicados— está en
[`docs/INVESTIGACION.md`, capítulo 10](docs/INVESTIGACION.md).

### El mercado del que nadie escribe

El capítulo 11 corrige un sesgo de todo lo anterior: **la mayor parte del empleo de
desarrollo en España no tiene prueba técnica**. Consultoras, empresas de servicios y
departamentos de IT de grandes corporaciones deciden con una conversación técnica,
el currículum y una entrevista con el cliente final — y trasladan la evaluación real
al periodo de prueba, que el Estatuto de los Trabajadores permite alargar hasta seis
meses para técnicos titulados.

Minsait es el caso mejor documentado porque publica su proceso, y en él se lee algo
que conviene saber antes de estudiar: las pruebas técnicas son **solo para perfiles
con menos de dos años de experiencia**. Por encima de eso, no escribes código en
ningún momento.

De las 31 fichas de esta plataforma, 27 tienen prueba de código. Esa proporción
**invierte la del mercado real**: es consecuencia de haber buscado empresas con
proceso documentado, y las que documentan su proceso son justo las que tienen uno
elaborado. Está dicho también en el capítulo 11, porque un sesgo que no se declara
convierte una investigación en propaganda.

Ahí están además los tipos de contrato vigentes tras la reforma de 2022, la
transparencia salarial que la Directiva (UE) 2023/970 debía traer en junio de 2026,
qué modalidad de trabajo declara cada empresa, y una tabla de en qué invertir el
tiempo de preparación según a qué tipo de empresa te presentas.

## Prueba documentada, prueba inspirada

Es la regla que gobierna toda la sección de empresas:

> Nunca presentamos como prueba oficial algo que no podamos demostrar.

Cada prueba lleva una de estas dos etiquetas, visible en la tarjeta, en la
cabecera y en la simulación:

- **Prueba documentada** — hay evidencia pública de que la empresa usa una prueba
  **de ese tipo**, con su fuente enlazada. El enunciado sigue siendo original.
- **Prueba inspirada en su proceso** — no afirmamos que sea su prueba: está
  construida a partir de su pila, el puesto y lo que se conoce de su proceso.

No es solo una convención de redacción. `registry.js` **degrada automáticamente a
"inspirada"** cualquier prueba que se declare documentada sin fuente, y
`tools/verificar.js` falla el build si una empresa no tiene ninguna fuente con URL.
Ningún enunciado es copia del de nadie: lo que se reproduce es el **formato**, que
es justamente lo que está documentado.

## Simular prueba de empresa

Cualquier prueba vinculada a una empresa se puede hacer en **modo simulación**
(`prueba.html?id=…&sim=1`, o el botón del lateral). Entonces la página muestra
empresa, puesto, nivel, tiempo recomendado, formato y dificultad, arranca una
cuenta atrás y **oculta la documentación, las pistas, la solución y el análisis**:
solo quedan el enunciado, los requisitos, el editor y los casos de prueba.

Al terminar —o cuando quieras— el botón **"He terminado · ver solución explicada"**
abre la resolución completa paso a paso. El reloj sigue contando en negativo al
llegar a cero en lugar de expulsarte: lo interesante no es que te corten, es saber
cuánto te pasaste.

## Cómo funciona una prueba

1. **Enunciado** — una situación real de empresa, no un ejercicio de libro.
2. **Documentación** — todo lo que necesitas saber para resolverla: conceptos con
   ejemplos, referencia de sintaxis, un caso análogo resuelto, glosario y una
   autocomprobación previa. **La prueba es autosuficiente: no tienes que buscar
   nada fuera.** Y no es la solución: el ejemplo resuelve un problema distinto con
   la misma técnica. Trece pruebas cierran esa pestaña con **vídeos de apoyo**
   (30 enlaces comprobados, en español o inglés, cada uno con una línea de por qué
   sirve para *esa* prueba): son el plan B de quien prefiere que se lo cuenten en
   voz alta, nunca un sustituto de la documentación propia.
3. **Resolver** — editor con pistas progresivas que se van revelando.
4. **Tests** — se ejecutan en un `iframe` aislado con límite de tiempo.
5. **Solución** — accesible cuando quieras, pero se registra: verla antes de
   aprobar limita la puntuación al 60 %, porque el nivel estimado solo vale si
   refleja lo que resuelves por tu cuenta. Varias pruebas la presentan **por
   fases, con el archivo completo en cada una**, para que nunca haya duda de
   dónde va cada línea.
6. **Análisis** — qué hacemos, por qué, cómo funciona, qué alternativas hay y qué
   errores evitar.

El progreso se guarda en el navegador y se puede exportar desde `progreso.html`.

## Añadir contenido

```js
// content/exercises/mi-area.js
(function (TT) {
  TT.defineExercise({
    id: 'mi-prueba',
    title: '…',
    // …los 26 bloques
  });
})(window.TT);
```

Después añade el archivo a `content/manifest.js` y verifica:

```bash
node tools/verificar.js       # contenido: contrato, docs, fases, empresas y tests
node tools/generar-indice.js  # regenera el índice ligero
node tools/humo.js            # ejecuta el JavaScript de cada página
node tools/e2e.js             # opcional: Chrome real (laboratorios e interacción)
```

El verificador comprueba la estructura de cada prueba, que la documentación esté
completa (y que su ejemplo no sea la solución del ejercicio), que **la última
fase coincida exactamente con la solución** y que ninguna fase sea un fragmento,
que las rúbricas sumen 100, que las rutas no apunten a contenido inexistente y
**ejecuta cada solución de referencia contra sus propios tests**.

Y, en la parte de empresas: que **toda ficha tenga al menos una fuente con URL**,
que ninguna marcada como "proceso publicado" carezca de fuente oficial o de
ingeniería, que cada prueba vinculada declare su evidencia, su nota de autoría y
su fuente, y que el rol, el formato, la dificultad y las empresas referenciadas
existan de verdad en el registro.

El núcleo no conoce ningún ejercicio: todo el contenido se auto-registra.

Al terminar, regenera el índice ligero (ver siguiente sección) para que el
ejercicio nuevo aparezca en el catálogo, las rutas y la búsqueda:

```bash
node tools/generar-indice.js
```

## Carga ligera para las páginas de listado

`prueba.html` necesita la solución, la documentación y las fases de una
prueba: eso es lo que carga `TT.boot()`. Pero el catálogo, las rutas, el
inicio y el progreso solo necesitan id, título, categoría, nivel y los textos
cortos que alimentan la búsqueda — cargar ahí el contenido completo baja
cientos de KB que nunca se usan.

Esas cuatro páginas llaman en su lugar a `TT.boot('', { liviano: true })`,
que carga `content/indice.js` en vez de `content/manifest.js`. Ese archivo
se genera con `tools/generar-indice.js` a partir de `content/exercises/`:

```bash
node tools/generar-indice.js          # regenera content/indice.js
node tools/generar-indice.js --check  # falla si está desactualizado
```

La integración continua ejecuta `--check` en cada push: si editas un
ejercicio y olvidas regenerar el índice, el build falla en vez de dejar el
catálogo desincronizado en silencio.

## Documentación

- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) — estructura, decisiones y cómo extenderla.
- [`docs/INVESTIGACION.md`](docs/INVESTIGACION.md) — cómo son las pruebas técnicas en 2026 y de dónde sale el contenido.

## Nota

Todo el contenido es original. Las referencias del sector se han analizado como
metodología —qué evalúan las empresas, cómo estructuran los enunciados, qué
errores se repiten— y ninguna se ha copiado.

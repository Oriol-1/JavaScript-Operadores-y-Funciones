# TechTrack

Plataforma para aprender programación resolviendo **pruebas técnicas reales de
empresa**, con corrección automática y explicaciones que nunca son solo código.

> Aprender → Practicar → Equivocarse → Entender → Corregir → Prepararse para una empresa

## Empezar

Abre `index.html`. No hay build, no hay dependencias, no hace falta servidor.

```text
index.html          Panel de inicio: estado, recomendación y áreas
catalogo.html       Todas las pruebas, con filtros
rutas.html          Rutas de aprendizaje (Frontend, Backend, IA, Proceso)
progreso.html       Seguimiento, puntos fuertes y débiles, nivel estimado
laboratorios.html   Los laboratorios interactivos
```

## Qué hay dentro

**19 pruebas completas** con los 26 bloques del contrato (contexto de empresa,
requisitos, pistas progresivas, tests, solución explicada, alternativas, errores
frecuentes, seguridad, rendimiento, rúbrica y refuerzo), **más dos bloques
propios**: documentación que hace cada prueba autosuficiente (9 000–19 000
caracteres de material por ejercicio) y, en 6 de ellas, la construcción **por
fases con el archivo completo en cada punto**.
**16 se corrigen solas** con 130 aserciones ejecutadas en un sandbox aislado;
las 3 pruebas de empresa se evalúan con la rúbrica que usaría el equipo que te
entrevista.

**7 laboratorios interactivos** heredados del proyecto original, ahora integrados
en el sistema visual y enlazados desde las rutas: fundamentos, algoritmos
visualizados, DOM, asincronía, scope y closures, TypeScript y el buscador de
métodos.

Cubre los cuatro niveles, desde ejercicios guiados de un solo método hasta
problemas abiertos de nivel senior: frontend, JavaScript a fondo, backend, APIs,
bases de datos y rendimiento, testing, debugging, refactorización, seguridad,
revisión de código, system design, IA aplicada (salidas estructuradas, RAG, MCP)
y agentes (guardrails, control de coste, depuración de agentes, evals).

## Cómo funciona una prueba

1. **Enunciado** — una situación real de empresa, no un ejercicio de libro.
2. **Documentación** — todo lo que necesitas saber para resolverla: conceptos con
   ejemplos, referencia de sintaxis, un caso análogo resuelto, glosario y una
   autocomprobación previa. **La prueba es autosuficiente: no tienes que buscar
   nada fuera.** Y no es la solución: el ejemplo resuelve un problema distinto con
   la misma técnica.
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
node tools/verificar.js
```

El verificador comprueba la estructura de cada prueba, que la documentación esté
completa (y que su ejemplo no sea la solución del ejercicio), que **la última
fase coincida exactamente con la solución** y que ninguna fase sea un fragmento,
que las rúbricas sumen 100, que las rutas no apunten a contenido inexistente y
**ejecuta cada solución de referencia contra sus propios tests**.

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

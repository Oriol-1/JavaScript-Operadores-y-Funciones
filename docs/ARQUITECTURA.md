# Arquitectura de TechTrack

## 1. De dónde venimos

El proyecto original eran ocho archivos HTML independientes (`index`, `fundamentos`,
`algoritmos`, `dom_lab`, `async_lab`, `scope_lab`, `ts_lab`, `buscador`), unos 230 KB
de código, cada uno con su CSS y su JavaScript embebidos.

**Lo que estaba bien y se conserva:**

- Los laboratorios funcionan y enseñan de verdad. La visualización paso a paso de
  `algoritmos.html` y la de ámbitos de `scope_lab.html` son mejores que las de
  muchas plataformas comerciales.
- No hay build ni dependencias: se abre con doble clic y funciona. Esa propiedad
  es valiosa y se ha mantenido como restricción de diseño.
- La convención de nombres de variables CSS era coherente entre archivos
  (`--bg-primary`, `--bg-secondary`, `--accent`, `--highlight`, `--text`).
  Eso ha permitido rearmonizar todo el proyecto sin reescribir ni un laboratorio.

**Deuda técnica detectada:**

| Problema | Consecuencia |
| --- | --- |
| CSS duplicado en cada archivo | Cambiar un color obligaba a editar ocho archivos |
| Datos de lecciones incrustados en el JavaScript de cada página | Añadir contenido implicaba tocar la lógica |
| Sin persistencia | Cerrar el navegador borraba todo rastro de progreso |
| Sin ejecución aislada | El código del usuario compartía ámbito con la página |
| Sin modelo de contenido | Cada laboratorio inventaba su propia estructura |
| Paleta de proyecto escolar | Degradado morado, rojo `#e94560`, emojis como iconografía principal |
| Sin escalabilidad | Añadir una categoría nueva significaba crear otro HTML completo |

## 2. Restricciones de diseño

1. **Debe seguir funcionando con `file://`.** Es la propiedad más valiosa del
   proyecto original. Esto descarta los módulos ES (`import`/`export`), que fallan
   por CORS al abrir un archivo local. Se usan scripts clásicos con un espacio de
   nombres global (`TT`) y carga dinámica por inyección de `<script>`.
2. **Sin build ni dependencias.** Todo se abre y se edita directamente.
3. **El núcleo no conoce el contenido.** Añadir pruebas no debe tocar la aplicación.
4. **Nada de lo que ya funcionaba puede romperse.**

## 3. Estructura

```text
index.html            Panel de inicio: estado, recomendación, rutas, áreas
catalogo.html         Explorador de pruebas con filtros en la URL
prueba.html           Runner: enunciado, resolución, solución y análisis
rutas.html            Rutas de aprendizaje con estado por paso
progreso.html         Seguimiento, puntos fuertes y débiles, exportación
laboratorios.html     Índice de los laboratorios interactivos

fundamentos.html      ─┐
algoritmos.html        │
dom_lab.html           ├─ Laboratorios originales, rearmonizados
async_lab.html         │   (sin cambios de marcado ni de lógica)
scope_lab.html         │
ts_lab.html            │
buscador.html         ─┘

assets/css/theme.css      Tokens: color, tipografía, espaciado, forma
assets/css/app.css        Componentes de la plataforma
assets/css/lab-skin.css   Capa de armonización de los laboratorios

assets/js/core/registry.js  Registro y consulta de contenido
assets/js/core/store.js     Progreso, analítica y recomendación
assets/js/core/sandbox.js   Ejecución aislada de código de usuario
assets/js/core/ui.js        Navegación, tema, formateo y componentes
assets/js/pages/*.js        Un archivo por página
assets/js/lab-nav.js        Barra inyectada en los laboratorios

content/manifest.js         Qué se carga (único punto de registro)
content/taxonomy.js         Categorías y tipos de prueba
content/paths.js            Rutas de aprendizaje
content/exercises/*.js      Pruebas, agrupadas por área

tools/verificar.js          Suite de verificación del contenido
docs/                       Esta documentación y la investigación
```

## 4. Cómo se carga todo

```text
página.html
   ↓ registry.js, store.js, sandbox.js, ui.js   (núcleo, orden fijo)
   ↓ pages/página.js
        TT.boot()
           ↓ inyecta content/manifest.js
           ↓ inyecta cada archivo del manifiesto, en orden
                cada uno llama a TT.defineExercise / definePath / defineCategory
           ↓ resuelve
        render()
```

La carga es secuencial a propósito: `taxonomy.js` debe existir antes que los
ejercicios que referencian sus categorías. El coste es despreciable con contenido
local y evita toda una clase de errores de orden.

## 5. Entidades

### Prueba (`exercise`)

Es el contrato central. Los 26 bloques de la especificación, más dos añadidos
(`docs` y `fases`), se agrupan así:

| Bloques | Campos |
| --- | --- |
| 1-3 Identidad | `id`, `title`, `category`, `level`, `kind` |
| 4-6 Planteamiento | `context`, `situation`, `goal` |
| 7-9 Alcance | `tech`, `skills`, `time` |
| 10-12 Material | `starter`, `requirements`, `optional` |
| 13-15 Resolución | `hints`, `tests`, control de desbloqueo de la solución |
| 16-19 Solución | `solution`, `walkthrough`, `rationale`, `alternatives` |
| 20-23 Calidad | `commonErrors`, `bestPractices`, `security`, `performance` |
| 24-26 Evaluación | `companyLooksFor`, `scoring`, `reinforce` |
| + Estudio | `docs` (ver abajo) |
| + Construcción | `fases` (ver abajo) |

### El bloque `docs`: la prueba es autosuficiente

Añadido sobre los 26 originales. La regla que lo define: **quien lea `docs` debe
poder resolver el ejercicio sin buscar nada fuera y sin ver la solución.** No es
un resumen de la solución; es el conocimiento previo que la solución da por sabido.

```js
docs: {
  resumen:    'Qué hay que entender, en dos o tres líneas.',
  conceptos:  [{ titulo, texto, codigo? }],   // la teoría, mínimo 3
  referencia: [{ nombre, texto }],            // API y sintaxis a mano
  ejemplo:    { titulo, codigo, texto },      // caso resuelto ANÁLOGO
  glosario:   [{ termino, definicion }],
  preparado:  [string]                        // autocomprobación previa
}
```

Se renderiza como una pestaña propia entre *Enunciado* y *Resolver*, para que el
orden natural sea leer, entender y después intentarlo.

Dos restricciones que `tools/verificar.js` comprueba y que existen por un motivo:

- **Mínimo 3 conceptos.** Un bloque con uno solo no hace autosuficiente nada.
- **El ejemplo no puede ser la solución del ejercicio.** Debe resolver un problema
  *análogo* con la misma técnica. Si fuera el mismo, la documentación se
  convertiría en un atajo y el ejercicio dejaría de tener sentido.

Actualmente cada prueba tiene entre 9 000 y 19 000 caracteres de material.

### El bloque `fases`: el archivo completo en cada punto

La explicación paso a paso puede darse de dos formas, y basta con una:
`walkthrough` (qué / por qué / cómo sobre la solución terminada) o `fases`
(la construcción incremental). Exigir ambas produciría contenido duplicado.

**Regla innegociable de `fases`: el campo `codigo` es el archivo ENTERO tal como
queda al terminar esa fase, nunca un fragmento.** El motivo es eliminar la
ambigüedad de "¿dónde va este trozo?": si ves el archivo completo en cada punto,
la posición no se interpreta, se lee. Cada fase se puede copiar y ejecutar.

```js
fases: [{
  titulo:      'Fase 2 — Lista blanca de campos',
  objetivo:    'Qué se consigue al terminar esta fase.',
  codigo:      '/* EL ARCHIVO COMPLETO en este punto */',
  explicacion: 'Qué cambia respecto a la fase anterior y por qué.',
  anadido:     ['resumen de lo nuevo'],        // opcional
  comprueba:   'Qué tests deberían pasar ya.'  // opcional
}]
```

Dos invariantes que `tools/verificar.js` comprueba:

- **La última fase debe coincidir exactamente con `solution.code`.** Así es
  imposible que las fases y la solución se desincronicen al editar una de las dos.
- **Toda fase contiene la función principal** (la última declaración de nivel
  superior de la solución). Es un detector estructural de fragmentos pegados por
  error: los auxiliares pueden aparecer solo en fases avanzadas, pero la función
  que da nombre al ejercicio está en todas.

Mínimo 3 fases. Se renderizan en la pestaña *Solución*, antes de la solución final.

`registry.js` valida los campos obligatorios al registrar y avisa por consola si
falta alguno. `tools/verificar.js` lo comprueba de forma exhaustiva, además de
ejecutar cada solución de referencia contra sus propios tests.

`walkthrough` no es una lista de texto: cada paso es `{ what, why, how }`. Esa
forma es la que garantiza que ninguna solución sea solo código, que era el
requisito explícito del proyecto.

### Ruta (`path`)

Secuencia de pasos. Cada paso apunta a un laboratorio (`lab`), a una prueba
(`exercise`) o a ninguno (hito conceptual pendiente de contenido). El progreso de
la ruta solo cuenta pasos con prueba superada.

### Intento (`attempt`)

Lo que se persiste por prueba: estado, puntuación, tiempo, pistas usadas, si se
consultó la solución, resultado de los tests y el código escrito.

## 6. Decisiones y su porqué

### Scripts clásicos en lugar de módulos ES

**Qué:** un espacio de nombres global `TT` y carga por inyección de `<script>`.
**Por qué:** los módulos ES no funcionan con `file://`. Sacrificar la propiedad de
"abrir con doble clic" habría obligado a levantar un servidor para estudiar, que
es exactamente la fricción que hace que una herramienta de estudio no se use.
**Coste:** sin árbol de dependencias explícito ni *tree shaking*. Irrelevante con
este volumen de código.

### Contenido como plugins auto-registrados

**Qué:** cada archivo de `content/` se registra a sí mismo; `manifest.js` es la
única lista.
**Por qué:** era un requisito directo — añadir categorías, tecnologías o pruebas
sin tocar el núcleo. Añadir un área nueva son dos pasos: crear el archivo y añadir
una línea al manifiesto.
**Alternativa descartada:** JSON cargado por `fetch`. Falla con `file://` por CORS
y no permite escribir código de tests con comodidad.

### Ejecución en `iframe` con `sandbox="allow-scripts"`

**Qué:** el código del usuario y sus tests se ejecutan en un iframe con origen
opaco; la comunicación es por `postMessage` y un temporizador del padre destruye
el iframe si no responde.
**Por qué:** el código de un ejercicio puede tener un bucle infinito, manipular el
DOM de la plataforma o vaciar el `localStorage` con el progreso. Sin
`allow-same-origin`, el iframe no puede leer nuestro DOM, ni nuestras cookies, ni
nuestro almacenamiento.
**Detalle importante:** el código de preparación, el del usuario y el bucle de
aserciones se concatenan **dentro de la misma función**, y cada caso se evalúa con
`eval` directo. Así los tests ven las funciones que el usuario acaba de declarar
sin obligarle a exportar nada. El harness devuelve una promesa, de modo que un
caso puede ser asíncrono sin sintaxis especial.
**Límite conocido:** no es un aislamiento a prueba de código hostil, sino
protección frente a errores. Para código no confiable de terceros haría falta un
Web Worker con límites de CPU o ejecución en servidor.

### Progreso en `localStorage` detrás de una fachada

**Qué:** todo el acceso pasa por `TT.store`; solo `read()` y `write()` tocan el
almacenamiento.
**Por qué:** mover el progreso a una API remota es sustituir dos funciones. La
analítica (puntos fuertes, débiles, nivel estimado, recomendación) se calcula al
vuelo a partir de hechos, no se persiste: así un cambio en las reglas no obliga a
migrar los datos guardados.
**Coste asumido:** el progreso vive en un solo navegador. Por eso existe
exportación e importación en `progreso.html`.

### Armonización de los laboratorios en vez de reescritura

**Qué:** dos etiquetas `<link>` y un `<script>` antes de `</head>` de cada
laboratorio, más un atributo `data-lab` en el `<html>`.
**Por qué:** los siete laboratorios usaban los mismos nombres de variables CSS.
Como el `<link>` va después del `<style>` embebido, redefinir esas variables
reestiliza el archivo entero sin tocar una línea de su marcado ni de su lógica.
Reescribir 230 KB de código que funciona para cambiar colores habría sido el peor
uso posible del esfuerzo y una fuente segura de regresiones.
**Excepción:** `fundamentos.html` no usaba las variables compartidas (tenía un
degradado morado y superficies claras), así que necesita su propio bloque de
sobrescrituras, aislado por `[data-lab="fundamentos"]`.
**Detalle:** tres laboratorios usan `body { display: flex }` horizontal. Insertar
la barra como hijo del `body` habría roto su maquetación, así que la barra es
`position: fixed` y el `body` recibe `padding-top`.

## 7. Cómo se extiende

### Añadir una prueba

1. Crea o abre un archivo en `content/exercises/`.
2. Llama a `TT.defineExercise({ ... })` con los 26 bloques.
3. Si el archivo es nuevo, añádelo a `content/manifest.js`.
4. Ejecuta `node tools/verificar.js`.

### Añadir un área o un tipo de prueba

Un objeto más en `content/taxonomy.js`. Los filtros del catálogo, las insignias y
el desglose de progreso se actualizan solos: todo se deriva del registro.

### Añadir una ruta

Un `TT.definePath({ ... })` en `content/paths.js`. Los pasos pueden apuntar a
laboratorios, a pruebas o quedar como hitos pendientes.

### Añadir un lenguaje o tecnología

`tech` es una lista libre de cadenas. Aparecen automáticamente en las insignias y
en el índice de tecnologías. Para tests automáticos hoy solo se ejecuta
JavaScript; una prueba de Python o Java se plantea con `mode: 'checklist'` y se
evalúa con rúbrica, que es exactamente como se corrige en una empresa cuando no
hay ejecución automática.

**Filosofía de RealWorld aplicada:** una misma prueba puede definir su contrato
en `requirements` y `scoring` de forma independiente de la tecnología. `emp-system-design`
y `emp-frontend-challenge` ya funcionan así: evalúan criterio, no sintaxis, y se
pueden resolver con React, Vue o Angular sin cambiar la rúbrica.

## 8. Versionado del contenido

Cada prueba lleva `version` (por defecto 1). Cuando una prueba cambia de forma que
invalida intentos anteriores (cambian los tests o los requisitos), se incrementa.
Los intentos guardados registran la fecha, de modo que el progreso puede
distinguirse por versión si en el futuro hace falta.

## 9. Qué queda pendiente

- Editor con resaltado de sintaxis en el runner (hoy es un `textarea` con soporte
  de tabulador; Monaco ya se usa en los laboratorios y podría reutilizarse).
- Tests automáticos para lenguajes distintos de JavaScript.
- Vista previa visual para las pruebas de frontend (`TT.renderPreview` ya existe
  en `sandbox.js`, falta el ejercicio que la use).
- Más pruebas: el catálogo tiene 17 completas. Quedan sin contenido las categorías
  de Git y GitHub, Arquitectura y Automatizaciones, además de multiagente y
  observabilidad dentro de IA. Añadirlas no requiere tocar el núcleo.
- Retrofit de `fases` a las 11 pruebas anteriores, que hoy usan `walkthrough`.

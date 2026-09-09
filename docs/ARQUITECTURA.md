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
index.html            Panel de inicio: estado, recomendación, rutas, áreas, empresas
catalogo.html         Explorador de pruebas con filtros en la URL
empresas.html         Listado de empresas y ficha de proceso de selección
prueba.html           Runner: enunciado, resolución, solución y análisis
                      (+ modo simulación con ?sim=1)
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

content/manifest.js         Qué se carga en prueba.html (contenido completo)
content/indice.js           GENERADO — qué se carga en las páginas de listado
content/taxonomy.js         Categorías y tipos de prueba
content/companies.js        Empresas, sus procesos y sus FUENTES
content/paths.js            Rutas de aprendizaje
content/exercises/*.js      Pruebas, agrupadas por área

tools/verificar.js          Suite de verificación del contenido
tools/generar-indice.js     Genera content/indice.js a partir de content/exercises/
tools/humo.js               Ejecuta el JS de cada página sobre un DOM mínimo
tools/navegador.js          Controlador de Chrome por el protocolo DevTools
tools/e2e.js                Laboratorios e interacción en un navegador real
.github/workflows/          Integración continua: los tres scripts de tools/
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
| + Empresa | `empresa` (ver abajo) |

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

### Empresa (`company`)

Segunda entidad de primer nivel, añadida para que la plataforma no solo enseñe a
programar sino a **entrar en una empresa concreta**. Vive en `content/companies.js`
y se registra con `TT.defineCompany`.

```js
TT.defineCompany({
  id, nombre, pais, sector, tamano,
  tech: [],            // pila habitual
  perfiles: [],        // ids de TT.ROLES
  formatos: [],        // ids de TT.FORMATOS
  dificultad: 1..5,    // TT.DIFICULTAD
  proceso: [{ fase, formato, duracion, que }],
  evalua: [],          // qué intenta comprobar
  consejo: '',
  pruebaCodigo: 'si' | 'no' | 'depende',   // TT.PRUEBA_CODIGO
  verificacion: 'documentado' | 'parcial',
  fuentes: [{ titulo, url, tipo }]   // tipo: oficial | ingenieria | testimonios | comunidad
});
```

**La regla que define esta entidad: sin al menos una fuente con URL, la ficha no se
registra.** `defineCompany` la descarta con un error en consola y `verificar.js`
falla el build. El motivo es directo: toda esta sección afirma cosas sobre empresas
reales, y una afirmación no comprobable sobre un proceso de selección puede hacer
que alguien prepare lo que no toca.

`pruebaCodigo` responde a una pregunta muy concreta —¿en algún momento escribes
código que alguien evalúa?— y existe porque hay una parte enorme del mercado donde
la respuesta es **no**, y esa es la información que más falta a quien se prepara.
Hablar de código no cuenta; un test psicotécnico, tampoco. Cuando falta el valor,
`registry.js` asume `'depende'` en vez de `'si'`: dar por hecho que hay prueba es
el sesgo natural de quien escribe sobre entrevistas técnicas. Y `verificar.js`
comprueba la coherencia — una empresa no puede declarar `'no'` y a la vez un formato
que implica escribir código.

`verificacion` distingue dos niveles de evidencia y la interfaz los muestra siempre,
no en letra pequeña:

- **`documentado`** — la empresa publica su proceso. Exige al menos una fuente de
  tipo `oficial` o `ingenieria`; si no la hay, el verificador avisa.
- **`parcial`** — reconstruido a partir de testimonios públicos. La ficha abre con
  una nota que lo dice y advierte de que puede haber cambiado o variar entre equipos.

### El bloque `empresa` de una prueba

Es el vínculo entre las dos entidades, y el lugar donde el proyecto podría mentir
con más facilidad, así que es el que más se valida.

```js
empresa: {
  empresas: ['gitlab', 'github'],      // deben existir en el registro
  evidencia: 'documentada' | 'inspirada',
  puesto: 'Senior Backend Engineer',
  rol: 'backend',                      // id de TT.ROLES
  formato: 'code-review',              // id de TT.FORMATOS
  dificultad: 4,                       // 1-5
  evalua: [],                          // qué comprueba la empresa con esto
  nota: 'Qué es de la empresa y qué es nuestro.',
  fuentes: [{ titulo, url }]
}
```

| `evidencia` | Qué se afirma |
| --- | --- |
| `documentada` | Hay constancia pública de que la empresa usa una prueba **de ese tipo**. El enunciado sigue siendo original |
| `inspirada` | **No** se afirma que sea su prueba: está construida a partir de su pila, el puesto y su proceso conocido |

Tres defensas, en tres capas distintas:

1. `registry.js` **degrada a `inspirada`** cualquier prueba declarada `documentada`
   sin fuente. Prefiere afirmar de menos que afirmar de más.
2. `verificar.js` exige `nota`, `evalua`, fuente con URL, y que el rol, el formato,
   la dificultad y todas las empresas referenciadas existan.
3. La interfaz nunca muestra un nombre de empresa sin su etiqueta de evidencia al
   lado, ni una ficha sin sus fuentes enlazadas al final.

El bloque es **opcional**: hay pruebas de estudio puro que no simulan ningún
proceso. Pero si existe, se valida entero.

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

### Añadir una empresa

1. Añade un `empresa({ ... })` en `content/companies.js`.
2. **Busca las fuentes primero, no después.** Sin al menos una con URL, el registro
   descarta la ficha y el verificador falla. Si solo encuentras testimonios, la
   ficha es `verificacion: 'parcial'` y punto: no se fuerza a `documentado`.
3. Vincula al menos una prueba con su bloque `empresa`. Una ficha sin pruebas se
   renderiza con un estado vacío honesto, pero no aporta gran cosa.
4. `node tools/verificar.js` y `node tools/generar-indice.js`.

Los ejes `TT.ROLES`, `TT.FORMATOS` y `TT.DIFICULTAD` viven también en ese archivo:
añadir un formato de evaluación nuevo es un objeto más, y los filtros del catálogo
y de la página de empresas lo recogen solos, porque solo ofrecen los valores que
existen en el contenido cargado.

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

## 9. Carga ligera para las páginas de listado

`prueba.html` necesita la solución, la documentación y las fases completas de
un ejercicio. El catálogo, las rutas, el inicio y el progreso no: solo id,
título, categoría, nivel y los textos cortos de búsqueda. Cargar el contenido
completo en esas cuatro páginas escala mal — a 50 pruebas serían más de 2 MB
por carga de página que nunca se usan.

`TT.boot(base, { liviano: true })` carga en su lugar `content/indice.js`, un
archivo **generado** (no editado a mano) por `tools/generar-indice.js`, que lee
`content/exercises/` con el mismo mecanismo que `tools/verificar.js` y extrae
solo los campos ligeros de cada ejercicio, registrándolos con
`TT.defineExerciseIndice` — una función de registro sin la validación completa
de `defineExercise`, porque un índice derivado no necesita la misma red de
seguridad que el contrato de un ejercicio.

`node tools/generar-indice.js --check` falla si el índice no coincide con el
contenido actual; es el paso que ejecuta la integración continua para que
nadie olvide regenerarlo tras editar un ejercicio.

Con las 23 pruebas actuales, `content/indice.js` pesa 64 KB frente a los más de
1 MB del contenido completo: las páginas de listado bajan alrededor del 6 % de
ese peso.

## 10. Dependencias externas: fijadas y al día

La plataforma no tiene dependencias, pero los laboratorios heredados sí cargan
tres librerías desde CDN. La política es **una versión exacta, siempre**:

| Librería | Dónde | Versión |
| --- | --- | --- |
| Monaco Editor | ts_lab, async_lab, scope_lab, dom_lab | 0.56.0 |
| highlight.js | algoritmos | 11.11.2 |
| @babel/standalone | ts_lab | 8.0.4 |

El motivo de fijarlas no es teórico. `ts_lab.html` cargaba Babel desde una URL
**sin versión**, de modo que servía siempre la última publicada. Entre que se
escribió el laboratorio y hoy, Babel cruzó de la 7 a la 8 —un cambio de versión
mayor— sin que nadie se enterara. Se comprobó ejecutando en ambas versiones la
misma llamada que hace el laboratorio:

```js
Babel.transform(codigo, { presets: ['typescript'], filename: 'example.ts' })
```

La salida es idéntica, así que no llegó a romperse. Pero la próxima vez podría
no haber suerte, y el fallo aparecería **sin ningún cambio en el repositorio**,
que es la peor clase de avería: nadie la busca donde está.

Al actualizar, la comprobación mínima es que las rutas exactas que usa el código
sigan existiendo en la versión nueva. La API de Monaco que se utiliza —
`require.config`, `monaco.editor.create`, `KeyMod`/`KeyCode` y `addCommand`— es
estable desde hace años, y ninguna de las opciones que se le pasan está obsoleta.
Y desde ahora eso **sí** se comprueba: `node tools/e2e.js` abre los laboratorios
en un Chrome real y verifica que los editores se crean con contenido y que Babel
compila. Es el paso a dar tras subir cualquiera de las tres librerías.

## 11. Estilo de JavaScript: qué es restricción y qué era inercia

La restricción de diseño número 1 dice "scripts clásicos, no ES modules". Durante
un tiempo eso se interpretó de más: **el núcleo entero estaba escrito con `var`**,
sin una sola `const`, mientras que los laboratorios heredados —la parte
supuestamente antigua del proyecto— usaban `const`, `let` y funciones flecha.

La restricción es real pero se aplica solo a `import`/`export`, que fallan por CORS
con `file://`. La sintaxis moderna funciona igual en un `<script>` clásico desde
2016. Hoy el núcleo y las páginas usan `const` y `let`.

Quedan tres sitios con `var`, y los tres a propósito:

1. **El arnés del sandbox** (`sandbox.js`) y su gemelo en `verificar.js`. Son
   cadenas que se concatenan con el código que escribe quien resuelve la prueba.
   Si esa persona declara una variable con el mismo nombre, `var` lo tolera y
   `let` sería un SyntaxError de redeclaración que tumbaría el arnés entero.
2. **El código de los casos de prueba**, por el mismo motivo: se evalúa junto a
   la solución del usuario.
3. **Dos ejercicios**: `js-orden-ejecucion`, donde `var` en un bucle *es* el tema,
   y `dbg-carrito-fantasma`, donde el código a depurar es deliberadamente
   heredado — depurar código viejo que no escribiste tú es justamente el ejercicio.

Cómo se verificó que la conversión no cambió nada: una prueba diferencial que
carga la versión anterior y la nueva del núcleo y compara, carácter a carácter,
la salida de todas las funciones públicas sobre todo el catálogo — 295
comprobaciones y 88 000 caracteres de HTML. Idéntico.

## 12. Integración continua

`.github/workflows/verificar.yml` ejecuta en cada push y cada pull request, sobre Node 24:

1. `node tools/verificar.js` — estructura del contrato, documentación, fases,
   rutas y las soluciones de referencia contra sus propios tests.
2. `node tools/generar-indice.js --check` — que el índice ligero esté al día.
3. `node tools/humo.js` — arranca el JavaScript de cada página sobre un DOM
   mínimo y comprueba que renderiza sin lanzar. Cubre el hueco que dejaba
   `verificar.js`, que valida contenido pero no ejecutaba ni una línea de
   `assets/js/pages/`. Doce escenarios: listados, fichas, runner, simulación,
   filtros por URL y el caso de identificador inexistente.

Sin dependencias: los tres scripts son Node puro, así que el flujo de trabajo no
instala nada más que el propio Node.

### Lo que la integración continua NO puede comprobar

Queda un cuarto script, `tools/e2e.js`, que **no** está en el flujo de trabajo
porque necesita un Chrome instalado y salida a internet. Cubre justo lo que a las
otras se les escapa:

- **Los laboratorios**, que cargan Monaco, Babel y highlight.js desde un CDN.
  Comprueba que los editores se crean con contenido y que Babel compila
  TypeScript de verdad. Es la única red bajo una subida de versión de esas
  librerías.
- **Los manejadores de eventos**: clics en los chips de filtro, sincronización
  con la URL, cambio de pestañas, conmutador de tema.
- **El sandbox de principio a fin**: escribe la solución de referencia en el
  editor, pulsa Ejecutar y comprueba que los tests pasan dentro del `iframe`
  aislado — y que una solución incorrecta falla.

Se apoya en `tools/navegador.js`, un controlador del protocolo DevTools escrito
sin dependencias: Node 22 ya trae `fetch` y `WebSocket` globales. Si no encuentra
navegador, se omite sin dar error.

```bash
node tools/e2e.js
```

Conviene ejecutarlo tras tocar dependencias externas o el JavaScript de las
páginas.

## 13. El modo simulación

`prueba.html?id=…&sim=1` presenta la prueba como en un proceso real. Solo se
activa en pruebas con bloque `empresa`: una prueba de estudio puro no simula
ningún proceso.

Qué cambia respecto de la vista normal:

| | Vista normal | Simulación |
| --- | --- | --- |
| Pestañas | Enunciado · Documentación · Resolver · Solución · Análisis | Enunciado · Resolver |
| Cabecera | Categoría, nivel y bloque de empresa desplegado | Ficha de prueba: empresa, puesto, nivel, tiempo, formato, dificultad y evidencia |
| Pistas | Progresivas, se registran al abrirlas | No se ofrecen |
| Reloj | Cronómetro ascendente | **Cuenta atrás** desde `ex.time`, en ámbar a los 5 min y en rojo al pasarse |
| Salida | — | "He terminado · ver solución explicada" |

Dos decisiones que conviene entender:

**Las pestañas ocultas no se renderizan, no se esconden con CSS.** El contenido
está cargado en memoria —es la misma página— así que ocultarlo con `display:none`
sería teatro. No generarlo evita además construir HTML que nadie va a ver.

**La cuenta atrás no bloquea nada al llegar a cero.** Sigue contando en negativo.
Expulsar a alguien a mitad de un razonamiento no enseña nada, y la mayoría de las
empresas con prueba para casa valoran más una solución razonada que una entrega
apresurada. Lo que sí hace el reloj es dejar constancia de cuánto te pasaste, que
es el dato interesante.

Al pulsar "He terminado" se marca `solutionSeen` —con la misma penalización del
60 % que fuera de la simulación, porque el nivel estimado solo vale si es honesto—
y se vuelve a la vista completa con `#solucion`, que abre directamente la pestaña
de la solución explicada.

## 14. Qué queda pendiente

- Editor con resaltado de sintaxis en el runner (hoy es un `textarea` con soporte
  de tabulador; Monaco ya se usa en los laboratorios y podría reutilizarse).
- Tests automáticos para lenguajes distintos de JavaScript.
- Vista previa visual para las pruebas de frontend: no existe todavía ningún
  ejercicio ni utilidad para renderizar HTML/CSS/JS del usuario en un iframe.
- Más pruebas: el catálogo tiene 23 completas, 2 de nivel junior. Quedan sin
  contenido las categorías de Git y GitHub, Rendimiento y Automatizaciones,
  además de multiagente y observabilidad dentro de IA. Añadirlas no requiere
  tocar el núcleo.
- Retrofit de `fases` a las pruebas que hoy usan `walkthrough`.
- Dos formatos de `TT.FORMATOS` no tienen ejercicio propio, y no por descuido:
  **pair programming** necesita una segunda persona y **proyecto de prueba
  remunerado** necesita semanas de trabajo real. Se documentan en las fichas de
  empresa; simularlos en solitario y en una sesión sería falsear el formato.
- Comprobación automática de que las URL de `fuentes` siguen vivas. Hoy el
  verificador comprueba que existan y tengan forma de URL, no que respondan: eso
  exigiría red en la integración continua y haría el build dependiente de
  servidores de terceros. La fecha de `revisado` de cada ficha es, de momento, la
  señal de frescura.

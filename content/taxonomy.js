/* ============================================================
   TechTrack — Taxonomía de contenido
   ------------------------------------------------------------
   Añadir una categoría nueva = añadir un objeto aquí.
   El núcleo no tiene ninguna categoría escrita a mano.
   ============================================================ */
(function (TT) {
  'use strict';

  [
    { id: 'frontend',      label: 'Frontend',        icon: '◆', badge: 'badge-brand', desc: 'Interfaz, DOM, estado, accesibilidad y rendimiento en el navegador.' },
    { id: 'javascript',    label: 'JavaScript',      icon: '◇', badge: 'badge-warn',  desc: 'El lenguaje a fondo: por qué ocurre lo que ocurre.' },
    { id: 'backend',       label: 'Backend',         icon: '▣', badge: 'badge-info',  desc: 'Servidores, APIs, validación, errores y capas de dominio.' },
    { id: 'apis',          label: 'APIs',            icon: '⇄', badge: 'badge-info',  desc: 'Consumo, contratos, paginación, reintentos y límites de peticiones.' },
    { id: 'databases',     label: 'Bases de datos',  icon: '▤', badge: 'badge-neutral', desc: 'Modelado, índices, transacciones y consultas eficientes.' },
    { id: 'testing',       label: 'Testing',         icon: '✔', badge: 'badge-ok',    desc: 'Qué probar, a qué nivel y cómo evitar tests que no detectan nada.' },
    { id: 'debugging',     label: 'Debugging',       icon: '⚑', badge: 'badge-err',   desc: 'Diagnóstico metódico de fallos reales, no adivinación.' },
    { id: 'refactor',      label: 'Refactorización', icon: '⟳', badge: 'badge-warn',  desc: 'Convertir código que funciona en código mantenible en producción.' },
    { id: 'security',      label: 'Seguridad',       icon: '⛨', badge: 'badge-err',   desc: 'Vulnerabilidades habituales y cómo se cierran de verdad.' },
    { id: 'performance',   label: 'Rendimiento',     icon: '⚡', badge: 'badge-warn',  desc: 'Medir antes de optimizar, y optimizar lo que importa.' },
    { id: 'architecture',  label: 'Arquitectura',    icon: '◫', badge: 'badge-brand', desc: 'Límites, dependencias y decisiones que se pagan a largo plazo.' },
    { id: 'system-design', label: 'System Design',   icon: '⬡', badge: 'badge-brand', desc: 'Escala, caché, colas, disponibilidad y consistencia.' },
    { id: 'git',           label: 'Git y GitHub',    icon: '⑂', badge: 'badge-neutral', desc: 'Historial limpio, resolución de conflictos y flujo de equipo.' },
    { id: 'ai',            label: 'IA aplicada',     icon: '✦', badge: 'badge-ai',    desc: 'LLM en producción: salidas estructuradas, RAG, MCP y coste.' },
    { id: 'agents',        label: 'Agentes de IA',   icon: '⚙', badge: 'badge-ai',    desc: 'Herramientas, guardrails, multiagente, evals y observabilidad.' },
    { id: 'company',       label: 'Pruebas de empresa', icon: '★', badge: 'badge-brand', desc: 'Simulaciones completas de procesos de selección reales.' }
  ].forEach(TT.defineCategory);

  /* Segundo eje: qué se te pide HACER. Una misma categoría puede
     evaluarse de formas muy distintas y las empresas mezclan varias. */
  TT.KINDS = {
    'build':        'Crear funcionalidad',
    'complete':     'Completar código',
    'find-bug':     'Detectar errores',
    'fix':          'Corregir bugs',
    'refactor':     'Refactorizar',
    'optimize':     'Optimizar',
    'api-build':    'Crear API',
    'api-consume':  'Consumir API',
    'db-design':    'Diseñar base de datos',
    'test-write':   'Escribir tests',
    'code-review':  'Revisar un Pull Request',
    'security':     'Auditar seguridad',
    'design':       'Diseñar arquitectura',
    'automation':   'Automatizar',
    'ai-build':     'Integrar IA',
    'agent-build':  'Construir agente',
    'agent-debug':  'Diagnosticar agente',
    'eval':         'Evaluar modelos'
  };

})(window.TT);

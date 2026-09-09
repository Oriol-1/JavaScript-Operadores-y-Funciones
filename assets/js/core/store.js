/* ============================================================
   TechTrack — Núcleo: progreso del usuario
   ------------------------------------------------------------
   Persistencia en localStorage bajo una única clave versionada.
   Todo acceso pasa por aquí para que mañana se pueda sustituir
   por una API remota cambiando solo read()/write().
   ============================================================ */
(function (global) {
  'use strict';

  const TT = global.TT || (global.TT = {});
  const KEY = 'techtrack.progress.v1';

  const EMPTY = {
    schema: 1,
    createdAt: null,
    attempts: {},   // exerciseId -> { status, score, maxScore, seconds, hintsUsed, solutionSeen, tests, updatedAt, notes }
    session: {}     // exerciseId -> timestamp de inicio (cronómetro en curso)
  };

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(EMPTY));
      const data = JSON.parse(raw);
      if (data.schema !== 1) return JSON.parse(JSON.stringify(EMPTY));
      return data;
    } catch (e) {
      // Modo privado, cuota llena o JSON corrupto: seguimos sin progreso.
      return JSON.parse(JSON.stringify(EMPTY));
    }
  }

  function write(data) {
    try {
      data.createdAt = data.createdAt || new Date().toISOString();
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[TechTrack] No se pudo guardar el progreso:', e.message);
    }
    return data;
  }

  const Store = {

    raw: read,

    attempt: function (id) {
      const d = read();
      return d.attempts[id] || null;
    },

    /** Fusiona campos en el intento de un ejercicio. */
    update: function (id, patch) {
      const d = read();
      const a = d.attempts[id] || {
        status: 'in-progress', score: 0, maxScore: 0, seconds: 0,
        hintsUsed: 0, solutionSeen: false, tests: null, notes: '', attempts: 0
      };
      Object.keys(patch).forEach(function (k) { a[k] = patch[k]; });
      a.updatedAt = new Date().toISOString();
      d.attempts[id] = a;
      write(d);
      return a;
    },

    addSeconds: function (id, secs) {
      if (!secs || secs < 1) return;
      const a = Store.attempt(id) || {};
      Store.update(id, { seconds: (a.seconds || 0) + Math.round(secs) });
    },

    useHint: function (id, index) {
      const a = Store.attempt(id) || {};
      Store.update(id, { hintsUsed: Math.max(a.hintsUsed || 0, index + 1) });
    },

    reset: function (id) {
      const d = read();
      delete d.attempts[id];
      write(d);
    },

    resetAll: function () { write(JSON.parse(JSON.stringify(EMPTY))); },

    export: function () { return JSON.stringify(read(), null, 2); },

    import: function (json) {
      const data = JSON.parse(json);
      if (data.schema !== 1) throw new Error('Formato de progreso no compatible');
      write(data);
    },

    /* ---------- Analítica derivada ---------- */

    /**
     * Resumen global + por categoría + detección de puntos débiles.
     * Todo se calcula al vuelo: el almacén guarda hechos, no conclusiones.
     */
    summary: function () {
      const d = read();
      const all = TT.all();
      const out = {
        total: all.length,
        started: 0, passed: 0, failed: 0,
        score: 0, maxScore: 0, seconds: 0,
        byCategory: {}, byLevel: {}, byTech: {},
        weakSkills: {}, strongSkills: {},
        recent: []
      };

      all.forEach(function (ex) {
        const cat = out.byCategory[ex.category] || (out.byCategory[ex.category] = { total: 0, passed: 0, started: 0, score: 0, max: 0 });
        cat.total++;
        const lv = out.byLevel[ex.level] || (out.byLevel[ex.level] = { total: 0, passed: 0 });
        lv.total++;

        const a = d.attempts[ex.id];
        if (!a) return;

        out.started++;
        cat.started++;
        out.seconds += a.seconds || 0;
        out.score += a.score || 0;
        out.maxScore += a.maxScore || 0;
        cat.score += a.score || 0;
        cat.max += a.maxScore || 0;

        const ratio = a.maxScore ? (a.score / a.maxScore) : 0;
        if (a.status === 'passed') { out.passed++; cat.passed++; lv.passed++; }
        else if (a.status === 'failed') { out.failed++; }

        ex.skills.forEach(function (s) {
          const bucket = ratio >= 0.7 ? out.strongSkills : out.weakSkills;
          bucket[s] = (bucket[s] || 0) + 1;
        });
        ex.tech.forEach(function (t) {
          const tt = out.byTech[t] || (out.byTech[t] = { done: 0, ratio: 0, n: 0 });
          tt.done++; tt.n++; tt.ratio = ((tt.ratio * (tt.n - 1)) + ratio) / tt.n;
        });

        out.recent.push({ id: ex.id, title: ex.title, at: a.updatedAt, status: a.status, ratio: ratio });
      });

      out.recent.sort(function (a, b) { return (b.at || '').localeCompare(a.at || ''); });
      out.recent = out.recent.slice(0, 8);
      out.completion = out.total ? Math.round(out.passed / out.total * 100) : 0;
      out.accuracy = out.maxScore ? Math.round(out.score / out.maxScore * 100) : 0;
      out.estimatedLevel = estimateLevel(out, d);
      return out;
    },

    /**
     * Motor de recomendación.
     * Regla: primero refuerza lo suspendido, después la siguiente
     * parada de la ruta empezada, y si no hay señal, el ejercicio
     * más fácil sin empezar de la categoría menos trabajada.
     */
    recommend: function (limit) {
      limit = limit || 3;
      const d = read();
      const s = Store.summary();
      const picks = [];
      const seen = {};

      function push(ex, reason) {
        if (!ex || seen[ex.id] || picks.length >= limit) return;
        seen[ex.id] = true;
        picks.push({ exercise: ex, reason: reason });
      }

      // 1. Pruebas suspendidas o con puntuación baja: repetir antes de avanzar.
      TT.all().forEach(function (ex) {
        const a = d.attempts[ex.id];
        if (a && a.maxScore && (a.score / a.maxScore) < 0.6) {
          push(ex, 'La dejaste por debajo del 60 %. Repetirla consolida ' + ex.skills.slice(0, 2).join(' y ') + '.');
        }
      });

      // 2. Habilidades flojas: ejercicios sin empezar que las entrenan.
      const weak = Object.keys(s.weakSkills).sort(function (a, b) { return s.weakSkills[b] - s.weakSkills[a]; });
      weak.forEach(function (skill) {
        TT.all().forEach(function (ex) {
          if (!d.attempts[ex.id] && ex.skills.indexOf(skill) !== -1) {
            push(ex, 'Detectamos dificultades con "' + skill + '". Esta prueba lo trabaja de forma directa.');
          }
        });
      });

      // 3. Continuar la ruta con más avance.
      TT.paths().forEach(function (p) {
        const next = p.steps.filter(function (st) { return st.exercise && !d.attempts[st.exercise]; })[0];
        if (next) push(TT.get(next.exercise), 'Siguiente parada de la ruta "' + p.title + '".');
      });

      // 4. Arranque en frío: lo más accesible primero.
      TT.query({ level: 'junior' }).forEach(function (ex) {
        if (!d.attempts[ex.id]) push(ex, 'Buen punto de partida para calibrar tu nivel.');
      });

      return picks;
    },

    pathProgress: function (path) {
      const d = read();
      const withEx = path.steps.filter(function (s) { return s.exercise; });
      const done = withEx.filter(function (s) {
        const a = d.attempts[s.exercise];
        return a && a.status === 'passed';
      });
      return {
        total: withEx.length,
        done: done.length,
        pct: withEx.length ? Math.round(done.length / withEx.length * 100) : 0
      };
    }
  };

  /** Nivel estimado: exige volumen y precisión, no solo intentos. */
  function estimateLevel(s, d) {
    const byLevelPassed = { junior: 0, 'junior-adv': 0, mid: 0, senior: 0 };
    TT.all().forEach(function (ex) {
      const a = d.attempts[ex.id];
      if (a && a.status === 'passed') byLevelPassed[ex.level]++;
    });
    if (byLevelPassed.senior >= 2 && s.accuracy >= 75) return 'senior';
    if (byLevelPassed.mid >= 3 && s.accuracy >= 70) return 'mid';
    if (byLevelPassed['junior-adv'] >= 2) return 'junior-adv';
    if (s.passed >= 1) return 'junior';
    return null;
  }

  TT.store = Store;

})(window);

/* ==========================================================
   Router: hash routing simple.
   #/welcome, #/login, #/register, #/home, #/lesson/:id,
   #/profile, #/leaderboard, #/schedule, #/subscription,
   #/teacher/content, #/teacher/students, #/teacher/agenda,
   #/teacher/edit/:id, #/teacher/new
   ========================================================== */
window.Router = (() => {
  const routes = [];

  function on(pattern, handler) {
    // convert /home to regex, /lesson/:id -> /lesson/(?<id>[^/]+)
    const keys = [];
    const rx = new RegExp('^#' + pattern.replace(/:[^/]+/g, (m) => {
      keys.push(m.slice(1));
      return '([^/]+)';
    }) + '$');
    routes.push({ rx, keys, handler });
  }

  function go(hash) { location.hash = hash; }

  async function resolve() {
    const raw = location.hash || '#/welcome';
    const qIdx = raw.indexOf('?');
    const hash = qIdx >= 0 ? raw.slice(0, qIdx) : raw;
    const query = {};
    if (qIdx >= 0) {
      raw.slice(qIdx + 1).split('&').forEach(kv => {
        if (!kv) return;
        const [k, v] = kv.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    for (const r of routes) {
      const m = hash.match(r.rx);
      if (m) {
        const params = {};
        r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
        const el = document.getElementById('app');
        const html = await r.handler(params, query);
        if (typeof html === 'string') el.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
    }
    location.hash = '#/welcome';
  }

  window.addEventListener('hashchange', resolve);

  return { on, go, resolve };
})();

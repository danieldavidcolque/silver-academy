/* ==========================================================
   Perfil: stats + plan + logout + reset
   ========================================================== */
window.Views = window.Views || {};

Views.profile = () => {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return ''; }
  const progress = Store.progressFor(u.id);
  const donePerLevel = SEED.LEVELS.map(L => {
    const total = Store.lessonsForLevel(L.code).length;
    const done = Store.lessonsForLevel(L.code).filter(l => progress[l.id]?.done).length;
    return { code: L.code, name: L.name, done, total, pct: total ? Math.round(done/total*100) : 0 };
  });
  const plan = SEED.plans.find(p => p.id === (u.plan || 'free'));

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-4 us-header text-white">
        <div class="max-w-2xl mx-auto flex items-center gap-4 pt-2">
          <div class="text-6xl bg-white rounded-full w-20 h-20 grid place-items-center">${UI.esc(u.avatar || '🦊')}</div>
          <div class="flex-1">
            <div class="text-2xl font-black">${UI.esc(u.name)}</div>
            <div class="opacity-90 text-sm">${UI.esc(u.email)}</div>
            <div class="mt-1 inline-block text-xs bg-white/20 rounded-full px-2 py-0.5 font-black uppercase">
              ${u.role === 'teacher' ? '👩‍🏫 Profesor' : '🎓 Estudiante'}
            </div>
          </div>
        </div>
        <div class="max-w-2xl mx-auto grid grid-cols-4 gap-2 mt-4">
          <Stat label="Racha" value="${u.streak || 0}" icon="🔥"/>
          <Stat label="XP" value="${u.xp || 0}" icon="⭐"/>
          <Stat label="Gemas" value="${u.gems || 0}" icon="💎"/>
          <Stat label="Corazones" value="${u.hearts || 0}" icon="♥"/>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs uppercase text-duo-gray font-black">Tu plan</div>
              <div class="font-black text-lg">${UI.esc(plan.name)}</div>
              <div class="text-sm text-duo-gray">${plan.price === 0 ? 'Gratis, para siempre' : `US$ ${plan.price} / ${plan.period}`}</div>
            </div>
            <a href="#/subscription" class="btn btn-purple btn-sm">Cambiar</a>
          </div>
        </div>

        <div class="card">
          <div class="font-black mb-3">Progreso por nivel</div>
          <div class="space-y-3">
            ${donePerLevel.map(p => `
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-black">${UI.levelPill(p.code)} ${UI.esc(p.name)}</span>
                  <span class="text-duo-gray">${p.done}/${p.total}</span>
                </div>
                <div class="progress"><div style="width: ${p.pct}%"></div></div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="font-black mb-2">Ajustes</div>
          <div class="space-y-2">
            <button data-refill class="btn btn-ghost w-full">Recargar corazones (💎 20)</button>
            <button data-reset class="btn btn-ghost w-full">Reiniciar datos de demo</button>
            <button data-logout class="btn btn-red w-full">Cerrar sesión</button>
          </div>
        </div>
      </main>

      ${UI.bnav('me')}
    </div>
  `.replace(/<Stat label="([^"]+)" value="([^"]+)" icon="([^"]+)"\/>/g, (m, l, v, i) => `
    <div class="bg-white/15 rounded-xl p-2 text-center">
      <div class="text-xs uppercase font-black opacity-80">${l}</div>
      <div class="font-black text-lg">${i} ${v}</div>
    </div>
  `);
};

Views.wire.profile = () => {
  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    UI.confirmAction('¿Cerrar sesión?', 'Sí', false).then(ok => {
      if (ok) { Store.logout(); Router.go('#/welcome'); }
    });
  });
  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    Store.reset();
  });
  document.querySelector('[data-refill]')?.addEventListener('click', () => {
    const u = Store.currentUser();
    if ((u.gems||0) < 20) return UI.toast('No tenés gemas suficientes','error');
    u.gems -= 20; Store.refillHearts(u.id); UI.toast('Corazones al máximo ❤️','success');
    Router.resolve();
  });
};

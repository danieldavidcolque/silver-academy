/* ==========================================================
   Leaderboard: ranking por XP entre todos los estudiantes.
   ========================================================== */
window.Views = window.Views || {};

Views.leaderboard = () => {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return ''; }
  const students = Store.db.users
    .filter(x => x.role === 'student')
    .map(x => ({ ...x, xp: x.xp || 0 }))
    .sort((a, b) => b.xp - a.xp);

  const rank = students.findIndex(s => s.id === u.id) + 1;
  const medals = ['🥇','🥈','🥉'];

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-4">
        <div class="max-w-2xl mx-auto text-center">
          <div class="text-5xl mb-2 mascot">🏆</div>
          <h1 class="text-2xl font-black">Ranking del mes</h1>
          <p class="text-sm text-duo-gray">Ganá XP para subir posiciones</p>
        </div>
      </header>
      <main class="max-w-2xl mx-auto px-4 space-y-2">
        ${rank > 0 ? `
          <div class="card border-duo-blue bg-duo-blue/5">
            <div class="text-xs uppercase font-black text-duo-blue">Tu posición</div>
            <div class="text-2xl font-black">#${rank} de ${students.length}</div>
          </div>
        ` : ''}
        <div class="card p-0 overflow-hidden">
          ${students.map((s, i) => `
            <div class="flex items-center gap-3 p-3 ${s.id === u.id ? 'bg-duo-yellow/20' : ''} ${i < students.length-1 ? 'border-b border-duo-grayLight' : ''}">
              <div class="w-8 text-center font-black text-lg">${medals[i] || (i+1)}</div>
              <div class="text-2xl">${UI.esc(s.avatar || '🦊')}</div>
              <div class="flex-1">
                <div class="font-black">${UI.esc(s.name)} ${s.id === u.id ? '<span class="text-xs text-duo-blue">(vos)</span>' : ''}</div>
                <div class="text-xs text-duo-gray">🔥 ${s.streak || 0} · nivel objetivo ${s.targetLevel || 'A1'}</div>
              </div>
              <div class="font-black text-duo-yellow">${s.xp} XP</div>
            </div>
          `).join('')}
        </div>
      </main>
      ${UI.bnav('rank')}
    </div>
  `;
};

Views.wire.leaderboard = () => {};

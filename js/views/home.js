/* ==========================================================
   Home estudiante: header con stats + selector de nivel + árbol
   ========================================================== */
window.Views = window.Views || {};

Views.home = () => {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return ''; }
  if (u.role === 'teacher') { Router.go('#/teacher/content'); return ''; }

  const level = u.targetLevel || 'A1';
  const lessons = Store.lessonsForLevel(level);
  const progress = Store.progressFor(u.id);
  const doneCount = lessons.filter(l => progress[l.id]?.done).length;
  const totalXp = lessons.reduce((s, l) => s + l.xp, 0);
  const earnedXp = lessons.reduce((s, l) => s + (progress[l.id]?.done ? l.xp : 0), 0);
  const pct = lessons.length ? Math.round(doneCount / lessons.length * 100) : 0;

  const nodeStates = lessons.map((l, i) => {
    if (progress[l.id]?.done) return 'done';
    const prev = i === 0 || progress[lessons[i-1].id]?.done;
    return prev ? 'current' : 'locked';
  });
  // once we have any "current", downstream stays locked
  let seenCurrent = false;
  const finalStates = nodeStates.map(s => {
    if (s === 'done') return 'done';
    if (s === 'current' && !seenCurrent) { seenCurrent = true; return 'current'; }
    return 'locked';
  });

  const treeHTML = lessons.map((l, i) => {
    const state = finalStates[i];
    const offset = (i % 2 === 0) ? 'translate-x-0' : 'translate-x-16';
    const isRight = i % 2 === 1;
    return `
      <div class="flex ${isRight ? 'justify-start ml-24' : 'justify-start ml-4'} my-2 items-center gap-3">
        <button
          class="node node-${state}"
          ${state === 'locked' ? 'disabled aria-disabled="true"' : `data-lesson="${l.id}"`}
          aria-label="${UI.esc(l.title)}"
        >
          ${state === 'locked' ? UI.icons.lock : `<span>${l.icon}</span>`}
        </button>
        <div>
          <div class="font-black text-duo-ink">${UI.esc(l.title)}</div>
          <div class="text-xs text-duo-gray uppercase font-black">
            ${state === 'done' ? 'Completada' : state === 'current' ? 'Continuar' : 'Bloqueada'} · +${l.xp} XP
          </div>
        </div>
      </div>
    `;
  }).join('');

  const levelChips = SEED.LEVELS.map(l => `
    <button class="chip ${l.code === level ? 'bg-duo-green text-white border-duo-green' : ''}"
            data-set-level="${l.code}">
      ${l.code} · ${l.name}
    </button>
  `).join('');

  return `
    <div class="view with-bnav">
      <!-- Top bar -->
      <header class="safe-top px-4 pb-3 sticky top-0 bg-white z-10 border-b border-duo-grayLight">
        <div class="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            ${UI.levelPill(level)}
            <div>
              <div class="text-xs text-duo-gray uppercase font-black">Nivel objetivo</div>
              <div class="font-black">${SEED.LEVELS.find(x=>x.code===level).name}</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 font-black text-duo-red">
              <span class="text-lg">🔥</span> ${u.streak || 0}
            </div>
            <div class="flex items-center gap-1 font-black text-duo-blue">
              <span class="text-lg">💎</span> ${u.gems || 0}
            </div>
            <div class="flex items-center gap-0.5 font-black text-duo-red">
              ${Array.from({length: 5}).map((_,i) => `<span class="text-lg ${i < (u.hearts||0) ? 'heart' : 'heart empty'}">♥</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- level switcher -->
        <div class="max-w-2xl mx-auto mt-3">
          <div class="hscroll">
            ${levelChips}
          </div>
        </div>

        <!-- progress -->
        <div class="max-w-2xl mx-auto mt-3">
          <div class="flex justify-between text-xs font-black uppercase text-duo-gray mb-1">
            <span>Progreso ${level}</span>
            <span>${doneCount}/${lessons.length} · ${earnedXp}/${totalXp} XP</span>
          </div>
          <div class="progress"><div style="width: ${pct}%"></div></div>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 pt-6">
        <div class="card card-flag mb-6 flex items-center gap-3">
          <img src="icons/logo.png" alt="" class="brand-logo brand-logo-sm mascot"/>
          <div class="flex-1">
            <div class="font-black text-lg flex items-center gap-2">
              <span>Good morning, ${UI.esc(u.name.split(' ')[0])}!</span>
              <span class="text-usa-gold">★</span>
            </div>
            <div class="text-sm text-duo-ink">Racha de ${u.streak || 0} día${u.streak === 1 ? '' : 's'}. Meta diaria: 20 XP.</div>
          </div>
        </div>

        <div>
          ${lessons.length ? treeHTML : `
            <div class="card text-center text-duo-gray">
              Todavía no hay lecciones para ${level}. Pedile a tu profe que las cargue.
            </div>`}
        </div>

        <div class="card mt-6" style="border-color: var(--usa-red)">
          <div class="flex items-center gap-3">
            <div class="text-3xl">🗽</div>
            <div class="flex-1">
              <div class="font-black">¿Querés practicar con Silvana?</div>
              <div class="text-sm text-duo-gray">Reservá una clase 1‑a‑1 de 30 min.</div>
            </div>
            <a href="#/schedule" class="btn btn-blue btn-sm">Ver</a>
          </div>
        </div>
      </main>

      ${UI.bnav('home')}
    </div>
  `;
};

Views.wire.home = () => {
  document.querySelectorAll('[data-set-level]').forEach(b => {
    b.addEventListener('click', () => {
      const u = Store.currentUser();
      if (!u) return;
      u.targetLevel = b.dataset.setLevel;
      Store.save();
      Router.resolve();
    });
  });
  document.querySelectorAll('[data-lesson]').forEach(b => {
    b.addEventListener('click', () => {
      const u = Store.currentUser();
      if (!u) return;
      if ((u.hearts || 0) <= 0) {
        UI.modal({
          title: 'Sin corazones',
          body: `<p>Te quedaste sin corazones. Podés esperar o mejorar a Plus para tenerlos ilimitados.</p>`,
          actions: [
            { label: 'Recargar (💎 20)', style: 'btn-blue', onClick: () => {
              if ((u.gems||0) < 20) { UI.toast('No tenés gemas suficientes','error'); return false; }
              u.gems -= 20; Store.refillHearts(u.id); UI.toast('¡Corazones recargados!','success');
            }},
            { label: 'Ver Plus', style: 'btn-purple', onClick: () => { Router.go('#/subscription'); }},
            { label: 'Cerrar', style: 'btn-ghost' },
          ]
        });
        return;
      }
      Router.go('#/lesson/' + b.dataset.lesson);
    });
  });
};

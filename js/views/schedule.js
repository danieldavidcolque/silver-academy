/* ==========================================================
   Agenda 1-a-1: vista estudiante para reservar clases de 30 min
   ========================================================== */
window.Views = window.Views || {};

Views.schedule = () => {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return ''; }

  const plan = u.plan || 'free';
  const perMonth = plan === 'premium' ? 8 : plan === 'plus' ? 2 : 0;
  const myBookings = Store.db.slots.filter(s => s.studentId === u.id && s.status === 'booked');
  const thisMonthUsed = myBookings.filter(s => {
    const d = new Date(s.startISO);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const openSlots = Store.db.slots
    .filter(s => s.status === 'open' && new Date(s.startISO) > new Date())
    .sort((a,b) => new Date(a.startISO) - new Date(b.startISO));

  // agrupamos por día
  const groups = {};
  openSlots.forEach(s => {
    const key = new Date(s.startISO).toDateString();
    (groups[key] = groups[key] || []).push(s);
  });

  const upcomingHTML = myBookings
    .sort((a,b) => new Date(a.startISO) - new Date(b.startISO))
    .map(s => `
      <div class="card border-duo-blue">
        <div class="flex items-center gap-3">
          <div class="text-3xl">📚</div>
          <div class="flex-1">
            <div class="font-black">Clase con Prof. Marta</div>
            <div class="text-sm text-duo-gray">${UI.fmtDate(s.startISO)} · ${UI.fmtTime(s.startISO)} · ${s.durationMin} min</div>
            ${s.note ? `<div class="text-xs text-duo-gray mt-1">Nota: ${UI.esc(s.note)}</div>` : ''}
          </div>
          <button class="btn btn-ghost btn-sm" data-cancel="${s.id}">Cancelar</button>
        </div>
      </div>
    `).join('');

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-3">
        <div class="max-w-2xl mx-auto">
          <h1 class="text-2xl font-black">Clases 1‑a‑1</h1>
          <p class="text-sm text-duo-gray">30 minutos con Prof. Marta 👩‍🏫</p>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 space-y-4">

        <div class="card ${plan === 'free' ? 'border-duo-yellow bg-duo-yellow/10' : 'border-duo-green bg-duo-green/10'}">
          <div class="flex items-center gap-3">
            <div class="text-3xl">${plan === 'free' ? '🔒' : '✅'}</div>
            <div class="flex-1">
              <div class="font-black">Plan ${UI.esc(plan.toUpperCase())}</div>
              <div class="text-sm">
                ${plan === 'free'
                  ? 'Tu plan gratis no incluye clases 1‑a‑1.'
                  : `Podés reservar hasta <b>${perMonth}</b> clases este mes. Usadas: <b>${thisMonthUsed}</b>.`}
              </div>
            </div>
            ${plan === 'free' ? `<a href="#/subscription" class="btn btn-purple btn-sm">Ver planes</a>` : ''}
          </div>
        </div>

        ${myBookings.length ? `
          <div>
            <h2 class="font-black uppercase text-sm text-duo-gray mb-2">Mis próximas clases</h2>
            <div class="space-y-2">${upcomingHTML}</div>
          </div>
        ` : ''}

        <div>
          <h2 class="font-black uppercase text-sm text-duo-gray mb-2">Horarios disponibles</h2>
          <div class="space-y-4">
            ${Object.keys(groups).length ? Object.entries(groups).map(([day, slots]) => `
              <div>
                <div class="font-black mb-2 capitalize">${UI.fmtDate(slots[0].startISO)}</div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  ${slots.map(s => `
                    <button class="opt py-2" data-book="${s.id}">
                      <div class="font-black">${UI.fmtTime(s.startISO)}</div>
                      <div class="text-xs text-duo-gray">30 min</div>
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('') : `<div class="card text-center text-duo-gray">Sin horarios disponibles.</div>`}
          </div>
        </div>
      </main>

      ${UI.bnav('schedule')}
    </div>
  `;
};

Views.wire.schedule = () => {
  const u = Store.currentUser();
  const plan = u.plan || 'free';
  const perMonth = plan === 'premium' ? 8 : plan === 'plus' ? 2 : 0;
  const thisMonthUsed = Store.db.slots.filter(s => {
    if (s.studentId !== u.id || s.status !== 'booked') return false;
    const d = new Date(s.startISO);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  document.querySelectorAll('[data-book]').forEach(b => {
    b.addEventListener('click', async () => {
      if (plan === 'free') {
        UI.modal({
          title: 'Necesitás un plan',
          body: '<p>Las clases 1‑a‑1 están incluidas en Plus y Premium. Elegí un plan para reservar.</p>',
          actions: [
            { label: 'Ver planes', style: 'btn-purple', onClick: () => Router.go('#/subscription') },
            { label: 'Después', style: 'btn-ghost' },
          ]
        });
        return;
      }
      if (thisMonthUsed >= perMonth) {
        UI.toast('Llegaste al límite del mes', 'error');
        return;
      }
      const slotId = b.dataset.book;
      const s = Store.db.slots.find(x => x.id === slotId);
      const note = await promptNote();
      if (note === null) return;
      const r = Store.bookSlot(slotId, u.id, note);
      if (r.error) return UI.toast(r.error, 'error');
      UI.toast('¡Clase reservada!', 'success');
      Router.resolve();
    });
  });

  document.querySelectorAll('[data-cancel]').forEach(b => {
    b.addEventListener('click', async () => {
      const ok = await UI.confirmAction('¿Cancelar esta clase?', 'Sí, cancelar', true);
      if (!ok) return;
      Store.cancelBooking(b.dataset.cancel);
      UI.toast('Reserva cancelada');
      Router.resolve();
    });
  });
};

function promptNote() {
  return new Promise((resolve) => {
    UI.modal({
      title: 'Reservar clase',
      body: `
        <p class="mb-2 text-sm">¿Qué querés practicar? (opcional)</p>
        <textarea id="modal-note" rows="3" class="field" placeholder="Por ej: pronunciación, conversación libre, past simple…"></textarea>
      `,
      actions: [
        { label: 'Cancelar', style: 'btn-ghost', onClick: () => resolve(null) },
        { label: 'Confirmar', style: 'btn-green', onClick: (back) => {
          const val = back.querySelector('#modal-note').value.trim();
          resolve(val);
        }},
      ]
    });
  });
}

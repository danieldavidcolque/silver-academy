/* ==========================================================
   Suscripción mensual: planes + checkout mock
   ========================================================== */
window.Views = window.Views || {};

Views.subscription = () => {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return ''; }
  const current = u.plan || 'free';
  const sub = Store.db.subs[u.id];

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-3">
        <div class="max-w-2xl mx-auto text-center">
          <div class="text-5xl mb-2">💎</div>
          <h1 class="text-2xl font-black">Elegí tu plan</h1>
          <p class="text-sm text-duo-gray">Cancelá en cualquier momento</p>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 space-y-4">
        ${sub && current !== 'free' ? `
          <div class="card border-duo-green bg-duo-green/10">
            <div class="flex items-center gap-3">
              <div class="text-3xl">✅</div>
              <div class="flex-1">
                <div class="font-black">Suscripción activa: ${UI.esc(current.toUpperCase())}</div>
                <div class="text-sm text-duo-gray">Próximo cobro: ${new Date(sub.nextBillISO).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <button class="btn btn-ghost btn-sm" data-cancel-sub>Cancelar</button>
            </div>
          </div>
        ` : ''}

        <div class="space-y-3">
          ${SEED.plans.map(p => {
            const isCurrent = p.id === current;
            return `
              <div class="card ${p.highlight ? 'border-duo-blue' : ''} relative ${isCurrent ? 'ring-4 ring-duo-green/40' : ''}">
                ${p.highlight ? `<div class="absolute -top-3 right-4 bg-duo-blue text-white text-xs font-black uppercase px-2 py-0.5 rounded-full">Más popular</div>` : ''}
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-2xl grid place-items-center text-white text-2xl" style="background:${p.color}">
                    ${p.id === 'free' ? '🎁' : p.id === 'plus' ? '⭐' : '👑'}
                  </div>
                  <div class="flex-1">
                    <div class="font-black text-lg">${UI.esc(p.name)}</div>
                    <div class="text-duo-gray text-sm">${UI.fmtMoney(p.price)}${p.price ? ` <span class="text-xs">/ ${p.period}</span>` : ''}</div>
                  </div>
                  ${isCurrent ? `<span class="chip bg-duo-green text-white border-duo-green">Actual</span>` : ''}
                </div>
                <ul class="space-y-1 text-sm">
                  ${p.perks.map(pk => `<li class="flex gap-2"><span class="text-duo-green font-black">✓</span> ${UI.esc(pk)}</li>`).join('')}
                </ul>
                ${!isCurrent ? `
                  <button class="btn ${p.highlight ? 'btn-blue' : p.id === 'premium' ? 'btn-purple' : 'btn-ghost'} w-full mt-3" data-choose="${p.id}">
                    ${p.price === 0 ? 'Bajar a ' : 'Suscribirse a '} ${UI.esc(p.name)}
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="text-xs text-duo-gray text-center px-4 pb-4">
          Este es un flujo de suscripción de demostración. La app real puede integrar Google Play Billing, Stripe o MercadoPago.
        </div>
      </main>

      ${UI.bnav('plan')}
    </div>
  `;
};

Views.wire.subscription = () => {
  document.querySelectorAll('[data-choose]').forEach(b => {
    b.addEventListener('click', () => {
      const planId = b.dataset.choose;
      const plan = SEED.plans.find(p => p.id === planId);
      const u = Store.currentUser();
      if (plan.price === 0) {
        Store.subscribePlan(u.id, planId);
        UI.toast('Volviste al plan gratis');
        Router.resolve();
        return;
      }
      openCheckout(plan);
    });
  });
  document.querySelector('[data-cancel-sub]')?.addEventListener('click', () => {
    UI.confirmAction('¿Cancelar tu suscripción y volver al plan gratis?', 'Cancelar plan', true).then(ok => {
      if (!ok) return;
      Store.subscribePlan(Store.currentUserId(), 'free');
      UI.toast('Suscripción cancelada');
      Router.resolve();
    });
  });
};

function openCheckout(plan) {
  UI.modal({
    size: 'lg',
    title: 'Confirmar suscripción',
    body: `
      <div class="space-y-3">
        <div class="p-3 rounded-2xl bg-duo-blue/10 flex items-center gap-3">
          <div class="text-3xl">${plan.id === 'plus' ? '⭐' : '👑'}</div>
          <div class="flex-1">
            <div class="font-black">${UI.esc(plan.name)}</div>
            <div class="text-sm">${UI.fmtMoney(plan.price)} / ${plan.period}</div>
          </div>
        </div>
        <div>
          <label class="label">Tarjeta</label>
          <input class="field" placeholder="1234 5678 9012 3456" maxlength="19" id="ck-num"/>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">Vence</label>
            <input class="field" placeholder="MM/AA" maxlength="5" id="ck-exp"/>
          </div>
          <div>
            <label class="label">CVC</label>
            <input class="field" placeholder="123" maxlength="4" id="ck-cvc"/>
          </div>
        </div>
        <div>
          <label class="label">Titular</label>
          <input class="field" placeholder="Como figura en la tarjeta" id="ck-name" value="${UI.esc(Store.currentUser().name)}"/>
        </div>
        <div class="text-xs text-duo-gray">
          🔒 Datos de prueba — no ingreses una tarjeta real. Este demo no envía nada a ningún servicio.
        </div>
      </div>
    `,
    actions: [
      { label: 'Cancelar', style: 'btn-ghost' },
      { label: `Pagar US$ ${plan.price.toFixed(2)}`, style: 'btn-green', onClick: (back) => {
        const num = back.querySelector('#ck-num').value.replace(/\s/g,'');
        const exp = back.querySelector('#ck-exp').value;
        const cvc = back.querySelector('#ck-cvc').value;
        if (num.length < 12) { UI.toast('Número inválido', 'error'); return false; }
        if (!/^\d{2}\/\d{2}$/.test(exp)) { UI.toast('Vencimiento inválido', 'error'); return false; }
        if (cvc.length < 3) { UI.toast('CVC inválido', 'error'); return false; }
        Store.subscribePlan(Store.currentUserId(), plan.id);
        UI.confetti();
        UI.toast('¡Suscripción activada!', 'success');
        Router.resolve();
      }},
    ]
  });
}

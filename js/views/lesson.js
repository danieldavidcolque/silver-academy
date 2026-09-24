/* ==========================================================
   Motor de lección interactiva.
   Tipos: choice, translate, listen, type
   ========================================================== */
window.Views = window.Views || {};

// state per lesson session
Views._lesson = null;

Views.lesson = ({ id }) => {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return ''; }
  const lesson = Store.db.lessons.find(l => l.id === id);
  if (!lesson) { UI.toast('Lección no encontrada','error'); Router.go('#/home'); return ''; }

  Views._lesson = {
    lesson,
    idx: 0,
    correct: 0,
    wrong: 0,
    heartsUsed: 0,
    finished: false,
    startedAt: Date.now(),
  };

  return `
    <div class="view min-h-screen flex flex-col safe-top">
      <header class="px-4 py-3 flex items-center gap-3 max-w-2xl mx-auto w-full">
        <button id="lesson-exit" class="text-duo-gray text-2xl leading-none w-8 h-8" aria-label="Salir">✕</button>
        <div class="flex-1 progress"><div id="lesson-bar" style="width:0%"></div></div>
        <div class="flex items-center gap-1 font-black text-duo-red">
          <span class="text-xl">♥</span><span id="lesson-hearts">${u.hearts}</span>
        </div>
      </header>
      <main id="lesson-main" class="flex-1 max-w-2xl mx-auto w-full px-4 py-4"></main>
      <footer id="lesson-footer" class="px-4 py-3 max-w-2xl mx-auto w-full safe-bottom"></footer>
    </div>
  `;
};

Views.wire.lesson = () => {
  const s = Views._lesson;
  if (!s) return;
  document.getElementById('lesson-exit').addEventListener('click', () => {
    if (s.finished) { Router.go('#/home'); return; }
    UI.confirmAction('¿Salir de la lección? Vas a perder el progreso de esta sesión.', 'Salir', true).then(ok => {
      if (ok) Router.go('#/home');
    });
  });
  render();
};

function render() {
  const s = Views._lesson;
  const step = s.lesson.steps[s.idx];
  const main = document.getElementById('lesson-main');
  const footer = document.getElementById('lesson-footer');
  const bar = document.getElementById('lesson-bar');
  bar.style.width = (s.idx / s.lesson.steps.length * 100) + '%';

  if (!step) return finish();

  if (step.type === 'choice') renderChoice(step, main, footer);
  else if (step.type === 'translate') renderTranslate(step, main, footer);
  else if (step.type === 'listen') renderListen(step, main, footer);
  else if (step.type === 'type') renderType(step, main, footer);
  else { s.idx++; render(); }
}

function renderChoice(step, main, footer) {
  main.innerHTML = `
    <div class="text-xs text-duo-gray uppercase font-black mb-2">Elegí la respuesta correcta</div>
    <h2 class="text-2xl font-black mb-6">${UI.esc(step.prompt)}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="opts">
      ${step.options.map((o, i) => `
        <button class="opt" data-i="${i}">${UI.esc(o)}</button>
      `).join('')}
    </div>
  `;
  let selected = null;
  main.querySelectorAll('.opt').forEach(b => {
    b.addEventListener('click', () => {
      main.querySelectorAll('.opt').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selected = +b.dataset.i;
      renderFooter(footer, () => grade(selected === step.answer, main));
    });
  });
  renderFooter(footer, null);
}

function renderTranslate(step, main, footer) {
  const scrambled = [...step.tokens];
  main.innerHTML = `
    <div class="text-xs text-duo-gray uppercase font-black mb-2">Ordená para formar la oración</div>
    <h2 class="text-xl font-black mb-4">${UI.esc(step.prompt)}</h2>
    <div id="answer-slots" class="min-h-[3.5rem] p-2 border-2 border-dashed border-duo-grayLight rounded-2xl flex flex-wrap gap-2 mb-4"></div>
    <div id="tokens" class="flex flex-wrap gap-2">
      ${scrambled.map((t, i) => `
        <button class="opt py-2 px-3" data-i="${i}">${UI.esc(t)}</button>
      `).join('')}
    </div>
  `;
  const chosen = [];
  const tokensEl = main.querySelector('#tokens');
  const slotsEl = main.querySelector('#answer-slots');

  function refresh() {
    slotsEl.innerHTML = chosen.length ? '' : '<span class="text-duo-gray text-sm self-center px-2">Tocá las palabras…</span>';
    chosen.forEach((tIdx, i) => {
      const b = document.createElement('button');
      b.className = 'opt py-2 px-3 !bg-duo-grayLight';
      b.textContent = scrambled[tIdx];
      b.addEventListener('click', () => {
        chosen.splice(i, 1);
        tokensEl.querySelector(`[data-i="${tIdx}"]`).style.display = '';
        refresh();
      });
      slotsEl.appendChild(b);
    });
    renderFooter(footer, chosen.length === step.tokens.length ? () => {
      const ok = chosen.every((val, i) => val === step.answer[i]);
      grade(ok, main);
    } : null);
  }

  tokensEl.querySelectorAll('.opt').forEach(b => {
    b.addEventListener('click', () => {
      const i = +b.dataset.i;
      if (chosen.includes(i)) return;
      chosen.push(i);
      b.style.display = 'none';
      refresh();
    });
  });
  refresh();
}

function renderListen(step, main, footer) {
  main.innerHTML = `
    <div class="text-xs text-duo-gray uppercase font-black mb-2">Escuchá y elegí</div>
    <h2 class="text-xl font-black mb-4">${UI.esc(step.prompt)}</h2>
    <button id="speak-btn" class="btn btn-blue mb-6 mx-auto">
      ${UI.icons.speaker} <span>Tocá para escuchar</span>
    </button>
    <div class="grid grid-cols-1 gap-3" id="opts">
      ${step.options.map((o, i) => `<button class="opt" data-i="${i}">${UI.esc(o)}</button>`).join('')}
    </div>
  `;
  const speakBtn = main.querySelector('#speak-btn');
  speakBtn.addEventListener('click', () => UI.speak(step.speak));
  setTimeout(() => UI.speak(step.speak), 300);

  let selected = null;
  main.querySelectorAll('.opt').forEach(b => {
    b.addEventListener('click', () => {
      main.querySelectorAll('.opt').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selected = +b.dataset.i;
      renderFooter(footer, () => grade(selected === step.answer, main));
    });
  });
  renderFooter(footer, null);
}

function renderType(step, main, footer) {
  main.innerHTML = `
    <div class="text-xs text-duo-gray uppercase font-black mb-2">Escribí en inglés</div>
    <h2 class="text-2xl font-black mb-6">${UI.esc(step.prompt)}</h2>
    <input type="text" id="type-input" class="field text-lg" placeholder="Tu respuesta…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
  `;
  const inp = main.querySelector('#type-input');
  inp.focus();
  function check() {
    const val = (inp.value || '').trim().toLowerCase().replace(/[.!?,]/g,'');
    grade(val === step.answer.toLowerCase(), main, inp.value);
  }
  inp.addEventListener('input', () => {
    renderFooter(footer, inp.value.trim() ? check : null);
  });
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && inp.value.trim()) check(); });
  renderFooter(footer, null);
}

function renderFooter(footer, onCheck) {
  footer.innerHTML = `
    <button id="check-btn" class="btn ${onCheck ? 'btn-green' : 'btn-ghost'} w-full" ${onCheck ? '' : 'disabled'}>
      ${onCheck ? 'Comprobar' : 'Elegí una respuesta'}
    </button>
  `;
  if (onCheck) footer.querySelector('#check-btn').addEventListener('click', onCheck);
}

function grade(ok, main, given) {
  const s = Views._lesson;
  const step = s.lesson.steps[s.idx];
  if (ok) {
    s.correct++;
    main.querySelectorAll('.opt.selected').forEach(o => o.classList.replace('selected','correct'));
    showFeedback(true, step, given);
  } else {
    s.wrong++;
    s.heartsUsed++;
    Store.loseHeart(Store.currentUserId());
    document.getElementById('lesson-hearts').textContent = Store.currentUser().hearts;
    main.querySelectorAll('.opt.selected').forEach(o => o.classList.replace('selected','wrong'));
    showFeedback(false, step, given);
  }
}

function showFeedback(ok, step, given) {
  const footer = document.getElementById('lesson-footer');
  let correctText = '';
  if (step.type === 'choice' || step.type === 'listen') correctText = step.options[step.answer];
  else if (step.type === 'translate') correctText = step.answer.map(i => step.tokens[i]).join(' ');
  else if (step.type === 'type') correctText = step.answer;

  footer.innerHTML = `
    <div class="p-4 rounded-2xl mb-3 ${ok ? 'bg-duo-green/10 text-duo-greenDark' : 'bg-duo-red/10 text-duo-red'}">
      <div class="font-black text-lg mb-1">${ok ? '¡Correcto! 🎉' : '¡Uy! Casi.'}</div>
      ${!ok ? `<div class="text-sm">Respuesta correcta: <b>${UI.esc(correctText)}</b></div>` : ''}
    </div>
    <button id="next-btn" class="btn ${ok ? 'btn-green' : 'btn-red'} w-full">Continuar</button>
  `;
  footer.querySelector('#next-btn').addEventListener('click', () => {
    Views._lesson.idx++;
    render();
  });
}

function finish() {
  const s = Views._lesson;
  s.finished = true;
  const u = Store.currentUser();
  const acc = s.lesson.steps.length ? Math.round(s.correct / s.lesson.steps.length * 100) : 100;
  Store.completeLesson(u.id, s.lesson.id, acc);
  UI.confetti();

  const main = document.getElementById('lesson-main');
  const footer = document.getElementById('lesson-footer');
  document.getElementById('lesson-bar').style.width = '100%';
  main.innerHTML = `
    <div class="flex flex-col items-center text-center gap-4 pt-6">
      <div class="text-7xl mascot">🏆</div>
      <h2 class="text-3xl font-black text-duo-green">¡Lección completa!</h2>
      <div class="grid grid-cols-3 gap-3 w-full max-w-md mt-4">
        <div class="card">
          <div class="text-xs uppercase text-duo-gray font-black">XP</div>
          <div class="text-2xl font-black text-duo-yellow">+${s.lesson.xp}</div>
        </div>
        <div class="card">
          <div class="text-xs uppercase text-duo-gray font-black">Aciertos</div>
          <div class="text-2xl font-black text-duo-green">${acc}%</div>
        </div>
        <div class="card">
          <div class="text-xs uppercase text-duo-gray font-black">Gemas</div>
          <div class="text-2xl font-black text-duo-blue">+3</div>
        </div>
      </div>
    </div>
  `;
  footer.innerHTML = `<button id="done-btn" class="btn btn-green w-full">Volver</button>`;
  footer.querySelector('#done-btn').addEventListener('click', () => Router.go('#/home'));
}

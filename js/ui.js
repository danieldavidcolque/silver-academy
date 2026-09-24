/* ==========================================================
   UI helpers: escape, toast, modal, iconos SVG, bottom nav, confetti.
   ========================================================== */
window.UI = (() => {
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#39;');
  }

  function toast(msg, type = 'default') {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = 0;
      setTimeout(() => el.remove(), 300);
    }, 1800);
  }

  function modal({ title, body, actions = [], size = 'md' }) {
    return new Promise((resolve) => {
      const root = document.getElementById('modal-root');
      const back = document.createElement('div');
      back.className = 'modal-backdrop';
      back.innerHTML = `
        <div class="modal-panel" style="max-width:${size === 'lg' ? '32rem' : '28rem'}" role="dialog" aria-modal="true">
          ${title ? `<h2 class="text-xl font-black mb-3">${esc(title)}</h2>` : ''}
          <div class="mb-4">${body || ''}</div>
          <div class="flex gap-2 flex-wrap">
            ${actions.map((a, i) => `<button data-i="${i}" class="btn ${a.style || 'btn-ghost'} flex-1">${esc(a.label)}</button>`).join('')}
          </div>
        </div>`;
      root.appendChild(back);
      const close = (val) => { back.remove(); resolve(val); };
      back.addEventListener('click', (e) => { if (e.target === back) close(null); });
      back.querySelectorAll('button[data-i]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = +btn.dataset.i;
          const a = actions[idx];
          if (a.onClick) {
            const r = a.onClick(back);
            if (r !== false) close(a.value ?? idx);
          } else close(a.value ?? idx);
        });
      });
    });
  }

  function confirmAction(text, okLabel = 'Sí, hacerlo', danger = false) {
    return modal({
      title: 'Confirmar',
      body: `<p class="text-duo-ink">${esc(text)}</p>`,
      actions: [
        { label: 'Cancelar', style: 'btn-ghost', value: false },
        { label: okLabel, style: danger ? 'btn-red' : 'btn-green', value: true },
      ],
    });
  }

  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 3 11h2v9h5v-6h4v6h5v-9h2z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2V2h-2v2H9V2H7zm12 8v10H5V10h14z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26 6.91 1L17 14.14l1.18 6.86L12 17.77 5.82 21l1.18-6.86L2 9.26l6.91-1z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v3h3v3a5 5 0 0 1-5 5h-.35A5 5 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1A5 5 0 0 1 7.35 14H7a5 5 0 0 1-5-5V6h3V3zm2 3H4v3a3 3 0 0 0 3 3zm8 6a3 3 0 0 0 3-3V6h-4v6h1z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.33 0-8 1.67-8 5v2h16v-2c0-3.33-4.67-5-8-5z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 12C19 16.5 12 21 12 21z"/></svg>',
    fire: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s4 6 4 10a4 4 0 0 1-8 0c0-2 1-3 2-4-1 3 2 3 2 0 0-2-2-4 0-6zM6 14a6 6 0 0 0 12 0c0-2-1-3-2-4 1 4-3 5-3 1 0 4-4 4-4 0 0 2-3 3-3 3z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12l4 6-10 14L2 8z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v3H5v12h14V10h-2V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm3-3h6v2h4v2H5V6h4z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12 3.4 13.4 9 19l12-12-1.4-1.4z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h5a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zm11 3a3 3 0 0 1 3-3h5v14h-5a3 3 0 0 0-3 3V7z"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l1.4-1.4-3.6-3.6H21v-2H7.8l3.6-3.6L10 5l-6 6zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-6 5 6 4-3-1 12H4z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94a7 7 0 0 0 0-1.88l2-1.55-2-3.46-2.36.8a7 7 0 0 0-1.63-.95l-.35-2.5h-4l-.35 2.5a7 7 0 0 0-1.63.95l-2.36-.8-2 3.46 2 1.55a7 7 0 0 0 0 1.88l-2 1.55 2 3.46 2.36-.8a7 7 0 0 0 1.63.95l.35 2.5h4l.35-2.5a7 7 0 0 0 1.63-.95l2.36.8 2-3.46zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z"/></svg>',
  };

  function bnav(active) {
    const items = [
      { key: 'home',    label: 'Aprender', href: '#/home',    icon: icons.home },
      { key: 'schedule',label: 'Clases 1‑1', href: '#/schedule', icon: icons.calendar },
      { key: 'rank',    label: 'Ranking', href: '#/leaderboard', icon: icons.trophy },
      { key: 'plan',    label: 'Suscripción', href: '#/subscription', icon: icons.gem },
      { key: 'me',      label: 'Perfil',  href: '#/profile', icon: icons.user },
    ];
    return `
      <nav class="bnav">
        <div class="bnav-inner">
          ${items.map(i => `
            <a href="${i.href}" class="${active === i.key ? 'active' : ''}" data-nav="${i.key}">
              ${i.icon}
              <span>${i.label}</span>
            </a>
          `).join('')}
        </div>
      </nav>`;
  }

  function bnavTeacher(active) {
    const items = [
      { key: 'content',  label: 'Contenido', href: '#/teacher/content',  icon: icons.book },
      { key: 'students', label: 'Alumnos',   href: '#/teacher/students', icon: icons.user },
      { key: 'agenda',   label: 'Agenda',    href: '#/teacher/agenda',   icon: icons.calendar },
      { key: 'me',       label: 'Perfil',    href: '#/profile',          icon: icons.settings },
    ];
    return `
      <nav class="bnav">
        <div class="bnav-inner" style="grid-template-columns: repeat(4, 1fr)">
          ${items.map(i => `
            <a href="${i.href}" class="${active === i.key ? 'active' : ''}" data-nav="${i.key}">
              ${i.icon}
              <span>${i.label}</span>
            </a>
          `).join('')}
        </div>
      </nav>`;
  }

  function confetti() {
    const colors = ['#3C3B6E','#B22234','#FFC800','#FFFFFF','#5E5D91','#D93A4F'];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      p.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }
  }

  /* --------- TTS forzado a inglés AMERICANO ---------
     El navegador por defecto suele elegir en-GB. Acá filtramos voces
     por lang="en-US" y priorizamos las voces americanas conocidas de
     Google (Android/Chrome), Microsoft (Edge/Windows) y Apple (iOS/Mac).
     -------------------------------------------------- */
  let _voicesReady = null;
  function loadVoices() {
    if (_voicesReady) return _voicesReady;
    _voicesReady = new Promise((resolve) => {
      const now = window.speechSynthesis.getVoices();
      if (now && now.length) return resolve(now);
      const handler = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener('voiceschanged', handler);
      // fallback si el evento nunca dispara
      setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 1500);
    });
    return _voicesReady;
  }

  const AMERICAN_VOICE_PATTERNS = [
    /Google US English/i,
    /Microsoft Aria/i,
    /Microsoft Jenny/i,
    /Microsoft Guy/i,
    /Microsoft Davis/i,
    /Microsoft Zira/i,
    /Microsoft David/i,
    /Samantha/i,
    /Alex/i,
    /Fred/i,
    /Victoria/i,
    /^en[-_]US/i,
  ];

  let _chosenVoice = null;

  async function pickAmericanVoice() {
    if (_chosenVoice) return _chosenVoice;
    const voices = await loadVoices();
    if (!voices || !voices.length) return null;
    const isUS = (v) => (v.lang || '').toLowerCase().replace('_','-').startsWith('en-us');
    // 1) voces preferidas + en-US
    for (const rx of AMERICAN_VOICE_PATTERNS) {
      const v = voices.find(v => (rx.test(v.name) || rx.test(v.lang)) && isUS(v));
      if (v) { _chosenVoice = v; return v; }
    }
    // 2) primera voz que declare en-US
    const usAny = voices.find(isUS);
    if (usAny) { _chosenVoice = usAny; return usAny; }
    // 3) última red: cualquier "en", pero explícitamente evitando en-GB si hay alternativas
    const nonGb = voices.filter(v => /^en/i.test(v.lang) && !/en[-_]GB/i.test(v.lang));
    if (nonGb.length) { _chosenVoice = nonGb[0]; return nonGb[0]; }
    return voices.find(v => /^en/i.test(v.lang)) || null;
  }

  async function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      const voice = await pickAmericanVoice();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) { console.warn('speak error', e); }
  }

  // Diagnóstico para el usuario: qué voz está usando el navegador.
  async function currentVoiceName() {
    const v = await pickAmericanVoice();
    return v ? `${v.name} (${v.lang})` : 'sin voz disponible';
  }

  // Warmup: cargar voces apenas se puedan (algunos navegadores requieren
  // interacción del usuario antes; igual guardamos para evitar delay).
  if ('speechSynthesis' in window) {
    loadVoices();
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  function fmtTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }
  function fmtMoney(n) {
    if (n === 0) return 'Gratis';
    return 'US$ ' + n.toFixed(2);
  }
  function levelPill(code) {
    return `<span class="level-pill level-${code}">${code}</span>`;
  }

  return { esc, toast, modal, confirmAction, icons, bnav, bnavTeacher, confetti, speak, currentVoiceName, fmtDate, fmtTime, fmtMoney, levelPill };
})();

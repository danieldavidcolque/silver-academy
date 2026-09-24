/* ==========================================================
   Vistas de auth: welcome, login, register
   ========================================================== */
window.Views = window.Views || {};

function usFlag() {
  return `
    <svg viewBox="0 0 60 40" class="w-16 h-10 rounded overflow-hidden shadow-md" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#fff"/>
      ${Array.from({length:7}).map((_,i) => `<rect x="0" y="${i*40/13*2+40/13}" width="60" height="${40/13}" fill="#B22234"/>`).join('')}
      <rect x="0" y="0" width="24" height="${40/13*7}" fill="#3C3B6E"/>
      <g fill="#fff" font-family="Arial" font-size="4">
        ${Array.from({length:5}).map((_,r) => Array.from({length:6}).map((_,c) =>
          `<text x="${2+c*4}" y="${5+r*4}">★</text>`
        ).join('')).join('')}
      </g>
    </svg>`;
}

Views.welcome = () => {
  const flag = usFlag();

  return `
    <div class="view min-h-screen flex flex-col safe-top">
      <div class="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <img src="icons/logo.png" alt="Silver Academy" class="brand-logo brand-logo-lg mascot"/>
        <div class="text-center">
          <h1 class="text-4xl font-black leading-tight tracking-tight" style="color: var(--usa-blue)">Silver Academy</h1>
          <div class="mt-2 flex items-center justify-center gap-2 text-xs font-black tracking-[0.3em] uppercase" style="color: var(--usa-red)">
            <span>★</span><span>American English</span><span>★</span>
          </div>
          <div class="text-[10px] font-black tracking-[0.25em] text-duo-gray uppercase mt-1">English Services</div>
        </div>
        <p class="text-lg max-w-sm" style="color: var(--ink)">
          Aprendé <span style="color: var(--usa-red); font-weight: 900">inglés estadounidense</span> con lecciones cortas, divertidas y adaptadas a tu nivel.
        </p>
        <div class="flex flex-wrap gap-3 justify-center my-2">
          ${['A1','A2','B1','B2','C1','C2'].map(c => `<span class="level-pill level-${c}">${c}</span>`).join('')}
        </div>
        <div class="flex flex-col w-full max-w-xs gap-3 mt-4">
          <a href="#/register" class="btn btn-green">Empezá gratis</a>
          <a href="#/login" class="btn btn-ghost">Ya tengo cuenta</a>
        </div>
        <div class="mt-4 flex items-center gap-3 text-sm text-duo-gray">
          ${usFlag()}
          <span>English (US) · Español (interfaz)</span>
        </div>
      </div>
      <div class="p-4 text-center text-xs text-duo-gray flag-ribbon">
        v1.0 · PWA · Instalable en Android desde el menú del navegador
      </div>
    </div>
  `;
};

Views.login = () => `
  <div class="view min-h-screen flex flex-col safe-top">
    <header class="p-4 flex items-center">
      <a href="#/welcome" class="text-duo-gray font-black">←</a>
    </header>
    <div class="flex-1 flex flex-col items-center justify-center px-6 gap-6 max-w-md w-full mx-auto">
      <img src="icons/logo.png" alt="Silver Academy" class="brand-logo brand-logo-md mascot"/>
      <h1 class="text-2xl font-black">Ingresá</h1>
      <form id="login-form" class="w-full flex flex-col gap-3">
        <div>
          <label class="label">Email</label>
          <input required type="email" name="email" class="field" placeholder="tu@email.com" />
        </div>
        <div>
          <label class="label">Contraseña</label>
          <input required type="password" name="pass" class="field" placeholder="••••••••" />
        </div>
        <button class="btn btn-green mt-2" type="submit">Entrar</button>
      </form>
      <div class="text-sm text-duo-gray text-center">
        ¿No tenés cuenta? <a href="#/register" class="text-duo-blue font-black">Registrate</a>
      </div>
      <details class="w-full text-xs text-duo-gray card">
        <summary class="cursor-pointer font-black">Cuentas demo</summary>
        <div class="mt-2 space-y-1">
          <div><b>Estudiante:</b> demo@silveracademy.app / 1234</div>
          <div><b>Profesor:</b> profe@silveracademy.app / 1234</div>
        </div>
      </details>
    </div>
  </div>
`;

Views.register = () => `
  <div class="view min-h-screen flex flex-col safe-top">
    <header class="p-4 flex items-center">
      <a href="#/welcome" class="text-duo-gray font-black">←</a>
    </header>
    <div class="flex-1 flex flex-col items-center px-6 gap-5 max-w-md w-full mx-auto pb-10">
      <img src="icons/logo.png" alt="Silver Academy" class="brand-logo brand-logo-md mascot"/>
      <h1 class="text-2xl font-black">Crear cuenta</h1>
      <form id="register-form" class="w-full flex flex-col gap-3">
        <div>
          <label class="label">Nombre</label>
          <input required name="name" class="field" placeholder="Tu nombre"/>
        </div>
        <div>
          <label class="label">Email</label>
          <input required type="email" name="email" class="field" placeholder="tu@email.com"/>
        </div>
        <div>
          <label class="label">Contraseña</label>
          <input required minlength="4" type="password" name="pass" class="field" placeholder="Al menos 4 caracteres"/>
        </div>
        <div>
          <label class="label">¿Cómo vas a usar Silver Academy?</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="opt cursor-pointer" data-role="student">
              <input type="radio" name="role" value="student" class="sr-only" checked>
              <div class="text-3xl mb-1">🎓</div>
              <div>Estudiante</div>
            </label>
            <label class="opt cursor-pointer" data-role="teacher">
              <input type="radio" name="role" value="teacher" class="sr-only">
              <div class="text-3xl mb-1">👩‍🏫</div>
              <div>Profesor</div>
            </label>
          </div>
        </div>
        <button class="btn btn-green mt-2" type="submit">Crear cuenta</button>
      </form>
      <div class="text-sm text-duo-gray text-center">
        ¿Ya tenés cuenta? <a href="#/login" class="text-duo-blue font-black">Ingresá</a>
      </div>
    </div>
  </div>
`;

Views.wire = Views.wire || {};

Views.wire.login = () => {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const r = Store.login(fd.get('email').trim(), fd.get('pass'));
    if (r.error) return UI.toast(r.error, 'error');
    UI.toast('¡Bienvenido/a!', 'success');
    Router.go(r.user.role === 'teacher' ? '#/teacher/content' : '#/home');
  });
};

Views.wire.register = () => {
  const form = document.getElementById('register-form');
  if (!form) return;
  form.querySelectorAll('label[data-role]').forEach(lab => {
    lab.addEventListener('click', () => {
      form.querySelectorAll('label[data-role]').forEach(l => l.classList.remove('selected'));
      lab.classList.add('selected');
      lab.querySelector('input').checked = true;
    });
  });
  form.querySelector('label[data-role="student"]').classList.add('selected');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const r = Store.register({
      name: fd.get('name').trim(),
      email: fd.get('email').trim(),
      pass: fd.get('pass'),
      role: fd.get('role'),
    });
    if (r.error) return UI.toast(r.error, 'error');
    UI.toast('Cuenta creada ✅', 'success');
    Router.go(r.user.role === 'teacher' ? '#/teacher/content' : '#/home');
  });
};

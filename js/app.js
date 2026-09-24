/* ==========================================================
   Bootstrap: registra rutas y arranca la app.
   ========================================================== */
(function () {

  function guard(fn, opts = {}) {
    return async (params, query) => {
      const u = Store.currentUser();
      if (opts.auth && !u) { Router.go('#/welcome'); return ''; }
      if (opts.role && u && u.role !== opts.role) {
        // redirect teachers away from student pages and vice versa
        Router.go(u.role === 'teacher' ? '#/teacher/content' : '#/home');
        return '';
      }
      const html = await fn(params, query);
      // schedule wire on next tick
      setTimeout(() => {
        const wireKey = opts.wire || fn.name || '';
        const wire = Views.wire[wireKey];
        if (typeof wire === 'function') wire(params, query);
      }, 0);
      return html;
    };
  }

  // Public
  Router.on('/welcome',      guard(Views.welcome,      { wire: 'welcome' }));
  Router.on('/login',        guard(Views.login,        { wire: 'login' }));
  Router.on('/register',     guard(Views.register,     { wire: 'register' }));

  // Student
  Router.on('/home',         guard(Views.home,         { auth: true, wire: 'home' }));
  Router.on('/lesson/:id',   guard(Views.lesson,       { auth: true, wire: 'lesson' }));
  Router.on('/profile',      guard(Views.profile,      { auth: true, wire: 'profile' }));
  Router.on('/leaderboard',  guard(Views.leaderboard,  { auth: true, wire: 'leaderboard' }));
  Router.on('/schedule',     guard(Views.schedule,     { auth: true, wire: 'schedule' }));
  Router.on('/subscription', guard(Views.subscription, { auth: true, wire: 'subscription' }));

  // Teacher
  Router.on('/teacher/content',   guard(Views.teacherContent,  { auth: true, role: 'teacher', wire: 'teacherContent' }));
  Router.on('/teacher/new',       guard(Views.teacherNew,      { auth: true, role: 'teacher', wire: 'teacherNew' }));
  Router.on('/teacher/edit/:id',  guard(Views.teacherEdit,     { auth: true, role: 'teacher', wire: 'teacherEdit' }));
  Router.on('/teacher/students',  guard(Views.teacherStudents, { auth: true, role: 'teacher', wire: 'teacherStudents' }));
  Router.on('/teacher/agenda',    guard(Views.teacherAgenda,   { auth: true, role: 'teacher', wire: 'teacherAgenda' }));

  // Kick off
  if (!location.hash) location.hash = '#/welcome';
  Router.resolve();

  // Re-render on store changes (updates counters, etc. when nav'ing back)
  // We rely on manual Router.resolve() on data changes to avoid loops.

  // Prevent zoom on double tap for a more app-like feel
  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) e.preventDefault();
    lastTap = now;
  }, { passive: false });

})();

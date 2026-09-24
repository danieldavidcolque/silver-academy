/* ==========================================================
   Store: persistencia en localStorage + suscripción reactiva.
   ========================================================== */
window.Store = (() => {
  const KEY = 'silver-academy-db-v2';
  const AUTH_KEY = 'silver-academy-auth-v2';
  const listeners = new Set();

  let db;

  function seed() {
    db = {
      levels: SEED.LEVELS,
      plans:  SEED.plans,
      lessons: SEED.lessons.map(l => ({ ...l })),
      users: SEED.users.map(u => ({ ...u })),
      progress: {},   // { userId: { lessonId: {done:true, bestScore, doneAt} } }
      slots: SEED.slots.map(s => ({ ...s })),
      subs:  {},      // { userId: { plan, sinceISO, nextBillISO } }
      seedAt: Date.now(),
      version: 1,
    };
    save();
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { seed(); return; }
      db = JSON.parse(raw);
      if (!db.version) { seed(); return; }
    } catch (e) {
      console.warn('DB corrupt, reseeding', e);
      seed();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { console.warn(e); }
    listeners.forEach(fn => fn());
  }

  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  /* -------- auth -------- */
  function currentUserId() {
    try { return localStorage.getItem(AUTH_KEY) || null; } catch { return null; }
  }
  function setCurrentUser(id) {
    if (id) localStorage.setItem(AUTH_KEY, id);
    else localStorage.removeItem(AUTH_KEY);
    listeners.forEach(fn => fn());
  }
  function currentUser() {
    const id = currentUserId();
    return id ? db.users.find(u => u.id === id) : null;
  }

  function login(email, pass) {
    const u = db.users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.pass === pass);
    if (!u) return { error: 'Email o contraseña inválidos' };
    setCurrentUser(u.id);
    return { user: u };
  }
  function register({ name, email, pass, role }) {
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Ese email ya está registrado' };
    }
    const avatars = ['🦊','🐼','🐨','🐧','🦁','🐯','🐸','🐰','🐢','🦄','🐙','🐵'];
    const u = {
      id: 'u_' + Math.random().toString(36).slice(2, 9),
      email, pass, name, role,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      createdAt: Date.now(),
      plan: 'free', streak: 0, xp: 0, gems: 5, hearts: 5,
      targetLevel: 'A1',
    };
    db.users.push(u);
    setCurrentUser(u.id);
    save();
    return { user: u };
  }
  function logout() { setCurrentUser(null); }

  /* -------- progress -------- */
  function progressFor(userId) {
    if (!db.progress[userId]) db.progress[userId] = {};
    return db.progress[userId];
  }
  function completeLesson(userId, lessonId, score) {
    const p = progressFor(userId);
    const prev = p[lessonId];
    p[lessonId] = { done: true, bestScore: Math.max(prev?.bestScore || 0, score), doneAt: Date.now() };
    const lesson = db.lessons.find(l => l.id === lessonId);
    const u = db.users.find(x => x.id === userId);
    if (u && lesson) {
      u.xp = (u.xp || 0) + lesson.xp;
      u.gems = (u.gems || 0) + 3;
      // racha: si su último día es != hoy, aumentar
      const last = u.lastActive ? new Date(u.lastActive) : null;
      const today = new Date(); today.setHours(0,0,0,0);
      const isNewDay = !last || (last.setHours(0,0,0,0), last.getTime() !== today.getTime());
      if (isNewDay) u.streak = (u.streak || 0) + 1;
      u.lastActive = Date.now();
    }
    save();
  }
  function loseHeart(userId) {
    const u = db.users.find(x => x.id === userId);
    if (!u) return;
    u.hearts = Math.max(0, (u.hearts || 5) - 1);
    save();
  }
  function refillHearts(userId) {
    const u = db.users.find(x => x.id === userId);
    if (!u) return;
    u.hearts = 5;
    save();
  }

  /* -------- lecciones (CRUD profesor) -------- */
  function upsertLesson(lesson) {
    const idx = db.lessons.findIndex(l => l.id === lesson.id);
    if (idx >= 0) db.lessons[idx] = lesson;
    else db.lessons.push(lesson);
    save();
  }
  function deleteLesson(id) {
    db.lessons = db.lessons.filter(l => l.id !== id);
    save();
  }
  function lessonsForLevel(code) {
    return db.lessons.filter(l => l.level === code);
  }

  /* -------- slots / bookings -------- */
  function upsertSlot(slot) {
    const idx = db.slots.findIndex(s => s.id === slot.id);
    if (idx >= 0) db.slots[idx] = slot;
    else db.slots.push(slot);
    save();
  }
  function deleteSlot(id) {
    db.slots = db.slots.filter(s => s.id !== id);
    save();
  }
  function bookSlot(slotId, userId, note) {
    const s = db.slots.find(x => x.id === slotId);
    if (!s) return { error: 'Slot inexistente' };
    if (s.status !== 'open') return { error: 'Ya reservado' };
    s.status = 'booked';
    s.studentId = userId;
    s.note = note || null;
    save();
    return { slot: s };
  }
  function cancelBooking(slotId) {
    const s = db.slots.find(x => x.id === slotId);
    if (!s) return;
    s.status = 'open';
    s.studentId = null;
    s.note = null;
    save();
  }

  /* -------- subscription -------- */
  function subscribePlan(userId, planId) {
    const u = db.users.find(x => x.id === userId);
    if (!u) return;
    u.plan = planId;
    const now = new Date();
    const next = new Date(now); next.setMonth(now.getMonth() + 1);
    db.subs[userId] = { plan: planId, sinceISO: now.toISOString(), nextBillISO: next.toISOString() };
    save();
  }

  function reset() {
    if (!confirm('¿Reiniciar todo el contenido y usuarios a los valores por defecto? Esta acción no se puede deshacer.')) return;
    localStorage.removeItem(KEY);
    localStorage.removeItem(AUTH_KEY);
    seed();
    location.hash = '#/welcome';
    location.reload();
  }

  load();

  return {
    get db() { return db; },
    save, subscribe,
    login, register, logout, currentUser, currentUserId, setCurrentUser,
    progressFor, completeLesson, loseHeart, refillHearts,
    upsertLesson, deleteLesson, lessonsForLevel,
    upsertSlot, deleteSlot, bookSlot, cancelBooking,
    subscribePlan,
    reset,
  };
})();

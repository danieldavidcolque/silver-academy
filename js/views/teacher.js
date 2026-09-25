/* ==========================================================
   Módulo Profesor
     - #/teacher/content   → CRUD de lecciones agrupadas por nivel
     - #/teacher/edit/:id  → editor de lección (+ ejercicios)
     - #/teacher/new       → crea nueva lección
     - #/teacher/students  → lista de alumnos con progreso
     - #/teacher/agenda    → gestión de slots 1‑a‑1
   ========================================================== */
window.Views = window.Views || {};

function requireTeacher() {
  const u = Store.currentUser();
  if (!u) { Router.go('#/welcome'); return null; }
  if (u.role !== 'teacher') { Router.go('#/home'); return null; }
  return u;
}

/* -------- Content list -------- */
Views.teacherContent = () => {
  const u = requireTeacher(); if (!u) return '';
  const byLevel = {};
  SEED.LEVELS.forEach(L => byLevel[L.code] = Store.lessonsForLevel(L.code));

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-3 sticky top-0 bg-white z-10 border-b border-duo-grayLight">
        <div class="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div class="text-xs uppercase text-duo-gray font-black">Panel del profesor</div>
            <h1 class="text-2xl font-black">Contenido</h1>
          </div>
          <a href="#/teacher/new" class="btn btn-green btn-sm">${UI.icons.plus} Nueva</a>
        </div>
      </header>
      <main class="max-w-2xl mx-auto px-4 space-y-6">
        ${SEED.LEVELS.map(L => `
          <section>
            <div class="flex items-center gap-2 mb-2">
              ${UI.levelPill(L.code)}
              <div>
                <div class="font-black">${UI.esc(L.name)}</div>
                <div class="text-xs text-duo-gray">${UI.esc(L.desc)}</div>
              </div>
              <div class="ml-auto text-xs font-black text-duo-gray">${byLevel[L.code].length} lección(es)</div>
            </div>
            <div class="space-y-2">
              ${byLevel[L.code].map(l => `
                <div class="card flex items-center gap-3">
                  <div class="text-2xl">${l.icon || '📘'}</div>
                  <div class="flex-1">
                    <div class="font-black">${UI.esc(l.title)}</div>
                    <div class="text-xs text-duo-gray">${l.steps.length} ejercicio(s) · +${l.xp} XP</div>
                  </div>
                  <a href="#/teacher/edit/${encodeURIComponent(l.id)}" class="btn btn-ghost btn-sm">${UI.icons.edit}</a>
                  <button class="btn btn-ghost btn-sm text-duo-red" data-del="${l.id}">${UI.icons.trash}</button>
                </div>
              `).join('') || `
                <a href="#/teacher/new?level=${L.code}" class="card block text-center text-duo-gray hover:border-duo-green">
                  + Agregar la primera lección de ${L.code}
                </a>
              `}
            </div>
          </section>
        `).join('')}
      </main>
      ${UI.bnavTeacher('content')}
    </div>
  `;
};

Views.wire.teacherContent = () => {
  document.querySelectorAll('[data-del]').forEach(b => {
    b.addEventListener('click', async () => {
      const l = Store.db.lessons.find(x => x.id === b.dataset.del);
      if (!l) return;
      const ok = await UI.confirmAction(`¿Eliminar la lección "${l.title}"?`, 'Eliminar', true);
      if (!ok) return;
      Store.deleteLesson(l.id);
      UI.toast('Lección eliminada');
      Router.resolve();
    });
  });
};

/* -------- New / Edit lesson -------- */
Views._editing = null;

Views.teacherNew = (params, query) => {
  const u = requireTeacher(); if (!u) return '';
  const level = (query && query.level) || 'A1';
  Views._editing = {
    id: 'l_' + Math.random().toString(36).slice(2, 8),
    level, title: '', icon: '📘', xp: 20, steps: [], _isNew: true,
  };
  return renderEditor();
};

Views.teacherEdit = ({ id }) => {
  const u = requireTeacher(); if (!u) return '';
  const l = Store.db.lessons.find(x => x.id === id);
  if (!l) { Router.go('#/teacher/content'); return ''; }
  Views._editing = JSON.parse(JSON.stringify(l));
  return renderEditor();
};

function renderEditor() {
  const l = Views._editing;
  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-3 sticky top-0 bg-white z-10 border-b border-duo-grayLight">
        <div class="max-w-2xl mx-auto flex items-center gap-3">
          <a href="#/teacher/content" class="text-duo-gray text-xl">←</a>
          <div class="flex-1">
            <div class="text-xs uppercase text-duo-gray font-black">${l._isNew ? 'Nueva lección' : 'Editando'}</div>
            <h1 class="text-lg font-black">${UI.esc(l.title || 'Sin título')}</h1>
          </div>
          <button id="save-lesson" class="btn btn-green btn-sm">Guardar</button>
        </div>
      </header>
      <main class="max-w-2xl mx-auto px-4 space-y-4">
        <div class="card space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-2">
              <label class="label">Título</label>
              <input id="e-title" class="field" value="${UI.esc(l.title)}" placeholder="Ej: Saludos"/>
            </div>
            <div>
              <label class="label">Emoji</label>
              <input id="e-icon" class="field text-center text-2xl" value="${UI.esc(l.icon)}" maxlength="4"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="label">Nivel</label>
              <select id="e-level" class="field">
                ${SEED.LEVELS.map(L => `<option value="${L.code}" ${l.level === L.code ? 'selected' : ''}>${L.code} · ${L.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="label">XP al completar</label>
              <input id="e-xp" type="number" min="5" max="200" class="field" value="${l.xp}"/>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-black">Ejercicios (${l.steps.length})</h2>
            <div class="flex gap-1 flex-wrap">
              <button data-add="choice" class="btn btn-ghost btn-sm">+ Choice</button>
              <button data-add="translate" class="btn btn-ghost btn-sm">+ Traducir</button>
              <button data-add="listen" class="btn btn-ghost btn-sm">+ Listening</button>
              <button data-add="type" class="btn btn-ghost btn-sm">+ Escribir</button>
            </div>
          </div>
          <div id="steps-list" class="space-y-3">
            ${l.steps.map((s,i) => renderStep(s,i)).join('') ||
              '<div class="card text-center text-duo-gray">Sin ejercicios. Agregá uno arriba.</div>'}
          </div>
        </div>

        ${!l._isNew ? `
          <button id="delete-lesson" class="btn btn-red w-full mt-4">${UI.icons.trash} Eliminar lección</button>
        ` : ''}
      </main>
      ${UI.bnavTeacher('content')}
    </div>
  `;
}

function renderStep(s, i) {
  if (s.type === 'choice' || s.type === 'listen') {
    return `
      <div class="card" data-step-idx="${i}">
        <div class="flex justify-between mb-2">
          <div class="chip">${i+1}. ${s.type === 'choice' ? 'Elegir opción' : 'Escuchar y elegir'}</div>
          <button class="text-duo-red font-black" data-remove-step="${i}">✕</button>
        </div>
        <label class="label">Enunciado</label>
        <input class="field mb-2" data-field="prompt" value="${UI.esc(s.prompt)}" placeholder="Ej: ¿Cómo se dice 'Hola'?"/>
        ${s.type === 'listen' ? `
          <label class="label">Texto a escuchar (inglés)</label>
          <input class="field mb-2" data-field="speak" value="${UI.esc(s.speak || '')}" placeholder="Ej: Hello, how are you?"/>
          <div class="p-3 rounded-xl mb-2" style="background: rgba(60,59,110,0.08); border: 2px solid var(--usa-blue-light)">
            <div class="text-xs font-black uppercase mb-2" style="color: var(--usa-blue)">
              🎧 Audio del ejercicio ${s.audioData ? '(usando grabación del profe)' : '(usando voz americana del sistema)'}
            </div>
            <div class="flex gap-2 flex-wrap">
              <button type="button" class="btn btn-ghost btn-sm" data-preview-tts>▶ Preview voz USA</button>
              ${s.audioData ? `
                <button type="button" class="btn btn-ghost btn-sm" data-play-custom>🎤 Escuchar mi grabación</button>
                <button type="button" class="btn btn-ghost btn-sm" style="color: var(--usa-red)" data-delete-audio>🗑 Borrar grabación</button>
              ` : ''}
              <button type="button" class="btn btn-red btn-sm" data-record>🔴 ${s.audioData ? 'Regrabar' : 'Grabar mi voz'}</button>
            </div>
            <div class="text-xs mt-2 text-duo-gray">
              ${s.audioData
                ? 'Al reproducir en la clase, se usará tu grabación.'
                : 'Sin grabación. En clase suena la voz americana del navegador.'}
            </div>
          </div>
        ` : ''}
        <label class="label">Opciones (marcá la correcta)</label>
        <div class="space-y-2">
          ${(s.options || []).map((o, oi) => `
            <div class="flex gap-2 items-center">
              <input type="radio" name="ans-${i}" data-answer="${oi}" ${s.answer === oi ? 'checked' : ''}/>
              <input class="field flex-1" data-option="${oi}" value="${UI.esc(o)}"/>
              <button class="text-duo-red" data-remove-option="${oi}">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-ghost btn-sm mt-2" data-add-option>+ Opción</button>
      </div>
    `;
  }
  if (s.type === 'translate') {
    return `
      <div class="card" data-step-idx="${i}">
        <div class="flex justify-between mb-2">
          <div class="chip">${i+1}. Ordenar oración</div>
          <button class="text-duo-red font-black" data-remove-step="${i}">✕</button>
        </div>
        <label class="label">Enunciado</label>
        <input class="field mb-2" data-field="prompt" value="${UI.esc(s.prompt)}" placeholder="Ej: Ordená: 'I am Ana'"/>
        <label class="label">Palabras (una por línea, en el orden correcto)</label>
        <textarea class="field" rows="3" data-field="answer-lines" placeholder="I\nam\nAna">${(s.answer || []).map(i => (s.tokens || [])[i] || '').join('\n')}</textarea>
        <div class="text-xs text-duo-gray mt-1">Se mezclarán al presentarlo al estudiante.</div>
      </div>
    `;
  }
  if (s.type === 'type') {
    return `
      <div class="card" data-step-idx="${i}">
        <div class="flex justify-between mb-2">
          <div class="chip">${i+1}. Escribir traducción</div>
          <button class="text-duo-red font-black" data-remove-step="${i}">✕</button>
        </div>
        <label class="label">Enunciado</label>
        <input class="field mb-2" data-field="prompt" value="${UI.esc(s.prompt)}" placeholder="Ej: Traducí: 'Adiós'"/>
        <label class="label">Respuesta esperada (inglés)</label>
        <input class="field" data-field="answer" value="${UI.esc(s.answer || '')}" placeholder="goodbye"/>
      </div>
    `;
  }
  return '';
}

Views.wire.teacherNew = () => wireEditor();
Views.wire.teacherEdit = () => wireEditor();

function wireEditor() {
  const l = Views._editing;
  if (!l) return;

  // meta fields
  const bind = (id, field, transform) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => l[field] = transform ? transform(el.value) : el.value);
  };
  bind('e-title', 'title');
  bind('e-icon', 'icon');
  bind('e-level', 'level');
  bind('e-xp', 'xp', v => parseInt(v, 10) || 20);

  document.querySelectorAll('[data-add]').forEach(b => {
    b.addEventListener('click', () => {
      const t = b.dataset.add;
      if (t === 'choice') l.steps.push({ type:'choice', prompt:'', options:['',''], answer:0 });
      else if (t === 'listen') l.steps.push({ type:'listen', prompt:'Escuchá y elegí', speak:'', options:['',''], answer:0 });
      else if (t === 'translate') l.steps.push({ type:'translate', prompt:'Ordená la oración', tokens:[], answer:[] });
      else if (t === 'type') l.steps.push({ type:'type', prompt:'', answer:'' });
      rerenderSteps();
    });
  });

  wireStepEvents();

  document.getElementById('save-lesson').addEventListener('click', saveLesson);
  document.getElementById('delete-lesson')?.addEventListener('click', async () => {
    const ok = await UI.confirmAction('¿Eliminar esta lección?', 'Eliminar', true);
    if (!ok) return;
    Store.deleteLesson(l.id);
    UI.toast('Lección eliminada');
    Router.go('#/teacher/content');
  });
}

function rerenderSteps() {
  const l = Views._editing;
  const list = document.getElementById('steps-list');
  if (!list) return;
  list.innerHTML = l.steps.map((s,i) => renderStep(s,i)).join('') ||
    '<div class="card text-center text-duo-gray">Sin ejercicios. Agregá uno arriba.</div>';
  wireStepEvents();
}

function wireStepEvents() {
  const l = Views._editing;
  document.querySelectorAll('[data-step-idx]').forEach(card => {
    const i = +card.dataset.stepIdx;
    const s = l.steps[i];

    card.querySelector('[data-remove-step]')?.addEventListener('click', () => {
      l.steps.splice(i, 1);
      rerenderSteps();
    });

    card.querySelectorAll('[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const f = inp.dataset.field;
        if (f === 'answer-lines') {
          const tokens = inp.value.split('\n').map(t => t.trim()).filter(Boolean);
          s.tokens = tokens;
          s.answer = tokens.map((_, idx) => idx);
        } else {
          s[f] = inp.value;
        }
      });
    });

    // options for choice/listen
    card.querySelectorAll('[data-option]').forEach(inp => {
      inp.addEventListener('input', () => {
        s.options[+inp.dataset.option] = inp.value;
      });
    });
    card.querySelectorAll('[data-answer]').forEach(inp => {
      inp.addEventListener('change', () => {
        if (inp.checked) s.answer = +inp.dataset.answer;
      });
    });
    card.querySelectorAll('[data-remove-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        const oi = +btn.dataset.removeOption;
        s.options.splice(oi, 1);
        if (s.answer === oi) s.answer = 0;
        else if (s.answer > oi) s.answer--;
        rerenderSteps();
      });
    });
    card.querySelector('[data-add-option]')?.addEventListener('click', () => {
      s.options.push('');
      rerenderSteps();
    });

    // ---- Audio handlers para ejercicios de listening ----
    card.querySelector('[data-preview-tts]')?.addEventListener('click', () => {
      if (!s.speak?.trim()) return UI.toast('Escribí primero el texto a escuchar', 'error');
      UI.speak(s.speak);
    });
    card.querySelector('[data-play-custom]')?.addEventListener('click', () => {
      if (!s.audioData) return;
      const audio = new Audio(s.audioData);
      audio.play().catch(() => UI.toast('No se pudo reproducir', 'error'));
    });
    card.querySelector('[data-delete-audio]')?.addEventListener('click', async () => {
      const ok = await UI.confirmAction('¿Borrar la grabación custom y volver a la voz del sistema?', 'Borrar', true);
      if (!ok) return;
      s.audioData = null;
      rerenderSteps();
    });
    card.querySelector('[data-record]')?.addEventListener('click', (e) => {
      startRecordingFlow(s, e.currentTarget);
    });
  });
}

/* ---------- Grabación de audio ---------- */
let _recorder = null;
let _recordingBtn = null;

async function startRecordingFlow(step, btn) {
  if (_recorder) {
    // ya grabando → detener
    stopRecordingFlow();
    return;
  }
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    return UI.toast('Tu navegador no soporta grabación de audio', 'error');
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimes = ['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg'];
    const mime = mimes.find(m => MediaRecorder.isTypeSupported(m)) || '';
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
      // limite ~2MB por grabación para evitar reventar localStorage
      if (blob.size > 2 * 1024 * 1024) {
        UI.toast('Grabación muy larga (máx ~2 MB). Intentá una más corta.', 'error');
        _recorder = null;
        return;
      }
      const b64 = await blobToBase64(blob);
      step.audioData = b64;
      _recorder = null;
      _recordingBtn = null;
      UI.toast('Grabación guardada ✓', 'success');
      rerenderSteps();
    };
    rec.start();
    _recorder = rec;
    _recordingBtn = btn;
    btn.textContent = '⏹ Detener grabación';
    btn.classList.add('animate-pulse');
  } catch (err) {
    console.error(err);
    UI.toast('No se pudo acceder al micrófono. ¿Diste permiso?', 'error');
  }
}

function stopRecordingFlow() {
  if (_recorder && _recorder.state !== 'inactive') {
    _recorder.stop();
  }
  if (_recordingBtn) {
    _recordingBtn.classList.remove('animate-pulse');
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function saveLesson() {
  const l = Views._editing;
  if (!l.title.trim()) return UI.toast('Poné un título','error');
  if (!l.steps.length) return UI.toast('Agregá al menos un ejercicio','error');
  // validaciones básicas por tipo
  for (const [i, s] of l.steps.entries()) {
    if (!s.prompt || !s.prompt.trim()) return UI.toast(`Ejercicio ${i+1}: falta enunciado`, 'error');
    if (s.type === 'choice' || s.type === 'listen') {
      if (!s.options || s.options.length < 2 || s.options.some(o => !o.trim()))
        return UI.toast(`Ejercicio ${i+1}: 2+ opciones no vacías`, 'error');
      if (s.type === 'listen' && !s.speak?.trim())
        return UI.toast(`Ejercicio ${i+1}: falta texto a escuchar`, 'error');
    } else if (s.type === 'translate') {
      if (!s.tokens || s.tokens.length < 2)
        return UI.toast(`Ejercicio ${i+1}: mínimo 2 palabras`, 'error');
    } else if (s.type === 'type') {
      if (!s.answer?.trim())
        return UI.toast(`Ejercicio ${i+1}: falta respuesta esperada`, 'error');
    }
  }
  delete l._isNew;
  Store.upsertLesson(l);
  UI.toast('Guardado ✅', 'success');
  Router.go('#/teacher/content');
}

/* -------- Students list -------- */
Views.teacherStudents = () => {
  const u = requireTeacher(); if (!u) return '';
  const students = Store.db.users.filter(x => x.role === 'student');

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-3">
        <div class="max-w-2xl mx-auto">
          <div class="text-xs uppercase text-duo-gray font-black">Panel del profesor</div>
          <h1 class="text-2xl font-black">Alumnos (${students.length})</h1>
        </div>
      </header>
      <main class="max-w-2xl mx-auto px-4 space-y-2">
        ${students.map(s => {
          const p = Store.progressFor(s.id);
          const doneCount = Object.values(p).filter(x => x.done).length;
          return `
            <div class="card flex items-center gap-3">
              <div class="text-3xl">${UI.esc(s.avatar)}</div>
              <div class="flex-1">
                <div class="font-black">${UI.esc(s.name)}</div>
                <div class="text-xs text-duo-gray">
                  Nivel ${s.targetLevel || 'A1'} · Plan ${UI.esc((s.plan||'free').toUpperCase())} · 🔥 ${s.streak||0} · ${s.xp||0} XP
                </div>
              </div>
              <div class="text-right">
                <div class="font-black text-duo-green">${doneCount}</div>
                <div class="text-xs text-duo-gray uppercase font-black">lecciones</div>
              </div>
            </div>
          `;
        }).join('') || `<div class="card text-center text-duo-gray">Todavía no hay alumnos.</div>`}
      </main>
      ${UI.bnavTeacher('students')}
    </div>
  `;
};

Views.wire.teacherStudents = () => {};

/* -------- Agenda profesor -------- */
Views.teacherAgenda = () => {
  const u = requireTeacher(); if (!u) return '';
  const now = new Date();
  const slots = Store.db.slots
    .filter(s => new Date(s.startISO) > now)
    .sort((a,b) => new Date(a.startISO) - new Date(b.startISO));

  const groups = {};
  slots.forEach(s => {
    const key = new Date(s.startISO).toDateString();
    (groups[key] = groups[key] || []).push(s);
  });

  return `
    <div class="view with-bnav">
      <header class="safe-top px-4 pb-3">
        <div class="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div class="text-xs uppercase text-duo-gray font-black">Panel del profesor</div>
            <h1 class="text-2xl font-black">Agenda 1‑a‑1</h1>
          </div>
          <button id="add-slot" class="btn btn-green btn-sm">${UI.icons.plus} Nuevo horario</button>
        </div>
      </header>
      <main class="max-w-2xl mx-auto px-4 space-y-4">
        ${Object.keys(groups).length ? Object.entries(groups).map(([d, list]) => `
          <section>
            <div class="font-black mb-2 capitalize">${UI.fmtDate(list[0].startISO)}</div>
            <div class="space-y-2">
              ${list.map(s => {
                const st = Store.db.users.find(u => u.id === s.studentId);
                const booked = s.status === 'booked';
                return `
                  <div class="card ${booked ? 'border-duo-blue' : ''} flex items-center gap-3">
                    <div class="text-2xl">${booked ? '📚' : '⏰'}</div>
                    <div class="flex-1">
                      <div class="font-black">${UI.fmtTime(s.startISO)} · ${s.durationMin} min</div>
                      <div class="text-xs text-duo-gray">
                        ${booked ? `Reservado por <b>${UI.esc(st?.name || '—')}</b>${s.note ? ` — "${UI.esc(s.note)}"` : ''}` : 'Disponible'}
                      </div>
                    </div>
                    ${booked
                      ? `<button class="btn btn-ghost btn-sm text-duo-red" data-cancel="${s.id}">Liberar</button>`
                      : `<button class="btn btn-ghost btn-sm text-duo-red" data-del-slot="${s.id}">Quitar</button>`}
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        `).join('') : `<div class="card text-center text-duo-gray">No hay horarios futuros. Agregá el primero.</div>`}
      </main>
      ${UI.bnavTeacher('agenda')}
    </div>
  `;
};

Views.wire.teacherAgenda = () => {
  document.getElementById('add-slot')?.addEventListener('click', openAddSlot);
  document.querySelectorAll('[data-del-slot]').forEach(b => {
    b.addEventListener('click', async () => {
      const ok = await UI.confirmAction('¿Eliminar este horario?', 'Eliminar', true);
      if (!ok) return;
      Store.deleteSlot(b.dataset.delSlot);
      Router.resolve();
    });
  });
  document.querySelectorAll('[data-cancel]').forEach(b => {
    b.addEventListener('click', async () => {
      const ok = await UI.confirmAction('¿Cancelar esta reserva y liberar el horario?', 'Sí', true);
      if (!ok) return;
      Store.cancelBooking(b.dataset.cancel);
      UI.toast('Horario liberado');
      Router.resolve();
    });
  });
};

function openAddSlot() {
  const today = new Date();
  const iso = today.toISOString().slice(0,10);
  UI.modal({
    title: 'Nuevo horario',
    body: `
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">Fecha</label>
            <input id="ns-date" type="date" class="field" value="${iso}" min="${iso}"/>
          </div>
          <div>
            <label class="label">Hora</label>
            <input id="ns-time" type="time" class="field" value="10:00"/>
          </div>
        </div>
        <div>
          <label class="label">Duración (min)</label>
          <input id="ns-dur" type="number" class="field" value="30" min="15" step="15"/>
        </div>
      </div>
    `,
    actions: [
      { label: 'Cancelar', style: 'btn-ghost' },
      { label: 'Crear', style: 'btn-green', onClick: (back) => {
        const d = back.querySelector('#ns-date').value;
        const t = back.querySelector('#ns-time').value;
        const dur = parseInt(back.querySelector('#ns-dur').value, 10);
        if (!d || !t || !dur) { UI.toast('Datos incompletos','error'); return false; }
        const start = new Date(`${d}T${t}:00`);
        if (isNaN(start.getTime()) || start < new Date()) { UI.toast('Fecha inválida', 'error'); return false; }
        Store.upsertSlot({
          id: 's_' + Date.now(),
          teacherId: Store.currentUserId(),
          startISO: start.toISOString(),
          durationMin: dur,
          status: 'open', studentId: null, note: null,
        });
        UI.toast('Horario creado','success');
        Router.resolve();
      }},
    ]
  });
}

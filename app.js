'use strict';
/* One More Rep (1+R) — versión pública de pruebas.
   Estructura: Programa › Fases › Días › Ejercicios.
   Todo se guarda en el teléfono de cada usuario (localStorage).
   Premium está simulado: se activa desde Ajustes para probar. */

const BRAND = 'One More Rep';
const KEY = 'omr.v1';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const TECHS = ['Normal', 'Forzadas', 'Rest-pause', 'Negativas'];
const PRESETS = ['Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Fase 5', 'Fase 6'];
const GROUPS = ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Pierna', 'Core', 'Otro'];
const RADAR = ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Pierna', 'Core'];
const DEF_SETTINGS = { step: 2.5, stepLb: 5, restWarm: 60, restEff: 120 };
const FREE_DAYS = 3;
const APP_VER = 'V5';
const C = { acc: '#C8FF2E', ok: '#4DD7FF', bad: '#F2A0A0', grid: '#2E2F34', mu: '#A3A3A8', tx: '#F4F1EC', card: '#1C1D20' };
// Tonos neón: el color de "progresaste" (ok) cambia para no confundirse con el neón elegido
const NEONS = [
  { id: 'volt', name: 'Volt', acc: '#C8FF2E', accT: '#D4FF5C', wBg: '#1A220C', wBd: '#3B4E14', wTx: '#D9F29A', nTx: '#E8F5C8', done: '#5E7A1A', ok: '#4DD7FF', okBg: '#0E2A33' },
  { id: 'cian', name: 'Cian', acc: '#2EF2FF', accT: '#6CF6FF', wBg: '#0B2226', wBd: '#145059', wTx: '#A6F3F8', nTx: '#D3F9FB', done: '#1A6A73', ok: '#B8F04A', okBg: '#1E2A0C' },
  { id: 'magenta', name: 'Magenta', acc: '#FF3DCB', accT: '#FF6ED8', wBg: '#2A0F22', wBd: '#5E1F4D', wTx: '#F6B5E5', nTx: '#FBD9F1', done: '#7A2A63', ok: '#4DD7FF', okBg: '#0E2A33' },
  { id: 'naranja', name: 'Naranja', acc: '#FF6A1A', accT: '#FF8A4C', wBg: '#2A1A10', wBd: '#5A3018', wTx: '#E7B595', nTx: '#F1D9C8', done: '#8A4A26', ok: '#7EE2A8', okBg: '#123222' },
  { id: 'violeta', name: 'Violeta', acc: '#A98BFF', accT: '#BFA8FF', wBg: '#1C1530', wBd: '#3E2F6B', wTx: '#D3C6FF', nTx: '#E6DEFF', done: '#4F3F8A', ok: '#7EE2A8', okBg: '#123222' }
];
function applyNeon() {
  const t = NEONS.find(n => n.id === (db.settings.neon || 'volt')) || NEONS[0];
  const s = document.documentElement.style;
  [['--acc', t.acc], ['--acc-t', t.accT], ['--warm-bg', t.wBg], ['--warm-bd', t.wBd], ['--warm-tx', t.wTx], ['--note-tx', t.nTx], ['--done', t.done], ['--ok', t.ok], ['--ok-bg', t.okBg]].forEach(([k, v]) => s.setProperty(k, v));
  C.acc = t.acc; C.ok = t.ok;
}

const ICON = {
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  check: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  checkSm: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  up: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  trash: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  chev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9H3z"/></svg>',
  chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19l5-6 4 3 7-9"/></svg>',
  gear: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
  crown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/></svg>',
  lock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Premium"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
};
const CHART_TYPES = [
  { id: 'lineas', label: 'Líneas', icon: 'M4 18l5-6 4 3 7-8', pro: false, per: true },
  { id: 'columnas', label: 'Columnas', icon: 'M6 20V12M12 20V6M18 20v-9', pro: false, per: true },
  { id: 'barras', label: 'Barras', icon: 'M4 6h12M4 12h16M4 18h8', pro: true, per: false },
  { id: 'radar', label: 'Radar', icon: 'M12 3l8 6-3 10H7L4 9z', pro: true, per: false },
  { id: 'dispersion', label: 'Dispersión', icon: 'M6 17h.01M10 12h.01M14 15h.01M17 7h.01M19 11h.01', pro: true, per: true },
  { id: 'tabla', label: 'Tabla', icon: 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14', pro: false, per: true }
];

/* ---------- utilidades ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v, d) => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : d; };
const fmt = n => String(Math.round(n * 100) / 100);
const r1 = n => Math.round(n * 10) / 10;
const roundTo = (n, s) => Math.max(0, Math.round(n / s) * s);
const isoOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const todayISO = () => isoOf(new Date());
const parseISO = iso => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
const fdate = iso => { const d = parseISO(iso); return d.getDate() + ' ' + MESES[d.getMonth()]; };
const fdateY = iso => fdate(iso) + ' ' + parseISO(iso).getFullYear();
const addDays = (iso, n) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return isoOf(d); };
const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);
const $ = s => document.querySelector(s);
const pad2 = n => String(n).padStart(2, '0');
const fmtDur = sec => { const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? `${h}:${pad2(m)}:${pad2(s)}` : `${m}:${pad2(s)}`; };
const fmtMin = sec => Math.round(sec / 60) + ' min';
const fmtTime = ms => new Date(ms).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });

const LB = 0.45359237;
const conv = (w, from, to) => from === to ? w : from === 'lb' ? w * LB : w / LB;
const other = u => u === 'lb' ? 'kg' : 'lb';
const unitOf = x => (x && x.unit) || 'kg';
const stepFor = u => u === 'lb' ? (db.settings.stepLb || 5) : db.settings.step;
const wLabel = (w, u) => w > 0 ? `${u} · ≈ ${fmt(r1(conv(w, u, other(u))))} ${other(u)}` : u;
const lastEffIn = (l, u) => ({ w: r1(conv(l.eff.w, unitOf(l), u)), r: l.eff.r });

/* ---------- enfoques (plantillas) ---------- */
// [nombre, grupo, repMin, repMax, unidad, notas]
const TEMPLATES = [
  { id: 'clasico', name: 'Clásico', pro: false, desc: 'La base: 3 días, 1–2 calentamientos y una serie al fallo por ejercicio.', days: 3, weeks: 8, cycles: 8, plan: [
    ['Pecho y espalda', [['Aperturas con mancuernas', 'Pecho', 6, 10, 'lb', 'Enlazar con el press inclinado, sin descanso.'], ['Press inclinado en máquina', 'Pecho', 6, 10, 'kg', ''], ['Pullover en máquina', 'Espalda', 6, 10, 'kg', 'Enlazar con el jalón, sin descanso.'], ['Jalón al pecho agarre cerrado', 'Espalda', 6, 10, 'kg', ''], ['Remo con barra', 'Espalda', 6, 10, 'kg', '']]],
    ['Piernas', [['Extensiones de pierna', 'Pierna', 8, 15, 'kg', 'Enlazar con la prensa, sin descanso.'], ['Prensa de piernas', 'Pierna', 8, 15, 'kg', ''], ['Curl femoral', 'Pierna', 6, 10, 'kg', ''], ['Elevación de pantorrilla de pie', 'Pierna', 12, 20, 'kg', '']]],
    ['Hombros y brazos', [['Elevaciones laterales con mancuernas', 'Hombro', 6, 10, 'lb', ''], ['Elevaciones posteriores', 'Hombro', 6, 10, 'lb', ''], ['Curl con barra Z', 'Bíceps', 6, 10, 'lb', ''], ['Extensión de tríceps en polea', 'Tríceps', 6, 10, 'kg', 'Enlazar con fondos, sin descanso.'], ['Fondos en paralelas', 'Tríceps', 3, 8, 'kg', 'Si no llegas a 3, haz solo negativas lentas.']]]
  ] },
  { id: 'maquinas', name: 'Máquinas y mancuernas', pro: true, desc: 'La misma división con otros ángulos y equipo.', days: 3, weeks: 8, cycles: 8, plan: [
    ['Pecho y espalda', [['Pec deck', 'Pecho', 6, 10, 'kg', 'Enlazar con el press en máquina.'], ['Press de pecho en máquina', 'Pecho', 6, 10, 'kg', ''], ['Pullover con mancuerna', 'Espalda', 8, 12, 'lb', ''], ['Remo en máquina', 'Espalda', 6, 10, 'kg', ''], ['Jalón agarre amplio', 'Espalda', 6, 10, 'kg', '']]],
    ['Piernas', [['Extensiones unilaterales', 'Pierna', 8, 15, 'kg', ''], ['Sentadilla hack', 'Pierna', 8, 12, 'kg', ''], ['Curl femoral sentado', 'Pierna', 6, 10, 'kg', ''], ['Pantorrilla en prensa', 'Pierna', 12, 20, 'kg', '']]],
    ['Hombros y brazos', [['Press militar en máquina', 'Hombro', 6, 10, 'kg', ''], ['Elevación lateral en polea', 'Hombro', 8, 12, 'kg', ''], ['Curl martillo con mancuernas', 'Bíceps', 6, 10, 'lb', ''], ['Press francés con mancuernas', 'Tríceps', 6, 10, 'lb', '']]]
  ] },
  { id: 'ppl', name: 'Empuje / Jalón / Pierna', pro: true, desc: '3 sesiones por empuje, jalón y pierna: cada músculo descansa más días.', days: 3, weeks: 8, cycles: 8, plan: [
    ['Empuje', [['Aperturas en polea', 'Pecho', 6, 10, 'kg', 'Enlazar con el press inclinado.'], ['Press inclinado con mancuernas', 'Pecho', 6, 10, 'lb', ''], ['Elevaciones laterales', 'Hombro', 6, 10, 'lb', ''], ['Extensión de tríceps sobre la cabeza', 'Tríceps', 6, 10, 'kg', '']]],
    ['Jalón', [['Pullover en máquina', 'Espalda', 6, 10, 'kg', 'Enlazar con el jalón.'], ['Jalón al pecho', 'Espalda', 6, 10, 'kg', ''], ['Remo con mancuerna', 'Espalda', 6, 10, 'lb', ''], ['Curl con barra', 'Bíceps', 6, 10, 'kg', '']]],
    ['Pierna', [['Extensiones de pierna', 'Pierna', 8, 15, 'kg', 'Enlazar con la sentadilla.'], ['Sentadilla', 'Pierna', 8, 12, 'kg', ''], ['Curl femoral', 'Pierna', 6, 10, 'kg', ''], ['Pantorrilla sentado', 'Pierna', 12, 20, 'kg', '']]]
  ] },
  { id: 'consol', name: 'Consolidación', pro: true, desc: 'Pocos ejercicios, solo compuestos. Para subir fuerza y recuperarte.', days: 2, weeks: 8, cycles: 10, plan: [
    ['Día A', [['Sentadilla', 'Pierna', 8, 12, 'kg', ''], ['Jalón agarre cerrado', 'Espalda', 6, 10, 'kg', ''], ['Fondos con peso', 'Tríceps', 6, 10, 'kg', '']]],
    ['Día B', [['Peso muerto', 'Espalda', 5, 8, 'kg', 'Técnica estricta. Si te cuesta recuperarte, hazlo cada dos ciclos.'], ['Press militar', 'Hombro', 6, 10, 'kg', ''], ['Curl con barra', 'Bíceps', 6, 10, 'kg', '']]]
  ] },
  { id: 'torso', name: 'Torso / Pierna', pro: true, desc: 'Dos versiones de torso y dos de pierna, alternadas.', days: 4, weeks: 8, cycles: 6, plan: [
    ['Torso A', [['Press inclinado con barra', 'Pecho', 6, 10, 'kg', ''], ['Remo con barra', 'Espalda', 6, 10, 'kg', ''], ['Elevaciones laterales', 'Hombro', 6, 10, 'lb', ''], ['Curl con barra Z', 'Bíceps', 6, 10, 'lb', ''], ['Extensión de tríceps en polea', 'Tríceps', 6, 10, 'kg', '']]],
    ['Pierna A', [['Sentadilla', 'Pierna', 8, 12, 'kg', ''], ['Curl femoral', 'Pierna', 6, 10, 'kg', ''], ['Pantorrilla de pie', 'Pierna', 12, 20, 'kg', '']]],
    ['Torso B', [['Press de pecho en máquina', 'Pecho', 6, 10, 'kg', ''], ['Jalón al pecho', 'Espalda', 6, 10, 'kg', ''], ['Elevaciones posteriores', 'Hombro', 6, 10, 'lb', ''], ['Curl martillo', 'Bíceps', 6, 10, 'lb', ''], ['Fondos en paralelas', 'Tríceps', 3, 8, 'kg', '']]],
    ['Pierna B', [['Prensa de piernas', 'Pierna', 8, 15, 'kg', ''], ['Peso muerto rumano', 'Pierna', 6, 10, 'kg', ''], ['Extensiones de pierna', 'Pierna', 8, 15, 'kg', '']]]
  ] },
  { id: 'avanzado', name: 'Intensidad avanzada', pro: true, desc: 'Negativas, rest-pause y forzadas. Para cuando ya tienes varios meses de base.', days: 3, weeks: 6, cycles: 6, plan: [
    ['Pecho y espalda', [['Aperturas en pec deck', 'Pecho', 6, 10, 'kg', 'Rest-pause: al fallo, descansa 10–15 s y saca 1–2 reps más.'], ['Press inclinado en máquina', 'Pecho', 6, 10, 'kg', 'Negativas: baja en 4–6 s.'], ['Jalón al pecho', 'Espalda', 6, 10, 'kg', 'Forzadas: 1–2 reps con ayuda.']]],
    ['Piernas', [['Extensiones de pierna', 'Pierna', 8, 15, 'kg', 'Rest-pause al final.'], ['Prensa de piernas', 'Pierna', 8, 15, 'kg', 'Negativas en las últimas 2 reps.'], ['Curl femoral', 'Pierna', 6, 10, 'kg', '']]],
    ['Hombros y brazos', [['Elevaciones laterales', 'Hombro', 6, 10, 'lb', 'Rest-pause.'], ['Curl con barra Z', 'Bíceps', 6, 10, 'lb', 'Negativas: baja en 4–6 s.'], ['Fondos en paralelas', 'Tríceps', 3, 8, 'kg', 'Forzadas o negativas.']]]
  ] }
];
const tplById = id => TEMPLATES.find(t => t.id === id);

/* ---------- datos ---------- */
function seed() {
  return { v: 1, onboarded: false, premium: false, template: null, programName: 'Mi programa', programs: [], routines: [], sessions: [], current: null, settings: Object.assign({}, DEF_SETTINGS) };
}
function buildFromTemplate(t) {
  const routines = t.plan.map(([dn, exs], i) => ({
    id: uid() + 'd' + i, name: dn,
    exercises: exs.map(([n, g, a, b, u, notes], k) => ({ id: uid() + 'x' + i + k, name: n, group: g, repMin: a, repMax: b, unit: u, notes, warmups: 1 }))
  }));
  return {
    routines,
    phase: { id: uid() + 'p', name: 'Fase 1 · ' + t.name, weeks: t.weeks, cycles: t.cycles, days: t.days, start: todayISO(), routineIds: routines.map(r => r.id), state: 'active', restAfter: false }
  };
}
function validate(d) {
  if (!d || d.v !== 1 || !Array.isArray(d.routines) || !Array.isArray(d.sessions)) return null;
  d.programs = d.programs || [];
  d.settings = Object.assign({}, DEF_SETTINGS, d.settings);
  return d;
}
function fixCurrent(d) {
  const c = d && d.current;
  if (c && c.acc === undefined) { c.acc = 0; c.runAt = c.startedAt || null; c.firstAt = c.startedAt || null; delete c.startedAt; }
  return d;
}
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = fixCurrent(validate(JSON.parse(raw))); if (d) return d; } } catch (e) { /* sin acceso */ }
  return seed();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('No se pudo guardar en este teléfono'); }
}

let db = load();
applyNeon();
const ui = {
  view: !db.onboarded ? 'welcome' : db.current ? 'train' : 'home',
  planId: null, form: null, summary: null, rest: null, tick: null, keep: false,
  tpl: 'clasico', ch: { type: 'lineas', ex: null, range: 'todo', sel: null }, proBack: 'home', plan: 'anual'
};
const isPro = () => !!db.premium;

const routine = id => db.routines.find(r => r.id === id);
const phaseById = id => db.programs.find(p => p.id === id);
const activePhase = () => db.programs.find(p => p.state === 'active') || null;
const plannedPhases = () => db.programs.filter(p => p.state === 'planned');
const phaseDays = p => p ? p.routineIds.map(routine).filter(Boolean) : [];
const beats = (a, b) => a.w > b.w || (a.w === b.w && a.r > b.r);

function stats(p) {
  const ss = db.sessions.filter(s => s.programId === p.id);
  const rs = phaseDays(p);
  const counts = rs.map(r => ss.filter(s => s.routineId === r.id).length);
  const cyclesDone = rs.length ? Math.min.apply(null, counts) : 0;
  const elapsed = Math.max(0, daysBetween(p.start || todayISO(), todayISO()));
  const byTime = elapsed >= p.weeks * 7;
  const byCycles = cyclesDone >= p.cycles;
  return {
    counts, cyclesDone, byTime, byCycles, done: byTime || byCycles,
    week: Math.min(p.weeks, Math.floor(elapsed / 7) + 1),
    timePct: Math.min(100, elapsed / (p.weeks * 7) * 100),
    cyclePct: Math.min(100, cyclesDone / p.cycles * 100)
  };
}
function nextDay(p) {
  const rs = phaseDays(p);
  if (!rs.length) return null;
  const st = stats(p);
  const i = st.counts.findIndex(c => c <= st.cyclesDone);
  return rs[i >= 0 ? i : 0];
}
const dayNum = rid => { const p = activePhase(); const i = p ? p.routineIds.indexOf(rid) : -1; return i >= 0 ? i + 1 : null; };
function lastEntry(exId) {
  for (let i = db.sessions.length - 1; i >= 0; i--) {
    const s = db.sessions[i];
    const e = s.entries.find(x => x.exerciseId === exId);
    if (e) return Object.assign({ date: s.date }, e);
  }
  return null;
}
function lastSessionOf(rid) {
  for (let i = db.sessions.length - 1; i >= 0; i--) if (db.sessions[i].routineId === rid) return db.sessions[i];
  return null;
}
function lastInfo(rid) {
  const s = lastSessionOf(rid);
  if (!s) return '';
  return ' · última vez ' + fdate(s.date) + (s.durationSec ? ' · duró ' + fmtMin(s.durationSec) : '');
}
function history(exId) {
  const out = [];
  db.sessions.forEach(s => s.entries.forEach(e => { if (e.exerciseId === exId) out.push({ date: s.date, programId: s.programId, w: e.eff.w, r: e.eff.r, unit: unitOf(e) }); }));
  return out;
}
function exById(id) {
  for (const r of db.routines) { const x = r.exercises.find(e => e.id === id); if (x) return x; }
  return null;
}
const ejs = n => n + (n === 1 ? ' ejercicio' : ' ejercicios');
const cur = () => db.current.entries[db.current.idx];

/* ---------- catálogo de ejercicios (compartidos entre días) ---------- */
// Un mismo ejercicio puede estar en varios días con el mismo id: comparte nombre, grupo, unidad e historial.
// Reps objetivo, notas y calentamientos siguen siendo de cada día.
const normName = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const STOP = new Set(['con', 'de', 'en', 'la', 'el', 'los', 'las', 'a', 'al', 'y', 'del', 'para', 'por']);
const dupKey = s => normName(s).split(' ').filter(w => w && !STOP.has(w)).map(w => w.length > 3 ? w.replace(/(es|s)$/, '') : w).sort().join(' ');
const GROUP_RULES = [
  ['Hombro', /pec ?deck invers|apertura\w* invers|invers\w* .*apertura|pajaro|reverse fly/],
  ['Pierna', /femoral|pierna|prensa|sentadilla|pantorrilla|gemelo|desplante|zancada|hip ?thrust|glute|aductor|abductor|rumano|rigida|cuadricep|extension de rodilla|hack|bulgara/],
  ['Tríceps', /tricep|fondo|frances|patada|rompecraneo|copa/],
  ['Hombro', /jalon a la cara|face ?pull|lateral|posterior|militar|hombro|deltoide|arnold|frontal|menton|press de hombro|pajaro/],
  ['Espalda', /jalon|remo|dominada|peso muerto|espalda|hiperextension|encogimiento|pull ?over con polea|dorsal/],
  ['Bíceps', /bicep|curl|martillo|predicador/],
  ['Pecho', /pecho|banca|apertura|pec ?deck|cruce|inclinado|declinado|lagartija|pullover|pectoral|press de pecho/],
  ['Core', /abdominal|crunch|plancha|core|oblicuo|rueda|elevacion de piernas/]
];
function guessGroup(name) {
  const k = normName(name);
  const c = CATALOGO.find(x => normName(x.n) === k);
  if (c) return c.g;
  const r = GROUP_RULES.find(([, re]) => re.test(k));
  return r ? r[0] : 'Otro';
}
// Nombres que se fusionaron en otro ejercicio: así no se vuelven a crear ni a sugerir del catálogo
const aliasesOf = id => ((db.settings.aliases || {})[id]) || [];
// Índice de nombres propios (con alias) para búsquedas rápidas
function ownIndex() {
  const m = new Map();
  catalog().forEach(c => { m.set(normName(c.name), c); aliasesOf(c.id).forEach(a => { if (!m.has(normName(a))) m.set(normName(a), c); }); });
  return m;
}
function ownByName(n) {
  const k = normName(n);
  return catalog().find(c => normName(c.name) === k || aliasesOf(c.id).some(a => normName(a) === k)) || null;
}
// Asigna grupo a los ejercicios que no tienen, una sola vez
function fillGroups() {
  let ch = false;
  db.routines.forEach(r => r.exercises.forEach(x => {
    if (!x.group || !GROUPS.includes(x.group) || (x.group === 'Otro' && !db.settings.groupsV4)) { const g = guessGroup(x.name); if (g !== x.group) { x.group = g; ch = true; } }
  }));
  if (!db.settings.groupsV4) { db.settings.groupsV4 = true; ch = true; }
  if (!db.settings.aliases) { db.settings.aliases = {}; ch = true; }
  if (ch) save();
}
function catalog() {
  const map = new Map();
  db.routines.forEach(r => r.exercises.forEach(x => {
    let c = map.get(x.id);
    if (!c) { c = { id: x.id, name: x.name, group: x.group || 'Otro', unit: unitOf(x), days: [], n: 0, last: null }; map.set(x.id, c); }
    if (!c.days.includes(r.name)) c.days.push(r.name);
  }));
  db.sessions.forEach(s => s.entries.forEach(e => {
    let c = map.get(e.exerciseId);
    if (!c) { c = { id: e.exerciseId, name: e.name, group: guessGroup(e.name), unit: unitOf(e), days: [], n: 0, last: null }; map.set(e.exerciseId, c); }
    c.n++; c.last = s.date;
  }));
  const all = [...map.values()], keys = {};
  all.forEach(c => { const k = dupKey(c.name); (keys[k] = keys[k] || []).push(c.id); });
  all.forEach(c => { c.dups = keys[dupKey(c.name)].filter(id => id !== c.id); });
  return all.sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
const catInfo = c => (c.days.length ? c.days.join(' · ') : 'En ningún día') + ' · ' + (c.n ? c.n + (c.n === 1 ? ' sesión' : ' sesiones') : 'sin sesiones');
function setShared(id, fields) {
  db.routines.forEach(r => r.exercises.forEach(x => { if (x.id === id) Object.assign(x, fields); }));
  if (fields.name) {
    db.sessions.forEach(s => s.entries.forEach(e => { if (e.exerciseId === id) e.name = fields.name; }));
    if (db.current) db.current.entries.forEach(e => { if (e.exerciseId === id) e.name = fields.name; });
  }
}
function addExerciseToDay(r, id) {
  if (r.exercises.some(x => x.id === id)) { toast('Ese ejercicio ya está en este día'); return false; }
  let src = null;
  db.routines.forEach(rr => rr.exercises.forEach(x => { if (!src && x.id === id) src = x; }));
  const c = src ? null : catalog().find(x => x.id === id);
  r.exercises.push(src ? Object.assign({}, src) : { id, name: c.name, group: c.group, unit: c.unit, warmups: 1 });
  return true;
}
function mergeExercise(srcId, dstId) {
  const cat = catalog(), dst = cat.find(c => c.id === dstId), src = cat.find(c => c.id === srcId);
  const al = db.settings.aliases || (db.settings.aliases = {});
  if (src && dst) {
    al[dstId] = [...new Set([...(al[dstId] || []), src.name, ...(al[srcId] || [])])].filter(a => normName(a) !== normName(dst.name));
    if (dst.group === 'Otro' && src.group !== 'Otro') { dst.group = src.group; setShared(dstId, { group: src.group }); }
  }
  delete al[srcId];
  const move = e => { if (e.exerciseId === srcId) { e.exerciseId = dstId; e.name = dst.name; } };
  db.sessions.forEach(s => s.entries.forEach(move));
  if (db.current) db.current.entries.forEach(move);
  db.routines.forEach(r => {
    const hasDst = r.exercises.some(x => x.id === dstId);
    r.exercises = r.exercises.filter(x => !(x.id === srcId && hasDst));
    r.exercises.forEach(x => { if (x.id === srcId) Object.assign(x, { id: dstId, name: dst.name, group: dst.group, unit: dst.unit }); });
  });
}
/* ---------- catálogo de ejercicios del gimnasio ---------- */
const CAT_GROUPS = ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Pierna', 'Core'];
const catAllowed = c => c.b || isPro();
const CAT_BASIC = CATALOGO.filter(c => c.b).length;
function addCatToDay(c) {
  const r = routine(ui.planId); if (!r) return false;
  const ex = ownByName(c.n);
  if (ex) return addExerciseToDay(r, ex.id);
  r.exercises.push({ id: uid(), name: c.n, group: c.g, unit: catUnit(c.e), equip: c.e, warmups: 1 });
  return true;
}
function catRow(c, inDay) {
  const ok = catAllowed(c);
  return `<button class="sugg" data-a="useCat" data-n="${esc(c.n)}" ${inDay ? 'disabled' : ''}><span class="col"><span style="font-weight:600">${esc(c.n)}</span><span class="muted sm">${esc(c.g)} · ${esc(c.e)}</span></span>${inDay ? '<span class="tag">En el día ✓</span>' : ok ? '<span class="use">Agregar</span>' : '<span class="tag-pro">PREMIUM</span>'}</button>`;
}
function catViewBody() {
  const f = ui.cf, r = routine(ui.planId), q = normName(f.q || '');
  const dayIds = new Set((r ? r.exercises : []).map(x => x.id));
  const own = ownIndex();
  const dayNames = { has: k => { const e = own.get(k); return !!(e && dayIds.has(e.id)); } };
  let list = CATALOGO.filter(c => (f.g === 'Todos' || c.g === f.g) && (f.e === 'Todo' || c.e === f.e) && (!q || normName(c.n).includes(q)));
  if (!isPro()) list = list.filter(c => c.b).concat(list.filter(c => !c.b));
  if (!list.length) return `<div class="card muted">Ningún ejercicio del catálogo coincide. Puedes crearlo tú desde Planear día.</div>`;
  const locked = list.filter(c => !catAllowed(c)).length;
  let h = `<span class="muted sm">${list.length} ejercicios${locked ? ` · ${locked} con Premium` : ''}</span>`;
  h += `<div class="card" style="padding:4px 14px;gap:0">${list.map(c => catRow(c, dayNames.has(normName(c.n)))).join('')}</div>`;
  if (locked) h += `<button class="card upsell" data-a="premium"><div class="col"><span style="font-weight:700">Desbloquea el catálogo completo</span><span class="sm" style="color:var(--warm-tx)">${CATALOGO.length} ejercicios con Premium · gratis tienes ${CAT_BASIC} básicos</span></div>${ICON.chev}</button>`;
  return h;
}
function vCatView() {
  const r = routine(ui.planId);
  if (!r) { ui.view = 'home'; return vHome(); }
  const f = ui.cf;
  const b = `<input id="catq2" class="inp" placeholder="Buscar en el catálogo" value="${esc(f.q || '')}" aria-label="Buscar en el catálogo" autocomplete="off">
  <div class="hscroll" role="group" aria-label="Grupo muscular">${['Todos'].concat(CAT_GROUPS).map(g => `<button class="chip ${f.g === g ? 'on' : ''}" data-a="cfG" data-v="${g}" aria-pressed="${f.g === g}">${g}</button>`).join('')}</div>
  <div class="hscroll" role="group" aria-label="Equipo">${['Todo'].concat(EQUIPOS).map(e => `<button class="chip ${f.e === e ? 'on' : ''}" data-a="cfE" data-v="${e}" aria-pressed="${f.e === e}">${e}</button>`).join('')}</div>
  <div id="catBody" class="col" style="gap:10px">${catViewBody()}</div>`;
  return screen({ title: 'Catálogo', sub: 'Agregar a ' + r.name, back: 'plan', body: b, foot: `<button class="btn acc lg full" data-a="go" data-v="plan">Listo</button>` });
}
function suggHtml(q) {
  const r = routine(ui.planId); if (!r) return '';
  const nq = normName(q), all = catalog(), inDay = new Set(r.exercises.map(x => x.id));
  const cat = all.filter(c => !inDay.has(c.id));
  const list = nq ? cat.filter(c => normName(c.name).includes(nq) || aliasesOf(c.id).some(a => normName(a).includes(nq))).slice(0, 6) : (ui.showAll ? cat : []);
  const exact = nq ? ownByName(q) : null;
  let h = '';
  if (list.length) h += `<span class="eyebrow">${nq ? 'Ya los tienes · se comparte el historial' : 'Tus ejercicios'}</span>` + list.map(c => `<button class="sugg" data-a="useEx" data-id="${c.id}"><span class="col"><span style="font-weight:600">${esc(c.name)}</span><span class="muted sm">${esc(c.group)} · ${esc(catInfo(c))}</span></span><span class="use">Usar</span></button>`).join('');
  const own = ownIndex();
  const cm = nq ? CATALOGO.filter(c => !own.has(normName(c.n)) && normName(c.n).includes(nq)).sort((a, b) => catAllowed(b) - catAllowed(a)).slice(0, 6) : [];
  if (cm.length) h += `<span class="eyebrow">Del catálogo</span>` + cm.map(c => catRow(c, false)).join('');
  if (nq && !exact && !list.length && !cm.length) h += `<span class="muted sm">No hay ningún ejercicio con ese nombre.</span>`;
  const catExact = CATALOGO.find(c => normName(c.n) === nq && catAllowed(c));
  if (nq && !exact && !catExact) {
    const g = ui.ng || guessGroup(q);
    h += `<div class="card" style="background:var(--card2);gap:8px"><span class="eyebrow">Ejercicio nuevo · ¿qué grupo trabaja?</span>
      <div class="chips" role="group" aria-label="Grupo muscular">${GROUPS.map(x => `<button class="chip ${g === x ? 'on' : ''}" data-a="ngPick" data-v="${x}" aria-pressed="${g === x}" style="height:40px">${x}</button>`).join('')}</div>
      <button class="btn acc" data-a="exAdd">+ Crear “${esc(q.trim())}” en ${esc(g)}</button></div>`;
  }
  if (exact && inDay.has(exact.id)) h += `<span class="muted sm">“${esc(exact.name)}” ya está en este día.</span>`;
  if (!nq) h += `<button class="btn text" data-a="toggleAll">${ui.showAll ? 'Ocultar mi lista' : 'Ver todos mis ejercicios'}</button>`;
  return h;
}
function exListBody() {
  const cat = catalog(), q = normName(ui.exq || '');
  const list = q ? cat.filter(c => normName(c.name).includes(q) || normName(c.group).includes(q) || aliasesOf(c.id).some(a => normName(a).includes(q))) : cat;
  const row = c => `<button class="card rrow" data-a="exEdit" data-id="${c.id}"><div class="col"><span style="font-weight:600;font-size:16px">${esc(c.name)}</span><span class="muted sm">${esc(catInfo(c))}</span></div>${ICON.chev}</button>`;
  const used = list.filter(c => c.days.length), unused = list.filter(c => !c.days.length);
  let b = '';
  GROUPS.forEach(g => { const xs = used.filter(c => c.group === g); if (xs.length) b += `<span class="eyebrow mt">${g}</span>` + xs.map(row).join(''); });
  if (unused.length) b += `<span class="eyebrow mt">Sin usar en ningún día</span>` + unused.map(row).join('');
  if (!list.length) b += `<div class="card muted">${cat.length ? 'Ningún ejercicio coincide.' : 'Todavía no tienes ejercicios.'}</div>`;
  return b;
}
function vExList() {
  let b = `<input id="exq" class="inp" placeholder="Buscar ejercicio o grupo" value="${esc(ui.exq || '')}" aria-label="Buscar ejercicio" autocomplete="off">`;
  b += `<div id="exlistBody" class="col" style="gap:12px">${exListBody()}</div>`;
  return screen({ title: 'Mis ejercicios', sub: 'Ajustes', back: 'settings', body: b });
}
function vExEdit() {
  const cat = catalog(), c = cat.find(x => x.id === ui.exEdit), f = ui.exForm;
  if (!c || !f) { ui.view = 'exlist'; return vExList(); }
  let b = `<div class="card"><label class="eyebrow" for="exn">Nombre</label><input id="exn" class="inp" value="${esc(f.name)}" data-f="exfName" autocomplete="off">
    <span class="muted sm">El nombre cambia en todos los días y en el historial.${c.n ? ` Tus ${c.n} ${c.n === 1 ? 'sesión se conserva' : 'sesiones se conservan'}.` : ''}</span>
    <span class="eyebrow">Grupo muscular</span><div class="chips">${GROUPS.map(g => `<button class="chip ${f.group === g ? 'on' : ''}" data-a="exfGroup" data-v="${g}">${g}</button>`).join('')}</div>
    <div class="seg"><span class="muted sm" style="flex:1">Unidad</span><button class="chip ${f.unit === 'kg' ? 'on' : ''}" data-a="exfUnit" data-v="kg">kg</button><button class="chip ${f.unit === 'lb' ? 'on' : ''}" data-a="exfUnit" data-v="lb">lb</button></div></div>
  <div class="card"><span class="eyebrow">Se usa en</span><span style="font-weight:600">${c.days.length ? esc(c.days.join(', ')) : 'Ningún día'}</span><span class="muted sm">${c.n ? `${c.n} ${c.n === 1 ? 'sesión' : 'sesiones'} · última el ${fdate(c.last)}` : 'Sin sesiones registradas'}</span></div>`;
  const al = aliasesOf(c.id);
  if (al.length) b += `<div class="card"><span class="eyebrow">También llamado</span><span class="sm" style="color:#C9C7C2">${esc(al.join(', '))}</span><span class="muted sm">Nombres que se fusionaron aquí. Si los escribes, te lleva a este ejercicio.</span></div>`;
  const g = f.group, others = cat.filter(x => x.id !== c.id && x.group === g);
  if (!ui.mergeOpen) b += `<button class="btn text" data-a="mergeOpen" style="height:44px">¿Lo diste de alta dos veces? Fusionar</button>`;
  else b += `<div class="card"><div class="row-sb"><span class="eyebrow">Fusionar con otro de ${esc(g)}</span><button class="btn text" style="height:36px;padding:0 4px" data-a="mergeOpen">Cerrar</button></div>
      <span class="sm" style="color:#C9C7C2">Úsalo solo si es el mismo ejercicio escrito dos veces. El historial se junta y se conserva el nombre del que elijas. No se puede deshacer.</span>
      ${others.length ? `<label class="sr" for="mergeSel">Ejercicio con el que se fusiona</label><select id="mergeSel" class="inp sel big-sel"><option value="">Elegir ejercicio…</option>${others.map(o => `<option value="${o.id}">${esc(o.name)} (${o.n} ses.)</option>`).join('')}</select>
      <button class="btn ghost" data-a="exMergeSel">Fusionar con el seleccionado</button>` : `<span class="sm">No tienes otros ejercicios de ${esc(g)}.</span>`}</div>`;
  b += `<button class="btn text danger" data-a="exRemove" ${c.n ? 'disabled' : ''}>${c.n ? 'No se puede eliminar: tiene sesiones' : 'Eliminar ejercicio'}</button>`;
  return screen({ title: 'Editar ejercicio', sub: 'Mis ejercicios', back: 'exlist', body: b, foot: `<button class="btn acc lg full" data-a="exSave">Guardar cambios</button>` });
}

/* ---------- bienvenida y enfoques ---------- */
function applyTemplate(tid) {
  const t = tplById(tid);
  if (!t) return;
  if (t.pro && !isPro()) return openPremium('welcome2');
  const hasData = db.sessions.length || db.routines.some(r => r.exercises.length);
  if (db.onboarded && hasData && !confirm(`Esto crea una fase nueva con el enfoque ${t.name}. Tus días y tu historial actuales se conservan. ¿Continuar?`)) return;
  const b = buildFromTemplate(t);
  if (db.onboarded) {
    if (!isPro() && db.routines.length + b.routines.length > FREE_DAYS) {
      // En gratis se reemplazan los días para no pasar del límite
      db.routines = [];
      db.programs.forEach(p => { p.routineIds = []; });
    }
    const a = activePhase();
    const nums = db.programs.map(x => { const m = /^Fase (\d+)/.exec(x.name); return m ? +m[1] : 0; });
    b.phase.name = 'Fase ' + (Math.max(0, ...nums) + 1) + ' · ' + t.name;
    if (a) { a.state = 'done'; a.endedOn = todayISO(); }
  }
  db.routines = db.routines.concat(b.routines);
  db.programs.push(b.phase);
  db.template = t.id; db.onboarded = true;
  save(); toast(`Listo: ${b.phase.name}`); go('home');
}
function startEmpty() {
  const r = { id: uid() + 'd', name: 'Día 1', exercises: [] };
  db.routines = [r];
  db.programs = [{ id: uid() + 'p', name: 'Fase 1', weeks: 8, cycles: 8, days: 3, start: todayISO(), routineIds: [r.id], state: 'active', restAfter: false }];
  db.onboarded = true; db.template = null;
  save(); ui.planId = r.id; ui.planBack = 'home'; go('plan');
}

/* ---------- datos de ejemplo ---------- */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const START_W = { Pecho: [40, 25], Espalda: [50, 30], Pierna: [80, 40], Hombro: [30, 12.5], Bíceps: [25, 20], Tríceps: [25, 20], Otro: [30, 20] };
function loadDemo() {
  if (!confirm('Esto reemplaza los datos de esta app con 12 semanas de entrenos de ejemplo (2 fases), para que pruebes las gráficas. ¿Continuar?')) return;
  // Fase 1 terminada (6 semanas), una semana de descanso activo y Fase 2 en curso (5 semanas)
  const t = tplById('clasico');
  const b = buildFromTemplate(t);
  const rnd = rng(20261009);
  const today = todayISO();
  const p1 = Object.assign({}, b.phase, { id: uid() + 'p1', name: 'Fase 1 · Clásico', start: addDays(today, -84), weeks: 6, cycles: 8, state: 'done', endedOn: addDays(today, -42), restAfter: true });
  const p2 = Object.assign({}, b.phase, { id: uid() + 'p2', name: 'Fase 2 · Clásico', start: addDays(today, -35), weeks: 8, cycles: 8, state: 'active', restAfter: true });
  const stateEx = {}, bias = {};
  b.routines.forEach(r => r.exercises.forEach(x => {
    const base = START_W[x.group] || START_W.Otro, w0 = x.unit === 'lb' ? base[1] : base[0];
    stateEx[x.id] = { w: w0, r: x.repMin };
    bias[x.id] = x.group === 'Hombro' ? 0.45 : 0.7 + rnd() * 0.2; // hombro progresa menos: aparece como zona rezagada
  }));
  const sessions = [];
  const runPhase = (p, from, to) => {
    let di = 0;
    for (let d = from; d <= to; d += (rnd() < 0.7 ? 2 : 3)) {
      const r = b.routines[di % b.routines.length]; di++;
      const date = addDays(today, d);
      const startedAt = parseISO(date).getTime() + (18 * 60 + Math.floor(rnd() * 60)) * 60000;
      const dur = (30 + Math.floor(rnd() * 16)) * 60;
      const entries = r.exercises.map(x => {
        const s = stateEx[x.id], step = x.unit === 'lb' ? 5 : 2.5;
        const roll = rnd();
        if (s.r >= x.repMax) { s.w = r1(s.w + step); s.r = x.repMin + Math.floor(rnd() * 2); }
        else if (roll < bias[x.id]) s.r += roll < bias[x.id] / 3 ? 2 : 1;
        else if (roll > 0.9) s.r = Math.max(x.repMin - 1, s.r - 1);
        s.r = Math.min(s.r, x.repMax);
        return { exerciseId: x.id, name: x.name, unit: x.unit, warm: [{ w: roundTo(s.w * 0.5, step), r: 12 }], eff: { w: s.w, r: s.r, tech: 'Normal' } };
      });
      sessions.push({ id: uid() + 's' + d, date, at: startedAt + dur * 1000, startedAt, endedAt: startedAt + dur * 1000, durationSec: dur, programId: p.id, routineId: r.id, routineName: r.name, entries });
    }
  };
  runPhase(p1, -84, -43);
  runPhase(p2, -35, -1);
  const keepNeon = db.settings.neon; db = seed(); db.settings.neon = keepNeon;
  db.onboarded = true; db.premium = true; db.template = 'clasico'; db.programName = 'Programa de ejemplo';
  db.routines = b.routines; db.programs = [p1, p2]; db.sessions = sessions;
  save(); toast('Datos de ejemplo cargados · Premium de prueba activado'); ui.ch = { type: 'lineas', ex: null, range: 'todo', sel: null }; go('progress');
}

/* ---------- premium (simulado) ---------- */
function openPremium(back) { ui.proBack = back || ui.view; go('premium'); }
function needPro(back) { if (isPro()) return false; openPremium(back); return true; }

/* ---------- entrenamiento ---------- */
function startTraining(rid) {
  const r = routine(rid);
  if (!r || !r.exercises.length) { toast('Primero agrega ejercicios a este día'); ui.planId = rid; go('plan'); return; }
  const p = activePhase();
  db.current = {
    routineId: r.id, routineName: r.name, programId: p ? p.id : null, idx: 0, acc: 0, runAt: null, firstAt: null,
    entries: r.exercises.map(ex => {
      const last = lastEntry(ex.id);
      const u = unitOf(ex), lu = last ? unitOf(last) : u, step = stepFor(u);
      const cw = w => r1(conv(w, lu, u));
      const ew = last ? cw(last.eff.w) : 0;
      const er = last ? last.eff.r : (ex.repMin || 8);
      const warm = [];
      for (let k = 0; k < (ex.warmups || 1); k++) {
        const lw = last && last.warm && last.warm[k];
        warm.push(lw ? { w: cw(lw.w), r: lw.r, done: false } : { w: roundTo(ew * (k === 0 ? 0.5 : 0.75), step), r: k === 0 ? 12 : 6, done: false });
      }
      return { exerciseId: ex.id, name: ex.name, unit: u, warm, eff: { w: ew, r: er, done: false, tech: 'Normal' } };
    })
  };
  save(); go('train');
}
function finishTraining() {
  const c = db.current;
  const done = c.entries.filter(e => e.eff.done);
  if (!done.length) {
    if (!confirm('No registraste ninguna serie efectiva. ¿Cerrar el entreno sin guardar?')) return;
  } else {
    const end = Date.now();
    let dur = Math.round(tElapsed(c) / 1000) || null;
    const started = c.firstAt || end;
    if (dur && dur > 4 * 3600 && !confirm(`El cronómetro marca ${fmtDur(dur)}. ¿Guardar esa duración?\n\nSi eliges Cancelar, el entreno se guarda sin duración.`)) dur = null;
    const prev = lastSessionOf(c.routineId);
    const prs = [], firsts = [], same = [];
    done.forEach(e => {
      const l = lastEntry(e.exerciseId);
      if (!l) firsts.push(e.name);
      else { const li = lastEffIn(l, unitOf(e)); if (beats(e.eff, li)) prs.push({ name: e.name, d: e.eff.w > li.w ? '+' + fmt(r1(e.eff.w - li.w)) + ' ' + unitOf(e) : '+' + (e.eff.r - li.r) + (e.eff.r - li.r === 1 ? ' rep' : ' reps') }); else same.push({ name: e.name, down: beats(li, e.eff) }); }
    });
    db.sessions.push({
      id: uid(), date: todayISO(), at: end, startedAt: started, endedAt: end, durationSec: dur,
      programId: c.programId, routineId: c.routineId, routineName: c.routineName,
      entries: done.map(e => ({ exerciseId: e.exerciseId, name: e.name, unit: unitOf(e), warm: e.warm.map(w => ({ w: w.w, r: w.r })), eff: { w: e.eff.w, r: e.eff.r, tech: e.eff.tech } }))
    });
    ui.summary = {
      routineName: c.routineName, total: done.length, of: c.entries.length, prs, firsts, same,
      dur, startedAt: started, endedAt: end, prevDur: prev && prev.durationSec,
      phaseName: (phaseById(c.programId) || {}).name || '', dayN: dayNum(c.routineId)
    };
  }
  db.current = null; stopRest(); save();
  go(done.length ? 'summary' : 'home');
}
function compare(eff, last, u) {
  if (!last) return { cls: '', text: 'Primera vez: esta serie será tu referencia' };
  const l = lastEffIn(last, u);
  if (beats(eff, l)) {
    const d = eff.w > l.w ? '+' + fmt(r1(eff.w - l.w)) + ' ' + u : '+' + (eff.r - l.r) + (eff.r - l.r === 1 ? ' rep' : ' reps');
    return { cls: 'up', text: d + ' vs. la vez pasada · progresaste' };
  }
  if (eff.w === l.w && eff.r === l.r) return { cls: '', text: 'Igual que la vez pasada · busca 1 rep más' };
  return { cls: 'down', text: 'Por debajo de la vez pasada' };
}

/* ---------- cronómetro y descanso ---------- */
// Cronómetro: no arranca solo. Empieza al marcar la primera serie o con "Iniciar"; se puede pausar y reiniciar.
const tElapsed = c => !c ? 0 : Math.max(0, (c.acc || 0) + (c.runAt ? Date.now() - c.runAt : 0));
const tState = c => !c ? 'idle' : c.runAt ? 'run' : (c.acc ? 'pause' : 'idle');
function tStart() { const c = db.current; if (!c || c.runAt) return; c.runAt = Date.now(); if (!c.firstAt) c.firstAt = c.runAt; }
function tPause() { const c = db.current; if (!c || !c.runAt) return; c.acc = tElapsed(c); c.runAt = null; }
function tReset() { const c = db.current; if (!c) return; c.acc = 0; c.runAt = null; c.firstAt = null; }
const elapsedText = () => fmtDur(Math.floor(tElapsed(db.current) / 1000));
const anyDone = c => c.entries.some(e => e.eff.done || e.warm.some(w => w.done));
function timerBar() {
  const st = tState(db.current);
  if (st === 'idle') return `<div class="tbar"><span class="muted sm" style="flex:1">El cronómetro arranca al marcar tu primera serie.</span><button class="btn ghost" data-a="tStart">${ICON.play} Iniciar</button></div>`;
  if (st === 'run') return `<div class="tbar"><button class="btn ghost" data-a="tPause">${ICON.pause} Pausar</button><button class="btn text" data-a="tReset">Reiniciar</button></div>`;
  return `<div class="tbar paused"><span class="sm" style="flex:1;font-weight:600">Cronómetro en pausa</span><button class="btn acc" data-a="tStart">${ICON.play} Reanudar</button><button class="btn text" data-a="tReset">Reiniciar</button></div>`;
}
function restText() {
  const left = ui.rest ? Math.max(0, Math.ceil((ui.rest.end - Date.now()) / 1000)) : 0;
  return Math.floor(left / 60) + ':' + pad2(left % 60);
}
function startRest(sec) { ui.rest = { end: Date.now() + sec * 1000 }; }
function stopRest() { ui.rest = null; }
function tick() {
  const c = document.getElementById('clockT'); if (c) c.textContent = elapsedText();
  if (!ui.rest) return;
  if (Date.now() >= ui.rest.end) {
    stopRest();
    try { if (navigator.vibrate) navigator.vibrate([300, 150, 300]); } catch (e) { /* sin vibración */ }
    toast('¡Descanso terminado!');
    rerender(); return;
  }
  const el = document.getElementById('restT'); if (el) el.textContent = restText();
}
function ensureTick() {
  clearInterval(ui.tick); ui.tick = null;
  if (ui.view === 'train' && db.current) ui.tick = setInterval(tick, 1000);
}
let wl = null;
async function wake(on) {
  try {
    if (on && !wl && 'wakeLock' in navigator) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); }
    else if (!on && wl) { await wl.release(); wl = null; }
  } catch (e) { /* no disponible */ }
}

/* ---------- render ---------- */
function go(v) { ui.view = v; ui.keep = false; render(); }
function rerender() { ui.keep = true; render(); }
function render() {
  const m0 = $('.main'); const top = ui.keep && m0 ? m0.scrollTop : 0;
  const V = { welcome: vWelcome, welcome2: vEnfoques, home: vHome, train: vTrain, plan: vPlan, programa: vPrograma, phase: vPhase, progress: vProgress, settings: vSettings, summary: vSummary, premium: vPremium, descanso: vDescanso, exlist: vExList, exedit: vExEdit, catview: vCatView };
  applyNeon();
  $('#app').innerHTML = (V[ui.view] || vHome)();
  const m = $('.main'); if (m) m.scrollTop = top;
  document.querySelectorAll('.hscroll').forEach(h => { const on = h.querySelector('.chip.on'); if (on) h.scrollLeft = Math.max(0, on.offsetLeft - h.offsetLeft - (h.clientWidth - on.offsetWidth) / 2); });
  ui.keep = false;
  ensureTick();
  wake(ui.view === 'train');
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600);
}
function screen(o) {
  const backBtn = o.back ? `<button class="icon-btn" data-a="${o.backA || 'go'}" data-v="${o.back}" aria-label="Volver">${o.closeIcon ? ICON.close : ICON.back}</button>` : '';
  return `<header class="hdr">${backBtn}<div class="hdr-t">${o.sub ? `<span class="eyebrow ${o.subHl ? 'hl' : ''}">${esc(o.sub)}</span>` : ''}<h1>${esc(o.title)}</h1></div>${o.right || ''}</header>
<main class="main">${o.body}</main>
${ui.view === 'train' && ui.rest ? `<div class="rest"><div class="col"><span class="eyebrow">Descanso</span><span class="num" id="restT">${restText()}</span></div><button class="btn" data-a="skipRest">Saltar</button></div>` : ''}
${o.foot ? `<footer class="foot">${o.foot}</footer>` : ''}
${o.nav ? navBar(o.nav) : ''}`;
}
function navBar(c) {
  const it = [['home', 'Inicio', ICON.home], ['progress', 'Progreso', ICON.chart], ['settings', 'Ajustes', ICON.gear]];
  return `<nav class="nav">${it.map(([v, l, ic]) => `<button class="${c === v ? 'on' : ''}" data-a="go" data-v="${v}">${ic}<span>${l}</span></button>`).join('')}</nav>`;
}
const proPill = () => isPro() ? `<span class="pill-pro">${ICON.crown}Premium</span>` : `<button class="pill-pro out" data-a="premium">${ICON.crown}Premium</button>`;
const lockTag = () => `<span class="tag-pro">PREMIUM</span>`;
const bar = (label, val, pct) => `<div class="col" style="gap:6px"><div class="row-sb sm"><span class="muted">${label}</span><span style="font-weight:600">${val}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
const dayRow = (r, label, extra) => `<div class="card rrow"><div class="col">${label ? `<span class="muted sm" style="font-weight:600">${label}</span>` : ''}<span class="rname">${esc(r.name)}</span><span class="muted sm">${ejs(r.exercises.length)}${extra || ''}</span></div>
  <div class="row"><button class="btn ghost" data-a="plan" data-id="${r.id}">Planear</button><button class="icon-btn hl" data-a="train" data-id="${r.id}" aria-label="Entrenar ${esc(r.name)}">${ICON.play}</button></div></div>`;

function vWelcome() {
  const b = `<div class="hero">
    <img src="icon-192.png" alt="" width="88" height="88" class="hero-logo">
    <h2 class="hero-t">ONE MORE <span style="color:var(--acc)">REP</span></h2>
    <p class="hero-p">Una más que la vez pasada. Pocas series, todas al fallo, registradas en segundos.</p></div>
  <div class="card"><div class="feat">${ICON.checkSm}<span>Precarga lo que levantaste la vez pasada y te dice si progresaste.</span></div>
    <div class="feat">${ICON.checkSm}<span>Organiza tu año en fases: termina por semanas o por ciclos, lo que pase primero.</span></div>
    <div class="feat">${ICON.checkSm}<span>Tus datos se quedan en tu teléfono. Sin cuentas.</span></div></div>`;
  return screen({ title: 'Bienvenido', sub: 'Paso 1 de 2', subHl: true, body: b, foot: `<button class="btn acc lg full" data-a="go" data-v="welcome2">Empezar</button>` });
}
function vEnfoques() {
  const first = !db.onboarded;
  let b = `<p class="muted" style="margin:0;line-height:1.4">Cada enfoque es una fase de 6–8 semanas con sus días y ejercicios listos. Después puedes cambiar lo que quieras.</p>`;
  b += TEMPLATES.map(t => {
    const on = ui.tpl === t.id, locked = t.pro && !isPro();
    return `<button class="card tpl ${on ? 'on' : ''}" data-a="pickTpl" data-id="${t.id}" aria-pressed="${on}">
      <div class="col"><div class="row"><span class="rname" style="font-size:17px">${esc(t.name)}</span>${locked ? lockTag() : ''}</div>
      <span class="muted sm" style="line-height:1.3">${esc(t.desc)}</span><span class="sm" style="color:#C9C7C2">${t.plan.length} días · ${t.plan.map(p => esc(p[0])).join(', ')}</span></div>
      <span class="radio"></span></button>`;
  }).join('');
  b += `<button class="btn text" data-a="startEmpty">Prefiero empezar desde cero</button>`;
  const t = tplById(ui.tpl), locked = t.pro && !isPro();
  const foot = `<button class="btn acc lg full" data-a="applyTpl">${locked ? 'Ver Premium para usar este enfoque' : first ? 'Usar ' + esc(t.name) : 'Crear fase con ' + esc(t.name)}</button>`;
  return screen({ title: first ? '¿Con qué enfoque empiezas?' : 'Elegir enfoque', sub: first ? 'Paso 2 de 2' : 'Enfoques', subHl: first, back: first ? 'welcome' : 'programa', body: b, foot });
}

function vHome() {
  const p = activePhase();
  let b = '';
  if (db.current) b += `<button class="card resume" data-a="go" data-v="train"><span class="eyebrow hl">Entreno en curso · ${tState(db.current) === 'idle' ? 'sin iniciar' : elapsedText() + (tState(db.current) === 'pause' ? ' · en pausa' : '')}</span><span class="big">${esc(db.current.routineName)}</span><span class="muted">Toca para continuar</span></button>`;
  if (p) {
    const st = stats(p);
    b += `<button class="card" data-a="go" data-v="programa">
      <div class="row-sb"><span class="eyebrow">Fase activa</span><span class="link">Ver programa</span></div>
      <span class="big">${esc(p.name)}</span>
      <div class="grid2">${bar('Tiempo', `Sem ${st.week} de ${p.weeks}`, st.timePct)}${bar('Ciclos', `${st.cyclesDone} de ${p.cycles}`, st.cyclePct)}</div>
      <span class="muted sm">Termina con lo que se cumpla primero${p.restAfter ? ' · luego semana de descanso activo' : ''}</span></button>`;
    if (st.done) {
      const nx = plannedPhases()[0];
      b += `<div class="card win"><span class="big">¡${esc(p.name)} terminada!</span><span class="muted">Se cumplió ${st.byCycles ? `el número de ciclos (${p.cycles})` : `el tiempo (${p.weeks} semanas)`}.</span>
        ${p.restAfter ? `<button class="btn" data-a="go" data-v="descanso">Ver plan de descanso activo</button>` : ''}
        ${nx ? `<button class="btn acc" data-a="activate" data-id="${nx.id}">Empezar ${esc(nx.name)}</button>` : `<button class="btn acc" data-a="newPhase">Crear siguiente fase</button>`}</div>`;
    } else if (!db.current) {
      const nd = nextDay(p);
      if (nd) b += `<div class="card today"><span class="eyebrow hl">Toca hoy · Día ${dayNum(nd.id)}</span><span class="big">${esc(nd.name)}</span><span class="muted sm">${ejs(nd.exercises.length)}${lastInfo(nd.id)}</span><button class="btn acc lg" data-a="train" data-id="${nd.id}">${ICON.play} Empezar a entrenar</button></div>`;
    }
    const days = phaseDays(p);
    b += `<span class="eyebrow mt">Días de ${esc(p.name.split(' · ')[0])}</span>`;
    b += days.length ? days.map((r, i) => dayRow(r, 'DÍA ' + (i + 1))).join('') : `<div class="card muted">Esta fase no tiene días. Agrégalos desde Ver programa.</div>`;
    b += `<button class="btn dashed" data-a="newDay">+ Nuevo día${!isPro() && db.routines.length >= FREE_DAYS ? ' · Premium' : ''}</button>`;
  } else {
    b += `<div class="card"><span class="big">Sin fase activa</span><span class="muted sm">Crea o activa una fase para llevar la cuenta de semanas y ciclos.</span><button class="btn acc" data-a="go" data-v="programa">Ir al programa</button></div>`;
    b += `<span class="eyebrow mt">Días</span>` + db.routines.map(r => dayRow(r)).join('');
  }
  if (!isPro()) b += `<button class="card upsell" data-a="premium"><div class="col"><span style="font-weight:700">Planea el año en fases</span><span class="sm" style="color:var(--warm-tx)">Los 6 enfoques, descanso activo, todas las gráficas y exportar a Excel</span></div>${ICON.chev}</button>`;
  return screen({ title: 'Inicio', sub: db.programName || 'Mi programa', subHl: true, right: proPill(), body: b, nav: 'home' });
}

function stepper(set, f, val, unit, big) {
  return `<div class="stepper ${big ? 'big' : ''}"><button data-a="step" data-s="${set}" data-f="${f}" data-d="-1" aria-label="Menos">−</button>
  <label class="val"><input type="number" inputmode="decimal" step="any" min="0" value="${fmt(val)}" data-s="${set}" data-f="${f}" aria-label="${esc(unit)}"><span class="u">${esc(unit)}</span></label>
  <button data-a="step" data-s="${set}" data-f="${f}" data-d="1" aria-label="Más">+</button></div>`;
}
function vTrain() {
  const c = db.current;
  if (!c) { ui.view = 'home'; return vHome(); }
  const e = cur(), n = c.entries.length, last = lastEntry(e.exerciseId), u = unitOf(e), cmp = compare(e.eff, last, u);
  const ex = ((routine(c.routineId) || { exercises: [] }).exercises.find(x => x.id === e.exerciseId)) || exById(e.exerciseId) || {};
  const range =ex.repMin && ex.repMax ? `${ex.repMin}–${ex.repMax} reps` : ex.repMin ? `mín. ${ex.repMin} reps` : ex.repMax ? `máx. ${ex.repMax} reps` : '';
  const topHit = ex.repMax && e.eff.r >= ex.repMax;
  const dn = dayNum(c.routineId);
  let b = `<div class="segs" style="grid-template-columns:repeat(${n},1fr)">${c.entries.map((x, i) => `<i class="${i === c.idx ? 'cur' : x.eff.done ? 'ok' : ''}"></i>`).join('')}</div>
  ${timerBar()}
  <h2 class="exname">${esc(e.name)}</h2>
  ${range || ex.notes ? `<div class="card notes">${range ? `<span class="eyebrow hl">Objetivo · ${range}</span>` : ''}${ex.notes ? `<span class="note-t">${esc(ex.notes)}</span>` : ''}</div>` : ''}
  <div class="card row-sb" style="flex-direction:row"><div class="col"><span class="eyebrow">La vez pasada${last ? ' · ' + fdate(last.date) : ''}</span><span class="num md">${last ? `${fmt(last.eff.w)} ${unitOf(last)} × ${last.eff.r} reps` : 'Sin registro'}</span>${last && last.eff.w > 0 ? `<span class="muted sm">≈ ${fmt(r1(conv(last.eff.w, unitOf(last), other(unitOf(last)))))} ${other(unitOf(last))}</span>` : ''}</div><span class="muted sm">${last && last.eff.tech && last.eff.tech !== 'Normal' ? esc(last.eff.tech) : 'serie al fallo'}</span></div>
  <span class="eyebrow mt">Calentamiento</span>`;
  b += e.warm.map((w, k) => `<div class="card set ${w.done ? 'is-done' : ''}"><div class="row-sb"><span class="lbl">Calentamiento ${k + 1}</span><button class="check ${w.done ? 'on' : ''}" data-a="toggleWarm" data-k="${k}" aria-label="Marcar calentamiento ${k + 1}">${ICON.check}</button></div><div class="grid2">${stepper(k, 'w', w.w, wLabel(w.w, u))}${stepper(k, 'r', w.r, 'reps')}</div></div>`).join('');
  b += e.warm.length < 2 ? `<button class="btn dashed" data-a="addWarm">+ Agregar 2.º calentamiento</button>` : `<button class="btn text" data-a="delWarm">Quitar 2.º calentamiento</button>`;
  b += `<div class="card eff ${e.eff.done ? 'is-done' : ''}"><span class="eff-t">Serie efectiva · al fallo</span>
    ${stepper('e', 'w', e.eff.w, wLabel(e.eff.w, u), true)}${stepper('e', 'r', e.eff.r, 'reps al fallo', true)}
    <div class="cmp ${cmp.cls}">${cmp.text}</div>
    ${topHit ? `<div class="cmp up">Llegaste al tope de ${ex.repMax} reps: la próxima vez sube el peso</div>` : ''}
    <span class="eyebrow">Técnica de intensidad</span>
    <div class="chips">${TECHS.map(t => `<button class="chip ${e.eff.tech === t ? 'on' : ''}" data-a="tech" data-t="${t}">${t}</button>`).join('')}</div>
    <button class="btn ${e.eff.done ? '' : 'acc'} lg" data-a="toggleEff">${e.eff.done ? 'Serie registrada · tocar para editar' : 'Registrar serie al fallo'}</button></div>
  <button class="btn ghost" data-a="finish">Cerrar entreno ahora</button>
  <button class="btn text danger" data-a="discard">Descartar entreno</button>`;
  const lastEx = c.idx === n - 1;
  const foot = `<button class="btn" data-a="prevEx" ${c.idx === 0 ? 'disabled' : ''}>Anterior</button><button class="btn acc" data-a="${lastEx ? 'finish' : 'nextEx'}">${lastEx ? 'Cerrar entreno' : 'Siguiente ejercicio'}</button>`;
  const st = tState(c);
  const right = `<div class="clock ${st}" role="timer" aria-label="Tiempo de entrenamiento"><span class="eyebrow">${st === 'run' ? 'Entreno' : st === 'pause' ? 'En pausa' : 'Sin iniciar'}</span><span class="num" id="clockT">${elapsedText()}</span></div>`;
  return screen({ title: c.routineName, sub: `${dn ? 'Día ' + dn + ' · ' : ''}ejercicio ${c.idx + 1} de ${n}`, back: 'home', backA: 'leaveTrain', body: b, foot, right });
}

function vSummary() {
  const s = ui.summary || { total: 0, of: 0, prs: [], firsts: [], same: [] };
  let b = '';
  if (s.dur) {
    let diff = '', cls = 'same';
    if (s.prevDur) { const d = Math.round((s.dur - s.prevDur) / 60); diff = d === 0 ? 'Igual que la vez pasada' : Math.abs(d) + ' min ' + (d > 0 ? 'más' : 'menos') + ' que la vez pasada'; cls = d < 0 ? 'up' : 'same'; }
    b += `<div class="card win" style="align-items:center;text-align:center;gap:4px"><span class="eyebrow">Duración</span><span class="dur">${fmtDur(s.dur)}</span><span class="muted sm">De ${fmtTime(s.startedAt)} a ${fmtTime(s.endedAt)}</span>${diff ? `<span class="chip-s ${cls}">${diff}</span>` : ''}</div>`;
  }
  b += `<div class="grid2"><div class="card stat"><span class="eyebrow">Series al fallo</span><span class="num" style="font-size:30px;font-weight:700">${s.total} de ${s.of}</span></div><div class="card stat"><span class="eyebrow">Le ganaste</span><span class="num" style="font-size:30px;font-weight:700">${s.prs.length} ${s.prs.length === 1 ? 'ejercicio' : 'ejercicios'}</span></div></div>`;
  if (s.prs.length) b += `<span class="eyebrow mt">Le ganaste a la vez pasada</span>` + s.prs.map(x => `<div class="card rrow"><span>${esc(x.name)}</span><span class="tag">${esc(x.d)}</span></div>`).join('');
  if (s.same && s.same.length) b += `<span class="eyebrow mt">Igual o por debajo</span><div class="card" style="gap:0">` + s.same.map(x => `<div class="hist"><span>${esc(x.name)}</span><span class="sm" style="color:${x.down ? 'var(--bad)' : 'var(--mu)'}">${x.down ? 'Por debajo' : 'Igual'}</span></div>`).join('') + `</div>`;
  if (s.firsts.length) b += `<span class="eyebrow mt">Primera vez registrado</span>` + s.firsts.map(n => `<div class="card">${esc(n)}</div>`).join('');
  if (!s.prs.length && s.total > s.firsts.length) b += `<div class="card muted">Hoy no superaste tus marcas. La recuperación cuenta: descansa bien y vuelve por una rep más.</div>`;
  return screen({ title: 'Entreno cerrado', sub: (s.phaseName ? s.phaseName.split(' · ')[0] + ' · ' : '') + (s.dayN ? 'Día ' + s.dayN + ' · ' : '') + (s.routineName || ''), body: b, foot: `<button class="btn acc lg full" data-a="go" data-v="home">Listo</button>` });
}

function vPlan() {
  const r = routine(ui.planId);
  if (!r) { ui.view = 'home'; return vHome(); }
  let b = `<div class="card"><label class="eyebrow" for="rname">Nombre del día</label><input id="rname" class="inp" value="${esc(r.name)}" data-f="rname"></div>
  <span class="eyebrow mt">Ejercicios, en orden</span>`;
  b += r.exercises.length ? r.exercises.map((x, i) => `<div class="card">
    <div class="row"><span class="badge">${i + 1}</span><input class="inp" value="${esc(x.name)}" data-f="exname" data-i="${i}" aria-label="Nombre del ejercicio ${i + 1}"></div>
    ${(() => { const ds = db.routines.filter(d => d.id !== r.id && d.exercises.some(y => y.id === x.id)); return ds.length ? `<div class="row-sb" style="background:var(--warm-bg);border:1px solid var(--warm-bd);border-radius:12px;padding:6px 6px 6px 12px"><span class="sm" style="color:var(--note-tx)">Compartido con ${esc(ds.map(d => d.name).join(', '))}: si lo renombras cambia allá también</span><button class="btn hl-t" style="height:40px;flex-shrink:0" data-a="sepEx" data-i="${i}">Separar</button></div>` : ''; })()}
    <div class="row"><span class="muted sm" style="flex:1">Reps objetivo</span>
      <input class="inp mini" type="number" inputmode="numeric" min="0" placeholder="mín" value="${x.repMin || ''}" data-f="repMin" data-i="${i}" aria-label="Reps mínimas">
      <span class="muted">a</span>
      <input class="inp mini" type="number" inputmode="numeric" min="0" placeholder="máx" value="${x.repMax || ''}" data-f="repMax" data-i="${i}" aria-label="Reps máximas"></div>
    <textarea class="inp ta" rows="2" placeholder="Notas: enlazar con…, cuidar la zona lumbar…" data-f="exnotes" data-i="${i}" aria-label="Notas del ejercicio ${i + 1}">${esc(x.notes || '')}</textarea>
    <div class="row"><span class="muted sm" style="flex:1">Grupo muscular</span>
      <select class="inp sel" data-f="exgroup" data-i="${i}" aria-label="Grupo muscular">${GROUPS.map(g => `<option ${(x.group || 'Otro') === g ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
    <div class="seg"><span class="muted sm" style="flex:1">Unidad de peso</span>
      <button class="chip ${unitOf(x) === 'kg' ? 'on' : ''}" data-a="unit" data-i="${i}" data-u="kg">kg</button>
      <button class="chip ${unitOf(x) === 'lb' ? 'on' : ''}" data-a="unit" data-i="${i}" data-u="lb">lb</button></div>
    <div class="row-sb"><div class="seg"><span class="muted sm">Calent.</span>
      <button class="chip ${x.warmups === 1 ? 'on' : ''}" data-a="warmups" data-i="${i}" data-n="1">1</button>
      <button class="chip ${x.warmups === 2 ? 'on' : ''}" data-a="warmups" data-i="${i}" data-n="2">2</button></div>
      <div class="row"><button class="icon-btn" data-a="exMove" data-i="${i}" data-d="-1" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button>
      <button class="icon-btn" data-a="exMove" data-i="${i}" data-d="1" aria-label="Bajar" ${i === r.exercises.length - 1 ? 'disabled' : ''}>${ICON.down}</button>
      <button class="icon-btn" data-a="exDel" data-i="${i}" aria-label="Eliminar ejercicio">${ICON.trash}</button></div></div></div>`).join('')
    : `<div class="card muted">Todavía no hay ejercicios. Agrega el primero abajo.</div>`;
  b += `<div class="card"><label class="eyebrow" for="newex">Agregar ejercicio</label><input id="newex" class="inp" placeholder="Escribe o elige de tu lista" enterkeyhint="done" autocomplete="off" value="${esc(ui.q || '')}"><div id="sugg" class="col" style="gap:8px">${suggHtml(ui.q || '')}</div>
    <button class="btn ghost" data-a="openCat">Explorar catálogo · ${isPro() ? CATALOGO.length : CAT_BASIC} ejercicios</button></div>
  <button class="btn text danger" data-a="delRoutine">Eliminar día</button>`;
  return screen({ title: 'Planear día', sub: r.name, back: ui.planBack || 'home', body: b, foot: `<button class="btn acc lg full" data-a="train" data-id="${r.id}">${ICON.play} Entrenar este día</button>` });
}

/* ---------- programa y fases ---------- */
function vPrograma() {
  const badge = { active: ['ACTIVA', 'b-acc'], planned: ['SIGUIENTE', 'b-gray'], done: ['TERMINADA', 'b-gray'] };
  const order = { active: 0, planned: 1, done: 2 };
  const phases = db.programs.slice().sort((a, b2) => order[a.state] - order[b2.state] || (a.state === 'done' ? (b2.start || '').localeCompare(a.start || '') : 0));
  let b = `<div class="card"><label class="eyebrow" for="progName">Nombre del programa</label><input id="progName" class="inp" value="${esc(db.programName || '')}" data-f="progName" placeholder="Ej. Programa 2026"></div>
  <span class="eyebrow mt">Fases</span>`;
  b += phases.map(p => {
    const st = stats(p), days = phaseDays(p);
    const info = p.state === 'active' ? `semana ${st.week}, ciclo ${st.cyclesDone}` : p.state === 'planned' ? 'empieza el día que la actives' : `desde ${fdateY(p.start)} · ${st.cyclesDone} ciclos`;
    return `<div class="card ${p.state === 'active' ? 'today' : ''}" style="${p.state === 'done' ? 'opacity:.7' : ''}">
      <div class="row-sb"><span class="big" style="font-size:22px">${esc(p.name)}</span><span class="badge2 ${badge[p.state][1]}">${badge[p.state][0]}</span></div>
      <span class="sm" style="color:#C9C7C2">${days.length} días · ${days.map(r => esc(r.name)).join(', ') || 'sin días'}</span>
      <span class="muted sm">${p.weeks} semanas o ${p.cycles} ciclos · ${info}</span>
      ${p.state !== 'done' ? `<div class="row-sb"><div class="col"><span class="sm" style="font-weight:600">Descanso activo al terminar ${isPro() ? '' : lockTag()}</span><span class="muted sm">1 semana sin ir al fallo</span></div><button class="switch ${p.restAfter ? 'on' : ''}" data-a="restAfter" data-id="${p.id}" aria-pressed="${!!p.restAfter}" aria-label="Descanso activo al terminar ${esc(p.name)}"><i></i></button></div>
      <div class="grid2"><button class="btn ghost" data-a="editPhase" data-id="${p.id}">Editar</button>${p.state === 'planned' ? `<button class="btn hl-t" data-a="activate" data-id="${p.id}">Activar ahora</button>` : `<button class="btn ghost danger" data-a="endPhase" data-id="${p.id}">Terminar</button>`}</div>` : ''}
    </div>`;
  }).join('');
  const blockNew = !isPro() && activePhase();
  b += `<div class="grid2"><button class="btn dashed" data-a="newPhase">+ Fase en blanco${blockNew ? ' ' + ICON.lock : ''}</button><button class="btn dashed" data-a="go" data-v="welcome2">+ Desde un enfoque</button></div>`;
  if (blockNew) b += `<span class="muted sm">En la versión gratis tienes una fase a la vez. Con Premium planeas las siguientes.</span>`;
  b += `<span class="eyebrow mt">Catálogo de días</span><span class="muted sm">Un día puede estar en varias fases. Si lo editas, cambia en todas.</span>`;
  b += db.routines.map(r => {
    const inP = db.programs.filter(p => p.state !== 'done' && p.routineIds.includes(r.id)).map(p => p.name.split(' · ')[0]);
    return `<div class="card rrow"><div class="col"><span class="rname" style="font-size:16px">${esc(r.name)}</span><span class="muted sm">${ejs(r.exercises.length)} · ${inP.length ? esc(inP.join(', ')) : 'sin fase'}</span></div><button class="btn ghost" data-a="plan" data-id="${r.id}" data-back="programa">Planear</button></div>`;
  }).join('');
  b += `<button class="btn dashed" data-a="newDay" data-back="programa">+ Nuevo día</button>`;
  return screen({ title: 'Programa', sub: 'Configuración', back: 'home', body: b });
}
function openPhase(id) {
  const p = id ? phaseById(id) : null;
  if (p) ui.form = Object.assign({}, p, { routineIds: p.routineIds.slice(), isNew: false });
  else {
    if (activePhase() && needPro('programa')) return;
    const base = activePhase() || plannedPhases().slice(-1)[0] || db.programs.slice(-1)[0];
    const nums = db.programs.map(x => { const m = /^Fase (\d+)/.exec(x.name); return m ? +m[1] : 0; });
    const name = 'Fase ' + (Math.max(0, ...nums) + 1);
    ui.form = { id: uid(), name, weeks: base ? base.weeks : 8, cycles: base ? base.cycles : 8, days: base ? base.days : 3, start: todayISO(), routineIds: base ? base.routineIds.slice() : db.routines.map(r => r.id), isNew: true, state: activePhase() ? 'planned' : 'active', restAfter: false };
  }
  go('phase');
}
function pstep(k, v, unit) {
  return `<div class="stepper"><button data-a="pStep" data-k="${k}" data-d="-1" aria-label="Menos">−</button><div class="val"><span class="v">${v}</span><span class="u">${esc(unit)}</span></div><button data-a="pStep" data-k="${k}" data-d="1" aria-label="Más">+</button></div>`;
}
function vPhase() {
  const f = ui.form;
  if (!f) { ui.view = 'programa'; return vPrograma(); }
  const per = Math.max(1, f.routineIds.length);
  const wfc = f.cycles * per / f.days, cit = f.weeks * f.days / per;
  const verdict = wfc <= f.weeks ? `Termina primero por ciclos: ${f.cycles} ciclos en ~${Math.ceil(wfc)} semanas` : `Termina primero por tiempo: ${f.weeks} semanas, ~${r1(cit)} ciclos`;
  const showStart = f.state === 'active';
  let b = `<div class="card"><label class="eyebrow" for="pname">Nombre de la fase</label><input id="pname" class="inp" value="${esc(f.name)}" data-f="pname">
    <div class="chips">${PRESETS.map(n => `<button class="chip ${f.name === n ? 'on' : ''}" data-a="pPreset" data-n="${n}">${n}</button>`).join('')}</div>
    ${showStart ? `<label class="eyebrow" for="pstart">Fecha de inicio</label><input id="pstart" type="date" class="inp" value="${f.start}" data-f="pstart">` : `<span class="muted sm">Empieza a contar el día que la actives.</span>`}</div>
  <div class="card"><div class="row-sb"><span class="eyebrow">Días de esta fase</span><span class="muted sm">${f.routineIds.length} seleccionados</span></div>
    ${db.routines.map(r => { const on = f.routineIds.includes(r.id); return `<button class="check-row ${on ? 'on' : ''}" data-a="pRoutine" data-id="${r.id}" aria-pressed="${on}"><span class="box">${on ? ICON.checkSm : ''}</span><span>${esc(r.name)}</span><span class="muted sm" style="margin-left:auto">${r.exercises.length} ej.</span></button>`; }).join('')}
    <span class="muted sm">Solo los días marcados aparecen en Inicio. Un ciclo cuenta cuando completas todos.</span></div>
  <div class="card"><span class="eyebrow">Duración · termina con lo que se cumpla primero</span>
    <span class="lbl">Tiempo máximo</span>${pstep('weeks', f.weeks, 'semanas' + (showStart ? ' · hasta ' + fdateY(addDays(f.start, f.weeks * 7)) : ''))}
    <span class="lbl">Veces que completas todos los días</span>${pstep('cycles', f.cycles, `ciclos de ${per} días`)}
    <span class="lbl">Días que entrenas por semana</span>
    <div class="days">${[2, 3, 4, 5, 6].map(n => `<button class="chip ${f.days === n ? 'on' : ''}" data-a="pDays" data-n="${n}">${n}</button>`).join('')}</div>
    <div class="est"><span class="sm">Con ${f.days} días por semana, ${f.cycles} ciclos te toman unas ${r1(wfc)} semanas.</span><strong>${verdict}</strong></div></div>`;
  if (!f.isNew && f.state !== 'active') b += `<button class="btn text danger" data-a="delPhase">Eliminar fase</button>`;
  return screen({ title: f.isNew ? 'Nueva fase' : 'Fase', sub: (db.programName || 'Programa') + (f.isNew && f.state === 'planned' ? ' · quedará como siguiente' : ''), back: 'programa', body: b, foot: `<button class="btn acc lg full" data-a="savePhase">Guardar fase</button>` });
}
function savePhase() {
  const f = ui.form;
  if (!f.name.trim()) return toast('Ponle nombre a la fase');
  if (!f.routineIds.length) return toast('Elige al menos un día');
  const data = { id: f.id, name: f.name.trim(), weeks: f.weeks, cycles: f.cycles, days: f.days, start: f.state === 'active' ? (f.start || todayISO()) : null, routineIds: db.routines.map(r => r.id).filter(id => f.routineIds.includes(id)), state: f.state, restAfter: !!f.restAfter };
  if (f.endedOn) data.endedOn = f.endedOn;
  if (f.isNew) db.programs.push(data);
  else { const i = db.programs.findIndex(p => p.id === f.id); db.programs[i] = data; }
  save(); toast('Fase guardada'); go('programa');
}
function activatePhase(id) {
  const p = phaseById(id), a = activePhase();
  if (!p) return;
  if (a && !confirm(`¿Empezar ${p.name} hoy? ${a.name} quedará como terminada.`)) return;
  if (a) { a.state = 'done'; a.endedOn = todayISO(); }
  p.state = 'active'; p.start = todayISO();
  save(); toast(`${p.name} activa`); go('home');
}

function vDescanso() {
  const rows = [['Día 1', 'Caminata y movilidad', '30–45 min suave, luego círculos de hombros, cadera y tobillos.'], ['Día 2', 'Descanso total', 'Duerme bien. Estiramientos suaves si quieres.'], ['Día 3', 'Gimnasio ligero', 'Circuito de abajo con 40–50% de tu peso. Nada al fallo.'], ['Día 4', 'Cardio suave', '30 min de bici, elíptica o nadar, respirando por la nariz.'], ['Día 5', 'Movilidad', '20 min: cadera, isquios, pecho y espalda alta.'], ['Día 6', 'Actividad libre', 'Caminata larga, bici o nadar por gusto.'], ['Día 7', 'Prepara la siguiente fase', 'Revisa los días y define tus pesos de arranque.']];
  const circ = [['Prensa o sentadilla goblet', '2 × 12–15'], ['Press en máquina', '2 × 12–15'], ['Jalón al pecho', '2 × 12–15'], ['Elevaciones laterales', '1 × 15'], ['Curl femoral', '1 × 15'], ['Plancha', '2 × 30–45 s']];
  let b = `<div class="card notes"><span class="note-t">Una semana sin ir al fallo para que músculos, articulaciones y sistema nervioso se recuperen. Vuelves más fuerte a la siguiente fase.</span></div>`;
  b += `<span class="eyebrow mt">Plan de la semana</span><div class="card" style="gap:0">` + rows.map(r => `<div class="hist" style="align-items:flex-start"><span class="muted" style="min-width:52px">${r[0]}</span><div class="col" style="flex:1"><span style="font-weight:600">${r[1]}</span><span class="muted sm">${r[2]}</span></div></div>`).join('') + `</div>`;
  b += `<span class="eyebrow mt">Circuito ligero (Día 3)</span><div class="card" style="gap:0">` + circ.map(r => `<div class="hist"><span>${r[0]}</span><span class="muted sm">${r[1]}</span></div>`).join('') + `</div>`;
  b += `<div class="card"><span class="eyebrow">Evita</span><span class="sm" style="line-height:1.5">Series al fallo, probar tu máximo, cardio intenso y bajarle mucho a la comida. Si al final sigues cansado, tómate 2–3 días más.</span></div>`;
  const nx = plannedPhases()[0];
  return screen({ title: 'Descanso activo', sub: 'Semana de recuperación', back: 'home', body: b, foot: nx ? `<button class="btn acc lg full" data-a="activate" data-id="${nx.id}">Empezar ${esc(nx.name)}</button>` : `<button class="btn acc lg full" data-a="newPhase">Crear siguiente fase</button>` });
}

/* ---------- progreso y gráficas ---------- */
function rangeStart() {
  if (ui.ch.range === 'mes') return addDays(todayISO(), -30);
  return null;
}
function inRange(s) {
  const r = ui.ch.range;
  if (r === 'mes') return s.date >= rangeStart();
  if (r === 'fase') { const p = activePhase(); return p ? s.programId === p.id : true; }
  return true;
}
function exercisesWithHistory() {
  const seen = new Set(), out = [];
  const p = activePhase();
  const days = p ? phaseDays(p).concat(db.routines.filter(r => !p.routineIds.includes(r.id))) : db.routines;
  days.forEach(r => r.exercises.forEach(x => { if (!seen.has(x.id) && history(x.id).length) { seen.add(x.id); out.push({ x, day: r.name }); } }));
  return out;
}
const niceTicks = (lo, hi) => {
  if (hi === lo) { lo -= 5; hi += 5; }
  const span = hi - lo, step = span > 80 ? 20 : span > 30 ? 10 : span > 12 ? 5 : 2.5;
  const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, t = [];
  for (let v = a; v <= b + 1e-9; v += step) t.push(r1(v));
  return { a, b: b === a ? a + step : b, t };
};
const dotPath = (x, y, r) => `M${r1(x - r)} ${r1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
function chartPer(type, pts, ex) {
  // pts: [{date, w, r, prevW, prevR}] ya en la unidad del ejercicio
  const W = 320, H = 178, L = 36, R = 312, T = 12, B = 148, n = pts.length, u = unitOf(ex);
  const slot = (R - L) / n, xc = k => L + slot * (k + 0.5);
  const sel = ui.ch.sel == null || ui.ch.sel >= n ? n - 1 : ui.ch.sel;
  const ytxt = (y, t, col) => `<text x="${L - 6}" y="${r1(y + 4)}" text-anchor="end" font-size="11" fill="${col || C.mu}">${t}</text>`;
  const every = Math.max(1, Math.ceil(n / 5));
  const xtxt = pts.map((p, k) => (k % every === 0 || k === n - 1) && !(k !== n - 1 && n - 1 - k < every) ? `<text x="${r1(xc(k))}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${C.mu}">${fdate(p.date)}</text>` : '').join('');
  const hits = (fn) => pts.map((p, k) => { const h = fn(p, k); return `<rect data-a="chSel" data-k="${k}" x="${r1(h[0])}" y="${r1(h[1])}" width="${r1(h[2])}" height="${r1(h[3])}" fill="transparent"><title>${fdate(p.date)}: ${fmt(p.w)} ${u} × ${p.r} reps</title></rect>`; }).join('');
  let s = '';
  if (type === 'lineas') {
    const tk = niceTicks(Math.min(...pts.map(p => p.w)), Math.max(...pts.map(p => p.w)));
    const y = w => B - (w - tk.a) / (tk.b - tk.a) * (B - T);
    s += tk.t.map(t => `<path d="M${L} ${r1(y(t))}H${R}" stroke="${C.grid}"/>` + ytxt(y(t), fmt(t))).join('');
    s += `<path d="M${r1(xc(sel))} ${T}V${B}" stroke="${C.mu}" stroke-dasharray="3 4"/>`;
    s += `<polyline points="${pts.map((p, k) => r1(xc(k)) + ',' + r1(y(p.w))).join(' ')}" fill="none" stroke="${C.acc}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += pts.map((p, k) => `<path d="${dotPath(xc(k), y(p.w), n > 20 ? 3.5 : 4.5)}" fill="${p.prevW != null && p.w > p.prevW ? C.ok : C.acc}" stroke="${C.card}" stroke-width="2"/>`).join('');
    s += `<path d="${dotPath(xc(sel), y(pts[sel].w), 8)}" fill="none" stroke="${C.tx}" stroke-width="2"/>`;
    s += hits((p, k) => [xc(k) - slot / 2, 0, slot, B + 6]);
  } else if (type === 'columnas') {
    const top = Math.max(ex.repMax || 0, ...pts.map(p => p.r)) + 2, y = r => B - r / top * (B - T);
    const ticks = [4, 8, 12, 16, 20].filter(t => t < top);
    s += ticks.map(t => `<path d="M${L} ${r1(y(t))}H${R}" stroke="${C.grid}"/>` + (ex.repMax && Math.abs(t - ex.repMax) < 2 ? '' : ytxt(y(t), t))).join('');
    const bw = Math.max(4, Math.min(20, slot - 4));
    s += pts.map((p, k) => { const x = xc(k) - bw / 2, yy = y(p.r), rr = Math.min(3, bw / 2); return `<path d="M${r1(x)} ${B}V${r1(yy + rr)}Q${r1(x)} ${r1(yy)} ${r1(x + rr)} ${r1(yy)}H${r1(x + bw - rr)}Q${r1(x + bw)} ${r1(yy)} ${r1(x + bw)} ${r1(yy + rr)}V${B}Z" fill="${ex.repMax && p.r >= ex.repMax ? C.ok : C.acc}"/>`; }).join('');
    if (ex.repMax) s += `<path d="M${L} ${r1(y(ex.repMax))}H${R}" stroke="${C.tx}" stroke-width="1.5" stroke-dasharray="4 4"/>` + ytxt(y(ex.repMax), 'Tope', C.tx);
    const sx = xc(sel) - bw / 2 - 2, sy = y(pts[sel].r) - 2;
    s += `<path d="M${r1(sx)} ${B}V${r1(sy)}H${r1(sx + bw + 4)}V${B}" fill="none" stroke="${C.tx}" stroke-width="2"/>`;
    s += hits((p, k) => [xc(k) - slot / 2, 0, slot, B + 6]);
  } else if (type === 'dispersion') {
    const tk = niceTicks(Math.min(...pts.map(p => p.w)), Math.max(...pts.map(p => p.w)));
    const rlo = Math.min(...pts.map(p => p.r)) - 1, rhi = Math.max(...pts.map(p => p.r)) + 1;
    const sx = w => L + 10 + (w - tk.a) / (tk.b - tk.a) * (R - L - 20), sy = r => B - (r - rlo) / (rhi - rlo) * (B - T);
    s += tk.t.map((t, j) => `<path d="M${r1(sx(t))} ${T}V${B}" stroke="${C.grid}"/><text x="${r1(sx(t))}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${C.mu}">${fmt(t)}${j === tk.t.length - 1 ? ' ' + u : ''}</text>`).join('');
    const rt = [rlo + 1, Math.round((rlo + rhi) / 2), rhi - 1].filter((v, i, a) => a.indexOf(v) === i);
    s += rt.map(t => `<path d="M${L} ${r1(sy(t))}H${R}" stroke="${C.grid}"/>` + ytxt(sy(t), t)).join('');
    s += pts.map((p, k) => `<path d="${dotPath(sx(p.w), sy(p.r), k === n - 1 ? 6 : 5)}" fill="${k === n - 1 ? C.ok : C.acc}" fill-opacity="${k === n - 1 ? 1 : .8}" stroke="${C.card}" stroke-width="2"/>`).join('');
    s += `<path d="${dotPath(sx(pts[sel].w), sy(pts[sel].r), 9)}" fill="none" stroke="${C.tx}" stroke-width="2"/>`;
    s += pts.map((p, k) => `<rect data-a="chSel" data-k="${k}" x="${r1(sx(p.w) - 12)}" y="${r1(sy(p.r) - 12)}" width="24" height="24" fill="transparent"><title>${fdate(p.date)}: ${fmt(p.w)} ${u} × ${p.r} reps</title></rect>`).join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peso contra repeticiones de ${esc(ex.name)}">${s}</svg>`;
  }
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${type === 'lineas' ? 'Peso' : 'Repeticiones'} de ${esc(ex.name)} por sesión">${s}${xtxt}</svg>`;
}
function readout(p, u, ex) {
  let d, cls;
  if (p.prevW == null) { d = 'Primera vez'; cls = 'same'; }
  else if (p.w > p.prevW) { d = '+' + fmt(r1(p.w - p.prevW)) + ' ' + u; cls = 'up'; }
  else if (p.w === p.prevW && p.r > p.prevR) { d = '+' + (p.r - p.prevR) + (p.r - p.prevR === 1 ? ' rep' : ' reps'); cls = 'up'; }
  else if (p.w === p.prevW && p.r === p.prevR) { d = 'Igual'; cls = 'same'; }
  else if (p.w < p.prevW) { d = '−' + fmt(r1(p.prevW - p.w)) + ' ' + u; cls = 'down'; }
  else { d = '−' + (p.prevR - p.r) + (p.prevR - p.r === 1 ? ' rep' : ' reps'); cls = 'down'; }
  return `<div class="readout"><div class="col"><span class="muted sm">${fdateY(p.date)}${ex.repMax && p.r >= ex.repMax ? ' · llegó al tope' : ''}</span><span class="num" style="font-size:22px;font-weight:700">${fmt(p.w)} ${u} × ${p.r} reps</span></div><span class="chip-s ${cls}">${d}</span></div>`;
}
function aggregate() {
  // progreso por ejercicio en el periodo (primer vs último peso, en su unidad)
  const out = [];
  db.routines.forEach(r => r.exercises.forEach(x => {
    if (out.some(o => o.x.id === x.id)) return;
    const u = unitOf(x);
    const h = [];
    db.sessions.forEach(s => { if (!inRange(s)) return; s.entries.forEach(e => { if (e.exerciseId === x.id) h.push(r1(conv(e.eff.w, unitOf(e), u))); }); });
    if (h.length >= 2 && h[0] > 0) out.push({ x, u, a: h[0], b: h[h.length - 1], pct: Math.round((h[h.length - 1] - h[0]) / h[0] * 100) });
  }));
  return out;
}
function chartBars(items) {
  if (!items.length) return `<div class="muted sm">Necesitas al menos 2 sesiones de un ejercicio en este periodo.</div>`;
  const s = items.slice().sort((a, b) => b.pct - a.pct), mx = Math.max(1, s[0].pct);
  return `<div class="hbars">${s.map(e => `<div class="col" style="gap:4px"><div class="row-sb sm"><span>${esc(e.x.name)}</span><span style="font-weight:700;white-space:nowrap">${e.pct > 0 ? '+' : ''}${e.pct}%</span></div>
    <div class="hb"><i style="width:${Math.max(2, Math.round(Math.max(0, e.pct) / mx * 100))}%;background:${e.pct > 0 ? C.acc : '#4A4B52'}"></i></div><span class="muted" style="font-size:12px">${fmt(e.a)} → ${fmt(e.b)} ${e.u}</span></div>`).join('')}</div>`;
}
// Grupos con ejercicios registrados en el periodo pero con un solo registro: todavía no hay avance que medir
function radarPending() {
  const cnt = {};
  db.sessions.forEach(s => { if (!inRange(s)) return; s.entries.forEach(e => { cnt[e.exerciseId] = (cnt[e.exerciseId] || 0) + 1; }); });
  const one = new Set();
  catalog().forEach(c => { if (cnt[c.id] === 1 && RADAR.includes(c.group)) one.add(c.group); });
  return one;
}
const listY = xs => xs.length > 1 ? xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1] : xs[0];
function chartRadar(items) {
  const G = RADAR.map(g => { const xs = items.filter(i => (i.x.group || 'Otro') === g); return { g, n: xs.length, v: xs.length ? Math.round(xs.reduce((a, i) => a + i.pct, 0) / xs.length) : 0 }; });
  const one = radarPending(), wait = G.filter(g => !g.n && one.has(g.g)).map(g => g.g), none = G.filter(g => !g.n && !one.has(g.g)).map(g => g.g);
  const why = 'El balance compara tu primer y tu último registro de cada ejercicio en el periodo, así que se necesitan al menos 2 sesiones del mismo ejercicio.';
  const note = (wait.length || none.length) ? `<div class="radar-note"><span style="font-weight:700">¿Por qué algunos grupos aparecen con “—”?</span>
    ${wait.length ? `<span>${esc(listY(wait))}: por ahora solo ${wait.length === 1 ? 'tiene' : 'tienen'} 1 registro por ejercicio. En cuanto repitas ${wait.length === 1 ? 'ese día' : 'esos días'}, aparece su avance.</span>` : ''}
    ${none.length ? `<span>${esc(listY(none))}: no ${none.length === 1 ? 'tiene' : 'tienen'} entrenos en este periodo.</span>` : ''}
    <span class="muted">${why}</span></div>` : '';
  if (!G.some(g => g.n)) return `<div class="radar-note"><span style="font-weight:700">Todavía no hay balance que mostrar</span><span>${why}</span>${wait.length ? `<span>Ya tienes 1 registro en ${esc(listY(wait))}; con el siguiente entreno de cada día empieza a aparecer.</span>` : ''}</div>`;
  const W = 320, H = 210, cx = 160, cy = 104, rad = 70, mx = Math.max(10, ...G.map(g => g.v)) * 1.15;
  const pt = (k, s) => { const a = (-90 + 360 / RADAR.length * k) * Math.PI / 180; return [cx + Math.cos(a) * rad * s, cy + Math.sin(a) * rad * s]; };
  const ring = s => G.map((g, k) => { const p = pt(k, s); return (k ? 'L' : 'M') + r1(p[0]) + ' ' + r1(p[1]); }).join('') + 'Z';
  const minV = Math.min(...G.filter(g => g.n).map(g => g.v));
  let s = `<path d="${ring(1 / 3)}${ring(2 / 3)}${ring(1)}" fill="none" stroke="${C.grid}"/>`;
  s += G.map((g, k) => { const p = pt(k, 1); return `<path d="M${cx} ${cy}L${r1(p[0])} ${r1(p[1])}" stroke="${C.grid}"/>`; }).join('');
  s += `<polygon points="${G.map((g, k) => pt(k, Math.max(0, g.v) / mx).map(r1).join(',')).join(' ')}" fill="${C.acc}" fill-opacity=".2" stroke="${C.acc}" stroke-width="2" stroke-linejoin="round"/>`;
  s += G.map((g, k) => { const p = pt(k, Math.max(0, g.v) / mx), low = g.n && g.v === minV; return `<path d="${dotPath(p[0], p[1], 4.5)}" fill="${low ? C.bad : C.acc}" stroke="${C.card}" stroke-width="2"/>`; }).join('');
  s += G.map((g, k) => { const p = pt(k, 1.27), low = g.n && g.v === minV; return `<text x="${r1(p[0])}" y="${r1(p[1] + 4)}" text-anchor="middle" font-size="11" fill="${low ? C.bad : '#C9C7C2'}">${g.g} ${g.n ? (g.v > 0 ? '+' : '') + g.v + '%' : '—'}</text>`; }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Progreso por grupo muscular: ${G.map(g => g.g + ' ' + g.v + '%').join(', ')}">${s}</svg>
    <div class="legend"><span><i style="background:${C.acc}"></i>Progreso por grupo</span><span><i style="background:${C.bad}"></i>Zona rezagada</span></div>${note}`;
}
function vProgress() {
  const t = CHART_TYPES.find(x => x.id === ui.ch.type) || CHART_TYPES[0];
  const locked = t.pro && !isPro();
  let b = `<div class="segctl" role="group" aria-label="Periodo">${[['mes', 'Último mes'], ['fase', 'Fase actual'], ['todo', 'Todo']].map(([id, l]) => `<button class="${ui.ch.range === id ? 'on' : ''}" data-a="chRange" data-v="${id}" aria-pressed="${ui.ch.range === id}">${l}</button>`).join('')}</div>`;
  b += `<div class="chips" role="group" aria-label="Tipo de gráfica">${CHART_TYPES.map(c => `<button class="chip ico ${c.id === t.id ? 'on' : ''}" data-a="chType" data-v="${c.id}" aria-pressed="${c.id === t.id}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${c.icon}"/></svg>${c.label}${c.pro && !isPro() ? ICON.lock : ''}</button>`).join('')}</div>`;
  const list = exercisesWithHistory();
  if (!db.sessions.length) {
    b += `<div class="card muted">Aquí verás tu progreso cuando cierres tu primer entreno. Para probar las gráficas ya, ve a Ajustes › Cargar datos de ejemplo.</div>`;
    return screen({ title: 'Progreso', sub: 'Serie efectiva', body: b, nav: 'progress' });
  }
  let inner = '', tiles = '';
  if (t.per) {
    if (!ui.ch.ex || !list.some(o => o.x.id === ui.ch.ex)) ui.ch.ex = list.length ? list[0].x.id : null;
    const ex = exById(ui.ch.ex);
    b += `<label class="sr" for="exSel">Ejercicio</label><select id="exSel" class="inp sel big-sel" data-f="chEx">${list.map(o => `<option value="${o.x.id}" ${o.x.id === ui.ch.ex ? 'selected' : ''}>${esc(o.x.name)}${list.filter(z => normName(z.x.name) === normName(o.x.name)).length > 1 ? ' · ' + esc(o.day) : ''}</option>`).join('')}</select>`;
    if (ex) {
      const u = unitOf(ex), full = history(ex.id).map(h => ({ date: h.date, programId: h.programId, w: r1(conv(h.w, h.unit, u)), r: h.r }));
      full.forEach((p, i) => { p.prevW = i ? full[i - 1].w : null; p.prevR = i ? full[i - 1].r : null; });
      const pts = full.filter(p => inRange(p));
      const titles = { lineas: ['Peso de la serie efectiva', 'Toca un punto para ver la sesión. Los puntos resaltados marcan cuando subiste peso.'], columnas: ['Reps al fallo por sesión', ex.repMax ? `Las columnas resaltadas llegaron al tope de ${ex.repMax} reps; la siguiente sube el peso.` : 'Define reps objetivo en Planear para ver la línea de tope.'], dispersion: ['Peso contra reps', 'Cada punto es una sesión. Hacia arriba y a la derecha = más fuerte.'], tabla: ['Historial', 'De la más reciente a la más antigua.'] };
      inner += `<div class="col" style="gap:2px"><span style="font-size:17px;font-weight:700">${titles[t.id][0]}</span><span class="muted sm">${titles[t.id][1]}</span></div>`;
      if (!pts.length) inner += `<div class="muted sm">Sin sesiones de este ejercicio en el periodo.</div>`;
      else if (t.id === 'tabla') {
        inner += `<div class="tbl"><div class="tr th"><span>Fecha</span><span>Peso</span><span>Reps</span><span></span></div>${pts.slice().reverse().map(p => { const up = p.prevW != null && beats(p, { w: p.prevW, r: p.prevR }); return `<div class="tr"><span class="muted">${fdate(p.date)}</span><span style="font-weight:600">${fmt(p.w)} ${u}</span><span>${p.r}</span><span>${up ? '<span class="tag">↑</span>' : ''}</span></div>`; }).join('')}</div>`;
      } else {
        const sel = ui.ch.sel == null || ui.ch.sel >= pts.length ? pts.length - 1 : ui.ch.sel;
        inner += readout(pts[sel], u, ex) + chartPer(t.id, pts, ex);
        inner += t.id === 'lineas' ? `<div class="legend"><span><i style="background:${C.acc}"></i>Mismo peso</span><span><i style="background:${C.ok}"></i>Subiste peso</span></div>`
          : t.id === 'columnas' ? `<div class="legend"><span><i style="background:${C.acc}"></i>Reps al fallo</span><span><i style="background:${C.ok}"></i>Llegaste al tope</span></div>`
            : `<div class="legend"><span><i style="background:${C.acc}"></i>Sesiones anteriores</span><span><i style="background:${C.ok}"></i>Última sesión</span></div>`;
      }
      if (pts.length) {
        let best = 0; pts.forEach((p, k) => { if (beats(p, pts[best])) best = k; });
        const gain = r1(pts[pts.length - 1].w - pts[0].w), ups = pts.filter(p => p.prevW != null && beats(p, { w: p.prevW, r: p.prevR })).length;
        tiles = `<div class="grid3"><div class="card stat"><span class="muted sm">Mejor serie</span><span class="num md">${fmt(pts[best].w)} × ${pts[best].r}</span></div><div class="card stat ${gain > 0 ? 'gain' : ''}"><span class="sm">En el periodo</span><span class="num md">${gain >= 0 ? '+' : '−'}${fmt(Math.abs(gain))} ${u}</span></div><div class="card stat"><span class="muted sm">Le ganaste</span><span class="num md">${ups} de ${pts.length}</span></div></div>`;
      }
    }
  } else {
    const items = aggregate();
    inner += t.id === 'barras' ? `<div class="col" style="gap:2px"><span style="font-size:17px;font-weight:700">Progreso por ejercicio</span><span class="muted sm">Cuánto subió el peso de la serie efectiva en el periodo.</span></div>` + chartBars(items)
      : `<div class="col" style="gap:2px"><span style="font-size:17px;font-weight:700">Balance por grupo muscular</span><span class="muted sm">Progreso promedio por grupo. El pico más hundido es tu zona rezagada.</span></div>` + chartRadar(items);
    const ss = db.sessions.filter(inRange), timed = ss.filter(s => s.durationSec);
    let recs = 0; ss.forEach(s => s.entries.forEach(e => { const h = history(e.exerciseId); const i = h.findIndex(x => x.date === s.date); if (i > 0 && beats(h[i], h[i - 1])) recs++; }));
    tiles = `<div class="grid3"><div class="card stat"><span class="muted sm">Sesiones</span><span class="num md">${ss.length}</span></div><div class="card stat gain"><span class="sm">Récords</span><span class="num md">${recs}</span></div><div class="card stat"><span class="muted sm">Duración prom.</span><span class="num md">${timed.length ? fmtMin(timed.reduce((a, s) => a + s.durationSec, 0) / timed.length) : '—'}</span></div></div>`;
  }
  b += `<div class="card chartcard ${locked ? 'locked' : ''}"><div class="chartbody" ${locked ? 'aria-hidden="true"' : ''}>${inner}</div>${locked ? `<div class="lockover"><span class="tag-pro">PREMIUM</span><span style="font-weight:700">Gráfica de ${t.label.toLowerCase()}</span><span class="sm" style="color:var(--warm-tx)">Disponible con Premium. Esto es una vista previa.</span><button class="btn acc" data-a="premium">Ver Premium</button></div>` : ''}</div>`;
  b += tiles;
  return screen({ title: 'Progreso', sub: 'Serie efectiva', body: b, nav: 'progress' });
}

/* ---------- premium ---------- */
function vPremium() {
  const rows = [['Registrar series, calentamientos y descanso', '✓', '✓'], ['Cronómetro y resumen del entreno', '✓', '✓'], ['Comparar con la vez pasada', '✓', '✓'], ['Días propios', String(FREE_DAYS), 'Sin límite'], ['Fases planeadas', '1', 'Sin límite'], ['Enfoques listos', '1', 'Los 6'], ['Catálogo de ejercicios', `${CAT_BASIC} básicos`, `Los ${CATALOGO.length}`], ['Descanso activo entre fases', '—', '✓'], ['Gráficas', 'Líneas, columnas, tabla', '+ barras, radar, dispersión'], ['Exportar a Excel', '—', '✓'], ['Respaldo y restaurar', '✓', '✓']];
  let b = `<h2 class="exname" style="font-size:32px">Entrena el año completo, fase por fase</h2>
  <div class="card" style="padding:6px 14px;gap:0"><div class="ptr th"><span></span><span>Gratis</span><span class="hl">Premium</span></div>${rows.map(r => `<div class="ptr"><span>${r[0]}</span><span class="muted">${r[1]}</span><span class="hl">${r[2]}</span></div>`).join('')}</div>
  <div class="grid2">${[['mensual', 'Mensual', 'por mes'], ['anual', 'Anual', 'por año · ahorra [X]%']].map(([id, l, n]) => `<button class="card plan ${ui.plan === id ? 'on' : ''}" data-a="plan2" data-v="${id}" aria-pressed="${ui.plan === id}"><span class="eyebrow">${l}</span><span class="num" style="font-size:24px;font-weight:700">[PRECIO]</span><span class="muted sm">${n}</span></button>`).join('')}</div>
  <span class="muted sm" style="text-align:center">Versión de pruebas: el cobro todavía no existe. El botón activa Premium en este teléfono para que pruebes todo. Tus datos se quedan aquí con o sin Premium.</span>`;
  const foot = isPro() ? `<button class="btn lg full" data-a="setPro" data-v="0">Desactivar Premium (prueba)</button>` : `<button class="btn acc lg full" data-a="setPro" data-v="1">Activar Premium (prueba)</button>`;
  return screen({ title: 'Premium', sub: BRAND + ' Premium', subHl: true, back: ui.proBack || 'home', closeIcon: true, body: b, foot });
}

function vSettings() {
  const s = db.settings;
  const chips = (k, opts, unit) => `<div class="chips">${opts.map(n => `<button class="chip ${s[k] === n ? 'on' : ''}" data-a="setNum" data-k="${k}" data-n="${n}">${n}${unit}</button>`).join('')}</div>`;
  const b = `<button class="card rrow" data-a="premium"><div class="col"><span class="eyebrow ${isPro() ? 'hl' : ''}">Plan</span><span style="font-weight:700;font-size:17px">${isPro() ? 'Premium (prueba)' : 'Gratis'}</span></div>${ICON.chev}</button>
  <button class="card rrow" data-a="myEx"><div class="col"><span class="eyebrow">Ejercicios</span><span style="font-weight:700;font-size:17px">Mis ejercicios</span><span class="muted sm">Renombrar, cambiar grupo o combinar duplicados</span></div>${ICON.chev}</button>
  <div class="card"><span class="eyebrow">Color neón</span>
    <div class="chips" role="group" aria-label="Color neón">${NEONS.map(n => `<button class="chip neon ${(s.neon || 'volt') === n.id ? 'on' : ''}" data-a="setNeon" data-v="${n.id}" aria-pressed="${(s.neon || 'volt') === n.id}"><i style="background:${n.acc}"></i>${n.name}</button>`).join('')}</div>
    <span class="muted sm">Cambia botones, gráficas y acentos. El ícono del celular se queda en Volt.</span></div>
  <div class="card"><span class="eyebrow">Incremento con −/+ en kg</span>${chips('step', [1, 2.5, 5], ' kg')}
    <span class="eyebrow">Incremento con −/+ en lb</span>${chips('stepLb', [2.5, 5, 10], ' lb')}</div>
  <div class="card"><span class="eyebrow">Descanso después de calentamiento</span>${chips('restWarm', [45, 60, 90], ' s')}
    <span class="eyebrow">Descanso después de la serie efectiva</span>${chips('restEff', [90, 120, 180], ' s')}</div>
  <div class="card"><span class="eyebrow">Tus datos</span><span class="muted sm">Se guardan solo en este teléfono. Haz respaldo de vez en cuando.</span>
    <button class="btn acc" data-a="exportCsv">Exportar a Excel (.csv)${isPro() ? '' : ' ' + ICON.lock}</button>
    <button class="btn" data-a="backup">Descargar respaldo</button>
    <button class="btn" data-a="importBtn">Restaurar respaldo (.json)</button>
    <button class="btn" data-a="csvBtn">Cargar Excel corregido (.csv)${isPro() ? '' : ' ' + ICON.lock}</button>
    <span class="muted sm">Respaldo = archivo .json de “Descargar respaldo” (también acepta el de HD). Excel corregido = el .csv que exportaste, editado en Excel; no borres la columna ID.</span></div>
  <div class="card"><span class="eyebrow">Pruebas</span><span class="muted sm">Herramientas solo para esta versión de prueba.</span>
    <button class="btn" data-a="demo">Cargar datos de ejemplo</button>
    <button class="btn" data-a="restart">Ver la bienvenida otra vez</button></div>
  <button class="btn text danger" data-a="reset">Borrar todos los datos</button>
  <span class="muted sm" style="text-align:center">${esc(BRAND)} · ${APP_VER}</span>`;
  return screen({ title: 'Ajustes', sub: BRAND, subHl: true, body: b, nav: 'settings' });
}

/* ---------- exportar / respaldo ---------- */
function download(text, type, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
const fileSlug = BRAND.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
function exportCsv() {
  if (needPro('settings')) return;
  if (!db.sessions.length) return toast('Todavía no hay entrenos registrados');
  const rows = [CSV_HEAD.slice()];
  const cat = catalog();
  db.sessions.slice().sort((a, b) => (a.date || '').localeCompare(b.date || '')).forEach(s => {
    const pn = (phaseById(s.programId) || {}).name || '';
    const dm = s.durationSec ? Math.round(s.durationSec / 60) : '';
    const dn = (routine(s.routineId) || {}).name || s.routineName || '';
    s.entries.forEach((e, i) => {
      const g = (cat.find(c => c.id === e.exerciseId) || {}).group || '';
      (e.warm || []).forEach((w, k) => rows.push([s.date, db.programName || '', pn, dn, e.name, g, 'Calentamiento ' + (k + 1), w.w, unitOf(e), w.r, '', dm, `OMR|${s.id}|${i}|C${k}`]));
      rows.push([s.date, db.programName || '', pn, dn, e.name, g, 'Efectiva', e.eff.w, unitOf(e), e.eff.r, e.eff.tech || '', dm, `OMR|${s.id}|${i}|E`]);
    });
  });
  const csv = '﻿' + rows.map(r => r.map(c => { const v = String(c); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\r\n');
  download(csv, 'text/csv;charset=utf-8', `${fileSlug}-entrenos-${todayISO()}.csv`);
}
const CSV_HEAD = ['Fecha', 'Programa', 'Fase', 'Día', 'Ejercicio', 'Grupo', 'Serie', 'Peso', 'Unidad', 'Reps', 'Técnica', 'Duración entreno (min)', 'ID (no modificar)'];
// Lee el archivo como texto (UTF-8, o Windows-1252 si Excel lo guardó así)
function readText(file, cb) {
  const rd = new FileReader();
  rd.onload = () => {
    let text = new TextDecoder('utf-8').decode(rd.result);
    if (text.includes('�')) { try { text = new TextDecoder('windows-1252').decode(rd.result); } catch (e) { /* se queda en UTF-8 */ } }
    cb(text.replace(/^﻿/, ''));
  };
  rd.onerror = () => toast('No pude abrir ese archivo');
  rd.readAsArrayBuffer(file);
}
// Convierte un respaldo de la app personal (HD v3) al formato de One More Rep
function fromHD(d) {
  if (!d || !Array.isArray(d.exercises) || !Array.isArray(d.routines) || !Array.isArray(d.sessions)) return null;
  const meta = {}; d.exercises.forEach(e => { meta[e.id] = e; });
  const out = seed();
  out.onboarded = true; out.premium = db.premium; out.programName = d.programName || 'Mi programa';
  out.routines = d.routines.map(r => ({ id: r.id, name: r.name, exercises: r.exercises.map(x => { const m = meta[x.id] || {}; return { id: x.id, name: m.name || 'Ejercicio', group: GROUPS.includes(m.group) ? m.group : guessGroup(m.name || ''), unit: m.unit || 'kg', warmups: x.warmups || 1, repMin: x.repMin || null, repMax: x.repMax || null, notes: x.notes || '' }; }) }));
  out.programs = (d.programs || []).map(p => Object.assign({ restAfter: false }, p));
  out.sessions = d.sessions.map(s => Object.assign({}, s, { entries: s.entries.map(e => Object.assign({}, e, { name: (meta[e.exerciseId] || {}).name || e.name })) }));
  out.settings = Object.assign({}, out.settings, { step: (d.settings || {}).step || 2.5, stepLb: (d.settings || {}).stepLb || 5, restWarm: (d.settings || {}).restWarm || 60, restEff: (d.settings || {}).restEff || 120, neon: db.settings.neon, aliases: {} });
  d.exercises.forEach(e => { if ((e.aliases || []).length) out.settings.aliases[e.id] = e.aliases.slice(); });
  return out;
}
// "Restaurar respaldo": acepta el .json de One More Rep o de HD; si eligen un .csv, lo manda a "Excel corregido"
function importFile(file) {
  if (!file) return;
  readText(file, text => {
    const t = text.trim();
    if (!t.startsWith('{')) {
      if (/\.csv$/i.test(file.name) || t.includes(',') || t.includes(';')) {
        if (!confirm('Ese archivo es un Excel (.csv), no un respaldo.\n\nEl respaldo es el archivo .json de “Descargar respaldo”. ¿Quieres cargar este .csv como Excel corregido?')) return;
        return importCsvText(text);
      }
      return toast('Ese archivo no es un respaldo. Usa el .json de “Descargar respaldo”.');
    }
    let raw;
    try { raw = JSON.parse(t); } catch (e) { return toast('El archivo está dañado o incompleto: no se pudo leer'); }
    let d = fixCurrent(validate(raw)), from = 'One More Rep';
    if (!d && raw && raw.v === 3 && Array.isArray(raw.exercises)) { d = fixCurrent(fromHD(raw)); from = 'HD (tu app personal)'; }
    if (!d) return toast(raw && raw.v && raw.v < 3 ? 'Es un respaldo de HD muy viejo: ábrelo primero en HD y vuelve a descargarlo' : 'Ese archivo no es un respaldo válido');
    if (!confirm(`Respaldo de ${from}: ${d.sessions.length} entrenos, ${d.routines.length} días.\n\nEsto reemplaza los datos de esta app. ¿Continuar?`)) return;
    db = d; fillGroups(); save(); toast('Respaldo restaurado'); go('home');
  });
}
function parseCsv(text) {
  const first = text.split(/\r?\n/)[0] || '';
  const sep = (first.split(';').length > first.split(',').length) ? ';' : ',';
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.some(x => String(x).trim() !== ''));
}
const csvNum = v => { const t = String(v == null ? '' : v).trim().replace(/\s/g, ''); if (t === '') return null; const n = parseFloat(t.replace(',', '.')); return isFinite(n) ? n : null; };
function csvDate(v) {
  const t = String(v || '').trim(); let m;
  if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad2(+m[2])}-${pad2(+m[3])}`;
  if ((m = t.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/))) { const y = m[3].length === 2 ? '20' + m[3] : m[3]; return `${y}-${pad2(+m[2])}-${pad2(+m[1])}`; }
  return null;
}
const routineByName = name => { const k = normName(name); return db.routines.find(r => normName(r.name) === k) || null; };
// Lee el Excel corregido y arma la lista de cambios, sin aplicarlos todavía
function planCsvImport(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error('El archivo está vacío');
  const head = rows[0].map(h => normName(h));
  const col = name => head.indexOf(normName(name));
  const ci = { date: col('Fecha'), day: col('Día'), ex: col('Ejercicio'), w: col('Peso'), u: col('Unidad'), r: col('Reps'), t: col('Técnica'), id: head.findIndex(h => h.startsWith('id')) };
  if (ci.id < 0 || ci.ex < 0) throw new Error('No encuentro la columna “ID (no modificar)”. Exporta de nuevo con One More Rep V4 o más nueva y edita ese archivo.');
  const ses = {}; db.sessions.forEach(x => { ses[x.id] = x; });
  const P = { rows: 0, skipped: 0, foreign: 0, sets: [], entries: {}, sessions: {}, newEx: new Set(), newDays: new Set() };
  rows.slice(1).forEach(r => {
    const id = String(r[ci.id] || '').trim().split('|');
    if (id[0] === 'HD') { P.foreign++; return; }
    if (id[0] !== 'OMR' || !ses[id[1]] || !ses[id[1]].entries[+id[2]]) { P.skipped++; return; }
    const s = ses[id[1]], ei = +id[2], e = s.entries[ei], k = id[3];
    const tgt = k === 'E' ? e.eff : (e.warm || [])[+String(k).slice(1)];
    if (!tgt) { P.skipped++; return; }
    P.rows++;
    const g = v => ci[v] >= 0 ? String(r[ci[v]] == null ? '' : r[ci[v]]).trim() : '';
    const w = csvNum(g('w')), rp = csvNum(g('r'));
    if (w != null && w !== tgt.w) P.sets.push({ tgt, f: 'w', v: w });
    if (rp != null && Math.round(rp) !== tgt.r) P.sets.push({ tgt, f: 'r', v: Math.round(rp) });
    if (k === 'E' && ci.t >= 0 && g('t') && g('t') !== (tgt.tech || '')) P.sets.push({ tgt, f: 'tech', v: g('t') });
    const ek = s.id + '|' + ei, en = P.entries[ek] || (P.entries[ek] = { s, e, name: null, unit: null, uE: null, uW: null });
    const nm = g('ex'), u = g('u').toLowerCase();
    if (nm && normName(nm) !== normName(e.name) && (k === 'E' || !en.name)) en.name = nm;
    if (u === 'kg' || u === 'lb') { if (k === 'E') en.uE = u; else if (!en.uW || u !== unitOf(e)) en.uW = u; }
    const sx = P.sessions[s.id] || (P.sessions[s.id] = { s, day: null, date: null });
    const dn = g('day'), cur = (routine(s.routineId) || {}).name || s.routineName || '';
    if (dn && normName(dn) !== normName(cur) && !sx.day) sx.day = dn;
    const dt = ci.date >= 0 ? csvDate(g('date')) : null;
    if (dt && dt !== s.date && !sx.date) sx.date = dt;
  });
  Object.values(P.entries).forEach(x => { const u = x.uE || x.uW; x.unit = u && u !== unitOf(x.e) ? u : null; if (x.name && !ownByName(x.name)) P.newEx.add(x.name.trim()); });
  Object.values(P.sessions).forEach(x => { if (x.day && !routineByName(x.day)) P.newDays.add(x.day.trim()); });
  P.exCount = Object.values(P.entries).filter(x => x.name).length;
  P.unitCount = Object.values(P.entries).filter(x => x.unit).length;
  P.dayCount = Object.values(P.sessions).filter(x => x.day).length;
  P.dateCount = Object.values(P.sessions).filter(x => x.date).length;
  P.total = P.sets.length + P.exCount + P.unitCount + P.dayCount + P.dateCount;
  return P;
}
function applyCsvImport(P) {
  P.sets.forEach(c => { c.tgt[c.f] = c.v; });
  Object.values(P.entries).forEach(x => { if (x.unit) x.e.unit = x.unit; });
  Object.values(P.sessions).forEach(x => {
    if (x.date) x.s.date = x.date;
    if (!x.day) return;
    let r = routineByName(x.day);
    if (!r) {
      r = { id: uid(), name: x.day.trim(), exercises: [], fromCsv: true }; db.routines.push(r);
      const ph = phaseById(x.s.programId) || activePhase(); if (ph && !ph.routineIds.includes(r.id)) ph.routineIds.push(r.id);
    }
    x.s.routineId = r.id; x.s.routineName = r.name;
  });
  const cat = catalog(), moves = {};
  Object.values(P.entries).forEach(x => {
    if (!x.name) return;
    const old = cat.find(c => c.id === x.e.exerciseId) || { group: 'Otro', unit: unitOf(x.e) };
    const dst = ownByName(x.name);
    const to = dst ? { id: dst.id, name: dst.name, group: dst.group, unit: dst.unit } : { id: uid(), name: x.name.trim(), group: old.group !== 'Otro' ? old.group : guessGroup(x.name), unit: x.e.unit || old.unit };
    const key = x.s.routineId + '|' + x.e.exerciseId + '|' + to.id;
    moves[key] = moves[key] || { rid: x.s.routineId, from: x.e.exerciseId, to };
    x.e.exerciseId = to.id; x.e.name = to.name;
  });
  // días nuevos: su plan se arma con los ejercicios de los entrenos que se movieron ahí
  db.routines.filter(r => r.fromCsv).forEach(r => {
    delete r.fromCsv;
    db.sessions.filter(s => s.routineId === r.id).forEach(s => s.entries.forEach(e => {
      if (r.exercises.some(x => x.id === e.exerciseId)) return;
      const c = catalog().find(z => z.id === e.exerciseId) || { name: e.name, group: guessGroup(e.name), unit: unitOf(e) };
      r.exercises.push({ id: e.exerciseId, name: c.name, group: c.group, unit: c.unit, warmups: Math.max(1, Math.min(2, (e.warm || []).length || 1)) });
    }));
  });
  // si en un día ya no quedan registros del ejercicio viejo, el plan del día pasa al nuevo
  let planSwaps = 0;
  Object.values(moves).forEach(m => {
    const r = routine(m.rid); if (!r) return;
    const stillOld = db.sessions.some(s => s.routineId === m.rid && s.entries.some(e => e.exerciseId === m.from));
    const slot = r.exercises.find(x => x.id === m.from);
    if (slot && !stillOld && !r.exercises.some(x => x.id === m.to.id)) { Object.assign(slot, { id: m.to.id, name: m.to.name, group: m.to.group, unit: m.to.unit }); planSwaps++; }
  });
  return planSwaps;
}
function importCsvText(text) {
  if (needPro('settings')) return;
  let P;
  try { P = planCsvImport(text); } catch (e) { return toast(e.message || 'No pude leer ese archivo'); }
  if (!P.total) return toast(P.foreign && !P.rows ? 'Ese Excel es de HD, no de One More Rep' : P.rows ? 'No encontré cambios en el archivo' : 'Ese archivo no tiene registros de One More Rep');
  const lines = [];
  if (P.exCount) lines.push(`• ${P.exCount} ejercicio(s) cambiados de nombre o reasignados`);
  if (P.sets.length) lines.push(`• ${P.sets.length} dato(s) de peso, reps o técnica`);
  if (P.unitCount) lines.push(`• ${P.unitCount} cambio(s) de unidad`);
  if (P.dayCount) lines.push(`• ${P.dayCount} entreno(s) movidos a otro día`);
  if (P.dateCount) lines.push(`• ${P.dateCount} fecha(s)`);
  if (P.newEx.size) lines.push(`\nEjercicios nuevos: ${[...P.newEx].join(', ')}`);
  if (P.newDays.size) lines.push(`Días nuevos: ${[...P.newDays].join(', ')}`);
  if (P.skipped) lines.push(`\n(${P.skipped} fila(s) sin ID válido se ignoran)`);
  if (!confirm(`Cambios encontrados:\n${lines.join('\n')}\n\nAntes de aplicar se descarga un respaldo automático. ¿Aplicar?`)) return;
  download(JSON.stringify(db, null, 1), 'application/json', `${fileSlug}-respaldo-antes-de-excel-${todayISO()}.json`);
  const swaps = applyCsvImport(P); fillGroups(); save();
  go('settings'); toast(`Listo: ${P.total} cambio(s) aplicados${swaps ? ` · ${swaps} día(s) actualizados` : ''}`);
}
// Separar: el ejercicio compartido queda solo en este día con otro nombre
function separateExercise(i) {
  const r = routine(ui.planId); if (!r) return;
  const slot = r.exercises[i]; if (!slot) return;
  const others = db.routines.filter(d => d.id !== r.id && d.exercises.some(x => x.id === slot.id));
  const mine = db.sessions.filter(s => s.routineId === r.id).reduce((a, s) => a + s.entries.filter(e => e.exerciseId === slot.id).length, 0);
  const v = prompt(`¿Cómo se llama el ejercicio de ${r.name}?\n\n${others.map(d => d.name).join(', ')} se queda con “${slot.name}”. Los ${mine} registro(s) que hiciste en ${r.name} pasan al nuevo.`, slot.name + ' (' + r.name + ')');
  if (v === null) return;
  const name = v.trim();
  if (!name) return toast('Escribe un nombre');
  if (normName(name) === normName(slot.name)) return toast('Usa un nombre distinto al de ' + others.map(d => d.name).join(', '));
  const dst = ownByName(name);
  if (dst && r.exercises.some(x => x.id === dst.id)) return toast(`“${dst.name}” ya está en este día`);
  if (dst && !confirm(`Ya tienes “${dst.name}”. ¿Usar ese para ${r.name}? Su historial se juntará con estos ${mine} registro(s).`)) return;
  const oldId = slot.id, to = dst ? { id: dst.id, name: dst.name, group: dst.group, unit: dst.unit } : { id: uid(), name, group: slot.group, unit: unitOf(slot) };
  Object.assign(slot, to);
  const mv = e => { if (e.exerciseId === oldId) { e.exerciseId = to.id; e.name = to.name; } };
  db.sessions.forEach(s => { if (s.routineId === r.id) s.entries.forEach(mv); });
  if (db.current && db.current.routineId === r.id) db.current.entries.forEach(mv);
  save(); rerender(); toast(`Separado: “${to.name}” solo en ${r.name} · ${mine} registro(s)`);
}

/* ---------- acciones ---------- */
const ACT = {
  go: d => { if (d.v === 'welcome2' && db.onboarded) ui.tpl = db.template || 'clasico'; go(d.v); },
  premium: () => openPremium(ui.view),
  setPro: d => { db.premium = d.v === '1'; save(); toast(db.premium ? 'Premium de prueba activado' : 'Volviste a la versión gratis'); go(ui.proBack || 'home'); },
  plan2: d => { ui.plan = d.v; rerender(); },
  pickTpl: d => { ui.tpl = d.id; rerender(); },
  applyTpl: () => applyTemplate(ui.tpl),
  startEmpty: () => { if (db.onboarded && !confirm('Esto reemplaza tus días y fases (el historial se conserva). ¿Continuar?')) return; startEmpty(); },
  train: d => {
    if (db.current) {
      if (db.current.routineId === d.id) return go('train');
      if (!confirm('Tienes un entreno en curso. ¿Descartarlo y empezar otro?')) return;
      db.current = null; stopRest();
    }
    startTraining(d.id);
  },
  plan: d => { ui.planId = d.id; ui.planBack = d.back || 'home'; ui.q = ''; ui.showAll = false; go('plan'); },
  useEx: d => { if (addExerciseToDay(routine(ui.planId), d.id)) { ui.q = ''; save(); toast('Agregado · comparte el historial'); rerender(); } },
  toggleAll: () => { ui.showAll = !ui.showAll; rerender(); },
  myEx: () => { ui.exq = ''; go('exlist'); },
  openCat: () => { ui.cf = ui.cf || { g: 'Todos', e: 'Todo', q: '' }; go('catview'); },
  cfG: d => { ui.cf.g = d.v; rerender(); },
  cfE: d => { ui.cf.e = d.v; rerender(); },
  useCat: d => {
    const c = CATALOGO.find(x => x.n === d.n); if (!c) return;
    if (!catAllowed(c)) return openPremium(ui.view);
    if (!addCatToDay(c)) return;
    ui.q = ''; save(); toast('Agregado: ' + c.n); rerender();
  },
  exEdit: d => { const c = catalog().find(x => x.id === d.id); if (!c) return; ui.mergeOpen = false; ui.exEdit = c.id; ui.exForm = { name: c.name, group: c.group, unit: c.unit }; go('exedit'); },
  exfGroup: d => { ui.exForm.group = d.v; ui.mergeOpen = false; rerender(); },
  mergeOpen: () => { ui.mergeOpen = !ui.mergeOpen; rerender(); },
  ngPick: d => { ui.ng = d.v; const s = $('#sugg'); if (s) s.innerHTML = suggHtml(ui.q || ''); },
  sepEx: d => separateExercise(+d.i),
  csvBtn: () => { if (needPro('settings')) return; $('#csvFile').click(); },
  exfUnit: d => { ui.exForm.unit = d.v; rerender(); },
  exSave: () => {
    const f = ui.exForm, name = (f.name || '').trim();
    if (!name) return toast('Ponle nombre al ejercicio');
    const clash = ownByName(name);
    if (clash && clash.id !== ui.exEdit) return toast(`Ya existe “${clash.name}”. Si es el mismo, fusiónalos.`);
    setShared(ui.exEdit, { name, group: f.group, unit: f.unit }); save(); toast('Ejercicio actualizado'); go('exlist');
  },
  exMerge: d => doMerge(d.id),
  exMergeSel: () => { const v = ($('#mergeSel') || {}).value; if (!v) return toast('Elige con cuál combinar'); doMerge(v); },
  exRemove: () => {
    const c = catalog().find(x => x.id === ui.exEdit);
    if (!c || c.n) return;
    if (!confirm(`¿Eliminar “${c.name}”?${c.days.length ? ' Se quita de: ' + c.days.join(', ') + '.' : ''}`)) return;
    db.routines.forEach(r => { r.exercises = r.exercises.filter(x => x.id !== c.id); });
    save(); toast('Ejercicio eliminado'); go('exlist');
  },
  newDay: d => {
    if (db.routines.length >= FREE_DAYS && needPro(ui.view)) return;
    const r = { id: uid(), name: 'Nuevo día', exercises: [] };
    db.routines.push(r); const p = activePhase(); if (p) p.routineIds.push(r.id);
    save(); ui.planId = r.id; ui.planBack = d.back || 'home'; go('plan');
  },
  newPhase: () => openPhase(null),
  editPhase: d => openPhase(d.id),
  activate: d => activatePhase(d.id),
  restAfter: d => { if (needPro('programa')) return; const p = phaseById(d.id); p.restAfter = !p.restAfter; save(); rerender(); },
  endPhase: d => {
    const p = phaseById(d.id);
    if (!confirm(`¿Dar por terminada ${p.name}? Su historial se conserva.`)) return;
    p.state = 'done'; p.endedOn = todayISO(); save(); rerender();
  },
  delPhase: () => {
    const f = ui.form;
    if (!confirm(`¿Eliminar ${f.name}? Los entrenos registrados se conservan.`)) return;
    db.programs = db.programs.filter(p => p.id !== f.id); save(); go('programa');
  },

  step: d => {
    const e = cur(), t = d.s === 'e' ? e.eff : e.warm[+d.s], st = d.f === 'w' ? stepFor(unitOf(e)) : 1;
    t[d.f] = Math.max(0, Math.round((t[d.f] + st * +d.d) * 100) / 100); save(); rerender();
  },
  toggleWarm: d => { const w = cur().warm[+d.k]; w.done = !w.done; if (w.done) { tStart(); startRest(db.settings.restWarm); } save(); rerender(); },
  addWarm: () => { const e = cur(); e.warm.push({ w: roundTo(e.eff.w * 0.75, stepFor(unitOf(e))), r: 6, done: false }); save(); rerender(); },
  delWarm: () => { cur().warm.length = 1; save(); rerender(); },
  tech: d => { cur().eff.tech = d.t; save(); rerender(); },
  toggleEff: () => { const e = cur(); e.eff.done = !e.eff.done; if (e.eff.done) { tStart(); startRest(db.settings.restEff); } save(); rerender(); },
  tStart: () => { tStart(); save(); rerender(); },
  tPause: () => { tPause(); save(); rerender(); },
  tReset: () => { if (tElapsed(db.current) > 0 && !confirm('¿Reiniciar el cronómetro a 0:00? Tus series registradas se conservan.')) return; tReset(); save(); rerender(); },
  leaveTrain: () => {
    const c = db.current;
    if (c && !anyDone(c) && tElapsed(c) === 0) { db.current = null; stopRest(); save(); toast('No registraste nada: el entreno se cerró sin guardar'); }
    go('home');
  },
  prevEx: () => { db.current.idx--; save(); go('train'); },
  nextEx: () => { db.current.idx++; save(); go('train'); },
  finish: finishTraining,
  discard: () => { if (confirm('¿Descartar este entreno? No se guardará nada.')) { db.current = null; stopRest(); save(); go('home'); } },
  skipRest: () => { stopRest(); rerender(); },

  warmups: d => { routine(ui.planId).exercises[+d.i].warmups = +d.n; save(); rerender(); },
  unit: d => { setShared(routine(ui.planId).exercises[+d.i].id, { unit: d.u }); save(); rerender(); },
  exMove: d => {
    const xs = routine(ui.planId).exercises, i = +d.i, j = i + +d.d;
    if (j < 0 || j >= xs.length) return;
    const t = xs[i]; xs[i] = xs[j]; xs[j] = t; save(); rerender();
  },
  exDel: d => {
    const xs = routine(ui.planId).exercises, i = +d.i;
    if (!confirm(`¿Quitar "${xs[i].name}" de este día? Su historial se conserva.`)) return;
    xs.splice(i, 1); save(); rerender();
  },
  exAdd: () => {
    const inp = $('#newex'), v = (inp ? inp.value : ui.q || '').trim();
    if (!v) return toast('Escribe el nombre del ejercicio');
    const r = routine(ui.planId), same = ownByName(v);
    if (same) { if (!addExerciseToDay(r, same.id)) return; toast(`Ya existía “${same.name}”: se usa el mismo historial`); }
    else { const g = ui.ng || guessGroup(v); r.exercises.push({ id: uid(), name: v, warmups: 1, group: g, unit: 'kg' }); toast(`Creado en ${g}: ${v}`); }
    ui.q = ''; ui.ng = null; save(); rerender();
    const n = $('#newex'); if (n) n.focus();
  },
  delRoutine: () => {
    const r = routine(ui.planId);
    if (!confirm(`¿Eliminar el día "${r.name}"? Tu historial se conserva.`)) return;
    db.routines = db.routines.filter(x => x.id !== r.id);
    db.programs.forEach(p => { p.routineIds = p.routineIds.filter(id => id !== r.id); });
    save(); go(ui.planBack || 'home');
  },

  pPreset: d => { ui.form.name = d.n; rerender(); },
  pStep: d => { const f = ui.form, lim = { weeks: [1, 52], cycles: [1, 30] }[d.k]; f[d.k] = Math.min(lim[1], Math.max(lim[0], f[d.k] + +d.d)); rerender(); },
  pDays: d => { ui.form.days = +d.n; rerender(); },
  pRoutine: d => { const ids = ui.form.routineIds, i = ids.indexOf(d.id); if (i >= 0) ids.splice(i, 1); else ids.push(d.id); rerender(); },
  savePhase,

  chType: d => { ui.ch.type = d.v; ui.ch.sel = null; rerender(); },
  chRange: d => { ui.ch.range = d.v; ui.ch.sel = null; rerender(); },
  chSel: d => { ui.ch.sel = +d.k; rerender(); },

  setNum: d => { db.settings[d.k] = +d.n; save(); rerender(); },
  setNeon: d => { db.settings.neon = d.v; applyNeon(); save(); rerender(); },
  exportCsv,
  backup: () => download(JSON.stringify(db, null, 1), 'application/json', `${fileSlug}-respaldo-${todayISO()}.json`),
  importBtn: () => $('#importFile').click(),
  demo: loadDemo,
  restart: () => { ui.tpl = db.template || 'clasico'; go(db.onboarded ? 'welcome2' : 'welcome'); },
  reset: () => {
    if (confirm('¿Borrar TODOS los datos? Descarga un respaldo antes.') && confirm('¿Seguro? Esto no se puede deshacer.')) { db = seed(); save(); go('welcome'); }
  }
};

document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-a]');
  if (!b || b.disabled) return;
  const fn = ACT[b.dataset.a];
  if (fn) fn(b.dataset);
});
document.addEventListener('change', ev => {
  const t = ev.target, f = t.dataset.f;
  if (t.id === 'importFile') { importFile(t.files[0]); t.value = ''; return; }
  if (t.id === 'csvFile') { const fl = t.files[0]; t.value = ''; if (fl) readText(fl, importCsvText); return; }
  if (ui.view === 'train' && t.dataset.s !== undefined) {
    const e = cur(), tg = t.dataset.s === 'e' ? e.eff : e.warm[+t.dataset.s];
    tg[f] = Math.max(0, num(t.value, tg[f])); if (f === 'r') tg.r = Math.round(tg.r);
    save(); rerender(); return;
  }
  if (f === 'chEx') { ui.ch.ex = t.value; ui.ch.sel = null; rerender(); return; }
  if (f === 'progName') { db.programName = t.value.trim() || 'Mi programa'; save(); return; }
  if (f === 'rname') { routine(ui.planId).name = t.value.trim() || 'Día'; save(); return; }
  if (f === 'exname') {
    const v = t.value.trim(), x = routine(ui.planId).exercises[+t.dataset.i];
    if (!v) return;
    const clash = ownByName(v);
    if (clash && clash.id !== x.id) { toast(`Ya existe “${clash.name}”. Fusiónalos en Ajustes › Mis ejercicios.`); t.value = x.name; return; }
    setShared(x.id, { name: v }); save(); return;
  }
  if (f === 'exgroup') { setShared(routine(ui.planId).exercises[+t.dataset.i].id, { group: t.value }); save(); return; }
  if (f === 'exnotes') { routine(ui.planId).exercises[+t.dataset.i].notes = t.value.trim(); save(); return; }
  if (f === 'repMin' || f === 'repMax') { const v = Math.round(num(t.value, 0)); routine(ui.planId).exercises[+t.dataset.i][f] = v > 0 ? v : null; save(); return; }
  if (f === 'pstart' && t.value) { ui.form.start = t.value; rerender(); }
});
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.dataset.f === 'pname') ui.form.name = t.value;
  if (t.dataset.f === 'exfName') ui.exForm.name = t.value;
  if (t.id === 'newex') { ui.q = t.value; if (!t.value.trim()) ui.ng = null; const s = $('#sugg'); if (s) s.innerHTML = suggHtml(ui.q); }
  if (t.id === 'catq2') { ui.cf.q = t.value; const s = $('#catBody'); if (s) s.innerHTML = catViewBody(); }
  if (t.id === 'exq') { ui.exq = t.value; const s = $('#exlistBody'); if (s) s.innerHTML = exListBody(); }
});
function doMerge(dstId) {
  const cat = catalog(), src = cat.find(x => x.id === ui.exEdit), dst = cat.find(x => x.id === dstId);
  if (!src || !dst || src.id === dst.id) return;
  if (!confirm(`¿Combinar “${src.name}” con “${dst.name}”?\n\nQueda solo “${dst.name}” con ${src.n + dst.n} sesiones. Esto no se puede deshacer (descarga un respaldo antes si tienes dudas).`)) return;
  mergeExercise(src.id, dst.id); save();
  toast(`Combinado: ${src.n + dst.n} sesiones en “${dst.name}”`);
  ui.mergeOpen = false; ui.exEdit = dst.id; ui.exForm = { name: dst.name, group: dst.group, unit: dst.unit }; go('exedit');
}
document.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.id === 'newex') ACT.exAdd(); });
document.addEventListener('focusin', ev => { if (ev.target.matches('.stepper input')) ev.target.select(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') { wake(ui.view === 'train'); tick(); }
});

if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
fillGroups();
render();

'use strict';
/* Ilustraciones de ejercicios: hoja "Cómo se hace" que se abre solo cuando el usuario la pide.
   Gratis: las ilustraciones marcadas f:1 en ilustraciones.js (la mitad de los básicos).
   Premium: todas. En modo servidor, las Premium se descargan y se guardan solo las de sus días. */

const ilusKey = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const ILUS_BY = new Map(ILUS_INDEX.map(i => [ilusKey(i.n), i]));
// Nombres cortos (enfoques, HD) que apuntan a la ilustración del catálogo
const ILUS_SIN = {
  'Curl femoral': 'Curl femoral acostado', 'Elevación de pantorrilla de pie': 'Elevación de pantorrilla de pie en máquina',
  'Pantorrilla de pie': 'Elevación de pantorrilla de pie en máquina', 'Pantorrilla sentado': 'Elevación de pantorrilla sentado',
  'Elevaciones posteriores': 'Elevaciones posteriores con mancuernas', 'Elevaciones laterales': 'Elevaciones laterales con mancuernas',
  'Elevación lateral en polea': 'Elevaciones laterales en polea', 'Extensión de tríceps en polea': 'Extensión de tríceps en polea con barra',
  'Extensión de tríceps sobre la cabeza': 'Extensión de tríceps sobre la cabeza en polea', 'Jalón agarre amplio': 'Jalón al pecho agarre abierto',
  'Jalón al pecho': 'Jalón al pecho agarre abierto', 'Jalón agarre cerrado': 'Jalón al pecho agarre cerrado',
  'Press militar en máquina': 'Press de hombro en máquina', 'Press militar': 'Press militar con barra de pie',
  'Aperturas en polea': 'Aperturas en polea a media altura', 'Aperturas en pec deck': 'Pec deck', 'Remo con mancuerna': 'Remo con mancuerna a una mano',
  'Sentadilla': 'Sentadilla con barra', 'Fondos con peso': 'Fondos en paralelas', 'Peso muerto': 'Peso muerto convencional',
  'Curl martillo': 'Curl martillo con mancuernas', 'Peso muerto rumano': 'Peso muerto rumano con barra', 'Extensiones unilaterales': 'Extensiones de pierna'
};
for (const [a, b] of Object.entries(ILUS_SIN)) { const i = ILUS_BY.get(ilusKey(b)); if (i && !ILUS_BY.has(ilusKey(a))) ILUS_BY.set(ilusKey(a), i); }
const ILUS_FREE = ILUS_INDEX.filter(i => i.f).length;
const ILUS_MEM = new Map();   // svg ya leídos en esta sesión

// Busca la ilustración por nombre del ejercicio; si el usuario lo renombró, prueba con sus alias
function ilusFor(name, id) {
  let i = ILUS_BY.get(ilusKey(name));
  if (!i && id && db.settings.aliases) for (const a of (db.settings.aliases[id] || [])) { i = ILUS_BY.get(ilusKey(a)); if (i) break; }
  return i || null;
}
const ilusOk = i => !!i && (i.f || isPro());
const ilusLocal = i => ILUS_CFG.modo === 'local' || !!i.f;
const ilusUrl = i => (ilusLocal(i) ? ILUS_CFG.local : ILUS_CFG.servidor) + i.s + '.svg';

async function ilusSvg(i) {
  if (ILUS_MEM.has(i.s)) return ILUS_MEM.get(i.s);
  const url = ilusUrl(i);
  let r;
  if (!ilusLocal(i) && 'caches' in window) {
    const c = await caches.open(ILUS_CFG.cache);
    r = await c.match(url);
    if (!r) { r = await fetch(url); if (r.ok) await c.put(url, r.clone()); }
  } else r = await fetch(url);
  if (!r.ok) throw new Error('http ' + r.status);
  const t = await r.text(); ILUS_MEM.set(i.s, t); return t;
}

// Modo servidor + Premium: deja en el teléfono solo las ilustraciones de los ejercicios de sus días
let ilusSyncT = null;
function ilusSync() { clearTimeout(ilusSyncT); ilusSyncT = setTimeout(ilusSyncNow, 2500); }
async function ilusSyncNow() {
  if (ILUS_CFG.modo !== 'servidor' || !('caches' in window)) return;
  try {
    if (!isPro()) { await caches.delete(ILUS_CFG.cache); return; }
    const want = new Set();
    db.routines.forEach(r => r.exercises.forEach(x => { const i = ilusFor(x.name, x.id); if (i && !i.f) want.add(ilusUrl(i)); }));
    const c = await caches.open(ILUS_CFG.cache);
    for (const req of await c.keys()) if (!want.has(req.url) && !want.has(new URL(req.url).href)) await c.delete(req);
    for (const u of want) if (!(await c.match(u))) { const r = await fetch(u); if (r.ok) await c.put(u, r); }
  } catch (e) { /* sin conexión: se intenta la próxima vez */ }
}
async function ilusStatus() {
  if (ILUS_CFG.modo === 'local') return `Periodo de pruebas: las ${ILUS_INDEX.length} ilustraciones están en este teléfono. ${isPro() ? 'Con Premium ves todas.' : `Gratis ves ${ILUS_FREE}; las demás, con Premium.`}`;
  let n = 0; try { if ('caches' in window) n = (await (await caches.open(ILUS_CFG.cache)).keys()).length; } catch (e) { /* nada */ }
  return isPro() ? `${ILUS_FREE} incluidas en la app + ${n} descargadas de tus días. Las demás se bajan al abrirlas con internet.` : `Gratis: ${ILUS_FREE} incluidas en la app.`;
}

/* ---------- botón y hoja ---------- */
const ICON_FIG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M12 7v6l-3 7M12 13l3 7M7 10l5-2 5 2"/></svg>';
// Botón "Cómo se hace": solo aparece si el ejercicio tiene ilustración
function ilusBtn(name, id, small) {
  const i = ilusFor(name, id); if (!i) return '';
  const lock = ilusOk(i) ? '' : ICON.lock;
  return small
    ? `<button class="icon-btn ilus-b" data-a="ilus" data-n="${esc(name)}" data-id="${esc(id || '')}" aria-label="Cómo se hace ${esc(name)}">${ICON_FIG}${lock ? `<i class="ilus-lk">${lock}</i>` : ''}</button>`
    : `<button class="btn-ilus" data-a="ilus" data-n="${esc(name)}" data-id="${esc(id || '')}">${ICON_FIG}Cómo se hace${lock}</button>`;
}
function ilusOpen(name, id) {
  const i = ilusFor(name, id); if (!i) return;
  const sh = $('#sheet'), ok = ilusOk(i);
  const chips = i.m.map(m => `<span class="mc p">${m}</span>`).join('') + i.x.map(m => `<span class="mc">${m}</span>`).join('');
  const body = ok
    ? `<div class="ilus-fig ${i.w ? 'wide' : ''}" id="ilusFig"><span class="muted sm">Cargando…</span></div>
       <div class="mcs">${chips}</div>
       <div class="ilus-tx"><span class="eyebrow">Técnica</span><p>${esc(i.t)}</p></div>
       ${i.a ? `<div class="ilus-tx ag"><span class="eyebrow">Agarre</span><p>${esc(i.a)}</p></div>` : ''}
       <span class="muted sm">Neón fuerte: músculo principal · tenue: músculos que ayudan · líneas azules: guías de técnica.</span>`
    : `<div class="mcs">${chips}</div>
       <div class="card upsell ilus-lock"><span class="tag-pro">PREMIUM</span><span style="font-weight:700;font-size:17px">Ilustración animada, técnica y agarre</span>
       <span class="sm" style="color:var(--warm-tx)">Gratis tienes la de ${ILUS_FREE} ejercicios básicos. Con Premium, los ${ILUS_INDEX.length} del catálogo.</span>
       <button class="btn acc" data-a="ilusPro">Ver Premium</button></div>`;
  sh.innerHTML = `<div class="sheet-bg" data-a="ilusClose"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ilusT">
    <div class="sheet-h"><div class="col" style="min-width:0;flex:1"><span class="eyebrow hl">Cómo se hace</span><h2 id="ilusT">${esc(i.n)}</h2></div>
    <button class="icon-btn" data-a="ilusClose" aria-label="Cerrar">${ICON.close}</button></div>
    <div class="sheet-b">${body}</div></div>`;
  sh.hidden = false; document.body.classList.add('noscroll');
  requestAnimationFrame(() => sh.classList.add('on'));
  sh.querySelector('.sheet-h .icon-btn').focus({ preventScroll: true });
  if (ok) ilusSvg(i).then(svg => { const f = $('#ilusFig'); if (f) f.innerHTML = svg; })
    .catch(() => { const f = $('#ilusFig'); if (f) f.innerHTML = `<span class="muted sm" style="padding:24px;text-align:center">Sin conexión. Esta ilustración se descarga la primera vez que la abres con internet (o al agregar el ejercicio a uno de tus días).</span>`; });
}
function ilusClose() {
  const sh = $('#sheet'); if (sh.hidden) return;
  sh.classList.remove('on'); document.body.classList.remove('noscroll');
  setTimeout(() => { sh.hidden = true; sh.innerHTML = ''; }, 180);
}
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') ilusClose(); });

const ILUS_ACT = {
  ilus: d => ilusOpen(d.n, d.id),
  ilusClose: () => ilusClose(),
  ilusPro: () => { ilusClose(); openPremium(ui.view); }
};

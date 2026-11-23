'use strict';
/* Ejercicios similares: familias de ejercicios equivalentes (mismo músculo y mismo movimiento).
   El orden dentro de cada familia va del más parecido al menos parecido.
   Un ejercicio puede estar en varias familias. Los nombres deben ser iguales a los de catalogo.js. */
const FAMILIAS = [
  // Pecho
  ['Press de banca con barra', 'Press de banca con mancuernas', 'Press plano en Smith', 'Press de pecho en máquina', 'Press Hammer plano', 'Press de pecho en polea', 'Lagartijas'],
  ['Press inclinado con barra', 'Press inclinado con mancuernas', 'Press inclinado en Smith', 'Press inclinado en máquina', 'Press Hammer inclinado'],
  ['Press declinado con barra', 'Press declinado con mancuernas', 'Fondos para pecho'],
  ['Aperturas con mancuernas', 'Pec deck', 'Aperturas en polea a media altura', 'Cruce de poleas alto', 'Cruce de poleas bajo', 'Aperturas inclinadas con mancuernas'],
  ['Aperturas inclinadas con mancuernas', 'Cruce de poleas bajo', 'Aperturas con mancuernas', 'Pec deck'],
  ['Lagartijas', 'Lagartijas declinadas', 'Fondos para pecho', 'Press de banca con mancuernas'],
  ['Pullover con mancuerna', 'Pullover en máquina', 'Jalón con brazos rectos en polea'],
  // Espalda
  ['Dominadas', 'Dominadas asistidas en máquina', 'Jalón al pecho agarre abierto', 'Jalón tras nuca'],
  ['Dominadas supinas', 'Jalón al pecho agarre supino', 'Jalón al pecho agarre cerrado', 'Dominadas asistidas en máquina'],
  ['Jalón al pecho agarre abierto', 'Jalón al pecho agarre cerrado', 'Jalón al pecho agarre supino', 'Dominadas asistidas en máquina', 'Dominadas', 'Jalón tras nuca'],
  ['Remo con barra', 'Remo Pendlay', 'Remo en barra T', 'Remo con mancuernas en banco inclinado', 'Remo en máquina', 'Remo Hammer', 'Remo sentado en polea'],
  ['Remo con mancuerna a una mano', 'Remo en polea a una mano', 'Remo Hammer', 'Remo con mancuernas en banco inclinado'],
  ['Remo sentado en polea', 'Remo en máquina', 'Remo Hammer', 'Remo en barra T', 'Remo con barra', 'Remo invertido'],
  ['Peso muerto convencional', 'Peso muerto sumo', 'Rack pull', 'Peso muerto rumano con barra'],
  ['Hiperextensiones', 'Buenos días con barra', 'Peso muerto rumano con barra'],
  ['Encogimientos con barra', 'Encogimientos con mancuernas'],
  // Hombro
  ['Press militar con barra de pie', 'Press militar sentado con barra', 'Press de hombro con mancuernas', 'Press militar en Smith', 'Press de hombro en máquina', 'Press Arnold', 'Press landmine'],
  ['Elevaciones laterales con mancuernas', 'Elevaciones laterales en polea', 'Elevaciones laterales en máquina', 'Remo al mentón en polea'],
  ['Elevaciones frontales con mancuernas', 'Elevaciones frontales con disco', 'Elevaciones frontales en polea'],
  ['Elevaciones posteriores con mancuernas', 'Deltoide posterior en máquina', 'Cruce de poleas invertido', 'Face pull en polea'],
  ['Remo al mentón con barra', 'Remo al mentón en polea', 'Elevaciones laterales con mancuernas'],
  // Bíceps
  ['Curl con barra', 'Curl con barra Z', 'Curl con mancuernas alterno', 'Curl en polea baja con barra', 'Curl de bíceps en máquina', 'Curl con soga en polea', 'Curl drag con barra'],
  ['Curl predicador con barra Z', 'Curl predicador con mancuerna', 'Curl predicador en máquina', 'Curl araña con barra Z', 'Curl araña con mancuernas', 'Curl concentrado'],
  ['Curl inclinado con mancuernas', 'Curl bayesiano en polea', 'Curl con mancuernas alterno'],
  ['Curl martillo con mancuernas', 'Curl martillo con soga en polea', 'Curl Zottman', 'Curl inverso con barra Z'],
  // Tríceps
  ['Extensión de tríceps en polea con barra', 'Extensión de tríceps en polea con soga', 'Extensión de tríceps en polea a una mano', 'Extensión de tríceps en máquina', 'Patada de tríceps en polea'],
  ['Extensión de tríceps sobre la cabeza en polea', 'Extensión sobre la cabeza con mancuerna', 'Press francés con barra Z', 'Press francés con mancuernas'],
  ['Press francés con barra Z', 'Press francés con mancuernas', 'Extensión sobre la cabeza con mancuerna', 'Press JM'],
  ['Patada de tríceps con mancuerna', 'Patada de tríceps en polea', 'Extensión de tríceps en polea a una mano'],
  ['Fondos en paralelas', 'Fondos en máquina', 'Fondos en banco', 'Press de banca agarre cerrado', 'Lagartijas diamante'],
  ['Press de banca agarre cerrado', 'Press JM', 'Fondos en paralelas', 'Lagartijas diamante'],
  // Pierna
  ['Sentadilla con barra', 'Sentadilla en Smith', 'Sentadilla hack', 'Sentadilla péndulo', 'Prensa de piernas', 'Sentadilla frontal', 'Sentadilla goblet'],
  ['Sentadilla frontal', 'Sentadilla goblet', 'Sentadilla hack', 'Sentadilla con barra'],
  ['Sentadilla sumo', 'Sentadilla goblet', 'Peso muerto sumo', 'Abducción de cadera en máquina'],
  ['Prensa de piernas', 'Prensa de piernas horizontal', 'Sentadilla hack', 'Sentadilla péndulo', 'Sentadilla en Smith'],
  ['Sentadilla búlgara con mancuernas', 'Desplantes con mancuernas', 'Desplantes en Smith', 'Desplantes caminando', 'Step-up con mancuernas'],
  ['Extensiones de pierna', 'Sissy squat', 'Sentadilla isométrica en pared'],
  ['Sentadilla isométrica en pared', 'Sentadilla goblet', 'Extensiones de pierna', 'Sissy squat'],
  ['Curl femoral acostado', 'Curl femoral sentado', 'Curl femoral de pie a una pierna', 'Nordic curl'],
  ['Peso muerto rumano con barra', 'Peso muerto rumano con mancuernas', 'Peso muerto piernas rígidas', 'Buenos días con barra'],
  ['Hip thrust con barra', 'Hip thrust en máquina', 'Puente de glúteo', 'Patada de glúteo en máquina', 'Patada de glúteo en polea', 'Swing con kettlebell'],
  ['Patada de glúteo en polea', 'Patada de glúteo en máquina', 'Hip thrust en máquina'],
  ['Elevación de pantorrilla de pie en máquina', 'Elevación de pantorrilla en Smith', 'Pantorrilla en prensa', 'Elevación de pantorrilla a una pierna con mancuerna', 'Elevación de pantorrilla sentado'],
  ['Elevación de pantorrilla sentado', 'Elevación de pantorrilla de pie en máquina', 'Pantorrilla en prensa'],
  // Core
  ['Crunch abdominal', 'Crunch en polea de rodillas', 'Crunch en máquina', 'Abdominales en banco declinado'],
  ['Crunch inverso', 'Elevación de piernas colgado', 'Elevación de rodillas en paralelas', 'Elevación de piernas acostado'],
  ['Plancha', 'Rueda abdominal', 'Dead bug', 'Pallof press en polea'],
  ['Plancha lateral', 'Russian twist', 'Leñador en polea', 'Inclinación lateral con mancuerna', 'Pallof press en polea']
];

// Busca la entrada del catálogo de un ejercicio (por nombre, alias o nombre corto de enfoques)
function catOf(name, id) {
  const tries = [name].concat(id ? aliasesOf(id) : []);
  for (const t of tries) {
    const k = normName(t);
    let c = CATALOGO.find(x => normName(x.n) === k);
    if (!c) { const s = Object.keys(ILUS_SIN).find(a => normName(a) === k); if (s) c = CATALOGO.find(x => x.n === ILUS_SIN[s]); }
    if (c) return c;
  }
  return null;
}
// Equivalentes: primero las familias donde el ejercicio va primero, luego las demás donde aparece
function similaresDe(c) {
  if (!c) return [];
  const own = FAMILIAS.filter(f => f[0] === c.n), rest = FAMILIAS.filter(f => f[0] !== c.n && f.includes(c.n));
  const out = [];
  own.concat(rest).forEach(f => f.forEach(n => { if (n !== c.n && !out.includes(n)) out.push(n); }));
  return out.map(n => CATALOGO.find(x => x.n === n)).filter(Boolean);
}

/* ---------- hoja de "Ejercicios similares" y confirmaciones ---------- */
function sheetShow(eyebrow, title, body) {
  const sh = $('#sheet');
  sh.innerHTML = `<div class="sheet-bg" data-a="ilusClose"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="shT">
    <div class="sheet-h"><div class="col" style="min-width:0;flex:1"><span class="eyebrow hl">${eyebrow}</span><h2 id="shT">${esc(title)}</h2></div>
    <button class="icon-btn" data-a="ilusClose" aria-label="Cerrar">${ICON.close}</button></div>
    <div class="sheet-b">${body}</div></div>`;
  const was = !sh.hidden && sh.classList.contains('on');
  sh.hidden = false; document.body.classList.add('noscroll');
  if (!was) requestAnimationFrame(() => sh.classList.add('on'));
  const f = sh.querySelector('.sheet-b .btn.acc') || sh.querySelector('.sheet-h .icon-btn');
  if (f) f.focus({ preventScroll: true });
}
const lastTxt = id => { const l = id && lastEntry(id); return l ? `Último: ${fmt(l.eff.w)} ${unitOf(l)} × ${l.eff.r} · ${fdate(l.date)}` : 'Sin registro'; };
function simRow(o, used) {
  const own = ownByName(o.n), ok = !o.c || catAllowed(o.c) || !!own;
  const tag = used ? '<span class="tag">Hoy ✓</span>' : ok ? '<span class="use">Usar</span>' : '<span class="tag-pro">PREMIUM</span>';
  return `<button class="sugg" data-a="${ok ? 'simPick' : 'simPro'}" data-n="${esc(o.n)}" ${used ? 'disabled' : ''}><span class="col"><span style="font-weight:600">${esc(o.n)}</span><span class="muted sm">${o.c ? esc(o.c.e) + ' · ' : ''}${lastTxt(own && own.id)}</span></span>${tag}</button>`;
}
function simOpen(more) {
  const c = db.current, e = cur(); if (!e) return;
  const base = e.swapFrom || { id: e.exerciseId, name: e.name };
  const bc = catOf(base.name, base.id);
  const group = bc ? bc.g : (exById(base.id) || {}).group || guessGroup(base.name);
  const today = new Set(c.entries.map(x => normName(x.name)));
  const eq = similaresDe(bc).map(x => ({ n: x.n, c: x }));
  const skip = new Set([normName(base.name), normName(e.name)].concat(eq.map(o => normName(o.n))));
  const mas = CATALOGO.filter(x => x.g === group && !skip.has(normName(x.n))).map(x => ({ n: x.n, c: x }));
  catalog().filter(x => x.group === group && !catOf(x.name, x.id) && !skip.has(normName(x.name))).forEach(x => mas.push({ n: x.name, c: null }));
  const rows = list => `<div class="card list">${list.map(o => simRow(o, today.has(normName(o.n)))).join('')}</div>`;
  let b = e.swapFrom ? `<div class="card notes"><span class="note-t">Hoy estás haciendo <b>${esc(e.name)}</b> en lugar de ${esc(base.name)}.</span><button class="btn" data-a="simPick" data-n="${esc(base.name)}" data-back="1">Volver a ${esc(base.name)}</button></div>` : '';
  b += eq.length ? `<span class="eyebrow">Equivalentes · mismo músculo y movimiento</span>${rows(eq)}` : `<span class="muted sm">No hay equivalentes directos en el catálogo; elige uno de ${esc(group)}.</span>`;
  if (mas.length) b += more || !eq.length ? `<span class="eyebrow mt">Más de ${esc(group)}</span>${rows(mas)}` : `<button class="btn text" data-a="simMore">Ver más de ${esc(group)} (${mas.length})</button>`;
  b += `<span class="muted sm">Lo que registres se guarda en el historial del ejercicio que elijas.</span>`;
  sheetShow('Ejercicios similares', base.name, b);
}
function simAsk(name, back) {
  const e = cur(), base = e.swapFrom || { id: e.exerciseId, name: e.name };
  const marked = e.eff.done || e.warm.some(w => w.done) || (e.sets || []).some(x => x.done);
  const lose = marked ? `<span class="sm" style="color:var(--bad)">Las series que ya marcaste de ${esc(e.name)} se borran.</span>` : '';
  if (back) {
    sheetShow('Ejercicios similares', `¿Volver a ${name}?`, `${lose}
      <button class="btn acc lg" data-a="simDo" data-n="${esc(name)}" data-m="hoy">Volver a ${esc(name)}</button>
      <button class="btn" data-a="simBack">Cancelar</button>`);
    return;
  }
  sheetShow('Ejercicios similares', `¿Cambiar a ${name}?`, `<span class="muted">Tus series de hoy se guardan en el historial de ${esc(name)}, no en el de ${esc(base.name)}.</span>${lose}
    <button class="btn acc lg" data-a="simDo" data-n="${esc(name)}" data-m="hoy">Cambiar solo hoy</button>
    <button class="btn" data-a="simDo" data-n="${esc(name)}" data-m="rutina">Cambiar en mi rutina</button>
    <span class="muted sm">“En mi rutina” lo deja en lugar de ${esc(base.name)} en este día para los próximos entrenos.</span>
    <button class="btn text" data-a="simBack">Cancelar</button>`);
}
function simDo(name, mode) {
  const c = db.current, e = cur(), base = e.swapFrom || { id: e.exerciseId, name: e.name };
  const own = ownByName(name), cc = catOf(name);
  const id = own ? own.id : uid();
  if (c.entries.some((x, i) => i !== c.idx && x.exerciseId === id)) { toast('Ese ejercicio ya está en el entreno de hoy'); return; }
  const unit = own ? own.unit : cc ? catUnit(cc.e) : unitOf(e);
  const group = own ? own.group : cc ? cc.g : guessGroup(name);
  const bx = exById(base.id) || {};
  const ne = mkEntry(Object.assign({ id, name: own ? own.name : name, unit, warmups: e.warm.length || 1, repMin: bx.repMin, repMax: bx.repMax },
    bx.mode === 'series' ? { mode: 'series', sets: bx.sets, rest: bx.rest } : {}, isTimeName(name) || (!cc && bx.time) ? { time: true } : {}));
  if (id !== base.id) ne.swapFrom = base;
  if (cc) { ne.group = group; ne.equip = cc.e; }
  c.entries[c.idx] = ne;
  if (mode === 'rutina') {
    const r = routine(c.routineId), i = r ? r.exercises.findIndex(x => x.id === base.id) : -1;
    if (i >= 0) {
      if (r.exercises.some(x => x.id === id)) r.exercises.splice(i, 1);
      else { r.exercises[i] = Object.assign({}, r.exercises[i], { id, name: ne.name, group, unit }, cc ? { equip: cc.e } : {}); if (ne.time) r.exercises[i].time = true; else delete r.exercises[i].time; }
      delete ne.swapFrom;
    }
  }
  save(); ilusClose(); rerender();
  toast(id === base.id ? 'De vuelta a ' + ne.name : mode === 'rutina' ? 'Cambiado en tu rutina: ' + ne.name : 'Solo hoy: ' + ne.name);
}
function finishAsk() {
  const c = db.current, n = c.entries.length, done = c.entries.filter(isDone);
  const falta = c.entries.filter(e => !isDone(e)).map(e => e.name);
  const body = !done.length
    ? `<span class="muted">No registraste ninguna serie. Si terminas ahora, este entreno no se guarda.</span>
       <button class="btn acc lg" data-a="ilusClose">Seguir entrenando</button>
       <button class="btn" data-a="finishGo">Terminar sin guardar</button>`
    : `<span class="muted">Registraste ${done.length} de ${n} ejercicios.</span>
       ${falta.length ? `<div class="card notes"><span class="eyebrow">Te ${falta.length === 1 ? 'falta' : 'faltan'}</span><span class="note-t">${falta.map(esc).join(' · ')}</span></div>` : ''}
       <button class="btn acc lg" data-a="ilusClose">Seguir entrenando</button>
       <button class="btn" data-a="finishGo">Terminar y guardar</button>`;
  sheetShow('Cerrar entreno', '¿Terminar el entreno?', body);
}
const SIM_ACT = {
  similares: () => simOpen(false),
  simMore: () => simOpen(true),
  simPick: d => simAsk(d.n, !!d.back),
  simBack: () => simOpen(false),
  simDo: d => simDo(d.n, d.m),
  simPro: () => { ilusClose(); openPremium(ui.view); },
  finish: () => finishAsk(),
  finishGo: () => { ilusClose(); finishTraining(true); }
};

/* ---------- explicación de las técnicas de intensidad ---------- */
const TECH_INFO = [
  ['Normal', 'Haces la serie hasta el fallo: el punto en que ya no puedes completar otra repetición con buena técnica. Es la opción de todos los días.'],
  ['Forzadas', 'Al llegar al fallo, un compañero te ayuda apenas lo necesario para sacar 1 o 2 repeticiones más. Tú sigues empujando con todo; él solo te ayuda a pasar el punto difícil.'],
  ['Rest-pause', 'Al llegar al fallo, deja el peso, descansa 10 a 15 segundos y saca 1 o 2 repeticiones más con el mismo peso. Puedes repetir la pausa una vez más.'],
  ['Negativas', 'Te enfocas en la bajada: bajas el peso lento y controlado, en 4 a 6 segundos. Puedes hacerlo durante toda la serie o, al llegar al fallo, con ayuda para subir y bajando tú solo.']
];
function techInfo() {
  const e = db.current && cur(), sel = e ? e.eff.tech : '';
  sheetShow('Técnica de intensidad', '¿Qué es cada una?', TECH_INFO.map(([t, d]) =>
    `<div class="card tech-i ${t === sel ? 'on' : ''}"><span class="rname" style="font-size:17px">${t}${t === sel ? ' <span class="tag">Elegida</span>' : ''}</span><span class="muted" style="line-height:1.45">${d}</span></div>`).join('') +
    `<span class="muted sm">Las técnicas distintas a Normal son muy exigentes: úsalas en la última serie y no en todos los ejercicios ni en todos los entrenos. Lo que elijas queda anotado junto a la serie.</span>
    <button class="btn acc lg" data-a="ilusClose">Entendido</button>`);
}
SIM_ACT.techInfo = () => techInfo();

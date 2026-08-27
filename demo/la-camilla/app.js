import { CATEGORIES, SERVICES, CARE, DEMO_CLIENT, SALON_CLIENTS, SALON_DAY } from './data.js';

/* ============================================================
   La Camilla Club — demo Faze 1
   Bez backenda: stanje se čuva u localStorage ovog preglednika.
   ============================================================ */

const KEY = 'lcc.v1';
const svc = id => SERVICES.find(s => s.id === id);

/* ---------- datumi ---------- */
const DW = ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'];
const MO = ['siječnja','veljače','ožujka','travnja','svibnja','lipnja','srpnja','kolovoza','rujna','listopada','studenoga','prosinca'];
const MOS = ['sij','velj','ožu','tra','svi','lip','srp','kol','ruj','lis','stu','pro'];

const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const iso = d => new Date(d).toISOString();
const fmtTime = d => new Date(d).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });
const fmtLong = d => { const x = new Date(d); return `${DW[x.getDay()]}, ${x.getDate()}. ${MO[x.getMonth()]}`; };
const fmtShort = d => { const x = new Date(d); return `${x.getDate()}. ${MOS[x.getMonth()]}`; };
const eur = n => `${n} €`;
const dur = m => m >= 60 ? (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`) : `${m} min`;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- stanje ---------- */
function seed() {
  const now = new Date();
  const at = (dayOffset, h, m) => { const d = addDays(startOfDay(now), dayOffset); d.setHours(h, m, 0, 0); return iso(d); };

  return {
    user: { ...DEMO_CLIENT },
    points: 140,
    notifications: false,
    programs: [{
      id: 'p1',
      serviceId: 'braz-oboje',
      total: 10,
      done: 4,
      startedAt: at(-28, 17, 30),
      measures: [
        { at: at(-28, 17, 30), label: 'Obujam bokova', value: 102 },
        { at: at(-21, 17, 30), label: 'Obujam bokova', value: 101 },
        { at: at(-14, 17, 30), label: 'Obujam bokova', value: 99.5 },
        { at: at(-7, 17, 30), label: 'Obujam bokova', value: 98.5 },
      ],
      photos: { before: null, after: null },
    }],
    appointments: [
      { id: 'a1', serviceId: 'braz-oboje', at: at(3, 17, 30), status: 'zakazan', programId: 'p1' },
      { id: 'a2', serviceId: 'sec-bikini', at: at(9, 11, 0), status: 'zakazan' },
      { id: 'a3', serviceId: 'braz-oboje', at: at(-7, 17, 30), status: 'obavljen', programId: 'p1' },
      { id: 'a4', serviceId: 'classic-lice', at: at(-11, 10, 0), status: 'obavljen' },
      { id: 'a5', serviceId: 'braz-oboje', at: at(-14, 17, 30), status: 'obavljen', programId: 'p1' },
      { id: 'a6', serviceId: 'sec-bikini', at: at(-18, 11, 0), status: 'obavljen' },
    ],
    waitlist: [],
    lastCare: null,
  };
}

let S;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    S = raw ? JSON.parse(raw) : seed();
  } catch { S = seed(); }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { toast('Nema više mjesta za pohranu u pregledniku.'); }
}
function reset() { localStorage.removeItem(KEY); load(); go('/'); toast('Demo vraćen na početno stanje.'); }

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2800);
}

/* ---------- slobodni termini (deterministički demo) ---------- */
const HOURS = { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 14], 0: null };

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

function slotsFor(date, service) {
  const win = HOURS[new Date(date).getDay()];
  if (!win) return [];
  const out = [];
  const step = 30;
  const start = win[0] * 60;
  const end = win[1] * 60;
  const booked = S.appointments.filter(a => a.status === 'zakazan' && startOfDay(a.at).getTime() === startOfDay(date).getTime());

  for (let m = start; m + service.min <= end; m += step) {
    const d = startOfDay(date);
    d.setMinutes(m);
    const past = d.getTime() < Date.now() + 60 * 60 * 1000;
    const clash = booked.some(a => {
      const s = new Date(a.at).getTime();
      const e = s + svc(a.serviceId).min * 60000;
      return d.getTime() < e && d.getTime() + service.min * 60000 > s;
    });
    const busy = hash(`${d.toDateString()}${m}${service.id}`) < 0.42;
    out.push({ at: iso(d), free: !past && !clash && !busy });
  }
  return out;
}

/* ---------- router ---------- */
const routes = [];
const route = (re, fn) => routes.push([re, fn]);
const go = p => { location.hash = '#' + p; };

function render() {
  const path = (location.hash || '#/').slice(1) || '/';
  const view = document.getElementById('view');

  for (const [re, fn] of routes) {
    const m = path.match(re);
    if (m) {
      view.innerHTML = fn(...m.slice(1));
      view.scrollTop = 0;
      bind(view);
      const salon = path.startsWith('/salon');
      document.getElementById('tabs').classList.toggle('hide', salon);
      document.querySelectorAll('#tabs a').forEach(a => {
        const t = a.dataset.tab;
        const on = t === '/' ? path === '/' : path.startsWith(t);
        on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
      });
      return;
    }
  }
  view.innerHTML = `<div class="top"><h1>Nema te stranice</h1></div><a class="btn" href="#/">Na početnu</a>`;
}

/* ---------- dijelovi ---------- */
const backBtn = (to, label) => `
  <button class="back" data-go="${to}">
    <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg> ${esc(label)}
  </button>`;

function programCard(p, { link = true, title = true } = {}) {
  const s = svc(p.serviceId);
  const left = p.total - p.done;
  const next = S.appointments
    .filter(a => a.programId === p.id && a.status === 'zakazan' && new Date(a.at) > new Date())
    .sort((a, b) => new Date(a.at) - new Date(b.at))[0];

  const ms = p.measures;
  const first = ms[0], last = ms[ms.length - 1];
  const delta = first && last ? +(first.value - last.value).toFixed(1) : 0;

  return `
    <div class="card">
      ${title ? `<p class="eyebrow">Moj program</p><p class="prog-title">${esc(s.name)}</p>` : ''}
      <div class="pips" role="img" aria-label="${p.done} od ${p.total} tretmana obavljeno">
        ${Array.from({ length: p.total }, (_, i) => `<i class="${i < p.done ? 'on' : ''}"></i>`).join('')}
      </div>
      <p class="prog-count num"><b>${p.done} od ${p.total}</b> tretmana · ${left} ${left === 1 ? 'preostao' : 'preostalo'}</p>
      ${delta > 0 ? `<div class="measure"><span>${esc(last.label)}</span><span class="num">${first.value} → <b>${last.value} cm</b></span></div>` : ''}
      <div class="next-line">
        ${next
          ? `Sljedeći tretman <b>${fmtLong(next.at)} u ${fmtTime(next.at)}</b>`
          : `<b>Nema zakazanog termina</b> Ostalo ti je ${left} ${left === 1 ? 'tretman' : 'tretmana'} u programu.`}
      </div>
      ${link ? `<div class="btn-row">
        ${next ? '' : `<a class="btn" href="#/rezerviraj/usluga/${p.serviceId}">Rezerviraj ${p.done + 1}. tretman</a>`}
        <a class="btn ${next ? '' : 'ghost'}" href="#/program/${p.id}">Detalji programa</a>
      </div>` : ''}
    </div>`;
}

function sparkline(measures) {
  if (measures.length < 2) return '';
  const w = 300, h = 60, pad = 6;
  const vals = measures.map(m => m.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = (max - min) || 1;
  const pts = measures.map((m, i) => {
    const x = pad + (i * (w - pad * 2)) / (measures.length - 1);
    const y = pad + ((max - m.value) / span) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;
  const lastP = pts[pts.length - 1];
  return `
    <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img"
         aria-label="Kretanje mjere od ${vals[0]} do ${vals[vals.length - 1]} cm">
      <path class="fillp" d="${area}"/>
      <path d="${line}"/>
      <circle cx="${lastP[0].toFixed(1)}" cy="${lastP[1].toFixed(1)}" r="3.5"/>
    </svg>`;
}

function careBlock(key) {
  const c = CARE[key];
  if (!c) return '';
  return `
    <div class="care">
      <p class="when">${esc(c.when)}</p>
      <h3>${esc(c.title)}</h3>
      <ul>${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`;
}

/* ============================================================
   ZASLONI — klijentica
   ============================================================ */

route(/^\/$/, () => {
  const now = new Date();
  const hour = now.getHours();
  const greet = hour < 11 ? 'Dobro jutro' : hour < 18 ? 'Dobar dan' : 'Dobra večer';
  const first = S.user.name.split(' ')[0];

  const upcoming = S.appointments
    .filter(a => a.status === 'zakazan' && new Date(a.at) > now)
    .sort((a, b) => new Date(a.at) - new Date(b.at));

  const care = S.lastCare ? careBlock(S.lastCare) : '';

  return `
    <div class="top">
      <p class="eyebrow">La Camilla Club</p>
      <h1>${greet}, ${esc(first)}</h1>
      <p class="sub">${fmtLong(now)}</p>
    </div>

    ${S.programs.map(p => programCard(p)).join('')}
    ${S.programs.length === 0 ? `<div class="card"><p class="eyebrow">Moj program</p>
      <p class="prog-title">Još nemaš program</p>
      <p class="tiny muted">Program se dogovara na konzultaciji i onda ga vidiš ovdje — koliko tretmana, koliko je ostalo i kako se mijenjaju mjere.</p>
      <div class="btn-row"><a class="btn ghost" href="#/rezerviraj">Rezerviraj konzultaciju</a></div></div>` : ''}

    <div class="section">
      <div class="section-title"><h2>Sljedeći termini</h2><a href="#/termini">Svi termini</a></div>
      ${upcoming.length ? `<div class="list">${upcoming.slice(0, 3).map(apptRow).join('')}</div>`
        : `<div class="card"><p class="tiny muted">Nemaš zakazanih termina.</p>
           <div class="btn-row"><a class="btn" href="#/rezerviraj">Rezerviraj termin</a></div></div>`}
    </div>

    ${care ? `<div class="section"><div class="section-title"><h2>Njega nakon tretmana</h2></div>${care}</div>` : ''}

    <div class="section">
      <div class="section-title"><h2>Slobodno danas</h2></div>
      <div class="card">
        <p class="tiny muted">Kad se termin otkaže, javimo ti prvoj — po želji s popustom. Prijavi se na listu čekanja za uslugu koju čekaš.</p>
        <div class="btn-row"><a class="btn ghost" href="#/rezerviraj">Odaberi uslugu</a></div>
      </div>
    </div>`;
});

function apptRow(a) {
  const s = svc(a.serviceId);
  const past = a.status !== 'zakazan';
  const d = new Date(a.at);
  return `
    <a class="appt ${past ? 'past' : ''}" href="#/termin/${a.id}" style="text-decoration:none;color:inherit;">
      <div class="when"><div class="d">${d.getDate()}</div><div class="m">${MOS[d.getMonth()]}</div></div>
      <div class="grow">
        <div class="t">${esc(s.name)}</div>
        <div class="s">${fmtTime(a.at)} · ${dur(s.min)} · ${eur(s.price)}${a.programId ? ' · iz programa' : ''}</div>
      </div>
      <svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
    </a>`;
}

/* --- rezervacija: kategorije --- */
route(/^\/rezerviraj$/, () => `
  <div class="top">
    <p class="eyebrow">Rezervacija</p>
    <h1>Što ti danas treba?</h1>
  </div>
  <div class="list">
    ${CATEGORIES.map(c => `
      <a class="row" href="#/rezerviraj/${c.id}">
        <div class="grow">
          <div class="name">${esc(c.name)}</div>
          <div class="meta">${esc(c.sub)} · ${SERVICES.filter(s => s.cat === c.id).length} usluga</div>
        </div>
        <svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
      </a>`).join('')}
  </div>`);

/* --- rezervacija: usluge u kategoriji --- */
route(/^\/rezerviraj\/([a-z]+)$/, cat => {
  const c = CATEGORIES.find(x => x.id === cat);
  if (!c) return `<div class="empty">Nepoznata kategorija.</div>`;
  const list = SERVICES.filter(s => s.cat === cat);
  let out = '', group = null;

  for (const s of list) {
    if (s.group && s.group !== group) { group = s.group; out += `<p class="group-label">${esc(group)}</p>`; }
    out += `
      <a class="row" href="#/rezerviraj/usluga/${s.id}">
        <div class="grow">
          <div class="name">${esc(s.name)}</div>
          <div class="meta">${dur(s.min)}${s.series ? ` · preporuka ${s.series} tretmana` : ''}${s.note ? ` · ${esc(s.note)}` : ''}</div>
        </div>
        <div class="price num">${eur(s.price)}</div>
      </a>`;
  }
  return `
    ${backBtn('/rezerviraj', 'Sva područja')}
    <div class="top"><p class="eyebrow">${esc(c.sub)}</p><h1>${esc(c.name)}</h1></div>
    <div class="list">${out}</div>`;
});

/* --- rezervacija: odabir termina --- */
let pick = { date: null, at: null };

route(/^\/rezerviraj\/usluga\/([a-z0-9-]+)$/, id => {
  const s = svc(id);
  if (!s) return `<div class="empty">Nepoznata usluga.</div>`;
  const today = startOfDay(new Date());
  if (!pick.date) pick.date = iso(today);

  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const slots = slotsFor(pick.date, s);
  const prog = S.programs.find(p => p.serviceId === id);

  return `
    ${backBtn(`/rezerviraj/${s.cat}`, 'Natrag')}
    <div class="top">
      <p class="eyebrow">${esc(CATEGORIES.find(c => c.id === s.cat).name)}</p>
      <h1>${esc(s.name)}</h1>
      <p class="sub">${dur(s.min)} · ${eur(s.price)}${s.note ? ` · ${esc(s.note)}` : ''}</p>
      ${prog ? `<div class="chips"><span class="chip">Ide u tvoj program — ${prog.done + 1}. od ${prog.total}</span></div>`
             : s.series ? `<div class="chips"><span class="chip">Rezultat dolazi nakon ${s.series} tretmana</span></div>` : ''}
    </div>

    <div class="section-title"><h2>Datum</h2></div>
    <div class="days">
      ${days.map(d => {
        const closed = !HOURS[d.getDay()];
        const on = startOfDay(pick.date).getTime() === d.getTime();
        return `<button class="day" data-date="${iso(d)}" aria-pressed="${on}" ${closed ? 'disabled' : ''}>
          <div class="dw">${DW[d.getDay()]}</div><div class="dd">${d.getDate()}</div>
        </button>`;
      }).join('')}
    </div>

    <div class="section-title"><h2>Vrijeme</h2><span class="tiny muted">${fmtLong(pick.date)}</span></div>
    ${slots.length
      ? `<div class="slots">${slots.map(sl => `
          <button class="slot num" data-slot="${sl.at}" aria-pressed="${pick.at === sl.at}" ${sl.free ? '' : 'disabled'}>
            ${fmtTime(sl.at)}
          </button>`).join('')}</div>`
      : `<div class="empty">Nedjeljom ne radimo.</div>`}

    ${slots.length && !slots.some(x => x.free)
      ? `<div class="card" style="margin-top:16px">
          <p class="tiny muted">Sve je zauzeto. Prijavi se na listu čekanja — javimo ti prvoj ako se termin otkaže.</p>
          <div class="btn-row"><button class="btn ghost" data-waitlist="${s.id}">Na listu čekanja</button></div>
        </div>` : ''}

    <div style="margin-top:22px">
      <button class="btn" data-book="${s.id}" ${pick.at ? '' : 'disabled'}>
        ${pick.at ? `Potvrdi — ${fmtShort(pick.at)} u ${fmtTime(pick.at)}` : 'Odaberi vrijeme'}
      </button>
      <p class="tiny muted" style="text-align:center;margin-top:10px">
        Otkazivanje je moguće do 24 sata prije termina.
      </p>
    </div>`;
});

/* --- moji termini --- */
route(/^\/termini$/, () => {
  const now = new Date();
  const up = S.appointments.filter(a => a.status === 'zakazan' && new Date(a.at) > now).sort((a, b) => new Date(a.at) - new Date(b.at));
  const past = S.appointments.filter(a => a.status !== 'zakazan' || new Date(a.at) <= now).sort((a, b) => new Date(b.at) - new Date(a.at));

  return `
    <div class="top"><p class="eyebrow">Termini</p><h1>Moji termini</h1></div>
    <div class="section-title"><h2>Zakazano</h2></div>
    ${up.length ? `<div class="list">${up.map(apptRow).join('')}</div>` : `<div class="empty">Nemaš zakazanih termina.</div>`}
    <div class="section">
      <div class="section-title"><h2>Prošli termini</h2><span class="tiny muted">${past.length} tretmana</span></div>
      <div class="list">${past.map(apptRow).join('')}</div>
    </div>`;
});

/* --- jedan termin --- */
route(/^\/termin\/([a-z0-9]+)$/, id => {
  const a = S.appointments.find(x => x.id === id);
  if (!a) return `<div class="empty">Termin ne postoji.</div>`;
  const s = svc(a.serviceId);
  const upcoming = a.status === 'zakazan' && new Date(a.at) > new Date();
  const hoursLeft = (new Date(a.at) - Date.now()) / 3600000;

  return `
    ${backBtn('/termini', 'Termini')}
    <div class="top">
      <p class="eyebrow">${upcoming ? 'Zakazano' : esc(a.status)}</p>
      <h1>${esc(s.name)}</h1>
      <p class="sub">${fmtLong(a.at)} u ${fmtTime(a.at)}</p>
    </div>
    <div class="card">
      <div class="kv"><span>Trajanje</span><b>${dur(s.min)}</b></div>
      <div class="kv"><span>Cijena</span><b>${eur(s.price)}</b></div>
      <div class="kv"><span>Plaćanje</span><b>U salonu, gotovina</b></div>
      ${a.programId ? `<div class="kv"><span>Program</span><b>${S.programs.find(p => p.id === a.programId)?.done + 1}. tretman</b></div>` : ''}
      <div class="kv"><span>Adresa</span><b>A. M. Tripala 2, Špansko</b></div>
    </div>
    ${upcoming ? `
      <div style="margin-top:16px">
        <button class="btn ghost" data-cancel="${a.id}">Otkaži termin</button>
        <p class="tiny muted" style="text-align:center;margin-top:10px">
          ${hoursLeft >= 24 ? 'Otkazivanje je još moguće bez naknade.' : 'Manje od 24 sata do termina — molimo nazovi nas na 091 984 5181.'}
        </p>
      </div>` : (s.care ? `<div class="section">${careBlock(s.care)}</div>` : '')}`;
});

/* --- program: detalji --- */
route(/^\/program\/([a-z0-9]+)$/, id => {
  const p = S.programs.find(x => x.id === id);
  if (!p) return `<div class="empty">Program ne postoji.</div>`;
  const s = svc(p.serviceId);
  const ms = p.measures;
  const first = ms[0], last = ms[ms.length - 1];

  const done = S.appointments.filter(a => a.programId === p.id && a.status === 'obavljen')
    .sort((a, b) => new Date(b.at) - new Date(a.at));

  return `
    ${backBtn('/', 'Početna')}
    <div class="top">
      <p class="eyebrow">Program · započet ${fmtShort(p.startedAt)}</p>
      <h1>${esc(s.name)}</h1>
      <p class="sub">${p.done} od ${p.total} tretmana · ${eur(s.price * p.total)} ukupno</p>
    </div>

    ${programCard(p, { link: false, title: false })}

    <div class="section">
      <div class="section-title"><h2>Mjere</h2><span class="tiny muted">${esc(last?.label || '')}</span></div>
      <div class="card">
        ${sparkline(ms)}
        <div class="kv"><span>Prvog dana</span><b class="num">${first.value} cm</b></div>
        <div class="kv"><span>Zadnje mjerenje · ${fmtShort(last.at)}</span><b class="num">${last.value} cm</b></div>
        <div class="kv"><span>Razlika</span><b class="num" style="color:var(--good)">−${(first.value - last.value).toFixed(1)} cm</b></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Prije i poslije</h2></div>
      <div class="card">
        <p class="tiny muted">Fotografije vidiš samo ti i tvoja kozmetičarka. Možeš ih obrisati u svakom trenutku.</p>
        <div class="photos">
          ${photoBox(p.id, 'before', 'Prvi dan')}
          ${photoBox(p.id, 'after', 'Danas')}
        </div>
        ${(p.photos.before || p.photos.after) ? `<div class="btn-row"><button class="btn ghost sm" data-delphotos="${p.id}">Obriši fotografije</button></div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Obavljeni tretmani</h2></div>
      ${done.length ? `<div class="list">${done.map(apptRow).join('')}</div>` : `<div class="empty">Još nema zabilježenih tretmana.</div>`}
    </div>`;
});

function photoBox(pid, slot, label) {
  const p = S.programs.find(x => x.id === pid);
  const src = p.photos[slot];
  return `
    <label class="photo">
      ${src ? `<img src="${src}" alt="${esc(label)}">` : `<span class="add">Dodaj fotografiju</span>`}
      <span class="lbl">${esc(label)}</span>
      <input type="file" accept="image/*" data-photo="${pid}:${slot}" aria-label="${esc(label)}">
    </label>`;
}

/* --- klub --- */
route(/^\/klub$/, () => {
  const visits = S.appointments.filter(a => a.status === 'obavljen').length;
  const inCycle = visits % 10;
  return `
    <div class="top"><p class="eyebrow">Klub</p><h1>Tvoje pogodnosti</h1></div>

    <div class="points">
      <span class="n num">${S.points}</span>
      <span class="l">bodova · 1 € potrošen = 1 bod</span>
    </div>

    <div class="section">
      <div class="section-title"><h2>Deseti tretman</h2><span class="tiny muted">${inCycle} / 10</span></div>
      <div class="card">
        <div class="stamps">
          ${Array.from({ length: 10 }, (_, i) => `
            <div class="stamp ${i < inCycle ? 'on' : ''} ${i === 9 ? 'reward' : ''}">${i === 9 ? '★' : i + 1}</div>`).join('')}
        </div>
        <p class="tiny muted" style="margin-top:12px">Na desetom tretmanu masaža stopala ide na naš račun.</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Još u klubu</h2></div>
      <div class="stack">
        <div class="card">
          <p class="eyebrow">Rođendan</p>
          <p class="prog-title" style="margin-bottom:6px">${esc(S.user.birthday)}</p>
          <p class="tiny muted">Tjedan oko rođendana: piling ruku ili stopala uz svaki tretman, bez naplate.</p>
        </div>
        <div class="card">
          <p class="eyebrow">Preporuka prijateljici</p>
          <p class="prog-title" style="margin-bottom:6px">Obje dobivate 10 €</p>
          <p class="tiny muted">Ona 10 € na prvi tretman, ti 10 € na sljedeći. Bez ograničenja broja preporuka.</p>
          <div class="btn-row"><button class="btn ghost" data-share="1">Pošalji pozivnicu</button></div>
        </div>
        <div class="card">
          <p class="eyebrow">Paketi</p>
          <p class="prog-title" style="margin-bottom:6px">10 tretmana, plaćaš 8</p>
          <p class="tiny muted">Paket se plaća unaprijed i troši po tretmanu. Kartično plaćanje dolazi u drugoj fazi — zato je gumb ovdje zaključan.</p>
          <div class="btn-row"><button class="btn" disabled>Kupi paket · uskoro</button></div>
        </div>
      </div>
    </div>`;
});

/* --- profil --- */
route(/^\/profil$/, () => `
  <div class="top"><p class="eyebrow">Profil</p><h1>${esc(S.user.name)}</h1><p class="sub">Članica od ${fmtShort(S.user.since)}</p></div>

  <div class="card">
    <div class="kv"><span>Mobitel</span><b>${esc(S.user.phone)}</b></div>
    <div class="kv"><span>Rođendan</span><b>${esc(S.user.birthday)}</b></div>
    <div class="kv"><span>Obavljenih tretmana</span><b class="num">${S.appointments.filter(a => a.status === 'obavljen').length}</b></div>
    <div class="kv"><span>Aktivnih programa</span><b class="num">${S.programs.length}</b></div>
  </div>

  <div class="section">
    <div class="section-title"><h2>Obavijesti</h2></div>
    <div class="card">
      <p class="tiny muted">Podsjetnik dan prije termina, upute za njegu nakon tretmana i poziv kad se termin otkaže.</p>
      <div class="btn-row">
        <button class="btn ${S.notifications ? 'ghost' : ''}" data-notif="1">
          ${S.notifications ? 'Obavijesti su uključene' : 'Uključi obavijesti'}
        </button>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title"><h2>Privatnost</h2></div>
    <div class="card">
      <p class="tiny muted">Fotografije napretka i podaci o tretmanima su osjetljivi podaci. Čuvamo ih samo dok si članica kluba, vidljivi su tebi i tvojoj kozmetičarki, i brišemo ih na tvoj zahtjev.</p>
      <div class="btn-row"><button class="btn ghost" data-reset="1">Obriši moje podatke</button></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title"><h2>La Camilla</h2></div>
    <div class="card">
      <div class="kv"><span>Adresa</span><b>A. M. Tripala 2, Špansko</b></div>
      <div class="kv"><span>Telefon</span><b>091 984 5181</b></div>
      <div class="kv"><span>Radno vrijeme</span><b>Pon–pet 9–20, sub 9–14</b></div>
    </div>
    <div class="btn-row"><a class="btn ghost" href="#/salon">Ulaz za salon</a></div>
  </div>`);

/* ============================================================
   ZASLONI — salon
   ============================================================ */

/* Demo dan u salonu: termini ostalih klijentica za danas, spojeni s Aninima. */
const salonClient = id => SALON_CLIENTS.find(c => c.id === id);

function salonDay() {
  const t = startOfDay(new Date());
  return SALON_DAY.map((x, i) => {
    const d = new Date(t);
    d.setHours(x.h, x.m, 0, 0);
    return { id: 'sd' + i, clientId: x.clientId, serviceId: x.serviceId, at: iso(d), status: 'zakazan' };
  });
}

route(/^\/salon$/, () => {
  const today = startOfDay(new Date());
  const mine = S.appointments
    .filter(a => startOfDay(a.at).getTime() >= today.getTime() && a.status === 'zakazan')
    .map(a => ({ ...a, clientId: 'ana' }));

  const list = [...salonDay(), ...mine].sort((a, b) => new Date(a.at) - new Date(b.at));

  const danas = list.filter(a => startOfDay(a.at).getTime() === today.getTime());
  const revenue = danas.reduce((n, a) => n + svc(a.serviceId).price, 0);

  return `
    <div class="salon">
      ${backBtn('/profil', 'Izlaz')}
      <div class="top"><p class="eyebrow">Ulaz za salon</p><h1>Danas u salonu</h1><p class="sub">${fmtLong(today)}</p></div>

      <div class="card">
        <div class="kv"><span>Zakazano danas</span><b class="num">${danas.length}</b></div>
        <div class="kv"><span>Očekivani prihod danas</span><b class="num">${eur(revenue)}</b></div>
        <div class="kv"><span>Aktivnih programa</span><b class="num">${SALON_CLIENTS.reduce((n, c) => n + c.programs, 0)}</b></div>
      </div>

      <div class="section">
        <div class="section-title"><h2>Raspored</h2></div>
        ${list.length ? `<div class="list">${list.map(a => {
          const s = svc(a.serviceId);
          const d = new Date(a.at);
          const c = salonClient(a.clientId);
          const danasnji = startOfDay(a.at).getTime() === today.getTime();
          return `<a class="appt" href="#/salon/klijentica/${a.clientId}" style="text-decoration:none;color:inherit">
            <div class="when"><div class="d num">${fmtTime(a.at).slice(0, 2)}</div><div class="m">${fmtTime(a.at).slice(3)}</div></div>
            <div class="grow">
              <div class="t">${esc(c ? c.name : S.user.name)}</div>
              <div class="s">${esc(s.name)} · ${dur(s.min)}${danasnji ? '' : ` · ${fmtShort(d)}`}</div>
            </div>
            <svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </a>`;
        }).join('')}</div>` : `<div class="empty">Nema zakazanih termina.</div>`}
      </div>

      <div class="section">
        <div class="section-title"><h2>Klijentice</h2></div>
        <div class="list">
          ${SALON_CLIENTS.map(c => `
            <a class="row" href="#/salon/klijentica/${c.id}">
              <div class="grow">
                <div class="name">${esc(c.name)}</div>
                <div class="meta">${c.visits} tretmana · ${c.programs ? '1 aktivan program' : 'bez programa'}${c.noShows ? ` · ${c.noShows} nedolaska` : ''}</div>
              </div>
              ${c.noShows ? '<span class="chip warn">akontacija</span>' : ''}
              <svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </a>`).join('')}
        </div>
      </div>
    </div>`;
});

route(/^\/salon\/klijentica\/([a-z]+)$/, id => {
  const c = SALON_CLIENTS.find(x => x.id === id);
  if (!c) return `<div class="empty">Klijentica ne postoji.</div>`;
  const isAna = id === 'ana';
  const p = isAna ? S.programs[0] : null;
  const cp = isAna ? null : c.program;
  const history = isAna
    ? S.appointments.filter(a => a.status === 'obavljen').sort((a, b) => new Date(b.at) - new Date(a.at))
    : (c.history || []).map(h => ({ serviceId: h.serviceId, at: iso(addDays(startOfDay(new Date()), -h.daysAgo)) }));

  return `
    <div class="salon">
      ${backBtn('/salon', 'Salon')}
      <div class="top"><p class="eyebrow">Kartica klijentice</p><h1>${esc(c.name)}</h1><p class="sub">${esc(c.phone)} · ${c.visits} tretmana</p></div>

      ${c.contraindications.length ? `
        <div class="alert">
          <b>Pozor</b>
          ${c.contraindications.map(x => esc(x)).join('<br>')}
        </div>` : ''}

      ${c.noShows ? `<div class="alert" style="margin-top:10px"><b>Nedolasci</b>${c.noShows} nedolaska — uključena obvezna akontacija pri rezervaciji.</div>` : ''}

      ${c.notes ? `<div class="card" style="margin-top:12px"><p class="eyebrow">Bilješka</p><p class="tiny muted" style="margin-top:6px">${esc(c.notes)}</p></div>` : ''}

      ${p ? `
        <div class="section">
          <div class="section-title"><h2>Program</h2></div>
          <div class="card">
            <p class="prog-title" style="margin-top:0">${esc(svc(p.serviceId).name)}</p>
            <div class="pips">${Array.from({ length: p.total }, (_, i) => `<i class="${i < p.done ? 'on' : ''}"></i>`).join('')}</div>
            <p class="prog-count num"><b>${p.done} od ${p.total}</b> · zadnja mjera ${p.measures[p.measures.length - 1].value} cm</p>
            <label class="field">
              <span>Nova mjera (cm)</span>
              <input type="number" step="0.1" id="measure" placeholder="${p.measures[p.measures.length - 1].value}">
            </label>
            <div class="btn-row">
              <button class="btn" data-logtreatment="${p.id}" ${p.done >= p.total ? 'disabled' : ''}>
                ${p.done >= p.total ? 'Program dovršen' : `Zabilježi ${p.done + 1}. tretman`}
              </button>
            </div>
            <p class="tiny muted" style="margin-top:10px">Zabilježeni tretman odmah šalje klijentici upute za njegu i predlaže sljedeći termin.</p>
          </div>
        </div>` : cp ? `
        <div class="section">
          <div class="section-title"><h2>Program</h2></div>
          <div class="card">
            <p class="prog-title" style="margin-top:0">${esc(svc(cp.serviceId).name)}</p>
            <div class="pips">${Array.from({ length: cp.total }, (_, i) => `<i class="${i < cp.done ? 'on' : ''}"></i>`).join('')}</div>
            <p class="prog-count num"><b>${cp.done} od ${cp.total}</b> · ${esc(cp.label)} ${cp.from} → ${cp.to}</p>
            <p class="tiny muted" style="margin-top:10px">Unos mjere i bilježenje tretmana rade na kartici Ane Horvat — u ovom prikazu program je samo za uvid.</p>
          </div>
        </div>` : `
        <div class="section">
          <div class="section-title"><h2>Program</h2></div>
          <div class="card"><p class="tiny muted">Nema aktivnog programa. Program se otvara nakon konzultacije.</p></div>
        </div>`}

      ${history.length ? `
        <div class="section">
          <div class="section-title"><h2>Povijest tretmana</h2></div>
          <div class="list">${history.map(a => {
            const s = svc(a.serviceId);
            return `<div class="appt">
              <div class="when"><div class="d">${new Date(a.at).getDate()}</div><div class="m">${MOS[new Date(a.at).getMonth()]}</div></div>
              <div class="grow"><div class="t">${esc(s.name)}</div><div class="s">${dur(s.min)} · ${eur(s.price)}${s.note ? ` · ${esc(s.note)}` : ''}</div></div>
            </div>`;
          }).join('')}</div>
        </div>` : ''}
    </div>`;
});

/* ============================================================
   AKCIJE
   ============================================================ */

function bind(root) {
  root.querySelectorAll('[data-go]').forEach(el => el.onclick = () => go(el.dataset.go));

  root.querySelectorAll('[data-date]').forEach(el => el.onclick = () => {
    pick = { date: el.dataset.date, at: null };
    render();
  });

  root.querySelectorAll('[data-slot]').forEach(el => el.onclick = () => {
    pick.at = el.dataset.slot;
    render();
  });

  const bookBtn = root.querySelector('[data-book]');
  if (bookBtn) bookBtn.onclick = () => book(bookBtn.dataset.book);

  const wl = root.querySelector('[data-waitlist]');
  if (wl) wl.onclick = () => {
    const id = wl.dataset.waitlist;
    if (!S.waitlist.includes(id)) S.waitlist.push(id);
    save();
    toast('Na listi si čekanja. Javimo ti prvoj.');
  };

  root.querySelectorAll('[data-cancel]').forEach(el => el.onclick = () => cancel(el.dataset.cancel));
  root.querySelectorAll('[data-photo]').forEach(el => el.onchange = () => addPhoto(el));
  root.querySelectorAll('[data-delphotos]').forEach(el => el.onclick = () => {
    const p = S.programs.find(x => x.id === el.dataset.delphotos);
    p.photos = { before: null, after: null };
    save(); render(); toast('Fotografije su obrisane.');
  });

  root.querySelectorAll('[data-logtreatment]').forEach(el => el.onclick = () => logTreatment(el.dataset.logtreatment));
  root.querySelectorAll('[data-notif]').forEach(el => el.onclick = enableNotifications);
  root.querySelectorAll('[data-reset]').forEach(el => el.onclick = () => {
    if (confirm('Obrisati sve podatke ovog demo profila?')) reset();
  });
  root.querySelectorAll('[data-share]').forEach(el => el.onclick = share);
}

function book(serviceId) {
  if (!pick.at) return;
  const s = svc(serviceId);
  const prog = S.programs.find(p => p.serviceId === serviceId && p.done < p.total);
  const id = 'a' + Date.now().toString(36);

  S.appointments.push({ id, serviceId, at: pick.at, status: 'zakazan', ...(prog ? { programId: prog.id } : {}) });
  save();

  notify('Termin je rezerviran', `${s.name} — ${fmtLong(pick.at)} u ${fmtTime(pick.at)}`);
  toast(`Rezervirano: ${fmtShort(pick.at)} u ${fmtTime(pick.at)}`);
  pick = { date: null, at: null };
  go('/termin/' + id);
}

function cancel(id) {
  const a = S.appointments.find(x => x.id === id);
  if (!a) return;
  const hoursLeft = (new Date(a.at) - Date.now()) / 3600000;
  if (hoursLeft < 24) { toast('Manje od 24 sata — nazovi nas na 091 984 5181.'); return; }
  if (!confirm('Otkazati ovaj termin?')) return;
  a.status = 'otkazan';
  S.appointments = S.appointments.filter(x => x.id !== id);
  save();
  toast('Termin je otkazan. Nudimo ga listi čekanja.');
  go('/termini');
}

function logTreatment(pid) {
  const p = S.programs.find(x => x.id === pid);
  if (!p || p.done >= p.total) return;
  const input = document.getElementById('measure');
  const val = input && input.value ? parseFloat(input.value) : null;

  p.done += 1;
  if (val && !Number.isNaN(val)) {
    p.measures.push({ at: iso(new Date()), label: p.measures[p.measures.length - 1].label, value: val });
  }

  // najbliži zakazani termin iz programa proglasi obavljenim
  const next = S.appointments
    .filter(a => a.programId === p.id && a.status === 'zakazan')
    .sort((a, b) => new Date(a.at) - new Date(b.at))[0];
  if (next) next.status = 'obavljen';

  const s = svc(p.serviceId);
  S.lastCare = s.care || null;
  S.points += s.price;
  save();

  notify('Upute za njegu', CARE[s.care]?.items[0] || 'Vidi upute u aplikaciji.');
  toast(`Zabilježen ${p.done}. tretman. Klijentici su poslane upute za njegu.`);
  render();
}

async function addPhoto(input) {
  const [pid, slot] = input.dataset.photo.split(':');
  const file = input.files && input.files[0];
  if (!file) return;
  try {
    const url = await shrink(file, 720);
    const p = S.programs.find(x => x.id === pid);
    p.photos[slot] = url;
    save(); render();
    toast('Fotografija je spremljena. Vidi je samo ti i salon.');
  } catch {
    toast('Fotografiju nije bilo moguće obraditi.');
  }
}

function shrink(file, max) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

async function enableNotifications() {
  if (!('Notification' in window)) { toast('Ovaj preglednik ne podržava obavijesti.'); return; }
  const perm = await Notification.requestPermission();
  S.notifications = perm === 'granted';
  save(); render();
  if (S.notifications) {
    notify('Obavijesti su uključene', 'Podsjetit ćemo te dan prije termina.');
    toast('Obavijesti su uključene.');
  } else {
    toast('Obavijesti su odbijene u pregledniku.');
  }
}

function notify(title, body) {
  if (!S.notifications || !('Notification' in window) || Notification.permission !== 'granted') return;
  try { new Notification(title, { body, icon: 'icon.svg' }); } catch {}
}

async function share() {
  const text = 'Pozivam te u La Camilla Club — obje dobivamo 10 € na tretman. https://la-camilla.com';
  if (navigator.share) {
    try { await navigator.share({ title: 'La Camilla Club', text }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); toast('Pozivnica je kopirana.'); }
  catch { toast('Pozivnica: la-camilla.com'); }
}

/* ---------- start ---------- */
load();
window.addEventListener('hashchange', () => {
  const p = (location.hash || '#/').slice(1);
  if (!p.startsWith('/rezerviraj/usluga/')) pick = { date: null, at: null };
  render();
});
render();

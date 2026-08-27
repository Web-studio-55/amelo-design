import { SALON, CATEGORIES, LENGTHS, SERVICES, STAFF, CARE, PRODUCTS,
         DEMO_CLIENT, DEMO_FORMULA, DEMO_EXT, SALON_CLIENTS, SALON_DAY } from './data.js';

/* ============================================================
   DLM Klub — demo Faze 1
   Bez backenda: stanje se čuva u localStorage ovog preglednika.
   ============================================================ */

const KEY = 'dlm.v1';
const DAY = 86400000;
const svc = id => SERVICES.find(s => s.id === id);
const staffById = id => STAFF.find(s => s.id === id);

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
const dur = m => m >= 60 ? (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`) : `${m} min`;
const eur = n => Number.isInteger(n) ? `${n} €` : `${n.toFixed(2).replace('.', ',')} €`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c);
const days = n => `${n} ${plural(n, 'dan', 'dana', 'dana')}`;
const weeks = n => `${n} ${plural(n, 'tjedan', 'tjedna', 'tjedana')}`;

/* ---------- cijena i trajanje ovise o duljini kose / minutama ---------- */
function priceOf(s, o = {}) {
  if (s.perMin) return +(s.perMin * (o.minutes || 15)).toFixed(2);
  if (s.byLen) return s.byLen[o.len ?? S.user.length];
  return s.price;
}
function minsOf(s, o = {}) {
  if (s.perMin) return (o.minutes || 15) + 10;
  if (s.minByLen) return s.minByLen[o.len ?? S.user.length];
  return s.min;
}
const priceLabel = s => s.perMin ? `${eur(s.perMin)} / min`
  : s.byLen ? `${eur(s.byLen[0])} – ${eur(s.byLen[2])}`
  : s.price === 0 ? 'bez naplate' : eur(s.price);

/* ---------- stanje ---------- */
function seed() {
  const now = new Date();
  const at = (dayOffset, h, m) => { const d = addDays(startOfDay(now), dayOffset); d.setHours(h, m, 0, 0); return iso(d); };
  const A = (id, serviceId, off, h, m, status, extra = {}) =>
    ({ id, serviceId, at: at(off, h, m), status, staff: extra.staff || 'iva', len: extra.len ?? DEMO_CLIENT.length, ...extra });

  return {
    user: { ...DEMO_CLIENT },
    points: 320,
    notifications: false,
    formula: { ...DEMO_FORMULA, updatedAt: at(DEMO_FORMULA.updated, 10, 0) },
    ext: { ...DEMO_EXT, installedAt: at(-DEMO_EXT.installedDaysAgo, 10, 0) },
    photos: { before: null, after: null },
    solMinutes: 45,
    products: [{ id: 'sampon-boja', boughtAt: at(-68, 12, 0) }, { id: 'moroccanoil-oil', boughtAt: at(-30, 12, 0) }],
    appointments: [
      A('a1', 'pranje-frizura', 4, 17, 0, 'zakazan'),
      A('a2', 'eks-pomak', 21, 9, 0, 'zakazan'),
      A('a3', 'bojanje-sisanje', -21, 10, 0, 'obavljen'),
      A('a4', 'trajni', -24, 15, 30, 'obavljen', { staff: 'sara' }),
      A('a5', 'eks-keratin', -46, 10, 0, 'obavljen'),
      A('a6', 'pramenovi-sis', -77, 9, 30, 'obavljen'),
      A('a7', 'sol-basic', -12, 18, 0, 'obavljen', { staff: 'sara', minutes: 12 }),
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

/* ---------- slobodni termini po frizeru ---------- */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

function slotsFor(date, service, opts) {
  const st = staffById(opts.staff);
  const win = st && st.hours[new Date(date).getDay()];
  if (!win) return [];
  const need = minsOf(service, opts);
  const out = [];
  const start = win[0] * 60, end = win[1] * 60;
  const booked = S.appointments.filter(a => a.status === 'zakazan' && a.staff === opts.staff
    && startOfDay(a.at).getTime() === startOfDay(date).getTime());

  for (let m = start; m + need <= end; m += 30) {
    const d = startOfDay(date);
    d.setMinutes(m);
    const past = d.getTime() < Date.now() + 60 * 60 * 1000;
    const clash = booked.some(a => {
      const s0 = new Date(a.at).getTime();
      const e0 = s0 + minsOf(svc(a.serviceId), a) * 60000;
      return d.getTime() < e0 && d.getTime() + need * 60000 > s0;
    });
    const busy = hash(`${d.toDateString()}${m}${opts.staff}`) < 0.44;
    out.push({ at: iso(d), free: !past && !clash && !busy });
  }
  return out;
}

/* ---------- podsjetnici: usluga koja je „dozrela" ---------- */
function reminders() {
  const now = Date.now();
  const out = [];
  const lastOf = {};
  S.appointments.filter(a => a.status === 'obavljen').forEach(a => {
    const t = new Date(a.at).getTime();
    if (!lastOf[a.serviceId] || t > lastOf[a.serviceId]) lastOf[a.serviceId] = t;
  });

  for (const [id, t] of Object.entries(lastOf)) {
    const s = svc(id);
    if (!s || !s.cycle) continue;
    const due = t + s.cycle * DAY;
    const left = Math.round((due - now) / DAY);
    if (left > 14) continue;
    const booked = S.appointments.some(a => a.serviceId === id && a.status === 'zakazan' && new Date(a.at) > new Date());
    out.push({ serviceId: id, name: s.name, left, booked });
  }

  if (S.ext) {
    const t = new Date(S.ext.installedAt).getTime();
    const due = t + S.ext.cycleDays * DAY;
    const left = Math.round((due - now) / DAY);
    const booked = S.appointments.some(a => a.serviceId === 'eks-pomak' && a.status === 'zakazan' && new Date(a.at) > new Date());
    if (left <= 21) out.push({ serviceId: 'eks-pomak', name: 'Pomak ekstenzija', left, booked, ext: true });
  }

  const seen = new Set();
  return out.filter(r => !seen.has(r.serviceId) && seen.add(r.serviceId)).sort((a, b) => a.left - b.left);
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
      document.getElementById('tabs').classList.toggle('hide', path.startsWith('/salon'));
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

function ring(doneRatio, big, small, dueState) {
  const r = 38, c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, doneRatio)));
  return `
    <div class="ring">
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <circle class="bg" cx="44" cy="44" r="${r}"></circle>
        <circle class="fg ${dueState ? 'due' : ''}" cx="44" cy="44" r="${r}"
                stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"></circle>
      </svg>
      <div class="lab"><b>${esc(big)}</b><span>${esc(small)}</span></div>
    </div>`;
}

/* velika kartica „Moja kosa" */
function hairCard({ link = true } = {}) {
  const lastColour = S.appointments
    .filter(a => a.status === 'obavljen' && svc(a.serviceId)?.formula)
    .sort((a, b) => new Date(b.at) - new Date(a.at))[0];
  const cyc = lastColour ? svc(lastColour.serviceId).cycle || 42 : 42;
  const since = lastColour ? Math.round((Date.now() - new Date(lastColour.at)) / DAY) : null;
  const ratio = since === null ? 0 : since / cyc;
  const overdue = since !== null && since >= cyc;

  const next = S.appointments
    .filter(a => a.status === 'zakazan' && new Date(a.at) > new Date())
    .sort((a, b) => new Date(a.at) - new Date(b.at))[0];

  return `
    <div class="hair">
      <p class="eyebrow">Moja kosa</p>
      <h2>${esc(LENGTHS[S.user.length].name.toLowerCase())} · ${esc(S.user.hairType.split(',')[0].toLowerCase())}</h2>
      <div class="row-2">
        ${ring(ratio, since === null ? '—' : String(Math.floor(since / 7)), 'tj. izrasta', overdue)}
        <div class="facts">
          ${lastColour ? `<div>Zadnja boja <b>${fmtShort(lastColour.at)}</b> · ${esc(svc(lastColour.serviceId).name.split(',')[0])}</div>` : ''}
          <div>Ritam koji ti odgovara <b>${weeks(Math.round(cyc / 7))}</b></div>
          <div>${next ? `Sljedeći termin <b>${fmtShort(next.at)} u ${fmtTime(next.at)}</b>` : '<b>Nema zakazanog termina</b>'}</div>
        </div>
      </div>
      <div class="swatches" role="img" aria-label="Tonovi tvoje boje">
        ${(S.formula.swatch || []).map(c => `<i style="background:${esc(c)}"></i>`).join('')}
      </div>
      ${link ? `<div class="btn-row cta">
        ${overdue ? `<a class="btn gold" href="#/rezerviraj/usluga/${lastColour.serviceId}">Naruči se na boju</a>` : ''}
        <a class="btn ghost" href="#/kosa">Moja kartica</a>
      </div>` : ''}
    </div>`;
}

function formulaCard(f, { title = 'Formula boje' } = {}) {
  if (!f) return '';
  return `
    <div class="formula">
      <p class="ttl">${esc(title)}</p>
      <div class="line"><span>Baza</span><b>${esc(f.base)}</b></div>
      <div class="line"><span>Razvijač</span><b>${esc(f.dev)}</b></div>
      <div class="line"><span>Vrijeme</span><b>${esc(f.time)}</b></div>
      ${f.toner && f.toner !== '—' ? `<div class="line"><span>Preljev</span><b>${esc(f.toner)}</b></div>` : ''}
      <div class="line"><span>Upisano</span><b>${fmtShort(f.updatedAt || addDays(new Date(), f.updated || 0))}</b></div>
    </div>`;
}

function dueRow(r) {
  const late = r.left <= 0;
  return `
    <a class="due" href="#/rezerviraj/usluga/${r.serviceId}" style="text-decoration:none;color:inherit">
      <span class="ico">${late ? '!' : '·'}</span>
      <span>
        <span class="t">${esc(r.name)}</span>
        <span class="s">${r.booked ? 'Termin je već zakazan.'
          : late ? `Prošlo je ${days(Math.abs(r.left))} više nego što obično čekaš.`
          : `Za ${days(r.left)} — dodirni za termin.`}</span>
      </span>
    </a>`;
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

function apptRow(a, { href = true } = {}) {
  const s = svc(a.serviceId);
  const past = a.status !== 'zakazan';
  const d = new Date(a.at);
  const st = staffById(a.staff);
  const inner = `
    <div class="when"><div class="d">${d.getDate()}</div><div class="m">${MOS[d.getMonth()]}</div></div>
    <div class="grow">
      <div class="t">${esc(s.name)}</div>
      <div class="s">${fmtTime(a.at)} · ${dur(minsOf(s, a))} · ${eur(priceOf(s, a))}${st ? ` · ${esc(st.name)}` : ''}</div>
    </div>
    ${href ? '<svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>' : ''}`;
  return href
    ? `<a class="appt ${past ? 'past' : ''}" href="#/termin/${a.id}" style="text-decoration:none;color:inherit;">${inner}</a>`
    : `<div class="appt ${past ? 'past' : ''}">${inner}</div>`;
}

/* ============================================================
   ZASLONI — klijent
   ============================================================ */

route(/^\/$/, () => {
  const now = new Date();
  const hour = now.getHours();
  const greet = hour < 11 ? 'Dobro jutro' : hour < 18 ? 'Dobar dan' : 'Dobra večer';
  const first = S.user.name.split(' ')[0];

  const upcoming = S.appointments
    .filter(a => a.status === 'zakazan' && new Date(a.at) > now)
    .sort((a, b) => new Date(a.at) - new Date(b.at));

  const rem = reminders().filter(r => !r.booked);
  const care = S.lastCare ? careBlock(S.lastCare) : '';

  return `
    <div class="top">
      <p class="eyebrow">DLM Klub</p>
      <h1>${greet}, ${esc(first)}</h1>
      <p class="sub">${fmtLong(now)}</p>
    </div>

    ${hairCard()}

    ${rem.length ? `<div class="section">
      <div class="section-title"><h2>Vrijeme je za</h2></div>
      ${rem.map(dueRow).join('')}
    </div>` : ''}

    <div class="section">
      <div class="section-title"><h2>Sljedeći termini</h2><a href="#/termini">Svi termini</a></div>
      ${upcoming.length ? `<div class="list">${upcoming.slice(0, 3).map(a => apptRow(a)).join('')}</div>`
        : `<div class="card"><p class="tiny muted">Nemaš zakazanih termina.</p>
           <div class="btn-row"><a class="btn" href="#/rezerviraj">Rezerviraj termin</a></div></div>`}
    </div>

    ${care ? `<div class="section"><div class="section-title"><h2>Njega nakon usluge</h2></div>${care}</div>` : ''}
`;
});

/* --- moja kosa --- */
route(/^\/kosa$/, () => {
  const done = S.appointments.filter(a => a.status === 'obavljen').sort((a, b) => new Date(b.at) - new Date(a.at));
  const e = S.ext;
  const extDays = e ? Math.round((new Date(e.installedAt).getTime() + e.cycleDays * DAY - Date.now()) / DAY) : null;
  const extRatio = e ? 1 - extDays / e.cycleDays : 0;

  return `
    ${backBtn('/', 'Početna')}
    <div class="top">
      <p class="eyebrow">Kartica</p>
      <h1>Moja kosa</h1>
      <p class="sub">Vodi je salon, vidiš je ti. Nitko drugi.</p>
    </div>

    <div class="card">
      <div class="kv"><span>Duljina</span><b>${esc(LENGTHS[S.user.length].name)}</b></div>
      <div class="kv"><span>Tip kose</span><b>${esc(S.user.hairType)}</b></div>
      <div class="kv"><span>Moja frizerka</span><b>${esc(staffById(S.user.stylist)?.name || '—')}</b></div>
      <div class="kv"><span>Obavljenih usluga</span><b class="num">${done.length}</b></div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Boja</h2><span class="tiny muted">upisuje salon</span></div>
      ${formulaCard(S.formula)}
      <p class="tiny muted" style="margin-top:10px">Ovo je točan miks s tvog zadnjeg bojanja. Ako te jednom slučajno naslijedi druga frizerka, ton ostaje isti.</p>
    </div>

    ${e ? `
    <div class="section">
      <div class="section-title"><h2>Ekstenzije</h2></div>
      <div class="card">
        <div class="kv"><span>Metoda</span><b>${esc(e.method)}</b></div>
        <div class="kv"><span>Broj pramenova</span><b class="num">${e.strands}</b></div>
        <div class="kv"><span>Boja</span><b>${esc(e.shade)}</b></div>
        <div class="kv"><span>Ugrađeno</span><b>${fmtShort(e.installedAt)}</b></div>
        <div class="meter"><i style="width:${Math.min(100, Math.round(extRatio * 100))}%"></i></div>
        <p class="tiny muted">${extDays > 0
          ? `Pomak za ${days(extDays)}. Ako se odgodi preko tri mjeseca, bondovi se filcaju i skidanje traje dvostruko dulje.`
          : `Pomak je trebao biti prije ${days(Math.abs(extDays))}.`}</p>
        <div class="btn-row"><a class="btn ${extDays > 14 ? 'ghost' : ''}" href="#/rezerviraj/usluga/eks-pomak">Rezerviraj pomak</a></div>
      </div>
    </div>` : ''}

    <div class="section">
      <div class="section-title"><h2>Prije i poslije</h2></div>
      <div class="card">
        <p class="tiny muted">Fotografije vidiš samo ti i tvoja frizerka. Možeš ih obrisati u svakom trenutku.</p>
        <div class="photos">
          ${photoBox('before', 'Prvi dolazak')}
          ${photoBox('after', 'Danas')}
        </div>
        ${(S.photos.before || S.photos.after) ? `<div class="btn-row"><button class="btn ghost sm" data-delphotos="1">Obriši fotografije</button></div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Sve što je rađeno</h2><span class="tiny muted">${done.length}</span></div>
      <div class="list">${done.map(a => apptRow(a)).join('')}</div>
    </div>`;
});

function photoBox(slot, label) {
  const src = S.photos[slot];
  return `
    <label class="photo">
      ${src ? `<img src="${src}" alt="${esc(label)}">` : `<span class="add">Dodaj fotografiju</span>`}
      <span class="lbl">${esc(label)}</span>
      <input type="file" accept="image/*" data-photo="${slot}" aria-label="${esc(label)}">
    </label>`;
}

/* --- rezervacija: kategorije --- */
route(/^\/rezerviraj$/, () => `
  <div class="top">
    <p class="eyebrow">Rezervacija</p>
    <h1>Što ti treba?</h1>
    <p class="sub">Cijene za dugu kosu vidiš odmah — aplikacija zna tvoju duljinu.</p>
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
    const price = s.perMin ? priceLabel(s) : eur(priceOf(s, {}));
    out += `
      <a class="row" href="#/rezerviraj/usluga/${s.id}">
        <div class="grow">
          <div class="name">${esc(s.name)}</div>
          <div class="meta">${s.perMin ? 'po minuti' : dur(minsOf(s, {}))}${s.byLen ? ` · za ${LENGTHS[S.user.length].name.toLowerCase()} kosu` : ''}${s.note ? ` · ${esc(s.note)}` : ''}</div>
        </div>
        <div class="price num">${s.price === 0 ? 'gratis' : price}</div>
      </a>`;
  }
  return `
    ${backBtn('/rezerviraj', 'Sve usluge')}
    <div class="top"><p class="eyebrow">${esc(c.sub)}</p><h1>${esc(c.name)}</h1></div>
    <div class="list">${out}</div>`;
});

/* --- rezervacija: odabir --- */
let pick = { len: null, staff: null, minutes: 15, date: null, at: null };
const SOL_MINUTES = [6, 9, 12, 15, 18, 21];

function ensurePick(s) {
  if (pick.len === null) pick.len = S.user.length;
  if (!pick.staff) {
    const able = STAFF.filter(x => x.does.includes(s.cat));
    const mine = able.find(x => x.id === S.user.stylist);
    pick.staff = (mine || able[0] || STAFF[0]).id;
  }
  if (!pick.date) pick.date = iso(startOfDay(new Date()));
}

route(/^\/rezerviraj\/usluga\/([a-z0-9-]+)$/, id => {
  const s = svc(id);
  if (!s) return `<div class="empty">Nepoznata usluga.</div>`;
  ensurePick(s);

  const able = STAFF.filter(x => x.does.includes(s.cat));
  const today = startOfDay(new Date());
  const dayList = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const st = staffById(pick.staff);
  const slots = slotsFor(pick.date, s, pick);
  const needTest = s.patch && !S.user.allergies.length;

  return `
    ${backBtn(`/rezerviraj/${s.cat}`, 'Natrag')}
    <div class="top">
      <p class="eyebrow">${esc(CATEGORIES.find(c => c.id === s.cat).name)}</p>
      <h1>${esc(s.name)}</h1>
      <p class="sub">${dur(minsOf(s, pick))} · ${priceOf(s, pick) === 0 ? 'bez naplate' : eur(priceOf(s, pick))}${s.note ? ` · ${esc(s.note)}` : ''}</p>
      ${s.cycle ? `<div class="chips"><span class="chip">Obično se ponavlja svakih ${weeks(Math.round(s.cycle / 7))}</span></div>` : ''}
    </div>

    ${s.byLen ? `
      <div class="section-title"><h2>Duljina kose</h2><span class="tiny muted">mijenja cijenu</span></div>
      <div class="picks">
        ${LENGTHS.map(l => `
          <button class="pick" data-len="${l.id}" aria-pressed="${pick.len === l.id}">
            <div class="p1">${esc(l.name)}</div>
            <div class="p2">${eur(s.byLen[l.id])} · ${dur(s.minByLen[l.id])}</div>
          </button>`).join('')}
      </div>` : ''}

    ${s.perMin ? `
      <div class="section-title"><h2>Koliko minuta</h2><span class="tiny muted">${eur(s.perMin)} / min</span></div>
      <div class="picks">
        ${SOL_MINUTES.map(m => `
          <button class="pick" data-min="${m}" aria-pressed="${pick.minutes === m}">
            <div class="p1">${m} min</div>
            <div class="p2">${eur(+(s.perMin * m).toFixed(2))}</div>
          </button>`).join('')}
      </div>
      <p class="tiny muted" style="margin-top:8px">Imaš ${S.solMinutes} min u paketu — potrošit će se iz njega.</p>` : ''}

    <div class="section-title" style="margin-top:22px"><h2>Kod koga</h2></div>
    <div class="picks">
      ${able.map(x => `
        <button class="pick" data-staff="${x.id}" aria-pressed="${pick.staff === x.id}">
          <div class="p1">${esc(x.name)}</div>
          <div class="p2">${esc(x.short)}</div>
        </button>`).join('')}
    </div>

    <div class="section-title" style="margin-top:22px"><h2>Datum</h2></div>
    <div class="days">
      ${dayList.map(d => {
        const closed = !st.hours[d.getDay()];
        const on = startOfDay(pick.date).getTime() === d.getTime();
        return `<button class="day" data-date="${iso(d)}" aria-pressed="${on}" ${closed ? 'disabled' : ''}>
          <div class="dw">${DW[d.getDay()]}</div><div class="dd">${d.getDate()}</div>
        </button>`;
      }).join('')}
    </div>

    <div class="section-title"><h2>Vrijeme</h2><span class="tiny muted">${esc(st.name)} · ${fmtLong(pick.date)}</span></div>
    ${slots.length
      ? `<div class="slots">${slots.map(sl => `
          <button class="slot num" data-slot="${sl.at}" aria-pressed="${pick.at === sl.at}" ${sl.free ? '' : 'disabled'}>
            ${fmtTime(sl.at)}
          </button>`).join('')}</div>`
      : `<div class="empty">${esc(st.name)} taj dan ne radi.</div>`}

    ${slots.length && !slots.some(x => x.free)
      ? `<div class="card" style="margin-top:16px">
          <p class="tiny muted">Sve je zauzeto. Prijavi se na listu čekanja — javimo ti prvoj ako se termin otkaže.</p>
          <div class="btn-row"><button class="btn ghost" data-waitlist="${s.id}">Na listu čekanja</button></div>
        </div>` : ''}

    ${s.patch ? `<div class="card" style="margin-top:16px">
      <p class="eyebrow">Test na koži</p>
      <p class="tiny muted" style="margin-top:6px">${needTest
        ? 'Prije prvog bojanja obavezan je test na koži 48 sati ranije. Aplikacija će ti ponuditi termin od pet minuta.'
        : `Test je napravljen ${esc(S.user.allergies[0].replace(/^Test na koži napravljen /, ''))} — vrijedi.`}</p>
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
    ${up.length ? `<div class="list">${up.map(a => apptRow(a)).join('')}</div>` : `<div class="empty">Nemaš zakazanih termina.</div>`}
    <div class="section">
      <div class="section-title"><h2>Prošli termini</h2><span class="tiny muted">${past.length}</span></div>
      <div class="list">${past.map(a => apptRow(a)).join('')}</div>
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
      <div class="kv"><span>Kod</span><b>${esc(staffById(a.staff)?.name || '—')}</b></div>
      <div class="kv"><span>Trajanje</span><b>${dur(minsOf(s, a))}</b></div>
      ${s.byLen ? `<div class="kv"><span>Duljina kose</span><b>${esc(LENGTHS[a.len ?? S.user.length].name)}</b></div>` : ''}
      ${s.perMin ? `<div class="kv"><span>Minuta</span><b class="num">${a.minutes}</b></div>` : ''}
      <div class="kv"><span>Cijena</span><b>${priceOf(s, a) === 0 ? 'bez naplate' : eur(priceOf(s, a))}</b></div>
      <div class="kv"><span>Plaćanje</span><b>Gotovina ili kartica</b></div>
      <div class="kv"><span>Adresa</span><b>${esc(SALON.address.split(',')[0])}</b></div>
    </div>
    ${upcoming ? `
      <div style="margin-top:16px">
        <button class="btn ghost" data-cancel="${a.id}">Otkaži termin</button>
        <p class="tiny muted" style="text-align:center;margin-top:10px">
          ${hoursLeft >= 24 ? 'Otkazivanje je još moguće bez naknade.' : `Manje od 24 sata do termina — molimo nazovi ${SALON.phone}.`}
        </p>
      </div>` : (s.care ? `<div class="section">${careBlock(s.care)}</div>` : '')}`;
});

/* --- klub --- */
route(/^\/klub$/, () => {
  const visits = S.appointments.filter(a => a.status === 'obavljen').length;
  const inCycle = visits % 10;

  const prods = S.products.map(p => {
    const d = PRODUCTS.find(x => x.id === p.id);
    const passed = Math.round((Date.now() - new Date(p.boughtAt)) / DAY / 7);
    return { ...d, passed, left: d.weeks - passed };
  }).sort((a, b) => a.left - b.left);

  return `
    <div class="top"><p class="eyebrow">Klub</p><h1>Tvoje pogodnosti</h1></div>

    <div class="points">
      <span class="n num">${S.points}</span>
      <span class="l">bodova · 1 € potrošen = 1 bod</span>
    </div>

    <div class="section">
      <div class="section-title"><h2>Deseti dolazak</h2><span class="tiny muted">${inCycle} / 10</span></div>
      <div class="card">
        <div class="stamps">
          ${Array.from({ length: 10 }, (_, i) => `
            <div class="stamp ${i < inCycle ? 'on' : ''} ${i === 9 ? 'reward' : ''}">${i === 9 ? '★' : i + 1}</div>`).join('')}
        </div>
        <p class="tiny muted" style="margin-top:12px">Na desetom dolasku pranje i frizura idu na naš račun.</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Solarij</h2><span class="tiny muted">paket minuta</span></div>
      <div class="card">
        <div class="kv"><span>Preostalo u paketu</span><b class="num">${S.solMinutes} min</b></div>
        <div class="meter"><i style="width:${Math.min(100, Math.round(S.solMinutes / 100 * 100))}%"></i></div>
        <p class="tiny muted">Paket od 100 minuta plaća se unaprijed i vrijedi godinu dana. Aplikacija odbija minute pri svakom dolasku, bez papirića na recepciji.</p>
        <div class="btn-row"><button class="btn" disabled>Dokupi minute · uskoro</button></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Shop — proizvodi za kosu</h2></div>
      <div class="stack">
        ${prods.map(p => `
          <div class="card">
            <p class="eyebrow">${p.left <= 2 ? 'Uskoro ti ponestaje' : 'Kupljeno kod nas'}</p>
            <p style="font-family:var(--f-display);font-size:17px;margin:6px 0 4px">${esc(p.name)}</p>
            <p class="tiny muted">${p.left > 0
              ? `Kupljeno prije ${weeks(p.passed)}. Pakiranje obično traje ${weeks(p.weeks)}.`
              : `Kupljeno prije ${weeks(p.passed)} — vjerojatno je pri kraju.`}</p>
            <div class="btn-row">
              <button class="btn ${p.left > 2 ? 'ghost' : ''} sm" data-reserve="${p.id}">Odloži mi za sljedeći termin · ${eur(p.price)}</button>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title"><h2>Još u klubu</h2></div>
      <div class="stack">
        <div class="card">
          <p class="eyebrow">Rođendan</p>
          <p style="font-family:var(--f-display);font-size:17px;margin:6px 0 4px">${esc(S.user.birthday)}</p>
          <p class="tiny muted">Tjedan oko rođendana: njega ili maska uz svaku uslugu, bez naplate.</p>
        </div>
        <div class="card">
          <p class="eyebrow">Preporuka</p>
          <p style="font-family:var(--f-display);font-size:17px;margin:6px 0 4px">Oboje dobivate 10 €</p>
          <p class="tiny muted">Njoj 10 € na prvi dolazak, tebi 10 € na sljedeći.</p>
          <div class="btn-row"><button class="btn ghost" data-share="1">Pošalji pozivnicu</button></div>
        </div>
        <div class="card">
          <p class="eyebrow">Edukacije</p>
          <p style="font-family:var(--f-display);font-size:17px;margin:6px 0 4px">Tečajevi u salonu</p>
          <p class="tiny muted">Prijava i plaćanje mjesta u aplikaciji, s popisom polaznika i podsjetnikom.</p>
          <div class="btn-row"><button class="btn" disabled>Prijavi se · uskoro</button></div>
        </div>
      </div>
    </div>`;
});

/* --- profil --- */
route(/^\/profil$/, () => `
  <div class="top"><p class="eyebrow">Profil</p><h1>${esc(S.user.name)}</h1><p class="sub">Članica kluba od ${fmtShort(S.user.since)}</p></div>

  <div class="card">
    <div class="kv"><span>Mobitel</span><b>${esc(S.user.phone)}</b></div>
    <div class="kv"><span>Rođendan</span><b>${esc(S.user.birthday)}</b></div>
    <div class="kv"><span>Duljina kose</span><b>${esc(LENGTHS[S.user.length].name)}</b></div>
    <div class="kv"><span>Moja frizerka</span><b>${esc(staffById(S.user.stylist)?.name || '—')}</b></div>
  </div>

  <div class="section">
    <div class="section-title"><h2>Duljina kose</h2><span class="tiny muted">određuje cijenu</span></div>
    <div class="picks">
      ${LENGTHS.map(l => `
        <button class="pick" data-userlen="${l.id}" aria-pressed="${S.user.length === l.id}">
          <div class="p1">${esc(l.name)}</div><div class="p2">${esc(l.sub)}</div>
        </button>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title"><h2>Obavijesti</h2></div>
    <div class="card">
      <p class="tiny muted">Podsjetnik dan prije termina, upute za njegu nakon usluge, poruka kad dođe vrijeme za boju ili pomak ekstenzija.</p>
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
      <p class="tiny muted">Fotografije, formula boje i podaci o alergijama su osjetljivi podaci. Vidiš ih samo ti i salon, čuvaju se dok si član kluba i brišu se na tvoj zahtjev.</p>
      <div class="btn-row"><button class="btn ghost" data-reset="1">Obriši moje podatke</button></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title"><h2>${esc(SALON.name)}</h2></div>
    <div class="card">
      <div class="kv"><span>Adresa</span><b>${esc(SALON.address)}</b></div>
      <div class="kv"><span>Telefon</span><b>${esc(SALON.phone)}</b></div>
      <div class="kv"><span>Instagram</span><b>${esc(SALON.instagram)}</b></div>
      <div class="kv"><span>Radno vrijeme</span><b>${esc(SALON.hours)}</b></div>
    </div>
    <div class="btn-row"><a class="btn ghost" href="#/salon">Ulaz za salon</a></div>
  </div>`);

/* ============================================================
   ZASLONI — salon
   ============================================================ */

const salonClient = id => SALON_CLIENTS.find(c => c.id === id);
let salonStaff = 'svi';

function salonDay() {
  const t = startOfDay(new Date());
  return SALON_DAY.map((x, i) => {
    const d = new Date(t);
    d.setHours(x.h, x.m, 0, 0);
    return { id: 'sd' + i, clientId: x.clientId, serviceId: x.serviceId, staff: x.staff, len: x.len ?? 1, at: iso(d), status: 'zakazan' };
  });
}

route(/^\/salon$/, () => {
  const today = startOfDay(new Date());
  const mine = S.appointments
    .filter(a => startOfDay(a.at).getTime() >= today.getTime() && a.status === 'zakazan')
    .map(a => ({ ...a, clientId: 'martina' }));

  let list = [...salonDay(), ...mine].sort((a, b) => new Date(a.at) - new Date(b.at));
  if (salonStaff !== 'svi') list = list.filter(a => a.staff === salonStaff);

  const danas = list.filter(a => startOfDay(a.at).getTime() === today.getTime());
  const revenue = danas.reduce((n, a) => n + priceOf(svc(a.serviceId), a), 0);

  /* Za pozvati: klijenti kojima je usluga „dozrela" */
  const call = [];
  SALON_CLIENTS.forEach(c => {
    (c.history || []).forEach(h => {
      const s = svc(h.serviceId);
      if (!s || !s.cycle) return;
      const left = s.cycle - h.daysAgo;
      if (left <= 10) call.push({ client: c, name: s.name, left });
    });
  });
  const extLeft = Math.round((new Date(S.ext.installedAt).getTime() + S.ext.cycleDays * DAY - Date.now()) / DAY);
  if (extLeft <= 21) call.push({ client: salonClient('martina'), name: 'Pomak ekstenzija', left: extLeft });
  call.sort((a, b) => a.left - b.left);

  return `
    <div class="salon">
      ${backBtn('/profil', 'Izlaz')}
      <div class="top"><p class="eyebrow">Ulaz za salon</p><h1>Danas u studiju</h1><p class="sub">${fmtLong(today)}</p></div>

      <div class="salon-bar">
        <button data-sstaff="svi" aria-pressed="${salonStaff === 'svi'}">Svi</button>
        ${STAFF.map(x => `<button data-sstaff="${x.id}" aria-pressed="${salonStaff === x.id}">${esc(x.name)}</button>`).join('')}
      </div>

      <div class="card">
        <div class="kv"><span>Zakazano danas</span><b class="num">${danas.length}</b></div>
        <div class="kv"><span>Očekivani prihod danas</span><b class="num">${eur(Math.round(revenue))}</b></div>
        <div class="kv"><span>Za nazvati ovaj tjedan</span><b class="num">${call.length}</b></div>
      </div>

      <div class="section">
        <div class="section-title"><h2>Raspored</h2></div>
        ${list.length ? `<div class="list">${list.map(a => {
          const s = svc(a.serviceId);
          const c = salonClient(a.clientId);
          const danasnji = startOfDay(a.at).getTime() === today.getTime();
          return `<a class="appt" href="#/salon/klijent/${a.clientId}" style="text-decoration:none;color:inherit">
            <div class="when"><div class="d num">${fmtTime(a.at).slice(0, 2)}</div><div class="m">${fmtTime(a.at).slice(3)}</div></div>
            <div class="grow">
              <div class="t">${esc(c ? c.name : S.user.name)}</div>
              <div class="s">${esc(s.name)} · ${dur(minsOf(s, a))} · ${esc(staffById(a.staff)?.name || '')}${danasnji ? '' : ` · ${fmtShort(a.at)}`}</div>
            </div>
            <svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </a>`;
        }).join('')}</div>` : `<div class="empty">Nema zakazanih termina.</div>`}
      </div>

      <div class="section">
        <div class="section-title"><h2>Za nazvati</h2><span class="tiny muted">dozrele usluge</span></div>
        ${call.length ? `<div class="list">${call.map(x => `
          <a class="row" href="#/salon/klijent/${x.client.id}">
            <div class="grow">
              <div class="name">${esc(x.client.name)}</div>
              <div class="meta">${esc(x.name)} · ${x.left <= 0 ? `kasni ${days(Math.abs(x.left))}` : `za ${days(x.left)}`}</div>
            </div>
            <span class="chip ${x.left <= 0 ? 'warn' : ''}">${x.left <= 0 ? 'kasni' : 'uskoro'}</span>
          </a>`).join('')}</div>` : `<div class="empty">Nitko, sve je pokriveno.</div>`}
      </div>

      <div class="section">
        <div class="section-title"><h2>Klijenti</h2></div>
        <div class="list">
          ${SALON_CLIENTS.map(c => `
            <a class="row" href="#/salon/klijent/${c.id}">
              <div class="grow">
                <div class="name">${esc(c.name)}</div>
                <div class="meta">${c.visits} dolazaka · ${esc(staffById(c.stylist)?.name || '')}${c.noShows ? ` · ${c.noShows} nedolaska` : ''}</div>
              </div>
              ${c.noShows ? '<span class="chip warn">akontacija</span>' : ''}
              <svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </a>`).join('')}
        </div>
      </div>
    </div>`;
});

route(/^\/salon\/klijent\/([a-z]+)$/, id => {
  const c = SALON_CLIENTS.find(x => x.id === id);
  if (!c) return `<div class="empty">Klijent ne postoji.</div>`;
  const isDemo = id === 'martina';
  const f = isDemo ? S.formula : c.formula;
  const history = isDemo
    ? S.appointments.filter(a => a.status === 'obavljen').sort((a, b) => new Date(b.at) - new Date(a.at))
    : (c.history || []).map(h => ({ serviceId: h.serviceId, at: iso(addDays(startOfDay(new Date()), -h.daysAgo)), len: 1 }));

  const next = isDemo
    ? S.appointments.filter(a => a.status === 'zakazan').sort((a, b) => new Date(a.at) - new Date(b.at))[0]
    : null;

  return `
    <div class="salon">
      ${backBtn('/salon', 'Salon')}
      <div class="top"><p class="eyebrow">Kartica klijenta</p><h1>${esc(c.name)}</h1>
        <p class="sub">${esc(c.phone)} · ${c.visits} dolazaka · ${esc(staffById(c.stylist)?.name || '')}</p></div>

      ${(c.alerts || []).length ? `<div class="alert"><b>Pozor</b>${c.alerts.map(esc).join('<br>')}</div>` : ''}
      ${c.noShows ? `<div class="alert" style="margin-top:10px"><b>Nedolasci</b>${c.noShows} nedolaska — uključena akontacija za termine dulje od dva sata.</div>` : ''}
      ${c.note ? `<div class="card" style="margin-top:12px"><p class="eyebrow">Bilješka</p><p class="tiny muted" style="margin-top:6px">${esc(c.note)}</p></div>` : ''}

      ${f ? `<div class="section">
        <div class="section-title"><h2>Boja</h2></div>
        ${formulaCard(f)}
      </div>` : ''}

      ${isDemo ? `
        <div class="section">
          <div class="section-title"><h2>Zabilježi uslugu</h2></div>
          <div class="card">
            ${next ? `<p class="tiny muted">Sljedeći zakazani termin: <b>${esc(svc(next.serviceId).name)}</b>, ${fmtShort(next.at)} u ${fmtTime(next.at)}.</p>` : ''}
            <label class="field"><span>Usluga</span>
              <select id="logsvc">
                ${SERVICES.filter(s => s.price !== 0).map(s =>
                  `<option value="${s.id}" ${next && next.serviceId === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}
              </select>
            </label>
            <label class="field"><span>Formula — baza</span><input type="text" id="fbase" value="${esc(S.formula.base)}"></label>
            <label class="field"><span>Razvijač</span><input type="text" id="fdev" value="${esc(S.formula.dev)}"></label>
            <label class="field"><span>Vrijeme</span><input type="text" id="ftime" value="${esc(S.formula.time)}"></label>
            <div class="btn-row"><button class="btn" data-log="1">Zabilježi i pošalji upute</button></div>
            <p class="tiny muted" style="margin-top:10px">Zabilježena usluga upisuje formulu u karticu, šalje klijentu upute za njegu i postavlja podsjetnik za sljedeći put.</p>
          </div>
        </div>` : ''}

      ${history.length ? `
        <div class="section">
          <div class="section-title"><h2>Povijest</h2></div>
          <div class="list">${history.map(a => apptRow(a, { href: false })).join('')}</div>
        </div>` : ''}
    </div>`;
});

/* ============================================================
   AKCIJE
   ============================================================ */

function bind(root) {
  root.querySelectorAll('[data-go]').forEach(el => el.onclick = () => go(el.dataset.go));

  root.querySelectorAll('[data-len]').forEach(el => el.onclick = () => { pick.len = +el.dataset.len; pick.at = null; render(); });
  root.querySelectorAll('[data-min]').forEach(el => el.onclick = () => { pick.minutes = +el.dataset.min; pick.at = null; render(); });
  root.querySelectorAll('[data-staff]').forEach(el => el.onclick = () => { pick.staff = el.dataset.staff; pick.at = null; render(); });
  root.querySelectorAll('[data-date]').forEach(el => el.onclick = () => { pick.date = el.dataset.date; pick.at = null; render(); });
  root.querySelectorAll('[data-slot]').forEach(el => el.onclick = () => { pick.at = el.dataset.slot; render(); });

  root.querySelectorAll('[data-userlen]').forEach(el => el.onclick = () => {
    S.user.length = +el.dataset.userlen; save(); render(); toast('Duljina kose je spremljena — cijene se prilagođavaju.');
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
    S.photos = { before: null, after: null };
    save(); render(); toast('Fotografije su obrisane.');
  });
  root.querySelectorAll('[data-reserve]').forEach(el => el.onclick = () => {
    const p = PRODUCTS.find(x => x.id === el.dataset.reserve);
    toast(`${p.name} — odloženo za tvoj sljedeći termin.`);
    notify('Proizvod je odložen', `${p.name} čeka te na recepciji.`);
  });
  root.querySelectorAll('[data-sstaff]').forEach(el => el.onclick = () => { salonStaff = el.dataset.sstaff; render(); });
  root.querySelectorAll('[data-log]').forEach(el => el.onclick = logService);
  root.querySelectorAll('[data-notif]').forEach(el => el.onclick = enableNotifications);
  root.querySelectorAll('[data-reset]').forEach(el => el.onclick = () => {
    if (confirm('Obrisati sve podatke ovog demo profila?')) reset();
  });
  root.querySelectorAll('[data-share]').forEach(el => el.onclick = share);
}

function book(serviceId) {
  if (!pick.at) return;
  const s = svc(serviceId);
  const id = 'a' + Date.now().toString(36);

  S.appointments.push({
    id, serviceId, at: pick.at, status: 'zakazan', staff: pick.staff,
    len: pick.len, ...(s.perMin ? { minutes: pick.minutes } : {}),
  });
  save();

  notify('Termin je rezerviran', `${s.name} — ${fmtLong(pick.at)} u ${fmtTime(pick.at)}, kod ${staffById(pick.staff).name}`);
  toast(`Rezervirano: ${fmtShort(pick.at)} u ${fmtTime(pick.at)}`);
  pick = { len: null, staff: null, minutes: 15, date: null, at: null };
  go('/termin/' + id);
}

function cancel(id) {
  const a = S.appointments.find(x => x.id === id);
  if (!a) return;
  if ((new Date(a.at) - Date.now()) / 3600000 < 24) { toast(`Manje od 24 sata — nazovi ${SALON.phone}.`); return; }
  if (!confirm('Otkazati ovaj termin?')) return;
  S.appointments = S.appointments.filter(x => x.id !== id);
  save();
  toast('Termin je otkazan. Nudimo ga listi čekanja.');
  go('/termini');
}

function logService() {
  const sel = document.getElementById('logsvc');
  const s = svc(sel.value);
  if (!s) return;

  const base = document.getElementById('fbase').value.trim();
  const dev = document.getElementById('fdev').value.trim();
  const time = document.getElementById('ftime').value.trim();

  const now = new Date();
  const booked = S.appointments.filter(a => a.serviceId === s.id && a.status === 'zakazan')
    .sort((a, b) => new Date(a.at) - new Date(b.at))[0];

  if (booked) { booked.status = 'obavljen'; booked.at = iso(now); }
  else S.appointments.push({ id: 'a' + Date.now().toString(36), serviceId: s.id, at: iso(now),
    status: 'obavljen', staff: S.user.stylist, len: S.user.length, ...(s.perMin ? { minutes: 12 } : {}) });

  if (s.formula && base) S.formula = { ...S.formula, base, dev, time, updatedAt: iso(now) };
  if (s.ext) S.ext = { ...S.ext, installedAt: iso(now) };
  if (s.id === 'eks-pomak') S.ext = { ...S.ext, installedAt: iso(now) };
  if (s.perMin) S.solMinutes = Math.max(0, S.solMinutes - 12);

  S.lastCare = s.care || null;
  S.points += Math.round(priceOf(s, { len: S.user.length, minutes: 12 }));
  save();

  notify('Upute za njegu', CARE[s.care]?.items[0] || 'Vidi upute u aplikaciji.');
  toast('Zabilježeno. Klijentu su poslane upute i podsjetnik za sljedeći put.');
  render();
}

async function addPhoto(input) {
  const slot = input.dataset.photo;
  const file = input.files && input.files[0];
  if (!file) return;
  try {
    S.photos[slot] = await shrink(file, 720);
    save(); render();
    toast('Fotografija je spremljena. Vidiš je samo ti i salon.');
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
  const text = 'Pozivam te u DLM Klub — oboje dobivamo 10 € na uslugu. dlm-studio.hr';
  if (navigator.share) {
    try { await navigator.share({ title: 'DLM Klub', text }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); toast('Pozivnica je kopirana.'); }
  catch { toast('Pozivnica: dlm-studio.hr'); }
}

/* ---------- start ---------- */
load();
window.addEventListener('hashchange', () => {
  const p = (location.hash || '#/').slice(1);
  if (!p.startsWith('/rezerviraj/usluga/')) pick = { len: null, staff: null, minutes: 15, date: null, at: null };
  render();
});
render();

/* Katalog usluga DLM Studija — struktura prepisana s dlm-studio.hr/cjenik
   i s Instagram profila @dlm_studio (kolovoz 2026.).

   VAŽNO: cjenik na njihovoj stranici je još u kunama (dakle stariji od 2023.),
   pa su cijene ovdje OGLEDNE — postavljene na današnju zagrebačku razinu.
   Prije prikaza vlasniku treba tražiti važeći cjenik.

   price   = EUR, fiksna cijena
   byLen   = [kratka, poluduga, duga] — cijena ovisi o duljini kose
   min     = trajanje u minutama; minByLen = trajanje po duljini
   perMin  = usluga se naplaćuje po minuti (solarij)
   cycle   = nakon koliko dana usluga „dozrijeva" za ponavljanje
   formula = usluga u koju se upisuje formula boje
   patch   = traži test na koži 48 h prije prvog puta
   care    = ključ uputa za njegu nakon usluge
*/

export const SALON = {
  name: 'DLM Studio',
  address: 'Ljudevita Posavskog 25F, Novi Jelkovec, Sesvete',
  phone: '01 4003 290',
  instagram: '@dlm_studio',
  hours: 'Pon–pet 9–20, sub 8–14',
};

export const CATEGORIES = [
  { id: 'frizura',    name: 'Šišanje i frizura',   sub: 'Pranje, šišanje, fen, svečane frizure' },
  { id: 'boja',       name: 'Boja i pramenovi',    sub: 'INOA, pramenovi, balayage, preljev' },
  { id: 'njega',      name: 'Njega kose',          sub: 'Botoks, keratin, Moroccanoil, maske' },
  { id: 'ekstenzije', name: 'Ekstenzije',          sub: 'Ugradnja, pomak, skidanje' },
  { id: 'mladenke',   name: 'Mladenke i svečano',  sub: 'Proba, dan vjenčanja, dolazak na adresu' },
  { id: 'sminka',     name: 'Šminkanje',           sub: 'Dnevna, večernja, proba' },
  { id: 'nokti',      name: 'Nokti',               sub: 'Manikura, trajni lak, gel' },
  { id: 'obrve',      name: 'Obrve i trepavice',   sub: 'Oblikovanje i bojanje' },
  { id: 'solarij',    name: 'Solarij',             sub: 'Naplata po minuti' },
];

/* Duljina kose — pamti se u profilu, mijenja cijenu i trajanje */
export const LENGTHS = [
  { id: 0, name: 'Kratka',   sub: 'do brade' },
  { id: 1, name: 'Poluduga', sub: 'do ramena' },
  { id: 2, name: 'Duga',     sub: 'ispod ramena' },
];

export const SERVICES = [
  // ---------- ŠIŠANJE I FRIZURA ----------
  { id: 'konzultacija',    cat: 'frizura', name: 'Besplatna konzultacija', price: 0, min: 15, group: 'Prvi dolazak',
    note: 'Bez naplate — dogovor boje, duljine i cijene' },
  { id: 'pranje-sisanje',  cat: 'frizura', name: 'Pranje kose i šišanje', byLen: [22, 26, 30], minByLen: [45, 45, 60], group: 'Žensko' },
  { id: 'pranje-frizura',  cat: 'frizura', name: 'Pranje kose i frizura', byLen: [20, 24, 28], minByLen: [30, 45, 60], group: 'Žensko' },
  { id: 'sisanje-frizura', cat: 'frizura', name: 'Pranje, šišanje i frizura', byLen: [30, 36, 42], minByLen: [60, 75, 90], group: 'Žensko' },
  { id: 'siski',           cat: 'frizura', name: 'Šišanje šiški', price: 6, min: 15, group: 'Žensko' },
  { id: 'pletenica',       cat: 'frizura', name: 'Izrada pletenice', price: 10, min: 20, group: 'Žensko' },
  { id: 'svecana-dignuta', cat: 'frizura', name: 'Svečana frizura — dignuta kosa', price: 45, min: 60, group: 'Svečano' },
  { id: 'svecana-spustena',cat: 'frizura', name: 'Svečana frizura — spuštena kosa', price: 30, min: 45, group: 'Svečano' },
  { id: 'musko-sisanje',   cat: 'frizura', name: 'Muško šišanje i pranje kose', price: 15, min: 30, group: 'Muško' },
  { id: 'musko-masina',    cat: 'frizura', name: 'Šišanje mašinom', price: 10, min: 20, group: 'Muško' },
  { id: 'musko-boja',      cat: 'frizura', name: 'Muško bojanje, pranje i šišanje', price: 30, min: 60, group: 'Muško', formula: true, cycle: 35 },
  { id: 'djecje',          cat: 'frizura', name: 'Dječje šišanje (do 12 g.)', price: 12, min: 30, group: 'Djeca' },

  // ---------- BOJA I PRAMENOVI ----------
  { id: 'bojanje',         cat: 'boja', name: 'Bojanje, pranje i frizura', byLen: [45, 52, 60], minByLen: [90, 105, 120],
    note: 'INOA — bez amonijaka', group: 'Boja', formula: true, patch: true, cycle: 42, care: 'boja' },
  { id: 'bojanje-sisanje', cat: 'boja', name: 'Bojanje, pranje, šišanje i frizura', byLen: [55, 62, 70], minByLen: [105, 120, 135],
    group: 'Boja', formula: true, patch: true, cycle: 42, care: 'boja' },
  { id: 'hto',             cat: 'boja', name: 'HTO, pranje, šišanje i frizura', byLen: [30, 36, 42], minByLen: [75, 90, 105],
    note: 'Osvježavanje tona bez pokrivanja', group: 'Boja', formula: true, cycle: 42, care: 'boja' },
  { id: 'preljev',         cat: 'boja', name: 'Preljev / toner', price: 20, min: 30, group: 'Boja', formula: true, cycle: 28, care: 'boja' },
  { id: 'skidanje-boje',   cat: 'boja', name: 'Skidanje boje', byLen: [22, 32, 45], minByLen: [60, 75, 90], group: 'Boja' },
  { id: 'pramenovi',       cat: 'boja', name: 'Pramenovi, pranje i frizura', byLen: [55, 62, 72], minByLen: [120, 135, 150],
    group: 'Pramenovi', formula: true, patch: true, cycle: 56, care: 'boja' },
  { id: 'pramenovi-sis',   cat: 'boja', name: 'Pramenovi, pranje, šišanje i frizura', byLen: [62, 72, 85], minByLen: [135, 150, 165],
    group: 'Pramenovi', formula: true, patch: true, cycle: 56, care: 'boja' },
  { id: 'pramenovi-2',     cat: 'boja', name: 'Dvobojni pramenovi, šišanje i frizura', byLen: [70, 80, 92], minByLen: [150, 165, 180],
    group: 'Pramenovi', formula: true, patch: true, cycle: 56, care: 'boja' },
  { id: 'pramenovi-duz',   cat: 'boja', name: 'Pramenovi cijelom dužinom, šišanje i frizura', byLen: [72, 85, 100], minByLen: [150, 180, 195],
    group: 'Pramenovi', formula: true, patch: true, cycle: 56, care: 'boja' },
  { id: 'balayage',        cat: 'boja', name: 'Balayage / airtouch', byLen: [85, 100, 120], minByLen: [180, 210, 240],
    note: 'Uz preljev i njegu', group: 'Pramenovi', formula: true, patch: true, cycle: 84, care: 'boja' },

  // ---------- NJEGA KOSE ----------
  { id: 'botoks',      cat: 'njega', name: 'Botoks tretman za kosu', byLen: [25, 30, 35], minByLen: [45, 45, 60], cycle: 60, care: 'njega' },
  { id: 'keratin',     cat: 'njega', name: 'Keratinsko zaglađivanje', byLen: [90, 110, 130], minByLen: [120, 150, 180], cycle: 120, care: 'keratin' },
  { id: 'moroccanoil', cat: 'njega', name: 'Moroccanoil tretman', price: 15, min: 20, note: 'Argan ulje, obnova oštećene kose' },
  { id: 'maska',       cat: 'njega', name: 'Maska za kosu', price: 6, min: 15 },
  { id: 'ampula',      cat: 'njega', name: 'Ampula za kosu', price: 10, min: 15 },
  { id: 'suho-pranje', cat: 'njega', name: 'Suho pranje kose', price: 10, min: 20, note: 'Bez vode — za kosu koja se ne smije močiti' },

  // ---------- EKSTENZIJE ----------
  { id: 'eks-konz',     cat: 'ekstenzije', name: 'Konzultacija za ekstenzije', price: 0, min: 20,
    note: 'Odabir metode, boje i količine — bez naplate' },
  { id: 'eks-keratin',  cat: 'ekstenzije', name: 'Ugradnja — keratinski bondovi', price: 250, min: 180,
    note: 'Cijena ovisi o količini kose', ext: true, cycle: 70, care: 'ekstenzije' },
  { id: 'eks-tape',     cat: 'ekstenzije', name: 'Ugradnja — tape-in trake', price: 180, min: 120, ext: true, cycle: 56, care: 'ekstenzije' },
  { id: 'eks-ring',     cat: 'ekstenzije', name: 'Ugradnja — mikroringovi', price: 220, min: 150, ext: true, cycle: 70, care: 'ekstenzije' },
  { id: 'eks-pomak',    cat: 'ekstenzije', name: 'Pomak / korekcija ekstenzija', price: 90, min: 120, cycle: 70, care: 'ekstenzije' },
  { id: 'eks-skidanje', cat: 'ekstenzije', name: 'Skidanje ekstenzija', price: 45, min: 60 },
  { id: 'eks-njega',    cat: 'ekstenzije', name: 'Pranje i njega ekstenzija', price: 25, min: 45 },

  // ---------- MLADENKE I SVEČANO ----------
  { id: 'mlada-proba',  cat: 'mladenke', name: 'Proba frizure i šminke', price: 70, min: 120, note: 'Preporuka: 4–6 tjedana prije' },
  { id: 'mlada-dan',    cat: 'mladenke', name: 'Mladenka — frizura i šminka', price: 180, min: 180, bridal: true },
  { id: 'mlada-teren',  cat: 'mladenke', name: 'Dolazak na adresu (teren)', price: 60, min: 60, note: 'Unutar Zagreba' },
  { id: 'svatovi',      cat: 'mladenke', name: 'Frizura ili šminka za pratnju (po osobi)', price: 40, min: 45 },

  // ---------- ŠMINKA ----------
  { id: 'sminka-dnevna',   cat: 'sminka', name: 'Dnevna šminka', price: 30, min: 45 },
  { id: 'sminka-vecernja', cat: 'sminka', name: 'Večernja šminka', price: 40, min: 60 },
  { id: 'sminka-proba',    cat: 'sminka', name: 'Proba šminke', price: 35, min: 60 },

  // ---------- NOKTI ----------
  { id: 'manikura',      cat: 'nokti', name: 'Manikura', price: 15, min: 30, group: 'Njega' },
  { id: 'spa-manikura',  cat: 'nokti', name: 'SPA manikura', price: 22, min: 45, group: 'Njega' },
  { id: 'manikura-m',    cat: 'nokti', name: 'Manikura za muškarce', price: 15, min: 30, group: 'Njega' },
  { id: 'trajni',        cat: 'nokti', name: 'Trajni lak', price: 25, min: 60, group: 'Trajni lak', cycle: 21, care: 'nokti' },
  { id: 'trajni-oboje',  cat: 'nokti', name: 'Skidanje i stavljanje trajnog laka', price: 32, min: 75, group: 'Trajni lak', cycle: 21, care: 'nokti' },
  { id: 'trajni-skid',   cat: 'nokti', name: 'Skidanje trajnog laka', price: 12, min: 20, group: 'Trajni lak' },
  { id: 'ugradnja',      cat: 'nokti', name: 'Ugradnja umjetnih noktiju', price: 45, min: 120, group: 'Gel', cycle: 21, care: 'nokti' },
  { id: 'produljivanje', cat: 'nokti', name: 'Produljivanje šablonom i tipsama', price: 45, min: 120, group: 'Gel', cycle: 21, care: 'nokti' },
  { id: 'geliranje',     cat: 'nokti', name: 'Geliranje prirodnih noktiju', price: 35, min: 90, group: 'Gel', cycle: 21, care: 'nokti' },
  { id: 'korekcija',     cat: 'nokti', name: 'Korekcija (međunjega)', price: 28, min: 75, group: 'Gel', cycle: 21, care: 'nokti' },
  { id: 'skidanje-gela', cat: 'nokti', name: 'Skidanje gela s noktiju', price: 18, min: 30, group: 'Gel' },
  { id: 'popravak',      cat: 'nokti', name: 'Popravak jednog nokta', price: 5, min: 15, group: 'Gel' },
  { id: 'lakiranje',     cat: 'nokti', name: 'Lakiranje', price: 6, min: 20, group: 'Lak' },
  { id: 'french',        cat: 'nokti', name: 'French s lakom', price: 8, min: 25, group: 'Lak' },
  { id: 'ukrasavanje',   cat: 'nokti', name: 'Ukrašavanje noktiju', price: 3, min: 10, group: 'Lak' },

  // ---------- OBRVE I TREPAVICE ----------
  { id: 'obrve-oblik',   cat: 'obrve', name: 'Oblikovanje obrva', price: 7, min: 15, cycle: 28 },
  { id: 'obrve-boja',    cat: 'obrve', name: 'Bojanje obrva', price: 7, min: 15, patch: true, cycle: 28 },
  { id: 'obrve-paket',   cat: 'obrve', name: 'Oblikovanje i bojanje obrva', price: 12, min: 25, patch: true, cycle: 28 },
  { id: 'trepavice-boja',cat: 'obrve', name: 'Bojanje trepavica', price: 9, min: 20, patch: true, cycle: 35 },

  // ---------- SOLARIJ ----------
  { id: 'sol-basic',  cat: 'solarij', name: 'M-50 Basic', perMin: 0.40, min: 15,
    note: 'Ležeći, za početak i održavanje', care: 'solarij' },
  { id: 'sol-avant',  cat: 'solarij', name: 'Avantgarde 600', perMin: 0.60, min: 15,
    note: 'Jači uređaj — kraće izlaganje', care: 'solarij' },
];

/* Frizeri i kozmetičarke — u demou izmišljena imena.
   U pravoj aplikaciji svaki ima svoje radno vrijeme i svoje usluge. */
export const STAFF = [
  { id: 'iva',   name: 'Iva',   role: 'Frizerka i koloristica', short: 'Boja i ekstenzije', does: ['frizura', 'boja', 'njega', 'ekstenzije', 'mladenke'],
    hours: { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [8, 14], 0: null } },
  { id: 'tea',   name: 'Tea',   role: 'Frizerka i vizažistica', short: 'Frizure i šminka', does: ['frizura', 'boja', 'njega', 'sminka', 'mladenke'],
    hours: { 1: [12, 20], 2: [9, 17], 3: [12, 20], 4: [9, 17], 5: [12, 20], 6: [8, 14], 0: null } },
  { id: 'sara',  name: 'Sara',  role: 'Nokti, obrve i solarij', short: 'Nokti i solarij', does: ['nokti', 'obrve', 'solarij', 'sminka'],
    hours: { 1: [9, 17], 2: [9, 17], 3: [9, 17], 4: [12, 20], 5: [9, 17], 6: [8, 14], 0: null } },
];

/* Upute za njegu — šalju se same nakon što salon zabilježi uslugu */
export const CARE = {
  boja: {
    title: 'Nakon bojanja',
    when: 'Prvih 72 sata',
    items: [
      'Ne peri kosu 48 sati — boja se još veže za vlas.',
      'Šampon bez sulfata, inače ton odlazi za dva pranja.',
      'Ne idi na bazen i u more prvih tjedan dana; klor mijenja ton u zeleno.',
      'Fen i pegla na nižoj temperaturi, uz zaštitu od topline.',
    ],
  },
  keratin: {
    title: 'Nakon keratinskog zaglađivanja',
    when: 'Prva 72 sata',
    items: [
      'Kosa ostaje ravna i raspuštena — bez gumice, kopči i uha iza uha.',
      'Ne peri i ne moči kosu 72 sata.',
      'Bez šampona sa sulfatima i solju — skraćuju trajanje s pet mjeseci na dva.',
      'Prvi fen radimo mi, ako želiš — javi se za termin.',
    ],
  },
  njega: {
    title: 'Nakon tretmana njege',
    when: 'Ovaj tjedan',
    items: [
      'Prvo pranje tek za 48 sati.',
      'Manje topline — svako sušenje na maksimumu odnosi dio tretmana.',
      'Maska jednom tjedno održava rezultat do sljedećeg tretmana.',
    ],
  },
  ekstenzije: {
    title: 'Nakon ugradnje ekstenzija',
    when: 'Prvih 48 sati i dalje',
    items: [
      'Ne peri kosu 48 sati nakon ugradnje.',
      'Češljaj četkom za ekstenzije, od vrhova prema gore, dva puta dnevno.',
      'Nikad ne spavaj s mokrom kosom — bondovi se zapetljaju u čvor.',
      'Regenerator samo po dužini, nikad na spojeve.',
      'Pomak je za 8 do 10 tjedana — podsjetit ćemo te na vrijeme.',
    ],
  },
  nokti: {
    title: 'Nakon trajnog laka i gela',
    when: 'Danas',
    items: [
      'Bez vruće vode i sauna prva 24 sata.',
      'Rukavice za posuđe i sredstva za čišćenje — aceton iz sredstava podiže rub.',
      'Ne koristi nokte kao alat; jedan otvoreni paket i rub je gotov.',
      'Ako se rub podigne, javi se odmah — popravak jednog nokta je 5 €.',
    ],
  },
  solarij: {
    title: 'Nakon solarija',
    when: 'Danas i sutra',
    items: [
      'Krema poslije sunčanja odmah — koža sada gubi vlagu.',
      'Sljedeći dolazak najranije za 48 sati.',
      'Bez tuširanja vrućom vodom prva dva sata.',
      'Piling odgodi za tri dana da boja ostane ravnomjerna.',
    ],
  },
};

/* Proizvodi za kosu iz saloničkog shopa — s procjenom koliko traju */
export const PRODUCTS = [
  { id: 'moroccanoil-oil', name: 'Moroccanoil ulje za kosu 100 ml', price: 42, weeks: 16 },
  { id: 'sampon-boja',     name: 'Šampon za obojenu kosu 300 ml',   price: 19, weeks: 10 },
  { id: 'maska-boja',      name: 'Maska za obojenu kosu 250 ml',    price: 24, weeks: 12 },
  { id: 'zastita',         name: 'Zaštita od topline u spreju',      price: 17, weeks: 14 },
  { id: 'cetka-eks',       name: 'Četka za ekstenzije',              price: 12, weeks: 52 },
];

/* ---------- Demo podaci ---------- */

export const DEMO_CLIENT = {
  name: 'Martina Jurić',
  phone: '091 555 2210',
  birthday: '9. 11.',
  since: '2025-10-04',
  length: 2,
  hairType: 'Obojena, blago valovita, suhi vrhovi',
  allergies: ['Test na koži napravljen 4. 10. 2025. — bez reakcije'],
  stylist: 'iva',
};

/* Formula boje — ono što salon danas drži u glavi ili u bilježnici */
export const DEMO_FORMULA = {
  base: 'INOA 6.34 + 7.3 (1:1)',
  dev: 'Oxydant 20 vol (6 %)',
  time: '35 min',
  toner: 'Preljev 9.13, 10 min',
  updated: -21,
  swatch: ['#6B4A2E', '#9A6B3C'],
};

export const DEMO_EXT = {
  method: 'Keratinski bondovi',
  strands: 120,
  shade: '6/27 — tamno plava s medenim',
  installedDaysAgo: 46,
  cycleDays: 70,
};

/* Klijenti za salonski ulaz */
export const SALON_CLIENTS = [
  { id: 'martina', name: 'Martina Jurić', phone: '091 555 2210', visits: 18, noShows: 0, stylist: 'iva',
    note: 'Ekstenzije od travnja. Ne voli previše bakrenog u tonu.',
    alerts: ['Test na koži: 4. 10. 2025., bez reakcije'] },
  { id: 'dora',    name: 'Dora Vuković',  phone: '098 330 4471', visits: 7, noShows: 2, stylist: 'iva',
    note: 'Dva nedolaska u lipnju. Za dulje termine uključena akontacija.',
    alerts: ['Alergija na amonijak — samo INOA'],
    formula: { base: 'INOA 5.0 + 5.62 (2:1)', dev: 'Oxydant 20 vol', time: '35 min', toner: '—', updated: -49, swatch: ['#4A3125', '#6C3B33'] },
    history: [{ serviceId: 'bojanje-sisanje', daysAgo: 49 }, { serviceId: 'trajni', daysAgo: 28 }, { serviceId: 'pranje-frizura', daysAgo: 76 }] },
  { id: 'lucija',  name: 'Lucija Marić',  phone: '095 118 9022', visits: 3, noShows: 0, stylist: 'tea',
    note: 'Vjenčanje 19. rujna. Proba odrađena, teren dogovoren u 7:00.',
    alerts: ['Mladenka — 19. 9., dolazak na adresu'],
    history: [{ serviceId: 'mlada-proba', daysAgo: 12 }, { serviceId: 'sminka-vecernja', daysAgo: 40 }] },
  { id: 'petar',   name: 'Petar Klarić',  phone: '099 274 3318', visits: 11, noShows: 0, stylist: 'iva',
    note: 'Dolazi svakih pet tjedana, uvijek subotom ujutro.',
    alerts: [],
    history: [{ serviceId: 'musko-sisanje', daysAgo: 34 }, { serviceId: 'musko-boja', daysAgo: 69 }] },
];

/* Demo raspored za danas — h/m su sat i minuta */
export const SALON_DAY = [
  { clientId: 'dora',    serviceId: 'bojanje-sisanje', staff: 'iva',  h: 9,  m: 0,  len: 1 },
  { clientId: 'lucija',  serviceId: 'sminka-dnevna',   staff: 'tea',  h: 10, m: 0 },
  { clientId: 'petar',   serviceId: 'musko-sisanje',   staff: 'iva',  h: 12, m: 0 },
  { clientId: 'dora',    serviceId: 'trajni',          staff: 'sara', h: 13, m: 0 },
  { clientId: 'lucija',  serviceId: 'pramenovi-sis',   staff: 'tea',  h: 14, m: 30, len: 2 },
  { clientId: 'petar',   serviceId: 'obrve-oblik',     staff: 'sara', h: 16, m: 0 },
  { clientId: 'dora',    serviceId: 'eks-pomak',       staff: 'iva',  h: 17, m: 0 },
];

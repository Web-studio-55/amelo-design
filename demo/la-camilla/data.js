/* Katalog usluga — prepisan s la-camilla.com/cjenik (kolovoz 2026.)
   price = EUR, min = trajanje u minutama, series = preporučeni broj tretmana u programu */

export const CATEGORIES = [
  { id: 'lice',       name: 'Tretmani lica',     sub: 'Čišćenje, anti-age, problematična koža' },
  { id: 'lashes',     name: 'Lashes & brows',    sub: 'Trepavice i obrve' },
  { id: 'masaze',     name: 'Masaže',            sub: 'Opuštanje i terapija' },
  { id: 'tijelo',     name: 'Oblikovanje tijela', sub: 'Aparativni tretmani' },
  { id: 'depilacija', name: 'Depilacija',        sub: 'Vosak i šećerna pasta' },
  { id: 'ruke',       name: 'Njega ruku',        sub: 'Manikura' },
  { id: 'stopala',    name: 'Njega stopala',     sub: 'Pedikura' },
];

export const SERVICES = [
  // ---------- LICE ----------
  { id: 'classic-lice',  cat: 'lice', name: 'Classic tretman lica', price: 35, min: 30, note: 'UZV špatula, piling, maska, LED', group: 'Classic' },
  { id: 'uzv-lice',      cat: 'lice', name: 'Ultrazvuk lica', price: 30, min: 15, group: 'Classic' },
  { id: 'mikro-cekic',   cat: 'lice', name: 'Mikrodermoabrazija + hladni čekić + LED', price: 40, min: 30, group: 'Classic' },
  { id: 'mikro-maska',   cat: 'lice', name: 'Mikrodermoabrazija + maska + UZV + LED', price: 60, min: 30, group: 'Classic' },
  { id: 'hydrafacial',   cat: 'lice', name: 'HydraFacial tretman', price: 80, min: 45, group: 'Classic', series: 4 },
  { id: 'vip-lice',      cat: 'lice', name: 'VIP tretman lica', price: 70, min: 60, note: 'Mehaničko čišćenje, maska, hladni čekić, LED', group: 'Problem skin & teen' },
  { id: 'acne-stop',     cat: 'lice', name: 'Skin Peel — Acne Stop program', price: 120, min: 45, note: 'BioRePeel ampula, maska, hladni čekić, LED', group: 'Problem skin & teen', series: 4 },
  { id: 'led',           cat: 'lice', name: 'LED terapija', price: 30, min: 15, group: 'Problem skin & teen', series: 6 },
  { id: 'gold-lice',     cat: 'lice', name: 'Gold tretman lica — lifting, anti-age', price: 40, min: 30, note: 'RF, LED', group: 'Anti-age & lifting' },
  { id: 'mikro-rf',      cat: 'lice', name: 'Mikrodermoabrazija + RF lifting + LED', price: 90, min: 45, group: 'Anti-age & lifting', series: 4 },
  { id: 'hydra-rf',      cat: 'lice', name: 'HydraFacial + RF lifting', price: 120, min: 45, group: 'Anti-age & lifting', series: 4 },
  { id: 'dermapen',      cat: 'lice', name: 'Dermapen', price: 120, min: 45, note: 'Dermapen, ampula, maska, hladni čekić, LED', group: 'Anti-age & lifting', series: 3, care: 'dermapen' },
  { id: 'ciscenje-leda', cat: 'lice', name: 'Mehaničko čišćenje leđa', price: 60, min: 60, group: 'Simple' },
  { id: 'masaza-lica',   cat: 'lice', name: 'Masaža lica, vrat i dekolte', price: 25, min: 15, group: 'Simple' },
  { id: 'madero-lice',   cat: 'lice', name: 'Maderoterapija lica, vrat i dekolte', price: 25, min: 15, group: 'Simple' },
  { id: 'rf-lice',       cat: 'lice', name: 'Radiofrekvencija lice, vrat i dekolte', price: 25, min: 25, group: 'Simple' },

  // ---------- LASHES & BROWS ----------
  { id: 'korekcija-obrva', cat: 'lashes', name: 'Korekcija obrva / threading', price: 10, min: 15 },
  { id: 'bojanje-obrva',   cat: 'lashes', name: 'Bojanje obrva', price: 10, min: 10 },
  { id: 'bojanje-trep',    cat: 'lashes', name: 'Bojanje trepavica', price: 10, min: 10 },
  { id: 'brow-keratine',   cat: 'lashes', name: 'Keratinska njega obrva/trepavica', price: 10, min: 10 },
  { id: '3u1',             cat: 'lashes', name: '3u1 — korekcija + bojanje obrva + bojanje trepavica', price: 25, min: 30 },
  { id: 'lash-lift',       cat: 'lashes', name: 'Lash lift', price: 60, min: 60, care: 'lash' },
  { id: 'brow-lift',       cat: 'lashes', name: 'Brow lift', price: 60, min: 40, care: 'lash' },

  // ---------- MASAŽE ----------
  { id: 'klasicna',      cat: 'masaze', name: 'Klasična masaža', price: 24, min: 25, group: 'Klasične masaže' },
  { id: 'medicinska',    cat: 'masaze', name: 'Medicinska masaža', price: 26, min: 25, group: 'Klasične masaže' },
  { id: 'sportska-30',   cat: 'masaze', name: 'Sportska masaža', price: 29, min: 30, group: 'Klasične masaže' },
  { id: 'sportska-50',   cat: 'masaze', name: 'Sportska masaža — duga', price: 50, min: 50, group: 'Klasične masaže' },
  { id: 'masaza-tijela', cat: 'masaze', name: 'Masaža tijela', price: 40, min: 50, group: 'Klasične masaže' },
  { id: 'miogeloze',     cat: 'masaze', name: 'Razbijanje miogeloza UZV + medicinska masaža', price: 35, min: 25, group: 'Klasične masaže', series: 6 },
  { id: 'leda-cupping',  cat: 'masaze', name: 'Masaža leđa + cupping', price: 40, min: 50, group: 'Klasične masaže' },
  { id: 'cupping',       cat: 'masaze', name: 'Cupping terapija', price: 25, min: 20, group: 'Klasične masaže' },
  { id: 'uzv-terapija',  cat: 'masaze', name: 'Ultrazvuk terapija', price: 25, min: 15, group: 'Klasične masaže', series: 6 },
  { id: 'anticelulitna', cat: 'masaze', name: 'Anticelulitna masaža', price: 35, min: 30, group: 'Klasične masaže', series: 10 },
  { id: 'relax',         cat: 'masaze', name: 'Relax masaža', price: 50, min: 50, group: 'Klasične masaže' },
  { id: 'djecja',        cat: 'masaze', name: 'Dječja masaža', price: 15, min: 20, group: 'Klasične masaže' },
  { id: 'madero-noge',   cat: 'masaze', name: 'Klasična maderoterapija — noge', price: 27, min: 30, group: 'Klasična maderoterapija', series: 10 },
  { id: 'madero-trbuh',  cat: 'masaze', name: 'Klasična maderoterapija — trbuh', price: 25, min: 20, group: 'Klasična maderoterapija', series: 10 },
  { id: 'madero-oboje',  cat: 'masaze', name: 'Klasična maderoterapija — noge i trbuh', price: 45, min: 50, group: 'Klasična maderoterapija', series: 10 },
  { id: 'braz-noge',     cat: 'masaze', name: 'Brazilska maderoterapija — noge', price: 35, min: 30, group: 'Brazilska maderoterapija', series: 10 },
  { id: 'braz-trbuh',    cat: 'masaze', name: 'Brazilska maderoterapija — trbuh', price: 32, min: 20, group: 'Brazilska maderoterapija', series: 10 },
  { id: 'braz-oboje',    cat: 'masaze', name: 'Brazilska maderoterapija — noge i trbuh', price: 60, min: 50, group: 'Brazilska maderoterapija', series: 10, care: 'madero' },
  { id: 'limfno-50',     cat: 'masaze', name: 'Limfnomodeliranje', price: 120, min: 50, group: 'Specijalizirane terapije', series: 6, care: 'limfna' },
  { id: 'limfno-90',     cat: 'masaze', name: 'Limfnomodeliranje — dugo', price: 160, min: 90, group: 'Specijalizirane terapije', series: 6, care: 'limfna' },
  { id: 'access-bars',   cat: 'masaze', name: 'Access Bars', price: 90, min: 50, group: 'Specijalizirane terapije' },
  { id: 'peat',          cat: 'masaze', name: 'PEAT terapija', price: 90, min: 50, group: 'Specijalizirane terapije' },

  // ---------- OBLIKOVANJE TIJELA ----------
  { id: 'vacuum-fit',    cat: 'tijelo', name: 'Vacuum fit vreća', price: 50, min: 45, series: 10 },
  { id: 'limfna-drenaza',cat: 'tijelo', name: 'Aparativna limfna drenaža', price: 40, min: 30, series: 10, care: 'limfna' },
  { id: 'lipolaser',     cat: 'tijelo', name: 'Lipolaser', price: 50, min: 20, series: 8 },
  { id: 'kavitacija',    cat: 'tijelo', name: 'Kavitacija', price: 40, min: 15, series: 8, care: 'kavitacija' },
  { id: 'rf-body-15',    cat: 'tijelo', name: 'Radiofrekvencija body contour', price: 35, min: 15, series: 8 },
  { id: 'rf-body-30',    cat: 'tijelo', name: 'Radiofrekvencija body contour — duga', price: 60, min: 30, series: 8 },
  { id: 'butt-lift',     cat: 'tijelo', name: 'Butt lift', price: 25, min: 20, series: 10 },
  { id: 'tesla-2',       cat: 'tijelo', name: 'Tesla — 2 aplikatora', price: 50, min: 30, series: 8 },
  { id: 'tesla-4',       cat: 'tijelo', name: 'Tesla — 4 aplikatora', price: 70, min: 30, series: 8 },

  // ---------- DEPILACIJA ----------
  { id: 'vosak-potkolj', cat: 'depilacija', name: 'Potkoljenice / natkoljenice', price: 18, min: 20, group: 'Hladni vosak', care: 'depilacija' },
  { id: 'vosak-noge',    cat: 'depilacija', name: 'Noge', price: 30, min: 40, group: 'Hladni vosak', care: 'depilacija' },
  { id: 'vosak-ruke',    cat: 'depilacija', name: 'Ruke', price: 15, min: 20, group: 'Hladni vosak', care: 'depilacija' },
  { id: 'vosak-leda',    cat: 'depilacija', name: 'Leđa', price: 22, min: 15, group: 'Hladni vosak', care: 'depilacija' },
  { id: 'sec-nadusnice', cat: 'depilacija', name: 'Nadusnice', price: 8, min: 10, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-brada',     cat: 'depilacija', name: 'Brada', price: 8, min: 5, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-lice',      cat: 'depilacija', name: 'Cijelo lice', price: 15, min: 15, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-pazuh',     cat: 'depilacija', name: 'Pazuh', price: 9, min: 10, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-ruke',      cat: 'depilacija', name: 'Ruke', price: 18, min: 30, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-bikini',    cat: 'depilacija', name: 'Bikini zona', price: 15, min: 20, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-brazilska', cat: 'depilacija', name: 'Brazilska', price: 25, min: 30, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-tanga',     cat: 'depilacija', name: 'Tanga zona', price: 5, min: 10, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-potkolj',   cat: 'depilacija', name: 'Potkoljenice / natkoljenice', price: 20, min: 30, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'sec-noge',      cat: 'depilacija', name: 'Noge', price: 35, min: 45, group: 'Šećerna pasta', care: 'depilacija' },
  { id: 'm-pazuh',       cat: 'depilacija', name: 'Pazuh', price: 10, min: 10, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-ruke',        cat: 'depilacija', name: 'Ruke', price: 25, min: 30, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-prsa',        cat: 'depilacija', name: 'Prsa', price: 35, min: 20, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-trbuh',       cat: 'depilacija', name: 'Trbuh', price: 15, min: 10, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-leda',        cat: 'depilacija', name: 'Leđa', price: 40, min: 20, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-straznjica',  cat: 'depilacija', name: 'Stražnjica', price: 40, min: 20, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-potkolj',     cat: 'depilacija', name: 'Potkoljenice / natkoljenice', price: 35, min: 30, group: 'Za muškarce', care: 'depilacija' },
  { id: 'm-noge',        cat: 'depilacija', name: 'Noge', price: 50, min: 45, group: 'Za muškarce', care: 'depilacija' },

  // ---------- RUKE ----------
  { id: 'ruska-manikura', cat: 'ruke', name: 'Ruska manikura', price: 12, min: 15 },
  { id: 'trajni-ruke',    cat: 'ruke', name: 'Trajni lak na rukama + manikura', price: 30, min: 60 },
  { id: 'djecja-manikura',cat: 'ruke', name: 'Dječja manikura', price: 4, min: 10 },
  { id: 'parafin-ruke',   cat: 'ruke', name: 'Parafinska kupka', price: 10, min: 15 },
  { id: 'spa-ruke',       cat: 'ruke', name: 'Spa piling, masaža, parafinska kupka', price: 25, min: 20 },
  { id: 'skidanje-ruke',  cat: 'ruke', name: 'Skidanje trajnog laka', price: 10, min: 20 },
  { id: 'gel-m',          cat: 'ruke', name: 'Gel na prirodne nokte — M', price: 28, min: 60 },
  { id: 'lakiranje-ruke', cat: 'ruke', name: 'Lakiranje', price: 7, min: 20 },

  // ---------- STOPALA ----------
  { id: 'pedikura',        cat: 'stopala', name: 'Pedikura', price: 30, min: 45 },
  { id: 'trajni-noge',     cat: 'stopala', name: 'Trajni lak na nogama', price: 25, min: 40 },
  { id: 'parafin-stopala', cat: 'stopala', name: 'Parafinska kupka', price: 10, min: 15 },
  { id: 'spa-stopala',     cat: 'stopala', name: 'Spa piling, masaža, parafinska kupka', price: 25, min: 20 },
  { id: 'masaza-stopala',  cat: 'stopala', name: 'Masaža stopala', price: 10, min: 10 },
  { id: 'lakiranje-noge',  cat: 'stopala', name: 'Lakiranje', price: 7, min: 15 },
];

/* Upute za njegu nakon tretmana — šalju se automatski nakon dolaska */
export const CARE = {
  depilacija: {
    title: 'Nakon depilacije',
    when: 'Prva 24 sata',
    items: [
      'Bez saune, solarija, bazena i mora 24 sata.',
      'Bez piling proizvoda i parfumiranih losiona 48 sati.',
      'Nosi laganu odjeću da koža ne bude u trenju.',
      'Od trećeg dana piling dva puta tjedno — sprječava urasle dlačice.',
    ],
  },
  madero: {
    title: 'Nakon maderoterapije',
    when: 'Danas i sutra',
    items: [
      'Popij najmanje dvije litre vode danas — limfa mora odnijeti razgrađeno.',
      'Izbjegavaj slanu hranu i alkohol 24 sata.',
      'Lagana šetnja od pola sata pomaže više nego odmaranje.',
      'Modrice su moguće i normalne. Ako bole više od dva dana, javi nam.',
    ],
  },
  limfna: {
    title: 'Nakon limfne drenaže',
    when: 'Danas',
    items: [
      'Voda, voda, voda — najmanje dvije litre.',
      'Bez intenzivnog treninga danas.',
      'Češće mokrenje je znak da tretman radi.',
      'Bez saune i vruće kupke 12 sati.',
    ],
  },
  kavitacija: {
    title: 'Nakon kavitacije',
    when: '72 sata',
    items: [
      'Dva do tri litre vode dnevno sljedeća tri dana.',
      'Bez alkohola 48 sati — jetra sada ima posla.',
      'Aktivnost svaki dan, barem šetnja.',
      'Bez masne hrane, rezultat ovisi o ovome jednako kao o tretmanu.',
    ],
  },
  dermapen: {
    title: 'Nakon dermapena',
    when: 'Prvih 48 sati',
    items: [
      'Ne diraj lice rukama i ne stavljaj šminku 24 sata.',
      'Bez sunca, zaštitni faktor 50 obavezno sedam dana.',
      'Samo blagi gel za pranje, bez kiselina i retinola sedam dana.',
      'Crvenilo i zatezanje su normalni prva dva dana.',
    ],
  },
  lash: {
    title: 'Nakon lash / brow lifta',
    when: 'Prva 24 sata',
    items: [
      'Ne moči trepavice 24 sata.',
      'Bez maskare i sauna prvog dana.',
      'Ne spavaj licem u jastuk prvu noć.',
      'Od drugog dana ulje za trepavice svaku večer.',
    ],
  },
};

/* ---------- Demo podaci ---------- */

export const DEMO_CLIENT = {
  name: 'Ana Horvat',
  phone: '091 234 5678',
  birthday: '14. 3.',
  since: '2026-04-11',
  contraindications: ['Alergija na med (izbjegavati med maske)'],
  notes: 'Osjetljiva koža na potkoljenicama — šećerna pasta, ne vosak.',
};

/* Klijentice za prikaz salonskog ulaza */
export const SALON_CLIENTS = [
  { id: 'ana',    name: 'Ana Horvat',      phone: '091 234 5678', programs: 1, visits: 14, noShows: 0,
    contraindications: ['Alergija na med'], notes: 'Osjetljive potkoljenice — šećerna pasta.' },
  { id: 'ivana',  name: 'Ivana Perić',     phone: '098 111 2233', programs: 1, visits: 6, noShows: 2,
    contraindications: ['Visok krvni tlak — bez saune i RF-a na trbuhu'], notes: 'Dva nedolaska u lipnju. Uključena obvezna akontacija.',
    program: { serviceId: 'limfna-drenaza', total: 10, done: 7, label: 'Obujam bedara', from: 61, to: 58.5 },
    history: [{ serviceId: 'limfna-drenaza', daysAgo: 4 }, { serviceId: 'limfna-drenaza', daysAgo: 11 },
              { serviceId: 'vosak-potkolj', daysAgo: 18 }, { serviceId: 'limfna-drenaza', daysAgo: 25 }] },
  { id: 'marina', name: 'Marina Kovač',    phone: '095 777 8899', programs: 0, visits: 3, noShows: 0,
    contraindications: [], notes: 'Prvi put na dermapenu u svibnju, koža reagirala dobro.',
    history: [{ serviceId: 'dermapen', daysAgo: 9 }, { serviceId: 'hydrafacial', daysAgo: 30 },
              { serviceId: 'classic-lice', daysAgo: 58 }] },
  { id: 'petra',  name: 'Petra Novak',     phone: '092 555 4433', programs: 1, visits: 21, noShows: 0,
    contraindications: ['Trudnoća — bez aparativnih tretmana'], notes: 'Trenutno samo masaže i njega lica.',
    program: { serviceId: 'relax', total: 6, done: 3, label: 'Napetost vrata (1-10)', from: 8, to: 5 },
    history: [{ serviceId: 'relax', daysAgo: 7 }, { serviceId: 'classic-lice', daysAgo: 14 },
              { serviceId: 'relax', daysAgo: 21 }, { serviceId: 'masaza-lica', daysAgo: 35 }] },
];

/* Demo raspored za današnji dan u salonu — termini ostalih klijentica.
   h/m su sat i minuta; termini poštuju kontraindikacije iz kartica
   (Ivana bez RF-a, Petra u trudnoći samo masaže i njega lica). */
export const SALON_DAY = [
  { clientId: 'marina', serviceId: 'hydrafacial',    h: 9,  m: 0 },
  { clientId: 'ivana',  serviceId: 'limfna-drenaza', h: 10, m: 30 },
  { clientId: 'petra',  serviceId: 'relax',          h: 12, m: 0 },
  { clientId: 'marina', serviceId: 'lash-lift',      h: 14, m: 0 },
  { clientId: 'ivana',  serviceId: 'vosak-potkolj',  h: 16, m: 0 },
  { clientId: 'petra',  serviceId: 'classic-lice',   h: 18, m: 30 },
];

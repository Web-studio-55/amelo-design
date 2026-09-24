/* DLM Studio — izbornik, ogledala, pojavljivanje, cijene po duljini kose */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // izbornik na mobitelu
  var hdr = document.getElementById('hdr'), btn = document.getElementById('menu-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      var o = hdr.classList.toggle('otvoren');
      btn.setAttribute('aria-expanded', o);
    });
    document.querySelectorAll('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { hdr.classList.remove('otvoren'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ogledala se pale jedno za drugim
  var og = document.getElementById('ogledala');
  if (og) setTimeout(function () { og.classList.add('upaljeno'); }, reduce ? 0 : 350);

  // pojavljivanje pri skrolanju
  var els = document.querySelectorAll('.pojavi');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (e) { e.classList.add('vidljivo'); });
  } else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('vidljivo'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  // cijene po duljini kose
  var C = window.DLM_CIJENE, tab = document.getElementById('tab-cijene');
  if (!C || !tab) return;
  var PRIKAZ = [
    ['sisanje', 'Pranje, šišanje i frizura'],
    ['boja', 'Bojanje, pranje i frizura'],
    ['boja', 'Bojanje, pranje, šišanje i frizura'],
    ['boja', 'Pramenovi, pranje, šišanje i frizura'],
    ['boja', 'Balayage / airtouch'],
    ['njega', 'Keratinsko zaglađivanje'],
  ];
  var OPIS = ['do brade', 'do ramena', 'ispod ramena'];
  var DNO = [80, 104, 142];
  var kosaD = function (y) { return 'M30 50C30 22 45 12 60 12s30 10 30 38V' + (y - 6) + 'c-9 5-19 7-30 7s-21-2-30-7Z'; };
  var eur = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var find = function (k, n) { return (C[k] || []).filter(function (u) { return u.n === n; })[0]; };
  var dno = tab.querySelector('.dno');

  function pokazi(d) {
    tab.querySelectorAll('.red').forEach(function (r) { r.remove(); });
    PRIKAZ.forEach(function (p) {
      var u = find(p[0], p[1]); if (!u) return;
      var c = Array.isArray(u.c) ? u.c[d] : u.c;
      var r = document.createElement('div'); r.className = 'red';
      r.innerHTML = '<span></span><b></b>';
      r.firstChild.textContent = u.n; r.lastChild.textContent = eur(c);
      tab.insertBefore(r, dno);
    });
    document.querySelectorAll('.prekidac button').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.d === d); });
    var k = document.getElementById('kosa'); if (k) k.setAttribute('d', kosaD(DNO[d]));
    var o = document.getElementById('dulj-opis'); if (o) o.textContent = OPIS[d];
  }
  document.querySelectorAll('.prekidac button').forEach(function (b) {
    b.addEventListener('click', function () { pokazi(+b.dataset.d); });
  });
  pokazi(1);
})();

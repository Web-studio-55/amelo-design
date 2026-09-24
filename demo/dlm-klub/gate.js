/* Zaštita lozinkom dok je stranica prijedlog (kao kod Gooze, Botuna i Cataleye).
   NIJE prava sigurnost — lozinka je vidljiva u izvornom kodu.
   Služi da slučajni posjetitelj ne vidi prijedlog prije vlasnika.
   Za javnu objavu: obrisati <script src=".../gate.js"> i noindex meta tag. */
(function () {
  var KEY = 'dlm_ok', PASS = 'dlm2026';
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) {}

  var css = document.createElement('style');
  css.textContent =
    'html.zakljucano body > *:not(.gate){display:none !important}' +
    'html.zakljucano body{background:#1E1B19}' +
    '.gate{position:fixed;inset:0;z-index:300;display:grid;place-items:center;background:#1E1B19;padding:1.5rem;' +
      'font-family:"Jost","Avenir Next","Helvetica Neue",Arial,sans-serif}' +
    '.gate form{width:min(23rem,100%);text-align:center;color:#F3EEE6;display:flex;flex-direction:column;align-items:center;gap:.9rem}' +
    '.gate svg{width:2.6rem;height:2.6rem}' +
    '.gate .nad{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:#C9A261;margin:0}' +
    '.gate .ime{font-family:"Bodoni Moda","Didot",serif;font-size:2.4rem;letter-spacing:.12em;margin:0;line-height:1}' +
    '.gate .pod{font-size:.62rem;letter-spacing:.3em;text-transform:uppercase;color:#B9AFA3;margin:-.5rem 0 .6rem}' +
    '.gate .txt{font-size:.92rem;color:#B9AFA3;margin:0}' +
    '.gate input{width:100%;padding:.85rem 1rem;border-radius:99px;border:1px solid rgba(243,238,230,.25);' +
      'background:transparent;color:#F3EEE6;font:inherit;text-align:center}' +
    '.gate input:focus{outline:none;border-color:#C9A261}' +
    '.gate .err{color:#E8A0A0;font-size:.85rem;margin:0}' +
    '.gate button{width:100%;padding:.85rem 1rem;border:0;border-radius:99px;background:#C9A261;color:#1E1B19;' +
      'font:500 .95rem/1 inherit;letter-spacing:.04em;cursor:pointer}' +
    '.gate button:hover{background:#DDB876}';
  document.head.appendChild(css);
  document.documentElement.classList.add('zakljucano');

  function build() {
    var gate = document.createElement('div');
    gate.className = 'gate';
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4c9 12 16 21 16 32a16 16 0 0 1-32 0C16 25 23 16 32 4z" fill="#C9A261"/>' +
      '<path d="M32 20c4.6 6.6 8.4 11.7 8.4 17.8a8.4 8.4 0 0 1-16.8 0C23.6 31.7 27.4 26.6 32 20z" fill="#1E1B19"/></svg>' +
      '<p class="nad">Prijedlog · Amelo Design</p>' +
      '<p class="ime">DLM</p><p class="pod">Studio</p>' +
      '<p class="txt">Stranica je u pripremi. Za pregled upišite lozinku.</p>' +
      '<input type="password" placeholder="Lozinka" aria-label="Lozinka">' +
      '<p class="err" hidden>Pogrešna lozinka.</p>' +
      '<button type="submit">Uđi</button></form>';
    document.body.appendChild(gate);

    var form = gate.querySelector('form'), input = gate.querySelector('input'), err = gate.querySelector('.err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value.trim().toLowerCase() !== PASS) { err.hidden = false; input.value = ''; input.focus(); return; }
      try { sessionStorage.setItem(KEY, '1'); } catch (x) {}
      document.documentElement.classList.remove('zakljucano');
      gate.remove();
    });
    input.focus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();

/* Infobulles « i » : un clic (ou un appui) ouvre une courte explication,
   avec un lien vers la section correspondante de la page d'aide. */
(function () {
  "use strict";
  const TXT = window.AIDE_TXT || {};
  const bulle = document.createElement("div");
  bulle.className = "bulle";
  bulle.id = "bulle";
  bulle.setAttribute("role", "dialog");
  bulle.hidden = true;
  document.body.appendChild(bulle);
  let ouvert = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function placer() {
    if (!ouvert) return;
    const r = ouvert.getBoundingClientRect();
    const w = Math.min(320, innerWidth - 32);
    bulle.style.width = w + "px";
    let x = r.left + r.width / 2 - w / 2;
    x = Math.max(16, Math.min(x, innerWidth - w - 16));
    const h = bulle.offsetHeight;
    let y = r.bottom + 8;
    if (y + h > innerHeight - 8 && r.top - h - 8 > 8) y = r.top - h - 8;
    bulle.style.left = x + scrollX + "px";
    bulle.style.top = y + scrollY + "px";
    bulle.style.setProperty("--fleche", (r.left + r.width / 2 - x) + "px");
    bulle.classList.toggle("dessus", y < r.top);
  }

  function fermer(rendreFocus) {
    if (!ouvert) return;
    ouvert.setAttribute("aria-expanded", "false");
    if (rendreFocus) ouvert.focus();
    ouvert = null;
    bulle.hidden = true;
  }

  function ouvrir(b) {
    const t = TXT[b.dataset.info];
    if (!t) return;
    if (ouvert) ouvert.setAttribute("aria-expanded", "false");
    ouvert = b;
    b.setAttribute("aria-expanded", "true");
    b.setAttribute("aria-controls", "bulle");
    bulle.setAttribute("aria-label", t.titre);
    bulle.innerHTML = `<p class="bulle-titre">${esc(t.titre)}</p><p>${esc(t.txt)}</p>`
      + (t.ancre ? `<a href="aide.html#${t.ancre}">En savoir plus</a>` : "");
    bulle.hidden = false;
    placer();
  }

  document.addEventListener("click", e => {
    const b = e.target.closest(".info");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      if (ouvert === b) fermer(); else ouvrir(b);
      return;
    }
    if (ouvert && !bulle.contains(e.target)) fermer();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && ouvert) fermer(true); });
  addEventListener("resize", placer);

  window.BULLES = { fermer: () => fermer() };
})();

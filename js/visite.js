/* Visite guidée : éclaire une zone à la fois et l'explique.
   Proposée une fois à la première visite ; relançable par le bouton « Visite guidée ». */
(function () {
  "use strict";
  const TXT = window.AIDE_TXT || {};
  const $ = s => document.querySelector(s);
  const CLE = "osgild-loot:visite";
  const reduit = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Les cartes du tirage d'exemple */
  const carteMagique = () => [...document.querySelectorAll("#sortie .item")]
    .find(it => { const s = it.querySelector(".sceau"); return s && !s.matches(".or, .equip, .conso, .exo"); })
    || [...document.querySelectorAll("#sortie .item")].find(it => !it.querySelector(".sceau.or, .sceau.equip"));

  const ETAPES = [
    { cle: "niveau", cibles: () => [$("#niveau").closest(".field"), $('input[name="cadre"]').closest(".field")], titre: "Niveau et cadre" },
    { cle: "mode", cibles: () => [$('input[name="mode"]').closest(".field")] },
    { cle: "source", cibles: () => [$("#source").closest(".field"), $('input[name="ampleur"]').closest(".field")], titre: "Source et ampleur",
      avant: () => { const r = $('input[name="mode"][value="rencontre"]'); if (!r.checked) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); } },
      txt: () => TXT.source.txt + " " + TXT.ampleur.txt },
    { cle: "menace", cibles: () => [$("#f-menace"), $("#nc").closest(".field"), $('input[name="exotiques"]').closest(".field")], titre: "Menace, NC et objets exotiques",
      txt: () => TXT.menace.txt + " Un NC précis, s'il est saisi, la remplace. Les objets exotiques sont désactivés par défaut." },
    { cle: "lancer", cibles: () => [$("#cible"), $(".go")] },
    { cle: "carteArgent", cibles: () => { const c = $("#sortie .item"); return c ? [c.querySelector(".sceau"), c.querySelector(".item-effets"), c.querySelector(".item-trouv")] : []; }, avant: exemple },
    { cle: "carteObjet", cibles: () => { const c = carteMagique(); return c ? [c.querySelector(".sceau"), c.querySelector(".item-body > .item-nom"), c.querySelector(".item-effets"), c.querySelector(".item-foot")] : []; } },
    { cle: "identification", cibles: () => { const c = carteMagique(); const d = c && c.querySelector(".ident:not([hidden])"); return d ? [d] : []; },
      avant: () => { const c = carteMagique(); const d = c && c.querySelector(".ident"); if (d && !d.hidden) d.open = true; } },
    { cle: "histoire", cibles: () => { const c = carteMagique(); const b = c && (c.querySelector(".histoire") || c.querySelector(".item-lore:not([hidden])")); return b ? [b] : []; } },
    { cle: "actions", cibles: () => [$(".results-head")] }
  ];

  let i = 0, actif = false, cibles = [];
  let voile, trou, panneau;

  function construire() {
    voile = document.createElement("div");
    voile.className = "visite-voile";
    trou = document.createElement("div");
    trou.className = "visite-trou";
    panneau = document.createElement("div");
    panneau.className = "visite-panneau";
    panneau.setAttribute("role", "dialog");
    panneau.setAttribute("aria-modal", "true");
    panneau.setAttribute("aria-labelledby", "visite-titre");
    panneau.innerHTML = `<p class="visite-compte"></p><h2 id="visite-titre"></h2><p class="visite-txt"></p>
      <p class="visite-plus"><a target="_blank" rel="noopener">En savoir plus dans l'aide</a></p>
      <div class="visite-nav">
        <button type="button" class="ghost small" data-v="quitter">Quitter</button>
        <span><button type="button" class="ghost small" data-v="prec">Précédent</button>
        <button type="button" class="ghost small primaire" data-v="suiv">Suivant</button></span>
      </div>`;
    panneau.addEventListener("click", e => {
      const b = e.target.closest("[data-v]");
      if (!b) return;
      if (b.dataset.v === "quitter") fin();
      else if (b.dataset.v === "prec") aller(i - 1);
      else if (i === ETAPES.length - 1) fin(); else aller(i + 1);
    });
    document.body.append(voile, trou, panneau);
  }

  /* Tirage d'exemple : fin d'aventure dans une tour de sorcier, objet majeur garanti */
  function exemple() {
    const f = $("#form");
    if (document.querySelector("#sortie .item") && f.dataset.visite === "1") return attendre(0);
    const coche = (n, v) => { const r = f.querySelector(`input[name="${n}"][value="${v}"]`); if (r) r.checked = true; };
    coche("mode", "rencontre"); coche("ampleur", "fin");
    f.source.value = "sorcier";
    if ((parseInt(f.niveau.value, 10) || 1) < 3) f.niveau.value = 5;
    f.dispatchEvent(new Event("change", { bubbles: true }));
    f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event("submit", { cancelable: true }));
    f.dataset.visite = "1";
    return attendre(reduit() ? 50 : 650);
  }
  function attendre(ms) { return new Promise(r => setTimeout(r, ms)); }

  function rect() {
    const rs = cibles.filter(Boolean).map(c => c.getBoundingClientRect()).filter(r => r.width || r.height);
    if (!rs.length) return null;
    const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top));
    const rr = Math.max(...rs.map(r => r.right)), b = Math.max(...rs.map(r => r.bottom));
    return { left: l, top: t, right: rr, bottom: b, width: rr - l, height: b - t };
  }

  function placer() {
    if (!actif) return;
    const r = rect(), m = 8;
    if (r) {
      Object.assign(trou.style, { left: r.left - m + "px", top: r.top - m + "px", width: r.width + 2 * m + "px", height: r.height + 2 * m + "px" });
      trou.hidden = false;
    } else trou.hidden = true;
    const w = Math.min(360, innerWidth - 32);
    panneau.style.width = w + "px";
    const h = panneau.offsetHeight;
    panneau.classList.remove("bas");
    let x, y;
    if (!r || innerWidth < 640) {
      // petit écran : panneau ancré en bas, la cible au-dessus
      panneau.classList.add("bas");
      x = 16; y = innerHeight - h - 12;
      panneau.style.width = innerWidth - 32 + "px";
    } else if (r.right + m + 16 + w < innerWidth - 16) { x = r.right + m + 16; y = r.top; }
    else if (r.bottom + m + 12 + h < innerHeight) { x = r.left; y = r.bottom + m + 12; }
    else if (r.top - m - 12 - h > 0) { x = r.left; y = r.top - m - 12 - h; }
    else { x = r.left - m - 16 - w; y = r.top; }
    x = Math.max(16, Math.min(x, innerWidth - (panneau.offsetWidth) - 16));
    y = Math.max(12, Math.min(y, innerHeight - h - 12));
    panneau.style.left = x + "px";
    panneau.style.top = y + "px";
  }

  function montrer() {
    const r = rect();
    if (!r) return;
    const petit = innerWidth < 640;
    const haut = petit ? innerHeight - panneau.offsetHeight - 24 : innerHeight;
    if (r.top < 12 || r.bottom > haut - 12) {
      const cible = r.height > haut - 24 ? r.top + scrollY - 12 : r.top + scrollY - (haut - r.height) / 2;
      scrollTo({ top: Math.max(0, cible), behavior: "auto" });
    }
  }

  async function aller(n) {
    if (n < 0 || n >= ETAPES.length) return;
    i = n;
    const e = ETAPES[i], t = TXT[e.cle] || {};
    panneau.classList.add("charge");
    if (e.avant) await e.avant();
    cibles = e.cibles();
    panneau.querySelector(".visite-compte").textContent = `Étape ${i + 1} sur ${ETAPES.length}`;
    panneau.querySelector("#visite-titre").textContent = e.titre || t.titre || "";
    panneau.querySelector(".visite-txt").textContent = e.txt ? e.txt() : t.txt || "";
    const a = panneau.querySelector(".visite-plus a");
    a.href = "aide.html#" + (t.ancre || "");
    panneau.querySelector('[data-v="prec"]').disabled = i === 0;
    panneau.querySelector('[data-v="suiv"]').textContent = i === ETAPES.length - 1 ? "Terminer" : "Suivant";
    panneau.classList.remove("charge");
    placer();
    montrer();
    placer();
    panneau.querySelector('[data-v="suiv"]').focus({ preventScroll: true });
  }

  function debut() {
    if (actif) return;
    if (window.BULLES) window.BULLES.fermer();
    if (!voile) construire();
    fermerInvite();
    actif = true;
    delete $("#form").dataset.visite;
    document.documentElement.classList.add("en-visite");
    voile.hidden = trou.hidden = panneau.hidden = false;
    vu();
    aller(0);
  }

  function fin() {
    if (!actif) return;
    actif = false;
    voile.hidden = trou.hidden = panneau.hidden = true;
    document.documentElement.classList.remove("en-visite");
    delete $("#form").dataset.visite;
    $("#visite").focus({ preventScroll: true });
  }

  function vu() { try { localStorage.setItem(CLE, "1"); } catch (e) { /* stockage indisponible */ } }
  function dejaVu() { try { return localStorage.getItem(CLE) === "1"; } catch (e) { return true; } }

  /* Invitation discrète à la première visite */
  let invite = null;
  function proposer() {
    invite = document.createElement("div");
    invite.className = "invite";
    invite.setAttribute("role", "region");
    invite.setAttribute("aria-label", "Visite guidée");
    invite.innerHTML = `<p>Première fois ici ? Une visite guidée d'une minute montre chaque réglage et comment lire un butin.</p>
      <div><button type="button" class="ghost small primaire" data-i="oui">Faire la visite</button>
      <button type="button" class="ghost small" data-i="non">Non merci</button></div>`;
    invite.addEventListener("click", e => {
      const b = e.target.closest("[data-i]");
      if (!b) return;
      vu();
      if (b.dataset.i === "oui") debut(); else fermerInvite();
    });
    document.body.appendChild(invite);
  }
  function fermerInvite() { if (invite) { invite.remove(); invite = null; } }

  $("#visite").addEventListener("click", debut);
  document.addEventListener("keydown", e => {
    if (!actif) return;
    if (e.key === "Escape") fin();
    else if (e.key === "ArrowRight") aller(i + 1);
    else if (e.key === "ArrowLeft") aller(i - 1);
    else if (e.key === "Tab") {
      // garder le focus dans le panneau
      const f = [...panneau.querySelectorAll("a, button:not([disabled])")];
      const k = f.indexOf(document.activeElement);
      if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  addEventListener("resize", placer);
  addEventListener("scroll", placer, { passive: true });
  if (!dejaVu() && !/[?&]sans-visite/.test(location.search)) proposer();

  window.VISITE = { debut, fin };
})();

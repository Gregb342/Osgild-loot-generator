(function () {
  "use strict";
  const M = window.MOTEUR, T = window.LIVRE, S = window.SOURCES;
  const $ = s => document.querySelector(s);
  const form = $("#form"), sortie = $("#sortie"), tpl = $("#tpl-objet");

  const CATS = {
    hasard: "Au hasard",
    arme: "Arme ou sceptre", defense: "Armure, bouclier, protection", pouvoir: "Objet de pouvoir",
    puissance: "Objet de puissance", competence: "Objet de compétence", baguette: "Baguette",
    grimoire: "Grimoire de pouvoir",
    potion: "Potion", parchemin: "Parchemin", projectiles: "Projectiles magiques"
  };
  const CADRES = { classique: "classique", high: "high fantasy", low: "low fantasy" };

  const store = {
    get(k, def) { try { const v = localStorage.getItem("osgild-loot:" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem("osgild-loot:" + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  function val() {
    const f = new FormData(form);
    return {
      niveau: Math.min(20, Math.max(1, parseInt(f.get("niveau"), 10) || 1)),
      cadre: f.get("cadre"), mode: f.get("mode"), categorie: f.get("categorie") || "hasard",
      nombre: Math.min(8, Math.max(1, parseInt(f.get("nombre"), 10) || 1)),
      source: f.get("source"), ampleur: f.get("ampleur"), menace: f.get("menace"),
      adversaires: Math.min(30, Math.max(1, parseInt(f.get("adversaires"), 10) || 1)),
      nc: f.get("nc") === "" || isNaN(parseFloat(f.get("nc"))) ? "" : Math.max(0, parseFloat(f.get("nc")))
    };
  }

  /* ---------- formulaire ---------- */
  function majCategories(mode) {
    const sel = $("#categorie"), avant = sel.value;
    const liste = ["hasard"].concat(mode === "consommable" ? M.CONSO : M.PERM);
    sel.innerHTML = liste.map(k => `<option value="${k}">${CATS[k]}</option>`).join("");
    if (liste.includes(avant)) sel.value = avant;
  }

  function majForm() {
    const v = val();
    const objets = ["majeur", "mineur", "consommable"].includes(v.mode);
    $("#f-cat").hidden = !objets;
    $("#f-nb").hidden = !objets;
    $("#f-renc").hidden = objets;
    if (objets) majCategories(v.mode);
    const src = S.liste.find(x => x.id === v.source);
    $("#aide-source").textContent = src ? src.aide : "";
    $("#aide-ampleur").textContent = S.ampleur[v.ampleur].aide;
    $("#f-adv").hidden = v.ampleur !== "corps";
    $("#f-menace").classList.toggle("inactif", v.nc !== "");
    $("#f-menace").title = v.nc !== "" ? "Le NC précis remplace la menace" : "";
    $("#nc-effacer").hidden = v.nc === "";
    $("#cible").innerHTML = texteCible(v);
    store.set("form", v);
  }

  function nmTxt(x) { return x === "C" ? "consommables seulement" : x === 0 ? "aucun objet magique" : "niveau de magie " + x; }
  function texteCible(v) {
    if (v.mode === "rencontre") {
      const nc = M.ncRencontre(v.niveau, v.menace, v.nc);
      const maj = M.nmCible(v.niveau, v.cadre, "majeur");
      return `Rencontre <strong>NC ${nc === 0.5 ? "½" : nc}</strong>${v.nc === "" ? "" : " (saisi)"}. Pour des PJ de niveau ${v.niveau} en cadre ${CADRES[v.cadre]}, les objets magiques sont plafonnés : objet majeur <strong>${nmTxt(maj)}</strong>.`;
    }
    const maj = M.nmCible(v.niveau, v.cadre, "majeur"), min = M.nmCible(v.niveau, v.cadre, "mineur");
    const plafond = Math.floor(v.niveau * T.plafondTotal[v.cadre]);
    return `Au niveau ${v.niveau} en cadre ${CADRES[v.cadre]} : objet majeur <strong>${nmTxt(maj)}</strong>, objet mineur <strong>${nmTxt(min)}</strong>. Total porté par PJ : ${plafond} niveaux de magie au plus.`;
  }

  form.addEventListener("click", e => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    const inp = b.parentElement.querySelector("input");
    inp.value = Math.min(+inp.max, Math.max(+inp.min, (parseInt(inp.value, 10) || 0) + +b.dataset.step));
    majForm();
  });
  form.addEventListener("change", majForm);
  form.addEventListener("input", e => { if (e.target.type === "number") majForm(); });

  /* ---------- tirage ---------- */
  let courant = [];

  function tirer(v) {
    if (v.mode === "rencontre") return M.rencontre({ niveau: v.niveau, cadre: v.cadre, source: v.source, ampleur: v.ampleur, menace: v.menace, ncPrecis: v.nc, nombre: v.adversaires });
    const out = [];
    for (let i = 0; i < v.nombre; i++) {
      const o = M.objet({ niveau: v.niveau, cadre: v.cadre, rang: v.mode, categorie: v.categorie });
      if (o) { o.req = { niveau: v.niveau, cadre: v.cadre, rang: v.mode, categorie: v.categorie }; out.push(o); }
    }
    return out;
  }

  function carte(o, idx) {
    const n = tpl.content.firstElementChild.cloneNode(true);
    const sceau = n.querySelector(".sceau"), s = sceau.querySelector("span");
    if (o.bourse) { sceau.classList.add("or"); s.textContent = "or"; }
    else if (o.equip) { sceau.classList.add("equip"); s.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M9.5 17.5 21 6V3h-3L6.5 14.5"/><path d="m11 19-6-6"/><path d="m8 16-4 4"/><path d="m5 21-2-2"/></svg>'; }
    else if (o.consommable || !o.nm) { sceau.classList.add("conso"); s.textContent = "C"; }
    else s.textContent = o.nm;
    sceau.title = o.bourse ? "Argent et valeurs" : o.equip ? "Équipement non magique" : (o.consommable || !o.nm) ? "Consommable : niveau de magie 0" : "Niveau de magie " + o.nm;
    n.querySelector(".item-cat").textContent = o.source ? o.source + ", " + o.ampleur.toLowerCase() : o.cat;
    n.querySelector(".item-nom").textContent = o.nom;
    n.querySelector(".item-effets").innerHTML = o.effets.map(e => `<li>${esc(e)}</li>`).join("");
    if (o.equipement) {
      n.querySelector(".item-equip").innerHTML = o.equipement.map(r => `<li class="eq eq-${r.etat}">
        <p class="eq-nom"><b>${esc(r.nom)}</b>${r.qte > 1 ? " × " + r.qte : ""} <span class="etat">${esc(r.etatLabel)}</span></p>
        ${r.stats ? `<p class="eq-stats">${esc(r.stats)}</p>` : ""}
        <p class="eq-meta">Enc. ${r.arme || r.enc.porte === r.enc.transporte ? r.enc.transporte : r.enc.transporte + " transportée, " + r.enc.porte + " portée"} ; valeur ${M.argent(r.prixU)}${r.qte > 1 ? " pièce" : ""}</p>
      </li>`).join("");
      const vus = [...new Set(o.equipement.map(r => r.etat))].filter(e => e !== "bon");
      const E = window.EQUIPEMENT;
      n.querySelector(".item-legende").innerHTML = vus.map(e => `<li><b>${esc(cap(E.etats[e].label))}</b> : ${esc(E.etats[e].effet)}.</li>`).join("");
    }
    if (o.cat === "Potion") {
      const box = n.querySelector(".item-jet");
      box.hidden = false;
      box.querySelector(".jet-effet").addEventListener("click", () => {
        const r = M.effetSecondaire();
        box.querySelector(".jet-out").innerHTML = `<span class="de">2d6 <i>${esc(r.v)}</i></span> : ${esc(r.txt)}`;
      });
    }
    n.querySelector(".item-rappel").textContent = (o.rappel || []).join(" ");
    n.querySelector(".item-trouv").innerHTML = (o.trouvailles || []).map(e => `<li>${esc(e)}</li>`).join("");
    n.querySelector(".item-notes").innerHTML = (o.notes || []).map(e => `<li>${esc(e)}</li>`).join("");
    n.querySelector(".item-app").textContent = o.apparence || "";
    const permanent = !!o.origineFixe;
    const btnH = n.querySelector(".histoire");
    if (!permanent) btnH.remove();
    if (o.lore) {
      n.querySelector(".item-nom").textContent = o.lore.nom;
      n.querySelector(".item-tech").textContent = o.nom;
      n.querySelector(".item-lore").hidden = false;
      n.querySelector(".lore-glose").textContent = o.lore.glose ? cap(o.lore.glose) + "." : "";
      n.querySelector(".lore-txt").textContent = o.lore.legende.join(" ");
      n.querySelector(".item-orig").innerHTML =
        `<b>Origine (3d10) :</b> ${esc(o.lore.origine.provenance)}, ${esc(o.lore.origine.epoque)}, ${esc(o.lore.origine.peuple)}.`;
      if (btnH) btnH.remove();
      n.querySelector(".lore-version").addEventListener("click", () => majLore(idx, LORE.renommer(o, o.lore)));
      n.querySelector(".lore-origine").addEventListener("click", () => majLore(idx, LORE.histoire(o)));
      n.querySelector(".lore-retirer").addEventListener("click", () => majLore(idx, null));
    } else {
      if (o.candidat) n.querySelector(".item-candidat").textContent = "Objet marquant de cette aventure : il mérite peut-être une histoire.";
      if (btnH) btnH.addEventListener("click", () => majLore(idx, LORE.histoire(o)));
    }
    n.querySelector(".item-alerte").textContent = (o.alertes || []).join(" ");
    const valeur = n.querySelector(".item-val");
    if (o.bourse) n.querySelector(".item-foot").remove();
    else if (o.equip) valeur.innerHTML = o.valeur ? `Valeur totale <b>${M.argent(o.valeur)}</b>, avant marchandage` : "";
    else if (o.valeur) valeur.innerHTML = `Valeur <b>${M.argent(o.valeur)}</b>${o.valeurNote ? " (" + esc(o.valeurNote) + ")" : ""}, revente ${M.argent(o.valeur / 2)} au plus`;
    else valeur.textContent = "Valeur au choix du MJ";
    const rel = n.querySelector(".relancer");
    if (rel && o.req) rel.addEventListener("click", () => relancer(idx));
    else if (rel) rel.remove();
    n.querySelector(".jets ol").innerHTML = (o.log || []).map(l =>
      `<li><span class="de">${l.de ? esc(l.de) + " <i>" + esc(String(l.v)) + "</i>" : ""}</span><span>${esc(l.txt)}</span></li>`).join("");
    return n;
  }

  function afficher(lot, anime) {
    courant = lot;
    sortie.classList.toggle("nouveau", !!anime);
    sortie.innerHTML = "";
    if (!lot.length) { sortie.innerHTML = '<p class="vide">Rien tiré cette fois : relance les dés.</p>'; return; }
    lot.forEach((o, i) => sortie.appendChild(carte(o, i)));
    $("#copier").hidden = false;
  }

  function majLore(i, lore) {
    if (lore) courant[i].lore = lore; else delete courant[i].lore;
    sortie.classList.remove("nouveau");
    sortie.children[i].replaceWith(carte(courant[i], i));
    majEntree();
  }

  function relancer(i) {
    const r = courant[i].req;
    const o = M.objet(r);
    if (!o) return;
    o.req = r;
    if (courant[i].candidat) o.candidat = true;
    courant[i] = o;
    const old = sortie.children[i];
    const n = carte(o, i);
    sortie.classList.remove("nouveau");
    old.replaceWith(n);
    majEntree();
  }

  /* ---------- historique ---------- */
  let courantId = null;
  function sauver(lot) {
    const h = store.get("histo", []);
    courantId = Date.now();
    h.unshift({ id: courantId, t: courantId, titre: resume(val()), lot });
    store.set("histo", h.slice(0, 20));
    majHisto();
  }
  /* Met à jour l'entrée d'historique du butin affiché (relance, histoire) */
  function majEntree() {
    const h = store.get("histo", []);
    const e = h.find(x => (x.id || x.t) === courantId);
    if (!e) return;
    e.lot = courant;
    store.set("histo", h);
    majHisto();
  }
  function resume(v) {
    if (v.mode === "rencontre") {
      const src = S.liste.find(x => x.id === v.source);
      const nc = M.ncRencontre(v.niveau, v.menace, v.nc);
      return `${src ? src.nom : "Rencontre"}, ${S.ampleur[v.ampleur].label.toLowerCase()}, NC ${nc === 0.5 ? "½" : nc}`;
    }
    const quoi = { majeur: "Objet majeur", mineur: "Objet mineur", consommable: "Consommable" }[v.mode] || "Tirage";
    return `${quoi}, niveau ${v.niveau}, ${CADRES[v.cadre]}`;
  }
  function majHisto() {
    const h = store.get("histo", []);
    const ol = $("#histo");
    $("#vider-histo").hidden = !h.length;
    if (!h.length) { ol.innerHTML = "<li>Aucun butin pour l'instant.</li>"; return; }
    ol.innerHTML = h.map((e, i) => `<li><button type="button" data-h="${i}">${esc(e.titre)}</button>
      <small>${new Date(e.t).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })} : ${esc(e.lot.map(o => o.nom).join(", "))}</small></li>`).join("");
  }
  $("#vider-histo").addEventListener("click", () => {
    const n = store.get("histo", []).length;
    if (!confirm(`Supprimer les ${n} butin${n > 1 ? "s" : ""} de l'historique ?`)) return;
    store.set("histo", []);
    majHisto();
    toast("Historique vidé");
  });
  $("#histo").addEventListener("click", e => {
    const b = e.target.closest("[data-h]");
    if (!b) return;
    const h = store.get("histo", []);
    const entree = h[+b.dataset.h];
    afficher(entree.lot, false);
    courantId = entree.id || entree.t;
    sortie.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const lot = tirer(val());
    afficher(lot, true);
    sauver(lot);
    if (innerWidth < 900) $(".results").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });

  /* ---------- copier ---------- */
  function enTexte(lot) {
    return lot.map(o => {
      const l = [`• ${o.lore ? o.lore.nom + ", " + o.nom : o.nom} (${o.source ? o.source + ", " + o.ampleur.toLowerCase() : o.cat}${o.nm ? ", niveau de magie " + o.nm : ""})`];
      o.effets.forEach(e => l.push("  - " + e));
      (o.equipement || []).forEach(r => l.push(`  - ${r.nom}${r.qte > 1 ? " × " + r.qte : ""} (${r.etatLabel})${r.stats ? " : " + r.stats : ""} ; valeur ${M.argent(r.prixU)}`));
      (o.trouvailles || []).forEach(e => l.push("  - " + e));
      (o.notes || []).forEach(e => l.push("  ! " + e));
      if (o.apparence) l.push("  Description : " + o.apparence);
      if (o.lore) {
        if (o.lore.glose) l.push("  " + cap(o.lore.glose));
        l.push("  Légende : " + o.lore.legende.join(" "));
        l.push(`  Origine : ${o.lore.origine.provenance}, ${o.lore.origine.epoque}, ${o.lore.origine.peuple}`);
      }
      if (o.valeur && !o.bourse) l.push("  Valeur : " + M.argent(o.valeur));
      return l.join("\n");
    }).join("\n\n");
  }
  $("#copier").addEventListener("click", async () => {
    const txt = enTexte(courant);
    try { await navigator.clipboard.writeText(txt); toast("Butin copié"); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Butin copié"); } catch (_) { toast("Copie impossible dans ce navigateur"); }
      ta.remove();
    }
  });
  function toast(m) {
    const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = m;
    document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
  }

  /* ---------- petits jets ---------- */

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---------- démarrage ---------- */
  $("#source").innerHTML = S.liste.map(x => `<option value="${x.id}">${esc(x.nom)}</option>`).join("");
  $("#nc-effacer").addEventListener("click", () => { form.nc.value = ""; majForm(); form.nc.focus(); });
  const prev = store.get("form", null);
  if (prev) {
    if (prev.mode === "butin" || prev.mode === "bourse") prev.mode = "rencontre";
    form.niveau.value = prev.niveau || 3;
    ["cadre", "mode", "ampleur", "menace"].forEach(k => { const r = form.querySelector(`input[name="${k}"][value="${prev[k]}"]`); if (r) r.checked = true; });
    form.nombre.value = prev.nombre || 1;
    form.adversaires.value = prev.adversaires || 3;
    form.nc.value = prev.nc === undefined ? "" : prev.nc;
    if (prev.source && S.liste.some(x => x.id === prev.source)) form.source.value = prev.source;
  }
  majForm();
  if (prev && prev.categorie) { $("#categorie").value = prev.categorie; if (!$("#categorie").value) $("#categorie").value = "hasard"; }
  majHisto();
})();

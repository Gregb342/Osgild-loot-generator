/* Page d'aide : tableaux calculés en direct depuis les fichiers de données. */
(function () {
  "use strict";
  const T = window.LIVRE, M = window.MAISON, S = window.SOURCES, X = window.EXOTIQUES, E = window.EQUIPEMENT;
  const $ = s => document.getElementById(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nb = (x, d) => x.toLocaleString("fr-FR", { maximumFractionDigits: d === undefined ? 1 : d });
  const pc = p => { p = Math.min(1, Math.max(0, p)); return p === 0 ? "—" : p >= 1 ? "100 %" : (p < 0.005 ? "< 1" : Math.round(p * 100)) + " %"; };
  function argent(pa) {
    if (pa > 0 && pa < 1) return Math.max(1, Math.round(pa * 10)) * 10 + " pc";
    pa = Math.round(pa);
    if (pa < 100) return pa + " pa";
    const po = Math.floor(pa / 10), r = pa % 10;
    return po.toLocaleString("fr-FR") + " po" + (r ? " " + r + " pa" : "");
  }
  function tableau(id, entetes, lignes, opts) {
    const el = $(id);
    if (!el) return;
    opts = opts || {};
    if (opts.legende) el.insertAdjacentHTML("beforebegin", `<p class="tableau-legende">${opts.legende}</p>`);
    el.innerHTML = `<table${opts.classe ? ` class="${opts.classe}"` : ""}>
      <thead>${entete(entetes)}</thead>
      <tbody>${lignes.map(l => `<tr>${l.map((c, k) => k === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }
  /* en-tête sur une ou deux lignes : un libellé simple de la 1re ligne couvre les deux */
  function entete(e) {
    const deux = Array.isArray(e[0]);
    const r1 = deux ? e[0] : e;
    const l1 = r1.map(h => typeof h === "object" ? `<th colspan="${h.span}" scope="colgroup">${h.t}</th>` : `<th scope="col"${deux ? ' rowspan="2"' : ""}>${h}</th>`).join("");
    const l2 = deux ? e[1].filter(h => h !== "").map(h => `<th scope="col">${h}</th>`).join("") : "";
    return `<tr>${l1}</tr>` + (deux ? `<tr>${l2}</tr>` : "");
  }
  const CADRES = { classique: "Classique", high: "High fantasy", low: "Low fantasy" };

  /* puissance d'un objet majeur */
  tableau("t-puissance", ["Niveau des PJ"].concat(Array.from({ length: 20 }, (_, i) => i + 1)),
    Object.keys(T.puissance).map(c => [CADRES[c]].concat(T.puissance[c])), { classe: "serre", legende: "Niveau de magie d'un objet majeur (un objet mineur : colonne niveau ÷ 2)" });
  $("t-plafond").textContent = "au plus " + Object.keys(T.plafondTotal).map(c => nb(T.plafondTotal[c], 2) + " × son niveau en " + CADRES[c].toLowerCase()).join(", ") + " (en niveaux de magie cumulés).";

  /* sources */
  const exo = id => (X && X.exotisme[id]) || 1;
  tableau("t-sources", [["Source", { t: "Richesse", span: 3 }, "Magie", "Gemmes", "Exotisme"], ["", "corps", "repaire", "fin", "", "", ""]],
    S.liste.map(s => [esc(s.nom), nb(s.richesse.corps, 2), nb(s.richesse.repaire, 2), nb(s.richesse.fin, 2), nb(s.magie, 2), nb(s.gemmes, 2), nb(exo(s.id), 2)]),
    { classe: "num" });

  /* états de l'équipement */
  tableau("t-etats", ["État", "Valeur", "Effet"], Object.keys(E.etats).map(k => {
    const e = E.etats[k];
    return [e.label.charAt(0).toUpperCase() + e.label.slice(1), e.f === null ? "2 × le prix + 10 po" : e.f === 1 ? "prix du livre" : nb(e.f * 100, 0) + " % du prix", esc(e.effet || "aucun")];
  }));

  /* identification : difficultés par NM */
  const nms = [1, 2, 3, 4, 5, 6];
  tableau("t-ident", ["Niveau de magie"].concat(nms), [
    ["Barde (INT)"].concat(nms.map(n => Math.max(5, 25 - 2 * n))),
    ["Maître d'armes (INT)"].concat(nms.map(n => 10 + 2 * n)),
    ["Rang de sort requis"].concat(nms),
    ["Forgesort, potion de ce rang (INT)"].concat(nms.map(n => n <= 5 ? 5 + 5 * n : "—"))
  ], { classe: "num serre", legende: "Difficultés d'identification" });

  /* argent moyen par NC */
  const b = S.bareme, adv = Math.min(2, 0.7 + 0.1 * 3);
  const moy = (a, nc) => b[a].base * Math.pow(nc + 1, b[a].expo) * (a === "corps" ? adv : 1);
  tableau("t-argent", ["NC", "Sur les corps", "Repaire", "Fin d'aventure"],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(nc => [nc, argent(moy("corps", nc)), argent(moy("repaire", nc)), argent(moy("fin", nc))]),
    { classe: "num" });

  /* objets magiques par source */
  const pm = S.magie, fCorps = Math.min(2, 0.5 + 3 / 4);
  const pr = p => Math.min(1, Math.round(p * 100) / 100);
  const consoMoy = m => { const L = 1 + 2 * m; let s = 0; for (let k = 1; k < L; k++) s += (L - k) / L; return s; };
  tableau("t-magie", [["Source", { t: "Sur les corps", span: 2 }, { t: "Repaire", span: 3 }, { t: "Fin d'aventure", span: 3 }],
    ["", "objet", "conso.", "majeur", "mineur", "conso.", "objet garanti", "+ mineur", "conso."]],
    S.liste.map(s => {
      const m = s.magie;
      const maj = pr(pm.repaire.majeur * m);
      return [esc(s.nom),
        pc(pr(pm.corps.mineur * m * fCorps)), pc(pr(0.2 * m * fCorps)),
        pc(maj), pc((1 - maj) * pr(pm.repaire.mineur * m)), nb(consoMoy(m), 1),
        m >= 0.5 ? "majeur" : "mineur", pc(pr(pm.fin.mineur * m)), nb(1 + consoMoy(m), 1)];
    }), { classe: "num" });

  /* catégories */
  const LIB = { arme: "Arme ou sceptre", defense: "Armure, bouclier, protection", pouvoir: "Objet de pouvoir", puissance: "Objet de puissance",
    competence: "Objet de compétence", baguette: "Baguette", grimoire: "Grimoire de pouvoir", potion: "Potion", parchemin: "Parchemin", projectiles: "Projectiles magiques" };
  const parts = poids => { const t = Object.values(poids).reduce((a, x) => a + x, 0); return Object.keys(poids).sort((a, c) => poids[c] - poids[a]).map(k => [LIB[k] || k, pc(poids[k] / t)]); };
  tableau("t-cat-perm", ["Objet permanent", "Chance"], parts(M.poidsPermanents), { classe: "num" });
  tableau("t-cat-conso", ["Consommable", "Chance"], parts(M.poidsConsommables), { classe: "num" });

  /* objets exotiques */
  if (X) {
    const ch = (a, s, f) => Math.min(0.9, X.chance[a] * (f ? X.multiplicateurFrequents : 1) * exo(s.id));
    tableau("t-exo", [["Source", { t: "Rares", span: 3 }, { t: "Fréquents", span: 3 }], ["", "corps", "repaire", "fin", "corps", "repaire", "fin"]],
      S.liste.map(s => [esc(s.nom)].concat([false, true].flatMap(f => ["corps", "repaire", "fin"].map(a => pc(ch(a, s, f)))))),
      { classe: "num" });
    const nEff = X.patrons.reduce((a, p) => a + p.effets.length, 0);
    $("t-nb-exo").textContent = X.patrons.length + " patrons (divinités et puissances) et " + nEff + " effets possibles";
  }
})();

/* Moteur de tirage. Aucune dépendance, aucun réseau. */
(function () {
  "use strict";
  const T = window.LIVRE, M = window.MAISON, V = window.VOIES;

  /* ---------- dés ---------- */
  function d(n) {
    if (window.crypto && crypto.getRandomValues) {
      const a = new Uint32Array(1), lim = Math.floor(0x100000000 / n) * n;
      do { crypto.getRandomValues(a); } while (a[0] >= lim);
      return (a[0] % n) + 1;
    }
    return Math.floor(Math.random() * n) + 1;
  }
  function nd(k, n) { let s = 0; const r = []; for (let i = 0; i < k; i++) { const x = d(n); r.push(x); s += x; } return { s, r }; }
  function lookup(table, v) { for (const row of table) if (v >= row[0] && v <= row[1]) return row; return null; }
  function pickW(weights) {
    const e = Object.entries(weights).filter(([, w]) => w > 0);
    let x = Math.random() * e.reduce((a, [, w]) => a + w, 0);
    for (const [k, w] of e) { if ((x -= w) < 0) return k; }
    return e[e.length - 1][0];
  }
  function any(arr) { return arr[d(arr.length) - 1]; }

  /* Tire sur une table du livre et journalise : « d20 = 12 → … » */
  function roll(log, die, table, label) {
    const v = d(die), row = lookup(table, v);
    log.push({ de: "d" + die, v, txt: label + " : " + texte(row[2]) });
    return { v, row, res: row[2] };
  }
  function texte(r) { return typeof r === "object" && r ? (r.n || "") : String(r); }

  const norm = s => s.replace(/[‑‐]/g, "-").replace(/’/g, "'").toLowerCase();
  function voie(profil, nom) {
    const vs = V[profil] || {};
    const k = Object.keys(vs).find(x => norm(x) === norm(nom));
    return k ? { nom: k, caps: vs[k] } : null;
  }
  function joliVoie(v) { return v.replace(/[‑]/g, "-").replace(/^voie/, "Voie"); }

  /* ---------- calibrage ---------- */
  function nmCible(niveau, cadre, rang) {
    const col = rang === "mineur" ? Math.max(1, Math.floor(niveau / 2)) : niveau;
    return T.puissance[cadre][Math.min(20, Math.max(1, col)) - 1];
  }

  /* ---------- valeurs ---------- */
  function argent(pa) {
    pa = Math.round(pa);
    if (pa < 100) return pa + " pa";
    const po = Math.floor(pa / 10), r = pa % 10;
    return po.toLocaleString("fr-FR") + " po" + (r ? " " + r + " pa" : "");
  }
  const valeurNM = nm => nm * nm * 200 * 10;       // en pa
  const valeurSort = r => r * r * 50;               // en pa

  /* ---------- origine ---------- */
  function origine(log) {
    const o = T.origine, a = d(10), b = d(10), c = d(10);
    log.push({ de: "3d10", v: a + ", " + b + ", " + c, txt: "origine (provenance, époque, peuple)" });
    return { provenance: o.provenance[a - 1], epoque: o.epoque[b - 1], peuple: o.peuple[c - 1] };
  }

  /* ---------- apparences (tables maison) ---------- */
  const A = M.apparence;
  const descFiole = () => cap(any(A.fiole)) + ", au contenu " + any(A.liquide) + ", qui sent " + any(A.odeur) + ".";
  const descObjet = () => "En " + any(A.matiere) + " ; " + any(A.detail) + ".";
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- sorts (parchemins, baguettes) ---------- */
  function tirerSort(log, type) {
    for (let essai = 0; essai < 30; essai++) {
      const vr = roll(log, 20, T.voieParchemin, "voie du sort");
      const [profil, nomVoie] = vr.res;
      const rr = roll(log, 6, T.rangParchemin[type], "rang (objet " + type + ")");
      const rang = rr.res;
      const v = voie(profil, nomVoie);
      const capa = v && v.caps[rang - 1];
      if (capa && capa[1]) {
        log[log.length - 1].txt += " → " + capa[0];
        return { profil, voie: joliVoie(v.nom), rang, sort: capa[0] };
      }
      log.push({ de: "", v: "", txt: (capa ? capa[0] : "?") + " n'est pas un sort : on relance" });
    }
    return null;
  }

  /* ---------- générateurs par catégorie ---------- */
  const G = {};

  G.potion = function (ctx, log) {
    const t = roll(log, 6, T.typePotion, "type de potion").res;
    const sub = T.potions[t];
    const p = roll(log, +sub.de.slice(1), sub.t, "potion " + (t === "soins" ? "de soins" : t)).res;
    return {
      cat: "Potion", nom: "Potion : " + p.n, nm: 0,
      effets: [p.n + " (sort de " + p.p + (p.d ? ", " + p.d : "") + ")", "Boire une potion : action de mouvement."],
      valeur: valeurSort(p.r), valeurNote: "rang " + p.r,
      apparence: descFiole(), consommable: true
    };
  };

  G.parchemin = function (ctx, log) {
    const type = ctx.niveau >= 6 ? "moyen" : "mineur";
    const s = tirerSort(log, type);
    if (!s) return null;
    return {
      cat: "Parchemin", nom: "Parchemin : " + s.sort, nm: 0,
      effets: [s.sort + " (rang " + s.rang + ", " + s.voie + ", " + s.profil + ")",
        "Lisible par les lanceurs de sorts de la même famille. Action limitée."],
      valeur: valeurSort(s.rang), valeurNote: "rang " + s.rang,
      apparence: cap(any(A.parchemin)) + ".", consommable: true
    };
  };

  G.projectiles = function (ctx, log) {
    const muns = T.armesDistance.filter(r => r[3]);
    const m = any(muns);
    const q = d(12), bonus = ctx.niveau >= 8 ? 2 : 1;
    log.push({ de: "d12", v: q, txt: "quantité" });
    return {
      cat: "Projectiles", nom: q + " " + m[2].toLowerCase() + " +" + bonus, nm: 0,
      effets: ["+" + bonus + " en attaque et aux DM, se brisent après usage.",
        "Avec une arme magique, seul le meilleur bonus compte ; le plus faible donne +10 m de portée par point."],
      valeur: null, apparence: descObjet(), consommable: true
    };
  };

  function proprietes(log, table, nm) {
    const out = [], test = d(6);
    log.push({ de: "d6", v: test, txt: test < nm ? "inférieur au niveau de magie : propriété spéciale" : "pas de propriété spéciale" });
    if (test >= nm) return out;
    const r = roll(log, 12, table, "propriété").res;
    if (r.n !== "double") { out.push({ ...r }); return out; }
    const deux = d(2) === 1;
    const simples = table.filter(x => x[2].n !== "double");
    if (deux) {
      const a = any(simples)[2]; let b = any(simples)[2];
      while (b.n === a.n) b = any(simples)[2];
      log.push({ de: "", v: "", txt: "deux propriétés : " + a.n + " et " + b.n });
      out.push({ ...a }, { ...b });
    } else {
      const a = any(simples)[2];
      if (a.sup) { log.push({ de: "", v: "", txt: "effet doublé : " + a.sup.n }); out.push({ ...a.sup }); }
      else {
        log.push({ de: "", v: "", txt: "effet doublé : " + a.n });
        out.push({ ...a, n: a.n + " (doublée)", c: a.c * 2, e: a.e.replace("+1d4°", "+2d4°").replace(" X ", " 2X "), dbl: true });
      }
    }
    return out;
  }

  G.arme = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    const type = roll(log, 6, T.typeArme, "type d'arme").res;
    if (type === "sceptre") {
      const forme = any(["bâton ferré", "baguette d'ébène", "anneau de puissance", "orbe de cristal", "couronne de fer", "sceptre d'os"]);
      const ecole = any(["tous les sorts", "les sorts de feu", "les sorts de froid", "les sorts de foudre", "les sorts de la voie de l'invocation", "les sorts de nécromancie"]);
      return {
        cat: "Sceptre de magie", nom: "Sceptre de magie +" + nm + " (" + forme + ")", nm,
        effets: ["+" + nm + " en attaque magique et aux DM pour " + ecole + ".",
          "Utilisable comme un bâton (1d6) si sa forme le permet."],
        valeur: valeurNM(nm), apparence: descObjet()
      };
    }
    const base = roll(log, 20, type === "contact" ? T.armesContact : T.armesDistance, "arme").row;
    const props = proprietes(log, T.proprietesArme, nm);
    const cout = props.reduce((a, p) => a + p.c, 0);
    const bonus = Math.max(1, nm - cout);
    const total = bonus + cout;
    let nom = base[2] + " +" + bonus + (props.length ? " " + props.map(p => p.n).join(" et ") : "");
    if (base[3]) { const q = d(12); log.push({ de: "d12", v: q, txt: "quantité de projectiles" }); nom = q + " " + nom.toLowerCase(); }
    return {
      cat: "Arme magique", nom, nm: total,
      effets: ["+" + bonus + " en attaque et aux DM."].concat(props.map(p => cap(p.n.replace(/^(de |d')/, "")) + " : " + p.e + ".")),
      valeur: valeurNM(total), apparence: descObjet(), consommable: !!base[3]
    };
  };

  G.defense = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    const base = roll(log, 20, T.armures, "objet de défense").res;
    const props = proprietes(log, T.proprietesArmure, nm);
    const cout = props.reduce((a, p) => a + p.c, 0);
    const bonus = Math.max(1, nm - cout);
    const total = bonus + cout;
    const effets = ["+" + bonus + " en DEF (un seul bonus magique de DEF compte)."];
    if (/Armure|mailles|plaque|cuir/i.test(base)) effets.push("Réduit aussi ses pénalités de " + bonus + ".");
    props.forEach(p => effets.push(cap(p.n.replace(/^(de |d')/, "")) + " : " + p.e.replace(/ 2X /, " 10 ").replace(/ X /, " 5 ") + "."));
    return {
      cat: "Objet de défense", nom: base + " +" + bonus + (props.length ? " " + props.map(p => p.n).join(" et ") : ""), nm: total,
      effets, valeur: valeurNM(total), apparence: descObjet()
    };
  };

  G.pouvoir = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    let rang = roll(log, 8, T.rangPouvoir, "rang du pouvoir").res;
    if (rang > Math.min(5, nm)) { log.push({ de: "", v: "", txt: "plafonné au rang " + Math.min(5, nm) + " (niveau de magie visé)" }); rang = Math.min(5, nm); }
    const profil = roll(log, 20, T.profilPouvoir, "profil du pouvoir").res;
    const voies = Object.entries(V[profil]);
    const [nomVoie, caps] = any(voies);
    const capa = caps[rang - 1];
    return {
      cat: "Objet de pouvoir", nom: "Objet de pouvoir : " + capa[0], nm: rang,
      effets: ["Reproduit " + capa[0] + " (rang " + rang + ", " + joliVoie(nomVoie) + ", " + profil + ").",
        "En général une fois par jour ; activation : action gratuite, ou d'attaque pour un pouvoir offensif.",
        "Suggestion tirée au hasard dans le profil : le MJ valide qu'elle se prête à un objet."],
      valeur: valeurNM(rang), apparence: descObjet()
    };
  };

  G.grimoire = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    const fam = d(2) === 1 ? "profane" : "divine";
    log.push({ de: "d2", v: fam === "profane" ? 1 : 2, txt: "magie " + fam });
    const profils = T.familles[fam].filter(p => Object.values(V[p]).some(c => c.some(x => x[1])));
    const profil = any(profils);
    const sorts = [];
    Object.entries(V[profil]).forEach(([v, c]) => c.forEach((x, i) => { if (x[1]) sorts.push({ n: x[0], r: i + 1, v }); }));
    const cible = nm * 3; let somme = 0; const choix = [];
    for (let g = 0; g < 40 && somme < cible - 1; g++) {
      const reste = cible - somme;
      const ok = sorts.filter(s => s.r <= Math.max(1, reste));
      const s = any(ok.length ? ok : sorts);
      choix.push(s); somme += s.r;
    }
    const total = Math.max(1, Math.round(somme / 3));
    log.push({ de: "", v: "", txt: "sorts tirés au hasard dans le profil " + profil + " jusqu'à " + somme + " rangs" });
    return {
      cat: "Grimoire de pouvoir", nom: "Grimoire de magie " + fam + " (" + profil.toLowerCase() + ")", nm: total,
      effets: ["Sorts inscrits : " + choix.map(s => s.n + " (rang " + s.r + ")").join(", ") + ".",
        "Chaque sort : 1 fois par jour, action limitée, 1 PM. Réservé à la famille " + (fam === "profane" ? "des mages" : "des mystiques") + " (et aux bardes)."],
      valeur: valeurNM(total), apparence: "Un livre relié de " + any(["cuir noir", "peau de serpent", "bois et cuivre", "velours élimé"]) + " ; " + any(A.detail) + "."
    };
  };

  G.puissance = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    const plafond = T.plafondPuissance[ctx.cadre];
    let carac;
    if (nm >= 3) {
      do { carac = roll(log, 12, T.caracPuissance, "caractéristique").res; } while (carac === "relancer");
    } else {
      carac = any(["DR", "PC", "PM", "PV"]);
      log.push({ de: "", v: "", txt: "niveau de magie trop bas pour une caractéristique : objet mineur de puissance (" + carac + ")" });
    }
    if (["DR", "PC", "PM", "PV"].includes(carac)) {
      const pts = { DR: nm, PC: nm, PM: nm * 3, PV: nm * 5 }[carac];
      const forme = { DR: "Pierre de vigueur", PC: "Trèfle d'argent", PM: "Perle de mana", PV: "Amulette de vitalité" }[carac];
      return {
        cat: "Objet de puissance (mineur)", nom: forme + " (+" + pts + " " + carac + ")", nm,
        effets: ["+" + pts + " " + carac + " au porteur."], valeur: valeurNM(nm), apparence: descObjet()
      };
    }
    const bonus = Math.min(plafond, Math.max(1, Math.floor(nm / 3)));
    return {
      cat: "Objet de puissance", nom: T.formePuissance[carac] + " +" + bonus, nm: bonus * 3,
      effets: [carac + " +" + bonus + " (bonus indirect : il se cumule avec les autres objets)."],
      valeur: valeurNM(bonus * 3), apparence: descObjet()
    };
  };

  G.competence = function (ctx, log) {
    const c = any(M.competences);
    log.push({ de: "", v: "", txt: "objet de compétence : " + c[1] });
    return {
      cat: "Objet de compétence", nom: c[0], nm: 1,
      effets: ["+5 aux tests (" + c[1] + ")."], valeur: valeurNM(1), apparence: descObjet()
    };
  };

  G.baguette = function (ctx, log) {
    const type = ctx.nm <= 2 ? "mineur" : "moyen";
    const s = tirerSort(log, type);
    if (!s) return null;
    const ch = nd(2, 20);
    log.push({ de: "2d20", v: ch.r.join(" + ") + " = " + ch.s, txt: "charges" });
    const nm = ch.s >= 30 ? s.rang : Math.floor(s.rang / 2);
    return {
      cat: "Baguette magique", nom: "Baguette : " + s.sort + " (" + ch.s + " charges)", nm,
      effets: [s.sort + " (rang " + s.rang + ", " + s.voie + ", " + s.profil + "), une charge par utilisation.",
        "Lanceurs de sorts de niveau ≥ " + s.rang + " uniquement ; il faut le mot de commande. Activation : action d'attaque."],
      valeur: valeurSort(s.rang) * ch.s, valeurNote: ch.s + " charges", apparence: descObjet()
    };
  };

  const PERM = ["arme", "defense", "pouvoir", "puissance", "competence", "baguette", "grimoire"];
  const CONSO = ["potion", "parchemin", "projectiles"];

  /* ---------- un objet ---------- */
  function objet(opts) {
    const { niveau, cadre, rang } = opts;
    let cat = opts.categorie || "hasard";
    const log = [];
    const cible = rang === "consommable" ? "C" : nmCible(niveau, cadre, rang);
    const alertes = [];
    if (cible === 0 && rang !== "consommable") {
      alertes.push("En cadre low fantasy, le livre ne prévoit pas d'objet magique à ce niveau : consommable tiré à la place.");
    }
    let nm = typeof cible === "number" ? cible : 0;
    const veutPerm = cat !== "hasard" ? PERM.includes(cat) : (typeof cible === "number" && cible > 0);
    if (cat === "hasard") cat = veutPerm ? pickW(M.poidsPermanents) : pickW(M.poidsConsommables);
    if (PERM.includes(cat) && nm < 1) {
      nm = 1;
      alertes.push("Au-dessus de la recommandation du livre pour ce niveau (consommables seulement).");
    }
    const it = G[cat]({ niveau, cadre, nm }, log);
    if (!it) return null;
    it.log = log;
    it.cible = cible;
    it.alertes = alertes;
    if (!it.consommable && it.nm > 0) it.origine = origine(log);
    return it;
  }

  /* ---------- bourse ---------- */
  function bourse(niveau, taille) {
    const b = M.bourse[taille], log = [];
    const r = nd(b.des[0], b.des[1]);
    const pa = r.s * b.parNiveau * niveau;
    log.push({ de: b.des[0] + "d" + b.des[1], v: r.r.join(" + ") + " = " + r.s, txt: "× " + b.parNiveau + " × niveau " + niveau + " = " + pa + " pa" });
    const lignes = [argent(pa) + " en pièces"];
    let total = pa;
    const nbGemmes = taille === "magot" ? Math.max(0, d(4) - 1) : (d(6) === 6 ? 1 : 0);
    if (nbGemmes) log.push({ de: "", v: "", txt: nbGemmes + " gemme(s)" });
    for (let i = 0; i < nbGemmes; i++) {
      const v = Math.min(20, d(20) + Math.floor(niveau / 3));
      const g = lookup(M.gemmes, v);
      log.push({ de: "d20", v, txt: "gemme de " + g[2] + " pa" });
      lignes.push(cap(any(g[3])) + " (" + argent(g[2]) + ")"); total += g[2];
    }
    if (taille === "magot" && d(6) >= 5) {
      const v = Math.min(20, d(20) + Math.floor(niveau / 3));
      const o = lookup(M.objetsArt, v);
      log.push({ de: "d20", v, txt: "objet d'art de " + o[2] + " pa" });
      lignes.push(cap(any(o[3])) + " (" + argent(o[2]) + ")"); total += o[2];
    }
    return { cat: b.label, nom: argent(total) + " au total", nm: null, effets: lignes, log, bourse: true, valeur: total };
  }

  /* ---------- butin complet ---------- */
  function butin(opts) {
    const { niveau, cadre } = opts;
    const out = [bourse(niveau, "magot")];
    const compo = d(6), c = lookup(M.composition, compo)[2];
    const note = { de: "d6", v: compo, txt: { consommables: "consommables seulement", mineur: "un objet mineur et un consommable", majeur: "un objet majeur et des consommables" }[c] };
    out[0].log.push(note);
    const add = (rang, n) => { for (let i = 0; i < n; i++) { const o = objet({ niveau, cadre, rang }); if (o) out.push(o); } };
    if (c === "consommables") add("consommable", d(3));
    else if (c === "mineur") { add("mineur", 1); add("consommable", 1); }
    else { add("majeur", 1); add("consommable", d(2)); }
    return out;
  }

  function effetSecondaire() {
    const r = nd(2, 6), row = lookup(T.effetSecondairePotion, r.s);
    return { v: r.r.join(" + ") + " = " + r.s, txt: row[2] };
  }

  window.MOTEUR = { objet, bourse, butin, origine: () => { const l = []; return origine(l); }, effetSecondaire, nmCible, argent, PERM, CONSO };
})();

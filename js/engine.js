/* Moteur de tirage. Aucune dépendance, aucun réseau. */
(function () {
  "use strict";
  const T = window.LIVRE, M = window.MAISON, V = window.VOIES, F = window.FILTRES;

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
    if (pa > 0 && pa < 1) return Math.max(1, Math.round(pa * 10)) * 10 + " pc";
    pa = Math.round(pa);
    if (pa < 100) return pa + " pa";
    const po = Math.floor(pa / 10), r = pa % 10;
    return po.toLocaleString("fr-FR") + " po" + (r ? " " + r + " pa" : "");
  }
  const valeurNM = nm => nm * nm * 200 * 10;       // en pa
  const valeurSort = r => r * r * 50;               // en pa

  /* ---------- origine ---------- */
  function origine(log, fixe) {
    fixe = fixe || {};
    const o = T.origine, a = d(10), c = d(10);
    let b = d(10);
    const ancienne = fixe.ancienne && b === 1;
    if (ancienne) b = d(9) + 1;
    log.push({ de: "3d10", v: a + ", " + b + ", " + c, txt: "origine (provenance, époque, peuple)" + (ancienne ? " ; époque relancée, l'objet est ancien" : "") });
    return {
      provenance: fixe.provenance || o.provenance[a - 1],
      epoque: o.epoque[b - 1],
      peuple: fixe.peuple || o.peuple[c - 1]
    };
  }

  /* ---------- apparences (tables maison) ---------- */
  const A = M.apparence;
  const descFiole = () => cap(any(A.fiole)) + ", au contenu " + any(A.liquide) + ", qui sent " + any(A.odeur) + ".";
  const descObjet = () => "En " + any(A.matiere) + " ; " + any(A.detail) + ".";
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- sorts (parchemins, baguettes) ---------- */
  /* Voies de sorts admises pour la source (sinon la table du livre) */
  function tableSorts(profils) {
    if (!profils) return null;
    const t = T.voieParchemin.filter(r => profils[r[2][0]]);
    return t.length ? t : null;
  }
  function tirerSort(log, type, profils) {
    const filtre = tableSorts(profils);
    for (let essai = 0; essai < 30; essai++) {
      let profil, nomVoie;
      if (filtre) {
        const w = {}; filtre.forEach((r, i) => { w[i] = profils[r[2][0]]; });
        [profil, nomVoie] = filtre[+pickW(w)][2];
        log.push({ de: "", v: "", txt: "voie du sort, parmi celles qui conviennent à la source : " + joliVoie(nomVoie) });
      } else {
        const vr = roll(log, 20, T.voieParchemin, "voie du sort");
        [profil, nomVoie] = vr.res;
      }
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
    const s = tirerSort(log, type, ctx.profils);
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

  const EXCLUES = new Set((F ? F.exclues : []).map(x => norm(x)));
  const objectable = c => !EXCLUES.has(norm(c[0]));
  function formeVoie(nomVoie) {
    if (!F) return null;
    const k = Object.keys(F.formes).find(x => norm(x) === norm(nomVoie));
    return k ? any(F.formes[k]) : null;
  }

  G.pouvoir = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    let rang = roll(log, 8, T.rangPouvoir, "rang du pouvoir").res;
    if (rang > Math.min(5, nm)) { log.push({ de: "", v: "", txt: "plafonné au rang " + Math.min(5, nm) + " (niveau de magie visé)" }); rang = Math.min(5, nm); }
    let profil, choix = null;
    for (let essai = 0; essai < 20 && !choix; essai++) {
      if (ctx.profils) {
        profil = pickW(ctx.profils);
        log.push({ de: "", v: "", txt: "profil du pouvoir, parmi ceux qui conviennent à la source : " + profil });
      } else profil = roll(log, 20, T.profilPouvoir, "profil du pouvoir").res;
      // capacités du profil reproductibles par un objet, au rang voulu ou en dessous
      for (let r = rang; r >= 1 && !choix; r--) {
        const ok = Object.entries(V[profil]).filter(([, c]) => objectable(c[r - 1]));
        if (ok.length) { const [v, c] = any(ok); choix = { v, capa: c[r - 1], r }; }
      }
      if (!choix) log.push({ de: "", v: "", txt: "rien dans ce profil ne se prête à un objet à ce rang : on relance" });
    }
    if (!choix) return null;
    if (choix.r < rang) log.push({ de: "", v: "", txt: "aucune capacité de rang " + rang + " ne se prête à un objet : rang " + choix.r });
    const ecartees = Object.values(V[profil]).filter(c => !objectable(c[rang - 1])).length;
    if (ecartees) log.push({ de: "", v: "", txt: ecartees + " capacité(s) écartée(s) car elles ne se prêtent pas à un objet" });
    const forme = formeVoie(choix.v);
    const nomForme = forme ? cap(forme) : "Objet de pouvoir";
    return {
      cat: "Objet de pouvoir", nom: nomForme + " : " + choix.capa[0], nm: choix.r,
      effets: ["Reproduit " + choix.capa[0] + " (rang " + choix.r + ", " + joliVoie(choix.v) + ", " + profil + ").",
        "En général une fois par jour ; activation : action gratuite, ou d'attaque pour un pouvoir offensif."],
      valeur: valeurNM(choix.r), apparence: descObjet()
    };
  };

  G.grimoire = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    const lanceurs = p => Object.values(V[p]).some(c => c.some(x => x[1]));
    let fam, profil;
    const admis = ctx.profils ? Object.keys(ctx.profils).filter(p => lanceurs(p) && (T.familles.profane.includes(p) || T.familles.divine.includes(p))) : [];
    if (admis.length) {
      const w = {}; admis.forEach(p => { w[p] = ctx.profils[p]; });
      profil = pickW(w);
      fam = T.familles.profane.includes(profil) ? "profane" : "divine";
      log.push({ de: "", v: "", txt: "grimoire de " + profil.toLowerCase() + ", cohérent avec la source" });
    } else {
      fam = d(2) === 1 ? "profane" : "divine";
      log.push({ de: "d2", v: fam === "profane" ? 1 : 2, txt: "magie " + fam });
      profil = any(T.familles[fam].filter(lanceurs));
    }
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
    const s = tirerSort(log, type, ctx.profils);
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
    if (cat === "hasard") cat = veutPerm ? pickW(opts.poidsPerm || M.poidsPermanents) : pickW(opts.poidsConso || M.poidsConsommables);
    if (PERM.includes(cat) && nm < 1) {
      nm = 1;
      alertes.push("Au-dessus de la recommandation du livre pour ce niveau (consommables seulement).");
    }
    const it = G[cat]({ niveau, cadre, nm, profils: opts.profils }, log);
    if (!it) return null;
    it.log = log;
    it.cible = cible;
    it.alertes = alertes;
    if (!it.consommable && it.nm > 0) it.origine = origine(log, opts.origine);
    return it;
  }

  /* ---------- rencontre ---------- */
  const S = window.SOURCES;
  const fmtNC = nc => (nc === 0.5 ? "½" : String(nc));
  function ncRencontre(niveau, menace, ncPrecis) {
    if (ncPrecis !== null && ncPrecis !== undefined && ncPrecis !== "" && !isNaN(ncPrecis)) return Math.max(0, +ncPrecis);
    return Math.max(0, niveau + S.menace[menace].ecart);
  }
  const pct = p => d(100) <= Math.round(p * 100);
  function melange(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = d(i + 1) - 1; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function valeurs(log, table, nc, quoi) {
    const v = d(8), tot = v + Math.floor(nc / 2), row = lookup(table, tot);
    log.push({ de: "d8", v: v + " + " + Math.floor(nc / 2) + " = " + tot, txt: quoi + " de " + argent(row[2]) });
    return { txt: cap(any(row[3])), pa: row[2] };
  }

  function rencontre(opts) {
    const { niveau, cadre, ampleur } = opts;
    const src = S.liste.find(x => x.id === opts.source) || S.liste[0];
    const sp = src.special || [];
    const saisi = opts.ncPrecis !== null && opts.ncPrecis !== undefined && opts.ncPrecis !== "";
    const nc = ncRencontre(niveau, opts.menace, opts.ncPrecis);
    const n = Math.max(1, opts.nombre || 1);
    const log = [], lignes = [], objets = [], notes = [];
    let total = 0;
    log.push({ de: "", v: "", txt: "NC de la rencontre : " + fmtNC(nc) + (saisi ? " (saisi)" : " (" + S.menace[opts.menace].label.toLowerCase() + ", PJ niveau " + niveau + ")") });

    /* pièces */
    const coef = src.richesse[ampleur];
    if (coef > 0) {
      const b = S.bareme[ampleur];
      let moy = b.base * Math.pow(nc + 1, b.expo) * coef;
      if (ampleur === "corps") moy *= Math.min(2, 0.7 + 0.1 * n);
      const r = nd(2, 6);
      let pa = moy * r.s / 7;
      pa = pa < 1 ? Math.round(pa * 10) / 10 : Math.round(pa);
      log.push({ de: "2d6", v: r.r.join(" + ") + " = " + r.s, txt: "pièces : moyenne " + argent(moy) + ", tirage " + argent(pa) });
      if (pa > 0) {
        lignes.push(argent(pa) + " en pièces" + (sp.includes("cuivre") ? ", surtout du cuivre" : "")
          + (ampleur === "corps" && n > 1 ? ", réparties sur " + n + " adversaires" : ""));
        total += pa;
        if (sp.includes("fausse")) {
          const k = d(6), faux = Math.round(pa * k / 10);
          log.push({ de: "d6", v: k, txt: k * 10 + " % de fausse monnaie" });
          notes.push("Dont " + argent(faux) + " de fausse monnaie. Test de PER difficulté 15 pour la repérer ; une fausse pièce découverte au marché, c'est la milice.");
          total -= faux;
        }
        if (sp.includes("fees")) {
          const k = d(6);
          log.push({ de: "d6", v: k, txt: k <= 3 ? "or des fées" : "les pièces sont réelles" });
          if (k <= 3) { notes.push("Or des fées : ces pièces redeviendront des feuilles mortes à l'aube."); total -= pa; }
        }
        if (sp.includes("ancienne")) notes.push("Monnaie ancienne : un collectionneur ou un sage en donne moitié plus que sa valeur, un changeur moitié moins.");
        if (sp.includes("etrangere")) notes.push("Monnaie des profondeurs : un changeur la reprend avec 25 % de perte, et pose des questions.");
      }
    } else {
      lignes.push(ampleur === "corps" ? "Pas une pièce : ces créatures ne transportent rien." : "Pas de pièces.");
    }

    /* gemmes et objets d'art */
    let nbG = 0, nbA = 0;
    if (ampleur === "corps") { nbG = pct(0.15 * src.gemmes) ? 1 : 0; }
    else {
      nbG = Math.floor(src.gemmes * (d(4) - 1 + nc / 4));
      nbA = (pct(0.35 * src.art) ? 1 : 0) + (nc >= 8 && pct(0.2 * src.art) ? 1 : 0);
      if (ampleur === "fin") { nbG += src.gemmes > 0 ? 1 : 0; nbA += pct(0.5 * src.art) ? 1 : 0; }
    }
    for (let i = 0; i < nbG; i++) { const g = valeurs(log, S.gemmes, nc, "gemme"); lignes.push(g.txt + " (" + argent(g.pa) + ")"); total += g.pa; }
    for (let i = 0; i < nbA; i++) { const a = valeurs(log, S.objetsArt, nc, "objet d'art"); lignes.push(a.txt + " (" + argent(a.pa) + ")"); total += a.pa; }

    /* trouvailles */
    let nbT = ampleur === "corps" ? (coef > 0 ? 1 + (n >= 4 ? 1 : 0) : (d(6) <= 2 ? 1 : 0)) : ampleur === "repaire" ? d(3) : d(3) + 1;
    const trouv = [];
    melange(src.trouvailles).slice(0, nbT).forEach(t => {
      trouv.push(t[0] + (t[1] ? " (" + argent(t[1]) + ")" : ""));
      if (t[1]) total += t[1];
    });
    if (src.composants) {
      const nbC = 1 + (nc >= 5 ? 1 : 0) + (ampleur === "fin" ? 1 : 0);
      melange(src.composants).slice(0, nbC).forEach(c => {
        const v = Math.round(c[1] * (1 + nc / 10));
        trouv.push(c[0] + " (" + argent(v) + ")"); total += v;
      });
      notes.push("Les composants se revendent à un alchimiste ou un artisan, encore faut-il les prélever proprement (test d'INT ou de survie).");
    }
    if (sp.includes("encombrant")) notes.push("Une bonne part de ce butin est encombrante : charrette ou allers-retours à prévoir.");
    if (trouv.length) log.push({ de: "", v: "", txt: trouv.length + " trouvaille(s) tirée(s) dans la liste de la source" });

    const carteArgent = {
      cat: "Argent et objets de valeur", nom: argent(Math.max(0, total)) + " au total", nm: null,
      effets: lignes, trouvailles: trouv, notes, log, bourse: true, valeur: total,
      source: src.nom, ampleur: S.ampleur[ampleur].label
    };

    /* objets magiques */
    const m = src.magie, pm = S.magie[ampleur];
    const fixe = Object.assign({}, src.origine || {}, src.origineAncienne ? { ancienne: true } : {});
    const base = { niveau, cadre, poidsPerm: src.perm, poidsConso: src.conso, origine: fixe, profils: src.profils };
    const rangs = [];
    if (ampleur === "fin") { rangs.push(m >= 0.5 ? "majeur" : "mineur"); if (pct(pm.mineur * m)) rangs.push("mineur"); }
    else if (ampleur === "repaire") { if (pct(pm.majeur * m)) rangs.push("majeur"); else if (pct(pm.mineur * m)) rangs.push("mineur"); }
    else if (pct(pm.mineur * m * Math.min(2, 0.5 + n / 4))) rangs.push("mineur");
    let nbConso = ampleur === "corps" ? (pct(0.2 * m * Math.min(2, 0.5 + n / 4)) ? 1 : 0)
      : (ampleur === "fin" ? 1 : 0) + Math.floor(Math.random() * (1 + 2 * m));
    log.push({ de: "", v: "", txt: rangs.length || nbConso
      ? "magie : " + [rangs.length ? rangs.map(r => "objet " + r).join(", ") : "", nbConso ? nbConso + " consommable(s)" : ""].filter(Boolean).join(" et ")
      : "pas d'objet magique cette fois" });
    rangs.forEach(rang => { const o = objet(Object.assign({ rang }, base)); if (o) { o.req = Object.assign({ rang }, base); objets.push(o); } });
    for (let i = 0; i < nbConso; i++) { const o = objet(Object.assign({ rang: "consommable" }, base)); if (o) { o.req = Object.assign({ rang: "consommable" }, base); objets.push(o); } }

    return [carteArgent].concat(objets);
  }

  function effetSecondaire() {
    const r = nd(2, 6), row = lookup(T.effetSecondairePotion, r.s);
    return { v: r.r.join(" + ") + " = " + r.s, txt: row[2] };
  }

  window.MOTEUR = { objet, rencontre, ncRencontre, SOURCES: window.SOURCES, origine: () => { const l = []; return origine(l); }, effetSecondaire, nmCible, argent, PERM, CONSO };
})();

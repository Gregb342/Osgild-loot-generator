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

  /* ---------- propriétés des armes et armures ----------
     Livre : 1d6 inférieur au niveau de magie → propriété (d12) ; sur 11-12
     (armes) ou 12 (armures) : deux propriétés, effet doublé, ou spécial
     (l'objet accorde une capacité). Règles maison ajoutées :
     - les propriétés se paient sur le niveau de magie, le bonus reste ≥ 1 ;
     - pour un objet majeur, si le d6 échoue, 1 chance sur 2 d'avoir quand
       même une propriété plutôt qu'un bonus nu ;
     - en fin d'aventure, la propriété est garantie. */
  const VOIES_SPECIALES = {
    arme: { Guerrier: ["voie du combat", "voie du maître d’armes"], Barbare: ["voie de la brute", "voie du pourfendeur", "voie de la rage"],
      Chevalier: ["voie de la guerre", "voie du héros"], Voleur: ["voie de l’assassin", "voie du spadassin"], Barde: ["voie de l’escrime"],
      Rôdeur: ["voie du traqueur", "voie du combat à deux armes"], Moine: ["voie du poing", "voie de la maîtrise"] },
    distance: { Rôdeur: ["voie de l’archer", "voie du traqueur"], Arquebusier: ["voie de la précision", "voie du pistolero"], Voleur: ["voie de l’assassin"] },
    // pour les protections : liste fermée de capacités défensives, cherchées dans toutes les voies
    defense: ["Parer un coup", "Défense au bouclier", "Absorber un sort", "Renvoi de sort", "Protéger un allié", "Peau de pierre",
      "Peau d’acier", "Armure de vent", "Résistance à la magie", "Vigilance", "Encaisser un coup", "Ignorer la douleur",
      "Piqûres d’insectes", "Image décalée", "Déphasage", "Cercle de protection", "Armure du mana", "Chute ralentie",
      "Esquive de la magie", "Réflexes félins", "Acrobaties", "Esquive fatale", "Peau d’écorce", "Peau de fer",
      "Parade de projectiles", "Invulnérable", "Bouclier de la foi", "Vêtements sacrés", "Sanctuaire", "Forme éthérée",
      "Interruption du temps", "Mon armure est une arme", "Liberté d’action", "Esquive acrobatique"]
  };
  function capaciteSpeciale(log, genreObj, budget, profils) {
    const table = VOIES_SPECIALES[genreObj];
    const max = Math.min(5, budget);
    const cand = [];
    if (Array.isArray(table)) {
      const noms = new Set(table.map(norm));
      Object.entries(V).forEach(([p, vs]) => Object.entries(vs).forEach(([nv, caps]) => caps.forEach((c, i) => {
        const r = i + 1;
        if (noms.has(norm(c[0])) && r <= max) cand.push({ p, v: nv, c, r, w: (profils && profils[p] ? 3 : 1) * (r >= Math.ceil(max / 2) ? 2 : 1) });
      })));
    }
    else Object.entries(table).forEach(([p, vs]) => vs.forEach(nv => {
      const v = voie(p, nv);
      if (!v) return;
      v.caps.forEach((c, i) => {
        const r = i + 1;
        if (r <= max && r >= Math.ceil(max / 2) && objectable(c) && !/héroïque/i.test(c[0]))
          cand.push({ p, v: v.nom, c, r, w: profils && profils[p] ? 3 : 1 });
      });
    }));
    if (!cand.length) return null;
    const w = {}; cand.forEach((x, i) => { w[i] = x.w; });
    const x = cand[+pickW(w)];
    log.push({ de: "", v: "", txt: "spécial : l'objet accorde " + x.c[0] + " (rang " + x.r + ", " + x.p + ")" });
    return {
      n: "(" + x.c[0] + ")", c: x.r, speciale: true,
      ligne: "Capacité spéciale : accorde " + x.c[0] + " (rang " + x.r + ", " + joliVoie(x.v) + ", " + x.p + ") à son porteur, comme s'il la possédait ; si elle est limitée en usages, 1 fois par jour."
    };
  }

  function proprietes(log, table, nm, opts) {
    opts = opts || {};
    const out = [], budget = nm - 1;
    const test = d(6);
    let ok = test < nm;
    log.push({ de: "d6", v: test, txt: ok ? "inférieur au niveau de magie : propriété spéciale" : "pas de propriété spéciale selon le livre" });
    if (!ok && opts.garantie && budget >= 1) { ok = true; log.push({ de: "", v: "", txt: "propriété garantie : récompense de fin d'aventure" }); }
    if (!ok && opts.majeur && budget >= 1 && d(2) === 1) { ok = true; log.push({ de: "d2", v: 1, txt: "objet majeur : une propriété plutôt qu'un bonus nu" }); }
    if (!ok || budget < 1) {
      if (ok) log.push({ de: "", v: "", txt: "niveau de magie trop bas pour payer une propriété" });
      return out;
    }
    const simples = table.filter(x => x[2].n !== "double").map(x => x[2]);
    const abordables = simples.filter(p => p.c <= budget);
    if (opts.garantie && d(3) === 1) {
      const sp = capaciteSpeciale(log, opts.genre, budget, opts.profils);
      if (sp) { out.push(sp); return out; }
    }
    const r = roll(log, 12, table, "propriété").res;
    if (r.n !== "double") {
      if (r.c <= budget) { out.push({ ...r }); return out; }
      const p = any(abordables);
      log.push({ de: "", v: "", txt: r.n + " coûte trop cher pour ce niveau de magie : " + p.n + " à la place" });
      out.push({ ...p });
      return out;
    }
    const mode = d(3);
    log.push({ de: "d3", v: mode, txt: ["deux propriétés", "effet doublé", "spécial : une capacité"][mode - 1] });
    if (mode === 3) {
      const sp = capaciteSpeciale(log, opts.genre, budget, opts.profils);
      if (sp) { out.push(sp); return out; }
    }
    if (mode === 1) {
      const a = any(abordables);
      const reste = simples.filter(p => p.n !== a.n && p.c <= budget - a.c);
      if (reste.length) {
        const b = any(reste);
        log.push({ de: "", v: "", txt: "deux propriétés : " + a.n + " et " + b.n });
        out.push({ ...a }, { ...b });
        return out;
      }
    }
    const dbl = simples.filter(p => (p.sup ? p.sup.c : p.c * 2) <= budget);
    if (dbl.length) {
      const a = any(dbl);
      if (a.sup) { log.push({ de: "", v: "", txt: "effet doublé : " + a.sup.n }); out.push({ ...a.sup }); return out; }
      log.push({ de: "", v: "", txt: "effet doublé : " + a.n });
      const intense = /^fléau/.test(a.n) ? "grand " + a.n : /^(affûtée|mobile)$/.test(a.n) ? "très " + a.n : a.n + " intense";
      out.push({ ...a, n: intense, c: a.c * 2, e: a.e.replace("+1d4°", "+2d4°").replace(" X ", " 2X "), dbl: true });
      return out;
    }
    const p = any(abordables);
    log.push({ de: "", v: "", txt: "budget trop juste : une seule propriété, " + p.n });
    out.push({ ...p });
    return out;
  }

  /* Arme ou armure de base tirée dans l'équipement de la source (70 %), sinon table du livre */
  function baseSource(log, kitNom, quoi) {
    if (!kitNom || !E || !E.kits[kitNom] || d(10) > 7) return null;
    const kit = E.kits[kitNom];
    const pool = quoi === "arme" ? Object.assign({}, kit.armes, kit.distance || {})
      : Object.assign({}, kit.armures, kit.bouclier ? (kit.boucliers || { "Petit bouclier": 1, "Grand bouclier": 1 }) : {});
    if (!Object.keys(pool).length) return null;
    const nom = pickW(pool);
    log.push({ de: "", v: "", txt: (quoi === "arme" ? "arme" : "protection") + " de base tirée dans l'équipement de la source : " + nom.toLowerCase() });
    return nom;
  }
  const lanceurDans = profils => !!profils && Object.keys(profils).some(p => ["Ensorceleur", "Magicien", "Sorcier", "Forgesort", "Druide", "Prêtre"].includes(p));

  G.arme = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    let type = roll(log, 6, T.typeArme, "type d'arme").res;
    if (type === "sceptre" && ctx.profils && !lanceurDans(ctx.profils)) {
      type = "contact";
      log.push({ de: "", v: "", txt: "pas de lanceur de sorts dans cette source : arme de contact plutôt qu'un sceptre" });
    }
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
    const tableArmes = type === "contact" ? T.armesContact : T.armesDistance;
    let base;
    const src = baseSource(log, ctx.kit, "arme");
    if (src) base = [0, 0, src];
    else {
      base = roll(log, 20, tableArmes, "arme").row;
      if (base[3] && ctx.rang !== "consommable") {
        const sans = tableArmes.filter(r => !r[3] && !/^Autre/.test(r[2]));
        base = any(sans);
        log.push({ de: "", v: "", txt: "des munitions ne font pas un objet permanent : " + base[2].toLowerCase() + " à la place" });
      }
      if (/^Autre arme/.test(base[2])) {
        const autres = type === "contact" ? ["Épieu", "Fléau", "Fléau à deux mains", "Marteau", "Pique", "Lance", "Stylet", "Gourdin"]
          : ["Arc long", "Couteaux de lancer", "Arbalète lourde", "Arbalète de poing", "Javelot"];
        const choix = any(autres);
        log.push({ de: "", v: "", txt: "« autre arme » : " + choix.toLowerCase() + ", tirée parmi les armes absentes de la table" });
        base = [0, 0, choix];
      }
    }
    const cb = cat_(base[2]);
    const distance = cb && cb.arme && !!cb.a.portee && !/se lance/.test(cb.a.notes || "");
    const props = proprietes(log, T.proprietesArme, nm, { majeur: ctx.rang === "majeur", garantie: ctx.garantie, genre: distance ? "distance" : "arme", profils: ctx.profils });
    const cout = props.reduce((a, p) => a + p.c, 0);
    const bonus = Math.max(1, nm - cout);
    const total = bonus + cout;
    let nom = base[2] + " +" + bonus + (props.length ? " " + props.map(p => p.n).join(" et ") : "");
    if (base[3]) { const q = d(12); log.push({ de: "d12", v: q, txt: "quantité de projectiles" }); nom = q + " " + nom.toLowerCase(); }
    const lignesBase = cb && cb.arme ? ["Arme de base : " + statsArme(cb.a, "bon") + "."] : [];
    return {
      cat: "Arme magique", nom, nm: total,
      effets: lignesBase.concat(["+" + bonus + " en attaque et aux DM."]).concat(props.map(p => p.ligne || (cap(p.n.replace(/^(de |d')/, "")) + " : " + p.e + "."))),
      valeur: valeurNM(total), apparence: descObjet(), consommable: !!base[3]
    };
  };

  G.defense = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    const base = baseSource(log, ctx.kit, "defense") || roll(log, 20, T.armures, "objet de défense").res;
    const props = proprietes(log, T.proprietesArmure, nm, { majeur: ctx.rang === "majeur", garantie: ctx.garantie, genre: "defense", profils: ctx.profils });
    const cout = props.reduce((a, p) => a + p.c, 0);
    const bonus = Math.max(1, nm - cout);
    const total = bonus + cout;
    const cb = cat_(base);
    const effets = cb && !cb.arme ? [statsArmure(cb.a, "bon", bonus) + "."] : [];
    effets.push("+" + bonus + " en DEF (un seul bonus magique de DEF compte).");
    if (/Armure|mailles|plaque|cuir|Cuir|broigne|Tissus/i.test(base)) effets.push("Réduit aussi ses pénalités de " + bonus + ".");
    props.forEach(p => effets.push(p.ligne || (cap(p.n.replace(/^(de |d')/, "")) + " : " + p.e.replace(/ 2X /, " 10 ").replace(/ X /, " 5 ") + ".")));
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

  function unPouvoir(ctx, log, rang) {
    let profil, choix = null;
    for (let essai = 0; essai < 20 && !choix; essai++) {
      if (ctx.profils) {
        profil = pickW(ctx.profils);
        log.push({ de: "", v: "", txt: "profil du pouvoir, parmi ceux qui conviennent à la source : " + profil });
      } else profil = roll(log, 20, T.profilPouvoir, "profil du pouvoir").res;
      for (let r = rang; r >= 1 && !choix; r--) {
        const ok = Object.entries(V[profil]).filter(([, c]) => objectable(c[r - 1]));
        if (ok.length) { const [v, c] = any(ok); choix = { v, capa: c[r - 1], r, profil }; }
      }
      if (!choix) log.push({ de: "", v: "", txt: "rien dans ce profil ne se prête à un objet à ce rang : on relance" });
    }
    if (choix && choix.r < rang) log.push({ de: "", v: "", txt: "aucune capacité de rang " + rang + " ne se prête à un objet : rang " + choix.r });
    return choix;
  }

  G.pouvoir = function (ctx, log) {
    const nm = Math.max(1, ctx.nm);
    let rang;
    if (ctx.rang === "majeur") {
      rang = Math.min(5, nm);
      log.push({ de: "", v: "", txt: "objet majeur : pouvoir de rang " + rang + " (niveau de magie visé " + nm + ")" });
    } else {
      rang = roll(log, 8, T.rangPouvoir, "rang du pouvoir").res;
      if (rang > Math.min(5, nm)) { log.push({ de: "", v: "", txt: "plafonné au rang " + Math.min(5, nm) + " (niveau de magie visé)" }); rang = Math.min(5, nm); }
    }
    const p1 = unPouvoir(ctx, log, rang);
    if (!p1) return null;
    const pouvoirs = [p1];
    // Le livre : le niveau de magie d'un objet à plusieurs pouvoirs est la somme de leurs rangs
    if (ctx.rang === "majeur" && nm - p1.r >= 1) {
      const p2 = unPouvoir({ profils: { [p1.profil]: 1 } }, log, Math.min(5, nm - p1.r));
      if (p2 && p2.capa[0] !== p1.capa[0]) { pouvoirs.push(p2); log.push({ de: "", v: "", txt: "second pouvoir pour atteindre le niveau de magie : " + p2.capa[0] }); }
    }
    const total = pouvoirs.reduce((a, p) => a + p.r, 0);
    const forme = formeVoie(p1.v);
    const nomForme = forme ? cap(forme) : "Objet de pouvoir";
    return {
      cat: "Objet de pouvoir", nom: nomForme + " : " + pouvoirs.map(p => p.capa[0]).join(" et "), nm: total,
      effets: pouvoirs.map(p => "Reproduit " + p.capa[0] + " (rang " + p.r + ", " + joliVoie(p.v) + ", " + p.profil + ").")
        .concat(["En général une fois par jour chacun ; activation : action gratuite, ou d'attaque pour un pouvoir offensif."]),
      valeur: valeurNM(total), apparence: descObjet()
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
    let s = tirerSort(log, type, ctx.profils);
    if (!s) return null;
    // objet majeur ou mineur : un sort du rang visé (une baguette chargée vaut le rang de son sort)
    for (let k = 0; k < 12 && ctx.rang !== "consommable" && ctx.nm <= 5 && s.rang !== ctx.nm; k++) {
      const t = tirerSort([], ctx.nm <= 2 ? "mineur" : "moyen", ctx.profils);
      if (t && Math.abs(t.rang - ctx.nm) < Math.abs(s.rang - ctx.nm)) s = t;
    }
    const ch = nd(2, 20);
    log.push({ de: "2d20", v: ch.r.join(" + ") + " = " + ch.s, txt: "charges" });
    if (ctx.rang !== "consommable" && ch.s < 30 && Math.floor(s.rang / 2) < ctx.nm) {
      ch.s = 29 + d(10);
      log.push({ de: "", v: "", txt: "objet " + ctx.rang + " : chargée à " + ch.s + " pour atteindre le niveau de magie visé" });
    }
    const nm = ch.s >= 30 ? s.rang : Math.floor(s.rang / 2);
    return {
      cat: "Baguette magique", nom: "Baguette : " + s.sort + " (" + ch.s + " charges)", nm,
      effets: [s.sort + " (rang " + s.rang + ", " + s.voie + ", " + s.profil + "), une charge par utilisation.",
        "Lanceurs de sorts de niveau ≥ " + s.rang + " uniquement ; il faut le mot de commande. Activation : action d'attaque."],
      valeur: valeurSort(s.rang) * ch.s, valeurNote: ch.s + " charges", apparence: descObjet()
    };
  };

  /* ---------- objets exotiques (règle maison, hors règles du livre) ---------- */
  function exotique(opts) {
    const X = window.EXOTIQUES;
    if (!X) return null;
    const log = [];
    let patron = opts.patron && X.patrons.find(p => p.id === opts.patron);
    if (patron) log.push({ de: "", v: "", txt: "patron choisi : " + patron.nom });
    else {
      const w = {};
      X.patrons.forEach((p, i) => { w[i] = opts.source ? (p.sources.includes(opts.source) ? 6 : 1) : 1; });
      patron = X.patrons[+pickW(w)];
      log.push({ de: "", v: "", txt: "patron : " + patron.nom + (opts.source && patron.sources.includes(opts.source) ? " (affinité avec la source)" : "") });
    }
    const ef = any(patron.effets);
    const forme = any(ef.f);
    const effets = [ef.t, "Arbitrage : " + ef.a, "Usages : " + ef.u];
    const pCaprice = patron.ton === "fou" || patron.ton === "sombre" ? 0.7 : 0.4;
    let caprice = null;
    if (Math.random() < pCaprice) { caprice = any(X.caprices[patron.ton]); effets.push("Caprice : " + caprice); log.push({ de: "", v: "", txt: "caprice : " + caprice.toLowerCase() }); }
    return {
      cat: "Objet exotique", exotique: true, nom: cap(forme) + " " + ef.n, nm: null,
      patron: { id: patron.id, nom: patron.nom, dom: patron.dom, ton: patron.ton },
      effets, visible: !!ef.v, table: ef.table || null,
      apparence: cap(forme) + " ; " + any(patron.signes) + ".",
      valeur: null, valeurNote: "hors marché",
      alertes: ["Hors règles du livre : objet exotique (règle maison), à arbitrer par le MJ."],
      log, req: { exotique: true, patron: opts.patron || null, source: opts.source || null }
    };
  }

  const PERM = ["arme", "defense", "pouvoir", "puissance", "competence", "baguette", "grimoire"];
  const CONSO = ["potion", "parchemin", "projectiles"];

  /* ---------- un objet ---------- */
  function objet(opts) {
    if (opts.exotique) return exotique(opts);
    const { niveau, cadre, rang } = opts;
    let cat = opts.categorie || "hasard";
    const log = [];
    const cible = rang === "consommable" ? "C" : nmCible(niveau, cadre, rang);
    const alertes = [];
    if (cible === 0 && rang !== "consommable") {
      alertes.push("En cadre low fantasy, le livre ne prévoit pas d'objet magique à ce niveau : consommable tiré à la place.");
    }
    let nm = typeof cible === "number" ? cible : 0;
    if (opts.bonusNM && nm > 0) {
      nm += opts.bonusNM;
      alertes.push("Un niveau de magie au-dessus de la recommandation du livre : récompense d'une fin d'aventure redoutable.");
    }
    const veutPerm = cat !== "hasard" ? PERM.includes(cat) : (typeof cible === "number" && cible > 0);
    if (cat === "hasard") {
      let poids = Object.assign({}, opts.poidsPerm || M.poidsPermanents);
      // un objet majeur doit atteindre le niveau visé : pas d'objet de compétence (toujours niveau 1),
      // ni de petit objet de puissance (PV, PM…) sous le niveau 3
      if (rang === "majeur") { delete poids.competence; if (nm < 3) delete poids.puissance; }
      cat = veutPerm ? pickW(poids) : pickW(opts.poidsConso || M.poidsConsommables);
    }
    if (PERM.includes(cat) && nm < 1) {
      nm = 1;
      alertes.push("Au-dessus de la recommandation du livre pour ce niveau (consommables seulement).");
    }
    const it = G[cat]({ niveau, cadre, nm, rang, profils: opts.profils, kit: opts.kit, garantie: opts.garantie }, log);
    if (!it) return null;
    it.log = log;
    it.cible = cible;
    it.alertes = alertes;
    if (!it.consommable && it.nm > 0) it.origineFixe = opts.origine || {};
    return it;
  }

  /* ---------- équipement non magique ---------- */
  const E = window.EQUIPEMENT;
  function cat_(nom) {
    if (!E) return null;
    const k = nom in E.alias ? E.alias[nom] : nom;
    if (!k) return null;
    if (E.armes[k]) return { k, a: E.armes[k], arme: true };
    if (E.armures[k]) return { k, a: E.armures[k], arme: false };
    return null;
  }
  const signe = x => (x >= 0 ? "+" : "−") + Math.abs(x);
  function statsArme(a, etat) {
    let dm = a.dm;
    if (etat === "abime") dm = a.dm.split("/").map(x => x + "−1").join("/");
    const s = ["DM " + dm + " " + a.type];
    if (a.portee) s.push("portée " + a.portee);
    if (a.notes) s.push(a.notes);
    return s.join(", ");
  }
  function statsArmure(a, etat, bonusMagique) {
    let def = a.def + (bonusMagique || 0);
    if (etat === "abime") def = a.bouclier ? Math.max(1, def - 1) : def - 1;
    const s = ["DEF " + signe(def)];
    if (bonusMagique) s[0] += " (" + signe(a.def) + " de base, " + signe(bonusMagique) + " magique)";
    if (a.agi !== undefined) s.push("AGI max " + signe(a.agi));
    if (a.bouclier && etat === "abime") s.push("se brise au premier coup critique encaissé");
    if (a.notes) s.push(a.notes);
    return s.join(", ");
  }
  function encArmure(a, bonusMagique) {
    if (a.bouclier) return { porte: a.enc, transporte: a.enc };
    const def = a.def;  // l'Atlas retranche le bonus magique : on part de la DEF de base
    return { porte: Math.ceil(def / 2), transporte: def };
  }

  function piece(kit, quoi) {
    const nom = pickW(quoi);
    const etat = pickW(kit.etats);
    return { nom, etat };
  }

  function equipement(src, ampleur, n, nc, log) {
    if (!E) return null;
    const ks = E.kitSource[src.id];
    if (!ks) return null;
    const kit = E.kits[ks.kit];
    const pieces = [];
    if (ampleur === "corps") {
      if (!ks.porte) return ks.note ? { rows: [], notes: [ks.note] } : null;
      for (let i = 0; i < n; i++) {
        pieces.push(piece(kit, kit.armes));
        if (kit.distance && pct(kit.distanceP || 0)) pieces.push(piece(kit, kit.distance));
        if (pct(kit.armure)) pieces.push(piece(kit, kit.armures));
        if (pct(kit.bouclier)) pieces.push(piece(kit, kit.boucliers || { "Petit bouclier": 1, "Grand bouclier": 1 }));
      }
      log.push({ de: "", v: "", txt: "équipement porté par " + n + " adversaire(s) : " + pieces.length + " pièce(s)" });
    } else {
      const nb = d(4) + Math.floor(nc / 3) + (ampleur === "fin" ? 1 : 0);
      log.push({ de: "d4", v: nb, txt: "pièces d'équipement stockées (d4 + NC/3" + (ampleur === "fin" ? " + 1" : "") + ")" });
      const tout = Object.assign({}, kit.armes, kit.distance || {});
      for (let i = 0; i < nb; i++) {
        const r = d(3);
        pieces.push(piece(kit, r <= 2 ? tout : Object.assign({}, kit.armures, kit.bouclier ? (kit.boucliers || { "Petit bouclier": 0.5, "Grand bouclier": 0.5 }) : {})));
      }
    }
    // regroupement
    const map = new Map();
    pieces.forEach(p => { const k = p.nom + "|" + p.etat; map.set(k, (map.get(k) || 0) + 1); });
    const ordreEtat = ["qualite", "bon", "use", "abime", "hs"];
    const rows = [...map.entries()].map(([k, q]) => {
      const [nom, etat] = k.split("|");
      const c = cat_(nom), a = c.a, et = E.etats[etat];
      const prixU = etat === "qualite" ? a.prix * 2 + 100 : a.prix * et.f;
      const enc = c.arme ? { porte: a.enc, transporte: a.enc } : encArmure(a);
      let stats = etat === "hs" ? "" : (c.arme ? statsArme(a, etat) : statsArmure(a, etat));
      if (etat === "qualite") stats += c.arme ? " ; +1 en attaque ou aux DM (au choix, toujours le même)" : " ; pénalité aux tests d'AGI réduite de 1";
      return { nom, qte: q, etat, etatLabel: et.label, etatEffet: etat === "qualite" ? "" : et.effet, stats, prixU, enc, arme: c.arme, ordre: ordreEtat.indexOf(etat) };
    }).sort((x, y) => x.ordre - y.ordre || x.nom.localeCompare(y.nom));
    const notes = [];
    if (kit.taille) notes.push(kit.taille);
    if (ks.note) notes.push(ks.note);
    return { rows, notes };
  }

  /* ---------- monnaie ---------- */
  function monnaie(pa, profil) {
    const parts = (E && E.monnaie[profil]) || { po: 0.3, pa: 0.55, pc: 0.15 };
    let v = Math.round(pa * 10); // en pc
    const unit = { pp: 1000, po: 100, pa: 10, pc: 1 };
    const out = { pp: 0, po: 0, pa: 0, pc: 0 };
    if (v < 10) out.pc = v;
    else {
      const ordre = ["pp", "po", "pa", "pc"];
      ["pp", "po", "pa"].forEach((u, i) => {
        const sh = parts[u] || 0;
        if (!sh || (u === "pp" && v < 2000)) return;
        const reste = ordre.slice(i).reduce((a, x) => a + (parts[x] || 0), 0);
        const n = Math.floor(v * (sh / reste) * (0.75 + Math.random() * 0.5) / unit[u]);
        out[u] = Math.min(n, Math.floor(v / unit[u])); v -= out[u] * unit[u];
      });
      if (parts.pc >= 0.5) out.pc = v;           // les pauvres gardent tout en cuivre
      else { out.pa += Math.floor(v / 10); out.pc = v % 10; }
    }
    const noms = { pp: "pp", po: "po", pa: "pa", pc: "pc" };
    const bouts = ["pp", "po", "pa", "pc"].filter(u => out[u]).map(u => out[u] + " " + noms[u]);
    const txt = bouts.length > 1 ? bouts.slice(0, -1).join(", ") + " et " + bouts[bouts.length - 1] : (bouts[0] || "0 pc");
    const nb = out.pp + out.po + out.pa + out.pc;
    return { out, txt, nb };
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
    let total = 0, poidsPieces = 0;
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
        const mo = monnaie(pa, (E && E.monnaieSource[src.id]) || "commun");
        lignes.push(cap(mo.txt) + (mo.nb > 1 && mo.txt.includes(" ") && /,| et /.test(mo.txt) ? " (" + argent(pa) + " en tout)" : "")
          + (ampleur === "corps" && n > 1 ? ", réparties sur " + n + " adversaires" : ""));
        poidsPieces = mo.nb;
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

    const rappel = ["1 pp = 10 po, 1 po = 10 pa, 1 pa = 10 pc. Les prix du livre sont en pa ; l'or est rare chez les petites gens."];
    if (poidsPieces >= 200) rappel.push(poidsPieces + " pièces : encombrement " + Math.ceil(poidsPieces / 200) + " (200 pièces = 1, règle optionnelle de l'Atlas).");
    const carteArgent = {
      cat: "Argent et objets de valeur", nom: argent(Math.max(0, total)) + " au total", nm: null,
      effets: lignes, trouvailles: trouv, notes, rappel, log, bourse: true, valeur: total,
      source: src.nom, ampleur: S.ampleur[ampleur].label
    };
    const eq = equipement(src, ampleur, n, nc, log);
    let carteEquip = null;
    if (eq && (eq.rows.length || eq.notes.length)) {
      const nbP = eq.rows.reduce((a, r) => a + r.qte, 0);
      const utiles = eq.rows.filter(r => r.etat !== "hs").reduce((a, r) => a + r.qte, 0);
      carteEquip = {
        cat: "Équipement non magique", nom: nbP ? nbP + " pièce" + (nbP > 1 ? "s" : "") + (utiles < nbP ? ", dont " + utiles + " utilisable" + (utiles > 1 ? "s" : "") : "") : "Rien de récupérable",
        nm: null, effets: [], equipement: eq.rows, notes: eq.notes, equip: true,
        rappel: ["Encombrement (règle optionnelle de l'Atlas) : une armure transportée compte pour sa DEF, portée pour la moitié ; seuil du PJ 10 + 2 × FOR."],
        valeur: eq.rows.reduce((a, r) => a + r.prixU * r.qte, 0), source: src.nom, ampleur: S.ampleur[ampleur].label, log: []
      };
    }

    /* objets magiques */
    const m = src.magie, pm = S.magie[ampleur];
    const fixe = Object.assign({}, src.origine || {}, src.origineAncienne ? { ancienne: true } : {});
    const kit = E && E.kitSource[src.id] ? E.kitSource[src.id].kit : null;
    const base = { niveau, cadre, poidsPerm: src.perm, poidsConso: src.conso, origine: fixe, profils: src.profils, kit };
    const redoutable = nc >= niveau + 2;
    const rangs = [];
    if (ampleur === "fin") { rangs.push(m >= 0.5 ? "majeur" : "mineur"); if (pct(pm.mineur * m)) rangs.push("mineur"); }
    else if (ampleur === "repaire") { if (pct(pm.majeur * m)) rangs.push("majeur"); else if (pct(pm.mineur * m)) rangs.push("mineur"); }
    else if (pct(pm.mineur * m * Math.min(2, 0.5 + n / 4))) rangs.push("mineur");
    let nbConso = ampleur === "corps" ? (pct(0.2 * m * Math.min(2, 0.5 + n / 4)) ? 1 : 0)
      : (ampleur === "fin" ? 1 : 0) + Math.floor(Math.random() * (1 + 2 * m));
    log.push({ de: "", v: "", txt: rangs.length || nbConso
      ? "magie : " + [rangs.length ? rangs.map(r => "objet " + r).join(", ") : "", nbConso ? nbConso + " consommable(s)" : ""].filter(Boolean).join(" et ")
      : "pas d'objet magique cette fois" });
    rangs.forEach((rang, i) => {
      const special = ampleur === "fin" && i === 0 && rang === "majeur";
      const req = Object.assign({ rang }, base, special ? { garantie: true, bonusNM: redoutable ? 1 : 0 } : {});
      const o = objet(req);
      if (!o) return;
      o.req = req;
      if (ampleur === "fin" && i === 0 && rang === "majeur" && o.nm > 0 && !o.consommable) o.candidat = true;
      objets.push(o);
    });
    for (let i = 0; i < nbConso; i++) { const o = objet(Object.assign({ rang: "consommable" }, base)); if (o) { o.req = Object.assign({ rang: "consommable" }, base); objets.push(o); } }

    /* objets exotiques, si le MJ les a activés */
    const X = window.EXOTIQUES;
    if (X && opts.exotiques && opts.exotiques !== "jamais") {
      const p = Math.min(0.9, X.chance[ampleur] * (opts.exotiques === "frequents" ? X.multiplicateurFrequents : 1) * (X.exotisme[src.id] || 1));
      const k = d(100);
      log.push({ de: "d100", v: k, txt: "objet exotique si " + Math.round(p * 100) + " ou moins : " + (k <= Math.round(p * 100) ? "oui" : "non") });
      if (k <= Math.round(p * 100)) { const o = exotique({ source: src.id }); if (o) objets.push(o); }
    }
    return [carteArgent].concat(carteEquip ? [carteEquip] : [], objets);
  }

  function effetSecondaire() {
    const r = nd(2, 6), row = lookup(T.effetSecondairePotion, r.s);
    return { v: r.r.join(" + ") + " = " + r.s, txt: row[2] };
  }

  window.MOTEUR = { objet, rencontre, ncRencontre, SOURCES: window.SOURCES, origine: fixe => { const l = []; return origine(l, fixe); }, effetSecondaire, nmCible, argent, PERM, CONSO };
})();

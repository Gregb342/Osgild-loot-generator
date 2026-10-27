/* Identification des objets.

   Trois couches :
   1. Ce qui se voit à l'usage : chaque effet est évident ou caché, avec la
      façon dont les PJ le découvrent (règle maison).
   2. Les indices (objets avec une histoire) : traces de l'origine, sans le nom.
   3. L'identification (règles du livre de base, chapitre « Objets magiques ») :
      - un lanceur de sorts identifie fonction et bonus si le niveau de magie
        ne dépasse pas son plus haut rang de sort (une récupération rapide) ;
      - voie du vagabond (Rumeurs et légendes) : INT, difficulté 25 − 2 × NM ;
      - voie du maître d'armes : estime une arme, INT, difficulté 10 + 2 × NM ;
      - voie des élixirs : identifie une potion, INT, difficulté 5 + 5 × rang ;
      - sinon un sage, « moyennant finance » (prix maison : 10 pa par NM).
      La légende complète ne s'obtient jamais par simple identification. */

(function () {
  "use strict";
  const any = a => a[Math.floor(Math.random() * a.length)];

  /* [motif de l'effet, évident ?, comment les PJ le découvrent, ce qu'ils voient] */
  const REGLES = [
    [/^Capacité spéciale/, false, "Se révèle dans une situation où elle sert, comme une intuition du porteur, ou par identification.", null],
    [/^Arme de base/, true, "C'est une arme : ses caractéristiques de base se voient tout de suite.", null],
    [/en attaque et aux DM\./, false, "Se devine après quelques combats (les coups portent mieux), ou par identification.", null],
    [/^(Très )?[Aa]ffûtée/, false, "Se remarque sur un coup critique particulièrement dévastateur.", null],
    [/DM de feu/, true, "Évident dès le premier coup porté.", "Au premier coup, l'arme s'enflamme."],
    [/DM de froid/, true, "Évident dès le premier coup porté.", "Au premier coup, du givre court sur l'arme."],
    [/DM d'électricité/, true, "Évident dès le premier coup porté.", "Au premier coup, l'arme crépite d'éclairs."],
    [/fléau des/i, false, "Se révèle au premier coup porté contre ce type de créature : l'arme luit ou vibre.", null],
    [/en attaque magique et aux DM/, false, "Un lanceur de sorts sent ses sorts gagner en force en l'utilisant, sans savoir de combien.", "Tenu en main, il picote comme de l'énergie contenue."],
    [/^DEF [+−]/, true, "La protection de base se voit ; le surplus magique se devine en combat (les coups glissent).", null],
    [/en DEF \(un seul bonus/, false, "Se devine en combat, ou par identification.", null],
    [/^Réduit aussi ses pénalités/, true, "Se remarque en l'enfilant : plus légère qu'elle ne devrait.", "Elle est étonnamment légère à porter."],
    [/^D'ombre|discrétion/i, true, "Évident à l'usage : on se fond dans les ombres.", "Elle semble boire la lumière autour d'elle."],
    [/^De natation|natation/i, false, "Se révèle dans l'eau.", null],
    [/^De résistance|retranche .* aux DM/i, false, "Se révèle le jour où l'élément frappe le porteur.", null],
    [/^De défense|RD \d/i, false, "Se devine en combat : les coups font moins mal.", null],
    [/^De protection|coups critiques et des attaques sournoises/i, false, "Se révèle sur un coup critique ou une attaque sournoise.", null],
    [/résister à la magie/i, false, "Se révèle quand un sort frappe le porteur.", null],
    [/^D'action libre|ralenti, immobilisé/i, false, "Se révèle quand une magie tente de l'entraver.", null],
    [/^Mobile|malus d'armure réduit/i, true, "Se remarque en l'enfilant.", "Elle gêne à peine les mouvements."],
    [/^Reproduit /, false, "Caché : il faut le mot de commande, trouvé par identification, en l'entendant utiliser, ou au hasard d'un essai.", null],
    [/une fois par jour|activation/i, null, null, null],
    [/au porteur\.|\(bonus indirect/, false, "Se ressent après quelques heures de port, sans savoir précisément quoi.", "Le porter procure une étrange sensation de bien-être."],
    [/^\+5 aux tests/, false, "Se remarque à l'usage, au fil des tests réussis.", null],
    [/une charge par utilisation/, false, "Caché : il faut le mot de commande, et seule l'identification révèle le sort et les charges.", null],
    [/^Lanceurs de sorts de niveau/, null, null, null],
    [/\(rang \d+, Voie/, false, "Caché : seul un lanceur de sorts de la même famille peut lire le sort.", "Il est couvert de symboles ésotériques."],
    [/^Utilisable comme un bâton/, true, "Évident : il a la forme d'un bâton.", null],
    [/^Sorts inscrits/, false, "Un lanceur de la bonne famille déchiffre les sorts en le lisant (une récupération rapide).", "Les pages sont couvertes de formules dans une écriture serrée."],
    [/^Chaque sort/, null, null, null],
    [/sort de |Boire une potion/, null, null, null],
    [/Lisible par les lanceurs/, null, null, null],
    [/se brisent après usage|seul le meilleur bonus/, null, null, null]
  ];

  function regle(e) { return REGLES.find(r => r[0].test(e)); }

  function perceptions(item) {
    return (item.effets || []).map(e => {
      const r = regle(e);
      if (!r || r[1] === null) return null;
      return { effet: e, evident: r[1], comment: r[2], joueur: r[3] };
    }).filter(Boolean);
  }

  function tests(item) {
    const nm = item.nm || 0, t = [];
    if (item.cat === "Potion") {
      const rang = parseInt((item.valeurNote || "").replace(/\D/g, ""), 10) || 1;
      t.push("Forgesort (voie des élixirs) : test d'INT difficulté " + (5 + 5 * rang) + ", 10 minutes.");
      t.push("Goûter une goutte : le MJ donne un indice (saveur, sensation), sans certitude.");
      return t;
    }
    if (item.cat === "Parchemin") {
      t.push("Un lanceur de sorts de la même famille le lit et reconnaît le sort sans test.");
      return t;
    }
    if (item.consommable || !nm) return t;
    t.push("Lanceur de sorts dont le plus haut rang de sort est " + nm + " ou plus : identifie la fonction et les bonus en une récupération rapide.");
    t.push("Barde (Rumeurs et légendes) : test d'INT difficulté " + Math.max(5, 25 - 2 * nm) + (item.lore ? " ; en cas de réussite, il a entendu parler de l'objet et connaît son nom." : "."));
    if (/Arme/.test(item.cat)) t.push("Maître d'armes : estime sa puissance en la maniant quelques rounds, test d'INT difficulté " + (10 + 2 * nm) + ".");
    t.push("Sinon, un sage capable de l'identifier, contre paiement (suggestion maison : " + 10 * nm + " pa).");
    return t;
  }

  /* ---------- indices pour un objet avec une histoire ---------- */
  const INDICES_PEUPLE = {
    "Humains": ["le poinçon usé d'un atelier, presque illisible", "les restes d'un blason martelé"],
    "Nains": ["des runes naines gravées au poinçon, nettes et profondes", "une finition d'une précision que seul un nain obtient"],
    "Elfes": ["des volutes fines comme des nervures de feuille, de facture elfique", "un métal léger qui ne ternit pas"],
    "Gnomes": ["un mécanisme minuscule dont on ne comprend pas l'usage", "des vis et des rouages là où on ne les attend pas"],
    "Elfes noirs": ["des motifs d'araignée et un métal noir qui absorbe la lumière", "une odeur de pierre humide et de champignon qui ne part pas"],
    "Orcs ou gobelins": ["des encoches de trophée et des dents incrustées", "une facture brutale mais redoutablement solide"],
    "Ange, démon, divinité": ["un symbole sacré effacé à dessein", "une chaleur ou un froid surnaturel au toucher"],
    "Dragons": ["des éraflures de griffes et une odeur de soufre tenace", "des écailles incrustées dans le métal"],
    "Seigneur élémentaire": ["une chaleur, un froid ou une humidité qui ne le quitte jamais", "des veines minérales qui bougent quand on ne les regarde pas"],
    "Autre créature ancienne": ["des signes qui font mal aux yeux quand on les fixe", "une matière qu'aucun artisan ne sait nommer"]
  };
  const INDICES_EPOQUE = {
    "Post Monastir": "un style récent, presque banal",
    "Âges sombres (‑700 à ‑1)": "une facture grossière mais solide, d'un autre temps",
    "Empire d'Osgild": "un aigle impérial à demi effacé",
    "Chute d'Anathazerïn": "un motif d'étoile que plus personne n'utilise, fêlé en son centre",
    "Apogée d'Anathazerïn": "un motif d'étoile que plus personne n'utilise",
    "Apogée des Premiers‑nés": "des proportions étranges, pensées pour une autre race",
    "Corruption post Roi‑Sorcier": "une marque que les anciens crachent en voyant",
    "Époque du Roi‑Sorcier": "une couronne griffue, emblème que l'on croyait détruit",
    "Chute des pierres du ciel": "un métal qu'aucun forgeron ne reconnaît, tombé du ciel",
    "Premier âge": "une usure si ancienne que les arêtes en sont adoucies"
  };

  function indices(item) {
    const L = item.lore;
    if (!L) return [];
    if (L.indices) return L.indices;
    const o = L.origine, nm = item.nm || 1, out = [];
    out.push({ voir: any(INDICES_PEUPLE[o.peuple] || INDICES_PEUPLE["Humains"]), comprendre: "Reconnaître le peuple d'origine : test d'INT difficulté 12." });
    out.push({ voir: INDICES_EPOQUE[o.epoque] || "une facture ancienne", comprendre: "Dater l'objet : test d'INT difficulté " + (15 + Math.floor(nm / 2)) + " (histoire, connaissances)." });
    if (L.glose) {
      const langue = L.glose.replace(/^.*» /, "");
      out.push({ voir: "une courte inscription dans une langue inconnue", comprendre: "C'est son nom, écrit " + langue + ". Le lire : connaître cette langue, ou test d'INT difficulté 20." });
    } else {
      out.push({ voir: "un nom gravé en lettres usées, à moitié effacé", comprendre: "Le déchiffrer : test de PER difficulté 12." });
    }
    return out;
  }

  function legendeComplete(item) {
    if (!item.lore) return "";
    const o = item.lore.origine;
    return "La légende complète ne se révèle pas par identification : il faut un érudit spécialiste du peuple (" + o.peuple.toLowerCase()
      + ") ou de l'époque (" + o.epoque.replace(/[‑]/g, "-") + "), une grande bibliothèque comme celle de Monastir, ou que l'accroche se déclenche en jeu.";
  }

  /* Ce que les PJ ont sous les yeux, sans rien révéler de la magie */
  function forme(item) {
    const n = item.nom || "";
    switch (item.cat) {
      case "Arme magique": case "Objet de défense": return n.replace(/ \+\d.*$/, "");
      case "Sceptre de magie": { const m = n.match(/\(([^)]+)\)/); return m ? m[1] : "un bâton"; }
      case "Objet de pouvoir": return n.split(" : ")[0];
      case "Objet de puissance": case "Objet de puissance (mineur)": case "Objet de compétence":
        return n.split(/ (de |d'|du |des |\+|\()/)[0];
      case "Baguette magique": return "une baguette";
      case "Grimoire de pouvoir": return "un grimoire";
      case "Potion": return "une fiole";
      case "Parchemin": return "un parchemin";
      case "Projectiles": return n.replace(/ \+\d.*$/, "");
      default: return "un objet";
    }
  }

  /* Texte de ce que les PJ perçoivent en trouvant l'objet */
  function texteJoueurs(item) {
    const l = [];
    if (item.equip) {
      (item.equipement || []).forEach(r => l.push(`${r.nom}${r.qte > 1 ? " × " + r.qte : ""} (${r.etatLabel})${r.stats ? " : " + r.stats : ""}`));
      return l.join("\n");
    }
    if (item.bourse) {
      (item.effets || []).forEach(e => l.push(e.replace(/ \(\d[^)]*\)$/, "")));
      (item.trouvailles || []).forEach(t => l.push(t.replace(/ \([^)]*\)$/, "")));
      return l.join("\n");
    }
    const app = (item.lore && item.lore.apparence) || item.apparence;
    if (app) l.push(app);
    perceptions(item).forEach(p => { if (p.joueur) l.push(p.joueur); });
    const base = (item.effets || []).find(e => /^Arme de base/.test(e));
    if (base) l.push(base.replace(/^Arme de base : /, ""));
    const def = (item.effets || []).find(e => /^DEF [+−]/.test(e));
    if (def) {
      const b = def.match(/\(([+−]\d+) de base/);
      l.push(b ? def.replace(/^DEF [+−]\d+ \([^)]*\)/, "DEF de base " + b[1]) : def);
    }
    indices(item).forEach(i => l.push("On remarque " + i.voir + "."));
    return l.join("\n");
  }

  window.IDENT = { perceptions, tests, indices, legendeComplete, texteJoueurs, forme };
})();

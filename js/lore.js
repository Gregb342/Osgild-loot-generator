/* Noms et légendes d'objets (règles maison).

   Fonctionnement :
   1. L'origine est tirée avec la table du livre (3d10 : provenance, époque,
      peuple), en respectant ce que la source impose (elfes noirs, tombeau…).
   2. Un thème est déduit de l'objet lui-même (feu, givre, mort, ombre…), à
      partir de ses propriétés ou de la capacité qu'il reproduit.
   3. Le nom suit un des trois gabarits ci-dessous, avec un « noyau » adapté au
      type d'objet (arme, défense, autre) :
        composé    : Croc-de-Givre
        possessif  : Le Dernier Rempart d'Anathazerïn
        en langue  : Thalendrë (« Larme d'étoile » en elfique)
   4. La légende fait trois phrases : qui l'a fait et quand, comment il a
      voyagé, et une accroche pour le MJ.
   Toutes les listes sont modifiables ici. */

(function () {
  "use strict";
  const any = a => a[Math.floor(Math.random() * a.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const voyelle = s => /^[aeiouyhàâéèêëîïôöûüœæ]/i.test(s);

  const NOYAUX = {
    arme: [["Croc", "m"], ["Lame", "f"], ["Dent", "f"], ["Morsure", "f"], ["Chant", "m"], ["Soupir", "m"], ["Éclat", "m"], ["Fléau", "m"], ["Aiguillon", "m"], ["Colère", "f"]],
    defense: [["Rempart", "m"], ["Égide", "f"], ["Mur", "m"], ["Voile", "m"], ["Écaille", "f"], ["Garde", "f"], ["Bastion", "m"], ["Serment", "m"]],
    objet: [["Œil", "m"], ["Cœur", "m"], ["Souffle", "m"], ["Larme", "f"], ["Sceau", "m"], ["Murmure", "m"], ["Secret", "m"], ["Clé", "f"], ["Veille", "f"]]
  };
  const ADJ = [["Dernier", "Dernière"], ["Premier", "Première"], ["Grand", "Grande"], ["Sombre", "Sombre"], ["Fidèle", "Fidèle"]];

  const THEMES = [
    [/feu|braise|flamme|incendi|explosion/i, ["Braise", "Cendre", "Flamme", "Brasier"]],
    [/froid|givre|gel/i, ["Givre", "Hiver", "Frimas", "Glace"]],
    [/foudre|électricité|tonnerre|tension/i, ["Orage", "Tonnerre", "Éclair"]],
    [/acide/i, ["Rouille", "Venin"]],
    [/morts?\b|outre|tombe|siphon|âme|mortuaire|vampire/i, ["Tombe", "Linceul", "Glas", "Os"]],
    [/dragon/i, ["Wyrm", "Écaille", "Dragon"]],
    [/géant/i, ["Montagne", "Colosse"]],
    [/goblinoïde/i, ["Horde", "Gobelin"]],
    [/démon|succube|abîme/i, ["Abîme", "Soufre"]],
    [/ombre|ténèbre|invisib|discrétion|nuit/i, ["Ombre", "Nuit", "Crépuscule"]],
    [/divination|clairvoyance|prescience|augure/i, ["Présage", "Oracle"]],
    [/soin|récupération|vigueur|régénération|phénix|guérison/i, ["Aube", "Source", "Phénix"]],
    [/foi|divin|sacré|bénédiction|lumière|céleste|prière/i, ["Aube", "Lumière", "Serment"]],
    [/sang|saignement|exsangue/i, ["Sang", "Carmin"]],
    [/végét|arbre|écorce|nature|forêt|ronce/i, ["Ronce", "Chêne", "Sève"]],
    [/\bair\b|vent|vol\b|lévitation|chute|plume/i, ["Vent", "Plume", "Nuée"]],
    [/natation|aquatique/i, ["Marée", "Écume"]],
    [/magie|mana|arcane|sort\b|sorts/i, ["Étoile", "Arcane", "Sceau"]],
    [/affûtée|critique|tranchant/i, ["Rasoir", "Fil"]],
    [/protection|défense|rempart|bouclier|mobile|action libre/i, ["Rempart", "Bastion", "Veille"]]
  ];
  const THEME_PEUPLE = {
    "Humains": ["Couronne", "Serment", "Bannière"], "Nains": ["Enclume", "Roc", "Forge"],
    "Elfes": ["Étoile", "Lune", "Feuille"], "Gnomes": ["Rouage", "Étincelle"],
    "Elfes noirs": ["Araignée", "Ombre", "Abîme"], "Orcs ou gobelins": ["Horde", "Crâne"],
    "Ange, démon, divinité": ["Aube", "Abîme", "Serment"], "Dragons": ["Wyrm", "Écaille", "Brasier"],
    "Seigneur élémentaire": ["Tempête", "Magma", "Marée"], "Autre créature ancienne": ["Abîme", "Silence"]
  };

  const COMPLEMENTS_EPOQUE = {
    "Post Monastir": ["de Monastir", "d'Arly", "du Traité"],
    "Âges sombres (‑700 à ‑1)": ["des Âges sombres", "des seigneurs de guerre"],
    "Empire d'Osgild": ["d'Osgild", "de l'Empereur", "des légions impériales"],
    "Chute d'Anathazerïn": ["d'Anathazerïn", "de la cité oubliée"],
    "Apogée d'Anathazerïn": ["d'Anathazerïn", "des Hauts Elfes"],
    "Apogée des Premiers‑nés": ["des Premiers-nés"],
    "Corruption post Roi‑Sorcier": ["du Roi-Sorcier", "de Tor-Angul"],
    "Époque du Roi‑Sorcier": ["du Roi-Sorcier", "de Tor-Angul"],
    "Chute des pierres du ciel": ["des pierres du ciel", "de l'étoile tombée"],
    "Premier âge": ["du Premier âge", "des temps oubliés"]
  };
  const EPOQUE_TXT = {
    "Post Monastir": "après la paix de Monastir",
    "Âges sombres (‑700 à ‑1)": "pendant les Âges sombres",
    "Empire d'Osgild": "au temps de l'Empire d'Osgild",
    "Chute d'Anathazerïn": "dans les derniers jours d'Anathazerïn",
    "Apogée d'Anathazerïn": "à l'apogée d'Anathazerïn",
    "Apogée des Premiers‑nés": "quand les Premiers-nés dominaient le monde",
    "Corruption post Roi‑Sorcier": "dans les années corrompues qui suivirent la chute du Roi-Sorcier",
    "Époque du Roi‑Sorcier": "sous le règne du Roi-Sorcier",
    "Chute des pierres du ciel": "au temps où les pierres tombèrent du ciel",
    "Premier âge": "au Premier âge"
  };
  const PROV_TXT = {
    "Locale": "d'ici même", "La nation où l'objet est découvert": "de ces terres",
    "Une nation voisine de celle où l'objet a été trouvé": "d'une nation voisine",
    "Grand Nord": "du Grand Nord", "Sud profond": "du Sud profond", "Ouest lointain": "de l'Ouest lointain",
    "Est lointain": "de l'Est lointain", "Les profondeurs": "des profondeurs",
    "Un autre continent": "d'un autre continent", "Un autre plan": "d'un autre plan"
  };

  /* Artisans : [participe, complément d'agent] */
  const ARTISANS = { // [texte avec {e} pour l'accord, types d'objet admis (facultatif)]
    "Humains": [["forgé{e} par un maître armurier", "arme defense"], ["commandé{e} par un seigneur pour son champion"], ["fabriqué{e} par un mage de cour", "objet"], ["enchanté{e} par un ordre de mages aujourd'hui disparu"]],
    "Nains": [["forgé{e} dans les forges de Kaerimbor", "arme defense"], ["martelé{e} par un maître runique nain", "arme defense"], ["taillé{e} par un joaillier nain de Kaerimbor", "objet"], ["gravé{e} de runes par un maître runique nain", "objet"]],
    "Elfes": [["façonné{e} par les artisans elfes"], ["chanté{e} plus que forgé{e} par un barde elfe"]],
    "Gnomes": [["assemblé{e} par un inventeur gnome"], ["bricolé{e} par un artificier gnome de génie"]],
    "Elfes noirs": [["façonné{e} dans une cité des profondeurs, pour une matrone"]],
    "Orcs ou gobelins": [["arraché{e} à un ennemi puis refaçonné{e} par un chaman orque"]],
    "Ange, démon, divinité": [["béni{e}, ou maudit{e}, par une puissance d'outre-monde"]],
    "Dragons": [["imprégné{e} de la magie d'un dragon qui dormit des siècles dessus"]],
    "Seigneur élémentaire": [["trempé{e} dans le souffle d'un seigneur élémentaire"]],
    "Autre créature ancienne": [["fait{e} par une créature dont plus personne ne connaît le nom"]]
  };
  const VOYAGES = [
    "{Il} a changé de mains à chaque guerre",
    "Son dernier porteur l'a perdu{e} en fuyant une bataille",
    "{Il} a été volé{e} dans un temple, puis revendu{e} sans que personne ne sache ce que c'était",
    "On l'a enterré{e} avec son propriétaire, et {il} n'est pas resté{e} dans la tombe",
    "Un marchand l'a cédé{e} pour une poignée de pièces, sans en connaître la valeur",
    "{Il} a dormi des générations au fond d'un coffre que personne n'osait ouvrir"
  ];
  const ACCROCHES = [
    "Quelqu'un {le} cherche encore, et paie bien pour {le} retrouver.",
    "La nuit, {il} murmure parfois dans une langue morte.",
    "Les descendants de son ancien porteur {le} réclament comme un héritage.",
    "Une vieille prophétie parle {de lui}, sans qu'on sache si c'est un bon présage.",
    "Son porteur fait parfois des rêves qui ne sont pas les siens.",
    "Un culte {le} considère comme une relique qu'on lui a volée.",
    "{Il} semble reconnaître certains lieux, et s'y fait plus lourd{e}."
  ];

  const SYLLABES = {
    "Elfes": [["Ae", "Ith", "Gal", "Thal", "Ele", "Fae", "Lith", "Syl", "Cel"], ["endrë", "ion", "wen", "adriel", "anor", "iel", "ithil", "ëa"], "en elfique"],
    "Nains": [["Thor", "Dur", "Bal", "Bor", "Kar", "Grim", "Har", "Mor"], ["grim", "dak", "rak", "nar", "rik", "drum", "zul"], "en nain"],
    "Elfes noirs": [["Vel", "Zar", "Ilv", "Xun", "Mal", "Driz", "Quel"], ["thra", "yss", "ndra", "rae", "zza", "vrin"], "dans la langue des profondeurs"],
    "Orcs ou gobelins": [["Gro", "Ug", "Krag", "Mog", "Gur", "Zug"], ["nak", "dush", "gash", "rok", "mak"], "en orc"],
    "Dragons": [["Vor", "Ky", "Sar", "Ix", "Thra", "Aur"], ["ax", "yrrh", "oth", "ilax", "ugor"], "en draconique"],
    "Gnomes": [["Fiz", "Nim", "Pip", "Bim", "Tib"], ["bleck", "wick", "nix", "bur"], "en gnome"],
    "Ange, démon, divinité": [["Ael", "Ser", "Az", "Bel", "Ur"], ["iel", "oth", "aphel", "azar"], "dans une langue sacrée"],
    "Seigneur élémentaire": [["Ign", "Aqu", "Ter", "Zeph"], ["arr", "ion", "ox", "yr"], "dans la langue des éléments"],
    "Autre créature ancienne": [["Ur", "Ka", "Om", "Yth"], ["thul", "ar", "ogg", "ash"], "dans une langue oubliée"]
  };

  function genre(item) {
    if (/Arme|Sceptre/.test(item.cat)) return "arme";
    if (/défense/i.test(item.cat)) return "defense";
    return "objet";
  }
  function theme(item, origine) {
    const txt = [item.nom].concat(item.effets || []).join(" ");
    const hits = THEMES.filter(t => t[0].test(txt));
    if (hits.length) return any(any(hits)[1]);
    return any(THEME_PEUPLE[origine.peuple] || ["Étoile"]);
  }
  const de = (s, art) => (voyelle(s) ? "d'" : "de ") + s;

  function nom(item, origine) {
    let mot = theme(item, origine), noyau, g;
    do { [noyau, g] = any(NOYAUX[genre(item)]); } while (noyau === mot);
    const gabarits = ["compose", "possessif"];
    if (SYLLABES[origine.peuple]) gabarits.push("langue", "langue");
    const gab = any(gabarits);
    if (gab === "compose") return { nom: noyau + "-" + de(mot).replace(/ /, "-").replace("'", "'"), g };
    if (gab === "possessif") {
      const comp = any((COMPLEMENTS_EPOQUE[origine.epoque] || ["des temps oubliés"]));
      const adj = Math.random() < 0.6 ? any(ADJ)[g === "f" ? 1 : 0] : null;
      const art = adj ? (g === "f" ? "La " : "Le ") : (voyelle(noyau) ? "L'" : (g === "f" ? "La " : "Le "));
      return { nom: art + (adj ? adj + " " : "") + noyau + " " + comp, g };
    }
    const [deb, fin, langue] = SYLLABES[origine.peuple];
    const propre = any(deb) + any(fin);
    return { nom: propre, glose: "« " + noyau + " " + de(mot.toLowerCase()) + " » " + langue, g };
  }

  function accorder(s, g) {
    const f = g === "f";
    return s.replace(/\{il\}/g, f ? "elle" : "il").replace(/\{Il\}/g, f ? "Elle" : "Il")
      .replace(/\{le\}/g, f ? "la" : "le").replace(/\{de lui\}/g, f ? "d'elle" : "de lui").replace(/\{e\}/g, f ? "e" : "");
  }

  function legende(origine, g, type) {
    const f = g === "f";
    const liste = (ARTISANS[origine.peuple] || ARTISANS["Humains"]).filter(a => !a[1] || a[1].includes(type));
    const artisan = accorder(any(liste.length ? liste : ARTISANS["Humains"])[0], g);
    const s1 = (f ? "Elle" : "Il") + " fut " + artisan + ", " + (EPOQUE_TXT[origine.epoque] || "il y a bien longtemps") + ".";
    const s2 = (f ? "Elle" : "Il") + " vient " + (PROV_TXT[origine.provenance] || "de loin") + ". " + accorder(any(VOYAGES), g) + ".";
    const s3 = accorder(any(ACCROCHES), g);
    return [s1, s2, s3];
  }

  function histoire(item) {
    const origine = window.MOTEUR.origine(item.origineFixe);
    const n = nom(item, origine);
    return { nom: n.nom, glose: n.glose || "", g: n.g, legende: legende(origine, n.g, genre(item)), origine };
  }
  function renommer(item, lore) {
    const n = nom(item, lore.origine);
    return Object.assign({}, lore, { nom: n.nom, glose: n.glose || "", g: n.g, legende: legende(lore.origine, n.g, genre(item)) });
  }

  window.LORE = { histoire, renommer };
})();

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
    arme: [["Croc", "m"], ["Lame", "f"], ["Dent", "f"], ["Morsure", "f"], ["Chant", "m"], ["Soupir", "m"], ["Éclat", "m"], ["Fléau", "m"], ["Aiguillon", "m"], ["Colère", "f"], ["Griffe", "f"], ["Serre", "f"], ["Cri", "m"], ["Faux", "f"], ["Épine", "f"], ["Fureur", "f"]],
    defense: [["Rempart", "m"], ["Égide", "f"], ["Mur", "m"], ["Voile", "m"], ["Écaille", "f"], ["Garde", "f"], ["Bastion", "m"], ["Serment", "m"], ["Carapace", "f"], ["Peau", "f"], ["Manteau", "m"], ["Bouclier", "m"], ["Vigie", "f"], ["Porte", "f"]],
    objet: [["Œil", "m"], ["Cœur", "m"], ["Souffle", "m"], ["Larme", "f"], ["Sceau", "m"], ["Murmure", "m"], ["Secret", "m"], ["Clé", "f"], ["Veille", "f"], ["Main", "f"], ["Voix", "f"], ["Reflet", "m"], ["Songe", "m"], ["Mémoire", "f"], ["Lanterne", "f"], ["Nœud", "m"]]
  };
  const ADJ = [["Dernier", "Dernière"], ["Premier", "Première"], ["Grand", "Grande"], ["Sombre", "Sombre"], ["Fidèle", "Fidèle"], ["Ultime", "Ultime"], ["Pâle", "Pâle"], ["Vieux", "Vieille"]];

  const THEMES = [
    [/feu|braise|flamme|incendi|explosion/i, ["Braise", "Cendre", "Flamme", "Brasier", "Fournaise", "Tison"]],
    [/froid|givre|gel/i, ["Givre", "Hiver", "Frimas", "Glace", "Neige", "Bise"]],
    [/foudre|électricité|tonnerre|tension/i, ["Orage", "Tonnerre", "Éclair", "Tempête", "Foudre"]],
    [/acide/i, ["Rouille", "Venin", "Fiel", "Morsure"]],
    [/morts?\b|outre|tombe|siphon|âme|mortuaire|vampire/i, ["Tombe", "Linceul", "Glas", "Os", "Ossuaire", "Veuve"]],
    [/dragon/i, ["Wyrm", "Écaille", "Dragon", "Brasier"]],
    [/géant/i, ["Montagne", "Colosse", "Titan", "Roc"]],
    [/goblinoïde/i, ["Horde", "Gobelin", "Meute"]],
    [/démon|succube|abîme/i, ["Abîme", "Soufre", "Gouffre", "Damnation"]],
    [/ombre|ténèbre|invisib|discrétion|nuit/i, ["Ombre", "Nuit", "Crépuscule", "Brume", "Éclipse"]],
    [/divination|clairvoyance|prescience|augure/i, ["Présage", "Oracle", "Augure", "Comète"]],
    [/soin|récupération|vigueur|régénération|phénix|guérison/i, ["Aube", "Source", "Phénix", "Rosée", "Printemps"]],
    [/foi|divin|sacré|bénédiction|lumière|céleste|prière/i, ["Aube", "Lumière", "Serment", "Grâce", "Zénith", "Psaume"]],
    [/sang|saignement|exsangue/i, ["Sang", "Carmin", "Veine", "Pourpre"]],
    [/végét|arbre|écorce|nature|forêt|ronce/i, ["Ronce", "Chêne", "Sève", "Lierre", "Mousse"]],
    [/\bair\b|vent|vol\b|lévitation|chute|plume/i, ["Vent", "Plume", "Nuée", "Zéphyr", "Rafale"]],
    [/natation|aquatique/i, ["Marée", "Écume", "Abysse", "Ressac"]],
    [/magie|mana|arcane|sort\b|sorts/i, ["Étoile", "Arcane", "Sceau", "Prisme", "Astre"]],
    [/affûtée|critique|tranchant/i, ["Rasoir", "Fil", "Silex"]],
    [/protection|défense|rempart|bouclier|mobile|action libre/i, ["Rempart", "Bastion", "Veille", "Sentinelle", "Citadelle"]]
  ];
  const THEME_PEUPLE = {
    "Humains": ["Couronne", "Serment", "Bannière", "Lion", "Héraut", "Moisson"], "Nains": ["Enclume", "Roc", "Forge", "Granit", "Mine"],
    "Elfes": ["Étoile", "Lune", "Feuille", "Saule", "Aurore"], "Gnomes": ["Rouage", "Étincelle", "Ressort", "Horloge"],
    "Elfes noirs": ["Araignée", "Ombre", "Abîme", "Toile", "Obsidienne"], "Orcs ou gobelins": ["Horde", "Crâne", "Défense", "Sang"],
    "Ange, démon, divinité": ["Aube", "Abîme", "Serment", "Grâce", "Soufre"], "Dragons": ["Wyrm", "Écaille", "Brasier", "Trésor"],
    "Seigneur élémentaire": ["Tempête", "Magma", "Marée", "Séisme"], "Autre créature ancienne": ["Abîme", "Silence", "Néant", "Tentacule"]
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
  /* Parcours et accroches : [texte, peuples concernés (facultatif)].
     {Il}/{il}/{le}/{e}/{de lui} s'accordent au genre du nom. */
  const VOYAGES = [
    ["{Il} a changé de mains à chaque guerre"],
    ["Son dernier porteur l'a perdu{e} en fuyant une bataille"],
    ["{Il} a été volé{e} dans un temple, puis revendu{e} sans que personne ne sache ce que c'était"],
    ["On l'a enterré{e} avec son propriétaire, et {il} n'est pas resté{e} dans la tombe"],
    ["Un marchand l'a cédé{e} pour une poignée de pièces, sans en connaître la valeur"],
    ["{Il} a dormi des générations au fond d'un coffre que personne n'osait ouvrir"],
    ["{Il} a servi de dot à une fille de seigneur, puis de gage à un usurier"],
    ["Un pillard l'a ramassé{e} sur un champ de bataille encore fumant"],
    ["{Il} a été jeté{e} dans un fleuve pour conjurer une malédiction, et repêché{e} des années plus tard"],
    ["Un ordre de chevalerie l'a gardé{e} sous scellés pendant un siècle"],
    ["{Il} est passé{e} de la ceinture d'un héros à celle de son assassin"],
    ["Un collectionneur l'a fait voler, puis a disparu avec"],
    ["{Il} a été laissé{e} en gage dans une auberge, et personne n'est jamais revenu {le} chercher"],
    ["Un naufrage l'a emporté{e}, et la mer l'a rendu{e} sur une grève"],
    ["Un roitelet l'a offert{e} à un allié, qui l'a trahi le lendemain"],
    ["{Il} a été caché{e} dans un mur pendant un siège, et oublié{e} là"],
    ["{Il} a quitté la forge avec le clan, lors d'un exil dont les nains ne parlent pas", "Nains"],
    ["Les elfes l'ont confié{e} à un humain en gage d'une alliance aujourd'hui oubliée", "Elfes"],
    ["{Il} est remonté{e} à la surface entre les mains d'un esclave évadé", "Elfes noirs"],
    ["{Il} a été porté{e} en trophée par trois chefs de guerre successifs", "Orcs ou gobelins"],
    ["{Il} est resté{e} des siècles sous le ventre d'un dragon endormi", "Dragons"],
    ["{Il} a été déposé{e} sur un autel, puis emporté{e} par un prêtre renégat", "Ange, démon, divinité"],
    ["Trois inventeurs l'ont démonté{e} et remonté{e}, en ajoutant chacun une pièce", "Gnomes"],
    ["On l'a retrouvé{e} au cœur d'une coulée de lave refroidie", "Seigneur élémentaire"],
    ["Personne ne sait comment {il} est arrivé{e} jusqu'ici, et ceux qui ont cherché ont cessé d'en parler", "Autre créature ancienne"]
  ];
  const ACCROCHES = [
    ["Quelqu'un {le} cherche encore, et paie bien pour {le} retrouver."],
    ["La nuit, {il} murmure parfois dans une langue morte."],
    ["Les descendants de son ancien porteur {le} réclament comme un héritage."],
    ["Une vieille prophétie parle {de lui}, sans qu'on sache si c'est un bon présage."],
    ["Son porteur fait parfois des rêves qui ne sont pas les siens."],
    ["Un culte {le} considère comme une relique qu'on lui a volée."],
    ["{Il} semble reconnaître certains lieux, et s'y fait plus lourd{e}."],
    ["Un sage paierait cher pour l'étudier, et un autre pour qu'{il} disparaisse."],
    ["{Il} porte une inscription incomplète : l'autre moitié est gravée ailleurs."],
    ["Son ancien propriétaire n'est peut-être pas aussi mort qu'on le croit."],
    ["Les chiens grognent en sa présence."],
    ["{Il} se refroidit d'un coup quand un menteur s'approche."],
    ["Une famille noble affirme qu'{il} lui appartient, titres à l'appui."],
    ["Une chanson de taverne parle {de lui}, et tout le monde croit qu'{il} n'existe pas."],
    ["Un ennemi juré de son créateur vit encore, et n'a rien oublié."],
    ["{Il} vibre faiblement à l'approche de son jumeau."],
    ["Ses anciens ennemis {le} reconnaissent au premier regard."],
    ["Chaque année, la nuit de sa création, {il} se comporte étrangement."],
    ["Une matrone des profondeurs a juré de {le} récupérer.", "Elfes noirs"],
    ["Un temple estime que son porteur lui doit désormais un service.", "Ange, démon, divinité"],
    ["Le dragon qui l'a couvé{e} n'est peut-être pas mort.", "Dragons"],
    ["Un clan nain {le} considère comme un bien volé, et refuse de commercer avec son porteur.", "Nains"],
    ["Les orcs qui {le} voient croient reconnaître l'objet d'un ancien chef, et deviennent fous de rage.", "Orcs ou gobelins"],
    ["Une elfe d'une lignée ancienne {le} reconnaîtra au premier regard.", "Elfes"],
    ["Près de son élément d'origine, {il} tiédit, vibre ou suinte, comme pour s'y fondre.", "Seigneur élémentaire"],
    ["Ceux qui l'étudient trop longtemps font tous le même cauchemar.", "Autre créature ancienne"],
    ["Un rouage manque, et personne ne sait ce qu'il ferait s'il était remis.", "Gnomes"]
  ];

  /* Syllabes des noms en langue : [débuts, fins, langue] */
  const SYLLABES = {
    "Elfes": [["Ae", "Ith", "Gal", "Thal", "Ele", "Fae", "Lith", "Syl", "Cel", "Nim", "Elan", "Mir"], ["endrë", "ion", "wen", "adriel", "anor", "iel", "ithil", "ëa", "orië", "aleth", "uvial", "rindë"], "en elfique"],
    "Nains": [["Thor", "Dur", "Bal", "Bor", "Kar", "Grim", "Har", "Mor", "Khaz", "Dwal", "Brok", "Gund"], ["grim", "dak", "rak", "nar", "rik", "drum", "zul", "bard", "nok", "gar", "dûm", "thrak"], "en nain"],
    "Elfes noirs": [["Vel", "Zar", "Ilv", "Xun", "Mal", "Driz", "Quel", "Ryl", "Szor", "Nath", "Pha", "Jhal"], ["thra", "yss", "ndra", "rae", "zza", "vrin", "lith", "quess", "ryn", "zith", "aun", "ola"], "dans la langue des profondeurs"],
    "Orcs ou gobelins": [["Gro", "Ug", "Krag", "Mog", "Gur", "Zug", "Dar", "Ruk", "Shag", "Bol", "Nar", "Gash"], ["nak", "dush", "gash", "rok", "mak", "luk", "thog", "buk", "zag", "grum", "kar"], "en orc"],
    "Dragons": [["Vor", "Ky", "Sar", "Ix", "Thra", "Aur", "Zyr", "Mal", "Rhae", "Vex", "Ost"], ["ax", "yrrh", "oth", "ilax", "ugor", "anthys", "orrax", "aelith", "umbra", "yxis"], "en draconique"],
    "Gnomes": [["Fiz", "Nim", "Pip", "Bim", "Tib", "Wob", "Gim", "Dob", "Zook", "Quib"], ["bleck", "wick", "nix", "bur", "ble", "dle", "sprock", "fizz", "gle", "pin"], "en gnome"],
    "Ange, démon, divinité": [["Ael", "Ser", "Az", "Bel", "Ur", "Mar", "Ith", "Zeph", "Bael", "Hal"], ["iel", "oth", "aphel", "azar", "ithar", "umiel", "agoth", "eon", "abath", "ophiel"], "dans une langue sacrée"],
    "Seigneur élémentaire": [["Ign", "Aqu", "Ter", "Zeph", "Pyr", "Hydr", "Lith", "Fulg", "Cryo", "Aer"], ["arr", "ion", "ox", "yr", "akor", "eth", "uun", "ossa", "ithrax", "anth"], "dans la langue des éléments"],
    "Autre créature ancienne": [["Ur", "Ka", "Yth", "Xo", "Gha", "Nyar", "Zhu", "Tsa", "Ulg", "Shub"], ["thul", "ogg", "ash", "thra", "uun", "gorr", "ith", "zath", "yl", "khal"], "dans une langue oubliée"]
  };
  /* Combinaisons écartées : mots ou prénoms réels, sonorités malheureuses */
  const INTERDITS = new Set(["Omar", "Karl", "Marion", "Gimble", "Dobble", "Pinpin", "Bimble", "Ugnak", "Pipble", "Hallion", "Maleon", "Bellion", "Belion", "Celion", "Galion", "Marrak"]);

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
      let adj = Math.random() < 0.6 ? any(ADJ)[g === "f" ? 1 : 0] : null;
      if (adj === "Vieux" && voyelle(noyau)) adj = "Vieil";
      const art = adj ? (g === "f" ? "La " : "Le ") : (voyelle(noyau) ? "L'" : (g === "f" ? "La " : "Le "));
      return { nom: art + (adj ? adj + " " : "") + noyau + " " + comp, g };
    }
    const [deb, fin, langue] = SYLLABES[origine.peuple];
    let propre;
    do { propre = any(deb) + any(fin); } while (INTERDITS.has(propre) || /(.)\1\1/.test(propre));
    return { nom: propre, glose: "« " + noyau + " " + de(mot.toLowerCase()) + " » " + langue, g };
  }

  function accorder(s, g) {
    const f = g === "f";
    return s.replace(/\{il\}/g, f ? "elle" : "il").replace(/\{Il\}/g, f ? "Elle" : "Il")
      .replace(/\{le\}/g, f ? "la" : "le").replace(/\{de lui\}/g, f ? "d'elle" : "de lui").replace(/\{e\}/g, f ? "e" : "");
  }

  /* Choisit dans une liste en privilégiant le peuple et en évitant ce qui a déjà servi */
  function choisir(liste, peuple, deja) {
    const ok = liste.filter(x => !x[1] || x[1] === peuple);
    const propres = ok.filter(x => x[1] === peuple);
    const pool = propres.length && Math.random() < 0.4 ? propres : ok;
    const libres = pool.filter(x => !deja.has(x[0]));
    return any(libres.length ? libres : pool)[0];
  }

  function legende(origine, g, type, exclus) {
    const f = g === "f";
    const liste = (ARTISANS[origine.peuple] || ARTISANS["Humains"]).filter(a => !a[1] || a[1].includes(type));
    const artisan = accorder(any(liste.length ? liste : ARTISANS["Humains"])[0], g);
    const s1 = (f ? "Elle" : "Il") + " fut " + artisan + ", " + (EPOQUE_TXT[origine.epoque] || "il y a bien longtemps") + ".";
    const voyage = choisir(VOYAGES, origine.peuple, exclus.textes);
    const accroche = choisir(ACCROCHES, origine.peuple, exclus.textes);
    const s2 = (f ? "Elle" : "Il") + " vient " + (PROV_TXT[origine.provenance] || "de loin") + ". " + accorder(voyage, g) + ".";
    const s3 = accorder(accroche, g);
    return { textes: [s1, s2, s3], modeles: [voyage, accroche] };
  }

  /* exclus = { noms: Set, textes: Set } : noms et modèles de phrases déjà utilisés (historique) */
  function composer(item, origine, exclus) {
    exclus = exclus || { noms: new Set(), textes: new Set() };
    let n, essais = 0;
    do { n = nom(item, origine); } while (exclus.noms.has(n.nom) && ++essais < 50);
    const l = legende(origine, n.g, genre(item), exclus);
    return { nom: n.nom, glose: n.glose || "", g: n.g, legende: l.textes, modeles: l.modeles, origine };
  }
  function histoire(item, exclus) {
    return composer(item, window.MOTEUR.origine(item.origineFixe), exclus);
  }
  function renommer(item, lore, exclus) {
    return composer(item, lore.origine, exclus);
  }

  window.LORE = { histoire, renommer };
})();

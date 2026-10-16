/* Tables du livre de base Chroniques Oubliées Fantasy 2e édition
   (Black Book Éditions), chapitre « Objets magiques ».
   Chaque table : [[min, max, résultat], …] pour le dé indiqué. */

window.LIVRE = {
  /* Puissance d'un objet magique majeur, colonnes niveau 1 à 20.
     "C" = consommables seulement, 0 = pas d'objet magique. */
  puissance: {
    classique: ["C","C",1,1,1,2,2,2,3,3,3,4,4,4,4,5,5,5,5,6],
    high:      ["C",1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10],
    low:       [0,0,"C","C",1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3]
  },

  /* Objets possédés une fois la campagne installée */
  dotation: {
    classique: "autour de 2 objets majeurs et 2 ou 3 objets mineurs",
    high: "jusqu'à 3 objets majeurs et 4 ou 5 objets mineurs",
    low: "1 objet majeur ou mineur, acquis entre les niveaux 5 et 15"
  },
  plafondTotal: { classique: 1, high: 2, low: 0.25 }, // × niveau du PJ

  origine: {
    de: "d10",
    provenance: [
      "Locale", "La nation où l'objet est découvert", "Une nation voisine de celle où l'objet a été trouvé",
      "Grand Nord", "Sud profond", "Ouest lointain", "Est lointain",
      "Les profondeurs", "Un autre continent", "Un autre plan"
    ],
    epoque: [
      "Post Monastir", "Âges sombres (‑700 à ‑1)", "Empire d'Osgild", "Chute d'Anathazerïn",
      "Apogée d'Anathazerïn", "Apogée des Premiers‑nés", "Corruption post Roi‑Sorcier",
      "Époque du Roi‑Sorcier", "Chute des pierres du ciel", "Premier âge"
    ],
    peuple: [
      "Humains", "Nains", "Elfes", "Gnomes", "Elfes noirs", "Orcs ou gobelins",
      "Ange, démon, divinité", "Dragons", "Seigneur élémentaire", "Autre créature ancienne"
    ]
  },

  effetSecondairePotion: [
    [2, 2, "La potion ne fait pas effet et le personnage perd 1 PV sur son maximum (permanent)."],
    [3, 3, "La potion ne fait pas effet et le buveur est affaibli jusqu'à la fin d'une récupération complète."],
    [4, 4, "La potion ne fait pas effet et le buveur est affaibli jusqu'à la fin d'une récupération rapide."],
    [5, 5, "La potion ne fait aucun effet."],
    [6, 8, "La potion fait effet normalement (et la précédente reste active)."],
    [9, 9, "La potion fait effet, mais l'effet de la potion précédente cesse immédiatement."],
    [10, 10, "La potion fait effet, mais le buveur est affaibli jusqu'à la fin d'une récupération rapide."],
    [11, 11, "La potion fait effet, mais le buveur est affaibli jusqu'à la fin d'une récupération complète."],
    [12, 12, "La potion fait effet, mais elle empoisonne le buveur : 1d4° DM par rang de la potion."]
  ],

  /* Potions. Le rang sert au calcul de la valeur (rang² × 50 pa). */
  typePotion: [[1, 3, "soins"], [4, 5, "commune"], [6, 6, "rare"]],
  potions: {
    soins: { de: "d6", t: [
      [1, 3, { n: "Soins légers", p: "Prêtre", r: 1 }],
      [4, 5, { n: "Soins modérés", p: "Prêtre", r: 2 }],
      [6, 6, { n: "Délivrance", p: "Prêtre", r: 3 }]
    ]},
    commune: { de: "d10", t: [
      [1, 1, { n: "Détection de l'invisible", p: "Ensorceleur", r: 2 }],
      [2, 2, { n: "Lévitation", p: "Magicien", r: 2 }],
      [3, 3, { n: "Forme gazeuse", p: "Magicien", r: 3 }],
      [4, 4, { n: "Hâte", p: "Magicien", r: 4 }],
      [5, 5, { n: "Protection contre les éléments", p: "Magicien", d: "RD 7", r: 2 }],
      [6, 6, { n: "Respiration aquatique", p: "Magicien", r: 4 }],
      [7, 7, { n: "Armure de mage", p: "Magicien", r: 1 }],
      [8, 8, { n: "Chute ralentie", p: "Magicien", r: 2 }],
      [9, 9, { n: "Invisibilité", p: "Magicien", r: 3 }],
      [10, 10, { n: "Vol", p: "Magicien", r: 4 }]
    ]},
    rare: { de: "d20", t: [
      [1, 1, { n: "Langage des animaux", p: "Druide", d: "1d6 minutes", r: 1 }],
      [2, 2, { n: "Masque du prédateur", p: "Druide", r: 4 }],
      [3, 3, { n: "Forme animale", p: "Druide", d: "1d6 minutes", r: 5 }],
      [4, 4, { n: "Marche sylvestre", p: "Druide", d: "2d6 heures", r: 2 }],
      [5, 5, { n: "Forme d'arbre", p: "Druide", d: "2d6 minutes", r: 5 }],
      [6, 6, { n: "Peau d'écorce", p: "Druide", d: "+5 DEF", r: 1 }],
      [7, 7, { n: "Clairvoyance", p: "Ensorceleur", d: "1d6 tours", r: 3 }],
      [8, 8, { n: "Sous tension", p: "Ensorceleur", r: 2 }],
      [9, 9, { n: "Forme éthérée", p: "Ensorceleur", r: 5 }],
      [10, 10, { n: "Imitation", p: "Ensorceleur", r: 4 }],
      [11, 11, { n: "Fortifiant", p: "Forgesort", r: 1 }],
      [12, 12, { n: "Feu grégeois", p: "Forgesort", r: 2 }],
      [13, 13, { n: "Élixir de guérison", p: "Forgesort", r: 3 }],
      [14, 14, { n: "Flou", p: "Magicien", r: 2 }],
      [15, 15, { n: "Aspect de la succube", p: "Sorcier", r: 2 }],
      [16, 16, { n: "Aspect du démon", p: "Sorcier", r: 4 }],
      [17, 17, { n: "Masque mortuaire", p: "Sorcier", r: 2 }],
      [18, 18, { n: "Pattes d'araignée", p: "Sorcier", r: 2 }],
      [19, 19, { n: "Ailes célestes", p: "Prêtre", r: 4 }],
      [20, 20, { n: "Sanctuaire", p: "Prêtre", r: 2 }]
    ]}
  },

  /* Parchemins et baguettes */
  rangParchemin: {
    mineur: [[1, 3, 1], [4, 5, 2], [6, 6, 3]],
    moyen:  [[1, 2, 3], [3, 4, 4], [5, 6, 5]]
  },
  voieParchemin: [ // [profil dans VOIES, voie dans VOIES, libellé du livre]
    [1, 1, ["Ensorceleur", "voie de l’air"]],
    [2, 2, ["Ensorceleur", "voie de la divination"]],
    [3, 3, ["Ensorceleur", "voie de l’envoûteur"]],
    [4, 4, ["Ensorceleur", "voie des illusions"]],
    [5, 5, ["Ensorceleur", "voie de l’invocation"]],
    [6, 6, ["Magicien", "voie de la magie des arcanes"]],
    [7, 7, ["Magicien", "voie de la magie destructrice"]],
    [8, 8, ["Magicien", "voie de la magie élémentaire"]],
    [9, 9, ["Magicien", "voie de la magie protectrice"]],
    [10, 10, ["Magicien", "voie de la magie universelle"]],
    [11, 11, ["Sorcier", "voie du démon"]],
    [12, 12, ["Sorcier", "voie de la mort"]],
    [13, 13, ["Sorcier", "voie de l’outre-tombe"]],
    [14, 14, ["Sorcier", "voie du sang"]],
    [15, 15, ["Sorcier", "voie de la sombre magie"]],
    [16, 16, ["Prêtre", "voie de la foi"]],
    [17, 17, ["Prêtre", "voie de la prière"]],
    [18, 18, ["Prêtre", "voie des soins"]],
    [19, 19, ["Prêtre", "voie de la spiritualité"]],
    [20, 20, ["Druide", "voie des végétaux"]]
  ],

  /* Armes magiques */
  typeArme: [[1, 3, "contact"], [4, 5, "distance"], [6, 6, "sceptre"]],
  armesContact: [
    [1, 1, "Maniques (mains nues)"], [2, 2, "Bâton"], [3, 4, "Dague"], [5, 5, "Épée bâtarde"],
    [6, 7, "Épée courte"], [8, 10, "Épée longue"], [11, 11, "Hache à une main"],
    [12, 13, "Épée à deux mains"], [14, 14, "Hache à deux mains"], [15, 16, "Masse ou marteau"],
    [17, 18, "Rapière"], [19, 19, "Vivelame ou katana"], [20, 20, "Autre arme, au choix du MJ"]
  ],
  armesDistance: [
    [1, 1, "Arbalète de poing"], [2, 3, "Arbalète légère"], [4, 5, "Arbalète lourde"],
    [6, 7, "Arc court"], [8, 9, "Arc long"], [10, 10, "Dague"], [11, 11, "Fronde"],
    [12, 12, "Hachette"], [13, 13, "Javelot"], [14, 15, "Carreaux d'arbalète", "1d12"],
    [16, 17, "Flèches", "1d12"], [18, 18, "Billes de fronde", "1d12"], [19, 20, "Autre arme, au choix du MJ"]
  ],
  proprietesArme: [ // c = coût en niveau de magie
    [1, 2, { n: "affûtée", c: 1, e: "chances de critique +1 et +1d4° DM sur les critiques" }],
    [3, 3, { n: "fléau des morts", c: 1, e: "+1d4° DM contre les morts-vivants" }],
    [4, 4, { n: "fléau des dragons", c: 1, e: "+1d4° DM contre les dragons" }],
    [5, 5, { n: "fléau des géants", c: 1, e: "+1d4° DM contre les géants" }],
    [6, 6, { n: "fléau des goblinoïdes", c: 1, e: "+1d4° DM contre les goblinoïdes" }],
    [7, 7, { n: "fléau des démons", c: 1, e: "+1d4° DM contre les démons" }],
    [8, 8, { n: "de feu", c: 2, e: "+1d4° DM de feu" }],
    [9, 9, { n: "de froid", c: 2, e: "+1d4° DM de froid" }],
    [10, 10, { n: "de foudre", c: 2, e: "+1d4° DM d'électricité" }],
    [11, 12, { n: "double", c: 0 }]
  ],

  /* Objets de défense */
  armures: [
    [1, 2, "Anneau ou cape de protection"], [3, 4, "Bracelets de défense ou robe de mage"],
    [5, 6, "Armure de cuir"], [7, 8, "Armure de cuir renforcé"], [9, 10, "Chemise de mailles"],
    [11, 13, "Cotte de mailles"], [14, 15, "Demi-plaque"], [16, 16, "Plaque complète"],
    [17, 18, "Petit bouclier"], [19, 20, "Grand bouclier"]
  ],
  proprietesArmure: [
    [1, 1, { n: "d'action libre", c: 1, e: "ne peut être ralenti, immobilisé ou paralysé par magie ; +5 pour résister aux contraintes physiques" }],
    [2, 2, { n: "de défense", c: 1, e: "RD 2 contre tous les DM", sup: { n: "de défense supérieure", c: 2, e: "RD 4 contre tous les DM" } }],
    [3, 3, { n: "de natation", c: 1, e: "+5 aux tests de natation ; une armure flotte et maintient le porteur à la surface" }],
    [4, 4, { n: "d'ombre", c: 1, e: "+5 aux tests de discrétion" }],
    [5, 5, { n: "de protection", c: 1, e: "divise par 2 les DM des coups critiques et des attaques sournoises" }],
    [6, 6, { n: "de résistance à la magie", c: 1, e: "+5 en DEF ou aux tests pour résister à la magie" }],
    [7, 7, { n: "de résistance au feu", c: 1, e: "retranche X aux DM de feu", x: true }],
    [8, 8, { n: "de résistance au froid", c: 1, e: "retranche X aux DM de froid", x: true }],
    [9, 9, { n: "de résistance à l'électricité", c: 1, e: "retranche X aux DM d'électricité", x: true }],
    [10, 10, { n: "de résistance à l'acide", c: 1, e: "retranche X aux DM d'acide", x: true }],
    [11, 11, { n: "mobile", c: 1, e: "malus d'armure réduit de 4" }],
    [12, 12, { n: "double", c: 0 }]
  ],

  /* Objets de pouvoir */
  rangPouvoir: [[1, 2, 1], [3, 4, 2], [5, 6, 3], [7, 7, 4], [8, 8, 5]],
  profilPouvoir: [
    [1, 1, "Arquebusier"], [2, 2, "Barde"], [3, 3, "Barbare"], [4, 4, "Chevalier"],
    [5, 6, "Druide"], [7, 8, "Ensorceleur"], [9, 10, "Forgesort"], [11, 11, "Guerrier"],
    [12, 13, "Magicien"], [14, 14, "Moine"], [15, 16, "Sorcier"], [17, 18, "Prêtre"],
    [19, 19, "Rôdeur"], [20, 20, "Voleur"]
  ],

  /* Objets de puissance */
  caracPuissance: [
    [1, 1, "AGI"], [2, 2, "CON"], [3, 3, "FOR"], [4, 4, "PER"], [5, 5, "CHA"],
    [6, 6, "INT"], [7, 7, "VOL"], [8, 8, "DR"], [9, 9, "PC"], [10, 10, "PM"],
    [11, 11, "PV"], [12, 12, "relancer"]
  ],
  formePuissance: {
    FOR: "Ceinture de force", INT: "Bandeau d'intelligence", VOL: "Bandeau de volonté",
    AGI: "Gantelets d'agilité", PER: "Masque de perception", CHA: "Robe de charisme",
    CON: "Amulette de constitution"
  },
  plafondPuissance: { classique: 2, high: 3, low: 2 },

  familles: {
    profane: ["Ensorceleur", "Forgesort", "Magicien", "Sorcier"],
    divine: ["Druide", "Moine", "Prêtre"]
  }
};

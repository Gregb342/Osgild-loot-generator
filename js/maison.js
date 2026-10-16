/* Tables maison : elles complètent le livre là où il ne donne rien
   (argent, gemmes, descriptions, composition d'un butin).
   À ajuster librement. */

window.MAISON = {
  /* Composition d'un « butin complet » (d6) */
  composition: [
    [1, 3, "consommables"],
    [4, 5, "mineur"],
    [6, 6, "majeur"]
  ],

  /* Poids des catégories d'objets permanents */
  poidsPermanents: { arme: 30, defense: 25, pouvoir: 14, puissance: 8, competence: 8, baguette: 8, grimoire: 7 },
  poidsConsommables: { potion: 55, parchemin: 35, projectiles: 10 },

  /* Bourse : multiplicateur en pièces d'argent par niveau de PJ */
  bourse: {
    petite: { label: "Bourse (un adversaire)", des: [2, 6], parNiveau: 2 },
    magot:  { label: "Magot (un repaire)", des: [4, 6], parNiveau: 10 }
  },

  gemmes: [ // [min, max, valeur en pa, exemples]
    [1, 6, 10, ["un éclat de quartz fumé", "une agate rubanée", "une perle d'eau douce ternie", "un morceau d'ambre"]],
    [7, 11, 50, ["une améthyste taillée en cabochon", "un grenat sombre", "une tourmaline verte", "une perle de mer"]],
    [12, 15, 100, ["un péridot limpide", "une topaze dorée", "un jade sculpté en scarabée", "une opale laiteuse"]],
    [16, 18, 250, ["un saphir pâle", "une émeraude veinée", "un rubis de petite taille", "une perle noire"]],
    [19, 19, 500, ["un saphir étoilé", "un rubis sang-de-pigeon", "une émeraude sans défaut"]],
    [20, 20, 1000, ["un diamant de belle eau", "une opale de feu grosse comme un œuf de caille"]]
  ],
  objetsArt: [
    [1, 6, 25, ["un gobelet d'étain gravé de runes naines", "un peigne en os sculpté", "une statuette de dieu domestique en bois peint"]],
    [7, 12, 75, ["une broche d'argent en forme de feuille", "un encrier de cuivre à couvercle ciselé", "un jeu de dés en ivoire dans un étui de cuir"]],
    [13, 17, 250, ["un calice d'argent serti de grenats", "une tapisserie roulée figurant une chasse", "un médaillon portant le sceau d'une maison noble oubliée"]],
    [18, 20, 750, ["une couronne d'or fin d'un roitelet", "une icône dorée aux émaux intacts", "une carte ancienne sur peau d'un royaume disparu"]]
  ],

  /* Objets de compétence (+5 à un type de test) */
  competences: [
    ["Cape et bottes de l'ombre", "discrétion"], ["Amulette du guetteur", "détecter un danger ou une embuscade"],
    ["Gants de crochetage", "crocheter les serrures"], ["Bottes de l'araignée", "escalade"],
    ["Ceinture du nageur", "natation"], ["Broche du diplomate", "persuasion"],
    ["Loupe de l'érudit", "connaissances (histoire et légendes)"], ["Lanterne du pisteur", "pister"],
    ["Bague du menteur", "supercherie"], ["Masque de comédien", "déguisement"],
    ["Plume du copiste", "déchiffrer un écrit ou une langue"], ["Étrier du cavalier", "équitation"],
    ["Bracelet du jongleur", "acrobaties"], ["Sacoche de l'herboriste", "soigner (premiers soins)"],
    ["Cor du veneur", "dressage et soin des animaux"], ["Monocle de l'orfèvre", "évaluer un objet précieux"]
  ],

  /* Habillage pour décrire sans nommer (identification) */
  apparence: {
    fiole: ["une fiole de verre bleuté", "une flasque de métal cabossée", "un petit pot de grès scellé à la cire", "une ampoule de cristal", "une gourde de cuir minuscule", "un tube d'os bouché de liège"],
    liquide: ["rouge sombre", "ambré et pailleté", "vert d'eau", "noir d'encre", "laiteux", "incolore et légèrement pétillant", "violet profond", "doré et épais comme du miel"],
    odeur: ["la menthe", "le clou de girofle", "la terre mouillée", "le soufre", "la rose fanée", "le pain chaud", "le métal chaud", "rien du tout"],
    matiere: ["acier bleui", "bronze patiné", "argent noirci", "bois de frêne poli", "os gravé", "fer forgé noir", "or terni", "cristal fumé"],
    detail: [
      "des runes à demi effacées courent le long", "une pierre trouble y est sertie",
      "il porte la marque d'un artisan inconnu", "il est tiède au toucher, même dans le froid",
      "une inscription en elfique ancien y est gravée", "il bourdonne doucement quand on l'approche de l'oreille",
      "il est plus léger qu'il ne devrait", "un motif de dragon s'y enroule"
    ],
    parchemin: ["un rouleau de vélin noué d'un ruban noir", "une feuille pliée en quatre, scellée de cire verte", "un étui de cuir contenant un parchemin jauni", "un papyrus fragile couvert d'une écriture serrée"]
  }
};

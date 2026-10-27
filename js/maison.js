/* Tables maison : elles complètent le livre là où il ne donne rien
   (poids des catégories, objets de compétence, descriptions).
   L'argent, les gemmes et les sources de butin sont dans sources.js.
   À ajuster librement. */

window.MAISON = {
  /* Poids des catégories d'objets permanents */
  poidsPermanents: { arme: 30, defense: 25, pouvoir: 14, puissance: 8, competence: 8, baguette: 8, grimoire: 7 },
  poidsConsommables: { potion: 55, parchemin: 35, projectiles: 10 },

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
      "de fines gravures en couvrent la surface", "il bourdonne doucement quand on l'approche de l'oreille",
      "il est plus léger qu'il ne devrait", "un motif torsadé s'y enroule"
    ],
    parchemin: ["un rouleau de vélin noué d'un ruban noir", "une feuille pliée en quatre, scellée de cire verte", "un étui de cuir contenant un parchemin jauni", "un papyrus fragile couvert d'une écriture serrée"]
  }
};

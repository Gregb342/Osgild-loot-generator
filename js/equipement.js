/* Équipement non magique.
   - Catalogue : armes et armures du livre de base COF 2e édition (chapitre
     « Équipement »), © Black Book Éditions. enc = valeur d'encombrement de la
     règle optionnelle de l'Atlas d'Osgild (0 petit, 1 moyen, 2 grand ; armure
     portée = DEF / 2 arrondi au supérieur, transportée = DEF).
   - États, kits par source et quantités : règles maison. */

window.EQUIPEMENT = {
  armes: {
    "Bâton ferré":        { dm: "1d6", type: "contondants", prix: 2, enc: 1, notes: "arme à deux mains" },
    "Dague":              { dm: "1d4", type: "perforants", prix: 3, enc: 0, notes: "arme légère ; se lance à 5 m" },
    "Épée à deux mains":  { dm: "2d6", type: "tranchants", prix: 10, enc: 2, notes: "arme à deux mains" },
    "Épée bâtarde":       { dm: "1d8/1d12", type: "tranchants", prix: 9, enc: 1, notes: "à une ou deux mains" },
    "Épée courte":        { dm: "1d6", type: "perforants", prix: 5, enc: 1, notes: "arme légère" },
    "Épée longue":        { dm: "1d8", type: "tranchants", prix: 6, enc: 1 },
    "Épieu":              { dm: "1d6/1d10", type: "perforants", prix: 4, enc: 1, notes: "à une ou deux mains ; se lance à 10 m (1d6)" },
    "Fléau":              { dm: "1d6", type: "contondants", prix: 5, enc: 1, notes: "1 fois par combat, relance une attaque ratée contre un bouclier ou une arme" },
    "Fléau à deux mains": { dm: "1d10", type: "contondants", prix: 8, enc: 2, notes: "arme à deux mains ; même relance que le fléau" },
    "Gourdin":            { dm: "1d4", type: "contondants", prix: 1, enc: 1, notes: "DM temporaires possibles" },
    "Hache":              { dm: "1d8", type: "tranchants", prix: 6, enc: 1 },
    "Hache à deux mains": { dm: "2d6", type: "tranchants", prix: 10, enc: 2, notes: "arme à deux mains" },
    "Lance":              { dm: "1d6/1d10", type: "perforants", prix: 4, enc: 1, notes: "à une ou deux mains ; se lance à 10 m (1d6)" },
    "Lance de cavalerie": { dm: "2d6", type: "perforants", prix: 8, enc: 2, notes: "à cheval, après un déplacement ; sinon dé malus" },
    "Marteau":            { dm: "1d6", type: "contondants", prix: 4, enc: 1 },
    "Masse":              { dm: "1d6", type: "contondants", prix: 4, enc: 1 },
    "Pique":              { dm: "1d10", type: "perforants", prix: 5, enc: 2, notes: "arme à deux mains ; DM doublés contre une charge de grande créature, attaque depuis le 2e rang à −5" },
    "Rapière":            { dm: "1d6", type: "perforants", prix: 6, enc: 1, notes: "arme légère, critique sur 19-20" },
    "Stylet":             { dm: "1d3", type: "perforants", prix: 1, enc: 0, notes: "arme légère ; pas de FOR aux DM, mais 1d6 + AGI si la cible est surprise" },
    "Vivelame":           { dm: "1d10", type: "tranchants", prix: 15, enc: 2, notes: "arme à deux mains, critique sur 19-20" },
    "Arbalète de poing":  { dm: "1d6", type: "perforants", prix: 8, enc: 0, portee: "10 m", notes: "recharger : action de mouvement" },
    "Arbalète légère":    { dm: "2d4", type: "perforants", prix: 10, enc: 1, portee: "30 m", notes: "à deux mains ; recharger : action de mouvement" },
    "Arbalète lourde":    { dm: "2d6", type: "perforants", prix: 15, enc: 2, portee: "60 m", notes: "à deux mains ; recharger : action limitée" },
    "Arc court":          { dm: "1d6", type: "perforants", prix: 4, enc: 2, portee: "30 m", notes: "à deux mains" },
    "Arc long":           { dm: "1d8", type: "perforants", prix: 8, enc: 2, portee: "50 m", notes: "à deux mains, FOR +1 minimum" },
    "Couteaux de lancer": { dm: "1d4", type: "perforants", prix: 3, enc: 0, portee: "10 m" },
    "Hachette":           { dm: "1d6", type: "tranchants", prix: 2, enc: 1, portee: "5 m", notes: "arme de lancer" },
    "Javelot":            { dm: "1d6", type: "perforants", prix: 1, enc: 1, portee: "20 m", notes: "arme de lancer" }
  },

  armures: {
    "Tissus matelassés, fourrures": { def: 1, agi: 7, prix: 2 },
    "Cuir simple":                  { def: 2, agi: 6, prix: 4 },
    "Cuir renforcé, broigne":       { def: 3, agi: 5, prix: 8 },
    "Chemise de mailles":           { def: 4, agi: 4, prix: 15 },
    "Cotte de mailles":             { def: 5, agi: 3, prix: 25 },
    "Armure de plaques":            { def: 6, agi: 2, prix: 60 },
    "Plaque complète":              { def: 7, agi: 1, prix: 200, notes: "sur mesure : seul un chevalier (voie de la noblesse, rang 2) peut la porter" },
    "Petit bouclier":               { def: 1, prix: 2, enc: 1, bouclier: true },
    "Grand bouclier":               { def: 2, prix: 4, enc: 2, bouclier: true }
  },

  /* Correspondance entre les noms des tables d'objets magiques et le catalogue */
  alias: {
    "Maniques (mains nues)": null, "Bâton": "Bâton ferré", "Vivelame ou katana": "Vivelame",
    "Masse ou marteau": "Masse", "Hache à une main": "Hache",
    "Armure de cuir": "Cuir simple", "Armure de cuir renforcé": "Cuir renforcé, broigne",
    "Demi-plaque": "Armure de plaques", "Carreaux d'arbalète": null, "Flèches": null, "Billes de fronde": null,
    "Fronde": null
  },

  /* États (règle maison). f = part de la valeur ; malus en jeu. */
  etats: {
    qualite: { label: "de qualité", f: null, effet: "arme : +1 en attaque ou aux DM (toujours le même) ; armure : pénalité aux tests d'AGI réduite de 1 (règle du livre)" },
    bon:     { label: "en bon état", f: 1, effet: "" },
    use:     { label: "usé", f: 0.5, effet: "utilisable normalement" },
    abime:   { label: "abîmé", f: 0.25, effet: "utilisable avec un malus (arme : −1 aux DM ; armure : −1 en DEF), réparable par un forgeron pour la moitié du prix" },
    hs:      { label: "hors d'usage", f: 0.1, effet: "inutilisable : ferraille et cuir à récupérer" }
  },

  /* Kits par source : poids des pièces d'équipement, répartition des états,
     part d'adversaires portant une armure et un bouclier. */
  kits: {
    pillards: {
      armes: { "Dague": 3, "Gourdin": 3, "Hachette": 2, "Lance": 2, "Arc court": 2 },
      armures: { "Tissus matelassés, fourrures": 3, "Cuir simple": 2 }, armure: 0.4, bouclier: 0.3, boucliers: { "Petit bouclier": 1 },
      etats: { bon: 5, use: 25, abime: 35, hs: 35 }, taille: "Fait pour une petite créature : un halfelin ou un gnome le manie normalement, les autres avec un dé malus."
    },
    bandits: {
      armes: { "Épée courte": 3, "Dague": 3, "Gourdin": 1, "Rapière": 1, "Hache": 1 }, distance: { "Arc court": 2, "Arbalète légère": 2 }, distanceP: 0.4,
      armures: { "Cuir simple": 2, "Cuir renforcé, broigne": 2, "Chemise de mailles": 1 }, armure: 0.6, bouclier: 0.2,
      etats: { bon: 20, use: 45, abime: 25, hs: 10 }
    },
    soldats: {
      armes: { "Épée longue": 4, "Lance": 3, "Hache": 1, "Masse": 1, "Pique": 1 }, distance: { "Arbalète légère": 3, "Arc long": 1 }, distanceP: 0.3,
      armures: { "Cuir renforcé, broigne": 2, "Chemise de mailles": 2, "Cotte de mailles": 2 }, armure: 0.9, bouclier: 0.5,
      etats: { qualite: 2, bon: 45, use: 40, abime: 10, hs: 3 }
    },
    armee: {
      armes: { "Hache": 3, "Hache à deux mains": 2, "Épieu": 2, "Masse": 1, "Gourdin": 1 }, distance: { "Javelot": 2, "Arc court": 1 }, distanceP: 0.3,
      armures: { "Tissus matelassés, fourrures": 2, "Cuir renforcé, broigne": 2, "Chemise de mailles": 1 }, armure: 0.6, bouclier: 0.4,
      etats: { bon: 15, use: 40, abime: 30, hs: 15 }
    },
    marchands: {
      armes: { "Épée courte": 2, "Lance": 1, "Dague": 2 }, distance: { "Arbalète légère": 2 }, distanceP: 0.4,
      armures: { "Cuir renforcé, broigne": 2, "Chemise de mailles": 1 }, armure: 0.5, bouclier: 0.2,
      etats: { qualite: 2, bon: 40, use: 40, abime: 15, hs: 3 }
    },
    faussaires: {
      armes: { "Dague": 3, "Stylet": 2, "Épée courte": 2, "Rapière": 1 }, distance: { "Arbalète de poing": 1, "Couteaux de lancer": 2 }, distanceP: 0.3,
      armures: { "Cuir simple": 2 }, armure: 0.4, bouclier: 0,
      etats: { qualite: 2, bon: 35, use: 40, abime: 18, hs: 5 }
    },
    culte: {
      armes: { "Dague": 3, "Masse": 2, "Bâton ferré": 2, "Fléau": 1 },
      armures: { "Tissus matelassés, fourrures": 1, "Cuir simple": 1, "Chemise de mailles": 1 }, armure: 0.3, bouclier: 0.1,
      etats: { bon: 35, use: 40, abime: 15, hs: 10 }
    },
    sorcier: {
      armes: { "Bâton ferré": 3, "Dague": 3, "Épée longue": 1 }, distance: { "Arbalète légère": 1 }, distanceP: 0.2,
      armures: { "Cuir renforcé, broigne": 1, "Cotte de mailles": 1 }, armure: 0.3, bouclier: 0.1,
      etats: { qualite: 4, bon: 40, use: 40, abime: 10, hs: 6 }
    },
    "elfes-noirs": {
      armes: { "Rapière": 3, "Épée courte": 2, "Dague": 2 }, distance: { "Arbalète de poing": 3 }, distanceP: 0.6,
      armures: { "Cuir renforcé, broigne": 1, "Chemise de mailles": 2 }, armure: 0.7, bouclier: 0.1, boucliers: { "Petit bouclier": 1 },
      etats: { qualite: 10, bon: 40, use: 35, abime: 10, hs: 5 }
    },
    fees: {
      armes: { "Lance": 1, "Dague": 2, "Rapière": 1 }, distance: { "Arc court": 2 }, distanceP: 0.5,
      armures: { "Cuir simple": 1 }, armure: 0.2, bouclier: 0,
      etats: { qualite: 10, bon: 50, use: 30, abime: 10, hs: 0 }, taille: "Façonné pour une créature féérique : il peut être minuscule ou étrangement léger, selon la créature."
    },
    tombeau: {
      armes: { "Épée longue": 3, "Épée à deux mains": 1, "Hache": 1, "Lance": 1 },
      armures: { "Cotte de mailles": 2, "Armure de plaques": 1 }, armure: 0.6, bouclier: 0.4,
      etats: { qualite: 5, bon: 5, use: 20, abime: 30, hs: 40 }
    },
    victimes: { // ce qu'il reste des aventuriers et voyageurs tombés là
      armes: { "Épée longue": 2, "Épée courte": 1, "Dague": 2, "Hache": 1, "Bâton ferré": 1, "Épée bâtarde": 1 }, distance: { "Arc court": 1, "Arbalète légère": 1 }, distanceP: 0.3,
      armures: { "Cuir renforcé, broigne": 1, "Chemise de mailles": 1, "Cotte de mailles": 1, "Armure de plaques": 1 }, armure: 0.6, bouclier: 0.3,
      etats: { qualite: 3, bon: 10, use: 25, abime: 30, hs: 32 }
    }
  },
  /* Source → kit ; « porte » = les adversaires portent l'équipement (sur les corps) */
  kitSource: {
    betes: { kit: "victimes", porte: false }, pillards: { kit: "pillards", porte: true },
    bandits: { kit: "bandits", porte: true }, soldats: { kit: "soldats", porte: true },
    armee: { kit: "armee", porte: true }, marchands: { kit: "marchands", porte: true },
    faussaires: { kit: "faussaires", porte: true }, culte: { kit: "culte", porte: true },
    geants: { kit: "victimes", porte: false, note: "Les armes des géants sont à leur taille : inutilisables, et transportables à deux." },
    "betes-magiques": { kit: "victimes", porte: false }, antre: { kit: "victimes", porte: false },
    "elfes-noirs": { kit: "elfes-noirs", porte: true }, fees: { kit: "fees", porte: true },
    sorcier: { kit: "sorcier", porte: true }, tombeau: { kit: "tombeau", porte: true }
  },

  /* Monnaie : répartition de la valeur entre pp, po, pa, pc */
  monnaie: {
    cuivre:  { po: 0, pa: 0.3, pc: 0.7 },
    commun:  { po: 0.3, pa: 0.55, pc: 0.15 },
    riche:   { pp: 0.15, po: 0.6, pa: 0.2, pc: 0.05 }
  },
  monnaieSource: {
    pillards: "cuivre", betes: "commun", bandits: "commun", soldats: "commun", armee: "commun",
    marchands: "riche", faussaires: "commun", culte: "commun", geants: "commun",
    "betes-magiques": "commun", antre: "riche", "elfes-noirs": "riche", fees: "riche",
    sorcier: "riche", tombeau: "riche"
  }
};

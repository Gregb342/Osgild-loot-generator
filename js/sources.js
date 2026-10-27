/* Sources de butin : règles maison, inspirées des « types de trésor » d'AD&D
   et du trésor individuel / de repaire de D&D 5e, recalibrées sur l'économie
   de COF (une épée longue vaut 6 pa, un cheval de selle 100 pa).

   Tous les montants sont en pièces d'argent (pa). Tout est ajustable ici. */

window.SOURCES = {
  /* ---------- barème d'argent ----------
     NC = niveau de la rencontre (menace choisie ou NC précis).
     Montant moyen avant le coefficient de richesse de la source :
       sur les corps : 3 × (NC + 1)^1.3, × (0,7 + 0,1 × nombre d'adversaires), plafonné à × 2
       repaire       : 8 × (NC + 1)^1.7
       fin d'aventure: 2 × repaire
     Le hasard vient d'un 2d6 / 7 (de 0,3 à 1,7 fois la moyenne). */
  bareme: {
    corps: { base: 3, expo: 1.3 },
    repaire: { base: 8, expo: 1.7 },
    fin: { base: 16, expo: 1.7 }
  },

  /* Menace relative au groupe → NC de la rencontre */
  menace: {
    faible: { label: "Plus faible que le groupe", ecart: -2 },
    mesure: { label: "À sa mesure", ecart: 0 },
    redoutable: { label: "Redoutable", ecart: 2 }
  },

  ampleur: {
    corps: { label: "Sur les corps", aide: "Ce que les adversaires ont sur eux." },
    repaire: { label: "Repaire", aide: "Le magot accumulé dans leur cachette." },
    fin: { label: "Fin d'aventure", aide: "Le trésor du boss ou la récompense finale." }
  },

  /* Probabilités d'objets magiques permanents, multipliées par « magie » de la source */
  magie: {
    corps:   { mineur: 0.05, majeur: 0 },
    repaire: { mineur: 0.30, majeur: 0.12 },
    fin:     { mineur: 0.30, majeur: 1 }   // majeur garanti si la source a de la magie
  },

  /* Valeurs des gemmes et objets d'art : d8 + NC/2 */
  liste: [
    {
      id: "betes", nom: "Bêtes, vermine",
      aide: "Loups, ours, rats géants, araignées. Rien sur eux ; dans leur tanière, les restes d'anciennes victimes.",
      richesse: { corps: 0, repaire: 0.4, fin: 0.6 }, gemmes: 0.3, art: 0.1, magie: 0.25,
      perm: { arme: 30, defense: 30, competence: 15, pouvoir: 15, puissance: 10 },
      conso: { potion: 60, parchemin: 25, projectiles: 15 },
      special: ["victimes"],
      trouvailles: [
        ["Des ossements humains encore vêtus de lambeaux de cuir", null],
        ["Un sac à dos déchiqueté contenant une corde et un briquet", 3],
        ["Une botte d'aventurier, avec un couteau caché dans la tige", 1],
        ["Un carnet de voyage gonflé d'humidité, à moitié lisible", null],
        ["Une lanterne cabossée et une fiole d'huile", 4],
        ["Une peau en bon état, à tanner", 5]
      ]
    },
    {
      id: "pillards", nom: "Pillards (gobelins, kobolds)",
      aide: "Petites créatures qui chapardent : beaucoup de cuivre, des babioles, du matériel de mauvaise qualité.",
      richesse: { corps: 0.2, repaire: 0.5, fin: 0.6 }, gemmes: 0.3, art: 0.2, magie: 0.4,
      profils: { Voleur: 2, Barbare: 1, Druide: 1, Sorcier: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 40, defense: 30, competence: 15, pouvoir: 15 },
      conso: { potion: 60, parchemin: 10, projectiles: 30 },
      special: ["cuivre"],
      trouvailles: [
        ["Une collection de boutons dépareillés, dont un en argent", 1],
        ["Un collier de dents et de capsules de cuivre", null],
        ["Des dagues rouillées, inutilisables sans réparation", 1],
        ["Une poule vivante, un peu nerveuse", null],
        ["Un chaudron percé rempli de champignons séchés", null],
        ["Un pot de miel volé dans une ferme", 1],
        ["Une couverture de laine trouée, brodée aux initiales d'un fermier", null],
        ["Un sac de clous et de ferrures arrachés à une charrette", 2]
      ]
    },
    {
      id: "bandits", nom: "Bandits de grand chemin",
      aide: "Bourses volées aux voyageurs, armes correctes, parfois une potion.",
      richesse: { corps: 1.2, repaire: 1.2, fin: 1.2 }, gemmes: 0.6, art: 0.5, magie: 0.6,
      profils: { Voleur: 3, Rôdeur: 2, Guerrier: 1, Barde: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 40, defense: 25, competence: 20, pouvoir: 15 },
      conso: { potion: 70, projectiles: 30 },
      special: [],
      trouvailles: [
        ["Un jeu de cartes graisseux et des dés en os", 1],
        ["Une gourde d'eau-de-vie de prune", 2],
        ["Une bague de fiançailles gravée de deux prénoms", 15],
        ["Une liste de voyageurs à détrousser, avec les dates de passage", null],
        ["Une bourse brodée aux armes d'une famille marchande", 2],
        ["Des menottes et un trousseau de clés", 3],
        ["Un tonnelet de vin volé", 8],
        ["Une lettre de rançon jamais envoyée", null]
      ]
    },
    {
      id: "soldats", nom: "Soldats, gardes",
      aide: "Leur solde, de l'équipement de qualité, une clé ou des ordres.",
      richesse: { corps: 1, repaire: 0.8, fin: 1 }, gemmes: 0.3, art: 0.4, magie: 0.5,
      profils: { Guerrier: 3, Chevalier: 2, Prêtre: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 45, defense: 45, puissance: 10 },
      conso: { potion: 70, projectiles: 30 },
      special: [],
      trouvailles: [
        ["Une gourde de vin coupé d'eau", 1],
        ["Un jeu de dés et une ardoise de dettes de jeu", null],
        ["Une lettre d'amour jamais envoyée", null],
        ["Des ordres de mission scellés", null],
        ["Le trousseau de clés de la caserne", null],
        ["Un tabard aux couleurs de la garnison", 1],
        ["Une feuille de solde avec les noms de la compagnie", null],
        ["Un cor de signal en laiton", 4]
      ]
    },
    {
      id: "armee", nom: "Armée en campagne (orques, gnolls)",
      aide: "Fruits du pillage des villages, trophées, solde de guerre. Beaucoup de choses encombrantes.",
      richesse: { corps: 0.6, repaire: 1, fin: 1.2 }, gemmes: 0.4, art: 0.6, magie: 0.5,
      profils: { Barbare: 3, Guerrier: 2, Sorcier: 1, Druide: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 40, defense: 30, pouvoir: 20, puissance: 10 },
      conso: { potion: 60, parchemin: 10, projectiles: 30 },
      special: ["encombrant"],
      trouvailles: [
        ["Un chariot de vivres réquisitionnés (grain, salaisons)", 40],
        ["Des outils agricoles volés dans un village", 5],
        ["Un étendard de clan orné de crânes", null],
        ["Une cloche de chapelle arrachée à son clocher", 30],
        ["Un coffret de vaisselle d'étain pillé dans une auberge", 12],
        ["Une carte de la région annotée de cibles", null],
        ["Une boîte en fer blanc qui sent les épices", null],
        ["Des trophées : oreilles séchées enfilées sur une corde", null]
      ]
    },
    {
      id: "marchands", nom: "Marchands, caravane",
      aide: "De la vraie richesse, mais surtout en marchandises lourdes à transporter et à revendre.",
      richesse: { corps: 1.5, repaire: 1.5, fin: 1.8 }, gemmes: 0.5, art: 0.6, magie: 0.5,
      profils: { Forgesort: 2, Barde: 2, Magicien: 1, Prêtre: 1, Arquebusier: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { competence: 25, pouvoir: 25, puissance: 15, arme: 15, defense: 10, baguette: 10 },
      conso: { potion: 60, parchemin: 40 },
      special: ["encombrant"],
      trouvailles: [
        ["Trois rouleaux de drap fin", 45],
        ["Une caisse d'épices du sud (poivre, cannelle)", 60],
        ["Un tonneau de vin de qualité", 25],
        ["Un livre de comptes avec des créances à réclamer", null],
        ["Une balance de changeur et ses poids", 10],
        ["Un coffret de bougies de cire d'abeille", 6],
        ["Une mule bâtée, inquiète", 25],
        ["Une lettre de change sur une maison de Monastir", null]
      ]
    },
    {
      id: "faussaires", nom: "Faussaires, guilde de voleurs",
      aide: "Beaucoup de pièces, mais une partie est fausse : test de PER pour la repérer.",
      richesse: { corps: 2, repaire: 2.2, fin: 2.2 }, gemmes: 0.5, art: 0.5, magie: 0.5,
      profils: { Voleur: 3, Barde: 2, Ensorceleur: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { competence: 40, pouvoir: 30, arme: 30 },
      conso: { potion: 70, parchemin: 30 },
      special: ["fausse"],
      trouvailles: [
        ["Des moules à pièces en terre cuite", null],
        ["Un sac de plomb et d'étain pour couler les pièces", 3],
        ["Des outils de crochetage de belle facture", 5],
        ["Un registre codé des dettes et des complices", null],
        ["Des sceaux contrefaits d'un notable", null],
        ["Une cape réversible et une fausse barbe", 2],
        ["Des dés pipés dans un étui de cuir", 1]
      ]
    },
    {
      id: "culte", nom: "Culte, temple",
      aide: "Objets rituels, offrandes, potions de soins et parchemins divins.",
      richesse: { corps: 0.6, repaire: 1, fin: 1.2 }, gemmes: 0.6, art: 0.9, magie: 0.8,
      profils: { Prêtre: 4, Sorcier: 3, Druide: 1, Moine: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { pouvoir: 35, grimoire: 25, defense: 15, baguette: 15, arme: 10 },
      conso: { potion: 60, parchemin: 40 },
      special: [],
      trouvailles: [
        ["Un encensoir d'argent noirci", 20],
        ["Des robes de cérémonie brodées", 8],
        ["Le registre des fidèles, avec des noms connus", null],
        ["Un tronc des offrandes forcé, vide", null],
        ["Une dague rituelle à la lame gravée", 6],
        ["Des cierges noirs et des sels de purification", 2],
        ["Une icône peinte du dieu du culte", 15],
        ["Un recueil de prières hérétiques", null]
      ]
    },
    {
      id: "geants", nom: "Géants, ogres",
      aide: "Le sac du géant : un bric-à-brac de gros objets et de trophées, avec parfois une vraie pièce de valeur.",
      richesse: { corps: 0.8, repaire: 1.2, fin: 1.4 }, gemmes: 0.6, art: 0.7, magie: 0.5,
      profils: { Barbare: 3, Guerrier: 1, Druide: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 35, defense: 25, puissance: 20, pouvoir: 20 },
      conso: { potion: 70, projectiles: 30 },
      special: ["encombrant"],
      trouvailles: [
        ["Une roue de charrette qui sert d'assiette", null],
        ["Un jambon entier à moitié rongé", 2],
        ["Le casque d'un chevalier, cabossé, aux armes reconnaissables", 10],
        ["Une marmite de fonte assez grande pour un halfelin", 8],
        ["Une collection de crânes de bétail peints", null],
        ["Une pierre à aiguiser de la taille d'un enfant", null],
        ["Un tonneau de bière tiède", 6],
        ["Une couverture faite de tentes cousues ensemble", 4]
      ]
    },
    {
      id: "betes-magiques", nom: "Bête magique (griffon, basilic, hydre)",
      aide: "Rien sur elle, mais des composants à revendre à un alchimiste ; dans le nid, les restes des aventuriers d'avant.",
      richesse: { corps: 0, repaire: 0.8, fin: 1.2 }, gemmes: 0.6, art: 0.4, magie: 0.7,
      perm: { arme: 30, defense: 25, pouvoir: 15, puissance: 10, competence: 10, baguette: 10 },
      conso: { potion: 60, parchemin: 25, projectiles: 15 },
      special: ["composants", "victimes"],
      trouvailles: [
        ["Des ossements d'aventuriers rongés", null],
        ["Un bouclier fendu aux armes d'une compagnie disparue", null],
        ["Le journal d'un chasseur de monstres", null],
        ["Une bourse de cuir moisie, collée aux os", null],
        ["Des fragments d'armure fondus ou pétrifiés", null]
      ],
      composants: [
        ["Œufs de griffon (à vendre à un dresseur)", 200],
        ["Glandes à venin intactes", 30],
        ["Écailles épaisses, recherchées par les armuriers", 40],
        ["Plumes rémiges d'un mètre, pour les fléchiers", 15],
        ["Yeux de basilic conservés dans le sel", 80],
        ["Sang de créature magique en fiole", 25],
        ["Cornes ou griffes d'apparat", 20]
      ]
    },
    {
      id: "antre", nom: "Antre de monstre intelligent (dragon, troll)",
      aide: "Un gros magot accumulé depuis longtemps, très varié.",
      richesse: { corps: 0.5, repaire: 3, fin: 3.5 }, gemmes: 1.5, art: 1.5, magie: 1,
      perm: { arme: 30, defense: 25, pouvoir: 14, puissance: 8, competence: 8, baguette: 8, grimoire: 7 },
      conso: { potion: 55, parchemin: 35, projectiles: 10 },
      special: ["victimes"],
      trouvailles: [
        ["Le blason d'un chevalier mort ici, arraché à son bouclier", null],
        ["Des coupes d'or empilées comme des écuelles", 40],
        ["Une couronne d'un royaume oublié", null],
        ["Des sacs de pièces anciennes collées par la moisissure", 20],
        ["Une statue de bronze renversée", 50],
        ["Un coffre de vêtements de soie mités", 10],
        ["Une tapisserie roussie par le feu", 15]
      ]
    },
    {
      id: "elfes-noirs", nom: "Elfes noirs, monde souterrain",
      aide: "Monnaie étrangère, poisons, armes et bijoux exotiques, dangereux à exhiber en surface.",
      richesse: { corps: 1.5, repaire: 1.6, fin: 2 }, gemmes: 1, art: 0.8, magie: 0.9,
      profils: { Sorcier: 3, Ensorceleur: 2, Voleur: 2, Prêtre: 1, Magicien: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 30, defense: 20, pouvoir: 25, baguette: 15, grimoire: 10 },
      conso: { potion: 60, parchemin: 40 },
      special: ["etrangere"],
      origine: { provenance: "Les profondeurs", peuple: "Elfes noirs" },
      trouvailles: [
        ["Une fiole de poison soporifique (3 doses)", 30],
        ["Une carte des tunnels gravée sur une plaque d'os", null],
        ["Un bijou d'argent en forme d'araignée", 25],
        ["Des champignons phosphorescents dans une boîte d'os", 2],
        ["Une cape de soie d'araignée, noire comme l'encre", 20],
        ["Une plaquette gravée en langue des profondeurs", null],
        ["Une chaîne de prisonnier en métal inconnu", 8]
      ]
    },
    {
      id: "fees", nom: "Fées, ombre féérique",
      aide: "Trésors trompeurs : l'or peut redevenir feuilles mortes à l'aube. Objets étranges.",
      richesse: { corps: 0.8, repaire: 1.4, fin: 1.6 }, gemmes: 1, art: 0.6, magie: 1,
      profils: { Ensorceleur: 4, Druide: 3, Barde: 2 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { pouvoir: 40, competence: 25, baguette: 20, puissance: 15 },
      conso: { potion: 70, parchemin: 30 },
      special: ["fees"],
      origine: { provenance: "Un autre plan" },
      trouvailles: [
        ["Un grelot d'argent qui sonne seulement quand on ment", null],
        ["Un flacon de rosée du matin qui ne s'évapore jamais", 10],
        ["Une couronne de fleurs qui ne fane pas", 5],
        ["Une pomme d'or (de vrai or ? à vérifier)", null],
        ["Un miroir de poche qui reflète la pièce avec une heure de retard", null],
        ["Une flûte de roseau taillée par des doigts minuscules", 3],
        ["Un écheveau de fil de lune", 15]
      ]
    },
    {
      id: "sorcier", nom: "Tour de sorcier",
      aide: "Peu d'or, mais des parchemins, des baguettes, un grimoire, des composants.",
      richesse: { corps: 0.8, repaire: 0.8, fin: 1 }, gemmes: 0.8, art: 0.5, magie: 1.4,
      profils: { Magicien: 4, Ensorceleur: 3, Sorcier: 3, Forgesort: 2 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { baguette: 30, grimoire: 25, pouvoir: 25, puissance: 10, defense: 10 },
      conso: { potion: 40, parchemin: 60 },
      special: [],
      trouvailles: [
        ["Un nécessaire d'alchimiste (alambic, cornues, mortier)", 30],
        ["Des composants rares : poudre d'argent, ambre gris, mandragore", 20],
        ["Le journal d'expériences du maître des lieux", null],
        ["Un globe céleste en cuivre", 25],
        ["Une bibliothèque de traités savants", 40],
        ["Une créature empaillée qui semble vous suivre des yeux", null],
        ["Une craie de cercle d'invocation, presque usée", null],
        ["Une correspondance avec un autre mage", null]
      ]
    },
    {
      id: "tombeau", nom: "Tombeau, ruine ancienne",
      aide: "Monnaie et objets d'art d'une autre époque, objets magiques à l'origine ancienne.",
      richesse: { corps: 0.3, repaire: 1.4, fin: 1.8 }, gemmes: 0.8, art: 1.4, magie: 0.9,
      profils: { Prêtre: 2, Sorcier: 2, Chevalier: 2, Magicien: 1, Guerrier: 1 }, // pouvoirs, grimoires, parchemins et baguettes
      perm: { arme: 30, defense: 25, pouvoir: 20, puissance: 15, grimoire: 10 },
      conso: { potion: 30, parchemin: 50, projectiles: 20 },
      special: ["ancienne"],
      origineAncienne: true,
      trouvailles: [
        ["Une urne funéraire scellée", 10],
        ["Un masque mortuaire en feuille d'or", 60],
        ["Des tablettes gravées dans une langue morte", null],
        ["Une armure de cérémonie trop fragile pour combattre", 30],
        ["Une stèle portant le nom d'un roi oublié", null],
        ["Des vases canopes ornés de scènes de bataille", 20],
        ["Un sceptre de bois pourri serti d'une pierre terne", 15]
      ]
    }
  ],

  gemmes: [ // d8 + NC/2
    [1, 2, 5, ["un éclat de quartz fumé", "une agate rubanée", "un morceau d'ambre", "une perle d'eau douce ternie"]],
    [3, 4, 10, ["une cornaline polie", "un jaspe sanguin", "une turquoise veinée", "une malachite"]],
    [5, 6, 25, ["une améthyste en cabochon", "un grenat sombre", "une tourmaline verte", "une perle de mer"]],
    [7, 8, 50, ["un péridot limpide", "une topaze dorée", "un jade sculpté en scarabée", "une opale laiteuse"]],
    [9, 10, 100, ["un saphir pâle", "une émeraude veinée", "un petit rubis", "une perle noire"]],
    [11, 12, 250, ["un saphir étoilé", "un rubis sang-de-pigeon", "une émeraude sans défaut"]],
    [13, 14, 500, ["un diamant de belle eau", "une opale de feu grosse comme un œuf de caille"]],
    [15, 99, 1000, ["un diamant bleu de la taille d'une noix", "un rubis qu'on dit taillé par les nains de Kaer-Ündün"]]
  ],
  objetsArt: [ // d8 + NC/2
    [1, 2, 5, ["un gobelet d'étain gravé", "un peigne en os sculpté", "une statuette de bois peint"]],
    [3, 4, 15, ["une broche de cuivre émaillé", "un jeu de dés en ivoire dans un étui de cuir", "une paire de chandeliers de bronze"]],
    [5, 6, 40, ["une broche d'argent en forme de feuille", "un encrier de cuivre ciselé", "un miroir à main encadré d'argent"]],
    [7, 8, 90, ["un calice d'argent serti de grenats", "une tapisserie roulée figurant une chasse", "une épée d'apparat à la garde dorée"]],
    [9, 10, 200, ["un médaillon au sceau d'une maison noble oubliée", "un coffret d'ébène marqueté de nacre"]],
    [11, 12, 450, ["une couronne d'or fin d'un roitelet", "une icône dorée aux émaux intacts"]],
    [13, 99, 1000, ["une statuette d'or massif d'une divinité ancienne", "une carte sur peau d'un royaume disparu, enluminée d'or"]]
  ]
};

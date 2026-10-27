/* Filtres de cohérence des objets de pouvoir (règles maison).

   Le livre dit qu'un objet de pouvoir reproduit une capacité « dont le MJ pense
   plausible qu'elle puisse être fidèlement reproduite par un objet magique »,
   et que sa forme est « en rapport avec ses capacités » (ex. divination →
   boule de cristal). D'où :
   - EXCLUES : capacités qu'un objet ne peut pas raisonnablement reproduire
     (compagnons et montures, traits de classe, bonus de caractéristique qui
     relèvent des objets de puissance, simples bonus de compétence qui relèvent
     des objets de compétence, savoir-faire, commandement) ;
   - FORMES : formes d'objet proposées pour chaque voie. */

window.FILTRES = {
  exclues: [
    // bonus de caractéristique : ce sont des objets de puissance
    "Constitution héroïque", "Agilité héroïque", "Charisme héroïque", "Force héroïque",
    "Perception héroïque", "Volonté héroïque", "Combattant héroïque",
    // compagnons, montures, créatures liées
    "Le loup", "Travail d’équipe", "Lien empathique", "Loup alpha", "Tactiques de meute",
    "Fidèle monture", "Cavalier émérite", "Écuyer", "Petit compagnon", "Panthère", "Grand félin",
    "Familier", "Grosse tête", "Golem", "Protecteur", "Golem supérieur",
    // traits de classe, pactes, fabrication
    "Bâton de mage", "Artefact étrange", "Armure sur mesure", "Pacte démoniaque", "Pacte ténébreux",
    "Bâton de druide", "Élixirs mineurs", "Élixirs majeurs", "Arme à répétition", "Canon double",
    "Couleuvrine", "Mécanismes", "Tatouages", "Prédicateur", "Pacifisme", "Ascétisme",
    "Dentelles et rapière", "Intelligence du combat", "Attaque en finesse", "Ambidextrie",
    "Armes de prédilection", "Spécialisation", "Science du critique",
    // commandement, statut social
    "Autorité naturelle", "Massacrer la piétaille", "Formation d’élite", "Ordre de bataille",
    "Exemplaire", "Éduqué", "Combat de masse",
    // savoir-faire et bonus de compétence : objets de compétence
    "Pilier de bar", "Mort ou vif", "Rumeurs et légendes", "Éclectique", "Attirail", "Survie",
    "Maître de la survie", "Expert en criminalité", "Doigts agiles", "Baratin", "Baratineur de génie",
    "Charmant", "Discrétion", "Acrobate", "Agile", "Éclaireur", "Chasseur émérite", "Archer émérite",
    "Joli coup", "Tireur d’élite", "Lanceur de couteau", "Maître du poison", "Proche de la nature",
    "Teigneux",
    // endurance brute : objets de puissance mineurs (PV, DR)
    "Vigueur", "Robustesse", "Résilient", "Armure lourde", "Dur à cuire", "Résistant",
    "Increvable", "Vitalité débordante"
  ],

  formes: {
    "voie de l’artilleur": ["lunette de visée en laiton", "rouage enchanté à fixer sur une arme"],
    "voie des explosifs": ["bandoulière de cartouches", "poire à poudre gravée"],
    "voie du mercenaire": ["médaille de compagnie franche", "ceinturon de cuir clouté"],
    "voie du pistolero": ["étui de pistolet", "gant de tireur"],
    "voie de la précision": ["monocle de tireur", "bague de visée"],
    "voie de l’escrime": ["gant d'escrimeur", "plume de chapeau de duelliste"],
    "voie du musicien": ["luth", "flûte d'os", "cor d'argent", "tambourin"],
    "voie du saltimbanque": ["chaussons d'acrobate", "foulard de soie"],
    "voie de la séduction": ["broche en camée", "flacon de parfum inépuisable"],
    "voie du vagabond": ["bâton de pèlerin", "chapeau de voyageur", "masque de théâtre"],
    "voie de l’archer": ["carquois", "brassard d'archer", "corde d'arc tressée de cheveux elfiques"],
    "voie de la survie": ["bottes de marche", "gourde de cuir", "cape de voyage"],
    "voie du traqueur": ["collier de griffes", "cape de chasseur"],
    "voie du combat à deux armes": ["paire de bracelets jumeaux", "baudrier à deux fourreaux"],
    "voie du compagnon animal": ["sifflet d'os", "collier de chasse"],
    "voie de l’assassin": ["capuche noire", "anneau à chaton creux", "gants de soie"],
    "voie de l’aventurier": ["bottes souples", "chapeau à plume"],
    "voie du déplacement": ["bottes de cuir fin", "bracelets de cheville"],
    "voie du roublard": ["gants de velours", "bourse sans fond apparent"],
    "voie du spadassin": ["main gauche de parade", "cape de duelliste"],
    "voie de la brute": ["gantelets cloutés", "torque de bronze"],
    "voie du pagne": ["peau de bête", "collier de crocs"],
    "voie du pourfendeur": ["torque de guerrier", "brassards de fer"],
    "voie du primitif": ["fétiche de plumes", "collier de pierres de rivière"],
    "voie de la rage": ["cor de guerre", "masque de berserk", "peinture de guerre en pot"],
    "voie du cavalier": ["éperons d'argent", "figurine de cheval", "bride enchantée"],
    "voie de la guerre": ["tabard de croisé", "heaume à cimier"],
    "voie du héros": ["médaillon héraldique", "étendard personnel"],
    "voie du meneur d’hommes": ["bannière de compagnie", "cor de ralliement"],
    "voie de la noblesse": ["chevalière", "manteau d'apparat"],
    "voie du bouclier": ["bouclier", "umbo de bouclier enchanté"],
    "voie du combat": ["brassards de combat", "ceinture de lutteur"],
    "voie du maître d’armes": ["pierre à aiguiser runique", "fourreau enchanté"],
    "voie de la résistance": ["plastron", "talisman de fer"],
    "voie du soldat": ["casque de vétéran", "plaque d'identité de légion"],
    "voie de l’air": ["plume de roc", "éventail", "anneau de vent"],
    "voie de la divination": ["boule de cristal", "jeu de tarots", "œil de verre"],
    "voie de l’envoûteur": ["pendule d'argent", "anneau à pierre violette"],
    "voie des illusions": ["miroir de poche", "masque de soie", "prisme de cristal"],
    "voie de l’invocation": ["baguette d'ébène", "anneau de mana"],
    "voie des artefacts": ["clé de bronze", "sacoche de cuir", "bâton gravé"],
    "voie des élixirs": ["fiole qui se remplit chaque aube", "alambic de poche"],
    "voie du métal": ["marteau de forge", "gantelet d'acier", "enclume miniature"],
    "voie du golem": ["statuette d'argile", "cœur de bronze"],
    "voie des runes": ["pierre runique", "bracelet runique"],
    "voie de la magie des arcanes": ["baguette de cristal", "orbe de mana"],
    "voie de la magie destructrice": ["bâton calciné", "anneau de braise"],
    "voie de la magie élémentaire": ["orbe élémentaire", "pierre de foudre"],
    "voie de la magie protectrice": ["amulette de protection", "cape brodée de sceaux"],
    "voie de la magie universelle": ["anneau d'argent", "chapeau pointu", "bâton de marche"],
    "voie du démon": ["crâne cornu", "anneau de fer noir", "idole démoniaque"],
    "voie de la mort": ["faux miniature", "crâne gravé", "linceul"],
    "voie de l’outre‑tombe": ["main de gloire", "sceptre d'os", "cloche funéraire"],
    "voie du sang": ["dague rituelle", "calice de sang séché", "fiole de sang"],
    "voie de la sombre magie": ["cape d'ombre", "lanterne qui éteint la lumière"],
    "voie des animaux": ["sifflet d'os", "masque de bête", "collier de plumes"],
    "voie du fauve": ["griffes de félin montées en collier", "peau de panthère"],
    "voie de la nature": ["gland de chêne doré", "sandales de lierre"],
    "voie du protecteur": ["couronne de feuillage", "graine scellée dans l'ambre"],
    "voie des végétaux": ["bâton de bois vivant", "semis de ronces en sachet"],
    "voie de l’énergie vitale": ["bandelettes de mains", "perles de prière"],
    "voie de la maîtrise": ["ceinture de soie", "bracelets de jade"],
    "voie de la méditation": ["bol chantant", "chapelet de bois"],
    "voie du poing": ["gants de cuir lestés", "bandeau de front"],
    "voie du vent": ["sandales légères", "écharpe de soie"],
    "voie de la foi": ["symbole sacré", "livre de psaumes", "reliquaire"],
    "voie de la guerre sainte": ["masse bénie", "tabard sacré", "bouclier frappé d'un symbole"],
    "voie de la prière": ["chapelet", "encensoir", "icône de bois"],
    "voie des soins": ["bandages bénis", "coupe de communion", "baume en pot"],
    "voie de la spiritualité": ["étole sacrée", "clochette d'argent", "bâton de pèlerin"]
  }
};

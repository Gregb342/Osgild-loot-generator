/* Objets exotiques : RÈGLE MAISON, HORS RÈGLES DU LIVRE.
   Des objets aux effets originaux, narratifs, à double tranchant ou
   carrément fous, toujours liés à une puissance des Terres d'Osgild
   (divinités de l'Atlas, Puissances, saisons, Seigneurs des animaux,
   Roi-Sorcier, ombre féérique). L'effet découle du domaine du patron.

   Garde-fou : pas de bonus chiffré permanent en combat ; au plus un dé
   bonus ou malus dans une situation précise, ou un effet narratif.

   Effet : { n: complément du nom, f: formes, t: effet, a: arbitrage, u: usages,
             v: visible tout de suite ?, table: [effets aléatoires] (facultatif) }
   Patron : { nom, dom: domaine, ton: lumineux | neutre | sombre | fou,
              signes: indices sensoriels, sources: affinités, effets } */

window.EXOTIQUES = {
  patrons: [
    /* ---------- divinités protectrices ou neutres ---------- */
    { id: "arcanna", nom: "Arcanna", dom: "déesse de la magie blanche", ton: "lumineux", sources: ["sorcier", "culte"],
      signes: ["une étoile à huit branches gravée, qui brille faiblement dans le noir", "il sent l'ozone et la craie"],
      effets: [
        { n: "qui éteint les sorts", f: ["bougie de cire blanche", "étoile de verre"], t: "Allumée (ou brisée, pour l'étoile), elle dissipe tout effet magique de rang 1 ou 2 dans une pièce, y compris ceux des PJ.", a: "Les effets de rang 3 et plus résistent sur un test d'attaque magique de leur lanceur difficulté 15.", u: "Une fois, puis la bougie est consumée.", v: false },
        { n: "du sort oublié", f: ["marque-page d'argent", "plume d'oie"], t: "Glissé dans un grimoire, il permet à un lanceur de sorts de relancer une fois par jour le dernier sort qu'il a lancé, sans dépenser de PM.", a: "Mais il oublie aussitôt un autre de ses sorts (au choix du MJ) jusqu'à sa prochaine récupération complète.", u: "Une fois par jour.", v: false }
      ] },
    { id: "arshran", nom: "Arshran", dom: "dieu du feu et des forgerons", ton: "neutre", sources: ["geants", "marchands", "armee"],
      signes: ["une enclume minuscule en relief, toujours tiède", "il sent la forge et le charbon"],
      effets: [
        { n: "qui ne refroidit jamais", f: ["pince de forgeron", "lingot de fer rouge"], t: "Toujours brûlant au cœur, froid au toucher : il permet de forger sans feu, de souder une chaîne ou de réparer une arme en une heure.", a: "Un test d'artisanat réussi (difficulté 10) répare n'importe quel objet métallique abîmé.", u: "À volonté.", v: true },
        { n: "du compagnon", f: ["tablier de cuir", "gants de forgeron"], t: "Celui qui le porte n'est jamais blessé par le feu de forge ni le métal en fusion, et sent d'instinct le défaut caché d'une lame.", a: "Dé bonus pour évaluer une arme ou une armure ; ne protège pas d'un feu magique ou de combat.", u: "Permanent.", v: false }
      ] },
    { id: "arwendee", nom: "Arwendée", dom: "déesse de la chasse et des archers", ton: "neutre", sources: ["betes", "betes-magiques", "bandits"],
      signes: ["une flèche gravée dont la pointe suit toujours le nord", "une odeur de fougère et de sang frais"],
      effets: [
        { n: "qui rapporte", f: ["flèche à l'empennage vert", "carquois de cuir"], t: "Une flèche tirée revient se ficher dans le carquois à la fin du round, qu'elle ait touché ou non.", a: "Une seule flèche concernée ; si elle est brisée, elle ne revient pas.", u: "À volonté.", v: true },
        { n: "du dernier gibier", f: ["cor de chasse en corne", "collier de crocs"], t: "Sonné, il révèle dans quelle direction se trouve la créature la plus dangereuse à un kilomètre à la ronde.", a: "La créature, elle, entend aussi le cor.", u: "Une fois par jour.", v: false }
      ] },
    { id: "aurilla", nom: "Aurilla", dom: "déesse de la chance et des aventuriers", ton: "fou", sources: ["bandits", "faussaires", "marchands"],
      signes: ["un dé à six faces incrusté, dont la face visible change quand on ne regarde pas", "un léger bruit de dés qui roulent"],
      effets: [
        { n: "du coup de chance", f: ["dé d'os", "pièce à deux faces identiques"], t: "Lancé avant un test, il donne un résultat qui remplace le d20 du test.", a: "Lancez 1d6 : 1 = 1 naturel, 2-3 = 5, 4-5 = 15, 6 = 20 naturel. Le joueur doit choisir de l'utiliser avant de lancer.", u: "Une fois par jour.", v: false },
        { n: "de l'aventurier", f: ["trèfle séché sous verre", "fer à cheval tordu"], t: "Le porteur se retrouve toujours, comme par hasard, sur le chemin de l'aventure : les ennuis le trouvent, les occasions aussi.", a: "Une fois par séance, le MJ peut provoquer une coïncidence, bonne ou mauvaise, autour du porteur ; en échange, le porteur gagne 1 PC.", u: "Permanent.", v: false }
      ] },
    { id: "axender", nom: "Axënder", dom: "dieu du devoir et de l'honneur", ton: "lumineux", sources: ["soldats", "tombeau"],
      signes: ["un heaume gravé, poli par des générations de mains", "il semble plus lourd quand on ment en le tenant"],
      effets: [
        { n: "du serment tenu", f: ["chevalière", "écharpe de commandement"], t: "Une promesse faite en le tenant pèse sur l'âme : celui qui la rompt le sait aussitôt, et tous ceux qui étaient présents le sentent.", a: "Le parjure subit un dé malus à tous ses tests jusqu'à ce qu'il répare sa faute ou fasse amende honorable.", u: "Permanent.", v: false },
        { n: "du dernier rempart", f: ["étendard plié", "cor d'argent"], t: "Planté ou sonné quand le groupe est en déroute, il permet à chaque allié qui l'entend de relancer un test raté de peur ou de moral.", a: "Si le porteur fuit ensuite le combat, l'objet perd son pouvoir pour toujours.", u: "Une fois par jour.", v: false }
      ] },
    { id: "basile", nom: "Basile", dom: "dieu de la gourmandise et de la nourriture", ton: "fou", sources: ["marchands", "pillards", "geants"],
      signes: ["un chou sculpté, qui sent toujours le pain chaud", "des taches de graisse qui reviennent quand on les essuie"],
      effets: [
        { n: "qui rend tout délicieux", f: ["cuillère en bois", "poivrière d'étain", "louche"], t: "Tout ce qu'on remue ou assaisonne avec devient délicieux, même avarié, même du cuir bouilli.", a: "Ne rend pas comestible ce qui est empoisonné ; mais personne ne sent plus le goût du poison (test de PER difficulté 20 pour le remarquer).", u: "À volonté.", v: false },
        { n: "du banquet", f: ["nappe brodée", "marmite cabossée"], t: "Étalée ou posée sur le feu, elle sert un festin pour six, chaud et copieux.", a: "Un convive qui en mange trop (le MJ décide) s'endort lourdement pendant une heure.", u: "Une fois par jour.", v: false }
      ] },
    { id: "ceres", nom: "Céres", dom: "dieu de l'agriculture et du travail", ton: "lumineux", sources: ["marchands", "pillards"],
      signes: ["un épi de blé gravé, avec un grain de vrai blé pris dans le métal", "une odeur de foin coupé"],
      effets: [
        { n: "de la récolte", f: ["faucille", "sac de semences"], t: "Ce qu'on plante avec germe en une nuit et donne une récolte en trois jours.", a: "Seulement en pleine terre, et pas plus d'un champ par saison : la terre s'épuise ensuite pour un an.", u: "Une fois par saison.", v: false },
        { n: "du labeur", f: ["bracelet de corde tressée", "gourde de paysan"], t: "Celui qui le porte peut travailler deux jours d'affilée sans fatigue ni sommeil.", a: "Ensuite, il dort une journée entière et ne peut être réveillé.", u: "Une fois par semaine.", v: false }
      ] },
    { id: "denora", nom: "Dénora", dom: "déesse de la compassion et de la guérison", ton: "lumineux", sources: ["culte"],
      signes: ["une main ouverte en relief, chaude comme une paume", "on se sent apaisé en le tenant"],
      effets: [
        { n: "qui partage la douleur", f: ["paire de bracelets jumeaux", "ruban rouge"], t: "Deux personnes qui portent chacune un bracelet se partagent les DM : chacune en subit la moitié, arrondie au supérieur.", a: "Les états préjudiciables (empoisonné, affaibli…) sont aussi partagés.", u: "Permanent tant que les deux le portent.", v: false },
        { n: "de la dernière veille", f: ["lanterne de chevet", "chapelet de bois"], t: "Allumée au chevet d'un mourant, elle le maintient en vie jusqu'à l'aube, quelles que soient ses blessures.", a: "Il ne peut ni agir ni parler, mais il reste en vie ; à l'aube, il faut l'avoir soigné.", u: "Une fois par semaine.", v: false }
      ] },
    { id: "ellona", nom: "Ellona", dom: "déesse de la perception et de la vérité", ton: "neutre", sources: ["culte", "sorcier", "faussaires"],
      signes: ["un œil gravé dont la pupille suit celui qui le regarde", "il est désagréable de le regarder en mentant"],
      effets: [
        { n: "qui ne ment pas", f: ["miroir de poche", "lunettes de verre bleu"], t: "On y voit les gens tels qu'ils sont : déguisements, illusions et maquillages disparaissent dans le reflet.", a: "Les illusions de rang 3 et plus se voient en transparence, sans disparaître.", u: "À volonté.", v: false },
        { n: "de l'aveu", f: ["sablier de verre", "cloche de bronze"], t: "Tant que le sable coule (une minute), personne à portée de voix ne peut dire un mensonge à voix haute ; il peut se taire.", a: "Le porteur aussi est soumis à l'effet.", u: "Une fois par jour.", v: false }
      ] },
    { id: "forthur", nom: "Forthur", dom: "dieu du courage et des exploits", ton: "lumineux", sources: ["soldats", "geants", "armee"],
      signes: ["un poing fermé en relief, éraflé comme après une bagarre", "il pèse plus lourd devant un défi"],
      effets: [
        { n: "du défi relevé", f: ["ceinturon clouté", "brassard de cuir"], t: "Quand le porteur affronte seul un adversaire de NC supérieur à son niveau, il obtient un dé bonus aux tests de FOR.", a: "S'il refuse un défi lancé en public, l'objet le serre douloureusement : 1 DM par heure jusqu'à ce qu'il le relève.", u: "Permanent.", v: false },
        { n: "du récit", f: ["coupe de bronze", "corne à boire"], t: "Celui qui y boit en racontant un exploit vrai voit son récit croire de tous, et sa réputation grandir dans la région.", a: "Si l'exploit est inventé, la boisson tourne au vinaigre et tout le monde le sait.", u: "Une fois par jour.", v: false }
      ] },
    { id: "gaelm", nom: "Gaëlm", dom: "dieu des arts et des artistes", ton: "lumineux", sources: ["marchands", "fees"],
      signes: ["une lyre gravée dont les cordes vibrent toutes seules", "un fredonnement à la limite de l'audible"],
      effets: [
        { n: "qui joue tout seul", f: ["flûte de roseau", "violon sans archet"], t: "Il joue seul, sur demande, n'importe quel air entendu au moins une fois par son porteur.", a: "Il joue aussi parfois sans qu'on le lui demande, au pire moment (1 chance sur 6 lors d'une scène de discrétion).", u: "À volonté.", v: true },
        { n: "du chef-d'œuvre", f: ["pinceau", "burin de sculpteur"], t: "Une œuvre réalisée avec ce pinceau en une nuit est d'une beauté qui fait pleurer, et peut se vendre comme un objet d'art de 100 à 500 pa.", a: "L'artiste y laisse un souvenir heureux qu'il ne retrouvera jamais.", u: "Une fois par mois.", v: false }
      ] },
    { id: "gorom", nom: "Gorom", dom: "dieu de la pierre et des architectes", ton: "neutre", sources: ["geants", "tombeau", "elfes-noirs"],
      signes: ["un marteau de maçon gravé, couvert de poussière de pierre", "il est froid et sec comme une cave"],
      effets: [
        { n: "qui lit les murs", f: ["fil à plomb", "équerre de bronze"], t: "Posé contre un mur, il révèle les passages secrets, les fissures et les pièges de la pièce.", a: "Dé bonus à tout test pour chercher un passage ou un piège dans une construction de pierre.", u: "À volonté.", v: false },
        { n: "de la porte", f: ["craie grise", "truelle"], t: "Une porte dessinée sur un mur de pierre devient réelle et s'ouvre sur l'autre côté (1 mètre d'épaisseur au plus), le temps de passer.", a: "La porte se referme après le dernier passage et laisse un dessin indélébile.", u: "Une fois par jour.", v: false }
      ] },
    { id: "guardal", nom: "Guardal", dom: "dieu de la loyauté et des gardiens", ton: "lumineux", sources: ["soldats", "marchands"],
      signes: ["un bouclier rond en relief, cabossé", "il vibre quand quelqu'un s'approche de son porteur endormi"],
      effets: [
        { n: "qui veille", f: ["clochette de bronze", "chien de bronze miniature"], t: "Posé près d'un campement, il sonne ou aboie dès qu'une créature hostile approche à moins de 30 m.", a: "Il ne fait pas la différence entre un ennemi et un allié qui revient en colère.", u: "À volonté.", v: false },
        { n: "du compagnon fidèle", f: ["paire de médaillons", "anneaux jumeaux"], t: "Les deux porteurs sentent si l'autre est en danger et dans quelle direction il se trouve, à n'importe quelle distance.", a: "Si l'un trahit l'autre, les deux médaillons se brisent.", u: "Permanent.", v: false }
      ] },
    { id: "irrion", nom: "Irrion", dom: "dieu de l'ordre et de la noblesse", ton: "neutre", sources: ["soldats", "tombeau", "marchands"],
      signes: ["une épée dressée gravée, entourée d'une couronne", "il paraît toujours propre et lustré"],
      effets: [
        { n: "du rang", f: ["chevalière armoriée", "cape bordée d'hermine"], t: "Le porteur est pris pour un noble par tous ceux qui ne le connaissent pas : on le salue, on lui ouvre les portes.", a: "Dé bonus aux tests de CHA auprès des gens du peuple ; dé malus auprès des vrais nobles, qui flairent l'imposture (test de PER difficulté 15).", u: "Permanent.", v: false },
        { n: "de la préséance", f: ["sceptre d'apparat", "parchemin scellé"], t: "Présenté à un garde, un huissier ou un fonctionnaire, il impose qu'on laisse passer le porteur sans poser de question.", a: "Ne marche qu'une fois par personne ; la deuxième fois, elle se souvient qu'on ne lui a jamais montré de papiers.", u: "Une fois par jour.", v: false }
      ] },
    { id: "jeweln", nom: "Jeweln", dom: "dieu des souterrains et des mineurs", ton: "neutre", sources: ["geants", "elfes-noirs", "antre"],
      signes: ["une pioche gravée, avec de la poussière de minerai dans les rainures", "il tinte comme une veine de métal qu'on frappe"],
      effets: [
        { n: "qui sent le filon", f: ["pioche miniature", "pendule de pyrite"], t: "Il oscille vers le métal précieux ou la gemme la plus proche, dans un rayon de 100 m.", a: "Il ne distingue pas un filon d'un trésor enterré… ni d'une bourse dans la poche d'un passant.", u: "À volonté.", v: false },
        { n: "du canari", f: ["cage à oiseau vide", "lanterne de mineur"], t: "Sa flamme vire au bleu en présence de gaz, et au rouge quand la roche va s'effondrer.", a: "Prévient d'un éboulement ou d'un gaz une minute à l'avance.", u: "Permanent.", v: false }
      ] },
    { id: "linnarre", nom: "Linnarré", dom: "déesse de la mer et des marins", ton: "neutre", sources: ["marchands", "betes-magiques"],
      signes: ["un coquillage gravé d'où on entend la mer", "il est toujours un peu humide et salé"],
      effets: [
        { n: "de la marée", f: ["conque", "boussole sans aiguille"], t: "Soufflée, la conque fait se lever un vent favorable pour un navire pendant une journée.", a: "En mer seulement ; souffler deux fois le même jour attire une tempête.", u: "Une fois par jour.", v: false },
        { n: "du noyé", f: ["perle noire", "anneau de corail"], t: "Le porteur peut respirer sous l'eau tant qu'il garde la perle en bouche.", a: "Il ne peut pas parler pendant ce temps, ni lancer de sort à composante verbale.", u: "À volonté.", v: false }
      ] },
    { id: "melenna", nom: "Mélenna", dom: "déesse des forêts et des animaux", ton: "lumineux", sources: ["betes", "fees", "betes-magiques"],
      signes: ["un arbre gravé dont les racines forment des lettres", "des oiseaux viennent se poser près de lui"],
      effets: [
        { n: "qui parle aux bêtes", f: ["sifflet de bois", "plume de geai"], t: "Le porteur comprend le langage des animaux d'une espèce (tirée au hasard ou choisie par le MJ) et peut lui parler.", a: "Les animaux ne disent que ce qui les intéresse : nourriture, danger, territoire.", u: "À volonté.", v: false },
        { n: "de la forêt", f: ["gland d'or", "couronne de lierre"], t: "Planté, le gland fait pousser en une minute un buisson épais capable de cacher quatre personnes.", a: "Dé bonus aux tests de discrétion à l'intérieur ; le buisson reste, et ne peut plus être arraché.", u: "Une fois.", v: false }
      ] },
    { id: "mirandia", nom: "Mirandia", dom: "déesse du sommeil et des rêves", ton: "lumineux", sources: ["fees", "culte"],
      signes: ["une demi-lune gravée qui luit doucement la nuit", "on bâille en le tenant"],
      effets: [
        { n: "des rêves partagés", f: ["oreiller de plume", "attrape-rêves"], t: "Deux personnes qui dorment dessus la même nuit font le même rêve et peuvent s'y parler.", a: "Un rêveur peut y voir un souvenir de l'autre, s'il réussit un test de VOL difficulté 15.", u: "Une fois par nuit.", v: false },
        { n: "du sommeil sans rêve", f: ["clochette d'argent", "fiole de rosée"], t: "Agitée au chevet d'un dormeur, elle lui offre une nuit parfaite : il récupère comme après deux récupérations complètes.", a: "Une secousse le réveille ; celui qui en abuse (plus d'une fois par semaine) ne rêve plus du tout et devient irritable.", u: "Une fois par semaine.", v: false }
      ] },
    { id: "mondovael", nom: "Möndovaël", dom: "dieu des nomades et du voyage", ton: "neutre", sources: ["marchands", "bandits"],
      signes: ["une botte gravée, usée au talon", "de la poussière de route qui ne part pas"],
      effets: [
        { n: "qui connaît le chemin", f: ["boussole", "bâton de marche"], t: "Il indique toujours la route la plus courte vers le dernier endroit où le porteur a dormi.", a: "La plus courte, pas la plus sûre.", u: "À volonté.", v: false },
        { n: "des lieues", f: ["paire de bottes", "sandales"], t: "Le porteur peut marcher une journée entière sans fatigue et parcourt la distance d'un jour et demi.", a: "Le soir, ses pieds le font tellement souffrir qu'il subit un dé malus aux tests d'AGI jusqu'au matin.", u: "Une fois par jour.", v: false }
      ] },
    { id: "morn", nom: "Morn", dom: "dieu de la mort et du passage dans l'au-delà", ton: "sombre", sources: ["tombeau", "culte"],
      signes: ["une faux gravée, froide comme la pierre d'un tombeau", "les chandelles vacillent quand on l'approche"],
      effets: [
        { n: "des dernières paroles", f: ["pièce d'obole", "cloche funéraire"], t: "Posée sur les yeux d'un mort de moins d'un jour, elle lui permet de répondre à trois questions.", a: "Le mort ne dit que ce qu'il savait de son vivant, et peut mentir s'il en voulait aux vivants.", u: "Une fois par cadavre.", v: false },
        { n: "du passeur", f: ["lanterne noire", "rame miniature"], t: "Elle montre au porteur le chemin qu'emprunte l'âme d'un mort récent : il peut ainsi retrouver son corps, ou son assassin.", a: "Pendant ce temps, le porteur entend les morts du voisinage, et doit réussir un test de VOL difficulté 12 pour ne pas être affaibli une heure.", u: "Une fois par jour.", v: false }
      ] },
    { id: "orbis", nom: "Orbis", dom: "dieu du commerce et des marchands", ton: "neutre", sources: ["marchands", "faussaires"],
      signes: ["une pièce d'or gravée, à l'effigie d'un roi inconnu", "un léger tintement de monnaie quand on le secoue"],
      effets: [
        { n: "du juste prix", f: ["balance de changeur", "boulier"], t: "Il donne la valeur réelle de n'importe quel objet posé dessus, magie comprise.", a: "Il donne la valeur, pas la nature : on sait qu'une épée vaut 800 po, pas pourquoi.", u: "À volonté.", v: false },
        { n: "du marchandage", f: ["bourse de cuir", "chevalière de guilde"], t: "Pendant une négociation, le porteur sait toujours le prix maximal que l'autre est prêt à payer.", a: "Dé bonus aux tests pour marchander ; mais la bourse prélève une pièce sur chaque transaction, et la garde.", u: "Permanent.", v: false }
      ] },
    { id: "oumaros", nom: "Oumaros", dom: "dieu de l'air et des cieux", ton: "neutre", sources: ["sorcier", "antre"],
      signes: ["un nuage gravé qui semble bouger", "il est plus léger par grand vent"],
      effets: [
        { n: "du temps qu'il fera", f: ["girouette miniature", "plume de faucon"], t: "Il annonce le temps des trois prochains jours avec exactitude.", a: "Une fois par mois, on peut lui demander de changer le temps du lendemain (pluie, soleil, brouillard, vent).", u: "À volonté ; une fois par mois pour changer le temps.", v: false },
        { n: "de la plume", f: ["cape grise", "anneau de nuage"], t: "Le porteur ne pèse presque rien : il ne déclenche plus les plaques de pression et marche sur la neige fraîche sans laisser de traces.", a: "Par grand vent, il doit réussir un test de FOR difficulté 12 pour ne pas être emporté.", u: "Permanent.", v: false }
      ] },
    { id: "perinde", nom: "Perinde", dom: "déesse de la fertilité et des mères", ton: "lumineux", sources: ["culte", "fees"],
      signes: ["une silhouette de femme enceinte gravée, tiède", "une odeur de lait et de miel"],
      effets: [
        { n: "du berceau", f: ["hochet", "couverture d'enfant"], t: "Un enfant qui dort à côté est protégé : aucune créature mal intentionnée ne peut entrer dans la pièce sans réussir un test de VOL difficulté 15.", a: "Ne protège que les enfants, et que pendant leur sommeil.", u: "Permanent.", v: false },
        { n: "de la terre féconde", f: ["sachet de graines", "statuette de terre cuite"], t: "Enterré dans un champ ou un jardin, il double la récolte de l'année.", a: "Le voler à quelqu'un qui en a besoin attire la colère de la déesse (au MJ de voir).", u: "Une fois par an.", v: false }
      ] },
    { id: "selenne", nom: "Sélenne", dom: "déesse de la paix et de la liberté", ton: "lumineux", sources: ["culte", "faussaires"],
      signes: ["un oiseau blanc gravé, ailes ouvertes", "on n'a pas envie de se battre en le tenant"],
      effets: [
        { n: "qui brise les chaînes", f: ["clé d'os", "plume blanche"], t: "Elle ouvre n'importe quelle chaîne, menotte ou serrure de cachot, mais aucune autre serrure.", a: "Elle libère aussi d'un esclavage magique (Injonction, Domination) sur un test de VOL réussi difficulté 12.", u: "Une fois par jour.", v: false },
        { n: "de la trêve", f: ["drapeau blanc", "rameau d'olivier d'argent"], t: "Brandi, il impose une trêve d'une minute : personne ne peut attaquer le premier sans réussir un test de VOL difficulté 15.", a: "Celui qui rompt la trêve subit un dé malus jusqu'à la fin du combat.", u: "Une fois par jour.", v: true }
      ] },
    { id: "solar", nom: "Solar", dom: "dieu de la lumière et du savoir", ton: "lumineux", sources: ["sorcier", "culte", "tombeau"],
      signes: ["un soleil gravé qui réchauffe la paume", "il éclaire faiblement tout seul"],
      effets: [
        { n: "du savoir oublié", f: ["loupe", "plume d'or"], t: "Lue à travers la loupe, une écriture inconnue devient compréhensible.", a: "Ne fonctionne pas sur les écrits magiques (parchemins, grimoires) ni les codes secrets.", u: "À volonté.", v: false },
        { n: "de l'aube", f: ["lanterne", "miroir rond"], t: "Elle projette une vraie lumière du jour, qui affecte les créatures sensibles au soleil comme le soleil lui-même.", a: "Visible à des kilomètres dans la nuit.", u: "Une heure par jour.", v: true }
      ] },
    { id: "suelle", nom: "Suëlle", dom: "déesse de la beauté et de l'amour", ton: "neutre", sources: ["marchands", "fees", "faussaires"],
      signes: ["un cœur gravé, rose et chaud", "un parfum de rose qui reste sur les mains"],
      effets: [
        { n: "du coup de foudre", f: ["flacon de parfum", "peigne d'ivoire"], t: "La première personne qui croise le regard du porteur après usage tombe sous son charme pour une heure.", a: "Test de VOL difficulté 15 pour résister ; la personne se souvient de tout ensuite, et n'apprécie pas.", u: "Une fois par jour.", v: false },
        { n: "du reflet flatteur", f: ["miroir à main", "poudre de riz"], t: "Le porteur paraît plus beau qu'il n'est aux yeux de tous, mais ne se reconnaît plus dans les miroirs.", a: "Dé bonus aux tests de CHA de séduction ; dé malus aux tests pour se déguiser (son vrai visage revient toujours).", u: "Permanent.", v: false }
      ] },
    { id: "trenner", nom: "Trenner", dom: "dieu du temps et des ancêtres", ton: "neutre", sources: ["tombeau", "sorcier", "culte"],
      signes: ["un sablier gravé dont le sable coule vers le haut", "un léger tic-tac, sans mécanisme"],
      effets: [
        { n: "des ancêtres", f: ["médaillon à portrait", "bague de famille"], t: "Le porteur peut poser une question à l'esprit d'un ancêtre ; il répond en rêve la nuit suivante.", a: "L'ancêtre a son caractère, et ses rancunes de famille.", u: "Une fois par semaine.", v: false },
        { n: "de l'instant de trop", f: ["montre de gousset", "sablier de poche"], t: "Retourné, il permet de rejouer les six dernières secondes : le porteur annule son action et en choisit une autre.", a: "Le porteur vieillit d'un an à chaque usage, et le sable ne remonte qu'à la pleine lune.", u: "Une fois par mois.", v: false }
      ] },
    { id: "tulsadum", nom: "Tulsadüm", dom: "dieu de la jungle et des reptiles", ton: "neutre", sources: ["betes", "betes-magiques"],
      signes: ["un serpent gravé qui se mord la queue", "il est tiède et humide comme une serre"],
      effets: [
        { n: "de la mue", f: ["bracelet d'écailles", "collier de dents de serpent"], t: "Une fois par jour, le porteur peut abandonner sa peau comme un serpent : il se libère d'une prise, d'une corde ou de filets.", a: "Il perd 1d4 PV et laisse derrière lui une mue parfaite, troublante, de lui-même.", u: "Une fois par jour.", v: false },
        { n: "du sang froid", f: ["pierre plate", "anneau de jade"], t: "Le porteur ne craint ni la chaleur de la jungle ni le venin des serpents ordinaires.", a: "Par temps froid, il devient lent et engourdi : dé malus aux tests d'AGI.", u: "Permanent.", v: false }
      ] },
    { id: "tyriolith", nom: "Tyriolith", dom: "dieu du combat contre le chaos et du feu purificateur", ton: "lumineux", sources: ["culte", "soldats"],
      signes: ["une flamme gravée qui ne s'éteint jamais tout à fait", "il brûle légèrement les créatures du chaos qui le touchent"],
      effets: [
        { n: "qui purifie", f: ["brasero de poche", "encensoir"], t: "Sa fumée chasse la corruption : un objet maudit ou souillé posé dedans une nuit en ressort purifié.", a: "Un objet vraiment maléfique (MJ) fond à la place, et son esprit peut s'en échapper.", u: "Une fois par semaine.", v: false },
        { n: "du flair", f: ["chapelet de fer", "torche éternelle"], t: "La flamme vire au violet en présence d'un démon, d'un mort-vivant ou d'une mutation, à moins de 20 m.", a: "Elle ne dit pas qui, ni combien.", u: "Permanent.", v: true }
      ] },
    { id: "vorona", nom: "Vorona", dom: "déesse de la justice et de la loi", ton: "neutre", sources: ["soldats", "faussaires"],
      signes: ["une balance gravée, parfaitement équilibrée", "il pèse plus lourd dans la main d'un coupable"],
      effets: [
        { n: "du jugement", f: ["balance de bronze", "plume de juge"], t: "Posée entre deux versions d'une même histoire, elle penche du côté de la plus vraie.", a: "Elle juge la sincérité, pas les faits : un témoin honnête mais trompé fait aussi pencher la balance.", u: "Une fois par jour.", v: false },
        { n: "de la dette", f: ["sceau de cire", "lettre de créance"], t: "Un contrat scellé avec lie vraiment les deux parties : celui qui ne l'honore pas en perd le sommeil.", a: "Le fautif ne récupère plus de PV en récupération complète tant qu'il n'a pas payé sa dette.", u: "Une fois par contrat.", v: false }
      ] },

    /* ---------- divinités maléfiques ou discrètes ---------- */
    { id: "abalath", nom: "Abalath", dom: "dieu des complots et de la vengeance", ton: "sombre", sources: ["bandits", "faussaires", "culte"],
      signes: ["une dague gravée sur la face cachée", "il est glacé, et on a l'impression d'être observé"],
      effets: [
        { n: "de la rancune", f: ["carnet noir", "dague à lame noire"], t: "Un nom écrit dans le carnet ne peut plus se cacher du porteur : il sent toujours dans quelle direction se trouve cette personne.", a: "Tant que la vengeance n'est pas accomplie, le porteur ne peut pas récupérer de PC.", u: "Un nom à la fois.", v: false },
        { n: "du murmure", f: ["coquillage noir", "boucle d'oreille"], t: "Le porteur entend tout ce qui se dit de lui dans un rayon de 30 m, même à voix basse.", a: "Il ne peut pas ne pas entendre ; dans une foule, test de VOL difficulté 12 ou il est affaibli par le vacarme.", u: "Permanent.", v: false }
      ] },
    { id: "agag", nom: "Agag", dom: "dieu du chaos primordial et des mutations", ton: "fou", sources: ["sorcier", "pillards", "antre", "fees"],
      signes: ["un arc-en-ciel gravé dont les couleurs ne sont jamais dans le même ordre", "il change légèrement de forme d'un jour à l'autre"],
      effets: [
        { n: "aux mille formes", f: ["bâton tordu", "dé à vingt faces de cristal", "gourdin peint"], t: "Utilisé contre une cible (action d'attaque, test d'attaque magique contre sa DEF), il produit un effet tiré au hasard sur la table.", a: "Lancez 1d12 sur la table. L'effet dure 1d4 rounds, sauf mention contraire.", u: "Une fois par combat.", v: false,
          table: ["La cible se transforme en poule (mêmes PV, plus aucune attaque).", "La cible lévite à 3 m du sol, sans contrôle.", "La cible est soignée de 2d6 PV.", "Il pleut des harengs sur 10 m autour de la cible.", "La cible et le porteur échangent leur place.", "La cible devient bleue, définitivement (sauf sort de délivrance).", "La cible pousse des cornes de bélier (+1 DM au contact, définitif).", "La cible parle en vers et ne peut plus mentir pendant une heure.", "Le porteur rapetisse à 30 cm pendant une heure.", "La cible est entourée de papillons : dé malus en attaque.", "Une porte apparaît dans le vide derrière la cible, et mène ailleurs (au MJ).", "La cible explose en confettis… puis réapparaît à côté, vexée."] },
        { n: "de la mutation", f: ["fiole d'eau irisée", "pierre-tonnerre"], t: "Celui qui la boit (ou la touche) gagne une mutation tirée au hasard sur la table, pour une journée.", a: "Lancez 1d8 sur la table. Sur un 1 au d20 de sauvegarde (CON difficulté 10), la mutation est définitive.", u: "Une fois.", v: false,
          table: ["Une troisième main pousse dans le dos (utile pour tenir une torche).", "Les yeux voient dans le noir, mais la lumière du jour éblouit (dé malus).", "La peau devient écailleuse : +1 DEF, dé malus aux tests de CHA.", "Une queue préhensile pousse.", "La voix devient double, comme deux personnes qui parlent en même temps.", "Le personnage respire sous l'eau mais suffoque à l'air libre au bout d'une heure.", "Les cheveux deviennent des plumes.", "Le personnage change de taille (petite ou grande, au choix du MJ)."] }
      ] },
    { id: "belzoeth", nom: "Belzoeth", dom: "dieu des tombeaux et des morts-vivants", ton: "sombre", sources: ["tombeau", "culte"],
      signes: ["un crâne gravé dont les orbites luisent faiblement", "il sent la terre de cimetière et la pourriture douce"],
      effets: [
        { n: "du serviteur", f: ["phalange en sautoir", "crâne de rat sculpté"], t: "Posé sur un cadavre, il le relève comme zombi obéissant pendant une heure.", a: "Profil de zombi du livre ; au-delà d'une heure, le zombi devient hostile. Les prêtres n'aiment pas ça du tout.", u: "Une fois par jour.", v: false },
        { n: "du gisant", f: ["cercueil miniature", "suaire"], t: "Enveloppé dedans, le porteur passe pour mort : pas de pouls, pas de souffle, la peau froide.", a: "Il entend tout mais ne peut bouger avant une heure ; les charognards, eux, ne font pas la différence.", u: "Une fois par jour.", v: false }
      ] },
    { id: "delia", nom: "Délia", dom: "déesse des illusions et des mensonges", ton: "fou", sources: ["fees", "faussaires", "culte"],
      signes: ["une bouche entrouverte gravée, qui semble sourire de biais", "une voix douce et amusée, à la limite de l'audible"],
      effets: [
        { n: "du beau mensonge", f: ["masque de soie", "miroir de poche"], t: "Le porteur peut prendre l'apparence de la personne que son interlocuteur a le plus envie de voir.", a: "Il ne choisit pas laquelle ; l'illusion se dissipe s'il dit une seule vérité.", u: "Une fois par jour.", v: false },
        { n: "du rêve éveillé", f: ["boîte à musique", "kaléidoscope"], t: "Celui qui l'écoute ou y regarde voit pendant une minute un souvenir heureux, si vrai qu'il en oublie où il est.", a: "Test de VOL difficulté 15 pour s'en arracher ; un échec de 10 points le rend triste et affaibli pendant une heure.", u: "À volonté.", v: false }
      ] },
    { id: "danaelle", nom: "Danaëlle", dom: "déesse de la passion et de la jalousie", ton: "sombre", sources: ["faussaires", "marchands"],
      signes: ["deux anneaux imbriqués gravés, l'un serré autour de l'autre", "il est brûlant quand on pense à quelqu'un"],
      effets: [
        { n: "de la possession", f: ["paire d'anneaux", "médaillon fermé"], t: "Le porteur sait toujours où se trouve la personne qui porte l'autre anneau, et ce qu'elle ressent.", a: "Il ne peut pas l'enlever tant que l'autre le porte, et ressent une jalousie violente si elle s'approche de quelqu'un.", u: "Permanent.", v: false }
      ] },
    { id: "fydriss", nom: "Fydriss", dom: "déesse de la peur et des cauchemars", ton: "sombre", sources: ["tombeau", "culte", "antre"],
      signes: ["un masque grimaçant gravé, dont l'expression change quand on cligne des yeux", "les enfants pleurent en le voyant"],
      effets: [
        { n: "du cauchemar", f: ["poupée de chiffon", "masque grimaçant"], t: "Glissé dans les affaires de quelqu'un, il lui donne des cauchemars si terribles qu'il ne récupère plus en dormant.", a: "La victime ne récupère pas de PV en récupération complète ; elle peut chercher la cause (test de PER difficulté 15).", u: "Une nuit par jour.", v: false },
        { n: "de l'effroi", f: ["crâne d'oiseau", "lanterne à verre rouge"], t: "Brandi, il fait voir à chaque adversaire sa plus grande peur pendant un round.", a: "Test de VOL difficulté 12 ou la cible est paralysée de peur 1 round. Le porteur voit aussi la sienne, sans test.", u: "Une fois par jour.", v: true }
      ] },
    { id: "gehenne", nom: "Géhenne", dom: "déesse des cataclysmes et des fléaux", ton: "sombre", sources: ["armee", "antre"],
      signes: ["un éclair gravé, noirci comme brûlé", "des insectes morts autour de l'endroit où il est posé"],
      effets: [
        { n: "des sauterelles", f: ["boîte en fer", "calebasse fermée"], t: "Ouverte, elle libère une nuée de sauterelles qui dévore toutes les cultures et les vivres à 100 m.", a: "Les vivres des PJ aussi ; la nuée part ensuite vers le prochain champ.", u: "Une fois.", v: false }
      ] },
    { id: "hellion", nom: "Hellion", dom: "dieu des voleurs et du pillage", ton: "neutre", sources: ["bandits", "faussaires", "pillards"],
      signes: ["une cape gravée qui semble flotter au vent", "on ne le retrouve jamais là où on l'a posé"],
      effets: [
        { n: "qui revient toujours", f: ["bourse", "dé pipé"], t: "Volée ou perdue, elle revient dans la poche du porteur dans l'heure.", a: "Avec tout ce qu'il y avait dedans… et parfois quelque chose en plus, qui appartenait au voleur.", u: "Permanent.", v: false },
        { n: "de l'innocent", f: ["gants gris", "capuche"], t: "Personne ne soupçonne jamais le porteur en premier d'un vol commis dans la pièce.", a: "Ne marche pas si on l'a vu faire ; dé bonus aux tests pour se disculper.", u: "Permanent.", v: false }
      ] },
    { id: "hybbera", nom: "Hybbèra", dom: "déesse de l'indifférence et du froid", ton: "sombre", sources: ["antre", "tombeau"],
      signes: ["un cristal de glace gravé qui ne fond jamais", "du givre se forme sur les doigts qui le tiennent"],
      effets: [
        { n: "du cœur gelé", f: ["broche de glace", "pendentif de cristal"], t: "Le porteur ne ressent plus ni peur, ni pitié, ni chagrin.", a: "Immunité à la peur ; dé malus à tous les tests de CHA, et il oublie peu à peu pourquoi il tient à ses amis (au MJ de le jouer).", u: "Permanent tant qu'il est porté.", v: false }
      ] },
    { id: "lucerion", nom: "Lucérion", dom: "dieu de la corruption et de la folie", ton: "fou", sources: ["sorcier", "culte", "fees", "pillards"],
      signes: ["une corde nouée gravée, dont le nœud n'est jamais le même", "un rire étouffé, qu'on n'est jamais sûr d'avoir entendu"],
      effets: [
        { n: "de la bonne idée", f: ["chapeau à grelots", "fourchette en argent"], t: "Une fois par jour, le porteur a une idée. Elle est toujours mauvaise, mais elle marche presque toujours.", a: "Lancez 1d6 : sur 2 à 6, le plan absurde réussit contre toute logique ; sur 1, il échoue de la façon la plus embarrassante possible.", u: "Une fois par jour.", v: false },
        { n: "aux voix", f: ["boîte à musique", "crâne de corbeau"], t: "Le porteur entend des voix qui commentent tout ce qu'il fait ; parfois elles ont raison.", a: "Une fois par jour, le MJ glisse au joueur un indice vrai sur la scène… au milieu de trois remarques fausses ou absurdes.", u: "Permanent.", v: false },
        { n: "de la folie douce", f: ["sceptre à tête de bouffon", "fromage sculpté"], t: "Brandi sur une cible, il la plonge dans une folie passagère tirée sur la table.", a: "Test de VOL difficulté 13 pour résister ; lancez 1d8 sur la table, effet 1d4 rounds.", u: "Une fois par jour.", v: false,
          table: ["La cible croit être un arbre et ne bouge plus.", "La cible attaque l'objet le plus proche, persuadée qu'il l'insulte.", "La cible se met à danser.", "La cible déclare son amour au PJ le plus proche.", "La cible se croit invisible et agit en conséquence.", "La cible compte ses doigts, encore et encore.", "La cible se jette au sol en hurlant que le ciel tombe.", "La cible change de camp, très sérieusement."] }
      ] },
    { id: "lugannor", nom: "Lugannor", dom: "dieu des montagnes et des géants", ton: "neutre", sources: ["geants"],
      signes: ["un menhir gravé, étonnamment lourd pour sa taille", "de petites pierres roulent vers lui"],
      effets: [
        { n: "du géant", f: ["dent de géant", "bracelet de granit"], t: "Le porteur grandit d'une tête et sa force avec : dé bonus aux tests de FOR pendant une minute.", a: "Ses vêtements et son armure, eux, ne grandissent pas.", u: "Une fois par jour.", v: true }
      ] },
    { id: "maedra", nom: "Maëdra", dom: "déesse de l'obéissance et des insectes, Reine-araignée", ton: "sombre", sources: ["elfes-noirs"],
      signes: ["une araignée gravée dont les pattes semblent bouger", "de fines toiles se forment autour de lui en une nuit"],
      effets: [
        { n: "de la toile", f: ["fuseau d'argent noirci", "broche-araignée"], t: "Le porteur peut tisser une toile solide pour bloquer un couloir ou grimper à une paroi.", a: "Une créature prise dans la toile doit réussir un test de FOR difficulté 15 pour se libérer ; les araignées du coin savent qu'il est là.", u: "Une fois par jour.", v: true },
        { n: "de l'obéissance", f: ["collier d'esclave", "anneau à sept serpents"], t: "Passé au cou de quelqu'un, il le rend docile : il obéit aux ordres simples du porteur.", a: "Test de VOL difficulté 15 chaque jour pour résister. Les elfes des profondeurs reconnaissent cet objet, et le veulent.", u: "Permanent.", v: false }
      ] },
    { id: "malkoer", nom: "Malkoer", dom: "dieu de la maladie et des épidémies", ton: "sombre", sources: ["pillards", "betes", "tombeau"],
      signes: ["un rat gravé, la gueule ouverte", "il sent la pourriture et le linge sale, quoi qu'on fasse"],
      effets: [
        { n: "de la fièvre", f: ["mouchoir taché", "fiole verdâtre"], t: "Celui qui en est touché contracte une fièvre qui le rend affaibli pendant trois jours.", a: "Test de CON difficulté 12 pour résister ; le porteur, lui, est immunisé aux maladies ordinaires tant qu'il le garde.", u: "Une fois par jour.", v: false }
      ] },
    { id: "mephistere", nom: "Méphistère", dom: "dieu de l'ombre et des secrets", ton: "sombre", sources: ["faussaires", "bandits", "elfes-noirs"],
      signes: ["un masque lisse gravé, sans bouche", "il ne projette pas d'ombre"],
      effets: [
        { n: "du secret gardé", f: ["coffret noir", "cadenas sans serrure"], t: "Un secret chuchoté dedans est oublié par celui qui l'a dit, et ne peut être retrouvé qu'en rouvrant le coffret.", a: "Le coffret ne s'ouvre que la nuit ; ceux qui en connaissent l'existence prieraient pour le voler.", u: "Un secret à la fois.", v: false },
        { n: "de l'ombre", f: ["cape de velours", "gants noirs"], t: "Le porteur peut se fondre dans une ombre et y rester immobile, invisible, aussi longtemps qu'elle dure.", a: "Toute lumière vive le révèle ; il ne peut ni bouger ni agir sans sortir de l'ombre.", u: "Une fois par jour.", v: false }
      ] },
    { id: "miesserith", nom: "Miesserith", dom: "déesse de la magie noire", ton: "sombre", sources: ["sorcier", "culte"],
      signes: ["une lune noire gravée, qui absorbe la lumière", "une aura glaçante que les animaux fuient"],
      effets: [
        { n: "du prix du sang", f: ["dague de cérémonie", "calice d'obsidienne"], t: "Le porteur peut payer un sort en PV au lieu de PM, à raison de 2 PV par PM.", a: "Chaque usage laisse une cicatrice noire ; au bout de dix, les prêtres le prennent pour un sorcier.", u: "À volonté.", v: false }
      ] },
    { id: "oroax", nom: "Oroax", dom: "dieu de la destruction et de la guerre", ton: "sombre", sources: ["armee", "soldats", "geants"],
      signes: ["une hache ensanglantée gravée, avec du vrai sang séché dans les rainures", "il donne envie de frapper"],
      effets: [
        { n: "de la soif", f: ["torque de fer", "bracelet hérissé"], t: "Quand le porteur met un adversaire hors de combat, il récupère 1d6 PV.", a: "S'il passe une journée sans combattre, il devient irritable et doit réussir un test de VOL difficulté 12 pour ne pas chercher la bagarre.", u: "Permanent.", v: false }
      ] },
    { id: "scrofelias", nom: "Scrofélias", dom: "dieu des mutilations et des mendiants", ton: "sombre", sources: ["pillards", "armee"],
      signes: ["une main tranchée gravée", "on a l'impression qu'il nous manque un doigt en le tenant"],
      effets: [
        { n: "de la pitié", f: ["sébile de bois", "béquille"], t: "Tant qu'il tend la sébile, le porteur inspire une pitié irrépressible : on lui donne, on le laisse passer, on ne le frappe pas.", a: "Test de VOL difficulté 12 pour l'attaquer ; mais le porteur doit mendier une heure par jour ou perdre 1 PV par jour.", u: "Permanent.", v: false }
      ] },

    /* ---------- forces plus anciennes ---------- */
    { id: "puissance-feu", nom: "la Puissance du Feu", dom: "force primordiale", ton: "neutre", sources: ["antre", "betes-magiques", "geants"],
      signes: ["un triangle pointe en haut gravé, rougeoyant", "il réchauffe l'air autour de lui"],
      effets: [
        { n: "du foyer", f: ["braise dans une cage de fer", "pierre rouge"], t: "Elle allume un feu sans bois qui chauffe et cuit pour six, et ne s'éteint ni sous la pluie ni sous le vent.", a: "Elle ne s'éteint pas non plus quand on le veut : il faut l'enterrer.", u: "Une fois par jour.", v: true }
      ] },
    { id: "puissance-eau", nom: "la Puissance de l'Eau", dom: "force primordiale", ton: "neutre", sources: ["betes-magiques", "marchands"],
      signes: ["un triangle pointe en bas gravé, toujours humide", "un bruit de ruisseau quand on l'approche de l'oreille"],
      effets: [
        { n: "de la source", f: ["gourde", "coquille"], t: "Elle ne se vide jamais : elle donne assez d'eau pure pour dix personnes par jour.", a: "Renversée, elle déverse toute l'eau d'un coup : de quoi inonder une pièce.", u: "Permanent.", v: false }
      ] },
    { id: "puissance-terre", nom: "la Puissance de la Terre", dom: "force primordiale", ton: "neutre", sources: ["geants", "elfes-noirs", "antre"],
      signes: ["un triangle barré pointe en bas gravé", "il est toujours un peu plus lourd qu'on ne s'y attend"],
      effets: [
        { n: "de l'ancrage", f: ["pierre plate", "clou de fer"], t: "Planté dans le sol, il rend impossible de déplacer le porteur contre son gré : ni bousculade, ni renversement, ni vent.", a: "Le porteur ne peut pas bouger non plus tant qu'il ne l'a pas arraché (action de mouvement).", u: "À volonté.", v: false }
      ] },
    { id: "puissance-vent", nom: "la Puissance du Vent", dom: "force primordiale", ton: "neutre", sources: ["antre", "sorcier"],
      signes: ["un triangle barré pointe en haut gravé", "une légère brise souffle autour de lui, même à l'abri"],
      effets: [
        { n: "du souffle", f: ["sac de cuir noué", "éventail"], t: "Ouvert, il libère une bourrasque qui renverse tout ce qui est léger, éteint les torches et repousse un nuage de gaz.", a: "Les créatures de taille moyenne à moins de 5 m doivent réussir un test de FOR difficulté 12 ou tomber.", u: "Une fois par jour.", v: true }
      ] },
    { id: "puissance-vie", nom: "la Puissance de la Vie", dom: "force primordiale", ton: "lumineux", sources: ["fees", "betes", "culte"],
      signes: ["un triangle barré en diagonale, pointe en haut", "des pousses vertes apparaissent là où il reste posé"],
      effets: [
        { n: "du renouveau", f: ["graine dorée", "œuf de pierre"], t: "Elle fait repousser un membre perdu, ou revivre une plante, un animal ou un arbre mort depuis moins d'un jour.", a: "Pas les personnes : la Vie ne rend pas ce que la Mort a pris aux êtres qui pensent.", u: "Une fois.", v: false }
      ] },
    { id: "puissance-mort", nom: "la Puissance de la Mort", dom: "force primordiale", ton: "sombre", sources: ["tombeau", "antre"],
      signes: ["un triangle barré en diagonale, pointe en bas", "les fleurs fanent à son contact"],
      effets: [
        { n: "du repos", f: ["pièce de fer froid", "pétale noir"], t: "Posé sur un mort-vivant sans intelligence, il le fait retomber en poussière.", a: "Test d'attaque au contact ; sur un mort-vivant intelligent, il le fait seulement reculer d'effroi un round.", u: "Une fois par jour.", v: false }
      ] },
    { id: "saisons", nom: "les quatre Saisons", dom: "anciens maîtres du temps", ton: "neutre", sources: ["fees", "betes"],
      signes: ["quatre arbres gravés, chacun à une saison", "il change de couleur avec les saisons"],
      effets: [
        { n: "de la saison voisine", f: ["feuille de bronze", "branche de cristal"], t: "Brisé, il fait passer un lieu (une clairière, une cour) à la saison suivante pendant une heure : neige en été, fleurs en hiver.", a: "Les animaux et les plantes du coin en sont tout retournés.", u: "Une fois par jour.", v: true }
      ] },
    { id: "seigneurs-animaux", nom: "les Seigneurs des animaux", dom: "roi Ours, dame Renard, reine Corbeau…", ton: "neutre", sources: ["betes", "betes-magiques", "fees"],
      signes: ["une empreinte animale gravée", "les bêtes sauvages s'arrêtent pour le regarder passer"],
      effets: [
        { n: "de dame Renard", f: ["queue de renard", "masque de renard"], t: "Le porteur s'en tire toujours avec une pirouette : une fois par jour, il peut échapper à une situation sociale sans conséquence.", a: "Dé bonus au test de CHA pour s'en sortir ; mais dame Renard réclamera un jour un service.", u: "Une fois par jour.", v: false },
        { n: "de la reine Corbeau", f: ["plume noire", "crâne de corbeau"], t: "Les corbeaux du voisinage rapportent au porteur ce qu'ils ont vu dans la journée.", a: "Ils parlent des choses brillantes, de la nourriture et des morts ; pour le reste, il faut deviner.", u: "Une fois par jour.", v: false },
        { n: "du roi Ours", f: ["griffe d'ours", "peau d'ours"], t: "Le porteur peut dormir tout l'hiver sans manger, et se réveiller en pleine forme.", a: "S'il est réveillé avant le printemps, il est d'une humeur… d'ours (dé malus aux tests de CHA une semaine).", u: "Une fois par an.", v: false }
      ] },
    { id: "roi-sorcier", nom: "Tor-Angul, le Roi-Sorcier", dom: "dieu en devenir, banni dans un demi-plan", ton: "sombre", sources: ["tombeau", "antre", "sorcier"],
      signes: ["une couronne griffue gravée, emblème qu'on croyait détruit", "une voix lointaine qui murmure des promesses la nuit"],
      effets: [
        { n: "de la voix lointaine", f: ["anneau de fer noir", "éclat de pierre du ciel"], t: "Le Roi-Sorcier parle à travers lui : une fois par semaine, il offre un conseil ou une information précieuse en échange d'un service.", a: "Les conseils sont justes. Les services, eux, rapprochent toujours un peu plus Tor-Angul de son retour.", u: "Une fois par semaine.", v: false },
        { n: "de la pierre du ciel", f: ["fragment de météorite", "amulette d'éclat noir"], t: "Il contient une étincelle de l'énergie des Pierres du Ciel : il recharge 1d6 PM d'un lanceur de sorts.", a: "Chaque usage fait apparaître chez l'utilisateur une veine noire sur la peau ; les prêtres de Tyriolith la reconnaissent.", u: "Une fois par semaine.", v: false }
      ] },
    { id: "ombre-feerique", nom: "le plan de l'ombre féérique", dom: "pays des faëlys, perméable à Astréis", ton: "fou", sources: ["fees"],
      signes: ["une gravure de forêt crépusculaire noyée de brume", "il est plus froid au crépuscule, et l'on y entend parfois des rires"],
      effets: [
        { n: "du marché nocturne", f: ["bourse de feuilles", "pièce de lune"], t: "Elle permet d'acheter quelque chose à un marchand féérique qui apparaît au crépuscule, mais jamais contre de l'argent.", a: "Le prix est un souvenir, un nom, une couleur des yeux, un rire… Le marchand est toujours honnête, et toujours plus malin.", u: "Une fois par mois.", v: false },
        { n: "du chemin de traverse", f: ["clé de bois", "fil d'argent"], t: "Elle ouvre une porte dans un arbre creux qui mène, en une heure de marche dans la brume, à n'importe quelle forêt du royaume.", a: "On n'arrive jamais tout à fait à l'heure : lancez 1d6, sur 1 on a perdu un jour, sur 6 on arrive la veille.", u: "Une fois par semaine.", v: false }
      ] }
  ],

  /* Caprices facultatifs, selon le ton (un objet exotique sur deux en a un) */
  caprices: {
    lumineux: ["Il refuse de fonctionner pour quelqu'un qui vient de mentir.", "Il chauffe doucement quand son porteur fait une bonne action.", "Il ne fonctionne qu'à la lumière du jour."],
    neutre: ["Il ne fonctionne pas un jour sur sept (lancez 1d6, sur 1 il boude).", "Il préfère un porteur plutôt qu'un autre, et le fait sentir.", "Il fredonne quand il est content."],
    sombre: ["Il murmure le nom de son ancien porteur la nuit.", "Les animaux domestiques refusent d'approcher son porteur.", "Il laisse une marque noirâtre sur la peau de celui qui le porte trop longtemps.", "Il donne de mauvais rêves à qui dort à côté."],
    fou: ["Il change de couleur selon l'humeur de son porteur.", "Il parle, mais seulement pour se plaindre.", "Il éternue quand on ment près de lui.", "Il se cache quand on en a besoin (test de PER difficulté 10 pour le retrouver).", "Il est persuadé d'être un autre objet, et l'annonce à qui veut l'entendre."]
  },

  /* Probabilité d'un objet exotique dans le butin d'une rencontre (réglage « rares ») */
  chance: { corps: 0.02, repaire: 0.06, fin: 0.12 },
  multiplicateurFrequents: 3,
  /* Affinité des sources avec l'étrange */
  exotisme: { fees: 2, sorcier: 1.8, tombeau: 1.5, culte: 1.5, antre: 1.3, "elfes-noirs": 1.2, "betes-magiques": 1, marchands: 1,
    pillards: 0.8, faussaires: 0.8, geants: 0.7, bandits: 0.6, betes: 0.6, armee: 0.5, soldats: 0.4 }
};

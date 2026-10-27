/* Textes d'aide partagés par les infobulles « i » et la visite guidée.
   ancre = section de aide.html vers laquelle pointe « En savoir plus ». */

window.AIDE_TXT = {
  niveau: {
    titre: "Niveau des PJ",
    txt: "Il fixe le niveau de magie maximal des objets, d'après la table « Puissance d'un objet magique » du livre. Il ne change pas l'argent, qui dépend du NC de la rencontre.",
    ancre: "niveau-cadre"
  },
  cadre: {
    titre: "Cadre de jeu",
    txt: "La colonne de la table du livre. En high fantasy, les objets sont plus puissants et arrivent plus tôt ; en low fantasy, ils sont rares et modestes.",
    ancre: "niveau-cadre"
  },
  mode: {
    titre: "Que tirer ?",
    txt: "Le butin complet d'une rencontre (argent, équipement, magie), ou un objet seul : majeur (le plus puissant autorisé), mineur (colonne niveau ÷ 2), consommable, ou exotique (règle maison).",
    ancre: "modes"
  },
  source: {
    titre: "Sur qui, ou où ?",
    txt: "Qui ou quoi les PJ fouillent. Chaque source a sa richesse, sa part de magie, son équipement et ses trouvailles : des loups n'ont pas de bourse, une tour de sorcier regorge de parchemins.",
    ancre: "sources"
  },
  ampleur: {
    titre: "Ampleur",
    txt: "Sur les corps : ce que portent les adversaires. Repaire : le magot de leur cachette. Fin d'aventure : le trésor final, avec un objet majeur garanti si la source a de la magie.",
    ancre: "ampleur"
  },
  adversaires: {
    titre: "Nombre d'adversaires",
    txt: "Plus ils sont nombreux, plus il y a de pièces, d'équipement et de chances de magie sur les corps (jusqu'à deux fois plus). Ne compte que pour « Sur les corps ».",
    ancre: "ampleur"
  },
  menace: {
    titre: "Menace pour le groupe",
    txt: "Elle donne le NC de la rencontre : niveau des PJ − 2, égal, ou + 2. Le NC décide de l'argent et des gemmes ; une fin d'aventure redoutable donne un objet majeur un cran plus fort.",
    ancre: "menace-nc"
  },
  nc: {
    titre: "NC précis",
    txt: "Si tu connais le NC exact (bestiaire, ou NC d'un groupe), saisis-le : il remplace la menace. Douze gnolls et leur chef font par exemple une rencontre NC 7.",
    ancre: "menace-nc"
  },
  exotiques: {
    titre: "Objets exotiques",
    txt: "Des objets étranges, narratifs ou inquiétants, liés à une divinité ou une puissance d'Osgild. Hors règles du livre, à arbitrer. « Rares » : de 2 à 12 % selon l'ampleur ; « Fréquents » : trois fois plus.",
    ancre: "exotiques"
  },
  patron: {
    titre: "Lié à",
    txt: "La divinité ou la puissance dont l'objet tient son effet. Son domaine donne le ton : lumineux, neutre, sombre ou fou. Règle maison, hors règles du livre.",
    ancre: "exotiques"
  },
  categorie: {
    titre: "Catégorie",
    txt: "Restreint le tirage à un type d'objet. « Au hasard » suit les poids des catégories : armes et armures sortent le plus souvent.",
    ancre: "categories"
  },
  nombre: {
    titre: "Nombre d'objets",
    txt: "Combien d'objets tirer d'un coup, de 1 à 8. Chacun peut ensuite être relancé seul.",
    ancre: "modes"
  },
  resultat: {
    titre: "Lire le résultat",
    txt: "Chaque carte est en vue MJ : le sceau donne le niveau de magie, la valeur est en bas, les dés sont détaillés. « Texte pour les joueurs » copie ce qu'ils voient, sans les secrets.",
    ancre: "lire"
  },

  /* étapes propres à la visite guidée */
  lancer: {
    titre: "Lancer les dés",
    txt: "Le résumé au-dessus du bouton rappelle le NC et le plafond de magie. Pour la visite, on tire un exemple : le trésor de fin d'aventure d'une tour de sorcier.",
    ancre: "lire"
  },
  carteArgent: {
    titre: "Argent et équipement",
    txt: "La première carte donne l'argent, réparti en pp, po, pa et pc, puis les gemmes, objets d'art et trouvailles propres à la source. L'équipement récupérable suit, avec ses statistiques et son état.",
    ancre: "carte-argent"
  },
  carteObjet: {
    titre: "Un objet magique",
    txt: "Le sceau donne le niveau de magie (NM). Dessous : les effets prêts à jouer, la description à lire aux joueurs, et la valeur (NM² × 200 po, revente à moitié prix).",
    ancre: "carte-objet"
  },
  identification: {
    titre: "Identification",
    txt: "Ce que les PJ découvrent à l'usage (effets évidents ou cachés) et comment l'identifier selon le livre : sort de rang suffisant, test d'INT du barde ou du maître d'armes, sage. Les difficultés sont calculées.",
    ancre: "identification"
  },
  histoire: {
    titre: "Lui donner une histoire",
    txt: "À ta demande, l'objet reçoit une origine (table 3d10 du livre), un nom et une légende, avec des indices visibles. À garder pour les objets marquants.",
    ancre: "histoire"
  },
  actions: {
    titre: "Copier, relancer, retrouver",
    txt: "« Texte joueurs » copie ce que les PJ voient, sans les règles ni les secrets. « Relancer » retire un objet seul. Les 20 derniers butins restent dans « Butins précédents », en bas des résultats, dans ton navigateur.",
    ancre: "historique"
  }
};

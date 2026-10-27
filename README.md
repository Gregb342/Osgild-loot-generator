# Butin d'Osgild

*Version 0.3.0 bêta*. Les changements sont listés dans [CHANGELOG.md](CHANGELOG.md). Mode d'emploi, règles et probabilités : [`aide.html`](https://gregb342.github.io/osgild-loot-generator/aide.html).

Générateur de trésors pour **Chroniques Oubliées Fantasy 2e édition**, calibré sur le niveau des PJ et le cadre de jeu (classique, high fantasy, low fantasy).

Une page statique, sans backend ni build : elle tourne sur GitHub Pages ou en ouvrant `index.html` dans un navigateur.

## Ce qu'elle tire

- **Le butin d'une rencontre** : on choisit la source (bandits, gardes, tour de sorcier, tombeau… 15 au total), l'ampleur (sur les corps, repaire, fin d'aventure) et la menace pour le groupe, ou directement le NC de la rencontre. L'argent dépend du NC de la source, pas du niveau des PJ ; les objets magiques restent plafonnés par le niveau des PJ, comme le prévoit le livre.
- **Objet majeur / mineur** : niveau de magie visé d'après la table « Puissance d'un objet magique majeur » (colonne niveau/2 pour un objet mineur).
- **Consommable** : potion, parchemin ou projectiles magiques.
- **Objet exotique** (règle maison, hors règles du livre) : objet original, narratif, à double tranchant ou inquiétant, lié à une divinité ou une puissance d'Osgild. Il peut aussi apparaître dans le butin d'une rencontre si le MJ l'active (jamais, rares, fréquents).

Le butin d'une rencontre détaille aussi la monnaie (pp, po, pa, pc) et l'équipement non magique récupérable, avec ses statistiques, son état et son encombrement. Chaque objet affiche son niveau de magie, ses effets, une description à lire aux joueurs, sa valeur et le détail des jets de dés. Chaque objet permanent peut recevoir une histoire à la demande du MJ (bouton « Lui donner une histoire ») : origine tirée sur la table du livre, nom et légende générés ; l'objet majeur d'une fin d'aventure est signalé comme candidat. Chaque objet indique ce que les PJ découvrent à l'usage (effets évidents ou cachés), comment l'identifier selon les règles du livre (difficultés calculées), et, s'il a une histoire, les indices visibles et où chercher sa légende complète. Un bouton copie le texte à donner aux joueurs, sans rien de la vue MJ. Les potions ont leur jet d'effet secondaire. On peut relancer un objet seul, copier le butin en texte, et retrouver ou effacer les 20 derniers butins (stockés dans le navigateur).

## Aide intégrée

- `aide.html` : page d'aide (mode d'emploi, règles du livre, règles maison, probabilités). Les tableaux sont calculés par `js/aide.js` à partir des fichiers de données ; les captures sont dans `img/aide/`.
- `js/aide-textes.js` : textes courts partagés par les infobulles « i » (`js/bulles.js`) et la visite guidée (`js/visite.js`). Chaque texte pointe vers une ancre de `aide.html`.
- Ajouter `?sans-visite` à l'adresse empêche la proposition de visite guidée (utile pour les captures).

## D'où viennent les tables

- `js/tables.js` et `js/voies.js` : tables et voies du livre de base COF 2e édition, © Black Book Éditions.
- `js/sources.js` : règles maison pour les sources de butin, le barème d'argent par NC, les gemmes, les objets d'art et les trouvailles. Inspiré des types de trésor d'AD&D et du trésor individuel / de repaire de D&D 5e, recalibré sur l'économie de COF. À ajuster librement.
- `js/equipement.js` : armes et armures du livre (DM, DEF, AGI max, prix), encombrement de l'Atlas ; états, kits par source et répartition de la monnaie en règles maison.
- `js/filtres.js` : capacités écartées des objets de pouvoir (compagnons, traits de classe, bonus de caractéristique…) et formes d'objet par voie.
- `js/identification.js` : effets évidents ou cachés, tests d'identification du livre, indices tirés de l'origine, texte pour les joueurs.
- `js/lore.js` : générateur de noms et de légendes (gabarits, noyaux par type d'objet, thèmes, syllabes par peuple, artisans, accroches).
- `js/exotiques.js` : objets exotiques, hors règles du livre : 57 patrons (divinités de l'Atlas, Puissances, saisons, Seigneurs des animaux, Roi-Sorcier, ombre féérique), une centaine d'effets, caprices, affinités des sources.
- `js/maison.js` : autres règles maison (poids des catégories, objets de compétence, descriptions).

Deux choix d'interprétation :
- les rangs des potions (pour leur valeur) sont estimés quand le sort n'apparaît pas dans les voies du livre de base ;
- les potions et parchemins de « Nécromancien » sont rattachés au profil Sorcier.

## Versions

Numérotation `MAJEUR.MINEUR.CORRECTIF` (préfixe bêta tant que l'outil est en test) :
- **correctif** (0.1.**1**) : correction de bug ou ajustement de chiffres ;
- **mineur** (0.**2**.0) : nouvelle fonctionnalité ;
- **majeur** (**1**.0.0) : sortie de bêta, ou changement qui casse l'historique enregistré.

À chaque version : mettre à jour le numéro dans `index.html` et `aide.html` (pied de page et paramètre `?v=` des fichiers, pour que les navigateurs rechargent les scripts), dans ce README, ajouter une entrée au CHANGELOG et poser un tag Git `vX.Y.Z-beta`.

## Mettre en ligne

Settings → Pages → Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`.

## Licence

Code sous licence MIT. Le contenu de jeu issu des ouvrages Black Book Éditions reste leur propriété ; ceci est un outil de fan, gratuit et non officiel.

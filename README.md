# Butin d'Osgild

Générateur de trésors pour **Chroniques Oubliées Fantasy 2e édition**, calibré sur le niveau des PJ et le cadre de jeu (classique, high fantasy, low fantasy).

Une page statique, sans backend ni build : elle tourne sur GitHub Pages ou en ouvrant `index.html` dans un navigateur.

## Ce qu'elle tire

- **Le butin d'une rencontre** : on choisit la source (bandits, gardes, tour de sorcier, tombeau… 15 au total), l'ampleur (sur les corps, repaire, fin d'aventure) et la menace pour le groupe, ou directement le NC de la rencontre. L'argent dépend du NC de la source, pas du niveau des PJ ; les objets magiques restent plafonnés par le niveau des PJ, comme le prévoit le livre.
- **Objet majeur / mineur** : niveau de magie visé d'après la table « Puissance d'un objet magique majeur » (colonne niveau/2 pour un objet mineur).
- **Consommable** : potion, parchemin ou projectiles magiques.

Chaque objet affiche son niveau de magie, ses effets, une description à lire aux joueurs, son origine (3d10), sa valeur et le détail des jets de dés. On peut relancer un objet seul, copier le butin en texte, et retrouver ou effacer les 20 derniers butins (stockés dans le navigateur).

## D'où viennent les tables

- `js/tables.js` et `js/voies.js` : tables et voies du livre de base COF 2e édition, © Black Book Éditions.
- `js/sources.js` : règles maison pour les sources de butin, le barème d'argent par NC, les gemmes, les objets d'art et les trouvailles. Inspiré des types de trésor d'AD&D et du trésor individuel / de repaire de D&D 5e, recalibré sur l'économie de COF. À ajuster librement.
- `js/filtres.js` : capacités écartées des objets de pouvoir (compagnons, traits de classe, bonus de caractéristique…) et formes d'objet par voie.
- `js/maison.js` : autres règles maison (poids des catégories, objets de compétence, descriptions).

Deux choix d'interprétation :
- les rangs des potions (pour leur valeur) sont estimés quand le sort n'apparaît pas dans les voies du livre de base ;
- les potions et parchemins de « Nécromancien » sont rattachés au profil Sorcier.

## Mettre en ligne

Settings → Pages → Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`.

## Licence

Code sous licence MIT. Le contenu de jeu issu des ouvrages Black Book Éditions reste leur propriété ; ceci est un outil de fan, gratuit et non officiel.

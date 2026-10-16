# Butin d'Osgild

Générateur de trésors pour **Chroniques Oubliées Fantasy 2e édition**, calibré sur le niveau des PJ et le cadre de jeu (classique, high fantasy, low fantasy).

Une page statique, sans backend ni build : elle tourne sur GitHub Pages ou en ouvrant `index.html` dans un navigateur.

## Ce qu'elle tire

- **Butin complet** : un magot (pièces, gemmes, objet d'art) et, selon un d6, des consommables, un objet mineur ou un objet majeur.
- **Objet majeur / mineur** : niveau de magie visé d'après la table « Puissance d'un objet magique majeur » (colonne niveau/2 pour un objet mineur).
- **Consommable** : potion, parchemin ou projectiles magiques.
- **Bourse** : un adversaire ou un repaire.

Chaque objet affiche son niveau de magie, ses effets, une description à lire aux joueurs, son origine (3d10 de l'Atlas des objets), sa valeur et le détail des jets de dés. On peut relancer un objet seul, copier le butin en texte, et retrouver les 20 derniers butins (stockés dans le navigateur).

## D'où viennent les tables

- `js/tables.js` et `js/voies.js` : tables et voies du livre de base COF 2e édition, © Black Book Éditions.
- `js/maison.js` : règles maison qui complètent le livre (argent, gemmes, objets d'art, descriptions, objets de compétence, composition d'un butin complet). À modifier librement.

Deux choix d'interprétation :
- les rangs des potions (pour leur valeur) sont estimés quand le sort n'apparaît pas dans les voies du livre de base ;
- les potions et parchemins de « Nécromancien » sont rattachés au profil Sorcier.

## Mettre en ligne

Settings → Pages → Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`.

## Licence

Code sous licence MIT. Le contenu de jeu issu des ouvrages Black Book Éditions reste leur propriété ; ceci est un outil de fan, gratuit et non officiel.

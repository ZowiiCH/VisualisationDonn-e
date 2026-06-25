# Visualisation des Postes Reddit sur le conflit israélo-palestinien

## Description
Ce travail propose une visualisation des postes Reddit de r/worldnews sur le sujet du conflit israélo-palestinien. Vous pouvez y voir les postes ayant eu le plus d'interaction, ainsi que leurs commentaires en interagissant avec chaque poste.

## Une présentation des données
Les données viennent de [Kaggle](https://www.kaggle.com/datasets/asaniczka/reddit-on-israel-palestine-daily-updated?resource=download). Il s'agit du travail de récolte journalier de l'utilisateur Asaniczka. 

Asanisczka récolte tous les jours depuis le début du conflit les informations concernant les postes Reddit sur le conflit israélo-palestinien. Il y a plus de 24 colones d'information concernant le poste, les commentaires, les upvotes et les utilisateurs.  

## Étapes de prétraitement des données 
Le ficher mis à disposition par Asanisczka est extrêmement volumineux ( plus de 6'000 Mo), il m'a donc fallu déjà le traité afin de supprimer toutes les lignes d'information qui ne m'étaient pas nécessaire pour ma visualisation. Par la suite j'ai aussi restreint de la manière suivante : 
Uniquement les postes de r/wordnews de plus de 1000 upvotes.
Uniquement les commentaires à 100/-100 upvotes. 

### Les données finales sont les suivantes : 
Le nom du poste Reddit (1) sont un score de upvote (2), le ratio positif/négatif de vote (3), chacun relier à  un commentaire (4) et sont nombre dupbote positif ou négatif (5). (+ les commentaire_ID et Post_ID)

Le fichier final avait 555 entrées individuelles.

## Une explication de la visualisation produite.

J'ai fait le choix d'une visualisation avec des cercles à la fois, car cela fonctionnait avec mes données, mais je trouvais aussi cela cohérent avec ma volonté de représenter Reddit comme une communauté. De manière générale, je voulais que cela soit interactif et amusant de se déplacer au travers des données, j'ai donc mobilisé une fonction zoom, permettant d'interagir avec chaque post afin de voir leurs commentaires. 

Pour chaque poste, je souhaitais rendre à la fois visibles leurs nombres d'upvote et leurs ratios de vote positif/négatif. Ainsi la taille représente le premier et une échelle de couleur permet de voir le ratio. 

La même logique a été mise en place pour les commentaires. 

En complément, un mouseover permet d'avoir les informations concernant chacune des données plus précisément.

Je me suis inspirée de deux visualisations de donnée pour réaliser mon travail.

[Clean circular packing](https://d3-graph-gallery.com/graph/circularpacking_template.html)

[Zoomable circle packing](https://observablehq.com/@d3/zoomable-circle-packing)


## Déclaration d’utilisation d’IA génératives. 

Mon utilisation de l'IA est la suivante : 

### 1
Comprendre une partie de code que j'ai repris d'exemple afin de mieux comprendre son fonctionnement afin de l'adapter à mon objectif.

### 2
M'aidez à réaliser techniquement des processus que j'avais en tête, car il m'arrivait de savoir comment conceptuellement le réaliser, mais de ne pas avoir la syntaxe exacte.


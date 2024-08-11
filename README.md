# Pokémon Game - Rattrapage H4

## Description

Ce projet est un jeu de combat Pokémon développé dans le cadre du rattrapage H4. Le jeu permet aux joueurs de générer aléatoirement des Pokémon, de former une équipe composée de trois Pokémon maximum, et de les utiliser pour affronter une série de Pokémon ennemis dans un système de combat au tour par tour.

### Fonctionnalités principales

- **Génération de Pokémon :** Le joueur peut générer de nouveaux Pokémon de manière aléatoire et les ajouter à son équipe.
- **Gestion d'équipe :** Le joueur peut former une équipe de trois Pokémon maximum pour participer aux combats.
- **Combat au tour par tour :** Le joueur affronte une série de dix Pokémon ennemis. Chaque Pokémon a des capacités uniques avec des dégâts spécifiques.
- **Interface utilisateur :** Le jeu est présenté via une interface web, avec des boutons interactifs pour sélectionner les attaques.
- **Système de victoire/défaite :** Le jeu se termine lorsque le joueur vainc tous les Pokémon ennemis ou si tous ses Pokémon sont vaincus.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 14 ou plus récente)
- [npm](https://www.npmjs.com/) (version 6 ou plus récente)

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/evan-th/Rattrapage-H4.git
   cd pokemon-game-rattrapage

   ```

2. **Installer les dépendances :**

Installez toutes les dépendances nécessaires pour le projet en exécutant :

`npm install`

3. **Configurer la base de données :**

Exécutez les migrations pour créer les tables nécessaires :
`cd backend`
`npx sequelize-cli db:migrate`

4. **Remplir la base de données avec des données initiales :**

Utilisez le script de seed pour remplir la base de données avec les données des Pokémon initiaux :

`node seeders/seed.mjs`

4. **Lancer le serveur**

`node index.js`

## Lancer le projet

Pour démarrer le serveur de développement, exécutez la commande suivante :

`npm start``

Cette commande va démarrer le serveur sur http://localhost:3000. Ouvrez votre navigateur et allez à cette adresse pour commencer à jouer.

### À quoi consiste le jeu ?

Le jeu Pokémon Rattrapage H4 est un jeu de combat où le joueur doit affronter une série de Pokémon ennemis avec une équipe de trois Pokémon. Le jeu se déroule comme suit :

**Inscription et Connexion :** Avant de commencer à jouer, le joueur doit créer un compte ou se connecter à un compte existant. Cela permet de sauvegarder et de récupérer les Pokémon capturés et l'équipe du joueur lors des sessions de jeu ultérieures.

**Génération de nouveaux Pokémon :** Le joueur peut générer de nouveaux Pokémon de manière aléatoire. Ces Pokémon peuvent être ajoutés à son équipe, qui peut contenir jusqu'à trois Pokémon à la fois.

**Combat :** Le joueur affronte dix Pokémon aleatoire ennemis dans une série de combats au tour par tour. À chaque tour, le joueur choisit une attaque pour infliger des dégâts à l'ennemi. Chaque Pokémon ennemi inflige 10 de degat.

**Victoire/Défaite :** Le joueur gagne s'il vainc tous les Pokémon ennemis. Si tous les Pokémon du joueur sont vaincus, le jeu est perdu. À la fin de chaque combat (victoire ou défaite), le joueur est redirigé vers le menu principal.

**Interface :** L'interface du jeu est simple et interactive, avec des boutons pour sélectionner les attaques et des messages pour indiquer les résultats du combat.

# Pokémon Game - API Documentation

## Base URL

http://localhost:5001/api

## Authentification et Gestion des Utilisateurs

### 1. **POST `/api/users/register`**

- **Description :** Créer un compte utilisateur.
- **Corps de la requête :**
  ```json
  {
      "username": "string",
      "email": "string",
      "password": "string"
  }
  Réponse :
  201 : Utilisateur créé avec succès.
  400 : Un utilisateur avec cet email existe déjà.
  500 : Erreur lors de la création de l'utilisateur.
  ```

2. POST /api/users/login
   Description : Connexion d'un utilisateur.
   Corps de la requête :
   json
   Copier le code
   {
   "email": "string",
   "password": "string"
   }
   Réponse :
   200 : Connexion réussie.
   400 : Utilisateur non trouvé ou mot de passe incorrect.
   500 : Erreur lors de la connexion.
3. POST /api/users/logout
   Description : Déconnexion de l'utilisateur (non fourni dans le code, mais habituellement attendu).
   Réponse :
   200 : Déconnexion réussie.
   500 : Erreur lors de la déconnexion.
4. GET /check-session
   Description : Vérifier si l'utilisateur est connecté.
   Réponse :
   200 : Session active avec l'ID de l'utilisateur.
   401 : Session non active.
   Gestion des Pokémon
5. GET /api/pokemons
   Description : Récupérer la liste de tous les Pokémon disponibles.
   Réponse :
   200 : Liste de tous les Pokémon.
   500 : Erreur lors de la récupération des Pokémon.
6. GET /api/pokemons/:id
   Description : Récupérer les informations d'un Pokémon spécifique par son ID, y compris ses capacités (moves).
   Paramètres de l'URL :
   id : ID du Pokémon.
   Réponse :
   200 : Informations sur le Pokémon avec ses moves.
   404 : Pokémon non trouvé.
   500 : Erreur serveur.
7. POST /api/pokemons/add-pokemon
   Description : Ajouter un Pokémon généré aléatoirement à la collection d'un utilisateur.
   Corps de la requête :
   json
   Copier le code
   {
   "pokemonId": "number"
   }
   Réponse :
   200 : Pokémon ajouté à l'équipe ou capturé (mais non ajouté à l'équipe si elle est déjà complète).
   401 : Utilisateur non authentifié.
   404 : Utilisateur ou Pokémon non trouvé.
   500 : Erreur serveur.
8. GET /api/pokemons/user/team
   Description : Récupérer l'équipe de Pokémon active d'un utilisateur, y compris leurs capacités.
   Réponse :
   200 : Liste des Pokémon de l'équipe avec leurs moves.
   401 : Utilisateur non authentifié.
   404 : Utilisateur non trouvé.
   500 : Erreur serveur.
9. GET /api/pokemons/user/pokemons
   Description : Récupérer tous les Pokémon possédés par un utilisateur, y compris leurs capacités.
   Réponse :
   200 : Liste de tous les Pokémon de l'utilisateur avec leurs moves.
   401 : Utilisateur non authentifié.
   404 : Utilisateur non trouvé.
   500 : Erreur serveur.
10. POST /api/pokemons/remove-from-team
    Description : Retirer un Pokémon de l'équipe active de l'utilisateur.
    Corps de la requête :
    json
    Copier le code
    {
    "pokemonId": "number"
    }
    Réponse :
    200 : Pokémon retiré de l'équipe.
    401 : Utilisateur non authentifié.
    404 : Pokémon non trouvé dans l'équipe.
    500 : Erreur serveur.
11. POST /api/pokemons/add-to-team
    Description : Ajouter un Pokémon de la collection d'un utilisateur à son équipe active.
    Corps de la requête :
    json
    Copier le code
    {
    "pokemonId": "number"
    }
    Réponse :
    200 : Pokémon ajouté à l'équipe.
    401 : Utilisateur non authentifié.
    404 : Pokémon non trouvé.
    500 : Erreur serveur.
    Exemple de Flux Utilisateur
    Inscription :
    L'utilisateur s'inscrit via /api/users/register.
    Connexion :
    L'utilisateur se connecte via /api/users/login.
    La session utilisateur est stockée.
    Ajout de Pokémon :
    L'utilisateur génère des Pokémon via /api/pokemons/add-pokemon.
    Les Pokémon générés peuvent être ajoutés à l'équipe via /api/pokemons/add-to-team.
    Gestion de l'équipe :
    L'utilisateur peut voir son équipe via /api/pokemons/user/team.
    Il peut aussi gérer son équipe (ajout/retrait de Pokémon) via /api/pokemons/remove-from-team et /api/pokemons/add-to-team.
    Combats :
    Le jeu de combat peut ensuite être lancé, en utilisant les Pokémon et leurs moves récupérés via les routes de l'API.

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import axios from 'axios';

function Combat() {
  const gameContainer = useRef(null);

  useEffect(() => {
    // Requête pour obtenir l'équipe du joueur
    async function fetchPlayerTeam() {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/pokemons/user/team',
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'équipe du joueur:",
          error,
        );
        return [];
      }
    }

    // Requête pour générer 10 Pokémon ennemis aléatoires
    async function fetchEnemyPokemons() {
      try {
        const randomIds = Array.from(
          { length: 10 },
          () => Math.floor(Math.random() * 151) + 1,
        );
        const enemies = await Promise.all(
          randomIds.map((id) =>
            axios.get(`http://localhost:5001/api/pokemons/${id}`),
          ),
        );
        return enemies.map((res) => res.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des Pokémon ennemis:',
          error,
        );
        return [];
      }
    }

    async function startGame() {
      const playerTeam = await fetchPlayerTeam();
      const enemyTeam = await fetchEnemyPokemons();

      const config = {
        type: Phaser.AUTO,
        width: window.innerWidth, // Utilisation de la largeur de la fenêtre
        height: 600,
        backgroundColor: '#0000FF', // Fond bleu
        scale: {
          mode: Phaser.Scale.RESIZE, // Ajuste la taille du jeu avec la fenêtre sans redimensionnement infini
          autoCenter: Phaser.Scale.CENTER_BOTH, // Centre automatiquement le contenu
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
        parent: gameContainer.current,
      };

      const game = new Phaser.Game(config);

      let playerIndex = 0;
      let enemyIndex = 0;

      function preload() {
        // Charger les sprites des Pokémon du joueur et des ennemis
        playerTeam.forEach((pokemon, index) => {
          this.load.image(`playerPokemon${index}`, pokemon.frontSprite);
        });
        enemyTeam.forEach((pokemon, index) => {
          this.load.image(`enemyPokemon${index}`, pokemon.frontSprite);
        });
      }

      function create() {
        // Vérification des données avant de les utiliser
        if (
          !playerTeam ||
          playerTeam.length === 0 ||
          !enemyTeam ||
          enemyTeam.length === 0
        ) {
          console.error(
            'Les données des équipes ne sont pas disponibles ou sont incorrectes.',
          );
          return;
        }

        // Afficher le premier Pokémon du joueur et le premier ennemi
        this.playerPokemon = this.add.sprite(
          150,
          300,
          `playerPokemon${playerIndex}`,
        );
        this.enemyPokemon = this.add.sprite(
          650,
          100,
          `enemyPokemon${enemyIndex}`,
        );

        // Afficher les HP
        this.playerHP = this.add.text(
          100,
          250,
          `HP: ${playerTeam[playerIndex].hp}`,
          { fontSize: '20px', fill: '#FFF' },
        );
        this.enemyHP = this.add.text(
          600,
          50,
          `HP: ${enemyTeam[enemyIndex].hp}`,
          { fontSize: '20px', fill: '#FFF' },
        );

        // Afficher les capacités du Pokémon du joueur
        if (playerTeam[playerIndex].moves) {
          playerTeam[playerIndex].moves.forEach((move, i) => {
            this.add
              .text(50, 400 + i * 30, move.name, {
                fontSize: '20px',
                fill: '#FFF',
              })
              .setInteractive()
              .on('pointerdown', () =>
                handlePlayerAttack.call(
                  this, // Assurer que `this` est bien la scène
                  move,
                  playerTeam[playerIndex],
                  enemyTeam[enemyIndex],
                ),
              );
          });
        } else {
          console.warn(
            "Le Pokémon sélectionné n'a pas de mouvements disponibles.",
          );
        }
      }

      const handlePlayerAttack = function (move, playerPokemon, enemyPokemon) {
        // Appliquer les dégâts à l'ennemi
        const damage = move.power || 10;
        enemyPokemon.hp -= damage;
        this.enemyHP.setText(`HP: ${enemyPokemon.hp}`);

        // Vérifier si l'ennemi est vaincu
        if (enemyPokemon.hp <= 0) {
          enemyIndex++;
          if (enemyIndex >= enemyTeam.length) {
            alert('Vous avez vaincu tous les ennemis!');
            this.scene.restart();
            return;
          } else {
            this.enemyPokemon.setTexture(`enemyPokemon${enemyIndex}`);
            this.enemyHP.setText(`HP: ${enemyTeam[enemyIndex].hp}`);
          }
        }

        // L'ennemi riposte
        handleEnemyAttack.call(this, playerPokemon, enemyPokemon);
      };

      const handleEnemyAttack = function (playerPokemon, enemyPokemon) {
        const damage = 10; // Dommages de l'ennemi
        playerPokemon.hp -= damage;
        this.playerHP.setText(`HP: ${playerPokemon.hp}`);

        // Vérifier si le Pokémon du joueur est vaincu
        if (playerPokemon.hp <= 0) {
          playerIndex++;
          if (playerIndex >= playerTeam.length) {
            alert('Vous avez perdu!');
            this.scene.restart();
          } else {
            this.playerPokemon.setTexture(`playerPokemon${playerIndex}`);
            this.playerHP.setText(`HP: ${playerTeam[playerIndex].hp}`);
          }
        }
      };

      function update() {
        // Logique de mise à jour du jeu, si nécessaire
      }

      return () => {
        game.destroy(true);
      };
    }

    startGame();
  }, []);

  return <div ref={gameContainer} style={{ height: '100vh' }}></div>;
}

export default Combat;

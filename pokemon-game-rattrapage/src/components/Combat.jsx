import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Combat() {
  const gameContainer = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [turnCount, setTurnCount] = useState(0);

  useEffect(() => {
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
        width: window.innerWidth,
        height: 600,
        backgroundColor: '#3b82f6',
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
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
      let enemySprites = [];
      let playerMovesButtons = []; // Stocker les références des boutons des mouvements du joueur

      function preload() {
        playerTeam.forEach((pokemon, index) => {
          this.load.image(`playerPokemon${index}`, pokemon.frontSprite);
        });
        enemyTeam.forEach((pokemon, index) => {
          this.load.image(`enemyPokemon${index}`, pokemon.frontSprite);
        });
      }

      function create() {
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

        const startX = 50;
        const startY = 50;
        const offsetX = 50;
        enemySprites = enemyTeam.slice(1).map((pokemon, i) => {
          return this.add
            .sprite(startX + i * offsetX, startY, `enemyPokemon${i + 1}`)
            .setScale(0.5)
            .setAlpha(0.5);
        });

        displayPlayerMoves.call(this); // Afficher les mouvements du Pokémon du joueur actuel

        // Afficher le compteur de tours
        this.turnText = this.add.text(
          window.innerWidth - 100,
          20,
          `Tour: ${turnCount}`,
          { fontSize: '20px', fill: '#FFF' },
        );
      }

      const displayPlayerMoves = function () {
        // Supprimer les mouvements précédents
        playerMovesButtons.forEach((element) => element.destroy());
        playerMovesButtons = [];

        const moveBoxWidth = 200; // Augmenter la largeur des rectangles
        const moveBoxHeight = 50;
        const movePadding = 20;
        const startX = 50;
        const startY = 400;

        if (playerTeam[playerIndex].moves) {
          playerTeam[playerIndex].moves.forEach((move, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;

            const moveBox = this.add
              .rectangle(
                startX + col * (moveBoxWidth + movePadding),
                startY + row * (moveBoxHeight + movePadding),
                moveBoxWidth,
                moveBoxHeight,
                0xffffff, // Couleur de fond blanche
              )
              .setOrigin(0)
              .setStrokeStyle(2, 0x000000) // Bordure noire
              .setInteractive()
              .on('pointerdown', () =>
                handlePlayerAttack.call(
                  this,
                  move,
                  playerTeam[playerIndex],
                  enemyTeam[enemyIndex],
                ),
              );

            const moveText = this.add.text(
              moveBox.x + moveBoxWidth / 2,
              moveBox.y + moveBoxHeight / 2,
              `${move.name} ${move.power || 10} dégâts`, // Affichage du nom et des dégâts
              {
                fontSize: '16px', // Ajuster la taille de la police si nécessaire
                fill: '#000', // Couleur du texte noire
              },
            );
            moveText.setOrigin(0.5); // Centrer le texte dans le rectangle
            playerMovesButtons.push(moveBox, moveText); // Ajouter le texte et le rectangle au tableau
          });
        } else {
          console.warn(
            "Le Pokémon sélectionné n'a pas de mouvements disponibles.",
          );
        }
      };

      const handlePlayerAttack = function (move, playerPokemon, enemyPokemon) {
        // Animation de l'attaque du joueur
        this.tweens.add({
          targets: this.playerPokemon,
          x: 180, // Déplacement vers la droite lors de l'attaque
          duration: 100,
          yoyo: true, // Revenir à la position initiale
        });

        const damage = move.power || 10;
        enemyPokemon.hp -= damage;
        this.enemyHP.setText(`HP: ${enemyPokemon.hp}`);

        setTurnCount((prevTurnCount) => {
          const newTurnCount = prevTurnCount + 1;
          this.turnText.setText(`Tour: ${newTurnCount}`);
          return newTurnCount;
        });

        if (enemyPokemon.hp <= 0) {
          enemyIndex++;
          if (enemyIndex >= enemyTeam.length) {
            setMessage('victory');
            setTimeout(() => navigate('/menu'), 5000);
            return;
          } else {
            this.enemyPokemon.setTexture(`enemyPokemon${enemyIndex}`);
            this.enemyHP.setText(`HP: ${enemyTeam[enemyIndex].hp}`);
            if (enemySprites[enemyIndex - 1]) {
              enemySprites[enemyIndex - 1].destroy();
            }
          }
        }

        // Délai d'une seconde avant l'attaque de l'ennemi
        setTimeout(() => {
          handleEnemyAttack.call(this, playerPokemon, enemyPokemon);
        }, 1000);
      };

      const handleEnemyAttack = function (playerPokemon, enemyPokemon) {
        // Animation de l'attaque de l'ennemi
        this.tweens.add({
          targets: this.enemyPokemon,
          x: 620, // Déplacement vers la gauche lors de l'attaque
          duration: 100,
          yoyo: true, // Revenir à la position initiale
        });

        const damage = 10;
        playerPokemon.hp -= damage;
        this.playerHP.setText(`HP: ${playerPokemon.hp}`);

        setTurnCount((prevTurnCount) => {
          const newTurnCount = prevTurnCount + 1;
          this.turnText.setText(`Tour: ${newTurnCount}`);
          return newTurnCount;
        });

        if (playerPokemon.hp <= 0) {
          playerIndex++;
          if (playerIndex >= playerTeam.length) {
            setMessage('defeat');
            setTimeout(() => navigate('/menu'), 5000);
          } else {
            this.playerPokemon.setTexture(`playerPokemon${playerIndex}`);
            this.playerHP.setText(`HP: ${playerTeam[playerIndex].hp}`);
            displayPlayerMoves.call(this); // Réinitialiser les mouvements pour le nouveau Pokémon
          }
        }
      };

      function update() {}

      return () => {
        game.destroy(true);
      };
    }

    startGame();
  }, [navigate]);

  return (
    <div ref={gameContainer} style={{ height: '100vh', position: 'relative' }}>
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px 20px',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={() => navigate('/menu')}
      >
        Menu
      </button>
      {message === 'victory' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #000',
            borderRadius: '10px',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <h2>Vous avez vaincu tous les Pokémon !</h2>
          <p>Vous allez être redirigé vers le menu dans 5 secondes...</p>
        </div>
      )}
      {message === 'defeat' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #000',
            borderRadius: '10px',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <h2>Vous avez perdu !</h2>
          <p>Vous allez être redirigé vers le menu dans 5 secondes...</p>
        </div>
      )}
    </div>
  );
}

export default Combat;

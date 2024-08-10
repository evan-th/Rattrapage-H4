import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function Combat() {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      parent: gameContainer.current,
    };

    const game = new Phaser.Game(config);

    function preload() {
      // Charger les ressources nécessaires
    }

    function create() {
      // Créer les éléments de jeu, comme les sprites, etc.
    }

    function update() {
      // Logique de jeu à mettre à jour à chaque frame
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer}></div>;
}

export default Combat;

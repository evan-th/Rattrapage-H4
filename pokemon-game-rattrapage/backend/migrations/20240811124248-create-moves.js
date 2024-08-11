'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Créer la table Moves
    await queryInterface.createTable('Moves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      power: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      pp: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      accuracy: { // Ajout de la colonne accuracy
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Créer la table de liaison PokemonMoves
    await queryInterface.createTable('PokemonMoves', {
      pokemonId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pokemons',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      moveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Moves',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PokemonMoves');
    await queryInterface.dropTable('Moves');
  }
};

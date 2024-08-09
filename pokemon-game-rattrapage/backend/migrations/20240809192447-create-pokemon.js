'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pokemons', {
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
      type1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hp: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attack: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      defense: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('Pokemons');
  }
};

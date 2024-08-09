'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pokemon extends Model {
    static associate(models) {
      // Define associations here if necessary
    }
  }

  Pokemon.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type2: {
      type: DataTypes.STRING,
      allowNull: true  // type2 peut être nul si le Pokémon n'a qu'un seul type
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Pokemon',
  });

  return Pokemon;
};

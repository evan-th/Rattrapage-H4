'use strict';

module.exports = (sequelize, DataTypes) => {
  const PokemonTeam = sequelize.define('PokemonTeam', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Nom de la table Users
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    pokemonId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Pokemons', // Nom de la table Pokemons
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    isInTeam: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'PokemonTeams' // Assurez-vous que le nom de la table est correct
  });

  PokemonTeam.associate = function (models) {
    // Associations avec User
    PokemonTeam.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    // Associations avec Pokemon
    PokemonTeam.belongsTo(models.Pokemon, { foreignKey: 'pokemonId', as: 'pokemon' });
  };

  return PokemonTeam;
};

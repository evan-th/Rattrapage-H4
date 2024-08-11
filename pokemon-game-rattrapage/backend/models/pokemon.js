module.exports = (sequelize, DataTypes) => {
  const Pokemon = sequelize.define('Pokemon', {
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
      allowNull: true
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
    },
    frontSprite: {
      type: DataTypes.STRING,
      allowNull: true
    },
    backSprite: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Pokemon.associate = function (models) {
    // Définir l'association many-to-many avec le modèle Move via la table de liaison "PokemonMoves"
    Pokemon.belongsToMany(models.Move, {
      through: 'PokemonMoves',
      as: 'moves',
      foreignKey: 'pokemonId',
      otherKey: 'moveId'
    });
  };

  return Pokemon;
};

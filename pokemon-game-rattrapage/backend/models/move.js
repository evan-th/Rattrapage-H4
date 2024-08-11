'use strict';

module.exports = (sequelize, DataTypes) => {
    const Move = sequelize.define('Move', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        power: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pp: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        accuracy: {  // Ajout de la colonne accuracy
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'Moves' // Nom de la table
    });

    Move.associate = function (models) {
        // Associations avec le modèle Pokemon (via une table de liaison "PokemonMoves")
        Move.belongsToMany(models.Pokemon, {
            through: 'PokemonMoves',
            as: 'pokemons',
            foreignKey: 'moveId',
            otherKey: 'pokemonId'
        });
    };

    return Move;
};

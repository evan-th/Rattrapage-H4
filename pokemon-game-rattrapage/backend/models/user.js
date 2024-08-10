'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        team: {
            type: DataTypes.JSON,  // Stocker l'équipe comme un objet JSON
            allowNull: true
        }
    });

    User.associate = (models) => {
        // Définir l'association many-to-many avec les Pokémon via PokemonTeam
        User.belongsToMany(models.Pokemon, {
            through: models.PokemonTeam,
            foreignKey: 'userId',
            as: 'pokemons'
        });
    };

    return User;
};

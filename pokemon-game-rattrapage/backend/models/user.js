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
    }, {
        // options de configuration du modèle
    });

    User.associate = (models) => {
        // Définir les associations ici si nécessaire
        User.hasMany(models.Pokemon, {
            foreignKey: 'userId',
            as: 'pokemons'
        });
    };

    return User;
};

const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors'); // Importer le package cors
const pokemonRoutes = require('./routes/pokemon');
const userRoutes = require('./routes/user');
const app = express();
const PORT = process.env.PORT || 5001;

// Activer le middleware CORS
app.use(cors());

// Connexion à la base de données SQLite avec Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Vérifier la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connection to SQLite has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Synchroniser les modèles avec la base de données
sequelize.sync()
    .then(() => {
        console.log('Database & tables synced!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// Middleware pour parser le JSON
app.use(express.json());

// Utiliser les routes Pokémon
app.use('/api/pokemons', pokemonRoutes);

// Utiliser les routes Utilisateur
app.use('/api/users', userRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

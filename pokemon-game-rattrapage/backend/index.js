const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const session = require('express-session');
const pokemonRoutes = require('./routes/pokemon');
const userRoutes = require('./routes/user');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:3000', // L'origine de votre frontend
    credentials: true // Permettre l'envoi des cookies
}));

app.use(session({
    secret: 'your_secret_key',  // Une clé secrète forte et sécurisée
    resave: false,              // Ne pas sauvegarder la session si elle n'est pas modifiée
    saveUninitialized: false,   // Ne pas sauvegarder une session non initialisée
    cookie: {
        secure: false,          // En production, secure: true (HTTPS uniquement)
        httpOnly: true,         // Les cookies ne sont pas accessibles via JavaScript
        maxAge: 24 * 60 * 60 * 1000 // Durée de vie du cookie : 24 heures
    }
}));


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to SQLite has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

sequelize.sync()
    .then(() => {
        console.log('Database & tables synced!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

app.use(express.json());


app.use('/api/pokemons', pokemonRoutes); // Routes Pokémon
app.use('/api/users', userRoutes); // Routes Utilisateurs

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

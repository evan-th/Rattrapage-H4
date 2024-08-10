const express = require('express');
const router = express.Router();
const { Pokemon, User, PokemonTeam } = require('../models');

// Route pour récupérer tous les Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll();
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour récupérer un Pokémon par son ID
router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ message: "Pokemon not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route pour ajouter un Pokémon à l'équipe d'un utilisateur
router.post('/add-pokemon', async (req, res) => {
    console.log('Session:', req.session); // Vérifiez ici l'état de la session

    try {
        const userId = global.currentUserId;  // Récupérer l'ID de l'utilisateur depuis la session
        console.log('Global dans add-pokemon:', global.currentUserId);

        const { pokemonId } = req.body;  // Extraire pokemonId de req.body

        console.log(`UserID: ${userId}, PokemonID: ${pokemonId}`);

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // Vérifier que l'utilisateur existe
        const user = await User.findByPk(userId);
        const pokemon = await Pokemon.findByPk(pokemonId);

        if (!user) {
            console.log('Utilisateur non trouvé');
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (!pokemon) {
            console.log('Pokemon non trouvé');
            return res.status(404).json({ message: "Pokemon non trouvé" });
        }

        // Vérifier le nombre de Pokémon dans l'équipe
        const teamCount = await PokemonTeam.count({
            where: { userId, isInTeam: true }
        });

        console.log(`Team Count for user ${userId}: ${teamCount}`);

        // Déterminer si le Pokémon doit être ajouté à l'équipe ou non
        const isInTeam = teamCount < 3;

        // Ajouter le Pokémon à l'équipe (avec isInTeam true ou false)
        const newEntry = await PokemonTeam.create({
            userId,
            pokemonId,
            isInTeam: isInTeam
        });

        console.log('Nouvelle entrée ajoutée dans PokemonTeam:', newEntry);

        if (isInTeam) {
            res.json({ message: `${pokemon.name} a été ajouté à votre équipe !` });
        } else {
            res.json({ message: `${pokemon.name} a été capturé mais n'a pas pu rejoindre l'équipe car celle-ci est déjà complète.` });
        }
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// Route pour récupérer l'équipe de Pokémon d'un utilisateur
router.get('/user/:userId/team', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [
                {
                    model: Pokemon,
                    as: 'pokemons',
                    through: { where: { isInTeam: true } }
                }
            ]
        });

        if (user) {
            res.json(user.pokemons); // Retourne les Pokémon dans l'équipe
        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

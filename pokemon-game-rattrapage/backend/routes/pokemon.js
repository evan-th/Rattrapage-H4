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
    console.log('Session:', req.session);

    try {
        const userId = global.currentUserId;
        console.log('Session UserID:', userId);

        const { pokemonId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const user = await User.findByPk(userId);
        const pokemon = await Pokemon.findByPk(pokemonId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (!pokemon) {
            return res.status(404).json({ message: "Pokemon non trouvé" });
        }

        const teamCount = await PokemonTeam.count({
            where: { userId, isInTeam: true }
        });

        const isInTeam = teamCount < 3;

        const newEntry = await PokemonTeam.create({
            userId,
            pokemonId,
            isInTeam: isInTeam
        });

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
router.get('/user/team', async (req, res) => {
    try {
        const userId = global.currentUserId;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const user = await User.findByPk(userId, {
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

// Route pour récupérer tous les Pokémon possédés par un utilisateur (dans et hors de l'équipe)
router.get('/user/pokemons', async (req, res) => {
    try {
        const userId = global.currentUserId;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Pokemon,
                    as: 'pokemons',
                }
            ]
        });

        if (user) {
            res.json(user.pokemons); // Retourne tous les Pokémon possédés par l'utilisateur
        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour retirer un Pokémon de l'équipe de l'utilisateur
router.post('/remove-from-team', async (req, res) => {
    try {
        const userId = global.currentUserId;  // Récupérer l'ID de l'utilisateur
        const { pokemonId } = req.body;  // Extraire pokemonId de req.body

        console.log(`UserID: ${userId}, PokemonID: ${pokemonId}`);

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // Mettre à jour le Pokémon pour le retirer de l'équipe (mettre isInTeam à false)
        const updatedPokemonTeam = await PokemonTeam.update(
            { isInTeam: false },  // Nouvelle valeur de isInTeam
            { where: { userId: userId, pokemonId: pokemonId } }  // Condition de mise à jour
        );

        if (updatedPokemonTeam[0] === 0) {
            // Si aucun enregistrement n'a été mis à jour
            return res.status(404).json({ message: "Le Pokémon n'a pas été trouvé dans l'équipe." });
        }

        res.json({ message: "Le Pokémon a été retiré de votre équipe." });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post('/add-to-team', async (req, res) => {
    try {
        const userId = global.currentUserId;  // Récupérer l'ID de l'utilisateur
        const { pokemonId } = req.body;  // Extraire pokemonId de req.body

        console.log(`UserID: ${userId}, PokemonID: ${pokemonId}`);

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // Mettre à jour le Pokémon pour le l'ajouter à l'équipe (mettre isInTeam à false)
        const updatedPokemonTeam = await PokemonTeam.update(
            { isInTeam: true },  // Nouvelle valeur de isInTeam
            { where: { userId: userId, pokemonId: pokemonId } }  // Condition de mise à jour
        );

        if (updatedPokemonTeam[0] === 0) {
            // Si aucun enregistrement n'a été mis à jour
            return res.status(404).json({ message: "Le Pokémon n'a pas été trouvé dans l'équipe." });
        }

        res.json({ message: "Le Pokémon a été retiré de votre équipe." });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;


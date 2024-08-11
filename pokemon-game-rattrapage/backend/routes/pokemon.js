const express = require('express');
const router = express.Router();
const { Pokemon, User, PokemonTeam, Move } = require('../models');

// Route pour récupérer tous les Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll();
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour récupérer un Pokémon par son ID, avec ses capacités (moves)
router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id, {
            include: [
                {
                    model: Move,
                    as: 'moves' // Inclure les moves du Pokémon dans la réponse
                }
            ]
        });

        if (pokemon) {
            res.json(pokemon); // Retourne le Pokémon avec ses moves
        } else {
            res.status(404).json({ message: "Pokémon non trouvé" });
        }
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour ajouter un Pokémon à l'équipe d'un utilisateur
router.post('/add-pokemon', async (req, res) => {
    try {
        const userId = global.currentUserId;
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
            return res.status(404).json({ message: "Pokémon non trouvé" });
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

// Route pour récupérer l'équipe de Pokémon d'un utilisateur, avec leurs capacités
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
                    through: { where: { isInTeam: true } },
                    include: [{ model: Move, as: 'moves' }] // Inclure les moves de chaque Pokémon
                }
            ]
        });

        if (user) {
            res.json(user.pokemons); // Retourne les Pokémon dans l'équipe avec leurs moves
        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour récupérer tous les Pokémon possédés par un utilisateur, avec leurs capacités
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
                    include: [{ model: Move, as: 'moves' }] // Inclure les moves de chaque Pokémon
                }
            ]
        });

        if (user) {
            res.json(user.pokemons); // Retourne tous les Pokémon possédés par l'utilisateur avec leurs moves
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
        const userId = global.currentUserId;
        const { pokemonId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const updatedPokemonTeam = await PokemonTeam.update(
            { isInTeam: false },
            { where: { userId: userId, pokemonId: pokemonId } }
        );

        if (updatedPokemonTeam[0] === 0) {
            return res.status(404).json({ message: "Le Pokémon n'a pas été trouvé dans l'équipe." });
        }

        res.json({ message: "Le Pokémon a été retiré de votre équipe." });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour ajouter un Pokémon à l'équipe de l'utilisateur
router.post('/add-to-team', async (req, res) => {
    try {
        const userId = global.currentUserId;
        const { pokemonId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const updatedPokemonTeam = await PokemonTeam.update(
            { isInTeam: true },
            { where: { userId: userId, pokemonId: pokemonId } }
        );

        if (updatedPokemonTeam[0] === 0) {
            return res.status(404).json({ message: "Le Pokémon n'a pas été trouvé dans l'équipe." });
        }

        res.json({ message: "Le Pokémon a été ajouté à votre équipe." });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

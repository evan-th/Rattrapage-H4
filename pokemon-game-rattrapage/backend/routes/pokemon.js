const express = require('express');
const router = express.Router();
const { Pokemon } = require('../models');

// Route pour récupérer tous les Pokémon
router.get('/pokemons', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll();
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

import fetch from 'node-fetch';
import db from '../models/index.js';

const { Pokemon, Move } = db;

const seedDatabase = async () => {
    try {
        // Récupérer les données de l'API
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        // Pour chaque Pokémon, récupérer des détails supplémentaires
        const detailedPokemons = await Promise.all(
            data.results.map(async (pokemon) => {
                const pokemonData = await fetch(pokemon.url);
                return await pokemonData.json();
            })
        );

        // Sauvegarder les Pokémon et leurs capacités dans la base de données
        for (const poke of detailedPokemons) {
            const newPokemon = await Pokemon.create({
                name: poke.name,
                type1: poke.types[0] ? poke.types[0].type.name : null,  // Le premier type
                type2: poke.types[1] ? poke.types[1].type.name : null,  // Le deuxième type, s'il existe
                hp: poke.stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: poke.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: poke.stats.find(stat => stat.stat.name === 'defense').base_stat,
                frontSprite: poke.sprites.front_default,  // Sprite avant
                backSprite: poke.sprites.back_default,    // Sprite arrière
            });

            // Récupérer les capacités du Pokémon (maximum 4)
            const moves = poke.moves.slice(0, 4); // Limiter à 4 capacités

            for (const move of moves) {
                const moveDataResponse = await fetch(move.move.url);
                const moveData = await moveDataResponse.json();

                const newMove = await Move.create({
                    name: moveData.name,
                    type: moveData.type.name,
                    power: moveData.power,
                    pp: moveData.pp,
                    accuracy: moveData.accuracy,
                });

                // Associer le move au Pokémon via la table de liaison
                await newPokemon.addMove(newMove);
                console.log(`Inserted move ${moveData.name} for ${poke.name}`);
            }

            console.log(`Inserted ${poke.name} successfully`);
        }
    } catch (err) {
        console.error('Failed to seed database:', err);
    }
};

// Exécuter le script
seedDatabase().then(() => {
    console.log('Seeding complete!');
    process.exit();
});

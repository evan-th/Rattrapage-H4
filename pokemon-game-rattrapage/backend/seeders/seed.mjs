import fetch from 'node-fetch';
import db from '../models/index.js';  // Import du module CommonJS en tant que default export

const { Pokemon } = db;  // Extraire le modèle Pokemon de l'export par défaut

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

        // Sauvegarder les Pokémon dans la base de données
        for (const poke of detailedPokemons) {
            await Pokemon.create({
                name: poke.name,
                type1: poke.types[0] ? poke.types[0].type.name : null,  // Le premier type
                type2: poke.types[1] ? poke.types[1].type.name : null,  // Le deuxième type, s'il existe
                hp: poke.stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: poke.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: poke.stats.find(stat => stat.stat.name === 'defense').base_stat,
            });
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

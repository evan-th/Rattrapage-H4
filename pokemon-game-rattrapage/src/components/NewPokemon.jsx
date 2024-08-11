import React, { useState } from 'react';
import axios from 'axios';

function NewPokemon() {
  const [pokemon, setPokemon] = useState(null);
  const [message, setMessage] = useState('');

  const handleGetNewPokemon = async () => {
    setMessage('');
    setPokemon(null);

    // Générer un ID aléatoire entre 1 et 151
    const randomId = Math.floor(Math.random() * 151) + 1;

    try {
      // Récupérer le Pokémon correspondant depuis l'API
      const response = await axios.get(
        `http://localhost:5001/api/pokemons/${randomId}`,
      );
      setPokemon(response.data);

      try {
        // Ajouter le Pokémon à l'équipe de l'utilisateur
        await axios.post(`http://localhost:5001/api/pokemons/add-pokemon`, {
          pokemonId: randomId,
        });
        setMessage(`Félicitations ! Vous avez obtenu ${response.data.name}.`);
      } catch (err) {
        console.error("Erreur lors de l'ajout du Pokémon:", err);
        setMessage("Erreur lors de l'ajout du Pokémon. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du Pokémon:', err);
      setMessage(
        'Erreur lors de la récupération du Pokémon. Veuillez réessayer.',
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Obtenir un nouveau Pokémon
        </h2>
        <button
          onClick={handleGetNewPokemon}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Lancer la roulette
        </button>
        {pokemon && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-800">{pokemon.name}</h3>
            <p>
              Type : {pokemon.type1} {pokemon.type2 && `/${pokemon.type2}`}
            </p>
            <p>HP : {pokemon.hp}</p>
            <p>Attaque : {pokemon.attack}</p>
            <p>Défense : {pokemon.defense}</p>
            {/* Affichage du frontSprite */}
            {pokemon.frontSprite && (
              <img
                src={pokemon.frontSprite}
                alt={`${pokemon.name} sprite`}
                className="mx-auto mt-4"
              />
            )}
          </div>
        )}
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
}

export default NewPokemon;

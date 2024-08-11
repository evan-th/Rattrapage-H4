import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuButton from './MenuButton'; // Importer le bouton Menu

function ManageTeam() {
  const [team, setTeam] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all pokemons for the current user
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/pokemons/user/team',
        );
        const allPokemonsResponse = await axios.get(
          'http://localhost:5001/api/pokemons/user/pokemons',
        );

        // Separate the pokemons into team and non-team categories
        const teamPokemons = response.data.filter(
          (pokemon) => pokemon.PokemonTeam.isInTeam,
        );
        const nonTeamPokemons = allPokemonsResponse.data.filter(
          (pokemon) => !pokemon.PokemonTeam.isInTeam,
        );

        setTeam(teamPokemons);
        setAllPokemons(nonTeamPokemons);
      } catch (err) {
        console.error('Erreur lors de la récupération des Pokémon:', err);
      }
    };

    fetchPokemons();
  }, []);

  const addToTeam = async (pokemonId) => {
    if (team.length >= 3) {
      setMessage('Vous ne pouvez avoir que 3 Pokémon dans votre équipe.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/pokemons/add-to-team',
        { pokemonId },
      );

      if (response.status === 200) {
        const updatedPokemon = allPokemons.find((p) => p.id === pokemonId);
        setTeam([...team, updatedPokemon]);
        setAllPokemons(allPokemons.filter((p) => p.id !== pokemonId));
        setMessage(`${updatedPokemon.name} a été ajouté à votre équipe.`);
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du Pokémon à l'équipe:", err);
      setMessage("Erreur lors de l'ajout du Pokémon. Veuillez réessayer.");
    }
  };

  const removeFromTeam = async (pokemonId) => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/pokemons/remove-from-team',
        { pokemonId },
      );

      if (response.status === 200) {
        const updatedPokemon = team.find((p) => p.id === pokemonId);
        setAllPokemons([...allPokemons, updatedPokemon]);
        setTeam(team.filter((p) => p.id !== pokemonId));
        setMessage(`${updatedPokemon.name} a été retiré de votre équipe.`);
      }
    } catch (err) {
      console.error("Erreur lors du retrait du Pokémon de l'équipe:", err);
      setMessage('Erreur lors du retrait du Pokémon. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {' '}
      {/* Ajout de `relative` pour que le bouton Menu fonctionne correctement */}
      <MenuButton /> {/* Ajout du bouton Menu */}
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Mon Équipe
        </h2>
        {team.map((pokemon) => (
          <div
            key={pokemon.id}
            className="flex items-center justify-between p-2 mt-4 bg-white rounded shadow-md"
          >
            <div className="flex items-center">
              <img
                src={pokemon.frontSprite}
                alt={pokemon.name}
                className="w-12 h-12 mr-4"
              />
              <span>{pokemon.name}</span>
            </div>
            <button
              onClick={() => removeFromTeam(pokemon.id)}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Tous mes Pokémon
        </h2>
        {allPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="flex items-center justify-between p-2 mt-4 bg-white rounded shadow-md"
          >
            <div className="flex items-center">
              <img
                src={pokemon.frontSprite}
                alt={pokemon.name}
                className="w-12 h-12 mr-4"
              />
              <span>{pokemon.name}</span>
            </div>
            <button
              onClick={() => addToTeam(pokemon.id)}
              className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 text-white rounded">
          {message}
        </div>
      )}
    </div>
  );
}

export default ManageTeam;

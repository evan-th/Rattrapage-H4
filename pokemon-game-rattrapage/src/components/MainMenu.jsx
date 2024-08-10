import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  const navigate = useNavigate();

  const handleCombatClick = () => {
    navigate('/combat');
  };

  const handleManageTeamClick = () => {
    navigate('/manage-team');
  };

  const handleGetNewPokemonClick = () => {
    navigate('/new-pokemon');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Menu Principal</h1>
        <div>
          <button
            onClick={handleCombatClick}
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Combattre
          </button>
        </div>
        <div>
          <button
            onClick={handleManageTeamClick}
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          >
            Gérer mon équipe
          </button>
        </div>
        <div>
          <button
            onClick={handleGetNewPokemonClick}
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-purple-500 rounded hover:bg-purple-700"
          >
            Avoir un nouveau Pokémon
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;

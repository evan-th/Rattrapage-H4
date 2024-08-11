import React from 'react';
import { useNavigate } from 'react-router-dom';

function MenuButton() {
  const navigate = useNavigate();

  return (
    <button
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        padding: '10px 20px',
        backgroundColor: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000, // Assurez-vous que le bouton est au-dessus de tout autre contenu
      }}
      onClick={() => navigate('/menu')}
    >
      Menu
    </button>
  );
}

export default MenuButton;

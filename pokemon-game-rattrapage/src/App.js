import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Combat from './components/Combat';
import ManageTeam from './components/ManageTeam';
import NewPokemon from './components/NewPokemon';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/combat" element={<Combat />} />
        <Route path="/manage-team" element={<ManageTeam />} />
        <Route path="/new-pokemon" element={<NewPokemon />} />
      </Routes>
    </Router>
  );
}

export default App;

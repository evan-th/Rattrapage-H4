import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

function Auth() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      {showLogin ? <Login /> : <Signup />}
      <div className="text-center mt-4">
        {showLogin ? (
          <p>
            Vous n'avez pas de compte ?{' '}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setShowLogin(false)}
            >
              Inscrivez-vous
            </button>
          </p>
        ) : (
          <p>
            Vous avez déjà un compte ?{' '}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setShowLogin(true)}
            >
              Connexion
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;

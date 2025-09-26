import React, { useState, useEffect } from 'react';
import PostsPage from './pages/PostsPage';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Verifica se já existe um login salvo no navegador
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed !== '') {
      localStorage.setItem('username', trimmed);
      setUsername(trimmed);
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setLoggedIn(false);
  };

  // Se não estiver logado, exibe a nova tela de login
  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome to CodeLeap network!</h2>
          <form onSubmit={handleLogin} className="login-form">
            <label>Your username</label>
            <input
              type="text"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit" disabled={!username.trim()}>
              ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Se estiver logado, mostra a página principal com o botão de logout
  return <PostsPage username={username} onLogout={handleLogout} />;
}

export default App;


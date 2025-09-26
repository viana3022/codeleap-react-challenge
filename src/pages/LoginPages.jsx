import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = name.trim();
    if (username) {
      localStorage.setItem('username', username);
      onLogin(username);
    }
  };

  return (
    <div className="app-shell">
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <div className="card-header">Welcome to CodeLeap</div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="post-form">
            <label>Your username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <button type="submit">Enter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

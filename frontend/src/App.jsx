import { useEffect, useState } from 'react';
import CartMap from './components/CartMap';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <div className="theme-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </div>
        </div>

        <h1 className="app-title">
          <img
            src="/food-cart.svg"
            alt="WanderEats logo"
            className="app-logo"
          />
          WanderEats
        </h1>
        <p className="app-subtitle">
          Discover food carts wherever you wander.
        </p>
      </header>

      <CartMap />
    </div>
  );
}

export default App;

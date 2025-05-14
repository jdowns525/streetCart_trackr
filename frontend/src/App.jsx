import CartMap from './components/CartMap';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <img
            src="/food-location.svg"
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

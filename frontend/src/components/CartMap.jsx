import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import haversine from 'haversine-distance';
import CartForm from './CartForm';

const cities = {
  "New York": [40.7128, -74.006],
  "Los Angeles": [34.0522, -118.2437],
  "Chicago": [41.8781, -87.6298],
  "San Francisco": [37.7749, -122.4194],
  "Tokyo": [35.6895, 139.6917],
  "San Andrés": [12.5847, -81.7006],
  "San Diego": [32.7157, -117.1611],
  "Houston": [29.7604, -95.3698],
};

const foodCartIcon = new L.Icon({
  iconUrl: '/food-location.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const LocationMarker = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
};

const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 12);
  }, [coords, map]);
  return null;
};

const CartMap = () => {
  const [carts, setCarts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCart, setEditingCart] = useState(null);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [selectedCity, setSelectedCity] = useState("New York");
  const [mapCenter, setMapCenter] = useState(cities["New York"]);
  const [userCoords, setUserCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const fetchCarts = async () => {
    try {
      const res = await axios.get('/api/carts');
      setCarts(res.data);
    } catch (err) {
      console.error('Error fetching carts:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pin?')) return;
    try {
      await axios.delete(`/api/carts/${id}`);
      fetchCarts();
    } catch (err) {
      alert('Failed to delete pin');
    }
  };

  const handleEdit = (cart) => {
    setEditingCart(cart);
    setFormOpen(true);
  };

  const handleMapClick = (latlng) => {
    setPendingLatLng(latlng);
    setEditingCart(null);
    setFormOpen(true);
    setSearchResult(null);
  };

  const handleFormSubmit = async ({ name, notes }) => {
    try {
      if (editingCart) {
        await axios.put(`/api/carts/${editingCart._id}`, { name, notes });
      } else if (pendingLatLng) {
        const { lat, lng } = pendingLatLng;
        await axios.post('/api/carts', { name, notes, lat, lng });
      }
      fetchCarts();
      setFormOpen(false);
      setEditingCart(null);
      setPendingLatLng(null);
    } catch (err) {
      alert('Failed to save pin');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: searchQuery, format: 'json', limit: 1 }
      });

      if (res.data?.length > 0) {
        const { lat, lon } = res.data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(coords);
        setSearchResult(coords);
      } else {
        alert('Location not found');
      }
    } catch (err) {
      alert('Search failed');
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved && cities[saved]) {
      setSelectedCity(saved);
      setMapCenter(cities[saved]);
    }
  }, []);

  useEffect(() => {
    if (selectedCity !== "My Location") {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  const filteredCarts = selectedCity === "My Location"
    ? carts
    : carts.filter((cart) => {
        const cityCoords = cities[selectedCity];
        const distance = haversine(
          { lat: cityCoords[0], lon: cityCoords[1] },
          { lat: cart.lat, lon: cart.lng }
        );
        return distance < 50000;
      });

  return (
    <>
      {/* Top Controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <label htmlFor="city-select" style={{ marginRight: '0.5rem' }}>
            Select a City:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => {
              const city = e.target.value;
              setSelectedCity(city);
              if (city === "My Location" && userCoords) {
                setMapCenter(userCoords);
              } else if (cities[city]) {
                setMapCenter(cities[city]);
              }
            }}
          >
            {[...Object.keys(cities), "My Location"].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleSearch}>🔍</button>
          <button onClick={() => {
            navigator.geolocation.getCurrentPosition((pos) => {
              const { latitude, longitude } = pos.coords;
              const coords = [latitude, longitude];
              setUserCoords(coords);
              setMapCenter(coords);
              setSelectedCity("My Location");
            });
          }}>
            My Location
          </button>
        </div>
      </div>

      {/* Side-by-side layout */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        {/* Map Card with Inner Card */}
        <div style={{ flex: 2 }}>
          <div className="card">
            <div className="inner-card" style={{ padding: 0, height: '600px', borderRadius: '8px', overflow: 'hidden' }}>
              <MapContainer
                center={mapCenter}
                zoom={12}
                minZoom={3}
                maxZoom={20}
                style={{ height: '100%', width: '100%' }}
              >
                <ChangeMapView coords={mapCenter} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredCarts.map((cart) => (
                  <Marker
                    key={cart._id}
                    position={[cart.lat, cart.lng]}
                    icon={foodCartIcon}
                  >
                    <Popup>
                      <strong>{cart.name || 'Unnamed Cart'}</strong><br />
                      <em>{cart.notes}</em><br />
                      <div style={{ marginTop: '0.5rem' }}>
                        <button onClick={() => handleEdit(cart)}>✏️</button>{' '}
                        <button onClick={() => handleDelete(cart._id)}>🗑️</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {searchResult && (
                  <Marker position={searchResult} icon={foodCartIcon}>
                    <Popup>
                      <strong>Search Result</strong><br />
                      Click map to pin
                    </Popup>
                  </Marker>
                )}
                <LocationMarker onMapClick={handleMapClick} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="card list-wrapper">
          <h3>📍 Saved Carts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredCarts.map((cart) => (
              <li key={cart._id} style={{ marginBottom: '1rem' }}>
                <div className="inner-card">
                  <strong>{cart.name || 'Unnamed Cart'}</strong><br />
                  <small>{cart.notes}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CartForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCart(null);
          setPendingLatLng(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCart}
      />
    </>
  );
};

export default CartMap;

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

// 🌍 Predefined cities
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

// 📍 Custom food cart icon
const foodCartIcon = new L.Icon({
  iconUrl: '/food-cart.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const LocationMarker = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
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

  useEffect(() => {
    fetchCarts();
  }, []);

  // ⏳ Load saved city from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved && cities[saved]) {
      setSelectedCity(saved);
      setMapCenter(cities[saved]);
    }
  }, []);

  // 💾 Save selected city (not "My Location")
  useEffect(() => {
    if (selectedCity !== "My Location") {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  // 🔍 Filter pins by city (unless My Location)
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
      {/* 🌍 City Selector */}
      <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
        <label htmlFor="city-select" style={{ marginRight: '0.5rem' }}>
          🌎 Select a city:
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
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* 📍 Use My Location Button Only */}
      <div style={{ margin: '1rem 0' }}>
        <button onClick={() => {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const coords = [latitude, longitude];
            setUserCoords(coords);
            setMapCenter(coords);
            setSelectedCity("My Location");
          });
        }}>
          📍 Use My Location
        </button>
      </div>

      {/* 🗺️ Map */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        minZoom={3}
        maxZoom={20}
        style={{ height: '600px', width: '100%' }}
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
              Lat: {cart.lat.toFixed(4)}, Lng: {cart.lng.toFixed(4)}
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => handleEdit(cart)}>✏️ Edit</button>{' '}
                <button onClick={() => handleDelete(cart._id)}>🗑️ Delete</button>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationMarker onMapClick={handleMapClick} />
      </MapContainer>

      {/* 📝 Modal Form */}
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

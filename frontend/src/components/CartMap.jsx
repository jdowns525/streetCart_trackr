import { useEffect, useRef, useState } from 'react';
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

import CartForm from './CartForm';

// 🌍 Cities and their coordinates
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

// 🎯 Custom food cart SVG icon
const foodCartIcon = new L.Icon({
  iconUrl: '/food-cart.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

const LocationMarker = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// 🎛️ Component to update map view when city changes
const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 12); // city-level zoom
  }, [coords, map]);
  return null;
};

const CartMap = () => {
  const [carts, setCarts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCart, setEditingCart] = useState(null);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [selectedCity, setSelectedCity] = useState("New York");

  const mapCenter = cities[selectedCity];

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
        await axios.put(`/api/carts/${editingCart._id}`, {
          name,
          notes,
        });
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

  return (
    <>
      {/* 🌐 City selector */}
      <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
        <label htmlFor="city-select" style={{ marginRight: '0.5rem' }}>
          🌍 Select a city:
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {Object.entries(cities).map(([name]) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* 🗺️ Map */}
      <MapContainer
        center={mapCenter}
        zoom={12} // default city-level zoom
        minZoom={3}
        maxZoom={20}
        style={{ height: '600px', width: '100%' }}
      >
        <ChangeMapView coords={mapCenter} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {carts.map((cart) => (
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

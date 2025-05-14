import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

import CartForm from './CartForm'; // Modal form

// Define custom SVG icon for food carts
const foodCartIcon = new L.Icon({
  iconUrl: '/food-cart.svg', // Make sure this file is in public/ folder
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

const CartMap = () => {
  const [carts, setCarts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCart, setEditingCart] = useState(null);
  const [pendingLatLng, setPendingLatLng] = useState(null);

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
      <MapContainer center={[40.7128, -74.006]} zoom={13} style={{ height: '600px', width: '100%' }}>
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

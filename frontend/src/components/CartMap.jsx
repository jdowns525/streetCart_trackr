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

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ refreshMarkers }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      const name = prompt('Restaurant name?');
      const notes = prompt('What did you like about it?');

      if (!name && !notes) return;

      setPosition([lat, lng]);

      try {
        await axios.post('/api/carts', { lat, lng, name, notes });
        refreshMarkers();
      } catch (err) {
        alert('Failed to save pin');
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        📍 Temporary Pin<br />
        You just added this!
      </Popup>
    </Marker>
  ) : null;
};

const CartMap = () => {
  const [carts, setCarts] = useState([]);

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

  const handleEdit = async (cart) => {
    const newName = prompt('Edit name:', cart.name);
    const newNotes = prompt('Edit notes:', cart.notes);
    if (newName === null && newNotes === null) return;

    try {
      await axios.put(`/api/carts/${cart._id}`, {
        name: newName ?? cart.name,
        notes: newNotes ?? cart.notes,
      });
      fetchCarts();
    } catch (err) {
      alert('Failed to update pin');
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <MapContainer center={[40.7128, -74.006]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {carts.map((cart) => (
        <Marker key={cart._id} position={[cart.lat, cart.lng]}>
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

      <LocationMarker refreshMarkers={fetchCarts} />
    </MapContainer>
  );
};

export default CartMap;

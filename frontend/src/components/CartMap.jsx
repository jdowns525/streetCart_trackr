import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Leaflet marker icons (for Vite + React)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set correct icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle clicks and add a new marker
const LocationMarker = ({ refreshMarkers }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      const name = prompt('Restaurant name?');
      const notes = prompt('What did you like about it?');

      // Skip if user cancels
      if (!name && !notes) return;

      setPosition([lat, lng]);

      try {
        await axios.post('/api/carts', {
          lat,
          lng,
          name,
          notes,
        });
        refreshMarkers();
      } catch (err) {
        console.error('Error saving marker:', err);
        alert('Failed to save marker.');
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        Temporary Pin<br />
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

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Render markers from backend */}
      {carts.map((cart) => (
        <Marker key={cart._id} position={[cart.lat, cart.lng]}>
          <Popup>
            <strong>{cart.name || 'Unnamed Cart'}</strong><br />
            {cart.notes && <em>{cart.notes}</em>}<br />
            Lat: {cart.lat.toFixed(4)}, Lng: {cart.lng.toFixed(4)}
          </Popup>
        </Marker>
      ))}

      {/* Add new marker on click */}
      <LocationMarker refreshMarkers={fetchCarts} />
    </MapContainer>
  );
};

export default CartMap;

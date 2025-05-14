import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// ✅ Import icons correctly for Vite (ES Modules)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ✅ Set leaflet icon paths
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
      setPosition([lat, lng]);

      // Optional: send to backend if ready
      await axios.post('/api/carts', { lat, lng });

      refreshMarkers();
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        Temporary Cart Location
      </Popup>
    </Marker>
  ) : null;
};


const CartMap = () => {
  const [carts, setCarts] = useState([]);

  const fetchCarts = async () => {
    const res = await axios.get('/api/carts');
    setCarts(res.data);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {carts.map((cart) => (
        <Marker key={cart._id} position={[cart.lat, cart.lng]}>
          <Popup>
            Cart ID: {cart._id}<br />
            Latitude: {cart.lat.toFixed(4)}, Longitude: {cart.lng.toFixed(4)}
          </Popup>
        </Marker>
      ))}
      <LocationMarker refreshMarkers={fetchCarts} />
    </MapContainer>
  );
};

export default CartMap;

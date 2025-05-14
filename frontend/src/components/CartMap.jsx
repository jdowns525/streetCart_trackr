import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ refreshMarkers }) => {
  useMapEvents({
    click: async (e) => {
      await axios.post('/api/carts', { lat: e.latlng.lat, lng: e.latlng.lng });
      refreshMarkers();
    },
  });
  return null;
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

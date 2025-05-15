📍 StreetCart Trackr

An interactive full-stack app for tracking street food carts in real time. Built with React + Vite, LeafletJS, Express, and MongoDB, it supports pinning locations on a map with custom notes, editing them, and removing them — all backed by a robust, secure backend API.

────────────────────────────────────
✨ Features

- 🗺️ Interactive Map using Leaflet
- 📍 Add, Edit, Delete Food Cart Pins
- 📋 Toggle between Map & List View
- 🏙️ City Picker + 📍 Geolocation Support
- 🔍 Search for Locations by Name (Geocoding)
- 📝 Add Notes to each cart
- 🌗 Dark/Light Mode toggle
- 🛡️ Secure Backend with Rate Limiting & Helmet

---

🧰 Technologies Used

🖥️ Frontend
- React – UI library
- Vite – Fast bundler & dev server
- Leaflet – Mapping library
- React-Leaflet – React bindings for Leaflet
- Axios – HTTP requests
- Haversine-distance – Geolocation distance filtering

🗄️ Backend
- Express.js – Node.js server framework
- MongoDB + Mongoose – NoSQL database & ORM
- Helmet – HTTP header security
- CORS – Cross-origin resource sharing
- dotenv – Environment variable management
- express-rate-limit – API rate limiting
- express-validator – Input validation

🛠️ Dev Tools
- nodemon – Auto-reloads backend during development

🌐 External APIs
- OpenStreetMap Nominatim API – For location search (geocoding)    

────────────────────────────────────
🔧 Setup Instructions

1. Clone the repo

   git clone https://github.com/your-username/streetcart-trackr.git
   cd streetcart-trackr

2. Setup .env in /backend

   MONGO_URI=your_mongodb_connection_string

3. Install backend dependencies

   cd backend
   npm install

4. Run the backend server

   npm run dev
   # or
   npx nodemon index.js

5. Setup frontend

   cd ../frontend
   npm install
   npm run dev

> Frontend runs at: http://localhost:5173  
> Backend API runs at: http://localhost:5000/api/carts

────────────────────────────────────
📂 Folder Structure

streetCart_trackr/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── access.log / error.log
│   └── index.js
├── frontend/
│   ├── src/
│   │   └── components/CartMap.jsx
│   └── vite.config.js

────────────────────────────────────
✅ Production Readiness

- ✅ Helmet for security headers
- ✅ Rate limiting with IP proxy trust
- ✅ Input validation for all API routes
- ✅ Global error handling
- ✅ File-based logging for production monitoring
- ✅ Modular, clean code for scalability

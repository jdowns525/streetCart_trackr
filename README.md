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

✅ Production Readiness

- ✅ Helmet for security headers
- ✅ Rate limiting with IP proxy trust
- ✅ Input validation for all API routes
- ✅ Global error handling
- ✅ File-based logging for production monitoring
- ✅ Modular, clean code for scalability

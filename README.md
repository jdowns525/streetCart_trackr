📍 StreetCart Trackr

An interactive full-stack app for tracking street food carts across cities — pin locations, add notes, search, and manage carts with a sleek UI and secure backend. Built with React, LeafletJS, Express, and MongoDB.

────────────────────────────────────
✨ Features

- 🗺️ Interactive Map with Leaflet & React-Leaflet
- 📍 Add, Edit, Delete Food Cart Pins with Notes
- 📋 Toggle Between Map View and Cart List
- 🏙️ City Selector + 📍 Geolocation Support
- 🔍 Location Search via Geocoding
- 🌗 Light & Dark Mode UI Toggle
- 🛡️ Robust Backend with Input Validation, Rate Limiting, and Secure Headers

────────────────────────────────────
🧰 Technologies Used

🖥️ Frontend
- React – Component-based UI
- Vite – Lightning-fast build tool
- Leaflet & React-Leaflet – Interactive maps
- Axios – RESTful HTTP requests
- haversine-distance – Proximity filtering

🗄️ Backend
- Express.js – API server
- MongoDB + Mongoose – NoSQL data layer
- Helmet – Security middleware
- express-rate-limit – DoS protection
- express-validator – Schema validation
- dotenv – Environment variable handling
- CORS – Cross-origin resource sharing

🧪 Testing
- Jest – Unit and integration testing
- Supertest – HTTP endpoint testing
- mongodb-memory-server – In-memory test database

🛠️ Dev Tools
- nodemon – Live server reloading
- Git Filter-Repo – Git history cleanup for large files

────────────────────────────────────
✅ Production Readiness

- ✅ Security Headers via Helmet
- ✅ Rate Limiting with Proxy Trust (for Vercel, etc.)
- ✅ Robust Input Validation with Error Handling
- ✅ File Logging (access.log / error.log)
- ✅ Testing Coverage for CRUD and edge cases
- ✅ Refactored Git History to remove large binaries
- ✅ Modular Codebase with clear separation of concerns

────────────────────────────────────
🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (Local or Atlas)

### Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

### Run the App
# Backend
cd backend
npm run dev

# Frontend (in separate terminal)
cd frontend
npm run dev

────────────────────────────────────
🧪 Run Tests
cd backend
NODE_ENV=test npm test

Tests cover creation, reading, updating, and deleting carts, including validation and edge cases.

────────────────────────────────────
📁 Environment Variables

Create a .env file inside /backend:

MONGO_URI=your_mongodb_connection_string

────────────────────────────────────
👨‍💻 Author

Built with 🍕, ☕, and ❤️ by @jdowns525

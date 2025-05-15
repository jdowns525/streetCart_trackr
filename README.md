📍 StreetCart Trackr

An interactive full-stack app for tracking street food carts in real time. Built with React + Vite, LeafletJS, Express, and MongoDB, it supports pinning locations on a map with custom notes, editing them, and removing them — all backed by a robust, secure backend API.

────────────────────────────────────
🚀 Features

- 🗺️ Interactive Map UI with LeafletJS
- 📌 Add Pins by clicking the map
- 📝 Add name & notes about the food cart
- ✏️ Edit pins (name & notes)
- 🗑️ Delete pins
- 🔐 Secured API with Helmet, CORS, and rate limiting
- ⚠️ Input validation using express-validator
- 🧾 Request & error logging with Morgan + file logs
- 📦 MongoDB Atlas for cloud-based storage
- 🧪 Backend ready for 10× load testing

────────────────────────────────────
🧰 Tech Stack

Frontend      | Backend             | Infra/Security         
--------------|---------------------|-------------------------
React (Vite)  | Node.js + Express   | Helmet (security headers)
LeafletJS     | MongoDB (Mongoose)  | express-rate-limit     
Axios         | express-validator   | Morgan (logging)       

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

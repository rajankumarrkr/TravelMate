# TravelMate ✈️

> **A premium, full-stack travel companion app** — Plan trips with AI, track expenses, share itineraries, and explore destinations on an interactive map. Built with the MERN stack.

[![GitHub last commit](https://img.shields.io/github/last-commit/rajankumarrkr/TravelMate?style=flat-square)](https://github.com/rajankumarrkr/TravelMate)
[![License](https://img.shields.io/badge/license-MIT-indigo?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org)

---

## 📸 Preview

| Home | Dashboard | Trip Details |
|------|-----------|--------------|
| Mobile-first hero & landing | Analytics charts & stats cards | Timeline itinerary & interactive map |

---

## ✨ Features

### 🤖 AI Trip Planner
- Generate full day-by-day itineraries using Google Gemini AI
- Smart suggestions for activities, food, stay, and estimated cost
- Automatically calculates trip duration from selected dates

### 📊 Analytics Dashboard
- Interactive Recharts visualizations — expense breakdown & monthly spending
- Key stats: Total Trips, Total Expenses, Upcoming Trips, Days Traveled
- Recent trip activity feed

### 🗺️ Interactive Map
- Powered by **OpenStreetMap + react-leaflet** (100% free, no API key)
- Auto-geocodes trip destination via **Nominatim API**
- Animated marker with popup on the destination location

### 💰 Expense Tracking & Budget Alerts
- Log expenses by category: Food, Travel, Hotel, Entertainment
- Real-time budget progress bar — turns red when over budget
- `🚨 Budget Exceeded by ₹X` alert banner

### 👥 Share Trip (Public Link)
- One-click generation of a secure, unguessable share token
- Shares a read-only public view (itinerary + photos) — financial data stays private
- Works in Incognito/unauthenticated browsers

### 📸 Trip Memories (Cloudinary)
- Upload and store photos to the cloud via **Cloudinary**
- Responsive 2-column photo gallery grid per trip
- Lazy-loaded images with hover reveal animations

### 🔔 Notification System
- Upcoming trip reminders
- Budget overspend alerts

### 🌙 Dark Mode
- Global theme toggle (☀️ / 🌙) in Navbar
- Remembers preference via `localStorage`
- Auto-detects OS system theme on first visit

### 🌐 Multi-language Support (i18n)
- English / Hindi toggle — real-time switching, no page reload
- Built with `react-i18next`

### 📱 Mobile-First Responsive Design
- Sticky Bottom Navigation (Home / Trips / AI Planner)
- Glassmorphic UI cards with rounded corners and soft shadows
- Timeline-style itinerary display
- Touch-friendly interactions, hover & tap animations

### 🔐 Authentication
- JWT-based secure login & registration
- Protected routes via `PrivateRoute` component
- Token persisted in `localStorage`

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router 7 |
| **UI/UX** | Glassmorphism, Recharts, react-leaflet, Leaflet.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **AI** | Google Gemini API |
| **Storage** | Cloudinary (photo uploads via Multer) |
| **Maps** | OpenStreetMap + Nominatim (free, no key needed) |
| **i18n** | react-i18next |

---

## 📂 Project Structure

```
TravelMate/
├── client/                        # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx          # Responsive top navbar
│       │   ├── BottomNav.jsx       # Mobile sticky bottom nav
│       │   ├── TripMap.jsx         # OpenStreetMap component
│       │   └── PrivateRoute.jsx
│       ├── context/
│       │   └── ThemeContext.jsx    # Dark/Light mode state
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Trips.jsx
│       │   ├── TripDetails.jsx
│       │   ├── SharedTrip.jsx      # Public read-only trip view
│       │   └── AITripPlanner.jsx
│       ├── services/               # Axios API service layer
│       │   ├── tripService.js
│       │   ├── expenseService.js
│       │   └── authService.js
│       └── i18n.js                 # Translation dictionaries (EN/HI)
│
├── server/                        # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   │   ├── trip.model.js           # Trip schema (with shareToken, photos)
│   │   └── user.model.js
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   └── utils/
│       ├── multer.js               # Cloudinary upload config
│       └── apiError.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18+ 
- **MongoDB** (Local or [Atlas](https://cloud.mongodb.com))
- **Cloudinary** account (free tier) — for photo uploads
- **Google Gemini API Key** — for AI itinerary generation

### 1. Clone the Repository

```bash
git clone https://github.com/rajankumarrkr/TravelMate.git
cd TravelMate
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/travelmate
JWT_SECRET=your_super_secret_key

# Cloudinary (for photo uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini (for AI itinerary)
GEMINI_API_KEY=your_gemini_key
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Run the App

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The app will be running at **[http://localhost:5173](http://localhost:5173)**

> 💡 **No Mapbox or Google Maps key required** — the interactive map uses OpenStreetMap which is completely free.

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login & get JWT |
| `GET` | `/api/trips` | ✅ | Get user's trips |
| `POST` | `/api/trips` | ✅ | Create trip (AI itinerary) |
| `GET` | `/api/trips/:id` | ✅ | Get single trip |
| `DELETE`| `/api/trips/:id` | ✅ | Delete a trip |
| `POST` | `/api/trips/:id/photos` | ✅ | Upload trip photo |
| `POST` | `/api/trips/:id/share` | ✅ | Generate share token |
| `GET` | `/api/trips/shared/:token` | ❌ | Public trip view |
| `GET` | `/api/expenses/:tripId` | ✅ | Get trip expenses |
| `POST` | `/api/expenses` | ✅ | Add expense |

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch: `git checkout -b feature/AmazingFeature`  
3. Commit your changes: `git commit -m 'Add AmazingFeature'`  
4. Push to the branch: `git push origin feature/AmazingFeature`  
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Built with ❤️ for travelers, by travelers.<br/><strong>TravelMate</strong> — Plan. Explore. Remember.</p>

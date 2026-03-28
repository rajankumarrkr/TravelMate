# TravelMate ✈️

TravelMate is a premium, full-stack travel companion application designed to streamline trip planning, itinerary management, and expense tracking.

## ✨ Key Features

- **📊 Intelligent Dashboard**: Gain 360-degree insights into your travel history, total spending, and upcoming countdowns.
- **🗺️ Advanced Itinerary Planning**: Meticulously organize every day of your trip with a dynamic planning interface.
- **💰 Smart Expense Tracking**: Capture and categorize expenses in real-time with automated currency summaries.
- **📱 Responsive Excellence**: A pixel-perfect, mobile-first design that looks stunning on desktops, tablets, and phones.
- **🎨 Glassmorphic Premium UI**: A modern design language featuring frosted-glass effects, smooth transitions, and vibrant accents.
- **🔐 Secure Authentication**: Industrial-grade security with JWT and protected resource management.

## 🚀 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Vite, Axios, React Router 7.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Styling**: Modern CSS with utility-first Tailwind methodology.

## 📂 Project Structure

```bash
Travelmate/
├── client/           # Modern React Frontend (Vite)
│   ├── src/assets/   # Visual assets and media
│   └── src/pages/    # Responsive application screens
├── server/           # Robust Node.js & Express API
│   ├── models/       # MongoDB Schemas
│   └── routes/       # API endpoint definitions
├── .gitignore        # Global exclusion patterns
└── README.md         # Comprehensive project documentation
```

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **MongoDB**: A running instance (Local or Atlas)
- **Package Manager**: npm or yarn

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Travelmate
   ```

2. **Backend Configuration**:
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file with your `MONGO_URI`, `JWT_SECRET`, and `PORT`.*

3. **Frontend Configuration**:
   ```bash
   cd ../client
   npm install
   ```

### Running the App

- **Backend API**: Run `npm start` (or `node server.js`) in the `server` directory.
- **Frontend App**: Run `npm run dev` in the `client` directory.

---
Built with ❤️ for travelers by travelers.

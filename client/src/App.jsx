import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Route
        path="/trips"
        element={
          <PrivateRoute>
            <Trips />
          </PrivateRoute>
        }
      />
      <Route
        path="/trips/:id"
        element={
          <PrivateRoute>
            <TripDetails />
          </PrivateRoute>
        }
      />
    </BrowserRouter>
  );
}

export default App;
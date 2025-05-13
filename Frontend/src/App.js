import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./login/Login";
import Admin from "./Dashboard/AdminDashboard";
import Cashier from "./Dashboard/CashierDashboard";
import ProtectedRoute from "./login/ProtectedRoute";
import Pharmacist from "./Dashboard/PharmacistDashboard";
import Homepage from "./Dashboard/Homepage"; // ✅ Corrected import

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to homepage */}
        <Route path="/" element={<Navigate to="/Homepage" />} />

        {/* Homepage route */}
        <Route path="/Homepage" element={<Homepage />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Admin dashboard (protected) */}
        <Route
          path="/Admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Cashier dashboard (protected) */}
        <Route
          path="/Cashier"
          element={
            <ProtectedRoute>
              <Cashier />
            </ProtectedRoute>
          }
        />

        {/* Pharmacist dashboard (protected) */}
        <Route
          path="/Pharmacist"
          element={
            <ProtectedRoute>
              <Pharmacist />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

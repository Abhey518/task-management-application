import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import './App.css';

function App() {
  
  return (
    <BrowserRouter>
    
      <Routes>

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />

        <Route path="*" element={
          <Navigate to="/login" replace />
        } />

      </Routes>

    </BrowserRouter>
  )
};

export default App;

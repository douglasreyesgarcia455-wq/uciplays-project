import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Ruta corregida incluyendo la subcarpeta 'layout'
import Navbar from "./components/layout/Navbar.jsx"; 

import Home from "./pages/Home";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import DetalleEvento from "./pages/DetalleEvento";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/evento/:id" element={<DetalleEvento />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
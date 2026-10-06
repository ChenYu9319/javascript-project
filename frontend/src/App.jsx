import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import BookSearch from './pages/BookSearch';
import BookDetail from './pages/BookDetail';
import MemberProfile from './pages/MemberProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-4 pb-5 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<BookSearch />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={
              <ProtectedRoute allowedRole="member">
                <MemberProfile />
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/inventory" element={
              <ProtectedRoute allowedRole="admin">
                <AdminInventory />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
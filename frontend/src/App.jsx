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
import AdminUsers from './pages/AdminUsers'; // 1. 引入管理员用户列表页
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
            
            {/* 2. 移到 Routes 内部，并加上管理员权限保护 */}
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRole="admin">
                <AdminUsers />
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
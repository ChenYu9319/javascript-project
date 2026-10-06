import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/Auth';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">📚 LibHub Central</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Book Search</Link>
                        </li>
                        {user && user.role === 'member' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">My Borrowing</Link>
                            </li>
                        )}
                        {user && user.role === 'admin' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/inventory">Inventory</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center gap-2">
                        {user ? (
                            <>
                                <span className="text-light me-2">Hello, {user.username} ({user.role})</span>
                                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-light btn-sm me-2">Login</Link>
                                <Link to="/register" className="btn btn-outline-light btn-sm">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
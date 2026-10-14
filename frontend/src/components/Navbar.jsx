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
        <nav 
            className="navbar navbar-expand-lg navbar-dark shadow-sm mb-4 sticky-top"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
            <div className="container">
                {/* 点击 Logo 直接返回home */}
                <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2 text-white" to="/">
                    <i className="fa-solid fa-book-bookmark text-primary"></i> LibHub Central
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto ms-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link px-3 text-white-50" to="/search">
                                <i className="fa-solid fa-magnifying-glass me-1"></i> Catalog
                            </Link>
                        </li>
                        {/* 只有member能看到，没有login的和admin不能看到 */}
                        {user && user.role === 'member' && (
                            <li className="nav-item">
                                <Link className="nav-link px-3 text-white-50" to="/profile">
                                    <i className="fa-solid fa-user-check me-1"></i> My Borrows
                                </Link>
                            </li>
                        )}
                        {/* 只有admin有和看到 */}
                        {user && user.role === 'admin' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3 text-white-50" to="/admin/dashboard">
                                        <i className="fa-solid fa-chart-pie me-1"></i> Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3 text-white-50" to="/admin/inventory">
                                        <i className="fa-solid fa-boxes-stacked me-1"></i> Inventory
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                                <span className="text-white small">
                                    <i className="fa-solid fa-circle-user me-1 text-info"></i> {user.username}
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline-light btn-sm rounded-pill px-3">
                                    <i className="fa-solid fa-right-from-bracket me-1"></i> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-light btn-sm rounded-pill px-3 fw-medium">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm rounded-pill px-3">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
            style={{ 
                background: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <div className="container">
                {/* 点击 Logo 返回 Home */}
                <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2 text-white" to="/">
                    <i className="fa-solid fa-book-bookmark text-info"></i> LibHub Central
                </Link>

                <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto ms-lg-4 gap-2 align-items-lg-center">
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-info border-bottom border-info border-2' : 'text-white-50'}`}
                                style={{ transition: 'color 0.2s' }}
                                to="/search"
                            >
                                <i className="fa-solid fa-magnifying-glass me-1"></i> Catalog
                            </NavLink>
                        </li>

                        {/* 仅 Member 可见 */}
                        {user && user.role === 'member' && (
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-info border-bottom border-info border-2' : 'text-white-50'}`}
                                    style={{ transition: 'color 0.2s' }}
                                    to="/profile"
                                >
                                    <i className="fa-solid fa-user-check me-1"></i> My Borrows
                                </NavLink>
                            </li>
                        )}

                        {/* 仅 Admin 可见 - 统一 UI 样式（全部采用相同的 nav-link 与高亮下划线效果） */}
                        {user && user.role === 'admin' && (
                            <>
                                <li className="nav-item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-warning border-bottom border-warning border-2' : 'text-white-50'}`}
                                        style={{ transition: 'color 0.2s' }}
                                        to="/admin/dashboard"
                                    >
                                        <i className="fa-solid fa-chart-pie me-1"></i> Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-warning border-bottom border-warning border-2' : 'text-white-50'}`}
                                        style={{ transition: 'color 0.2s' }}
                                        to="/admin/inventory"
                                    >
                                        <i className="fa-solid fa-boxes-stacked me-1"></i> Inventory
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-warning border-bottom border-warning border-2' : 'text-white-50'}`}
                                        style={{ transition: 'color 0.2s' }}
                                        to="/admin/users"
                                    >
                                        <i className="fa-solid fa-users me-1"></i> Manage Members
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* 用户状态与控制区 */}
                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                {/* AdminUser / Member 视觉展示卡片 */}
                                <div 
                                    className="d-flex align-items-center gap-2.5 px-3 py-1.5 rounded-pill"
                                    style={{ 
                                        background: "rgba(255, 255, 255, 0.05)", 
                                        border: "1px solid rgba(255, 255, 255, 0.1)" 
                                    }}
                                >
                                    <i className={`fa-solid ${user.role === 'admin' ? 'fa-user-gear text-warning' : 'fa-circle-user text-info'} fs-6`}></i>
                                    <div className="d-flex flex-column text-start">
                                        <span className="text-white small fw-bold lh-1 mb-0.5">
                                            {user.username}
                                        </span>
                                        <span 
                                            className={`text-uppercase fw-semibold ${user.role === 'admin' ? 'text-warning' : 'text-info'}`} 
                                            style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Logout 按钮 */}
                                <button onClick={handleLogout} className="btn btn-outline-light btn-sm rounded-pill px-3 border-opacity-25">
                                    <i className="fa-solid fa-right-from-bracket me-1"></i> Logout
                                </button>
                            </div>
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
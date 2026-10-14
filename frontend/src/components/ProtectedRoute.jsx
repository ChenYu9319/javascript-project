import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/Auth';

const ProtectedRoute = ({ allowedRole, children }) => {
    const { user, token, loading } = useContext(AuthContext);
    const storedToken = token || localStorage.getItem('libhub_token');

    // 1. 如果 AuthContext 正在initializing data从localstroge，先等不直接出现数据
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // check 有没有 Login
    if (!user || !storedToken) {
        return <Navigate to="/login" replace />;
    }

    // 3. check user role
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
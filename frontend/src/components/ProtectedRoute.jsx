import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/Auth';

const ProtectedRoute = ({ allowedRole, children }) => {
    const { user, token } = useContext(AuthContext);
    const storedToken = token || localStorage.getItem('libhub_token');

    if (!user || !storedToken) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
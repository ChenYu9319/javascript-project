import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/Auth';

const ProtectedRoute = ({ allowedRole, children }) => {
    const { user, token, loading } = useContext(AuthContext);
    const storedToken = token || localStorage.getItem('libhub_token');

    // 1. 如果 AuthContext 正在初始化本地存储的数据，先等待不直接跳转
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // 2. 检查登录状态
    if (!user || !storedToken) {
        return <Navigate to="/login" replace />;
    }

    // 3. 检查角色权限
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
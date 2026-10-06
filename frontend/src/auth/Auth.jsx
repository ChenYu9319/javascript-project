import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('libhub_user');
        const savedToken = localStorage.getItem('libhub_token');
        
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('libhub_user', JSON.stringify(userData));
        localStorage.setItem('libhub_token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('libhub_user');
        localStorage.removeItem('libhub_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
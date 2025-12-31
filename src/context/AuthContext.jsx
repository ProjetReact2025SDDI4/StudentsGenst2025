import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await axios.get('/auth/me');
                    setUser(response.data.data);
                } catch (error) {
                    console.error('Session expirée ou invalide');
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (credentials) => {
        const response = await axios.post('/auth/login', credentials);
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const refreshUser = async () => {
        if (!token) return;
        const response = await axios.get('/auth/me');
        setUser(response.data.data);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser, loading, isAdmin: user?.role === 'ADMIN', isAssistant: user?.role === 'ASSISTANT', isFormateur: user?.role === 'FORMATEUR' }}>
            {children}
        </AuthContext.Provider>
    );
};

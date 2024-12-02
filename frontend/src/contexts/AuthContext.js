import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults
    axios.defaults.withCredentials = true;

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/check_auth', {
                withCredentials: true
            });

            if (response.data.login) {
                setUser({
                    username: response.data.username,
                    userType: response.data.userType,
                    userId: response.data.userId,
                    login: response.data.login
                });
                setError(null);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
            setError(err.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const logoutEndpoint = user?.userType === 'Admin' 
                ? '/api/admin_logout' 
                : '/api/logout';
            
            await axios.post(`http://localhost:8080${logoutEndpoint}`, {}, { 
                withCredentials: true 
            });
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
            setError(err.message);
        }
    };

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            error,
            logout,
            checkAuthStatus 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
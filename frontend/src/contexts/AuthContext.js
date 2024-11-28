import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

//creatig a context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/check_auth', { 
                withCredentials: true 
            });
            if (response.data.login) {
                setUser({
                    username: response.data.username,
                    userType: response.data.userType,
                    userId: response.data.userId
                });
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setError(err.message);
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
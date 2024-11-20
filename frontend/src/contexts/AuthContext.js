import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:8080', { 
                withCredentials: true 
            });
            if (response.data.login) {
                setUser(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, { 
                withCredentials: true 
            });
            setUser(null);
        } catch (err) {
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
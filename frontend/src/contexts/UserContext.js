import axios from 'axios';
import React from 'react';
import { useContext, createContext, useState, useEffect } from 'react';

const UserContext = createContext({
    userType: null,
    isAdmin: false,
    error: null
});

export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const checkUserType = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/check_auth", {
                withCredentials: true
            });
            setUserType(response.data.userType);
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('Error checking user type:', error);
            setError(error);
            setUserType(null);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        checkUserType();
    }, []);

    const value = {
        userType,
        isAdmin,
        error,
        checkUserType
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
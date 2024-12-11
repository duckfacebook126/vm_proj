import axios from 'axios';
import React from 'react';
import { useContext, createContext, useState, useEffect } from 'react';
//define the context
const UserContext = createContext(null);
// exportt the context
export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
    const [error, setError] = useState(null);

    //check the user typre from context
    const checkUserType = async () => {
        try {
            //trhow a check auth request to backend
            const response = await axios.get("http://localhost:8080/api/check_auth", {
                withCredentials: true
            });
            setUserType(response.data.userType);

        } catch (error) {
            console.error('Error checking user type:', error);
            setError(error);
            setUserType(null);
        }
    };
    
    //on first render check the user type 
    useEffect(() => {
        checkUserType();
    }, []);

    const value = {
        userType,
        error,
        checkUserType
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

//export function for using the context outside this file
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
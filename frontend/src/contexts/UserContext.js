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

/**
 * @summary
 * User context provider for authentication. Handles checking user type on server.
 * @workflow
 * 1. When user navigates to the site, checkUserType is called.
 * 2. If user is authenticated, server will return the user type (Admin/User) and set context userType.
 * 3. If user is not authenticated, server will return an error and context userType is set to null.
 * 4. When user navigates away from the site, the context is cleared.
 * 5. Can be used in components to check the user type.
 * @function
 * @param {Object} props
 * @param {JSX.Element} props.children Child JSX elements.
 * @returns {JSX.Element} JSX element wrapping children with UserContext.Provider.
 */

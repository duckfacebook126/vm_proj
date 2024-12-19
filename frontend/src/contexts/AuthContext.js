import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults
    axios.defaults.withCredentials = true;
///check the status of the authentication  from the backend
    const checkAuthStatus = async () => {
        try {

            //set loadin  to be true
            setLoading(true);

            //axios request to check auhth
            const response = await axios.get('http://localhost:8081/api/check_auth', {
                withCredentials: true
            });
              ///if scucccess ful login then throw th alert on success
            if (response.data.login) {
                const userData = {
                    username: response.data.username,
                    userType: response.data.userType,
                    userId: response.data.userId,
                    login: response.data.login
                };
                //set the user data
                setUser(userData);
                console.log('Authentication successful:', userData);
                setError(null);
            } else {
                setUser(null);
                console.log('Not authenticated');
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            
            setUser(null);
            setError(err.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

//logout function to be used by admin and user logout buttons to clear session and logout

    const logout = async () => {
        try {
            const logoutEndpoint = user?.userType === 'Admin' 
                ? '/api/admin_logout' 
                : '/api/logout';
            
            await axios.post(`http://localhost:8081${logoutEndpoint}`, {}, { 
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
    }, [])//

    //provide the values to the chidren context
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
//export function to use the auth vlaues in context consumers
export const useAuth = () => useContext(AuthContext);

/**
 * AuthContext component provides the authentication values to its children.
 * It uses the AuthContext to hold the authentication state of the user.
 * The context values are:
 * - user: The user data if authenticated, null otherwise
 * - loading: A boolean indicating if the authentication is in progress
 * - error: An error message if the authentication failed
 * - logout: A function to clear the session and logout
 * - checkAuthStatus: A function to check the authentication status
 *
 * The component fetches the user data on mount and stores it in the context.
 * If the user is authenticated, it sets the user data in the context.
 * If the user is not authenticated, it sets the user data to null.
 * If the authentication fails, it sets the error message in the context.
 *
 * The component provides the context values to its children.
 *
 * Children components can use the useAuth hook to get the context values.
 *
 * The component also provides a logout function to clear the session and logout.
 *
 * The component also provides a checkAuthStatus function to check the authentication status.
 *
 * The checkAuthStatus function is called on mount and whenever the user data changes.
 * It fetches the user data and updates the context values accordingly.
 *
 * The logout function is called when the logout button is clicked.
 * It clears the session and sets the user data to null.
 *
 * The component renders the children components.
 *
 * @summary
 * AuthContext component provides the authentication values to its children.
 * It fetches the user data on mount and stores it in the context.
 * It provides the context values to its children.
 * It provides a logout function to clear the session and logout.
 * It provides a checkAuthStatus function to check the authentication status.
 *
 * @workflow
 * 1. The component fetches the user data on mount and stores it in the context.
 * 2. If the user is authenticated, it sets the user data in the context.
 * 3. If the user is not authenticated, it sets the user data to null.
 * 4. If the authentication fails, it sets the error message in the context.
 * 5. The component provides the context values to its children.
 * 6. Children components can use the useAuth hook to get the context values.
 * 7. The component provides a logout function to clear the session and logout.
 * 8. The component provides a checkAuthStatus function to check the authentication status.
 * 9. The checkAuthStatus function is called on mount and whenever the user data changes.
 * 10. It fetches the user data and updates the context values accordingly.
 * 11. The logout function is called when the logout button is clicked.
 * 12. It clears the session and sets the user data to null.
 *
 * @children
 * The children components can use the useAuth hook to get the context values.
 */

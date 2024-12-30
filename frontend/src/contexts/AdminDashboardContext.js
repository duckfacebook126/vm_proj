import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create a context for admin data
export const AdminDataContext = createContext(null);


const REACT_APP_ADMIN_DASHBOARD_DATA_CALL=process.env.REACT_APP_ADMIN_DASHBOARD_DATA_CALL;
// AdminDataProvider component to provide admin data to its children
export const AdminDataProvider = ({ children }) => {
    // State to hold admin dashboard data
    const [adminDashboardData, setAdminDashboardData] = useState({ users: [], vms: [], disks: [] });
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage error messages
    const [error, setError] = useState(null);
    // State to trigger data refresh
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    // Get user and checkAuthStatus from AuthContext
    const { user, checkAuthStatus } = useAuth();

    // Function to fetch admin dashboard data
    const fetchAdminDashboardData = async () => {
        try {
            // Make a GET request to fetch admin dashboard data
            const response = await axios.get(`${REACT_APP_ADMIN_DASHBOARD_DATA_CALL}`, { withCredentials: true });
            ;

            // Update the admin dashboard data state
            setAdminDashboardData(response.data);
        } catch (error) {
            // Log the error to the console
            console.error('Error fetching admin data:', error.message);
           

           
            // Set the error message state
            setError(error.messsage);
        } finally {
            // Set loading status to false
            setLoading(false);
        }
    };

    // Function to trigger data refresh and reoad
    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // useEffect to fetch data when the component mounts or when refreshTrigger or user changes
useEffect(() => {
           
        fetchAdminDashboardData();
    
    
}, [refreshTrigger]);

    // Provide the admin data context to the children components
    return (
        <AdminDataContext.Provider value={{ adminDashboardData, loading, error, refreshData, fetchAdminDashboardData }}>
            {children}
        </AdminDataContext.Provider>
    );
};

/**
 * AdminDashboardContext component
 * 
 * This component provides a context for the admin dashboard data and related functions
 * 
 * @summary
 * - Provides a context for the admin dashboard data and related functions
 * - Fetches the admin data from the backend when the component mounts or when the user changes
 * - Provides a function to trigger data refresh
 * 
 * @workflow
 * 1. The component fetches the admin data from the backend when the component mounts or when the user changes.
 * 2. The component provides a function to trigger data refresh.
 * 3. The children components use the context to access the admin data and trigger data refresh.
 */

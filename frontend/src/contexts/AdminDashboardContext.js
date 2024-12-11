import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create a context for admin data
export const AdminDataContext = createContext(null);

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
            const response = await axios.get('http://localhost:8080/api/admin_dashboard_data', 1, {
                withCredentials: true
            });

            // Check if the response contains an error
            if (response.data.error) {
                throw new Error(response.data.error);
            }

            // Update the admin dashboard data state
            setAdminDashboardData(response.data);
        } catch (error) {
            // Log the error to the console
            console.error('Error fetching admin data:', error);

            // Check if the error is due to unauthorized access
            if (error.response?.status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
            }

            // Set the error message state
            setError(error.message || 'Failed to fetch data');
        } finally {
            // Set loading status to false
            setLoading(false);
        }
    };

    // Function to trigger data refresh
    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // useEffect to fetch data when the component mounts or when refreshTrigger or user changes
    useEffect(() => {
        fetchAdminDashboardData();
    }, [refreshTrigger, user]);

    // Provide the admin data context to the children components
    return (
        <AdminDataContext.Provider value={{ adminDashboardData, loading, error, refreshData, fetchAdminDashboardData }}>
            {children}
        </AdminDataContext.Provider>
    );
};

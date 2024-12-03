import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
    const [adminDashboardData, setAdminDashboardData] = useState({ users: [], vms: [], disks: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { user,checkAuthStatus } = useAuth();


    const fetchAdminDashboardData = async () => {
        try {
           

            const response = await axios.get('http://localhost:8080/api/admin_dashboard_data', 1,{ 
                withCredentials: true 
            });
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            
            setAdminDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            if (error.response?.status === 401) {
                
            }
            setError(error.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        fetchAdminDashboardData();
    }, [refreshTrigger, user]);

    return (
        <AdminDataContext.Provider value={{ adminDashboardData, loading, error, refreshData, fetchAdminDashboardData }}>
            {children}
        </AdminDataContext.Provider>
    );
};

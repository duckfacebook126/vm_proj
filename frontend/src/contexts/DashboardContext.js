import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState({ vms: [], disks: [], users: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(dashboardData);
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/dashboard_data', { withCredentials: true });
                setDashboardData(res.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                if (err.response?.status === 401) {
                    // Handle unauthorized access
                }
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <DataContext.Provider value={{ dashboardData, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};

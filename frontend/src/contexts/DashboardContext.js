import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
//create dashboarddta acontext
export const DataContext = createContext(null);
//export dashbaord data context
export const DataProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState({ vms: [], disks: [], users: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
// fetchht the data from the backend  to be dsiplayed on frontend
    const fetchDashboardData = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/dashboard_data', { withCredentials: true });
            setDashboardData(res.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
        //refesrsh data and reoad it
    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };


    //fecth the data first time and reload it on refresh Tigger
    useEffect(() => {
        fetchDashboardData();
    }, [refreshTrigger]);

//provide data to child components
    
    return (
        <DataContext.Provider value={{ dashboardData, loading, error, refreshData, fetchDashboardData }}>
            {children}
        </DataContext.Provider>
    );
};
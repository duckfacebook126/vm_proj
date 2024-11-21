import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DiskTable from '../DiskTable';
export const DashboardContext = createContext();

export const DataProvider = () => {
    const [dashbaordData, setDashboardData] = useState({vms:[],disks:[]});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate=useNavigate();  
    // Check auth status on mount
    useEffect(() => {
        fetchDashboardData();
     

       
    }, []);

    const fetchDashboardData = () => {
        axios.get('http://localhost:8080/api/dashboard_data', { withCredentials: true })
            .then(res => {
                setDashboardData(res.data);
                console.log(` the dashboard data fetched is${dashbaordData}`)
            })
            .catch(err => {
                console.error('Failed to fetch dashboard data:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            });
    };
   

  

    return (
        <DashboardContext.Provider value={
            dashbaordData}>
                {console.log(dashbaordData)}
                {console.log("context data")}
                <DiskTable dbData={dashbaordData}/>
        
        </DashboardContext.Provider>
    );
};

export const useData = () => useContext(DashboardContext); 
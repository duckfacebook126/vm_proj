import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataContext } from '../contexts/DashboardContext';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { addUserSchema } from './addUserValidation';
export default function VMBarChart() {
  const [adminDashboardData, setAdminDashboardData] = useState({ users: [], vms: [], disks: [] });
  const disks = adminDashboardData?.disks || [];
 
const vms=adminDashboardData?.vms||[];
  const numVms = vms.length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/admin_dashboard_data', { 
        withCredentials: true 
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setAdminDashboardData(response.data);
    }
    
    catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        navigate('/admin_login');
      } else {
        setError(error.message || 'Failed to fetch data');
      }
    } 
    
    finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Transform VM data for the chart
  const chartData =[
    {name: ' number of VMs', value: adminDashboardData.vms.length},
  
  ]

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>VM Resources Distribution</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

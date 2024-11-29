import React, { useContext, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataContext } from '../contexts/DashboardContext';
import { Paper, Typography } from '@mui/material';
import { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function DiskAreaChart() {
  const [adminDashboardData, setAdminDashboardData] = useState({ users: [], vms: [], disks: [] });
  const disks = adminDashboardData?.disks || [];
 

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
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        navigate('/admin_login');
      } else {
        setError(error.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);
  console.log(disks)
  // Transform disk data for the chart
  const chartData = disks.map(disk => ({
    name: disk.NAME,
    total: disk.SIZE,
  
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Disk DATA</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={disks}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="NAME" />
          <YAxis dataKey="size" />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="size" stackId="1" stroke="#8884d8" fill="#8884d8" name="Used Space" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

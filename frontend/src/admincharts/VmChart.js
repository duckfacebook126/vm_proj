import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Line,LineChart,ComposedChart,Scatter,Area,AreaChart } from 'recharts';
import { DataContext } from '../contexts/DashboardContext';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { addUserSchema } from '../addUserValidation';
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
  console.log(`The VM data is: ${JSON.stringify(vms, null, 2)}`);
  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: 275 }}>
      <Typography variant="h6" gutterBottom>VM Resources Distribution</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={275}
          height={400}
          data={vms}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="NAME" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="CPU" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="cores" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
          <Scatter dataKey="ram" fill="red" />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
}

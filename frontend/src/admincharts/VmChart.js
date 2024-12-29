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
      const response = await axios.get('http://localhost:8084/api/admin_dashboard_data', { 
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

  console.log(`The VM data is: ${JSON.stringify(vms)}`);

  const chartData=vms.map((vm)=>({
    name: vm.NAME,
    cpu:vm.CPU,
    cores:vm.cores,
    ram:vm.ram
  }));

  const data = [
    {
      name: 'Page A',
      uv: 590,
      pv: 800,
      amt: 1400,
    },
    {
      name: 'Page B',
      uv: 868,
      pv: 967,
      amt: 1506,
    },
    {
      name: 'Page C',
      uv: 1397,
      pv: 1098,
      amt: 989,
    },
    {
      name: 'Page D',
      uv: 1480,
      pv: 1200,
      amt: 1228,
    },
    {
      name: 'Page E',
      uv: 1520,
      pv: 1108,
      amt: 1100,
    },
    {
      name: 'Page F',
      uv: 1400,
      pv: 680,
      amt: 1700,
    },
  ];

  const formattedData = adminDashboardData.vms.map(vm => ({
    name: vm.NAME,           // lowercase 'name' like your test array
    cpu: vm.CPU,         // numeric values for the chart
    cores: vm.cores,
    ram: vm.ram
  }));





  console.log(`The VM data stringify is: ${JSON.stringify(formattedData)}`);
  console.log(`The VM name data stringify is: ${JSON.stringify(formattedData.name)}`);
  
  
  // Transform VM data for the chart
  
  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
    <Typography variant="h6" gutterBottom>VM Resources Distribution</Typography>
    <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={formattedData}
          margin={{
            top: 20,
            right: 80,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" label={{ value: 'VM Name', position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: 'CPU', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ram" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="cores" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="cpu" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
  </Paper>














  );
                }


/**
 * VmChart component
 * 
 * This component renders a composed chart with VM resources distribution.
 * 
 * @summary
 * - Renders a composed chart with VM resources distribution.
 * - Fetches the VM data from the context.
 * - Transforms the VM data for the chart.
 * - Renders the chart with the transformed data.
 * 
 * @workflow
 * 1. The component fetches the VM data from the context.
 * 2. It transforms the VM data for the chart.
 * 3. It renders the chart with the transformed data.
 */
const array=[
  {"name":"husssain","age":"12", "marks":"12"},{"name":"zain","age":"21", "marks":"23"}
  
  
    ]
  
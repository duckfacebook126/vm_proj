import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataContext } from '../contexts/DashboardContext';
import { Paper, Typography } from '@mui/material';

export default function VMBarChart() {
  const { dashboardData } = useContext(DataContext);
  const vms = dashboardData?.vms || [];

  // Transform VM data for the chart
  const chartData = vms.map(vm => ({
    name: vm.vmName,
    cores: vm.cores,
    ram: vm.ram,
    storage: vm.storage
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>VM Resources Distribution</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cores" fill="#8884d8" name="CPU Cores" />
          <Bar dataKey="ram" fill="#82ca9d" name="RAM (GB)" />
          <Bar dataKey="storage" fill="#ffc658" name="Storage (GB)" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

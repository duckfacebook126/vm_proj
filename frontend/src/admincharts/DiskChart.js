import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataContext } from '../contexts/DashboardContext';
import { Paper, Typography } from '@mui/material';

export default function DiskAreaChart() {
  const { dashboardData } = useContext(DataContext);
  const disks = dashboardData?.disks || [];

  // Transform disk data for the chart
  const chartData = disks.map(disk => ({
    name: disk.diskName,
    total: disk.totalSpace,
    used: disk.usedSpace,
    available: disk.totalSpace - disk.usedSpace
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Disk Space Distribution</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="used" stackId="1" stroke="#8884d8" fill="#8884d8" name="Used Space" />
          <Area type="monotone" dataKey="available" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Available Space" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

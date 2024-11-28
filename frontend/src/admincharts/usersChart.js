import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataContext } from '../contexts/DashboardContext';
import { Paper, Typography } from '@mui/material';

export default function UsersLineChart() {
  const { dashboardData } = useContext(DataContext);
  const users = dashboardData?.users || [];

  // Group users by type for the chart
  const userTypes = users.reduce((acc, user) => {
    acc[user.userType] = (acc[user.userType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(userTypes).map(([type, count], index) => ({
    name: type,
    users: count,
    trend: count * (index + 1) // Simulated trend data
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>User Distribution Trend</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" name="Current Users" />
          <Line type="monotone" dataKey="trend" stroke="#82ca9d" name="Growth Trend" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

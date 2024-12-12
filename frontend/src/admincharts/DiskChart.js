import React, { useContext, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminDataContext } from '../contexts/AdminDashboardContext';
import { DataContext } from '../contexts/DashboardContext';

export default function DiskAreaChart() {
  const { adminDashboardData, loading, error, refreshData } = useContext(AdminDataContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshData();
    
  }, []);

  // Transform disk data for the chart
  const chartData = adminDashboardData.disks.map(disk => ({
    name: disk.NAME || 'Unnamed Disk',
    size: disk.size || 0
  }));

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Disk Usage</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="size" />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="size" stackId="1" stroke="#8884d8" fill="#8884d8" name="Disk Size" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

/**
 * @function DiskChart
 * @description This component renders a bar chart with the disk usage info.
 * @summary
 * - Fetches the disk data from the context.
 * - Transforms the disk data for the chart.
 * - Renders the chart with the aggregated data.
 * 
 * @workflow
 * 1. The component fetches the disk data from the context.
 * 2. It transforms the disk data for the chart.
 * 3. The component renders the chart with the aggregated data.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.loading - Whether the disk data is being fetched
 * @param {error} props.error - The error object if the disk data fetch fails
 * @param {object} props.adminDashboardData - The object containing the disk data
 * @returns {React.Component} A React component containing the bar chart
 */

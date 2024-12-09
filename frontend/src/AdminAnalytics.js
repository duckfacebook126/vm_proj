import React from 'react';
import { useContext } from 'react';
import { AdminDataContext } from './contexts/AdminDashboardContext';
import { Grid, Container, Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { createContext } from 'react';
import UsersChart from './admincharts/usersChart';
import AdminPieChartComponent from './admincharts/PieChartComponent';
import DiskChart from './admincharts/DiskChart';
import VmChart from './admincharts/VmChart';

export const graphcontext = createContext();

export default function AdminAnalytics() {
  const { adminDashboardData, loading, error } = useContext(AdminDataContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        {/* First card */}
        <Grid item xs={4}>
          <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  Overview
                </Typography>
                <graphcontext.Provider value={adminDashboardData}>
                  <AdminPieChartComponent />
                </graphcontext.Provider>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        {/* Second card */}
        <Grid item xs={4}>
          <VmChart />
        </Grid>
        {/* Third card */}
        <Grid item xs={4}>
          <UsersChart />
        </Grid>
        {/* Fourth card */}
        <Grid item xs={4}>
          <DiskChart />
        </Grid>
      </Grid>
    </Container>
  );
}

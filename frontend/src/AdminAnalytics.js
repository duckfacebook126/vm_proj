import React from 'react';
import { useContext, createContext } from 'react';
import { DataContext } from './contexts/DashboardContext';
import { Grid, Container, Box, Card, CardContent, Typography } from '@mui/material';

import UsersChart from './admincharts/usersChart';
import AdminPieChartComponent from './admincharts/PieChartComponent';
import DiskChart from './admincharts/DiskChart';
import VmChart from './admincharts/VmChart';

export const graphcontext = createContext();

export default function AdminAnalytics() {
  const { dashboardData } = useContext(DataContext);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ minWidth: 375 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  Overview
                </Typography>
                <graphcontext.Provider value={dashboardData}>
                  <AdminPieChartComponent />
                </graphcontext.Provider>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <VmChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <UsersChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <DiskChart />
        </Grid>
      </Grid>
    </Container>
  );
}

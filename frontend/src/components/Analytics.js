import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Analytics = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Usage Statistics</Typography>
            <Typography>CPU Usage: 45%</Typography>
            <Typography>Memory Usage: 60%</Typography>
            {/* Add more analytics data */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 
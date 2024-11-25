import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const VirtualMachines = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Virtual Machines
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">VM Instance 1</Typography>
            <Typography>Status: Running</Typography>
            {/* Add more VM details */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">VM Instance 2</Typography>
            <Typography>Status: Stopped</Typography>
            {/* Add more VM details */}
          </Paper>
        </Grid>
        {/* Add more VM instances as needed */}
      </Grid>
    </Box>
  );
};

export default VirtualMachines; 
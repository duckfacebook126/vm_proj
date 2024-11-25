import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Storage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Storage
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Storage Details</Typography>
            <Typography>Total Capacity: 1TB</Typography>
            <Typography>Used Space: 500GB</Typography>
            {/* Add more storage details */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Storage; 
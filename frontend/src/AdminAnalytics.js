import React from 'react';
import { useContext } from 'react';
import { AdminDataContext } from './contexts/AdminDashboardContext';
import { Grid, Container, Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { createContext } from 'react';
import UsersChart from './admincharts/usersChart';
import AdminPieChartComponent from './admincharts/PieChartComponent';
import DiskChart from './admincharts/DiskChart';
import VmChart from './admincharts/VmChart';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const colorChange = keyframes`
  0% { color: #ff6f61; }
  25% { color: #6b5b95; }
  50% { color: #88b04b; }
  75% { color: #f7cac9; }
  100% { color: #ff6f61; }
`;


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


 {/* total number of users with animations in texts below */}

 <Grid item xs={4}>
      <Card variant="outlined" sx={{ minWidth: 275, minHeight: 175, padding: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            animation: `${fadeIn} 1s ease-out`,
            color: '#333',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Total Virtual Machines
        </Typography>
        <CardContent>
          <Typography
            variant="h3"
            component="div"
            sx={{
              animation: `${colorChange} 3s ease-in-out infinite`,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {adminDashboardData.users.length}
          </Typography>
        </CardContent>
      </Card>
    </Grid> 


  {/* total number of vms with animations in texts below */}

  <Grid item xs={4}>
      <Card variant="outlined" sx={{ minWidth: 275, minHeight: 175, padding: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            animation: `${fadeIn} 1s ease-out`,
            color: '#333',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Total Virtual Machines
        </Typography>
        <CardContent>
          <Typography
            variant="h3"
            component="div"
            sx={{
              animation: `${colorChange} 3s ease-in-out infinite`,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {adminDashboardData.vms.length}
          </Typography>
        </CardContent>
      </Card>
    </Grid> 


{/* total number of disks with animations in texts below */}

      <Grid item xs={4}>
      <Card variant="outlined" sx={{ minWidth: 275, minHeight: 175, padding: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            animation: `${fadeIn} 1s ease-out`,
            color: '#333',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Total Disks
        </Typography>
        <CardContent>
          <Typography
            variant="h3"
            component="div"
            sx={{
              animation: `${colorChange} 3s ease-in-out infinite`,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {adminDashboardData.disks.length}
          </Typography>
        </CardContent>
      </Card>
    </Grid> 


      




        {/* First card */}
        <Grid item xs={4}>
          
            
                
                <graphcontext.Provider value={adminDashboardData}>
                  <AdminPieChartComponent />
                </graphcontext.Provider>
          
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

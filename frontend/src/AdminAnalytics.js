import { useContext,createContext } from 'react';
import { DataContext } from './contexts/DashboardContext';

import UsersChart from './admincharts/usersChart';
import AdminPieChartComponent from './admincharts/PieChartComponent';
import DiskChart from './admincharts/DiskChart';
import VmChart from './admincharts/VmChart';

import { Box, Card, CardContent, Typography } from '@mui/material';


export const graphcontext = createContext();

function AdminAnalytics() {

    const { dashboardData } = useContext(DataContext);
    
    
    return (
   <>
   
   <div className="vm-cards">
                        <Box sx={{ minWidth: 375 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Overview
                                    </Typography>
                                    <graphcontext.Provider value={dashboardData}>
                                        <AdminPieChartComponent/>
                                    </graphcontext.Provider>
                                </CardContent>
                            </Card>
                        </Box>

                      
                    </div>
   
   
   </>
  )
}

export default AdminAnalytics

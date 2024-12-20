
// importing statements

import React, { createContext, useContext, useEffect, useState } from 'react';
import './Dashboard.css';
import AddVMForm from './AddVMForm';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { IconButton, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LoadingSpinner from './components/Loading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chart01 from './Charts';
import Chart02 from './Chart2';
import Chart03 from './Chart03';
import Chart04 from './Chart4';
import Chart05 from './Chart5';
export  const graphcontext=createContext();


// main dashbaord functionalities

function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('vms');
    const [dashboardData, setDashboardData] = useState({ vms: [], disks: [] });
    const navigate = useNavigate();
    const [IsLoading, setIsLoading] = useState(true);
    const [openDialogvm, setOpenDialog] = useState(false);
    const [vmToDelete, setVmToDelete] = useState(null);
    const [DiskToDelete, setDiskToDelete] = useState(null);
    const [openDialogDisk, setOpenDialogDisk] = useState(false);
    const [viewMode, setViewMode] = useState('card'); // State for view mode


    // use effect that fetcches the dashboard data
    useEffect(() => {
        handle_login_change();
        fetchDashboardData();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);


    //handles the delteing of the vms when the dailog is confirmed to delete
    const handleDeletevm = async (VMid) => {
        axios.delete(`http://localhost:8080/api/delete_vm/${VMid}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                fetchDashboardData();
            })
            .catch(err => {
                console.error('Failed to delete VM:', err);
            });
    };
 // when the delete disk is confirmed this will handle the delete disk
    const handleDeleteDisk = async (Diskid) => {
        axios.delete(`http://localhost:8080/api/delete_Disk/${Diskid}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                fetchDashboardData();
            })
            .catch(err => {
                console.error('Failed to delete Disk:', err);
            });
    };

/// the dashboard data is being fetched from the db  and sets the state variable of dasboard data to it
    const fetchDashboardData = () => {
        axios.get('http://localhost:8080/api/dashboard_data', { withCredentials: true })
            .then(res => {
                setDashboardData(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch dashboard data:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            });
    };

    //I think it does prevents from going  back to the login from the dashboard
    const handle_login_change = async () => {
        const res = await axios.get('http://localhost:8080/', { withCredentials: true });
        console.log(res.data);
    };
// render the cards of the vms with the dashboard data
    const renderVMCards = () => {
        return dashboardData.vms.map(vm => (
            <div key={vm.id} className="vm-card">
                <h5>{vm.name}</h5>
                <p>OS: {vm.osName}</p>
                <p>CPU: {vm.cpu} x {vm.cores} cores</p>
                <p>RAM: {vm.ram} GB</p>
                <p>Disk Size: {vm.size} GB</p>
                <p>Flavor: {vm.flavorName}</p>
                <IconButton
                    style={{ height: '40px', width: '40px' }}
                    sx={{ color: 'white', '&:hover': { border: '2px solid green' } }}
                    onClick={() => handleDeleteClick(vm.id)}
                >
                    <DeleteIcon style={{ height: '40px', width: '40px' }} sx={{ color: 'green' }} />
                </IconButton>
            </div>
        ));
    };
//reneers the disk cards for the card view
    const renderDiskCards = () => {
        return dashboardData.disks.map(disk => (
            <div key={disk.id} className="disk-card">
                <h5>{disk.name}</h5>
                <p>Size: {disk.size} GB</p>
                <p>Flavor: {disk.flavorName}</p>
                <p>Attached to VM: {disk.vmName || 'None'}</p>
                <IconButton
                    style={{ height: '40px', width: '40px' }}
                    sx={{ color: 'white', '&:hover': { border: '2px solid green' } }}
                    onClick={() => handleDeleteClickDisk(disk.id)}
                >
                    <DeleteIcon style={{ height: '40px', width: '40px' }} sx={{ color: 'green' }} />
                </IconButton>
            </div>
        ));
    };
//renders he vm data table for the table view 
    const renderVMTable = () => {
        return (
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight:'100%' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>VM ID</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>VM Name</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>OS Name</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Disk Space</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ram</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cpu</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Flavor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dashboardData.vms.map((vm) => (
                            <TableRow
                                key={vm.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{vm.id}</TableCell>
                                <TableCell align="left">{vm.name}</TableCell>
                                <TableCell align="left">{vm.osName}</TableCell>
                                <TableCell align="right">{vm.size}</TableCell>
                                <TableCell align="right">{vm.ram}</TableCell>
                                <TableCell align="right">{vm.cpu} x {vm.cores}</TableCell>
                                <TableCell align="right">{vm.flavorName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };
//remders the table view of the disk data
    const renderDiskTable = () => {
        return (
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight:'100%' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>Disk ID</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>Disk Name</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>Flavor</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Size</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Attached to VM</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dashboardData.disks.map((disk) => (
                            <TableRow
                                key={disk.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{disk.id}</TableCell>
                                <TableCell align="left">{disk.name}</TableCell>
                                <TableCell align="left">{disk.flavorName}</TableCell>
                                <TableCell align="right">{disk.size}</TableCell>
                                <TableCell align="right">{disk.vmName || 'None'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };
// navigates to the login page and sends the request to backend ot clear the cookies and the session
    const handleLogout = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
            console.log(res.data.message);
            if (res.data.message === 'Logout successful') {
                navigate('/login');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };
// opens the vm dialouge for deleteion
    const handleDeleteClick = (vmId) => {
        setVmToDelete(vmId);
        setOpenDialog(true);
    };
//opens the vm dialouge for disk deletion
    const handleDeleteClickDisk = (DiskId) => {
        setDiskToDelete(DiskId);
        setOpenDialogDisk(true);
    };
 //calls the handle deletevm function in deletion on confirmation
    const handleConfirmDelete = () => {
        if (vmToDelete) {
            handleDeletevm(vmToDelete);
            setOpenDialog(false);
            setVmToDelete(null);
        }
    };
 //calls the handle deletevm function in deletion on confirmation

    const handleConfirmDeleteDisk = () => {
        if (DiskToDelete) {
            handleDeleteDisk(DiskToDelete);
            setOpenDialogDisk(false);
            setDiskToDelete(null);
        }
    };
//handles when the user cancels the delete dialoge box or vm
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setVmToDelete(null);
    };
//handles when the user cancels the delete dialoge box or disk

    const handleCancelDeleteDisk = () => {
        setOpenDialogDisk(false);
        setDiskToDelete(null);
    };
//if the Isloading  is true  hten show the dashboard page ohter ise show  the loading screen
    if (!IsLoading) {
        return (
            <div className="dashboard-container">
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h3>Dashboard</h3>
                    </div>
                    {/* the side bar menu*/}
                    <div className="sidebar-menu">
                        <button
                            className={`sidebar-item ${activeTab === 'vms' ? 'active' : ''}`}
                            onClick={() => setActiveTab('vms')}
                        >
                            VMs
                        </button>
                        <button
                            className={`sidebar-item ${activeTab === 'disks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('disks')}
                        >
                            Disks
                        </button>
                        <button
                            className={`sidebar-item ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            Analytics
                        </button>
                    </div>
                </div>
                     {/* the  main contetnt on the centre of the page*/}

                <div className="main-content">
                                        {/* the vabar inside  the main content on the centre of the page*/}

                    <header className="navbar">
                        <h1>{activeTab.toUpperCase()}</h1>
                        <div>
                                                {/* button stack*/}

                            <Stack spacing={2} direction="row">
                                <Button variant='contained' className="btn-logout" onClick={handleLogout}>Logout</Button>
                                <Button variant='contained' onClick={() => setViewMode('card')}>Card View</Button>
                                <Button variant='contained' onClick={() => setViewMode('table')}>Table View</Button>
                            </Stack>
                        </div>
                    </header>
                                            {/* he main content that will be diplayed below the navabar like cards data etc*/}

                    <div className="content-area">
                        <div className="loading-container"></div>

                        {activeTab === 'vms' && (
                            <div className="vm-cards">
                                {viewMode === 'card' && renderVMCards()}
                                {viewMode === 'table' && renderVMTable()}

                                                    {/* add icon button afterend of the cards*/}

                                <IconButton style={{ height: '50px', width: '50px' }} className="btn-add-vm" onClick={() => setShowForm(true)}>
                                    <AddIcon style={{ height: '50px', width: '50px' }} />
                                </IconButton>
                            </div>
                        )}
                        {activeTab === 'disks' && (
                            <div className="vm-cards">
                                {viewMode === 'card' && renderDiskCards()}
                                {viewMode === 'table' && renderDiskTable()}
                               
                            </div>

                        )

                            
                        }
                       {activeTab === 'analytics' && (
                                <div className="vm-cards">

                                {/*different graph cards in the body*/}

                                  <Box sx={{ minWidth: 375 }}>
                                  <Card variant="outlined">
                                  <CardContent>
                                  <Typography variant="h5" component="div">
                                    Ram by VM
                                  </Typography>
                                  <graphcontext.Provider value={dashboardData}>
                                  <Chart01 />
                                  
                                  </graphcontext.Provider>
                                  </CardContent>
                                  </Card>
                                  </Box>

                                  <Box sx={{ minWidth: 375 }}>
                                  <Card variant="outlined">
                                  <CardContent>
                                  <Typography variant="h5" component="div">
                                    Number of Cores per VM
                                  </Typography>
                                  <graphcontext.Provider value={dashboardData}>
                                  <Chart02 />
                                  
                                  </graphcontext.Provider>
                                  </CardContent>
                                  </Card>
                                  </Box>

                                  <Box sx={{ minWidth: 375 }}>
                                  <Card variant="outlined">
                                  <CardContent>
                                  <Typography variant="h5" component="div">
                                    Number of CPUs per VM
                                  </Typography>
                                  <graphcontext.Provider value={dashboardData}>
                                  <Chart03 />
                                  
                                  </graphcontext.Provider>
                                  </CardContent>
                                  </Card>
                                  </Box>

                                  <Box sx={{ minWidth: 375 }}>
                                  <Card variant="outlined">
                                  <CardContent>
                                  <Typography variant="h5" component="div">
                                    Disk Size of each VM
                                  </Typography>
                                  <graphcontext.Provider value={dashboardData}>
                                  <Chart04 />
                                  
                                  </graphcontext.Provider>
                                  </CardContent>
                                  </Card>
                                  </Box>

                                
                                </div>
                        )} 
                    </div>

                    {/* render the form if thhe addicon btton is pressed*/}


                    {showForm && (
                        <div className="overlay">
                            <AddVMForm onClose={() => {
                                setShowForm(false);
                                fetchDashboardData();
                            }} />
                        </div>
                    )}


                </div>
                                    {/* the dialouge box code when the open dialoguevm is true(the delelte button is pressed)*/}

                <Dialog
                    open={openDialogvm}
                    onClose={handleCancelDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete VM Confirmation"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this VM? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                 {/* the dialouge box code when the open dialoguediks is true(the delelte button is pressed)*/}

                <Dialog
                    open={openDialogDisk}
                    onClose={handleCancelDeleteDisk}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Disk Confirmation"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this Disk? This will also delete the attached VM.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDeleteDisk} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDeleteDisk} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    } else if (IsLoading) {
        return (<><LoadingSpinner /></>);
    }
}

export default Dashboard;
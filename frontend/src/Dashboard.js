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
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

// Context that has been exported to other children
export const graphcontext = createContext();

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

    useEffect(() => {
        handle_login_change();
        fetchDashboardData();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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

    const handle_login_change = async () => {
        const res = await axios.get('http://localhost:8080/', { withCredentials: true });
        console.log(res.data);
    };

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

    const renderVMTable = () => {
        return (
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: '100%' }}>
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

    const renderDiskTable = () => {
        return (
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: '100%' }}>
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

    const handleDeleteClick = (vmId) => {
        setVmToDelete(vmId);
        setOpenDialog(true);
    };

    const handleDeleteClickDisk = (DiskId) => {
        setDiskToDelete(DiskId);
        setOpenDialogDisk(true);
    };

    const handleConfirmDelete = () => {
        if (vmToDelete) {
            handleDeletevm(vmToDelete);
            setOpenDialog(false);
            setVmToDelete(null);
        }
    };

    const handleConfirmDeleteDisk = () => {
        if (DiskToDelete) {
            handleDeleteDisk(DiskToDelete);
            setOpenDialogDisk(false);
            setDiskToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setVmToDelete(null);
    };

    const handleCancelDeleteDisk = () => {
        setOpenDialogDisk(false);
        setDiskToDelete(null);
    };

    // Define the DashboardLayoutBranding function inside the Dashboard component
    const DashboardLayoutBranding = () => {
        const NAVIGATION = [
            {
                segment: 'virtualmachines',
                title: 'Virtual Machines',
                icon: <DashboardIcon />,
            },
            {
                segment: 'disks',
                title: 'Disks',
                icon: <ShoppingCartIcon />,
            },
            {
                segment: 'analytics',
                title: 'Analytics',
                icon: <ShoppingCartIcon />,

            }
        ];

        const demoTheme = createTheme({
            cssVariables: {
                colorSchemeSelector: 'data-toolpad-color-scheme',
            },
            colorSchemes: { light: true, dark: true },
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 600,
                    md: 600,
                    lg: 1200,
                    xl: 1536,
                },
            },
        });

        function DemoPageContent({ pathname }) {
            if (pathname === '/virtualmachines') {
                return (
                    <div className="vm-cards">
                        {viewMode === 'card' && renderVMCards()}
                        {viewMode === 'table' && renderVMTable()}
                        <IconButton style={{ height: '50px', width: '50px' }} className="btn-add-vm" onClick={() => setShowForm(true)}>
                            <AddIcon style={{ height: '50px', width: '50px' }} />
                        </IconButton>
                    </div>
                );
            } else if (pathname === '/disks') {
                return (
                    <div className="vm-cards">
                        {viewMode === 'card' && renderDiskCards()}
                        {viewMode === 'table' && renderDiskTable()}
                    </div>
                );
            }

            else if (pathname === '/analytics') {
                return (
                    <div className="vm-cards">
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
                );
            }
        }

        DemoPageContent.propTypes = {
            pathname: PropTypes.string.isRequired,
        };

        const router = useDemoRouter('virtualmachines');

        return (
            <AppProvider
                navigation={NAVIGATION}
                branding={{
                    logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
                    title: 'MUI',
                }}
                router={router}
                theme={demoTheme}
            >
                <DashboardLayout>
                    <div className="header-buttons">
                        <Button variant='contained' className="btn-logout" onClick={handleLogout}>Logout</Button>
                        <Button variant='contained' onClick={() => setViewMode('card')}>Card View</Button>
                        <Button variant='contained' onClick={() => setViewMode('table')}>Table View</Button>
                    </div>
                    <DemoPageContent pathname={router.pathname} />
                </DashboardLayout>
            </AppProvider>
        );
    };

    if (!IsLoading) {
        return (
            <div >
                <DashboardLayoutBranding />{/* Include the DashboardLayoutBranding function here */}
                <div className="main-content">
                    
                    <div className="content-area">
                        <div className="loading-container"></div>

                        {activeTab === 'analytics' && (
                            <div className="vm-cards">
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
                    {showForm && (
                        <div className="overlay">
                            <AddVMForm onClose={() => {
                                setShowForm(false);
                                fetchDashboardData();
                            }} />
                        </div>
                    )}
                </div>
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

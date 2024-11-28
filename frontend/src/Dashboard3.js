import React, { useState, useEffect, createContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import './Dashboard.css';
import AddVMForm from './AddVMForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LoadingSpinner from './components/Loading';
import Chart01 from './Charts';
import Chart02 from './Chart2';
import Chart03 from './Chart03';
import Chart04 from './Chart4';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoutIcon from '@mui/icons-material/Logout';
import DiskTable from './DiskTable';
import VMTable from './VmTable';
import { DataContext } from './contexts/DashboardContext';
import { useContext } from 'react';
import './Dashboard3.css';
import {


    CardActions,
    CardHeader,
    Avatar
    
  }
  from '@mui/material';


export const graphcontext = createContext();

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function Dashboard3() {

        const{dashboardData,fetchDashboardData} = useContext(DataContext);
        


        useEffect(() => {
            handle_login_change();
        // Use refreshData instead of fetchDashboardData
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 3000);
            return () => clearTimeout(timer);
        }, []);

    


    const { refreshData } = useContext(DataContext);
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('vms');
    const navigate = useNavigate();
    const [IsLoading, setIsLoading] = useState(true);
    const [openDialogvm, setOpenDialog] = useState(false);
    const [vmToDelete, setVmToDelete] = useState(null);
    const [DiskToDelete, setDiskToDelete] = useState(null);
    const [openDialogDisk, setOpenDialogDisk] = useState(false);
    const [VmViewMode, setVmViewMode] = useState('Vmscard');
    const [DiskViewMode, setDiskViewMode] = useState('Diskscard');



    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDeletevm = async (VMid) => {
        axios.delete(`http://localhost:8080/api/delete_vm/${VMid}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                refreshData();  // Use refreshData instead of fetchDashboardData
            })
            .catch(err => {
                console.error('Failed to delete VM:', err);
            });
    };
    
    const handleDeleteDisk = async (Diskid) => {
        axios.delete(`http://localhost:8080/api/delete_Disk/${Diskid}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                refreshData();  // Use refreshData instead of fetchDashboardData
            })
            .catch(err => {
                console.error('Failed to delete Disk:', err);
            });
    };
    

 

    const handle_login_change = async () => {
        const res = await axios.get('http://localhost:8080/', { withCredentials: true });
        console.log(res.data);
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
            if (res.data.message) {
                navigate('/login');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (IsLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
           <Toolbar>
              <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
            </Typography>
            <IconButton
            color="inherit"
            aria-label="logout"
            onClick={handleLogout}
            edge="end"
            sx={{ ml: 2 }}
              >
              <LogoutIcon />
          </IconButton>
        </Toolbar>
        </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {[
                        { text: 'Dashboard', icon: <DashboardIcon />, value: 'vms' },
                        { text: 'Storage', icon: <StorageIcon />, value: 'disks' },
                        { text: 'Analytics', icon: <TrendingUpIcon />, value: 'analytics' }
                    ].map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => setActiveTab(item.value)}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <graphcontext.Provider value={dashboardData}>
                    {activeTab === 'vms' && (
                        <>
                            <Typography variant="h5" gutterBottom>
                                Virtual Machines
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowForm(true)}
                                >
                                    Add VM
                                </Button>
                                <Button
                                    variant={VmViewMode === 'Vmscard' ? 'contained' : 'outlined'}
                                    onClick={() => setVmViewMode('Vmscard')}
                                >
                                    Card View
                                </Button>
                                <Button
                                    variant={VmViewMode === 'Vmtable' ? 'contained' : 'outlined'}
                                    onClick={() => setVmViewMode('Vmtable')}
                                >
                                    Table View
                                </Button>
                            </Stack>
                            {VmViewMode === 'Vmscard' ? (
                                <div className="vm-grid">
                                    {dashboardData.vms.map(vm => (
                                        <Card key={vm.id} sx={{ maxWidth: 345, m: 1 }}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {vm.NAME}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        OS: {vm.osName}<br />
                                                        CPU: {vm.cpu} x {vm.cores} cores<br />
                                                        RAM: {vm.ram} GB<br />
                                                        Disk Size: {vm.size} GB<br />
                                                        Flavor: {vm.flavorName}
                                                    </Typography>
                                                </CardContent>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        setVmToDelete(vm.id);
                                                        setOpenDialog(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardActionArea>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <VMTable vms={dashboardData.vms} onDelete={(vmId) => {
                                    setVmToDelete(vmId);
                                    setOpenDialog(true);
                                }} />
                            )}
                        </>
                    )}
{activeTab === 'disks' && (
    <>
        <Typography variant="h5" gutterBottom>
            Disks
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
                variant={DiskViewMode === 'Diskscard' ? 'contained' : 'outlined'}
                onClick={() => setDiskViewMode('Diskscard')}
            >
                Card View
            </Button>
            <Button
                variant={DiskViewMode === 'Diskstable' ? 'contained' : 'outlined'}
                onClick={() => setDiskViewMode('Diskstable')}
            >
                Table View
            </Button>
        </Stack>
        {DiskViewMode === 'Diskscard' ? (
            <div className="disk-grid">
                {dashboardData.disks.map(disk => (
                    <Card key={disk.id} sx={{ maxWidth: 345, m: 1 }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {disk.NAME}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Size: {disk.size} GB<br />
                                    Flavor ID: {disk.flavorId} GB<br />
                                    VM ID: {disk.vmId}<br />
                                </Typography>
                            </CardContent>
                            <IconButton
                                aria-label="delete"
                                onClick={() => {
                                    setDiskToDelete(disk.id);
                                    setOpenDialogDisk(true);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        ) : (
            <DiskTable disks={dashboardData.disks} onDelete={(diskId) => {
                setDiskToDelete(diskId);
                setOpenDialogDisk(true);
            }} />
        )}
    </>
)}

{activeTab === 'analytics' && (

<>
<div className='card-container'>
    <Card sx={{ maxWidth: 375, maxHeight: 450  }}>
    <CardHeader
        title="RAM Usage by VM"  // Descriptive title
    />
    <CardContent>
        <Chart01 />
    </CardContent>
</Card>

 <Card sx={{ maxWidth: 375, maxHeight: 450  }}>
    <CardHeader
        title="number of cores by VM"  // Descriptive title
        
    />
    <CardContent>
        <Chart02 />
    </CardContent>
</Card>


<Card sx={{ maxWidth: 375, maxHeight: 450  }}>
    <CardHeader
        title="number of CPUS by VM"  // Descriptive title
    />
    <CardContent>
        <Chart03 />
    </CardContent>
</Card>




<Card sx={{ maxWidth: 375, maxHeight: 450  }}>
    <CardHeader
        title="size of each VM"  // Descriptive title
    />
    <CardContent>
        <Chart04 />
    </CardContent>
</Card>

</div>



</>
)}




                </graphcontext.Provider>
            </Box>

            {showForm && (
                <div className="overlay">
                   <AddVMForm 
    onClose={() => {
        setShowForm(false);
        refreshData();
    }}
    onSuccess={() => refreshData()} 
/>
                </div>
            )}

            <Dialog
                open={openDialogvm}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this VM?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => {
                        handleDeletevm(vmToDelete);
                        setOpenDialog(false);
                    }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDialogDisk}
                onClose={() => setOpenDialogDisk(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Disk?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialogDisk(false)}>Cancel</Button>
                    <Button onClick={() => {
                        handleDeleteDisk(DiskToDelete);
                        setOpenDialogDisk(false);
                    }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Dashboard3;
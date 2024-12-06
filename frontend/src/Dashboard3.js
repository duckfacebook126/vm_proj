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
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Slider from '@mui/material/Slider';
import { useAuth } from './contexts/AuthContext';

import Swal from 'sweetalert2';

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

        const{dashboardData,fetchDashboardData,refreshData} = useContext(DataContext);
        const{user, checkAuthStatus,logout} = useAuth();


        useEffect(() => {
            
            const checkAuth = async () => {
                try {
                  await checkAuthStatus();  // First check auth status
                  await refreshData();      // Then refresh data
                  
                  if (user===null ) {
                    navigate('/login');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  navigate('/admin_login');
                }
              };
          
              checkAuth();
          
              const timer = setTimeout(() => {
                setIsLoading(false);
              }, 3000);
              
              return () => clearTimeout(timer)


        }, []);

    


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
    const [openEditDialog,setOpenEditDialog] = useState(false);
    const [editVm, setEditVm] = useState();
    const [DiskToEdit, setDiskToEdit] = useState();

    const userType = user?.userType || 'Standard';
  const canEdit = userType === 'Premium' || userType === 'SuperUser';
  const canDelete = userType === 'SuperUser';


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

const setVmToEdit = (vm) =>{
    if (!user) return;
    setEditVm(
        {
            id:vm.id,

            NAME:vm.NAME,
            osName:vm.osName,
            cpu:vm.cpu,
            cores:vm.cores,
            ram:vm.ram,
            size:vm.size,
            flavorName:vm.flavorName,
            userType:user.userType


        }
    );
}

    const handleEditvm = async (editVm) => {
        axios.put(`http://localhost:8080/api/update_vm/${editVm.id}`, editVm,{ withCredentials: true })
            .then(res => {
                console.log(res.data);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'VM updated successfully!',
                        confirmButtonText: 'OK',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                refreshData();
                            }
                        });



                // Use refreshData instead of fetchDashboardData
            }).catch(err => {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    confirmButtonText:'Ok'
                }).then((result) => {

                    if(result.isConfirmed)
                    {
                        console.error('Failed to update VM:', err);

                        console.log(err);
                        refreshData();

                    }
                        } )
                      
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
    

 

    

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from auth context
            await checkAuthStatus(); // Verify the auth state is cleared
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (IsLoading) {
        return <LoadingSpinner />;
    }

    return (

        



        <Box sx={{ display: 'flex', zIndex: '1201' }}>
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
                                <div className="vm-cards">
                                    {dashboardData.vms.map(vm => (
                                        <Card key={vm.id} sx={{ minWidth: 300, m: 1 }}>
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
                                                    disabled={!user || user.userType === 'Standard'|| !canDelete}
                                                    sx={{
                                                        '&.Mui-disabled': {
                                                            opacity: 0.5,
                                                            cursor: 'not-allowed'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                             <IconButton
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        setVmToEdit(vm);
                                                        setOpenEditDialog(true);
                                                           }}
                                                        disabled={!user || user.userType === 'Standard' || !canEdit}
                                                                sx={{
                                                  // Optional: Make it visually clear when disabled
                                                                        '&.Mui-disabled': {
                                                                        opacity: 0.5,
                                         // You can add a tooltip to explain why it's disabled
                                                                            cursor: 'not-allowed'
                                                                                            }
                                                                                  }}
                                                >
                                                    <EditIcon />
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

<Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}
    
      
    PaperProps={{

        style:{

          width:'400px',

          height:'600px'
        }
      }}
      >
    <DialogTitle>Edit VM</DialogTitle>
    <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
                label="VM Name"
                name="NAME"
                value={editVm?.NAME || ''}
                onChange={(e) => setEditVm({...editVm, NAME: e.target.value})}
                fullWidth
            />
            <TextField
                label="OS Name"
                name="osName"
                value={editVm?.osName || ''}
                onChange={(e) => setEditVm({...editVm, osName: e.target.value})}
                fullWidth
            />
            
            {/* Flavor Slider */}
            <Typography gutterBottom>Flavor Type</Typography>
            <Slider
                name="flavorName"
                value={editVm?.flavorName === 'Light' ? 0 : editVm?.flavorName === 'Medium' ? 1 : 2}
                onChange={(e, newValue) => {
                    const flavorMap = {
                        0: 'Light',
                        1: 'Medium',
                        2: 'Heavy'
                    };
                    const newFlavor = flavorMap[newValue];
                    // Set default RAM based on flavor
                    const ramDefaults = {
                        'Light': 2,
                        'Medium': 8,
                        'Heavy': 16
                    };
                    setEditVm({
                        ...editVm, 
                        flavorName: newFlavor,
                        ram: ramDefaults[newFlavor]
                    });
                }}
                min={0}
                max={2}
                marks={[
                    { value: 0, label: 'Light' },
                    { value: 1, label: 'Medium' },
                    { value: 2, label: 'Heavy' }
                ]}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => ['Light', 'Medium', 'Heavy'][value]}
            />
            
            {/* CPU Count Slider */}
            <Typography gutterBottom>CPU Count</Typography>
            <Slider
                name="cpu"
                value={editVm?.cpu || 1}
                onChange={(e, newValue) => setEditVm({...editVm, cpu: newValue})}
                min={1}
                max={4}
                marks
                valueLabelDisplay="auto"
            />
            
            {/* CPU Cores Slider */}
            <Typography gutterBottom>CPU Cores</Typography>
            <Slider
                name="cores"
                value={editVm?.cores || 2}
                onChange={(e, newValue) => setEditVm({...editVm, cores: newValue})}
                min={1}
                max={8}
                marks
                valueLabelDisplay="auto"
            />
            
            {/* RAM Slider - Dynamic range based on flavor */}
            <Typography gutterBottom>RAM (GB)</Typography>
            <Slider
                name="ram"
                value={editVm?.ram || 2}
                onChange={(e, newValue) => setEditVm({...editVm, ram: newValue})}
                min={editVm?.flavorName === 'Light' ? 2 : 
                     editVm?.flavorName === 'Medium' ? 8 : 16}
                max={editVm?.flavorName === 'Light' ? 8 : 
                     editVm?.flavorName === 'Medium' ? 16 : 64}
                marks
                step={2}
                valueLabelDisplay="auto"
                disabled={!editVm?.flavorName}  // Disable if no flavor selected
            />
            
            {/* Disk Size Slider */}
            <Typography gutterBottom>Disk Size (GB)</Typography>
            <Slider
                name="size"
                value={editVm?.size || 50}
                onChange={(e, newValue) => setEditVm({...editVm, size: newValue})}
                min={50}
                max={5000}
                step={50}
                marks
                valueLabelDisplay="auto"
            />
        </Stack>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
        <Button onClick={() => {
            handleEditvm(editVm);
            setOpenEditDialog(false);
        }}>Save Changes</Button>
    </DialogActions>
</Dialog>
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
            <div className="vm-cards">
                {dashboardData.disks.map(disk => (
                    <Card key={disk.id} sx={{ minWidth: 300, m: 1 }}>
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
                <div style={{zIndex: 2001}}>
                   <AddVMForm 
    onClose={() => {
        setShowForm(false);
        refreshData();
    }}

    onOpen={() => setShowForm(true)}
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
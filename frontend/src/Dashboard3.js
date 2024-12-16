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
import { Button, Container, Grid, Stack } from '@mui/material';
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
import logo from './logo.png'; 

import Swal from 'sweetalert2';

import {


    CardActions,
    CardHeader,
    Avatar
    
  }
  from '@mui/material';

/// the exporting the graph context
export const graphcontext = createContext();

const drawerWidth = 240;

//opening animation and style of the drawer

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});


//closing of thrn closed drawer and its animation
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
//drawer Header 
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

// app bar syling
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

//styling for the drawer

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


//custom logout button styles
const LogoutButton = styled(IconButton)(({ theme }) => ({
    color: 'inherit',
    '&:hover': {
      backgroundColor: 'white',
      color: 'black',
    },
  }));

function Dashboard3() {

    // importing the dashboard context and authetication context
        const{dashboardData,fetchDashboardData,refreshData} = useContext(DataContext);
        const{user, checkAuthStatus,logout} = useAuth();

        //will check auth on the use effect
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
          //set timer for loading screen and set the loading to true so the loading screen can be rendered
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
//setting the user permission on the frontend
    const userType = user?.userType || 'Standard';
  const canEdit = userType === 'Premium' || userType === 'SuperUser';
  const canDelete = userType === 'SuperUser';

//set open drawer state to true for the visibility
    const handleDrawerOpen = () => {
        setOpen(true);
    };
// cose drawer state for visibility to be false
    const handleDrawerClose = () => {
        setOpen(false);
    };

    //dlete function for delting vm  by id
    const handleDeletevm = async (VMid) => {

        //axios delte request
        axios.delete(`http://localhost:8080/api/delete_vm/${VMid}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                    //succesfull alert fire so that thereis succesful deeletion
                    Swal.fire({

                    icon:'success',
                    title:'VM Deleted Successfully',
                    confirmButtonText:'OK'

                });
                //refreshing datta after the  vm is deleted succcessfully
                refreshData();  // Use refreshData instead of fetchDashboardData
            })
            .catch(err => {
                console.error('Failed to delete VM:', err);
            });
    };

    //function will handle the user to be edited

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
        //axios put requestfor updating the user with th
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

        //delete disk by id    
    const handleDeleteDisk = async (Diskid) => {

        //axios delte req with params vm id
        axios.delete(`http://localhost:8080/api/delete_Disk/${Diskid}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                refreshData();  // Use refreshData instead of fetchDashboardData
            })
            .catch(err => {
                console.error('Failed to delete Disk:', err);
            });
    };
    

 

    
//this will handle the logout button request and event
    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from auth context
            await checkAuthStatus(); // Verify the auth state is cleared
            navigate('/login');//logout back to the login page
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };


    // i f the loading visibiity is true show the loading screeen
    if (IsLoading) {
        return <LoadingSpinner />;
    }

    return (

        

// Main dashbaord rendering on the front end

        <Box sx={{ display: 'flex', zIndex: '1201' }}>
            <CssBaseline />

            {/*  */}
            <AppBar position="fixed" open={open}>

           <Toolbar sx={{backgroundColor:'darkred'}}>

           <IconButton
              backgroundColor='white' 
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ 
               mr: 2, 
              ...(open && { display: 'none' }),
               '&:hover': {
               backgroundColor: 'white', 
               color: 'black' 
    } 
  }}
>
  <MenuIcon />
</IconButton>


            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
            </Typography>
            {/* logout button */}
            <LogoutButton
                aria-label="logout"
                onClick={handleLogout}
                edge="end"
              >
                {/* Logout */}
                <LogoutIcon />
              </LogoutButton>

        </Toolbar>
        </AppBar>

            <Drawer variant="permanent" open={open} >
                <DrawerHeader >
                {open && <img src={logo} alt="logo" style={{ width: '150px', height: 'auto', marginLeft: '8px' }} />}

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
                                onClick={() => setVmViewMode('Vmscard')}
                                 variant={VmViewMode === 'Vmscard' ? 'outlined' : 'contained'} 
                                  >
                                 Card View 

                                 </Button>


                                <Button
                               onClick={() => setVmViewMode('Vmtable')}
                               variant={VmViewMode === 'Vmtable' ? 'outlined' : 'contained'} 
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
                                                    <DeleteIcon sx={{color:"red"}} />
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
        <Stack spacing={2} sx={{ mt: 2}}>
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
            <Slider  sx={{ mt: 10}} 
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

<Box sx={{ mt: 4 }} /> {/* Spacer */}

            
            {/* CPU Count Slider */}
            <Typography >CPU Count</Typography>
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
                variant={DiskViewMode === 'Diskscard' ? 'outlined' : 'contained'}
                onClick={() => setDiskViewMode('Diskscard')}
            >
                Card View
            </Button>
            <Button
                variant={DiskViewMode === 'Diskstable' ? 'outlined' : 'contained'}
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
                                <DeleteIcon
                                
                                sx={{color:'red'}} />
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
<Container>
      <Grid container spacing={2}>
        {/* Card for RAM Usage */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card sx={{ maxWidth: 375, height: 450, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="RAM Usage by VM" />
            <CardContent sx={{ flex: 1, minHeight: 0 }}>
              <Chart01 />
            </CardContent>
          </Card>
        </Grid>

        {/* Card for Number of Cores by VM */}
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <Card sx={{ maxWidth: 375, height: 450, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Number of Cores by VM" />
            <CardContent sx={{ flex: 1, minHeight: 0 }}>
              <Chart02 />
            </CardContent>
          </Card>
        </Grid>

        {/* Card for Number of CPUs by VM */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card sx={{ maxWidth: 375, height: 450, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Number of CPUs by VM" />
            <CardContent sx={{ flex: 1, minHeight: 0 }}>
              <Chart03 />
            </CardContent>
          </Card>
        </Grid>

        {/* Card for Displaying VM Size */}
        <Grid item  xs={10} md={10} sm={10}>
          <Card sx={{ Width: 1000, height: 450, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Size of Each VM" />
            <CardContent sx={{ flex: 1, minHeight: 0 }}>
              <Chart04 />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>



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


// dialog box for deleting the vm
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




                    {/* Dialog box for deleting the disk  */}
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


/**
 * Dashboard3 component
 * 
 * This component renders the dashboard with all the VMs and Disks.
 * 
 * @summary
 * - Renders the dashboard with all the VMs and Disks.
 * - Handles the edit and delete operations of the VMs.
 * - Handles the delete operations of the Disks.
 * 
 * @workflow
 * 1. The component fetches the VM data from the context.
 * 2. It renders the VM table with an edit option.
 * 3. When the edit option is clicked, it opens a dialog with the VM details.
 * 4. The dialog contains a form with the VM details that can be edited.
 * 5. When the save button is clicked in the dialog, the component calls the
 *    handleEditvm function to update the VM details.
 * 6. The component also contains a delete button that calls the handleDeletVM
 *    function when clicked.
 * 7. The component also renders the Disks table with a delete option.
 * 8. When the delete option is clicked, it opens a dialog with a confirmation
 *    message.
 * 9. When the delete button is clicked in the dialog, the component calls the
 *    handleDeleteDisk function to delete the Disk.
 */

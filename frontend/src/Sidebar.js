import * as React from 'react';
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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleIcon from '@mui/icons-material/People';
import LoadingSpinner from './components/Loading';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useState,useEffect } from 'react';
import AdminAnalytics from './AdminAnalytics';
import UT from './UserTable';
import { Button } from '@mui/material';
import { useUser } from './contexts/UserContext';
import Swal from 'sweetalert2';
import { useAuth } from './contexts/AuthContext';
import { AdminDataContext } from './contexts/AdminDashboardContext';
import { useContext } from 'react';
import logo from './logo.png'; 
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    color: 'inherit',
    '&:hover': {
      backgroundColor: 'white',
      color: 'black',
    },


    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

//custom syl for button

const LogoutButton = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  '&:hover': {
    backgroundColor: 'white',
    color: 'black',
  },
}));




export default function Sidebar() {
  const{refreshData}=useContext(AdminDataContext)
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const [IsLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { checkUserType , userType} = useUser();
  const [alertLoading,setrAlertLoading]=useState(true);
  const{user,loading,  checkAuthStatus, logout} =useAuth()

//function for opening the drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  //handel the log out on the logout button press
  const handleLogout = async () => {
    try {
      const wasAdmin = user?.userType === 'Admin';  // Store the user type before logout
      await logout(); // Use the auth context logout function
      await checkAuthStatus(); // Verify auth state is cleared
      navigate(wasAdmin ? '/admin_login' : '/login');  // Redirect based on previous user type
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/admin_login');  // Default to admin login on error
    }
  };

//authorize if the user is of admin type or not 
  const authAdmin = () => {
    if (!user) {
      navigate('/admin_login');
      return;
    }

    if (user.userType === 'Admin') {
      return; // Admin is authorized, continue
    }

    Swal.fire({
      icon: 'error',
      title: 'Unauthorized Access',
      text: 'You are not an admin!',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin_login');
      }
    });
  };

//rendering first time of the component
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthStatus();  // First check auth status
        await refreshData();      // Then refresh data
        //if user is admin redirect to admin
        if (user===null || user.userType !== 'Admin') {
          navigate('/admin_login');
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
    
    return () => clearTimeout(timer);
  }, []);  // Empty dependency array for initial mount only

  if (!IsLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* //dashbaord appbar */}
        <AppBar position="fixed" open={open}>

          {/* Toolbar */}
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <Typography variant="h6" noWrap component="div">
                Admin Dashboard Panel
              </Typography>
            </Box>

            {/* Logout button */}
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

        {/* Drawere menu  */}
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
          {open && <img src={logo} alt="logo" style={{ width: '150px', height: 'auto', marginLeft: '8px' }} />}

         <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
         </IconButton>
          </DrawerHeader>

          {/* List for menu items */}
          <List>
            {['Users', 'Analytics'].map((text, listindex) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                        justifyContent: 'initial',
                      }
                      : {
                        justifyContent: 'center',
                      },
                  ]}
                  onClick={() => {
                    setIndex(listindex);

                    if (text === "Logout") {

                    }
                  }}>
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                          mr: 3,
                        }
                        : {
                          mr: 'auto',
                        },
                    ]}
                  >
                    {text == 'Users' && <PeopleIcon />}
                    {text == 'Analytics' && <EqualizerIcon />}

                  </ListItemIcon>

                  <ListItemText
                    primary={text}
                    sx={[
                      open
                        ? {
                          opacity: 1,
                        }
                        : {
                          opacity: 0,
                        },
                    ]}
                  />


                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </Drawer>
        <>
          {index === 0 && <Box sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <UT></UT>

          </Box>}

          {index === 1 && <Box sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <AdminAnalytics></AdminAnalytics>

          </Box>}



        </>
      </Box>

    );
  }
// show the loaging screen is loading is true
  else if (IsLoading) {

    return (<><LoadingSpinner /></>);


  }
}

/**
 * @summary This component renders a sidebar which contains different options for the admin like view user, view admin analytics, view vms, view disks, edit profile, logout etc.
 * @param {Object} props React props
 * @param {boolean} props.IsLoading If true, the component shows the loading screen
 * @param {number} props.index The index of the selected option in the sidebar
 * @param {function} props.handleDrawerClose The function to close the drawer
 * @returns {ReactElement} The rendered component
 * @description This component renders a sidebar which contains different options for the admin. The options are view user, view admin analytics, view vms, view disks, edit profile, logout. The component also has a loading screen which is shown when the IsLoading prop is true. The index prop is used to determine which option is selected in the sidebar. The handleDrawerClose prop is used to close the drawer.
 */

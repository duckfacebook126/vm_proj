import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from './contexts/DashboardContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { addUserSchema } from './addUserValidation';
import { user,useAuth } from './contexts/AuthContext';
import { useFormik } from 'formik';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SignUpValidation, { SignUpSchema } from './SignUpValidation';
import DialogContentText from '@mui/material/DialogContentText';
import { encryptData, decryptData } from './utils/encryption';
export default function UT() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState();
const[userToDelete,setUserToDelete]=useState()
  const [openDeleteDialog,setOpenDelteDialog]=useState(false)


  const{refreshData}=useContext(DataContext);
  const [editUser, setEditUser] = useState({
    firstName: '', lastName: '', phoneNumber: '', 
    CNIC: '', email: '', userName: '', userType: 'Standard'
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '', lastName: '', phoneNumber: '', 
    CNIC: '', email: '', userName: '', password: '', userType: 'Standard'
  });

  const REACT_APP_ADMIN_DASHBOARD_DATA_CALL=process.env.REACT_APP_ADMIN_DASHBOARD_DATA_CALL; 
  const REACT_APP_UPDATE_USER_CALL=process.env.REACT_APP_UPDATE_USER_CALL;
  const REACT_APP_DELETE_USER_CALL=process.env.REACT_APP_DELETE_USER_CALL;
  const REACT_APP_CREATE_USER_CALL=process.env.REACT_APP_CREATE_USER_CALL;


  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${REACT_APP_ADMIN_DASHBOARD_DATA_CALL}`, {
        
        params:{value:userId},
        withCredentials: true 


      });
      if (response.status === 200) {
        // Ensure we always set an array
        const userData = Array.isArray(response.data) ? response.data : 
                        response.data.users ? response.data.users : [];
        setUsers(userData);
      }

      //erro handing for fetching the users
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin_login');
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // first time render , and will change as the user tries to navigate away
  useEffect(() => {
    

    fetchUsers();
   
  }, [navigate]);


  //function to store the handle the uder that is to be edited
  const handleEdit = (user) => {
    setEditUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      CNIC: user.CNIC,
      email: user.email,
      userName: user.userName,
      userType: user.userType
    });
    setOpenDialog(true);
  };

//eror handling for the user data in hthe user auth


  //function to jandle thethe user ti=o be updated
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${REACT_APP_UPDATE_USER_CALL}${editUser.id}`, editUser, { withCredentials: true });
      if (response.status === 200) {

       // fires on succefull deletion
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully!'
        });
        //closes the dialog box
        setOpenDialog(false);
        //reloads the data
        fetchUsers();

        refreshData();
      }
    } catch (error) {

      //fires error if the user is not updated
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update user'
      });
    }
  };

  //function to handle the deletion of the user
  const handleDelete = async (userToDelete) => {
    try {
      await axios.delete(`${REACT_APP_DELETE_USER_CALL}${userToDelete}`, { withCredentials: true });
//succeful deletion fires an alert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User deleted successfully!',
        confirmButtonText: 'OK'
      }).then((result)=>
      {

       if(result.isConfirmed)
        {
          // if the delete opration is successful
          //fires the fetchusers function
          fetchUsers();
          //refreshes the data
          refreshData();
        } 
      })
      
      
      
    } catch (error) {
    }
  };


  //function to handle the creation of the user
  const handleCreateUser = async () => {
    try {
      //sending axios reqiest to the backend for new user creation
      const encryptedData = encryptData(newUser);
      await axios.post(`${REACT_APP_CREATE_USER_CALL}`, {encryptedData}, { withCredentials: true });
      //closing the dialog box
      setOpenCreateDialog(false);
      //fetch the dashbaord
      fetchUsers();
      //refresh the data
      refreshData();
      //set default newuser values
      setNewUser({
        firstName: '', lastName: '', phoneNumber: '', 
        CNIC: '', email: '', userName: '', password: '', userType: 'Standard'
      });
    } catch (error) {
      //error handling
    }
  };


  //formik and yupvalidation in the user add  and edit forms


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      CNIC: '',
      email: '',
      userName: '',  
      password: '',
      userType: 'Standard'
    },
    validationSchema: addUserSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        //encrypt data using the function from  utils that uses Aes
        const encryptedData = encryptData(values);
        //axios post req with encrypted data
        const response = await axios.post(
          `${REACT_APP_CREATE_USER_CALL}`, 
          { encryptedData }, 
          { withCredentials: true }
        );
  
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User created successfully!'
          });
          setOpenCreateDialog(false);
          fetchUsers();
          refreshData();
          resetForm();
        }
      } catch (error) {
        setOpenCreateDialog(false);
        fetchUsers();
        refreshData();
        resetForm();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to create user'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });


  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create User
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>CNIC</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.CNIC}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>

                  <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => {setUserToDelete(user.id);setOpenDelteDialog(true)}}>
                    <DeleteIcon sx={{color:'red'}} />
                  </IconButton>

              
          </Stack>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style:{
            width:'400px',
            height:'600px'
          }
        }}
        aria-labelledby="edit-dialog-title"
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle id="edit-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="First Name"
              value={editUser.firstName}
              onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label="Last Name"
              value={editUser.lastName}
              onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={editUser.phoneNumber}
              onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="CNIC"
              value={editUser.CNIC}
              onChange={(e) => setEditUser({ ...editUser, CNIC: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Username"
              value={editUser.userName}
              onChange={(e) => setEditUser({ ...editUser, userName: e.target.value })}
              fullWidth
            />
            <Select
              value={editUser.userType}
              onChange={(e) => setEditUser({ ...editUser, userType: e.target.value })}
              fullWidth
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="SuperUser">Super User</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              handleUpdate();
              setOpenDialog(false);
            }} 
            variant="contained" 
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}
        
        PaperProps={{

          style:{

            width:'400px',

            height:'600px'
          }
        }}
        
        >
        <DialogTitle>Create New User</DialogTitle>

        <form onSubmit={formik.handleSubmit}>

        <DialogContent    
       
        >
          <Stack spacing={2} sx={{ mt: 0 }}>

            {/* firstname */}
            <TextField
             type="text"
             id="firstName"
             placeholder="Enter First Name"
             name="firstName"
             onChange={formik.handleChange}
             value={formik.values.firstName}
             onBlur={formik.handleBlur}
             error={formik.touched.firstName && Boolean(formik.errors.firstName)}
             helperText={formik.touched.firstName&& formik.errors.firstName}
             />
           

            <TextField
            type="text"
            id="lastName"
            placeholder="Enter Last Name"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName&& formik.errors.lastName}
            />
            <TextField
            type="tel"
            id="phoneNumber"
            placeholder="Enter Phone Number"
            name="phoneNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber&& formik.errors.phoneNumber}
            />
            <TextField
          type="text"
          id="CNIC"
          placeholder="Enter CNIC"
          name="CNIC"
          onChange={formik.handleChange}
          value={formik.values.CNIC}
          onBlur={formik.handleBlur}
          error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
          helperText={formik.touched.CNIC&& formik.errors.CNIC}
            />


            <TextField
               type="email"
              id="email"
              placeholder="Enter Email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email&& formik.errors.email}
            />

         <TextField
               fullWidth
              type="text"
              label="Username"
              name="userName"  // This should match the schema
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              />


            <TextField
              type="password"
              id="password"
              placeholder="Enter Password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password&& formik.errors.password}
            />
          </Stack>
        </DialogContent>
        
<DialogActions>
          <Button onClick={() => {
            setOpenCreateDialog(false);
            formik.resetForm();
          }}>Cancel</Button>
          <Button 
  type="submit"
  variant="contained"
  color="primary"
  
>
  {formik.isSubmitting ? 'Creating...' : 'Create'}
</Button>
       
     </DialogActions>


      </form>
      </Dialog>






      {/*//delete user dialog*/}

      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDelteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        disableEnforceFocus
        disableRestoreFocus
      >
              
              <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                          Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>


                      <DialogActions>
                            <Button onClick={() => setOpenDelteDialog(false)}>Cancel</Button>
                            <Button 
                              onClick={() => {
                                handleDelete(userToDelete);
                                setOpenDelteDialog(false);
                              }} 
                              variant="contained"
                              color="error"
                            >
                              Delete
                            </Button>
                      </DialogActions>
      </Dialog>


    </>
  );
}


/**
 * @function
 * @name UserTable
 * @summary UserTable component which contains data table for displaying all users 
 * @description UserTable component which contains data table for displaying all users 
 * @param {object} props - props for the user table component
 * @param {object} props.data - data for the user table component contains users
 * @param {function} props.handleDelete - handle delete function for deleting user
 * @param {function} props.handleEdit - handle edit function for editing user
 * @returns {JSX.Element} - UserTable component
 * @example
 * import UserTable from './UserTable';
 * 
 * <UserTable data={data} handleDelete={handleDelete} handleEdit={handleEdit} />
 * 
 */

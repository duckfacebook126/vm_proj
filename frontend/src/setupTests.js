import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from './contexts/DashboardContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { addUserSchema } from './addUserValidation';

import { useFormik } from 'formik';
import './styles.css';
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

// importing the dashboard context
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


const getsSessionData = async () => {
try{

const response = axios.get('http://localhost:8080/', { withCredentials: true });

if(response.data.login)
{
setUserId(response.data.userId);

}

}
catch(error)
{
console.log('failed to fetch session data');

}


}


  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin_dashboard_data', {
        
        params:{value:userId},
        withCredentials: true 


      });
      console.log('API Response:', response.data);
      if (response.status === 200) {
        // Ensure we always set an array
        const userData = Array.isArray(response.data) ? response.data : 
                        response.data.users ? response.data.users : [];
        console.log('Processed user data:', userData);
        setUsers(userData);
      }

      //erro handing for fetching the users
    } catch (error) {
      console.error('Error fetching users:', error);
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
    
    getsSessionData().then(()=>{
    fetchUsers();
    });
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


  //function to handle thethe user ti=o be updated
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/update_user/${editUser.id}`, editUser, { withCredentials: true });
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
      console.error('Error updating user:', error);

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
      await axios.delete(`http://localhost:8080/api/delete_user/${userToDelete}`, { withCredentials: true });
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
      console.error('Error deleting user:', error);
    }
  };


  //function to handle the creation of the user
  const handleCreateUser = async () => {
    try {
      //sending axios reqiest to the backend for new user creation
      const encryptedData = encryptData(newUser);
      await axios.post('http://localhost:8080/api/create_user', {encryptedData}, { withCredentials: true });
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
      console.error('Error creating user:', error);
    }
  };


  //formik and yup validation in the user add  form


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
        console.log('Submitting form with values:', values);
        //axios post req with encrypted data
        const response = await axios.post(
          'http://localhost:8080/api/create_user', 
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
        console.error('Error creating user:', error);
       
        fetchUsers();
        refreshData();
        resetForm();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to create user',

          customClass: {
            container: 'swal-custom-class'
          }

        });
      } finally {
        setSubmitting(false);
      }
    }
  });




  //formik for edit user form with ysame yup validation


  const formik1 = useFormik({
    initialValues: editUser
,
    validationSchema: addUserSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.put(`http://localhost:8080/api/update_user/${editUser.id}`, editUser, { withCredentials: true });
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
        console.error('Error updating user:', error);
  
        //fires error if the user is not updated
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update user'
        });
      }
    }
  });










  // reyrn statement
  return (
    <>


    {/*  table for users */}
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
        
          
        PaperProps={{

          style:{

            width:'400px',

            height:'600px'
          }
        }}
        >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>

            {/* firtst name */}
            <TextField
              type="text"
              className={formik1.errors.firstName&& formik1.touched.firstName?'form-control danger':'form-control'}
              id="firstName"
              placeholder="Enter First Name"
              name="firstName"
              onChange={formik1.handleChange}
              value={formik1.values.firstName}
              onBlur={formik1.handleBlur}
              helperText={formik1.touched.firstName && formik1.errors.firstName}

              sx={{
               '& .MuiFormHelperText-root': {
                 color: 'red',
               },
             }}
             
              />

              {/* Lastr Name */}
            <TextField
            type="text"
            className={formik1.errors.lastName&& formik1.touched.lastName?'form-control danger':'form-control'}
            id="lastName"
            placeholder="Enter Last Name"
            name="lastName"
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            value={formik1.values.lastName}
            helperText={formik1.touched.lastName && formik1.errors.lastName}

            sx={{
             '& .MuiFormHelperText-root': {
               color: 'red',
             },
           }}
            />
             {/* PHONE NUMBER */}
            <TextField
            type="tel"
            className={formik1.errors.phoneNumber&& formik1.touched.phoneNumber?'form-control danger':'form-control'}
            id="phoneNumber"
            placeholder="Enter Phone Number"
            name="phoneNumber"
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            value={formik.values.phoneNumber}
            helperText={formik1.touched.phoneNumber && formik1.errors.phoneNumber}

            sx={{
             '& .MuiFormHelperText-root': {
               color: 'red',
             },
           }}
            />
               {/*CNIC*/}

            <TextField
            type="text"
            className={formik1.touched.CNIC && formik1.errors.CNIC ? 'danger form-control':'form-control'}
            id="CNIC"
            placeholder="Enter CNIC"
            name="CNIC"
            onChange={formik1.handleChange}
            value={formik1.values.CNIC}
            onBlur={formik1.handleBlur}
            helperText={formik1.touched.CNIC&&formik1.errors.CNIC}

          sx={{
           '& .MuiFormHelperText-root': {
             color: 'red',
           },
         }}
            />

                {/*  EMAIL*/}
                <TextField
               type="email"
             className={formik1.touched.email && formik1.errors.email ? ' form-control danger':"form-control"}
              id="email"
              placeholder="Enter Email"
              name="email"
              onChange={formik1.handleChange}
              value={formik1.values.email}
              onBlur={formik1.handleBlur}

              helperText={formik1.touched.email && formik1.errors.email }

              sx={{
               '& .MuiFormHelperText-root': {
                 color: 'red',
               },
             }}
            
            />


                {/* Username */}

              <TextField
               fullWidth
              type="text"
              name="userName"  // This should match the schema
              value={formik1.values.userName}
              onChange={formik1.handleChange}
              onBlur={formik1.handleBlur}

              placeholder="Enter Username"

              helperText={formik1.touched.userName && formik1.errors.userName }

              sx={{
               '& .MuiFormHelperText-root': {
                 color: 'red',
               },
             }}
              />

            {/* User Type select menu with items */}

            <Select
              value={formik1.values.userType}
              onChange={formik1.handleChange}
              fullWidth
            >
              <MenuItem value=  "Admin"     >Admin</MenuItem>
              <MenuItem value=  "SuperUser" >Super User</MenuItem>
              <MenuItem value=  "Premium"   >Premium</MenuItem>
              <MenuItem value=  "Standard"  >Standard</MenuItem>
            </Select>

          </Stack>
        </DialogContent>


        
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            formik1.resetForm();
          }}>Cancel</Button>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik1.isSubmitting}
          >
          {formik.isSubmitting ? 'Creating...' : 'Create'}
          </Button>
       
     </DialogActions>


      </Dialog>






      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}
        
        PaperProps={{

          style:{

            width:'400px',

            height:'600px',

            zIndex: 1200
          }
        }}
        
        >
        <DialogTitle>Create New User</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
        <DialogContent  >
          <Stack spacing={2} sx={{ mt: 0 }}>
            {/* First Name */}
            <TextField
             type="text"
             className={formik.errors.firstName&& formik.touched.firstName?'form-control danger':'form-control'}
             id="firstName"
             placeholder="Enter First Name"
             name="firstName"
             onChange={formik.handleChange}
             value={formik.values.firstName}
             onBlur={formik.handleBlur}
             helperText={formik.touched.firstName && formik.errors.firstName}

             sx={{
              '& .MuiFormHelperText-root': {
                color: 'red',
              },
            }}
            />
                {/* Lastr Name */}
            <TextField
            type="text"
            className={formik.errors.lastName&& formik.touched.lastName?'form-control danger':'form-control'}
            id="lastName"
            placeholder="Enter Last Name"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            helperText={formik.touched.lastName && formik.errors.lastName}

            sx={{
             '& .MuiFormHelperText-root': {
               color: 'red',
             },
           }}
            />
            {/* PHONE NUMBER */}
            <TextField
            type="tel"
            className={formik.errors.phoneNumber&& formik.touched.phoneNumber?'form-control danger':'form-control'}
            id="phoneNumber"
            placeholder="Enter Phone Number"
            name="phoneNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}

            sx={{
             '& .MuiFormHelperText-root': {
               color: 'red',
             },
           }}
            />

            {/*CNIC*/}

            <TextField
          type="text"
          className={formik.touched.CNIC && formik.errors.CNIC ? 'danger form-control':'form-control'}
          id="CNIC"
          placeholder="Enter CNIC"
          name="CNIC"
          onChange={formik.handleChange}
          value={formik.values.CNIC}
          onBlur={formik.handleBlur}
          helperText={formik.errors.CNIC}

          sx={{
           '& .MuiFormHelperText-root': {
             color: 'red',
           },
         }}

            />

                {/*  EMAIL*/}
            <TextField
               type="email"
             className={formik.touched.email && formik.errors.email ? ' form-control danger':"form-control"}
              id="email"
              placeholder="Enter Email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}

              helperText={formik.touched.email && formik.errors.email }

              sx={{
               '& .MuiFormHelperText-root': {
                 color: 'red',
               },
             }}
            
            />

            {/* Username */}

         <TextField
               fullWidth
              type="text"
              label="Username"
              name="userName"  // This should match the schema
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && Boolean(formik.errors.userName)}

              helperText={formik.touched.userName && formik.errors.userName }

              sx={{
               '& .MuiFormHelperText-root': {
                 color: 'red',
               },
             }}
              />

             {/* Password */}
            <TextField
              type="password"
              className={formik.touched.password && formik.errors.password ? 'form-control danger':"form-control"}
              id="password"
              placeholder="Enter Password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              helperText={formik.touched.password && formik.errors.password }

              sx={{
               '& .MuiFormHelperText-root': {
                 color: 'red',
               },
             }}
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
            disabled={formik.isSubmitting}
          >
          {formik.isSubmitting ? 'Creating...' : 'Create'}
          </Button>
       
     </DialogActions>


      </form>




         {/*delete user dialog*/}




      </Dialog>
    

      <Dialog open={openDeleteDialog} onClose={() => setOpenDelteDialog(false)}>
              
              <DialogTitle>Delete User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>


                      <DialogActions>
                            <Button onClick={() => setOpenDelteDialog(false)}>Cancel</Button>
                            <Button onClick={() => {handleDelete(userToDelete).then(() => setOpenDelteDialog(false))}} variant="contained">Delete</Button>                      </DialogActions>
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
 * <UserTable data={data} handleDelete={handleDelete} handleEdit={handleEdit} />
 * 
 */







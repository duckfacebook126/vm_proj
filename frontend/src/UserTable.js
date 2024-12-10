import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from './contexts/DashboardContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { addUserSchema } from './addUserValidation';

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

  useEffect(() => {
    
    getsSessionData().then(()=>{
    fetchUsers();
    });
  }, [navigate]);

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

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/update_user/${editUser.id}`, editUser, { withCredentials: true });
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully!'
        });
        setOpenDialog(false);
        fetchUsers();
        refreshData();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update user'
      });
    }
  };

  const handleDelete = async (userToDelete) => {
    try {
      await axios.delete(`http://localhost:8080/api/delete_user/${userToDelete}`, { withCredentials: true });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User deleted successfully!',
        confirmButtonText: 'OK'
      }).then((result)=>
      {

       if(result.isConfirmed)
        {

          fetchUsers();
          refreshData();
        } 
      })
      
      
      
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateUser = async () => {
    try {

      const encryptedData = encryptData(newUser);
      await axios.post('http://localhost:8080/api/create_user', {encryptedData}, { withCredentials: true });
      setOpenCreateDialog(false);
      fetchUsers();
      refreshData();
      setNewUser({
        firstName: '', lastName: '', phoneNumber: '', 
        CNIC: '', email: '', userName: '', password: '', userType: 'Standard'
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };


  //formik and ypu validation in the user add  and edit forms


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      CNIC: '',
      email: '',
      userName: '',  // Make sure this matches the schema
      password: '',
      userType: 'Standard'
    },
    validationSchema: addUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const encryptedData = encryptData(values);
        console.log('Submitting form with values:', values);
        
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
            <TextField
              label="First Name"
              value={editUser.firstName}
              onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
              fullWidth
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
          <Button onClick={handleUpdate} variant="contained" color="primary">
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
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
             type="text"
             className={formik.errors.firstName&& formik.touched.firstName?'form-control danger':'form-control'}
             id="firstName"
             placeholder="Enter First Name"
             name="firstName"
             onChange={formik.handleChange}
             value={formik.values.firstName}
             onBlur={formik.handleBlur}
            />
        {  formik.touched.firstName&& formik.errors.firstName&&<p className={formik.errors.firstName&& formik.touched.firstName?'form-control danger':'form-control'}>{formik.errors.firstName}</p>}

            <TextField
            type="text"
            className={formik.errors.lastName&& formik.touched.lastName?'form-control danger':'form-control'}
            id="lastName"
            placeholder="Enter Last Name"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            />
        { formik.touched.lastName&& formik.errors.lastName&&<p className={formik.errors.lastName&& formik.touched.lastName?'form-control danger':'form-control'}>{formik.errors.lastName}</p>}
            <TextField
            type="tel"
            className={formik.errors.phoneNumber&& formik.touched.phoneNumber?'form-control danger':'form-control'}
            id="phoneNumber"
            placeholder="Enter Phone Number"
            name="phoneNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            />
        { formik.touched.phoneNumber&& formik.errors.phoneNumber&&<p className={formik.errors.phoneNumber&& formik.touched.phoneNumber?'form-control danger':'form-control'}>{formik.errors.phoneNumber}</p>}
            <TextField
          type="text"
          className={formik.touched.CNIC && formik.errors.CNIC ? 'danger form-control':'form-control'}
          id="CNIC"
          placeholder="Enter CNIC"
          name="CNIC"
          onChange={formik.handleChange}
          value={formik.values.CNIC}
          onBlur={formik.handleBlur}

            />


        { formik.touched.CNIC&& formik.errors.CNIC&&<p className={formik.errors.CNIC&& formik.touched.CNIC?'form-control danger':'form-control'}>{formik.errors.CNIC}</p>}
            <TextField
               type="email"
             className={formik.touched.email && formik.errors.email ? ' form-control danger':"form-control"}
              id="email"
              placeholder="Enter Email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
         {formik.touched.email&&formik.errors.email&&<p className={formik.touched.email && formik.errors.email ? ' form-control danger':"form-control"}>{formik.errors.email}</p>}

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
         {formik.touched.userName&&formik.errors.userName&&<p className={formik.touched.userName && formik.errors.userName ? ' form-control danger':"form-control"}>{formik.errors.userName}</p>}


            <TextField
              type="password"
              className={formik.touched.password && formik.errors.password ? 'form-control danger':"form-control"}
              id="password"
              placeholder="Enter Password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password&&formik.errors.password&&<p className={formik.touched.password && formik.errors.password ? 'form-control danger':"form-control"}>{formik.errors.password}</p>}
          </Stack>
        </DialogContent>
        
<DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
  type="submit"
  variant="contained"
  color="primary"
  disabled={formik.isSubmitting || !formik.isValid}
>
  {formik.isSubmitting ? 'Creating...' : 'Create'}
</Button>
       
     </DialogActions>


      </form>
      </Dialog>






      {/*//delete user dialog*/}

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

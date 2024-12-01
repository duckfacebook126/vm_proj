import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from './contexts/DashboardContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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

export default function UT() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState({

    firstName: '', lastName: '', phoneNumber: '', 
    CNIC: '', email: '', userName: '', userType: 'Standard'
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '', lastName: '', phoneNumber: '', 
    CNIC: '', email: '', userName: '', password: '', userType: 'Standard'
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin_dashboard_data', { withCredentials: true });
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
    fetchUsers();
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

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/delete_user/${userId}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:8080/api/create_user', newUser, { withCredentials: true });
      setOpenCreateDialog(false);
      fetchUsers();
      setNewUser({
        firstName: '', lastName: '', phoneNumber: '', 
        CNIC: '', email: '', userName: '', password: '', userType: 'Standard'
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

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

                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
            />
            <TextField
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
            />
            <TextField
              label="Phone"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
            />
            <TextField
              label="CNIC"
              value={newUser.CNIC}
              onChange={(e) => setNewUser({...newUser, CNIC: e.target.value})}
            />
            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
            <TextField
              label="Username"
              value={newUser.userName}
              onChange={(e) => setNewUser({...newUser, userName: e.target.value})}
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

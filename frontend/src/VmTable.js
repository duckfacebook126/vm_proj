import React, { useContext, useState } from 'react';
import { DataContext } from './contexts/DashboardContext';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { useAuth } from './contexts/AuthContext';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  TablePagination,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  StepLabel
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



import Swal from 'sweetalert2';

export default function VMTable({ onEdit, onDelete }) {
  const {  refreshData } = useContext(DataContext);

  const { dashboardData } = useContext(DataContext);
  const { user, loading } = useAuth();
  const vms = dashboardData?.vms || [];

  // States for handling pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [vmToDelete, setVmToDelete] = useState();
  const[openEditDialog,setOpenEditDialog]=useState(false)

  const [editVm, setEditVm] = useState();
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

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const userType = user?.userType || 'Standard';
  const canEdit = userType === 'Premium' || userType === 'SuperUser';
  const canDelete = userType === 'SuperUser';

  const handleDeletevm = async (vmToDelete) => {
    axios.delete(`http://localhost:8080/api/delete_vm/${vmToDelete}`, { withCredentials: true })
      .then(res => {
        console.log(res.data);
        // refreshData();  // Use refreshData instead of fetchDashboardData
      })
      .catch(err => {
        console.error('Failed to delete VM:', err);
      });
  };


  const handleEditvm = async (editVm) => {
    axios.put(`http://localhost:8080/api/update_vm/${editVm.id}`, editVm,{ withCredentials: true })
        .then(res => {

          if(res){
          Swal.fire({
            title: 'Success',
            text: 'VM updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              refreshData();  // Use refreshData instead of fetchDashboardData
            }
          });
        }
        })
        .catch(err => {
            console.log(err);
          Swal.fire(
            {
              title:' failed user Update',
              text:'There was an error updating the user',
              icon:'error'


            }

          )
        });
};


  return (
    <>
      <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
        <Table sx={{ minWidth: 500 }} aria-label="vm table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>VM ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DISK NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>RAM</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CORES</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>OS ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>USER ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>FLAVOR ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DISK SIZE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vm) => (
              <TableRow key={vm.id}>
                <TableCell>{vm.NAME}</TableCell>
                <TableCell>{vm.ram}</TableCell>
                <TableCell>{vm.size}</TableCell>
                <TableCell>{vm.cores}</TableCell>
                <TableCell>{vm.osId}</TableCell>
                <TableCell>{vm.userId}</TableCell>
                <TableCell>{vm.flavorId}</TableCell>
                <TableCell>{vm.size}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {canEdit && (
                      <IconButton 
                        onClick={() => {

                          setVmToEdit (vm);
                          setOpenEditDialog(true);
                        }
                        }
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton 
                        onClick={() => {setVmToDelete(vm.id); setOpenDeleteDialog(true);}}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={vms.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>
      <Dialog open={openDeleteDialog} onClose={()=>setOpenDeleteDialog(false)}>
        <DialogTitle> Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={()=>handleDeletevm(vmToDelete)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
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
  );
}

import React, { useContext, useState } from 'react';
import { DataContext } from './contexts/DashboardContext';
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
  Button
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function VMTable({ onEdit, onDelete }) {
  const { dashboardData } = useContext(DataContext);
  const { user, loading } = useAuth();
  const vms = dashboardData?.vms || [];

  // States for handling pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [vmToDelete, setVmToDelete] = useState();
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
                        onClick={() => onEdit(vm)}
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
    </>
  );
}

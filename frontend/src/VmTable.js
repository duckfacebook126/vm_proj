import React, { useContext, useState } from 'react';
import { DataContext } from './contexts/DashboardContext';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { useAuth } from './contexts/AuthContext';
import Swal from 'sweetalert2';

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

// Main vm tabel functions

export default function VMTable({ onEdit, onDelete }) {
  const {  refreshData } = useContext(DataContext);

  const { dashboardData } = useContext(DataContext);
  const { user, loading } = useAuth();
  const vms = dashboardData?.vms || [];
  const vmTableData =dashboardData?.vmTableData || [];
  // States for handling pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [vmToDelete, setVmToDelete] = useState();
  const[openEditDialog,setOpenEditDialog]=useState(false)


  // setting the vm to be edited
  const [editVm, setEditVm] = useState();
  const setVmToEdit = (vm) =>{
    if (!user) return;
    setEditVm(
        {
            id:vm.id,

            NAME:vm.NAME,
            osName:vm.os_name,
            cpu:vm.CPU,
            cores:vm.cores,
            ram:vm.ram,
            size:vm.size,
            flavorName:vm.disk_flavor,
            userType:user.userType


        }
    );
}


    //opendialog state variable
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // change the page handiling page cureent index
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // change the rows per page and make the page 0 to show the start fo the page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // show loading screen while data is loading

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

// setting user types which have access and features

  const userType = user?.userType || 'Standard';
  const canEdit = userType === 'Premium' || userType === 'SuperUser';
  const canDelete = userType === 'SuperUser';

  //ends the deelte request to backend with  params vm id
  const handleDeletevm = async (vmToDelete) => {
    axios.delete(`http://localhost:8080/api/delete_vm/${vmToDelete}`, { withCredentials: true })
      .then(res => {
        console.log(res.data);
          //if the request is successfull then show a deleteion succes
        if(res.status===200){
          Swal.fire({
            title: 'Success',
            text: 'VM deleted successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
             /// refersh the dashbaord data
              refreshData();
        }
      })

      //handdle the errors
      .catch(err => {
      console.error('Failed to delete VM:', err);

      //throw the alert message so that there is  an error
       Swal.fire({
        title: 'Error',
        text: 'Cannot delete VM',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      // then refesh the dashbaord data
      refreshData();
          })
  };

    //handle the edit vm request
  const handleEditvm = async (editVm) => {
    axios.put(`http://localhost:8080/api/update_vm/${editVm.id}`,editVm,{ withCredentials: true })
        .then(res => {
          //if the the request is successfull then show a successmessage on deletion
          if(res){

            //fires a succes detion alert message
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

        //catches the errors
        .catch(err => {
            console.log(err);

            //fires the error message in alert box
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

    {/* table for the vm data*/}
      <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
        <Table sx={{ minWidth: 500 }} aria-label="vm table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>VM Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DISK NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>RAM</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CORES</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>OS NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>FLAVOR NAME</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DISK SIZE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {/* show the specific number of rows per page */}
            {vmTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vm,index) => (
              <TableRow key={vm.id}>
                <TableCell>{vm.NAME}</TableCell>
                <TableCell>{vm.disk_name}</TableCell>
                <TableCell>{vm.ram}</TableCell>
                <TableCell>{vm.cores}</TableCell>
                <TableCell>{vm.os_name}</TableCell>
                <TableCell>{vm.disk_flavor}</TableCell>
                <TableCell>{vm.size}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>

                {/* edit condition for only the premium and super user */}
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

                   {/* delete condition for only the super user */}

                    {canDelete && (
                      <IconButton 
                        onClick={() => {setVmToDelete(vm.id); setOpenDeleteDialog(true);}}
                      
                      >
                        <DeleteIcon sx={{ color: 'red' }} />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* pagintion for the vm table */}
        <TablePagination
          component="div"
          count={vmTableData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>

              {/* Dialog for delteing avm */}


      <Dialog open={openDeleteDialog} onClose={()=>setOpenDeleteDialog(false)}
        >


          {/* Delete dialogue here will pop out when the delete icon will be delted */}
        <DialogTitle> Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>


        <DialogActions>


          <Button onClick={()=>setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={()=>{

              //close the dialog with setting visibiity  to false
            setOpenDeleteDialog(false);

            //xecutes the   handleDeletevm function
            handleDeletevm(vmToDelete);}}>Delete
            </Button>
        </DialogActions>


      </Dialog>

      {/* Open delete dialog */}

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
                value={editVm?.os_name || ''}
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

/**
 * VMTable component
 * 
 * This component renders the VM table with an edit option. It also contains
 * a dialog for editing the VM details.
 *
 * 
 * 
 *  
 * @summary
 * - Renders the VM table with an edit option.
 * - Contains a dialog for editing the VM details.
 * - Handles the edit and delete operations of the VMs.
 * 
 * 
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
 */

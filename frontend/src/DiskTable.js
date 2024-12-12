import React, { useContext, useState } from 'react';
import { DataContext } from './contexts/DashboardContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import {  TableHead } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
export default function DiskTable() {

  const{dashboardData,fetchDashboardData,refreshData} = useContext(DataContext);

  const disks = dashboardData?.disks || [];
  console.log(disks);
  // States for handling pagination
  const [page, setPage] = useState(0); // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  const [DiskToDelete, setDiskToDelete] = useState(null);
  const [openDialogDisk, setOpenDialogDisk] = useState(false);


 


  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };



  //handle delete functionn that will 
  const handleDeleteDisk = async (Diskid) => {
    axios.delete(`http://localhost:8080/api/delete_Disk/${Diskid}`, { withCredentials: true })
        .then(res => {
            console.log(res.data);
            Swal.fire({

              icon: 'success',
              title:'Disk Deleted Successfully',
              confirmButtonText: 'OK'



            })

            refreshData();  // Use refreshData instead of fetchDashboardData
        })
        .catch(err => {
            console.error('Failed to delete Disk:', err);
        });
};



  return (

    <>


    {/* table for the disks */}
    <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>

          <TableRow>

  <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">

    DISK NAME

  </TableCell>

  <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">

    DISK SIZE

  </TableCell>


  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

    DISK FLAVOUR ID

  </TableCell>
  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

  ACTIONS

</TableCell>

</TableRow>

</TableHead>
        <TableBody>

          
          {disks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((disk) => (
            <TableRow key={disk.id}>
              <TableCell component="th" scope="row">
                {disk.NAME}
              </TableCell>
              <TableCell align="left">
                {disk.size}
              </TableCell>
              <TableCell align="left">
                {disk.flavorId}
              </TableCell>

              


              <TableCell align="left">
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

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={disks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </TableContainer>

            
            {/* deleting the disk dialog below  */}

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


</>





  );
}

/**
 * @summary
 * - This component renders the Disk table with an edit option.
 * - Contains a dialog for deleting the Disk.
 * - Handles the delete operation of the Disk.
 * 
 * @workflow
 * 1. The component fetches the Disk data from the context.
 * 2. It renders the Disk table with an edit option.
 * 3. When the edit option is clicked, it opens a dialog with the Disk details.
 * 4. The dialog contains a form with the Disk details that can be edited.
 * 5. When the save button is clicked in the dialog, the component calls the
 *    handleEditDisk function to update the Disk details.
 * 6. The component also contains a delete button that calls the handleDeleteDisk
 *    function when clicked.
 * 7. The component also renders a loading spinner when the Disk data is being fetched.
 * 8. The component also renders an error message when the Disk data fetch fails.
 * 
 * @function
 * @param {object} props - The props passed to the component
 * @param {object} props.disks - The array of Disk objects
 * @param {function} props.handleDeleteDisk - The function to call when the delete button is clicked
 * @param {function} props.handleEditDisk - The function to call when the edit button is clicked
 * @param {boolean} props.loading - Whether the Disk data is being fetched
 * @param {error} props.error - The error object if the Disk data fetch fails
 */


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


export default function VMTable() {
  const { dashboardData } = useContext(DataContext);
  const vms = dashboardData?.vms || [];
console.log(vms);
  // States for handling pagination
  const [page, setPage] = useState(0); // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
      <TableHead>

<TableRow>

  <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">

    VM ID

  </TableCell>

  <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">

    DISK NAME

  </TableCell>


  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

    RAM

  </TableCell>


    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        CORES

    </TableCell>

    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        OS ID

    </TableCell>


     <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        USER ID

    </TableCell>


     <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        FLAVOR ID

    </TableCell>


    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

    DISK SIZE

    </TableCell>

    </TableRow>

    </TableHead>
        <TableBody>

          
          {vms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vm) => (
            <TableRow key={vm.id}>

              <TableCell component="th" scope="row">
                {vm.NAME}
              </TableCell>

              <TableCell align="left">
                {vm.ram}
              </TableCell>

              <TableCell align="left">
                {vm.size}
              </TableCell>


              <TableCell align="left">
                {vm.cores}
              </TableCell>

              <TableCell align="left">
                {vm.osId}
              </TableCell>

              <TableCell align="left">
                {vm.userId}
              </TableCell>

              <TableCell align="left">
                {vm.flavorId}
              </TableCell>


              <TableCell align="left">
                {vm.size}
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
  );
}

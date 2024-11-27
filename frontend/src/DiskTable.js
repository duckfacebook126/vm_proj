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


export default function DiskTable() {
  const { dashboardData } = useContext(DataContext);
  const disks = dashboardData?.disks || [];
console.log(disks);
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

    DISK NAME

  </TableCell>

  <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">

    DISK SIZE

  </TableCell>


  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

    DISK FLAVOUR ID

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
  );
}

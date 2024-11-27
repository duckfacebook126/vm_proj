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
  const users = dashboardData?.users || [];
console.log(users);
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

    USER ID

  </TableCell>

  <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">

    FIRST NAME

  </TableCell>


  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

    LAST NAME

  </TableCell>


    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        PHONE NUMBER

    </TableCell>

    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        CNIC

    </TableCell>


     <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        EMAIL

    </TableCell>


     <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

        USERNAME

    </TableCell>

    
    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>

      USER TYPE

    </TableCell>


    

    </TableRow>

    </TableHead>
        <TableBody>

          
          {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.id}
              </TableCell>

              <TableCell component="th" scope="row">
                {user.firstName}
              </TableCell>

              <TableCell align="left">
                {user.lastName }
              </TableCell>

              <TableCell align="left">
                {user.phoneNumber}
              </TableCell>


              <TableCell align="left">
                {user.CNIC}
              </TableCell>

              <TableCell align="left">
                {user.email}
              </TableCell>

              <TableCell align="left">
                {user.userName}
              </TableCell>

              <TableCell align="left">
                {user.userType}
              </TableCell>


             

            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </TableContainer>
  );
}

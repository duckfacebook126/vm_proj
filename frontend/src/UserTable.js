import React, { useContext, useState } from 'react';
import { DataContext } from './contexts/DashboardContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

export default function UserTable() {
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableBody>
          {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
            <TableRow key={user.id}>

              <TableCell component="th" scope="row">
                {user.id}
              </TableCell>


              <TableCell align="left">
                {user.lastName}
              </TableCell>


              <TableCell align="left">
                {user.phoneNumber}
              </TableCell>


              <TableCell align="left">
                {user.CNCIC}
              </TableCell>


              <TableCell align="left">
                {user.email}
              </TableCell>


              <TableCell align="left">
                {user.userName}
              </TableCell>
              
               <TableCell align="left">
                {user.PASSWORD}
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

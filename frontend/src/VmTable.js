import React, { useState } from 'react';
import { useDashboard } from './contexts/DashboardContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import LoadingSpinner from './components/Loading';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

function VmTable() {
    const { dashboardData, isLoading } = useDashboard();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dense, setDense] = useState(false);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const emptyRows = page > 0 
        ? Math.max(0, (1 + page) * rowsPerPage - dashboardData.vms.length) 
        : 0;

    const visibleRows = dashboardData.vms
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, border: '1px solid rgba(224, 224, 224, 1)' }}>
                <TableContainer>
                    <Table 
                        sx={{ 
                            minWidth: 750,
                            '& .MuiTableCell-root': {
                                borderRight: '1px solid rgba(224, 224, 224, 1)',
                                '&:last-child': {
                                    borderRight: 'none'
                                }
                            }
                        }} 
                        size={dense ? 'small' : 'medium'}
                        aria-label="vm table"
                    >
                        <TableHead>
                            <TableRow sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                '& th': { fontWeight: 'bold' }
                            }}>
                                <TableCell>VM ID</TableCell>
                                <TableCell>VM Name</TableCell>
                                <TableCell>OS Name</TableCell>
                                <TableCell align="right">Disk Space</TableCell>
                                <TableCell align="right">RAM</TableCell>
                                <TableCell align="right">CPU</TableCell>
                                <TableCell align="right">Flavor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((vm) => (
                                <TableRow key={vm.id}>
                                    <TableCell>{vm.id}</TableCell>
                                    <TableCell>{vm.name}</TableCell>
                                    <TableCell>{vm.osName}</TableCell>
                                    <TableCell align="right">{vm.size}</TableCell>
                                    <TableCell align="right">{vm.ram}</TableCell>
                                    <TableCell align="right">{vm.cpu} x {vm.cores}</TableCell>
                                    <TableCell align="right">{vm.flavorName}</TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={dashboardData.vms.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}

export default VmTable;

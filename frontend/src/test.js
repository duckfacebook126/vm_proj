<TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: '100%' }}>
<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
        <TableRow>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>VM ID</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>VM Name</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>OS Name</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Disk Space</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ram</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cpu</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Flavor</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {dashboardData.vms.map((vm) => (
            <TableRow
                key={vm.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left">{vm.id}</TableCell>
                <TableCell align="left">{vm.name}</TableCell>
                <TableCell align="left">{vm.osName}</TableCell>
                <TableCell align="right">{vm.size}</TableCell>
                <TableCell align="right">{vm.ram}</TableCell>
                <TableCell align="right">{vm.cpu} x {vm.cores}</TableCell>
                <TableCell align="right">{vm.flavorName}</TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>
</TableContainer>
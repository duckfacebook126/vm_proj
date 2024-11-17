import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import AddVMForm from './AddVMForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('vms');
    const [dashboardData, setDashboardData] = useState({ vms: [], disks: [] });
    const navigate = useNavigate();
    const [loading,setLoading]=useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [vmToDelete, setVmToDelete] = useState(null);

    useEffect(() => {    
           
        setTimeout(()=>{
            fetchDashboardData();
            setLoading(false);
        },3000)
    }, []);
    useEffect(()=>{
        handle_login_change();
    },[])
const handleDeltevm=async(VMid)=>{
axios.delete(`http://localhost:8080/api/delete_vm/${VMid}`,{withCredentials:true})
.then(res=>{
    console.log(res.data);
    fetchDashboardData();
}).catch(err=>{
    console.error('Failed to delete VM 1:', err);
})

}
    const fetchDashboardData = () => {
        axios.get('http://localhost:8080/api/dashboard_data', { withCredentials: true })
            .then(res => {
                setDashboardData(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch dashboard data:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            });
    };

    const handle_login_change=async()=>{
        const res=await axios.get('http://localhost:8080/',{withCredentials:true})
        console.log(res.data);
    }
    const renderVMCards = () => {
        return dashboardData.vms.map(vm => (
            <div key={vm.id} className="vm-card">
                <h5>{vm.name}</h5>
                <p>OS: {vm.osName}</p>
                <p>CPU: {vm.cpu} x {vm.cores} cores</p>
                <p>RAM: {vm.ram} GB</p>
                <p>Disk Size: {vm.size} GB</p>
                <p>Flavor: {vm.flavorName}</p>
                <IconButton 
                    style={{height: '40px', width: '40px'}} 
                    sx={{color: 'white','&:hover':{border: '2px solid green'}}} 
                    onClick={() => handleDeleteClick(vm.id)}
                >
                    <DeleteIcon style={{height: '40px', width: '40px'}} sx={{color: 'green'}} />
                </IconButton>
            </div>
        ));
    };

    const renderDiskCards = () => {
        return dashboardData.disks.map(disk => (
            <div key={disk.id} className="disk-card">
                <h5>{disk.name}</h5>
                <p>Size: {disk.size} GB</p>
                <p>Flavor: {disk.flavorName}</p>
                <p>Attached to VM: {disk.vmName || 'None'}</p>
                <IconButton style={{height: '40px', width: '40px'}} sx={{color: 'white','&:hover':{border: '2px solid green'}} }  className="btn-add-vm" >
                <DeleteIcon style={{height: '40px', width: '40px'}} sx={{color: 'green'}} />
                </IconButton>
            </div>
        ));
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
            console.log(res.data.message);
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleDeleteClick = (vmId) => {
        setVmToDelete(vmId);
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        if (vmToDelete) {
            handleDeltevm(vmToDelete);
            setOpenDialog(false);
            setVmToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setVmToDelete(null);
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Dashboard</h3>
                </div>
                <div className="sidebar-menu">
                    <button 
                        className={`sidebar-item ${activeTab === 'vms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('vms')}
                    >
                        VMs
                    </button>
                    <button 
                        className={`sidebar-item ${activeTab === 'disks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('disks')}
                    >
                        Disks
                    </button>
                    <button 
                        className={`sidebar-item ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            <div className="main-content">
                <header className="navbar">
                    <h1>{activeTab.toUpperCase()}</h1>
                    <div>
                        <Stack spacing={2} direction="row">
                        <Button variant='contained' className="btn-logout" onClick={handleLogout}>Logout</Button>
                        </Stack>
                    </div>
                </header>

                <div className="content-area">
                    <div className="loading-container">
                {loading &&<CircularProgress style={{color:'green', height:'200px', width:'200px'}}/>}
                </div>


                    {activeTab === 'vms' && (
                        <div className="vm-cards">
                            {renderVMCards()}
                          {  !loading && <IconButton style={{height: '200px', width: '200px'}} className="btn-add-vm" onClick={() => setShowForm(true)}>
                            <AddIcon style={{height: '200px', width: '200px'}} />
                            </IconButton>}
                        </div>
                    )}
                    {activeTab === 'disks' && (
                        <div className="disk-cards">
                            {renderDiskCards()}
                        </div>
                    )}
                    {activeTab === 'analytics' && (
                        <div className="analytics">
                            <h2>Analytics Coming Soon</h2>
                        </div>
                    )}
                </div>

                {showForm && (
                    <div className="overlay">
                        <AddVMForm onClose={() => {
                            setShowForm(false);
                            fetchDashboardData();
                        }} />
                    </div>
                )}
            </div>
            <Dialog
                open={openDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this VM? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dashboard;

import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import AddVMForm from './AddVMForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('vms');
    const [dashboardData, setDashboardData] = useState({ vms: [], disks: [] });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

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

    const renderVMCards = () => {
        return dashboardData.vms.map(vm => (
            <div key={vm.id} className="vm-card">
                <h5>{vm.name}</h5>
                <p>OS: {vm.osName}</p>
                <p>CPU: {vm.cpu} x {vm.cores} cores</p>
                <p>RAM: {vm.ram} GB</p>
                <p>Disk Size: {vm.size} GB</p>
                <p>Flavor: {vm.flavorName}</p>
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
            </div>
        ));
    };

    const handleLogout = () => {
        axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true })
            .then(res => {
                console.log(res.data.message);
                navigate('/login'); // Redirect to login page after logout
            })
            .catch(err => {
                console.error('Logout failed:', err);
            });
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
                        <button className="btn-add-vm" onClick={() => setShowForm(true)}>Add VM</button>
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === 'vms' && (
                        <div className="vm-cards">
                            {renderVMCards()}
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
        </div>
    );
}

export default Dashboard;

import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import AddVMForm from './AddVMForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/dashboard', { withCredentials: true })
            .then(res => {
                console.log('Dashboard data:', res.data);
            })
            .catch(err => {
                console.error('Unauthorized access:', err);
                navigate('/login'); // Redirect to login page if unauthorized
            });
    }, []);

    const handleAddVM = () => setShowForm(true);
    const handleFormClose = () => setShowForm(false);

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
            {/* Navbar */}
            <header className="navbar bg-primary text-white p-3">
                <h1 className="navbar-brand mb-0">VM Dashboard</h1>
                <div>
                    <button className="btn btn-light btn-add-vm" onClick={handleAddVM}>Add VM</button>
                    <button className="btn btn-light btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <div className="main-content">
                <h2>Your Virtual Machines</h2>
                {/* List of VM Cards (example card shown) */}
                <div className="vm-cards">
                    <div className="vm-card">
                        <h5>VM Name</h5>
                        <p>OS: Linux</p>
                        <p>CPU Cores: 4</p>
                        <p>RAM: 8 GB</p>
                        <p>Disk Size: 100 GB</p>
                    </div>
                </div>

                {/* Conditionally render Add VM Form */}
                {showForm && (
                    <div className="overlay">
                        <div className="overlay-content">
                            <AddVMForm onClose={handleFormClose} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

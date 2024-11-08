import React, { useState } from 'react';
import './Dashboard.css';
import AddVMForm from './AddVMForm';

function Dashboard() {
    const [showForm, setShowForm] = useState(false);

    const handleAddVM = () => setShowForm(true);
    const handleFormClose = () => setShowForm(false);

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <header className="navbar bg-primary text-white p-3">
                <h1 className="navbar-brand mb-0">VM Dashboard</h1>
                <button className="btn btn-light btn-add-vm" onClick={handleAddVM}>Add VM</button>
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

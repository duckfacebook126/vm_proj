// File: Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css';
import AddVMForm from './AddVMForm'; // Import the form component

function Dashboard() {
    const [showForm, setShowForm] = useState(false); // Track whether form is open
    const [vms, setVMs] = useState([]); // Track VM data

    const handleAddVM = () => {
        setShowForm(true); // Open the form
    };

    const handleFormSubmit = (vmData) => {
        setVMs([...vms, vmData]); // Add the new VM to the list
        setShowForm(false); // Close the form after submission
    };

    return (
        <div className="dashboard-container">
            <main className="main-content">
                <header className="header">
                    <h1>VM Dashboard</h1>
                    <button className="btn-add-vm" onClick={handleAddVM}>Add VM</button>
                </header>

                {/* VM Cards Section */}
                <section className="vm-cards">
                    {vms.length === 0 ? (
                        <p>No VMs available. Click "Add VM" to create one.</p>
                    ) : (
                        vms.map((vm, index) => (
                            <div key={index} className="vm-card">
                                <h3>{vm.name}</h3>
                                <p>OS: {vm.os}</p>
                                <p>RAM: {vm.ram} GB</p>
                                <p>Disk: {vm.disk} GB</p>
                            </div>
                        ))
                    )}
                </section>

                {/* Conditional rendering for Add VM Form */}
                {showForm && (
                    <AddVMForm onSubmit={handleFormSubmit} onClose={() => setShowForm(false)} />
                )}
            </main>
        </div>
    );
}

export default Dashboard;

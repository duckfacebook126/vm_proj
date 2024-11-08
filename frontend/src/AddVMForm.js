import React, { useState } from 'react';
import './AddVMForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddVMForm({ onSubmit, onClose }) {
    const [vmValues, setVmValues] = useState({
        name: '',
        os: 'windows', // Default to 'windows'
        flavor: 'light', // Default to 'light'
        ram: 4, // Default to 4 for 'light' flavor
        disk: 50 // Default to 50
    });

    const navigate = useNavigate();
    const [vmError, setVmError] = useState({});

    const handleInput = (event) => {
        const { name, value } = event.target;
        setVmValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Add any necessary validation here
        const errors = {};
        
        // Example validation
        if (!vmValues.name) {
            errors.name = "VM Name is required";
        }
        // Add more validation as needed

        // Check if there are no validation errors
        const noErrors = Object.keys(errors).length === 0;
        if (noErrors) {
            axios.post('http://localhost:8080/api/create_vm', vmValues)
                .then(res => {
                    navigate('/dashboard'); // Navigate to dashboard on success
                })
                .catch(err => console.log(err));
        } else {
            setVmError(errors);
        }
    };

    return (
        <div className="add-vm-form-container">
            <form className="add-vm-form" onSubmit={handleSubmit}>
                <h2>Add New VM</h2>

                {/* VM Name */}
                <div className="form-group">
                    <label>VM Name</label>
                    <input 
                        type="text" 
                        value={vmValues.name} 
                        onChange={handleInput} 
                        name="name" 
                        required 
                    />
                    {vmError.name && <span className="error">{vmError.name}</span>}
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit" onSubmit={onSubmit}>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AddVMForm;

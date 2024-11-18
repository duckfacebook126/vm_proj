import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddVMForm.css';

function AddVMForm({ onClose }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        osName: '',
        vmName: '',
        cpuCores: 2,
        cpuCount: 1,
        diskFlavor: 'Light',
        ram: 2,
        diskSize: 50,
        diskName: ''
    });
    const [vmError, setVmError] = useState({});

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSliderChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };

    const handleDiskFlavorChange = (event) => {
        const diskFlavor = event.target.value;
        let minRAM, maxRAM;
        
        if (diskFlavor === 'Light') {
            minRAM = 2;
            maxRAM = 8;
        } else if (diskFlavor === 'Medium') {
            minRAM = 8;
            maxRAM = 16;
        } else if (diskFlavor === 'Heavy') {
            minRAM = 16;
            maxRAM = 64;
        }

        setFormData((prev) => ({
            ...prev,
            diskFlavor,
            ram: minRAM
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = {};
        if (!formData.osName) errors.osName = "OS name is required";
        if (!formData.vmName) errors.vmName = "VM name is required";
        if (!formData.diskName) errors.diskName = "Disk name is required";

        if (Object.keys(errors).length > 0) {
            setVmError(errors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/create_vm', formData, {
                withCredentials: true  // This line is crucial for sending cookies
            });
            console.log('VM created successfully:', response.data);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error creating VM:', err);
            setVmError({ submit: err.response?.data?.error || "Failed to create VM. Please try again." });
        }
    };

    const ramLimits = {
        Light: { min: 2, max: 8 },
        Medium: { min: 8, max: 16 },
        Heavy: { min: 16, max: 64 }
    };

    return (
        <div className="add-vm-form-container">
            <form className="add-vm-form" onSubmit={handleSubmit}>
                <h2>Add New VM</h2>
                <div className="form-sections">
                    <div className="form-left">
                    
                        <div className="form-group ">
                            <label htmlFor="osName">OS Name</label>
                            <input
                                type="text"
                                id="osName"
                                name="osName"
                                value={formData.osName}
                                onChange={handleInput}
                                required
                                className='form-control dark-outline'
                            />
                            {vmError.osName && <span className="error ">{vmError.osName}</span>}
                        </div>
                        <div className="form-group ">
                            <label htmlFor="vmName">VM Name</label>
                            <input
                                type="text"
                                id="vmName"
                                name="vmName"
                                value={formData.vmName}
                                onChange={handleInput}
                                required
                                className='form-control dark-outline'


                            />
                            {vmError.vmName && <span className="error">{vmError.vmName}</span>}
                        </div>
                        <div className="form-group ">
                            <label htmlFor="cpuCores">CPU Cores: {formData.cpuCores}</label>
                            <input
                                type="range"
                                id="cpuCores"
                                name="cpuCores"
                                min="2"
                                max="8"
                                value={formData.cpuCores}
                                onChange={handleSliderChange}
                              

                            />
                        </div>
                        <div className="form-group ">
                            <label htmlFor="cpuCount">CPU Count: {formData.cpuCount}</label>
                            <input
                                type="range"
                                id="cpuCount"
                                name="cpuCount"
                                min="1"
                                max="4"
                                value={formData.cpuCount}
                                onChange={handleSliderChange}

                            /> 
                        </div>
                    </div>
                    <div className="form-right">
                        <div className="form-group ">
                            <label htmlFor="diskFlavor">Disk Flavor</label>
                            <select
                                id="diskFlavor"
                                name="diskFlavor"
                                value={formData.diskFlavor}
                                onChange={handleDiskFlavorChange}

                            >
                                <option value="Light">Light</option>
                                <option value="Medium">Medium</option>
                                <option value="Heavy">Heavy</option>
                            </select>
                        </div>
                        <div className="form-group ">
                            <label htmlFor="ram">RAM Size: {formData.ram} GB</label>
                            <input
                                type="range"
                                id="ram"
                                name="ram"
                                min={ramLimits[formData.diskFlavor].min}
                                max={ramLimits[formData.diskFlavor].max}
                                value={formData.ram}
                                onChange={handleSliderChange}

                            />
                        </div>
                        <div className="form-group ">
                            <label htmlFor="diskName">Disk Name</label>
                            <input
                                type="text"
                                id="diskName"
                                name="diskName"
                                value={formData.diskName}
                                onChange={handleInput}
                                required
                                className='form-control dark-outline'

                            />
                            {vmError.diskName && <span className="error">{vmError.diskName}</span>}
                        </div>
                        <div className="form-group ">
                            <label htmlFor="diskSize">Disk Size: {formData.diskSize} GB</label>
                            <input
                                type="range"
                                id="diskSize"
                                name="diskSize"
                                min="50"
                                max="5000"
                                step="50"
                                value={formData.diskSize}
                                onChange={handleSliderChange}

                            />
                        </div>
                    </div>
                </div>
                <div className="form-buttons">
                    <button type="button" className='btn btn-success' onClick={onClose}>Close</button>
                    <button type="submit" className='btn btn-success'>Submit</button>
                </div>
            </form>
            {vmError.submit && <div className="error">{vmError.submit}</div>}
        </div>
    );
}

export default AddVMForm;
import React, { useState } from 'react';
import './AddVMForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddVMForm({ onClose }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
            osName: '',
            vmName: '',
            cpuCores: 2,     // Slider for CPU cores (2 to 8)
            cpuCount: 1,     // Slider for CPU count (1 to 4)
            diskFlavor: 'Light', // Disk flavor selection
            ram: 2,          // RAM based on flavor, initially min value
            diskSize: 50 ,
            diskName:''    // Disk size slider (50 GB to 5000 GB)
    });
    const [vmError, setVmError] = useState({});

    // Handle input changes
    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle slider changes
    const handleSliderChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };

    // Adjust RAM slider based on disk flavor selection
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
            ram: minRAM // Reset RAM to min of the new range
        }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        const errors = {};
        if (!formData.osName) errors.osName = "OS name is required";
        if (!formData.vmName) errors.vmName = "VM name is required";
        if (!formData.diskName) errors.diskName = "Disk name is required";


        if (Object.keys(errors).length > 0) {
            setVmError(errors);
            return;
        } else {
            setVmError({});
        }
                 ///posting the form data to the backend
        axios.post('http://localhost:8080/api/create_vm', formData)
            .then(() => {
                navigate('/dashboard');
            })
            .catch(err => console.log(err));
    };

    // RAM limits based on flavor selection
    const ramLimits = {
        Light: { min: 2, max: 8 },
        Medium: { min: 8, max: 16 },
        Heavy: { min: 16, max: 64 }
    };

    return (
        <div className="add-vm-form-container">
            <form className="add-vm-form" onSubmit={handleSubmit}>
                <h2>Add New VM</h2>

                {/* OS Name */}
                <div className="form-group">
                    <label>OS Name</label>
                    <input
                        type="text"
                        name="osName"
                        value={formData.osName}
                        onChange={handleInput}
                        required
                    />
                    {vmError.osName && <span className="error">{vmError.osName}</span>}
                </div>

                {/* VM Name */}
                <div className="form-group">
                    <label>VM Name</label>
                    <input
                        type="text"
                        name="vmName"
                        value={formData.vmName}
                        onChange={handleInput}
                        required
                    />
                    {vmError.vmName && <span className="error">{vmError.vmName}</span>}
                </div>

                {/* CPU Cores Slider */}
                <div className="form-group">
                    <label>CPU Cores: {formData.cpuCores}</label>
                    <input
                        type="range"
                        name="cpuCores"
                        min="2"
                        max="8"
                        value={formData.cpuCores}
                        onChange={handleSliderChange}
                    />
                </div>

                {/* CPU Count Slider */}
                <div className="form-group">
                    <label>CPU Count: {formData.cpuCount}</label>
                    <input
                        type="range"
                        name="cpuCount"
                        min="1"
                        max="4"
                        value={formData.cpuCount}
                        onChange={handleSliderChange}
                    />
                </div>

                {/* Disk Flavor Selection */}
                <div className="form-group">
                    <label>Disk Flavor</label>
                    <select
                        name="diskFlavor"
                        value={formData.diskFlavor}
                        onChange={handleDiskFlavorChange}
                    >
                        <option value="Light">Light</option>
                        <option value="Medium">Medium</option>
                        <option value="Heavy">Heavy</option>
                    </select>
                </div>

                {/* RAM Size Slider */}
                <div className="form-group">
                    <label>RAM Size: {formData.ram} GB</label>
                    <input
                        type="range"
                        name="ram"
                        min={ramLimits[formData.diskFlavor].min}
                        max={ramLimits[formData.diskFlavor].max}
                        value={formData.ram}
                        onChange={handleSliderChange}
                    />
                </div>

                <div className="form-group">
                    <label>Disk Name</label>
                    <input
                        type="text"
                        name="diskName"
                        value={formData.diskName}
                        onChange={handleInput}
                        required
                    />
                    {vmError.diskName && <span className="error">{vmError.diskName}</span>}
                </div>


                
                {/* Disk Size Slider */}
                <div className="form-group">
                    <label>Disk Size: {formData.diskSize} GB</label>
                    <input
                        type="range"
                        name="diskSize"
                        min="50"
                        max="5000"
                        value={formData.diskSize}
                        onChange={handleSliderChange}
                    />
                </div>

                {/* Form Buttons */}
                <div className="form-buttons">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AddVMForm;

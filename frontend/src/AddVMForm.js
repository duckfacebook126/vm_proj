import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddVMForm.css';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Slider,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import Swal from 'sweetalert2';

function AddVMForm({ onClose, onSuccess }) {
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


                // error handling and regex checks for the add vm form details
        if (!formData.osName) errors.osName = "OS name is required";
        if (!formData.vmName) errors.vmName = "VM name is required";
        if (!formData.diskName) errors.diskName = "Disk name is required";
        if (!/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/.test(formData.osName)) errors.osName = "OS name should start with at least one alphabet, spaces allowed, and be of max 20 characters in length";
        if (!/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/.test(formData.vmName)) errors.vmName = "VM name should start with at least one alphabet, spaces allowed, and be of max 20 characters in length";
        if (!/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/.test(formData.diskName)) errors.diskName = "Disk name should start with at least one alphabet, spaces allowed, and be of max 20 characters in length";


            //check if there are any key value pairs in error variable if yes then set them t the handled errors above
            if (Object.keys(errors).length > 0) {
            setVmError(errors);
            return;
        }
                        /// post the data to the backend end point with axios post request
        try {
            const response = await axios.post('http://localhost:8080/api/create_vm', formData, {
                withCredentials: true  // This line is crucial for sending cookies
            });

            
            if (onSuccess) {
                onSuccess();

                Swal.fire({

                    icon:'success',
                    title:'VM Created Successfully',
                    confirmButtonText:'OK'
                })
            }
            onClose();
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
        <Dialog 
            open={true} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Add New VM</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="OS Name"
                                    name="osName"
                                    value={formData.osName}
                                    onChange={handleInput}
                                    required
                                    error={!!vmError.osName}
                                    helperText={vmError.osName}
                                />
                                <TextField
                                    fullWidth
                                    label="VM Name"
                                    name="vmName"
                                    value={formData.vmName}
                                    onChange={handleInput}
                                    required
                                    error={!!vmError.vmName}
                                    helperText={vmError.vmName}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>CPU Cores</InputLabel>
                                    <Slider
                                        name="cpuCores"
                                        value={formData.cpuCores}
                                        onChange={handleSliderChange}
                                        min={2}
                                        max={8}
                                        valueLabelDisplay="auto"
                                        marks
                                        aria-label="CPU Cores"
                                    />
                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        CPU Cores: {formData.cpuCores}
                                    </div>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>CPU Count</InputLabel>
                                    <Slider
                                        name="cpuCount"
                                        value={formData.cpuCount}
                                        onChange={handleSliderChange}
                                        min={1}
                                        max={4}
                                        valueLabelDisplay="auto"
                                        marks
                                        aria-label="CPU Count"
                                    />
                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        CPU Count: {formData.cpuCount}
                                    </div>
                                </FormControl>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Disk Flavor</InputLabel>
                                    <Select
                                        name="diskFlavor"
                                        value={formData.diskFlavor}
                                        onChange={handleDiskFlavorChange}
                                        label="Disk Flavor"
                                    >
                                        <MenuItem value="Light">Light</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="Heavy">Heavy</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>RAM Size</InputLabel>
                                    <Slider
                                        name="ram"
                                        value={formData.ram}
                                        onChange={handleSliderChange}
                                        min={ramLimits[formData.diskFlavor].min}
                                        max={ramLimits[formData.diskFlavor].max}
                                        valueLabelDisplay="auto"
                                        marks
                                        aria-label="RAM Size"
                                    />
                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        RAM Size: {formData.ram} GB
                                    </div>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Disk Name"
                                    name="diskName"
                                    value={formData.diskName}
                                    onChange={handleInput}
                                    required
                                    error={!!vmError.diskName}
                                    helperText={vmError.diskName}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Disk Size</InputLabel>
                                    <Slider
                                        name="diskSize"
                                        value={formData.diskSize}
                                        onChange={handleSliderChange}
                                        min={50}
                                        max={5000}
                                        step={50}
                                        valueLabelDisplay="auto"
                                        marks
                                        aria-label="Disk Size"
                                    />
                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        Disk Size: {formData.diskSize} GB
                                    </div>
                                </FormControl>
                            </Stack>
                        </Grid>
                    </Grid>
                    {vmError.submit && (
                        <div style={{ color: 'red', marginTop: '16px', textAlign: 'center' }}>
                            {vmError.submit}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddVMForm;


/**
 * AddVMForm component
 * 
 * This component renders a form to add a new virtual machine. It contains
 * fields for the os name, vm name, disk name, disk size and ram size.
 * 
 * @summary
 * - Renders a form to add a new virtual machine.
 * - Contains fields for the os name, vm name, disk name, disk size and ram size.
 * - Handles the form submission and calls the handleAddVM function.
 * - The handleAddVM function is called when the form is submitted.
 * - The handleAddVM function is responsible for creating a new virtual machine.
 * - The handleAddVM function is passed the form data as an argument.
 * - The form data is an object containing the os name, vm name, disk name,
 *   disk size and ram size.
 * - The handleAddVM function is responsible for validating the form data.
 * - The handleAddVM function is responsible for calling the addVM function with
 *   the validated form data.
 * - The addVM function is responsible for creating a new virtual machine.
 * 
 * @workflow
 * 1. The component renders the form to add a new virtual machine.
 * 2. The user fills in the form fields with the required information.
 * 3. The user submits the form.
 * 4. The handleAddVM function is called with the form data as an argument.
 * 5. The handleAddVM function validates the form data.
 * 6. The handleAddVM function calls the addVM function with the validated form data.
 * 7. The addVM function creates a new virtual machine.
 * 8. The addVM function returns a success message.
 * 9. The component displays the success message.
 */


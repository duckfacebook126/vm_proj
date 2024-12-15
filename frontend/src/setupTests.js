import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddVMForm.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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

    // Initial values to be used
    const initialValues = {
        osName: '',
        vmName: '',
        cpuCores: 2,
        cpuCount: 1,
        diskFlavor: 'Light',
        ram: 2,
        diskSize: 50,
        diskName: ''
    };

    // Validation schema for add VM form
    const validationSchema = Yup.object().shape({
        osName: Yup.string()
            .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/, 'The OS name must be between 1 to 20 characters, should start with an alphabet and no special characters')
            .required('OS Name is required'),
        vmName: Yup.string()
            .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/, 'The VM name must be between 1 to 20 characters, should start with an alphabet and no special characters')
            .required('VM Name is required'),
        diskName: Yup.string()
            .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/, 'The Disk Name must be between 1 to 20 characters, should start with an alphabet and no special characters')
            .required('Disk Name is required')
    });

    const handleDiskFlavorChange = (setFieldValue, diskFlavor) => {
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

        setFieldValue('diskFlavor', diskFlavor);
        setFieldValue('ram', minRAM);
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('http://localhost:8080/api/create_vm', values, {
                withCredentials: true  // This line is crucial for sending cookies
            });

            if (onSuccess) {
                onSuccess();

                Swal.fire({
                    icon: 'success',
                    title: 'VM Created Successfully',
                    confirmButtonText: 'OK'
                });
            }
            onClose();
        } catch (err) {
            console.error('Error creating VM:', err);
            setErrors({ submit: err.response?.data?.error || "Failed to create VM. Please try again." });
        } finally {
            setSubmitting(false);
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
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Stack spacing={3}>
                                        {/* OS Name */}
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="OS Name"
                                            name="osName"
                                            error={touched.osName && !!errors.osName}
                                            helperText={touched.osName && errors.osName}
                                        />
                                        {/* VM Name */}
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="VM Name"
                                            name="vmName"
                                            error={touched.vmName && !!errors.vmName}
                                            helperText={touched.vmName && errors.vmName}
                                        />
                                        {/* CPU Cores */}
                                        <FormControl fullWidth>
                                            <InputLabel>CPU Cores</InputLabel>
                                            <Slider
                                                name="cpuCores"
                                                value={values.cpuCores}
                                                onChange={(e, value) => setFieldValue('cpuCores', value)}
                                                min={2}
                                                max={8}
                                                valueLabelDisplay="auto"
                                                marks
                                                aria-label="CPU Cores"
                                            />
                                            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                                CPU Cores: {values.cpuCores}
                                            </div>
                                        </FormControl>
                                        {/* CPU Count */}
                                        <FormControl fullWidth>
                                            <InputLabel>CPU Count</InputLabel>
                                            <Slider
                                                name="cpuCount"
                                                value={values.cpuCount}
                                                onChange={(e, value) => setFieldValue('cpuCount', value)}
                                                min={1}
                                                max={4}
                                                valueLabelDisplay="auto"
                                                marks
                                                aria-label="CPU Count"
                                            />
                                            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                                CPU Count: {values.cpuCount}
                                            </div>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={3}>
                                        {/* Disk Flavor Selection */}
                                        <FormControl fullWidth>
                                            <InputLabel>Disk Flavor</InputLabel>
                                            <Select
                                                name="diskFlavor"
                                                value={values.diskFlavor}
                                                onChange={(e) => handleDiskFlavorChange(setFieldValue, e.target.value)}
                                                label="Disk Flavor"
                                            >
                                                <MenuItem value="Light">Light</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Heavy">Heavy</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {/* RAM Slider */}
                                        <FormControl fullWidth>
                                            <InputLabel>RAM Size</InputLabel>
                                            <Slider
                                                name="ram"
                                                value={values.ram}
                                                onChange={(e, value) => setFieldValue('ram', value)}
                                                min={ramLimits[values.diskFlavor].min}
                                                max={ramLimits[values.diskFlavor].max}
                                                valueLabelDisplay="auto"
                                                marks
                                                aria-label="RAM Size"
                                            />
                                            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                                RAM Size: {values.ram} GB
                                            </div>
                                        </FormControl>
                                        {/* Disk Name */}
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="Disk Name"
                                            name="diskName"
                                            error={touched.diskName && !!errors.diskName}
                                            helperText={touched.diskName && errors.diskName}
                                        />
                                        {/* Disk Size */}
                                        <FormControl fullWidth>
                                            <InputLabel>Disk Size</InputLabel>
                                            <Slider
                                                name="diskSize"
                                                value={values.diskSize}
                                                onChange={(e, value) => setFieldValue('diskSize', value)}
                                                min={50}
                                                max={5000}
                                                step={50}
                                                valueLabelDisplay="auto"
                                                marks
                                                aria-label="Disk Size"
                                            />
                                            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                                Disk Size: {values.diskSize} GB
                                            </div>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            </Grid>
                            {errors.submit && (
                                <div style={{ color: 'red', marginTop: '16px', textAlign: 'center' }}>
                                    {errors.submit}
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                                Submit
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default AddVMForm;

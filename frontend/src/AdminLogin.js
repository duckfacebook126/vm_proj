import React, { useState } from 'react';
import { useFormik } from 'formik';
import { AdminLoginSchema } from './schemas/AdminLoginSchema';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert
} from '@mui/material';
import Swal from 'sweetalert2';

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: AdminLoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:8080/api/admin_login', values, {
          withCredentials: true
        });
        if (response.data.login) {
          console.log('Admin logged in');
          navigate('/admin_dashboard');
        }
      } catch (err) {
        const backendError = err.response?.data?.error;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: backendError || 'Login failed',
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={formik.isSubmitting}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default AdminLogin;
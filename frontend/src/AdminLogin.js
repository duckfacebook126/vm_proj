import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AdminLoginSchema } from './schemas/AdminLoginSchema';
import axios from 'axios';
import LoadingSpinner from './components/Loading';
import { encryptData } from './utils/encryption';

import { Link } from 'react-router-dom'
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
import { useUser } from './contexts/UserContext';
import { useAuth } from './contexts/AuthContext';

function AdminLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { user,checkAuthStatus } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      // If user is logged in as an admin, go to admin dashboard
      if (user.userType === 'Admin') {
          navigate('/admin_dashboard');
      }
      // If user is a regular user, go to regular dashboard
     
  }

  const timer = setTimeout(() => {
      setIsLoading(false);
  }, 3000);

  return () => clearTimeout(timer);
  
  
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: AdminLoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const encryptedData = encryptData(values);

      try {
        const response = await axios.post('http://localhost:8080/api/admin_login', {encryptedData}, {
          withCredentials: true
        });

        if (response.data.login) {
          // Trigger auth status check to update user context
          await checkAuthStatus();
          
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Redirecting to Admin Dashboard',
            timer: 1500,
            showConfirmButton: false
          });

          // Small delay to show success message
          setTimeout(() => {
            navigate('/admin_dashboard');
          }, 1600);
        }
      } catch (err) {
        const backendError = err.response?.data?.error || 'Login failed';
        
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: backendError,
        });

        // Optional: set form errors
        setErrors({
          submit: backendError
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        
        {formik.errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.errors.submit}
          </Alert>
        )}
        
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
          <Link to="/admin_signup" className="btn btn-link">
            Don't have an account? Signup as Admin
          </Link>

                
                  <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <strong>OR</strong>
                  </Box>

          <Link to="/login" className="btn btn-link">
            Want to login as a user? login as a user here
          </Link>



        </form>
      </Paper>
    </Container>
  );
}

export default AdminLogin;
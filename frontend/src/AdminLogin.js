import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AdminLoginSchema } from './schemas/AdminLoginSchema';
import axios from 'axios';
import LoadingSpinner from './components/Loading';
import { encryptData } from './utils/encryption';
import { LoginValidaitonSchema } from './LoginValidation';


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

      else if(user.userType!==null || user.userType!=='Admin')
      {

          navigate('/admin_login');

      }
      // If user is a regular user, go to regular dashboard
     
  }


  //setting loading to true for 3 secs
  const timer = setTimeout(() => {
      setIsLoading(false);
  }, 3000);

  return () => clearTimeout(timer);
  
  
  }, [user, navigate]);


  //formik vlaidation
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },

    //
    validationSchema: LoginValidaitonSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const encryptedData = encryptData(values);

      try {

        // ogin request to backend
        const response = await axios.post('http://localhost:8080/api/admin_login', {encryptedData}, {
          withCredentials: true
        });

        if (response.data.login) {
          // Trigger auth status check to update user context
          await checkAuthStatus();
          
       

          // Small delay to show success message
          setTimeout(() => {
            navigate('/admin_dashboard');
          }, 3000);
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

 //formikmerror displaying troubleshooter
  console.log('formik errors:', formik.errors);

  return (

    // 
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        


       
        

        {/* form and fields */}

        {/* UserName filed */}
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>

          <TextField
            fullWidth
            margin="normal"
            name="username"
            placeholder="Enter Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.username && formik.errors.username}
            sx={{
              '& .MuiFormHelperText-root': {
                color: 'red',
                fontSize: '1.2rem', // Increase the size as needed
              },
            }}
          />
        {/*user pasword field  */}
        <label htmlFor="password">Password</label>

          <TextField
            
            fullWidth
            margin="normal"
            name="password"
            type="password"
            placeholder="Enter password"

            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              '& .MuiFormHelperText-root': {
                color: 'red',
                fontSize: '1.2rem', // Increase the size as needed
              },
            }}
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

          {/* redirecting to signup */}
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


/**
 * @file AdminLogin.js
 * @summary This is the admin login page component which will render the admin login form
 * @description This component will render the admin login form with the fields of username and password
 * The form validation is done by using the Formik library
 * Once the form is submitted the username and password will be checked from the backend
 * If the credentials are correct then the admin user will be redirected to the admin dashboard
 * @flow
 * @exports AdminLogin
 */

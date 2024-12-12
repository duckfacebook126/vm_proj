import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { AdminSignupSchema } from './schemas/AdminSignupSchema';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { encryptData } from './utils/encryption';
import LoadingSpinner from './components/Loading';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import { useEffect } from 'react';
import { Label } from 'recharts';

function AdminSignup() {
  const [IsLoading, setIsLoading] = useState(true);

///on first time render set loading is true for 3 secs
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
}, []);

  const navigate = useNavigate();
  const [error, setError] = useState('');
//formik and form validation
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      cnic: '',
      email: '',
      username: '',
      password: ''
    },
    //validation schema
    validationSchema: AdminSignupSchema,

    //handle submit function
    onSubmit: async (values, { setSubmitting }) => {
      const encryptedData = encryptData(values);
         await axios.post('http://localhost:8080/api/admin_signup', {encryptedData})
        .then(res=>{
                if(res.data.success){
            navigate('/admin_login');
        }

        }).catch(err=>{
          setError(err.response?.data?.error || 'Signup failed');
        })
    
     
    }


  });

  //eror handling for formik errors
  console.log('formik errors for user signup are',formik.errors)


  //return form the loading is true
  if(!IsLoading){
    
    return (
    <Container component="main" sx={{width: 400 , mb:4,}}>
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Admin Signup
        </Typography>

   
      {/* formik form */}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} >

              {/* firstname field */}

              <label htmlFor="firstName">Firstname</label>
              <TextField

                fullWidth
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}

              />
            </Grid>
            <Grid item xs={12} 
            >
              {/* my lastname field */}

              <label htmlFor="lastName">Lastname</label>

              <TextField
                fullWidth
                name="lastName"
                placeholder='Lastname'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            {/* phne number */}
            <Grid item xs={12}>

            <label htmlFor="phoneNumber">Phone Number</label>

              <TextField
                fullWidth
                name="phoneNumber"
                placeholder='Phone Number'
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
            </Grid>

            {/* cnic field */}

            <Grid item xs={12}>

            <label htmlFor="cnic">CNIC</label>
              <TextField
                fullWidth
                name="cnic"
                placeholder='CNIC'
                value={formik.values.cnic}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.cnic && Boolean(formik.errors.cnic)}
                helperText={formik.touched.cnic && formik.errors.cnic}
              />
            </Grid>


              {/* email field */}

            <Grid item xs={12}>
            <label htmlFor="email">Email</label>
              <TextField
                fullWidth
                name="email"
                placeholder='Email'
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />


            </Grid>

            {/* username */}
            <Grid item xs={12}>
            <label htmlFor="username">Username</label>
              <TextField
                fullWidth
                name="username"
                placeholder='Username'
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>


            {/* password  */}
            <Grid item xs={12}>
            <label htmlFor="password">Password</label>
              <TextField
                fullWidth
                name="password"
                placeholder='Password'
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlurCapture={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={formik.isSubmitting}
          >
            Sign Up
          </Button>

          <Link to="/admin_login" className="btn btn-link">
                 already an Admin? Login as Admin here
                            </Link>
        </form>
      </Paper>
    </Container>
  );
}

else if(IsLoading)
{

  return(<>
  
  <LoadingSpinner></LoadingSpinner></>)
}
}

export default AdminSignup;

/**
 * @summary
 * This component is used to sign up as an admin. The component renders a form
 * that takes in the following fields:
 * 
 * - firstName: the first name of the admin
 * - lastName: the last name of the admin
 * - phoneNumber: the phone number of the admin
 * - cnic: the cnic of the admin
 * - email: the email address of the admin
 * - username: the username of the admin
 * - password: the password of the admin
 * 
 * The component validates the input fields using Yup's object.shape() method.
 * The validation rules are as follows:
 * 
 * - firstName: must be at most 10 alphabets and no numbers
 * - lastName: must be at most 10 alphabets and no numbers
 * - cnic: must be exactly 13 digits
 * - phoneNumber: must be exactly 11 digits
 * - email: must be a valid email address
 * - username: must be at least 6 characters long and contain at least one alphabet, one special character, and one number
 * - password: must be at least 6 characters long and contain at least one alphabet, one special character, and one number
 * 
 * If the input is invalid, an error message is displayed to the user.
 * 
 * The component also renders a "Sign Up" button that submits the form to the server.
 * 
 * If the server returns a successful response, the component redirects the user to the /admin_login route.
 * 
 * @workflow
 * The component is rendered when the user navigates to the /admin_signup route.
 * The user enters their details in the form and clicks the "Sign Up" button.
 * The component validates the input and sends a POST request to the server with the input data.
 * If the server returns a successful response, the component redirects the user to the /admin_login route.
 * If the server returns an error response, an error message is displayed to the user.
 * 
 * @returns
 * The component renders a form with the above fields and a "Sign Up" button.
 */


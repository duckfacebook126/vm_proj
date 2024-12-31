import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { encryptData } from './utils/encryption';
import { useFormik } from 'formik';
import { LoginValidaitonSchema } from './LoginValidation';
import Swal from 'sweetalert2';
import LoadingSpinner from './components/Loading';
import { useContext } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material/';
// This function renders the login form for the user

function Login() {
    const { user, checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const [IsLoading, setIsLoading] = useState(true)

const REACT_APP_USER_LOGIN_CALL=process.env.REACT_APP_USER_LOGIN_CALL;
const testVar = process.env.REACT_APP_TEST_VAR;


    useEffect(() => {

        // Function to check if user is logged in and redirect accordingly
        const checkAndRedirect = async () => {
            if (user) {
                // If user is logged in as an admin, go to admin dashboard
                if (user.userType === 'Admin') {
                    navigate('/admin_dashboard');
                }
                // If user is a regular user, go to regular dashboard
                else if (['Standard', 'Premium', 'SuperUser'].includes(user.userType)) {
                    navigate('/dashboard');
                }
            }
        };

        //check and redirect on first render
        checkAndRedirect();

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer)
    }, [user, navigate]);

    // formik validation    
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: LoginValidaitonSchema,
        // on submitt handle function here
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
            const encryptedData = encryptData(values);

            try {
                const res = await axios.post(`${REACT_APP_USER_LOGIN_CALL}`,
                    { encryptedData },
                    { withCredentials: true }
                );

                if (res.data.login) {
                    await checkAuthStatus();
                    // Wait for a moment to ensure session is properly set
                   await new Promise(resolve => setTimeout(resolve, 100));
                    if (res.data.userType === 'Admin') {
                        navigate('/admin_dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                }
            } catch (error) {
                if (error.response) {
                    const backendError = error.response.data.error;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: backendError,
                    });
                }
            } finally {
                setSubmitting(false);
            }
        }


    });


    //error handling for not diplaying formik errors handle the form errors


    if (!IsLoading) {
        return (

            // Lojgin fform here
            <Container component="main" maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>


                        User Login
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>


                        {/* Username field */}
                        <div className="form-group">
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
                                        fontSize: '1.0rem', // Increase the size as needed
                                    },
                                }}
                            />
                            {/* formik errors  for username*/}
                        </div>


                        {/*Password field  */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <TextField
                                type="password"
                                id="password"
                                placeholder="Enter Password"
                                name="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.password && formik.errors.password}
                                fullWidth

                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        color: 'red',
                                        fontSize: '1.0rem', // Increase the size as needed
                                    },
                                }}
                            />


                        </div>

                        {/* submitt button that handles the login */}
                        <button onSubmit={formik.handleSubmit} className="btn btn-danger btn-block w-100" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Logging in...' : 'Login'}
                        </button>

                        <Link to="/signup" className="btn btn-link">
                            Don't have an account? Sign up
                        </Link>

                        <strong>OR</strong>
                        <br />

                        {/* redirecting links to the */}

                        <Link to="/admin_login" className="btn btn-link">
                            Log in as Admin
                        </Link>



                    </form>
                </Paper>
            </Container>


        );
    }

    //show loading if loading is false

    else if (IsLoading) {

        return (<><LoadingSpinner /></>);
    }
}

export default Login;

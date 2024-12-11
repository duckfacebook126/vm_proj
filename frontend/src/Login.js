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

// This function renders the login form for the user


function Login() {
    const {user,checkAuthStatus}=useAuth();
    const navigate = useNavigate();
const [IsLoading,setIsLoading]=useState(true)



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
        // on submitt handle function here
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
                    //encrypt  data
                const encryptedData=encryptData(values)

            console.log('Submitting login with values:', values);

            //send encrypted data request
            axios.post('http://localhost:8080/api/login',{encryptedData}, { withCredentials: true })

            //throwing the alert on success
                .then(async (res) => {
                    console.log('Login response:', res.data);
                    setSubmitting(false);
                    if (res.data.login) {
                        await checkAuthStatus(); 
                        navigate('/dashboard');
                    }
                })
                .catch(error => {
                    console.error('Login error:', error.response?.data || error);
                    if (error.response) {
                        const backendError = error.response.data.error;

                        //throwing the alert on the error
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: backendError,
                        });
                    }
                    setSubmitting(false);
                });
        }
    });
if(!IsLoading){
    return (

        // Lojgin fform here
        <div className='login-container bg-white d-flex justify-content-center align-items-center'>
            <div className="login-form bg-white p-3 rounded dark-outline">
                <form onSubmit={formik.handleSubmit}>
                    <h1 className='text-center'>Login</h1>
                    <div className="form-group">
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input
                            type="text"
                            className="form-control mb-3 dark-outline"
                            id="username"
                            placeholder="Enter Username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            onBlur={formik.handleBlur}
                        />
                            {/* formik errors  for username*/}
                        {formik.touched.username && formik.errors.username && <p className='danger'>{formik.errors.username}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            className="form-control mb-3 dark-outline"
                            id="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                        />
                              {/* formik errors  for password*/}

                        {formik.touched.password && formik.errors.password && <p className='danger'>{formik.errors.password}</p>}
                    </div>

            {/* submitt button that handles the login */}
                    <button type="submit" className="btn btn-primary btn-block w-100" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    <Link to="/signup" className="btn btn-link">
                        Don't have an account? Sign up
                    </Link>

                    <strong>OR</strong>
                    <br/>

                    {/* redirecting links to the */}

                        <Link to="/admin_login" className="btn btn-link">
                            Log in as Admin
                            </Link>



                </form>
            </div>
        </div>

);}
   

//show loading if loading is false

    else if(IsLoading)
    {

        return(<><LoadingSpinner/></>);
    }
}

export default Login;

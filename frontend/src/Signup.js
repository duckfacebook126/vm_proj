import React, { useEffect, useState } from 'react';
import './Signup.css';
import  { SignUpSchema } from './SignUpValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import Swal from 'sweetalert2'
import Loading from './components/Loading';
import LoadingSpinner from './components/Loading';
import { useAuth } from './contexts/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import  {encryptData} from './utils/encryption';
import { decryptData } from './utils/decryption';
import { TextField,Container,Paper,Typography } from '@mui/material'

;


//secret keys ffor aes encryption
const secretKey = 'aelwfhlaef';
const secretIV = 'aifjaoeifjo';
const encMethod = 'aes-256-cbc';




       
function loading(){
    return (<><Loading /></>)
}


//signup component
function Signup() {
    
    const [IsLoading,setIsLoading]=useState(true);
    const navigate = useNavigate();
    const{user}=useAuth();
    useEffect(() => {
        

        if (user && user.login) {  
            if (user.userType === 'Admin') {
                navigate('/admin_login');
            } else {
                navigate('/login');
            }
        }
        


            const timer = setTimeout(() => {
                setIsLoading(false);
                return 
              }, 3000); 

              
    return () => clearTimeout(timer);
            
       


    }, []);

    //formik validation
    const formik= useFormik({
        initialValues: {
            cnic: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            username: '',
            email: '',
            password: ''
        },

        //validation schema for checking errors on frontend
        validationSchema: SignUpSchema,
        onSubmit:(values ,{setSubmitting,setErrors})=>{
            setSubmitting(true);
            const encryptedData=encryptData(values);
            axios.post('http://localhost:8082/api/signup', { encryptedData }).then(res => {
                
                navigate('/login'); // Navigate to the home page on successful signup
            }

            ).catch(error=>{
                if (error.response ) {
                    const backendError = error.response.data.error;
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: backendError,
                    });
                  }
                    setSubmitting(false);

            });





        }
        
        

    }
    )
    //console.log(formik);

    console.log(formik.errors);
    
   if(!IsLoading){

    return (
        <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, mt: 4,mb:4 }}>
          <Typography component="h1" variant ="h5" align="center" gutterBottom>
  
  
            <strong>Signup</strong>  
          </Typography>
  
                <form onSubmit={formik.handleSubmit}>
                  
                        {/* Left Section */}
                       
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>

                                {/* username field */}
                                <TextField
                                    type="text"
                                    className={formik.errors.firstName&& formik.touched.firstName?'form-control danger':'form-control'}
                                    id="firstName"
                                    placeholder="Enter First Name"
                                    name="firstName"
                                    onChange={formik.handleChange}
                                    value={formik.values.firstName}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.firstName && formik.errors.firstName}



                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            color: 'red',
                                            fontSize: '1.0rem', // Increase the size as needed
                                        },
                                    }}
                                />
                            </div>


                                    {/*Last name field  */}
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <TextField
                                    type="text"
                                    className={formik.errors.lastName&& formik.touched.lastName?'form-control danger':'form-control'}
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    name="lastName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    



                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            color: 'red',
                                            fontSize: '1.0rem', // Increase the size as needed
                                        },
                                    }}
                                />


                            </div>

                            {/* phone number */}
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <TextField
                                    type="tel"
                                    className={formik.touched.phoneNumber && formik.errors.phoneNumber ? 'form-control danger':"form-control"}
                                    id="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    name="phoneNumber"
                                    onChange={formik.handleChange}
                                    value={formik.values.phoneNumber}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}



                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            color: 'red',
                                            fontSize: '1.0rem', // Increase the size as needed
                                        },
                                    }}
                                    
                                />
                            </div>
                        
                        {/* Right Section */}
                        
                            <div className="form-group">
                                <label htmlFor="cnic">CNIC</label>
                                    {/* cnic field */}
                                <TextField
                                    type="text"
                                    className={formik.touched.cnic && formik.errors.cnic ? 'danger form-control':'form-control'}
                                    id="cnic"
                                    placeholder="Enter CNIC"
                                    name="cnic"
                                    onChange={formik.handleChange}
                                    value={formik.values.cnic}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.cnic && formik.errors.cnic}



                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            color: 'red',
                                            fontSize: '1.0rem', // Increase the size as needed
                                        },
                                    }}
                                />

                            </div>

                                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <TextField
                                    type="email"
                                    className={formik.touched.email && formik.errors.email ? ' form-control danger':"form-control"}
                                    id="email"
                                    placeholder="Enter Email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.email && formik.errors.email}



                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            color: 'red',
                                            fontSize: '1.0rem', // Increase the size as needed
                                        },
                                    }}
                                />
                            </div>

                            {/* username filed */}
                            <div className="form-group">


                                <label htmlFor="username">Username</label>
                                <TextField
                                    type="text"
                                    className={formik.touched.username && formik.errors.username ? 'form-control danger':"form-control"}
                                    id="username"
                                    placeholder="Enter Username"
                                    name="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.username && formik.errors.username}



                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            color: 'red',
                                            fontSize: '1.0rem', // Increase the size as needed
                                        },
                                    }}
                                />

                              
                            </div>
                            
                        
                        
                                 
                                    <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <TextField
                                    type="password"
                                    className={formik.touched.password && formik.errors.password ? 'form-control danger':"form-control"}
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
                    {/* Display server error */}
                    <button type="submit" className="btn btn-primary btn-block w-100">Register</button>

                    <Link to="/login" className="btn btn-link">
                        Already have an account? Login up
                    </Link>

                
                </form>

                </Paper>
            </Container>
        
    );
}


else if(IsLoading){

    return(<><LoadingSpinner/></>);
}

}
export default Signup;

/**
 * @summary
 * This file contains the Signup component which is used to 
 * register a user. The component renders a form with input 
 * fields for the user to enter their details. The form is 
 * validated using Yup and Formik. If the input is invalid, 
 * an error message is displayed to the user.
 * 
 * The component also renders a loading spinner if the 
 * registration process is taking too long.
 * 
 * @workflow
 * The Signup component is rendered in the Signup page. 
 * When the user submits the form, the component sends a 
 * POST request to the server with the user's details. 
 * If the request is successful, the user is redirected to 
 * the login page. If the request fails, an error message 
 * is displayed to the user.
 * 
 * 
 * @since 0.0.1
 */


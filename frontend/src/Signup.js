import React, { useEffect, useState } from 'react';
import './Signup.css';
import SignUpValidation, { SignUpSchema } from './SignUpValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';

const onSubmit=()=>{

    console.log('submitted')
}
function Signup() {

    useEffect(() => {
        axios.get('http://localhost:8080', { withCredentials: true })
            .then(res => {
                if(res.data.login)
                {
                    console.log(res.data.login);
                    navigate('/login'); // Redirect to login page if request fails

                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
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
        validationSchema: SignUpSchema,
        onSubmit
        
        

    }
    )
    console.log(formik);

    console.log(formik.errors);
    
    const navigate = useNavigate();

    // Handle input change
 

    // // Handle form submission
    // const handleSubmit = (event) => {
    //     event.preventDefault();

    //     // Validate and set errors
    //     const errors = {}
    //     if (!signupValues.cnic) errors.cnic = "CNIC is required";
    //     if (!signupValues.firstName) errors.firstName = "First name is required";
    //     if (!signupValues.lastName) errors.lastName = "Last name is required";
    //     if (!signupValues.phoneNumber) errors.phoneNumber = "Phone number is required";
    //     if (!signupValues.username) errors.username = "Username is required";
    //     if (!signupValues.email) errors.email = "Email is required";
    //     if (!signupValues.password) errors.password = "Password is required";
    //     const validationErrors = SignUpValidation(signupValues);
    //     if (validationErrors) {
    //         Object.keys(validationErrors).forEach((key) => {
    //             errors[key] = validationErrors[key];
    //         });
    //     }
    //     setSignupError(errors);

    //     // Check if there are no validation errors
    //     const noErrors = Object.keys(errors).length === 0;
    //     if (noErrors) {
    //         axios.post('http://localhost:8080/api/signup', signupValues)
    //             .then(res => {
                    
    //                 navigate('/login'); // Navigate to the home page on successful signup
    //             })
    //             .catch(err => {
    //                 console.error(err);
    //                 // Assuming the error message is in err.response.data.error
    //                 setSignupError({ serverError: err.response.data.error });
    //             });
    //     }
    // };

    return (
        <div className='signup-container d-flex justify-content-center align-items-center'>
            <div className="signup-form bg-white p-3 rounded dark-outline">
                <form onSubmit={formik.handleSubmit}>
                    <h1 className='text-center'>Register</h1>
                    <div className="form-sections d-flex">
                        {/* Left Section */}
                        <div className="left-section">
                            <div className="form-group">
                                <label htmlFor="firstName"><strong>First Name</strong></label>
                                <input
                                    type="text"
                                    className="form-control mb-3 dark-outline"
                                    id="firstName"
                                    placeholder="Enter First Name"
                                    name="firstName"
                                    onChange={formik.handleChange}
                                    value={formik.values.firstName}
                                    onBlur={formik.handleBlur}
                                />
                                <p className='danger'>{formik.errors.firstName}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName"><strong>Last Name</strong></label>
                                <input
                                    type="text"
                                    className="form-control mb-3 dark-outline"
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    name="lastName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                />
                                <p className='danger'>{formik.errors.lastName}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
                                <input
                                    type="tel"
                                    className={formik.touched.phoneNumber && formik.errors.phoneNumber ? 'danger':""}
                                    id="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    name="phoneNumber"
                                    onChange={formik.handleChange}
                                    value={formik.values.phoneNumber}
                                    onBlur={formik.handleBlur}
                                    
                                />
                                <p className='danger'>{formik.errors.phoneNumber}</p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="right-section">
                            <div className="form-group">
                                <label htmlFor="cnic"><strong>CNIC</strong></label>
                                <input
                                    type="text"
                                    className={formik.touched.cnic && formik.errors.cnic ? 'danger':""}
                                    id="cnic"
                                    placeholder="Enter CNIC"
                                    name="cnic"
                                    onChange={formik.handleChange}
                                    value={formik.values.cnic}
                                    onBlur={formik.handleBlur}
                                />
                                <p className='danger'>{formik.errors.cnic}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><strong>Email</strong></label>
                                <input
                                    type="email"
                                    className={formik.touched.email && formik.errors.email ? 'danger':""}
                                    id="email"
                                    placeholder="Enter Email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                />
                                <p className='danger'>{formik.errors.email}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username"><strong>Username</strong></label>
                                <input
                                    type="text"
                                    className={formik.touched.username && formik.errors.username ? 'danger':""}
                                    id="username"
                                    placeholder="Enter Username"
                                    name="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    onBlur={formik.handleBlur}
                                />
                                <p className='danger'>{formik.errors.username}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><strong>Password</strong></label>
                                <input
                                    type="password"
                                    className={formik.touched.password && formik.errors.password ? 'danger':""}
                                    id="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                />
                                <p className='danger'>{formik.errors.password}</p>
                            </div>
                        </div>
                    </div>
                    {/* Display server error */}
                    <button type="submit" className="btn btn-primary btn-block w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;

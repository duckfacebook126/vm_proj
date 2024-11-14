import React, { useEffect, useState } from 'react';
import './Signup.css';
import SignUpValidation, { SignUpSchema } from './SignUpValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import Swal from 'sweetalert2'


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
        onSubmit:(values ,{setSubmitting,setErrors})=>{
            setSubmitting(true);
            axios.post('http://localhost:8080/api/signup', values).then(res => {
                
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
    
    const navigate = useNavigate();

   

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
                                    className={formik.errors.firstName&& formik.touched.firstName?'form-control danger':'form-control'}
                                    id="firstName"
                                    placeholder="Enter First Name"
                                    name="firstName"
                                    onChange={formik.handleChange}
                                    value={formik.values.firstName}
                                    onBlur={formik.handleBlur}
                                />
                               { formik.touched.firstName&& formik.errors.firstName&&<p className={formik.errors.firstName&& formik.touched.firstName?'form-control danger':'form-control'}>{formik.errors.firstName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName"><strong>Last Name</strong></label>
                                <input
                                    type="text"
                                    className={formik.errors.lastName&& formik.touched.lastName?'form-control danger':'form-control'}
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    name="lastName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                />
                                {formik.touched.lastName&&formik.errors.lastName&&<p className={formik.errors.lastName&& formik.touched.lastName?'form-control danger':'form-control'}>{formik.errors.lastName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
                                <input
                                    type="tel"
                                    className={formik.touched.phoneNumber && formik.errors.phoneNumber ? 'form-control danger':"form-control"}
                                    id="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    name="phoneNumber"
                                    onChange={formik.handleChange}
                                    value={formik.values.phoneNumber}
                                    onBlur={formik.handleBlur}
                                    
                                />
                                {formik.touched.phoneNumber&&formik.errors.phoneNumber&&<p className={formik.errors.phoneNumber&& formik.touched.phoneNumber?'form-control danger':'form-control'}>{formik.errors.phoneNumber}</p>}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="right-section">
                            <div className="form-group">
                                <label htmlFor="cnic"><strong>CNIC</strong></label>
                                <input
                                    type="text"
                                    className={formik.touched.cnic && formik.errors.cnic ? 'danger form-control':'form-control'}
                                    id="cnic"
                                    placeholder="Enter CNIC"
                                    name="cnic"
                                    onChange={formik.handleChange}
                                    value={formik.values.cnic}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.cnic&&formik.errors.cnic&&<p className={formik.touched.cnic && formik.errors.cnic ? 'danger form-control':'form-control'}>{formik.errors.cnic}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><strong>Email</strong></label>
                                <input
                                    type="email"
                                    className={formik.touched.email && formik.errors.email ? ' form-control danger':"form-control"}
                                    id="email"
                                    placeholder="Enter Email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email&&formik.errors.email&&<p className={formik.touched.email && formik.errors.email ? ' form-control danger':"form-control"}>{formik.errors.email}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="username"><strong>Username</strong></label>
                                <input
                                    type="text"
                                    className={formik.touched.username && formik.errors.username ? 'form-control danger':"form-control"}
                                    id="username"
                                    placeholder="Enter Username"
                                    name="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.username&&formik.errors.username&&<p className={formik.touched.username && formik.errors.username ? 'form-control danger':"form-control"}>{formik.errors.username}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><strong>Password</strong></label>
                                <input
                                    type="password"
                                    className={formik.touched.password && formik.errors.password ? 'form-control danger':"form-control"}
                                    id="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                />
                               { formik.touched.password&&formik.errors.password&&<p className={formik.touched.password && formik.errors.password ? 'form-control danger':"form-control"}>{formik.errors.password}</p>}
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

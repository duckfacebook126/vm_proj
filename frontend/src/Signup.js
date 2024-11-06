// Signup.js
import React, { useState } from 'react';
import './Signup.css';
import SignUpValidation from './SignUpValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [signup_values, setSignupValues] = useState({
        cnic: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [signup_error, setSignupError] = useState({});

    // Handle input change
    const handleInput = (event) => {
        const { name, value } = event.target;
        setSignupValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate and set errors
        const errors = SignUpValidation(signup_values);
        setSignupError(errors);

        // Check if there are no validation errors
        const noErrors = Object.keys(errors).length === 0;
        if (noErrors) {
            axios.post('http://localhost:8080/api/signup', signup_values)
                .then(res => {
                    navigate('/'); // Navigate on login page in case of successful signup
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className='signup-container d-flex justify-content-center align-items-center'>
            <div className="signup-form bg-white p-3 rounded dark-outline">
                <form onSubmit={handleSubmit}>
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
                                    onChange={handleInput}
                                />
                                {signup_error.firstName && <p className="text-danger">{signup_error.firstName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName"><strong>Last Name</strong></label>
                                <input
                                    type="text"
                                    className="form-control mb-3 dark-outline"
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    name="lastName"
                                    onChange={handleInput}
                                />
                                {signup_error.lastName && <p className="text-danger">{signup_error.lastName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
                                <input
                                    type="tel"
                                    className="form-control mb-3 dark-outline"
                                    id="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    name="phoneNumber"
                                    onChange={handleInput}
                                />
                                {signup_error.phoneNumber && <p className="text-danger">{signup_error.phoneNumber}</p>}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="right-section">
                            <div className="form-group">
                                <label htmlFor="cnic"><strong>CNIC</strong></label>
                                <input
                                    type="text"
                                    className="form-control mb-3 dark-outline"
                                    id="cnic"
                                    placeholder="Enter CNIC"
                                    name="cnic"
                                    onChange={handleInput}
                                />
                                {signup_error.cnic && <p className="text-danger">{signup_error.cnic}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><strong>Email</strong></label>
                                <input
                                    type="email"
                                    className="form-control mb-3 dark-outline"
                                    id="email"
                                    placeholder="Enter Email"
                                    name="email"
                                    onChange={handleInput}
                                />
                                {signup_error.email && <p className="text-danger">{signup_error.email}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="username"><strong>Username</strong></label>
                                <input
                                    type="text"
                                    className="form-control mb-3 dark-outline"
                                    id="username"
                                    placeholder="Enter Username"
                                    name="username"
                                    onChange={handleInput}
                                />
                                {signup_error.username && <p className="text-danger">{signup_error.username}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><strong>Password</strong></label>
                                <input
                                    type="password"
                                    className="form-control mb-3 dark-outline"
                                    id="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    onChange={handleInput}
                                />
                                {signup_error.password && <p className="text-danger">{signup_error.password}</p>}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;

import React, { useEffect, useState } from 'react';
import './Signup.css';
import SignUpValidation from './SignUpValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {

    useEffect(() => {
        axios.get('http://localhost:8080', { withCredentials: true })
            .then(res => {
                if(res.data.login)
                {
                    console.log(res.data.login);

                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login'); // Redirect to login page if request fails
            });
    }, []);

    const [signupValues, setSignupValues] = useState({
        cnic: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState({});

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
        const errors = {}
        if (!signupValues.cnic) errors.cnic = "CNIC is required";
        if (!signupValues.firstName) errors.firstName = "First name is required";
        if (!signupValues.lastName) errors.lastName = "Last name is required";
        if (!signupValues.phoneNumber) errors.phoneNumber = "Phone number is required";
        if (!signupValues.username) errors.username = "Username is required";
        if (!signupValues.email) errors.email = "Email is required";
        if (!signupValues.password) errors.password = "Password is required";
        const validationErrors = SignUpValidation(signupValues);
        if (validationErrors) {
            Object.keys(validationErrors).forEach((key) => {
                errors[key] = validationErrors[key];
            });
        }
        setSignupError(errors);

        // Check if there are no validation errors
        const noErrors = Object.keys(errors).length === 0;
        if (noErrors) {
            axios.post('http://localhost:8080/api/signup', signupValues)
                .then(res => {
                    
                    navigate('/login'); // Navigate to the home page on successful signup
                })
                .catch(err => {
                    console.error(err);
                    // Assuming the error message is in err.response.data.error
                    setSignupError({ serverError: err.response.data.error });
                });
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
                                {signupError.firstName && <p className="text-danger">{signupError.firstName}</p>}
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
                                {signupError.lastName && <p className="text-danger">{signupError.lastName}</p>}
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
                                {signupError.phoneNumber && <p className="text-danger">{signupError.phoneNumber}</p>}
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
                                {signupError.cnic && <p className="text-danger">{signupError.cnic}</p>}
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
                                {signupError.email && <p className="text-danger">{signupError.email}</p>}
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
                                {signupError.username && <p className="text-danger">{signupError.username}</p>}
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
                                {signupError.password && <p className="text-danger">{signupError.password}</p>}
                            </div>
                        </div>
                    </div>
                    {/* Display server error */}
                    {signupError.serverError && <p className="text-danger text-center">{signupError.serverError}</p>}
                    <button type="submit" className="btn btn-primary btn-block w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;

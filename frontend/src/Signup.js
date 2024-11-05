import React, { useState } from 'react';
import './Signup.css';
import SignUpValidation from './SignUpValidation';

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
        setSignupError(SignUpValidation(signup_values));
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
                                <label htmlFor="id"><strong>ID</strong></label>
                                <input type="text" className="form-control mb-3 dark-outline" id="id" placeholder="Enter ID" name="id" onChange={handleInput} />
                                {signup_error.id && <p className="text-danger">{signup_error.id}</p>}
                            </div>
                           
                            <div className="form-group">
                                <label htmlFor="lastName"><strong>Last Name</strong></label>
                                <input type="text" className="form-control mb-3 dark-outline" id="lastName" placeholder="Enter Last Name" name="lastName" onChange={handleInput} />
                                {signup_error.lastName && <p className="text-danger">{signup_error.lastName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
                                <input type="tel" className="form-control mb-3 dark-outline" id="phoneNumber" placeholder="Enter Phone Number" name="phoneNumber" onChange={handleInput}/>
                                {signup_error.phoneNumber && <p className="text-danger">{signup_error.phoneNumber}</p>}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="right-section">
                            <div className="form-group">
                                <label htmlFor="cnic"><strong>CNIC</strong></label>
                                <input type="text" className="form-control mb-3 dark-outline" id="cnic" placeholder="Enter CNIC" name="cnic" onChange={handleInput} />
                                {signup_error.cnic && <p className="text-danger">{signup_error.cnic}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><strong>Email</strong></label>
                                <input type="email" className="form-control mb-3 dark-outline" id="email" placeholder="Enter Email" name="email" onChange={handleInput} />
                                {signup_error.email && <p className="text-danger">{signup_error.email}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="username"><strong>Username</strong></label>
                                <input type="text" className="form-control mb-3 dark-outline" id="username" placeholder="Enter Username" name="username" onChange={handleInput} />
                                {signup_error.username && <p className="text-danger">{signup_error.username}</p>}
                            </div>
                            
                        </div>
                        <div className="form-group ">
                                <label htmlFor="password"><strong>Password</strong></label>
                                <input type="password" className="form-control mb-3 dark-outline" id="password" placeholder="Enter Password" name="password" onChange={handleInput} />
                                {signup_error.password && <p className="text-danger">{signup_error.password}</p>}
                            </div>

                        <div className=""></div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;

// File: Login.js
import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [loginValues, setLoginValues] = useState({
        username: '',
        password: ''
    });
    const [loginError, setLoginError] = useState({});
    const navigate = useNavigate();

    // Handle input change
    const handleInput = (event) => {
        const { name, value } = event.target;
        setLoginValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Perform validation (e.g., check for empty fields)
        const errors = {};
        if (!loginValues.username) errors.username = "Username is required";
        if (!loginValues.password) errors.password = "Password is required";

        setLoginError(errors);

        // Proceed if there are no validation errors
        if (Object.keys(errors).length === 0) {
            axios.post('http://localhost:8080/api/login', loginValues)
                .then(res => {
                    // Handle successful login, e.g., save token and redirect
                    navigate('/dashboard'); // Redirect on successful login
                })
                .catch(err => {
                    console.error(err);
                    setLoginError({ auth: "Invalid username or password" });
                });
        }
    };

    return (
        <div className='login-container d-flex justify-content-center align-items-center'>
            <div className="login-form bg-white p-3 rounded dark-outline">
                <form onSubmit={handleSubmit}>
                    <h1 className='text-center'>Login</h1>
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
                        {loginError.username && <p className="text-danger">{loginError.username}</p>}
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
                        {loginError.password && <p className="text-danger">{loginError.password}</p>}
                    </div>
                    {loginError.auth && <p className="text-danger text-center">{loginError.auth}</p>}
                    <button type="submit" className="btn btn-primary btn-block w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

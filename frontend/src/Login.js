import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        // Check if the user is already logged in
        axios.get('http://localhost:8080', { withCredentials: true })
            .then(res => {
                if (res.data.login) {
                    setLoginError({ auth: "You are already logged in. Please logout first." });
                    navigate('/dashboard');
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, [navigate]);

    const handleInput = (event) => {
        const { name, value } = event.target;
        setLoginValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (loginError.auth === "You are already logged in. Please logout first.") {
            return;
        }

        const errors = {};
        if (!loginValues.username) errors.username = "Username is required";
        if (!loginValues.password) errors.password = "Password is required";

        setLoginError(errors);

        if (Object.keys(errors).length === 0) {
            axios.post('http://localhost:8080/api/login', loginValues, { withCredentials: true })
                .then(res => {
                    if (res.data.login === true) {
                        navigate('/dashboard');
                    }
                })
                .catch(err => {
                    const errorResponse = err.response.data;
                    setLoginError({
                        username: errorResponse.username_error,
                        password: errorResponse.password_error,
                        auth: false
                    });
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
                    {loginError.auth && <p className="text-danger">{loginError.auth}</p>}
                    <button type="submit" className="btn btn-primary btn-block w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

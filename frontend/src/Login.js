import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import LoginValidation from './LoginValidation';

function Login() {

const [values,Setvalues]= useState({
        username: '',
        password: ''
    
});

const handleInput=(event)=>{
Setvalues(prev=>({...prev,[event.target.name]:[event.target.value]}));
}
const handleSubmit=(event)=>
{
event.preventDefault();
Setvalues(LoginValidation(values))

}


    return (
        <div className='d-flex justify-content-center align-items-center bg-white vh-100'>
            <div className="bg-white p-3 rounded w-25 dark-outline">
                <form action="" onSubmit={handleSubmit}> 
                    <h1 className='text-center'>Login</h1>
                    <div className="form-group">
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type="text" onChange={handleInput} className="form-control mb-3 dark-outline" id="username" placeholder="Enter Username" name="username" />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" onChange={handleInput} className="form-control" id="password" placeholder="Enter Password" name="password" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-3 w-100">Login</button>
                    <Link to="/signup" className="text-center mb-3">Don't have an account? Register</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
import React from 'react';
import './Signup.css';

function Signup() {
    return (
        <div className='d-flex justify-content-center align-items-center bg-white vh-100'>
            <div className="bg-white p-3 rounded w-25 dark-outline justify-content-center align-items-center">
                <form>
                    <h1 className='text-center'>Register</h1>
                    <div className="form-group">
                        <label htmlFor="id"><strong>ID</strong></label>
                        <input type="text" className="form-control mb-3 dark-outline" id="id" placeholder="Enter ID" name="id" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName"><strong>First Name</strong></label>
                        <input type="text" className="form-control mb-3 dark-outline" id="firstName" placeholder="Enter First Name" name="firstName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <input type="text" className="form-control mb-3 dark-outline" id="lastName" placeholder="Enter Last Name" name="lastName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
                        <input type="tel" className="form-control mb-3 dark-outline" id="phoneNumber" placeholder="Enter Phone Number" name="phoneNumber" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cnic"><strong>CNIC</strong></label>
                        <input type="text" className="form-control mb-3 dark-outline" id="cnic" placeholder="Enter CNIC" name="cnic" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" className="form-control mb-3 dark-outline" id="email" placeholder="Enter Email" name="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userName"><strong>Username</strong></label>
                        <input type="text" className="form-control mb-3 dark-outline" id="userName" placeholder="Enter Username" name="userName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" className="form-control mb-3 dark-outline" id="password" placeholder="Enter Password" name="password" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
const express = require('express');
const router = express.Router();

// Importing all the controllers
const {
    signup,
    login,
    logout,
    createVM,
    deleteVM,
    dashboard_data,
    deleteDisk,
    adminSignup,
    adminLogin,
    adminLogout,
    fetchAdminData,
    updateUser,
    deleteUser,
    createUser,
    updateVm
} = require('../controller/taskController');

// User routes
router.post('/signup', signup); // Route for user signup
router.post('/login', login); // Route for user login

router.post('/logout', logout); // Route for user logout
router.post('/admin_logout', logout); // Route for admin logout

// VM routes
router.post('/create_vm', createVM); // Route for creating a VM
router.delete('/delete_vm/:vmid', deleteVM); // Route for deleting a VM by ID
router.delete('/delete_Disk/:Diskid', deleteDisk); // Route for deleting a Disk by ID

// Task routes
router.get('/dashboard_data', dashboard_data); // Route for fetching dashboard data

// Test route to check if the server is running
router.get('/test', (req, res) => {
    res.send('Test route is working.');
});

// Route to check authentication
router.get('/check_auth', (req, res) => {
    if (req.session && req.session.uId) {
        console.log(`The authenticated user ID is ${req.session.uId}`);
        res.json({
            login: true,
            username: req.session.username,
            userType: req.session.userType,
            userId: req.session.uId
        });
    } else {
        res.status(401).json({ login: false });
    }
});

// Admin user management routes
router.put('/update_user/:userId', updateUser); // Route for updating a user by ID
router.delete('/delete_user/:userId', deleteUser); // Route for deleting a user by ID
router.put('/update_vm/:vmId', updateVm); // Route for updating a VM by ID
router.post('/create_user', createUser); // Route for creating a user

// Route for getting the admin dashboard data
router.get('/admin_dashboard_data', fetchAdminData);

// Admin authentication routes
router.post('/admin_signup', adminSignup); // Route for admin signup
router.post('/admin_login', adminLogin); // Route for admin login

module.exports = router;

/**
 * @fileoverview This file contains the routes for the application.
 *
 * @summary
 * This file contains the routes for the application. It handles the following
 * routes: user signup, user login, user logout, create VM, delete VM, delete Disk,
 * fetch dashboard data, update user, delete user, create user, update VM,
 * admin signup, admin login, admin logout and fetch admin dashboard data.
 *
 * @workflow
 * 1. User signup: The user enters the required details and the server
 *    creates a new user and sends a response.
 * 2. User login: The user enters the login credentials and the server verifies
 *    the credentials and sends a response.
 * 3. User logout: The user logs out and the server clears the session.
 * 4. Create VM: The user provides the required details and the server creates a
 *    new VM and sends a response.
 * 5. Delete VM: The user provides the VM ID and the server deletes the VM and
 *    sends a response.
 * 6. Delete Disk: The user provides the Disk ID and the server deletes the Disk
 *    and sends a response.
 * 7. Fetch dashboard data: The server fetches the dashboard data for the user
 *    and sends a response.
 * 8. Update user: The user provides the updated details and the server updates
 *    the user and sends a response.
 * 9. Delete user: The user provides the user ID and the server deletes the user
 *    and sends a response.
 * 10. Create user: The user provides the required details and the server creates
 *     a new user and sends a response.
 * 11. Update VM: The user provides the updated details and the server updates
 *     the VM and sends a response.
 * 12. Admin signup: The admin provides the required details and the server
 *     creates a new admin and sends a response.
 * 13. Admin login: The admin provides the login credentials and the server
 *     verifies the credentials and sends a response.
 * 14. Admin logout: The admin logs out and the server clears the session.
 * 15. Fetch admin dashboard data: The server fetches the dashboard data for the
 *     admin and sends a response.
 *
 * @requires express
 * @requires ../controller/taskController
 */


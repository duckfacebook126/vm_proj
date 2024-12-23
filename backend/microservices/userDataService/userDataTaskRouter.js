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
} = require('../../controller/taskController');


let sessionData; 
// User routes

router.put('/update_vm/:vmId', updateVm); // Route for updating a VM by ID


router.post('/create_vm', createVM); // Route for creating a VM
router.delete('/delete_vm/:vmid', deleteVM); // Route for deleting a VM by ID
router.delete('/delete_Disk/:Diskid', deleteDisk); // Route for deleting a Disk by ID
router.put('/update_vm/:vmId', updateVm); // Route for updating a VM by ID
router.get('/dashboard_data', dashboard_data);

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

// Route to receive and set session data from Login service
router.post('/get_auth', async (req, res) => {
    try {
        const sessionData = req.body;
        console.log('Received session data in UserData service:', sessionData);

        // Validate session data
        if (!sessionData || !sessionData.username || !sessionData.uId) {
            console.error('Invalid session data received:', sessionData);
            return res.status(400).json({ 
                error: 'Invalid session data',
                received: sessionData 
            });
        }

        // Create a Promise wrapper for session operations
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
                if (err) {
                    console.error('Session regeneration error:', err);
                    reject(err);
                    return;
                }

                // Set session data
                req.session.username = sessionData.username;
                req.session.uId = sessionData.uId;
                req.session.userType = sessionData.userType;

                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });

        console.log('Session successfully set in UserData service:', {
            username: req.session.username,
            uId: req.session.uId,
            userType: req.session.userType
        });

        res.status(200).json({
            message: 'Session synchronized successfully',
            sessionId: req.sessionID,
            username: req.session.username,
            uId: req.session.uId
        });

    } catch (error) {
        console.error('Error in get_auth:', error);
        res.status(500).json({ 
            error: 'Failed to process session data',
            details: error.message 
        });
    }
});

// Route to verify session is working
router.get('/check-session', (req, res) => {
    if (req.session && req.session.username) {
        res.json({
            message: 'Session is active',
            username: req.session.username,
            uId: req.session.uId,
            userType: req.session.userType
        });
    } else {
        res.status(401).json({ error: 'No active session' });
    }
});


console.log(`hehhe her is the session data in the middle ware ${JSON.stringify(req.session)}`);

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
 * 16. The server will check and authenticate the backend requests using Yup and validation Schemas
 *
 * @requires express
 * @requires ../controller/taskController
 */

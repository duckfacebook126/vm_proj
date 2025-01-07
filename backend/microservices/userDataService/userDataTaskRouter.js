const express = require('express');
const router = express.Router();

// Global variable to store synced session data
let syncedSessionData = null;
let sessionData = null;

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

// Middleware to check and attach session data
const attachSessionData = (req, res, next) => {

    if (syncedSessionData) {
        // Update session data instead of overwriting the session object
        if (req.session) {
            req.session.username = syncedSessionData.username;
            req.session.uId = syncedSessionData.uId;
            req.session.userType = syncedSessionData.userType;
            req.session.save((err) => {
                if (err) {
                }
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
};

// Apply the middleware to routes that need session data
router.use(attachSessionData);

// User routes
router.put('/update_vm/:vmId', updateVm);

// Route for creating a VM with session check
router.post('/create_vm', (req, res, next) => {
    
    if (!req.session || !req.session.uId) {
        return res.status(401).json({ error: "Unauthorized user" });
    }
    next();
}, createVM);

router.delete('/delete_vm/:vmid', deleteVM);
router.delete('/delete_Disk/:Diskid', deleteDisk);
router.put('/update_vm/:vmId', updateVm);

// Route for dashboard data with session handling
router.get('/dashboard_data', async (req, res) => {
    try {
        console.log('Dashboard request - Session state:', {
            hasSession: !!req.session,
            sessionData: req.session,
            syncedSessionData: syncedSessionData
        });
        
        if (!req.session || !req.session.uId) {
            console.log('No session found', {
                hasSession: !!req.session,
                uId: req.session?.uId,
                cookies: req.headers.cookie
            });
            return res.status(401).json({
                error: 'Authentication required',
                authenticated: false
            });
        }
        await dashboard_data(req, res);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard data',
            details: error.message
        });
    }
});

// Route to receive and set session data from Login service
router.post('/get_auth', async (req, res) => {
    try {
        console.log('Received auth sync request. Body:', req.body);
        console.log('Current session before sync:', {
            hasSession: !!req.session,
            sessionData: req.session,
            receivedSessionID: req.body.sessionID,
            currentSessionID: req.sessionID
        });

        const sessionData = req.body;
        
        // Validate session data
        if (!sessionData || !sessionData.username || !sessionData.uId) {
            console.error('Invalid session data received:', sessionData);
            return res.status(400).json({ 
                message: 'Invalid session data',
                synced: false
            });
        }

        // Store the session data globally
        syncedSessionData = {
            username: sessionData.username,
            uId: sessionData.uId,
            userType: sessionData.userType,
            sessionID: sessionData.sessionID
        };

        // Also set it in the current session
        if (req.session) {
            req.session.username = sessionData.username;
            req.session.uId = sessionData.uId;
            req.session.userType = sessionData.userType;
            
            await new Promise((resolve, reject) => {
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        reject(err);
                    } else {
                        console.log('Session saved successfully');
                        resolve();
                    }
                });
            });
        }

        console.log('Session after sync:', {
            hasSession: !!req.session,
            sessionData: req.session,
            sessionID: req.sessionID
        });

        res.json({ 
            message: 'Session data synced successfully',
            synced: true,
            sessionID: req.sessionID
        });
    } catch (error) {
        console.error('Auth sync error:', error);
        res.status(500).json({ 
            message: 'Failed to sync session data',
            synced: false,
            error: error.message
        });
    }
});


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

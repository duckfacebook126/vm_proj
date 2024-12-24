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

// Middleware to check and attach session data
const attachSessionData = (req, res, next) => {
    if (syncedSessionData) {
        // Attach the synced session data to the request
        req.session = {
            username: syncedSessionData.username,
            uId: syncedSessionData.uId,
            userType: syncedSessionData.userType
        };
        console.log('Session data attached to request:', req.session);
    } else {
        console.log('No synced session data available');
    }
    next();
};

// Apply the middleware to routes that need session data
router.use(attachSessionData);

let sessionData; 
// User routes

router.put('/update_vm/:vmId', updateVm); // Route for updating a VM by ID


router.post('/create_vm', createVM); // Route for creating a VM
router.delete('/delete_vm/:vmid', deleteVM); // Route for deleting a VM by ID
router.delete('/delete_Disk/:Diskid', deleteDisk); // Route for deleting a Disk by ID
router.put('/update_vm/:vmId', updateVm); // Route for updating a VM by ID

// Route for dashboard data with session handling
router.get('/dashboard_data', async (req, res) => {
    try {
        console.log('Accessing dashboard with session:', req.session);
        
        if (!req.session || !req.session.uId) {
            return res.status(401).json({
                error: 'Authentication required',
                authenticated: false
            });
        }

        // Forward to dashboard_data with session
        await dashboard_data(req, res);
    }
     catch (error)
     {
        console.error('Error in dashboard route:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard data',
            details: error.message
        });
    }
});

// Route to receive and set session data from Login service
router.post('/get_auth', async (req, res) => {
    try {

        //get the req body from the Login service  from the syncmiddlwaresession  function
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
            userType: sessionData.userType
        };

        console.log('Session data stored:', syncedSessionData);

        res.status(200).json({
            message: 'Session data received and stored',
            synced: true,
            sessionData: syncedSessionData
        });

    } catch (error) {
        console.error('Error in get_auth:', error);
        res.status(500).json({ 
            error: 'Failed to process session data',
            synced: false
        });
    }
});

let syncedSessionData;

const sendtToTaksouter=async()=>{


    try{

        const response=await axios.post('http://localhost:8083/api',sessionData,{withCredentials:true})

    }
    catch(eror)
    {



    }

}

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

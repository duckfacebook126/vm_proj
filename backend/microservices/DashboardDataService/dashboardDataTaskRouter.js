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

// User routes


// Route to check authentication
router.get('/check_auth', (req, res) => {
    if (req.session &&req.session.uId ) {
        console.log(`The authenticated user requesting dashbaord data is ${req.session.uId}`);
        res.json({
            login: true,
            username: req.session.username,
            userType: req.session.userType,
            userId:   req.session.uId
        });

    } 
    else {
        res.status(401).json({ login: false });

        console.log(`session authentication failed from the dashboard authentication check: ${req.session}`);
    }
});


// get the dahsbaord data form the database
router.get('/dashboard_data', dashboard_data);

console.log(`hehhe her is the session data in the middle ware ${JSON.stringify(req.session)}`);

module.exports = router;

/** 
 * 
 * 
 * 
 *
 * 
 * 
 * 
 * */


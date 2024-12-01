const express = require('express');
const router = express.Router();

// Importing all the controllers
const { signup, login, logout, createVM, deleteVM, dashboard_data, deleteDisk, adminSignup, adminLogin, adminLogout, fetchAdminData, updateUser, deleteUser, createUser,updateVm } = require('../controller/taskController');

// User routes
router.post('/signup', signup);
router.post('/login', login);

router.post('/logout', logout);
router.post('/admin_logout', adminLogout);

// VM routes
router.post('/create_vm', createVM);

// Dashboard route with checkAuth middleware


router.delete('/delete_vm/:vmid', deleteVM);
router.delete('/delete_Disk/:Diskid', deleteDisk);

// Task routes
router.get('/dashboard_data', dashboard_data);

router.get('/test', (req, res) => {
    res.send('Test route is working.');
});

// Add this route
router.get('/check_auth', (req, res) => {
    if (req.session && req.session.uId) {
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
router.put('/update_user/:userId', updateUser);
router.delete('/delete_user/:userId', deleteUser);

router.put('/update_vm/:vmId', updateVm);

router.post('/create_user',createUser)

// route for getting the admin dashboard data

router.get('/admin_dashboard_data', fetchAdminData);

router.post('/admin_signup', adminSignup);
router.post('/admin_login', adminLogin);

module.exports = router;
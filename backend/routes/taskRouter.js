const express = require('express');
const router = express.Router();
const { signup, login, logout, createVM, deleteVM, dashboard_data, deleteDisk, adminSignup,adminLogin,adminLogout } = require('../controller/taskController');

// User routes
router.post('/signup', signup);
router.post('/login', login);

router.post('/logout', logout);
router.post('/admin_logout', adminLogout);



router.post('/create_vm', createVM);

// Dashboard route with checkAuth middleware


router.delete('/delete_vm/:vmid', deleteVM);
router.delete('/delete_Disk/:Diskid', deleteDisk);

// Task routes
router.get('/dashboard_data', dashboard_data);

router.get('/test', (req, res) => {
    res.send('Test route is working.');
});

router.post('/admin_signup', adminSignup);
router.post('/admin_login', adminLogin);

module.exports = router;
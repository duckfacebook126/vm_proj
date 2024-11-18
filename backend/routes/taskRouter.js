
const express = require('express');
const router = express.Router();
const { signup, login, logout, createVM,deleteVM, dashboard_data, deleteDisk} = require('../controller/taskController');
const  checkAuth  = require('./auth');
const  checkAuth2  = require('./auth2');
console.log('checkAuth:', checkAuth);

// User routes
router.post('/signup', signup);
router.post('/login', login);

router.post('/logout', logout);
router.post('/create_vm',createVM);

// Dashboard route with checkAuth middleware


router.delete('/delete_vm/:vmid',deleteVM);
router.delete('/delete_Disk/:Diskid',deleteDisk);

// Task routes
router.get('/dashboard_data',dashboard_data);

router.get('/test', (req, res) => {
    res.send('Test route is working.');
});

module.exports = router;
// File: routes/taskRouter.js
const express = require('express');
const router = express.Router();
const { signup, login, logout,createVM, dashboard_data } = require('../controller/taskController');
const checkAuth = require('../controller/Auth'); // Import the auth middleware
// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', checkAuth, (req, res) => {  res.send('Welcome to the Dashboard!');

 });

 router.post('/create_vm',createVM);

// router.post('/create_vm',add_vm);
// Task routes

router.get('/dashboard_data', checkAuth, dashboard_data);

module.exports = router;

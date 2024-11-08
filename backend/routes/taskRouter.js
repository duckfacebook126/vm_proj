// File: routes/taskRouter.js
const express = require('express');
const router = express.Router();
const { signup, login, add_vm,createTask, fetchAllTasks, fetchTaskById, updateTaskById, deleteTaskById } = require('../controller/taskController');

// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/create_vm',add_vm);
// Task routes
router.get('/tasks', fetchAllTasks);
router.get('/tasks/:id', fetchTaskById);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTaskById);
router.delete('/tasks/:id', deleteTaskById);

module.exports = router;

// taskRouter.js
const express = require('express');
const router = express.Router();
const { fetchAlltasks, fetchTaskById, signup, updateTaskById, deleteTaskById } = require('../controller/taskController');

// Routes
router.get('/tasks', fetchAlltasks);              // Fetch all tasks
router.get('/tasks/:id', fetchTaskById);          // Fetch a task by ID
router.post('/signup', signup);               // Create a new task
router.put('/tasks/:id', updateTaskById);         // Update a task by ID
router.delete('/tasks/:id', deleteTaskById);      // Delete a task by ID

module.exports = router;

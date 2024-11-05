const express =require('express');
const router= express.Router();
const{fetchAlltasks, fetchTaskById, createtask, updateTaskById, deleteTaskById} = require('../controller/taskController');
//get request
//get all tasks
router.get('/tasks',fetchAlltasks);
///get task by id
router.get('/:id',fetchTaskById);
// create task
router.get('/test', (req, res) => {
    res.send('Hello from taskRouter!');
});

router.post('/create',createtask);
//update byid

router.put('/:id',updateTaskById);

//delete taks by id

router.delete('/:id',deleteTaskById);

module.exports=router;
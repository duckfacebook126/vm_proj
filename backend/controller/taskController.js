
const db =require('../db');
// Creating tasks in the databse
const createtask = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { task_name, is_done } = req.body;
        const query = 'INSERT INTO tasks (task_name, is_done) VALUES(?, ?)';
        const [result] = await conn.execute(query, [task_name, is_done]);
        console.log('Task created with ID:', result.insertId);
        res.status(201).json({ data: 'Task created successfully' });
    } catch (error) {
        console.log('Failed to create task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    } finally {
        if (conn) conn.release(); // Only release if conn is defined
    }
};

const fetchAlltasks = async (req, res) => {
    // let conn;
    // try {
    //     conn = await db.getConnection();
    //     const query = 'SELECT * FROM tasks';
    //     const [rows] = await conn.execute(query);
    //     res.status(200).json({ data: rows });
    // } catch (error) {
    //     console.log('Failed to fetch task:', error);
    //     res.status(500).json({ error: 'Failed to fetch tasks' });
    // } finally {
    //     if (conn) conn.release(); // Only release if conn is defined
    // }  

    res.send('alltasks fetched');
};





const fetchTaskById=(req, res)=>
{



}

const deleteTaskById=(req, res)=>
    {
    
    
        
    }

    const updateTaskById=(req, res)=>
        {
        
           

            
        }


module.exports={

    createtask,
    fetchAlltasks,
    fetchTaskById ,
    deleteTaskById,
    updateTaskById

}
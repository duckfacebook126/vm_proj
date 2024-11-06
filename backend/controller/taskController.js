
const db =require('../db');
// Creating tasks in the databse
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();

        // Extracting fields from req.body
        const { cnic, firstName, lastName, phoneNumber, username, email, password } = req.body;
        
        // Generating user_id
        const id = cnic + '4';

        // SQL query with placeholders for prepared statements
        const query = 'INSERT INTO users (user_id, first_name, last_name, cnic, phone_no, username, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        // Executing the query with actual values
        const [result] = await conn.execute(query, [id, firstName, lastName, cnic, phoneNumber, username, email, password]);
        
        // Logging the result and sending response
        console.log('User created with ID:', result.insertId);
        res.status(201).json({ data: 'User created successfully' });
    } catch (error) {
        // Detailed error logging
        console.error('Failed to create user:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to create user' });
    } finally {
        // Releasing the connection if defined
        if (conn) conn.release();
    }
};


const fetchAlltasks = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = 'SELECT * FROM tasks';
        const [rows] = await conn.execute(query);
        res.status(200).json({ data: rows });
    } catch (error) {
        console.log('Failed to fetch task:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    } finally {
        if (conn) conn.release(); // Only release if conn is defined
    }  
};





const fetchTaskById = async (req, res) => {
    let conn;
    try {
        const id = parseInt(req.params.id); // Parse ID from URL params
        conn = await db.getConnection(); // Get a database connection

        // Corrected SQL query with parameterized input
        const query = 'SELECT * FROM tasks WHERE id = ?';
        const [rows] = await conn.execute(query, [id]);

        // Check if the task with the given ID exists
        if (rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ data: rows[0] }); // Return the task data
    } catch (error) {
        console.error('Failed to fetch task by ID:', error);
        res.status(500).json({ error: "Failed to get task" });
    } finally {
        if (conn) conn.release(); // Only release if conn is defined
    }
};

const deleteTaskById=async (req, res)=>
    {
    
        let conn;
        try {
            const id = parseInt(req.params.id);
            conn = await db.getConnection();
    
            // Corrected SQL query without the extra comma
            const query = "DELETE FROM tasks WHERE id = ?";
            const [result] = await conn.execute(query,[id]);
    
            // Check if any rows were updated
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Task not found or no changes made" });
            }
    
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("Failed to update task:", error);
            res.status(500).json({ error: "Cannot delete task by id" });
        } finally {
            if (conn) conn.release();
        }
        
    }

    const updateTaskById = async (req, res) => {
        let conn;
        try {
            const id = parseInt(req.params.id);
            const { task_name, is_done } = req.body;
            conn = await db.getConnection();
    
            // Corrected SQL query without the extra comma
            const query = "UPDATE tasks SET task_name = ?, is_done = ?, updated_at = ? WHERE id = ?";
            const [result] = await conn.execute(query, [task_name, is_done, new Date(), id]);
    
            // Check if any rows were updated
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Task not found or no changes made" });
            }
    
            res.status(200).json({ message: "Task updated successfully" });
        } catch (error) {
            console.error("Failed to update task:", error);
            res.status(500).json({ error: "Cannot update task by id" });
        } finally {
            if (conn) conn.release();
        }
    };

module.exports={

    signup,
    fetchAlltasks,
    fetchTaskById ,
    deleteTaskById,
    updateTaskById

}
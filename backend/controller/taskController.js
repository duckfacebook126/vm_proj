// File: controller/taskController.js
const db = require('../db');

// Signup Function
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { cnic, firstName, lastName, phoneNumber, username, email, password } = req.body;
        const id = cnic + '4';
        const query = 'INSERT INTO users (user_id, first_name, last_name, cnic, phone_no, username, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await conn.execute(query, [id, firstName, lastName, cnic, phoneNumber, username, email, password]);
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    } finally {
        if (conn) conn.release();
    }
};

// Login Function
const login = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const [rows] = await conn.execute(query, [username, password]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Login failed' });
    } finally {
        if (conn) conn.release();
    }
};

// Task Functions (existing functions remain unchanged)
const createTask = async (req, res) => { /* Function code remains the same */ };
const fetchAllTasks = async (req, res) => { /* Function code remains the same */ };
const fetchTaskById = async (req, res) => { /* Function code remains the same */ };
const deleteTaskById = async (req, res) => { /* Function code remains the same */ };
const updateTaskById = async (req, res) => { /* Function code remains the same */ };

module.exports = {
    signup,
    login,
    createTask,
    fetchAllTasks,
    fetchTaskById,
    deleteTaskById,
    updateTaskById
};

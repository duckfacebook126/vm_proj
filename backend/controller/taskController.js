// File: controller/taskController.js
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
// Signup user Function
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const {   cnic,
            firstName,
            lastName,
            phoneNumber,
            username,
            email,
            password} = req.body;
        const id = uuidv4();
        const query = 'INSERT INTO users (cnic, firstName, lastName, phoneNumber, username, email, password ) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await conn.execute(query,         [cnic, firstName,lastName,phoneNumber,username,email,password ]);
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    } finally {
        if (conn) conn.release();
    }
};
///creating a VM
const add_vm = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();  // Start transaction

        const { 
            osName,
            vmName,
            cpuCores,
            cpuCount,
            diskFlavor,
            ram,
            diskSize,
            diskName
        } = req.body;

        const user_id = null;
        const os_id = null;
        const vm_id = null;
        const disk_id = null;
        const disk_flavor_id = null;

        // Insert into operating_system table
        const query1 = 'INSERT INTO operating_system (id, name) VALUES (?, ?)';
        await conn.execute(query1, [os_id, osName]);

        // Insert into virtual_machine table
        const query2 = 'INSERT INTO virtual_machine (id, name, ram, cpu, cores, osId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await conn.execute(query2, [vm_id, vmName, ram, cpuCount, cpuCores, os_id, ]);

        // Insert into disk_flavor table
        const query3 = 'INSERT INTO disk_flavor (id, diskFlavor) VALUES (?, ?)';
        await conn.execute(query3, [disk_flavor_id, diskFlavor]);

        // Insert into disk table
        const query4 = 'INSERT INTO disk (id, name, size, virtual_machine_id, flavor) VALUES (?, ?, ?, ?, ?)';
        await conn.execute(query4, [disk_id, diskName, diskSize, vm_id, disk_flavor_id]);

        await conn.commit();  // Commit transaction
        res.status(201).json({ message: 'VM created successfully' });
    } catch (error) {
        if (conn) await conn.rollback();  // Rollback transaction on error
        console.error('Failed to create VM:', error);
        res.status(500).json({ error: 'Failed to create VM' });
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
    updateTaskById,
    add_vm
};

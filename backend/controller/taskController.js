const db = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Signup Function
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { cnic, firstName, lastName, phoneNumber, username, email, password } = req.body;

        // Check for duplicate CNIC or username
        const checkQuery = 'SELECT * FROM users WHERE CNIC = ? OR userName = ?';
        const [rows] = await conn.execute(checkQuery, [cnic, username]);

        if (rows.length > 0) {
            // Determine the type of duplicate error
            let errorMsg = '';
            if (rows.some(row => row.CNIC === cnic)) {
                errorMsg = 'CNIC is already in use';
            }
            if (rows.some(row => row.userName === username)) {
                errorMsg = errorMsg ? `${errorMsg} and username is already in use` : 'Username is already in use';
            }
            return res.status(400).json({ error: errorMsg });
        }

        // Generate a unique user ID
        const id = uuidv4();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (id, firstName, lastName, phoneNumber, CNIC, email, userName, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await conn.execute(query, [id, firstName, lastName, phoneNumber, cnic, email, username, hashedPassword]);

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

        // Log the received values
        console.log('Received Username:', username);
        console.log('Received Password:', password);

        // Query to find the user by username
        const query = 'SELECT * FROM users WHERE userName = ?';
        const [rows] = await conn.execute(query, [username]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(200).json({ login: false, loginError: "Username is incorrect" });
        }

        const user = rows[0];

        // Log the user object
        console.log('User Object:', user);

        // Log the values of password and hashed password
        console.log('Stored Hashed Password:', user.password);

        // Compare the submitted password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', passwordMatch);

        if (!passwordMatch) {
            return res.status(200).json({ login: false, loginError: "Wrong password" });
        }

        // Set the session variable if password matches
        req.session.username = user.userName;
        console.log(`Session username set to: ${req.session.username}`);

        res.status(200).json({ message: "Login successful", login: true, username: req.session.username });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Login failed' });
    } finally {
        if (conn) conn.release();
    }
};

// Logout Function
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        // Clear the session cookie and destroy the session
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logout successful', login: false });
    });
};

// Create VM Function
const createVM = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { osName, vmName, cpuCores, cpuCount, diskFlavor, ram, diskSize, diskName } = req.body;
        const username = req.session.username;

        // Ensure all required fields are provided
        if (!osName || !vmName || !cpuCores || !cpuCount || !diskFlavor || !ram || !diskSize || !diskName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Fetch user ID from session username
        const userQuery = 'SELECT id FROM users WHERE userName = ?';
        const [userRows] = await conn.execute(userQuery, [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }
        const userId = userRows[0].id;

        // Insert into operating_system table if not exists
        const osQuery = 'INSERT IGNORE INTO operating_system (NAME) VALUES (?)';
        await conn.execute(osQuery, [osName]);

        // Get osId
        const osIdQuery = 'SELECT id FROM operating_system WHERE NAME = ?';
        const [osRows] = await conn.execute(osIdQuery, [osName]);
        const osId = osRows[0].id;

        // Insert into disk_flavor table if not exists
        const flavorQuery = 'INSERT IGNORE INTO disk_flavor (NAME, size) VALUES (?, ?)';
        await conn.execute(flavorQuery, [diskFlavor, diskSize]);

        // Get flavorId
        const flavorIdQuery = 'SELECT id FROM disk_flavor WHERE NAME = ?';
        const [flavorRows] = await conn.execute(flavorIdQuery, [diskFlavor]);
        const flavorId = flavorRows[0].id;

        // Insert into virtual_machine table
        const vmQuery = 'INSERT INTO virtual_machine (NAME, ram, CPU, cores, osId, userId, flavorId, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [vmResult] = await conn.execute(vmQuery, [vmName, ram, cpuCount, cpuCores, osId, userId, flavorId, diskSize]);
        const vmId = vmResult.insertId;

        // Insert into disk table
        const diskQuery = 'INSERT INTO DISK (NAME, size, flavorId, userId, vmId) VALUES (?, ?, ?, ?, ?)';
        await conn.execute(diskQuery, [diskName, diskSize, flavorId, userId, vmId]);

        res.status(201).json({ message: 'VM created successfully' });
    } catch (error) {
        console.error('Failed to create VM:', error);
        res.status(500).json({ error: 'Failed to create VM' });
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    signup,
    login,
    logout,
    createVM // Export the createVM function
};

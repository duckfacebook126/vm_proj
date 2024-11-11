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

        // Query to find the user by username
        const query = 'SELECT * FROM users WHERE userName = ?';
        const [rows] = await conn.execute(query, [username]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(404).json({ login: false, username_error: "Username does not exist" });
        }

        const user = rows[0];

        // Compare the submitted password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(404).json({ login: false, password_error: "Wrong password" });
        }

        // Set the session variables if password matches
        req.session.username = user.userName;
        req.session.uId = user.id;
        
        // Save the session
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Failed to save session' });
            }
            console.log(`Session saved. Username: ${req.session.username}, uId: ${req.session.uId}`);
            res.status(200).json({ message: "Login successful", login: true, username: req.session.username });
        });

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

        // Destructure values from req.body, using nullish coalescing to preserve falsy values
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

        // Get user ID from session
        const userId = req.session.uId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Validate required fields
        if (!osName || !vmName || !diskName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Start a transaction
        await conn.beginTransaction();

        // 1. Insert or get OS ID
        let [osRows] = await conn.execute('SELECT id FROM operating_system WHERE NAME = ?', [osName]);
        let osId;
        if (osRows.length === 0) {
            const [osResult] = await conn.execute('INSERT INTO operating_system (NAME) VALUES (?)', [osName]);
            osId = osResult.insertId;
        } else {
            osId = osRows[0].id;
        }

        // 2. Insert or get disk flavor ID
        let [flavorRows] = await conn.execute('SELECT id FROM disk_flavor WHERE NAME = ?', [diskFlavor]);
        let flavorId;
        if (flavorRows.length === 0) {
            const [flavorResult] = await conn.execute('INSERT INTO disk_flavor (NAME, size) VALUES (?, ?)', [diskFlavor, ram]);
            flavorId = flavorResult.insertId;
        } else {
            flavorId = flavorRows[0].id;
        }

        // 3. Insert into virtual_machine table
        const [vmResult] = await conn.execute(
            'INSERT INTO virtual_machine (NAME, ram, CPU, cores, osId, userId, flavorId, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [vmName, ram, cpuCount, cpuCores, osId, userId, flavorId, diskSize]
        );
        const vmId = vmResult.insertId;

        // 4. Insert into DISK table
        const [diskResult] = await conn.execute(
            'INSERT INTO DISK (NAME, size, flavorId, userId, vmId) VALUES (?, ?, ?, ?, ?)',
            [diskName, diskSize, flavorId, userId, vmId]
        );
        const diskId = diskResult.insertId;

        // Commit the transaction
        await conn.commit();

        res.status(201).json({ 
            message: 'VM created successfully', 
            vmId, 
            diskId,
            osId,
            flavorId
        });
    } catch (error) {
        if (conn) await conn.rollback();
        console.error('Failed to create VM:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (conn) conn.release();
    }
};

const dashboard_data=async (req,res)=>{


            let conn;
            try{

                const user_id= req.session.uId;
                const get_vm_by_user_id='SELECT * FROM virtual_machine WHERE'
                const vm_name=
                    conn=await  db.getConnection();
            }
            catch(err)
            {
                res.status(404).json({error:" THThe data has not been found"})
            }


}

module.exports = {
    signup,
    login,
    logout,
    createVM // Export the createVM function
};

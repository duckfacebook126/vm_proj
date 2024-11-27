const db = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Signup Function
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { cnic, firstName, lastName, phoneNumber, username, email, password } = req.body;
                const userType="Stanadard"
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

        const query = 'INSERT INTO users (id, firstName, lastName, phoneNumber, CNIC, email, userName, PASSWORD,userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
        await conn.execute(query, [id, firstName, lastName, phoneNumber, cnic, email, username, hashedPassword,userType]);

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
const notUserType="Admin";
const userType="Standard" 

        // Find admin by username
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE userName =? AND userType !=?',
            [username,notUserType]
        );

        if (users.length === 0) {
            return res.status(401).json({ login: false, error: 'Username does not exist' });
        }

        const user =users[0];
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

        if (!passwordMatch) {
            return res.status(401).json({ login: false, error: 'Wrong password' });
        }

        // Set session data
    
        req.session.username = user.userName;
        req.session.userType = userType;
        req.session.uId = user.id;
        
        // Save the session
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Failed to save session' });
            }
            console.log(`Session saved. Username: ${req.session.username}, uId: ${req.session.uId}`);
            res.status(200).json({ message: "Login successful", login: true, username: req.session.username, userId: req.session.uId, userType:req.session.userType });
        });
    
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ error: 'Login failed', login: false });
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
            return res.status(401).json({ error: "User not authenticated please login first" });
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

const dashboard_data = async (req, res) => {
    let conn;
    try {
        const userId = req.session.uId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        conn = await db.getConnection();
        
        // Get all VMs for the user with OS and flavor details
        const vmQuery = `
            SELECT vm.*, os.name as osName, df.name as flavorName 
            FROM virtual_machine vm
            JOIN operating_system os ON vm.osId = os.id
            JOIN disk_flavor df ON vm.flavorId = df.id
            WHERE vm.userId = ?
        `;
        const [vms] = await conn.execute(vmQuery, [userId]);

        // Get all disks for the user with flavor details
        const diskQuery = `
            SELECT d.*, df.name as flavorName, vm.name as vmName
            FROM disk d
            JOIN disk_flavor df ON d.flavorId = df.id
            LEFT JOIN virtual_machine vm ON d.vmId = vm.id
            WHERE d.userId = ?
        `;
        const [disks] = await conn.execute(diskQuery, [userId]);

        const userQuery= 'SELECT * FROM users';

        const [users] = await conn.execute(userQuery);

                if (users.length>0)
                {console.log(`this is the user data${users}`)}
                    else if(users.length===0)
                    {
                        console.log(' the query resulted in 0 users ');

                    }

        res.status(200).json({
            vms,
            disks,
            users,
            login: true,
        });
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    } finally {
        if (conn) conn.release();
    }
};

const deleteVM = async (req, res) => {
    let conn;
    const vmId = parseInt(req.params.vmid);
    try{
        
        conn =await db.getConnection();
        const [result] = await conn.execute('DELETE FROM virtual_machine WHERE id = ?',[vmId]);
        res.status(200).json({message:'VM deleted successfully'});
    }
    catch(error){

        res.status(500).json({error:'Failed o delete VM'});
    }
    finally{
        if(conn) conn.release();
    }

}

const deleteDisk = async (req, res) => {
    let conn;
    const DiskId = parseInt(req.params.Diskid);
    try{
        
        conn =await db.getConnection();
        const [result] = await conn.execute('DELETE FROM DISK WHERE id = ?',[DiskId]);
        res.status(200).json({message:'Disk deleted successfully'});
    }
    catch(error){

        res.status(500).json({error:'Failed to deleteDisk'});
    }


    finally{
        if(conn) conn.release();
    }

}


const adminSignup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { firstName, lastName, phoneNumber, cnic, email, username, password } = req.body;
        const userType = "Admin";
        const id = uuidv4();

        // Check if admin already exists
        const [existingAdmin] = await conn.execute(
            'SELECT * FROM users WHERE (userName = ? OR email = ? OR CNIC = ?) AND userType = ?',
            [username, email, cnic, userType]
        );

        if (existingAdmin.length > 0) {
            return res.status(400).json({
                error: 'An admin with this username, email, or CNIC already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new admin
        await conn.execute(
            'INSERT INTO users (firstName, lastName, phoneNumber, CNIC, email, userName, password, userType) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, phoneNumber, cnic, email, username, hashedPassword, userType]
        );

        res.status(201).json({ success: true, message: 'Admin user registered successfully' });
    } catch (error) {
        console.error('Admin signup error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
        if (conn) conn.release();
    }
};



const adminLogin = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { username, password } = req.body;
const notUserType="Admin";
const userType="Admin" 

        // Find admin by username
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE userName =? AND userType =?',
            [username,notUserType]
        );

        if (users.length === 0) {
            return res.status(401).json({ login: false, error: 'Username does not exist' });
        }

        const user =users[0];
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

        if (!passwordMatch) {
            return res.status(401).json({ login: false, error: 'Wrong password' });
        }

        // Set session data
    
        req.session.username = user.userName;
        req.session.userType = userType;
        req.session.uId = user.id;
        
        // Save the session
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Failed to save session' });
            }
            console.log(`Session saved. Username: ${req.session.username}, uId: ${req.session.uId}`);
            res.status(200).json({ message: "Login successful", login: true, username: req.session.username, userId: req.session.uId, userType:req.session.userType });
        });
    
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ error: 'Login failed', login: false });
    } finally {
        if (conn) conn.release();
    }
};

const userTableData=async(req,res)=>{
    let conn;

    try{

        conn = await db.getConnection();

    }

    catch(error){

        console.error('user fetching error:', error);
        res.status(500).json({ error: 'failed to fetch user data', login: false });
    }

    finally{
        if (conn) conn.release();

    }

};


const adminLogout=(req,res)=>{

    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        // Clear the session cookie and destroy the session
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logout successful', login: false });
    });

}
// Add to module exports

module.exports = {
    signup,
    login,
    logout,
    createVM,
    dashboard_data,
    deleteVM,
    deleteDisk,
    adminSignup,  
    adminLogin,
    adminLogout,
    userTableData

};
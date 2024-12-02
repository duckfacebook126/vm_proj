const db = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Signup Function
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { cnic, firstName, lastName, phoneNumber, username, email, password } = req.body;
                const userType="Standard"
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
            // insert into each users table
        const query = 'INSERT INTO users ( firstName, lastName, phoneNumber, CNIC, email, userName, PASSWORD,userType) VALUES ( ?, ?, ?, ?, ?, ?, ?,?)';
        await conn.execute(query, [ firstName, lastName, phoneNumber, cnic, email, username, hashedPassword,userType]);
            /// get all from the users
        const[user]=await conn.execute('SELECT * FROM USERS WHERE userName = ?', [username]);
            // get the user id of the first object in the array of objects
        const userId=user[0].id
            //getting the user type from the db
        const userType1=user[0].userType;

        //
        const permission='create';



   // and all the vlaues in the user_type table 

        const userTypeQuery ='INSERT INTO user_type (userId ,typeId,typeName,permission) VALUES(?,4,?,?)'
        await  conn.execute(userTypeQuery,[userId, ,userType1,permission])

        // now get from  the typeId table form the users table and insert into the permissions 
          

          


        res.status(201).json({ message: 'User created successfully' });
    }
    
    catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    } 
    
    
    finally {
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
        req.session.userType = user.userType;
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
        const adminUserType = "Admin";

        // Find admin by username and userType
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE userName = ? AND userType = ?',
            [username, adminUserType]  // Check for Admin users
        );

        if (users.length === 0) {
            return res.status(401).json({ login: false, error: 'Admin account not found' });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

        if (!passwordMatch) {
            return res.status(401).json({ login: false, error: 'Wrong password' });
        }

        // Set session data
        req.session.username = user.userName;
        req.session.userType = user.userType;  // Use the actual userType from database
        req.session.uId = user.id;
        
        // Save the session
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Failed to save session' });
            }
            console.log('Session saved:', {
                username: req.session.username,
                uId: req.session.uId,
                userType: req.session.userType
            });
            res.status(200).json({ 
                message: "Admin login successful", 
                login: true, 
                username: req.session.username, 
                userId: req.session.uId, 
                userType: req.session.userType 
            });
        });
    
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed', login: false });
    } finally {
        if (conn) {
            try {
                await conn.release();
            } catch (err) {
                console.error('Error releasing connection:', err);
            }
        }
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


///fetching adminn data nad displaying on the admin dashboard




const fetchAdminData = async (req, res) => {
    let conn;
    try {

        const{value}=req.body
        const userId= value;
        // Check if user is authenticated and is an admin
        // if (!req.session || !req.session.uId) {
        //     return res.status(401).json({ error: 'Not authenticated' });
        // }

        conn = await db.getConnection();

        // First, verify if the user is an admin
        const [adminCheck] = await conn.execute(
            'SELECT userType FROM users WHERE id = ?',
            [value]
        );

        // if (!adminCheck.length || adminCheck[0].userType !== 'Admin') {
        //     return res.status(403).json({ error: 'Not authorized as admin' });
        // }

        // Fetch users that are not admin
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE userType != "Admin"'
        );

        // Fetch all VMs
        const [vms] = await conn.execute('SELECT * FROM virtual_machine');

        // Fetch all disks
        const [disks] = await conn.execute('SELECT * FROM disk');

        res.status(200).json({
            users,
            vms,
            disks
        });
    } catch (error) {
        console.error('Error in fetchAdminData:', error);
        res.status(500).json({ 
            error: 'Failed to fetch admin data',
            details: error.message 
        });
    } finally {
        if (conn) {
            try {
                await conn.release();
            } catch (err) {
                console.error('Error releasing connection:', err);
            }
        }
    }
};

// Add to module exports

const createUser = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { firstName, lastName, phoneNumber, CNIC, email, userName, password, userType } = req.body;

        // Check for duplicate CNIC or username
        const [existingUser] = await conn.execute(
            'SELECT * FROM users WHERE CNIC = ? OR userName = ?',
            [CNIC, userName]
        );

        if (existingUser.length > 0) {
            let errorMsg = '';
            if (existingUser.some(user => user.CNIC === CNIC)) {
                errorMsg = 'CNIC is already in use';
            }
            if (existingUser.some(user => user.userName === userName)) {
                errorMsg = errorMsg ? `${errorMsg} and username is already in use` : 'Username is already in use';
            }
            return res.status(400).json({ error: errorMsg });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        

    //FIRST INERT INTO USERRS
        const query = 'INSERT INTO users (firstName, lastName, phoneNumber, CNIC, email, userName, PASSWORD, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, phoneNumber, CNIC, email, userName, hashedPassword, userType || 'Standard'];
        const [result] = await conn.execute(query, values);

        //THEN EXTRACT THE USER DATA FROM THE USERS AND EXTRACT RELEVANT DATA TO THE USER_TYPE TABLE
        const [users]=await conn.execute('SELECT * FROM USERS WHERE userName=?',[userName]);
        const userId = users[0].id;

        const userType_=users[0].userType;
        let typeId;
        let permission;

        if (userType_==='Admin')
        {
            typeId=1;
            permission='create/update/delete';
        }

        else if(userType_==='SuperUser')
        {
             typeId=2;
            permission='create/update/delete';

        }

        else if(userType_==='Premium')
            {
                 typeId=3;
                permission='create/update'
    
            }


            else if(userType_==='Standard')
                {
                     typeId=4;
                    permission='create'
        
                }
            

//insert the user typ nad id baseed on the selections

        const query2 = 'INSERT INTO user_type (userId,  typeId,  typeName,  permission) VALUES (?, ?,?,?)';
        const values2 = [userId, typeId, userType_,permission];
        const [result2] = await conn.execute(query2, values2);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    } finally {
        if (conn) conn.release();
    }
};

const updateUser = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { userId } = req.params;
        const { firstName, lastName, phoneNumber, CNIC, email,userName,userType } = req.body;
        
        // Check if user exists
        const [user] = await conn.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if CNIC is already taken by another user
       
        
        const query = 'UPDATE users SET firstName = ?, lastName = ?, phoneNumber = ?, CNIC = ?, email = ?,userName = ?,userType = ? WHERE id = ?';
        const values =                 [firstName,     lastName,     phoneNumber,     CNIC,     email,    userName,   userType,          userId];
        
        const [result] = await conn.execute(query, values);

        let typeId;
        let permission;

        if (userType==='Admin')
        {
            typeId=1;
            permission='create/update/delete';
        }

        else if(userType==='SuperUser')
        {
             typeId=2;
            permission='create/update/delete';

        }

        else if(userType==='Premium')
            {
                 typeId=3;
                permission='create/update'
    
            }


            else if(userType==='Standard')
                {
                     typeId=4;
                    permission='create'
        
                }



   //GET ALL THE USER TYPES AND THEIR PERMISSIONS
        const query1='UPDATE user_type SET typeId=?,typeName=? ,permission=? WHERE userId=?';
        const values1=[typeId,userType,permission,userId];
/// now update the diks flavor table
        const [result1]=await conn.execute(query1,values1)
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }
        
        res.status(200).json({ message: 'User updated successfully' });
    }
    
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    } 
    
    
    finally {
        if (conn) conn.release();
    }
};

const deleteUser = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { userId } = req.params;
        
        // Check if user exists
        const [user] = await conn.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Don't allow deletion of admin users
        if (user[0].userType == 'Admin') {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }
        
        const [result] = await conn.execute('DELETE FROM users WHERE id = ?', [userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    } finally {
        if (conn) conn.release();
    }
};



const updateVm = async (req, res) => {
    let conn;
    const { NAME, osName, cpu, cores, ram, size, flavorName, userType } = req.body;
    const { vmId } = req.params;

    // Validate required fields
    if (!NAME || !vmId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        conn = await db.getConnection();

        if (userType === 'Premium' || userType === 'SuperUser') {
            const query1 = 'UPDATE virtual_machine SET NAME=?, cpu=?, cores=?, ram=?, size=? WHERE id=?';
            const values1 = [
                NAME || null,           // Use null if undefined
                cpu || 1,              // Default to 1 if undefined
                cores || 2,            // Default to 2 if undefined
                ram || 2,              // Default to 2 if undefined
                size || 50,            // Default to 50 if undefined
                vmId
            ];

            const [result1] = await conn.execute(query1, values1);

            const query2='SELECT  osId from virtual_machine  WHERE id=?';
            const values2=[vmId];
            const [result2] = await conn.execute(query2, values2);
            
            const osId=result2[0].osId;


            //now insert into os table
            const query3='UPDATE operating_system SET name=? WHERE id=?';
            const values3=[osName,osId];
            const [result3] = await conn.execute(query3, values3);
            
            const query4='SELECT flavorId from virtual_machine  WHERE id=?';
            const values4=[vmId];
            const [result4] = await conn.execute(query4, values4);
            
            const flavorId=result4[0].flavorId;
                //now insert into disk flavors

                const query5='UPDATE disk_flavor SET size=? WHERE id=?';
                const values5=[size,flavorId];
                const [result5] = await conn.execute(query5, values5);
                //now insert into disks table

                const query6='UPDATE disk SET  NAME=?,size=? WHERE flavorId=?';
                const values6=[flavorName,size,flavorId];
                const [result6] = await conn.execute(query6, values6);


            if (result1.affectedRows === 0) {
                return res.status(404).json({ error: 'VM not found or no changes made due to unauthorized user' });
            }
            
            res.status(200).json({ message: 'VM updated successfully' });
        } 
        
        else {
            res.status(403).json({ error: 'Unauthorized: Only Premium or SuperUser can update VMs' });
        }

    } catch (error) {
        console.error('Error updating VM:', error);
        res.status(500).json({ error: 'Failed to update VM' });

    } finally {
        if (conn) {
            try {
                await conn.release();
            } catch (err) {
                console.error('Error releasing connection:', err);
            }
        }
    }
};




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
    userTableData,
    fetchAdminData,
    createUser,
    updateUser,
    deleteUser,
    updateVm
}
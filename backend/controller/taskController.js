const express = require('express');
const { decryptData } = require('../utils/decryption');
const db = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const crypto= require('crypto')


const {userLoginValidation, backendValidation}=require('../utils/validationMiddleWare');
const Yup= require("yup");
//import the functionns of encrypting and decrypting
const { encryptPassword, decryptPassword } = require('../utils/passwordEncryptionDecryption');
const {
    
    userLoginSchema,
    adminLoginSchema,
    adminSignupSchema,
    addVmValidationSchema,
    addUserSchema,
    userSignUpSchema
    
    
    
    
    } = require('../utils/validationSchemas');
const { ThemeProvider } = require('react-bootstrap');
const { error } = require('console');

// Signup Function
const signup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { encryptedData } = req.body;
        
        // Decrypt the incoming data
        const decryptedData = decryptData(encryptedData);

        console.log(`${decryptedData}`);
        const {
            firstName, 
            lastName, 
            phoneNumber, 
            cnic, 
            email, 
            username, 
            password,
            userType = "Standard"  // default value
        } = decryptedData;

        // Validate data types before database insertion
        const validatedData = {
            firstName: String(firstName),
            lastName: String(lastName),
            phoneNumber: BigInt(phoneNumber),
            CNIC: BigInt(cnic),
            email: String(email),
            userName: String(username),
            password: String(password),
    
            userType: String(userType)
        };





        console.log(`The encrypted data is: ${encryptedData}`);
        //validation function for backend

    // Check for validation errors
    const validationResult = await backendValidation(userSignUpSchema, {firstName,lastName,cnic,phoneNumber,email,username,password}); 

    // Check for validation errors
    if (validationResult.error) {

      console.log('Validation error:', validationResult.error); 
      return res.status(400).json({ error: validationResult.error }); 

    }
            

    console.log(`The vaidation result ${JSON.stringify(validationResult)}`);
        console.log(`thevalidation result is: ${validationResult}`);

        // Check for duplicates
        const checkQuery = 'SELECT * FROM users WHERE CNIC = ? OR userName = ?';
        const [rows] = await conn.execute(checkQuery, [validatedData.CNIC, validatedData.userName]);

        if (rows.length > 0) {
            let errorMsg = rows.some(row => row.CNIC === validatedData.CNIC) 
                ? 'CNIC is already in use' 
                : 'Username is already in use';
            return res.status(400).json({ error: errorMsg });


            }

                                                                                                                                    //using bcrypt to to hash and store the password again in the data base

                //using salt rounds 10 as  the default

        const saltRounds = 10;

//hahsing the user inpput password and saving it iniside the
        const encryptedPassword= await bcrypt.hash(validatedData.password, saltRounds);
        



        // Insert into users table
        const query = `INSERT INTO users (
            firstName, lastName, phoneNumber, CNIC, 
            email, userName, PASSWORD, userType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await conn.execute(query, [
            validatedData.firstName,
            validatedData.lastName,
            validatedData.phoneNumber,
            validatedData.CNIC,
            validatedData.email,
            validatedData.userName,
            encryptedPassword,
            validatedData.userType
        ]);

         const getCorrectUserIdQuery='SELECT * FROM users WHERE userName=?';
            const [user]= await conn.execute(getCorrectUserIdQuery,[validatedData.userName])


            const userId=user[0].id;


        // Insert into user_type table
        const userTypeQuery = `INSERT INTO user_type (
            userId, typeId, typeName, permission
        ) VALUES (?, 4, ?, ?)`;

        await conn.execute(userTypeQuery, [
            userId,
            validatedData.userType,
            'create'
        ]);

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

        conn = await db.getConnection()

    const { encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData);
    const { username, password } = decryptedData;
    console.log(`The encrypted data is: ${encryptedData}`)

    //validated data for input in data base
    const validatedData = {
        userName: String(username),
        PASSWORD: String(password)
    };


  

    // Check for validation errors
    const validationResult = await backendValidation(userLoginSchema, { username, password }); 

    // Check for validation errors
    if (validationResult.error) {

      console.log('Validation error:', validationResult.error); 
      return res.status(400).json({ error: validationResult.error }); 

    }
            

    console.log(`The vaidation result ${JSON.stringify(validationResult)}`);
            const notUserType="Admin";

        // Find user by username
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE userName =? AND userType !=?',
            [validatedData.userName,notUserType]
        );

        if (users.length === 0) {
            return res.status(401).json({ login: false, error: 'Username does not exist' });
        }


        
        const user =users[0];

            //using bcrypt to heck the  stored passwords hash with the user entered password


            //stored hashed password in the adatbase
            const hashedUserpasssword=user.PASSWORD;

            //now chwcking the paassword using using bcrypt compare
            const isPasswordMatch = await bcrypt.compare(validatedData.PASSWORD, hashedUserpasssword);

            if (!isPasswordMatch) {
                return res.status(401).json({login: false, error: 'Invalid password'});
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
    
    } 
    catch (error)
     {
        console.error('User login error:', error);
        res.status(500).json({ error: 'Login failed', login: false });
    } 
    finally {
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
        //the backend validationn before the insertion in the database
        console.log(`the add vm data is: JSON.stringify(${req.body})`);

    const validationResult = await backendValidation(addVmValidationSchema, {osName,vmName,diskName});
        if (validationResult.error) {

            console.log('Validation error:', validationResult.error); 
            return res.status(400).json({ error: validationResult.error }); 
      
          }
               
        // Get user ID from session
        const userId = req.session.uId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated please login first" });
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

//signup function for the admin
const adminSignup = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { encryptedData} = req.body;
        const userType = "Admin";
        const decryptedData = decryptData(encryptedData);
        const{

            firstName ,
            lastName,
            phoneNumber,
            cnic,
            email,
            username,
            password
        }=decryptedData;


        const validatedData = {
            firstName: String(firstName),
            lastName: String(lastName),
            phoneNumber: BigInt(phoneNumber),
            CNIC: BigInt(cnic),
            email: String(email),
            userName: String(username),
            password: String(password),
    
            userType: String(userType)
        };

        console.log (`the encrypted data fo r admin signup is: ${encryptedData}`)
        // validation before inserting in  the admin database
        const validationResult = await backendValidation(adminSignupSchema, {firstName,lastName,phoneNumber,cnic,email,username,password}); 

        // Check for validation errors
        if (validationResult.error) {
    
          console.log('Validation error:', validationResult.error); 
          return res.status(400).json({ error: validationResult.error }); 
    
        }


        // Check if admin already exists
        const [existingAdmin] = await conn.execute(
            'SELECT * FROM users WHERE (userName = ? OR email = ? OR CNIC = ?) AND userType = ?',
            [validatedData.userName, validatedData.email, validatedData.CNIC,   userType]
        );

        if (existingAdmin.length > 0) {
            return res.status(400).json({
                error: 'An admin with this username, email, or CNIC already exists'
            });
        }


    //using bcrypt to encrypt the password here


    //encrypted password
    const encryptedPassword=await bcrypt.hash(validatedData.password,10);


      

        // Insert new admin
        await conn.execute(
            'INSERT INTO users (firstName, lastName, phoneNumber, CNIC, email, userName, password, userType) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)',
            [validatedData.firstName, validatedData.lastName, validatedData.phoneNumber, validatedData.CNIC, validatedData.email, validatedData.userName, encryptedPassword, userType]
        );

        res.status(201).json({ success: true, message: 'Admin user registered successfully' });
    } catch (error) {
        console.error('Admin signup error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
        if (conn) conn.release();
    }
};

//login function fo the admin

const adminLogin = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { encryptedData} = req.body;
        const adminUserType = "Admin";


        const decryptedData = decryptData(encryptedData);
        const{username,password}=decryptedData;

//validate the types before insertion i the database
        const validatedData = {
            userName: String(username),
            PASSWORD: String(password)
        };

        //validatedata data before the database insertions
            console.log(`Ecrypted data fo admin is: ${encryptedData}`)
        const validationResult = await backendValidation(adminLoginSchema, { username, password }); 

        // Check for validation errors
        if (validationResult.error) {
    
          console.log('Validation error:', validationResult.error); 
          return res.status(400).json({ error: validationResult.error }); 
    
        }


        // Find admin by username and userType
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE userName = ? AND userType = ?',
            [validatedData.userName, adminUserType]  // Check for Admin users
        );

        if (users.length === 0) {
            return res.status(401).json({ login: false, error: 'Admin account not found' });
        }

        const user = users[0];


                //using bcrrypt to encrypt the password here

                //stored user password
        const hashedUserPassword = user.PASSWORD;

        // checking the password using bcrypt

        const isPasswordMatch= await bcrypt.compare(validatedData.PASSWORD,hashedUserPassword);
            //check if the password matches if ot return an error
                    if(isPasswordMatch)
                        
                        {
                      return res.status(401).json({error:'wrong password',});


                        }
        

      
   //

        


      

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


//logout function for admin

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

        // Check if user is authenticated and is an admin
        // if (!req.session || !req.session.uId) {
        //     return res.status(401).json({ error: 'Not authenticated' });
        // }

        conn = await db.getConnection();

        // First, verify if the user is an admin
        const [adminCheck] = await conn.execute(
            'SELECT userType FROM users WHERE id = ?',
            [1]
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


//create user by admin task controller

const createUser = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { encryptedData } = req.body;
        
        // Decrypt the incoming data
        const decryptedData = decryptData(encryptedData);
        const {
            firstName,
            lastName,
            phoneNumber,
            CNIC,
            email,
            userName,
            password,
            userType = 'Standard'
        } = decryptedData;

        // Validate data types
        const validatedData = {
            firstName: String(firstName),
            lastName: String(lastName),
            phoneNumber: BigInt(phoneNumber),
            CNIC: BigInt(CNIC),
            email: String(email),
            userName: String(userName),
            password: String(password),
            userType: String(userType)
        };



         //backend validation before inserting in the database
            console.log(`The encrypted data is: ${encryptedData}`);
        //validation function for backend
    
        // Check for validation errors
        const validationResult = await backendValidation(addUserSchema, {firstName,lastName,CNIC,phoneNumber,email,userName,password}); 
    
        // Check for validation errors
        if (validationResult.error) {
    
          console.log('Validation error:', validationResult.error); 
          return res.status(400).json({ validationError: validationResult.error }); 
    
        }

            //is the user is not admin it will not allow the user to send request
            // const userType1=req.session.userType;

            if (userType1!=='Admin')
            {

                return res.status(403).json({ error: 'Not authorized as admin' });

            }

            
        // Check for duplicates using validated data
        const [existingUser] = await conn.execute(
            'SELECT * FROM users WHERE CNIC = ? OR userName = ?',
            [validatedData.CNIC, validatedData.userName]
        );

        if (existingUser.length > 0) {
            let errorMsg = existingUser.some(user => user.CNIC === validatedData.CNIC)
                ? 'CNIC is already in use'
                : 'Username is already in use';
            return res.status(400).json({ error: errorMsg });
        }

        // Encrypt password using the utility
        const encryptedPassword = encryptPassword(validatedData.password);

        // Insert into users table
        const [result] = await conn.execute(
            'INSERT INTO users (firstName, lastName, phoneNumber, CNIC, email, userName, PASSWORD, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                validatedData.firstName,
                validatedData.lastName,
                validatedData.phoneNumber,
                validatedData.CNIC,
                validatedData.email,
                validatedData.userName,
                encryptedPassword,
                validatedData.userType
            ]
        );


        const [users]=await conn.execute('SELECT * FROM USERS WHERE userName=?',[validatedData.userName]);
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






    } 
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
     finally {
        if (conn) conn.release();
    }
};
       
//upadte use rby the admin
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

                const query5='UPDATE disk_flavor SET size=?,NAME=? WHERE id=?';
                const values5=[size,flavorName,flavorId];
                const [result5] = await conn.execute(query5, values5);
                //now insert into disks table

                const query6='UPDATE disk SET  size=? WHERE flavorId=?';
                const values6=[size,flavorId];
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
    adminLogout,
    adminLogin,
    fetchAdminData,
    createUser,
    updateUser,
    deleteUser,
    updateVm
}



/**
 * @summary
 * This module exports the controller functions for the user management API
 * 
 * @description
 * This module contains the controller functions for the user management API. The
 * functions are exported as a single object, so that they can be imported and used
 * in the routes.
 * 
 * @workflow
 * 1. The user management API receives a request to create a user.
 * 2. The create user function is called with the request body.
 * 3. The function validates the request body.
 * 4. The function creates a new user in the database.
 * 5. The function returns a response with a JSON object containing the user id.
 * 6. The user management API receives a request to login a user.
 * 7. The login function is called with the request body.
 * 8. The function validates the request body.
 * 9. The function checks if the user exists in the database.
 * 10. The function checks if the password is correct.
 * 11. The function returns a response with a JSON object containing the user id and session token.
 * 12. The user management API receives a request to logout a user.
 * 13. The logout function is called with the request body.
 * 14. The function deletes the session token from the database.
 * 15. The function returns a response with a JSON object containing a message.
 * 16. The user management API receives a request to update a user.
 * 17. The update user function is called with the request body.
 * 18. The function validates the request body.
 * 19. The function updates the user in the database.
 * 20. The function returns a response with a JSON object containing the user id.
 * 21. The user management API receives a request to delete a user.
 * 22. The delete user function is called with the request body.
 * 23. The function validates the request body.
 * 24. The function deletes the user from the database.
 * 25. The function returns a response with a JSON object containing a message.
 */

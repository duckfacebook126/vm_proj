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

           // AES ENCRYPTED PASSWORDS
     //initialization
     const encMethod = 'aes-256-cbc';//encoding method
     //actual computed key and vectors
      const key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0,32);  ///computed secret vector  
      const encIv = crypto.createHash('sha512').update(secretIv).digest('hex').substring(0,16);//computed secret initialization vector
     //encryption of the data password
      function encryptData (password) {
          const cipher = crypto.createCipheriv(encMethod, key, encIv)/// creating the cipher for encryption
          const encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex')//final encryption of the data
          return Buffer.from(encrypted).toString('base64')// returning the encypted string
      }

      // Hash password
      const hashedPassword = encryptData(password);


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

const adminLogin = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { username, password } = req.body;
const notUserType="Admin";
const userType="Standard" 

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


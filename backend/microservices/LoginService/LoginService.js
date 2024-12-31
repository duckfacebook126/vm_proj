const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios');
const taskRouter = require('./LoginTaskRouter');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Use the same session configuration across services
app.use(session({
    secret: 'your_session_secret',
    resave: true,
    saveUninitialized: false,
    cookie: { 
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'sessionId'
}));

// Middleware to sync session with UserData service
const syncWithUserData = async (req, res, next) => {
    if (req.session && req.session.username) {
        try {

            
            const response = await axios.post('http://localhost:8083/api/get_auth', {
                username: req.session.username,
                uId: req.session.uId,
                userType: req.session.userType
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': req.headers.cookie
                }
            });
            
    
            
        } catch (error) {

        }
    }
    next();
};

// Apply sync middleware after session middleware
app.use(syncWithUserData);

// Apply router after all middleware
app.use('/api', taskRouter);

app.get('/', (req, res) => {

    
    if (req.session.username) {
        res.status(200).json({ 
            login: true, 
            username: req.session.username,
            userId: req.session.uId,
            userType:req.session.userType,
            isAdmin:req.session.isAdmin
        });
    } else {
        res.status(404).json({ login: false });
    }
});

const port = 8081;
app.listen(port, () => console.log(`Login Service is running on port ${port}`));

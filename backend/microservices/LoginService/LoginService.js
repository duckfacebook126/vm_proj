const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const axios = require('axios');
const taskRouter = require('./LoginTaskRouter');
require('dotenv').config({ path: __dirname + '../../.env' });
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Use the same session configuration across services
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
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
    console.log('Sync attempt - Session data:', {
        hasSession: !!req.session,
        username: req.session?.username,
        uId: req.session?.uId,
        userType: req.session?.userType,
        sessionID: req.sessionID
    });

    if (req.session && req.session.username) {
        try {
            console.log('Sending session data to UserData service');
            const response = await axios.post(process.env.GET_AUTH_1, {
                username: req.session.username,
                uId: req.session.uId,
                userType: req.session.userType,
                sessionID: req.sessionID
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `sessionId=${req.sessionID}; ${req.headers.cookie || ''}`
                }
            });
            
            console.log('UserData service response:', response.data);
        } catch (error) {
            console.error('Sync error:', error.message);
            console.error('GET_AUTH URL:', process.env.GET_AUTH_1);
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

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

app.use(session({
    secret: 'your_session_secret',
    resave: false,
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
            await axios.post('http://localhost:8083/api/get_auth', {
                username: req.session.username,
                uId: req.session.uId,
                userType: req.session.userType
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Session synced with UserData service');
        } catch (error) {
            console.error('Failed to sync with UserData service:', error.message);
        }
    }
    next();
};

// Apply routes
app.use('/api', taskRouter);
app.use(syncWithUserData);

app.get('/', (req, res) => {
    console.log(`Session username: ${req.session.username}`);
    if (req.session.username) {
        res.status(200).json({ 
            login: true, 
            username: req.session.username,
            userId: req.session.uId,
            userType: req.session.userType,
            isAdmin: req.session.isAdmin
        });
    } else {
        res.status(404).json({ login: false });
    }
});

const port = 8081;
app.listen(port, () => console.log(`Login Service is running on port ${port}`));

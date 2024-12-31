const cors = require('cors');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const taskRouter = require('./userDataTaskRouter');

app.use(cors({
    origin: 'http://localhost:3000',  // Correct base URL
    credentials: true
}));

app.use(cookieParser());

// Use the same session configuration as LoginService
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'your_session_secret',
    resave: true,
    saveUninitialized: false,
    cookie: { 
        sameSite: 'lax',
        secure: process.env.NODE_ENV === "production", 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'sessionId'
}));

// Log all incoming requests and their session data
app.use((req, res, next) => {

    next();
});

app.use(express.json());
app.use(bodyParser.json());
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

const port = 8083;
app.listen(port, () => console.log(` User Data Service is running on port ${port}`));

// Apply session check middleware to all routes except sync-session

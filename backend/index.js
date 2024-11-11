const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const taskRouter = require('./routes/taskRouter');

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === "production", 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use('/api', taskRouter);

app.get('/', (req, res) => {
    console.log(`Session username: ${req.session.username}`);
    if (req.session.username) {
        res.json({ login: true, username: req.session.username });
    } else {
        res.json({ login: false });
    }
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));

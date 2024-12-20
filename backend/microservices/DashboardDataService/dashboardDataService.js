const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const taskRouter = require('./dashboardDataTaskRouter');

app.use(cors({
    origin: 'http://localhost:3000',  // Correct base URL
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



app.use('/api',taskRouter);

app.get('/', (req, res) => {
   
     if (req.session) {
        console.log('session Data:',req.session.uId);   
        res.status(200).json({ 
            login: true, 
            username: req.session.username,
            userId: req.session.uId,
            userType:req.session.userType,
            isAdmin:req.session.isAdmin
        });
    } else {
        res.status(404).json({ login: false });
        console.log('session Data:',req.session);  
    }
});



const port = 8083;
app.listen(port, () => console.log(`Dashboard Data Service is running on port ${port}`));


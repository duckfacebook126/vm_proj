const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const taskRouter = require('./routes/taskRouter');

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST','PUT','DELETE','PATCH'],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Change to true in production
        maxAge: 1000 * 60 * 60 * 24
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

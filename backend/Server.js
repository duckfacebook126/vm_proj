const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.get('/', (req, res) => {
    res.send('PONGGED');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const port = 8080;
app.listen(port, () => console.log(`Listening on ${port}`));
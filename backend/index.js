const express = require('express');
const app = express();
const taskRouter = require('./routes/taskRouter'); // Importing directly, no destructuring here

app.use(express.json());

app.get('/', (req, res) => {
    res.send('PONGGED');
});

app.use('/api', taskRouter); // Using the router under '/api'

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));

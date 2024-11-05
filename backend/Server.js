const express = require('express');
const app=express();

// Middleware to parse JSON request
app.get('/',(req,res)=>{
res.send('PONGGED');
});
const port=8080;

app.listen(8080,()=>console.log(`Listening on ${port}`));
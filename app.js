const express = require('express');
const app = express();
const { utilisateurs } = require('./models');
const port = 8080;

app.listen(port, ()=>{
    console.log('Server Connected');
});
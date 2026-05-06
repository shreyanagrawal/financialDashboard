require('dotenv').config
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server is running");
})
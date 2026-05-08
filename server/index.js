require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/User');
const app = express();
app.use(express.json());
app.use(cors());
const mongo_url = process.env.MONGO_URI;
mongoose.connect(mongo_url);
app.post("/api/register", async (req, res) => {
    debugger;
    try {
        const user = new UserModel(req.body); 
        if(user){
            user._id = crypto.randomUUID();
        }
        console.log(user);
        await user.save();
        return res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
const secret = process.env.JWT_SECRET;
const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log("Server is running");
})
require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = () => {
    const mongo_url = process.env.MONGO_URI;
    mongoose.connect(mongo_url);

    mongoose.connection.on("connected", ()=>{
        console.log("Connection to database is established successfully");
    });
    mongoose.connection.on("error",(err)=>{
        console.log("Error while connecting to database:"  + err);
    })
    mongoose.connection.on("disconnected",()=>{
        console.log("Database is disconnected");
    })
}

module.exports = dbConnect;

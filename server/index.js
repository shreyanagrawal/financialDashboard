require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const refreshRoute = require("./routes/refresh");
const profileRoute = require("./routes/profile");
const dbConnect = require('./utils/dbConnect');
const cookieParser = require("cookie-parser");
const plaidRoutes = require("./routes/plaid");
const manualTransactionRoutes = require("./routes/manualTransac");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:[
        "GET",
        "POST",
        "PUT",
        "DELETE"
    ],
    allowedHeaders:[
        "Content-Type",
        "Authorization"
    ]
}));
app.use("/api",authRoutes);
app.use("/api/refresh",refreshRoute)
app.use("/api/profile",profileRoute)
app.use("/api",profileRoute);
app.use("/api", plaidRoutes);
app.use("/api/manualTransac", manualTransactionRoutes);

dbConnect();

const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
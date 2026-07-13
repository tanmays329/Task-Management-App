const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());    

// test route
app.get("/", (req, res) => {
    res.send("Task Management App API is running...");
});

module.exports = app;
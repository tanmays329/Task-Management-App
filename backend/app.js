const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());      // <-- This must come BEFORE routes

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Task Management API is running...");
});

module.exports = app;
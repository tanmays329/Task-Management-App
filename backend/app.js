const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
    cors({
        origin: [
            "https://task-management-app-jvb6.onrender.com",
            "https://task-management-opu1zc87c-tanmays329s-projects.vercel.app/"
        ],
        credentials: true
    })
);
app.use(express.json());      // <-- This must come BEFORE routes

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Task Management API is running...");
});

module.exports = app;
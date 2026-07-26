const express = require("express");

const router = express.Router();

const { createTask,
        getAllTasks,
        updateTask
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createTask);
router.get("/", protect, getAllTasks);
router.put("/:id", protect, updateTask);

module.exports = router;
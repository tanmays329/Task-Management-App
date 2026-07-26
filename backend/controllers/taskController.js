const Task = require("../models/Task");

exports.createTask = async (req, res) => {
    try {

        // Get data from request body
        const { title, description, status } = req.body;

        // Validation
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        // Create Task
        const task = await Task.create({
            title,
            description,
            status,
            user: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getAllTasks = async (req, res) => {
    try {

        const tasks = await Task.find({ user: req.user.id });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateTask = async (req, res) => {
    try {

        const { id } = req.params;

        const { title, description, status } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success:false,
                message: "Task not found"
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this task"
            });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
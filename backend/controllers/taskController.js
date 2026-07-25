const Task = require("../models/Task");

exports.createTask = async (req, res) => {

    try {

        res.json({
            message: "Create Task API Working"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
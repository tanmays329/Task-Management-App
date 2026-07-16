exports.registerUser = async (req, res) => {
    try {
        console.log(req.body);

        res.status(201).json({
            success: true,
            message: "Register API is working"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
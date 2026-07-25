const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {

    try {

        let token;

        // Read token from Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];

        }

        // No token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. No Token."
            });
        }

        // Verify Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store logged-in user data
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};
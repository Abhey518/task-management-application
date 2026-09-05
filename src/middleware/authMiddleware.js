const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware - protect
// Verifies the JWT and attaches the user to req.user

const protect = async (req, res, next) => {
    try {
        // check if Authorization header exists and starts with "Bearer"
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            // grab the token part "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];

        }

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided"
            });
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded = { id: "...", role: "...", iat: ..., exp: ... }

        // check the user still exist in the DB
        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        // attach user to the request object
        req.user = user;

        // pass control to the next middleware or route handler
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Invalid token"

        });

    }
};

// Middleware - restrictTo
// Restricts access to specific roles

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires role: ${roles.join(" or ")}`
            });
        }

        next();
    };
};

module.exports = {protect, restrictTo };
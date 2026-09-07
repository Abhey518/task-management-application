const User = require("../models/User");

// GET /api/users
// Admin only - list all registered users

const getAllUsers = async (req, res) => {
    try {
        // Exclude password from the result
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });

    }
};


// GET /api/users/:id
// Admin only - get a single user by ID

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });

        }

        res.status(200).json({ 
            success: true, 
            user 
        });


    } catch (err) {

        res.status(500).json({ 
            success: false, 
            message: err.message 
        });

    }
};


module.exports = { getAllUsers, getUserById };
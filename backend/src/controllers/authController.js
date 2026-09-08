const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to sign a JWT
const signToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

};

// @route POST /api/auth/register

const register = async (req, res) => {
    try {
        // pull fields from request body
        const { username, email, password } = req.body;

        // check if email already exist
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"

            });
        }

        // create user
        const user = new User({ username, email, password });
        await user.save();

        // sign jwt
        const token = signToken(user._id, user.role);

        // return token + user info
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }

        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message

        });
    }
};

// @route POST /api/auth/login

const login = async (req, res) => {
    try {
        // pull fields from request body
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email }).select("+password");

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"

            });
        }

        // compare password
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // sign jwt
        const token = signToken(user._id, user.role);

        // return token + user info
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }

        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message

        });

    }
};

module.exports = {register, login};







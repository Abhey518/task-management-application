const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

if (!process.env.JWT_SECRET) {
    console.log("FAIL: JWT_SECRET is not defined in .env");
    process.exit(1);

}

const connectDB = require("./db");

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://taskflow-task-management-application-mu.vercel.app"

];

app.use(express.json());

app.use(cors({
    origin: allowedOrigins
}));

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
    res.json({ message: "API is running"});
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });


    } catch (err) {
        console.log(`Server startup failed: ${err.message}`);
        process.exit(1);

    }
};

startServer();
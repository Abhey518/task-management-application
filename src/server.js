const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

if (!process.env.JWT_SECRET) {
    console.log("FAIL: JWT_SECRET is not defined in .env");
    process.exit(1);

}

const connectDB = require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

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
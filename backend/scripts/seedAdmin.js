const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const User = require("../src/models/User");

const seedAdmin = async () => {
    try {
        // Connect directly to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB");

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log(`Admin already exists: ${existingAdmin.email}`);
            process.exit(0);

        }

        // Create the admin user
        await User.create({
            username: "admin",
            email: "admin@taskapp.com",
            password: "Admin@taskApp26",
            role: "admin"
        });

        console.log("Admin user created successfully!");
        console.log("  Email:    admin@taskapp.com");
        console.log("  Role:     admin");

    } catch (err) {
        console.error("Seed failed:", err.message);
        process.exit(1);

    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");

    }
};


seedAdmin();
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./src/db");

const testConnection = async () => {

    try {
        await connectDB();

        console.log("MongoDB connection test succeeded");

        process.exit(0)

    } catch (err) {
        
        console.log(`Error connecting to MongoDB: ${err.message}`);
        
        throw err;

    };
};

testConnection();
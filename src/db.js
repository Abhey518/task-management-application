const dns = require("node:dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB connected: ${conn.connection.host}`);

        return conn;

    } catch (err) {
        console.log(`Error connecting to MongoDB: ${err.message}`);
        
        throw err;

    }
};

module.exports = connectDB;
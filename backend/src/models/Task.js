const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 800
        },

        status: {
            type: String,
            enum: ["To Do", "Doing", "Done"],
            default: "To Do"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },

    {
        timestamps: true
    }

);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task; 
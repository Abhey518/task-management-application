const Task = require("../models/Task");

// GET /api/tasks

const getAllTasks = async (req, res) => {
    try {
        let query;

        if (req.user.role === "admin") {

            query = Task.find();

        } else {

            query = Task.find({
                $or: [
                    { createdBy: req.user._id },
                    { assignedTo: req.user._id}
                ]
            });

        }

        const tasks = await query
        .populate("createdBy", "username email")
        .populate("assignedTo", "username email")
        .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Get /api/tasks/:id

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        .populate("createdBy", "username email")
        .populate("assignedTo", "username email");

        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Normal users can only view their own tasks

        if(req.user.role !== "admin") {
            const isCreator = task.createdBy._id.toString() === req.user._id.toString();

            const isAssigned = task.assignedTo && task.assignedTo._id.toString() === req.user._id.toString();

            if(!isCreator && !isAssigned) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }

        res.status(200).json({
            success: true,
            task
        });


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// POST /api/tasks

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });


    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};


// PUT /api/tasks/:id

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Normal users can only update their own tasks

        if(req.user.role !== "admin") {
            if(task.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to update this task"
                });

            }
        }

        const { title, description, status } = req.body;
        
        if(title !== undefined) {
            task.title = title;
        }

        if(description !== undefined) {
            task.description = description;
        }

        if(status !== undefined) {
            task.status = status;
        }

        await task.save();

        await task.populate("createdBy", "username email");
        await task.populate("assignedTo", "username email");

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};


// PATCH /api/tasks/:id/assign

const assignTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const { assignedTo } = req.body;

        if(req.user.role === "admin") {

            // Admin can assign or reassign task to anyone
            task.assignedTo = assignedTo || null;

        } else {
            // Normal users can only assign unassigned task to themselves
            if(task.assignedTo !== null) {
                return res.status(403).json({
                    success: false,
                    message: "You can only assign tasks to yourself"
                });
            }

            task.assignedTo = req.user._id;
        }

        await task.save();

        await task.populate("createdBy", "username email");
        await task.populate("assignedTo", "username email");

        res.status(200).json({
            success: true,
            task
        });

    } catch (err) {
        res.status(400).json({
            success: true,
            message: err.message
        });

    }
};


// DELETE /api/tasks/:id

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            res.status(400).json({
                success: false,
                message: "Task not found"
            });
        }

        // Normal users can only delete tasks they created

        if(req.user.role !== "admin") {
            if(task.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to delete this task"
                });
            }
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, assignTask, deleteTask };

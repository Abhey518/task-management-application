const User = require("../models/User");
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

        const { title, description, status } = req.body;

        const userId = req.user._id.toString();
        const creatorId = task.createdBy.toString();
        const assignedUserId = task.assignedTo?.toString();
        const isAdmin = req.user.role === "admin";
        const isCreator = creatorId === userId;
        const isAssignedUser = assignedUserId === userId;
        const creatorControlsTask =
            isCreator && (!task.assignedTo || isAssignedUser);

        if (!isAdmin && !creatorControlsTask && !isAssignedUser) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this task"
            });
        }

        // An assigned non-creator may update progress only.
        if (isAssignedUser && !isCreator && !isAdmin) {
            if (title !== undefined || description !== undefined) {
                return res.status(403).json({
                    success: false,
                    message: "Assigned users can only change task status"
                });
            }

            if (status === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "A status is required"
                });
            }
        }
        
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
// Normal user only - self-assign an unassigned task

const assignTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (task.assignedTo) {
            return res.status(403).json({
                success: false,
                message: "This task is already assigned"
            });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the task creator can assign this task"
            });
        }

        task.assignedTo = req.user._id;

        await task.save();

        await task.populate("createdBy", "username email");
        await task.populate("assignedTo", "username email");

        res.status(200).json({
            success: true,
            task
        });

        
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};


// PATCH /api/tasks/:id/reassign
// Admin only - assign or reassign a task to any user (or unassign with null)

const reassignTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const { assignedTo } = req.body;

        // verify the target user actually exists
        if(assignedTo) {
            const userExists = await User.findById(assignedTo);

            if(!userExists) {
                return res.status(404).json({
                    success: false,
                    message: "Target user not found"
                });
            }
        }

        task.assignedTo = assignedTo || null;

        await task.save();

        await task.populate("createdBy", "username email");
        await task.populate("assignedTo", "username email");

        res.status(200).json({
            success: true,
            task
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};


// DELETE /api/tasks/:id

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            });
        }

        const userId = req.user._id.toString();
        const creatorId = task.createdBy.toString();
        const assignedUserId = task.assignedTo?.toString();
        const isAdmin = req.user.role === "admin";
        const isCreator = creatorId === userId;
        const creatorControlsTask =
            isCreator && (!task.assignedTo || assignedUserId === userId);

        if (!isAdmin && !creatorControlsTask) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this task"
            });
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

module.exports = { getAllTasks, getTaskById, createTask, updateTask, assignTask, reassignTask, deleteTask };

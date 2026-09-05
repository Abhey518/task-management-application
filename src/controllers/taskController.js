// const Task = require("../models/Task");

// // GET /api/tasks
// const getAllTasks = async (req, res) => {
//     try {
//         const tasks = await Task.find()
//         .populate("createdBy", "username email")
//         .populate("assignedTo", "username email");

//         res.status(200).json({ 
//             success: true,
//             count: tasks.length,
//             tasks
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }
// };
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    assignTask,
    deleteTask
} = require("../controllers/taskController");

// All task routes require authentication
router.use(protect);

router.get("/", getAllTasks);

router.post("/", createTask)

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.patch("/:id/assign", assignTask);

router.delete("/:id", deleteTask);

module.exports = router;
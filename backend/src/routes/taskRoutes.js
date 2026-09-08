const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    assignTask,
    reassignTask,
    deleteTask
} = require("../controllers/taskController");

// All task routes require authentication(login)
router.use(protect);

router.get("/", getAllTasks);

router.post("/", createTask)

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

router.patch("/:id/assign", assignTask);

// Admin-only reassignment
router.patch("/:id/reassign", restrictTo("admin"), reassignTask);

module.exports = router;
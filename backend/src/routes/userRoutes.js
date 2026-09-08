const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { getAllUsers, getUserById } = require("../controllers/userController");


// All user routes: must be logged in AND must be admin

router.use(protect);

router.use(restrictTo("admin"));

router.get("/", getAllUsers);

router.get("/:id", getUserById);

module.exports = router;
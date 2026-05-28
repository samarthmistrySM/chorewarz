const express = require("express");
const authRoutes = require("./auth.routes");
const groupRoutes = require("./group.routes");
const taskRoutes = require("./task.routes");
const memberRoutes = require("./member.routes");
const { authenticate, requireGroup } = require("../middleware/auth.middleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/groups", authenticate, groupRoutes);
router.use("/tasks", authenticate, requireGroup, taskRoutes);
router.use("/members", authenticate, requireGroup, memberRoutes);

module.exports = router;

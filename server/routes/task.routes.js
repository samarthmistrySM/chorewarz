const express = require("express");
const {
  listTasks,
  createTask,
  completeTask,
  scheduleOverview,
  seedRoute,
} = require("../controllers/task.controller");

const router = express.Router();

router.get("/", listTasks);
router.get("/schedule", scheduleOverview);
router.post("/", createTask);
router.post("/seed", seedRoute);
router.post("/:id/complete", completeTask);

module.exports = router;

const taskService = require("../services/task.service");

async function listTasks(req, res, next) {
  try {
    const { tasks, progress } = await taskService.getTasks(req.groupId);
    res.json({ tasks, progress });
  } catch (error) {
    next(error);
  }
}

async function completeTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await taskService.markTaskCompleted(req.groupId, id);
    res.json({ task, message: "Task completed and next recurrence scheduled" });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.groupId, req.body);
    res.status(201).json({ task, message: "Task created" });
  } catch (error) {
    next(error);
  }
}

async function scheduleOverview(req, res, next) {
  try {
    const schedule = await taskService.getSchedule(req.groupId);
    res.json({ schedule });
  } catch (error) {
    next(error);
  }
}

async function seedRoute(req, res, next) {
  try {
    const result = await taskService.seedData();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTasks,
  createTask,
  completeTask,
  scheduleOverview,
  seedRoute,
};

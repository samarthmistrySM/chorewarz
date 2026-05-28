const Task = require("../models/task.model");
const Member = require("../models/member.model");
const Group = require("../models/group.model");
const { generateSeedPayload } = require("../seed/seedData");
const { startOfDay, addDays, startOfWeek } = require("../lib/choreRotation");

const CATEGORY_TO_TYPE = {
  groceries: "groceries",
  cleaning: "cleaning",
  bills: "bills",
  trash: "garbage",
  water_motor: "water",
};

const DEFAULT_GROUP_SLUG = "the-crib";

async function ensureDefaultGroup() {
  let group = await Group.findOne({ slug: DEFAULT_GROUP_SLUG });
  if (!group) {
    group = await Group.create({
      name: "The Crib",
      slug: DEFAULT_GROUP_SLUG,
      createdBy: null,
    });
  }
  return group;
}

async function getTasks(groupId) {
  const now = startOfDay(new Date());
  const horizon = addDays(now, 14);
  const weekStart = startOfWeek(new Date());
  const weekEnd = addDays(weekStart, 7);

  const [tasks, weekTotal, weekCompleted] = await Promise.all([
    Task.find({
      group: groupId,
      active: true,
      completedAt: null,
      dueAt: { $lte: horizon },
    })
      .populate("owner", "name displayName color")
      .sort({ dueAt: 1 }),
    Task.countDocuments({
      group: groupId,
      dueAt: { $gte: weekStart, $lt: weekEnd },
    }),
    Task.countDocuments({
      group: groupId,
      dueAt: { $gte: weekStart, $lt: weekEnd },
      completedAt: { $ne: null },
    }),
  ]);

  const progress = weekTotal ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  return { tasks, progress };
}

async function markTaskCompleted(groupId, taskId) {
  const task = await Task.findOne({ _id: taskId, group: groupId });
  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  task.completedAt = new Date();
  await task.save();

  if (task.repeats) {
    const nextTask = new Task({
      group: groupId,
      title: task.title,
      description: task.description,
      type: task.type,
      category: task.category,
      owner: task.owner,
      intervalDays: task.intervalDays,
      assignedAt: task.dueAt,
      dueAt: addDays(task.dueAt, task.intervalDays),
      repeats: true,
    });
    await nextTask.save();
  }

  return task.populate("owner", "name displayName color");
}

async function createTask(groupId, payload) {
  const { title, ownerId, dueAt, category } = payload;

  if (!title?.trim()) {
    const error = new Error("Task title is required");
    error.status = 400;
    throw error;
  }

  if (!ownerId) {
    const error = new Error("Assignee is required");
    error.status = 400;
    throw error;
  }

  if (!dueAt) {
    const error = new Error("Due date is required");
    error.status = 400;
    throw error;
  }

  if (!CATEGORY_TO_TYPE[category]) {
    const error = new Error("Invalid category");
    error.status = 400;
    throw error;
  }

  const member = await Member.findOne({ _id: ownerId, group: groupId });
  if (!member) {
    const error = new Error("Assignee not found");
    error.status = 404;
    throw error;
  }

  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime())) {
    const error = new Error("Invalid due date");
    error.status = 400;
    throw error;
  }
  due.setHours(20, 0, 0, 0);

  const group = await Group.findById(groupId).lean();
  const groupName = group?.name ?? "your flat";
  const type = CATEGORY_TO_TYPE[category];
  const task = await Task.create({
    group: groupId,
    title: title.trim(),
    description: `Added to ${groupName} — ${category}`,
    type,
    category,
    owner: ownerId,
    intervalDays: 0,
    assignedAt: new Date(),
    dueAt: due,
    repeats: false,
    active: true,
  });

  return task.populate("owner", "name displayName color");
}

async function getSchedule(groupId) {
  const today = startOfDay(new Date());
  const windowEnd = addDays(today, 7);

  return Task.find({
    group: groupId,
    active: true,
    dueAt: { $gte: today, $lt: windowEnd },
  })
    .populate("owner", "name displayName color")
    .sort({ completedAt: 1, dueAt: 1 });
}

async function seedData(options = {}) {
  const group = await ensureDefaultGroup();
  const groupId = group._id;

  await Task.deleteMany({ group: groupId });
  await Member.deleteMany({ group: groupId });

  const { members, anchor, horizonDays, taskTemplates } =
    generateSeedPayload(options);

  const createdMembers = await Member.create(
    members.map((m) => ({ ...m, group: groupId })),
  );
  const memberByName = Object.fromEntries(
    createdMembers.map((m) => [m.name, m._id]),
  );

  const tasks = taskTemplates.map((template) => ({
    group: groupId,
    title: template.title,
    description: template.description,
    type: template.type,
    owner: memberByName[template.ownerKey],
    intervalDays: template.intervalDays,
    assignedAt: template.assignedAt,
    dueAt: template.dueAt,
    repeats: template.repeats,
    active: template.active,
  }));

  await Task.insertMany(tasks);

  return {
    seeded: true,
    groupId: groupId.toString(),
    groupSlug: group.slug,
    groupName: group.name,
    anchor: anchor.toISOString(),
    horizonDays,
    members: createdMembers.length,
    tasks: tasks.length,
    rotation: {
      garbageWaterBlockDays: 2,
      cleaningBlockDays: 14,
      cleaningSessionsPerBlock: 4,
      note: "Garbage and water share the same 2-day assignee; cleaning rotates every 14 days with 2 sessions per week.",
    },
  };
}

module.exports = {
  getTasks,
  createTask,
  markTaskCompleted,
  getSchedule,
  seedData,
  ensureDefaultGroup,
  DEFAULT_GROUP_SLUG,
};

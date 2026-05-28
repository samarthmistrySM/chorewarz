const { buildRotationTasks, startOfDay } = require("../lib/choreRotation");

const MEMBERS = [
  { name: "Samarth", displayName: "Samarth", color: "#66768d" },
  { name: "Ashray", displayName: "Ashray", color: "#3e6658" },
  { name: "Sudhanshu", displayName: "Sudhanshu", color: "#496ae8" },
  { name: "Arpan", displayName: "Arpan", color: "#ba1a1a" },
];

/**
 * Rotation rules:
 * - Garbage + water: 2 days per person, same assignee for both chores.
 * - Cleaning: 14 days per person, 2 sessions per week (4 total per block).
 * - Samarth starts garbage/water on day 1 (anchor = today).
 */
function generateSeedPayload(options = {}) {
  const anchor = options.anchor ? startOfDay(options.anchor) : startOfDay(new Date());
  const horizonDays = options.horizonDays ?? 56;
  const taskTemplates = buildRotationTasks(MEMBERS, anchor, horizonDays);

  return {
    members: MEMBERS,
    anchor,
    horizonDays,
    taskTemplates,
  };
}

module.exports = { MEMBERS, generateSeedPayload };

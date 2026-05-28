/** @typedef {{ name: string; displayName: string; color: string }} MemberSeed */

const GARBAGE_WATER_BLOCK_DAYS = 2;
const CLEANING_BLOCK_DAYS = 14;
const CLEANING_OFFSETS_IN_BLOCK = [0, 3, 7, 10]; // twice per week for two weeks

const TASK_META = {
  garbage: {
    title: "Garbage collection",
    intervalDays: GARBAGE_WATER_BLOCK_DAYS,
  },
  water: {
    title: "Water pump control",
    intervalDays: GARBAGE_WATER_BLOCK_DAYS,
  },
  cleaning: {
    title: "Cleaning duty",
    intervalDays: CLEANING_BLOCK_DAYS,
  },
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function dayIndexFromAnchor(date, anchor) {
  const ms = startOfDay(date).getTime() - startOfDay(anchor).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function getGarbageWaterBlockIndex(date, anchor) {
  const dayIndex = dayIndexFromAnchor(date, anchor);
  return Math.floor(dayIndex / GARBAGE_WATER_BLOCK_DAYS);
}

function getCleaningBlockIndex(date, anchor) {
  const dayIndex = dayIndexFromAnchor(date, anchor);
  return Math.floor(dayIndex / CLEANING_BLOCK_DAYS);
}

function assigneeIndex(blockIndex, memberCount) {
  return ((blockIndex % memberCount) + memberCount) % memberCount;
}

function endOfBlockDueAt(anchor, blockIndex, blockSize) {
  const blockStart = addDays(anchor, blockIndex * blockSize);
  const due = addDays(blockStart, blockSize - 1);
  due.setHours(20, 0, 0, 0);
  return due;
}

function cleaningDueAt(anchor, blockIndex, offsetInBlock) {
  const due = addDays(anchor, blockIndex * CLEANING_BLOCK_DAYS + offsetInBlock);
  due.setHours(18, 0, 0, 0);
  return due;
}

/**
 * Build task rows for the rotation window.
 * @param {MemberSeed[]} members
 * @param {Date} anchor
 * @param {number} horizonDays
 */
function buildRotationTasks(members, anchor = startOfDay(new Date()), horizonDays = 56) {
  const memberCount = members.length;
  const tasks = [];
  const garbageWaterBlocks = Math.ceil(horizonDays / GARBAGE_WATER_BLOCK_DAYS);
  const cleaningBlocks = Math.ceil(horizonDays / CLEANING_BLOCK_DAYS);

  for (let block = 0; block < garbageWaterBlocks; block += 1) {
    const assignee = assigneeIndex(block, memberCount);
    const dueAt = endOfBlockDueAt(anchor, block, GARBAGE_WATER_BLOCK_DAYS);
    const assignedAt = addDays(anchor, block * GARBAGE_WATER_BLOCK_DAYS);

    for (const type of ["garbage", "water"]) {
      tasks.push({
        title: TASK_META[type].title,
        description: `${TASK_META[type].title} — ${members[assignee].displayName} (days ${block * GARBAGE_WATER_BLOCK_DAYS + 1}-${(block + 1) * GARBAGE_WATER_BLOCK_DAYS})`,
        type,
        ownerKey: members[assignee].name,
        intervalDays: TASK_META[type].intervalDays,
        assignedAt,
        dueAt,
        repeats: false,
        active: true,
      });
    }
  }

  for (let block = 0; block < cleaningBlocks; block += 1) {
    const assignee = assigneeIndex(block, memberCount);
    const assignedAt = addDays(anchor, block * CLEANING_BLOCK_DAYS);

    CLEANING_OFFSETS_IN_BLOCK.forEach((offset, sessionIndex) => {
      const dueAt = cleaningDueAt(anchor, block, offset);
      if (dayIndexFromAnchor(dueAt, anchor) >= horizonDays) return;

      tasks.push({
        title: TASK_META.cleaning.title,
        description: `${TASK_META.cleaning.title} — ${members[assignee].displayName} (session ${sessionIndex + 1} of 4)`,
        type: "cleaning",
        ownerKey: members[assignee].name,
        intervalDays: TASK_META.cleaning.intervalDays,
        assignedAt,
        dueAt,
        repeats: false,
        active: true,
      });
    });
  }

  return tasks.sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
}

function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

module.exports = {
  GARBAGE_WATER_BLOCK_DAYS,
  CLEANING_BLOCK_DAYS,
  TASK_META,
  startOfDay,
  addDays,
  startOfWeek,
  buildRotationTasks,
  getGarbageWaterBlockIndex,
  getCleaningBlockIndex,
  assigneeIndex,
};

const Group = require("../models/group.model");
const GroupMembership = require("../models/groupMembership.model");
const Member = require("../models/member.model");
const Task = require("../models/task.model");
const { uniqueSlug } = require("../lib/slug");
const { ensureMemberForUser } = require("./member.service");

async function listGroupsForUser(userId) {
  const memberships = await GroupMembership.find({ user: userId })
    .populate("group", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  const groups = await Promise.all(
    memberships.map(async (membership) => {
      const groupId = membership.group._id;
      const [memberCount, pendingTasks] = await Promise.all([
        Member.countDocuments({ group: groupId }),
        Task.countDocuments({
          group: groupId,
          active: true,
          completedAt: null,
        }),
      ]);

      return {
        id: groupId.toString(),
        name: membership.group.name,
        slug: membership.group.slug,
        role: membership.role,
        memberCount,
        pendingTasks,
      };
    }),
  );

  return groups;
}

async function createGroup(userId, name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    const error = new Error("Group name is required");
    error.status = 400;
    throw error;
  }

  const slug = await uniqueSlug(Group, trimmed);
  const group = await Group.create({
    name: trimmed,
    slug,
    createdBy: userId,
  });

  await GroupMembership.create({
    user: userId,
    group: group._id,
    role: "admin",
  });

  const member = await ensureMemberForUser(userId, group._id);
  await GroupMembership.updateOne(
    { user: userId, group: group._id },
    { $set: { member: member._id } },
  );

  return {
    id: group._id.toString(),
    name: group.name,
    slug: group.slug,
    role: "admin",
    memberCount: 1,
    pendingTasks: 0,
  };
}

async function joinGroup(userId, slug) {
  const normalizedSlug = String(slug || "")
    .trim()
    .toLowerCase();

  if (!normalizedSlug) {
    const error = new Error("Group slug is required");
    error.status = 400;
    throw error;
  }

  const group = await Group.findOne({ slug: normalizedSlug });
  if (!group) {
    const error = new Error("No group found with that slug");
    error.status = 404;
    throw error;
  }

  const existing = await GroupMembership.findOne({
    user: userId,
    group: group._id,
  });

  if (existing) {
    const error = new Error("You are already in this group");
    error.status = 409;
    throw error;
  }

  await GroupMembership.create({
    user: userId,
    group: group._id,
    role: "member",
  });

  const member = await ensureMemberForUser(userId, group._id);
  await GroupMembership.updateOne(
    { user: userId, group: group._id },
    { $set: { member: member._id } },
  );

  const [memberCount, pendingTasks] = await Promise.all([
    Member.countDocuments({ group: group._id }),
    Task.countDocuments({
      group: group._id,
      active: true,
      completedAt: null,
    }),
  ]);

  return {
    id: group._id.toString(),
    name: group.name,
    slug: group.slug,
    role: "member",
    memberCount,
    pendingTasks,
  };
}

module.exports = { listGroupsForUser, createGroup, joinGroup };

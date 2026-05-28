const Member = require("../models/member.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const GroupMembership = require("../models/groupMembership.model");
const { MEMBERS } = require("../seed/seedData");
const {
  ensureDefaultGroup,
  DEFAULT_GROUP_SLUG,
} = require("./task.service");

const MEMBER_COLORS = [
  "#66768d",
  "#3e6658",
  "#496ae8",
  "#ba1a1a",
  "#0f766e",
  "#7c5cbf",
  "#c45c26",
];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function pickColorForGroup(groupId) {
  const count = await Member.countDocuments({ group: groupId });
  return MEMBER_COLORS[count % MEMBER_COLORS.length];
}

async function uniqueMemberName(groupId, displayName, userId) {
  const base = displayName.trim() || "Member";
  let candidate = base;
  let suffix = 0;

  while (true) {
    const existing = await Member.findOne({ group: groupId, name: candidate });
    if (
      !existing ||
      (userId && existing.user?.toString() === userId.toString())
    ) {
      return candidate;
    }
    suffix += 1;
    candidate = `${base} ${suffix}`;
  }
}

/**
 * Ensures the logged-in user has a flatmate Member row for this group
 * (used as task assignee). Links to an existing seeded name when it matches.
 */
async function ensureMemberForUser(userId, groupId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  let member = await Member.findOne({ group: groupId, user: userId });
  if (member) {
    await GroupMembership.updateOne(
      { user: userId, group: groupId },
      { $set: { member: member._id } },
    );
    return member;
  }

  const displayName = user.displayName.trim();
  const namePattern = new RegExp(`^${escapeRegex(displayName)}$`, "i");

  member = await Member.findOne({
    group: groupId,
    user: null,
    $or: [{ name: namePattern }, { displayName: namePattern }],
  });

  if (member) {
    member.user = userId;
    if (!member.displayName) {
      member.displayName = displayName;
    }
    await member.save();
    await GroupMembership.updateOne(
      { user: userId, group: groupId },
      { $set: { member: member._id } },
    );
    return member;
  }

  const name = await uniqueMemberName(groupId, displayName, userId);
  member = await Member.create({
    group: groupId,
    user: userId,
    name,
    displayName,
    color: await pickColorForGroup(groupId),
    role: "flatmate",
  });

  await GroupMembership.updateOne(
    { user: userId, group: groupId },
    { $set: { member: member._id } },
  );

  return member;
}

async function listMembers(groupId, userId) {
  if (userId) {
    await ensureMemberForUser(userId, groupId);
  }
  return Member.find({ group: groupId }).sort({ name: 1 }).lean();
}

async function getMyMember(groupId, userId) {
  const member = await ensureMemberForUser(userId, groupId);
  return member.toObject ? member.toObject() : member;
}

/** Upsert flatmates for a group — does not delete or modify tasks. */
async function seedMembers(groupSlug = DEFAULT_GROUP_SLUG) {
  const group =
    groupSlug === DEFAULT_GROUP_SLUG
      ? await ensureDefaultGroup()
      : await Group.findOne({ slug: groupSlug });

  if (!group) {
    const error = new Error(`Group not found: ${groupSlug}`);
    error.status = 404;
    throw error;
  }

  const results = await Promise.all(
    MEMBERS.map((member) =>
      Member.findOneAndUpdate(
        { group: group._id, name: member.name },
        {
          $set: {
            displayName: member.displayName,
            color: member.color,
            role: "flatmate",
          },
          $setOnInsert: { name: member.name, group: group._id },
        },
        { upsert: true, new: true },
      ),
    ),
  );

  return {
    seeded: true,
    groupId: group._id.toString(),
    groupSlug: group.slug,
    members: results.length,
    names: results.map((m) => m.displayName),
  };
}

module.exports = {
  listMembers,
  getMyMember,
  ensureMemberForUser,
  seedMembers,
};

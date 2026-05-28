const { verifyToken } = require("../lib/jwt");
const GroupMembership = require("../models/groupMembership.model");

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      displayName: decoded.displayName,
    };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

async function requireGroup(req, res, next) {
  const groupId = req.headers["x-group-id"];

  if (!groupId) {
    return res.status(400).json({ message: "Active group required (X-Group-Id header)" });
  }

  const membership = await GroupMembership.findOne({
    user: req.user.id,
    group: groupId,
  });

  if (!membership) {
    return res.status(403).json({ message: "You are not a member of this group" });
  }

  req.groupId = groupId;
  req.membership = membership;
  return next();
}

module.exports = { authenticate, requireGroup };

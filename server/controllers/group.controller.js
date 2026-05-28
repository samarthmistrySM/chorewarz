const groupService = require("../services/group.service");

async function listGroups(req, res, next) {
  try {
    const groups = await groupService.listGroupsForUser(req.user.id);
    res.json({ groups });
  } catch (error) {
    next(error);
  }
}

async function createGroup(req, res, next) {
  try {
    const group = await groupService.createGroup(req.user.id, req.body.name);
    res.status(201).json({ group });
  } catch (error) {
    next(error);
  }
}

async function joinGroup(req, res, next) {
  try {
    const group = await groupService.joinGroup(req.user.id, req.body.slug);
    res.json({ group });
  } catch (error) {
    next(error);
  }
}

module.exports = { listGroups, createGroup, joinGroup };

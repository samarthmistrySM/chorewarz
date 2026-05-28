const memberService = require("../services/member.service");

async function listMembers(req, res, next) {
  try {
    const members = await memberService.listMembers(
      req.groupId,
      req.user.id,
    );
    res.json({ members });
  } catch (error) {
    next(error);
  }
}

async function myMember(req, res, next) {
  try {
    const member = await memberService.getMyMember(req.groupId, req.user.id);
    res.json({ member });
  } catch (error) {
    next(error);
  }
}

module.exports = { listMembers, myMember };

const express = require("express");
const {
  listMembers,
  myMember,
} = require("../controllers/member.controller");

const router = express.Router();

router.get("/me", myMember);
router.get("/", listMembers);

module.exports = router;

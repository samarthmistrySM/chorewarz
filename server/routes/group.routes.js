const express = require("express");
const {
  listGroups,
  createGroup,
  joinGroup,
} = require("../controllers/group.controller");

const router = express.Router();

router.get("/", listGroups);
router.post("/", createGroup);
router.post("/join", joinGroup);

module.exports = router;

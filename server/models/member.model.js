const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  /** Linked app account — one flatmate profile per user per group. */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  name: { type: String, required: true },
  displayName: { type: String },
  color: { type: String, default: "#0f766e" },
  role: { type: String, default: "flatmate" },
});

memberSchema.index({ group: 1, name: 1 }, { unique: true });
memberSchema.index(
  { group: 1, user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: "objectId" } } },
);

module.exports = mongoose.model("Member", memberSchema);

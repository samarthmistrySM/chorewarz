const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["garbage", "water", "cleaning", "groceries", "bills"],
    required: true,
  },
  category: {
    type: String,
    enum: ["groceries", "cleaning", "bills", "trash", "water_motor"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  intervalDays: { type: Number, default: 0 },
  assignedAt: { type: Date, required: true },
  dueAt: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  active: { type: Boolean, default: true },
  repeats: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);

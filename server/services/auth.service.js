const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { signToken } = require("../lib/jwt");

const SALT_ROUNDS = 10;

function formatUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
  };
}

function issueAuthResponse(user) {
  const safeUser = formatUser(user);
  const token = signToken({
    userId: safeUser.id,
    email: safeUser.email,
    displayName: safeUser.displayName,
  });
  return { token, user: safeUser };
}

async function register({ email, password, displayName }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const name = String(displayName || "").trim();

  if (!normalizedEmail || !password || !name) {
    const error = new Error("Email, password, and display name are required");
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const error = new Error("An account with this email already exists");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    displayName: name,
  });

  return issueAuthResponse(user);
}

async function login({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  return issueAuthResponse(user);
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return formatUser(user);
}

module.exports = { register, login, getMe };

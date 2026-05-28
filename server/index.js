const dotenv = require("dotenv");
dotenv.config();

const { connectDatabase } = require("./config/db");
const app = require("./app");

connectDatabase();

module.exports = app;
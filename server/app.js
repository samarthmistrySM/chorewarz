const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { connectDatabase } = require("./config/db");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ensure the database is connected before handling requests. For serverless
// environments this will noop quickly when a connection is already cached.
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

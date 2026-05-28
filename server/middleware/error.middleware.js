function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const message = err.message || "Server error";
  res.status(err.status || 500).json({
    message,
    error: message,
  });
}

module.exports = { notFoundHandler, errorHandler };

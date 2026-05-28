const dotenv = require("dotenv");
dotenv.config();

const { connectDatabase } = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 4000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Task tracking API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

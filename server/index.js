const dotenv = require("dotenv");
dotenv.config();

const { connectDatabase } = require("./config/db");
const app = require("./app");

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

// On Vercel, export the app; DB connects per request via app middleware.
if (process.env.VERCEL !== "1") {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = app;

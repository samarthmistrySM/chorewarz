const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { connectDatabase } = require("./config/db");
const { seedData } = require("./services/task.service");

const shouldSeed = process.argv.includes("--seed");

/**
 * Drops the entire MongoDB database for this app (users, groups, members, tasks).
 *
 * Usage:
 *   npm run db:reset           # empty database
 *   npm run db:reset:seed      # empty + seed "The Crib" rotation
 */
async function run() {
  try {
    await connectDatabase();
    const dbName = mongoose.connection.db.databaseName;

    await mongoose.connection.dropDatabase();
    console.log(`Dropped database "${dbName}".`);

    if (shouldSeed) {
      const result = await seedData();
      console.log("Seed complete:");
      console.log(JSON.stringify(result, null, 2));
      console.log(
        "\nNext: register in the app, then join group slug `the-crib`.",
      );
    } else {
      console.log(
        "Database is empty. Run `npm run db:reset:seed` or `npm run seed` for demo data.",
      );
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
}

run();

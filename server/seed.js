const dotenv = require("dotenv");
dotenv.config();

const { connectDatabase } = require("./config/db");
const { seedData } = require("./services/task.service");

/**
 * Seeds the flat chore rotation:
 * - Garbage + water pump: 2 days per person (done together).
 * - Cleaning: 14 days per person, twice per week (4 sessions per block).
 * - Samarth is first for garbage/water starting today.
 */
async function run() {
  try {
    await connectDatabase();
    const result = await seedData();
    console.log("Seed complete:");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

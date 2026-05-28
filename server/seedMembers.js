const dotenv = require("dotenv");
dotenv.config();

const { connectDatabase } = require("./config/db");
const { seedMembers } = require("./services/member.service");

/**
 * Seeds / updates flatmates only (Samarth, Ashray, Sudhanshu, Arpan).
 * Safe to run anytime — does not delete or change tasks.
 */
async function run() {
  try {
    await connectDatabase();
    const result = await seedMembers();
    console.log("Members seed complete:");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

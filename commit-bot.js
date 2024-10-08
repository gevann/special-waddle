import { schedule } from "node-cron";
import { getRandomCommitCount, isWeekend, makeCommit } from "./setup.js";

// Run daily job (9 AM - 6 PM, every hour, only weekdays)
schedule("0 9-18 * * 1-5", async () => {
  if (isWeekend()) return;

  const commitCount = getRandomCommitCount();
  console.log(`Making ${commitCount} commits today...`);

  for (let i = 0; i < commitCount; i++) {
    setTimeout(makeCommit, Math.random() * 8 * 60 * 60 * 1000); // Spread commits over the workday
  }
});

console.log("Commit bot started.");

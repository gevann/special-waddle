/*
Inserts between 1 and 20, randomly selected, number of commits
from the given start date until the given end date.
*/

// Import the required functions
import {
  getRandomCommitCount,
  isWeekend,
  makeCommits,
  getFilePath,
} from "./setup.js";

import fs from "fs";

// Get the start from the last line of the file
const lines = fs.readFileSync(getFilePath(), "utf8").split("\n");
let lastDateStr = lines.pop();
lastDateStr = lastDateStr ? lastDateStr : lines.pop();
if (!lastDateStr) {
    throw new Error("No start date found in the file.");
}
const lastDate = new Date(lastDateStr.split("T")[0]);
const startDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
const today = new Date();
const endDate = new Date(today.setDate(today.getDate() - 1));
let awaitUserInput = true;
const filePath = getFilePath();

function* dateRange(startDate, endDate) {
    console.log(`Starting from ${startDate.toDateString()} to ${endDate.toDateString()}...`);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    yield new Date(d);
  }
}

const winterHolidayRange = {
  from: new Date("2024-12-20"),
  to: new Date("2025-01-05"),
};

for (let date of dateRange(startDate, endDate)) {
  if (isWeekend(date)) {
    console.log(`Skipping weekend day ${date.toDateString()}...`);
    continue;
  }
  if (date >= winterHolidayRange.from && date <= winterHolidayRange.to) {
    console.log(`Skipping winter holiday day ${date.toDateString()}...`);
    continue;
  }

  await makeCommits({ count: getRandomCommitCount(), push: false, datestr: date.toISOString().slice(0, 10), filePath });
  
  if (!awaitUserInput) {
    // Continue all iterations without waiting for input
    continue;
  }
  console.log(
    "Press 'C' to continue to end, or any other key to continue to next day."
  );
  const input = await new Promise((resolve) => {
    process.stdin.once("data", (data) => resolve(data.toString().trim()));
  });
  if (input.toLowerCase() === "c") {
    // Continue all iterations without waiting for input
    awaitUserInput = false;
  }
}

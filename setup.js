// const simpleGit = require("simple-git");
// const fs = require("fs");
// const path = require("path");
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

// Configuration
export const REPO_PATH = ".";
export const COMMIT_RANGE = [1, 20]; // Min and max commits per day
export const FILE_TO_EDIT = "README.md"; // Dummy file to edit

export const git = simpleGit(REPO_PATH);

// Utility: Random number of commits per day
export const getRandomCommitCount = () => {
  const random = Math.random();
  if (random < 0.7) {
    // 70% chance for range 3-7
    return Math.floor(Math.random() * (7 - 3 + 1)) + 3;
  } else if (random < 0.95) {
    // 25% chance for range 1-13
    return Math.floor(Math.random() * (13 - 1 + 1)) + 1;
  } else {
    // 5% chance for range 14-19
    return Math.floor(Math.random() * (19 - 14 + 1)) + 14;
  }
};

// Utility: Get the file path
export const getFilePath = () => path.join(REPO_PATH, FILE_TO_EDIT);

// Utility: Check if today is a weekend
export const isWeekend = (today) => {
  return today.getDay() === 6 || today.getDay() === 0;
};

// Perform a commit
export const makeCommits = async (opts) => {
  const filePath = opts && opts.filePath ? opts.filePath : getFilePath();
  const datestr =
    opts && opts.datestr ? opts.datestr : new Date().toISOString().slice(0, 10);
  const commitCount = opts && opts.count ? opts.count : getRandomCommitCount();
  const startOfWorkday = new Date(datestr);
  startOfWorkday.setHours(9, 0, 0, 0);
  const endOfWorkday = new Date(datestr);
  endOfWorkday.setHours(18, 0, 0, 0);

  const minuteOffsets = Array.from({ length: commitCount }, () =>
    Math.floor(Math.random() * (480 - 5 + 1)) + 5
  ).sort((a, b) => a - b);

  console.log(`Making ${minuteOffsets.length} commits on ${datestr}:`);
  const commitTime = new Date(startOfWorkday);

  for (const offset of minuteOffsets) {
    const hrs = Math.floor(offset / 60) + 9;
    const mins = offset % 60;
    commitTime.setHours(hrs, mins, Math.floor(Math.random() * 60), Math.floor(Math.random() * 1000));
    // Modify file (append timestamp)
    fs.appendFileSync(filePath, `\n${commitTime.toISOString()}`);

    // Git operations
    try {
      await git.add(".");
      await git.commit(`Auto commit at ${commitTime}`, null, {
        "--date": commitTime.toISOString(),
      });
      if (opts && opts.push === true) {
        await git.push("origin", "main"); // Change branch if needed
      }
    } catch (err) {
      console.error("Git error:", err);
    }
  }
};

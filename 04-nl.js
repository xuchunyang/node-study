const fs = require("fs");

// console.log(fs.readFileSync("README.md", "utf-8"));

const path = process.argv[2] ?? "/dev/stdin";
fs.readFileSync(path, "utf-8")
  .split("\n")
  .forEach((line, idx) => {
    const linum = idx + 1;
    console.log(`\t${linum}  ${line}`);
  });

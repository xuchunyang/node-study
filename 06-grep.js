const { readFileSync } = require("fs");
const { fail } = require("assert");

function grep(path, pattern) {
  const content = readFileSync(path, "utf8");
  const lines = content.trim().split("\n");
  return lines.filter((line) => line.includes(pattern));
}

const pattern = process.argv[2] ?? fail("Missing arguments");
const files = process.argv.slice(3).map((arg) => {
  if (arg === "-") {
    return "/dev/stdin";
  }
  return arg;
});

if (files.length === 0) files.push("/dev/stdin");
console.log(`DEBUG: pattern = ${pattern}, files = ${files}`);

files.forEach((file) => {
  const matches = grep(file, pattern);
  if (files.length === 1) {
    matches.forEach((m) => console.log(m));
  } else {
    matches.forEach((m) => console.log(file + ":" + m));
  }
});

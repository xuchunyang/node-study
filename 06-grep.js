const { readFileSync } = require("fs");
const { fail } = require("assert");

function grep(path, pattern) {
  const content = readFileSync(path, "utf8");
  const lines = content.trim().split("\n");
  return lines.map((line) => pattern.exec(line)).filter((x) => x);
}

const color = {
  black: "\u001b[30m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  white: "\u001b[37m",
  reset: "\u001b[0m",
};

const MY_COLOR = color[process.env.COLOR] || color.red;

function colorizeMatch(match) {
  const prefix = match.input.slice(0, match.index);
  const middle = match[0];
  const suffix = match.input.slice(match.index + middle.length);
  return prefix + MY_COLOR + middle + color.reset + suffix;
}

const pattern = new RegExp(process.argv[2] ?? fail("Missing arguments"));
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
    matches.forEach((m) => console.log(colorizeMatch(m)));
  } else {
    matches.forEach((m) => console.log(file + ":" + colorizeMatch(m)));
  }
});

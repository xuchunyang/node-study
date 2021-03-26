const fs = require("fs");
const _ = require("lodash");

const input = process.argv[2] ?? "/dev/stdin";

const content = fs.readFileSync(input, "utf-8");

const lines = content.trimEnd().split("\n");

const shuffledLines = _.shuffle(lines);

console.log(shuffledLines.join("\n"));

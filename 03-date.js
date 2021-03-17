console.log(new Date());

const now = new Date();

const methods = [
  "toDateString",
  "toGMTString",
  "toISOString",
  "toJSON",
  "toLocaleDateString",
  "toLocaleString",
  "toLocaleTimeString",
  "toString",
  "toTimeString",
  "toUTCString",
];

for (const method of methods) {
  console.log(`${method}:\t${now[method]()}`);
}

const { spawnSync } = require("child_process");
process.stdout.write(spawnSync("date").stdout);

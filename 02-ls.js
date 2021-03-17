const { readdirSync, statSync } = require("fs");

const path = process.argv[2] ?? ".";

readdirSync(path).forEach((name) => console.log(name));

console.log(readdirSync(path).join("\n"));

const COLOR = {
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

function print(color, msg) {
  console.log(COLOR[color] + msg + COLOR.reset);
}

readdirSync(path, { withFileTypes: true }).forEach((ent) => {
  if (ent.isDirectory()) {
    print("blue", ent.name);
  } else if (ent.isFile()) {
    print("green", ent.name);
  } else {
    console.log(ent.name);
  }
});

function printDir(path) {
  function printDirInner(path, depth = 0) {
    readdirSync(path, {
      withFileTypes: true,
    }).forEach((ent) => {
      console.log("  ".repeat(depth) + ent.name);

      if (ent.isDirectory()) {
        printDirInner(path + "/" + ent.name, depth + 1);
      }
    });
  }
  printDirInner(path);
}

printDir(path);

readdirSync(path).forEach((name) => {
  const stats = statSync(name);
  console.log(`${name}\t\t${stats.mode.toString(8)}\t\t${stats.size}`);
});

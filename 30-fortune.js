const { execSync, spawnSync } = require("child_process");
const { readFileSync } = require("fs");
const { join } = require("path");
const _ = require("lodash");

const debug = require("debug")("");

// console.log(typeof execSync("fortune -f"));
// console.log(execSync("date -u").toString());
// console.log(spawnSync("fortune", ["-f"]));

// console.log("=>", execSync("fortune -f 2>&1").toString());

/**
 * Execute shell command and return its output as a string.
 * @param {string} command The shell command to run.
 * @returns The stdout output of the command.
 */
function shell_command_to_string(command) {
  return execSync(command).toString("utf-8");
}

class Fortune {
  constructor() {
    const output = shell_command_to_string("fortune -f 2>&1");
    const lines = output.trim().split("\n");
    const dir = lines[0].split(/\s+/)[1];
    debug("dir = %o", dir);
    const names = lines.slice(1).map((line) => line.trim().split(/\s+/)[1]);
    debug("names = %o", names);
    const files = names.map((name) => join(dir, name));
    const items = files.reduce((acc, elt) => {
      debug("reading %s", elt);
      acc = acc.concat(Fortune.readFile(elt));
      return acc;
    }, []);
    debug("total %d items", items.length);
    this.fortunes = items;
  }

  random() {
    const idx = _.random(0, this.fortunes.length - 1);
    return this.fortunes[idx];
  }

  static readFile(path) {
    const content = readFileSync(path, "utf-8");
    const items = content.split(/^%$/m);
    return items.filter((s) => s.trim() !== "");
  }
}

const fortune = new Fortune();
console.log(fortune.random());

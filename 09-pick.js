const fs = require("fs");
const assert = require("assert");
const { debounce } = require("lodash");

const path = process.argv[2];
assert.ok(path, "path is missing");
const content = fs.readFileSync(path, "utf8");
const lines = content.trim().split("\n");

if (!process.stdout.isTTY) {
  console.error("STDOUT is not TTY");
  process.exit(1);
}

assert.ok(process.stdin.isTTY, "stdin is not tty");

const ESC = "\x1b";
const CSI = ESC + "[";
const codes = {
  // https://en.wikipedia.org/wiki/ANSI_escape_code
  enter_alternative_screen_buffer: ESC + "[?1049h",
  leave_alternative_screen_buffer: ESC + "[?1049l",
  // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
  home: ESC + "[H",
  clear_entire_screen: CSI + "2J",
};

console.log(`rawMode: ${process.stdin.isRaw}`);
console.log("Turn on Raw mode");

process.stdin.setRawMode(true);

console.log(`rawMode: ${process.stdin.isRaw}`);

// process.stdout.moveCursor(0, 0, )

// process.stdout.write("\x1b[H");

// console.log([...codes.enter_alternative_screen_buffer]);

// FIXME: alternative screen buffer 用不起来，有问题
// process.stdout.write(codes.enter_alternative_screen_buffer);
// process.stdout.write(codes.clear_entire_screen);
// process.stdout.write(codes.home);
// process.stdout.write("press one key to quit...\n");
// process.stdin.read(1);
// process.stdout.write(codes.leave_alternative_screen_buffer);

// todo leave rawmode ? zsh 会自动恢复，bash 不会？

// for (;;) {
//   const key = process.stdin.read(1);
//   if (key === null) continue;

//   console.log(key, typeof key);
// }

// process.stdout.write(codes.clear_entire_screen + codes.home);

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  const keys = [...chunk];
  //   console.log(keys);
  //   todo: debounce
  keys.forEach(processKey);
});

const renderDebounced = debounce(render, 200);

let input = "";
function processKey(key) {
  // C-c
  if (key === "\x03") {
    clearScreen();
    process.exit(0);
    return;
  }

  // del
  if (key === "\x7f") {
    input = input.slice(0, input.length - 1);
  } else {
    input = input + key;
  }

  //   render();
  renderDebounced();
}

const linesLimit = process.stdout.rows - 2;

// todo: select item with up/down arrow keys

function filteredLines() {
  if (input === "") return lines;
  // todo: highlight all matches in a line, not just the first
  const matches = [];
  for (const line of lines) {
    const start = line.indexOf(input);
    if (start === -1) continue;

    const prefix = line.slice(0, start);
    const middle = line.slice(start, start + input.length);
    const suffix = line.slice(start + input.length);
    matches.push({ prefix, middle, suffix });
  }
  return matches;
}

// const prompt = "\x1b[34m>\x1b[0m ";
let renderCount = 0;
function prompt() {
  const pr = `\x1b[34m${renderCount}>\x1b[0m `;
  promptLen = pr.length - 5 - 4;
  return pr;
}
let promptLen = 2;
function render() {
  renderCount++;
  process.stdout.write(codes.clear_entire_screen + codes.home);

  console.log(prompt() + input);
  filteredLines()
    .slice(0, linesLimit)
    .forEach((match, idx) => {
      if (typeof match === "string") {
        console.log(`\x1b[31m${idx + 1}\x1b[0m:` + match);
      } else {
        console.log(
          `\x1b[31m${idx + 1}\x1b[0m:` +
            match.prefix +
            `\x1b[33m${match.middle}\x1b[0m` +
            match.suffix
        );
      }
    });

  process.stdout.write(codes.home);
  process.stdout.moveCursor(promptLen + input.length);
}

function clearScreen() {
  process.stdout.write(codes.clear_entire_screen + codes.home);
}

render();

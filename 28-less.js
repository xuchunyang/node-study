const fs = require("fs");
const ansiEscapes = require("ansi-escapes");
const _ = require("lodash");

const file = process.argv[2];
if (file === undefined) {
  console.error("missing arg");
  process.exit(1);
}
const lines = fs.readFileSync(file, "utf-8").trimRight().split("\n");

if (!(process.stdin.isTTY && process.stdout.isTTY)) {
  console.error("stdin or stdout is not tty");
  process.exit(1);
}

process.stdin.setRawMode(true);
process.stdout.write(ansiEscapes.eraseScreen);
process.stdout.write(ansiEscapes.cursorTo(0, 0));
process.stdin.on("data", (chunk) => {
  chunk.forEach(processKey);
});
function processKey(key) {
  const s = String.fromCharCode(key);
  switch (s) {
    case "q":
      process.exit(0);
      break;
    case "j":
      viewer.down();
      break;
    case "k":
      viewer.up();
      break;
    default:
      viewer.render();
      break;
  }
}

const viewer = {
  lines: lines,
  height: process.stdout.rows,
  width: process.stdout.columns,
  linum: 1,
  // FIXME refresh too many times
  up() {
    if (this.linum > 1) {
      this.linum--;
      this.throttleRender();
    }
  },
  down() {
    if (this.linum < lines.length + 1) {
      this.linum++;
      this.throttleRender();
    }
  },
  clear() {
    // https://en.wikipedia.org/wiki/ANSI_escape_code
    // Move cursor; Clear screen; Hide cursor
    process.stdout.write("\x1b[1;1H" + "\x1b[2J" + "\x1b[?25l");
  },
  render() {
    this.clear();
    let linesToDisplay = lines.slice(this.linum - 1);
    if (linesToDisplay.length > this.height) {
      linesToDisplay = linesToDisplay.slice(0, this.height);
    }
    for (let i = 0; i < linesToDisplay.length; i++) {
      process.stdout.write(linesToDisplay[i] + "\n");
    }
  },
};

viewer.throttleRender = _.throttle(viewer.render, 25);

viewer.render();
// console.log(viewer.throttleRender);

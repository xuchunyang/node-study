const readline = require("readline");

process.stdin.setRawMode(true);
process.stdin.once("data", (chunk) => {
  console.log(chunk);
  // https://groups.google.com/g/nodejs/c/U_O5wlwfq2c?pli=1
  process.stdin.pause();
});

// yn("OK?");

function yn(prompt) {
  const stdin = process.openStdin();
  // stdin === process.stdin;
  stdin.setRawMode(true);
  process.stdout.write(`${prompt} (y or n) `);
  return new Promise((resolve, reject) => {
    stdin.once("data", function readKey(chunk) {
      console.log("CHUNK", chunk);
      const char = String.fromCharCode(chunk[0]);
      resolve(char === "y");
    });
  });
}

function yOrn(prompt) {
  if (!process.stdin.isRaw) {
    process.stdin.setRawMode(true);
    process.stdin.read(0);
  }
  process.stdout.write(prompt + " (y or n) ");
  process.stdin.on("readable", function readOneKey() {
    console.log("readable event");
    while (true) {
      const key = this.read();
      console.log("KEY", key);
      if (key === null) break;
    }
    // 有问题
    // https://stackoverflow.com/questions/20202088/can-i-close-a-node-readstream-before-end?noredirect=1&lq=1
    // this.destroy(new Error("xxx"));

    // 有问题
    // https://stackoverflow.com/questions/23893872/how-to-properly-remove-event-listeners-in-node-js-eventemitter
    process.stdin.removeListener("readable", readOneKey);

    process.stdin.read(0);
  });
  process.stdin.on("close", (had_error) => console.log("close", had_error));
  process.stdin.on("error", (e) => console.log(e));
}

// yOrn("Are you ready?");

// yOrn2("Ready?");

function yOrn2(prompt) {
  return new Promise((resolve, reject) => {
    process.stdout.write(prompt + " (y or n) ");

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on("keypress", function onKeypress(str, key) {
      console.log({ str, key });

      if (key.sequence === "\u0003") {
        process.exit();
      }

      process.stdin.removeListener("keypress", onKeypress);
    });
  });
}
// https://davidwalsh.name/node-raw-mode
function readKeypress() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    console.log({ str, key });

    if (key.sequence === "\u0003") {
      process.exit();
    }
  });
}

// readKeypress();

// const INPUT = process.stdin;
// const OUTPUT = process.stdout;

// INPUT.setRawMode(true);

// console.log("paused?", INPUT.isPaused());
// INPUT.pause();
// console.log("paused?", INPUT.isPaused());

// const char = INPUT.read(1);
// console.log(char);

// INPUT.on("data", (chunk) => {});

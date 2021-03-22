// https://mirrors.tuna.tsinghua.edu.cn/gnu/emacs/emacs-27.1.tar.gz 62.7 MiB

function countdown(secs) {
  if (secs > 0) {
    console.log(secs);
    setTimeout(() => {
      countdown(secs - 1);
    }, 1000);
  }
}

// countdown(10);

function sleep(secs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, secs * 1000);
  });
}

const main1 = async () => {
  for (let i = 0; i < 3; i++) {
    console.log(i);
    await sleep(1);
  }
};

// main1();

function Range(beg, end) {
  this.beg = beg;
  this.end = end;
}

Range.prototype[Symbol.iterator] = function () {
  return {
    current: this.beg,
    last: this.end,
    next() {
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    },
  };
};

async function main2() {
  console.log([...new Range(1, 10)]);
  console.log([...new Range(20, 30)]);
}

// main2();

class ClsRange {
  constructor(beg, end) {
    this.beg = beg;
    this.end = end;
  }

  [Symbol.iterator]() {
    return {
      cur: this.beg,
      end: this.end,
      next() {
        if (this.cur <= this.end) {
          return { done: false, value: this.cur++ };
        }
        return { done: true };
      },
    };
  }
}

// console.log([...new ClsRange(3, 8)]);

async function main2() {
  for (let i = 0; i < 100; i++) {
    process.stdout.write(`${i}\r`);
    await sleep(0.1);
  }
}

// main2();

class Terminal {
  static hello() {
    console.log("Hello, Terminal!");
  }

  static ESC = "\x1B";
  static CSI = this.ESC + "[";

  static hideCursor() {
    process.stdout.write(this.CSI + "?25l");
  }

  static showCursor() {
    process.stdout.write(this.CSI + "?25h");
  }
}

// Terminal.hello();

async function main2() {
  process.stdin.setRawMode(true);
  Terminal.hideCursor();
  for (let i = 0; i < 100; i++) {
    process.stdout.write(`${i}%\r`);
    await sleep(0.1);
  }
  Terminal.hideCursor();
  process.stdin.setRawMode(false);
}

// main2().catch((e) => console.error(e.message));

const [numColumns, numRows] = process.stdout.getWindowSize();
// console.log({ numColumns, numRows });
// console.log(process.stdout.columns, process.stdout.rows);

process.stdout.on("resize", () => {
  console.log("screen size has changed!");
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});

async function main3() {
  for (let i = 0; i < numColumns; i++) {
    process.stdout.write("=");
    await sleep(0.05);
  }
}

// main3();

[..."◼◾■▮"].forEach((c) => console.log(c.repeat(3)));
console.log("◼◾■▮");

// https://changaco.oy.lc/unicode-progress-bars/
// todo: impl https://mike42.me/blog/2018-06-make-better-cli-progress-bars-with-unicode-block-characters

console.log("██████");
for (let i = 0x2588; i <= 0x258f; i++) {
  console.log(String.fromCodePoint(i));
}

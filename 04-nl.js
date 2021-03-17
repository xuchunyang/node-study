const fs = require("fs");

// console.log(fs.readFileSync("README.md", "utf-8"));

const path = process.argv[2] ?? "/dev/stdin";
nl(path);

function nl(path) {
  const lines = fs.readFileSync(path, "utf-8").split("\n");
  // 'a\nb\n'.split('\n') => a, b, ''
  if (lines[lines.length - 1] === "") lines.pop();

  let linum = 0;
  lines.forEach((line) => {
    if (line === "") {
      console.log();
      return;
    }
    console.log(`\t${++linum}  ${line}`);
  });
}

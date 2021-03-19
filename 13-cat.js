const fs = require("fs");

// process.stdin.pipe(process.stdout);

const inputFiles = process.argv.slice(2).map((path) => {
  return path === "-" ? "/dev/stdin" : path;
});
if (inputFiles.length === 0) {
  inputFiles.push("/dev/stdin");
}

inputFiles.forEach((path) => {
  // todo 学习 stream，了解需不需要关闭 stream
  fs.createReadStream(path).pipe(process.stdout);
});

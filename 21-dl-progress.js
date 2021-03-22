// https://mirrors.tuna.tsinghua.edu.cn/gnu/emacs/emacs-27.1.tar.gz 62.7 MiB
// http://mirrors.ustc.edu.cn/gnu/emacs/emacs-27.1.tar.gz

const https = require("https");
const http = require("http");
const { basename } = require("path");
const fs = require("fs");

main();

function p(msg) {
  process.stderr.write("\r" + msg);
}

function main() {
  const [url, file] = process.argv.slice(2);
  if (!url || !file) {
    console.error("Missing url or file");
    return;
  }
  if (fs.existsSync(file)) {
    console.error(`${file} already exists`);
    return;
  }
  const output = fs.createWriteStream(file);

  const theHttp = url.startsWith("https") ? https : http;
  const req = theHttp.get(url, (res) => {
    debug(res.statusCode);
    debug(JSON.stringify(res.headers, null, 4));
    if (res.statusCode !== 200) {
      debug("Not 200");
      return;
    }

    let totalBytes = null;
    if ("content-length" in res.headers) {
      const contentLength = res.headers["content-length"];
      totalBytes = contentLength;
      const kiloBytes = contentLength / 1024;
      const megaBytes = kiloBytes / 1024;
      console.error(
        `Body has ${contentLength} bytes, ${kiloBytes} KB, ${megaBytes} MB`
      );
    }

    res.on("close", () => console.error("received close event"));
    res.on("end", () => console.error("received end event"));
    // res.pipe(output);
    let writtenBytes = 0;
    res.on("data", (chunk) => {
      output.write(chunk);
      writtenBytes += chunk.length;
      if (totalBytes !== null) {
        const percent = writtenBytes / totalBytes;
        p(`${writtenBytes} / ${totalBytes} = ${percent}`);
      } else {
        p(`Wrote ${writtenBytes} bytes`);
      }
    });
  });
  req.on("error", (error) => console.error(error.message));
}

function getContentLength(headers) {
  headers["content-length"];
}

function test() {
  const url =
    "https://mirrors.tuna.tsinghua.edu.cn/gnu/emacs/emacs-27.1.tar.gz";
  const file = basename(url);
  const output = fs.createWriteStream(file);

  debug(`To download ${url} as ${file}...`);

  https.get(url, (res) => {
    debug(res.statusCode);
    debug(JSON.stringify(res.headers, null, 4));
    if (res.statusCode !== 200) {
      debug("Not 200");
      return;
    }

    res.pipe(output);
  });
}

function debug(msg) {
  console.error("DEBUG: " + msg);
}

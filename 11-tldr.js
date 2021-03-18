const fs = require("fs");
const { ok } = require("assert");
const { basename, extname } = require("path");

const tldrPagesDir = "/home/xcy/.tldr/tldr/pages.zh";

// console.log(walkDir(tldrPagesDir));

const files = walkDir(tldrPagesDir);
const pages = files.map((path) => {
  const filename = basename(path);
  ok(extname(filename) === ".md", `${path} is not markdown file`);

  const name = filename.slice(0, -3);
  const content = fs.readFileSync(path, "utf8");

  return { name, content };
});

// console.log(pages[0])
console.log(JSON.stringify(pages, null, 2));

function walkDir(dir) {
  function inner(rootDir) {
    return fs
      .readdirSync(rootDir, {
        withFileTypes: true,
      })
      .map((f) => {
        const path = rootDir + "/" + f.name;
        if (f.isFile()) {
          return path;
        }

        return inner(path);
      });
  }

  return inner(dir).flat();
}

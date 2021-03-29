const { spawn, execSync } = require("child_process");
const { readdirSync } = require("fs");
const { readFileSync } = require("fs");
const { gunzipSync } = require("zlib");
const { basename, join } = require("path");
const debug = require("debug")("man");

function shellCommand(command) {
  return execSync(command).toString().trim();
}

function parsePATH(path) {
  return path.split(":");
}

function getManPaths() {
  return parsePATH(shellCommand("man --path"));
}

function dirfiles(dir) {
  const ents = readdirSync(dir, { withFileTypes: true });
  let files = [];
  ents.forEach((e) =>
    e.isDirectory()
      ? (files = files.concat(dirfiles(join(dir, e.name))))
      : files.push(join(dir, e.name))
  );
  return files;
}

function searchMan(name, paths) {
  // ls.1, ls.1.gz
  const re = new RegExp(`^${name}\.\\d(?:.gz)?$`);
  for (const path of paths) {
    const found = dirfiles(path).find((p) => re.test(basename(p)));
    if (found) return found;
  }
}

function catMan(path) {
  if (path.endsWith(".gz")) {
    const content = readFileSync(path);
    return gunzipSync(content).toString();
  }
  return readFileSync(path, "utf-8");
}

function manToMarkdown(manContent) {
  return execSync("pandoc --from man --to markdown", {
    input: manContent,
    encoding: "utf-8",
  });
}

function pager(input) {
  const less = spawn("less");
  less.stdin.write(input);
}

function main() {
  const command = process.argv[2];
  if (command === undefined) {
    console.error("Missing command");
    process.exitCode = 1;
    return;
  }

  const manpath = getManPaths();
  debug("mathpath: %o", manpath);

  const manfile = searchMan(command, manpath);
  debug("manfile: %o", manfile);

  const manContent = catMan(manfile);
  debug("manContent: %s", manContent);

  const markdown = manToMarkdown(manContent);
  debug("markdown: %s", markdown);

  console.log(markdown);

  // fixme: how to launch less(1) from nodejs code, just like man(1) and git(1)
  //   pager(markdown);
}

main();

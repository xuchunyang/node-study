const { execSync, spawnSync } = require("child_process");

console.log(execSync("git ls-files").toString());

console.log(spawnSync("git", ["ls-files"]).stdout.toString());

// todo: use git api to impl ls-files
//       refer https://github.com/libgit2/libgit2/blob/main/examples/ls-files.c

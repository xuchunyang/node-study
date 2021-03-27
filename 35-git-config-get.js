const git = require("isomorphic-git");

const fs = require("fs");
const { relative } = require("path");
const { execSync } = require("child_process");

(async () => {
  const value = await git.getConfig({
    fs,
    dir: ".",
    path: "remote.origin.url",
  });

  console.log(value);

  const dir = ".";

  console.log(await git.log({ fs, dir }));

  console.log({ __dirname, __filename });
  console.log(
    await git.status({ fs, dir, filepath: relative(__dirname, __filename) })
  );

  await git.add({ fs, dir, filepath: relative(__dirname, __filename) });
  await git.add({ fs, dir, filepath: "package.json" });
  const sha = await git.commit({
    fs,
    dir,
    message: "25-git-config-get: init",
    author: {
      // 暂时不支持 ~/.gitconfig
      // name: await git.getConfig({ fs, dir, path: "user.name" }),
      // email: await git.getConfig({ fs, dir, path: "user.email" }),
      name: execSync("git config user.name").toString().trim(),
      email: execSync("git config user.email").toString().trim(),
    },
  });

  console.log(sha);
})();

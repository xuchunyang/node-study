const child_process = require("child_process");

console.log(child_process.spawnSync("date"));
console.log(child_process.spawnSync("date"));

console.log(child_process.execSync("date | nl"));

console.log(child_process.execFileSync("emacs", ["--version"]).toString());

console.log(
  child_process
    .execSync("nl", {
      input: "a\nbb\nccc\n",
    })
    .toString()
);

function shellCommandToString(command) {
  return child_process.execSync(command).toString();
}

console.log(shellCommandToString("pwd"));
console.log(shellCommandToString("date"));
console.log(shellCommandToString("date | nl | nl | nl"));

function shellCommandToStringAsync(command) {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      console.log({ error, stdout, stderr });
      if (error) {
        reject(error.message);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

shellCommandToStringAsync("date -u | nl")
  .then((res) => {
    console.log(res);
  })
  .catch((error) => console.error(error));

shellCommandToStringAsync("command_not_found -u | nl")
  .then((res) => {
    console.log(res);
  })
  .catch((error) => console.error("ERROR", error));

const prompt = "$ ";
function showPrompt() {
  process.stdout.write(prompt);
}
showPrompt();

let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk;

  console.log("INPUT: " + JSON.stringify({ input }));

  if (input.includes("\n")) {
    const command = input.slice(0, input.indexOf("\n"));

    try {
      console.log(shellCommandToString(command));
    } catch (error) {
      console.error("ERROR:", error.message);
    }
    showPrompt();

    input = input.slice(command.length + 1);
  }
});

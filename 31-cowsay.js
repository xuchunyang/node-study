// ➜  node-study git:(main) ✗ date | cowsay
//  ______________________________
// < Thu Mar 25 23:53:17 CST 2021 >
//  ------------------------------
//         \   ^__^
//          \  (oo)\_______
//             (__)\       )\/\
//                 ||----w |
//                 ||     ||

const { readFileSync } = require("fs");

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const output = ` ${"_".repeat(input.length + 2)}
< ${input} >
 ${"-".repeat(input.length + 2)}
        \\   ^__^
         \\  (oo)\_______
            (__)\       )\\/\\
                ||----w |
                ||     ||`;
console.log(output);

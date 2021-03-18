const https = require("https");

const re = new RegExp(
  `<tr><td><a href=".*">(?<name>.+)</a></td><td>(?<version>.+)</td><td>(?<desc>.+)</td></tr>`,
  "g"
);

https.get("https://elpa.gnu.org/packages/", (res) => {
  console.error(`STATUS: ${res.statusCode}`);
  console.error(`HEADERS:`, res.headers);

  res.setEncoding("utf8");
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    console.error("No more data");

    const matches = body.matchAll(re);

    // const ace = [...matches][0].groups;

    // console.log(ace);
    // console.log(JSON.stringify(ace));

    const packages = [...matches].map((m) => m.groups);
    console.error(`Find ${packages.length} packages`);

    console.log(JSON.stringify(packages, null, 2));
  });
});

// const content = require("fs").readFileSync("/dev/stdin", "utf8");
// const matches = content.matchAll(re);

// for (const m of matches) {
//   console.log(m.groups);
// }

// const m0 = [...matches][0];
// delete m0.input;
// console.log(m0);

// console.log([...matches][0]);
// const [_m, name, ver, desc] = [...matches][0];
// console.log({ name, ver, desc });

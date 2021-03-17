const http = require("http");
const https = require("https");
const assert = require("assert");

// curl(process.argv[2] ?? assert.fail("Missing URL"));
// curl(process.argv[2] ?? process.exit(1));
const url = process.argv[2];
if (url === undefined) {
  console.error("Missing argument URL");
  process.exitCode = 1;
  process.exit();
}
curl(url);

function curl(url) {
  const http_ = url.startsWith("https://") ? https : http;
  const req = http_.request(url, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on("end", () => {
      console.log("No more data in response.");
    });
  });
  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  req.end();
}

function requestExample() {
  const req = http.request("http://example.com", { method: "GET" }, (res) => {
    console.log("HEADERS", res.headers);

    res.setEncoding("utf8");
    res.on("data", (chunk) => console.log(chunk));
    res.on("end", () => console.log("end"));
  });
  // req.write("hello");
  req.end();
}

function getExample() {
  http.get("http://example.com", (res) => {
    console.log(
      `HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`
    );
    console.log(res.rawHeaders);
    console.log(res.headers);

    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      console.log(body.length + " chars received:\n\n");
      console.log(body);
    });
  });
}

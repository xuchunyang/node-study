// 下载文件，多次下载同一个文件时，避免重复下载
const { basename, join } = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");

// 0. 准备工作
// const DATADIR = join(__dirname, "data/dl");
// if (!fs.existsSync(DATADIR)) fs.mkdirSync(DATADIR, { recursive: true });
// const DBFILE = join("db.json", DATADIR);
const DBFILE = "dl.json";
const db = getDB();

// 1. Parse opts
const url = process.argv[2];
if (!url) usage("Missing URL");
try {
  new URL(url);
} catch (e) {
  usage(e.mssage);
}

let file;
if (process.argv[3] === "-o" || process.argv[3] === "--output") {
  file = process.argv[4];
  if (!file) usage(`${process.argv[3]} missing argument file`);
} else {
  file = getRemoteName(url);
  if (!file) usage("Remote file name has no length!");
}

main();

function main() {
  if (url in db) {
    console.log("Check cache freshness...");
    const header = db[url].headers;
    if (isFresh(header)) {
      console.log("Skip! Fresh content");
      return;
    }
    console.log("cache is still");

    const headersToSend = {};
    if (header.etag) {
      headersToSend["If-None-Match"] = header.etag;
    }
    if (header["Last-Modified"]) {
      headersToSend["If-Modified-Since"] = header["Last-Modified"];
    }

    console.log("headersToSend", headersToSend);
    download(headersToSend);
  } else {
    download();
  }
}

// 2. Check cache freshness <https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#freshness>
function isFresh(header) {
  const lifetime =
    getMaxAge(header) ??
    getLifetimeFromExpires(header) ??
    getHeuristicLifetime(header);

  console.log(`cache fresh lifetime is ${lifetime} seconds`);
  if (!lifetime) return;

  // expirationTime = responseTime + freshnessLifetime - currentAge
  const responseTime = new Date(header.date);
  const currentAge = header.age ? parseInt(header.age) : 0;
  responseTime.setSeconds(responseTime.getSeconds() + lifetime - currentAge);

  const expirationTime = responseTime;

  console.log(`Expire time: ${expirationTime}`);
  return expirationTime > new Date();
}

// Heuristic freshness checking
function getHeuristicLifetime(header) {
  if (!("last-modified" in header)) return;

  return (
    (new Date(header.date) - new Date(header["last-modified"])) / 1000 / 10
  );
}

function getLifetimeFromExpires(header) {
  if (!("expires" in header)) return;

  return (new Date(header.expires) - new Date(header.date)) / 1000;
}

function getMaxAge(header) {
  if (!("cache-control" in header)) return;
  for (const part of header["cache-control"].split(/\s*;\s*/)) {
    const [k, v] = part.split("=");
    if (k === "max-age") return Number(v);
  }
}

function download(headers) {
  const theHttp = url.startsWith("https://") ? https : http;
  const req = theHttp.request(url, { headers }, (res) => {
    const dbEntry = {
      url,
      file,
      statusCode: res.statusCode,
      headers: res.headers,
    };
    db[url] = dbEntry;
    console.log("dbEntry", dbEntry);
    writeDB();

    const chunks = [];
    res.on("data", (chunk) => chunks.push(chunk));
    res.on("end", () => {
      if (res.statusCode === 304) {
        console.log("Skip downloading, received 304", res.statusMessage);
        return;
      }
      fs.writeFileSync(file, Buffer.concat(chunks));
      console.log("Wrote to " + file);
    });
  });
  req.on("error", (error) => console.error(error));
  req.end();
}

function usage(errMsg) {
  console.error(errMsg);
  console.error("Usage: <program> <url> [-o|--output file]");
  process.exit(1);
}

function getDB() {
  if (!fs.existsSync(DBFILE)) return {};
  return readDB();
}

function readDB() {
  const content = fs.readFileSync(DBFILE, "utf8");
  return JSON.parse(content);
}

function writeDB() {
  fs.writeFileSync(DBFILE, JSON.stringify(db, null, 4));
  console.log("Wrote db to " + DBFILE);
}

function getRemoteName(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  // basename 忽略最后的 /
  if (path.endsWith("/")) return;
  return basename(path);
}

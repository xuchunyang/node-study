const https = require("https");
const http = require("http");

function get(url, type = "plain") {
  return new Promise((resolve, reject) => {
    if (!/^https?:\/\/.+/.test(url)) {
      reject("Invlid url: ${url");
      return;
    }

    if (!["plain", "json", "binary"].includes(type)) {
      reject(`Invalid type: ${type}`);
      return;
    }

    const httpOrHttps = url.startsWith("https") ? https : http;
    const req = httpOrHttps.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const data = Buffer.concat(chunks);
        if (type === "binary") {
          resolve(data);
        } else if (type === "plain") {
          resolve(data.toString("utf8"));
        } else {
          const s = data.toString("utf8");
          const j = JSON.parse(s);
          resolve(j);
        }
      });
    });
    req.on("error", (e) => reject(e.message));
  });
}

const apiUrl =
  "https://api.unsplash.com/photos/random?client_id=w84Usx097OcVja5QA5NhEcvv9t8l5LZlKex5yjN8Ues";

// const req = https.get(apiUrl, (res) => {
//   let body = "";
//   res.on("data", (chunk) => (body += chunk));
//   res.on("end", () => {
//     const photo = JSON.parse(body);
//     console.error(photo);

//     const url = photo.urls.regular;
//     console.error(`Downloading ${photo.alt_description} \n${url}\n`);

//     get(url, "binary").then((buf) => process.stdout.write(buf));
//   });
// });
// req.on("error", (e) => console.error(e));

get(apiUrl, "json")
  .then((photo) => {
    const url = photo.urls.regular;
    console.error(`Downloading ${photo.alt_description} \n${url}\n`);
    get(url, "binary")
      .then((buf) => process.stdout.write(buf))
      .catch((e) => console.error(e));
  })
  .catch((reason) => {
    console.error(reason);
  });

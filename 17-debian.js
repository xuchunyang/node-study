// 所有的包的名称，目前有 45543 个
// https://sources.debian.org/api/list/

// 我已经弄到了，放在
// https://study-1258907199.cos.ap-nanjing.myqcloud.com/debian-packages.json

const https = require("https");

function get(url, callback) {
  https
    .get(url, (res) => {
      const result = {};
      result.statusCode = res.statusCode;
      result.headers = res.headers;

      let data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        result.data = Buffer.concat(data);
        callback(result);
      });
    })
    .on("error", (error) => callback({ error }));
}

get("https://sources.debian.org/api/list/", (result) => {
  if ("error" in result) {
    console.error("ERROR:" + result.error.message);
    return;
  }

  console.log("STATUS: " + result.statusCode);
  console.log("HEADERS: \n" + JSON.stringify(result.headers, null, 4));

  const body = result.data.toString();
  const parsedBody = JSON.parse(body);

  const names = parsedBody.packages.map((item) => item.name);
  console.log(`Received ${names.length} packages`);
});

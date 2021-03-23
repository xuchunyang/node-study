const axios = require("axios").default;
const { JSDOM } = require("jsdom");
const fs = require("fs");

axios
  .get(
    "https://www.fenghost.net/clientarea.php?action=productdetails&id=21652",
    {
      headers: {
        authority: "www.fenghost.net",
        "upgrade-insecure-requests": "1",
        "cache-control": "max-age=0",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "navigate",
        "sec-fetch-user": "?1",
        "sec-fetch-dest": "document",
        cookie:
          "WHMCSUser=16810%3A93e0c78543fefd805632b6652e7a8fcbcd02aaae; WHMCSMFTMsQtB0isU=gp1h73vmb4lpho8lmosl0tire2",
      },
      responseType: "text",
    }
  )
  .then((resp) => {
    console.log(resp.status);
    console.log(resp.headers);
    // console.log(resp.data);

    fs.createWriteStream("/tmp/fengye.html").write(resp.data);

    const dom = new JSDOM(resp.data);
    const used = dom.window.document
      .querySelector(".traffic.used")
      .textContent.trim();
    const free = dom.window.document
      .querySelector(".traffic.free")
      .textContent.trim();
    const total = dom.window.document
      .querySelector(".traffic.limit")
      .textContent.trim();

    console.log({ used, free, total });
  });

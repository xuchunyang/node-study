const axios = require("axios").default;

// TOKEN
// https://console.cloud.tencent.com/cam/capi

// URL
// https://study-1258907199.cos.ap-nanjing.myqcloud.com/melpa.json

// API
// https://cloud.tencent.com/document/product/436/7749

// 需要计算 Auth 字符串，很麻烦
function manuallyNotWork() {
  axios
    .put(
      `https://study-1258907199.cos.ap-nanjing.myqcloud.com/${new Date().toISOString()}`,
      {
        data: process.stdin,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      }
    )
    .then((resp) => {
      console.log(resp);
    })
    .catch((error) => {
      console.error(error);
    });
}

const COS = require("cos-nodejs-sdk-v5");
require("dotenv").config();
const cos = new COS({
  SecretId: process.env.TencentCloudSecretId,
  SecretKey: process.env.TencentCloudSecretKey,
});

cos.getService((err, data) => {
  console.log(err ?? data);
});

cos.getBucket(
  {
    Bucket: "study-1258907199",
    Region: "ap-nanjing",
  },
  (err, data) => {
    console.log("文件列表", err || data);
  }
);

cos.putObject(
  {
    Bucket: "study-1258907199",
    Region: "ap-nanjing",
    Key: new Date().toISOString(),
    Body: "Hello, World! uploaded from nodejs " + new Date(),
    onProgress: (progressData) =>
      console.log(JSON.stringify(progressData, null, 4)),
    ContentType: "text/plain; charset=UTF-8",
  },
  (err, data) => {
    console.log(err ?? data);
  }
);

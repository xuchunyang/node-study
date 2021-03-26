const QRCode = require("qrcode");
const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf-8");

QRCode.toString(input, { type: "utf8" }).then((s) => console.log(s));

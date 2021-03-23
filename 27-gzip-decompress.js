const zlib = require("zlib");

const stream = require("stream");

testPipeCompress();

// date | node xxx | gzip -d
function testPipeCompress() {
  stream.pipeline(process.stdin, zlib.createGzip(), process.stdout, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function testPipeDecompress() {
  // 解压
  // cal | gzip | node 27-gzip-decompress.js
  stream.pipeline(process.stdin, zlib.createGunzip(), process.stdout, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function testGzip() {
  console.log(
    zlib
      .gunzipSync(Buffer.from("H4sIAAAAAAAAA8tIzcnJBwCGphA2BQAAAA==", "base64"))
      .toString("utf-8")
  );

  console.log(Buffer.from(zlib.gzipSync("hello")).toString("base64"));
}

// 解压 gzip
function testGunzip() {
  // ➜  node-study git:(main) ✗ echo -n hello | gzip | base64
  // H4sIAAAAAAAAA8tIzcnJBwCGphA2BQAAAA==
  zlib.gunzip(
    Buffer.from("H4sIAAAAAAAAA8tIzcnJBwCGphA2BQAAAA==", "base64"),
    {
      info: true,
    },
    (err, buffer) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(buffer);
    }
  );
}

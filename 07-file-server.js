const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    console.log("req.url", req.url);

    const path = "." + req.url;
    try {
      const stat = fs.statSync(path);
      if (!stat.isDirectory()) {
        fs.readFile(path, "utf8", (err, data) => {
          if (err) {
            res.end("Error: " + err.message);
            return;
          }
          res.setHeader("content-type", "text/plain; charset=UTF-8");
          res.end(data);
        });
      } else {
        const files = fs.readdirSync(path, "utf8");
        res.setHeader("content-type", "text/html; charset=UTF-8");
        const body =
          "<ol>" +
          files
            .map((f) => `<li><a href="${path}${f}">${f}</a></li>`)
            .join("\n") +
          "</ol>";
        res.end(body);
      }
    } catch (e) {
      res.end("Error: " + e.message);
    }
  })
  .listen(8000, () => {
    console.log("Listen on http://localhost:8000");
  });

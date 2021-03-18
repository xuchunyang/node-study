const fs = require("fs");

const packages = {};

const downloadCounts = parse("data/download_counts.json");
const archive = parse("data/archive.json");
for (const name in archive) {
  const version = archive[name].ver.join(".");
  const desc = archive[name].desc;

  const downloads = downloadCounts[name];

  packages[name] = {
    desc,
    version,
    downloads,
  };
}

// 减少 JSON 体积
const packagesArray = Object.keys(packages).map((name) => {
  const { version, desc, downloads } = packages[name];
  return [name, version, desc, downloads];
});

// fs.writeFileSync("melpa.json", JSON.stringify(packagesArray));

// 376569 ，没啥必要
// console.log(JSON.stringify(packagesArray));
console.log(JSON.stringify(packagesArray, null, 2));

// 518176
// console.log(JSON.stringify(packages));

function parse(path) {
  const contents = fs.readFileSync(path, "utf8");
  return JSON.parse(contents);
}

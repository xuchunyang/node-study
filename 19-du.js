const fs = require("fs");

// fs.readdir(
//   ".",
//   {
//     withFileTypes: true,
//   },
//   (error, files) => {
//     if (error) {
//       console.error(error.message);
//       return;
//     }

//     console.log(files);
//   }
// );

// fs.stat(".", (err, st) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }

//   console.log(st, st.size);
// });

const { join } = require("path");

function directory_files_recursively(dir) {
  function inner(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    return [dir].concat(
      ...files.map((f) => {
        const path = join(dir, f.name);
        return f.isDirectory() ? [...inner(path)] : path;
      })
    );
  }

  return inner(dir);
}

function getFileSize(path) {
  return fs.statSync(path).size;
}

const rootDir = process.argv[2] || ".";
// console.log(directory_files_recursively(rootDir));
const files = directory_files_recursively(rootDir);

// files.forEach();

// fixme 结果和 du -s 不同
console.log(
  files.reduce(
    (acc, elt) => {
      const st = fs.statSync(elt);
      if (st.isDirectory()) {
        acc.countDirs++;
      } else {
        acc.countFiles++;
      }
      acc.totalBytes += st.size;
      return acc;
    },
    { countFiles: 0, countDirs: 0, totalBytes: 0 }
  )
);

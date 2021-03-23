// https://raw.githubusercontent.com/emacsmirror/epkgs/master/epkg.sql
// $ sqlite3 epkg.db <epkg.sql

const Database = require("better-sqlite3");
const db = new Database("epkg.db", { verbose: console.log });

const magit = db
  .prepare("SELECT * FROM packages where name = ?")
  .get('"magit"');

console.log(magit);

console.log(db.prepare("SELECT count(*) FROM packages").get());
console.log(db.prepare("SELECT count(*) AS numPackages FROM packages").get());

const names = db.prepare("SELECT name from packages").all();
console.log({ names });

const stmt = db.prepare(`select name from packages where name like '"magit%'`);
console.log([...stmt.iterate()]);

console.log(db);

db.close();

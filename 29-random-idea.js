const { existsSync } = require("fs");
const { readFileSync } = require("fs");
const { join } = require("path");
const _ = require("lodash");

const sources = [
  join(__dirname, "ideas"),
  join(process.env.HOME, "ideas"),
  join(process.env.HOME, "vue-study", "ideas"),
  join(process.env.HOME, "vue-study", "blog_ideas"),
];

const filteredSources = sources.filter((name) => {
  if (!existsSync(name)) {
    console.error(`${name} does not exists`);
    return false;
  }
  return true;
});

const ideas = filteredSources.reduce(
  (acc, elt) => (acc = acc.concat(getIdeas(elt))),
  []
);

console.log(getArrayRandomItem(ideas));

function getIdeas(path) {
  return readFileSync(path, "utf-8").trim().split("\n");
}

function getArrayRandomItem(arr) {
  const idx = _.random(0, arr.length - 1);
  return arr[idx];
}

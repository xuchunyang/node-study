const chalk = require("chalk");

const debug = require("debug")("cal");
const now = new Date();

// March 2021
// Su Mo Tu We Th Fr Sa
//     1  2  3  4  5  6
//  7  8  9 10 11 12 13
// 14 15 16 17 18 19 20
// 21 22 23 24 25 26 27
// 28 29 30 31

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Novermber",
  "December",
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

console.log(`     ${MONTHS[now.getMonth()]} ${now.getFullYear()}`);
console.log("Su Mo Tu We Th Fr Sa");

const firstDayOfMonth = new Date(now);
debug("today is %d", firstDayOfMonth.getDate());
firstDayOfMonth.setDate(1);
debug("first day is %s", firstDayOfMonth);
debug("first weekday is %d", firstDayOfMonth.getDay());
const offset = firstDayOfMonth.getDay();
process.stdout.write("   ".repeat(offset));

for (
  let i = offset + 1, d = new Date(firstDayOfMonth);
  d.getMonth() === now.getMonth();
  i++, d = nextDay(d)
) {
  const day = d.getDate();
  let s = numPad(day);
  if (day === now.getDate()) {
    s = chalk`{inverse ${s}}`;
  }
  if (i % 7 === 0) {
    console.log(s);
  } else {
    // todo for the last day, print \n instead
    process.stdout.write(s + " ");
  }
}
console.log();

function numPad(num) {
  const s = num.toString();
  return s.padStart(2, " ");
}

function nextDay(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

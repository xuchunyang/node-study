const arg = process.argv[2];
if (arg === undefined) {
  console.error("Missing seconds argument");
  process.exit(1);
}

const secs = parseFloat(arg);
if (isNaN(secs)) {
  console.error(`Invalid seconds argument, not a number: ${arg}`);
  process.exit(1);
}

setTimeout(() => {}, secs * 1000);

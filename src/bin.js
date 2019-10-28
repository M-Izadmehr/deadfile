#!/usr/bin/env node
const fs = require("fs");
const Greeting = require("./cli/Greeting");
const yargs = require("yargs");
const inputOptions = require("./cli/options");
const DeadCode = require("./");

// Greeting
new Greeting().print();

// Initialization
yargs
  .usage(
    `Usage:
simple:                $0 ./src/index.js
multiple entry:        $0 ./src/index.js ./src/entry2.js
with custom directory: $0 ./src/index.js --dir /path/to/other/folder
with  exclude:         $0 ./src/index.js --exclude tests  utils/webpack
`
  )
  .options(inputOptions);

new DeadCode(yargs.argv);

if (yargs.argv.output) {
  console.log("yargs.argv: ", yargs.argv);
  fs.writeFileSync("");
}

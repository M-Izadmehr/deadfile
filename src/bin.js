#!/usr/bin/env node
const Greeting = require("./cli/Greeting");
const yargs = require("yargs");
const inputOptions = require("./cli/options");
const DeadFile = require("./");

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
without report server: $0 ./src/index.js --no-report-server utils/webpack
`
  )
  .options(inputOptions);

new DeadFile(yargs.argv);

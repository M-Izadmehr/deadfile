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
simple:                       $0 ./src/index.js
multiple entry:               $0 ./src/index.js ./src/entry2.js
with custom directory:        $0 ./src/index.js --dir /path/to/other/folder
with custom webpack config:   $0 ./src/index.js --webpackConfig /path/to/webpack/config/file.js
with package.json config:     $0 ./src/index.js --webpackConfig /path/to/package.json/file
with  exclude:                $0 ./src/index.js --exclude tests  utils/webpack
`
  )
  .options(inputOptions);

new DeadFile(yargs.argv);

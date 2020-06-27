const options = {
  _: {
    alias: "entry",
    describe: "Entry file (or array of entry files)",
    type: "array",
    demandOption: true
  },
  D: {
    alias: "dir",
    describe: "Project directory (to search all files)",
    default: process.cwd(), //eslint-disable-line no-undef
    defaultDescription: "<PWD>",
    type: "string",
    demandOption: false
  },
  O: {
    alias: "output",
    describe: "location to save report (./deadcode_report.js)",
    type: "string",
    demandOption: false
  },
  EXCL: {
    alias: "exclude",
    describe: "Exclude directories/files",
    default: [],
    type: "array",
    demandOption: false
  },
  RS: {
    alias: "report-server",
    describe: "Enable/disable the HTML report server",
    default: true,
    type: "boolean",
    demandOption: false
  },
};

module.exports = options;

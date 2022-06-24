const UsedAssets = require("./handlers/UsedAssets");
const AllAssets = require("./handlers/AllAssets");
const Logger = require("./cli/Logger");
const _pickBy = require("lodash/pickBy");
const path = require("path");
const WriteReportFile = require("./cli/WriteReportFile");
const ReportServer = require("./reportServer/server");
class DeadFile {
  constructor(argv) {
    const { _: entry, dir, exclude = [], output, report } = argv;
    this.baseDir = this.dirToAbs(dir); // if dir is not absolute find based on pwd
    this.entry = this.entryToAbs(entry, dir); // if the entry is not absolute find the absolute
    this.exclude = exclude; // excluded files/folders
    this.output = output;
    this.shouldReport = !(report == false);
    this.allAssets = AllAssets(dir, { exclude }); // Array
    this.results = null;
    new UsedAssets(
      { entry: this.entry, dir: this.baseDir, exclude: this.exclude },
      this.setUsedAssets.bind(this)
    ).start(); // Map
  }

  dirToAbs(dir) {
    return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
  }

  entryToAbs(entry, baseDir) {
    return entry.map((file) => {
      // Case 1: if entry is absolute use it
      if (path.isAbsolute(file)) return file;
      // Case 2: if entry is rel and baseDir is absolute, use baseDir as basis
      if (path.isAbsolute(baseDir)) return path.resolve(baseDir, file);
      // Case 3: if both are rel, use process.cwd as basis
      return path.resolve(process.cwd(), file);
    });
  }

  /**
   * we need to set usedAssets by a callback because, the process is async and uses callbacks
   */
  setUsedAssets(usedAssets, notFound) {
    this.usedAssets = usedAssets;
    this.notFound = notFound;

    // final object
    this.checkDiff();
  }

  checkDiff() {
    const usedAssets = [...this.usedAssets].reduce((acc, file) => {
      acc[file[0]] = file[1];
      return acc;
    }, {});
    const unusedAssets = _pickBy(
      this.allAssets,
      (_, file) => !this.usedAssets.has(file)
    );

    const importedButNotFoundInScope = [...this.usedAssets]
      .map((item) => item[0])
      .filter((file) => !this.allAssets[file] && !/node_modules/.test(file));

    const importedNodeModules = [...this.usedAssets]
      .map((item) => item[0])
      .filter((file) => !this.allAssets[file] && /node_modules/.test(file));

    const data = {
      allAssets: this.allAssets,
      usedAssets,
      importedButNotFound: [...this.notFound],
      unusedAssets,
      importedNodeModules,
      importedButNotFoundInScope,
    };

    if (this.shouldReport) {
      this.reporting(data);
    }
    this.results = data;
  }

  reporting(data) {
    Logger(data, this.baseDir);
    WriteReportFile(data, this.output);
    ReportServer(data, this.baseDir);
  }
}

/**
 * TESTING
 */
// const argv = {
//   _: ["./example/ReactComponent.jsx"],
//   dir: "./example",
//   _: [
//     "/Users/mojtaba.izadmehr/Projects/meta-repo/ui/app/src/index.js",
//     "/Users/mojtaba.izadmehr/Projects/meta-repo/ui/app/src/eligibility.js",
//     "/Users/mojtaba.izadmehr/Projects/meta-repo/ui/app/src/ie.js",
//     "/Users/mojtaba.izadmehr/Projects/meta-repo/ui/app/src/quote.js"
//   ],
//   dir: "/Users/mojtaba.izadmehr/Projects/meta-repo/ui/app/"
//   // exclude: [""]
// };

// const response = new DeadFile(argv);
// console.log("response: ", response);

module.exports = DeadFile;

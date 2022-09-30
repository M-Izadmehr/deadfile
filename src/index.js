const UsedAssets = require("./handlers/UsedAssets");
const AllAssets = require("./handlers/AllAssets");
const Logger = require("./cli/Logger");
const _pickBy = require("lodash/pickBy");
const path = require("path");
const WriteReportFile = require("./cli/WriteReportFile");
const ReportServer = require("./reportServer/server");
const fs = require("fs");
class DeadFile {
  constructor(argv) {
    const {
      _: entry,
      dir,
      webpackConfig,
      packageJson,
      exclude = [],
      output,
      report,
    } = argv;
    this.baseDir = this.dirToAbs(dir); // if dir is not absolute find based on pwd
    this.entry = this.entryToAbs(entry, dir); // if the entry is not absolute find the absolute
    this.exclude = exclude; // excluded files/folders
    this.webpackConfig = webpackConfig; // excluded files/folders
    this.packageJson = packageJson; // excluded files/folders
    this.output = output;
    this.shouldReport = !(report == false);
    this.allAssets = AllAssets(dir, { exclude }); // Array
    this.results = null;
    this.usedAssets = null;
    this.notFound = null;

    // TODO: refactor to async/await
    new UsedAssets(
      {
        entry: this.entry,
        dir: this.baseDir,
        exclude: this.exclude,
        webpackConfig: this.webpackConfig,
        packageJson: this.packageJson,
      },
      this.setUsedAssets.bind(this)
    ).start(); // Map
  }

  dirToAbs(dir) {
    return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
  }

  entryToAbs(entry, baseDir) {
    return entry.map((file) => {
      // Case 1: if entry is absolute use it
      if (path.isAbsolute(file)) {
        return file;
      }

      // Case 2: if path is relative to baseDir, use baseDir + file
      if (
        path.isAbsolute(baseDir) &&
        fs.existsSync(path.resolve(baseDir, file))
      ) {
        return path.resolve(baseDir, file);
      }

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

    const importedButNotFoundInScope = [...(this.notFound || [])];
    let importedNodeModules = [];
    let importedNodeModulesAliases = [];
    let importedWebpackAliases = [];
    let importedBabelAliases = [];
    let importedAbsoluteImports = [];
    let importedBabelModuleAliases = [];

    [...this.usedAssets].forEach(([file, source]) => {
      // there is no need for else statement, some of the conditions can happen simultaneously
      if (!this.allAssets[file] && !/node_modules/.test(file)) {
        importedButNotFoundInScope.push(file);
      }
      if (source?.isNodeModule) {
        importedNodeModules.push(file);
      }
      if (source?.isNodeModuleAlias) {
        importedNodeModulesAliases.push(file);
      }
      if (source?.isWebpackAlias) {
        importedWebpackAliases.push(file);
      }
      if (source?.isBabelAlias) {
        importedBabelAliases.push(file);
      }
      if (source?.isAbsoluteImport) {
        importedAbsoluteImports.push(file);
      }
      if (source?.isBabelModuleAlias) {
        importedBabelModuleAliases.push(file);
      }
    });

    const data = {
      allAssets: this.allAssets,
      usedAssets,
      importedButNotFound: [...this.notFound],
      unusedAssets,
      importedNodeModules,
      importedButNotFoundInScope,
      importedNodeModulesAliases,
      importedWebpackAliases,
      importedBabelAliases,
      importedAbsoluteImports,
      importedBabelModuleAliases,
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

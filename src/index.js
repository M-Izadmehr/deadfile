const UsedAssets = require("./handlers/UsedAssets");
const AllAssets = require("./handlers/AllAssets");
const Logger = require("./cli/Logger");
const _pickBy = require("lodash/pickBy");
class DeadCode {
  constructor(argv) {
    const { _: entry, dir, exclude } = argv;
    this.entry = entry; // entry file
    this.baseDir = dir; // the entry path, used as a base route to search all files
    this.exclude = exclude; // excluded files/folders

    this.allAssets = AllAssets(dir, { exclude }); // Array
    new UsedAssets({ entry, dir }, this.setUsedAssets.bind(this)).start(); // Map
  }

  /**
   * we need to set usedAssets by a callback because, the process is async and uses callbacks
   */
  setUsedAssets(usedAssets) {
    this.usedAssets = usedAssets;

    // final object

    this.checkDiff();
  }

  checkDiff() {
    const unusedAssets = _pickBy(
      this.allAssets,
      (_, file) => !this.usedAssets.has(file)
    );

    const data = {
      allAssets: this.allAssets,
      usedAssets: this.usedAssets,
      unusedAssets
    };
    Logger(data, this.baseDir);
  }
}

/**
 * TESTING
 */
// const argv = {
//   _: ["./app/src/index.js"],
//   D: "/Users/mojtaba.izadmehr/Projects/meta-repo/ui",
//   dir: "/Users/mojtaba.izadmehr/Projects/meta-repo/ui",
//   EXCL: [""],
//   exclude: [""],
//   excl: [""],
//   $0: "deadcode"
// };
// const response = new DeadCode(argv);
// console.log("response: ", response);

module.exports = DeadCode;

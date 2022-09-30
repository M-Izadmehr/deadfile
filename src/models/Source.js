const path = require("path");

class Source {
  constructor() {
    this.importCount = 0;
    this.syncImport = 0;
    this.asyncImport = 0; // using dynamic import
    this.absoluteImportCount = 0; // using absolute import
    this.webpackAliasImportCount = 0; // using webpack alias
    this.nodeModuleAliasImportCount = 0; // using node module alias
    this.babelAliasImportCount = 0; // using babel alias
    this.absPath = null;
    this.visited = false;
    this.exists = false; // check if the file exists or not
    this.isNodeModule = false;
    this.isWebpackAlias = false;
    this.isNodeModuleAlias = false;
    this.isBabelAlias = false;
    this.extension = ""; // file extension
    this.isAbsoluteImport = false;
    this.isNodeModule = false;
  }

  /**
   * Sets the path details of source
   */
  setPath({ absPath, isNodeModule = false }) {
    if (!absPath) {
      throw new Error("absPath is required");
    }
    this.extension = path.extname(absPath);
    this.absPath = absPath;
    this.isNodeModule = isNodeModule;
  }

  /**
   * Adds import counts  and types for the asser
   */
  addImport({
    sync = true,
    isWebpackAlias = false,
    isNodeModuleAlias = false,
    isBabelAlias = false,
    isAbsoluteImport = false,
    isNodeModule = false,
  }) {
    this.isBabelModuleAlias = isBabelAlias;
    this.isNodeModule = isNodeModule;
    this.isNodeModuleAlias = isNodeModuleAlias;
    this.isWebpackAlias = isWebpackAlias;
    this.isAbsoluteImport = isAbsoluteImport;

    // counts
    this.importCount += 1;
    this.syncImport = this.syncImport + !!sync;
    this.asyncImport = this.asyncImport + !!sync;
    this.absoluteImportCount = this.absoluteImportCount + !!isAbsoluteImport;
    this.webpackAliasImportCount =
      this.webpackAliasImportCount + !!isWebpackAlias;
  }
}

module.exports = Source;

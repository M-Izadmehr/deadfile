const path = require("path");

class Source {
  constructor() {
    this.importCount = 0;
    this.syncImport = 0;
    this.asyncImport = 0; // using dynamic import
    this.absPath = null;
    this.visited = false;
    this.exists = false; // check if the file exists or not
    this.isNodeModule = false;
    this.extension = ""; // file extension
  }

  /**
   * Sets the path details of source
   */
  setPath({ absPath = "", isNodeModule = false }) {
    this.extension = path.extname(absPath);
    this.absPath = absPath;
    this.isNodeModule = isNodeModule;
  }

  /**
   * Adds import counts  and types for the asser
   */
  addImport(sync = true) {
    this.importCount += 1;
    this.syncImport = sync ? this.syncImport + 1 : this.syncImport;
    this.asyncImport = sync ? this.asyncImport : this.asyncImport + 1;
  }
}

module.exports = Source;

const fs = require("fs");
const ora = require("ora");
const { resolve } = require("./fileResolver");
const isParsable = require("../ASTPlugins/isParsable");
const {
  callExpressionHandler,
  propertyHandler,
} = require("../ASTPlugins/isRequire");

let { Parser, ParserWalk } = require("../ASTPlugins");

// Models
const Source = require("../models/Source");
const {
  ImportDeclaration,
  ImportExpression,
  ImportUsingExportKey,
  CallExpression,
  Property,
} = require("../models/Types");

class UsedAssets {
  constructor(argv, onComplete) {
    this.entry = argv.entry; // array of entry files
    this.baseDir = argv.dir; // the entry path, used as a base route to search all files
    this.exclude = argv.exclude; // excluded path
    this.webpackConfig = argv.webpackConfig; // webpackConfig path
    this.packageJson = argv.packageJson; // package.json path

    this.currentFile = ""; // the current file which is getting parsed
    this.notFound = new Set(); // list of files which could not be resolved
    this.sources = new Map(); // the list of all found sources with some data
    this.taskQueue = new Set(); // the list of files which should be read
    this.visited = new Set(); // the list of visited files
    this.onComplete = onComplete; // method called when process is finished

    this.entry.forEach((entry) => this.updateSources(entry));
    this.spinner = ora("Counting imported assets");
  }

  start() {
    this.spinner.start();
    this.parseFile();
  }

  /**
   * Find file, and parse it
   * @param {String} entry
   */
  parseFile(entry = this.entry[0]) {
    fs.readFile(entry, "utf8", (err, file) => {
      if (!err) {
        this.currentFile = entry;
        const parsed = Parser(file);

        this.spinner.text = `${this.sources.size} imported assets found. ${entry} `;

        ParserWalk.full(parsed, this.checkImports.bind(this), {
          ...ParserWalk.base,
        });
      } else if (err) {
        this.notFound.add(entry);
      }

      // after completing a file, remove the file from taskList, and check next file
      if (this.taskQueue.size > 1) {
        const next = this.getNextTask(entry);
        return next && this.parseFile(next);
      }

      const loggerMessage = `${this.sources.size} imported assets found.`;
      this.sources.size
        ? this.spinner.succeed(loggerMessage)
        : this.spinner.fail(loggerMessage);

      this.onComplete(this.sources, this.notFound);
    });
  }

  /**
   * Find the next entry in the task queue, and add the current entry to visited
   * @param {String} entry
   */
  getNextTask(entry) {
    this.taskQueue.delete(entry);
    // if the file is already visited to not try
    this.visited.add(entry);
    return this.taskQueue.values().next().value;
  }

  /**
   * Add new asset / Update list of sources
   * @param {String} relPath
   * @param {Boolean} sync
   */
  updateSources(relPath, sync = true) {
    // if relPath, does not have a value break
    if (!relPath) return;
    try {
      const {
        absPath,
        notFound,
        isWebpackAlias,
        isNodeModuleAlias,
        isBabelAlias,
        isAbsoluteImport,
        isNodeModule,
      } =
        resolve({
          relPath,
          currentFile: this.currentFile,
          baseDir: this.baseDir,
          webpackConfig: this.webpackConfig,
          packageJson: this.packageJson,
        }) || {};
      // if not found, add it to not found assets

      if (notFound) {
        this.notFound.add(notFound);
        return;
      }

      // if absPath resolved is null, break
      if (!absPath) return;

      // if this file is excluded ignore it
      const isExcluded = this.exclude.some(
        (exc) => exc && new RegExp(exc).test(absPath)
      );
      if (isExcluded) return;

      const source = this.sources.get(absPath) || new Source(this.baseDir);
      source.setPath({ absPath });
      source.addImport({
        sync,
        isWebpackAlias,
        isNodeModuleAlias,
        isBabelAlias,
        isAbsoluteImport,
        isNodeModule,
      });

      // absPath should be used as a reference, because relPath can be duplicate
      this.sources.set(source.absPath, source);
      // TODO: get include/exclude from user
      // do not add node_module libraries to taskQueue
      isParsable(source) &&
        !this.visited.has(source.absPath) &&
        this.taskQueue.add(source.absPath);
    } catch (err) {
      console.log("err: ", err);
    }
  }

  /**
   * Handle different types of import
   */
  checkImports(node) {
    switch (node.type) {
      case ImportUsingExportKey:
      case ImportExpression:
      case ImportDeclaration:
        return this.updateSources(node.value || node.source.value, true);
      case CallExpression:
        return this.updateSources(callExpressionHandler(node), true);
      case Property:
        return this.updateSources(propertyHandler(node), true);
    }
  }
}
module.exports = UsedAssets;

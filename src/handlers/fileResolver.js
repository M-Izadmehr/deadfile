const path = require("path");
const enhancedResolve = require("enhanced-resolve");
const { defaultParsableExtensions } = require("../models/Parsables");

function checkNodeModules(absPath) {
  return /node_modules/.test(absPath);
}

// by default resolve Parsable files even without .ext in import
const resolveSync = enhancedResolve.create.sync({
  extensions: defaultParsableExtensions
});

/**
 * Get `absPath` from `relPath`
 * @param {String} relPath
 * @param {String} currentFile
 */
function resolve(relPath = "", currentFile = "") {
  const currentDir = path.dirname(currentFile);

  let resolved = {};
  try {
    const absPath = resolveSync(currentDir, relPath);
    const isNodeModule = checkNodeModules(absPath);
    resolved = { absPath, isNodeModule };
  } catch (err) {
    return console.log(err.message);
  }
  return resolved;
}

module.exports = { resolve, checkNodeModules };

const path = require("path");
const enhancedResolve = require("enhanced-resolve");
const { defaultParsableExtensions } = require("../models/Parsables");

function checkNodeModules(absPath) {
  return /node_modules/.test(absPath) || absPath[0] !== "/";
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

  try {
    const absPath = resolveSync(currentDir, relPath);
    const isNodeModule = checkNodeModules(absPath);
    const resolved = { absPath, isNodeModule };

    return { resolved };
  } catch (err) {
    if (!err.missing) return;
    const notFound = checkNodeModules(relPath)
      ? relPath
      : path.resolve(currentDir, relPath);

    return { notFound };
  }
}

module.exports = { resolve, checkNodeModules };

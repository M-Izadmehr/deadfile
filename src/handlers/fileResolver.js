const path = require("path");
const enhancedResolve = require("enhanced-resolve");
const { defaultParsableExtensions } = require("../models/Parsables");
const moduleResolver = require("babel-plugin-module-resolver");
const findBabelConfig = require("find-babel-config");
function checkNodeModules(absPath) {
  return (
    /node_modules/.test(absPath) || (absPath[0] !== "/" && absPath[1] !== ":")
  );
}

function checkBabelModuleResolver(filePath, currentFile) {
  const loadedConfig = findBabelConfig.sync(currentFile);
  if (loadedConfig) {
    // find module-resolver configuration
    const moduleResolverConfig = loadedConfig.config.plugins.find(element => {
      if (Array.isArray(element)) {
        if (element[0] == "module-resolver") {
          return element;
        }
      }
    });
    const opts = moduleResolverConfig[1];
    const currentFileDirectory = path.dirname(currentFile);
    const resolved = moduleResolver.resolvePath(filePath, currentFile, opts);
    const output = path.join(currentFileDirectory, resolved);
    return output;
  }
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
  if (!relPath.match(/^(\.|\/)/)) {
    // path doesn't start with a '.' or with a '/' which should be local dependencies
    relPath = checkBabelModuleResolver(relPath, currentFile);
  }

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

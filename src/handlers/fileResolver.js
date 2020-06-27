const get = require("lodash.get");
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
  // path doesn't start with a '.' or with a '/' which should be local dependencies
  if (!filePath.match(/^(\.|\/)/)) {
    const loadedConfig = findBabelConfig.sync(currentFile);
    if (get(loadedConfig, "config.plugins")) {
      // find module-resolver configuration
      const moduleResolverConfig = loadedConfig.config.plugins.find(element => {
        if (Array.isArray(element)) {
          if (element[0] == "module-resolver") {
            return element;
          }
        }
      });
      const opts = moduleResolverConfig[1];
      // convert root to absolute path, otherwise module resolver won't work properly
      opts.root = path.join(path.dirname(loadedConfig.file), opts.root[0]);
      const currentFileDirectory = path.dirname(currentFile);
      const resolved = moduleResolver.resolvePath(filePath, currentFile, opts);
      let output = path.join(currentFileDirectory, resolved);
      if (!output.match(/\.js$/)) {
        output += ".js";
      }
      return output;
    }
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

  try {
    const absPath = resolveSync(currentDir, relPath);
    const isNodeModule = checkNodeModules(absPath);
    const resolved = { absPath, isNodeModule };

    return { resolved };
  } catch (err) {
    if (!err.missing) return;

    // Check if it's resolvable by babel-module-resolver
    const absPath = checkBabelModuleResolver(relPath, currentFile);
    if (absPath) {
      return { resolved: { absPath } };
    }
    const notFound = checkNodeModules(relPath)
      ? relPath
      : path.resolve(currentDir, relPath);

    return { notFound };
  }
}

module.exports = { resolve, checkNodeModules };

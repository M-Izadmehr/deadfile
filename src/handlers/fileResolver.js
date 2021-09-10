const path = require("path");
const enhancedResolve = require("enhanced-resolve");
const { defaultParsableExtensions } = require("../models/Parsables");
const findBabelConfig = require("find-babel-config");
function checkNodeModules(absPath) {
  return (
    /node_modules/.test(absPath) || (absPath[0] !== "/" && absPath[1] !== ":")
  );
}

function checkBabelModuleResolver(filePath, currentFile) {
  const loadedConfig = findBabelConfig.sync(currentFile);
  if (loadedConfig && loadedConfig.config && loadedConfig.config.plugins) {
    // find module-resolver configuration
    const moduleResolverConfig = loadedConfig.config.plugins.find(element => {
      if (Array.isArray(element)) {
        if (
          element[0] === "module-resolver" ||
          element[0] === "babel-plugin-module-resolver"
        ) {
          return element;
        }
      }
    });

    if (moduleResolverConfig == null) {
      return filePath;
    }

    const opts = moduleResolverConfig[1];
    const babelFileDirectory = path.dirname(loadedConfig.file);
    const rootDirectory = path.join(babelFileDirectory, opts.root[0]);
    const aliasList = Object.fromEntries(
      Object.entries(opts.alias).map(([key, value]) => [
        key,
        resolveSync(rootDirectory, value)
      ])
    );

    return aliasList[filePath] || filePath;
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

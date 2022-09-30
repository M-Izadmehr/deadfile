const resolve = require("enhanced-resolve");
const path = require("path");
const { defaultParsableExtensions } = require("../../models/Parsables");

// by default resolve Parsable files even without .ext in import
const enhancedResolve = (basePath, relPath, { webpackConfig } = {}) => {
  // const resolve = resolveSync.create.sync({
  //   extensions: defaultParsableExtensions,
  // });
  // if relPath is absolute, we can use it as basePath
  if (relPath?.[0] === "/") {
    // return resolve?.sync("./", "package.json");
    return resolve?.sync(path.dirname(relPath));
  }
  return resolve?.sync(basePath, relPath, { webpackConfig }) || null;
};

module.exports = enhancedResolve;

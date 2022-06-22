const defaultParsableExtensions = [".js", ".jsx", ".ts", ".tsx", ".vue"];
const excludedAssets = [
  // tests
  ".spec.js",
  ".test.js",
  ".js.snap",

  // package
  "package.json",
  "package-lock.json",
  "yarn.lock",

  // eslint
  "eslint.config.js",

  // babel
  "babel.config.js",

  // random
  ".html",
  ".md",
  ".yml",
  ".sh",
  ".conf",
  ".log",
  ".properties",
  ".xml",
  "browserlist",
];

module.exports = {
  defaultParsableExtensions,
  excludedAssets,
};

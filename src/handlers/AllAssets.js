const ora = require("ora");
const fs = require("fs");
const path = require("path");
const { excludedAssets } = require("../models/Parsables");

const walkSync = function (dir, fileList, exclude) {
  const name = path.basename(dir);
  // Do not search node_modules folder, or hidden paths (.git/.idea/.code)
  const isExcluded = exclude.some(
    (excl) => excl && new RegExp(excl).test(name)
  );
  if (name === "node_modules" || name[0] === "." || isExcluded) {
    return fileList;
  }
  fs.readdirSync(dir).forEach((file) => {
    const isDirectory = fs.statSync(path.join(dir, file)).isDirectory();

    fileList = isDirectory
      ? walkSync(path.join(dir, file), fileList, exclude)
      : fileList.concat(path.join(dir, file));
  });
  return fileList;
};

/**
 * Find all assets in project
 * Starts with an baseDir to search all assets,
 * @param {String} entry
 */
const AllAssets = function (entry, options) {
  const spinner = ora("Counting all assets").start();

  setTimeout(() => {}, 1000);
  const { exclude } = options;

  let fileList = walkSync(entry, [], exclude);

  fileList = fileList.map((str) => {
    return path.resolve(str);
  });

  fileList = fileList.filter(function (str) {
    //if not a javascript file
    const fileName = path.basename(str);

    // check if one library excluded assets
    const isExcludedLibrary = excludedAssets.some((ext) =>
      new RegExp(`${ext}$`).test(fileName)
    );

    if (isExcludedLibrary) {
      return false;
    }

    // check if one of user excluded assets
    const isExcludedUser = exclude.some(
      (exc) => exc && new RegExp(exc).test(fileName)
    );

    if (isExcludedUser) {
      return false;
    }

    //ignore file with no name
    const name = path.basename(str);
    if (!name) {
      return false;
    }

    // ignore hidden fileList starting with .
    if (name[0] === ".") {
      return false;
    }
    return true;
  });

  const fileMap = fileList.reduce((acc, file) => {
    acc[file] = fs.statSync(file);
    return acc;
  }, {});

  const loggerMessage = `${fileList.length} total assets found in base directory.`;
  fileList.length
    ? spinner.succeed(loggerMessage)
    : spinner.fail(loggerMessage);

  return fileMap;
};
module.exports = AllAssets;

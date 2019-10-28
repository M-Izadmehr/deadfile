const { table } = require("table");
const path = require("path");
const moment = require("moment");
const chalk = require("chalk");

function logger(data, baseDir) {
  const { unusedAssets, allAssets, usedAssets } = data;
  const tableBody = Object.keys(unusedAssets).map((file, index) => {
    const ext = path.extname(file);
    const relPath = path.relative(baseDir, file);
    const lastModifiedTime = moment(unusedAssets[file].mtime).format(
      "YY-MM-DD"
    );
    const createdTime = moment(unusedAssets[file].ctime).format("YY-MM-DD");
    return [index + 1, ext, relPath, createdTime, lastModifiedTime];
  });

  const header = ["i", ".ext", "path", "created", "last modified"];

  const config = {
    columns: {
      2: {
        width: 40,
        truncate: 100
      }
    }
  };

  const tableData = [header, ...tableBody];

  const output = table(tableData, config);
  console.log("");
  console.log("=== List of unused files ===");

  console.log(output);

  console.log(
    chalk.blue(Object.keys(allAssets).length) + " total files found!"
  );
  console.log(
    chalk.blue(tableBody.length) + chalk.red(" dead ") + "files found!"
  );
  console.log(
    chalk.blue(usedAssets.size) + chalk.green(" imported ") + "files found!"
  );
}

module.exports = logger;

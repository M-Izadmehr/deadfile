const fs = require("fs");

function WriteReportFile(data, output) {
  if (!output) return;

  fs.writeFileSync(output, JSON.stringify(data));
}

module.exports = WriteReportFile;

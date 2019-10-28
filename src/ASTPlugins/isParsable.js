const { defaultParsableExtensions } = require("../models/Parsables");
/**
 * Checks if a file should be parsed or not
* I should come up with an order of options
* @param {Source} Source type
* @param {
    isNodeModule,
    extensionInc,
    extensionExc,
    dirInc,
    dirExc
} options
*/
function isParsable(source) {
  // TODO: handle logic for options parameters
  // TODO: be able to override node_modules
  const isCorrectFormat = defaultParsableExtensions.some(
    ext => ext === source.extension
  );
  return isCorrectFormat && !source.isNodeModule;
}

module.exports = isParsable;

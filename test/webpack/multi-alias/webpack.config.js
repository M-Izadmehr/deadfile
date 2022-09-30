const path = require("path");

module.exports = {
  resolve: {
    alias: {
      webpackAlias: path.resolve(
        "./test/webpack/multi-alias/src/utils/aliasedImport.js"
      ),
      missingWebpackAlias: path.resolve(
        "./test/webpack/multi-alias/src/utils/missingWebpackAlias.js"
      ),
      underscore: "lodash",
    },
  },
};

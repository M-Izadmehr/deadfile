const { ImportUsingExportKey } = require("../models/Types");

function inject(injectableWalk) {
  return Object.assign({}, injectableWalk, {
    base: Object.assign({}, injectableWalk.base, {
      [ImportUsingExportKey]() {}
    })
  });
}

module.exports = inject;
